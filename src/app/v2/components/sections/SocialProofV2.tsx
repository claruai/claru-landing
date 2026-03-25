"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const metrics = [
  { value: "3.7M+", label: "annotations" },
  { value: "97%+", label: "inter-annotator agreement" },
  { value: "25+", label: "datasets" },
  { value: "8", label: "modalities" },
];

const testimonials = [
  {
    quote:
      "We needed egocentric video data that didn't exist yet and a team who could label it with robotics-grade precision. Claru handled both — from capture protocol design to frame-level annotation.",
    author: "Founder & CEO",
    org: "Robotics manipulation startup",
  },
  {
    quote:
      "The difference is night and day. With our previous vendor, we'd wait a week for labeled data, then spend another week fixing errors. With Claru, the team stays tightly aligned with ours.",
    author: "Senior Research Scientist",
    org: "Vision-language model research lab",
  },
  {
    quote:
      "Most annotation vendors give you a portal and a prayer. Claru gave us a dedicated team who actually understood what we were building.",
    author: "Principal Research Engineer",
    org: "Embodied AI company",
  },
  {
    quote:
      "We needed to go from zero training data to production-ready dataset in 8 weeks. Claru sourced the raw video, structured the annotation pipeline, and embedded reviewers who caught edge cases our internal QA missed.",
    author: "Founder",
    org: "Autonomous vehicle startup, Series A",
  },
];

/**
 * Inkwell-style per-character reveal animation.
 * Each character fades + slides in individually for a rolling wave effect.
 */
function InkwellMetric({ value, inView }: { value: string; inView: boolean }) {
  const chars = value.split("");

  return (
    <span className="inline-flex" aria-label={value}>
      {chars.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          className="inline-block font-mono font-bold text-[var(--accent-primary)]"
          style={{ fontSize: "clamp(48px, 7vw, 80px)", perspective: "200px" }}
          initial={{ opacity: 0, y: 30, rotateX: -40 }}
          animate={
            inView
              ? { opacity: 1, y: 0, rotateX: 0 }
              : { opacity: 0, y: 30, rotateX: -40 }
          }
          transition={{
            delay: i * 0.06,
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

function MetricCard({ metric, index, reducedMotion }: { metric: typeof metrics[0]; index: number; reducedMotion: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={reducedMotion ? {} : { opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ delay: index * 0.12, duration: 0.5 }}
    >
      {reducedMotion ? (
        <span
          className="block font-mono font-bold text-[var(--accent-primary)]"
          style={{ fontSize: "clamp(48px, 7vw, 80px)" }}
        >
          {metric.value}
        </span>
      ) : (
        <InkwellMetric value={metric.value} inView={isInView} />
      )}
      <span className="mt-4 block font-mono text-[11px] uppercase tracking-[0.2em] text-white/35">
        {metric.label}
      </span>
    </motion.div>
  );
}

function TestimonialCard({ t, index, reducedMotion }: { t: typeof testimonials[0]; index: number; reducedMotion: boolean }) {
  return (
    <motion.div
      initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-[340px] shrink-0 rounded-2xl border border-[var(--border-subtle)] p-7 transition-all duration-400 hover:border-[var(--accent-primary)]/15 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] md:w-[400px]"
      style={{ background: "linear-gradient(165deg, #121110 0%, #161614 100%)" }}
    >
      {/* Quote mark */}
      <span className="mb-4 block font-serif text-3xl leading-none text-[var(--accent-primary)]/20">
        &ldquo;
      </span>
      <p className="mb-6 text-[14px] leading-[1.7] text-white/55">
        {t.quote}
      </p>
      <div className="border-t border-white/[0.06] pt-5">
        <span className="block text-sm font-medium text-white/85">
          {t.author}
        </span>
        <span className="mt-1 block font-mono text-[11px] text-white/30">{t.org}</span>
      </div>
    </motion.div>
  );
}

export default function SocialProofV2() {
  const reducedMotion = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState({ left: false, right: true });

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const check = () => {
      setCanScroll({
        left: el.scrollLeft > 10,
        right: el.scrollLeft < el.scrollWidth - el.clientWidth - 10,
      });
    };
    el.addEventListener("scroll", check, { passive: true });
    check();
    return () => el.removeEventListener("scroll", check);
  }, []);

  return (
    <section id="proof" className="relative bg-[var(--bg-primary)] py-32 md:py-40">
      <div className="container mx-auto px-6">
        <motion.div
          className="mb-20"
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="v2-section-label mb-6">
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--accent-primary)]">
              {"// PROOF OF WORK"}
            </span>
          </div>
          <h2 className="max-w-lg text-3xl font-bold leading-[1.1] tracking-[-0.02em] text-white md:text-4xl lg:text-[42px]">
            The numbers speak.{" "}
            <span className="text-white/40">So do our clients.</span>
          </h2>
        </motion.div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4 md:gap-10">
          {metrics.map((metric, i) => (
            <MetricCard
              key={metric.label}
              metric={metric}
              index={i}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>

        {/* Divider */}
        <div className="mx-auto my-20 h-px max-w-lg bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        {/* Testimonials -- horizontal scroll with fade edges */}
        <div className="relative -mx-6">
          {/* Fade edges */}
          <div
            className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-16 bg-gradient-to-r from-[var(--bg-primary)] to-transparent transition-opacity duration-300"
            style={{ opacity: canScroll.left ? 1 : 0 }}
          />
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-16 bg-gradient-to-l from-[var(--bg-primary)] to-transparent transition-opacity duration-300"
            style={{ opacity: canScroll.right ? 1 : 0 }}
          />

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto px-6 pb-4 scrollbar-hide"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {testimonials.map((t, i) => (
              <div key={t.author} style={{ scrollSnapAlign: "start" }}>
                <TestimonialCard
                  t={t}
                  index={i}
                  reducedMotion={reducedMotion}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
