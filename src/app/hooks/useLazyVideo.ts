"use client";

import { useEffect, type RefObject } from "react";

/**
 * Lazy-play hook for autoplay videos.
 *
 * - Pauses the video when scrolled off-screen.
 * - Plays it when at least 30% in view.
 * - Optionally writes a timecode string into a separate ref's `textContent`
 *   throttled to ~4 Hz, so the cosmetic HUD never re-renders React.
 *
 * Usage:
 *   const videoRef = useRef<HTMLVideoElement>(null);
 *   const tcRef = useRef<HTMLSpanElement>(null);
 *   useLazyVideo(videoRef, { tcRef });
 *   return (
 *     <>
 *       <video ref={videoRef} ... />
 *       <span ref={tcRef}>00:00:00</span>
 *     </>
 *   );
 */
export function useLazyVideo(
  videoRef: RefObject<HTMLVideoElement | null>,
  opts: { tcRef?: RefObject<HTMLElement | null> } = {},
): void {
  const { tcRef } = opts;

  // 1) IntersectionObserver: play in view, pause off-screen.
  // Reactive to prefers-reduced-motion — if the user toggles their OS
  // preference mid-session we tear down or re-attach the observer so
  // the page respects the new setting without a refresh.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    let io: IntersectionObserver | null = null;

    const attach = () => {
      if (io) return;
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              // play() can throw on Safari if the user hasn't interacted, so
              // we swallow rejections. Muted+playsInline videos almost never
              // hit this in practice.
              void v.play().catch(() => {});
            } else {
              v.pause();
            }
          }
        },
        { threshold: 0.3 },
      );
      io.observe(v);
    };

    const detach = () => {
      io?.disconnect();
      io = null;
      v.pause();
    };

    const apply = () => {
      if (mql.matches) detach();
      else attach();
    };

    apply();
    mql.addEventListener("change", apply);
    return () => {
      mql.removeEventListener("change", apply);
      io?.disconnect();
    };
  }, [videoRef]);

  // 2) Throttled timecode written to a ref's textContent (no React state).
  useEffect(() => {
    const v = videoRef.current;
    const tc = tcRef?.current;
    if (!v || !tc) return;

    let last = 0;
    const onTime = () => {
      const now = performance.now();
      if (now - last < 250) return; // ~4 Hz
      last = now;
      const s = v.currentTime;
      const mm = Math.floor(s / 60).toString().padStart(2, "0");
      const ss = Math.floor(s % 60).toString().padStart(2, "0");
      const ff = Math.floor((s % 1) * 24).toString().padStart(2, "0");
      tc.textContent = `${mm}:${ss}:${ff}`;
    };
    v.addEventListener("timeupdate", onTime);
    return () => v.removeEventListener("timeupdate", onTime);
  }, [videoRef, tcRef]);
}
