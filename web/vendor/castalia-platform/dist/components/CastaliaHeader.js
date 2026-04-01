'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';
/**
 * Presentation shell only — no auth decisions. Matches Inquiry.Institute nav structure:
 * brand | center slot | join + quick links + identity + menu.
 */
export function CastaliaHeader({ siteId: _siteId, propertyTitle, brandHref = '/', logoSrc = '/logo.png', logoSrcDark: _logoSrcDark, logoWhiteSrc = '/logo-white.png', variant, embed, isHomePage, isPitchPage, drawerNavLinks = [], desktopQuickLinks = [], joinHref = '/membership', joinLabel = 'Join', supportHref = '/support', supportLabel = 'Support', centerSlot, identitySlot, utilitySlot, propertySwitcherSlot, className = '', brandClassName = '', }) {
    const [isOpen, setIsOpen] = useState(false);
    const pitch = variant === 'pitch' || isPitchPage;
    useEffect(() => {
        if (!isOpen)
            return;
        const scrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            window.scrollTo(0, scrollY);
        };
    }, [isOpen]);
    const navLinks = useMemo(() => drawerNavLinks, [drawerNavLinks]);
    if (embed)
        return null;
    const SmartTextLink = ({ href, className: cn, children, onClick, }) => {
        const abs = href.startsWith('http://') || href.startsWith('https://');
        if (abs) {
            return (_jsx("a", { href: href, className: cn, onClick: onClick, children: children }));
        }
        return (_jsx(Link, { href: href, className: cn, onClick: onClick, children: children }));
    };
    const bar = pitch
        ? 'border-slate-700 bg-slate-900/95'
        : 'border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95';
    const brandText = pitch ? 'text-slate-100' : 'text-slate-900 dark:text-slate-100';
    const iconBlock = pitch ? (_jsx("img", { src: logoWhiteSrc || logoSrc, alt: "", width: 32, height: 32, className: "object-contain" })) : (_jsx("span", { className: "inline-flex shrink-0 items-center justify-center rounded-lg bg-slate-900 p-1 shadow-sm ring-1 ring-black/10 dark:bg-transparent dark:p-0 dark:shadow-none dark:ring-0", children: _jsx("img", { src: logoWhiteSrc, alt: "", width: 32, height: 32, className: "h-8 w-8 object-contain" }) }));
    return (_jsxs(_Fragment, { children: [_jsx("nav", { className: `border-b backdrop-blur-sm sticky top-0 z-50 ${bar} ${className}`, children: _jsxs("div", { className: "container mx-auto px-4", children: [_jsxs("div", { className: "relative flex items-center justify-between h-16", children: [_jsxs(SmartTextLink, { href: brandHref, className: `font-semibold text-base sm:text-xl flex items-center gap-2 ${brandText} ${brandClassName}`.trim(), children: [_jsx("div", { className: "relative flex items-center -mt-0.5", children: iconBlock }), _jsxs("span", { className: "leading-tight flex flex-col sm:flex-row sm:items-baseline sm:gap-2", children: [_jsx("span", { children: "Castalia Institute" }), propertyTitle ? (_jsx("span", { className: "text-sm font-normal opacity-90 sm:text-base", children: propertyTitle })) : null] })] }), _jsx("div", { className: "absolute left-1/2 -translate-x-1/2 hidden lg:block", children: centerSlot }), _jsxs("div", { className: "flex items-center gap-2 sm:gap-3", children: [propertySwitcherSlot, _jsxs(SmartTextLink, { href: joinHref, className: `inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold shadow-md transition sm:px-4 ${pitch ? 'bg-amber-500 text-white hover:bg-amber-400' : 'bg-amber-500 text-white hover:bg-amber-600'}`, children: [_jsx(Sparkles, { className: "h-4 w-4 shrink-0 opacity-90", "aria-hidden": true }), joinLabel] }), !isHomePage && desktopQuickLinks.length > 0 && (_jsx("div", { className: "hidden lg:flex items-center gap-4", children: desktopQuickLinks.slice(0, 4).map((link) => (_jsx(SmartTextLink, { href: link.href, className: `text-sm font-medium transition-colors ${pitch
                                                    ? 'text-slate-300 hover:text-amber-400'
                                                    : 'text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400'}`, children: link.label }, link.href))) })), !isHomePage && (_jsxs(_Fragment, { children: [_jsx(SmartTextLink, { href: supportHref, className: `hidden md:inline-flex items-center rounded-full border bg-transparent px-4 py-2 text-sm font-semibold transition ${pitch
                                                        ? 'border-amber-400/70 text-amber-100 hover:bg-white/10'
                                                        : 'border-amber-600/90 text-amber-700 hover:bg-amber-50 dark:border-amber-400/80 dark:text-amber-300 dark:hover:bg-amber-950/40'}`, children: supportLabel }), _jsx(SmartTextLink, { href: supportHref, className: `md:hidden inline-flex items-center rounded-full border px-2.5 py-1.5 text-xs font-semibold ${pitch
                                                        ? 'border-amber-400/70 text-amber-100'
                                                        : 'border-amber-600/90 text-amber-700 dark:text-amber-300'}`, children: supportLabel })] })), utilitySlot, identitySlot ? _jsx("div", { className: "hidden md:flex", children: identitySlot }) : null, _jsx("button", { type: "button", onClick: () => setIsOpen((p) => !p), className: `p-2 transition-colors ${pitch
                                                ? 'text-slate-300 hover:text-slate-100'
                                                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'}`, "aria-label": "Toggle menu", "aria-expanded": isOpen, "aria-controls": "castalia-global-navigation-drawer", children: isOpen ? _jsx(X, { size: 24 }) : _jsx(Menu, { size: 24 }) })] })] }), _jsx("div", { className: `lg:hidden border-t py-2 ${pitch ? 'border-slate-700' : 'border-slate-200 dark:border-slate-700'}`, children: centerSlot })] }) }), isOpen && (_jsxs("div", { children: [_jsx("button", { type: "button", className: "fixed inset-0 z-[60] bg-slate-900/70 backdrop-blur-sm", "aria-label": "Close menu overlay", onClick: () => setIsOpen(false) }), _jsxs("aside", { id: "castalia-global-navigation-drawer", className: "fixed inset-0 z-[70] w-full overflow-y-auto overflow-x-hidden border border-slate-200 bg-white/95 p-6 text-slate-900 shadow-2xl backdrop-blur-md dark:border-slate-700 dark:bg-slate-950/90 dark:text-slate-100 sm:inset-y-3 sm:right-6 sm:left-auto sm:my-0 sm:w-full sm:max-w-sm sm:rounded-3xl", "aria-label": "Site navigation", children: [_jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsx("p", { className: "text-xs uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400", children: "Menu" }), _jsx("button", { type: "button", onClick: () => setIsOpen(false), className: "p-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100", "aria-label": "Close navigation", children: _jsx(X, { size: 20 }) })] }), _jsxs(SmartTextLink, { href: joinHref, onClick: () => setIsOpen(false), className: "mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-500 px-4 py-3.5 text-base font-semibold text-white shadow-lg transition hover:bg-amber-600", children: [_jsx(Sparkles, { className: "h-5 w-5 shrink-0", "aria-hidden": true }), "Join membership"] }), _jsx("nav", { className: "mt-6", "aria-label": "Primary", children: _jsx("ul", { className: "flex flex-col gap-1", children: navLinks.map((link) => {
                                        const newTab = Boolean(link.external);
                                        const abs = link.href.startsWith('http://') || link.href.startsWith('https://');
                                        const itemClassName = `flex w-full items-center justify-between rounded-2xl px-4 py-3 text-base font-medium transition-colors ${link.highlight || link.cta
                                            ? link.cta
                                                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg'
                                                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:from-indigo-700 hover:to-purple-700'
                                            : 'text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800/60'}`;
                                        return (_jsx("li", { children: newTab ? (_jsxs("a", { href: link.href, target: "_blank", rel: "noopener noreferrer", onClick: () => setIsOpen(false), className: itemClassName, children: [_jsx("span", { children: link.label }), !link.highlight && (_jsx(ArrowUpRight, { className: "w-4 h-4 text-slate-400 dark:text-slate-500" }))] })) : abs ? (_jsxs("a", { href: link.href, onClick: () => setIsOpen(false), className: itemClassName, children: [_jsx("span", { children: link.label }), !link.highlight && (_jsx(ArrowUpRight, { className: "w-4 h-4 text-slate-400 dark:text-slate-500" }))] })) : (_jsxs(Link, { href: link.href, onClick: () => setIsOpen(false), className: itemClassName, children: [_jsx("span", { children: link.label }), !link.highlight && (_jsx(ArrowUpRight, { className: "w-4 h-4 text-slate-400 dark:text-slate-500" }))] })) }, `${link.href}-${link.label}`));
                                    }) }) })] })] }))] }));
}
