export type PropertyStatus = 'open' | 'entitled' | 'locked';
export interface CastaliaProperty {
    id: string;
    label: string;
    href: string;
    status: PropertyStatus;
    external?: boolean;
    upgradeHref?: string;
    upgradeLabel?: string;
}
export interface CastaliaPropertySwitcherProps {
    properties: CastaliaProperty[];
    currentPropertyId: string;
    /** e.g. "Castalia properties" */
    menuLabel?: string;
    variant?: 'default' | 'pitch';
    className?: string;
}
/**
 * Institutional map: public properties, entitled, and locked (optional upgrade).
 * Does not fetch session — pass computed `status` from the app layer.
 */
export declare function CastaliaPropertySwitcher({ properties, currentPropertyId, menuLabel, variant, className, }: CastaliaPropertySwitcherProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=CastaliaPropertySwitcher.d.ts.map