import { AIMA_5001_PURCHASE_AVAILABLE_FROM_ISO } from './programs'

/** True when `fromIso` is set and static build time is on or after that instant. */
export function isPurchaseAvailableFrom(fromIso: string | undefined): boolean {
  if (!fromIso) return false
  return Date.now() >= new Date(fromIso).getTime()
}

/** Self-serve AIMA 5001 checkout (catalog, purchase page, home CTA). */
export function aima5001SelfServePurchaseIsOpen(): boolean {
  return isPurchaseAvailableFrom(AIMA_5001_PURCHASE_AVAILABLE_FROM_ISO)
}

export { AIMA_5001_PURCHASE_AVAILABLE_FROM_ISO }
