import type { Metadata } from "next";
import { PortalNav } from "./PortalNav";
import { PortalThemeProvider } from "./PortalThemeProvider";

export const metadata: Metadata = {
  title: "Portal | Claru",
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Portal layout -- minimal header with Catalog / Request / Sign Out nav.
 * Auth is enforced by middleware (src/middleware.ts) so we do not check
 * the session here. The layout simply renders the portal chrome.
 */
export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalThemeProvider>
      <div className="portal-theme-scope min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <PortalNav />
        <main className="pt-16">{children}</main>
      </div>
    </PortalThemeProvider>
  );
}
