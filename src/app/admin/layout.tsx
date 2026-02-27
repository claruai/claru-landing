import type { Metadata } from "next";
import { PortalThemeProvider } from "../portal/PortalThemeProvider";

export const metadata: Metadata = {
  title: "Admin | Claru",
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Admin layout -- minimal chrome, no public Header/Footer.
 * Supports light/dark mode via shared PortalThemeProvider.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalThemeProvider>
      <div className="portal-theme-scope min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
        {children}
      </div>
    </PortalThemeProvider>
  );
}
