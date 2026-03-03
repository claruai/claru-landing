"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useDeviceCapability } from "@/app/hooks/useDeviceCapability";

interface TextScrambleProps {
  text: string;
  className?: string;
  scrambleOnHover?: boolean;
  autoPlay?: boolean;
  delay?: number;
  duration?: number;
  characters?: string;
}

export default function TextScramble({
  text,
  className = "",
  scrambleOnHover = true,
  autoPlay = false,
  delay = 0,
  duration = 1000,
  characters = "!<>-_\\/[]{}=+*^?#________",
}: TextScrambleProps) {
  const { prefersReducedMotion } = useDeviceCapability();
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const frameRef = useRef<number | null>(null);
  const queueRef = useRef<
    { from: string; to: string; start: number; end: number; char?: string }[]
  >([]);

  const randomChar = useCallback(
    () => characters[Math.floor(Math.random() * characters.length)],
    [characters],
  );

  const scramble = useCallback(() => {
    // Skip animation when reduced motion is preferred
    if (prefersReducedMotion) {
      setDisplayText(text);
      return;
    }
    if (isScrambling) return;
    setIsScrambling(true);

    const newText = text;
    const length = newText.length;
    const queue: typeof queueRef.current = [];

    // Wave effect: characters scramble in a left-to-right sweep
    // rather than all at once. Each char gets a narrow scramble window.
    const totalFrames = Math.round((duration / 1000) * 30); // 30fps for calmer feel
    const waveWidth = Math.max(6, Math.round(totalFrames * 0.15)); // how many frames each char scrambles for

    for (let i = 0; i < length; i++) {
      const to = newText[i] || "";
      // Stagger start across the text length so it sweeps left to right
      const start = Math.round((i / length) * (totalFrames - waveWidth));
      const end = start + waveWidth;
      queue.push({ from: to, to, start, end });
    }

    queueRef.current = queue;
    let frame = 0;
    // Throttle to ~30fps for a calmer pace
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

      for (let i = 0; i < queueRef.current.length; i++) {
        const { to, start, end } = queueRef.current[i];
        let char = queueRef.current[i].char;

        if (frame >= end) {
          complete++;
          output += to;
        } else if (frame >= start) {
          // Lower probability = less flickering per frame
          if (!char || Math.random() < 0.18) {
            char = randomChar();
            queueRef.current[i].char = char;
          }
          output += `<span class="text-[var(--accent-primary)]">${char}</span>`;
        } else {
          output += to; // Show real character before the wave reaches it
        }
      }

      setDisplayText(output);

      if (complete === queueRef.current.length) {
        setDisplayText(text);
        setIsScrambling(false);
        if (frameRef.current) {
          cancelAnimationFrame(frameRef.current);
        }
      } else {
        frameRef.current = requestAnimationFrame(update);
        frame++;
      }
    };

    frameRef.current = requestAnimationFrame(update);
  }, [displayText, text, randomChar, isScrambling, prefersReducedMotion, duration]);

  useEffect(() => {
    if (autoPlay) {
      const timer = setTimeout(scramble, delay);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, delay, scramble]);

  useEffect(() => {
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (scrambleOnHover) {
      scramble();
    }
  };

  return (
    <span
      className={`font-mono ${className}`}
      onMouseEnter={handleMouseEnter}
      dangerouslySetInnerHTML={{ __html: displayText }}
    />
  );
}

// Split text animation for headlines
interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  type?: "chars" | "words" | "lines";
}

export function SplitText({
  text,
  className = "",
  delay = 0,
  stagger = 0.03,
  type = "chars",
}: SplitTextProps) {
  const items =
    type === "chars"
      ? text.split("")
      : type === "words"
        ? text.split(" ")
        : text.split("\n");

  return (
    <span className={className}>
      {items.map((item, index) => (
        <motion.span
          key={index}
          className="inline-block"
          initial={{ opacity: 0, y: 50, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.8,
            delay: delay + index * stagger,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {item === " " ? "\u00A0" : item}
          {type === "words" && index < items.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </span>
  );
}

// Glitch text effect
interface GlitchTextProps {
  text: string;
  className?: string;
  glitchOnHover?: boolean;
  intensity?: number;
}

export function GlitchText({
  text,
  className = "",
  glitchOnHover = true,
  intensity = 1,
}: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);

  return (
    <span
      className={`relative inline-block ${className}`}
      onMouseEnter={() => glitchOnHover && setIsGlitching(true)}
      onMouseLeave={() => setIsGlitching(false)}
      style={
        {
          "--glitch-intensity": intensity,
        } as React.CSSProperties
      }
    >
      <span className="relative z-10">{text}</span>
      {isGlitching && (
        <>
          <span
            className="absolute top-0 left-0 text-[#ff0000] opacity-80 animate-glitch-1"
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)",
            }}
            aria-hidden="true"
          >
            {text}
          </span>
          <span
            className="absolute top-0 left-0 text-[#00ffff] opacity-80 animate-glitch-2"
            style={{
              clipPath: "polygon(0 55%, 100% 55%, 100% 100%, 0 100%)",
            }}
            aria-hidden="true"
          >
            {text}
          </span>
        </>
      )}
    </span>
  );
}
