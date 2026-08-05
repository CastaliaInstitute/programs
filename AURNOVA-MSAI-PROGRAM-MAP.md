# AurNova MSAI — Program Map & Recommended Sequence

Working reference for AurNova's Master of Science in Artificial Intelligence, assembled from the
licensed `AINS` graduate courses (see `AINS-Courses.md`). Castalia licenses the courses; AurNova
defines the official program title, credit values, admissions rules, and catalog copy. This
document is the recommended assembly, not a contractual constraint.

## Program shape (reference)

- **36 credit hours** total (assuming 3 credits per course)
- **27 core credits** — AINS6001–AINS6009 (capstone included)
- **9 specialization credits** — one three-course cluster: Healthcare, Business, Cybersecurity, or Robotics
- **100% online** in the current course designs

## Admission readiness policy

The core sequence assumes working knowledge of probability, linear algebra, and basic
programming. AurNova should adopt **one** of the following (in order of preference):

1. **Stated admissions prerequisite** — undergraduate coursework (or equivalent) in
   statistics/probability, linear algebra, and one programming language, enforced at admission.
2. **Bridge course** — admit conditionally and require `AINS5001` (A Modern Approach to AI,
   certificate line) before beginning the core sequence.
3. **Embedded bootcamp** — a non-credit math and Python readiness module delivered alongside
   Term 1 (inside the AINS6001/AINS6007 shells) for admits who miss the prerequisite bar.

Whichever option is chosen, publish it in the AurNova catalog; do not leave readiness implicit.

## Prerequisite graph

Course numbering does **not** imply sequence. The working dependencies are:

| Course | Depends on |
| --- | --- |
| AINS6007 Applied AI Programming with Python | — (take first) |
| AINS6001 Foundations of AI | — |
| AINS6005 AI Ethics, Law & Policy | — |
| AINS6002 Machine Learning & Predictive Modeling | AINS6007, AINS6001 |
| AINS6006 Big Data Management | AINS6007 |
| AINS6008 AI Project Management & Deployment | AINS6001 |
| AINS6003 Deep Learning & Neural Networks | AINS6002 |
| AINS6004 Natural Language Processing | AINS6002 (AINS6003 recommended prior or concurrent) |
| Specialization courses (61xx/62xx/63xx/64xx) | AINS6002; AINS6003 for Healthcare and Robotics clusters |
| AINS6009 Capstone Project | Core complete or concurrent-final-term; taken within the chosen specialization |

## Recommended term map — full-time (4 terms, 9 credits/term)

| Term | Courses | Credits |
| --- | --- | --- |
| 1 | AINS6007 Applied AI Programming with Python · AINS6001 Foundations of AI · AINS6005 AI Ethics, Law & Policy | 9 |
| 2 | AINS6002 Machine Learning & Predictive Modeling · AINS6006 Big Data Management · AINS6008 AI Project Management & Deployment | 9 |
| 3 | AINS6003 Deep Learning & Neural Networks · AINS6004 Natural Language Processing · Specialization course 1 | 9 |
| 4 | Specialization course 2 · Specialization course 3 · AINS6009 Capstone Project | 9 |

Notes:

- AINS6004's language-model units build on AINS6003's attention/transformer modules; in a
  split-term or 8-week block model, schedule the 6003 architecture modules before the 6004
  language-model modules. Institutions preferring strict ordering can move AINS6004 to Term 4
  and a specialization course to Term 3.
- The capstone is completed **within the chosen specialization** and runs in the final term,
  after at least one specialization course.

## Recommended term map — part-time (6 terms, 6 credits/term)

| Term | Courses |
| --- | --- |
| 1 | AINS6007 · AINS6001 |
| 2 | AINS6002 · AINS6005 |
| 3 | AINS6003 · AINS6006 |
| 4 | AINS6004 · AINS6008 |
| 5 | Specialization courses 1–2 |
| 6 | Specialization course 3 · AINS6009 Capstone |

## Capstone (AINS6009) — working specification

- **Credits:** 3 (final term). Institutions wanting a 6-credit capstone can pair it with an
  independent-study shell on the AurNova side.
- **Placement:** final term, concurrent with or after the specialization cluster; project topic
  must sit within the chosen specialization.
- **Sponsorship:** industry-sponsored where AurNova has partners; student-designed with faculty
  approval otherwise.
- **Deliverables:** proposal with ethics checklist (Phase 1), working artifact with milestone
  demos and reproducibility package (Phase 2), final evaluation report + stakeholder
  presentation + handoff documentation (Phase 3).

## Disclosures for AurNova program committee

Items to surface before launch, so they are decisions rather than discoveries:

- **Robotics cluster (AINS6400–6402):** assumes kinematics/dynamics/control background not
  provided by the AI core. Labs are **simulator-first** with optional hardware tie-ins; the
  100%-online claim holds only for the simulator path. Map prerequisites from robotics or
  mechanical engineering coursework if AurNova offers this track.
- **AINS6202 (AI Strategy for Executives):** a leadership/strategy seminar, not a technical
  course. Appropriate inside the Business cluster; position it accordingly in the catalog.
- **Healthcare cluster (AINS6100–6102):** taught as education/simulation; not clinical training
  and not medical advice. Regulatory content is survey-level.
- **Learning outcomes:** per-course measurable CLOs and an assessment plan are required for
  accreditation review and are authored separately from this map (in progress).
