"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const metrics = [
  { value: "3.7M+", label: "annotations" },
  { value: "99.2%", label: "quality score" },
  { value: "25+", label: "datasets" },
  { value: "8", label: "modalities" },
];

const testimonials = [
  {
    quote:
      "We needed egocentric video data that didn't exist yet and a team who could label it with robotics-grade precision. Claru handled both — from capture protocol design to frame-level annotation.",
    author: "Founder & CEO",
    org: "Khosla Ventures & General Catalyst backed startup",
  },
  {
    quote:
      "The difference is night and day. With our previous vendor, we'd wait a week for labeled data, then spend another week fixing errors. With Claru, the team stays tightly aligned with ours.",
    author: "Senior Research Scientist",
    org: "NVIDIA backed VLM lab",
  },
  {
    quote:
      "Most annotation vendors give you a portal and a prayer. Claru gave us a dedicated team who actually understood what we were building.",
    author: "Principal Research Engineer",
    org: "Bessemer Ventures backed company",
  },
  {
    quote:
      "We needed to go from zero training data to production-ready dataset in 8 weeks. Claru sourced the raw video, structured the annotation pipeline, and embedded reviewers who caught edge cases our internal QA missed.",
    author: "Founder",
    org: "YC backed company, Series A",
  },
];

function CountUpMetric({ value }: { value: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref}>
      <motion.span
        className="block font-mono text-4xl font-bold text-[var(--accent-primary)] md:text-5xl"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {value}
      </motion.span>
    </div>
  );
}

export default function SocialProofV2() {
  const reducedMotion = useReducedMotion();

  return (
    <section id="proof" className="relative bg-[var(--bg-primary)] py-24">
      <div className="container mx-auto px-6">
        <span className="mb-8 block font-mono text-sm text-[var(--accent-primary)]">
          {"// PROOF OF WORK"}
        </span>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="text-center">
              {reducedMotion ? (
                <span className="block font-mono text-4xl font-bold text-[var(--accent-primary)] md:text-5xl">
                  {metric.value}
                </span>
              ) : (
                <CountUpMetric value={metric.value} />
              )}
              <span className="mt-2 block font-mono text-sm text-white/60">
                {metric.label}
              </span>
            </div>
          ))}
        </div>

        {/* Testimonials — horizontal scroll */}
        <div className="mt-16 -mx-6 overflow-x-auto px-6 scrollbar-hide">
          <div className="flex gap-6" style={{ minWidth: "max-content" }}>
            {testimonials.map((t) => (
              <div
                key={t.author}
                className="w-80 shrink-0 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6"
              >
                <p className="mb-4 text-sm leading-relaxed text-white/80">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <span className="block text-sm font-medium text-white">
                    {t.author}
                  </span>
                  <span className="block text-xs text-white/40">{t.org}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
