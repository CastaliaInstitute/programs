# Aurnova Populi import — runbook for Claude in Chrome

The Q1 cartridges must be imported into Populi via its UI (no API for content import). Run this
with **Claude in Chrome** in the browser where your Populi sandbox is logged in — it acts in your
authenticated session, which a cloud agent can't reach. Have the six `.imscc` files downloaded
first (student + instructor for AIN6001 / AIN6005 / AIN6007).

## Cartridge → course mapping

| Course | Student file → student course | Instructor file → faculty course |
| --- | --- | --- |
| AIN6001 Foundations of AI | `ain6001-student.imscc` | `ain6001-instructor.imscc` |
| AIN6005 AI Ethics, Law & Policy | `ain6005-student.imscc` | `ain6005-instructor.imscc` |
| AIN6007 Applied AI Programming | `ain6007-student.imscc` | `ain6007-instructor.imscc` |

The **student** cartridge goes in the student-facing course offering; the **instructor** cartridge
(solutions, grading keys, notes) goes only in the faculty/section course — never the student one.

## Step 1 — test import (paste into Claude in Chrome)

> You are helping me import course content into our Populi sandbox
> (`aurnovau.sandbox.populi.co`). I have IMS Common Cartridge (`.imscc`) files in my Downloads.
> Work one step at a time and take a screenshot before each click so I can confirm.
>
> 1. Go to course offering **112** (the one I have open).
> 2. Find how to import content — look for **Import**, **Common Cartridge**, or **IMS** (usually
>    under the course offering's **Info**, **Lessons**, or **Files/Content** tab, or its settings).
> 3. Start a **Common Cartridge / IMS CC** import.
> 4. Upload **`ain6001-student.imscc`**.
> 5. Proceed. If Populi shows a preview/mapping of imported items (Module 1–8 and pages),
>    **pause before finalizing**, show me the structure, and tell me what you see.
> 6. If the importer shows any **error** or rejects the file, **stop and report the exact error
>    text to me verbatim**.

## Step 2 — full rollout (after the test works)

> Repeat the Common Cartridge import for each row below, uploading the file into the matching
> course offering. Take a screenshot after each import and list what imported. Report any error
> verbatim and move on to the next.
>
> - `ain6001-student.imscc` → AIN6001 student course
> - `ain6001-instructor.imscc` → AIN6001 faculty course
> - `ain6005-student.imscc` → AIN6005 student course
> - `ain6005-instructor.imscc` → AIN6005 faculty course
> - `ain6007-student.imscc` → AIN6007 student course
> - `ain6007-instructor.imscc` → AIN6007 faculty course
>
> (I'll give you each course offering number, or find it by course code in Populi.)

## Verify

Each imported course should show the module tree (Module 1–8) with pages under each
(overview, book prose, assignment, narration, rubric). The instructor course additionally shows
instructor notes and an "Instructor resources" section.

## If Populi rejects a cartridge

Paste the exact error back to me. The cartridges are IMS CC 1.1.0 (`imsmanifest.xml` +
`web_resources/*.html`), built by `automation/build-cartridge.mjs`; I'll adjust the manifest/format
to match Populi's importer and rebuild.
