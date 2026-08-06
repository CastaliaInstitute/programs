import type { CatalogCourseDetail } from './catalog-courses'
import {
  ainsAimaCertificateCourses,
  ainsBusinessCourses,
  ainsCyberCourses,
  ainsGraduateCoreCourses,
  ainsHealthcareCourses,
  ainsRoboticsCourses,
  ainsStackableCertificateCourses,
  mhthCertificateCourses,
} from './catalog-courses'
import { CASTALIA_PLACEHOLDER_COLLEGES } from './placeholder-colleges'
import { AIMA_BASIC_IMSCC_PATH, type AimaLmsVariantKey } from './site-links'

/** AIMA5001: Simple — GitHub + lectures line complete (catalog Status column). */
export const AIMA_5001_BASIC_STATUS_EXPECTED = 'Complete Apr 15, 2026' as const

/** Advanced tier — narrated media, LTI, and platform subscription. */
export const AIMA_5001_ADVANCED_STATUS_EXPECTED = 'Advanced stack ready Apr 30, 2026' as const

/**
 * First instant self-serve purchase for **Basic** (static builds compare at build time—redeploy after this date).
 * @see AIMA_5001_ADVANCED_PURCHASE_AVAILABLE_FROM_ISO for Advanced (LTI + subscription stack).
 */
export const AIMA_5001_PURCHASE_AVAILABLE_FROM_ISO = '2026-04-16T00:00:00.000Z' as const

/** Institutional license checkout for catalog course rows (aligned with Basic gate unless a block overrides). */
export const CATALOG_COURSE_LICENSE_PURCHASE_FROM_ISO = AIMA_5001_PURCHASE_AVAILABLE_FROM_ISO

/** Advanced tier (full AI stack, LTI, subscription) — self-serve “purchase” / quote handoff opens after this instant. */
export const AIMA_5001_ADVANCED_PURCHASE_AVAILABLE_FROM_ISO = '2026-05-01T00:00:00.000Z' as const

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
  /** LTI 1.3 tool and LMS-deep integration (Advanced). */
  lti: boolean
  /** Castalia subscription / platform term (Advanced). */
  subscription: boolean
}

/** One licensable product line for AIMA 5001, named like a course (e.g. AIMA5001: Simple). */
export interface DeliverableDemo {
  /** Display name, e.g. `AIMA5001: Simple` or `AIMA5001: Advanced`. */
  courseCode: string
  summary: string
  /** Checkmark matrix on the catalog / AIMA product table. */
  catalogFeatures: AimaCatalogFeatures
  /** Shown in catalog “Status” column (e.g. expected completion). */
  statusExpected: string
  /**
   * Self-serve purchase allowed only when `Date.now() >= new Date(this)` at build time; omit on rows that are never self-serve.
   * @see AIMA_5001_PURCHASE_AVAILABLE_FROM_ISO (Simple) and AIMA_5001_ADVANCED_PURCHASE_AVAILABLE_FROM_ISO
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
  /**
   * When set (typically for a three-course specialization cluster), the catalog shows a link to
   * `/catalog/specializations/[slug]` with narrative positioning for procurement teams.
   */
  specializationPageSlug?: string
}

/** LMS-aligned college bucket (e.g. all AINS courses under AINS). */
export interface ProgramCurriculumCollege {
  /** Short code shown as a chip; matches Moodle category idnumber in spirit (e.g. AINS). */
  code: string
  /** Full display name, e.g. `AINS — College of Artificial & Inquiring Systems`. */
  title: string
  blocks: ProgramCurriculumCollegeBlock[]
  /** Reserved colleges with no course SKUs yet — catalog shows a muted “Coming soon” treatment. */
  placeholder?: boolean
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
   * AINS graduate offerings live under the AINS college; additional entries may be `placeholder` shells.
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
export const AIMA_REPO = 'https://github.com/CastaliaInstitute/aima' as const

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
      'Graduate AI courses under the AINS college today—the AIMA certificate (AINS5001), the More Human Than Human certificate (MHH5001) with the program hub at mhth.castalia.institute, nine core courses, four specialization clusters (healthcare, business, cybersecurity, robotics), a capstone, and a stackable Sovereign AI certificate (AINS6010). Additional Castalia colleges below are placeholders until their course lines are listed; Castalia licenses courses; partner institutions define program names, degrees, and how credits stack.',
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
            purchaseAvailableFrom: CATALOG_COURSE_LICENSE_PURCHASE_FROM_ISO,
          },
          {
            title: 'More Human Than Human (certificate)',
            courses: mhthCertificateCourses,
            purchaseAvailableFrom: CATALOG_COURSE_LICENSE_PURCHASE_FROM_ISO,
          },
          {
            title: 'Core courses',
            courses: ainsGraduateCoreCourses,
            purchaseAvailableFrom: CATALOG_COURSE_LICENSE_PURCHASE_FROM_ISO,
          },
          {
            title: 'Sovereign AI certificate',
            courses: ainsStackableCertificateCourses,
            purchaseAvailableFrom: CATALOG_COURSE_LICENSE_PURCHASE_FROM_ISO,
          },
          {
            title: 'Healthcare AI specialization',
            courses: ainsHealthcareCourses,
            purchaseAvailableFrom: CATALOG_COURSE_LICENSE_PURCHASE_FROM_ISO,
            specializationPageSlug: 'healthcare-ai',
          },
          {
            title: 'Business AI specialization',
            courses: ainsBusinessCourses,
            purchaseAvailableFrom: CATALOG_COURSE_LICENSE_PURCHASE_FROM_ISO,
            specializationPageSlug: 'business-ai',
          },
          {
            title: 'Cybersecurity AI specialization',
            courses: ainsCyberCourses,
            purchaseAvailableFrom: CATALOG_COURSE_LICENSE_PURCHASE_FROM_ISO,
            specializationPageSlug: 'cybersecurity-ai',
          },
          {
            title: 'Robotics AI specialization',
            courses: ainsRoboticsCourses,
            purchaseAvailableFrom: CATALOG_COURSE_LICENSE_PURCHASE_FROM_ISO,
            specializationPageSlug: 'robotics-ai',
          },
        ],
      },
      ...CASTALIA_PLACEHOLDER_COLLEGES,
    ],
  },
  {
    slug: 'sovereign-ai-certificate',
    title: 'Sovereign AI (AINS6010)',
    format: 'Certificate course',
    audience:
      'Institutions that need AI under jurisdictional and operational control—defense-adjacent labs, regulated industries, national or campus sovereignty mandates, and teams avoiding default public-cloud custody',
    duration: 'Single-course certificate or stackable module',
    credits: 'Certificate portfolio course',
    modality: 'Online with practical deployment labs',
    implementation: 'Certificate-ready applied technical course (on-prem, edge, and governed cloud patterns)',
    summary:
      'AINS6010 Sovereign AI: train cohorts to design, deploy, and operate AI where data, models, and policy stay under institutional control—covering sovereignty strategy, edge and on-premises stacks, and secure operations without assuming always-on public cloud APIs.',
    outcomes: [
      'Teach students to reason about sovereignty, residency, and threat models before choosing stacks.',
      'Deploy and maintain capable inference in controlled environments (on-prem, edge, air-gapped patterns).',
      'Package as a standalone certificate or stack with AINS core courses for workforce and technical programs.',
    ],
    institutionFit: [
      'Applied AI, engineering, and cybersecurity programs with data-sovereignty requirements',
      'Cyber-physical and critical-infrastructure curricula',
      'Certificate portfolios for workforce learners who must keep AI on a short leash',
    ],
    curriculumColleges: [
      {
        code: 'AINS',
        title: AINS_COLLEGE_TITLE,
        blocks: [
          {
            title: 'Sovereign AI certificate',
            courses: ainsStackableCertificateCourses,
            purchaseAvailableFrom: CATALOG_COURSE_LICENSE_PURCHASE_FROM_ISO,
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
      'Online-first; two product lines—GitHub-native lectures and repos (Simple), or full AI + LTI + subscription (Advanced)',
    implementation:
      'Simple: release of the course GitHub repository with Reveal lectures, instructor and student GitHub Classroom workflows, IMS CC for LMS import, and Codespaces-ready assignments. Advanced: adds narrated media, dialogic delivery, SAMWISE, BEATRICE, and LTI 1.3 integration with a Castalia subscription.',
    summary:
      'A complete, licensable deployment of Artificial Intelligence: A Modern Approach at graduate rigor (AIMA 5001). Simple ships lecture materials plus the creation and release of GitHub instructor and student repositories (Classroom, Codespaces). Advanced adds the full AI teaching stack—hosted rich media, dialogic lectures, SAMWISE and BEATRICE, LTI delivery, and a subscription. Demo pages for engineering still live under web/demo-sources/ain2001/; the catalog lists one row per SKU.',
    outcomes: [
      'Ship a turnkey AIMA-aligned course with slides, readings, and assignments released from GitHub.',
      'Run cohorts on GitHub Classroom with instructor and student repos, Codespaces, and autograding hooks.',
      'Upgrade to Advanced for LTI, subscription-backed operations, and AI-assisted teaching (dialogic, SAMWISE, BEATRICE).',
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
              'Simple: GitHub instructor + student repos and Classroom templates with devcontainer / Codespaces',
              'Advanced: LTI 1.3, subscription, dialogic delivery, SAMWISE, and BEATRICE (AI TA)',
            ],
          },
        ],
      },
    ],
    detailHref: '/catalog/aima',
    deliverableDemos: [
      {
        courseCode: 'AIMA5001: Simple',
        summary:
          'Lectures plus GitHub delivery: creation and release of the course repository with Reveal materials, IMS Common Cartridge for LMS import, and GitHub Classroom for instructor and student repos (Codespaces / devcontainer). Representative demo: demo-sources/ain2001/classroom.md.',
        statusExpected: AIMA_5001_BASIC_STATUS_EXPECTED,
        purchaseAvailableFrom: AIMA_5001_PURCHASE_AVAILABLE_FROM_ISO,
        primaryLabel: 'Open course demo',
        primaryHref: `${AIMA5001_COURSE_DEMO_BASE}/classroom/`,
        secondaryLabel: 'AIMA course repository',
        secondaryHref: AIMA_REPO,
        tertiaryLabel: 'Codespace template (fork as aima-you)',
        tertiaryHref: 'https://github.com/CastaliaInstitute/aima-codespace',
        imsccHref: AIMA_BASIC_IMSCC_PATH,
        lmsVariant: 'simple',
        catalogFeatures: {
          imscc: true,
          slides: true,
          assignments: true,
          mp3: false,
          mp4: false,
          dialogic: false,
          githubClassroom: true,
          googleClassroom: false,
          lti: false,
          subscription: false,
        },
      },
      {
        courseCode: 'AIMA5001: Advanced',
        summary:
          'Full AI teaching stack: narrated and dialogic delivery, SAMWISE curriculum tooling, BEATRICE AI TA, LTI 1.3 integration with your LMS, and a Castalia subscription for operations. Representative demos: demo-sources/ain2001/ai-delivery.md, dialogic.md, samwise.md, beatrice.md.',
        statusExpected: AIMA_5001_ADVANCED_STATUS_EXPECTED,
        purchaseAvailableFrom: AIMA_5001_ADVANCED_PURCHASE_AVAILABLE_FROM_ISO,
        primaryLabel: 'Open course demo',
        primaryHref: `${AIMA5001_COURSE_DEMO_BASE}/ai-delivery/`,
        secondaryLabel: 'BEATRICE instructions',
        secondaryHref: 'https://github.com/CastaliaInstitute/aima/blob/main/BEATRICE-INSTRUCTIONS.md',
        tertiaryLabel: 'Documentation index (SAMWISE)',
        tertiaryHref: 'https://github.com/CastaliaInstitute/aima/blob/main/docs/DOCUMENTATION_INDEX.md',
        imsccHref: '/demos/aima-delivery-lms-demo.imscc',
        lmsVariant: 'advanced',
        catalogFeatures: {
          imscc: true,
          slides: true,
          assignments: true,
          mp3: true,
          mp4: true,
          dialogic: true,
          githubClassroom: true,
          googleClassroom: false,
          lti: true,
          subscription: true,
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
