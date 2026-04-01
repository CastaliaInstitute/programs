import type { NavItem } from '../lib/nav.js';
/**
 * Drawer navigation for Castalia web apps.
 * @param origin — `''` for same-origin (www); `https://castalia.institute` for satellites linking home.
 */
export declare function getCastaliaDrawerNav(origin: string): NavItem[];
export declare const castaliaDesktopQuickLinks: (origin: string) => NavItem[];
/** Default footer link sets for satellites (absolute institute URLs). */
export declare function getCastaliaSatelliteFooterBlocks(origin: string): {
    membershipLinks: NavItem[];
    propertyLinks: NavItem[];
    legalLinks: NavItem[];
};
//# sourceMappingURL=drawer-nav.d.ts.map