/**
 * Commerce + Castalia LMS URLs. Override via Astro public env (see web/.env.example).
 * LMS defaults to production; per-AIMA-variant URLs point at Moodle demo courses when configured.
 */

import type { CatalogCourseDetail } from './catalog-courses'

export const CASTALIA_LMS_URL = (
  import.meta.env.PUBLIC_CASTALIA_LMS_URL ?? 'https://lms.castalia.institute'
).replace(/\/$/, '')

/** Public IMS CC built by `npm run build:demos` — same file customers receive after Basic checkout. */
export const AIMA_BASIC_IMSCC_PATH = '/demos/aima-basic-lms-demo.imscc' as const

/** Self-serve SKU: AIMA5001 Basic (USD). */
export const AIMA_BASIC_PRICE_USD = 1500 as const

/**
 * Stripe Payment Link for AIMA5001 Basic ($1,500). Create in Dashboard: Product one-time $1500,
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

export type AimaLmsVariantKey =
  | 'basic'
  | 'ai-delivery'
  | 'classroom'
  | 'dialogic'
  | 'samwise'
  | 'beatrice'

/**
 * Resolved Castalia LMS URL for a catalog course page: explicit `lmsUrl`, AIMA variant override env, optional
 * per-AINS `PUBLIC_CASTALIA_LMS_<CODE>`, then LMS home.
 */
export function castaliaLmsCatalogCourseUrl(course: CatalogCourseDetail): string {
  const direct = course.lmsUrl?.trim()
  if (direct) return direct.replace(/\/$/, '')
  if (course.aimaLmsVariant) return castaliaLmsAimaDemoUrl(course.aimaLmsVariant)
  const override = resolvePublicEnvString(`PUBLIC_CASTALIA_LMS_${course.code}`)
  if (override) return override.replace(/\/$/, '')
  return CASTALIA_LMS_URL
}

function resolvePublicEnvString(key: string): string | null {
  const raw = (import.meta.env as Record<string, string | undefined>)[key]
  const s = raw != null ? String(raw).trim() : ''
  return s.length > 0 ? s : null
}

/** Moodle URL for this AIMA5001 demo variant (guest-visible demo course). Falls back to site home. */
export function castaliaLmsAimaDemoUrl(variant: AimaLmsVariantKey): string {
  const override =
    variant === 'basic'
      ? import.meta.env.PUBLIC_CASTALIA_LMS_AIMA_BASIC_URL
      : variant === 'ai-delivery'
        ? import.meta.env.PUBLIC_CASTALIA_LMS_AIMA_AI_DELIVERY_URL
        : variant === 'classroom'
          ? import.meta.env.PUBLIC_CASTALIA_LMS_AIMA_CLASSROOM_URL
          : variant === 'dialogic'
            ? import.meta.env.PUBLIC_CASTALIA_LMS_AIMA_DIALOGIC_URL
            : variant === 'samwise'
              ? import.meta.env.PUBLIC_CASTALIA_LMS_AIMA_SAMWISE_URL
              : import.meta.env.PUBLIC_CASTALIA_LMS_AIMA_BEATRICE_URL

  const o = override != null ? String(override).trim() : ''
  return o.length > 0 ? o.replace(/\/$/, '') : CASTALIA_LMS_URL
}
