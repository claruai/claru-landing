"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─── Data ──────────────────────────────────────────── */

const investors = [
  "NVIDIA",
  "Khosla Ventures",
  "General Catalyst",
  "Y Combinator",
];

interface CaseStudy {
  stat: string;
  label: string;
  oneLiner: string;
  href: string;
}

const caseStudies: CaseStudy[] = [
  {
    stat: "386K+",
    label: "first-person video clips",
    oneLiner:
      "Three parallel capture pipelines for a world-modeling lab",
    href: "/case-studies/egocentric-video-collection",
  },
  {
    stat: "10,000+",
    label: "hours of gameplay data",
    oneLiner:
      "Custom capture tool built from scratch \u2014 no off-the-shelf alternative existed",
    href: "/case-studies/game-based-data-capture",
  },
  {
    stat: "976K+",
    label: "human quality assessments",
    oneLiner:
      "Four-dimension evaluation powering RLHF for a frontier video lab",
    href: "/case-studies/video-quality-at-scale",
  },
  {
    stat: "10",
    label: "workplace categories",
    oneLiner:
      "Real businesses as scalable robotics training data sources",
    href: "/case-studies/workplace-egocentric-data",
  },
];

interface Testimonial {
  quote: string;
  author: string;
  org: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "We needed egocentric video data that didn\u2019t exist yet and a team who could label it with robotics-grade precision. Claru handled both \u2014 from capture protocol design to frame-level annotation.",
    author: "Founder & CEO",
    org: "Robotics manipulation startup",
  },
  {
    quote:
      "The difference is night and day. With our previous vendor, we\u2019d wait a week for labeled data, then spend another week fixing errors. With Claru, the team stays tightly aligned with ours.",
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

/* ─── Animation presets ──────────────────────────────── */

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ─── InkwellMetric ──────────────────────────────────── */

/**
 * Inkwell-style per-character reveal animation.
 * Each character fades + slides in individually for a rolling wave effect.
 */
function InkwellMetric({
  value,
  inView,
}: {
  value: string;
  inView: boolean;
}) {
  const chars = value.split("");

  return (
    <span className="inline-flex" aria-label={value}>
      {chars.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          className="inline-block font-mono font-bold text-[var(--accent-primary)]"
          style={{ fontSize: "clamp(36px, 5vw, 56px)", perspective: "200px" }}
          initial={{ opacity: 0, y: 24, rotateX: -40 }}
          animate={
            inView
              ? { opacity: 1, y: 0, rotateX: 0 }
              : { opacity: 0, y: 24, rotateX: -40 }
          }
          transition={{
            delay: i * 0.06,
            duration: 0.5,
            ease: EASE,
          }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

/* ─── CaseStudyCard ──────────────────────────────────── */

function CaseStudyCard({
  study,
  index,
  reducedMotion,
}: {
  study: CaseStudy;
  index: number;
  reducedMotion: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className="group relative flex min-w-[280px] flex-col justify-between overflow-hidden rounded-xl border border-white/[0.06] p-6 sm:p-7"
      style={{ background: "linear-gradient(165deg, #121110 0%, #161614 100%)" }}
      initial={reducedMotion ? {} : { opacity: 0, y: 36, scale: 0.97 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        delay: index * 0.12,
        duration: 0.7,
        ease: EASE,
      }}
      whileHover={reducedMotion ? {} : {
        y: -6,
        scale: 1.02,
        transition: { duration: 0.3, ease: EASE },
      }}
    >
      {/* Hover glow overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-400 group-hover:opacity-100"
        style={{
          boxShadow: "inset 0 0 0 1px rgba(146,176,144,0.2), 0 0 40px rgba(146,176,144,0.06)",
        }}
      />

      {/* Accent top line on hover */}
      <div
        className="absolute left-0 right-0 top-0 h-[2px] opacity-0 transition-opacity duration-400 group-hover:opacity-60"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(146,176,144,0.5), transparent)",
        }}
      />

      {/* Stat */}
      <div className="mb-5">
        {reducedMotion ? (
          <span
            className="block font-mono font-bold text-[var(--accent-primary)]"
            style={{ fontSize: "clamp(36px, 5vw, 56px)" }}
          >
            {study.stat}
          </span>
        ) : (
          <InkwellMetric value={study.stat} inView={isInView} />
        )}
        <span className="mt-2 block font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
          {study.label}
        </span>
      </div>

      {/* Description */}
      <p className="mb-6 text-[14px] leading-[1.65] text-white/55 transition-colors duration-300 group-hover:text-white/65">
        {study.oneLiner}
      </p>

      {/* Link */}
      <Link
        href={study.href}
        className="inline-flex items-center gap-1.5 font-mono text-[12px] tracking-wide text-white/40 transition-colors duration-200 group-hover:text-[var(--accent-primary)]"
      >
        Read case study
        <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
          &rarr;
        </span>
      </Link>
    </motion.div>
  );
}

/* ─── TestimonialCard ────────────────────────────────── */

function TestimonialCard({
  t,
  index,
  reducedMotion,
}: {
  t: Testimonial;
  index: number;
  reducedMotion: boolean;
}) {
  return (
    <motion.div
      initial={reducedMotion ? {} : { opacity: 0, y: 28, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.1,
        duration: 0.7,
        ease: EASE,
      }}
      whileHover={reducedMotion ? {} : {
        y: -4,
        scale: 1.01,
        transition: { duration: 0.25, ease: EASE },
      }}
      className="group w-[320px] shrink-0 overflow-hidden rounded-2xl border border-[var(--border-subtle)] p-7 md:w-[380px]"
      style={{ background: "linear-gradient(165deg, #121110 0%, #161614 100%)" }}
    >
      {/* Hover glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-400 group-hover:opacity-100"
        style={{
          boxShadow: "inset 0 0 0 1px rgba(146,176,144,0.15), 0 12px 40px rgba(0,0,0,0.4)",
        }}
      />

      {/* Quote mark */}
      <span className="mb-4 block font-serif text-3xl leading-none text-[var(--accent-primary)]/20 transition-colors duration-300 group-hover:text-[var(--accent-primary)]/35">
        &ldquo;
      </span>
      <p className="mb-6 text-[14px] leading-[1.7] text-white/55 transition-colors duration-300 group-hover:text-white/65">
        {t.quote}
      </p>
      <div className="border-t border-white/[0.06] pt-5">
        <span className="block text-sm font-medium text-white/85">
          {t.author}
        </span>
        <span className="mt-1 block font-mono text-[11px] text-white/30">
          {t.org}
        </span>
      </div>
    </motion.div>
  );
}

/* ─── InvestorBar ────────────────────────────────────── */

function InvestorBar({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <motion.div
      className="flex flex-wrap items-center justify-center gap-x-2 gap-y-3 sm:justify-start"
      initial={reducedMotion ? {} : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
    >
      <span className="mr-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/25">
        Backed by
      </span>
      {investors.map((name, i) => (
        <span key={name} className="flex items-center">
          {i > 0 && (
            <span className="mr-2 inline-block h-3 w-px bg-white/10" />
          )}
          <span className="font-mono text-[12px] text-white/30 transition-colors duration-200 hover:text-white/50 sm:text-[13px]">
            {name}
          </span>
        </span>
      ))}
    </motion.div>
  );
}

/* ─── Main Component ─────────────────────────────────── */

export default function SocialProofV2() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const testimonialScrollRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState({ left: false, right: true });

  /* GSAP: parallax on header text */
  useGSAP(() => {
    if (reducedMotion || !headerRef.current || !sectionRef.current) return;

    gsap.to(headerRef.current, {
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

  useEffect(() => {
    const el = testimonialScrollRef.current;
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
    <section ref={sectionRef} id="proof" className="relative bg-[var(--bg-primary)] py-32 md:py-40">
      <div className="container mx-auto max-w-[var(--container-max)] px-6">
        {/* ─── Section Header ─── */}
        <div ref={headerRef}>
          <motion.div
            className="mb-10"
            initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <div className="mb-6">
              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--accent-primary)]">
                {"// PROOF OF WORK"}
              </span>
            </div>
            <h2 className="max-w-xl text-3xl font-bold leading-[1.15] tracking-[-0.02em] text-white md:text-4xl lg:text-[42px]">
              Built for frontier labs.
            </h2>
            <p className="mt-4 max-w-lg text-[15px] leading-[1.6] text-white/45">
              Trusted by researchers training the next generation of physical AI.
            </p>
          </motion.div>
        </div>

        {/* ─── Investor Logo Bar ─── */}
        <div className="mb-16">
          <InvestorBar reducedMotion={reducedMotion} />
        </div>

        {/* ─── Case Study Cards ─── */}
        <div className="mb-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {caseStudies.map((study, i) => (
            <CaseStudyCard
              key={study.href}
              study={study}
              index={i}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>

        {/* ─── Divider ─── */}
        <div className="mx-auto mb-16 h-px max-w-lg bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        {/* ─── Testimonials -- horizontal scroll with fade edges ─── */}
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
            ref={testimonialScrollRef}
            className="flex gap-5 overflow-x-auto px-6 pb-4 scrollbar-hide"
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

        {/* ─── Section Footer CTA ─── */}
        <motion.div
          className="mt-14 text-center"
          initial={reducedMotion ? {} : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
        >
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 font-mono text-[13px] tracking-wide text-white/40 transition-colors duration-200 hover:text-[var(--accent-primary)]"
          >
            See all case studies
            <span className="inline-block transition-transform duration-200 hover:translate-x-0.5">
              &rarr;
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
