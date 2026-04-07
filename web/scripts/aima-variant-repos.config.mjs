/**
 * Maps MyST sources in myst-sources/ain2001/*.md → standalone GitHub repo names + metadata.
 * Repo names: aima-basic, aima-delivery, … (user-facing delivery products).
 */
export const AIMA_VARIANT_REPOS = [
  {
    repo: 'aima-basic',
    sourceFile: 'basic.md',
    packageName: 'aima-basic',
    projectTitle: 'AIMA5001 Basic',
    description: 'AIMA 5001 Basic — graduate LMS-first delivery (MyST)',
  },
  {
    repo: 'aima-delivery',
    sourceFile: 'ai-delivery.md',
    packageName: 'aima-delivery',
    projectTitle: 'AIMA5001 AI Delivery',
    description: 'AIMA 5001 AI Delivery — hosted slides path (MyST)',
  },
  {
    repo: 'aima-classroom',
    sourceFile: 'classroom.md',
    packageName: 'aima-classroom',
    projectTitle: 'AIMA5001 Classroom',
    description: 'AIMA 5001 Classroom — GitHub Classroom + Codespaces (MyST)',
  },
  {
    repo: 'aima-dialogic',
    sourceFile: 'dialogic.md',
    packageName: 'aima-dialogic',
    projectTitle: 'AIMA5001 Dialogic',
    description: 'AIMA 5001 Dialogic — co-teaching slides (MyST)',
  },
  {
    repo: 'aima-samwise',
    sourceFile: 'samwise.md',
    packageName: 'aima-samwise',
    projectTitle: 'AIMA5001 SAMWISE',
    description: 'AIMA 5001 SAMWISE — curriculum tooling (MyST)',
  },
  {
    repo: 'aima-beatrice',
    sourceFile: 'beatrice.md',
    packageName: 'aima-beatrice',
    projectTitle: 'AIMA5001 BEATRICE',
    description: 'AIMA 5001 BEATRICE — AI teaching assistant (MyST)',
  },
]
