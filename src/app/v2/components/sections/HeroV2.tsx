"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const ShaderCanvas = dynamic(
  () => import("shaders/react").then((mod) => {
    const { Shader, DotGrid } = mod;
    const ShaderDotGrid = () => (
      <Shader>
        <DotGrid />
      </Shader>
    );
    ShaderDotGrid.displayName = "ShaderDotGrid";
    return ShaderDotGrid;
  }),
  { ssr: false }
);

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
        end: Math.round((i / chars.length) * (totalFrames - waveWidth)) + waveWidth,
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
              q.current = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
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

export default function HeroV2() {
  const reducedMotion = useReducedMotion();
  const headline = useTextScramble(
    "The training data catalog for physical AI.",
    300,
    1400
  );

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0908]"
    >
      {/* Video background */}
      {!reducedMotion ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero-poster.webp"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source
            src="/videos/hero-desktop.mp4"
            type="video/mp4"
          />
        </video>
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/images/hero-poster.webp)" }}
        />
      )}

      {/* Dark gradient overlay - stronger for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0908]/90 via-[#0a0908]/60 to-[#0a0908]/80" />

      {/* DotGrid shader overlay */}
      {!reducedMotion && (
        <div className="pointer-events-none absolute inset-0 opacity-15">
          <ShaderCanvas />
        </div>
      )}

      {/* Bottom gradient fade into next section */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />

      {/* Content */}
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

        {/* Headline — MASSIVE */}
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
          transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          3.7M+ human annotations across real-world video, game environments, and
          custom captures. Built for teams training robotics and embodied AI models.
        </motion.p>

        {/* Stats bar */}
        <motion.div
          className="mx-auto mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-3"
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
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
          transition={{ delay: 2.0, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
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
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          >
            <div className="h-1.5 w-1 rounded-full bg-white/30" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
