/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck - Experimental component with incomplete type definitions from shaders/react
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePostHog } from "posthog-js/react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import type { VideoWallCSSHandle } from "../ui/VideoWallCSS";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ---------------------------------------------------------------------------
// Dynamic imports (SSR-disabled)
// ---------------------------------------------------------------------------

const VideoWallCSS = dynamic(() => import("../ui/VideoWallCSS"), {
  ssr: false,
});

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
// Mobile detection hook (< 768px = mobile, skip 3D perspective)
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
// ASCII Border — sage green code characters around viewport edges
// ---------------------------------------------------------------------------

function ASCIIBorder() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const CHARS = "01{}[]<>/*+-=~^.:#@_";
    const SAGE = [146, 176, 144]; // #92B090
    const FONT_SIZE = 11;
    const COL_W = FONT_SIZE * 0.62;

    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let rafId: number;
    // Per-cell state: char index, brightness (0-1), speed
    let cells: { char: number; brightness: number; speed: number; phase: number }[] = [];

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2);
      w = canvas!.clientWidth;
      h = canvas!.clientHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.ceil(w / COL_W);
      rows = Math.ceil(h / FONT_SIZE);

      // Rebuild cell state
      cells = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          cells.push({
            char: Math.floor(Math.random() * CHARS.length),
            brightness: Math.random(),
            speed: 0.3 + Math.random() * 1.5,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
    }

    function isEdgeZone(cx: number, cy: number): number {
      // Returns 0-1 where 1 = full edge, 0 = invisible
      // Very thin band hugging the viewport edges — fades fast into black
      const bx = 0.10; // only 10% from each side
      const by = 0.12; // 12% from top/bottom
      const nx = cx / w;
      const ny = cy / h;

      const dx = Math.min(nx, 1 - nx);
      const dy = Math.min(ny, 1 - ny);

      const ix = 1 - Math.min(dx / bx, 1);
      const iy = 1 - Math.min(dy / by, 1);

      // Cubic falloff — fades fast, only strong at the very edge
      const edge = Math.max(ix, iy);
      return edge * edge;
    }

    let t = 0;
    function draw() {
      t += 0.016;
      ctx!.clearRect(0, 0, w, h);
      ctx!.font = `${FONT_SIZE}px "JetBrains Mono", monospace`;
      ctx!.textBaseline = "top";

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cx = c * COL_W + COL_W / 2;
          const cy = r * FONT_SIZE;
          const edge = isEdgeZone(cx, cy);
          if (edge < 0.01) continue; // skip center cells entirely

          const idx = r * cols + c;
          const cell = cells[idx];
          if (!cell) continue;

          // Animate brightness with sin wave
          const flicker = 0.3 + 0.7 * Math.sin(t * cell.speed + cell.phase);
          const alpha = edge * flicker * 0.25; // max ~25% opacity — very subtle

          // Occasionally swap character
          if (Math.random() < 0.003) {
            cell.char = Math.floor(Math.random() * CHARS.length);
          }

          ctx!.fillStyle = `rgba(${SAGE[0]}, ${SAGE[1]}, ${SAGE[2]}, ${alpha})`;
          ctx!.fillText(CHARS[cell.char], c * COL_W, cy);
        }
      }

      rafId = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ zIndex: 5 }}
    />
  );
}

// GlitchBands removed — replaced by ASCIIBorder above

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
  {
    videoFile: "mosaic-01.mp4",
    label: "EGOCENTRIC",
    badgeColor: "#92B090",
    badgeTextColor: "#0a0908",
    overlay: "none",
  },
  {
    videoFile: "annotated-depth-01.mp4",
    label: "DEPTH MAP",
    badgeColor: "#4A9EDE",
    badgeTextColor: "#ffffff",
    overlay: "none",
  },
  {
    videoFile: "mosaic-driving.mp4",
    label: "DRIVING",
    badgeColor: "rgba(255,255,255,0.40)",
    badgeTextColor: "#0a0908",
    overlay: "none",
  },
  {
    videoFile: "annotated-seg-01.mp4",
    label: "SEGMENTATION",
    badgeColor: "#9E6ADE",
    badgeTextColor: "#ffffff",
    overlay: "none",
  },
  {
    videoFile: "annotated-bbox-01.mp4",
    label: "BBOX",
    badgeColor: "#DE8A4A",
    badgeTextColor: "#ffffff",
    overlay: "none",
  },
  {
    videoFile: "mosaic-game-env.mp4",
    label: "GAME ENV",
    badgeColor: "#92B090",
    badgeTextColor: "#0a0908",
    overlay: "none",
  },
  {
    videoFile: "mosaic-05.mp4",
    label: "INDOOR",
    badgeColor: "rgba(255,255,255,0.40)",
    badgeTextColor: "#0a0908",
    overlay: "none",
  },
  {
    videoFile: "kling-robot.mp4",
    label: "ROBOTICS",
    badgeColor: "#92B090",
    badgeTextColor: "#0a0908",
    overlay: "none",
  },
  {
    videoFile: "mosaic-teleop.mp4",
    label: "TELEOPERATION",
    badgeColor: "#4A9EDE",
    badgeTextColor: "#ffffff",
    overlay: "none",
  },
  {
    videoFile: "robot-arm.mp4",
    label: "MANIPULATION",
    badgeColor: "#DE8A4A",
    badgeTextColor: "#ffffff",
    overlay: "none",
  },
  {
    videoFile: "mosaic-07.mp4",
    label: "OUTDOOR",
    badgeColor: "rgba(255,255,255,0.40)",
    badgeTextColor: "#0a0908",
    overlay: "none",
  },
  {
    videoFile: "pancake-cooking.mp4",
    label: "COOKING",
    badgeColor: "#9E6ADE",
    badgeTextColor: "#ffffff",
    overlay: "none",
  },
];

// Deterministic stagger delays (one per tile, evenly spaced)
const STAGGER_DELAYS = MOSAIC_TILES.map((_, i) => i * 167);

function videoSrc(file: string): string {
  return `/videos/mosaic/${file}`;
}

// ---------------------------------------------------------------------------
// Calculate tile brightness based on distance from grid center
// ---------------------------------------------------------------------------

function getTileBrightness(
  index: number,
  totalCols: number,
  totalRows: number
): number {
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
        preload="none"
        className="block h-full w-full object-cover"
      >
        <source src={videoSrc(tile.videoFile)} type="video/mp4" />
      </video>
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
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: 1px;
    width: 100%;
    height: 100%;
    background: rgba(146, 176, 144, 0.1);
  }
`;

// ---------------------------------------------------------------------------
// Scanline sweep + glitch keyframes
// ---------------------------------------------------------------------------

const HERO_ANIMATION_STYLES = ``;

// ---------------------------------------------------------------------------
// Rotating modality word with scramble effect
// ---------------------------------------------------------------------------

const MODALITIES = ["physical", "robotics", "video", "vision", "multimodal"];
const ROTATE_INTERVAL = 3000;
const ROTATE_INITIAL_DELAY = 3500;

function RotatingModality({ reducedMotion }: { reducedMotion: boolean }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const timeout = setTimeout(() => {
      const timer = setInterval(() => {
        setIndex((prev) => (prev + 1) % MODALITIES.length);
      }, ROTATE_INTERVAL);
      return () => clearInterval(timer);
    }, ROTATE_INITIAL_DELAY);
    return () => clearTimeout(timeout);
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <span className="text-[var(--accent-primary)]">{MODALITIES[0]}</span>
    );
  }

  return (
    <span className="relative inline-block overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={MODALITIES[index]}
          className="inline-block text-[var(--accent-primary)]"
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-110%", opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          {MODALITIES[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Investor logo bar
// ---------------------------------------------------------------------------

const INVESTORS = [
  "NVIDIA",
  "Khosla Ventures",
  "General Catalyst",
  "Y Combinator",
];

function InvestorBar({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <motion.div
      className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1"
      initial={reducedMotion ? {} : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.2, duration: 1 }}
    >
      <span className="font-mono text-[10px] tracking-[0.1em] text-white/20">
        Backed by
      </span>
      {INVESTORS.map((name, i) => (
        <span key={name} className="flex items-center gap-2">
          {i > 0 && (
            <span className="text-[10px] text-white/10">&middot;</span>
          )}
          <span className="font-mono text-[10px] tracking-[0.05em] text-white/25 transition-colors duration-300 hover:text-white/45">
            {name}
          </span>
        </span>
      ))}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Hero component -- Option C scroll pattern
// ---------------------------------------------------------------------------

export default function HeroV2() {
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const posthog = usePostHog();
  const sectionRef = useRef<HTMLElement>(null);
  const stickyContainerRef = useRef<HTMLDivElement>(null);
  const textOverlayRef = useRef<HTMLDivElement>(null);
  const belowFoldRef = useRef<HTMLDivElement>(null);
  const bottomGradientRef = useRef<HTMLDivElement>(null);
  const wallHandleRef = useRef<VideoWallCSSHandle | null>(null);
  const onWallHandleReady = useCallback((handle: VideoWallCSSHandle) => {
    wallHandleRef.current = handle;
  }, []);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  const headline = useTextScramble(
    "The training data catalog for physical AI.",
    300,
    1400
  );

  // Whether to show the CSS 3D wall (desktop + motion OK)
  const show3D = !isMobile && !reducedMotion;

  // Stable stagger delays for mobile fallback tiles (deterministic, computed once at module level)
  const staggerDelays = STAGGER_DELAYS;

  // -------------------------------------------------------------------------
  // GSAP ScrollTrigger: 3-phase scroll animation (desktop only)
  // -------------------------------------------------------------------------

  useGSAP(
    () => {
      if (!show3D || !sectionRef.current) return;

      const section = sectionRef.current;
      const textOverlay = textOverlayRef.current;
      const belowFold = belowFoldRef.current;
      const bottomGradient = bottomGradientRef.current;

      if (!textOverlay || !belowFold || !bottomGradient) return;

      gsap.set(bottomGradient, { opacity: 0 });

      // Proxy for scroll progress — drives the wall's scatter animation
      const proxy = { progress: 0 };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          pin: false,
        },
      });

      // Drive wall scatter (0→1 over full timeline, wall handles its own timing)
      tl.to(
        proxy,
        {
          progress: 1,
          duration: 1,
          ease: "none",
          onUpdate: () => {
            wallHandleRef.current?.setScrollProgress(proxy.progress);
          },
        },
        0
      );

      // Text fades with blur and drifts up (32%→52%)
      tl.to(
        textOverlay,
        {
          opacity: 0,
          y: -50,
          filter: "blur(16px)",
          duration: 0.2,
          ease: "power2.in",
        },
        0.32
      );

      // Dark overlay fades in (40%→65%)
      tl.to(
        bottomGradient,
        {
          opacity: 1,
          duration: 0.25,
          ease: "power2.in",
        },
        0.4
      );

      // Brief black hold before content
      tl.to({}, { duration: 0.1 }, 0.9);
    },
    { dependencies: [show3D] }
  );

  // -------------------------------------------------------------------------
  // GSAP floating animation on the mobile grid container
  // -------------------------------------------------------------------------

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
      ref={sectionRef}
      className="relative bg-[#0a0908]"
      style={{
        // 115vh on desktop — tight transition into catalog circle
        height: show3D ? "115vh" : "auto",
        minHeight: show3D ? undefined : "100vh",
      }}
    >
      {/* Injected animation keyframes */}
      <style dangerouslySetInnerHTML={{ __html: HERO_ANIMATION_STYLES }} />

      {/* Injected grid styles (mobile fallback) */}
      {!show3D && (
        <style dangerouslySetInnerHTML={{ __html: MOSAIC_GRID_STYLES }} />
      )}

      {/* ================================================================= */}
      {/* Desktop: Sticky container that pins during scroll                  */}
      {/* ================================================================= */}
      {show3D ? (
        <>
          <div
            ref={stickyContainerRef}
            className="sticky top-0 h-screen overflow-hidden"
            style={{ zIndex: 1 }}
          >
            {/* Layer 1: CSS 3D Video Wall */}
            <VideoWallCSS onHandleReady={onWallHandleReady} />

            {/* Layer 1.5: ShaderOverlay (CRT + FilmGrain) */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{ zIndex: 2 }}
            >
              <ShaderOverlay />
            </div>

            {/* Layer 2: ASCII art border around viewport edges */}
            <ASCIIBorder />

            {/* Layer 3: Text overlay (sits in center donut gap) */}
            <div
              ref={textOverlayRef}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center"
            >
              {/* Headline with rotating modality */}
              <motion.h1
                className="max-w-4xl px-6 text-center font-sans font-extrabold leading-[0.95] tracking-[-0.045em] text-white"
                style={{
                  fontSize: "clamp(40px, 7vw, 88px)",
                  textShadow:
                    "0 2px 40px rgba(10,9,8,0.9), 0 0 80px rgba(10,9,8,0.7)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                aria-label="Training data for robotics AI, video AI, and more."
              >
                Training data for{" "}
                <RotatingModality reducedMotion={reducedMotion} /> AI.
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                className="mx-auto mt-6 max-w-2xl px-6 text-center text-base leading-relaxed text-white/60 md:text-lg"
                style={{ textShadow: "0 2px 20px rgba(10,9,8,0.9)" }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 1.0,
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                Purpose-built datasets for frontier robotics, embodied AI, and world models.
              </motion.p>

              {/* CTAs */}
              <motion.div
                className="mt-10 flex items-center gap-4"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 1.4,
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <Link
                  href="#contact"
                  onClick={() =>
                    posthog?.capture("book_call_clicked", {
                      location: "hero_desktop",
                      destination: "inline_form",
                    })
                  }
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-[var(--accent-primary)] px-10 py-4 text-[15px] font-bold tracking-[-0.01em] text-[#0a0908] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(146,176,144,0.25)]"
                >
                  <span className="relative z-10">Book a Call</span>
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                </Link>
              </motion.div>

              {/* Investor bar */}
              <div className="mt-8 mb-16">
                <InvestorBar reducedMotion={reducedMotion} />
              </div>
            </div>

            {/* Layer 4: Dark overlay (fades entire wall to black during scroll) */}
            <div
              ref={bottomGradientRef}
              className="pointer-events-none absolute inset-0"
              style={{
                zIndex: 15,
                background: "#0a0908",
                opacity: 0,
              }}
            />
          </div>

          {/* Below-fold spacer — minimal, just ensures clean transition */}
          <div ref={belowFoldRef} className="relative z-20" />
        </>
      ) : (
        /* ================================================================= */
        /* Mobile / Reduced Motion fallback: flat layout, no scroll anim     */
        /* ================================================================= */
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden pt-24 sm:pt-0">
          {/* Layer 2: Video grid */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ zIndex: 1 }}
          >
            {/* Sage green glow behind the grid */}
            <div
              className="absolute"
              style={{
                width: "80%",
                height: "75%",
                background:
                  "radial-gradient(ellipse at center, rgba(146, 176, 144, 0.10) 0%, rgba(146, 176, 144, 0.04) 40%, transparent 70%)",
                filter: "blur(60px)",
              }}
            />

            <div
              ref={gridContainerRef}
              className="relative"
              style={{
                width: "clamp(320px, 85vw, 1100px)",
                height: "clamp(360px, 60vh, 600px)",
                transform: reducedMotion ? "none" : "rotateX(2deg)",
                boxShadow: "0 0 120px 40px rgba(146, 176, 144, 0.06)",
                filter: "brightness(0.55)",
              }}
            >
              <div
                className="h-full w-full overflow-hidden rounded-sm"
                style={{
                  maskImage:
                    "radial-gradient(ellipse 80% 85% at center, black 30%, transparent 75%)",
                  WebkitMaskImage:
                    "radial-gradient(ellipse 80% 85% at center, black 30%, transparent 75%)",
                }}
              >
                <div className="hero-mosaic-grid-v2">
                  {MOSAIC_TILES.map((tile, i) => {
                    const brightness = getTileBrightness(i, 3, 4);
                    return (
                      <div key={tile.videoFile} className="min-h-0">
                        <MosaicVideoTile
                          tile={tile}
                          staggerDelay={staggerDelays[i]}
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
          </div>

          {/* Dark gradient overlay for text readability */}
          <div
            className="absolute inset-0"
            style={{
              zIndex: 7,
              background:
                "linear-gradient(to bottom, rgba(10,9,8,0.88) 0%, rgba(10,9,8,0.55) 20%, rgba(10,9,8,0.40) 40%, rgba(10,9,8,0.45) 60%, rgba(10,9,8,0.80) 100%)",
            }}
          />

          {/* Radial center darkening — reinforces text readability on mobile */}
          <div
            className="absolute inset-0"
            style={{
              zIndex: 7,
              background:
                "radial-gradient(ellipse 90% 70% at 50% 45%, rgba(10,9,8,0.50) 0%, rgba(10,9,8,0.20) 50%, transparent 80%)",
            }}
          />

          {/* Bottom gradient fade into next section */}
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg-primary)] to-transparent"
            style={{ zIndex: 8 }}
          />

          {/* Text content */}
          <div
            className="relative mx-auto max-w-5xl px-6 text-center"
            style={{ zIndex: 10 }}
          >
            {/* Eyebrow label */}
            {/* Headline */}
            <h1
              className="font-sans font-extrabold leading-[0.95] tracking-[-0.045em] text-white"
              style={{
                fontSize: "clamp(36px, 10vw, 72px)",
                textShadow:
                  "0 2px 40px rgba(10,9,8,0.95), 0 0 80px rgba(10,9,8,0.8), 0 4px 16px rgba(10,9,8,1)",
              }}
              aria-label="Training data for physical AI."
            >
              Training data for{" "}
              <RotatingModality reducedMotion={reducedMotion} /> AI.
            </h1>

            {/* Subheadline */}
            <motion.p
              className="mx-auto mt-6 max-w-sm text-base leading-relaxed text-white/60"
              style={{ textShadow: "0 2px 20px rgba(10,9,8,0.95), 0 0 40px rgba(10,9,8,0.8)" }}
              initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 1.2,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              Purpose-built datasets for frontier robotics, embodied AI, and world models.
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
                { value: "4M+", label: "human annotations" },
                { value: "100+", label: "licensed datasets" },
                { value: "150+", label: "environments" },
              ].map((stat, i) => (
                <div key={stat.label} className="flex items-baseline gap-2.5">
                  {i > 0 && (
                    <span className="mr-3 hidden text-white/8 sm:inline">
                      /
                    </span>
                  )}
                  <span
                    className="font-mono text-2xl font-black text-[var(--accent-primary)] md:text-3xl"
                    style={{
                      textShadow: "0 0 30px rgba(146, 176, 144, 0.3)",
                    }}
                  >
                    {stat.value}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>

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
                onClick={() =>
                  posthog?.capture("book_call_clicked", {
                    location: "hero_mobile",
                    destination: "calendly",
                  })
                }
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-[var(--accent-primary)] px-12 py-5 text-[16px] font-bold tracking-[-0.01em] text-[#0a0908] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_60px_var(--accent-glow-strong)]"
                style={{ boxShadow: "0 0 30px rgba(146, 176, 144, 0.15)" }}
              >
                <span className="relative z-10">Book a Call</span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </Link>
            </motion.div>

            {/* Investor bar */}
            <div className="mt-10">
              <InvestorBar reducedMotion={reducedMotion} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
