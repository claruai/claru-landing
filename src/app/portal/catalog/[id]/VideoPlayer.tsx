"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Download } from "lucide-react";

// =============================================================================
// VideoPlayer -- Client component for inline video playback
// Dark terminal-styled player with native controls.
// Detects unsupported formats (e.g. .MOV in Firefox) via canplay timeout
// and onerror, then shows a terminal-styled fallback with download link.
// When fallback activates, reports the format issue to the tracking API
// so admins can see which samples have compatibility problems.
// =============================================================================

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface VideoPlayerProps {
  /** Presigned URL or direct URL to the video file */
  src: string;
  /** MIME type of the video (e.g. "video/mp4", "video/quicktime") */
  mimeType: string;
  /** Additional CSS classes for the outer container */
  className?: string;
  /** Whether to autoplay (muted) when the video loads */
  autoPlay?: boolean;
  /** Sample ID used to report format issues (optional -- omit to skip reporting) */
  sampleId?: string;
}

// ---------------------------------------------------------------------------
// Fallback panel
// ---------------------------------------------------------------------------

function FormatFallback({ src }: { src: string }) {
  return (
    <div className="flex items-center justify-center w-full h-full min-h-[240px] bg-[var(--bg-tertiary)]">
      <div className="flex flex-col items-center gap-4 p-8 rounded-lg border border-[var(--accent-primary)]/30 bg-[var(--bg-tertiary)] max-w-sm text-center">
        <span className="font-mono text-xs tracking-wider text-[var(--accent-primary)]">
          {"// FORMAT NOT SUPPORTED"}
        </span>
        <p className="font-mono text-xs text-[var(--text-muted)] leading-relaxed">
          This video format may not be supported in your browser. Try Safari or
          download the file.
        </p>
        <a
          href={src}
          download
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md font-mono text-xs bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/40 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/20 hover:border-[var(--accent-primary)]/60 transition-colors duration-200"
        >
          <Download className="w-3.5 h-3.5" />
          Download
        </a>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/** Time (ms) to wait for the `canplay` event before showing the fallback. */
const CANPLAY_TIMEOUT_MS = 5_000;

export function VideoPlayer({
  src,
  mimeType,
  className,
  autoPlay = false,
  sampleId,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showFallback, setShowFallback] = useState(false);

  // Track whether canplay has fired so the timeout handler can bail out.
  const canPlayFiredRef = useRef(false);

  // Track whether a format issue report has already been sent for this src
  // to avoid duplicate reports on re-renders.
  const reportedRef = useRef(false);

  // -------------------------------------------------------------------------
  // canplay timeout + onerror detection
  // -------------------------------------------------------------------------

  const handleCanPlay = useCallback(() => {
    canPlayFiredRef.current = true;
  }, []);

  const handleError = useCallback(() => {
    setShowFallback(true);
  }, []);

  useEffect(() => {
    // Reset state when src changes (e.g. navigating between samples)
    canPlayFiredRef.current = false;
    reportedRef.current = false;
    setShowFallback(false);

    const timer = window.setTimeout(() => {
      if (!canPlayFiredRef.current) {
        setShowFallback(true);
      }
    }, CANPLAY_TIMEOUT_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [src]);

  // -------------------------------------------------------------------------
  // Report format issue to tracking API when fallback activates
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (!showFallback || !sampleId || reportedRef.current) return;
    reportedRef.current = true;

    fetch("/api/portal/format-issue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sampleId,
        mimeType,
        userAgent: navigator.userAgent,
      }),
    }).catch((err) => {
      // Best-effort -- do not disrupt user experience
      console.warn("[VideoPlayer] Failed to report format issue:", err);
    });
  }, [showFallback, sampleId, mimeType]);

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  if (showFallback) {
    return (
      <div
        className={
          className ??
          "rounded-lg overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-primary)]"
        }
      >
        <FormatFallback src={src} />
      </div>
    );
  }

  return (
    <div
      className={
        className ??
        "rounded-lg overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-primary)]"
      }
    >
      <video
        ref={videoRef}
        key={src}
        controls
        autoPlay={autoPlay}
        muted={autoPlay}
        preload="metadata"
        playsInline
        className="w-full h-full object-contain"
        style={{ colorScheme: "dark" }}
        onCanPlay={handleCanPlay}
        onError={handleError}
      >
        <source src={src} type={mimeType} />
      </video>
    </div>
  );
}
