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
| `magisterium.castalia.institute` | **New.** MagAI (Magister of AI) credit administration | TBD — credentialing surface, out of scope here |

Self-serve courses live on their **own subdomain**, separate from the institutional programs
catalog. The existing GitHub Pages site does not move.

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
  │  7. record entitlement (KV/D1) for MagAI credit at magisterium
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

## Security

- **Secrets** (Stripe webhook secret, GitHub App ID + private key) are Cloudflare
  Pages **environment secrets** — never in the repo, never shipped to the static bundle.
- **Verify** every webhook's Stripe signature before acting; reject unsigned/invalid.
- **Idempotency**: Stripe retries webhooks — dedupe on `event.id` in KV so a buyer never gets
  two repos.
- **Least privilege**: the GitHub App is scoped to repo administration on the single target org
  (Contents + Administration), nothing broader.
- Buyer's GitHub identity is collected at checkout (Stripe custom field) so we invite the right
  account rather than guessing from email.

## Open items

These are stubbed in the scaffold and flagged with `TODO(owner)`:

1. **inqspace provisioning API** — the prototype exists ("somewhere"); once located, wire
   `fulfillment/lib/inqspace.ts`. Everything else is complete around it.
2. **MagAI credit issuance** — `magisterium.castalia.institute` administers the credit. v1 only
   records the entitlement (who bought/completed what); the actual credit-grant call to
   magisterium is a separate integration once that surface exists.
3. **GitHub org + repo naming** for buyer repos (default proposed: `<course-code>-<github-handle>`
   under the course org) — confirm the org.
4. **Course template repos** — one template per course to `generate` from; the existing
   `ains-6001-…` book repos are content, not the student working template. Confirm the template
   source (extend `aima-codespace-repo/` into a per-course template).
