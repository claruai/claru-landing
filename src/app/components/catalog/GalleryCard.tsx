"use client";

import { useState, useRef, useEffect, useCallback, type MouseEvent } from "react";
import { Star } from "lucide-react";
import type { DatasetSample, Clip } from "@/types/data-catalog";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function isVideoUrl(url: string, mimeType: string): boolean {
  if (mimeType?.startsWith("video/")) return true;
  const videoExts = [".mp4", ".webm", ".mov", ".avi", ".mkv"];
  const urlLower = (url ?? "").split("?")[0].toLowerCase();
  return videoExts.some((ext) => urlLower.endsWith(ext));
}

export function isImageUrl(url: string, mimeType: string): boolean {
  if (mimeType?.startsWith("image/")) return true;
  const imgExts = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif", ".svg"];
  const urlLower = (url ?? "").split("?")[0].toLowerCase();
  return imgExts.some((ext) => urlLower.endsWith(ext));
}

function formatDurationOverlay(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.round(seconds % 60);
  return `${minutes}:${String(remaining).padStart(2, "0")}`;
}

// ---------------------------------------------------------------------------
// ClipLike -- Structural interface for GalleryCard (works with Clip or DatasetSample)
// ---------------------------------------------------------------------------

/**
 * Minimal shape that GalleryCard reads from. Compatible with both legacy
 * DatasetSample and the unified Clip type. Callers pass whichever they have.
 */
export interface ClipLike {
  id: string;
  mime_type: string | null;
  filename: string | null;
  /** Legacy metadata (DatasetSample) — maps to ann_metadata on Clip */
  metadata_json?: Record<string, unknown> | null;
  /** Clip-native annotation metadata */
  ann_metadata?: Record<string, unknown> | null;
  /** Legacy duration (DatasetSample) */
  duration_seconds?: number | null;
  /** Clip-native duration */
  tech_duration_seconds?: number | null;
}

/** Helper: extract the metadata record from a ClipLike, preferring ann_metadata. */
function getMetadata(item: ClipLike): Record<string, unknown> {
  return (item.ann_metadata ?? item.metadata_json ?? {}) as Record<string, unknown>;
}

/** Helper: extract duration from a ClipLike, preferring tech_duration_seconds. */
function getDuration(item: ClipLike): number | null {
  return item.tech_duration_seconds ?? item.duration_seconds ?? null;
}

// ---------------------------------------------------------------------------
// GalleryCard -- Shared card with lazy-loaded media & hover preview
// ---------------------------------------------------------------------------

export interface GalleryCardProps {
  /** Accepts Clip, DatasetSample, or anything satisfying ClipLike. */
  sample: ClipLike | DatasetSample | Clip;
  signedUrl: string;
  index: number;
  onSelect: (index: number) => void;
  /** Custom footer label. Defaults to sample_NNN.ext */
  footerLabel?: string;
  /** When true, shows a checkbox overlay (top-right). */
  selectable?: boolean;
  /** Selected state for the checkbox overlay. */
  isSelected?: boolean;
  /** Called when the checkbox is toggled (event already stopPropagation'd). */
  onToggleSelect?: () => void;
  /** When defined, shows the showcase star toggle (top-right, under checkbox). */
  isShowcase?: boolean;
  /** Called when the showcase star is clicked. Optimistic state managed by parent. */
  onToggleShowcase?: () => void;
  /** Disable showcase toggle (e.g. clip is lead-bound). */
  showcaseDisabled?: boolean;
  /** When true, dims the showcase button until hover (otherwise always visible if isShowcase=true). */
  showcaseDimWhenOff?: boolean;
}

export function GalleryCard({
  sample,
  signedUrl,
  index,
  onSelect,
  footerLabel,
  selectable,
  isSelected,
  onToggleSelect,
  isShowcase,
  onToggleShowcase,
  showcaseDisabled,
  showcaseDimWhenOff = true,
}: GalleryCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const mimeType = sample.mime_type ?? "";
  const isVideo = isVideoUrl(signedUrl, mimeType);
  const isImage = isImageUrl(signedUrl, mimeType);

  // Extract metadata overlays — works with both legacy and clip shapes
  const metadata = getMetadata(sample);
  const subcategory =
    typeof metadata.subcategory === "string" ? metadata.subcategory : null;
  const durationSeconds =
    typeof metadata.duration_seconds === "number"
      ? metadata.duration_seconds
      : getDuration(sample);

  // -------------------------------------------------------------------------
  // IntersectionObserver -- lazy-load video src when card enters viewport
  // -------------------------------------------------------------------------
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(card);
        }
      },
      { rootMargin: "200px 0px" }
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  // -------------------------------------------------------------------------
  // Hover handlers -- auto-play / pause video
  // -------------------------------------------------------------------------
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay blocked by browser -- silently ignore
      });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, []);

  const handleClick = useCallback(() => {
    onSelect(index);
  }, [onSelect, index]);

  // Default footer label
  const defaultLabel = `sample_${String(index + 1).padStart(3, "0")}${isVideo ? ".mp4" : isImage ? ".png" : ""}`;

  return (
    <div
      ref={cardRef}
      role="button"
      tabIndex={0}
      aria-label={`Sample ${index + 1}${subcategory ? ` - ${subcategory}` : ""}`}
      className="gallery-card group relative rounded-lg overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-secondary)] cursor-pointer transition-all duration-300 ease-out hover:border-[var(--accent-primary)]/40 hover:shadow-[0_0_20px_rgba(146,176,144,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Media area */}
      <div className="relative aspect-video bg-[var(--bg-primary)] overflow-hidden">
        {/* Video card */}
        {isVideo && (
          <>
            <video
              ref={videoRef}
              muted
              playsInline
              loop
              preload="metadata"
              src={isInView && signedUrl ? signedUrl : undefined}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              style={{ colorScheme: "dark" }}
            />
            {/* Play indicator -- fades out on hover when video starts */}
            <div
              className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
              style={{ opacity: isHovered ? 0 : 1 }}
            >
              <div className="w-10 h-10 rounded-full bg-black/50 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                <svg
                  className="w-4 h-4 text-white/80 ml-0.5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </>
        )}

        {/* Image card */}
        {isImage && isInView && signedUrl && (
          <img
            src={signedUrl}
            alt={`Sample ${index + 1}`}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        )}

        {/* Fallback -- no media preview */}
        {!isVideo && !isImage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-xs text-[var(--text-muted)]">
              no preview
            </span>
          </div>
        )}

        {/* Placeholder shimmer while not in view */}
        {!isInView && (
          <div className="absolute inset-0 bg-[var(--bg-tertiary)] animate-pulse" />
        )}

        {/* Overlays */}

        {/* Subcategory badge -- top left */}
        {subcategory && (
          <div className="absolute top-2 left-2 z-10">
            <span className="inline-block px-2 py-0.5 rounded bg-black/60 border border-white/10 font-mono text-[10px] text-white/90 backdrop-blur-sm leading-tight">
              {subcategory}
            </span>
          </div>
        )}

        {/* Selection checkbox + showcase star — top right (admin only) */}
        {(selectable || onToggleShowcase) && (
          <div className="absolute top-2 right-2 z-20 flex items-center gap-1.5">
            {onToggleShowcase && (
              <button
                type="button"
                disabled={showcaseDisabled}
                onClick={(e: MouseEvent) => {
                  e.stopPropagation();
                  if (!showcaseDisabled) onToggleShowcase();
                }}
                title={
                  showcaseDisabled
                    ? "Lead-specific clip — toggle showcase on the base attachment instead"
                    : isShowcase
                      ? "Showcase clip (click to remove)"
                      : "Click to mark as showcase"
                }
                data-testid={`grid-showcase-toggle-${sample.id}`}
                data-showcase={isShowcase ? "true" : "false"}
                className={`inline-flex h-7 w-7 items-center justify-center rounded-md border backdrop-blur-sm transition-all ${
                  isShowcase
                    ? "bg-[var(--accent-primary)]/90 border-[var(--accent-primary)] text-[var(--bg-primary)]"
                    : `bg-black/60 border-white/20 text-white/80 hover:bg-black/80 ${showcaseDimWhenOff ? "opacity-0 group-hover:opacity-100" : ""}`
                } ${showcaseDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <Star className="h-3.5 w-3.5" fill={isShowcase ? "currentColor" : "none"} />
              </button>
            )}
            {selectable && (
              <label
                onClick={(e: MouseEvent) => e.stopPropagation()}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-black/60 border border-white/20 backdrop-blur-sm cursor-pointer hover:bg-black/80 transition-colors"
                title={isSelected ? "Deselect" : "Select"}
              >
                <input
                  type="checkbox"
                  checked={!!isSelected}
                  onChange={(e) => {
                    e.stopPropagation();
                    onToggleSelect?.();
                  }}
                  data-testid={`grid-select-${sample.id}`}
                  className="h-4 w-4 accent-[var(--accent-primary)] cursor-pointer"
                />
              </label>
            )}
          </div>
        )}

        {/* Duration badge -- bottom right */}
        {isVideo && durationSeconds != null && durationSeconds > 0 && (
          <div className="absolute bottom-2 right-2 z-10">
            <span className="inline-block px-1.5 py-0.5 rounded bg-black/70 font-mono text-[10px] text-white/90 tabular-nums leading-tight">
              {formatDurationOverlay(durationSeconds)}
            </span>
          </div>
        )}

        {/* Bottom gradient for readability */}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
      </div>

      {/* Card footer */}
      <div className="px-3 py-2 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
        <span className="font-mono text-[11px] text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors duration-200 block truncate">
          {footerLabel ?? defaultLabel}
        </span>
      </div>
    </div>
  );
}
