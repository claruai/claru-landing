"use client";

import { motion } from "framer-motion";
import { BookOpen, Globe, Layers } from "lucide-react";
import Link from "next/link";
import { useReducedMotion } from "../../hooks/useReducedMotion";

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

export default function ThreeModes() {
  const reducedMotion = useReducedMotion();

  return (
    <section id="how-it-works" className="relative bg-[var(--bg-primary)] py-32 md:py-40">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <div className="v2-section-label mb-6">
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--accent-primary)]">
              {"// HOW IT WORKS"}
            </span>
          </div>
          <h2 className="max-w-lg text-3xl font-bold leading-[1.1] tracking-[-0.02em] text-white md:text-4xl lg:text-[42px]">
            Three ways to get the data{" "}
            <span className="text-white/40">your models need.</span>
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {modes.map((mode, i) => {
            const Icon = mode.icon;
            const card = (
              <div className="v2-card group flex h-full flex-col !rounded-2xl !p-8">
                {/* Top row: number + icon */}
                <div className="mb-8 flex items-center justify-between">
                  <span className="font-mono text-[11px] tracking-wider text-white/15">
                    {mode.number}
                  </span>
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
                  {mode.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex gap-3 text-[13px] leading-relaxed text-white/50"
                    >
                      <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[var(--accent-primary)]/40" />
                      {bullet}
                    </li>
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
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  delay: i * 0.12,
                  duration: 0.6,
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
