"use client";

import { useEffect, useRef } from "react";

/**
 * Contained Matrix Rain effect that sizes itself to a parent container
 * (absolute-positioned) rather than the full viewport. Designed for use
 * within a section that has `position: relative; overflow: hidden`.
 *
 * Enhanced: denser columns, brighter heads, wider character spread,
 * characters extend far beyond any overlay to fill the entire space.
 */

const MATRIX_CHARS =
  "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
const ASCII_CHARS = ".,:;i1tfLCG08@#{}[]<>/*+-=~^%$&|\\";

interface ContainedMatrixRainProps {
  className?: string;
  density?: number;
  speed?: number;
  opacity?: number;
}

export default function ContainedMatrixRain({
  className = "",
  density = 0.4,
  speed = 1,
  opacity = 0.6,
}: ContainedMatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);
  const dropsRef = useRef<
    { y: number; speed: number; length: number; active: boolean; phase: number }[]
  >([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const isMobile = window.innerWidth < 768;
    const fontSize = isMobile ? 14 : 12; // Smaller font = denser characters
    const targetFrameTime = isMobile ? 67 : 33;
    const colWidth = fontSize * 0.6; // Tighter column spacing

    let cols = 0;
    let rows = 0;

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      cols = Math.floor(canvas.width / colWidth);
      rows = Math.floor(canvas.height / fontSize);

      // Initialize drops -- more columns, higher activation rate
      dropsRef.current = Array(cols)
        .fill(null)
        .map(() => ({
          y: Math.random() * -50,
          speed: 0.2 + Math.random() * 0.6,
          length: 8 + Math.floor(Math.random() * 22), // Longer trails
          active: Math.random() < density,
          phase: Math.random() * Math.PI * 2, // For brightness pulsing
        }));
    };

    resize();

    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(parent);

    const animate = (timestamp: number) => {
      const elapsed = timestamp - lastFrameTimeRef.current;
      if (elapsed < targetFrameTime) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTimeRef.current = timestamp - (elapsed % targetFrameTime);

      // Fade trail -- slightly slower fade for richer trails
      ctx.fillStyle = "rgba(10, 9, 8, 0.04)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      const time = timestamp * 0.001;

      for (let i = 0; i < dropsRef.current.length; i++) {
        const drop = dropsRef.current[i];
        if (!drop.active) continue;

        const x = i * colWidth;

        for (let j = 0; j < drop.length; j++) {
          const trailY = drop.y - j;
          if (trailY < 0 || trailY > rows) continue;

          const y = trailY * fontSize;
          const trailFade = 1 - j / drop.length;
          const alpha = opacity * trailFade;

          // Brightness pulse based on phase
          const pulse = 0.85 + 0.15 * Math.sin(time * 2 + drop.phase + j * 0.3);

          if (j === 0) {
            // Head character -- bright white-green
            ctx.fillStyle = `rgba(180, 255, 180, ${alpha * pulse})`;
          } else if (j < 2) {
            // Near-head -- bright sage
            ctx.fillStyle = `rgba(160, 220, 160, ${alpha * 0.9 * pulse})`;
          } else if (j < 5) {
            // Body -- sage green
            ctx.fillStyle = `rgba(146, 200, 144, ${alpha * 0.7 * pulse})`;
          } else {
            // Tail -- dim sage
            ctx.fillStyle = `rgba(146, 176, 144, ${alpha * 0.4 * pulse})`;
          }

          const charSet = Math.random() < 0.3 ? MATRIX_CHARS : ASCII_CHARS;
          const char = charSet[Math.floor(Math.random() * charSet.length)];
          ctx.fillText(char, x, y);
        }

        drop.y += drop.speed * speed;

        if (drop.y - drop.length > rows) {
          drop.y = Math.random() * -20;
          drop.speed = 0.2 + Math.random() * 0.6;
          drop.length = 8 + Math.floor(Math.random() * 22);
          drop.active = Math.random() < density;
          drop.phase = Math.random() * Math.PI * 2;
        }
      }

      // Reactivate inactive drops more aggressively
      if (Math.random() < 0.06) {
        const inactiveDrops = dropsRef.current.filter((d) => !d.active);
        if (inactiveDrops.length > 0) {
          const count = Math.min(3, inactiveDrops.length);
          for (let k = 0; k < count; k++) {
            const randomDrop =
              inactiveDrops[Math.floor(Math.random() * inactiveDrops.length)];
            randomDrop.active = true;
            randomDrop.y = -5;
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
      resizeObserver.disconnect();
    };
  }, [density, speed, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
    />
  );
}
