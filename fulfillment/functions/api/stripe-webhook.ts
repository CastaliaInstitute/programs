/**
 * Cloudflare Pages Function: POST /api/stripe-webhook
 *
 * Receives Stripe payment-success webhooks for self-serve course purchases and provisions the
 * buyer's GitHub repo (inqspace + Dialogic/BEATRICE/SAMWISE enabled).
 *
 * Deploy: this file sits at functions/api/stripe-webhook.ts in the Cloudflare Pages project for
 * courses.castalia.institute. Secrets below are Pages environment secrets, never committed.
 */
import { resolveCourse } from '../../lib/course-catalog'
import { provisionCourseRepo, type GitHubAppEnv } from '../../lib/github-provision'
import { launchInqspace, type InqspaceEnv } from '../../lib/inqspace'

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
  const sku: string | undefined = session.metadata?.sku ?? session.client_reference_id
  // GitHub handle collected as a Stripe Checkout custom field.
  const buyerHandle: string | undefined = session.metadata?.github_handle
  const buyerEmail: string | undefined = session.customer_details?.email

  const course = sku ? resolveCourse(sku) : null
  if (!course || !buyerHandle) {
    // Record for manual follow-up rather than dropping the sale.
    await env.FULFILLMENT.put(
      `unresolved:${event.id}`,
      JSON.stringify({ sku, buyerHandle, buyerEmail }),
    )
    return new Response('unresolved purchase recorded', { status: 202 })
  }

  const now = Math.floor(Date.parse(request.headers.get('date') ?? '') / 1000) || 0
  const provisioned = await provisionCourseRepo(course, buyerHandle, env, now)
  const inqspace = await launchInqspace(provisioned.repoFullName, env)

  // Record the entitlement for MagAI credit administration at magisterium.
  await env.FULFILLMENT.put(
    `entitlement:${course.code}:${buyerHandle}`,
    JSON.stringify({
      course: course.code,
      buyerHandle,
      buyerEmail,
      repo: provisioned.repoFullName,
      inqspace: inqspace.launchUrl,
      purchasedEvent: event.id,
    }),
  )
  await env.FULFILLMENT.put(`evt:${event.id}`, '1', { expirationTtl: 60 * 60 * 24 * 30 })

  return Response.json({
    ok: true,
    repo: provisioned.repoUrl,
    inqspace: inqspace.launchUrl,
    inqspaceProvisioned: inqspace.provisioned,
  })
}
