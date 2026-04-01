import { canAccessPage } from './visibility.js';
/**
 * Filter nav items using the same vocabulary as routes (entitlements + roles).
 * Map navVisibility to a synthetic page visibility for reuse.
 */
export function filterNavItems(items, ctx) {
    return items.filter((item) => {
        const nv = item.navVisibility ?? 'always';
        if (nv === 'always')
            return true;
        if (nv === 'signedIn')
            return ctx.userId != null;
        if (nv === 'entitled') {
            const ok = canAccessPage('entitled', item.entitlements, item.roles, ctx);
            return ok || Boolean(item.showLocked);
        }
        if (nv === 'role') {
            const ok = canAccessPage('staff', item.entitlements, item.roles, ctx);
            return ok || Boolean(item.showLocked);
        }
        return true;
    });
}
export function isNavItemLocked(item, ctx) {
    const nv = item.navVisibility ?? 'always';
    if (nv === 'always')
        return false;
    if (nv === 'signedIn')
        return ctx.userId == null;
    if (nv === 'entitled') {
        return !canAccessPage('entitled', item.entitlements, item.roles, ctx);
    }
    if (nv === 'role') {
        return !canAccessPage('staff', item.entitlements, item.roles, ctx);
    }
    return false;
}
