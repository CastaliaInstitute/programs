# Course purchase → repo provisioning (design)

How a buyer purchases a Castalia course and automatically receives a ready-to-work GitHub
repository, with **inqspace** (our Codespaces equivalent) and the **Dialogic**, **BEATRICE**,
and **SAMWISE** teaching stack enabled. Covers **both** purchase types (see NOMENCLATURE.md for the MagAI vs MSAI split):

- **Individual (self-serve → Castalia MagAI):** repo under `CastaliaInstitute`, buyer added as
  collaborator; AI faculty (BEATRICE/Dialogic/SAMWISE).
- **Institutional (e.g. Aurnova → their MSAI):** repo created in the **institution's own GitHub
  org**; the institution brings its own human faculty and students.

Status: **design + scaffold.** The Pages Functions live in [`functions/`](functions/) (repo root)
and import shared logic from [`fulfillment/lib/`](fulfillment/lib/). Integrations stubbed pending
inputs — see [Open items](#open-items).

## Subdomains

| Subdomain | Role | Hosting |
| --- | --- | --- |
| `programs.castalia.institute` | Institution-facing catalog **+ the fulfillment API** | **Cloudflare Pages** (migrated from GitHub Pages) |
| `courses.castalia.institute` | Self-serve single-course storefront | Cloudflare Pages (calls the same API) |
| `magisterium.castalia.institute` | MagAI credit administration | Repo exists (`CastaliaInstitute/magisterium`, Astro — artifact-based credentialing) |

Names follow [`NOMENCLATURE.md`](NOMENCLATURE.md) — **MagAI** is the credential, **Magisterium**
is the system that administers it.

## GitHub connect (before purchase, and in onboarding)

Buyers **connect GitHub** (`/api/github/connect` → `/api/github/callback`) during onboarding
**and** again before purchase, so checkout always carries a *verified* GitHub target rather than
a typed-in name. Two modes:

- **Individual** (`type=individual`): user OAuth authorizes the buyer's personal account; the
  callback records the login + orgs and carries `github_login` to checkout.
- **Institutional** (`type=institutional`): **connecting requires connecting a GitHub
  Organization** — the admin installs the Castalia App on their org. The callback resolves the
  org from the installation (`installation_id`) and records it. Provisioning targets *that*
  verified org, and the required App installation is established as a side effect. No org
  installation → no institutional purchase.

## Programs → Cloudflare Pages

The institutional site must run the fulfillment backend, so `programs` moves from GitHub Pages
to **Cloudflare Pages**: the Astro site still builds to `web/dist`, and the repo-root
`functions/` directory provides the API in the same deployment. `wrangler.toml` and
`.github/workflows/cloudflare-pages.yml` are added; the old `pages.yml` is demoted to manual and
removed after cutover. One backend serves both individual and institutional purchases (Stripe
posts to a single webhook).

## Pricing

Per-course self-serve price: **$1,500**, matching Aurnova's per-course tuition ($18,000 ÷ 12
courses) and the existing AIMA5001 Simple Stripe price. Set per SKU via Stripe; the $1,000
Aurnova admin fee is a program-level charge and does not apply to self-serve single courses.

## Why Cloudflare Pages

GitHub Pages is static and cannot create repos on a purchase event. Cloudflare Pages serves the
static course catalog **and** runs [Pages Functions](https://developers.cloudflare.com/pages/functions/)
— serverless handlers — so the Stripe webhook and GitHub provisioning run in the same deployment.
No separate server to operate.

## Flow

```
Buyer connects GitHub  (/api/github/connect → callback)  — onboarding + before purchase
  │  verified login + orgs stored (Supabase); login carried to checkout
  ▼
Stripe Checkout  (metadata: sku, github_login, purchase_type, target_org for institutional)
  │  payment succeeds
  ▼
POST /api/stripe-webhook   (Cloudflare Pages Function on programs.castalia.institute)
  │  1. verify Stripe signature (Web Crypto)
  │  2. idempotency check (Stripe retries) — KV keyed on event.id
  │  3. resolve SKU → course template + enabled features
  │  4. authenticate as the Castalia GitHub App; resolve installation for the TARGET ORG
  │       individual → CastaliaInstitute   |   institutional → the buyer's own org
  │  5. create repo from the course template (generate) in the target org
  │  6. individual: add buyer as collaborator · both: write castalia-course.json flags
  │  7. record entitlement (Supabase) for MagAI credit at magisterium
  ▼
Success: links to the new repo + inqspace launch
  ▼
(later) course completion evidence → MagAI credit administered at magisterium
```

## Enabling the teaching stack in the created repo

Dialogic, BEATRICE, and SAMWISE already exist as AIMA product lines
(`web/demo-sources/ain2001/{dialogic,beatrice,samwise}.md` and the built cartridges). "Enable"
means the course **template repo** carries these layers and the provisioner turns them on via a
single manifest committed into the buyer's repo:

```jsonc
// castalia-course.json  (written into every provisioned repo)
{
  "course": "AINS6001",
  "features": {
    "inqspace":  true,   // replaces GitHub Codespaces as the cloud workspace
    "dialogic":  true,   // co-teaching SCRIPT lectures (AI lecturer answers on-slide)
    "beatrice":  true,   // AI teaching assistant (instructor notes, escalation, Q&A)
    "samwise":   true    // curriculum server / authoring + autograding tooling
  }
}
```

Downstream tooling (the course template's workflows and BEATRICE/SAMWISE config) reads this
manifest, so provisioning stays declarative: the Function sets flags, it does not special-case
each product.

## inqspace instead of Codespaces

The current student template ships a `.devcontainer/devcontainer.json` aimed at GitHub
Codespaces (`web/scripts/aima-codespace-repo/`). Under this design the course template instead
ships an **inqspace** launch config, and the provisioner calls `launchInqspace()` in
`fulfillment/lib/inqspace.ts`. That function is the **only** place inqspace specifics live, so
when the prototype's provisioning API is located it is a one-file wire-up. Until then it emits
the repo's inqspace config and a launch URL placeholder; Codespaces is removed from the buyer
path per the "inqspace rather than codespace" decision.

## Data store — Supabase

Entitlement and credit records (who bought/completed what) go in **Supabase** (Postgres),
already part of the Castalia stack. Preferred over Cloudflare KV here because the records are
relational and are **read by magisterium** to administer MagAI credit — a shared Postgres table
is the natural hand-off, and Supabase Row Level Security scopes buyer access. KV is still fine
for the pure webhook-idempotency key (`evt:<id>`), which is ephemeral; the scaffold uses a KV
binding for that and can move to a Supabase `processed_events` table if a single store is
preferred.

Suggested tables: `entitlements` (buyer, course, repo, inqspace_url, stripe_event) and
`credits` (buyer, course, status) that magisterium owns.

## Security

- **Secrets** (Stripe webhook secret, GitHub App key, Supabase service key) are Cloudflare
  Pages **environment secrets** — never in the repo, never shipped to the static bundle.
- **Verify** every webhook's Stripe signature before acting; reject unsigned/invalid.
- **Idempotency**: Stripe retries webhooks — dedupe on `event.id` so a buyer never gets two
  repos.
- **Least privilege**: the GitHub App is scoped to repo administration (Contents +
  Administration). For institutional provisioning it acts through the **institution's own
  installation** — the institution grants and can revoke that access.
- Buyer's GitHub target comes from the **connect flow before purchase** — a verified personal
  account (individual) or a verified org installation (institutional), never a typed name.
- **OAuth `state`** is validated on callback against a KV-stored value issued at connect (CSRF),
  which also carries the connect type.

## Open items

These are stubbed in the scaffold and flagged with `TODO(owner)`:

1. **inqspace provisioning API** — the prototype exists ("somewhere"); once located, wire
   `fulfillment/lib/inqspace.ts`. Everything else is complete around it.
2. **MagAI credit issuance** — the `CastaliaInstitute/magisterium` credentialing system
   administers the credit. v1 writes the entitlement to Supabase; wiring magisterium to read it
   and grant MagAI credit is a follow-up against that existing repo.
3. **Buyer repo org + naming** — individual → **`CastaliaInstitute`**, repo
   `<course-code>-<login>`; institutional → the buyer's org, repo `<course-code>-cohort`. Confirm
   individual repos belong in `CastaliaInstitute` vs. a dedicated students org.
4. ✅ **Institutional connect = GitHub Organization** — institutional connect routes the admin
   through installing the Castalia App on their org, and provisioning targets that verified org.
   (Remaining: a UI affordance to re-check/repair a revoked installation.)
5. **Course template repo** — one template per course to `generate` from. The existing
   `CastaliaInstitute/ains-6001-…` repos are course **content** (Jupyter Books), not the student
   working template; extend `aima-codespace-repo/` into `CastaliaInstitute/ains-course-template`.
6. **Cloudflare cutover** — verify the Cloudflare Pages deploy (including `functions/` and the KV
   binding) serves `programs.castalia.institute`, then remove the legacy `pages.yml`. Confirm the
   `wrangler pages deploy` step packages the repo-root `functions/` directory (or use the Pages
   Git integration).
7. ✅ **`InquiryInstitute` → `CastaliaInstitute`** — migrated across source (NOMENCLATURE.md).
