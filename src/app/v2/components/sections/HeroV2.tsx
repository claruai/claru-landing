"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useReducedMotion } from "../../hooks/useReducedMotion";

// ---------------------------------------------------------------------------
// Text-scramble hook (unchanged)
// ---------------------------------------------------------------------------

const SCRAMBLE_CHARS = "!<>-_\\/[]{}=+*^?#________";

function useTextScramble(text: string, delay = 0, duration = 1200) {
  const reducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(text);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(text);
      return;
    }

    const timeout = setTimeout(() => {
      const chars = text.split("");
      const totalFrames = Math.round((duration / 1000) * 30);
      const waveWidth = Math.max(6, Math.round(totalFrames * 0.15));
      const queue = chars.map((char, i) => ({
        to: char,
        start: Math.round((i / chars.length) * (totalFrames - waveWidth)),
        end:
          Math.round((i / chars.length) * (totalFrames - waveWidth)) +
          waveWidth,
        current: char,
      }));

      let frame = 0;
      const msPerTick = Math.round(duration / totalFrames);
      let lastTick = performance.now();

      const update = (now: number) => {
        if (now - lastTick < msPerTick) {
          frameRef.current = requestAnimationFrame(update);
          return;
        }
        lastTick = now;

        let output = "";
        let complete = 0;

        for (const q of queue) {
          if (frame >= q.end) {
            complete++;
            output += q.to;
          } else if (frame >= q.start) {
            if (Math.random() < 0.2) {
              q.current =
                SCRAMBLE_CHARS[
                  Math.floor(Math.random() * SCRAMBLE_CHARS.length)
                ];
            }
            output += q.current;
          } else {
            output += "\u00A0";
          }
        }

        setDisplay(output);
        frame++;

        if (complete === queue.length) {
          setDisplay(text);
        } else {
          frameRef.current = requestAnimationFrame(update);
        }
      };

      frameRef.current = requestAnimationFrame(update);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [text, delay, duration, reducedMotion]);

  return display;
}

// ---------------------------------------------------------------------------
// Mosaic tile configuration
// ---------------------------------------------------------------------------

type TileOverlay = "none" | "depth" | "segmentation" | "bbox";

interface MosaicTile {
  /** Video file index (01-24) */
  videoIndex: number;
  /** Label text shown in corner */
  label: string;
  /** Badge background color */
  badgeColor: string;
  /** Badge text color */
  badgeTextColor: string;
  /** Overlay type for annotation simulation */
  overlay: TileOverlay;
}

// 12 tiles: desktop shows all 12 (4x3), tablet shows 9 (3x3), mobile shows 6 (2x3)
const MOSAIC_TILES: MosaicTile[] = [
  // Row 1
  { videoIndex: 1,  label: "EGOCENTRIC",   badgeColor: "#92B090",                badgeTextColor: "#0a0908", overlay: "none" },
  { videoIndex: 5,  label: "DEPTH MAP",    badgeColor: "#4A9EDE",                badgeTextColor: "#ffffff", overlay: "depth" },
  { videoIndex: 9,  label: "RAW",          badgeColor: "rgba(255,255,255,0.40)", badgeTextColor: "#0a0908", overlay: "none" },
  { videoIndex: 13, label: "SEGMENTATION", badgeColor: "#9E6ADE",                badgeTextColor: "#ffffff", overlay: "segmentation" },
  // Row 2
  { videoIndex: 2,  label: "BBOX",         badgeColor: "#DE8A4A",                badgeTextColor: "#ffffff", overlay: "bbox" },
  { videoIndex: 6,  label: "GAME ENV",     badgeColor: "#92B090",                badgeTextColor: "#0a0908", overlay: "none" },
  { videoIndex: 10, label: "DEPTH MAP",    badgeColor: "#4A9EDE",                badgeTextColor: "#ffffff", overlay: "depth" },
  { videoIndex: 14, label: "RAW",          badgeColor: "rgba(255,255,255,0.40)", badgeTextColor: "#0a0908", overlay: "none" },
  // Row 3
  { videoIndex: 3,  label: "SEGMENTATION", badgeColor: "#9E6ADE",                badgeTextColor: "#ffffff", overlay: "segmentation" },
  { videoIndex: 7,  label: "RAW",          badgeColor: "rgba(255,255,255,0.40)", badgeTextColor: "#0a0908", overlay: "none" },
  { videoIndex: 11, label: "BBOX",         badgeColor: "#DE8A4A",                badgeTextColor: "#ffffff", overlay: "bbox" },
  { videoIndex: 15, label: "EGOCENTRIC",   badgeColor: "#92B090",                badgeTextColor: "#0a0908", overlay: "none" },
];

function videoSrc(index: number): string {
  return `/videos/mosaic/mosaic-${String(index).padStart(2, "0")}.mp4`;
}

// ---------------------------------------------------------------------------
// Bounding-box overlay (CSS-only rectangles)
// ---------------------------------------------------------------------------

function BBoxOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-[#DE8A4A]/10" />
      <div className="absolute left-[12%] top-[18%] h-[40%] w-[35%] rounded-sm border-2 border-[#DE8A4A]/70" />
      <div className="absolute bottom-[15%] right-[10%] h-[30%] w-[28%] rounded-sm border-2 border-[#DE8A4A]/70" />
      <div className="absolute left-[55%] top-[10%] h-[25%] w-[22%] rounded-sm border border-[#DE8A4A]/40" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Single mosaic tile component
// ---------------------------------------------------------------------------

interface MosaicVideoTileProps {
  tile: MosaicTile;
  staggerDelay: number;
  reducedMotion: boolean;
}

function MosaicVideoTile({
  tile,
  staggerDelay,
  reducedMotion,
}: MosaicVideoTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const video = videoRef.current;
    if (!video) return;

    const timeout = setTimeout(() => {
      video.play().catch(() => {
        // Autoplay may be blocked — degrade silently to poster frame
      });
    }, staggerDelay);

    return () => clearTimeout(timeout);
  }, [staggerDelay, reducedMotion]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0a0908]">
      {/* Video element */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="metadata"
        className="block h-full w-full object-cover"
      >
        <source src={videoSrc(tile.videoIndex)} type="video/mp4" />
      </video>

      {/* Overlay tints */}
      {tile.overlay === "depth" && (
        <div className="pointer-events-none absolute inset-0 bg-[#4A9EDE]/30 mix-blend-multiply" />
      )}
      {tile.overlay === "segmentation" && (
        <div className="pointer-events-none absolute inset-0 bg-[#9E6ADE]/20 mix-blend-multiply" />
      )}
      {tile.overlay === "bbox" && <BBoxOverlay />}

      {/* Label badge */}
      <span
        className="absolute bottom-1.5 left-1.5 rounded px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase leading-none tracking-wider md:bottom-2 md:left-2 md:text-[10px]"
        style={{
          backgroundColor: tile.badgeColor,
          color: tile.badgeTextColor,
        }}
      >
        {tile.label}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mosaic grid CSS (injected once)
// ---------------------------------------------------------------------------

const MOSAIC_GRID_STYLES = `
  .hero-mosaic-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 1px;
    position: absolute;
    inset: 0;
    height: 100%;
    width: 100%;
    background: rgba(255,255,255,0.06);
  }
  @media (min-width: 768px) {
    .hero-mosaic-grid {
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(3, 1fr);
    }
  }
  @media (min-width: 1024px) {
    .hero-mosaic-grid {
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: repeat(3, 1fr);
    }
  }
`;

// ---------------------------------------------------------------------------
// Hero component
// ---------------------------------------------------------------------------

export default function HeroV2() {
  const reducedMotion = useReducedMotion();
  const headline = useTextScramble(
    "The training data catalog for physical AI.",
    300,
    1400
  );

  // Stable stagger delays: each tile gets 0-2000ms random offset
  const staggerDelays = useRef<number[]>(
    MOSAIC_TILES.map(() => Math.random() * 2000)
  );

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0908]"
    >
      {/* Injected grid styles */}
      <style dangerouslySetInnerHTML={{ __html: MOSAIC_GRID_STYLES }} />

      {/* ----------------------------------------------------------------- */}
      {/* Mosaic video grid background                                      */}
      {/* ----------------------------------------------------------------- */}
      <div className="hero-mosaic-grid">
        {MOSAIC_TILES.map((tile, i) => {
          // Mobile: show first 6 (2x3)
          // Tablet: show first 9 (3x3)
          // Desktop: show all 12 (4x3)
          let visibilityClass = "";
          if (i >= 9) {
            visibilityClass = "hidden lg:block";
          } else if (i >= 6) {
            visibilityClass = "hidden md:block";
          }

          return (
            <div key={tile.videoIndex} className={`${visibilityClass} min-h-0`}>
              <MosaicVideoTile
                tile={tile}
                staggerDelay={staggerDelays.current[i]}
                reducedMotion={reducedMotion}
              />
            </div>
          );
        })}
      </div>

      {/* Dark gradient overlay - heavier for mosaic busy background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0908]/90 via-[#0a0908]/70 to-[#0a0908]/90" />

      {/* Bottom gradient fade into next section */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />

      {/* ----------------------------------------------------------------- */}
      {/* Content                                                           */}
      {/* ----------------------------------------------------------------- */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        {/* Eyebrow label */}
        <motion.span
          className="mb-8 inline-block font-mono text-[11px] uppercase tracking-[0.35em] text-[var(--accent-primary)]"
          initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          Curated for Frontier AI
        </motion.span>

        {/* Headline */}
        <h1
          className="font-sans font-bold leading-[1.02] tracking-[-0.04em] text-white"
          style={{ fontSize: "clamp(42px, 8vw, 96px)" }}
          aria-label="The training data catalog for physical AI."
        >
          {headline}
        </h1>

        {/* Subheadline */}
        <motion.p
          className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg lg:text-xl"
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 1.2,
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          3.7M+ human annotations across real-world video, game environments,
          and custom captures. Built for teams training robotics and embodied AI
          models.
        </motion.p>

        {/* Stats bar */}
        <motion.div
          className="mx-auto mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-3"
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 1.5,
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {[
            { value: "3.7M+", label: "human annotations" },
            { value: "25+", label: "licensed datasets" },
            { value: "5+", label: "environments" },
          ].map((stat, i) => (
            <div key={stat.label} className="flex items-baseline gap-2.5">
              {i > 0 && (
                <span className="mr-3 hidden text-white/10 sm:inline">
                  /
                </span>
              )}
              <span className="font-mono text-lg font-bold text-[var(--accent-primary)] md:text-xl">
                {stat.value}
              </span>
              <span className="font-mono text-xs tracking-wide text-white/35">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Trust signal */}
        <motion.p
          className="mt-5 font-mono text-[11px] tracking-[0.15em] text-white/30"
          initial={reducedMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          Commercially licensed. Human-captured. Provenance on every clip.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 2.0,
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <Link
            href="/catalog"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-[var(--accent-primary)] px-10 py-4 text-[15px] font-semibold text-[#0a0908] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_40px_var(--accent-glow-strong)]"
          >
            <span className="relative z-10">Browse the Catalog</span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </Link>
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-full border border-white/12 px-10 py-4 text-[15px] font-medium text-white/70 backdrop-blur-sm transition-all duration-300 hover:border-[var(--accent-primary)]/30 hover:bg-white/[0.03] hover:text-white"
          >
            Request Custom Collection
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="mt-20 flex justify-center"
          initial={reducedMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
        >
          <motion.div
            className="flex h-9 w-5 items-start justify-center rounded-full border border-white/15 p-1.5"
            animate={reducedMotion ? {} : { y: [0, 6, 0] }}
            transition={{
              repeat: Infinity,
              duration: 2.5,
              ease: "easeInOut",
            }}
          >
            <div className="h-1.5 w-1 rounded-full bg-white/30" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
