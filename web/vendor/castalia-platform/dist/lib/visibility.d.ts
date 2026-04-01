import type { PageVisibility, SeoPolicy, UnauthorizedMode } from '../types/page-contract.js';
export interface AccessContext {
    userId: string | null;
    entitlements: string[];
    roles: string[];
    /** For owner visibility */
    resourceOwnerId?: string | null;
    /** Treat as staff if any of these match */
    staffRoles?: string[];
}
/** Register known entitlements for documentation / validation (optional). */
export declare function registerEntitlements(ids: string[]): void;
/**
 * Pure access check — use in middleware, RSC loaders, and API routes.
 * Do not rely on this alone for sensitive data; always filter data server-side.
 */
export declare function canAccessPage(visibility: PageVisibility, requiredEntitlements: string[] | undefined, requiredRoles: string[] | undefined, ctx: AccessContext): boolean;
export declare function seoPolicyForVisibility(visibility: PageVisibility, override?: SeoPolicy): SeoPolicy;
export declare function defaultUnauthorizedMode(visibility: PageVisibility): UnauthorizedMode;
//# sourceMappingURL=visibility.d.ts.map