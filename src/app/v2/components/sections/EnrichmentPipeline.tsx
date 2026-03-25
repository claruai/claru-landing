"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

interface PipelineStep {
  id: string;
  label: string;
  comment: string;
  description: string;
  color: string;
}

const steps: PipelineStep[] = [
  {
    id: "raw",
    label: "RAW CAPTURE",
    comment: "// RAW CAPTURE",
    description: "Every clip starts as raw footage.",
    color: "#e8e8e8",
  },
  {
    id: "depth",
    label: "DEPTH",
    comment: "// DEPTH",
    description: "We add per-pixel depth estimation.",
    color: "#4A9EDE",
  },
  {
    id: "pose",
    label: "POSE",
    comment: "// POSE",
    description: "Hand and body pose tracking on every frame.",
    color: "#DE8A4A",
  },
  {
    id: "seg",
    label: "SEGMENTATION",
    comment: "// SEGMENTATION",
    description: "Instance segmentation identifies every object.",
    color: "#9E6ADE",
  },
  {
    id: "all",
    label: "ENRICHED",
    comment: "// ENRICHED",
    description: "Rich metadata and annotation on every clip in your dataset.",
    color: "var(--accent-primary)",
  },
];

/* -------------------------------------------------------------------------- */
/*  Metadata panel content                                                    */
/* -------------------------------------------------------------------------- */

function MetadataPanel({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-xl border border-white/[0.08] bg-[#121110] p-4 font-mono text-xs ${className ?? ""}`}
    >
      <div className="mb-2 text-[var(--accent-primary)]">// METADATA</div>
      <div className="space-y-1 text-white/60">
        <div>clip_id: ego-kitchen-0847</div>
        <div>timestamp: 2026-03-15T14:23:07Z</div>
        <div>camera: GoPro Hero 12 @ 4K/60fps</div>
        <div>sensor_data: IMU + depth_sensor</div>
        <div>annotations: depth, pose, segmentation</div>
        <div>annotator_agreement: 97.3%</div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Mobile fallback (vertical stack)                                          */
/* -------------------------------------------------------------------------- */

function MobileFallback() {
  const reducedMotion = useReducedMotion();

  const mobileSteps = [
    { step: steps[0], src: "/images/slider/raw.webp" },
    { step: steps[1], src: "/images/slider/depth.png" },
    { step: steps[2], src: "/images/slider/pose.png" },
    { step: steps[3], src: "/images/slider/seg.png" },
    { step: steps[4], src: "/images/slider/all.webp" },
  ];

  return (
    <div className="space-y-16">
      {mobileSteps.map(({ step, src }, i) => (
        <motion.div
          key={step.id}
          initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{
            duration: 0.6,
            delay: 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {/* Step label */}
          <div className="mb-3 flex items-center gap-3">
            <span
              className="font-mono text-[11px] font-semibold tracking-[0.15em]"
              style={{ color: step.color }}
            >
              {step.comment}
            </span>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: 5 }).map((_, di) => (
                <div
                  key={di}
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    backgroundColor:
                      di <= i
                        ? steps[di].color
                        : "rgba(255,255,255,0.12)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Frame viewer */}
          <div className="v2-scanline relative overflow-hidden rounded-2xl border border-white/[0.06]">
            {/* Terminal chrome */}
            <div
              className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)",
              }}
            >
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
              </div>
              <span
                className="font-mono text-[10px] font-medium"
                style={{ color: step.color }}
              >
                {step.label}
              </span>
            </div>

            <div className="relative aspect-video bg-[#0a0908]">
              <Image
                src={src}
                alt={step.description}
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
          </div>

          {/* Description */}
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            {step.description}
          </p>

          {/* Metadata panel on last step */}
          {i === mobileSteps.length - 1 && (
            <MetadataPanel className="mt-4" />
          )}
        </motion.div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Reduced-motion fallback (static final frame)                              */
/* -------------------------------------------------------------------------- */

function ReducedMotionFallback() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="v2-scanline relative overflow-hidden rounded-2xl border border-white/[0.06] shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
        {/* Terminal chrome */}
        <div
          className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)",
          }}
        >
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#ff5f57]/80" />
            <div className="h-3 w-3 rounded-full bg-[#febc2e]/80" />
            <div className="h-3 w-3 rounded-full bg-[#28c840]/80" />
          </div>
          <span className="font-mono text-[11px] tracking-wider text-white/25">
            enrichment-pipeline v2.4.1
          </span>
          <span className="font-mono text-[11px] font-medium text-[var(--accent-primary)]">
            ENRICHED
          </span>
        </div>

        <div className="relative aspect-video bg-[#0a0908]">
          <Image
            src="/images/slider/all.webp"
            alt="Fully enriched video frame with depth, pose, and segmentation layers"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
            priority
          />
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-white/60">
        Rich metadata and annotation on every clip in your dataset.
      </p>
      <MetadataPanel className="mx-auto mt-4 max-w-sm" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Desktop scroll-driven component                                           */
/* -------------------------------------------------------------------------- */

function DesktopScrollStory() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Layer refs
  const depthRef = useRef<HTMLDivElement>(null);
  const poseRef = useRef<HTMLDivElement>(null);
  const segRef = useRef<HTMLDivElement>(null);
  const allRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  // Text refs
  const commentRef = useRef<HTMLSpanElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  // Progress dot refs
  const dot0Ref = useRef<HTMLDivElement>(null);
  const dot1Ref = useRef<HTMLDivElement>(null);
  const dot2Ref = useRef<HTMLDivElement>(null);
  const dot3Ref = useRef<HTMLDivElement>(null);
  const dot4Ref = useRef<HTMLDivElement>(null);

  // Terminal label ref
  const termLabelRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const dotRefs = [dot0Ref, dot1Ref, dot2Ref, dot3Ref, dot4Ref];

      // Helper to update text content
      const setText = (stepIndex: number) => {
        if (commentRef.current) {
          commentRef.current.textContent = steps[stepIndex].comment;
          commentRef.current.style.color = steps[stepIndex].color;
        }
        if (descriptionRef.current) {
          descriptionRef.current.textContent = steps[stepIndex].description;
        }
        if (termLabelRef.current) {
          termLabelRef.current.textContent = steps[stepIndex].label;
          termLabelRef.current.style.color = steps[stepIndex].color;
        }
      };

      // Helper to update dots
      const setActiveDot = (activeIndex: number) => {
        dotRefs.forEach((ref, i) => {
          if (ref.current) {
            const isActive = i === activeIndex;
            const isPast = i <= activeIndex;
            ref.current.style.backgroundColor = isPast
              ? steps[i].color
              : "rgba(255,255,255,0.12)";
            ref.current.style.boxShadow = isActive
              ? `0 0 8px ${steps[i].color}`
              : "none";
            ref.current.style.transform = isActive
              ? "scale(1.4)"
              : "scale(1)";
          }
        });
      };

      // Main pinned timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=400%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // ---- Step 1: Raw (starting state) ----
      // Text and dots are set to step 0 by default
      // Hold for a beat so user sees the raw frame
      tl.to({}, { duration: 0.5 });

      // ---- Transition to Step 2: Depth ----
      tl.call(() => {
        setText(1);
        setActiveDot(1);
      });
      tl.fromTo(
        depthRef.current,
        { opacity: 0, x: 40 },
        { opacity: 0.65, x: 0, duration: 1, ease: "power2.out" },
        "<"
      );
      // Hold at depth
      tl.to({}, { duration: 0.4 });

      // ---- Transition to Step 3: Pose ----
      tl.call(() => {
        setText(2);
        setActiveDot(2);
      });
      tl.fromTo(
        poseRef.current,
        { opacity: 0, scale: 0.97 },
        { opacity: 1, scale: 1, duration: 1, ease: "power2.out" },
        "<"
      );
      // Hold at pose
      tl.to({}, { duration: 0.4 });

      // ---- Transition to Step 4: Segmentation ----
      tl.call(() => {
        setText(3);
        setActiveDot(3);
      });
      tl.fromTo(
        segRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
        "<"
      );
      // Hold at segmentation
      tl.to({}, { duration: 0.4 });

      // ---- Transition to Step 5: All Enriched ----
      tl.call(() => {
        setText(4);
        setActiveDot(4);
      });
      // Crossfade: fade out individual layers, fade in combined
      tl.to(
        [depthRef.current, poseRef.current, segRef.current],
        { opacity: 0, duration: 0.6, ease: "power2.inOut" },
        "<"
      );
      tl.fromTo(
        allRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: "power2.out" },
        "<0.2"
      );
      // Slide in metadata panel
      tl.fromTo(
        metaRef.current,
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        "<0.3"
      );
      // Hold at complete
      tl.to({}, { duration: 0.6 });
    },
    { scope: sectionRef }
  );

  return (
    <div ref={sectionRef} className="relative min-h-screen">
      <div className="flex min-h-screen flex-col items-center justify-center px-6 py-20">
        {/* Section header */}
        <div className="mb-10 w-full max-w-4xl">
          <div className="v2-section-label mb-6">
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--accent-primary)]">
              {"// ANNOTATION & ENRICHMENT"}
            </span>
          </div>
          <h2 className="max-w-lg text-3xl font-bold leading-[1.1] tracking-[-0.02em] text-white md:text-4xl lg:text-[42px]">
            Every clip gets depth, pose, and segmentation.{" "}
            <span className="text-white/40">Automatically.</span>
          </h2>
        </div>

        {/* Main content area */}
        <div className="flex w-full max-w-4xl items-start gap-6">
          {/* Frame viewer */}
          <div className="flex-1">
            {/* Step comment label above frame */}
            <div className="mb-3 flex items-center justify-between">
              <span
                ref={commentRef}
                className="font-mono text-[11px] font-semibold tracking-[0.15em]"
                style={{ color: steps[0].color }}
              >
                {steps[0].comment}
              </span>

              {/* Progress dots */}
              <div className="flex items-center gap-2">
                {steps.map((step, i) => (
                  <div
                    key={step.id}
                    ref={
                      i === 0
                        ? dot0Ref
                        : i === 1
                          ? dot1Ref
                          : i === 2
                            ? dot2Ref
                            : i === 3
                              ? dot3Ref
                              : dot4Ref
                    }
                    className="h-2 w-2 rounded-full transition-[box-shadow] duration-300"
                    style={{
                      backgroundColor:
                        i === 0 ? step.color : "rgba(255,255,255,0.12)",
                      boxShadow:
                        i === 0 ? `0 0 8px ${step.color}` : "none",
                      transform: i === 0 ? "scale(1.4)" : "scale(1)",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Terminal frame */}
            <div
              className="v2-scanline relative overflow-hidden rounded-2xl border border-white/[0.06] shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
              style={{
                background:
                  "linear-gradient(165deg, #121110 0%, #0e0d0c 100%)",
              }}
            >
              {/* Terminal chrome header */}
              <div
                className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)",
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#ff5f57]/80" />
                  <div className="h-3 w-3 rounded-full bg-[#febc2e]/80" />
                  <div className="h-3 w-3 rounded-full bg-[#28c840]/80" />
                </div>
                <span className="font-mono text-[11px] tracking-wider text-white/25">
                  enrichment-pipeline v2.4.1
                </span>
                <span
                  ref={termLabelRef}
                  className="font-mono text-[11px] font-medium"
                  style={{ color: steps[0].color }}
                >
                  {steps[0].label}
                </span>
              </div>

              {/* Image viewport with stacked layers */}
              <div className="relative aspect-video bg-[#0a0908]">
                {/* Layer 0: Raw (always visible) */}
                <Image
                  src="/images/slider/raw.webp"
                  alt="Raw video frame - person dicing carrots on a cutting board"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                  priority
                />

                {/* Layer 1: Depth */}
                <div
                  ref={depthRef}
                  className="absolute inset-0"
                  style={{ opacity: 0 }}
                >
                  <Image
                    src="/images/slider/depth.png"
                    alt="Depth estimation overlay - per-pixel distance map"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 800px"
                  />
                </div>

                {/* Layer 2: Pose */}
                <div
                  ref={poseRef}
                  className="absolute inset-0"
                  style={{ opacity: 0 }}
                >
                  <Image
                    src="/images/slider/pose.png"
                    alt="Pose detection overlay - skeleton joints and connections"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 800px"
                  />
                </div>

                {/* Layer 3: Segmentation */}
                <div
                  ref={segRef}
                  className="absolute inset-0"
                  style={{ opacity: 0 }}
                >
                  <Image
                    src="/images/slider/seg.png"
                    alt="Instance segmentation overlay - colored object masks"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 800px"
                  />
                </div>

                {/* Layer 4: All combined (for final step crossfade) */}
                <div
                  ref={allRef}
                  className="absolute inset-0"
                  style={{ opacity: 0 }}
                >
                  <Image
                    src="/images/slider/all.webp"
                    alt="Fully enriched frame with all annotation layers combined"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 800px"
                  />
                </div>
              </div>
            </div>

            {/* Description text below frame */}
            <p
              ref={descriptionRef}
              className="mt-5 text-base leading-relaxed text-white/70"
            >
              {steps[0].description}
            </p>
          </div>

          {/* Metadata panel (slides in on step 5) */}
          <div
            ref={metaRef}
            className="w-64 shrink-0 pt-10"
            style={{ opacity: 0 }}
          >
            <MetadataPanel />
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main export                                                               */
/* -------------------------------------------------------------------------- */

export default function EnrichmentPipeline() {
  const reducedMotion = useReducedMotion();

  return (
    <section id="enrichment" className="relative bg-[var(--bg-primary)]">
      {/* Reduced motion: static final frame, no scroll animation */}
      {reducedMotion ? (
        <div className="py-32 md:py-40">
          <div className="container mx-auto px-6">
            <div className="mb-10">
              <div className="v2-section-label mb-6">
                <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--accent-primary)]">
                  {"// ANNOTATION & ENRICHMENT"}
                </span>
              </div>
              <h2 className="max-w-lg text-3xl font-bold leading-[1.1] tracking-[-0.02em] text-white md:text-4xl lg:text-[42px]">
                Every clip gets depth, pose, and segmentation.{" "}
                <span className="text-white/40">Automatically.</span>
              </h2>
            </div>
            <ReducedMotionFallback />
          </div>
        </div>
      ) : (
        <>
          {/* Desktop: scroll-driven pinned parallax */}
          <div className="hidden md:block">
            <DesktopScrollStory />
          </div>

          {/* Mobile: vertical stack with scroll-triggered fade-in */}
          <div className="block py-32 md:hidden">
            <div className="container mx-auto px-6">
              <div className="mb-12">
                <div className="v2-section-label mb-6">
                  <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--accent-primary)]">
                    {"// ANNOTATION & ENRICHMENT"}
                  </span>
                </div>
                <h2 className="max-w-lg text-3xl font-bold leading-[1.1] tracking-[-0.02em] text-white md:text-4xl">
                  Every clip gets depth, pose, and segmentation.{" "}
                  <span className="text-white/40">Automatically.</span>
                </h2>
              </div>
              <MobileFallback />
            </div>
          </div>
        </>
      )}
    </section>
  );
}
