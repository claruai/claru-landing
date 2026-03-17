"use client";

// ---------------------------------------------------------------------------
// VideoHero — Client Component
// ---------------------------------------------------------------------------
// Renders a looping hero video with IntersectionObserver-based play/pause,
// poster fallback, and graceful error handling. Used on solution pages when
// a pre-rendered Remotion composition video is available.
// ---------------------------------------------------------------------------

import { useCallback, useEffect, useRef, useState } from "react";

interface VideoHeroProps {
  /** Path to the MP4 video file (e.g. "/videos/sol-egocentric.mp4") */
  videoSrc: string;
  /** Optional poster image shown while loading or on error */
  posterSrc?: string;
  /** Optional badge text displayed above the video */
  badge?: string;
  /** Aspect ratio class (default: "aspect-video") */
  aspectRatio?: string;
}

export default function VideoHero({
  videoSrc,
  posterSrc,
  badge,
  aspectRatio = "aspect-video",
}: VideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = useState(false);

  // IntersectionObserver: pause video when off-screen for performance
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            // Autoplay blocked — silently fail
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  // If the video errors and there is no poster, hide the component entirely
  if (hasError && !posterSrc) {
    return null;
  }

  return (
    <section className="w-full px-4 pt-4 pb-8 sm:px-6 md:px-8 md:pt-6 md:pb-12">
      <div className="mx-auto max-w-6xl">
        {badge && (
          <div className="mb-3 flex justify-center">
            <span className="inline-block rounded-full border border-[var(--border-subtle)] bg-[var(--bg-primary)]/80 px-3 py-1 text-xs font-mono text-[var(--accent-primary)] tracking-wider uppercase">
              {badge}
            </span>
          </div>
        )}

        <div
          className={`${aspectRatio} relative w-full overflow-hidden rounded-2xl border border-[var(--border-subtle)]`}
        >
          {hasError && posterSrc ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={posterSrc}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <video
              ref={videoRef}
              src={videoSrc}
              poster={posterSrc}
              autoPlay
              muted
              loop
              playsInline
              onError={handleError}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </div>
      </div>
    </section>
  );
}
