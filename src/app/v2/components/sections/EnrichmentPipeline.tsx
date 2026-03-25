"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const pipelineStages = [
  { id: "raw", label: "RAW", range: [0, 20] },
  { id: "depth", label: "DEPTH", range: [20, 40] },
  { id: "pose", label: "POSE", range: [40, 60] },
  { id: "seg", label: "SEGMENTATION", range: [60, 80] },
  { id: "all", label: "ALL + CAPTION", range: [80, 100] },
] as const;

const stageColors: Record<string, string> = {
  raw: "#e8e8e8",
  depth: "#4A9EDE",
  pose: "#DE8A4A",
  seg: "#9E6ADE",
  all: "var(--accent-primary)",
};

const stageDescriptions: Record<string, string> = {
  raw: "Input video frame — unprocessed source footage",
  depth: "MiDaS v3.1 depth estimation — per-pixel distance map",
  pose: "MediaPipe Holistic — 33 body + 21 hand landmarks per frame",
  seg: "SAM 2 segmentation — instance-level masks with tracking",
  all: "Combined enrichment layers + auto-generated captions",
};

function getActiveStage(value: number) {
  for (const stage of pipelineStages) {
    if (value >= stage.range[0] && value < stage.range[1]) return stage.id;
  }
  return "all";
}

export default function EnrichmentPipeline() {
  const reducedMotion = useReducedMotion();
  const [sliderValue, setSliderValue] = useState(reducedMotion ? 100 : 0);
  const [isLoaded] = useState(true);
  const sliderRef = useRef<HTMLInputElement>(null);

  const activeStage = getActiveStage(sliderValue);

  const handleSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSliderValue(Number(e.target.value));
    },
    []
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const step = 5;
      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        setSliderValue((v) => Math.min(100, v + step));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        setSliderValue((v) => Math.max(0, v - step));
      }
    },
    []
  );

  return (
    <section id="enrichment" className="relative bg-[var(--bg-primary)] py-32 md:py-40">
      <div className="container mx-auto px-6">
        <motion.div
          className="mb-16"
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="v2-section-label mb-6">
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--accent-primary)]">
              {"// ANNOTATION & ENRICHMENT"}
            </span>
          </div>
          <h2 className="max-w-lg text-3xl font-bold leading-[1.1] tracking-[-0.02em] text-white md:text-4xl lg:text-[42px]">
            Every clip gets depth, pose, and segmentation.{" "}
            <span className="text-white/40">Automatically.</span>
          </h2>
        </motion.div>

        {/* Pipeline nodes */}
        <motion.div
          className="mb-14 flex flex-wrap items-center justify-center gap-2 md:gap-0"
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {pipelineStages.map((stage, i) => {
            const isActive = activeStage === stage.id;
            const isPast = sliderValue >= stage.range[0];
            return (
              <div key={stage.id} className="flex items-center">
                <button
                  onClick={() => setSliderValue(stage.range[0])}
                  className={`relative rounded-xl border px-5 py-3 font-mono text-xs transition-all duration-400 ${
                    isActive
                      ? "border-current bg-current/10 shadow-[0_0_24px_currentColor_/_0.12]"
                      : isPast
                        ? "border-[var(--border-medium)] bg-[var(--bg-card)] text-white/60 hover:bg-[var(--bg-card-hover)]"
                        : "border-[var(--border-subtle)] bg-[var(--bg-card)] text-white/25 hover:text-white/40"
                  }`}
                  style={isActive ? { color: stageColors[activeStage] } : undefined}
                >
                  {isActive && (
                    <span className="mr-1.5 inline-block animate-pulse">
                      ▶
                    </span>
                  )}
                  {stage.label}
                  {isActive && (
                    <span
                      className="ml-2 animate-pulse text-[10px] opacity-60"
                    >
                      [PROCESSING...]
                    </span>
                  )}
                </button>
                {/* Connection line with gradient */}
                {i < pipelineStages.length - 1 && (
                  <div className="mx-1.5 hidden md:block">
                    <svg className="h-[2px] w-12" viewBox="0 0 48 2">
                      <line
                        x1="0"
                        y1="1"
                        x2="48"
                        y2="1"
                        stroke={
                          sliderValue >= pipelineStages[i + 1].range[0]
                            ? stageColors[pipelineStages[i + 1].id] || "var(--accent-primary)"
                            : "var(--border-subtle)"
                        }
                        strokeWidth="2"
                        strokeDasharray="4 3"
                        className="transition-all duration-400"
                        style={{
                          strokeDashoffset:
                            sliderValue >= pipelineStages[i + 1].range[0]
                              ? 0
                              : 28,
                          transition: "stroke-dashoffset 0.5s ease, stroke 0.4s ease",
                        }}
                      />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </motion.div>

        {/* Video frame — premium terminal style */}
        <motion.div
          className="mx-auto max-w-3xl"
          initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="v2-scanline relative overflow-hidden rounded-2xl border border-[var(--border-subtle)] shadow-[0_8px_40px_rgba(0,0,0,0.5)]" style={{ background: "linear-gradient(165deg, #121110 0%, #0e0d0c 100%)" }}>
            {/* Terminal header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)" }}>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#ff5f57]/80" />
                <div className="h-3 w-3 rounded-full bg-[#febc2e]/80" />
                <div className="h-3 w-3 rounded-full bg-[#28c840]/80" />
              </div>
              <span className="font-mono text-[11px] tracking-wider text-white/25">
                enrichment-pipeline v2.4.1
              </span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={activeStage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-mono text-[11px] font-medium"
                  style={{ color: stageColors[activeStage] }}
                >
                  {pipelineStages.find((s) => s.id === activeStage)?.label}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Content area with subtle gradient */}
            <div className="relative aspect-video" style={{ background: "radial-gradient(ellipse at center, rgba(146,176,144,0.02) 0%, transparent 70%)" }}>
              {!isLoaded && (
                <div className="absolute inset-0 animate-pulse bg-[var(--bg-secondary)]" />
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStage}
                  initial={reducedMotion ? {} : { opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reducedMotion ? {} : { opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 flex flex-col items-center justify-center"
                >
                  {/* Large icon/letter */}
                  <div
                    className="mb-5 flex h-24 w-24 items-center justify-center rounded-2xl border transition-all duration-500"
                    style={{
                      borderColor: `${stageColors[activeStage]}25`,
                      backgroundColor: `${stageColors[activeStage]}06`,
                      boxShadow: `0 0 40px ${stageColors[activeStage]}08`,
                    }}
                  >
                    <span
                      className="text-5xl font-bold"
                      style={{ color: stageColors[activeStage] }}
                    >
                      {pipelineStages.find((s) => s.id === activeStage)?.label.charAt(0)}
                    </span>
                  </div>
                  <span
                    className="mb-2 font-mono text-sm font-semibold tracking-[0.15em]"
                    style={{ color: stageColors[activeStage] }}
                  >
                    {pipelineStages.find((s) => s.id === activeStage)?.label}
                  </span>
                  <span className="max-w-md text-center font-mono text-[11px] leading-relaxed text-white/25">
                    {stageDescriptions[activeStage]}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Slider */}
          <div className="mt-10 px-2">
            <div className="relative py-4" style={{ minHeight: "64px" }}>
              <input
                ref={sliderRef}
                type="range"
                min={0}
                max={100}
                step={1}
                value={sliderValue}
                onChange={handleSliderChange}
                onKeyDown={handleKeyDown}
                aria-label="Enrichment pipeline progress"
                aria-valuetext={`${pipelineStages.find((s) => s.id === activeStage)?.label} stage`}
                className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                style={{ touchAction: "none" }}
              />
              {/* Visual track */}
              <div className="pointer-events-none relative h-1.5 rounded-full bg-white/[0.06]">
                {/* Color segments */}
                <div
                  className="h-full rounded-full transition-all duration-200"
                  style={{
                    width: `${sliderValue}%`,
                    background: `linear-gradient(90deg, #e8e8e8 0%, #4A9EDE 25%, #DE8A4A 50%, #9E6ADE 75%, var(--accent-primary) 100%)`,
                  }}
                />
                {/* Thumb */}
                <div
                  className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-[var(--bg-primary)] transition-all duration-200"
                  style={{
                    left: `${sliderValue}%`,
                    borderColor: stageColors[activeStage],
                    boxShadow: `0 0 16px ${stageColors[activeStage]}30`,
                  }}
                />
              </div>
            </div>

            <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.15em] text-white/20">
              <span>Raw</span>
              <span style={{ color: sliderValue >= 20 ? "#4A9EDE" : undefined, opacity: sliderValue >= 20 ? 0.7 : 1 }}>Depth</span>
              <span style={{ color: sliderValue >= 40 ? "#DE8A4A" : undefined, opacity: sliderValue >= 40 ? 0.7 : 1 }}>Pose</span>
              <span style={{ color: sliderValue >= 60 ? "#9E6ADE" : undefined, opacity: sliderValue >= 60 ? 0.7 : 1 }}>Seg</span>
              <span style={{ color: sliderValue >= 80 ? "var(--accent-primary)" : undefined, opacity: sliderValue >= 80 ? 0.7 : 1 }}>All</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
