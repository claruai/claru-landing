"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const views = [
  { label: "RGB", color: "#e8e8e8", desc: "Source frame" },
  { label: "Depth", color: "#4A9EDE", desc: "Distance map" },
  { label: "Object IDs", color: "#9E6ADE", desc: "Instance masks" },
  { label: "Physics State", color: "#DE8A4A", desc: "Forces & velocity" },
];

export default function GameCapture() {
  const reducedMotion = useReducedMotion();
  const [showAnnotated, setShowAnnotated] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;
    const interval = setInterval(() => {
      setShowAnnotated((prev) => !prev);
    }, 4000);
    return () => clearInterval(interval);
  }, [reducedMotion]);

  return (
    <section
      id="game-capture"
      className="relative overflow-hidden bg-[var(--bg-primary)] py-32 md:py-40"
    >
      {/* Subtle gradient band */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-secondary)]/30 via-transparent to-transparent" />

      <div className="container relative mx-auto px-6">
        <motion.div
          className="mb-16"
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="v2-section-label mb-6">
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--accent-primary)]">
              {"// GAME CAPTURE"}
            </span>
          </div>
          <h2 className="max-w-lg text-3xl font-bold leading-[1.1] tracking-[-0.02em] text-white md:text-4xl lg:text-[42px]">
            Pixel-perfect ground truth{" "}
            <span className="text-white/40">from game engines.</span>
          </h2>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: game clip with toggle */}
          <motion.div
            className="v2-scanline group relative overflow-hidden !rounded-2xl border border-[var(--border-subtle)]"
            style={{ background: "linear-gradient(165deg, #121110 0%, #0e0d0c 100%)" }}
            initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Terminal bar */}
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)" }}>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#ff5f57]" />
                <div className="h-2 w-2 rounded-full bg-[#febc2e]" />
                <div className="h-2 w-2 rounded-full bg-[#28c840]" />
              </div>
              <span className="font-mono text-[10px] text-white/30">
                game-capture-viewer
              </span>
              <div className="flex items-center gap-1.5">
                <div className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${showAnnotated ? "bg-[var(--accent-primary)]" : "bg-white/20"}`} />
                <span className="font-mono text-[10px] text-white/30">
                  {showAnnotated ? "ENRICHED" : "RAW"}
                </span>
              </div>
            </div>

            <div className="flex aspect-video items-center justify-center p-8">
              <AnimatePresence mode="wait">
                {showAnnotated ? (
                  <motion.div
                    key="annotated"
                    initial={reducedMotion ? {} : { opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reducedMotion ? {} : { opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <div className="mb-3 flex items-center justify-center gap-3">
                      {["#4A9EDE", "#9E6ADE", "#DE8A4A"].map((color) => (
                        <div
                          key={color}
                          className="h-2 w-8 rounded-full"
                          style={{ backgroundColor: color, opacity: 0.6 }}
                        />
                      ))}
                    </div>
                    <span className="font-mono text-sm font-medium text-[var(--accent-primary)]">
                      ANNOTATED VIEW
                    </span>
                    <div className="mt-2 font-mono text-[11px] text-white/30">
                      Depth + Object IDs + Physics State
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="raw"
                    initial={reducedMotion ? {} : { opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reducedMotion ? {} : { opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <span className="font-mono text-sm text-white/50">
                      RAW GAME FOOTAGE
                    </span>
                    <div className="mt-2 font-mono text-[11px] text-white/20">
                      No annotation required
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Progress indicator */}
            <div className="absolute bottom-0 left-0 right-0 z-10 h-0.5 bg-white/[0.04]">
              <motion.div
                className="h-full bg-[var(--accent-primary)]/40"
                key={showAnnotated ? "a" : "b"}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 4, ease: "linear" }}
              />
            </div>
          </motion.div>

          {/* Right: 2x2 grid */}
          <div className="grid grid-cols-2 gap-4">
            {views.map((view, i) => (
              <motion.div
                key={view.label}
                initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="group/card flex flex-col items-center justify-center rounded-2xl border transition-all duration-400 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
                style={{
                  borderColor: `${view.color}12`,
                  aspectRatio: "16/10",
                  background: `linear-gradient(165deg, #121110 0%, ${view.color}04 100%)`,
                }}
              >
                <div
                  className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-400 group-hover/card:scale-110 group-hover/card:shadow-[0_0_20px_currentColor]"
                  style={{
                    borderColor: `${view.color}20`,
                    backgroundColor: `${view.color}08`,
                    color: `${view.color}15`,
                  }}
                >
                  <span
                    className="font-mono text-base font-bold"
                    style={{ color: view.color }}
                  >
                    {view.label.charAt(0)}
                  </span>
                </div>
                <span
                  className="font-mono text-xs font-medium tracking-wide"
                  style={{ color: view.color }}
                >
                  {view.label}
                </span>
                <span className="mt-1.5 font-mono text-[10px] text-white/20">
                  {view.desc}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Copy */}
        <motion.div
          className="mt-14 max-w-2xl"
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <p className="text-[15px] leading-relaxed text-white/50">
            Game engines give us what cameras can&apos;t: pixel-perfect ground
            truth. The engine exports per-object identity masks, per-pixel depth,
            and per-frame physics state. Zero manual annotation required.
          </p>

          {/* Stats */}
          <div className="mt-8 flex flex-wrap gap-10">
            {[
              { value: "~66K", label: "clips" },
              { value: "Pixel-perfect", label: "ground truth" },
              { value: "Zero", label: "annotation cost" },
            ].map((stat) => (
              <div key={stat.label}>
                <span className="font-mono text-lg font-bold text-[var(--accent-primary)]">{stat.value}</span>
                <span className="ml-2 font-mono text-xs text-white/35">{stat.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Unique differentiator callout */}
        <motion.div
          className="mt-12 overflow-hidden rounded-2xl border border-[var(--accent-primary)]/15 bg-[var(--accent-primary)]/[0.02]"
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex items-center gap-5 px-7 py-6">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--accent-primary)]/25 bg-[var(--accent-primary)]/8">
              <span className="font-mono text-sm font-bold text-[var(--accent-primary)]">!</span>
            </div>
            <div>
              <p className="font-mono text-sm font-semibold text-[var(--accent-primary)]">
                Unique to Claru
              </p>
              <p className="mt-1 text-sm text-white/35">
                Game environment data with engine-level ground truth. We haven&apos;t seen this in another commercial catalog.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
