"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { X, ChevronLeft, ChevronRight, Copy, Check } from "lucide-react";
import type { DatasetSample, Clip } from "@/types/data-catalog";
import { getRendererForMime } from "@/lib/file-renderers";
import { DownloadLink } from "./DownloadLink";
import { VideoPlayer } from "./VideoPlayer";
import { DataPanelTabs } from "./DataPanels";
import type { PanelDescriptor } from "./DataPanels";
import { stripHiddenKeys } from "@/lib/strip-hidden-keys";

// =============================================================================
// ClipDetailModal -- Split-view modal: media left, data panels right
// Replaces SampleDetailModal for the unified clip architecture.
//
// Supports both Clip (new) and DatasetSample (legacy) items.
// When a Clip is provided, builds 3 structured tabs:
//   - Annotation: ann_metadata + live-fetched annotation-data.json
//   - AI Enrichment: ai_caption, ai_agent_context
//   - Technical: resolution, fps, duration, codec, file size
//
// When only a legacy DatasetSample is provided, falls back to the old
// metadata_json-based panels.
// =============================================================================

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ClipDetailModalProps {
  items: Array<{
    clip?: Clip;
    sample?: DatasetSample;
    signedUrl: string;
  }>;
  selectedIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  annotationEndpoint?: string;
  apiBase?: string;
}

/** @deprecated Use ClipDetailModalProps. Kept for backward compat with DatasetUploader. */
export type SampleDetailModalProps = ClipDetailModalProps;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Format bytes to human-readable string. */
function formatBytes(bytes: number | null | undefined): string {
  if (!bytes || bytes <= 0) return "--";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/** Format duration in seconds to readable string. */
function formatDuration(seconds: number | null | undefined): string {
  if (!seconds || seconds <= 0) return "--";
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.round(seconds % 60);
  return `${minutes}m ${String(remaining).padStart(2, "0")}s`;
}

/** Format resolution string from width/height. */
function formatResolution(w: number | null | undefined, h: number | null | undefined): string {
  if (!w || !h) return "--";
  return `${w} x ${h}`;
}

/** Compute aspect ratio from width/height. */
function computeAspectRatio(w: number | null | undefined, h: number | null | undefined): string {
  if (!w || !h) return "--";
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const d = gcd(w, h);
  return `${w / d}:${h / d}`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ClipDetailModal({
  items,
  selectedIndex,
  onClose,
  onNavigate,
  annotationEndpoint = "/api/portal/s3-annotation",
  apiBase: apiBaseProp,
}: ClipDetailModalProps) {
  const apiBase =
    apiBaseProp ??
    (annotationEndpoint.startsWith("/api/admin") ? "/api/admin" : "/api/portal");
  const [copied, setCopied] = useState(false);
  const [annotationData, setAnnotationData] = useState<Record<string, unknown> | null>(null);
  const [annotationLoading, setAnnotationLoading] = useState(false);
  const [specsData, setSpecsData] = useState<Record<string, unknown> | null>(null);
  const [specsLoading, setSpecsLoading] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const current = items[selectedIndex] ?? null;

  // Derive fields from current item -- all hooks must be called unconditionally
  const clip = current?.clip;
  const sample = current?.sample;
  const signedUrl = current?.signedUrl ?? "";

  const derived = useMemo(() => {
    const storedMime = clip?.mime_type ?? sample?.mime_type ?? "";
    const s3Key = clip?.s3_key ?? sample?.s3_object_key ?? "";
    const inferredMime = !storedMime && s3Key
      ? (() => {
          const ext = s3Key.split(".").pop()?.toLowerCase();
          const map: Record<string, string> = {
            mp4: "video/mp4", mov: "video/quicktime", webm: "video/webm",
            jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
          };
          return (ext && map[ext]) || "video/mp4";
        })()
      : storedMime;
    const mimeType = inferredMime;
    const filename = clip?.filename ?? sample?.filename ?? "download";
    const itemId = clip?.id ?? sample?.id ?? "";
    let rawAnn: unknown = clip?.ann_metadata ?? sample?.metadata_json ?? {};
    if (typeof rawAnn === "string") {
      try { rawAnn = JSON.parse(rawAnn); } catch { rawAnn = {}; }
    }
    const annMetadata = (rawAnn ?? {}) as Record<string, unknown>;
    const renderer = getRendererForMime(mimeType);
    const rendererComponent = renderer?.component ?? null;
    return { mimeType, filename, itemId, annMetadata, renderer, rendererComponent };
  }, [clip, sample]);

  const { mimeType, filename, itemId, annMetadata, renderer, rendererComponent } = derived;

  const hasPrev = selectedIndex > 0;
  const hasNext = selectedIndex < items.length - 1;

  // -------------------------------------------------------------------------
  // Build panels array dynamically from clip/sample data
  // -------------------------------------------------------------------------
  const panels = useMemo<PanelDescriptor[]>(() => {
    const result: PanelDescriptor[] = [];

    // --- Annotation panel ---
    // Live-fetched annotation data takes precedence over stored metadata
    const annotationPanelData: Record<string, unknown> = {
      ...(stripHiddenKeys(annotationData ?? annMetadata) as Record<string, unknown> ?? {}),
    };
    if (Object.keys(annotationPanelData).length > 0) {
      result.push({ type: "annotation", data: annotationPanelData });
    }

    // --- AI Enrichment panel (clip-only) ---
    if (clip) {
      const aiData: Record<string, unknown> = {};
      if (clip.ai_caption) aiData.caption = clip.ai_caption;
      if (clip.ai_agent_context && typeof clip.ai_agent_context === "object") {
        const ctx = clip.ai_agent_context as Record<string, unknown>;
        if (ctx.scene_summary) aiData.scene_summary = ctx.scene_summary;
        if (ctx.environments) aiData.environments = ctx.environments;
        if (ctx.activities) aiData.activities = ctx.activities;
        if (ctx.objects) aiData.objects = ctx.objects;
        if (ctx.camera_perspective) aiData.camera_perspective = ctx.camera_perspective;
        // Include any other agent_context keys not already captured
        for (const [k, v] of Object.entries(ctx)) {
          if (!(k in aiData) && v !== null && v !== undefined) {
            aiData[k] = v;
          }
        }
      }
      // ai_enrichment_json may be a JSONB object OR a double-serialized JSON string
      let enrichJson = clip.ai_enrichment_json;
      if (typeof enrichJson === "string") {
        try { enrichJson = JSON.parse(enrichJson); } catch { enrichJson = null; }
      }
      if (enrichJson && typeof enrichJson === "object") {
        const ej = enrichJson as Record<string, unknown>;
        for (const [k, v] of Object.entries(ej)) {
          if (!(k in aiData) && v !== null && v !== undefined) {
            aiData[k] = v;
          }
        }
      }
      if (Object.keys(aiData).length > 0) {
        result.push({ type: "ai_enrichment", data: aiData });
      }
    } else if (sample) {
      // Legacy: show enrichment_json as enrichment panel
      const enrichment = sample.enrichment_json;
      if (enrichment && typeof enrichment === "object" && Object.keys(enrichment).length > 0) {
        result.push({ type: "enrichment", data: enrichment });
      }
    }

    // --- Technical panel (clip-only) ---
    if (clip) {
      const techData: Record<string, unknown> = {};
      if (clip.tech_resolution_width && clip.tech_resolution_height) {
        techData.resolution = formatResolution(clip.tech_resolution_width, clip.tech_resolution_height);
        techData.aspect_ratio = computeAspectRatio(clip.tech_resolution_width, clip.tech_resolution_height);
      }
      if (clip.tech_fps) techData.fps = clip.tech_fps;
      if (clip.tech_duration_seconds) techData.duration = formatDuration(clip.tech_duration_seconds);
      if (clip.tech_codec) techData.codec = clip.tech_codec;
      if (clip.tech_file_size_bytes) techData.file_size = formatBytes(clip.tech_file_size_bytes);
      if (clip.tech_bit_depth) techData.bit_depth = clip.tech_bit_depth;
      if (Object.keys(techData).length > 0) {
        result.push({ type: "technical", data: techData });
      }
    }

    // --- Game Specs panel ---
    if (specsData && Object.keys(specsData).length > 0) {
      result.push({ type: "game_specs", data: specsData });
    }

    // --- Data Files panel ---
    const rawFiles = annotationData?.files;
    if (Array.isArray(rawFiles)) {
      const dataFiles = (rawFiles as Array<Record<string, unknown>>).filter((f) => {
        const oid = String(f.objectId ?? "").toLowerCase();
        return !oid.endsWith(".mp4") && !oid.endsWith(".mov") && !oid.endsWith(".webm");
      });
      if (dataFiles.length > 0) {
        result.push({ type: "data_files", data: { files: dataFiles } });
      }
    }

    return result;
  }, [annMetadata, annotationData, specsData, clip, sample]);

  // -------------------------------------------------------------------------
  // Merged JSON for copy button
  // -------------------------------------------------------------------------
  const mergedJson = useMemo<Record<string, unknown>>(() => {
    const merged: Record<string, unknown> = { ...annMetadata };
    if (annotationData) merged._annotation = annotationData;
    if (specsData) merged._game_specs = specsData;
    if (clip) {
      if (clip.ai_caption) merged._ai_caption = clip.ai_caption;
      if (clip.ai_agent_context) merged._ai_context = clip.ai_agent_context;
    }
    return merged;
  }, [annMetadata, annotationData, specsData, clip]);

  const jsonString = JSON.stringify(mergedJson, null, 2);

  // -------------------------------------------------------------------------
  // Copy JSON to clipboard
  // -------------------------------------------------------------------------
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable
    }
  }, [jsonString]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCopied(false);
  }, [selectedIndex]);

  // -------------------------------------------------------------------------
  // Fetch annotation data from S3 on-demand
  // -------------------------------------------------------------------------
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnnotationData(null);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnnotationLoading(false);

    const currentItem = items[selectedIndex];
    const annotationKey = currentItem?.clip?.ann_annotation_key ?? currentItem?.sample?.s3_annotation_key;
    const id = currentItem?.clip?.id ?? currentItem?.sample?.id;
    if (!annotationKey) return;

    let cancelled = false;
    setAnnotationLoading(true);

    fetch(annotationEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        objectKey: annotationKey,
        sampleId: id,
        clipId: id,
        bucket: currentItem?.clip?.s3_bucket,
      }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) {
          const payload = data.annotation ?? data;
          setAnnotationData(payload);
        }
      })
      .catch(() => {
        // Silent failure -- show metadata only
      })
      .finally(() => {
        if (!cancelled) setAnnotationLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedIndex, items, annotationEndpoint]);

  // -------------------------------------------------------------------------
  // Fetch specs data from S3 on-demand
  // -------------------------------------------------------------------------
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSpecsData(null);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSpecsLoading(false);

    const currentItem = items[selectedIndex];
    const specsKey = currentItem?.clip?.ann_specs_key ?? currentItem?.sample?.s3_specs_key;
    const id = currentItem?.clip?.id ?? currentItem?.sample?.id;
    if (!specsKey) return;

    let cancelled = false;
    setSpecsLoading(true);

    fetch(annotationEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        objectKey: specsKey,
        sampleId: id,
        clipId: id,
      }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) {
          const payload = data.annotation ?? data;
          setSpecsData(payload as Record<string, unknown>);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setSpecsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedIndex, items, annotationEndpoint]);

  // -------------------------------------------------------------------------
  // Keyboard navigation
  // -------------------------------------------------------------------------
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && hasPrev) {
        onNavigate(selectedIndex - 1);
      } else if (e.key === "ArrowRight" && hasNext) {
        onNavigate(selectedIndex + 1);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNavigate, selectedIndex, hasPrev, hasNext]);

  // -------------------------------------------------------------------------
  // Lock body scroll while modal is open
  // -------------------------------------------------------------------------
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // -------------------------------------------------------------------------
  // Click outside content to close
  // -------------------------------------------------------------------------
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === backdropRef.current) {
        onClose();
      }
    },
    [onClose]
  );

  // Early return for invalid index -- placed after all hooks
  if (!current) return null;

  return (
    <div
      ref={backdropRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Clip ${selectedIndex + 1} detail view`}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 lg:p-8"
      onClick={handleBackdropClick}
    >
      {/* Backdrop — fully opaque so the gallery doesn't bleed through */}
      <div className="absolute inset-0 bg-black" aria-hidden="true" />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-[60] w-10 h-10 rounded-full flex items-center justify-center bg-[var(--bg-tertiary)]/80 border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-medium)] backdrop-blur-sm transition-colors duration-200"
        aria-label="Close detail view"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Previous / Next arrows */}
      {hasPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(selectedIndex - 1);
          }}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-[60] w-10 h-10 rounded-full flex items-center justify-center bg-[var(--bg-tertiary)]/80 border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-medium)] backdrop-blur-sm transition-colors duration-200"
          aria-label="Previous clip"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {hasNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(selectedIndex + 1);
          }}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-[60] w-10 h-10 rounded-full flex items-center justify-center bg-[var(--bg-tertiary)]/80 border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-medium)] backdrop-blur-sm transition-colors duration-200"
          aria-label="Next clip"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Content container -- split view */}
      <div
        ref={contentRef}
        className="relative z-[55] flex flex-col lg:flex-row w-full max-w-6xl max-h-[90vh] rounded-xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-secondary)] shadow-2xl shadow-black/50"
      >
        {/* Left side -- Media (60% desktop, full width mobile) */}
        <div className="lg:w-[60%] flex-shrink-0 bg-[var(--bg-primary)] flex items-center justify-center min-h-[240px] lg:min-h-0">
          {rendererComponent === "VideoPlayer" && signedUrl && (
            <VideoPlayer
              src={signedUrl}
              mimeType={mimeType}
              autoPlay
              sampleId={itemId}
              className="w-full h-full max-h-[50vh] lg:max-h-[90vh] object-contain"
            />
          )}

          {rendererComponent === "ImageViewer" && signedUrl && (
            <img
              src={signedUrl}
              alt={`Clip ${selectedIndex + 1}`}
              className="w-full h-full max-h-[50vh] lg:max-h-[90vh] object-contain"
            />
          )}

          {rendererComponent === "DownloadLink" && (
            <div className="flex items-center justify-center p-12">
              <DownloadLink
                href={signedUrl}
                filename={filename ?? "download"}
                fileSizeBytes={0}
                label={renderer?.label}
              />
            </div>
          )}

          {!rendererComponent && (
            <div className="flex items-center justify-center p-12">
              <span className="font-mono text-sm text-[var(--text-muted)]">
                No preview available
              </span>
            </div>
          )}
        </div>

        {/* Right side -- Data Panels (40% desktop, full width mobile) */}
        <div className="lg:w-[40%] flex flex-col min-h-0 border-t lg:border-t-0 lg:border-l border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
          {/* Header bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/50 flex-shrink-0">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-[var(--accent-primary)] tracking-wider">
                {"// CLIP DATA"}
              </span>
              <span className="font-mono text-[10px] text-[var(--text-muted)]">
                clip_{String(selectedIndex + 1).padStart(3, "0")}
              </span>
            </div>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)]/40 transition-colors duration-200"
              aria-label="Copy JSON to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copy JSON
                </>
              )}
            </button>
          </div>

          {/* Scrollable panel content */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {/* Loading indicators */}
            {(annotationLoading || specsLoading) && (
              <div className="px-4 py-3 border-b border-[var(--border-subtle)]">
                {annotationLoading && (
                  <div className="flex items-center gap-2 font-mono text-xs text-[var(--text-muted)]">
                    <span className="inline-block w-2 h-4 bg-[var(--accent-primary)] animate-[terminal-blink_1s_step-end_infinite]" />
                    Fetching annotation...
                  </div>
                )}
                {specsLoading && (
                  <div className="flex items-center gap-2 font-mono text-xs text-[var(--text-muted)] mt-1">
                    <span className="inline-block w-2 h-4 bg-[var(--accent-primary)] animate-[terminal-blink_1s_step-end_infinite]" />
                    Fetching specs...
                  </div>
                )}
              </div>
            )}

            {/* Data panel tabs (or single panel content) */}
            <div className="p-4">
              {panels.length > 0 ? (
                <DataPanelTabs panels={panels} sampleId={itemId} apiBase={apiBase} />
              ) : (
                <div className="font-mono text-xs text-[var(--text-muted)] text-center py-6">
                  No metadata available.
                </div>
              )}
            </div>
          </div>

          {/* Footer -- navigation counter */}
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-[var(--border-subtle)] bg-[var(--bg-primary)]/30 flex-shrink-0">
            <span className="font-mono text-[10px] text-[var(--text-muted)]">
              {selectedIndex + 1} / {items.length}
            </span>
            <span className="font-mono text-[10px] text-[var(--text-muted)]">
              esc close &middot; &larr;&rarr; navigate
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * @deprecated Backward-compatible wrapper. Use ClipDetailModal directly.
 * Adapts old SampleDetailModal props shape to ClipDetailModal.
 */
export function SampleDetailModal(props: {
  samples: Array<{ sample: DatasetSample; signedUrl: string }>;
  selectedIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  annotationEndpoint?: string;
  apiBase?: string;
}) {
  const items = props.samples.map(({ sample, signedUrl }) => ({
    sample,
    signedUrl,
  }));

  return (
    <ClipDetailModal
      items={items}
      selectedIndex={props.selectedIndex}
      onClose={props.onClose}
      onNavigate={props.onNavigate}
      annotationEndpoint={props.annotationEndpoint}
      apiBase={props.apiBase}
    />
  );
}
