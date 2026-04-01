import type { NavItem } from '../lib/nav.js';
export interface CastaliaFooterProps {
    embed?: boolean;
    institutionTitle?: string;
    institutionBody?: React.ReactNode;
    membershipLinks?: NavItem[];
    propertyLinks?: NavItem[];
    legalLinks?: NavItem[];
    topSlot?: React.ReactNode;
    copyright?: string;
    platformVersion?: string;
    siteLabel?: string;
    environment?: 'production' | 'staging' | 'preview';
    versionDetailHref?: string;
    className?: string;
    /** Shown after legal links in the copyright row (e.g. deployment badge) */
    deploymentSlot?: React.ReactNode;
    /** Replaces the default platform version line on the left */
    versionInfoSlot?: React.ReactNode;
    /** e.g. GitHub status lights — absolute bottom-right inside footer */
    cornerSlot?: React.ReactNode;
    logoSrc?: string;
    logoWhiteSrc?: string;
}
export declare function CastaliaFooter({ embed, institutionTitle, institutionBody, membershipLinks, propertyLinks, legalLinks, topSlot, copyright, platformVersion, siteLabel, environment, versionDetailHref, className, deploymentSlot, versionInfoSlot, cornerSlot, logoSrc, logoWhiteSrc, }: CastaliaFooterProps): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=CastaliaFooter.d.ts.map