# Aurnova Q1 — buy on Stripe → repos in their org

**Goal: Aurnova pays Castalia for their first-quarter courses by purchasing on Stripe, and the
purchase creates the course repos in Aurnova's own GitHub org.** No invoice; self-serve checkout.

## Q1

Aurnova MSAI, Term 1 — 3 courses (magisterium canonical codes in parentheses):

| Aurnova | Course | Provisions |
| --- | --- | --- |
| AIN6007 | Applied AI Programming with Python | `CS-100` |
| AIN6001 | Foundations of Artificial Intelligence | `AI-101` |
| AIN6005 | AI Ethics, Law & Policy | `AI-109` |

All three now have provisioning profiles and code aliases, so a purchase provisions each into a
repo. (`AURNOVA_Q1_CODES = ['CS-100','AI-101','AI-109']`.)

## Flow

```
Aurnova installs the Castalia App on their GitHub org   (one click — connect = org install)
  ▼
Aurnova buys Q1 on Stripe   POST /api/checkout { skus:[AIN6007,AIN6001,AIN6005],
                              github_login, purchase_type:'institutional', target_org:'<aurnova-org>' }
  ▼  one Checkout, 3 line items, priced server-side
Stripe Checkout → payment succeeds
  ▼
/api/stripe-webhook  → for each course: GitHub App generates a repo in Aurnova's org from the
                        template + writes castalia-course.json; records enrollment.
  ▼
3 course repos exist in Aurnova's GitHub org.
```

The webhook provisions **multiple courses per purchase** (one repo each). Individual purchases work
the same with `purchase_type` omitted (repos under `CastaliaInstitute`, buyer as collaborator).

## What's still required to run it live (operator, not customer)

Aurnova does two clicks (install App, buy). Castalia's one-time setup, unchanged from
[`AUTOMATION.md`](AUTOMATION.md): create the GitHub App, deploy the Functions to Cloudflare Pages,
push the course template to `CastaliaInstitute/ains-course-template`, set the Stripe/GitHub/Supabase
secrets. Then `node automation/bootstrap.mjs`.

## The one business input

**Q1 price** — what Aurnova pays Castalia per course (the institutional/license rate). Set it as
`listPriceCents` on the Q1 profiles in `fulfillment/lib/provisioning-profiles.ts` (currently the
$1,500 student-tuition placeholder), or override per Checkout. The webhook/provisioner are
amount-agnostic — pricing is decided at checkout.
