# Nomenclature

Canonical names for the Castalia / Aurnova AI education stack, grounded in the actual
`CastaliaInstitute` GitHub org (verified 2026-08-06). Use these consistently across repos,
catalog copy, and code. Where two names exist for one thing, the **canonical** column wins.

## Organizations & domains

| Thing | Canonical | Notes |
| --- | --- | --- |
| GitHub org | **`CastaliaInstitute`** | Course books, platform, credentialing, and this `programs` repo all live here. |
| Legacy GitHub org | `InquiryInstitute` | Referenced by older code (`AIMA_REPO`, `aima-codespace` scripts). Not in this session's scope. **Migrate references to `CastaliaInstitute`** or confirm it is a deliberately separate org. |
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
| **MSAI** | Aurnova University's *Master of Science in Artificial Intelligence* — the degree, 12 AIN courses (36 cr) | `aurnova.com/msai`; repo `CastaliaInstitute/MSAI` |
| **AIMA 5001** | The *AI: A Modern Approach* (Russell & Norvig) course product, sold as Simple / Advanced SKUs | this `programs` catalog; `aima` repo (legacy `InquiryInstitute`) |
| **MagAI** | Castalia's own *Magister of AI* online **certificate** (non-accredited, no faculty) — the credential | `CastaliaInstitute/MagAI` (public landing) |
| **Magisterium** | The artifact-based **credentialing system** that administers credits/certificates (incl. MagAI) | `CastaliaInstitute/magisterium` (Astro); `magisterium.castalia.institute` |

> **MagAI is the credential; Magisterium is the system that issues it.** Don't use one to mean
> the other.

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
| `programs.castalia.institute` | Institution-facing catalog (this repo) | Live (GitHub Pages) |
| `courses.castalia.institute` | Self-serve single-course purchase | Planned (Cloudflare Pages) |
| `magisterium.castalia.institute` | MagAI / credit administration | Repo exists |
| `mhth.castalia.institute` | More Human Than Human certificate | Live |
| `anubis.castalia.institute` | ANUBIS cyber lab (backs AINS6300–6302) | Live |

## Open naming decisions

1. **Org for buyer/course repos:** standardize on `CastaliaInstitute` (the scaffold has been
   corrected from `InquiryInstitute`). Confirm whether `InquiryInstitute` is retired or kept.
2. **AIMA line** still points at `InquiryInstitute/aima` in `programs.ts` — migrate or confirm.
3. **Self-serve SKU:** use `AINS####` as the Stripe SKU internally, display `AIN####` to buyers.
