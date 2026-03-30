"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─── Animation constants ──────────────────────────────── */

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ─── Data ──────────────────────────────────────────────── */

const investors = [
  "Khosla Ventures",
  "General Catalyst",
  "Bessemer Venture Partners",
  "Y Combinator",
];

interface StatItem {
  value: string;
  label: string;
}

const stats: StatItem[] = [
  { value: "3.7M+", label: "human annotations" },
  { value: "25+", label: "active datasets" },
  { value: "10,000+", label: "collectors worldwide" },
  { value: "5+", label: "frontier lab partnerships" },
];

interface CaseStudy {
  stat: string;
  label: string;
  oneLiner: string;
  href: string;
  video: string;
  poster: string;
  accentColor: string;
}

const caseStudies: CaseStudy[] = [
  {
    stat: "500K+",
    label: "egocentric videos",
    oneLiner:
      "Captured 500K+ first-person videos across residential and commercial settings globally for a world-modeling lab.",
    href: "/case-studies/egocentric-video-collection",
    video: "/videos/proof-of-work/egocentric.mp4",
    poster: "",
    accentColor: "#92B090",
  },
  {
    stat: "10K+",
    label: "hours of game data",
    oneLiner:
      "Built a proprietary capture platform from scratch to grab 10,000+ hours of 3D game world data — no off-the-shelf tool existed.",
    href: "/case-studies/game-based-data-capture",
    video: "/videos/proof-of-work/game-env.mp4",
    poster: "",
    accentColor: "#4ADE80",
  },
  {
    stat: "2M+",
    label: "video annotations",
    oneLiner:
      "Millions of licensed, cinematic, high-quality video annotations powering RLHF for a frontier video generation company.",
    href: "/case-studies/video-quality-at-scale",
    video: "/videos/proof-of-work/annotations.mp4",
    poster: "",
    accentColor: "#DE8A4A",
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

/* ─── LazyVideo ─────────────────────────────────────────── */

function LazyVideo({ src, poster }: { src: string; poster?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const video = videoRef.current;
      if (!video) return;
      for (const entry of entries) {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      }
    },
    []
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [handleIntersection]);

  return (
    <div ref={containerRef} className="h-full w-full">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        className="h-full w-full object-cover"
      />
    </div>
  );
}

/* ─── AnimatedCounter ───────────────────────────────────── */

function AnimatedCounter({
  value,
  label,
  inView,
  reducedMotion,
  delay = 0,
}: {
  value: string;
  label: string;
  inView: boolean;
  reducedMotion: boolean;
  delay?: number;
}) {
  // Parse: "3.7M+" -> numeric=3.7, suffix="M+"
  // Parse: "10,000+" -> numeric=10000, suffix="+", hasComma=true
  // Parse: "25+" -> numeric=25, suffix="+"
  // Parse: "5" -> numeric=5, suffix=""
  const cleaned = value.replace(/,/g, "");
  const match = cleaned.match(/^([\d.]+)(.*)$/);
  const targetNum = match ? parseFloat(match[1]) : 0;
  const suffix = match ? match[2] : value;
  const hasComma = value.includes(",");
  const isDecimal = value.includes(".");
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!inView || reducedMotion) {
      setCurrent(targetNum);
      return;
    }
    setCurrent(0);
    const duration = 1400;
    const startTime = performance.now();
    let frame: number;
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = eased * targetNum;
      setCurrent(isDecimal ? parseFloat(val.toFixed(1)) : Math.round(val));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    // Stagger start
    const timeout = setTimeout(() => {
      frame = requestAnimationFrame(animate);
    }, delay);
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  }, [inView, targetNum, reducedMotion, delay, isDecimal]);

  const displayValue = isDecimal
    ? current.toFixed(1)
    : hasComma
      ? current.toLocaleString()
      : String(current);

  return (
    <motion.div
      className="flex flex-col items-center gap-2 px-2 md:px-0"
      initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: delay / 1000 + 0.1, duration: 0.6, ease: EASE }}
    >
      <span className="font-mono text-3xl font-black tabular-nums text-[var(--accent-primary)] sm:text-4xl md:text-[48px] lg:text-[56px]">
        {displayValue}
        {suffix}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35 sm:text-[11px]">
        {label}
      </span>
    </motion.div>
  );
}

/* ─── CaseStudyCard ─────────────────────────────────────── */

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
      className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/[0.06]"
      style={{
        background: "linear-gradient(165deg, #121110 0%, #0e0d0c 100%)",
      }}
      initial={reducedMotion ? {} : { opacity: 0, y: 36, scale: 0.97 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        delay: index * 0.12,
        duration: 0.7,
        ease: EASE,
      }}
      whileHover={
        reducedMotion
          ? {}
          : {
              y: -6,
              scale: 1.015,
              transition: { duration: 0.3, ease: EASE },
            }
      }
    >
      {/* Video background */}
      <div className="absolute inset-0">
        <LazyVideo src={study.video} poster={study.poster} />
      </div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,9,8,0.55) 0%, rgba(10,9,8,0.15) 30%, rgba(10,9,8,0.1) 50%, rgba(10,9,8,0.85) 100%)",
        }}
      />

      {/* Hover glow overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-400 group-hover:opacity-100"
        style={{
          boxShadow: `inset 0 0 0 1px ${study.accentColor}33, 0 0 40px ${study.accentColor}0a`,
        }}
      />

      {/* Accent top line */}
      <div
        className="absolute left-0 right-0 top-0 h-[2px] opacity-50 transition-opacity duration-400 group-hover:opacity-80"
        style={{
          background: `linear-gradient(90deg, transparent, ${study.accentColor}60, transparent)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex min-h-[240px] flex-col justify-between p-5 sm:min-h-[260px] sm:p-6 md:min-h-[280px]">
        {/* Top: terminal dots + label */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="h-[6px] w-[6px] rounded-full bg-[#ff5f57]/50" />
            <div className="h-[6px] w-[6px] rounded-full bg-[#febc2e]/50" />
            <div className="h-[6px] w-[6px] rounded-full bg-[#28c840]/50" />
          </div>
          <span
            className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] md:text-[10px]"
            style={{ color: study.accentColor }}
          >
            {`// ${study.label}`}
          </span>
        </div>

        {/* Bottom: stat + description + link */}
        <div>
          {/* Stat */}
          <div className="mb-3">
            <span
              className="block font-mono text-3xl font-black tabular-nums sm:text-4xl"
              style={{
                color: study.accentColor,
                textShadow: "0 2px 12px rgba(0,0,0,0.6)",
              }}
            >
              {study.stat}
            </span>
          </div>

          {/* Description */}
          <p
            className="mb-4 max-w-sm text-[13px] leading-[1.65] text-white/55 transition-colors duration-300 group-hover:text-white/70"
            style={{ textShadow: "0 1px 8px rgba(10,9,8,0.9)" }}
          >
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
        </div>
      </div>
    </motion.div>
  );
}

/* ─── TestimonialCard ───────────────────────────────────── */

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
      initial={reducedMotion ? {} : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.1 + 0.15,
        duration: 0.7,
        ease: EASE,
      }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-white/[0.06] p-6 sm:p-7"
      style={{
        background: "linear-gradient(165deg, #121110 0%, #161614 100%)",
      }}
    >
      {/* Hover glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-400 group-hover:opacity-100"
        style={{
          boxShadow:
            "inset 0 0 0 1px rgba(146,176,144,0.15), 0 12px 40px rgba(0,0,0,0.4)",
        }}
      />

      {/* Terminal-style quote mark */}
      <span className="mb-3 block font-mono text-2xl leading-none text-[var(--accent-primary)]/25">
        {'"'}
      </span>

      <p className="mb-5 flex-1 text-[14px] leading-[1.7] text-white/50 transition-colors duration-300 group-hover:text-white/60">
        {t.quote}
      </p>

      <div className="border-t border-white/[0.06] pt-4">
        <span className="block text-sm font-medium text-white/75">
          {t.author}
        </span>
        <span className="mt-1 block font-mono text-[11px] text-white/25">
          {t.org}
        </span>
      </div>
    </motion.div>
  );
}

/* ─── InvestorBar ───────────────────────────────────────── */

function InvestorBar({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <motion.div
      className="flex flex-wrap items-center justify-center gap-x-2 gap-y-3"
      initial={reducedMotion ? {} : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
    >
      <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/20 sm:text-[11px]">
        Backed by
      </span>
      {investors.map((name, i) => (
        <span key={name} className="flex items-center">
          {i > 0 && (
            <span className="mr-2 inline-block h-3 w-px bg-white/8" />
          )}
          <span className="font-mono text-[11px] text-white/25 sm:text-[12px]">
            {name}
          </span>
        </span>
      ))}
    </motion.div>
  );
}

/* ─── Main Component ────────────────────────────────────── */

export default function ProofOfWork() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-80px" });

  /* GSAP: parallax on header text */
  useGSAP(
    () => {
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
    },
    { dependencies: [reducedMotion] }
  );

  return (
    <section
      ref={sectionRef}
      id="proof"
      className="relative bg-[var(--bg-primary)] py-28 md:py-36 lg:py-40"
    >
      {/* Top accent line */}
      <motion.div
        className="absolute left-0 right-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 5%, rgba(146,176,144,0.15) 30%, rgba(146,176,144,0.15) 70%, transparent 95%)",
        }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: EASE }}
      />

      <div className="container mx-auto max-w-[var(--container-max)] px-6">
        {/* ── Section Header ── */}
        <div ref={headerRef}>
          <motion.div
            className="mb-6"
            initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--accent-primary)]">
              {"// PROOF OF WORK"}
            </span>
          </motion.div>

          <motion.h2
            className="max-w-2xl text-3xl font-bold leading-[1.1] tracking-[-0.02em] text-white md:text-4xl lg:text-[44px]"
            initial={reducedMotion ? {} : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.05, ease: EASE }}
          >
            Built for frontier labs.{" "}
            <span className="text-white/35">Proven at scale.</span>
          </motion.h2>

          <motion.p
            className="mt-4 max-w-lg text-[15px] leading-[1.6] text-white/40"
            initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          >
            From brief to first delivery in days — not months. Millions of
            annotations delivered for the labs training the next generation of
            physical AI.
          </motion.p>
        </div>

        {/* ── Case Study Cards — the proof ── */}
        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map((study, i) => (
            <CaseStudyCard
              key={study.href}
              study={study}
              index={i}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>

        {/* ── Stats bar below case studies ── */}
        <div
          ref={statsRef}
          className="mt-14 grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-4 lg:gap-6"
        >
          {stats.map((s, i) => (
            <AnimatedCounter
              key={s.label}
              value={s.value}
              label={s.label}
              inView={statsInView}
              reducedMotion={reducedMotion}
              delay={i * 120}
            />
          ))}
        </div>

        {/* ── Investor Bar ── */}
        <div className="mt-10">
          <InvestorBar reducedMotion={reducedMotion} />
        </div>
      </div>
    </section>
  );
}
