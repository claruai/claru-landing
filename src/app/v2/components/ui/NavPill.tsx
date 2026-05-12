"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function NavPill() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Single fade-in on mount; nav stays visible from then on so re-entering
    // the hero on scroll-up doesn't trigger a flicker.
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      className={`fixed left-1/2 top-4 z-50 -translate-x-1/2 transition-opacity duration-500 ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
    >
      <nav className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-[#0a0908]/80 px-2.5 py-1.5 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.4)] sm:gap-6 sm:px-6 sm:py-2.5">
        {/* CLARU logo text */}
        <Link
          href="/"
          className="min-h-[44px] flex items-center font-mono text-[12px] sm:text-[13px] font-bold tracking-[0.12em] sm:tracking-[0.15em] text-white/80 transition-colors hover:text-[#92B090]"
        >
          CLARU
        </Link>

        {/* Section links — kept on mobile but tightened to fit the pill. */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/partnerships"
            className="min-h-[44px] flex items-center whitespace-nowrap font-mono text-[10px] sm:text-[11px] text-white/35 transition-colors hover:text-white/60"
          >
            Partners
            <span className="hidden sm:inline">hips</span>
          </Link>
          <Link
            href="/for-annotators"
            className="min-h-[44px] flex items-center whitespace-nowrap font-mono text-[10px] sm:text-[11px] text-white/35 transition-colors hover:text-white/60"
          >
            <span className="sm:hidden">Annotators</span>
            <span className="hidden sm:inline">For Annotators</span>
          </Link>
        </div>

        {/* CTA button — min 44px touch target */}
        <Link
          href="#contact"
          className="flex min-h-[44px] items-center whitespace-nowrap rounded-full bg-[#92B090] px-3 sm:px-5 py-2 font-mono text-[10px] sm:text-[11px] font-semibold tracking-[0.05em] text-[#0a0908] transition-all duration-300 hover:bg-[#a3c1a1] hover:shadow-[0_0_20px_rgba(146,176,144,0.25)]"
        >
          Book a Call
        </Link>
      </nav>
    </div>
  );
}
