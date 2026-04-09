import type { CatalogCourseDetail } from './catalog-courses'
import {
  ainsAimaCertificateCourses,
  ainsBusinessCourses,
  ainsCyberCourses,
  ainsGraduateCoreCourses,
  ainsHealthcareCourses,
  ainsRoboticsCourses,
  ainsStackableCertificateCourses,
} from './catalog-courses'
import { AIMA_BASIC_IMSCC_PATH, type AimaLmsVariantKey } from './site-links'

/** AIMA5001: Basic — LMS-first line complete (catalog Status column). */
export const AIMA_5001_BASIC_STATUS_EXPECTED = 'Complete Apr 15, 2026' as const

/** Other AIMA5001 SKUs — narrated / packaged media (MP3, MP4). */
export const AIMA_5001_MEDIA_STATUS_EXPECTED = 'MP3/MP4 ready Apr 30, 2026' as const

/**
 * First instant self-serve purchase for **Basic** (static builds compare at build time—redeploy after this date).
 * @see AIMA_5001_MEDIA_PURCHASE_AVAILABLE_FROM_ISO for other AIMA5001 variants.
 */
export const AIMA_5001_PURCHASE_AVAILABLE_FROM_ISO = '2026-04-16T00:00:00.000Z' as const

/** Self-serve purchase for AIMA5001 slide lines that ship narrated MP3/MP4 (after media target). */
export const AIMA_5001_MEDIA_PURCHASE_AVAILABLE_FROM_ISO = '2026-05-01T00:00:00.000Z' as const

/**
 * What each AIMA5001 variant includes (catalog comparison matrix).
 * “Slides” means structured lecture materials (PDF, Reveal, or equivalent).
 */
export interface AimaCatalogFeatures {
  imscc: boolean
  slides: boolean
  assignments: boolean
  mp3: boolean
  mp4: boolean
  /** Co-teaching / dialogic slide delivery (the Dialogic product line). */
  dialogic: boolean
  githubClassroom: boolean
  googleClassroom: boolean
}

/** One licensable product line for AIMA 5001, named like a course (e.g. AIMA5001: Basic). */
export interface DeliverableDemo {
  /** Display name, e.g. `AIMA5001: Basic` or `AIMA5001: AI Delivery`. */
  courseCode: string
  summary: string
  /** Checkmark matrix on the catalog / AIMA product table. */
  catalogFeatures: AimaCatalogFeatures
  /** Shown in catalog “Status” column (e.g. expected completion). */
  statusExpected: string
  /**
   * Self-serve purchase allowed only when `Date.now() >= new Date(this)` at build time; omit on rows that are never self-serve.
   * @see AIMA_5001_PURCHASE_AVAILABLE_FROM_ISO (Basic) and AIMA_5001_MEDIA_PURCHASE_AVAILABLE_FROM_ISO
   */
  purchaseAvailableFrom?: string
  primaryLabel: string
  primaryHref: string
  secondaryLabel?: string
  secondaryHref?: string
  tertiaryLabel?: string
  tertiaryHref?: string
  /** IMS Common Cartridge for this deliverable (variant page + shared PDF); built by `npm run build:demos`. */
  imsccHref?: string
  /** Maps to Castalia Moodle demo URL via `castaliaLmsAimaDemoUrl` (see `site-links.ts`). */
  lmsVariant: AimaLmsVariantKey
}

/** One heading + course lines under a college on the catalog card. */
export interface ProgramCurriculumCollegeBlock {
  title: string
  /** Structured AINS rows link to `/catalog/courses/...`; freeform strings stay bullet lists (e.g. highlights). */
  courses: CatalogCourseDetail[] | string[]
  /** Repeated in the catalog Status column for each course row in this block. */
  statusExpected?: string
  /** If set and current time ≥ this ISO instant at build, catalog shows Purchase; otherwise “Not for sale yet”. */
  purchaseAvailableFrom?: string
}

/** LMS-aligned college bucket (e.g. all AINS courses under AINS). */
export interface ProgramCurriculumCollege {
  /** Short code shown as a chip; matches Moodle category idnumber in spirit (e.g. AINS). */
  code: string
  /** Full display name, e.g. `AINS — College of Artificial & Inquiring Systems`. */
  title: string
  blocks: ProgramCurriculumCollegeBlock[]
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
  /**
   * When set, catalog shows curriculum grouped by college (preferred over flat highlights / specializations).
   * All AINS-numbered graduate offerings live under the AINS college.
   */
  curriculumColleges?: ProgramCurriculumCollege[]
  curriculumHighlights?: string[]
  specializations?: {
    title: string
    courses: string[]
  }[]
  /** Link to a detail page (e.g. live product demos) */
  detailHref?: string
  deliverableDemos?: DeliverableDemo[]
}

/** Aligns with Castalia LMS category naming (`scripts/data/castalia-colleges.json` in the lms repo). */
export const AINS_COLLEGE_TITLE = 'AINS — College of Artificial & Inquiring Systems' as const

/** Canonical AIMA course repo (Russell & Norvig AIMA, GitHub-native delivery). */
export const AIMA_REPO = 'https://github.com/InquiryInstitute/aima' as const

/** Full-course IMS CC from MyST TOC (all pages + PDF). Per-variant downloads use each deliverable’s `imsccHref`. Built in `npm run build:demos`. */
export const AIMA_IMSCC_DEMO = '/demos/aima-lms-demo.imscc' as const

/** Static viewer for unpacked cartridge content (PDF / markdown) on GitHub Pages. */
export const IMSCC_VIEWER_PATH = '/catalog/imscc-viewer' as const

/** AIMA 5001 static course demos (`npm run build:demos` → public/demos/course/ain2001/). */
export const AIMA5001_COURSE_DEMO_BASE = '/demos/course/ain2001' as const

export const programOfferings: ProgramOffering[] = [
  {
    slug: 'graduate-ai-courses',
    title: 'Graduate AI courses (AINS)',
    format: 'Modular graduate-level courses — core, specialization clusters, capstone, certificate',
    audience: 'Universities, graduate divisions, and adult-serving online programs',
    duration: 'Reference stack: 36 credit hours (27 core + 9 specialization); institutions set pacing',
    credits: 'Per institution (reference stack: 36 credits)',
    modality: '100% online (default design)',
    implementation: 'Licensable course modules—your team assembles credentials and catalog copy locally',
    summary:
      'Graduate AI courses under the AINS college: the AIMA certificate pathway (AINS5001), nine core courses, five specialization clusters (healthcare, business, cybersecurity, robotics), a capstone, and a stackable certificate course. Castalia licenses courses; partner institutions define program names, degrees, and how credits stack.',
    outcomes: [
      'License single courses or coherent stacks to match your graduate catalog and accreditation story.',
      'Combine core, specialization clusters, and capstone the way your program committee requires.',
      'Support workforce-relevant outcomes with technical, ethical, and project-based training.',
    ],
    institutionFit: [
      'Universities expanding graduate AI without authoring every syllabus in-house',
      'Colleges extending professional master’s or certificate portfolios',
      'Teams that want launch-ready courseware without a vendor-branded degree package',
    ],
    curriculumColleges: [
      {
        code: 'AINS',
        title: AINS_COLLEGE_TITLE,
        blocks: [
          {
            title: 'AIMA certificate',
            courses: ainsAimaCertificateCourses,
          },
          {
            title: 'Core courses',
            courses: ainsGraduateCoreCourses,
          },
          {
            title: 'Stackable certificate course',
            courses: ainsStackableCertificateCourses,
          },
          {
            title: 'Healthcare AI specialization',
            courses: ainsHealthcareCourses,
          },
          {
            title: 'Business AI specialization',
            courses: ainsBusinessCourses,
          },
          {
            title: 'Cybersecurity AI specialization',
            courses: ainsCyberCourses,
          },
          {
            title: 'Robotics AI specialization',
            courses: ainsRoboticsCourses,
          },
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
    curriculumColleges: [
      {
        code: 'AINS',
        title: AINS_COLLEGE_TITLE,
        blocks: [
          {
            title: 'Certificate course',
            courses: ainsStackableCertificateCourses,
          },
        ],
      },
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
      'A complete, licensable deployment of Artificial Intelligence: A Modern Approach at graduate rigor (AIMA 5001): AI-generated slide decks, assignments, autograding hooks, and optional teaching-assistant stack. Each row below is a distinct AIMA5001 course product—demo pages are built from Markdown in web/demo-sources/ain2001/ (one file per variant, one shared static build). Same syllabus spine, different delivery and tooling; each variant has its own IMS Common Cartridge (that variant’s page plus the shared week-1 PDF), and a full-course cartridge is also built from the MyST table of contents.',
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
    curriculumColleges: [
      {
        code: 'AINS',
        title: AINS_COLLEGE_TITLE,
        blocks: [
          {
            title: 'Curriculum & delivery highlights',
            courses: [
              '24 lecture tracks mapped to AIMA 4e with Reveal.js delivery',
              '556+ indexed exercises with autograding and AI-rubric pathways (see course analysis docs)',
              'GitHub Classroom templates with devcontainer / Codespaces for assignments',
              'Instructor notes system for human and AI teaching assistants (BEATRICE)',
            ],
          },
        ],
      },
    ],
    detailHref: '/catalog/aima',
    deliverableDemos: [
      {
        courseCode: 'AIMA5001: Basic',
        summary:
          'LMS-first delivery: IMS Common Cartridge import plus PDF slide samples so committees and instructors can adopt the AIMA-aligned sequence without GitHub on day one. Source: demo-sources/ain2001/basic.md.',
        statusExpected: AIMA_5001_BASIC_STATUS_EXPECTED,
        purchaseAvailableFrom: AIMA_5001_PURCHASE_AVAILABLE_FROM_ISO,
        primaryLabel: 'Open course demo',
        primaryHref: `${AIMA5001_COURSE_DEMO_BASE}/basic/`,
        secondaryLabel: 'AIMA course repository',
        secondaryHref: AIMA_REPO,
        imsccHref: AIMA_BASIC_IMSCC_PATH,
        lmsVariant: 'basic',
        catalogFeatures: {
          imscc: true,
          slides: true,
          assignments: true,
          mp3: false,
          mp4: false,
          dialogic: false,
          githubClassroom: false,
          googleClassroom: false,
        },
      },
      {
        courseCode: 'AIMA5001: AI Delivery',
        summary:
          'Hosted slide experience: Reveal.js lectures deployed to GitHub Pages. Source: demo-sources/ain2001/ai-delivery.md.',
        statusExpected: AIMA_5001_MEDIA_STATUS_EXPECTED,
        purchaseAvailableFrom: AIMA_5001_MEDIA_PURCHASE_AVAILABLE_FROM_ISO,
        primaryLabel: 'Open course demo',
        primaryHref: `${AIMA5001_COURSE_DEMO_BASE}/ai-delivery/`,
        secondaryLabel: 'Hosted slide index (AIMA repo)',
        secondaryHref: 'https://inquiryinstitute.github.io/aima/lectures/reveal/lectures.html',
        imsccHref: '/demos/aima-delivery-lms-demo.imscc',
        lmsVariant: 'ai-delivery',
        catalogFeatures: {
          imscc: true,
          slides: true,
          assignments: true,
          mp3: true,
          mp4: true,
          dialogic: false,
          githubClassroom: false,
          googleClassroom: false,
        },
      },
      {
        courseCode: 'AIMA5001: Classroom',
        summary:
          'GitHub Classroom + Codespaces: students fork the aima-codespace template and rename it aima-<username>, then work in a devcontainer with bundled Python exercises. Source: demo-sources/ain2001/classroom.md.',
        statusExpected: AIMA_5001_BASIC_STATUS_EXPECTED,
        purchaseAvailableFrom: AIMA_5001_PURCHASE_AVAILABLE_FROM_ISO,
        primaryLabel: 'Open course demo',
        primaryHref: `${AIMA5001_COURSE_DEMO_BASE}/classroom/`,
        secondaryLabel: 'Codespace template (fork as aima-you)',
        secondaryHref: 'https://github.com/InquiryInstitute/aima-codespace',
        tertiaryLabel: 'Exercise starter (AIMA repo)',
        tertiaryHref:
          'https://github.com/InquiryInstitute/aima/tree/main/classroom-templates/aima-exercise-starter',
        imsccHref: '/demos/aima-classroom-lms-demo.imscc',
        lmsVariant: 'classroom',
        catalogFeatures: {
          imscc: true,
          slides: true,
          assignments: true,
          mp3: false,
          mp4: false,
          dialogic: false,
          githubClassroom: true,
          googleClassroom: false,
        },
      },
      {
        courseCode: 'AIMA5001: Dialogic',
        summary:
          'Co-teaching / dialogic slide delivery. Source: demo-sources/ain2001/dialogic.md.',
        statusExpected: AIMA_5001_MEDIA_STATUS_EXPECTED,
        purchaseAvailableFrom: AIMA_5001_MEDIA_PURCHASE_AVAILABLE_FROM_ISO,
        primaryLabel: 'Open course demo',
        primaryHref: `${AIMA5001_COURSE_DEMO_BASE}/dialogic/`,
        secondaryLabel: 'Sample lecture (Search)',
        secondaryHref: 'https://inquiryinstitute.github.io/aima/lectures/reveal/lecture-03.html',
        imsccHref: '/demos/aima-dialogic-lms-demo.imscc',
        lmsVariant: 'dialogic',
        catalogFeatures: {
          imscc: true,
          slides: true,
          assignments: true,
          mp3: true,
          mp4: true,
          dialogic: true,
          githubClassroom: false,
          googleClassroom: false,
        },
      },
      {
        courseCode: 'AIMA5001: SAMWISE',
        summary:
          'SAMWISE curriculum tooling. Source: demo-sources/ain2001/samwise.md.',
        statusExpected: AIMA_5001_BASIC_STATUS_EXPECTED,
        purchaseAvailableFrom: AIMA_5001_PURCHASE_AVAILABLE_FROM_ISO,
        primaryLabel: 'Open course demo',
        primaryHref: `${AIMA5001_COURSE_DEMO_BASE}/samwise/`,
        secondaryLabel: 'Documentation index',
        secondaryHref: 'https://github.com/InquiryInstitute/aima/blob/main/docs/DOCUMENTATION_INDEX.md',
        imsccHref: '/demos/aima-samwise-lms-demo.imscc',
        lmsVariant: 'samwise',
        catalogFeatures: {
          imscc: true,
          slides: true,
          assignments: true,
          mp3: false,
          mp4: false,
          dialogic: false,
          githubClassroom: false,
          googleClassroom: false,
        },
      },
      {
        courseCode: 'AIMA5001: BEATRICE',
        summary:
          'BEATRICE AI teaching assistant tier. Source: demo-sources/ain2001/beatrice.md.',
        statusExpected: AIMA_5001_BASIC_STATUS_EXPECTED,
        purchaseAvailableFrom: AIMA_5001_PURCHASE_AVAILABLE_FROM_ISO,
        primaryLabel: 'Open course demo',
        primaryHref: `${AIMA5001_COURSE_DEMO_BASE}/beatrice/`,
        secondaryLabel: 'BEATRICE instructions',
        secondaryHref: 'https://github.com/InquiryInstitute/aima/blob/main/BEATRICE-INSTRUCTIONS.md',
        imsccHref: '/demos/aima-beatrice-lms-demo.imscc',
        lmsVariant: 'beatrice',
        catalogFeatures: {
          imscc: true,
          slides: true,
          assignments: true,
          mp3: false,
          mp4: false,
          dialogic: false,
          githubClassroom: false,
          googleClassroom: false,
        },
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
