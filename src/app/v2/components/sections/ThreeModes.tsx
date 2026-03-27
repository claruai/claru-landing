"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BookOpen, Globe, Layers } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const modes = [
  {
    icon: BookOpen,
    number: "01",
    title: "Browse & License",
    bullets: [
      "Search 25+ curated datasets by modality, environment, or task",
      "Preview clips with expert annotations before purchasing",
      "Download annotated datasets in standard formats",
      "Per-dataset licensing with commercial rights included",
    ],
    cta: { label: "Browse Catalog", href: "/catalog" },
  },
  {
    icon: Globe,
    number: "02",
    title: "Commission Collection",
    bullets: [
      "Define your target environment and capture requirements",
      "Our global network collects in kitchens, warehouses, roads, and more",
      "Commercially licensed footage with full provenance",
      "Delivered with expert human annotation to your spec",
    ],
    cta: { label: "Start a Brief", href: "#contact" },
  },
  {
    icon: Layers,
    number: "03",
    title: "Custom Annotation",
    bullets: [
      "Send us your raw footage — our expert annotators add the labels your model needs",
      "Same annotation standards and QA process across your entire dataset",
      "From bounding boxes to RLHF preference rankings",
      "Per-minute pricing with volume discounts",
    ],
    cta: { label: "See the Pipeline", href: "#enrichment" },
  },
];

/* -------------------------------------------------------------------------- */
/*  Rolling step number — digits roll up from below                            */
/* -------------------------------------------------------------------------- */

function RollingNumber({ value, inView }: { value: string; inView: boolean }) {
  return (
    <span className="inline-flex overflow-hidden font-mono text-3xl font-black text-[var(--accent-primary)] md:text-4xl" style={{ height: "1.1em", lineHeight: "1.1" }}>
      {value.split("").map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          className="inline-block"
          initial={{ y: "110%", opacity: 0 }}
          animate={inView ? { y: "0%", opacity: 1 } : { y: "110%", opacity: 0 }}
          transition={{
            delay: i * 0.12,
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Connecting arrow between cards (desktop only)                              */
/* -------------------------------------------------------------------------- */

function ConnectorArrow({ index, reducedMotion }: { index: number; reducedMotion: boolean }) {
  return (
    <motion.div
      className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 md:flex items-center"
      initial={reducedMotion ? {} : { opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 + index * 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="h-px w-3 bg-[var(--accent-primary)]/30" />
      <svg width="8" height="12" viewBox="0 0 8 12" fill="none" className="text-[var(--accent-primary)]/30">
        <path d="M1 1L6 6L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.div>
  );
}

export default function ThreeModes() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(cardsRef, { once: true, margin: "-80px" });

  /* GSAP: Subtle parallax on headline */
  useGSAP(() => {
    if (reducedMotion || !headlineRef.current || !sectionRef.current) return;

    gsap.to(headlineRef.current, {
      y: -30,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }, { dependencies: [reducedMotion] });

  return (
    <section ref={sectionRef} id="how-it-works" className="relative bg-[var(--bg-primary)] py-32 md:py-40">
      <div className="container mx-auto px-6">
        <div ref={headlineRef} className="mb-16">
          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="v2-section-label mb-6">
              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--accent-primary)]">
                {"// HOW IT WORKS"}
              </span>
            </div>
            <h2 className="max-w-lg text-3xl font-bold leading-[1.1] tracking-[-0.02em] text-white md:text-4xl lg:text-[42px]">
              Three ways to get the data{" "}
              <span className="text-white/40">your models need.</span>
            </h2>
          </motion.div>
        </div>

        <div ref={cardsRef} className="relative grid gap-6 md:grid-cols-3">
          {modes.map((mode, i) => {
            const Icon = mode.icon;
            const isLast = i === modes.length - 1;

            const card = (
              <div className="v2-card group flex h-full flex-col !rounded-2xl !p-8 relative">
                {/* Connecting arrow to next card */}
                {!isLast && <ConnectorArrow index={i} reducedMotion={reducedMotion} />}

                {/* Top row: rolling number + icon */}
                <div className="mb-8 flex items-center justify-between">
                  {reducedMotion ? (
                    <span className="font-mono text-3xl font-black text-[var(--accent-primary)] md:text-4xl">
                      {mode.number}
                    </span>
                  ) : (
                    <RollingNumber value={mode.number} inView={gridInView} />
                  )}
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--accent-primary)]/15 bg-[var(--accent-primary)]/5 transition-all duration-400 group-hover:border-[var(--accent-primary)]/30 group-hover:bg-[var(--accent-primary)]/10 group-hover:shadow-[0_0_20px_rgba(146,176,144,0.1)]">
                    <Icon
                      className="h-5 w-5 text-[var(--accent-primary)]"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>

                <h3 className="mb-5 text-xl font-bold tracking-[-0.01em] text-white lg:text-2xl">
                  {mode.title}
                </h3>

                <ul className="mb-10 flex-1 space-y-3.5">
                  {mode.bullets.map((bullet, bi) => (
                    <motion.li
                      key={bullet}
                      className="flex gap-3 text-[13px] leading-relaxed text-white/50"
                      initial={reducedMotion ? {} : { opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: i * 0.12 + bi * 0.06 + 0.3,
                        duration: 0.4,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[var(--accent-primary)]/40" />
                      {bullet}
                    </motion.li>
                  ))}
                </ul>

                {/* CTA link */}
                {mode.cta.href.startsWith("/") ? (
                  <Link
                    href={mode.cta.href}
                    className="inline-flex items-center gap-2 font-mono text-sm font-medium text-[var(--accent-primary)] transition-all duration-300 hover:gap-3 hover:text-[var(--accent-secondary)]"
                  >
                    {mode.cta.label}
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                ) : (
                  <a
                    href={mode.cta.href}
                    className="inline-flex items-center gap-2 font-mono text-sm font-medium text-[var(--accent-primary)] transition-all duration-300 hover:gap-3 hover:text-[var(--accent-secondary)]"
                  >
                    {mode.cta.label}
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </a>
                )}
              </div>
            );

            if (reducedMotion) return <div key={mode.title}>{card}</div>;

            return (
              <motion.div
                key={mode.title}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  delay: i * 0.15,
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {card}
              </motion.div>
            );
          })}
        </div>

        <motion.p
          className="mt-12 text-center font-mono text-xs tracking-wide text-white/30"
          initial={reducedMotion ? {} : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Per-dataset licensing · Per-hour collection rates · Per-minute
          annotation
        </motion.p>
      </div>
    </section>
  );
}
