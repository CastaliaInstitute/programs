# Course-code reconciliation — Aurnova AINS ↔ magisterium

Aurnova's MSAI catalog (`AINS####`/`AIN####`) and magisterium's canonical catalog are different
taxonomies. Magisterium is the **system of record**; this maps Aurnova's licensed courses onto it
so one identity flows through enroll → provision → completion. Grounded in the magisterium repo
(`supabase/migrations/002_seed_courses.sql`, `004_school_college_matrix.sql`), read 2026-08-06.

## The three identity layers in magisterium

1. **College courses** — the 209-course catalog, coded by college: `AI-###`, `CS-###`, `Math-###`,
   `Sci-###`, `Phil-###`, `Eng-###`, `Com-###`. This is course identity of record.
2. **`AIN-<domain>-MAG` programs** — *Magister of AI in a domain* (AI-Native applied master's).
   `AIN-COM-MAG` (Mag.AI in Commerce) is **active/flagship**; Health, Governance, Intelligence,
   Space, Energy, … are **planned**.
3. **Aurnova `AINS####`/`AIN####`** — the licensed MSAI course codes (this repo / aurnova.com).

> ⚠️ **Prefix collision.** Magisterium's program prefix `AIN-<domain>-MAG` (AI-**N**ative) and
> Aurnova's course prefix `AIN####` (Aurnova, drop-the-S) are unrelated. Keep them distinct.

## Core courses (AINS6001–6009)

| Aurnova | Title | magisterium | Match | Notes |
| --- | --- | --- | --- | --- |
| AINS6001 | Foundations of AI | `AI-101` Mathematical Foundations for AI | partial | AINS6001 is a broader survey; pair AI-101 + intro of AI-102 |
| AINS6002 | Machine Learning & Predictive Modeling | `AI-102` Machine Learning | **strong** | |
| AINS6003 | Deep Learning & Neural Networks | `AI-103` Deep Learning | **exact** | |
| AINS6004 | Natural Language Processing | `AI-104` Natural Language Processing | **exact** | LLM units also `AI-402` |
| AINS6005 | AI Ethics, Law & Policy | `AI-109` Ethics & Governance of AI | **strong** | |
| AINS6006 | Big Data Management for AI | `AI-108` Data Engineering for AI | **strong** | related `CS-106` Databases |
| AINS6007 | Applied AI Programming with Python | — | **none** | Programming on-ramp; `CS-102`/`CS-108` partial. Decision needed |
| AINS6008 | AI Project Management & Deployment | `AI-403` Production ML Systems | partial | PM aspect → `Com-405`; deployment → AI-403 |
| AINS6009 | Capstone Project | — (credentialing step) | n/a | In magisterium the capstone **is** the Mag defense (review panel), not a course |

## Certificates

| Aurnova | Title | magisterium | Notes |
| --- | --- | --- | --- |
| AINS6010 | Sovereign AI | — | Castalia-specific. Related `AI-452` Federated/Privacy, `AI-107` Infra, `AI-405` Safety. Add to magisterium or keep Castalia-only |
| AINS5001 | A Modern Approach to AI (AIMA) | `AI-101`+`AI-102` (survey) | Russell & Norvig foundations survey |
| MHH5001 | More Human Than Human | College of **Philosophy & Letters** (`Phil-###`) | Interdisciplinary; not the AI college |

## Specializations → magisterium **programs** + courses

Aurnova's specializations are interdisciplinary (AI × a domain) and align with magisterium's
`AIN-<domain>-MAG` programs, not single courses.

**Healthcare AI** → *Mag.AI in Health* (`AIN-HLT-MAG`, **planned**)

| Aurnova | magisterium primary | Related |
| --- | --- | --- |
| AINS6100 AI in Medical Imaging | `AI-105` Computer Vision | `Eng-152` Biomedical Eng, `Sci-153` Neuroscience |
| AINS6101 Predictive Analytics in Population Health | `AI-156` Time Series & Forecasting | `Sci-155` Bioinformatics |
| AINS6102 AI for Clinical Decision Support | — (domain) | `Eng-152`, `AI-102` |

**Business AI** → *Mag.AI in Commerce* (`AIN-COM-MAG`, **active/flagship**)

| Aurnova | magisterium primary | Related |
| --- | --- | --- |
| AINS6200 AI for Marketing & Customer Insights | `Com-105` Marketing & Consumer Behavior | `AI-102` |
| AINS6201 Automation & Process Optimization | `Com-106` Operations & Supply Chain | `AI-450` Autonomous Agents |
| AINS6202 AI Strategy for Executives | `Com-405` Technology & Business Integration | `Com-110` Strategy |

**Cybersecurity AI** → no magisterium domain program yet (candidate: *Mag.AI in Intelligence/Security*)

| Aurnova | magisterium primary | Related |
| --- | --- | --- |
| AINS6300 AI in Threat Detection | `CS-109` Computer Security | `AI-102` |
| AINS6301 Automated Response Systems | `CS-109` Computer Security | `AI-450` Autonomous Agents |
| AINS6302 AI for Risk Assessment | `CS-109` Computer Security | `Com-109` Data-Driven Decision Making |

**Robotics AI** → no magisterium domain program yet (candidate: *Mag.AI in Robotics*)

| Aurnova | magisterium primary | Related |
| --- | --- | --- |
| AINS6400 Robot Perception & Spatial AI | `AI-152` Robotics & Embodied AI | `AI-105` CV, `Eng-109` Robotics |
| AINS6401 Motion Planning, Control & Learning | `Eng-104` Control Systems | `Eng-403` Advanced Robotics, `AI-106` RL |
| AINS6402 Multi-Robot Systems & HRI | `AI-151` Multi-Agent Systems | `Eng-403` Advanced Robotics |

## Findings

- **Five core courses map cleanly** to the AI college (AINS6002→AI-102, 6003→AI-103, 6004→AI-104,
  6005→AI-109, 6006→AI-108). These flow through the direct/MagAI path with no ambiguity.
- **Specializations are programs, not courses.** Aurnova Business ≈ the active `AIN-COM-MAG`;
  Aurnova Healthcare ≈ the planned `AIN-HLT-MAG`. Reconcile Aurnova's clusters with magisterium's
  program model rather than inventing parallel course codes.
- **Two Aurnova domains have no magisterium program** (Cybersecurity, Robotics) — candidates to add
  as `AIN-<domain>-MAG` programs, or map to CS/Eng courses.
- **Three AINS have no canonical course:** `AINS6007` (Python on-ramp), `AINS6009` (capstone = the
  credentialing defense, not a course), `AINS6010` (Sovereign AI, Castalia-specific).

## Decisions surfaced

1. **Canonical identity = magisterium college codes** for the direct/MagAI path. Provisioning
   profiles are keyed on them; `provisioning-profiles.ts` now resolves the exact-match Aurnova
   codes via an alias table.
2. **Fill the gaps or scope them out:** for `AINS6007`/`6010` and the Cybersecurity/Robotics
   domains, either add magisterium courses/programs or mark them Aurnova-institutional-only (they
   earn Aurnova's MSAI, not MagAI). `AINS6009` should map to the Socratic defense, not a course.
3. **Aurnova capstone ↔ Mag defense:** the same three-faculty Socratic review that awards MagAI can
   satisfy the AINS6009 capstone for institutional learners who also pursue the credential.
