"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* -------------------------------------------------------------------------- */
/*  Card data — 4 cards: captured → enriched → annotated → delivered          */
/* -------------------------------------------------------------------------- */

interface EnrichmentCard {
  id: string;
  label: string;
  tagline: string;
  description: string;
  color: string;
  media: { type: "video"; src: string } | { type: "json" };
}

const CARDS: EnrichmentCard[] = [
  {
    id: "capture",
    label: "CAPTURED",
    tagline: "Licensed, real-world video — not synthetic, not scraped.",
    description: "",
    color: "#4A9EDE",
    media: {
      type: "video",
      src: "/enrichment-assets/depth-video/90b2c5b4_depth_only.mp4",
    },
  },
  {
    id: "enrich",
    label: "ENRICHED",
    tagline: "Every clip ships with layers your model actually needs.",
    description: "",
    color: "#DE8A4A",
    media: {
      type: "video",
      src: "/enrichment-assets/pose-video/fold_clothes_hands.mp4",
    },
  },
  {
    id: "annotate",
    label: "ANNOTATED",
    tagline: "Expert humans label what machines miss — intent, context, edge cases.",
    description: "",
    color: "#9E6ADE",
    media: {
      type: "video",
      src: "/enrichment-assets/segmentation/12b46dac_seg_overlay.mp4",
    },
  },
  {
    id: "deliver",
    label: "DELIVERED",
    tagline: "Your format. Your pipeline. Ready to train.",
    description: "",
    color: "#92B090",
    media: { type: "json" },
  },
];

/* -------------------------------------------------------------------------- */
/*  Lazy video                                                                 */
/* -------------------------------------------------------------------------- */

function CardVideo({ src }: { src: string }) {
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
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [handleIntersection]);

  return (
    <div ref={containerRef} className="absolute inset-0">
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        preload="none"
        className="h-full w-full object-cover"
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Rich JSON output panel — meaty structured data                             */
/* -------------------------------------------------------------------------- */

const JSON_LINES: { text: string; indent: number; color?: string }[] = [
  { text: "{", indent: 0 },
  { text: '"clip_id": "33c400a3-3538-4e72-b1b3-757d638ea778",', indent: 1 },
  { text: '"created_at": "2026-03-18T09:14:22.847Z",', indent: 1 },
  { text: '"source": {', indent: 1 },
  { text: '"device": "GoPro HERO12 Black",', indent: 2 },
  { text: '"resolution": [3840, 2160],', indent: 2 },
  { text: '"fps": 59.94,', indent: 2 },
  { text: '"codec": "hevc_main10",', indent: 2 },
  { text: '"duration_s": 14.82,', indent: 2 },
  { text: '"total_frames": 888', indent: 2 },
  { text: "},", indent: 1 },
  { text: "", indent: 0, color: "dim" },
  { text: '"capture": {', indent: 1 },
  { text: '"geo": [19.076, 72.878],', indent: 2 },
  { text: '"location": "Mumbai, MH, India",', indent: 2 },
  { text: '"environment": "residential_kitchen",', indent: 2 },
  { text: '"lighting": "natural_overhead",', indent: 2 },
  { text: '"collector": "CLR-MUM-0294",', indent: 2 },
  { text: '"session": "sess-20260318-0847"', indent: 2 },
  { text: "},", indent: 1 },
  { text: "", indent: 0, color: "dim" },
  { text: '"imu": {', indent: 1 },
  { text: '"accel_hz": 200,', indent: 2 },
  { text: '"gyro_hz": 200,', indent: 2 },
  { text: '"gravity_aligned": true', indent: 2 },
  { text: "},", indent: 1 },
  { text: "", indent: 0, color: "dim" },
  { text: '"enrichment": {', indent: 1 },
  { text: '"depth": {', indent: 2 },
  { text: '"model": "depth-anything-v2-large",', indent: 3 },
  { text: '"format": "float16.npz",', indent: 3 },
  { text: '"colormap": "turbo",', indent: 3 },
  { text: '"temporal_consistent": true', indent: 3 },
  { text: "},", indent: 2 },
  { text: '"pose": {', indent: 2 },
  { text: '"model": "vitpose-h-coco-wholebody",', indent: 3 },
  { text: '"keypoints_per_frame": 133,', indent: 3 },
  { text: '"hands": true,', indent: 3 },
  { text: '"face": true,', indent: 3 },
  { text: '"confidence_min": 0.65', indent: 3 },
  { text: "},", indent: 2 },
  { text: '"segmentation": {', indent: 2 },
  { text: '"model": "sam-3-video",', indent: 3 },
  { text: '"tracked_instances": 9,', indent: 3 },
  { text: '"mask_format": "coco_rle",', indent: 3 },
  { text: '"classes": ["hand", "knife", "board", "pot"]', indent: 3 },
  { text: "},", indent: 2 },
  { text: '"optical_flow": {', indent: 2 },
  { text: '"model": "raft-large",', indent: 3 },
  { text: '"pairs": 887,', indent: 3 },
  { text: '"format": "flo"', indent: 3 },
  { text: "},", indent: 2 },
  { text: '"action": {', indent: 2 },
  { text: '"model": "internvideo2-8b",', indent: 3 },
  { text: '"primary": "chopping_vegetables",', indent: 3 },
  { text: '"confidence": 0.94,', indent: 3 },
  { text: '"temporal_segments": [', indent: 3 },
  { text: '{ "t": [0.0, 4.2], "action": "reaching" },', indent: 4 },
  { text: '{ "t": [4.2, 11.8], "action": "chopping" },', indent: 4 },
  { text: '{ "t": [11.8, 14.8], "action": "transferring" }', indent: 4 },
  { text: "]", indent: 3 },
  { text: "}", indent: 2 },
  { text: "},", indent: 1 },
  { text: "", indent: 0, color: "dim" },
  { text: '"mesh_3d": {', indent: 1 },
  { text: '"hand_l": { "verts": 778, "faces": 1538, "format": "glb" },', indent: 2 },
  { text: '"hand_r": { "verts": 778, "faces": 1538, "format": "glb" },', indent: 2 },
  { text: '"coord_system": "camera_ego"', indent: 2 },
  { text: "},", indent: 1 },
  { text: "", indent: 0, color: "dim" },
  { text: '"quality": {', indent: 1 },
  { text: '"annotator_agreement": 0.973,', indent: 2 },
  { text: '"blur_pct": 2.1,', indent: 2 },
  { text: '"occlusion_pct": 7.8,', indent: 2 },
  { text: '"status": "approved",', indent: 2 },
  { text: '"reviewed_by": "CLR-QA-0041",', indent: 2 },
  { text: '"reviewed_at": "2026-03-19T14:32:08Z"', indent: 2 },
  { text: "},", indent: 1 },
  { text: "", indent: 0, color: "dim" },
  { text: '"license": "commercial_unrestricted",', indent: 1 },
  { text: '"delivery": {', indent: 1 },
  { text: '"s3": "s3://claru-delivery/ego-kitchen/33c400a3/",', indent: 2 },
  { text: '"parquet_index": true,', indent: 2 },
  { text: '"webdataset": true,', indent: 2 },
  { text: '"huggingface_repo": "claru/ego-kitchen-v3"', indent: 2 },
  { text: "}", indent: 1 },
  { text: "}", indent: 0 },
];

function RichJsonPanel() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setVisibleLines(i);
      if (i >= JSON_LINES.length) clearInterval(timer);
    }, 60);
    return () => clearInterval(timer);
  }, [inView]);

  return (
    <div
      ref={ref}
      className="absolute inset-0 flex items-center justify-center bg-[#080807] p-4 md:p-8"
    >
      {/* Subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(146,176,144,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(146,176,144,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative w-full max-w-lg overflow-hidden">
        {/* Terminal header bar */}
        <div className="mb-3 flex items-center gap-2">
          <div className="h-[7px] w-[7px] rounded-full bg-[#ff5f57]/50" />
          <div className="h-[7px] w-[7px] rounded-full bg-[#febc2e]/50" />
          <div className="h-[7px] w-[7px] rounded-full bg-[#28c840]/50" />
          <span className="ml-2 font-mono text-[10px] text-white/20">
            clip_metadata.json
          </span>
        </div>

        <div className="font-mono text-[11px] leading-[1.7] md:text-xs">
          {JSON_LINES.slice(0, visibleLines).map((line, i) => {
            if (line.color === "dim" || !line.text) {
              return <div key={i} className="h-2" />;
            }

            const pad = "  ".repeat(line.indent);
            const highlighted = colorizeJsonLine(line.text);

            return (
              <div key={i} className="whitespace-pre">
                <span style={{ color: "rgba(255,255,255,0.15)" }}>{pad}</span>
                {highlighted}
              </div>
            );
          })}
          {visibleLines > 0 && visibleLines < JSON_LINES.length && (
            <span
              className="ml-1 inline-block h-3.5 w-1.5 align-middle"
              style={{
                background: "#92B090",
                animation: "json-blink 0.7s step-end infinite",
              }}
            />
          )}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html:
            "@keyframes json-blink { 0%,100%{opacity:1} 50%{opacity:0} }",
        }}
      />
    </div>
  );
}

function colorizeJsonLine(text: string): React.ReactNode {
  // Simple inline colorizer
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Match key: "..."
    const keyMatch = remaining.match(/^("[\w_]+"):\s*/);
    if (keyMatch) {
      parts.push(
        <span key={key++} style={{ color: "rgba(255,255,255,0.5)" }}>
          {keyMatch[1]}
        </span>
      );
      parts.push(
        <span key={key++} style={{ color: "rgba(255,255,255,0.2)" }}>
          :{" "}
        </span>
      );
      remaining = remaining.slice(keyMatch[0].length);
      continue;
    }
    // Match string value: "..."
    const strMatch = remaining.match(/^"([^"]*)"(,?)/);
    if (strMatch) {
      parts.push(
        <span key={key++} style={{ color: "#4ADE80" }}>
          &quot;{strMatch[1]}&quot;
        </span>
      );
      if (strMatch[2])
        parts.push(
          <span key={key++} style={{ color: "rgba(255,255,255,0.2)" }}>
            ,
          </span>
        );
      remaining = remaining.slice(strMatch[0].length);
      continue;
    }
    // Match number
    const numMatch = remaining.match(/^(\d+\.?\d*)(,?)/);
    if (numMatch) {
      parts.push(
        <span key={key++} style={{ color: "#DE8A4A" }}>
          {numMatch[1]}
        </span>
      );
      if (numMatch[2])
        parts.push(
          <span key={key++} style={{ color: "rgba(255,255,255,0.2)" }}>
            ,
          </span>
        );
      remaining = remaining.slice(numMatch[0].length);
      continue;
    }
    // Match boolean
    const boolMatch = remaining.match(/^(true|false)(,?)/);
    if (boolMatch) {
      parts.push(
        <span key={key++} style={{ color: "#4A9EDE" }}>
          {boolMatch[1]}
        </span>
      );
      if (boolMatch[2])
        parts.push(
          <span key={key++} style={{ color: "rgba(255,255,255,0.2)" }}>
            ,
          </span>
        );
      remaining = remaining.slice(boolMatch[0].length);
      continue;
    }
    // Match array: [...]
    const arrMatch = remaining.match(/^\[([^\]]*)\](,?)/);
    if (arrMatch) {
      parts.push(
        <span key={key++} style={{ color: "#4ADEDE" }}>
          [{arrMatch[1]}]
        </span>
      );
      if (arrMatch[2])
        parts.push(
          <span key={key++} style={{ color: "rgba(255,255,255,0.2)" }}>
            ,
          </span>
        );
      remaining = remaining.slice(arrMatch[0].length);
      continue;
    }
    // Braces and other chars
    parts.push(
      <span key={key++} style={{ color: "rgba(255,255,255,0.25)" }}>
        {remaining[0]}
      </span>
    );
    remaining = remaining.slice(1);
  }

  return <>{parts}</>;
}

/* -------------------------------------------------------------------------- */
/*  Card media renderer                                                        */
/* -------------------------------------------------------------------------- */

function CardMedia({ card }: { card: EnrichmentCard }) {
  if (card.media.type === "video") return <CardVideo src={card.media.src} />;
  return <RichJsonPanel />;
}

/* -------------------------------------------------------------------------- */
/*  Stacked card scroll — cards scale/rotate away revealing the next           */
/* -------------------------------------------------------------------------- */

function StickyCardStack({ reducedMotion }: { reducedMotion: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      if (reducedMotion) return;

      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      const total = cards.length;
      if (total === 0) return;

      gsap.set(cards[0], { y: "0%", scale: 1, rotation: 0 });
      for (let i = 1; i < total; i++) {
        gsap.set(cards[i], { y: "100%", scale: 1, rotation: 0 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".enrichment-sticky-cards",
          start: "top top",
          end: `+=${window.innerHeight * (total - 1)}`,
          pin: true,
          scrub: 0.5,
          pinSpacing: true,
        },
      });

      for (let i = 0; i < total - 1; i++) {
        tl.to(
          cards[i],
          { scale: 0.78, rotation: 3, duration: 1, ease: "none" },
          i
        );
        tl.to(cards[i + 1], { y: "0%", duration: 1, ease: "none" }, i);
      }

      const ro = new ResizeObserver(() => ScrollTrigger.refresh());
      if (containerRef.current) ro.observe(containerRef.current);

      return () => {
        ro.disconnect();
        tl.kill();
      };
    },
    { scope: containerRef, dependencies: [reducedMotion] }
  );

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <div className="enrichment-sticky-cards relative flex h-[85vh] w-full items-center justify-center overflow-hidden">
        <div className="relative h-[90%] w-full max-w-6xl overflow-hidden rounded-2xl mx-4 md:mx-8">
          {CARDS.map((card, i) => (
            <div
              key={card.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="absolute inset-0 overflow-hidden rounded-2xl"
              style={{ willChange: "transform" }}
            >
              {/* Media background */}
              <CardMedia card={card} />

              {/* Dark overlay — makes narrative text the focus */}
              {card.media.type === "video" && (
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, rgba(10,9,8,0.65) 0%, rgba(10,9,8,0.45) 50%, rgba(10,9,8,0.55) 100%)",
                  }}
                />
              )}

              {/* Top accent line */}
              <div
                className="absolute left-0 right-0 top-0 h-[2px]"
                style={{
                  background: `linear-gradient(90deg, transparent, ${card.color}, transparent)`,
                  opacity: 0.7,
                }}
              />

              {/* Top: terminal chrome */}
              <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-5 py-3 md:px-8 md:py-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="h-[7px] w-[7px] rounded-full bg-[#ff5f57]/60" />
                    <div className="h-[7px] w-[7px] rounded-full bg-[#febc2e]/60" />
                    <div className="h-[7px] w-[7px] rounded-full bg-[#28c840]/60" />
                  </div>
                  <span
                    className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] md:text-[11px]"
                    style={{ color: card.color }}
                  >
                    {`// ${card.label}`}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-white/20">
                  {i + 1} / {CARDS.length}
                </span>
              </div>

              {/* Center: narrative tagline — the main focus */}
              <div className="absolute inset-0 z-10 flex items-center justify-center px-8">
                <p
                  className="max-w-lg text-center text-xl font-bold leading-snug tracking-[-0.02em] text-white md:text-2xl lg:text-[28px]"
                  style={{ textShadow: "0 2px 20px rgba(10,9,8,0.95), 0 0 40px rgba(10,9,8,0.8)" }}
                >
                  {card.tagline}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Mobile fallback                                                            */
/* -------------------------------------------------------------------------- */

function MobileStack({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div className="flex flex-col gap-4 px-4">
      {CARDS.map((card, i) => (
        <motion.div
          key={card.id}
          className="relative overflow-hidden rounded-xl border border-white/[0.06]"
          style={{
            background: "linear-gradient(165deg, #121110 0%, #0e0d0c 100%)",
            minHeight: card.media.type === "json" ? 320 : 240,
          }}
          initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{
            delay: i * 0.1,
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <CardMedia card={card} />
          {card.media.type === "video" && (
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(10,9,8,0.5) 0%, rgba(10,9,8,0.05) 30%, rgba(10,9,8,0.05) 65%, rgba(10,9,8,0.7) 100%)",
              }}
            />
          )}
          <div
            className="absolute left-0 right-0 top-0 h-[2px] opacity-60"
            style={{
              background: `linear-gradient(90deg, transparent, ${card.color}, transparent)`,
            }}
          />
          <div className="relative z-10 flex h-full min-h-[inherit] flex-col justify-between p-5">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="h-[6px] w-[6px] rounded-full bg-[#ff5f57]/50" />
                <div className="h-[6px] w-[6px] rounded-full bg-[#febc2e]/50" />
                <div className="h-[6px] w-[6px] rounded-full bg-[#28c840]/50" />
              </div>
              <span
                className="font-mono text-[9px] font-semibold uppercase tracking-[0.15em]"
                style={{ color: card.color }}
              >
                {`// ${card.label}`}
              </span>
            </div>
            <div>
              <p className="mb-1 text-base font-bold text-white">
                {card.tagline}
              </p>
              <p className="max-w-sm text-[12px] leading-relaxed text-white/50">
                {card.description}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main component                                                             */
/* -------------------------------------------------------------------------- */

export default function EnrichmentPipeline() {
  const reducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section id="enrichment" className="relative bg-[var(--bg-primary)]">
      {/* Section header */}
      <motion.div
        className="container mx-auto px-6 pb-8 pt-24 md:pb-10 md:pt-32"
        initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="mb-4 inline-block font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--accent-primary)]">
          {"// THE PIPELINE"}
        </span>
        <h2 className="max-w-2xl text-2xl font-bold leading-[1.1] tracking-[-0.02em] text-white md:text-3xl lg:text-[38px]">
          More than video.{" "}
          <span className="text-white/35">
            Captured, enriched, annotated, and delivered to your pipeline.
          </span>
        </h2>
      </motion.div>

      {/* Desktop: Stacked card reveal */}
      {!isMobile && <StickyCardStack reducedMotion={reducedMotion} />}

      {/* Mobile: Vertical stack */}
      {isMobile && <MobileStack reducedMotion={reducedMotion} />}

      {/* Spacer after cards */}
      <div className="h-16 md:h-24" />
    </section>
  );
}
