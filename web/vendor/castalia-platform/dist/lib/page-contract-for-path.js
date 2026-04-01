/**
 * Normalize pathname for comparisons: leading slash, no trailing slash except root.
 */
export function normalizeSitePath(pathname) {
    if (!pathname || pathname === '')
        return '/';
    let p = pathname.startsWith('/') ? pathname : `/${pathname}`;
    if (p.length > 1 && p.endsWith('/'))
        p = p.slice(0, -1);
    return p;
}
function isRootPath(normalized) {
    return normalized === '/' || normalized === '';
}
function visibilityFromOptions(pathname, options) {
    if (options.isPublic) {
        return options.isPublic(pathname) ? 'public' : 'member';
    }
    const n = normalizeSitePath(pathname);
    if (isRootPath(n))
        return 'public';
    if (options.extraPublicPaths?.length) {
        const allow = new Set(options.extraPublicPaths.map((p) => normalizeSitePath(p)));
        if (allow.has(n))
            return 'public';
    }
    return 'member';
}
/**
 * Default PageContract for a request path: **landing (`/`) is public**, all other routes **member**
 * unless `extraPublicPaths` or `isPublic` says otherwise.
 *
 * Use with `pageMetaFromContract` in Astro layouts or Next `generateMetadata`.
 */
export function pageContractForSitePath(pathname, options) {
    const visibility = visibilityFromOptions(pathname, options);
    const seoPolicy = visibility === 'public' ? 'index' : 'noindex';
    const contentClass = options.contentClass ?? (visibility === 'public' ? 'marketing' : 'dashboard');
    return {
        site: options.site,
        title: options.title,
        visibility,
        seoPolicy,
        contentClass,
        showInNav: options.showInNav ?? true,
    };
}
