import type { ReactNode } from 'react';
import type { PageVisibility, UnauthorizedMode } from '../types/page-contract.js';
import { type AccessContext } from '../lib/visibility.js';
export interface GateCommonProps {
    children: ReactNode;
}
export interface AuthGateProps extends GateCommonProps {
    loading: boolean;
    signedIn: boolean;
    signInHref?: string;
    fallback?: ReactNode;
}
/** Anonymous vs member — client or RSC wrapper supplies booleans from your auth layer. */
export declare function AuthGate({ loading, signedIn, children, signInHref, fallback }: AuthGateProps): import("react/jsx-runtime").JSX.Element;
export interface EntitlementGateProps extends GateCommonProps {
    hasAccess: boolean;
    upgradeHref?: string;
    upgradeLabel?: string;
    fallback?: ReactNode;
}
export declare function EntitlementGate({ hasAccess, children, upgradeHref, upgradeLabel, fallback, }: EntitlementGateProps): import("react/jsx-runtime").JSX.Element;
export interface RoleGateProps extends GateCommonProps {
    allowed: boolean;
    fallback?: ReactNode;
}
export declare function RoleGate({ allowed, children, fallback }: RoleGateProps): import("react/jsx-runtime").JSX.Element;
export interface PageVisibilityGateProps extends GateCommonProps {
    visibility: PageVisibility;
    entitlements?: string[];
    roles?: string[];
    resourceOwnerId?: string | null;
    ctx: AccessContext;
    unauthorizedMode?: UnauthorizedMode;
    signInHref?: string;
    upgradeHref?: string;
    teaser?: ReactNode;
}
/**
 * Composes access from Page Contract fields — use after resolving ctx on the server
 * and passing results, or use canAccessPage in middleware and only render children when allowed.
 */
export declare function PageVisibilityGate({ visibility, entitlements, roles, resourceOwnerId, ctx, unauthorizedMode, signInHref, upgradeHref, children, teaser, }: PageVisibilityGateProps): import("react/jsx-runtime").JSX.Element;
export declare function VisibilityBadge({ visibility }: {
    visibility: PageVisibility;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=gates.d.ts.map