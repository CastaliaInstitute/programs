import type { NavItem } from '../lib/nav.js';
export interface CastaliaHeaderProps {
    /** Short id for analytics / switcher, e.g. www, magisterium */
    siteId: string;
    /** Shown next to brand; www may omit or use "Institute" */
    propertyTitle?: string;
    brandHref?: string;
    logoSrc?: string;
    logoSrcDark?: string;
    logoWhiteSrc?: string;
    variant?: 'default' | 'pitch';
    /** When true, header returns null (embed mode) */
    embed?: boolean;
    isHomePage?: boolean;
    isPitchPage?: boolean;
    /** Full menu (drawer) links — local + global */
    drawerNavLinks?: NavItem[];
    /** Optional quick links on desktop when not homepage (e.g. Start Here, About) */
    desktopQuickLinks?: NavItem[];
    joinHref?: string;
    joinLabel?: string;
    supportHref?: string;
    supportLabel?: string;
    /** Zone: center — search, inquire, etc. */
    centerSlot?: React.ReactNode;
    /** Zone: identity — UserMenu from app */
    identitySlot?: React.ReactNode;
    /** Zone: utility — notifications, theme */
    utilitySlot?: React.ReactNode;
    /** Global navigation — property switcher */
    propertySwitcherSlot?: React.ReactNode;
    className?: string;
    /** Appended to brand link (e.g. `font-decorative font-bold`) */
    brandClassName?: string;
}
/**
 * Presentation shell only — no auth decisions. Matches Inquiry.Institute nav structure:
 * brand | center slot | join + quick links + identity + menu.
 */
export declare function CastaliaHeader({ siteId: _siteId, propertyTitle, brandHref, logoSrc, logoSrcDark: _logoSrcDark, logoWhiteSrc, variant, embed, isHomePage, isPitchPage, drawerNavLinks, desktopQuickLinks, joinHref, joinLabel, supportHref, supportLabel, centerSlot, identitySlot, utilitySlot, propertySwitcherSlot, className, brandClassName, }: CastaliaHeaderProps): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=CastaliaHeader.d.ts.map