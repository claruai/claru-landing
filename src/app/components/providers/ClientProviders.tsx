"use client";

import { useEffect, useState, ReactNode } from "react";
import dynamic from "next/dynamic";

const LenisProvider = dynamic(() => import("./LenisProvider"), { ssr: false });
const HeroBackground = dynamic(
  () => import("../effects/HeroBackground"),
  { ssr: false },
);

interface ClientProvidersProps {
  children: ReactNode;
}

/**
 * Client-side providers wrapper for the homepage.
 *
 * Critical constraint: children (server-rendered content) are ALWAYS rendered,
 * whether the client has mounted or not. The mounted guard only controls the
 * effects layer (HeroBackground, noise overlay) and Lenis smooth scrolling.
 */
export default function ClientProviders({ children }: ClientProvidersProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {mounted && <HeroBackground />}
      {mounted && <div className="noise-overlay-animated" />}
      {mounted ? <LenisProvider>{children}</LenisProvider> : children}
    </>
  );
}
