# Course platform — enroll, provision, capture evidence

How Castalia enrolls a learner in a course, provisions their working environment when the course
needs one, and hands **completion evidence** to magisterium. Two layers, cleanly separated:

- **This platform (`programs`)** — enrollment, environment provisioning, and evidence capture.
  Course-generic: works for any level, K–PhD+.
- **magisterium** (`CastaliaInstitute/magisterium`) — the authoritative **course catalog**
  (209 courses, seven colleges, codes like `AI-103`) **and** the credentialing system
  (artifacts, course_completions, evaluations, credentials such as **Mag.AI**).

The platform never issues credentials and never owns the course catalog. It reads course
identity from magisterium and, on completion, writes evidence into magisterium's schema; the
magisterium evaluation/review-panel process decides what that evidence earns.

Status: **design + scaffold.** Pages Functions in [`functions/`](functions/); shared logic in
[`fulfillment/lib/`](fulfillment/lib/). Stubs flagged in [Open items](#open-items).

## The boundary with magisterium

| Concern | Owner |
| --- | --- |
| Course catalog (K–PhD+, `era`, colleges, codes like `AI-103`) | **magisterium** |
| Credentials (Mag.AI …), evaluations, review panels | **magisterium** |
| `artifacts` (evidence), `course_completions` (learning lineage) | **magisterium** schema — **written by this platform on completion** |
| Enrollment, access, environment provisioning (repo/inqspace) | **this platform** |
| Commerce (Stripe checkout, membership, pricing) | **this platform** |

MagAI is **not** a concept in this platform. It is one credential magisterium may award from the
evidence we capture — earned on **completion**, from **evidence**, never granted at purchase.

## Courses beyond one program

Courses exist independently of any credential and span K–PhD+ (magisterium's `era`: `schola_prima`
… `docent`). Most courses need **no** environment provisioned — a `none`/`hosted` delivery. Only
courses with a **provisioning profile** (`fulfillment/lib/provisioning-profiles.ts`, keyed by
magisterium course code) get a per-learner GitHub repo + inqspace + the AI teaching stack. That
profile set is currently the technical AI courses (`AI-102/103/104/402`); it is not the catalog.

## Enrollment (purchase is one entry point)

"Enroll" is the primitive; **purchase** is one way to trigger it (others: institutional roster,
member enrollment). A purchase — including a **$0 member checkout** — completes and enrolls
through the same path.

- **Individual (direct):** enrolls the learner; if the course has a provisioning profile, a repo
  is created under `CastaliaInstitute` with the learner as collaborator.
- **Institutional (e.g. Aurnova):** enrolls into the **institution's own GitHub org**; the
  institution brings its own faculty and students and owns its own credential (its degree).

Enrollment is a platform record with **no credential semantics**. It is not a MagAI entitlement.

## GitHub connect (before purchase, and in onboarding)

Learners **connect GitHub** (`/api/github/connect` → `/api/github/callback`) so enrollment
carries a *verified* GitHub target, never a typed name:

- **Individual** (`type=individual`): user OAuth for the personal account; records login + orgs.
- **Institutional** (`type=institutional`): **connecting means connecting a GitHub Organization**
  — the admin installs the Castalia App on their org; the callback resolves the org from the
  `installation_id`. Provisioning targets that verified org; no installation → no institutional
  enrollment.

## Flow

```
Connect GitHub  (/api/github/connect → callback)  — onboarding + before purchase
  │  verified individual login, or verified org installation
  ▼
POST /api/checkout → Stripe session, priced server-side (member → $0)
  │  metadata: sku (magisterium course code), github_login, purchase_type, target_org?
  ▼
Stripe Checkout  ($0 completes as no_payment_required; same event either way)
  ▼
POST /api/stripe-webhook  = ENROLL
  │  verify sig · idempotency · resolve provisioning profile
  │  if course needs an environment: GitHub App → repo in target org + castalia-course.json flags
  │  write platform enrollment record (no credential semantics)
  ▼
… learner does the work in the repo (inqspace, BEATRICE, Dialogic, SAMWISE) …
  ▼
POST /api/completion  (signalled by CI/autograder, instructor, or AI facilitator)
  │  capture evidence pinned to a commit SHA →
  │  write artifact + course_completion INTO magisterium's schema
  ▼
magisterium evaluates evidence → may award a credential (e.g. Mag.AI). Not this platform's call.
```

## Evidence & completion (the credential substrate)

An evidence-based credential is only as good as its evidence. `/api/completion` records, into
magisterium:

- an **artifact** of type `repository` (the learner's repo), pinned to a **commit SHA** and an
  optional content digest for tamper-evidence;
- a **course_completion** (individual, course, completed_at, artifact ids) — magisterium's
  "learning lineage."

Because learners have write access to their own repos, the trustworthy evidence is the pinned
commit + CI attestations, not the mutable repo head. Hardening (signed commits / CI-produced
attestations recorded server-side) is called out in Open items.

## Enabling the teaching stack in a provisioned repo

For courses with a `github-repo` profile, the provisioner writes a declarative manifest so the
template's tooling turns features on without special-casing:

```jsonc
// castalia-course.json (written into the provisioned repo)
{
  "course": "AI-103",              // magisterium course code
  "features": { "inqspace": true, "dialogic": true, "beatrice": true, "samwise": true }
}
```

Features come from the course's provisioning profile, not a hardcoded "all on" — a course can
ship any subset (or, with `none` delivery, no repo at all).

## inqspace instead of Codespaces

The provisioner calls `launchInqspace()` in `fulfillment/lib/inqspace.ts` — the **only** place
inqspace specifics live. Stubbed with a launch-URL placeholder until the prototype's API is
located; then it is a one-file wire-up. Codespaces is removed from the learner path.

## Data stores

- **magisterium Supabase** (assumed shared project): `individuals`, `artifacts`,
  `course_completions` — written by `/api/completion`. See `fulfillment/lib/magisterium.ts`. If
  magisterium is a separate Supabase project, swap those writes for a magisterium ingest API; the
  callers don't change.
- **platform Supabase/KV:** `members` (membership → $0), `github_connections`, `enrollments`, and
  the ephemeral webhook-idempotency key.

## Pricing & membership

| Buyer | Price |
| --- | --- |
| Castalia **member** (direct) | **$0 — free** |
| Non-member (direct) | List price ($1,500 reference) |
| Institution | Contract price (per-course reference $1,500) |

Free-to-members is a **$0 checkout that runs the same flow** (`unit_amount: 0` →
`no_payment_required`). Pricing is decided **server-side** in `/api/checkout`; membership is
verified against Supabase and **fails closed**, so $0 cannot be forged. The webhook and
provisioner are amount-agnostic.

## Programs → Cloudflare Pages

GitHub Pages can't run a backend, so `programs` moves to **Cloudflare Pages**: the Astro site
builds to `web/dist` and the repo-root `functions/` directory provides the API in the same
deployment (`wrangler.toml`, `.github/workflows/cloudflare-pages.yml`; legacy `pages.yml` demoted
to manual, removed after cutover).

## Security

- **Secrets** (Stripe keys, GitHub App key, Supabase service key, completion-signal secret) are
  Cloudflare Pages environment secrets — never in the repo or the static bundle.
- **Verify** the Stripe signature; **dedupe** on `event.id` (Stripe retries).
- **GitHub App least privilege**: repo administration only; institutional provisioning acts
  through the institution's own installation, which they can revoke.
- **Connect before enroll**: verified personal account or verified org installation, never a
  typed name. OAuth `state` validated via KV (CSRF).
- **Completion endpoint** requires a shared secret; evidence is pinned to a commit SHA.

## Open items

1. **inqspace provisioning API** — wire `fulfillment/lib/inqspace.ts` when the prototype surfaces.
2. **Course-code reconciliation** — magisterium uses `AI-103`; the Aurnova catalog uses
   `AINS6003`/`AIN6003`. Establish the mapping (which AINS courses correspond to which magisterium
   `AI-###`) so a single identity flows through enrollment, provisioning, and completion.
3. **Shared Supabase assumption** — confirm `programs` and `magisterium` share one Supabase
   project. If not, `/api/completion` posts to a magisterium ingest API instead of writing tables.
4. **Evidence tamper-evidence** — record CI-produced attestations / signed-commit digests
   server-side, not just the commit SHA, so credentials rest on trustworthy evidence.
5. **Course template repo** — build `CastaliaInstitute/ains-course-template` to `generate` from;
   the `ains-6001-…` repos are content, not the student working template.
6. **Cloudflare cutover** — verify the deploy packages `functions/` and the KV binding, then
   remove `pages.yml`.
7. ✅ **Institutional connect = GitHub Organization**, ✅ **`InquiryInstitute` → `CastaliaInstitute`**.
