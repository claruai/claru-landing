"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import type { Clip } from "@/types/data-catalog";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface EnrichedClip {
  clip: Clip;
  videoUrl: string;
  annotationUrl: string | null;
}

interface DataPreviewClientProps {
  samples: EnrichedClip[];
  heading: string;
  subheading: string;
}

// ---------------------------------------------------------------------------
// Metadata panel — terminal-style JSON rendering
// ---------------------------------------------------------------------------

function MetadataPanel({ clip }: { clip: Clip }) {
  const meta = (clip.ann_metadata ?? {}) as Record<string, unknown>;
  const enrichment = (clip.ai_enrichment_json ?? {}) as Record<string, unknown>;

  // Build a CURATED display object — only high-value fields, no internal noise
  const displayData: Record<string, unknown> = {};

  // Category & task (most important — what is this clip?)
  if (meta.category) displayData.category = meta.category;
  if (meta.subcategory) displayData.subcategory = meta.subcategory;
  if (enrichment.task_description) displayData.description = enrichment.task_description;

  // Environment context
  if (enrichment.environment_label) displayData.environment = enrichment.environment_label;

  // Hand tracking — robotics labs care most about this
  if (enrichment.hands) {
    const h = enrichment.hands as Record<string, unknown>;
    displayData.hand_tracking = {
      primary_hand: h.primary_hand,
      active_manipulation: h.active_manipulation,
      both_hands_pct: `${h.both_hands_pct}%`,
      right_hand_pct: `${h.right_hand_pct}%`,
      left_hand_pct: `${h.left_hand_pct}%`,
      confidence: h.confidence,
    };
  }

  // Technical specs — what the training pipeline needs
  if (enrichment.technical_specs) {
    const specs = enrichment.technical_specs as Record<string, unknown>;
    const res = specs.resolution_px as Record<string, number> | undefined;
    displayData.capture_specs = {
      resolution: res ? `${res.width}×${res.height}` : undefined,
      fps: specs.fps_estimate,
      duration: specs.duration_s ? `${specs.duration_s}s` : undefined,
      format: specs.aspect_ratio,
    };
  } else if (clip.tech_duration_seconds) {
    displayData.capture_specs = {
      duration: `${clip.tech_duration_seconds}s`,
    };
  }

  // Domain label
  if (enrichment.domain) displayData.domain = enrichment.domain;

  // Fallback: if no enrichment at all, show clean metadata (strip internal fields)
  const hasEnrichment = Object.keys(displayData).length > 2; // more than just category/subcategory
  if (!hasEnrichment) {
    // Only keep useful metadata fields, strip internal IDs, file paths, reviewer info, etc.
    const cleanMeta: Record<string, unknown> = {};
    if (meta.category) cleanMeta.category = meta.category;
    if (meta.subcategory) cleanMeta.subcategory = meta.subcategory;
    if (meta.annotation_type) cleanMeta.annotation_type = meta.annotation_type;
    if (meta.video_description) cleanMeta.description = meta.video_description;
    if (meta.num_frames) cleanMeta.num_frames = meta.num_frames;
    // Use clean metadata if we got anything useful
    if (Object.keys(cleanMeta).length > 0) {
      Object.assign(displayData, cleanMeta);
    }
  }

  const dataToShow = displayData;

  return (
    <div
      className="h-full overflow-auto rounded-lg border font-mono text-xs leading-relaxed"
      style={{
        backgroundColor: "#0c0c0a",
        borderColor: "#2a2a28",
      }}
    >
      {/* Terminal header */}
      <div
        className="sticky top-0 z-10 flex items-center gap-2 px-4 py-2 border-b"
        style={{ backgroundColor: "#0c0c0a", borderColor: "#2a2a28" }}
      >
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500/60" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
          <div className="w-2 h-2 rounded-full bg-green-500/60" />
        </div>
        <span style={{ color: "#666" }}>enrichment.json</span>
      </div>

      <pre className="p-4 whitespace-pre-wrap break-words" style={{ color: "#e8e8e8" }}>
        <code>{JSON.stringify(dataToShow, null, 2)}</code>
      </pre>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Video card with metadata panel
// ---------------------------------------------------------------------------

function SampleCard({ data }: { data: EnrichedClip }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { clip, videoUrl } = data;

  const meta = (clip.ann_metadata ?? {}) as Record<string, unknown>;
  const enrichment = (clip.ai_enrichment_json ?? {}) as Record<string, unknown>;
  const subcategory =
    (meta.subcategory as string) ?? (enrichment.task as string) ?? "Sample";

  const handleMouseEnter = useCallback(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-4 rounded-xl border overflow-hidden"
      style={{ backgroundColor: "#121210", borderColor: "#2a2a28" }}
    >
      {/* Video */}
      <div
        className="relative aspect-video cursor-pointer overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <video
          ref={videoRef}
          src={videoUrl}
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
        />
        {/* Subcategory label */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span
            className="px-2 py-1 rounded text-xs font-mono"
            style={{
              backgroundColor: "rgba(146, 176, 144, 0.15)",
              color: "#92B090",
              border: "1px solid rgba(146, 176, 144, 0.3)",
            }}
          >
            {subcategory}
          </span>
        </div>
        {/* Play hint */}
        <div className="absolute bottom-3 right-3 px-2 py-1 rounded text-xs font-mono opacity-60" style={{ backgroundColor: "rgba(0,0,0,0.6)", color: "#fff" }}>
          hover to play
        </div>
      </div>

      {/* Metadata panel */}
      <div className="h-[300px] lg:h-auto">
        <MetadataPanel clip={clip} />
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main client component
// ---------------------------------------------------------------------------

export function DataPreviewClient({
  samples,
  heading,
  subheading,
}: DataPreviewClientProps) {
  const [showAll, setShowAll] = useState(false);
  const visibleSamples = showAll ? samples : samples.slice(0, 3);

  return (
    <section id="data-preview" className="w-full py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="mb-12">
          <h2
            className="text-2xl md:text-3xl font-bold mb-3"
            style={{ color: "#ffffff" }}
          >
            {heading}
          </h2>
          <p className="text-base" style={{ color: "#999" }}>
            {subheading}
          </p>
        </div>

        {/* Sample cards */}
        <div className="space-y-6">
          {visibleSamples.map((data) => (
            <SampleCard key={data.clip.id} data={data} />
          ))}
        </div>

        {/* Show more */}
        {!showAll && samples.length > 3 && (
          <button
            onClick={() => setShowAll(true)}
            className="mt-8 mx-auto block px-6 py-2 rounded-lg font-mono text-sm transition-colors"
            style={{
              backgroundColor: "transparent",
              color: "#92B090",
              border: "1px solid #92B090",
            }}
          >
            Show {samples.length - 3} more samples →
          </button>
        )}
      </div>
    </section>
  );
}
