# Nomenclature

Canonical names for the Castalia / Aurnova AI education stack, grounded in the actual
`CastaliaInstitute` GitHub org (verified 2026-08-06). Use these consistently across repos,
catalog copy, and code. Where two names exist for one thing, the **canonical** column wins.

## Organizations & domains

| Thing | Canonical | Notes |
| --- | --- | --- |
| GitHub org | **`CastaliaInstitute`** | Course books, platform, credentialing, and this `programs` repo all live here. |
| Former org | `InquiryInstitute` → **evolved to `CastaliaInstitute`** | Same organization, renamed. All references have been migrated in source; old GitHub URLs auto-redirect. Do not use `InquiryInstitute` in new work. |
| Primary domain | **`castalia.institute`** | programs., mhth., anubis., magisterium., gazetteer., mynah. |
| Legacy domain | `inquiry.institute` | Still live for some services (cal., commonplace., game.). |

## Course codes

- **`AINS####`** — Castalia's internal course code. Also the repo name (`ains-<number>-<slug>`)
  and Jupyter Book title.
- **`AIN####`** — the **same** course as published in Aurnova's MSAI catalog (drops the `S`).
  `AINS6003` ≡ `AIN6003`. Confirmed in the repo descriptions themselves ("AINS6003 … (AIN6003)").
- Repo naming: `ains-<number>-<kebab-title>` (e.g. `ains-6007-applied-ai-programming-with-python`).
- **Convention:** use `AINS####` internally (repos, this catalog's data); display `AIN####` in
  Aurnova-facing catalog copy.

## Degrees, certificates, credentials — keep these distinct

These are four different things and have been conflated. They are not interchangeable:

| Name | What it is | Home |
| --- | --- | --- |
| **MagAI** | **Castalia's own** *Magister of AI* online **certificate** — AI faculty, direct learners. Castalia's offering. | `CastaliaInstitute/MagAI` (public landing) |
| **MSAI** | **Aurnova University's** *Master of Science in AI* degree (12 AIN courses, 36 cr). Aurnova's brand. **Deprecated as a Castalia label.** | `aurnova.com/msai`; `CastaliaInstitute/MSAI` (deprecated) |
| **AIMA 5001** | The *AI: A Modern Approach* (Russell & Norvig) course product, sold as Simple / Advanced SKUs | this `programs` catalog; `CastaliaInstitute/aima` |
| **Magisterium** | The artifact-based **credentialing system** that administers credits/certificates (incl. MagAI) | `CastaliaInstitute/magisterium` (Astro); `magisterium.castalia.institute` |

> **MagAI is Castalia's credential; MSAI is Aurnova's degree; Magisterium is the system that
> administers credit.** Don't use one to mean another.

### Provider vs. customer — who supplies faculty and students

The same courseware is delivered two ways, differing in who teaches and who enrolls:

| | **Castalia — MagAI** | **Aurnova — MSAI** |
| --- | --- | --- |
| Role | Provider (courseware + platform) | Institutional **customer** |
| Faculty | **AI** (BEATRICE, Dialogic, SAMWISE) — no human faculty | **Human faculty** (their own) |
| Students | Direct learners | **Aurnova's own students** |
| Credential | MagAI certificate | MSAI degree |
| GitHub repos | Under `CastaliaInstitute` | In **Aurnova's own org** |

**MSAI is deprecated as a Castalia offering** — it is Aurnova's degree brand. Castalia's direct
product for this courseware is **MagAI**; retire the `CastaliaInstitute/MSAI` "curriculum system"
framing in favor of MagAI. Keep `AURNOVA-MSAI-PROGRAM-MAP.md` — it documents the **customer's**
degree.

## Platform & teaching stack

| Name | What it is |
| --- | --- |
| **inqspace** | Castalia's cloud dev workspace — the Codespaces equivalent used for course repos |
| **Dialogic** | Co-teaching delivery: SCRIPT lectures where AI lecturers answer on-slide |
| **BEATRICE** | AI teaching assistant (instructor notes, escalation, Q&A) |
| **SAMWISE** | Curriculum server / authoring + autograding tooling |
| **Supabase** | Backend data & auth store (already in use: `supabase-storage-archive`, BEATRICE Q&A) |

## Surfaces (subdomains)

| Subdomain | Role | Status |
| --- | --- | --- |
| `programs.castalia.institute` | **Institutional** content channel (this repo) — content for institutions; **no MagAI branding** | Cloudflare Pages (migrating) |
| MagAI surface (`CastaliaInstitute/MagAI`) | Castalia's **direct** self-serve MagAI storefront | Repo exists |
| `magisterium.castalia.institute` | MagAI credit administration (direct context only) | Repo exists |
| `mhth.castalia.institute` | More Human Than Human certificate | Live |
| `anubis.castalia.institute` | ANUBIS cyber lab (backs AINS6300–6302) | Live |

**Channel rule:** `programs` = institutional (we license content to institutions; they brand
their own degree). **MagAI** = Castalia's direct offering, its own surface. Do not put MagAI in
institutional-facing material.

## Resolved / open naming decisions

1. ✅ **`InquiryInstitute` → `CastaliaInstitute`** — the org evolved (renamed). All source
   references migrated (`AIMA_REPO`, codespace/variant scripts, demo sources, catalog page).
2. **Buyer-repo org depends on purchase type** (see COURSE-PURCHASE-FULFILLMENT.md):
   individual self-serve → under `CastaliaInstitute`; **institutional → under the institution's
   own org** (e.g. Aurnova buys → repo created in Aurnova's org).
3. **Self-serve SKU:** use `AINS####` as the Stripe SKU internally, display `AIN####` to buyers.
