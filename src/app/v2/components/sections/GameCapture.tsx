"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const views = [
  { label: "RGB", color: "#e8e8e8" },
  { label: "Depth", color: "#4A9EDE" },
  { label: "Object IDs", color: "#9E6ADE" },
  { label: "Physics State", color: "#DE8A4A" },
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
      className="relative overflow-hidden bg-[var(--bg-primary)] py-24"
    >
      {/* Full-bleed dark bg with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-secondary)] via-[var(--bg-primary)] to-[var(--bg-primary)]" />

      <div className="container relative mx-auto px-6">
        <span className="mb-8 block font-mono text-sm text-[var(--accent-primary)]">
          {"// GAME CAPTURE"}
        </span>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: game clip */}
          <div className="relative overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)]">
            <div className="flex aspect-video items-center justify-center p-8">
              <AnimatePresence mode="wait">
                {showAnnotated ? (
                  <motion.div
                    key="annotated"
                    initial={reducedMotion ? {} : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reducedMotion ? {} : { opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <span className="font-mono text-sm text-[var(--accent-primary)]">
                      ANNOTATED VIEW
                    </span>
                    <div className="mt-2 font-mono text-xs text-white/40">
                      Depth + Object IDs + Physics
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="raw"
                    initial={reducedMotion ? {} : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reducedMotion ? {} : { opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <span className="font-mono text-sm text-white/60">
                      RAW GAME FOOTAGE
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right: 2x2 grid */}
          <div className="grid grid-cols-2 gap-3">
            {views.map((view) => (
              <div
                key={view.label}
                className="flex aspect-video items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)]"
              >
                <div className="text-center">
                  <div
                    className="mx-auto mb-2 h-12 w-24 rounded bg-[var(--bg-secondary)]"
                    style={{ borderBottom: `2px solid ${view.color}` }}
                  />
                  <span
                    className="font-mono text-xs font-medium"
                    style={{ color: view.color }}
                  >
                    {view.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Copy */}
        <div className="mt-10 max-w-2xl">
          <p className="text-base text-white/80">
            Game engines give us what cameras can&apos;t: pixel-perfect ground
            truth. Every object has an identity. Every surface has depth. Every
            frame has physics state — without a single human annotator.
          </p>

          {/* Stats */}
          <div className="mt-6 flex flex-wrap gap-6">
            <div className="font-mono text-sm">
              <span className="text-[var(--accent-primary)]">~66K</span>{" "}
              <span className="text-white/60">clips</span>
            </div>
            <div className="font-mono text-sm">
              <span className="text-[var(--accent-primary)]">
                Pixel-perfect
              </span>{" "}
              <span className="text-white/60">ground truth</span>
            </div>
            <div className="font-mono text-sm">
              <span className="text-[var(--accent-primary)]">Zero</span>{" "}
              <span className="text-white/60">annotation cost</span>
            </div>
          </div>
        </div>

        {/* Unique differentiator */}
        <div className="mt-8 rounded-lg border border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/5 px-6 py-4">
          <p className="font-mono text-sm text-[var(--accent-primary)]">
            No competitor offers game environment training data. This is unique
            to Claru.
          </p>
        </div>
      </div>
    </section>
  );
}
