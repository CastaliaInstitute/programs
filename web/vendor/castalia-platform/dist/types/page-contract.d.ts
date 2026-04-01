/**
 * Castalia Page Contract — every route should declare metadata compatible with this model.
 * Enforcement lives in middleware + server + gates; metadata is the single vocabulary.
 *
 * **Private-by-default (www):** the Castalia Institute Next app treats unauthenticated users as
 * denied unless the path is on the middleware public allowlist. Prefer `visibility: 'member'`
 * (or stricter) for app pages; use `public` only for routes that are also allowlisted at the edge.
 */
export type PageVisibility = 'public' | 'member' | 'entitled' | 'owner' | 'staff';
export type UnauthorizedMode = 'redirect' | 'paywall' | 'masked';
export type SeoPolicy = 'index' | 'noindex';
export type ContentClass = 'marketing' | 'editorial' | 'credential' | 'lesson' | 'dashboard' | 'internal' | 'account';
export interface PageContract {
    /** Owning product key, e.g. magisterium, atlas, www */
    site: string;
    title: string;
    visibility: PageVisibility;
    /** Product entitlements (strings), e.g. mag_ai_student, atlas_beta */
    entitlements?: string[];
    roles?: string[];
    /** For owner visibility: which field on the resource holds the user id */
    ownerField?: string;
    showInNav?: boolean;
    /** If false, unauthorized users do not see nav item (vs locked teaser) */
    showIfUnauthorized?: boolean;
    unauthorizedMode?: UnauthorizedMode;
    seoPolicy?: SeoPolicy;
    contentClass?: ContentClass;
}
export interface RouteMeta extends PageContract {
    path: string;
}
//# sourceMappingURL=page-contract.d.ts.map