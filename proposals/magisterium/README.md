# Proposed magisterium migration

`006_aurnova_alignment.sql` is a **proposal for `CastaliaInstitute/magisterium`**, not for this
repo. It belongs at `supabase/migrations/006_aurnova_alignment.sql` there. It lives here as a
reviewable artifact from the Aurnova↔magisterium course-code reconciliation
([`../../COURSE-CODE-MAP.md`](../../COURSE-CODE-MAP.md)).

## What it proposes

1. **Two courses** (safe, additive) that fill real catalog gaps:
   - `CS-100 Programming Foundations` — from-zero Python on-ramp (fills the `AINS6007` gap; the CS
     catalog starts at CS-101 and assumes programming).
   - `AI-157 Sovereign & Private AI` — on-prem/edge/private inference (fills the `AINS6010` gap).
2. **A `program_courses` link table** (optional structural addition) so a program's composing
   courses can be expressed, seeded for `AIN-COM-MAG` (Mag.AI in Commerce ≈ Aurnova Business AI).

## What it deliberately does NOT do

It does **not** add `AIN-SEC-MAG`/`AIN-ROB-MAG`. Magisterium's `application_college_code` is a
closed enum of ten domains with no security/robotics entry, so:

- **Cybersecurity AI** → the existing `AIN-INT-MAG` (Intelligence), or `AIN-WAR-MAG` (defense).
- **Robotics AI** → an embodied-AI *capability*, not an application domain — compose from
  `AI-151/152` + `Eng-104/109/403`, or a School-of-Engineering Magister.

Adding a domain would be an enum migration and a naming decision for magisterium's owners, not a
seed — flagged rather than assumed.

## Applying it

Grounded in magisterium's schema as of the read on 2026-08-06 (`001`–`005`). Open it as a PR
against `CastaliaInstitute/magisterium` (this session can, with push access) — say the word.
