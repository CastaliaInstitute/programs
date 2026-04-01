'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, Lock } from 'lucide-react';
/**
 * Institutional map: public properties, entitled, and locked (optional upgrade).
 * Does not fetch session — pass computed `status` from the app layer.
 */
export function CastaliaPropertySwitcher({ properties, currentPropertyId, menuLabel = 'Castalia properties', variant = 'default', className = '', }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        function onDoc(e) {
            if (ref.current && !ref.current.contains(e.target))
                setOpen(false);
        }
        document.addEventListener('mousedown', onDoc);
        return () => document.removeEventListener('mousedown', onDoc);
    }, []);
    const pitch = variant === 'pitch';
    const btn = pitch
        ? 'text-slate-200 hover:text-amber-400 border border-slate-600'
        : 'text-slate-700 dark:text-slate-200 hover:text-amber-700 dark:hover:text-amber-400 border border-slate-300 dark:border-slate-600';
    return (_jsxs("div", { className: `relative ${className}`, ref: ref, children: [_jsxs("button", { type: "button", onClick: () => setOpen((o) => !o), className: `inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium transition ${btn}`, "aria-expanded": open, "aria-haspopup": "menu", children: [menuLabel, _jsx(ChevronDown, { className: "h-4 w-4 opacity-80", "aria-hidden": true })] }), open && (_jsx("div", { className: "absolute right-0 z-[80] mt-2 min-w-[14rem] rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-600 dark:bg-slate-900", role: "menu", children: _jsx("ul", { className: "flex flex-col gap-0.5", children: properties.map((p) => {
                        const isHere = p.id === currentPropertyId;
                        const locked = p.status === 'locked';
                        const inner = (_jsxs("span", { className: "flex w-full items-center justify-between gap-2", children: [_jsxs("span", { className: isHere ? 'font-semibold text-amber-700 dark:text-amber-400' : '', children: [p.label, isHere ? ' · here' : ''] }), locked && _jsx(Lock, { className: "h-3.5 w-3.5 shrink-0 opacity-60", "aria-hidden": true })] }));
                        return (_jsx("li", { role: "none", children: locked && p.upgradeHref ? (_jsxs("a", { role: "menuitem", href: p.upgradeHref, className: "flex rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800", children: [inner, p.upgradeLabel && (_jsx("span", { className: "ml-2 text-xs text-amber-600 dark:text-amber-400", children: p.upgradeLabel }))] })) : p.external ? (_jsx("a", { role: "menuitem", href: p.href, target: "_blank", rel: "noopener noreferrer", className: "flex rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800", children: inner })) : (_jsx(Link, { role: "menuitem", href: p.href, className: "flex rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800", children: inner })) }, p.id));
                    }) }) }))] }));
}
