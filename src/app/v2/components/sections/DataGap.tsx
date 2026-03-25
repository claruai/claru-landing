"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import { useReducedMotion } from "../../hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const CRTScreen = dynamic(
  () => import("shaders/react").then((mod) => mod.CRTScreen),
  { ssr: false }
);

const degradedSources = [
  { label: "YouTube-DL scrape", src: "/images/hero-poster.webp" },
  { label: "Reddit dump", src: "/images/hero-poster.webp" },
  { label: "Stock footage", src: "/images/hero-poster.webp" },
  { label: "Synthetic render", src: "/images/hero-poster.webp" },
];

const enrichmentViews = [
  { label: "Raw", color: "#e8e8e8" },
  { label: "Depth", color: "#4A9EDE" },
  { label: "Pose", color: "#DE8A4A" },
  { label: "Segmentation", color: "#9E6ADE" },
];

export default function DataGap() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reducedMotion || !sectionRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=150vh",
          pin: true,
          anticipatePin: 1,
          scrub: 1,
          onRefresh: () => ScrollTrigger.refresh(),
        },
      });

      // 0-40%: both visible
      tl.to({}, { duration: 0.4 });

      // 40-60%: left fades out
      tl.to(
        leftRef.current,
        { opacity: 0, x: -50, duration: 0.2, ease: "power2.inOut" },
        0.4
      );

      // 60-100%: right expands
      tl.to(
        rightRef.current,
        { width: "100%", duration: 0.4, ease: "power2.inOut" },
        0.6
      );
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  // Handle resize + orientationchange
  useGSAP(() => {
    if (reducedMotion) return;

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("resize", refresh);
    window.addEventListener("orientationchange", refresh);
    return () => {
      window.removeEventListener("resize", refresh);
      window.removeEventListener("orientationchange", refresh);
    };
  }, { dependencies: [reducedMotion] });

  if (reducedMotion) {
    return (
      <section
        id="data-gap"
        className="relative bg-[var(--bg-primary)] py-24"
      >
        <div className="container mx-auto px-6">
          <span className="font-mono text-sm text-[var(--accent-primary)]">
            {"// THE DATA GAP"}
          </span>

          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {/* Left: degraded */}
            <div className="grid grid-cols-2 gap-3">
              {degradedSources.map((item) => (
                <div key={item.label} className="relative overflow-hidden rounded-lg">
                  <img
                    src={item.src}
                    alt={item.label}
                    className="h-32 w-full object-cover"
                    style={{
                      filter: "grayscale(50%) brightness(0.6) contrast(0.8)",
                    }}
                  />
                  <span className="absolute bottom-2 left-2 font-mono text-xs text-[rgba(255,100,100,0.6)]">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Right: enriched */}
            <div className="grid grid-cols-2 gap-3">
              {enrichmentViews.map((view) => (
                <div
                  key={view.label}
                  className="flex h-32 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)]"
                >
                  <span
                    className="font-mono text-sm font-medium"
                    style={{ color: view.color }}
                  >
                    {view.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-8 text-base text-white/80">
            Open datasets get you started. Production models need
            purpose-collected, commercially licensed data with consistent
            enrichment across every clip.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="data-gap"
      className="relative flex min-h-screen items-center bg-[var(--bg-primary)]"
    >
      <div className="container mx-auto px-6">
        <span className="mb-8 block font-mono text-sm text-[var(--accent-primary)]">
          {"// THE DATA GAP"}
        </span>

        <div className="flex gap-8">
          {/* Left half: degraded sources */}
          <div ref={leftRef} className="w-1/2 shrink-0">
            <div className="grid grid-cols-2 gap-3">
              {degradedSources.map((item) => (
                <div
                  key={item.label}
                  className="relative overflow-hidden rounded-lg"
                >
                  <div className="relative">
                    <img
                      src={item.src}
                      alt={item.label}
                      className="h-40 w-full object-cover"
                      style={{
                        filter:
                          "grayscale(50%) brightness(0.6) contrast(0.8)",
                      }}
                    />
                    <div className="pointer-events-none absolute inset-0">
                      <CRTScreen opacity={0.3} />
                    </div>
                  </div>
                  <span className="absolute bottom-2 left-2 font-mono text-xs text-[rgba(255,100,100,0.6)]">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-6 text-base text-white/80">
              Open datasets get you started. Production models need
              purpose-collected, commercially licensed data with consistent
              enrichment across every clip.
            </p>
          </div>

          {/* Right half: enriched views */}
          <div ref={rightRef} className="w-1/2 shrink-0">
            <div className="grid grid-cols-2 gap-3">
              {enrichmentViews.map((view) => (
                <div
                  key={view.label}
                  className="flex h-40 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)]"
                >
                  <div className="text-center">
                    <div
                      className="mx-auto mb-2 h-20 w-full rounded bg-[var(--bg-secondary)]"
                      style={{
                        borderBottom: `2px solid ${view.color}`,
                      }}
                    />
                    <span
                      className="font-mono text-sm font-medium"
                      style={{ color: view.color }}
                    >
                      {view.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
