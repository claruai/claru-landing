"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useReducedMotion } from "../../hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ShaderCRT = dynamic(
  () => import("shaders/react").then((mod) => {
    const { Shader, CRTScreen } = mod;
    const ShaderCRTScreen = ({ opacity = 0.3 }: { opacity?: number }) => (
      <Shader style={{ opacity }}>
        <CRTScreen />
      </Shader>
    );
    ShaderCRTScreen.displayName = "ShaderCRTScreen";
    return ShaderCRTScreen;
  }),
  { ssr: false }
);

const degradedSources = [
  { label: "YouTube-DL scrape", problem: "No license", src: "/images/hero-poster.webp" },
  { label: "Reddit dump", problem: "No consent", src: "/images/hero-poster.webp" },
  { label: "Stock footage", problem: "Not real-world", src: "/images/hero-poster.webp" },
  { label: "Synthetic render", problem: "Domain gap", src: "/images/hero-poster.webp" },
];

const enrichmentViews = [
  { label: "Raw", color: "#e8e8e8", icon: "R" },
  { label: "Depth", color: "#4A9EDE", icon: "D" },
  { label: "Pose", color: "#DE8A4A", icon: "P" },
  { label: "Segmentation", color: "#9E6ADE", icon: "S" },
];

export default function DataGap() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reducedMotion || !sectionRef.current || window.innerWidth < 768) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=150vh",
          pin: true,
          anticipatePin: 1,
          scrub: 1,
        },
      });

      tl.to({}, { duration: 0.4 });

      tl.to(
        leftRef.current,
        { opacity: 0, x: -50, duration: 0.2, ease: "power2.inOut" },
        0.4
      );

      tl.to(
        rightRef.current,
        { width: "100%", duration: 0.4, ease: "power2.inOut" },
        0.6
      );
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

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

  const sectionLabel = (
    <div className="mb-16">
      <div className="v2-section-label mb-6">
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--accent-primary)]">
          {"// THE DATA GAP"}
        </span>
      </div>
      <h2 className="max-w-2xl text-3xl font-bold leading-[1.1] tracking-[-0.02em] text-white md:text-4xl lg:text-[42px]">
        Open datasets work for prototyping.{" "}
        <span className="text-white/40">
          Production models need commercially licensed data, collected for your specific domain, with expert human annotation.
        </span>
      </h2>
    </div>
  );

  if (reducedMotion) {
    return (
      <section id="data-gap" className="relative bg-[var(--bg-primary)] py-32 md:py-40">
        <div className="container mx-auto px-6">
          {sectionLabel}
          <div className="grid gap-8 md:grid-cols-2">
            <div className="grid grid-cols-2 gap-3">
              {degradedSources.map((item) => (
                <div key={item.label} className="group relative overflow-hidden rounded-lg border border-white/5">
                  <img src={item.src} alt={item.label} className="h-36 w-full object-cover" style={{ filter: "grayscale(60%) brightness(0.5) contrast(0.7)" }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <span className="block font-mono text-[11px] font-medium text-[rgba(255,100,100,0.8)]">{item.label}</span>
                    <span className="block font-mono text-[10px] text-white/30">{item.problem}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {enrichmentViews.map((view) => (
                <div key={view.label} className="flex h-36 flex-col items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)]">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full border" style={{ borderColor: `${view.color}40`, backgroundColor: `${view.color}10` }}>
                    <span className="font-mono text-sm font-bold" style={{ color: view.color }}>{view.icon}</span>
                  </div>
                  <span className="font-mono text-xs font-medium" style={{ color: view.color }}>{view.label}</span>
                </div>
              ))}
            </div>
          </div>
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
        {sectionLabel}

        <div className="flex flex-col gap-8 md:flex-row">
          {/* Left half: degraded sources */}
          <div ref={leftRef} className="w-full shrink-0 md:w-1/2">
            <p className="mb-4 font-mono text-xs uppercase tracking-wider text-white/30">
              Typical data sources
            </p>
            <div className="grid grid-cols-2 gap-3">
              {degradedSources.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative overflow-hidden rounded-lg border border-white/5"
                >
                  <div className="relative">
                    <img
                      src={item.src}
                      alt={item.label}
                      className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{
                        filter: "grayscale(60%) brightness(0.5) contrast(0.7)",
                      }}
                    />
                    <div className="pointer-events-none absolute inset-0">
                      <ShaderCRT opacity={0.3} />
                    </div>
                    {/* Gradient overlay for text legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <span className="block font-mono text-[11px] font-medium text-[rgba(255,100,100,0.8)]">
                      {item.label}
                    </span>
                    <span className="block font-mono text-[10px] text-white/30">
                      {item.problem}
                    </span>
                  </div>
                  {/* Diagonal warning stripe */}
                  <div className="absolute right-2 top-2 rounded bg-[rgba(255,80,80,0.15)] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[rgba(255,100,100,0.6)]">
                    Risk
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right half: enriched views */}
          <div ref={rightRef} className="w-full shrink-0 md:w-1/2">
            <p className="mb-4 font-mono text-xs uppercase tracking-wider text-[var(--accent-primary)]/60">
              Claru annotation layers
            </p>
            <div className="grid grid-cols-2 gap-3">
              {enrichmentViews.map((view, i) => (
                <motion.div
                  key={view.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="group flex h-40 flex-col items-center justify-center rounded-lg border transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    borderColor: `${view.color}15`,
                    backgroundColor: `${view.color}05`,
                  }}
                >
                  {/* Icon circle */}
                  <div
                    className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-300 group-hover:scale-110"
                    style={{
                      borderColor: `${view.color}30`,
                      backgroundColor: `${view.color}10`,
                      boxShadow: `0 0 20px ${view.color}10`,
                    }}
                  >
                    <span
                      className="font-mono text-base font-bold"
                      style={{ color: view.color }}
                    >
                      {view.icon}
                    </span>
                  </div>
                  <span
                    className="font-mono text-xs font-medium tracking-wide"
                    style={{ color: view.color }}
                  >
                    {view.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
