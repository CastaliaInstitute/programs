import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { canAccessPage } from '../lib/visibility.js';
/** Anonymous vs member — client or RSC wrapper supplies booleans from your auth layer. */
export function AuthGate({ loading, signedIn, children, signInHref = '/auth/signin', fallback }) {
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center p-8", "aria-busy": "true", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600" }) }));
    }
    if (!signedIn) {
        if (fallback)
            return _jsx(_Fragment, { children: fallback });
        return (_jsxs("div", { className: "container mx-auto px-4 py-12 max-w-xl text-center", children: [_jsx("h2", { className: "text-2xl font-semibold mb-2", children: "Sign in required" }), _jsx("p", { className: "text-slate-600 dark:text-slate-400 mb-6", children: "This area is available to signed-in members." }), _jsx("a", { href: signInHref, className: "inline-flex rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-sm font-semibold", children: "Sign in" })] }));
    }
    return _jsx(_Fragment, { children: children });
}
export function EntitlementGate({ hasAccess, children, upgradeHref = '/membership', upgradeLabel = 'View membership options', fallback, }) {
    if (hasAccess)
        return _jsx(_Fragment, { children: children });
    if (fallback)
        return _jsx(_Fragment, { children: fallback });
    return (_jsx("div", { className: "container mx-auto px-4 py-12 max-w-2xl", children: _jsxs("div", { className: "rounded-2xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 p-8 text-center", children: [_jsx("h2", { className: "text-2xl font-bold mb-2", children: "Membership or entitlement required" }), _jsx("p", { className: "text-slate-600 dark:text-slate-400 mb-6", children: "Upgrade or enroll to unlock this part of Castalia." }), _jsx("a", { href: upgradeHref, className: "inline-flex rounded-lg bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 font-semibold", children: upgradeLabel })] }) }));
}
export function RoleGate({ allowed, children, fallback }) {
    if (allowed)
        return _jsx(_Fragment, { children: children });
    if (fallback)
        return _jsx(_Fragment, { children: fallback });
    return (_jsx("div", { className: "container mx-auto px-4 py-16 text-center text-slate-500", children: _jsx("p", { children: "This page is not available." }) }));
}
/**
 * Composes access from Page Contract fields — use after resolving ctx on the server
 * and passing results, or use canAccessPage in middleware and only render children when allowed.
 */
export function PageVisibilityGate({ visibility, entitlements, roles, resourceOwnerId, ctx, unauthorizedMode = 'paywall', signInHref, upgradeHref, children, teaser, }) {
    const ok = canAccessPage(visibility, entitlements, roles, { ...ctx, resourceOwnerId });
    if (ok)
        return _jsx(_Fragment, { children: children });
    if (unauthorizedMode === 'masked') {
        return (_jsx("div", { className: "container mx-auto px-4 py-16 text-center text-slate-400", children: _jsx("p", { children: "Not found" }) }));
    }
    if (unauthorizedMode === 'redirect') {
        const href = signInHref ?? '/auth/signin';
        return (_jsxs(_Fragment, { children: [teaser, _jsx("div", { className: "container mx-auto px-4 py-8 text-center text-sm", children: _jsx("a", { href: href, className: "font-semibold text-amber-700 dark:text-amber-400 underline", children: "Sign in to continue" }) })] }));
    }
    return (_jsxs(_Fragment, { children: [teaser, _jsx(EntitlementGate, { hasAccess: false, upgradeHref: upgradeHref, children: null })] }));
}
export function VisibilityBadge({ visibility }) {
    const labels = {
        public: 'Public',
        member: 'Member',
        entitled: 'Entitled',
        owner: 'Owner',
        staff: 'Staff',
    };
    return (_jsx("span", { className: "inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-600 dark:text-slate-300", children: labels[visibility] }));
}
