"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import type { DatasetSample } from "@/types/data-catalog";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface SampleData {
  sample: DatasetSample;
  signedUrl: string;
}

interface VideoShowcaseClientProps {
  samplesWithUrls: SampleData[];
  heading: string;
  subheading: string;
}

// ---------------------------------------------------------------------------
// Video card — auto-play on hover, subcategory label, metadata hint
// ---------------------------------------------------------------------------

function VideoCard({ sample, signedUrl }: SampleData) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  const metadata = sample.metadata_json ?? {};
  const subcategory =
    typeof metadata.subcategory === "string" ? metadata.subcategory : null;
  const durationSeconds =
    typeof metadata.duration_seconds === "number"
      ? metadata.duration_seconds
      : sample.duration_seconds;

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(el);
        }
      },
      { rootMargin: "200px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleMouseEnter = useCallback(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, []);

  function formatDuration(seconds: number): string {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  return (
    <div
      ref={cardRef}
      className="group overflow-hidden rounded-lg border transition-all duration-300 hover:border-[#92B090]/40 hover:shadow-[0_0_20px_rgba(146,176,144,0.08)]"
      style={{ backgroundColor: "#121210", borderColor: "#2a2a28" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Video */}
      <div className="relative aspect-video overflow-hidden bg-black">
        <video
          ref={videoRef}
          src={isInView ? signedUrl : undefined}
          muted
          playsInline
          loop
          preload="metadata"
          controls
          className="h-full w-full object-cover"
          style={{ colorScheme: "dark" }}
        />

        {/* Subcategory badge — top left */}
        {subcategory && (
          <div className="absolute left-2 top-2 z-10">
            <span
              className="inline-block rounded bg-black/60 px-2 py-0.5 text-[10px] leading-tight backdrop-blur-sm"
              style={{
                fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
                color: "rgba(255, 255, 255, 0.9)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {subcategory}
            </span>
          </div>
        )}

        {/* Duration badge — bottom right */}
        {durationSeconds != null && durationSeconds > 0 && (
          <div className="absolute bottom-2 right-2 z-10">
            <span
              className="inline-block rounded bg-black/70 px-1.5 py-0.5 text-[10px] tabular-nums leading-tight"
              style={{
                fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
                color: "rgba(255, 255, 255, 0.9)",
              }}
            >
              {formatDuration(durationSeconds)}
            </span>
          </div>
        )}
      </div>

      {/* Footer — hint at structured data */}
      <div className="border-t border-[#2a2a28] px-3 py-2.5">
        <p
          className="text-[11px]"
          style={{
            fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
            color: "rgba(255, 255, 255, 0.4)",
          }}
        >
          Structured annotations &amp; metadata available
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function VideoShowcaseClient({
  samplesWithUrls,
  heading,
  subheading,
}: VideoShowcaseClientProps) {
  return (
    <section className="px-6 py-12 md:px-8 md:py-16 lg:px-12">
      <div className="mx-auto max-w-[900px]">
        <h2
          className="mb-1 text-2xl font-semibold tracking-tight md:text-3xl"
          style={{
            fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
            color: "#FFFFFF",
          }}
        >
          {heading}
        </h2>
        <p
          className="mb-10 text-sm"
          style={{ color: "rgba(255, 255, 255, 0.55)" }}
        >
          {subheading}
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {samplesWithUrls.map((item, i) => (
            <motion.div
              key={item.sample.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <VideoCard sample={item.sample} signedUrl={item.signedUrl} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
