import type { ContentClass, PageContract } from '../types/page-contract.js';
export interface PageContractForPathOptions {
    /** Owning product key, e.g. magisterium, atlas, www */
    site: string;
    /** Page title for metadata */
    title: string;
    /**
     * If set, overrides the default rule (root + extraPublicPaths).
     * Use for Next apps whose middleware already defines public routes (e.g. `isAnonymousAllowedPath`).
     */
    isPublic?: (pathname: string) => boolean;
    /**
     * Normalized paths (see `normalizeSitePath`) that are public in addition to `/`.
     * Example: `['/terms', '/privacy', '/contact']` for marketing pages on a small site.
     */
    extraPublicPaths?: string[];
    contentClass?: ContentClass;
    showInNav?: boolean;
}
/**
 * Normalize pathname for comparisons: leading slash, no trailing slash except root.
 */
export declare function normalizeSitePath(pathname: string): string;
/**
 * Default PageContract for a request path: **landing (`/`) is public**, all other routes **member**
 * unless `extraPublicPaths` or `isPublic` says otherwise.
 *
 * Use with `pageMetaFromContract` in Astro layouts or Next `generateMetadata`.
 */
export declare function pageContractForSitePath(pathname: string, options: PageContractForPathOptions): PageContract;
//# sourceMappingURL=page-contract-for-path.d.ts.map