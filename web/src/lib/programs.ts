/** One licensable product line for AIMA 5001, named like a course (e.g. AIMA5001: Basic). */
export interface DeliverableDemo {
  /** Display name, e.g. `AIMA5001: Basic` or `AIMA5001: AI Delivery`. */
  courseCode: string
  summary: string
  primaryLabel: string
  primaryHref: string
  secondaryLabel?: string
  secondaryHref?: string
}

export interface ProgramOffering {
  slug: string
  title: string
  format: string
  audience: string
  duration: string
  credits?: string
  modality: string
  implementation: string
  summary: string
  outcomes: string[]
  institutionFit: string[]
  curriculumHighlights?: string[]
  specializations?: {
    title: string
    courses: string[]
  }[]
  /** Link to a detail page (e.g. live product demos) */
  detailHref?: string
  deliverableDemos?: DeliverableDemo[]
}

/** Canonical AIMA course repo (Russell & Norvig AIMA, GitHub-native delivery). */
export const AIMA_REPO = 'https://github.com/InquiryInstitute/aima' as const

/** Same thin IMS CC for every AIMA deliverable demo (LMS import). Built in `npm run build:demos`. */
export const AIMA_IMSCC_DEMO = '/demos/aima-lms-demo.imscc' as const

/** Static viewer for unpacked cartridge content (PDF / markdown) on GitHub Pages. */
export const IMSCC_VIEWER_PATH = '/catalog/imscc-viewer' as const

/** MyST-built AIMA 5001 demo site (`npm run build:demos` → public/demos/myst/ain2001/). */
export const MYST_AIMA5001_BASE = '/demos/myst/ain2001' as const

export const programOfferings: ProgramOffering[] = [
  {
    slug: 'msai',
    title: 'MSAI',
    format: "36-credit online master's degree",
    audience: 'Universities, graduate divisions, and adult-serving online programs',
    duration: '36 credit hours across core plus specialization study',
    credits: '36 total credits',
    modality: '100% online',
    implementation: 'Degree-ready curriculum with core, specializations, and capstone',
    summary:
      'A complete Master of Science in Artificial Intelligence curriculum designed for institutional launch, including a 27-credit core, 9-credit specialization tracks, and a culminating capstone.',
    outcomes: [
      'Launch a full graduate AI degree with an academically coherent core sequence.',
      'Offer differentiated specialization pathways in healthcare, business, or cybersecurity AI.',
      'Support workforce-relevant outcomes with technical, ethical, and project-based training.',
    ],
    institutionFit: [
      'Universities building new AI graduate offerings',
      'Colleges expanding online and professional master’s portfolios',
      'Institutions seeking fast program launch without writing curriculum from scratch',
    ],
    curriculumHighlights: [
      'AINS6001 Foundations of Artificial Intelligence',
      'AINS6002 Machine Learning & Predictive Modeling',
      'AINS6003 Deep Learning & Neural Networks',
      'AINS6004 Natural Language Processing',
      'AINS6005 AI Ethics, Law & Policy',
      'AINS6006 Big Data Management for AI Applications',
      'AINS6007 Applied AI Programming with Python',
      'AINS6008 AI Project Management & Deployment',
      'AINS6009 Capstone Project',
      'AINS6010 Local AI & Deployment to Hardware certificate course',
    ],
    specializations: [
      {
        title: 'Healthcare AI',
        courses: [
          'AINS6100 AI in Medical Imaging',
          'AINS6101 Predictive Analytics in Population Health',
          'AINS6102 AI for Clinical Decision Support',
        ],
      },
      {
        title: 'Business AI',
        courses: [
          'AINS6200 AI for Marketing & Customer Insights',
          'AINS6201 Automation & Process Optimization',
          'AINS6202 AI Strategy for Executives',
        ],
      },
      {
        title: 'Cybersecurity AI',
        courses: [
          'AINS6300 AI in Threat Detection',
          'AINS6301 Automated Response Systems',
          'AINS6302 AI for Risk Assessment',
        ],
      },
    ],
  },
  {
    slug: 'local-ai-certificate',
    title: 'Local AI & Deployment to Hardware',
    format: 'Certificate course',
    audience: 'Institutions building edge AI, applied AI, or hardware-facing certificates',
    duration: 'Single-course certificate or stackable module',
    credits: 'Certificate portfolio course',
    modality: 'Online with practical deployment labs',
    implementation: 'Certificate-ready applied technical course',
    summary:
      'A focused course on running AI models on edge devices, on-premises servers, and embedded systems for institutions that want practical, non-cloud AI deployment training.',
    outcomes: [
      'Teach students to optimize and deploy models under hardware constraints.',
      'Expand an AI program with edge, embedded, and local inference capability.',
      'Package as a standalone certificate module or elective inside a larger AI program.',
    ],
    institutionFit: [
      'Applied AI and engineering programs',
      'Cyber-physical systems curricula',
      'Certificate portfolios for workforce and technical learners',
    ],
  },
  {
    slug: 'aima',
    title: 'AIMA 5001 — AIMA (Using AI to Make AI)',
    format:
      'Graduate-level AI foundations (5000-level); AIMA textbook sequence emphasizing AI methods for problem solving—search, planning, knowledge, learning, and intelligent agents',
    audience:
      'Graduate CS and AI programs adopting Russell & Norvig with modern GitHub, Classroom, and AI-assisted workflows',
    duration: '8 weeks sample · 24 Reveal lectures (expandable)',
    credits: 'Institution-defined (typically 3–4 graduate credits)',
    modality:
      'Online-first; GitHub Classroom + Codespaces; PDF and hosted slides; IMS Common Cartridge (LMS import) for every delivery path',
    implementation:
      'Full course repo with Reveal slides, sample PDF slide packs, IMSCC-ready bundles for Canvas/Moodle-style import, GitHub Pages, SAMWISE curriculum tooling, and BEATRICE (AI TA) integration',
    summary:
      'A complete, licensable deployment of Artificial Intelligence: A Modern Approach at graduate rigor (AIMA 5001): AI-generated slide decks, assignments, autograding hooks, and optional teaching-assistant stack. Each row below is a distinct AIMA5001 course product—demo pages are generated from MyST Markdown in web/myst-sources/ain2001/ (one file per variant, one shared myst build). Same syllabus spine, different delivery and tooling; every variant includes the same IMS Common Cartridge for LMS import where applicable.',
    outcomes: [
      'Ship a turnkey AIMA-aligned course with slides, readings, and assignments in one repository.',
      'Offer students GitHub Classroom assignments with Codespaces and automated feedback.',
      'Layer dialogic (instructor-led Q&A) slide delivery, SAMWISE curriculum server workflows, and BEATRICE for structured AI teaching assistance.',
    ],
    institutionFit: [
      'Graduate CS programs adding a rigorous AI foundations course',
      'Institutions standardizing on Git + AI tools for programming-heavy courses',
      'Teams that want buyer-visible demos for each delivery format before licensing',
    ],
    curriculumHighlights: [
      'Six licensable course products for AIMA 5001 (MyST sources in myst-sources/ain2001/*.md): Basic, AI Delivery, Classroom, Dialogic, SAMWISE, BEATRICE',
      '24 lecture tracks mapped to AIMA 4e with Reveal.js delivery',
      '556+ indexed exercises with autograding and AI-rubric pathways (see course analysis docs)',
      'GitHub Classroom templates with devcontainer / Codespaces for assignments',
      'Instructor notes system for human and AI teaching assistants (BEATRICE)',
    ],
    detailHref: '/catalog/aima',
    deliverableDemos: [
      {
        courseCode: 'AIMA5001: Basic',
        summary:
          'LMS-first delivery: IMS Common Cartridge import plus PDF slide samples so committees and instructors can adopt the AIMA-aligned sequence without GitHub on day one. MyST source: myst-sources/ain2001/basic.md.',
        primaryLabel: 'Open MyST-built demo',
        primaryHref: `${MYST_AIMA5001_BASE}/basic/`,
        secondaryLabel: 'AIMA course repository',
        secondaryHref: AIMA_REPO,
      },
      {
        courseCode: 'AIMA5001: AI Delivery',
        summary:
          'Hosted slide experience: Reveal.js lectures deployed to GitHub Pages. MyST source: myst-sources/ain2001/ai-delivery.md.',
        primaryLabel: 'Open MyST-built demo',
        primaryHref: `${MYST_AIMA5001_BASE}/ai-delivery/`,
        secondaryLabel: 'Hosted slide index (AIMA repo)',
        secondaryHref: 'https://inquiryinstitute.github.io/aima/lectures/reveal/lectures.html',
      },
      {
        courseCode: 'AIMA5001: Classroom',
        summary:
          'GitHub Classroom + Codespaces. MyST source: myst-sources/ain2001/classroom.md.',
        primaryLabel: 'Open MyST-built demo',
        primaryHref: `${MYST_AIMA5001_BASE}/classroom/`,
        secondaryLabel: 'Exercise starter template',
        secondaryHref: 'https://github.com/InquiryInstitute/aima/tree/main/classroom-templates/aima-exercise-starter',
      },
      {
        courseCode: 'AIMA5001: Dialogic',
        summary:
          'Co-teaching / dialogic slide delivery. MyST source: myst-sources/ain2001/dialogic.md.',
        primaryLabel: 'Open MyST-built demo',
        primaryHref: `${MYST_AIMA5001_BASE}/dialogic/`,
        secondaryLabel: 'Sample lecture (Search)',
        secondaryHref: 'https://inquiryinstitute.github.io/aima/lectures/reveal/lecture-03.html',
      },
      {
        courseCode: 'AIMA5001: SAMWISE',
        summary:
          'SAMWISE curriculum tooling. MyST source: myst-sources/ain2001/samwise.md.',
        primaryLabel: 'Open MyST-built demo',
        primaryHref: `${MYST_AIMA5001_BASE}/samwise/`,
        secondaryLabel: 'Documentation index',
        secondaryHref: 'https://github.com/InquiryInstitute/aima/blob/main/docs/DOCUMENTATION_INDEX.md',
      },
      {
        courseCode: 'AIMA5001: BEATRICE',
        summary:
          'BEATRICE AI teaching assistant tier. MyST source: myst-sources/ain2001/beatrice.md.',
        primaryLabel: 'Open MyST-built demo',
        primaryHref: `${MYST_AIMA5001_BASE}/beatrice/`,
        secondaryLabel: 'BEATRICE instructions',
        secondaryHref: 'https://github.com/InquiryInstitute/aima/blob/main/BEATRICE-INSTRUCTIONS.md',
      },
    ],
  },
]

export const salesProcess = [
  'Discovery call to identify audience, academic context, and launch constraints.',
  'Program matching with sample syllabus, delivery recommendation, and budget shape.',
  'Pilot or launch plan covering term calendar, staffing, and student support.',
  'Implementation onboarding for faculty, facilitators, and reporting stakeholders.',
] as const

export const buyingFaqs = [
  {
    question: 'How are programs licensed?',
    answer:
      'Programs can be licensed as single-course deployments, certificate bundles, or multi-cohort institutional partnerships depending on scope and support needs.',
  },
  {
    question: 'Can institutions adapt the curriculum?',
    answer:
      'Yes. Most offerings can be localized around audience, term length, institutional branding, and faculty facilitation model.',
  },
  {
    question: 'What delivery formats are supported?',
    answer:
      'Programs can be delivered online, in person, or hybrid, and can be packaged for LMS deployment, hosted delivery, or guided facilitation.',
  },
  {
    question: 'Do you support pilots?',
    answer:
      'Yes. Many institutions begin with a pilot cohort, special topics section, summer launch, or faculty fellowship format before wider rollout.',
  },
] as const
