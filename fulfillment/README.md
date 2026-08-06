# fulfillment/ — course purchase → repo provisioning (shared library)

Shared provisioning library behind the purchase-fulfillment API. The Cloudflare Pages **Functions**
live at the repo root in [`../functions/`](../functions/) (Cloudflare requires that name/location);
they import the logic here. On a completed Stripe checkout the API creates the buyer's GitHub repo
from a course template with **inqspace** and the **Dialogic / BEATRICE / SAMWISE** stack enabled.
Full design: [`../COURSE-PURCHASE-FULFILLMENT.md`](../COURSE-PURCHASE-FULFILLMENT.md).

Both individual (self-serve) and **institutional** purchases route through the same API; an
institutional purchase (e.g. Aurnova) provisions into the **institution's own GitHub org**.

This is a **scaffold**: the flow is complete and correct except integrations stubbed and marked
`TODO` — inqspace provisioning (prototype not yet located), the MagAI credit grant, and OAuth
`state` validation. Everything compiles around those seams.

## Layout

```
../functions/api/stripe-webhook.ts    Pages Function — verify Stripe sig, provision, record entitlement
../functions/api/github/connect.ts    Pages Function — start GitHub "connect" (onboarding + pre-purchase)
../functions/api/github/callback.ts   Pages Function — finish OAuth, store identity + orgs
lib/course-catalog.ts                 SKU → template repo + enabled features (source of truth)
lib/github-provision.ts               GitHub App: per-org install lookup, repo-from-template, feature manifest
lib/github-oauth.ts                   GitHub connect (authorize URL, code exchange, identify + orgs)
lib/inqspace.ts                       the ONLY inqspace-specific code (stubbed pending prototype)
```

## Secrets (Cloudflare Pages environment — never commit)

| Name | Purpose |
| --- | --- |
| `STRIPE_WEBHOOK_SECRET` | Verify webhook signatures |
| `GITHUB_APP_ID`, `GITHUB_APP_PRIVATE_KEY` | Provision repos as the Castalia GitHub App (installation resolved per org) |
| `GITHUB_STUDENTS_ORG` | Default org for individual buyer repos (**`CastaliaInstitute`**) |
| `GITHUB_APP_CLIENT_ID`, `GITHUB_APP_CLIENT_SECRET`, `GITHUB_OAUTH_REDIRECT_URI` | GitHub connect (OAuth) |
| `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` | Provisioning + connection records (direct-context MagAI entitlements read by magisterium; institutional records are audit-only) |
| `INQSPACE_API_BASE`, `INQSPACE_API_TOKEN` | inqspace provisioning (optional until wired) |
| `FULFILLMENT` (KV binding) | Webhook idempotency + OAuth state |

## Stripe Checkout expectations

The Checkout Session carries, in `metadata`: `sku` (course code, e.g. `AINS6001`), `github_login`
(from the pre-purchase connect flow — not free text), `purchase_type` (`individual` |
`institutional`), and for institutional, `target_org` (the buyer's GitHub org). Email comes from
`customer_details.email`.

## Institutional prerequisite

For an institutional purchase to provision into the buyer's org, that institution must have
**installed the Castalia GitHub App on their org** — the provisioner resolves the installation by
org name and fails clearly if it is absent. This is part of institutional onboarding.

## Before this goes live

See [Open items](../COURSE-PURCHASE-FULFILLMENT.md#open-items).
