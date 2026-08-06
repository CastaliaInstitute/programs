/**
 * Provisioning profiles — NOT a course catalog.
 *
 * The authoritative course catalog (K–PhD+, 209 courses across seven colleges) lives in
 * **magisterium** (`courses` table, codes like `AI-103`). This file only answers a narrower,
 * platform-side question: *for a course that needs a working environment, how do we provision
 * it?* Most courses (e.g. early-era or seminar courses) need no environment and have no profile.
 *
 * Keyed by the magisterium course code so there is one shared identity across both systems.
 */

export interface CourseFeatures {
  inqspace: boolean
  dialogic: boolean
  beatrice: boolean
  samwise: boolean
}

/** How a course is delivered to the learner. Only `github-repo`/`inqspace` provision anything. */
export type Delivery = 'github-repo' | 'inqspace' | 'hosted' | 'none'

export interface ProvisioningProfile {
  /** Magisterium course code (authoritative identity), e.g. "AI-103". */
  code: string
  /** Display title (mirror of magisterium; convenience only). */
  title: string
  delivery: Delivery
  /** `owner/repo` template for `github-repo` delivery; omitted otherwise. */
  templateRepo?: string
  features: CourseFeatures
  /**
   * List price in cents for the direct context when the buyer is NOT a Castalia member.
   * Members pay $0 (resolved at checkout). Institutional pricing is contractual.
   */
  listPriceCents: number
}

const FULL_AI_STACK: CourseFeatures = { inqspace: true, dialogic: true, beatrice: true, samwise: true }
const LIST_PRICE_CENTS = 150000 // $1,500 reference (Aurnova per-course tuition; AIMA5001 Simple)

// TODO(template): one template per course, or a shared base. `aima-codespace-repo/` is today's
// student-workspace starting point; extend into CastaliaInstitute/ains-course-template.
const AI_TEMPLATE = 'CastaliaInstitute/ains-course-template'

/**
 * Profiles for the technical AI courses that ship as a per-learner GitHub repo + inqspace with
 * the AI teaching stack. Codes are magisterium's (`AI-1xx`/`AI-4xx`). Courses without a profile
 * here are simply not repo-provisioned — correct for most K–PhD+ courses.
 */
export const PROVISIONING_PROFILES: Record<string, ProvisioningProfile> = {
  'AI-102': { code: 'AI-102', title: 'Machine Learning', delivery: 'github-repo', templateRepo: AI_TEMPLATE, features: FULL_AI_STACK, listPriceCents: LIST_PRICE_CENTS },
  'AI-103': { code: 'AI-103', title: 'Deep Learning', delivery: 'github-repo', templateRepo: AI_TEMPLATE, features: FULL_AI_STACK, listPriceCents: LIST_PRICE_CENTS },
  'AI-104': { code: 'AI-104', title: 'Natural Language Processing', delivery: 'github-repo', templateRepo: AI_TEMPLATE, features: FULL_AI_STACK, listPriceCents: LIST_PRICE_CENTS },
  'AI-402': { code: 'AI-402', title: 'Large Language Models', delivery: 'github-repo', templateRepo: AI_TEMPLATE, features: FULL_AI_STACK, listPriceCents: LIST_PRICE_CENTS },
}

export function resolveProfile(courseCode: string): ProvisioningProfile | null {
  return PROVISIONING_PROFILES[courseCode] ?? null
}

/** True when a course needs an environment provisioned on enrollment. */
export function needsProvisioning(profile: ProvisioningProfile): boolean {
  return profile.delivery === 'github-repo' || profile.delivery === 'inqspace'
}
