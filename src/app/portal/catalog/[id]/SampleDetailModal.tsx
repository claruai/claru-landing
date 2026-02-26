"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { X, ChevronLeft, ChevronRight, Copy, Check } from "lucide-react";
import type { DatasetSample } from "@/types/data-catalog";
import { getRendererForMime } from "@/lib/file-renderers";
import { DownloadLink } from "./DownloadLink";
import { VideoPlayer } from "./VideoPlayer";
import { DataPanelTabs } from "./DataPanels";
import type { PanelDescriptor } from "./DataPanels";

// =============================================================================
// SampleDetailModal -- Split-view modal: media left, data panels right (US-019)
// Opens when a gallery card is clicked. Supports prev/next navigation,
// keyboard shortcuts, and click-outside-to-close.
//
// Right panel uses the extensible DataPanelTabs system. Panels are built
// dynamically from sample data:
//   - "annotation" panel: always included if metadata or annotation data exists
//   - "game_specs" panel: included if sample has s3_specs_key or specs in metadata
//
// Single-tab case: DataPanelTabs renders the panel content directly without
// a tab bar. Multi-tab case: tab bar with panel labels and icons.
// =============================================================================

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SampleDetailModalProps {
  samples: Array<{
    sample: DatasetSample;
    signedUrl: string;
  }>;
  selectedIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  /** API endpoint for fetching annotation / specs JSON from S3.
   *  Defaults to the portal route; pass the admin route when used outside the portal. */
  annotationEndpoint?: string;
  /** API base prefix for signed-URL requests (portal panels vs admin panels).
   *  Derived automatically from annotationEndpoint when not provided. */
  apiBase?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Extract common key-value fields from metadata_json for the summary strip. */
function extractCommonFields(
  metadata: Record<string, unknown>
): Array<{ key: string; value: string }> {
  const fields: Array<{ key: string; value: string }> = [];
  const keys: Array<{ metaKey: string; label: string }> = [
    { metaKey: "subcategory", label: "subcategory" },
    { metaKey: "duration_seconds", label: "duration_seconds" },
    { metaKey: "resolution", label: "resolution" },
    { metaKey: "fps", label: "fps" },
    { metaKey: "annotation_id", label: "annotation_id" },
  ];

  for (const { metaKey, label } of keys) {
    const val = metadata[metaKey];
    if (val !== undefined && val !== null && val !== "") {
      fields.push({ key: label, value: String(val) });
    }
  }

  return fields;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SampleDetailModal({
  samples,
  selectedIndex,
  onClose,
  onNavigate,
  annotationEndpoint = "/api/portal/s3-annotation",
  apiBase: apiBaseProp,
}: SampleDetailModalProps) {
  // Derive apiBase from annotationEndpoint when the caller does not supply it explicitly
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

  const current = samples[selectedIndex];
  if (!current) return null;

  const { sample, signedUrl } = current;
  const renderer = getRendererForMime(sample.mime_type);
  const rendererComponent = renderer?.component ?? null;
  const metadata = sample.metadata_json ?? {};
  const commonFields = extractCommonFields(metadata);

  const hasPrev = selectedIndex > 0;
  const hasNext = selectedIndex < samples.length - 1;

  // -------------------------------------------------------------------------
  // Build panels array dynamically from sample data
  // -------------------------------------------------------------------------
  const panels = useMemo<PanelDescriptor[]>(() => {
    const result: PanelDescriptor[] = [];

    // Always include annotation panel if metadata or annotation data exists
    // Strip internal/noisy fields before merging annotation into the display object
    const ANNOTATION_NOISE_KEYS = new Set([
      "userId", "reviewerId", "payoutId", "paymentStatus", "paymentDate",
      "cost", "project", "rejectionReason", "rejectionCount", "isTestTemplate",
      "key", "browserMetadata", "projectId", "savedAt", "notes",
      "comment", "templateData",
    ]);

    const cleanedAnnotation = annotationData
      ? Object.fromEntries(
          Object.entries(annotationData).filter(([k]) => !ANNOTATION_NOISE_KEYS.has(k))
        )
      : null;

    const annotationPanelData: Record<string, unknown> = {
      ...metadata,
      ...(cleanedAnnotation ?? {}),
    };
    if (Object.keys(annotationPanelData).length > 0) {
      result.push({ type: "annotation", data: annotationPanelData });
    }

    // Include game_specs panel if sample has specs data
    if (specsData && Object.keys(specsData).length > 0) {
      result.push({ type: "game_specs", data: specsData });
    } else if (sample.s3_specs_key && specsLoading) {
      // Show a loading placeholder -- will be replaced once specs arrive
      // We still include an empty placeholder so the tab appears
    }

    // Add Data Files panel when annotation has non-video attached files
    const rawFiles = cleanedAnnotation?.files;
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
  }, [metadata, annotationData, specsData, sample.s3_specs_key, specsLoading]);

  // -------------------------------------------------------------------------
  // Merged JSON for copy button -- combines all panel data
  // -------------------------------------------------------------------------
  const mergedJson = useMemo<Record<string, unknown>>(() => {
    const merged: Record<string, unknown> = { ...metadata };
    if (annotationData) {
      merged._annotation = annotationData;
    }
    if (specsData) {
      merged._game_specs = specsData;
    }
    return merged;
  }, [metadata, annotationData, specsData]);

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

  // Reset copy state when navigating
  useEffect(() => {
    setCopied(false);
  }, [selectedIndex]);

  // -------------------------------------------------------------------------
  // Fetch annotation data from S3 on-demand (US-008 pattern)
  // -------------------------------------------------------------------------
  useEffect(() => {
    setAnnotationData(null);
    setAnnotationLoading(false);

    const currentSample = samples[selectedIndex]?.sample;
    if (!currentSample?.s3_annotation_key) return;

    let cancelled = false;
    setAnnotationLoading(true);

    fetch(annotationEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        objectKey: currentSample.s3_annotation_key,
        sampleId: currentSample.id,
      }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) {
          // API returns { annotation: {...}, cached: bool } — unwrap the payload
          const payload = data.annotation ?? data;
          setAnnotationData(payload);
        }
      })
      .catch(() => {
        // Silent failure -- show metadata_json only
      })
      .finally(() => {
        if (!cancelled) setAnnotationLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedIndex, samples, annotationEndpoint]);

  // -------------------------------------------------------------------------
  // Fetch specs data from S3 on-demand (same pattern as annotation fetch)
  // -------------------------------------------------------------------------
  useEffect(() => {
    setSpecsData(null);
    setSpecsLoading(false);

    const currentSample = samples[selectedIndex]?.sample;
    if (!currentSample?.s3_specs_key) return;

    let cancelled = false;
    setSpecsLoading(true);

    fetch(annotationEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        objectKey: currentSample.s3_specs_key,
        sampleId: currentSample.id,
      }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) {
          const payload = data.annotation ?? data;
          setSpecsData(payload as Record<string, unknown>);
        }
      })
      .catch(() => {
        // Silent failure -- skip specs panel
      })
      .finally(() => {
        if (!cancelled) setSpecsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedIndex, samples, annotationEndpoint]);

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
      // Only close if the click target is the backdrop itself, not the content
      if (e.target === backdropRef.current) {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <div
      ref={backdropRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Sample ${selectedIndex + 1} detail view`}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 lg:p-8"
      onClick={handleBackdropClick}
    >
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true" />

      {/* --------------------------------------------------------------- */}
      {/* Close button (top-right corner, above content)                   */}
      {/* --------------------------------------------------------------- */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-[60] w-10 h-10 rounded-full flex items-center justify-center bg-[var(--bg-tertiary)]/80 border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-medium)] backdrop-blur-sm transition-colors duration-200"
        aria-label="Close detail view"
      >
        <X className="w-5 h-5" />
      </button>

      {/* --------------------------------------------------------------- */}
      {/* Previous / Next arrows (positioned on sides of viewport)         */}
      {/* --------------------------------------------------------------- */}
      {hasPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(selectedIndex - 1);
          }}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-[60] w-10 h-10 rounded-full flex items-center justify-center bg-[var(--bg-tertiary)]/80 border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-medium)] backdrop-blur-sm transition-colors duration-200"
          aria-label="Previous sample"
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
          aria-label="Next sample"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* --------------------------------------------------------------- */}
      {/* Content container -- split view                                  */}
      {/* --------------------------------------------------------------- */}
      <div
        ref={contentRef}
        className="relative z-[55] flex flex-col lg:flex-row w-full max-w-6xl max-h-[90vh] rounded-xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-secondary)] shadow-2xl shadow-black/50"
      >
        {/* ------------------------------------------------------------- */}
        {/* Left side -- Media (60% desktop, full width mobile)            */}
        {/* ------------------------------------------------------------- */}
        <div className="lg:w-[60%] flex-shrink-0 bg-[var(--bg-primary)] flex items-center justify-center min-h-[240px] lg:min-h-0">
          {rendererComponent === "VideoPlayer" && (
            <VideoPlayer
              src={signedUrl}
              mimeType={sample.mime_type}
              autoPlay
              sampleId={sample.id}
              className="w-full h-full max-h-[50vh] lg:max-h-[90vh] object-contain"
            />
          )}

          {rendererComponent === "ImageViewer" && (
            <img
              src={signedUrl}
              alt={`Sample ${selectedIndex + 1}`}
              className="w-full h-full max-h-[50vh] lg:max-h-[90vh] object-contain"
            />
          )}

          {rendererComponent === "DownloadLink" && (
            <div className="flex items-center justify-center p-12">
              <DownloadLink
                href={signedUrl}
                filename={sample.filename ?? "download"}
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

        {/* ------------------------------------------------------------- */}
        {/* Right side -- Data Panels (40% desktop, full width mobile)     */}
        {/* ------------------------------------------------------------- */}
        <div className="lg:w-[40%] flex flex-col min-h-0 border-t lg:border-t-0 lg:border-l border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
          {/* Header bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/50 flex-shrink-0">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-[var(--accent-primary)] tracking-wider">
                {"// METADATA"}
              </span>
              <span className="font-mono text-[10px] text-[var(--text-muted)]">
                sample_{String(selectedIndex + 1).padStart(3, "0")}
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
            {/* Common fields summary */}
            {commonFields.length > 0 && (
              <div className="px-4 py-3 border-b border-[var(--border-subtle)]">
                <div className="space-y-1.5">
                  {commonFields.map(({ key, value }) => (
                    <div key={key} className="flex items-baseline gap-2 font-mono text-xs">
                      <span className="text-[var(--accent-primary)] flex-shrink-0">{key}:</span>
                      <span className="text-[var(--text-secondary)] truncate">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                <DataPanelTabs panels={panels} sampleId={sample.id} apiBase={apiBase} />
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
              {selectedIndex + 1} / {samples.length}
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
