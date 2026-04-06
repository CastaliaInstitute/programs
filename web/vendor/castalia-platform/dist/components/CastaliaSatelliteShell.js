'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { CastaliaHeader } from './CastaliaHeader.js';
import { CastaliaFooter } from './CastaliaFooter.js';
import { getCastaliaDrawerNav, castaliaDesktopQuickLinks, getCastaliaSatelliteFooterBlocks } from '../config/drawer-nav.js';
const DEFAULT_ORIGIN = 'https://castalia.institute';
const DEFAULT_LOGO = 'https://castalia.institute/logo.png';
const DEFAULT_LOGO_DARK = 'https://castalia.institute/logo-white.png';
/**
 * Full chrome for properties on other hosts (bookclub.*, symposia.*, etc.).
 * Uses absolute links to the main institute site for nav and legal.
 */
export function CastaliaSatelliteShell({ siteId, propertyTitle, children, instituteOrigin = DEFAULT_ORIGIN, logoSrc = DEFAULT_LOGO, logoSrcDark = DEFAULT_LOGO_DARK, logoWhiteSrc = DEFAULT_LOGO_DARK, isHomePage = false, className = '', }) {
    const origin = instituteOrigin.replace(/\/$/, '');
    const drawerNavLinks = useMemo(() => getCastaliaDrawerNav(origin), [origin]);
    const quick = useMemo(() => castaliaDesktopQuickLinks(origin), [origin]);
    const footerBlocks = useMemo(() => getCastaliaSatelliteFooterBlocks(origin), [origin]);
    return (_jsxs("div", { className: className, children: [_jsx(CastaliaHeader, { siteId: siteId, propertyTitle: propertyTitle, brandHref: origin, logoSrc: logoSrc, logoSrcDark: logoSrcDark, logoWhiteSrc: logoWhiteSrc, isHomePage: isHomePage, isPitchPage: true, drawerNavLinks: drawerNavLinks, desktopQuickLinks: quick, joinHref: `${origin}/membership`, supportHref: `${origin}/support` }), _jsx("main", { className: "min-h-screen", children: children }), _jsx(CastaliaFooter, { logoSrc: logoSrc, logoWhiteSrc: logoWhiteSrc, institutionTitle: "Castalia Institute", institutionBody: _jsxs("p", { children: [propertyTitle, " is the catalog of licensable AI graduate programs and certificates for universities, colleges, and workforce partners. Visit ", _jsx("a", { href: origin, className: "underline hover:text-slate-900 dark:hover:text-slate-100", children: "castalia.institute" }), " for the broader institute."] }), membershipLinks: footerBlocks.membershipLinks, propertyLinks: footerBlocks.propertyLinks, legalLinks: footerBlocks.legalLinks, versionInfoSlot: _jsx("span", { className: "text-slate-500 dark:text-slate-500", children: "Curriculum licensing for institutions." }), versionDetailHref: null })] }));
}
