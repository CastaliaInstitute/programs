# Castalia course — working template

This is the template every learner's course repository is generated from (GitHub "generate", via
the Castalia GitHub App). Source of truth lives in `CastaliaInstitute/programs`
(`templates/ains-course-template/`); it is pushed to `CastaliaInstitute/ains-course-template`,
which is marked as a GitHub template repo.

## What a learner gets

- **`book/`** — the course as a Jupyter Book (prose, slides, narration, instructor notes).
- **`work/`** — your working area. You push here.
- **`exam/`** — the Socratic-defense transcript. **You cannot write here** — only the Castalia
  App does (see `exam/README.md`). This is what makes the credential tamper-evident.
- **inqspace** — open the repo in inqspace (Castalia's cloud workspace) to run everything; no
  local setup. See `.inqspace/config.json`.
- **`castalia-course.json`** — which teaching features are enabled (set by the provisioner).
- **`wiki/`** — how-to docs, including **installing the course cartridge (`.imscc`) into Populi**
  (`wiki/install-to-populi.md`).

## How completion works

You do the work in `work/`, then sit the **Socratic defense**: three AI faculty question you and
judge fluency. On a pass, `.github/workflows/completion.yml` records the evidence (repo + exam
transcript, pinned to a commit and hashed) with magisterium, which issues the credential and a
unique verification id. You never touch a token or a policy.
