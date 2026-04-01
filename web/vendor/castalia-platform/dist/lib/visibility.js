const KNOWN_ENTITLEMENTS = new Set();
/** Register known entitlements for documentation / validation (optional). */
export function registerEntitlements(ids) {
    for (const id of ids)
        KNOWN_ENTITLEMENTS.add(id);
}
/**
 * Pure access check — use in middleware, RSC loaders, and API routes.
 * Do not rely on this alone for sensitive data; always filter data server-side.
 */
export function canAccessPage(visibility, requiredEntitlements, requiredRoles, ctx) {
    switch (visibility) {
        case 'public':
            return true;
        case 'member':
            return ctx.userId != null;
        case 'entitled': {
            if (!ctx.userId)
                return false;
            const need = requiredEntitlements ?? [];
            if (need.length === 0)
                return true;
            const set = new Set(ctx.entitlements);
            return need.some((e) => set.has(e));
        }
        case 'owner': {
            if (!ctx.userId)
                return false;
            if (!ctx.resourceOwnerId)
                return false;
            if (ctx.userId === ctx.resourceOwnerId)
                return true;
            const staff = ctx.staffRoles ?? ['admin', 'faculty', 'custodian'];
            const roles = new Set(ctx.roles);
            if (requiredRoles?.length) {
                return requiredRoles.some((r) => roles.has(r));
            }
            return staff.some((r) => roles.has(r));
        }
        case 'staff': {
            const staff = ctx.staffRoles ?? ['admin', 'faculty', 'custodian'];
            const roles = new Set(ctx.roles);
            if (requiredRoles?.length) {
                return requiredRoles.some((r) => roles.has(r));
            }
            return staff.some((r) => roles.has(r));
        }
        default:
            return false;
    }
}
export function seoPolicyForVisibility(visibility, override) {
    if (override)
        return override;
    return visibility === 'public' ? 'index' : 'noindex';
}
export function defaultUnauthorizedMode(visibility) {
    switch (visibility) {
        case 'owner':
        case 'member':
            return 'redirect';
        case 'entitled':
            return 'paywall';
        case 'staff':
            return 'masked';
        default:
            return 'paywall';
    }
}
