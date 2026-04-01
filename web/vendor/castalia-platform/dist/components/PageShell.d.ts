import type { ReactNode } from 'react';
import type { PageContract } from '../types/page-contract.js';
export interface PageShellProps extends PageContract {
    children: ReactNode;
    /** Header/footer rendered by layout — this wrapper documents contract + SEO helpers only */
    /** Optional: emit meta for Next.js Metadata API */
    canonicalPath?: string;
}
/**
 * Logical shell contract — use inside app/layout or per-route layout.
 * Renders children only; header/footer should wrap at layout level using CastaliaHeader/Footer.
 * Use exported helpers with your framework's metadata API.
 */
export declare function PageShell({ children }: PageShellProps): import("react/jsx-runtime").JSX.Element;
export declare function pageMetaFromContract(contract: PageContract, canonicalPath?: string): {
    title: string;
    robots: "noindex, nofollow" | "index, follow";
    alternates: {
        canonical: string;
    } | undefined;
};
//# sourceMappingURL=PageShell.d.ts.map