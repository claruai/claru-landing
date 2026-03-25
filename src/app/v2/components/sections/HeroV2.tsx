"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const DotGrid = dynamic(
  () => import("shaders/react").then((mod) => mod.DotGrid),
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
            src="/images/hero-poster.webp"
            media="(max-width: 768px)"
            type="video/webm"
          />
          <source
            src="/images/hero-poster.webp"
            type="video/webm"
          />
        </video>
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/images/hero-poster.webp)" }}
        />
      )}

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0908]/80 via-[#0a0908]/40 to-transparent" />

      {/* DotGrid shader overlay */}
      {!reducedMotion && (
        <div className="pointer-events-none absolute inset-0 opacity-15">
          <DotGrid />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        {/* Headline */}
        <h1
          className="font-sans text-[40px] font-bold leading-tight text-white md:text-[72px]"
          aria-label="The training data catalog for physical AI."
        >
          {headline}
        </h1>

        {/* Subheadline */}
        <motion.p
          className="mx-auto mt-6 max-w-2xl text-base text-white/80 md:text-xl"
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          Curated video datasets with depth, pose, and segmentation — built for
          robotics and embodied AI teams. Download, load, train.
        </motion.p>

        {/* Stats bar */}
        <motion.p
          className="mx-auto mt-8 max-w-3xl font-mono text-sm text-[var(--accent-primary)]"
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          3.7M+ annotations across kitchens, warehouses, roads, and game
          environments · 25+ licensed datasets · Depth + pose + segmentation on
          every clip
        </motion.p>

        {/* Trust signal */}
        <motion.p
          className="mt-4 font-mono text-sm text-white/60"
          initial={reducedMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          Commercially licensed. Not scraped. Not synthetic.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center rounded-md bg-[var(--accent-primary)] px-8 py-3.5 font-medium text-[#0a0908] transition-all hover:brightness-110 hover:shadow-[0_0_20px_var(--accent-glow-strong)]"
          >
            Browse the Catalog
          </Link>
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-md border border-white/20 px-8 py-3.5 font-medium text-white transition-all hover:border-white/40 hover:bg-white/5"
          >
            Request Custom Collection
          </a>
        </motion.div>
      </div>
    </section>
  );
}
