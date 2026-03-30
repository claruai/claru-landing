// ---------------------------------------------------------------------------
// GeoPageShell — Wrapper for GEO landing pages
// ---------------------------------------------------------------------------
// Provides consistent Header + Footer chrome for standalone SEO/GEO pages.
// The shell itself is a server component; Header and Footer are client
// components that hydrate independently.
// ---------------------------------------------------------------------------

import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/sections/Footer";

interface GeoPageShellProps {
  children: React.ReactNode;
}

export default function GeoPageShell({ children }: GeoPageShellProps) {
  return (
    <div style={{ backgroundColor: "#0a0908", color: "#FFFFFF", minHeight: "100vh" }}>
      <Header opaque />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
