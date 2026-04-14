/**
 * Commerce + Castalia LMS URLs. Override via Astro public env (see web/.env.example).
 * LMS defaults to production; per-AIMA-variant URLs point at Moodle demo courses when configured.
 */

import type { CatalogCourseDetail } from './catalog-courses'

export const CASTALIA_LMS_URL = (
  import.meta.env.PUBLIC_CASTALIA_LMS_URL ?? 'https://lms.castalia.institute'
).replace(/\/$/, '')

/**
 * Standard Moodle deeplink to a course shell (numeric course id from Site admin → Courses, or the `id` in
 * `/course/view.php?id=` when you open the course in the browser).
 */
export const CASTALIA_MOODLE_COURSE_VIEW_PATH = '/course/view.php' as const

export function castaliaLmsMoodleCourseViewUrl(courseId: string | number): string {
  const id = String(courseId).trim()
  return `${CASTALIA_LMS_URL}${CASTALIA_MOODLE_COURSE_VIEW_PATH}?id=${encodeURIComponent(id)}`
}

/** True when the URL points at a Moodle course view (or equivalent deeplink), not just the LMS home. */
export function castaliaLmsUrlOpensMoodleCourse(url: string): boolean {
  return /\/course\/view\.php\?[^#]*\bid=/.test(url)
}

/** Public IMS CC built by `npm run build:demos` — same file customers receive after Simple checkout. */
export const AIMA_BASIC_IMSCC_PATH = '/demos/aima-basic-lms-demo.imscc' as const

/** Self-serve SKU: AIMA5001 Simple (USD). */
export const AIMA_BASIC_PRICE_USD = 1500 as const

/**
 * Stripe Payment Link for AIMA5001 Simple ($1,500). Create in Dashboard: Product one-time $1500,
 * then set confirmation / success redirect to `/purchase/aima-basic/success/` on this site.
 */
export function resolveStripePaymentLinkAimaBasic(): string | null {
  const raw =
    import.meta.env.PUBLIC_STRIPE_PAYMENT_LINK_AIMA_BASIC ??
    import.meta.env.PUBLIC_STRIPE_PAYMENT_LINK_BASIC
  const s = raw != null ? String(raw).trim() : ''
  return s.length > 0 ? s : null
}

/** Stripe Payment Link, Checkout URL, or similar — optional catch-all on /purchase. */
export function resolveHostedCheckoutUrl(): string | null {
  const raw =
    import.meta.env.PUBLIC_CASTALIA_PURCHASE_CHECKOUT_URL ??
    import.meta.env.PUBLIC_CASTALIA_STRIPE_CHECKOUT_URL
  const s = raw != null ? String(raw).trim() : ''
  return s.length > 0 ? s : null
}

export type AimaLmsVariantKey = 'simple' | 'advanced'

type VariantEnv = { urlKey: string; idKey: string }

function resolvePublicEnvString(key: string): string | null {
  const raw = (import.meta.env as Record<string, string | undefined>)[key]
  const s = raw != null ? String(raw).trim() : ''
  return s.length > 0 ? s : null
}

function resolveVariantMoodleUrl(primary: VariantEnv, fallbacks: VariantEnv[]): string {
  const tryOne = (env: VariantEnv): string | null => {
    const url = resolvePublicEnvString(env.urlKey)
    if (url) return url.replace(/\/$/, '')
    const id = resolvePublicEnvString(env.idKey)
    if (id && /^\d+$/.test(id)) {
      return castaliaLmsMoodleCourseViewUrl(id)
    }
    return null
  }
  const first = tryOne(primary)
  if (first) return first
  for (const fb of fallbacks) {
    const u = tryOne(fb)
    if (u) return u
  }
  return CASTALIA_LMS_URL
}

/**
 * Resolved Castalia LMS URL for a catalog course page: explicit `lmsUrl`, AIMA variant env, optional full URL
 * `PUBLIC_CASTALIA_LMS_<CODE>`, optional numeric id `PUBLIC_CASTALIA_MOODLE_COURSE_ID_<CODE>`, then LMS home.
 */
export function castaliaLmsCatalogCourseUrl(course: CatalogCourseDetail): string {
  const direct = course.lmsUrl?.trim()
  if (direct) return direct.replace(/\/$/, '')
  if (course.aimaLmsVariant) return castaliaLmsAimaDemoUrl(course.aimaLmsVariant)
  const codeKey = catalogCourseCodeToEnvSuffix(course.code)
  const fullUrl = resolvePublicEnvString(`PUBLIC_CASTALIA_LMS_${codeKey}`)
  if (fullUrl) return fullUrl.replace(/\/$/, '')
  const moodleId = resolvePublicEnvString(`PUBLIC_CASTALIA_MOODLE_COURSE_ID_${codeKey}`)
  if (moodleId && /^\d+$/.test(moodleId)) {
    return castaliaLmsMoodleCourseViewUrl(moodleId)
  }
  return CASTALIA_LMS_URL
}

/** Env suffix for `PUBLIC_CASTALIA_LMS_*` / `PUBLIC_CASTALIA_MOODLE_COURSE_ID_*` (alphanumeric only). */
export function catalogCourseCodeToEnvSuffix(courseCode: string): string {
  return courseCode.replace(/[^A-Za-z0-9]/g, '')
}

/**
 * Optional Stripe Payment Link per catalog SKU, e.g. `PUBLIC_STRIPE_PAYMENT_LINK_AINS6001`.
 * Create one Price + Payment Link per licensable course when ready for self-serve.
 */
export function resolveStripePaymentLinkForCourseCode(courseCode: string): string | null {
  const sanitized = courseCode.replace(/[^A-Za-z0-9]/g, '')
  if (!sanitized.length) return null
  return resolvePublicEnvString(`PUBLIC_STRIPE_PAYMENT_LINK_${sanitized}`)
}

/** Primary Buy target: course-specific Payment Link when configured, else purchase hub with ?sku= */
export function resolveCatalogCourseBuyHref(courseCode: string): { href: string; external: boolean; label: string } {
  const stripe = resolveStripePaymentLinkForCourseCode(courseCode)
  if (stripe) {
    return { href: stripe, external: true, label: 'Buy' }
  }
  return {
    href: `/purchase?sku=${encodeURIComponent(courseCode)}`,
    external: false,
    label: 'Buy license',
  }
}

/**
 * Moodle URL for this AIMA5001 SKU: dedicated env wins, then legacy per-line env keys (pre–two-SKU catalog), then LMS home.
 */
export function castaliaLmsAimaDemoUrl(variant: AimaLmsVariantKey): string {
  if (variant === 'simple') {
    return resolveVariantMoodleUrl(
      {
        urlKey: 'PUBLIC_CASTALIA_LMS_AIMA_SIMPLE_URL',
        idKey: 'PUBLIC_CASTALIA_MOODLE_COURSE_ID_AIMA_SIMPLE',
      },
      [
        { urlKey: 'PUBLIC_CASTALIA_LMS_AIMA_BASIC_URL', idKey: 'PUBLIC_CASTALIA_MOODLE_COURSE_ID_AIMA_BASIC' },
        { urlKey: 'PUBLIC_CASTALIA_LMS_AIMA_CLASSROOM_URL', idKey: 'PUBLIC_CASTALIA_MOODLE_COURSE_ID_AIMA_CLASSROOM' },
      ],
    )
  }
  return resolveVariantMoodleUrl(
    {
      urlKey: 'PUBLIC_CASTALIA_LMS_AIMA_ADVANCED_URL',
      idKey: 'PUBLIC_CASTALIA_MOODLE_COURSE_ID_AIMA_ADVANCED',
    },
    [
      { urlKey: 'PUBLIC_CASTALIA_LMS_AIMA_DIALOGIC_URL', idKey: 'PUBLIC_CASTALIA_MOODLE_COURSE_ID_AIMA_DIALOGIC' },
      { urlKey: 'PUBLIC_CASTALIA_LMS_AIMA_AI_DELIVERY_URL', idKey: 'PUBLIC_CASTALIA_MOODLE_COURSE_ID_AIMA_AI_DELIVERY' },
    ],
  )
}
