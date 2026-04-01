import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { seoPolicyForVisibility } from '../lib/visibility.js';
/**
 * Logical shell contract — use inside app/layout or per-route layout.
 * Renders children only; header/footer should wrap at layout level using CastaliaHeader/Footer.
 * Use exported helpers with your framework's metadata API.
 */
export function PageShell({ children }) {
    return _jsx(_Fragment, { children: children });
}
export function pageMetaFromContract(contract, canonicalPath) {
    const robots = seoPolicyForVisibility(contract.visibility, contract.seoPolicy);
    return {
        title: contract.title,
        robots: robots === 'noindex' ? 'noindex, nofollow' : 'index, follow',
        alternates: canonicalPath ? { canonical: canonicalPath } : undefined,
    };
}
