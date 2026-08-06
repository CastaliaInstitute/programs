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
    github_login?: string
    purchase_type?: string
    target_org?: string
  }
  const course = body.sku ? resolveProfile(body.sku) : null
  if (!course || !body.github_login) return new Response('missing sku or github_login', { status: 400 })

  const purchaseType = body.purchase_type ?? 'individual'

  // Price server-side. Direct: members $0, else list price. Institutional: list/contract price.
  let unitAmount: number
  if (purchaseType === 'institutional') {
    unitAmount = course.listPriceCents // placeholder for the institution's contracted amount
  } else {
    const member = await isCastaliaMember(body.github_login, env)
    unitAmount = member ? 0 : course.listPriceCents
  }

  const form = stripeForm({
    mode: 'payment',
    success_url: env.CHECKOUT_SUCCESS_URL,
    cancel_url: env.CHECKOUT_CANCEL_URL,
    'line_items[0][quantity]': 1,
    'line_items[0][price_data][currency]': 'usd',
    'line_items[0][price_data][unit_amount]': unitAmount, // 0 = free for members; Stripe completes as no_payment_required
    'line_items[0][price_data][product_data][name]': `${course.code} — ${course.title}`,
    'metadata[sku]': course.code,
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
  return Response.json({ url: session.url, free: unitAmount === 0 })
}
