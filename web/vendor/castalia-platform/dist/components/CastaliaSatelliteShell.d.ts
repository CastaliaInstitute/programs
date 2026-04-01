export interface CastaliaSatelliteShellProps {
    siteId: string;
    propertyTitle: string;
    children: React.ReactNode;
    /** Institute origin for links (default https://castalia.institute) */
    instituteOrigin?: string;
    /** Public logos if not served from this host */
    logoSrc?: string;
    logoSrcDark?: string;
    logoWhiteSrc?: string;
    /** When true, desktop quick links hide like www homepage */
    isHomePage?: boolean;
    className?: string;
}
/**
 * Full chrome for properties on other hosts (bookclub.*, symposia.*, etc.).
 * Uses absolute links to the main institute site for nav and legal.
 */
export declare function CastaliaSatelliteShell({ siteId, propertyTitle, children, instituteOrigin, logoSrc, logoSrcDark, logoWhiteSrc, isHomePage, className, }: CastaliaSatelliteShellProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=CastaliaSatelliteShell.d.ts.map