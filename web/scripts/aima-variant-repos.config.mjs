/**
 * Maps Markdown sources in demo-sources/ain2001/*.md → standalone GitHub repo names + metadata.
 * Repo names: aima-basic, aima-delivery, … (user-facing delivery products).
 * Populi shell fields drive the static HTML layout on GitHub Pages.
 */
export const AIMA_VARIANT_REPOS = [
  {
    repo: 'aima-basic',
    sourceFile: 'basic.md',
    packageName: 'aima-basic',
    projectTitle: 'AIMA5001 Basic',
    description: 'AIMA 5001 Basic — graduate LMS-first delivery (Markdown)',
    courseCode: 'AIMA 5001',
    courseTitle: 'Basic',
    pillLabel: 'AIMA5001: Basic',
  },
  {
    repo: 'aima-delivery',
    sourceFile: 'ai-delivery.md',
    packageName: 'aima-delivery',
    projectTitle: 'AIMA5001 AI Delivery',
    description: 'AIMA 5001 AI Delivery — hosted slides path',
    courseCode: 'AIMA 5001',
    courseTitle: 'AI Delivery',
    pillLabel: 'AIMA5001: AI Delivery',
  },
  {
    repo: 'aima-classroom',
    sourceFile: 'classroom.md',
    packageName: 'aima-classroom',
    projectTitle: 'AIMA5001 Classroom',
    description: 'AIMA 5001 Classroom — GitHub Classroom + Codespaces',
    courseCode: 'AIMA 5001',
    courseTitle: 'Classroom',
    pillLabel: 'AIMA5001: Classroom',
  },
  {
    repo: 'aima-dialogic',
    sourceFile: 'dialogic.md',
    packageName: 'aima-dialogic',
    projectTitle: 'AIMA5001 Dialogic',
    description: 'AIMA 5001 Dialogic — co-teaching slides',
    courseCode: 'AIMA 5001',
    courseTitle: 'Dialogic',
    pillLabel: 'AIMA5001: Dialogic',
  },
  {
    repo: 'aima-samwise',
    sourceFile: 'samwise.md',
    packageName: 'aima-samwise',
    projectTitle: 'AIMA5001 SAMWISE',
    description: 'AIMA 5001 SAMWISE — curriculum tooling',
    courseCode: 'AIMA 5001',
    courseTitle: 'SAMWISE',
    pillLabel: 'AIMA5001: SAMWISE',
  },
  {
    repo: 'aima-beatrice',
    sourceFile: 'beatrice.md',
    packageName: 'aima-beatrice',
    projectTitle: 'AIMA5001 BEATRICE',
    description: 'AIMA 5001 BEATRICE — AI teaching assistant',
    courseCode: 'AIMA 5001',
    courseTitle: 'BEATRICE',
    pillLabel: 'AIMA5001: BEATRICE',
  },
]
