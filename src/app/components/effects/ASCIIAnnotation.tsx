"use client";

import { useEffect, useRef, useCallback } from "react";
import { useDeviceCapability } from "@/app/hooks/useDeviceCapability";

/* ============================================
   ASCII ANNOTATION ANIMATION
   Canvas-based bounding box annotation effect
   ============================================ */

interface ASCIIAnnotationProps {
  className?: string;
  opacity?: number; // default 0.6
}

/* ---------- Types ---------- */

interface BoundingBox {
  /** Normalized 0-1 coordinates */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Target values for smooth interpolation */
  targetX: number;
  targetY: number;
  targetW: number;
  targetH: number;
  label: string;
  confidence: number;
  /** Lifecycle: 0 = fade in, 1 = hold, 2 = fade out, 3 = dormant */
  phase: number;
  /** Progress within current phase (0-1) */
  phaseProgress: number;
  /** Duration of current phase in seconds */
  phaseDuration: number;
  /** Current alpha for rendering */
  alpha: number;
  /** Color hue variation */
  hueShift: number;
}

/* ---------- Constants ---------- */

const LABELS = [
  "person",
  "vehicle",
  "object_01",
  "hand_L",
  "hand_R",
  "face",
  "tool",
  "surface",
  "gripper",
  "target",
  "nav_point",
  "obstacle",
];

const BOX_CHARS = {
  topLeft: "\u250C",
  topRight: "\u2510",
  bottomLeft: "\u2514",
  bottomRight: "\u2518",
  horizontal: "\u2500",
  vertical: "\u2502",
  dot: "\u00B7",
};

const ACCENT_GREEN = { r: 146, g: 176, b: 144 };
const BRIGHT_GREEN = { r: 146, g: 255, b: 144 };

/* ---------- Helpers ---------- */

function randomRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.min(t, 1);
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function generateBoxTarget(): Pick<BoundingBox, "targetX" | "targetY" | "targetW" | "targetH"> {
  const w = randomRange(0.12, 0.35);
  const h = randomRange(0.15, 0.4);
  return {
    targetX: randomRange(0.05, 0.95 - w),
    targetY: randomRange(0.05, 0.95 - h),
    targetW: w,
    targetH: h,
  };
}

function createBox(): BoundingBox {
  const target = generateBoxTarget();
  return {
    x: target.targetX,
    y: target.targetY,
    w: target.targetW,
    h: target.targetH,
    ...target,
    label: LABELS[Math.floor(Math.random() * LABELS.length)],
    confidence: parseFloat(randomRange(0.78, 0.99).toFixed(2)),
    phase: 0,
    phaseProgress: 0,
    phaseDuration: randomRange(0.6, 1.2),
    alpha: 0,
    hueShift: Math.random(),
  };
}

/* ---------- Component ---------- */

export default function ASCIIAnnotation({
  className = "",
  opacity = 0.6,
}: ASCIIAnnotationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);
  const boxesRef = useRef<BoundingBox[]>([]);
  const timeRef = useRef<number>(0);
  const dotMatrixCacheRef = useRef<string[][]>([]);

  const { isMobile, prefersReducedMotion } = useDeviceCapability();

  const NUM_BOXES = isMobile ? 3 : 4;
  const FONT_SIZE = isMobile ? 10 : 12;
  const TARGET_FPS = isMobile ? 12 : 18;
  const TARGET_FRAME_TIME = 1000 / TARGET_FPS;

  /* ---------- Dot matrix background cache ---------- */

  const buildDotMatrix = useCallback(
    (cols: number, rows: number) => {
      const matrix: string[][] = [];
      const dotChars = [" ", " ", " ", " ", " ", "\u00B7", ".", " ", " ", " "];
      for (let r = 0; r < rows; r++) {
        const row: string[] = [];
        for (let c = 0; c < cols; c++) {
          row.push(dotChars[Math.floor(Math.random() * dotChars.length)]);
        }
        matrix.push(row);
      }
      return matrix;
    },
    [],
  );

  /* ---------- Draw a single bounding box ---------- */

  const drawBox = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      box: BoundingBox,
      canvasWidth: number,
      canvasHeight: number,
      charW: number,
      charH: number,
    ) => {
      if (box.alpha < 0.01) return;

      const baseAlpha = box.alpha * opacity;

      // Convert normalized coords to pixel positions
      const px = box.x * canvasWidth;
      const py = box.y * canvasHeight;
      const pw = box.w * canvasWidth;
      const ph = box.h * canvasHeight;

      // Convert to character grid positions
      const col1 = Math.floor(px / charW);
      const row1 = Math.floor(py / charH);
      const col2 = Math.floor((px + pw) / charW);
      const row2 = Math.floor((py + ph) / charH);

      // Color based on hue shift
      const g = box.hueShift > 0.5 ? BRIGHT_GREEN : ACCENT_GREEN;
      const colorStr = `rgba(${g.r}, ${g.g}, ${g.b}, ${baseAlpha})`;
      const dimColorStr = `rgba(${g.r}, ${g.g}, ${g.b}, ${baseAlpha * 0.5})`;

      ctx.fillStyle = colorStr;

      // Draw corners
      ctx.fillText(BOX_CHARS.topLeft, col1 * charW, row1 * charH);
      ctx.fillText(BOX_CHARS.topRight, col2 * charW, row1 * charH);
      ctx.fillText(BOX_CHARS.bottomLeft, col1 * charW, row2 * charH);
      ctx.fillText(BOX_CHARS.bottomRight, col2 * charW, row2 * charH);

      // Draw horizontal edges
      ctx.fillStyle = dimColorStr;
      for (let c = col1 + 1; c < col2; c++) {
        // Top edge
        ctx.fillText(BOX_CHARS.horizontal, c * charW, row1 * charH);
        // Bottom edge
        ctx.fillText(BOX_CHARS.horizontal, c * charW, row2 * charH);
      }

      // Draw vertical edges
      for (let r = row1 + 1; r < row2; r++) {
        ctx.fillText(BOX_CHARS.vertical, col1 * charW, r * charH);
        ctx.fillText(BOX_CHARS.vertical, col2 * charW, r * charH);
      }

      // Draw label above box
      ctx.fillStyle = colorStr;
      const labelText = `${box.label}`;
      ctx.fillText(labelText, col1 * charW, (row1 - 1) * charH);

      // Draw confidence score to the right of label
      const confAlpha = baseAlpha * (box.phase === 1 ? 1 : 0.4);
      ctx.fillStyle = `rgba(${BRIGHT_GREEN.r}, ${BRIGHT_GREEN.g}, ${BRIGHT_GREEN.b}, ${confAlpha})`;
      const confText = ` ${box.confidence.toFixed(2)}`;
      ctx.fillText(
        confText,
        (col1 + labelText.length) * charW,
        (row1 - 1) * charH,
      );

      // Draw interior crosshair markers (sparse)
      if (box.alpha > 0.3) {
        const centerCol = Math.floor((col1 + col2) / 2);
        const centerRow = Math.floor((row1 + row2) / 2);
        ctx.fillStyle = `rgba(${g.r}, ${g.g}, ${g.b}, ${baseAlpha * 0.25})`;
        ctx.fillText("+", centerCol * charW, centerRow * charH);

        // Small corner ticks inside
        if (col2 - col1 > 6 && row2 - row1 > 4) {
          ctx.fillText("\u2574", (col1 + 2) * charW, (row1 + 2) * charH);
          ctx.fillText("\u2574", (col2 - 2) * charW, (row2 - 2) * charH);
        }
      }
    },
    [opacity],
  );

  /* ---------- Main effect ---------- */

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cols = 0;
    let rows = 0;
    let charW = 0;
    let charH = 0;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      const w = rect?.width ?? window.innerWidth;
      const h = rect?.height ?? 400;

      canvas.width = w;
      canvas.height = h;

      // Measure character dimensions
      ctx.font = `${FONT_SIZE}px "JetBrains Mono", "Fira Code", monospace`;
      const metrics = ctx.measureText("M");
      charW = metrics.width;
      charH = FONT_SIZE * 1.4;

      cols = Math.floor(w / charW);
      rows = Math.floor(h / charH);

      // Rebuild dot matrix cache
      dotMatrixCacheRef.current = buildDotMatrix(cols, rows);
    };

    resize();

    // Initialize boxes
    boxesRef.current = Array.from({ length: NUM_BOXES }, () => {
      const box = createBox();
      // Stagger initial phases
      box.phase = Math.floor(Math.random() * 4);
      box.phaseProgress = Math.random();
      return box;
    });

    const resizeObserver = new ResizeObserver(() => resize());
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    /* ----- Static frame for reduced motion ----- */

    if (prefersReducedMotion) {
      // Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${FONT_SIZE}px "JetBrains Mono", "Fira Code", monospace`;

      // Draw dot matrix
      ctx.fillStyle = `rgba(${ACCENT_GREEN.r}, ${ACCENT_GREEN.g}, ${ACCENT_GREEN.b}, ${opacity * 0.15})`;
      const matrix = dotMatrixCacheRef.current;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (matrix[r]?.[c] && matrix[r][c] !== " ") {
            ctx.fillText(matrix[r][c], c * charW, r * charH);
          }
        }
      }

      // Draw static boxes
      boxesRef.current.forEach((box) => {
        box.alpha = 0.5;
        box.phase = 1;
        drawBox(ctx, box, canvas.width, canvas.height, charW, charH);
      });

      return () => {
        resizeObserver.disconnect();
      };
    }

    /* ----- Animation loop ----- */

    const animate = (timestamp: number) => {
      // FPS throttling
      const elapsed = timestamp - lastFrameTimeRef.current;
      if (elapsed < TARGET_FRAME_TIME) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const dt = Math.min(elapsed / 1000, 0.1); // delta in seconds, capped
      lastFrameTimeRef.current = timestamp - (elapsed % TARGET_FRAME_TIME);
      timeRef.current += dt;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${FONT_SIZE}px "JetBrains Mono", "Fira Code", monospace`;

      // Draw dot matrix background
      ctx.fillStyle = `rgba(${ACCENT_GREEN.r}, ${ACCENT_GREEN.g}, ${ACCENT_GREEN.b}, ${opacity * 0.1})`;
      const matrix = dotMatrixCacheRef.current;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (matrix[r]?.[c] && matrix[r][c] !== " ") {
            ctx.fillText(matrix[r][c], c * charW, r * charH);
          }
        }
      }

      // Occasionally flicker a random dot
      if (Math.random() < 0.3 && cols > 0 && rows > 0) {
        const fc = Math.floor(Math.random() * cols);
        const fr = Math.floor(Math.random() * rows);
        ctx.fillStyle = `rgba(${BRIGHT_GREEN.r}, ${BRIGHT_GREEN.g}, ${BRIGHT_GREEN.b}, ${opacity * 0.3})`;
        ctx.fillText(BOX_CHARS.dot, fc * charW, fr * charH);
      }

      // Draw scan line
      const scanRow = Math.floor(
        ((timeRef.current * 0.3) % 1) * rows,
      );
      ctx.fillStyle = `rgba(${ACCENT_GREEN.r}, ${ACCENT_GREEN.g}, ${ACCENT_GREEN.b}, ${opacity * 0.06})`;
      ctx.fillRect(0, scanRow * charH - charH * 0.5, canvas.width, charH);

      // Update and draw bounding boxes
      for (const box of boxesRef.current) {
        // Advance phase progress
        box.phaseProgress += dt / box.phaseDuration;

        if (box.phaseProgress >= 1) {
          box.phaseProgress = 0;

          switch (box.phase) {
            case 0: // fade in -> hold
              box.phase = 1;
              box.phaseDuration = randomRange(2.5, 5.0);
              break;
            case 1: // hold -> fade out
              box.phase = 2;
              box.phaseDuration = randomRange(0.5, 1.0);
              break;
            case 2: // fade out -> dormant
              box.phase = 3;
              box.phaseDuration = randomRange(0.3, 1.0);
              break;
            case 3: {
              // dormant -> new position, fade in
              const target = generateBoxTarget();
              box.targetX = target.targetX;
              box.targetY = target.targetY;
              box.targetW = target.targetW;
              box.targetH = target.targetH;
              box.label = LABELS[Math.floor(Math.random() * LABELS.length)];
              box.confidence = parseFloat(randomRange(0.78, 0.99).toFixed(2));
              box.hueShift = Math.random();
              box.phase = 0;
              box.phaseDuration = randomRange(0.6, 1.2);
              break;
            }
          }
        }

        // Compute alpha based on phase
        switch (box.phase) {
          case 0: // fade in
            box.alpha = easeInOutCubic(box.phaseProgress);
            break;
          case 1: // hold -- slight pulse
            box.alpha =
              0.85 + 0.15 * Math.sin(timeRef.current * 2 + box.hueShift * 6);
            break;
          case 2: // fade out
            box.alpha = 1 - easeInOutCubic(box.phaseProgress);
            break;
          case 3: // dormant
            box.alpha = 0;
            break;
        }

        // Smoothly interpolate position toward target
        const lerpSpeed = dt * 1.5;
        box.x = lerp(box.x, box.targetX, lerpSpeed);
        box.y = lerp(box.y, box.targetY, lerpSpeed);
        box.w = lerp(box.w, box.targetW, lerpSpeed);
        box.h = lerp(box.h, box.targetH, lerpSpeed);

        // During hold phase, slowly drift target
        if (box.phase === 1 && Math.random() < 0.01) {
          box.targetX += randomRange(-0.03, 0.03);
          box.targetY += randomRange(-0.03, 0.03);
          box.targetX = Math.max(0.02, Math.min(0.95 - box.w, box.targetX));
          box.targetY = Math.max(0.02, Math.min(0.95 - box.h, box.targetY));
        }

        drawBox(ctx, box, canvas.width, canvas.height, charW, charH);
      }

      // Draw status line at bottom
      ctx.fillStyle = `rgba(${ACCENT_GREEN.r}, ${ACCENT_GREEN.g}, ${ACCENT_GREEN.b}, ${opacity * 0.25})`;
      const activeCount = boxesRef.current.filter(
        (b) => b.phase === 0 || b.phase === 1,
      ).length;
      const statusText = `> annotations: ${activeCount}/${NUM_BOXES}  |  frame: ${Math.floor(timeRef.current * TARGET_FPS)}  |  mode: auto`;
      ctx.fillText(statusText, charW, (rows - 1) * charH);

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
      resizeObserver.disconnect();
    };
  }, [
    FONT_SIZE,
    NUM_BOXES,
    TARGET_FRAME_TIME,
    opacity,
    prefersReducedMotion,
    buildDotMatrix,
    drawBox,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}
