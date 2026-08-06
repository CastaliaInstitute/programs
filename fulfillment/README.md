# fulfillment/ — enroll, provision, capture evidence (shared library)

Shared logic behind the course-platform API. The Cloudflare Pages **Functions** live at the repo
root in [`../functions/`](../functions/) (Cloudflare requires that name/location) and import from
here. The platform **enrolls** learners, **provisions** a working environment for courses that
need one (GitHub repo + inqspace + Dialogic/BEATRICE/SAMWISE), and on completion **captures
evidence into magisterium**. It does not own the course catalog or issue credentials — those are
magisterium's. Full design: [`../COURSE-PLATFORM.md`](../COURSE-PLATFORM.md).

Both individual (direct) and **institutional** enrollments route through the same API; an
institutional purchase (e.g. Aurnova) provisions into the **institution's own GitHub org**.

This is a **scaffold**: complete and correct except stubs flagged `TODO` — inqspace provisioning,
evidence tamper-evidence hardening, and the shared-Supabase assumption. Everything compiles.

## Layout

```
../functions/api/checkout.ts          Pages Function — create Stripe session; members $0, priced server-side
../functions/api/stripe-webhook.ts    Pages Function — verify sig, ENROLL + provision environment
../functions/api/completion.ts        Pages Function — capture evidence → magisterium (artifact + completion)
../functions/api/github/connect.ts    Pages Function — start GitHub "connect" (onboarding + pre-enroll)
../functions/api/github/callback.ts   Pages Function — finish OAuth / org install, store identity/org
lib/provisioning-profiles.ts          magisterium course code → delivery + template + features (NOT a catalog)
lib/magisterium.ts                    write artifacts + course_completions into magisterium's schema
lib/membership.ts                     Castalia membership check (members → $0)
lib/github-provision.ts               GitHub App: per-org install lookup, repo-from-template, feature manifest
lib/github-oauth.ts                   GitHub connect (authorize/install URL, code exchange, identify + orgs)
lib/inqspace.ts                       the ONLY inqspace-specific code (stubbed pending prototype)
```

## Secrets (Cloudflare Pages environment — never commit)

| Name | Purpose |
| --- | --- |
| `STRIPE_SECRET_KEY` | Create Checkout Sessions (`/api/checkout`) |
| `STRIPE_WEBHOOK_SECRET` | Verify webhook signatures |
| `CHECKOUT_SUCCESS_URL`, `CHECKOUT_CANCEL_URL` | Stripe Checkout redirect targets |
| `GITHUB_APP_ID`, `GITHUB_APP_PRIVATE_KEY` | Provision repos as the Castalia GitHub App (installation resolved per org) |
| `GITHUB_STUDENTS_ORG` | Default org for individual learner repos (**`CastaliaInstitute`**) |
| `GITHUB_APP_CLIENT_ID`, `GITHUB_APP_CLIENT_SECRET`, `GITHUB_APP_SLUG`, `GITHUB_OAUTH_REDIRECT_URI` | GitHub connect (OAuth + org install) |
| `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` | magisterium schema (artifacts, completions) + platform tables (members, connections, enrollments) |
| `COMPLETION_SIGNAL_SECRET` | Authorize `/api/completion` evidence signals |
| `INQSPACE_API_BASE`, `INQSPACE_API_TOKEN` | inqspace provisioning (optional until wired) |
| `FULFILLMENT` (KV binding) | Webhook idempotency + OAuth state |

## Metadata expectations

- **Checkout/webhook** metadata: `sku` (**magisterium** course code, e.g. `AI-103`),
  `github_login` (from the connect flow — not free text), `purchase_type` (`individual` |
  `institutional`), and for institutional, `target_org` (the verified GitHub org).
- **Completion** body: `course_code`, `github_login`, `repo_url`, `commit_sha`, optional
  `evidence_digest`, `grade`.

## Institutional prerequisite

For an institutional purchase to provision into the buyer's org, that institution must have
**installed the Castalia GitHub App on their org** — the provisioner resolves the installation by
org name and fails clearly if it is absent. This is part of institutional onboarding.

## Before this goes live

See [Open items](../COURSE-PLATFORM.md#open-items).
