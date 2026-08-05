# Course Repositories

This file defines the repository and Jupyter Book naming scheme for each `AINS` graduate course in the Castalia catalog. Most course books are built and published — see **Current status** below.

## Naming Convention

- GitHub repository: `ains-<course-number>-<slug>`
- Jupyter Book title: `<course-code> <course-title>`
- GitHub Pages URL pattern: `https://CastaliaInstitute.github.io/<repo-name>/`

## Current status (verified 2026-08-05)

**Phase 1 is published.** All 18 Phase 1 course books resolve as published Jupyter Books at the Pages URL pattern above: the full core sequence (AINS6001–6009) and the Healthcare, Business, and Cybersecurity specialization clusters.

**Phase 2** courses (not yet published):

- `AINS6010` Sovereign AI (certificate course)
- `AINS6400`–`AINS6402` (Robotics specialization cluster)

## Core Courses

| Course | Title | Repository | Jupyter Book Title |
| --- | --- | --- | --- |
| `AINS6001` | Foundations of Artificial Intelligence | `ains-6001-foundations-of-artificial-intelligence` | `AINS6001 Foundations of Artificial Intelligence` |
| `AINS6002` | Machine Learning & Predictive Modeling | `ains-6002-machine-learning-and-predictive-modeling` | `AINS6002 Machine Learning & Predictive Modeling` |
| `AINS6003` | Deep Learning & Neural Networks | `ains-6003-deep-learning-and-neural-networks` | `AINS6003 Deep Learning & Neural Networks` |
| `AINS6004` | Natural Language Processing | `ains-6004-natural-language-processing` | `AINS6004 Natural Language Processing` |
| `AINS6005` | AI Ethics, Law & Policy | `ains-6005-ai-ethics-law-and-policy` | `AINS6005 AI Ethics, Law & Policy` |
| `AINS6006` | Big Data Management for AI Applications | `ains-6006-big-data-management-for-ai-applications` | `AINS6006 Big Data Management for AI Applications` |
| `AINS6007` | Applied AI Programming with Python | `ains-6007-applied-ai-programming-with-python` | `AINS6007 Applied AI Programming with Python` |
| `AINS6008` | AI Project Management & Deployment | `ains-6008-ai-project-management-and-deployment` | `AINS6008 AI Project Management & Deployment` |
| `AINS6009` | Capstone Project | `ains-6009-capstone-project` | `AINS6009 Capstone Project` |

## Certificate Course

| Course | Title | Repository | Jupyter Book Title |
| --- | --- | --- | --- |
| `AINS6010` | Sovereign AI | `ains-6010-sovereign-ai` | `AINS6010 Sovereign AI` |

## Healthcare AI Specialization

| Course | Title | Repository | Jupyter Book Title |
| --- | --- | --- | --- |
| `AINS6100` | AI in Medical Imaging | `ains-6100-ai-in-medical-imaging` | `AINS6100 AI in Medical Imaging` |
| `AINS6101` | Predictive Analytics in Population Health | `ains-6101-predictive-analytics-in-population-health` | `AINS6101 Predictive Analytics in Population Health` |
| `AINS6102` | AI for Clinical Decision Support | `ains-6102-ai-for-clinical-decision-support` | `AINS6102 AI for Clinical Decision Support` |

## Business AI Specialization

| Course | Title | Repository | Jupyter Book Title |
| --- | --- | --- | --- |
| `AINS6200` | AI for Marketing & Customer Insights | `ains-6200-ai-for-marketing-and-customer-insights` | `AINS6200 AI for Marketing & Customer Insights` |
| `AINS6201` | Automation & Process Optimization | `ains-6201-automation-and-process-optimization` | `AINS6201 Automation & Process Optimization` |
| `AINS6202` | AI Strategy for Executives | `ains-6202-ai-strategy-for-executives` | `AINS6202 AI Strategy for Executives` |

## Cybersecurity AI Specialization

| Course | Title | Repository | Jupyter Book Title |
| --- | --- | --- | --- |
| `AINS6300` | AI in Threat Detection | `ains-6300-ai-in-threat-detection` | `AINS6300 AI in Threat Detection` |
| `AINS6301` | Automated Response Systems | `ains-6301-automated-response-systems` | `AINS6301 Automated Response Systems` |
| `AINS6302` | AI for Risk Assessment | `ains-6302-ai-for-risk-assessment` | `AINS6302 AI for Risk Assessment` |

## Robotics AI Specialization

| Course | Title | Repository | Jupyter Book Title |
| --- | --- | --- | --- |
| `AINS6400` | Robot Perception & Spatial AI | `ains-6400-robot-perception-and-spatial-ai` | `AINS6400 Robot Perception & Spatial AI` |
| `AINS6401` | Motion Planning, Control & Learning for Autonomous Systems | `ains-6401-motion-planning-control-and-learning-for-autonomous-systems` | `AINS6401 Motion Planning, Control & Learning for Autonomous Systems` |
| `AINS6402` | Multi-Robot Systems & Human-Robot Interaction | `ains-6402-multi-robot-systems-and-human-robot-interaction` | `AINS6402 Multi-Robot Systems & Human-Robot Interaction` |

## Recommended Book Scaffold Per Repository

Each course repository should include:

- `README.md` with course summary and link to the live book
- `requirements.txt` or `environment.yml` for Jupyter Book dependencies
- `_config.yml` for Jupyter Book configuration
- `_toc.yml` for book structure
- `Makefile` or equivalent build commands for HTML, PDF, and EPUB exports
- `intro.md` for course overview
- `syllabus.md` for outcomes, assessments, and pacing
- `modules/` as the single source of course content authored in Markdown
- prose, assignments, slide decks, narration, and instructor notes embedded as pages or sections within the same book
- `notebooks/` for executable examples and labs
- `.github/workflows/` GitHub Pages deployment workflow

## Required Content Layers

Every course Jupyter Book should be authored in Markdown and support five distinct instructional layers inside the same book:

1. `Book prose`
   Each course needs readable chapter-style content that can stand on its own as the primary student-facing text.
2. `Assignments`
   Each course needs assignment briefs, assessment criteria, deliverables, and pacing guidance as executable book pages within the course structure. Assignments should use Jupyter Book with Thebe so students can fill in cells, run code, and work directly inside the book. Notebook-backed assignment content should be able to use `ipywidgets` for text boxes, dropdowns, sliders, tabs, and related controls.
3. `Slides`
   Each course needs presentation-ready lecture or seminar slide content authored as Jupyter notebooks for use in JupyterLab with RISE. These slide notebooks should still be part of the same book structure.
4. `Narration`
   Each slide deck needs accompanying speaker narration as adjacent book pages or clearly linked sections so the course can support asynchronous or recorded delivery.
5. `Instructor notes`
   Each course needs instructor-facing teaching notes, including facilitation guidance, lesson aims, misconceptions, and grading cues, organized within the same book source.

## Suggested Internal Structure

Within each course repo, a practical default layout is one integrated Jupyter Book:

- `intro.md`
- `syllabus.md`
- `modules/module-1/overview.md`
- `modules/module-1/book-prose.md`
- `modules/module-1/assignment.md`
- `modules/module-1/slides.ipynb`
- `modules/module-1/narration.md`
- `modules/module-1/instructor-notes.md`
- `modules/module-2/overview.md`
- `modules/module-2/book-prose.md`
- `modules/module-2/assignment.md`
- `modules/module-2/slides.ipynb`
- `modules/module-2/narration.md`
- `modules/module-2/instructor-notes.md`
- `notebooks/module-1-lab.ipynb`
- `notebooks/module-2-lab.ipynb`

In this model, the Jupyter Book table of contents should expose all learner-facing and instructor-facing materials as one navigable book rather than splitting them into separate products.

Assignments should be authored as Markdown pages with executable code-cell directives or notebook-backed content so Thebe can turn them into interactive student workspaces in the published book.

Where interaction improves the learning experience, assignment notebooks should use `ipywidgets` to provide structured response controls, guided exploration interfaces, and compact multi-step workflows inside the same book page.

## Export Requirements

Each course repo should support:

- `HTML` for GitHub Pages delivery
- `PDF` export through the LaTeX build path
- `EPUB` export alongside the book build workflow

The template repo should include the commands and workflow structure needed to produce all three formats, even if HTML remains the primary published target.

## Template Expectations

The first template repository should not be an empty shell. It should demonstrate:

- one complete Markdown prose chapter
- one complete Thebe-enabled assignment page
- one complete RISE slide notebook
- one matching narration page
- one instructor-notes page
- one example notebook or lab

The assignment example should demonstrate at least one `ipywidgets` interaction pattern.

That way every later course repo can be cloned from a production-grade instructional template rather than a bare publishing scaffold.

## Phase 2 Rollout

Phase 1 (core sequence, capstone, and the Healthcare, Business, and Cybersecurity clusters) is published. Phase 2:

1. `AINS6400`–`AINS6402` robotics cluster — publish before any partner offers the Robotics AI track
2. `AINS6010` Sovereign AI — publish before the certificate line is sold as delivery-ready
