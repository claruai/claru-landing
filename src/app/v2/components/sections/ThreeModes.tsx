"use client";

import { motion } from "framer-motion";
import { BookOpen, Globe, Layers } from "lucide-react";
import Link from "next/link";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const modes = [
  {
    icon: BookOpen,
    title: "Browse & Buy",
    bullets: [
      "Search 25+ curated datasets by modality, environment, or task",
      "Preview clips with enrichment overlays before purchasing",
      "Download production-ready data in standard formats",
      "Per-dataset licensing with commercial rights included",
    ],
    cta: { label: "Browse Catalog", href: "/catalog" },
  },
  {
    icon: Globe,
    title: "Commission Collection",
    bullets: [
      "Define your target environment and capture requirements",
      "Our global network collects in kitchens, warehouses, roads, and more",
      "Commercially licensed footage — not scraped, not synthetic",
      "Delivered with consistent enrichment across every clip",
    ],
    cta: { label: "Start a Brief", href: "#contact" },
  },
  {
    icon: Layers,
    title: "Enrich Your Data",
    bullets: [
      "Send us your raw video — we add depth, pose, and segmentation",
      "Consistent enrichment pipeline across your entire corpus",
      "Human QA on every annotation, not just spot checks",
      "Per-minute pricing with volume discounts",
    ],
    cta: { label: "See the Pipeline", href: "#enrichment" },
  },
];

export default function ThreeModes() {
  const reducedMotion = useReducedMotion();

  return (
    <section id="how-it-works" className="relative bg-[var(--bg-primary)] py-24">
      <div className="container mx-auto px-6">
        <span className="mb-8 block font-mono text-sm text-[var(--accent-primary)]">
          {"// HOW IT WORKS"}
        </span>

        <div className="grid gap-6 md:grid-cols-3">
          {modes.map((mode, i) => {
            const Icon = mode.icon;
            const card = (
              <div className="flex h-full flex-col rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6">
                <Icon
                  className="mb-4 h-8 w-8 text-[var(--accent-primary)]"
                  strokeWidth={1.5}
                />
                <h3 className="mb-4 text-xl font-bold text-white">
                  {mode.title}
                </h3>
                <ul className="mb-6 flex-1 space-y-2">
                  {mode.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex gap-2 text-sm text-white/70"
                    >
                      <span className="mt-1 shrink-0 text-[var(--accent-primary)]">
                        ›
                      </span>
                      {bullet}
                    </li>
                  ))}
                </ul>
                {mode.cta.href.startsWith("/") ? (
                  <Link
                    href={mode.cta.href}
                    className="inline-flex items-center gap-1 font-mono text-sm text-[var(--accent-primary)] transition-colors hover:text-[var(--accent-secondary)]"
                  >
                    {mode.cta.label} <span aria-hidden>→</span>
                  </Link>
                ) : (
                  <a
                    href={mode.cta.href}
                    className="inline-flex items-center gap-1 font-mono text-sm text-[var(--accent-primary)] transition-colors hover:text-[var(--accent-secondary)]"
                  >
                    {mode.cta.label} <span aria-hidden>→</span>
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
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {card}
              </motion.div>
            );
          })}
        </div>

        <p className="mt-8 text-center font-mono text-sm text-white/60">
          Per-dataset licensing · Per-hour collection rates · Per-minute
          enrichment
        </p>
      </div>
    </section>
  );
}
