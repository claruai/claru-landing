"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { DatasetSample } from "@/types/data-catalog";
import { SampleDetailModal } from "./SampleDetailModal";

// =============================================================================
// SampleGallery -- Responsive gallery grid with hover video preview
// Client component for portal dataset detail page (US-007)
// =============================================================================

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SampleWithUrl {
  sample: DatasetSample;
  signedUrl: string;
}

interface SampleGalleryProps {
  samplesWithUrls: SampleWithUrl[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isVideoUrl(url: string, mimeType: string): boolean {
  if (mimeType.startsWith("video/")) return true;
  // Fallback: check common video extensions in URL
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

function formatDurationOverlay(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.round(seconds % 60);
  return `${minutes}:${String(remaining).padStart(2, "0")}`;
}

// ---------------------------------------------------------------------------
// GalleryCard -- Individual card with lazy-loaded media & hover preview
// ---------------------------------------------------------------------------

interface GalleryCardProps {
  sample: DatasetSample;
  signedUrl: string;
  index: number;
  onSelect: (index: number) => void;
}

function GalleryCard({ sample, signedUrl, index, onSelect }: GalleryCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isVideo = isVideoUrl(signedUrl, sample.mime_type);
  const isImage = isImageUrl(signedUrl, sample.mime_type);

  // Extract metadata overlays
  const metadata = sample.metadata_json ?? {};
  const subcategory =
    typeof metadata.subcategory === "string" ? metadata.subcategory : null;
  const durationSeconds =
    typeof metadata.duration_seconds === "number"
      ? metadata.duration_seconds
      : sample.duration_seconds;

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

  // -------------------------------------------------------------------------
  // Click handler -- store selected index (US-008 will consume this)
  // -------------------------------------------------------------------------
  const handleClick = useCallback(() => {
    onSelect(index);
  }, [onSelect, index]);

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
      {/* --------------------------------------------------------------- */}
      {/* Media area                                                       */}
      {/* --------------------------------------------------------------- */}
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
              src={isInView ? signedUrl : undefined}
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
        {isImage && isInView && (
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

        {/* --------------------------------------------------------------- */}
        {/* Overlays                                                         */}
        {/* --------------------------------------------------------------- */}

        {/* Subcategory badge -- top left */}
        {subcategory && (
          <div className="absolute top-2 left-2 z-10">
            <span className="inline-block px-2 py-0.5 rounded bg-black/60 border border-white/10 font-mono text-[10px] text-white/90 backdrop-blur-sm leading-tight">
              {subcategory}
            </span>
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

      {/* --------------------------------------------------------------- */}
      {/* Card footer -- sample index label                                */}
      {/* --------------------------------------------------------------- */}
      <div className="px-3 py-2 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
        <span className="font-mono text-[11px] text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors duration-200">
          sample_{String(index + 1).padStart(3, "0")}
          {isVideo ? ".mp4" : isImage ? ".png" : ""}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SampleGallery -- Main exported grid component
// ---------------------------------------------------------------------------

export function SampleGallery({ samplesWithUrls }: SampleGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSelect = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const handleNavigate = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  return (
    <div>
      {/* Gallery grid -- responsive: 2 cols mobile, 3 tablet, 4 desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {samplesWithUrls.map(({ sample, signedUrl }, index) => (
          <GalleryCard
            key={sample.id}
            sample={sample}
            signedUrl={signedUrl}
            index={index}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {/* Detail split-view modal (US-008) */}
      {selectedIndex !== null && (
        <SampleDetailModal
          samples={samplesWithUrls}
          selectedIndex={selectedIndex}
          onClose={handleClose}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}
