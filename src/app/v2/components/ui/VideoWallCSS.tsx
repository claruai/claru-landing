"use client";

import { useEffect, useRef, useMemo, useCallback, memo } from "react";

// ---------------------------------------------------------------------------
// Grid configuration: 10 cols × 7 rows, responsive positioning
// ---------------------------------------------------------------------------

const COLS = 10;
const ROWS = 7;

// Column positions as fractions of viewport width (from center)
// Spread: ±47% of viewport width
const COL_FRACS = [
  -0.47, -0.37, -0.27, -0.17, -0.07, 0.07, 0.17, 0.27, 0.37, 0.47,
];

// Row positions as fractions of viewport height (from center)
const ROW_FRACS = [-0.44, -0.29, -0.14, 0.0, 0.14, 0.29, 0.44];

// Center gap: cols 3-6 × rows 2-4 (4 wide × 3 tall = 12 empty)
// Tighter than the old 6-col gap — text sits in a compact clearing
const EMPTY_POSITIONS = new Set([
  "3,2", "4,2", "5,2", "6,2",
  "3,3", "4,3", "5,3", "6,3",
  "3,4", "4,4", "5,4", "6,4",
]);

// ---------------------------------------------------------------------------
// Video URLs mapped to grid positions
// ---------------------------------------------------------------------------

const GRID_VIDEOS: (string | null)[][] = [
  // Row 0 (top) — all 10
  [
    "mosaic-08.mp4", "mosaic-13.mp4", "mosaic-02.mp4", "mosaic-24.mp4",
    "annotated-pose-manip.mp4", "mosaic-10.mp4", "mosaic-07.mp4",
    "mosaic-11.mp4", "mosaic-09.mp4", "mosaic-16.mp4",
  ],
  // Row 1 — all 10
  [
    "mosaic-03.mp4", "annotated-depth-02.mp4", "mosaic-04.mp4",
    "mosaic-28.mp4", "mosaic-29.mp4", "mosaic-06.mp4",
    "annotated-sensor.mp4", "mosaic-21.mp4", "mosaic-20.mp4",
    "mosaic-22.mp4",
  ],
  // Row 2 — cols 3-6 empty (gap top)
  [
    "mosaic-05.mp4", "annotated-bbox-01.mp4", "mosaic-driving.mp4",
    null, null, null, null,
    "mosaic-12.mp4", "annotated-seg-01.mp4", "mosaic-17.mp4",
  ],
  // Row 3 (center) — cols 3-6 empty
  [
    "mosaic-34.mp4", "hmr2-triptych.mp4", "mosaic-teleop.mp4",
    null, null, null, null,
    "pancake-cooking.mp4", "robot-arm.mp4", "mosaic-23.mp4",
  ],
  // Row 4 — cols 3-6 empty (gap bottom)
  [
    "mosaic-35.mp4", "annotated-depth-01.mp4", "vla-telemetry.mp4",
    null, null, null, null,
    "kling-simlab.mp4", "annotated-bbox-02.mp4", "mosaic-14.mp4",
  ],
  // Row 5 — all 10
  [
    "mosaic-15.mp4", "mosaic-39.mp4", "mosaic-32.mp4",
    "mosaic-38.mp4", "mosaic-36.mp4", "mosaic-18.mp4",
    "mosaic-40.mp4", "mosaic-19.mp4", "mosaic-01.mp4",
    "mosaic-game-env.mp4",
  ],
  // Row 6 (bottom) — all 10
  [
    "mosaic-27.mp4", "mosaic-42.mp4", "mosaic-43.mp4",
    "mosaic-33.mp4", "mosaic-30.mp4", "mosaic-37.mp4",
    "mosaic-41.mp4", "mosaic-31.mp4", "mosaic-25.mp4", "mosaic-26.mp4",
  ],
];

// ---------------------------------------------------------------------------
// Active playback set — only these 12 tiles render <video>; the rest show a
// poster frame as <img>. Cap exists because 60+ simultaneous H.264 decoders
// exhaust hardware decode budget on most consumer GPUs (real complaint from
// users on fast machines: "background videos too intense"). Picks favor
// high-motion content + annotation overlays so the wall still reads "alive"
// and "this is annotated data."
// ---------------------------------------------------------------------------

const ACTIVE_VIDEO_FILES = new Set<string>([
  "mosaic-driving.mp4",
  "robot-arm.mp4",
  "mosaic-teleop.mp4",
  "pancake-cooking.mp4",
  "kling-robot.mp4",
  "kling-simlab.mp4",
  "annotated-bbox-01.mp4",
  "annotated-depth-01.mp4",
  "annotated-seg-01.mp4",
  "annotated-pose-manip.mp4",
  "hmr2-triptych.mp4",
  "vla-telemetry.mp4",
]);

function posterFor(videoPath: string): string {
  // /videos/mosaic/foo.mp4 → /videos/mosaic/foo-poster.jpg
  return videoPath.replace(/\.mp4$/, "-poster.jpg");
}

// ---------------------------------------------------------------------------
// Seeded random for deterministic tile variation
// ---------------------------------------------------------------------------

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ---------------------------------------------------------------------------
// Tile configuration (viewport-independent fractions)
// ---------------------------------------------------------------------------

interface TileConfig {
  id: string;
  video: string;
  colFrac: number;
  rowFrac: number;
  z: number;
  widthFrac: number;
  heightFrac: number;
  opacity: number;
  jitterX: number;
  jitterY: number;
  scatterDirX: number;
  scatterDirY: number;
  scatterDist: number;
}

function buildConfigs(): TileConfig[] {
  const rand = seeded(42);
  const configs: TileConfig[] = [];
  const centerCol = (COLS - 1) / 2;
  const centerRow = (ROWS - 1) / 2;

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (EMPTY_POSITIONS.has(`${col},${row}`)) continue;
      const video = GRID_VIDEOS[row]?.[col];
      if (!video) continue;

      const colFrac = COL_FRACS[col];
      const rowFrac = ROW_FRACS[row];

      // Normalized distance from center (0-1)
      const dx = (col - centerCol) / centerCol;
      const dy = (row - centerRow) / centerRow;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const normDist = Math.min(dist / 1.414, 1);

      // Z depth: center-adjacent = shallow, corners = deep
      const baseZ = -25 - normDist * 260;
      const z = Math.max(-300, baseZ + (rand() - 0.5) * 50);

      // Opacity: gradual fade based on depth
      const opacity = 0.4 + 0.55 * (1 - Math.abs(z) / 300);

      // Tile size as fraction of vmin (slight random variation)
      const widthFrac = 0.14 + (rand() - 0.5) * 0.025;
      const heightFrac = 0.091 + (rand() - 0.5) * 0.016;

      // Organic jitter (px) for cloud feel
      const jitterX = (rand() - 0.5) * 18;
      const jitterY = (rand() - 0.5) * 12;

      // Scatter direction: radial unit vector from center
      const len = Math.sqrt(colFrac * colFrac + rowFrac * rowFrac) || 0.01;
      const scatterDirX = colFrac / len;
      const scatterDirY = rowFrac / len;
      // Inner tiles scatter proportionally more
      const scatterDist = 0.25 + normDist * 0.45;

      configs.push({
        id: `tile-${row}-${col}`,
        video: `/videos/mosaic/${video}`,
        colFrac,
        rowFrac,
        z,
        widthFrac,
        heightFrac,
        opacity,
        jitterX,
        jitterY,
        scatterDirX,
        scatterDirY,
        scatterDist,
      });
    }
  }

  return configs;
}

// ---------------------------------------------------------------------------
// Easing
// ---------------------------------------------------------------------------

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

// ---------------------------------------------------------------------------
// Video tile (memoized — never re-renders during scroll)
// ---------------------------------------------------------------------------

const VideoTile = memo(function VideoTile({
  config,
  onRef,
}: {
  config: TileConfig;
  onRef: (id: string, el: HTMLDivElement | null) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileName = config.video.split("/").pop() ?? "";
  const isActive = ACTIVE_VIDEO_FILES.has(fileName);
  const poster = posterFor(config.video);

  useEffect(() => {
    if (!isActive) return;
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.1 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [isActive]);

  return (
    <div
      ref={(el) => onRef(config.id, el)}
      data-tile={config.id}
      style={{
        position: "absolute",
        borderRadius: "8px",
        overflow: "hidden",
        willChange: "transform, opacity",
        backfaceVisibility: "hidden",
        // Start invisible — applyPositions sets real opacity
        opacity: 0,
      }}
    >
      {isActive ? (
        <video
          ref={videoRef}
          src={config.video}
          poster={poster}
          muted
          loop
          playsInline
          preload="none"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : (
        <img
          src={poster}
          alt=""
          loading="lazy"
          decoding="async"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      )}
    </div>
  );
});

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export interface VideoWallCSSHandle {
  /** Set scroll progress 0-1 — drives scatter animation + fade */
  setScrollProgress: (p: number) => void;
}

interface VideoWallCSSProps {
  onHandleReady?: (handle: VideoWallCSSHandle) => void;
}

export default function VideoWallCSS({ onHandleReady }: VideoWallCSSProps) {
  const configs = useMemo(() => buildConfigs(), []);
  const containerRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const tileEls = useRef<Map<string, HTMLDivElement>>(new Map());
  const viewport = useRef({ w: 1440, h: 900 });
  const scrollP = useRef(0);
  const mouseTarget = useRef({ x: 0, y: 0 });
  const mouseCurrent = useRef({ x: 0, y: 0 });
  const rafId = useRef(0);

  // Tile ref registration
  const onTileRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) tileEls.current.set(id, el);
    else tileEls.current.delete(id);
  }, []);

  // -----------------------------------------------------------------------
  // Core layout + scatter computation (called on resize & scroll)
  // -----------------------------------------------------------------------

  const applyPositions = useCallback(() => {
    const { w, h } = viewport.current;
    const vmin = Math.min(w, h);
    const p = scrollP.current;

    // Scatter: ramps from 0 at 28% scroll to 1 at 65%
    const scatterRaw = Math.max(0, Math.min((p - 0.28) / 0.37, 1));
    // Use a softer ease — cubic is too front-loaded
    const scatter = scatterRaw * scatterRaw * (3 - 2 * scatterRaw); // smoothstep

    // Tile opacity fade: starts at 30%, gone by 60%
    const fadeRaw = Math.max(0, Math.min((p - 0.3) / 0.3, 1));
    const fadeOut = 1 - fadeRaw;

    // Container-level opacity for clean disappearance
    if (containerRef.current) {
      const cOpacity = Math.max(0, 1 - Math.max(0, (p - 0.45) / 0.2));
      containerRef.current.style.opacity = String(cOpacity);
    }

    for (const cfg of configs) {
      const el = tileEls.current.get(cfg.id);
      if (!el) continue;

      // Base position (responsive to viewport)
      let x = cfg.colFrac * w + cfg.jitterX;
      let y = cfg.rowFrac * h + cfg.jitterY;
      let z = cfg.z;

      // Scatter: tiles drift outward from center
      if (scatter > 0) {
        // Use vmin-based magnitude for consistent feel across viewports
        const mag = cfg.scatterDist * vmin * 0.65 * scatter;
        x += cfg.scatterDirX * mag;
        y += cfg.scatterDirY * mag;
        z += scatter * 200; // gentler Z push
      }

      // Tile dimensions (vmin-based, responsive)
      const tileW = cfg.widthFrac * vmin;
      const tileH = cfg.heightFrac * vmin;

      el.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
      el.style.width = `${tileW}px`;
      el.style.height = `${tileH}px`;
      el.style.marginLeft = `${-tileW / 2}px`;
      el.style.marginTop = `${-tileH / 2}px`;
      el.style.opacity = String(cfg.opacity * fadeOut);
    }
  }, [configs]);

  // -----------------------------------------------------------------------
  // Viewport resize
  // -----------------------------------------------------------------------

  useEffect(() => {
    const onResize = () => {
      viewport.current = { w: window.innerWidth, h: window.innerHeight };
      applyPositions();
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [applyPositions]);

  // -----------------------------------------------------------------------
  // Expose imperative handle
  // -----------------------------------------------------------------------

  useEffect(() => {
    if (!onHandleReady) return;
    onHandleReady({
      setScrollProgress: (p: number) => {
        scrollP.current = p;
        applyPositions();
      },
    });
  }, [onHandleReady, applyPositions]);

  // -----------------------------------------------------------------------
  // Initial position apply (after tiles mount)
  // -----------------------------------------------------------------------

  useEffect(() => {
    const timer = setTimeout(() => applyPositions(), 30);
    return () => clearTimeout(timer);
  }, [applyPositions]);

  // -----------------------------------------------------------------------
  // Mouse parallax
  // -----------------------------------------------------------------------

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseTarget.current.x =
        ((e.clientY / window.innerHeight) * 2 - 1) * -2.5;
      mouseTarget.current.y =
        ((e.clientX / window.innerWidth) * 2 - 1) * 2.5;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const animate = () => {
      const lerp = 0.05;
      mouseCurrent.current.x +=
        (mouseTarget.current.x - mouseCurrent.current.x) * lerp;
      mouseCurrent.current.y +=
        (mouseTarget.current.y - mouseCurrent.current.y) * lerp;

      if (anchorRef.current) {
        anchorRef.current.style.transform = `rotateX(${mouseCurrent.current.x}deg) rotateY(${mouseCurrent.current.y}deg)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };
    rafId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        perspective: "800px",
        perspectiveOrigin: "center center",
        overflow: "hidden",
        contain: "layout style paint",
        // Soft radial mask — tighter vertically to hide perspective edges
        maskImage:
          "radial-gradient(ellipse 92% 72% at 50% 50%, black 45%, transparent 88%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 92% 72% at 50% 50%, black 45%, transparent 88%)",
      }}
    >
      {/* Sage green glow behind center gap */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "450px",
          background:
            "radial-gradient(ellipse at center, rgba(146,176,144,0.07) 0%, transparent 55%)",
          filter: "blur(50px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Zero-size anchor at center — all tiles positioned relative to this */}
      <div
        ref={anchorRef}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 0,
          height: 0,
          transformStyle: "preserve-3d",
        }}
      >
        {configs.map((cfg) => (
          <VideoTile key={cfg.id} config={cfg} onRef={onTileRef} />
        ))}
      </div>
    </div>
  );
}
