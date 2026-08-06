/**
 * SKU → course provisioning config. The Stripe SKU (course code) maps to the template repo the
 * buyer's repo is generated from and the teaching-stack features enabled in it.
 *
 * Keep this the single source of truth for "what does buying course X create?" so the webhook
 * Function stays declarative.
 */

export interface CourseFeatures {
  /** inqspace cloud workspace (replaces GitHub Codespaces). */
  inqspace: boolean
  /** Co-teaching SCRIPT lectures. */
  dialogic: boolean
  /** AI teaching assistant. */
  beatrice: boolean
  /** Curriculum server / authoring + autograding tooling. */
  samwise: boolean
}

export interface CourseProvisionConfig {
  /** Course code, e.g. "AINS6001". Also the Stripe SKU. */
  code: string
  title: string
  /** `owner/repo` template the buyer's repo is generated from (GitHub "generate" endpoint). */
  templateRepo: string
  features: CourseFeatures
  /**
   * List price in cents for the direct (MagAI) context when the buyer is NOT a Castalia member.
   * Castalia **members pay $0** (free) — resolved at checkout, not here. Institutional pricing is
   * contractual and set outside this catalog.
   */
  listPriceCents: number
}

/** Reference per-course price ($1,500) — Aurnova per-course tuition and the AIMA5001 Simple price. */
const LIST_PRICE_CENTS = 150000

/** Every self-serve course provisions the full teaching stack by default. */
const ALL_FEATURES: CourseFeatures = {
  inqspace: true,
  dialogic: true,
  beatrice: true,
  samwise: true,
}

// TODO(catalog): confirm the per-course template source. `aima-codespace-repo/` is today's
// student-workspace template; extend it into one template per course, or point each course at
// its own template repo here. Org is CastaliaInstitute — where the ains-* course books live
// (see NOMENCLATURE.md); the legacy InquiryInstitute org is not used for new course repos.
const DEFAULT_TEMPLATE = 'CastaliaInstitute/ains-course-template'

/** Provisionable courses, keyed by SKU/course code. Extend as courses go on self-serve sale. */
export const COURSE_CATALOG: Record<string, CourseProvisionConfig> = {
  AINS6001: {
    code: 'AINS6001',
    title: 'Foundations of Artificial Intelligence',
    templateRepo: DEFAULT_TEMPLATE,
    features: ALL_FEATURES,
    listPriceCents: LIST_PRICE_CENTS,
  },
  AINS6007: {
    code: 'AINS6007',
    title: 'Applied AI Programming with Python',
    templateRepo: DEFAULT_TEMPLATE,
    features: ALL_FEATURES,
    listPriceCents: LIST_PRICE_CENTS,
  },
}

export function resolveCourse(sku: string): CourseProvisionConfig | null {
  return COURSE_CATALOG[sku] ?? null
}
