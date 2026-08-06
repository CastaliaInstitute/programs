#!/usr/bin/env node
/**
 * Create the Aurnova Q1 invoice via the Stripe API. Institutional license payment for the
 * first-quarter courses — decoupled from the course platform. Run locally where STRIPE_SECRET_KEY
 * lives. Creates a DRAFT by default (review before it goes out); --send finalizes + emails it.
 *
 * Usage:
 *   STRIPE_SECRET_KEY=sk_... node automation/invoice-aurnova-q1.mjs \
 *     --email billing@aurnova.example --name "Aurnova University" --per-course 150000 [--po PO123] [--net 30] [--dry-run] [--send]
 *
 * Pricing: --per-course <cents> (applied to each Q1 course) OR --total <cents> (one line).
 * There is NO default price — the script refuses to run without one, so a wrong amount can't be
 * sent by accident.
 */
const A = Object.fromEntries(
  process.argv.slice(2).flatMap((a, i, arr) => {
    if (!a.startsWith('--')) return []
    const k = a.slice(2)
    const v = arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : 'true'
    return [[k, v]]
  }),
)
const DRY = 'dry-run' in A
const SEND = 'send' in A

const Q1 = [
  { code: 'AIN6007', name: 'Applied AI Programming with Python' },
  { code: 'AIN6001', name: 'Foundations of Artificial Intelligence' },
  { code: 'AIN6005', name: 'AI Ethics, Law & Policy' },
]

function die(m) { console.error('✗', m); process.exit(1) }
if (!DRY && !process.env.STRIPE_SECRET_KEY) die('set STRIPE_SECRET_KEY')
if (!A.email) die('need --email <aurnova billing email>')
const perCourse = A['per-course'] ? parseInt(A['per-course'], 10) : null
const total = A.total ? parseInt(A.total, 10) : null
if (!perCourse && !total) die('need --per-course <cents> or --total <cents> (no default price)')

const form = (o) => new URLSearchParams(o).toString()
async function stripe(path, body) {
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: 'POST',
    headers: { authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`, 'content-type': 'application/x-www-form-urlencoded' },
    body: body ? form(body) : undefined,
  })
  const j = await res.json()
  if (!res.ok) die(`stripe ${path}: ${res.status} ${j.error?.message ?? JSON.stringify(j)}`)
  return j
}
async function stripeGet(path) {
  const res = await fetch(`https://api.stripe.com/v1/${path}`, { headers: { authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` } })
  return res.json()
}

const lines = perCourse
  ? Q1.map((c) => ({ desc: `Aurnova MSAI Q1 — ${c.code} ${c.name}`, amount: perCourse }))
  : [{ desc: `Aurnova MSAI Q1 — Term 1 license (${Q1.map((c) => c.code).join(', ')})`, amount: total }]
const grand = lines.reduce((s, l) => s + l.amount, 0)

console.log(`Aurnova Q1 invoice ${DRY ? '(dry-run)' : ''}`)
lines.forEach((l) => console.log(`  • ${l.desc}: $${(l.amount / 100).toFixed(2)}`))
console.log(`  Total: $${(grand / 100).toFixed(2)} · net-${A.net ?? 30}${A.po ? ` · PO ${A.po}` : ''} · ${A.email}`)
if (DRY) { console.log('dry-run: nothing created.'); process.exit(0) }

// Idempotent-ish: reuse an existing customer with this email.
const found = await stripeGet(`customers?email=${encodeURIComponent(A.email)}&limit=1`)
const customer = found.data?.[0] ?? (await stripe('customers', { email: A.email, name: A.name ?? 'Aurnova University' }))
console.log('customer:', customer.id)

for (const l of lines) {
  await stripe('invoiceitems', { customer: customer.id, amount: String(l.amount), currency: 'usd', description: l.desc })
}
const inv = await stripe('invoices', {
  customer: customer.id,
  collection_method: 'send_invoice',
  days_until_due: String(A.net ?? 30),
  description: 'Castalia Institute — Aurnova MSAI, first quarter (Term 1) course license',
  ...(A.po ? { 'metadata[po_number]': A.po } : {}),
})
console.log('draft invoice:', inv.id, inv.hosted_invoice_url ?? '')

if (SEND) {
  const sent = await stripe(`invoices/${inv.id}/send`)
  console.log('SENT →', sent.hosted_invoice_url ?? sent.id)
} else {
  console.log('Draft created (not sent). Review in Stripe, then re-run with --send or send from the dashboard.')
}
