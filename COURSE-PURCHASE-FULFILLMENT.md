# Course purchase → repo provisioning (design)

How an individual buyer purchases a single Castalia course and automatically receives a
ready-to-work GitHub repository, with **inqspace** (our Codespaces equivalent) and the
**Dialogic**, **BEATRICE**, and **SAMWISE** teaching stack enabled.

Status: **design + scaffold.** The fulfillment Function and config seams live in `fulfillment/`.
Two integrations are intentionally stubbed pending inputs — see [Open items](#open-items).

## Subdomains

| Subdomain | Role | Hosting |
| --- | --- | --- |
| `programs.castalia.institute` | Institution-facing catalog (existing) | GitHub Pages — unchanged |
| `courses.castalia.institute` | **New.** Self-serve single-course purchase | **Cloudflare Pages + Pages Functions** |
| `magisterium.castalia.institute` | MagAI credit administration | Repo exists (`CastaliaInstitute/magisterium`, Astro — artifact-based credentialing) |

Self-serve courses live on their **own subdomain**, separate from the institutional programs
catalog. The existing GitHub Pages site does not move. Names follow
[`NOMENCLATURE.md`](NOMENCLATURE.md) — note **MagAI** is the credential and **Magisterium** is
the system that administers it.

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
Buyer on courses.castalia.institute
  │  picks a course, clicks Buy
  ▼
Stripe Checkout  (collects email + GitHub username as a custom field)
  │  payment succeeds
  ▼
POST /api/stripe-webhook   (Cloudflare Pages Function)
  │  1. verify Stripe signature (Web Crypto / constructEventAsync)
  │  2. idempotency check (Stripe retries) — KV keyed on event.id
  │  3. resolve SKU → course template + enabled features
  │  4. authenticate as the Castalia GitHub App
  │  5. create repo from the course template (generate)
  │  6. add buyer as collaborator; write castalia-course.json feature flags
  │  7. record entitlement (Supabase) for MagAI credit at magisterium
  ▼
Success page: links to the new repo + inqspace launch
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
- **Least privilege**: the GitHub App is scoped to repo administration on the single target org
  (Contents + Administration), nothing broader.
- Buyer's GitHub identity is collected at checkout (Stripe custom field) so we invite the right
  account rather than guessing from email.

## Open items

These are stubbed in the scaffold and flagged with `TODO(owner)`:

1. **inqspace provisioning API** — the prototype exists ("somewhere"); once located, wire
   `fulfillment/lib/inqspace.ts`. Everything else is complete around it.
2. **MagAI credit issuance** — the `CastaliaInstitute/magisterium` credentialing system
   administers the credit. v1 writes the entitlement to Supabase; wiring magisterium to read it
   and grant MagAI credit is a follow-up against that existing repo.
3. **Buyer repo org + naming** — buyer repos are created under **`CastaliaInstitute`** (matching
   the `ains-*` course books; corrected from the earlier `InquiryInstitute` default). Naming:
   `<course-code>-<github-handle>`. Confirm this is the desired org for per-buyer repos vs. a
   dedicated students org.
4. **Course template repo** — one template per course to `generate` from. The existing
   `CastaliaInstitute/ains-6001-…` repos are course **content** (Jupyter Books), not the student
   working template; extend `aima-codespace-repo/` into `CastaliaInstitute/ains-course-template`.
5. **`InquiryInstitute` legacy references** — `AIMA_REPO` and the codespace scripts still point
   at `InquiryInstitute`; reconcile per NOMENCLATURE.md.
