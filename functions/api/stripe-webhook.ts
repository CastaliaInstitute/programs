/**
 * Cloudflare Pages Function: POST /api/stripe-webhook
 *
 * Receives Stripe payment-success webhooks for self-serve course purchases and provisions the
 * buyer's GitHub repo (inqspace + Dialogic/BEATRICE/SAMWISE enabled).
 *
 * Deploy: this file sits at functions/api/stripe-webhook.ts in the Cloudflare Pages project for
 * courses.castalia.institute. Secrets below are Pages environment secrets, never committed.
 */
import { resolveProfile, needsProvisioning } from '../../fulfillment/lib/provisioning-profiles'
import { provisionCourseRepo, type GitHubAppEnv } from '../../fulfillment/lib/github-provision'
import { launchInqspace, type InqspaceEnv } from '../../fulfillment/lib/inqspace'

type Env = GitHubAppEnv &
  InqspaceEnv & {
    STRIPE_WEBHOOK_SECRET: string
    /** KV namespace for webhook idempotency + entitlement records. */
    FULFILLMENT: KVNamespace
  }

/** Verify a Stripe webhook signature using Web Crypto (Workers-compatible). */
async function verifyStripeSignature(
  payload: string,
  sigHeader: string | null,
  secret: string,
): Promise<boolean> {
  if (!sigHeader) return false
  const parts = Object.fromEntries(sigHeader.split(',').map((kv) => kv.split('=')))
  const timestamp = parts['t']
  const expected = parts['v1']
  if (!timestamp || !expected) return false

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${timestamp}.${payload}`))
  const hex = [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, '0')).join('')
  // Constant-time-ish compare.
  if (hex.length !== expected.length) return false
  let diff = 0
  for (let i = 0; i < hex.length; i++) diff |= hex.charCodeAt(i) ^ expected.charCodeAt(i)
  return diff === 0
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context
  const payload = await request.text()

  if (!(await verifyStripeSignature(payload, request.headers.get('stripe-signature'), env.STRIPE_WEBHOOK_SECRET))) {
    return new Response('invalid signature', { status: 400 })
  }

  const event = JSON.parse(payload) as {
    id: string
    type: string
    data: { object: Record<string, any> }
  }

  // Only act on completed checkouts.
  if (event.type !== 'checkout.session.completed') {
    return new Response('ignored', { status: 200 })
  }

  // Idempotency: Stripe retries. One repo per event.
  const seen = await env.FULFILLMENT.get(`evt:${event.id}`)
  if (seen) return new Response('already processed', { status: 200 })

  const session = event.data.object
  // One purchase can carry MULTIPLE courses (e.g. Aurnova Q1 = 3). `skus` is a comma-separated
  // list; single `sku`/client_reference_id still works.
  const skuList = (session.metadata?.skus ?? session.metadata?.sku ?? session.client_reference_id ?? '')
    .split(',').map((s) => s.trim()).filter(Boolean)
  // Buyer's GitHub login comes from the pre-purchase "connect" flow (see lib/github-oauth.ts),
  // carried into the Stripe session metadata — not a free-text field.
  const buyerLogin: string | undefined = session.metadata?.github_login
  const buyerEmail: string | undefined = session.customer_details?.email
  // Individual (default) vs institutional. Institutional carries the buyer's own org.
  const purchaseType: string = session.metadata?.purchase_type ?? 'individual'
  const institutionalOrg: string | undefined = session.metadata?.target_org

  // Purchase = ENROLLMENT: grants access and provisions a working environment per course. It is
  // NOT a credential — completion/evidence/credentialing are magisterium's (via /api/completion).
  const profiles = skuList.map((s) => resolveProfile(s)).filter(Boolean)
  const orgMissing = purchaseType === 'institutional' && !institutionalOrg
  // Institutional buys are identified by the org (from the App install); individual by the login.
  const identity = buyerLogin ?? (purchaseType === 'institutional' ? institutionalOrg : undefined)
  if (profiles.length === 0 || !identity || orgMissing) {
    await env.FULFILLMENT.put(
      `unresolved:${event.id}`,
      JSON.stringify({ skus: skuList, buyerLogin, buyerEmail, purchaseType, institutionalOrg }),
    )
    return new Response('unresolved enrollment recorded', { status: 202 })
  }

  // Individual → repos in CastaliaInstitute with the buyer as collaborator.
  // Institutional (e.g. Aurnova) → repos in the institution's own org; admins manage cohort access.
  const target =
    purchaseType === 'institutional'
      ? { org: institutionalOrg as string }
      : { org: env.GITHUB_STUDENTS_ORG, collaborator: buyerLogin }
  const now = Math.floor(Date.parse(request.headers.get('date') ?? '') / 1000) || 0

  const results = []
  for (const profile of profiles) {
    let repoUrl, inqspaceUrl
    if (needsProvisioning(profile)) {
      const provisioned = await provisionCourseRepo(profile, target, env, now)
      repoUrl = provisioned.repoUrl
      inqspaceUrl = (await launchInqspace(provisioned.repoFullName, env)).launchUrl
    }
    await env.FULFILLMENT.put(
      `enrollment:${profile.code}:${identity}`,
      JSON.stringify({ course: profile.code, buyerLogin, buyerEmail, purchaseType, org: target.org, repo: repoUrl, inqspace: inqspaceUrl, enrolledEvent: event.id }),
    )
    results.push({ course: profile.code, repo: repoUrl, inqspace: inqspaceUrl })
  }
  await env.FULFILLMENT.put(`evt:${event.id}`, '1', { expirationTtl: 60 * 60 * 24 * 30 })

  return Response.json({ ok: true, org: target.org, enrolled: results })
}
