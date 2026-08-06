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

- **`AI-###` (and `SP-`, `SS-`, `LY-`, …)** — **magisterium's canonical course codes**, the
  authoritative catalog (209 courses, K–PhD+, keyed by `era` and college). `AI-103` = Deep
  Learning, `AI-402` = Large Language Models, etc. **This is the course identity of record.**
- **`AINS####`** — the **Aurnova catalog** code for the courses licensed into their MSAI (repos
  `ains-<number>-<slug>`, Jupyter Book titles).
- **`AIN####`** — the same Aurnova course as **published** on aurnova.com (drops the `S`).
  `AINS6003` ≡ `AIN6003`.
- **Open reconciliation:** the Aurnova `AINS####` courses map to magisterium `AI-###` codes
  (e.g. AINS6003 Deep Learning ↔ AI-103). Establish that mapping so one identity flows through
  enrollment → provisioning → completion. The platform's provisioning profiles are keyed by the
  **magisterium** code.

## Degrees, certificates, credentials — keep these distinct

These are four different things and have been conflated. They are not interchangeable:

| Name | What it is | Home |
| --- | --- | --- |
| **MagAI** = **Mag.AI** | Castalia's *Magister of Artificial Intelligence* — an **evidence-based credential** awarded by magisterium **on course completion**. A level in the pathway, not a purchase. | `CastaliaInstitute/MagAI` (landing); credential in `magisterium` |
| **MSAI** | **Aurnova University's** *Master of Science in AI* degree (12 AIN courses, 36 cr). Aurnova's brand. **Deprecated as a Castalia label.** | `aurnova.com/msai`; `CastaliaInstitute/MSAI` (deprecated) |
| **AIMA 5001** | The *AI: A Modern Approach* (Russell & Norvig) course product, sold as Simple / Advanced SKUs | this `programs` catalog; `CastaliaInstitute/aima` |
| **Magisterium** | The authoritative **course catalog (209, K–PhD+)** *and* the artifact-based **credentialing system** (artifacts, completions, evaluations, credentials). Owns MagAI end to end. | `CastaliaInstitute/magisterium` (Astro); `magisterium.castalia.institute` |

> **MagAI is a credential magisterium awards from completion evidence; MSAI is Aurnova's degree;
> Magisterium owns the course catalog and all credentialing.** The `programs` platform enrolls,
> provisions, and captures evidence — it never issues credentials.

**Credential pathway (magisterium):** `Bac.X → certificates → Mag.X → Doc.X`, across seven
colleges (.AI .CS .Math .Sci .Phil .Eng .Com). MagAI = `Mag.AI`.

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
2. **Buyer-repo org depends on purchase type** (see COURSE-PLATFORM.md):
   individual self-serve → under `CastaliaInstitute`; **institutional → under the institution's
   own org** (e.g. Aurnova buys → repo created in Aurnova's org).
3. **Self-serve SKU:** use `AINS####` as the Stripe SKU internally, display `AIN####` to buyers.
