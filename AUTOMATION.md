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

## One-time human setup (cannot be self-automated)

Each needs an account action; I provide the script/manifest/checklist so it's as close to
one-command as possible, but a person must create the resource and paste back secrets.

1. **GitHub App** — create the "Castalia Course Provisioner" App (repo admin, contents; OAuth for
   connect). Semi-automatable via a **GitHub App manifest** flow (human clicks once; GitHub returns
   the App id + keys). Install on `CastaliaInstitute`; institutions install on their own org.
2. **Stripe** — account, product per course, price; webhook endpoint → `/api/stripe-webhook`.
3. **Supabase** — project (or share magisterium's); run the platform migration; set service key.
4. **Cloudflare Pages** — project for `programs`, custom domain, KV namespace binding, and
   Access policy for gated books. Point DNS.
5. **Secrets** — paste all of the above into Cloudflare Pages env (see `fulfillment/README.md`).

Once these exist and secrets are set, the whole in-repo pipeline runs unattended.

## Automated in-repo (no external account to author)

- The five Pages Functions (`functions/`) — checkout, webhook/enroll+provision, connect, callback,
  completion.
- Platform DB schema — `fulfillment/supabase/migrations/001_platform_tables.sql`.
- Reusable course-book build+deploy workflow — `automation/course-book-deploy.yml` (copy into each
  `ains-*` repo, or call as a reusable workflow).
- Deploy workflow — `.github/workflows/cloudflare-pages.yml`.
- Provisioning profiles + code map — `fulfillment/lib/provisioning-profiles.ts`, `COURSE-CODE-MAP.md`.

## Still to build (automatable, no external account)

- **Book access-gate Function** — verify enrollment before serving a course book on Cloudflare.
- **Completion-signal workflow** — a learner-repo CI job that, on Socratic pass, POSTs to
  `/api/completion` with the transcript hash.
- **GitHub App manifest + bootstrap script** — to make step 1 above one click.
- **Bulk course onboarding script** — register all `ains-*`/`AI-###` courses + their profiles.
