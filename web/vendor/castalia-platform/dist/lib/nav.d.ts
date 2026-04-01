import type { AccessContext } from './visibility.js';
export type NavItemVisibility = 'always' | 'signedIn' | 'entitled' | 'role';
export interface NavItem {
    href: string;
    label: string;
    external?: boolean;
    highlight?: boolean;
    cta?: boolean;
    /** How this item participates in permission-aware nav */
    navVisibility?: NavItemVisibility;
    entitlements?: string[];
    roles?: string[];
    /** Show as locked instead of hiding (discovery / conversion) */
    showLocked?: boolean;
}
/**
 * Filter nav items using the same vocabulary as routes (entitlements + roles).
 * Map navVisibility to a synthetic page visibility for reuse.
 */
export declare function filterNavItems(items: NavItem[], ctx: AccessContext): NavItem[];
export declare function isNavItemLocked(item: NavItem, ctx: AccessContext): boolean;
//# sourceMappingURL=nav.d.ts.map