# Aurnova MSAI — Program Map & Recommended Sequence

Operational companion for Aurnova University's Master of Science in Artificial Intelligence,
assembled from the licensed `AINS` graduate courses (see `AINS-Courses.md`).

**The definitive public program map is <https://aurnova.com/msai/>.** Aurnova defines the
official program title, codes, credits, admissions rules, and catalog copy; this document
covers the Castalia side — sequencing recommendations, delivery repositories, and items to
reconcile. Where this document and aurnova.com disagree, aurnova.com wins and this document
should be updated.

## Program shape (per aurnova.com/msai, retrieved 2026-08-06)

- **Credential:** Master of Science in Artificial Intelligence (MSAI), 100% online
- **36 credit hours** — 27 core + 9 specialization, all courses 3 credits
- **Core:** AIN6001–AIN6009 (capstone included)
- **Specializations (choose one, 3 courses):** Healthcare AI, Business AI, Cybersecurity AI
- **Course codes:** Aurnova publishes the courses as `AIN####` — same numbering as Castalia's
  `AINS####` repos and catalog, without the S. Titles and descriptions match `AINS-Courses.md`
  (Aurnova's AIN6009 capstone description is a local rewrite).
- **Tuition + fees:** $19,000 total ($18,000 tuition + $1,000 administration fee); no Title IV
- **Typical completion:** 18–24 months

## Audience & admission readiness

The Aurnova MSAI is designed to be completable by students **without a programming
background**. Programming is taught inside the program, not assumed at admission:

- **No programming prerequisite.** `AINS6007` (Applied AI Programming with Python) is the
  program's on-ramp, taught from zero in Term 1; every coding-dependent course sits after it
  in the sequence.
- **Scaffolded coding, not blank-editor coding.** Coding-heavy courses deliver assignments as
  executable Jupyter Book pages (Thebe + `ipywidgets`, per `COURSE-REPOSITORIES.md`), so
  students run, modify, and complete guided code inside the book rather than authoring
  programs from scratch.

> **⚠️ Unresolved conflict with the published admissions page.** aurnova.com/msai currently
> requires "Coursework in calculus, statistics, and Python programming" and "Familiarity with
> data structures and algorithm analysis," and the "Who is this program for?" section
> describes applicants with CS-adjacent degrees and TensorFlow/PyTorch proficiency. That
> directly contradicts the non-programming-audience design above. If the no-Python-prerequisite
> goal stands, Aurnova's admission requirements and audience copy need revision; if the
> published requirements stand, AIN6007 is remedial rather than an on-ramp and this section
> should be rewritten. One of the two must change.

**Quantitative readiness** is still needed for the ML/DL sequence. Aurnova should adopt
**one** of the following (in order of preference):

1. **Stated admissions expectation** — college-level algebra and introductory statistics (no
   programming), enforced at admission.
2. **Bridge course** — admit conditionally and require `AINS5001` (A Modern Approach to AI,
   certificate line) before beginning the core sequence.
3. **Embedded bootcamp** — a non-credit quantitative readiness module delivered alongside
   Term 1 (inside the AINS6001/AINS6007 shells) for admits who miss the expectation.

Whichever option is chosen, publish it in the Aurnova catalog; do not leave readiness implicit.

## Prerequisite graph

Course numbering does **not** imply sequence. The working dependencies are:

| Course | Depends on |
| --- | --- |
| AINS6007 Applied AI Programming with Python | — (take first; assumes no prior programming) |
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
  independent-study shell on the Aurnova side.
- **Placement:** final term, concurrent with or after the specialization cluster; project topic
  must sit within the chosen specialization.
- **Sponsorship:** industry-sponsored where Aurnova has partners; student-designed with faculty
  approval otherwise.
- **Deliverables:** proposal with ethics checklist (Phase 1), working artifact with milestone
  demos and reproducibility package (Phase 2), final evaluation report + stakeholder
  presentation + handoff documentation (Phase 3).

## Course repositories & delivery

Every course in the program has an **individual course repository** published as a Jupyter
Book, following the naming scheme in `COURSE-REPOSITORIES.md`:

- Repository: `ains-<course-number>-<slug>` (e.g. `ains-6007-applied-ai-programming-with-python`)
- Published book: `https://CastaliaInstitute.github.io/<repo-name>/`

**Published status (verified 2026-08-05):** Phase 1 is fully live at the URL pattern above —
the complete core sequence (AINS6001–6009) and the Healthcare, Business, and Cybersecurity
clusters. The Robotics cluster (AINS6400–6402) and AINS6010 are Phase 2 courses, not yet
published.

Each book carries the five instructional layers (prose, Thebe-enabled assignments, RISE
slides, narration, instructor notes), so a course is deliverable to Aurnova as a
self-contained artifact. The executable-assignment layer (Thebe + `ipywidgets`) is what makes
the non-programmer design work: it is the mechanism by which students in AINS6002–6004 and
the specializations do real work with code they did not have to write from a blank editor.

## Disclosures for Aurnova program committee

Items to surface before launch, so they are decisions rather than discoveries:

- **Robotics cluster (AINS6400–6402):** assumes kinematics/dynamics/control background not
  provided by the AI core. Labs are **simulator-first** with optional hardware tie-ins; the
  100%-online claim holds only for the simulator path. Map prerequisites from robotics or
  mechanical engineering coursework if Aurnova offers this track.
- **AINS6202 (AI Strategy for Executives):** a leadership/strategy seminar, not a technical
  course. Appropriate inside the Business cluster; position it accordingly in the catalog.
- **Healthcare cluster (AINS6100–6102):** taught as education/simulation; not clinical training
  and not medical advice. Regulatory content is survey-level.
- **Scaffolding is load-bearing for non-programmers:** the no-programming-prerequisite design
  holds only if the Thebe assignment layer in each published book is complete, not just
  present. Before the first cohort, audit the executable assignments in AINS6007 and the
  Term 2 courses specifically for from-zero students.
- **Robotics track is Phase 2:** the Robotics cluster (AINS6400–6402) is scheduled for
  Phase 2 delivery, and aurnova.com/msai consistently lists only the three Phase 1 tracks
  (Healthcare, Business, Cybersecurity). Keep Robotics off the Aurnova catalog until the
  Phase 2 books publish. Students entering in year one reach their specialization no earlier
  than Term 3 — that is the window Phase 2 has to land in if Robotics is to be offered to the
  first cohort.
- **Learning outcomes:** per-course measurable CLOs and an assessment plan are required for
  accreditation review and are authored separately from this map (in progress).
