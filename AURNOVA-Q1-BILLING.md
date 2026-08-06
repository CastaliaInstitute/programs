# Aurnova — Q1 billing

**Goal: Aurnova can pay Castalia for their first-quarter courses.** This is a billing transaction,
deliberately decoupled from the course platform (provisioning, credentialing, inqspace, etc.) —
none of that is needed to invoice and get paid.

## What Q1 is

Aurnova MSAI, full-time Term 1 (see `AURNOVA-MSAI-PROGRAM-MAP.md`) — 3 courses, 9 credits:

| Aurnova code | Course |
| --- | --- |
| AINS6007 / AIN6007 | Applied AI Programming with Python |
| AINS6001 / AIN6001 | Foundations of Artificial Intelligence |
| AINS6005 / AIN6005 | AI Ethics, Law & Policy |

## Mechanism — Stripe Invoice

For an institutional license payment, a **Stripe Invoice** fits better than a card Checkout:
emailed to Aurnova, payable by **ACH / wire / card**, supports **net terms** and a **PO number**.
`automation/invoice-aurnova-q1.mjs` creates it via the Stripe API.

It creates a **draft** by default (a human reviews before it goes out); `--send` finalizes and
emails it. Run it locally where your Stripe key lives:

```
STRIPE_SECRET_KEY=sk_... node automation/invoice-aurnova-q1.mjs \
  --email billing@aurnova.example --per-course 150000 --dry-run   # preview
# drop --dry-run to create the draft; add --send to email it
```

## To confirm before sending (business inputs, not code)

1. **Price** — what Aurnova pays Castalia per course (the license/wholesale price). The $1,500
   figure elsewhere is *student tuition*, not necessarily the institutional rate. `--per-course`
   (or `--total`) sets it; there is no default, so a wrong amount can't be sent by accident.
2. **Billing entity + contact** — Aurnova's billing email and legal entity name (`--email`, `--name`).
3. **Terms** — net-30 by default (`--net`), and any PO number to reference (`--po`).
4. **Count** — 3 courses assumed (Term 1). One combined line or per-course lines: `--line-mode`.
