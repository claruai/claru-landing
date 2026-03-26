// @ts-nocheck - Experimental component with incomplete type definitions from shaders/react
"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

// ---------------------------------------------------------------------------
// Dynamic imports (SSR-disabled)
// ---------------------------------------------------------------------------

const ContainedMatrixRain = dynamic(
  () => import("../effects/ContainedMatrixRain"),
  { ssr: false }
);

const VideoWall3D = dynamic(() => import("../ui/VideoWall3D"), { ssr: false });

const ShaderOverlay = dynamic(
  () =>
    import("shaders/react").then((mod) => {
      const { Shader, CRTScreen, FilmGrain } = mod;
      const Overlay = () => (
        <Shader
          style={{
            mixBlendMode: "overlay" as const,
            opacity: 0.15,
            width: "100%",
            height: "100%",
          }}
        >
          <CRTScreen
            scanlineIntensity={0.2}
            scanlineFrequency={200}
            curvature={0}
            brightness={1.5}
            contrast={1}
            pixelSize={2000}
          />
          <FilmGrain />
        </Shader>
      );
      Overlay.displayName = "ShaderOverlay";
      return Overlay;
    }),
  { ssr: false }
);

// ---------------------------------------------------------------------------
// Text-scramble hook
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
// Mobile detection hook (< 768px = mobile, skip R3F)
// ---------------------------------------------------------------------------

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
}

// ---------------------------------------------------------------------------
// Mosaic tile configuration (mobile fallback)
// ---------------------------------------------------------------------------

type TileOverlay = "none" | "bbox";

interface MosaicTile {
  videoFile: string;
  label: string;
  badgeColor: string;
  badgeTextColor: string;
  overlay: TileOverlay;
}

const MOSAIC_TILES: MosaicTile[] = [
  { videoFile: "mosaic-01.mp4",          label: "EGOCENTRIC",   badgeColor: "#92B090",                badgeTextColor: "#0a0908", overlay: "none" },
  { videoFile: "annotated-depth-01.mp4", label: "DEPTH MAP",    badgeColor: "#4A9EDE",                badgeTextColor: "#ffffff", overlay: "none" },
  { videoFile: "mosaic-driving.mp4",     label: "DRIVING",      badgeColor: "rgba(255,255,255,0.40)", badgeTextColor: "#0a0908", overlay: "none" },
  { videoFile: "annotated-seg-01.mp4",   label: "SEGMENTATION", badgeColor: "#9E6ADE",                badgeTextColor: "#ffffff", overlay: "none" },
  { videoFile: "annotated-bbox-01.mp4",  label: "BBOX",         badgeColor: "#DE8A4A",                badgeTextColor: "#ffffff", overlay: "none" },
  { videoFile: "mosaic-game-env.mp4",    label: "GAME ENV",     badgeColor: "#92B090",                badgeTextColor: "#0a0908", overlay: "none" },
];

function videoSrc(file: string): string {
  return `/videos/mosaic/${file}`;
}

// ---------------------------------------------------------------------------
// Calculate tile brightness based on distance from grid center
// ---------------------------------------------------------------------------

function getTileBrightness(index: number, totalCols: number, totalRows: number): number {
  const col = index % totalCols;
  const row = Math.floor(index / totalCols);
  const nx = totalCols > 1 ? col / (totalCols - 1) : 0.5;
  const ny = totalRows > 1 ? row / (totalRows - 1) : 0.5;
  const dx = nx - 0.5;
  const dy = ny - 0.5;
  const dist = Math.sqrt(dx * dx + dy * dy) / 0.707;
  return 1.0 - dist * 0.6;
}

// ---------------------------------------------------------------------------
// Bounding-box overlay (CSS-only)
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
// Single mosaic tile component (mobile fallback)
// ---------------------------------------------------------------------------

interface MosaicVideoTileProps {
  tile: MosaicTile;
  staggerDelay: number;
  reducedMotion: boolean;
  brightness: number;
}

function MosaicVideoTile({
  tile,
  staggerDelay,
  reducedMotion,
  brightness,
}: MosaicVideoTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const video = videoRef.current;
    if (!video) return;

    const timeout = setTimeout(() => {
      video.play().catch(() => {});
    }, staggerDelay);

    return () => clearTimeout(timeout);
  }, [staggerDelay, reducedMotion]);

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-[#0a0908]"
      style={{ opacity: brightness }}
    >
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="metadata"
        className="block h-full w-full object-cover"
      >
        <source src={videoSrc(tile.videoFile)} type="video/mp4" />
      </video>
      {tile.overlay === "bbox" && <BBoxOverlay />}
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
// Mosaic grid CSS (mobile fallback only)
// ---------------------------------------------------------------------------

const MOSAIC_GRID_STYLES = `
  .hero-mosaic-grid-v2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 1px;
    width: 100%;
    height: 100%;
    background: rgba(146, 176, 144, 0.1);
  }
`;

// ---------------------------------------------------------------------------
// Hero component
// ---------------------------------------------------------------------------

export default function HeroV2() {
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const headline = useTextScramble(
    "The training data catalog for physical AI.",
    300,
    1400
  );

  // Whether to show the R3F 3D wall (desktop + motion OK)
  const show3D = !isMobile && !reducedMotion;

  // Stable stagger delays for mobile fallback tiles
  const staggerDelays = useRef<number[]>(
    MOSAIC_TILES.map(() => Math.random() * 2000)
  );

  // GSAP floating animation on the mobile grid container
  useGSAP(
    () => {
      if (reducedMotion || show3D || !gridContainerRef.current) return;

      gsap.to(gridContainerRef.current, {
        y: 8,
        duration: 6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    },
    { dependencies: [reducedMotion, show3D] }
  );

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0908]"
    >
      {/* Injected grid styles (mobile fallback) */}
      {!show3D && (
        <style dangerouslySetInnerHTML={{ __html: MOSAIC_GRID_STYLES }} />
      )}

      {/* ================================================================= */}
      {/* Layer 1: ASCII / Matrix Rain background (behind everything)       */}
      {/* ================================================================= */}
      {!reducedMotion && (
        <div className="absolute inset-0" style={{ zIndex: 0 }}>
          <ContainedMatrixRain density={0.3} speed={0.8} opacity={0.4} />
        </div>
      )}

      {/* ================================================================= */}
      {/* Layer 2: Video wall -- 3D (desktop) or CSS grid (mobile)          */}
      {/* ================================================================= */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ zIndex: 1, perspective: show3D ? undefined : "1000px" }}
      >
        {/* Sage green glow behind the grid/canvas */}
        <div
          className="absolute"
          style={{
            width: "70%",
            height: "65%",
            background:
              "radial-gradient(ellipse at center, rgba(146, 176, 144, 0.06) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        {show3D ? (
          /* ---- R3F 3D Video Wall (desktop) ---- */
          <div
            className="absolute inset-0"
            style={{
              maskImage:
                "radial-gradient(ellipse 65% 75% at center, black 25%, transparent 72%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 65% 75% at center, black 25%, transparent 72%)",
            }}
          >
            <VideoWall3D />
          </div>
        ) : (
          /* ---- CSS Grid Mosaic (mobile / reduced-motion fallback) ---- */
          <div
            ref={gridContainerRef}
            className="relative"
            style={{
              width: "clamp(320px, 62vw, 1100px)",
              height: "clamp(240px, 42vh, 520px)",
              transform: reducedMotion ? "none" : "rotateX(2deg)",
              boxShadow: "0 0 120px 40px rgba(146, 176, 144, 0.06)",
            }}
          >
            <div
              className="h-full w-full overflow-hidden rounded-sm"
              style={{
                maskImage:
                  "radial-gradient(ellipse 70% 80% at center, black 30%, transparent 75%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 70% 80% at center, black 30%, transparent 75%)",
              }}
            >
              <div className="hero-mosaic-grid-v2">
                {MOSAIC_TILES.map((tile, i) => {
                  const brightness = getTileBrightness(i, 2, 3);
                  return (
                    <div key={tile.videoFile} className="min-h-0">
                      <MosaicVideoTile
                        tile={tile}
                        staggerDelay={staggerDelays.current[i]}
                        reducedMotion={reducedMotion}
                        brightness={brightness}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {!reducedMotion && (
              <div className="pointer-events-none absolute inset-0">
                <ShaderOverlay />
              </div>
            )}
          </div>
        )}

        {/* Floor reflection glow below */}
        <div
          className="absolute"
          style={{
            bottom: "8%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "80%",
            height: "128px",
            background:
              "radial-gradient(ellipse at center, rgba(146, 176, 144, 0.08) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* ================================================================= */}
      {/* Layer 3: Dark gradient overlay for text readability                */}
      {/* ================================================================= */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 2,
          background:
            "linear-gradient(to bottom, rgba(10,9,8,0.92) 0%, rgba(10,9,8,0.50) 35%, rgba(10,9,8,0.40) 50%, rgba(10,9,8,0.55) 65%, rgba(10,9,8,0.90) 100%)",
        }}
      />

      {/* Bottom gradient fade into next section */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg-primary)] to-transparent"
        style={{ zIndex: 3 }}
      />

      {/* ================================================================= */}
      {/* Layer 4: Text content overlaid on top of everything               */}
      {/* ================================================================= */}
      <div
        className="relative mx-auto max-w-5xl px-6 text-center"
        style={{ zIndex: 10 }}
      >
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
            href="/api/booking-url"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-[var(--accent-primary)] px-10 py-4 text-[15px] font-semibold text-[#0a0908] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_40px_var(--accent-glow-strong)]"
          >
            <span className="relative z-10">Book a Call</span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </Link>
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center rounded-full border border-white/12 px-10 py-4 text-[15px] font-medium text-white/70 backdrop-blur-sm transition-all duration-300 hover:border-[var(--accent-primary)]/30 hover:bg-white/[0.03] hover:text-white"
          >
            Explore the Catalog
          </Link>
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
