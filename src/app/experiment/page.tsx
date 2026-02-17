"use client";

import { useEffect, useRef, useState } from "react";

// Multiple character sets for variety
const ASCII_CHARS = " .,:;i1tfLCG08@#";
const GLITCH_CHARS = "!@#$%^&*()_+-=[]{}|;':\",./<>?`~";
const MATRIX_CHARS =
  "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";

export default function ExperimentPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const glitchRef = useRef<number[]>([]);
  const matrixDrops = useRef<number[]>([]);

  // Mouse tracking
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -1000,
    y: -1000,
    active: false,
  });
  const mouseTrailRef = useRef<{ x: number; y: number; age: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Mouse event handlers
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
      // Add to trail
      mouseTrailRef.current.push({
        x: mouseRef.current.x,
        y: mouseRef.current.y,
        age: 0,
      });
      // Keep trail limited
      if (mouseTrailRef.current.length > 20) {
        mouseTrailRef.current.shift();
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const handleMouseEnter = () => {
      mouseRef.current.active = true;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("mouseenter", handleMouseEnter);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "/images/robot-face.webp";

    img.onload = () => {
      setImageLoaded(true);

      const fontSize = 8; // Smaller for more detail
      const cols = Math.floor(canvas.width / (fontSize * 0.6));
      const rows = Math.floor(canvas.height / fontSize);

      // Initialize matrix drops
      matrixDrops.current = Array(cols)
        .fill(0)
        .map(() => Math.random() * rows);

      // Initialize glitch positions
      glitchRef.current = Array(20)
        .fill(0)
        .map(() => Math.floor(Math.random() * rows));

      const offscreen = document.createElement("canvas");
      offscreen.width = cols;
      offscreen.height = rows;
      const offCtx = offscreen.getContext("2d");
      if (!offCtx) return;

      offCtx.drawImage(img, 0, 0, cols, rows);
      const imageData = offCtx.getImageData(0, 0, cols, rows);

      const animate = () => {
        timeRef.current += 0.03;
        const time = timeRef.current;

        // Clear with slight trail effect
        ctx.fillStyle = "rgba(10, 9, 8, 0.15)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

        // Update matrix drops
        for (let i = 0; i < matrixDrops.current.length; i++) {
          matrixDrops.current[i] += 0.3 + Math.random() * 0.2;
          if (matrixDrops.current[i] > rows) {
            matrixDrops.current[i] = -10 - Math.random() * 20;
          }
        }

        // Glitch disabled
        const isGlitching = false;
        const glitchIntensity = 0;
        const horizontalShift = 0;

        for (let y = 0; y < rows; y++) {
          // Check if this row should glitch
          const rowGlitch =
            glitchRef.current.some((gy) => Math.abs(gy - y) < 2) && isGlitching;
          const rowShift = rowGlitch ? horizontalShift : 0;

          for (let x = 0; x < cols; x++) {
            // ROBOT ANIMATION - sample from shifted coordinates
            const centerX = cols / 2;
            const centerY = rows / 2;

            // Breathing/swaying motion
            const breatheX = Math.sin(time * 0.8) * 1.5;
            const breatheY = Math.sin(time * 0.6) * 1.0;

            // Subtle head tilt (rotation around center)
            const tiltAngle = Math.sin(time * 0.4) * 0.02;
            const dx = x - centerX;
            const dy = y - centerY;
            const rotatedX =
              dx * Math.cos(tiltAngle) - dy * Math.sin(tiltAngle);
            const rotatedY =
              dx * Math.sin(tiltAngle) + dy * Math.cos(tiltAngle);

            // Sample coordinates with animation
            let sampleX = Math.round(centerX + rotatedX + breatheX);
            let sampleY = Math.round(centerY + rotatedY + breatheY);

            // Clamp to bounds
            sampleX = Math.max(0, Math.min(cols - 1, sampleX));
            sampleY = Math.max(0, Math.min(rows - 1, sampleY));

            const idx = (sampleY * cols + sampleX) * 4;
            const r = imageData.data[idx];
            const g = imageData.data[idx + 1];
            const b = imageData.data[idx + 2];
            const a = imageData.data[idx + 3];

            if (a < 10) continue; // Skip transparent pixels

            let brightness = (r + g + b) / 3;

            // Heartbeat pulse from center
            const distFromCenter = Math.sqrt(dx * dx + dy * dy);
            const heartbeat = Math.sin(time * 3) > 0.7 ? 20 : 0; // Quick pulse
            const heartbeatInfluence = Math.max(
              0,
              1 - distFromCenter / (rows * 0.3),
            );
            brightness += heartbeat * heartbeatInfluence;

            // Eye glow - brighten the brightest spots rhythmically
            if (brightness > 180) {
              const eyePulse = (Math.sin(time * 2) + 1) * 15;
              brightness = Math.min(255, brightness + eyePulse);
            }

            // Multiple wave effects
            const wave1 = Math.sin(x * 0.1 + time * 2) * 8;
            const wave2 = Math.sin(y * 0.08 + time * 1.5) * 6;
            const wave3 = Math.sin((x + y) * 0.05 + time * 3) * 4;

            // Breathing/pulse effect
            const breathe = Math.sin(time * 0.8) * 15;

            // Ripple from center
            const cx = cols / 2,
              cy = rows / 2;
            const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
            const ripple = Math.sin(dist * 0.3 - time * 4) * 10;

            // Matrix rain influence
            const matrixDrop = matrixDrops.current[x];
            let matrixInfluence = Math.abs(y - matrixDrop) < 5 ? 30 : 0;

            // CURSOR INTERACTION - clear the rain around mouse
            const pixelX = x * fontSize * 0.6;
            const pixelY = y * fontSize;
            const mouseX = mouseRef.current.x;
            const mouseY = mouseRef.current.y;
            const mouseDist = Math.sqrt(
              (pixelX - mouseX) ** 2 + (pixelY - mouseY) ** 2,
            );
            const cursorRadius = 80; // Size of the clearing
            const cursorFalloff = 40; // Soft edge

            // Check trail for extended effect
            let trailInfluence = 0;
            for (const trail of mouseTrailRef.current) {
              const trailDist = Math.sqrt(
                (pixelX - trail.x) ** 2 + (pixelY - trail.y) ** 2,
              );
              if (trailDist < cursorRadius * 0.6) {
                trailInfluence = Math.max(
                  trailInfluence,
                  1 - trailDist / (cursorRadius * 0.6),
                );
              }
            }

            // Cursor clears the matrix rain
            const inCursorZone = mouseDist < cursorRadius + cursorFalloff;
            if (mouseRef.current.active && inCursorZone) {
              // Suppress matrix rain near cursor
              if (mouseDist < cursorRadius) {
                matrixInfluence = 0; // Complete clearing
              } else {
                // Soft falloff
                const falloffFactor =
                  (mouseDist - cursorRadius) / cursorFalloff;
                matrixInfluence *= falloffFactor;
              }
            }

            // Combine all effects
            let adjustedBrightness =
              brightness +
              wave1 +
              wave2 +
              wave3 +
              breathe +
              ripple +
              matrixInfluence;
            adjustedBrightness += glitchIntensity * (Math.random() - 0.5);
            adjustedBrightness = Math.max(0, Math.min(255, adjustedBrightness));

            // Boost brightness near cursor to reveal the image
            if (mouseRef.current.active && mouseDist < cursorRadius) {
              const cursorBoost = (1 - mouseDist / cursorRadius) * 40;
              adjustedBrightness = Math.min(
                255,
                adjustedBrightness + cursorBoost,
              );
            }
            // Trail also slightly reveals
            if (trailInfluence > 0) {
              adjustedBrightness = Math.min(
                255,
                adjustedBrightness + trailInfluence * 20,
              );
            }

            // Character selection
            let char: string;
            const charSet = rowGlitch
              ? GLITCH_CHARS
              : matrixInfluence > 0 && Math.random() < 0.3
                ? MATRIX_CHARS
                : ASCII_CHARS;

            // Random character variation for movement feel
            const charVariation =
              Math.random() < 0.02 ? Math.floor(Math.random() * 3) - 1 : 0;
            let charIndex = Math.floor(
              (adjustedBrightness / 255) * (ASCII_CHARS.length - 1),
            );
            charIndex = Math.max(
              0,
              Math.min(ASCII_CHARS.length - 1, charIndex + charVariation),
            );

            if (charSet === ASCII_CHARS) {
              char = ASCII_CHARS[charIndex];
            } else {
              char = charSet[Math.floor(Math.random() * charSet.length)];
            }

            // Skip spaces for performance
            if (char === " " && adjustedBrightness < 30) continue;

            // Dynamic coloring
            const baseHue = 100; // Sage green
            const hueShift = Math.sin(x * 0.02 + y * 0.02 + time) * 30;
            const hue = rowGlitch
              ? 0 // Red for glitch
              : matrixInfluence > 0
                ? 120 // Bright green for matrix
                : baseHue + hueShift;

            const saturation = rowGlitch
              ? 100
              : matrixInfluence > 0
                ? 80
                : 25 + Math.sin(time + x * 0.1) * 15;

            // Highlight edges and bright areas
            const isEdge = brightness > 100 && brightness < 180;
            const lightness =
              matrixInfluence > 0
                ? 70
                : isEdge
                  ? (adjustedBrightness / 255) * 50 + 30
                  : (adjustedBrightness / 255) * 55 + 15;

            // Alpha variation for depth
            const alpha = 0.7 + (adjustedBrightness / 255) * 0.3;

            ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
            ctx.fillText(char, x * fontSize * 0.6 + rowShift, y * fontSize);

            // Occasional bright sparkle
            if (Math.random() < 0.0005 && brightness > 100) {
              ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
              ctx.fillText("*", x * fontSize * 0.6, y * fontSize);
            }
          }
        }

        // Moving scanlines
        const scanlineOffset = (time * 50) % canvas.height;
        ctx.fillStyle = "rgba(146, 176, 144, 0.03)";
        for (let y = scanlineOffset; y < canvas.height; y += 4) {
          ctx.fillRect(0, y, canvas.width, 1);
        }

        // Age and clean up trail
        mouseTrailRef.current = mouseTrailRef.current
          .map((t) => ({ ...t, age: t.age + 1 }))
          .filter((t) => t.age < 30);

        // Vignette effect
        const gradient = ctx.createRadialGradient(
          canvas.width / 2,
          canvas.height / 2,
          canvas.height * 0.3,
          canvas.width / 2,
          canvas.height / 2,
          canvas.height * 0.8,
        );
        gradient.addColorStop(0, "rgba(0,0,0,0)");
        gradient.addColorStop(1, "rgba(0,0,0,0.4)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        animationRef.current = requestAnimationFrame(animate);
      };

      animate();
    };

    img.onerror = () => {
      setImageLoaded(true);
      console.error("Failed to load image");
    };

    return () => {
      cancelAnimationFrame(animationRef.current);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0908] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[#92B090]/20">
        <h1 className="text-xl font-mono text-[#92B090]">
          ASCII Robot Experiment
        </h1>
        <p className="text-sm text-white/60 font-mono">
          {imageLoaded ? "Rendering with motion effects..." : "Loading..."}
        </p>
      </div>

      {/* Canvas - vertical format */}
      <div className="flex-1 flex items-center justify-center p-4">
        <canvas
          ref={canvasRef}
          width={500}
          height={700}
          className="border border-[#92B090]/30 rounded-lg shadow-2xl shadow-[#92B090]/10"
        />
      </div>

      {/* Info */}
      <div className="p-4 border-t border-[#92B090]/20 font-mono text-xs text-white/40 text-center">
        <p>
          <span className="text-[#92B090]">Move cursor to part the rain</span>
          {" • "}Wave distortion • Matrix rain • Pulse • Sparkles
        </p>
      </div>
    </div>
  );
}
