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
Socratic defense: three AI faculty question the learner, judge fluency
  │  App writes the transcript to exam/ (learner can't push there), pinned to a commit SHA
  ▼
POST /api/completion  → capture repository + transcript artifacts (each hashed) →
  │  write artifacts + course_completion INTO magisterium's schema
  ▼
magisterium panel (3 evaluations, phase=defense) → on pass, issue credential (Mag.AI) with a
verification_id bound to the transcript hash. Credentialing is magisterium's, not this platform's.
```

## Completion — Socratic review & unforgeable credential

Completion is not a checkbox. It is an oral **Socratic defense**: three independent AI faculty
question the learner about the material and judge **fluency**. This maps directly onto
magisterium's model — no new credential machinery needed:

| Socratic review | magisterium |
| --- | --- |
| Three faculty | a `review_panel` with three `panel_members` (reviewer role) |
| Each faculty's fluency judgment | an `evaluation` row, phase `defense`, with `score` + `passed` |
| Pass | a `credential` with a unique `verification_id` |
| The conversation + the work | `artifacts` (repository + transcript), pinned and hashed |

The faculty are **independent** AI reviewers (distinct perspectives), and each verdict is its own
`evaluation` row, so the panel's judgment is itself part of the tamper-evident record.

### The exam lives in the learner's repo — which Castalia owns

The fluency exam (the work + the Socratic transcript) resides in the course repo. That repo stays
in **`CastaliaInstitute`**, with the learner as **collaborator, not owner**. That one ownership
fact makes both access and integrity work:

- **Access — via the GitHub App, not a collaborator invite or PAT.** We provision the repo through
  the Castalia App, which already holds read/write on `CastaliaInstitute`. The AI faculty and the
  transcript-writer authenticate as the App. The learner cannot revoke it and needn't act to grant
  it. (A collaborator grant is per-user and revocable; a PAT is a shared secret. The App is the
  right primitive and we already use it.)
- **Integrity — collaborator ≠ owner.** The learner pushes their work but cannot delete the repo,
  rewrite protected history, or edit the transcript. Branch/path protection splits it: the learner
  owns `work/`; the **App owns `exam/`** and the learner cannot push there.
- **Custody — keep it in `CastaliaInstitute` during *and after* passing.** An evidence-based
  credential must resolve to work that persists under the issuer's control; if the learner owned
  the repo they could delete it and break verification. The learner gets a **fork they own** for
  portfolio use; the canonical evidence stays under Castalia, pinned by commit SHA.

(Institutional/Aurnova repos live in the institution's org and follow the institution's own
credentialing — the Socratic/MagAI path is the direct context, where the repo is in
`CastaliaInstitute`.)

### Unforgeable certification id

The conversation is the evidence, so it is pinned and hashed, and bound to the credential id:

1. The **App** (not the learner) writes the full transcript into `exam/` in the Castalia-owned
   repo, committed by the App and pinned to a **commit SHA**.
2. A **SHA-256 of the transcript** is recorded in magisterium against the credential's
   `verification_id` — server-side, outside learner control.
3. `magisterium.castalia.institute/verify/<verification_id>` renders the transcript and its hash;
   anyone recomputes the hash to verify.

Forgery would require altering **both** the Castalia-owned repo (no learner write to `exam/`) **and**
the magisterium record (no learner access) — infeasible. `/api/completion` captures the repository
and transcript artifacts (each pinned + hashed); magisterium's panel evaluation issues the
`verification_id` and binds it to the transcript hash.

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
4. **Exam-path protection** — enforce that only the App can write `exam/` (branch/ruleset or a
   protected transcript branch), so the learner-collaborator cannot alter the Socratic transcript.
   `github-provision.ts` invites the learner as collaborator; the protection rule is the remaining
   `TODO(exam-integrity)`.
5. **Course template repo** — build `CastaliaInstitute/ains-course-template` to `generate` from;
   the `ains-6001-…` repos are content, not the student working template.
6. **Cloudflare cutover** — verify the deploy packages `functions/` and the KV binding, then
   remove `pages.yml`.
7. ✅ **Institutional connect = GitHub Organization**, ✅ **`InquiryInstitute` → `CastaliaInstitute`**.
