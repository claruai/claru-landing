"use client";

import { useEffect, useRef } from "react";

/**
 * Contained Matrix Rain effect that sizes itself to a parent container
 * (absolute-positioned) rather than the full viewport. Designed for use
 * within a section that has `position: relative; overflow: hidden`.
 */

const MATRIX_CHARS =
  "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
const ASCII_CHARS = ".,:;i1tfLCG08@#";

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
    { y: number; speed: number; length: number; active: boolean }[]
  >([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const isMobile = window.innerWidth < 768;
    const fontSize = isMobile ? 16 : 14;
    const targetFrameTime = isMobile ? 67 : 33;

    let cols = 0;
    let rows = 0;

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      cols = Math.floor(canvas.width / (fontSize * 0.7));
      rows = Math.floor(canvas.height / fontSize);

      // Initialize drops
      dropsRef.current = Array(cols)
        .fill(null)
        .map(() => ({
          y: Math.random() * -50,
          speed: 0.3 + Math.random() * 0.5,
          length: 5 + Math.floor(Math.random() * 15),
          active: Math.random() < density,
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

      // Fade trail
      ctx.fillStyle = "rgba(10, 9, 8, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      for (let i = 0; i < dropsRef.current.length; i++) {
        const drop = dropsRef.current[i];
        if (!drop.active) continue;

        const x = i * fontSize * 0.7;

        for (let j = 0; j < drop.length; j++) {
          const trailY = drop.y - j;
          if (trailY < 0 || trailY > rows) continue;

          const y = trailY * fontSize;
          const trailFade = 1 - j / drop.length;
          const alpha = opacity * trailFade;

          if (j === 0) {
            ctx.fillStyle = `rgba(146, 255, 144, ${alpha})`;
          } else if (j < 3) {
            ctx.fillStyle = `rgba(146, 200, 144, ${alpha * 0.8})`;
          } else {
            ctx.fillStyle = `rgba(146, 176, 144, ${alpha * 0.5})`;
          }

          const charSet = Math.random() < 0.3 ? MATRIX_CHARS : ASCII_CHARS;
          const char = charSet[Math.floor(Math.random() * charSet.length)];
          ctx.fillText(char, x, y);
        }

        drop.y += drop.speed * speed;

        if (drop.y - drop.length > rows) {
          drop.y = Math.random() * -20;
          drop.speed = 0.3 + Math.random() * 0.5;
          drop.length = 5 + Math.floor(Math.random() * 15);
          drop.active = Math.random() < density;
        }
      }

      if (Math.random() < 0.02) {
        const inactiveDrops = dropsRef.current.filter((d) => !d.active);
        if (inactiveDrops.length > 0) {
          const randomDrop =
            inactiveDrops[Math.floor(Math.random() * inactiveDrops.length)];
          randomDrop.active = true;
          randomDrop.y = -5;
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
