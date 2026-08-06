# fulfillment/ — course purchase → repo provisioning

Cloudflare Pages Functions backend for `courses.castalia.institute`. On a completed Stripe
checkout it creates the buyer's GitHub repo from a course template with **inqspace** and the
**Dialogic / BEATRICE / SAMWISE** stack enabled. Full design: [`../COURSE-PURCHASE-FULFILLMENT.md`](../COURSE-PURCHASE-FULFILLMENT.md).

This is a **scaffold**: the flow is complete and correct except two integrations that are
stubbed and marked `TODO` — inqspace provisioning (prototype not yet located) and the MagAI
credit grant (magisterium surface not built). Everything compiles around those seams.

## Layout

```
functions/api/stripe-webhook.ts   Pages Function — verify Stripe sig, provision, record entitlement
lib/course-catalog.ts             SKU → template repo + enabled features (source of truth)
lib/github-provision.ts           GitHub App: repo-from-template + collaborator + feature manifest
lib/inqspace.ts                   the ONLY inqspace-specific code (stubbed pending prototype)
```

## Secrets (Cloudflare Pages environment — never commit)

| Name | Purpose |
| --- | --- |
| `STRIPE_WEBHOOK_SECRET` | Verify webhook signatures |
| `GITHUB_APP_ID`, `GITHUB_APP_PRIVATE_KEY`, `GITHUB_APP_INSTALLATION_ID` | Provision repos as the Castalia GitHub App |
| `GITHUB_COURSE_ORG` | Org buyer repos are created under (**`CastaliaInstitute`** — see NOMENCLATURE.md) |
| `INQSPACE_API_BASE`, `INQSPACE_API_TOKEN` | inqspace provisioning (optional until wired) |
| `FULFILLMENT` (KV binding) | Webhook idempotency + entitlement records |

## Stripe Checkout expectations

The Checkout Session must carry, in `metadata`: `sku` (course code, e.g. `AINS6001`) and
`github_handle` (buyer's GitHub username, collected as a custom field). Email comes from
`customer_details.email`.

## Before this goes live

See [Open items](../COURSE-PURCHASE-FULFILLMENT.md#open-items): wire inqspace, confirm the buyer
org + repo naming, build the per-course template repo, and define the MagAI credit grant.
