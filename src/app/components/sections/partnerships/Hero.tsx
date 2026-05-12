"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const HERO_VIDEO_SRC = "/videos/hero/workforce-warp-v8.mp4";

const STATS = [
  { value: "100+", label: "partners already shipping data" },
  { value: "Net-15", label: "paid on signed license" },
  { value: "Weekly", label: "payouts for active capture" },
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !videoWrapRef.current) return;
    const ctx = gsap.context(() => {
      // slow ken-burns drift, infinite yoyo
      gsap.to(videoWrapRef.current, {
        scale: 1.1,
        xPercent: -2,
        duration: 24,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      // scroll parallax — wrap drifts down as you scroll past
      gsap.to(videoWrapRef.current, {
        yPercent: 18,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden min-h-[100svh] md:min-h-[760px] md:h-screen border-b border-[var(--border-subtle)]"
    >
      {/* video layer */}
      <div
        ref={videoWrapRef}
        className="absolute inset-0 will-change-transform"
        style={{ transform: "scale(1.04)" }}
      >
        <video
          src={HERO_VIDEO_SRC}
          poster="/videos/hero/workforce-warp-v8.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
          style={{
            filter:
              "saturate(0.55) contrast(1.08) brightness(0.85) hue-rotate(-4deg)",
          }}
        />
      </div>

      {/* sage tint */}
      <div
        className="pointer-events-none absolute inset-0 mix-blend-multiply"
        style={{
          background:
            "linear-gradient(180deg, rgba(146,176,144,0.06) 0%, rgba(10,9,8,0.40) 100%)",
        }}
      />

      {/* edge vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 110% 110% at 50% 50%, transparent 30%, rgba(10,9,8,0.55) 75%, rgba(10,9,8,0.85) 100%)",
        }}
      />

      {/* focused text scrim */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 45% at 50% 48%, rgba(10,9,8,0.7) 0%, rgba(10,9,8,0.45) 50%, transparent 100%)",
        }}
      />

      {/* scanlines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 3px)",
        }}
      />

      {/* film grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='0.6'/></svg>\")",
          backgroundSize: "160px 160px",
        }}
      />

      {/* HUD: bottom-left compilation tag (md+ only) */}
      <div className="hidden md:block absolute bottom-6 left-10 z-10 font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
        ◉ TRACK · ANON · NO_PII
      </div>

      {/* hero copy */}
      <div className="relative z-10 flex h-full min-h-[inherit] items-center pt-20 pb-12 md:py-0">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <motion.h1
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-5 md:mb-6 text-white"
              style={{
                textShadow: "0 2px 40px rgba(10,9,8,0.85)",
              }}
            >
              Your team already makes the data AI labs are paying for.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base sm:text-lg md:text-xl text-white/85 leading-relaxed max-w-2xl mx-auto mb-7 md:mb-10"
              style={{ textShadow: "0 2px 24px rgba(10,9,8,0.85)" }}
            >
              Frontier labs pay for footage of real work in real environments —
              kitchens, lines, floors, fields, bays, registers. We license what
              you&apos;ve already recorded, send cameras and pay you to capture
              more, or run capture with our workforce inside yours.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-10 md:mb-16"
            >
              <a
                href="#apply"
                className="btn-primary font-mono px-8 py-3 text-sm"
              >
                See if your business qualifies →
              </a>
              <a
                href="mailto:partners@claru.ai"
                className="font-mono text-sm text-white/80 hover:text-[var(--accent-primary)] transition-colors"
              >
                partners@claru.ai
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="grid grid-cols-3 gap-3 sm:gap-6 md:gap-12 max-w-3xl mx-auto pt-6 md:pt-8 border-t border-white/15"
            >
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-xl sm:text-2xl md:text-4xl font-bold text-[var(--accent-primary)] font-mono mb-1.5 md:mb-2">
                    {stat.value}
                  </div>
                  <div className="text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.18em] md:tracking-[0.2em] text-white/60 font-mono leading-tight">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 flex items-center gap-2">
        <span className="block h-px w-8 bg-white/30" />
        SCROLL
        <span className="block h-px w-8 bg-white/30" />
      </div>

      <style jsx>{`
        @keyframes blinkRecHero {
          0%,
          50% {
            opacity: 1;
          }
          51%,
          100% {
            opacity: 0.2;
          }
        }
      `}</style>
    </section>
  );
}
