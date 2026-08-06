# Automation map — end to end

Goal: a learner or institution transacts, and everything downstream happens with no manual step —
book publish → enroll → provision → learn → Socratic completion → evidence → credential. This maps
every stage to its automation, and is honest about the one-time human setup no code can perform.

## Pipeline

| Stage | Automation | Status |
| --- | --- | --- |
| Course book build + publish | Reusable CI workflow: Jupyter Book → Cloudflare Pages (`automation/course-book-deploy.yml`) | template added |
| Gate book to enrolled learners | Cloudflare Access / Pages Function checks `enrollments` | designed (Open item) |
| Storefront → checkout | `/api/checkout` (server-side pricing, member $0) | built (scaffold) |
| Payment/enroll → provision repo | `/api/stripe-webhook` → GitHub App generate + collaborator + manifest | built (scaffold) |
| GitHub connect (individual + org install) | `/api/github/connect` + `/callback` | built (scaffold) |
| inqspace workspace | `lib/inqspace.ts` (single seam) | stub (awaiting prototype) |
| Socratic completion → evidence | learner-repo CI on pass → `/api/completion` → magisterium artifacts/completion | endpoint built; repo-side signal = template workflow |
| Evidence → credential (Mag.AI) | magisterium review panel / evaluations | magisterium's system |
| Platform data | `members`, `github_connections`, `enrollments` (Supabase) | migration added (`fulfillment/supabase/migrations/`) |
| Deploy | `.github/workflows/cloudflare-pages.yml` (build + Functions) | workflow added; cutover pending |

## Who sets up what

**Customers set up NOTHING.** No tokens, no policies. By design:
- An **individual** clicks *Connect GitHub* — one OAuth screen.
- An **institution** clicks *Install the Castalia App on your org* — GitHub mints and manages the
  token itself. This is the whole reason we use a GitHub App, not PATs.

**Castalia's one-time operator setup** is automated by `automation/bootstrap.mjs` (idempotent,
create-only) plus a single App-creation click. It reduces to:

1. **Create the GitHub App** — the one step GitHub has no pure-API for. `github-app-manifest.json`
   makes it a single click that returns the App id + keys. Install once on `CastaliaInstitute`.
2. **Provide two operator credentials** (created once, by Castalia): a scoped
   **Cloudflare API token** (`CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`) and the
   **`GITHUB_APP_*`** values from step 1.
3. **Run bootstrap locally, where your operator `.env` lives** (it can't be read from a cloud
   session — that filesystem is isolated):
   ```
   node --env-file=.env automation/bootstrap.mjs --dry-run   # preview what it would create
   node --env-file=.env automation/bootstrap.mjs             # create for real
   ```
   Creates the Cloudflare Pages project + KV namespace and the `ains-course-template` repo.
   Idempotent; skips any section whose creds are absent. (A `./.env` is also auto-loaded.)
4. **Set secrets + Access policy** — the Stripe/GitHub/Supabase secrets on the Pages project, the
   KV binding, and the Cloudflare Access policy that gates books to enrolled learners. Documented
   here; kept out of bootstrap so the script stays create-only and safe.

Stripe (account, products/prices, webhook endpoint) and Supabase (project or shared with
magisterium; run `fulfillment/supabase/migrations/`) are the remaining account creations — each a
one-time operator action, none touched by customers.

> Credential reality in this session: a repo-scoped GitHub token is present (no org-admin: `orgs`
> endpoints 403), and **no** Cloudflare token. So bootstrap is authored and dry-run-clean but
> can't be *run* here until the operator drops in a Cloudflare token and the `GITHUB_APP_*` creds.

## Automated in-repo (no external account to author)

- The five Pages Functions (`functions/`) — checkout, webhook/enroll+provision, connect, callback,
  completion.
- Platform DB schema — `fulfillment/supabase/migrations/001_platform_tables.sql`.
- Reusable course-book build+deploy workflow — `automation/course-book-deploy.yml` (copy into each
  `ains-*` repo, or call as a reusable workflow).
- Deploy workflow — `.github/workflows/cloudflare-pages.yml`.
- Provisioning profiles + code map — `fulfillment/lib/provisioning-profiles.ts`, `COURSE-CODE-MAP.md`.

## Still to build (automatable, no external account)

- ✅ **Course template repo** — `templates/ains-course-template/` (book five layers, inqspace
  config, `castalia-course.json`, App-only `exam/`, `work/`). `bootstrap.mjs` creates the empty
  template repo; push this content into it (a `git push`, or extend bootstrap).
- ✅ **Completion-signal workflow** — `templates/ains-course-template/.github/workflows/completion.yml`
  hashes the transcript and POSTs `/api/completion` on a Socratic pass.
- ✅ **GitHub App manifest + bootstrap** — `automation/github-app-manifest.json`, `automation/bootstrap.mjs`.
- **Book access-gate Function** — verify enrollment before serving a course book on Cloudflare.
- **Bulk course onboarding script** — register all `AI-###` courses + their provisioning profiles.
- **Apply DB migrations in CI** — run `supabase db push` from a workflow that holds the Supabase
  secret, so schema changes (magisterium 006, platform tables) apply without a manual step.
