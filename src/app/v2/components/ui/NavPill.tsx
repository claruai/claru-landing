"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function NavPill() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past ~80vh (hero area)
      setVisible(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed left-1/2 top-4 z-50 -translate-x-1/2 transition-all duration-500 ${
        visible
          ? "translate-y-0 opacity-100"
          : "-translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      <nav className="flex items-center gap-3 rounded-full border border-white/[0.08] bg-[#0a0908]/80 px-3 py-1.5 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.4)] sm:gap-6 sm:px-6 sm:py-2.5">
        {/* CLARU logo text */}
        <Link
          href="/"
          className="min-h-[44px] flex items-center font-mono text-[13px] font-bold tracking-[0.15em] text-white/80 transition-colors hover:text-[#92B090]"
        >
          CLARU
        </Link>

        {/* Section links — hidden on mobile to prevent overflow */}
        <div className="hidden items-center gap-4 sm:flex">
          <a
            href="#catalog"
            className="min-h-[44px] flex items-center font-mono text-[11px] text-white/35 transition-colors hover:text-white/60"
          >
            Data
          </a>
          <a
            href="#enrichment"
            className="min-h-[44px] flex items-center font-mono text-[11px] text-white/35 transition-colors hover:text-white/60"
          >
            Enrichment
          </a>
          <Link
            href="/for-annotators"
            className="min-h-[44px] flex items-center font-mono text-[11px] text-white/35 transition-colors hover:text-white/60"
          >
            Annotators
          </Link>
        </div>

        {/* CTA button — min 44px touch target */}
        <Link
          href="#contact"
          className="flex min-h-[44px] items-center whitespace-nowrap rounded-full bg-[#92B090] px-5 py-2 font-mono text-[11px] font-semibold tracking-[0.05em] text-[#0a0908] transition-all duration-300 hover:bg-[#a3c1a1] hover:shadow-[0_0_20px_rgba(146,176,144,0.25)] sm:px-5"
        >
          Book a Call
        </Link>
      </nav>
    </div>
  );
}
