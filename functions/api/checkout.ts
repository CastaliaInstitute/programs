/**
 * Cloudflare Pages Function: POST /api/checkout
 *
 * Creates the Stripe Checkout Session for a course purchase, pricing it server-side so the
 * amount can't be forged. Castalia **members pay $0** in the direct (MagAI) context — a $0
 * session that runs the exact same completion → provisioning flow. Non-members pay the list
 * price; institutional pricing is contractual (handled out of band / via a set price).
 *
 * Body: { sku, github_login, purchase_type, target_org? }. github_login and (for institutional)
 * target_org come from the verified GitHub connect flow, not free text.
 */
import { resolveProfile } from '../../fulfillment/lib/provisioning-profiles'
import { isCastaliaMember, type MembershipEnv } from '../../fulfillment/lib/membership'

interface Env extends MembershipEnv {
  STRIPE_SECRET_KEY: string
  CHECKOUT_SUCCESS_URL: string
  CHECKOUT_CANCEL_URL: string
}

/** Encode nested params in Stripe's bracket form for application/x-www-form-urlencoded. */
function stripeForm(obj: Record<string, string | number>): string {
  const p = new URLSearchParams()
  for (const [k, v] of Object.entries(obj)) p.append(k, String(v))
  return p.toString()
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const body = (await request.json()) as {
    sku?: string
    skus?: string[] // multiple courses in one purchase (e.g. Aurnova Q1 = 3)
    github_login?: string
    purchase_type?: string
    target_org?: string
  }
  const codes = body.skus ?? (body.sku ? [body.sku] : [])
  const courses = codes.map((c) => resolveProfile(c)).filter(Boolean)
  if (courses.length === 0 || !body.github_login) return new Response('missing sku(s) or github_login', { status: 400 })

  const purchaseType = body.purchase_type ?? 'individual'
  // Direct members pay $0; everyone else pays list price. (Institutional list = contract price.)
  const member = purchaseType !== 'institutional' && (await isCastaliaMember(body.github_login, env))

  // One Stripe line item per course.
  const lineItems: Record<string, string | number> = {}
  courses.forEach((c, i) => {
    const amount = member ? 0 : c.listPriceCents
    lineItems[`line_items[${i}][quantity]`] = 1
    lineItems[`line_items[${i}][price_data][currency]`] = 'usd'
    lineItems[`line_items[${i}][price_data][unit_amount]`] = amount // 0 = member-free → no_payment_required
    lineItems[`line_items[${i}][price_data][product_data][name]`] = `${c.code} — ${c.title}`
  })

  const form = stripeForm({
    mode: 'payment',
    success_url: env.CHECKOUT_SUCCESS_URL,
    cancel_url: env.CHECKOUT_CANCEL_URL,
    ...lineItems,
    'metadata[skus]': courses.map((c) => c.code).join(','),
    'metadata[github_login]': body.github_login,
    'metadata[purchase_type]': purchaseType,
    ...(body.target_org ? { 'metadata[target_org]': body.target_org } : {}),
  })

  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: form,
  })
  if (!res.ok) return new Response(`stripe error: ${await res.text()}`, { status: 502 })

  const session = (await res.json()) as { url: string }
  return Response.json({ url: session.url, free: member, courses: courses.map((c) => c.code) })
}
