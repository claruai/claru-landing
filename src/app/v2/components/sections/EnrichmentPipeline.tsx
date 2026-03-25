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
  raw: "var(--text-primary)",
  depth: "#4A9EDE",
  pose: "#DE8A4A",
  seg: "#9E6ADE",
  all: "var(--accent-primary)",
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
    <section id="enrichment" className="relative bg-[var(--bg-primary)] py-24">
      <div className="container mx-auto px-6">
        <span className="mb-8 block font-mono text-sm text-[var(--accent-primary)]">
          {"// ENRICHMENT PIPELINE"}
        </span>

        {/* Pipeline nodes */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-2 md:gap-0">
          {pipelineStages.map((stage, i) => {
            const isActive = activeStage === stage.id;
            return (
              <div key={stage.id} className="flex items-center">
                <div
                  className={`relative rounded border px-4 py-2 font-mono text-xs transition-all ${
                    isActive
                      ? "border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] shadow-[0_0_12px_var(--accent-glow)]"
                      : sliderValue >= stage.range[0]
                        ? "border-[var(--border-medium)] bg-[var(--bg-card)] text-white/70"
                        : "border-[var(--border-subtle)] bg-[var(--bg-card)] text-white/30"
                  }`}
                >
                  {isActive && (
                    <span className="mr-1.5 inline-block animate-pulse">
                      ▶
                    </span>
                  )}
                  {stage.label}
                  {isActive && (
                    <span className="ml-1.5 animate-pulse text-[10px] text-[var(--accent-primary)]/60">
                      [PROCESSING...]
                    </span>
                  )}
                </div>
                {/* Dashed connection line */}
                {i < pipelineStages.length - 1 && (
                  <svg
                    className="mx-1 hidden h-[2px] w-8 md:block"
                    viewBox="0 0 32 2"
                  >
                    <line
                      x1="0"
                      y1="1"
                      x2="32"
                      y2="1"
                      stroke={
                        sliderValue >= pipelineStages[i + 1].range[0]
                          ? "var(--accent-primary)"
                          : "var(--border-subtle)"
                      }
                      strokeWidth="2"
                      strokeDasharray="4 3"
                      className="transition-colors"
                      style={{
                        strokeDashoffset:
                          sliderValue >= pipelineStages[i + 1].range[0]
                            ? 0
                            : 28,
                        transition: "stroke-dashoffset 0.3s ease",
                      }}
                    />
                  </svg>
                )}
              </div>
            );
          })}
        </div>

        {/* Video frame */}
        <div className="mx-auto max-w-3xl">
          <div className="relative aspect-video overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)]">
            {!isLoaded && (
              <div className="absolute inset-0 animate-pulse bg-[var(--bg-secondary)]" />
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={activeStage}
                initial={reducedMotion ? {} : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reducedMotion ? {} : { opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="text-center">
                  <div
                    className="mb-2 text-6xl font-bold"
                    style={{ color: stageColors[activeStage] }}
                  >
                    {pipelineStages
                      .find((s) => s.id === activeStage)
                      ?.label.charAt(0)}
                  </div>
                  <span
                    className="font-mono text-sm"
                    style={{ color: stageColors[activeStage] }}
                  >
                    {pipelineStages.find((s) => s.id === activeStage)?.label}{" "}
                    OVERLAY
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slider */}
          <div className="mt-6 px-2">
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
              <div className="pointer-events-none relative h-2 rounded-full bg-[var(--bg-secondary)]">
                <div
                  className="h-full rounded-full bg-[var(--accent-primary)] transition-all"
                  style={{ width: `${sliderValue}%` }}
                />
                <div
                  className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--accent-primary)] bg-[var(--bg-primary)] shadow-[0_0_8px_var(--accent-glow)] transition-all"
                  style={{ left: `${sliderValue}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between font-mono text-xs text-white/40">
              <span>Raw</span>
              <span>Depth</span>
              <span>Pose</span>
              <span>Seg</span>
              <span>All</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
