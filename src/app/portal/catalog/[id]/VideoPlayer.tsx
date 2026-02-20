"use client";

// =============================================================================
// VideoPlayer -- Client component for inline video playback
// Dark terminal-styled player with native controls
// =============================================================================

interface VideoPlayerProps {
  src: string;
  mimeType: string;
}

export function VideoPlayer({ src, mimeType }: VideoPlayerProps) {
  return (
    <div className="rounded-lg overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-primary)]">
      <video
        controls
        preload="metadata"
        playsInline
        className="w-full h-auto max-h-[480px] object-contain"
        style={{ colorScheme: "dark" }}
      >
        <source src={src} type={mimeType} />
        <p className="p-4 font-mono text-xs text-[var(--text-muted)]">
          Your browser does not support the video element.
        </p>
      </video>
    </div>
  );
}
