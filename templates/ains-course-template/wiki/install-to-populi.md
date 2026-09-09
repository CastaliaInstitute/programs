# Wiki: Install this course into Populi (IMS Common Cartridge)

This course ships as an **IMS Common Cartridge** (`.imscc`) so it can be imported into Populi (or
any Common-Cartridge-compatible LMS). The cartridge carries the syllabus, module pages, readings,
and assignment shells; the interactive code work still happens in this GitHub repo / inqspace.

> **Import into the PRODUCTION Populi site.** Content import is **disabled in the Populi sandbox**,
> so the cartridge won't import there — use the live/production instance (with a role that can
> manage the course). Test with one course first before importing the full term.

## What you need

- The course cartridge: `course.imscc` (built from `book/` — see "Building the cartridge" below).
- A Populi account with permission to manage the target course (Faculty/Registrar role).

## Import into Populi

1. In Populi, open the **Course** (the specific course + term you're importing into).
2. Go to the course's **Info → Lessons** (or **Files**) area.
3. Choose **Import** and select **Common Cartridge / IMS CC**.
4. Upload `course.imscc`.
5. Review the imported items (pages, links, assignments), then **publish** the lessons for
   students.

> Populi's exact menu labels can change between releases; if you don't see a Common Cartridge
> option under Lessons, check **Import Content** on the course, or contact your Populi
> administrator. Verify the flow against your Populi instance before a cohort relies on it.

## After import

- The cartridge gives students the readable course in Populi. Point them to this repo (and
  inqspace) for the **assignments and code work** — the cartridge links back here.
- Grades/credential: completion is the Socratic defense (see `../exam/README.md`), recorded with
  magisterium — Populi holds the enrollment and readable content, not the credential.

## Building the cartridge

The `.imscc` is produced from `book/` during the course build (the same content, packaged for LMS
import). See the course build workflow (`.github/workflows/deploy.yml`) and the platform's cartridge
build tooling; the output `course.imscc` is what you upload above.
