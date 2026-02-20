"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { X, ChevronLeft, ChevronRight, Copy, Check } from "lucide-react";
import type { DatasetSample } from "@/types/data-catalog";

// =============================================================================
// SampleDetailModal -- Split-view modal: media left, JSON right (US-008)
// Opens when a gallery card is clicked. Supports prev/next navigation,
// keyboard shortcuts, and click-outside-to-close.
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
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isVideoUrl(url: string, mimeType: string): boolean {
  if (mimeType.startsWith("video/")) return true;
  const videoExts = [".mp4", ".webm", ".mov", ".avi", ".mkv"];
  const urlLower = url.split("?")[0].toLowerCase();
  return videoExts.some((ext) => urlLower.endsWith(ext));
}

function isImageUrl(url: string, mimeType: string): boolean {
  if (mimeType.startsWith("image/")) return true;
  const imgExts = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif", ".svg"];
  const urlLower = url.split("?")[0].toLowerCase();
  return imgExts.some((ext) => urlLower.endsWith(ext));
}

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
// JSON Syntax Highlighter -- green keys on dark background
// ---------------------------------------------------------------------------

function highlightJson(jsonStr: string): React.ReactNode[] {
  // Split into lines and process each
  const lines = jsonStr.split("\n");
  return lines.map((line, lineIdx) => {
    // Match JSON key pattern: "key":
    const parts: React.ReactNode[] = [];
    let remaining = line;
    let partIdx = 0;

    // Match quoted keys followed by colon
    const keyRegex = /("(?:[^"\\]|\\.)*")\s*:/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = keyRegex.exec(remaining)) !== null) {
      // Text before the key
      if (match.index > lastIndex) {
        parts.push(
          <span key={`${lineIdx}-pre-${partIdx}`} className="text-[var(--text-secondary)]">
            {remaining.slice(lastIndex, match.index)}
          </span>
        );
        partIdx++;
      }

      // The key itself (green)
      parts.push(
        <span key={`${lineIdx}-key-${partIdx}`} className="text-[var(--accent-primary)]">
          {match[1]}
        </span>
      );
      partIdx++;

      // The colon
      parts.push(
        <span key={`${lineIdx}-colon-${partIdx}`} className="text-[var(--text-muted)]">
          :
        </span>
      );
      partIdx++;

      lastIndex = match.index + match[0].length;
    }

    // Remaining text after last key
    if (lastIndex < remaining.length) {
      const rest = remaining.slice(lastIndex);
      // Highlight string values in a slightly different shade
      const valueParts = rest.split(/("(?:[^"\\]|\\.)*")/g);
      for (const vp of valueParts) {
        if (vp.startsWith('"') && vp.endsWith('"')) {
          parts.push(
            <span key={`${lineIdx}-val-${partIdx}`} className="text-[var(--text-secondary)]">
              {vp}
            </span>
          );
        } else {
          // Numbers, booleans, nulls, structural chars
          parts.push(
            <span key={`${lineIdx}-other-${partIdx}`} className="text-[var(--text-tertiary)]">
              {vp}
            </span>
          );
        }
        partIdx++;
      }
    }

    return (
      <span key={lineIdx}>
        {parts.length > 0 ? parts : <span className="text-[var(--text-secondary)]">{line}</span>}
        {lineIdx < lines.length - 1 ? "\n" : ""}
      </span>
    );
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SampleDetailModal({
  samples,
  selectedIndex,
  onClose,
  onNavigate,
}: SampleDetailModalProps) {
  const [copied, setCopied] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const current = samples[selectedIndex];
  if (!current) return null;

  const { sample, signedUrl } = current;
  const isVideo = isVideoUrl(signedUrl, sample.mime_type);
  const isImage = isImageUrl(signedUrl, sample.mime_type);
  const metadata = sample.metadata_json ?? {};
  const commonFields = extractCommonFields(metadata);
  const jsonString = JSON.stringify(metadata, null, 2);

  const hasPrev = selectedIndex > 0;
  const hasNext = selectedIndex < samples.length - 1;

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
          {isVideo && (
            <video
              key={signedUrl}
              controls
              autoPlay
              muted
              playsInline
              className="w-full h-full max-h-[50vh] lg:max-h-[90vh] object-contain"
              style={{ colorScheme: "dark" }}
            >
              <source src={signedUrl} type={sample.mime_type} />
            </video>
          )}

          {isImage && (
            <img
              src={signedUrl}
              alt={`Sample ${selectedIndex + 1}`}
              className="w-full h-full max-h-[50vh] lg:max-h-[90vh] object-contain"
            />
          )}

          {!isVideo && !isImage && (
            <div className="flex items-center justify-center p-12">
              <span className="font-mono text-sm text-[var(--text-muted)]">
                No preview available
              </span>
            </div>
          )}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* Right side -- Metadata JSON (40% desktop, full width mobile)   */}
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

          {/* Scrollable metadata content */}
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

            {/* Full JSON block with syntax highlighting */}
            <div className="p-4">
              <pre className="font-mono text-xs leading-relaxed whitespace-pre-wrap break-words">
                <code>{highlightJson(jsonString)}</code>
              </pre>
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
