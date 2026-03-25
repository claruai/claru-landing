"use client";

import { useRef, useState, useEffect, useCallback } from "react";

/* ─── Data ──────────────────────────────────────────── */

interface MarqueeItem {
  label: string;
  video: string;
}

const ROW_1_ITEMS: MarqueeItem[] = [
  { label: "EGOCENTRIC", video: "/videos/mosaic/mosaic-01.mp4" },
  { label: "EGOCENTRIC", video: "/videos/mosaic/mosaic-12.mp4" },
  { label: "GAME", video: "/videos/datasets/game-environment-loop.mp4" },
  { label: "DRIVING", video: "/videos/mosaic/mosaic-driving.mp4" },
  { label: "TRACKING", video: "/videos/datasets/object-identity-loop.mp4" },
  { label: "INDUSTRIAL", video: "/videos/mosaic/mosaic-teleop.mp4" },
  { label: "EGOCENTRIC", video: "/videos/mosaic/mosaic-20.mp4" },
  { label: "WAREHOUSE", video: "/videos/mosaic/mosaic-05.mp4" },
];

const ROW_2_ITEMS: MarqueeItem[] = [
  { label: "BBOX", video: "/videos/mosaic/annotated-bbox-01.mp4" },
  { label: "DEPTH MAP", video: "/videos/mosaic/annotated-depth-01.mp4" },
  { label: "SEGMENTATION", video: "/videos/mosaic/annotated-seg-01.mp4" },
  { label: "EGOCENTRIC", video: "/videos/mosaic/mosaic-24.mp4" },
  { label: "QUALITY", video: "/videos/datasets/video-quality-loop.mp4" },
  { label: "BBOX", video: "/videos/mosaic/annotated-bbox-02.mp4" },
  { label: "DEPTH MAP", video: "/videos/mosaic/annotated-depth-02.mp4" },
  { label: "EGOCENTRIC", video: "/videos/datasets/egocentric-activity-loop.mp4" },
];

/* ─── Lazy video: only plays when visible ───────────── */

function LazyVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const video = videoRef.current;
      if (!video) return;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    },
    []
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [handleIntersection]);

  return (
    <div ref={containerRef} className="h-full w-full">
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        preload="none"
        className="h-full w-full object-cover"
      />
    </div>
  );
}

/* ─── Single marquee card ───────────────────────────── */

function MarqueeCard({ item }: { item: MarqueeItem }) {
  return (
    <div className="relative flex-shrink-0 w-[200px] h-[130px] md:w-[280px] md:h-[180px] rounded-xl overflow-hidden">
      <LazyVideo src={item.video} />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-2.5 md:p-3">
        <span className="font-mono text-[10px] md:text-xs tracking-[0.15em] text-[#92B090]">
          {item.label}
        </span>
      </div>
    </div>
  );
}

/* ─── Marquee row ───────────────────────────────────── */

function MarqueeRow({
  items,
  direction,
}: {
  items: MarqueeItem[];
  direction: "left" | "right";
}) {
  const [paused, setPaused] = useState(false);
  // Duplicate for seamless loop
  const doubled = [...items, ...items];

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-16 md:w-32 bg-gradient-to-r from-[var(--bg-primary)] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-16 md:w-32 bg-gradient-to-l from-[var(--bg-primary)] to-transparent" />

      <div
        className={`flex gap-3 md:gap-4 ${
          direction === "left"
            ? "animate-marquee-scroll-left"
            : "animate-marquee-scroll-right"
        }`}
        style={{ animationPlayState: paused ? "paused" : "running" }}
      >
        {doubled.map((item, i) => (
          <MarqueeCard key={`${item.label}-${i}`} item={item} />
        ))}
      </div>
    </div>
  );
}

/* ─── Main section ──────────────────────────────────── */

export default function CatalogShowcase() {
  return (
    <section
      id="catalog"
      className="relative bg-[var(--bg-primary)] py-24 md:py-32 lg:py-40"
    >
      {/* Header */}
      <div className="container mx-auto px-6 mb-14 md:mb-20">
        <div className="v2-section-label mb-6">
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--accent-primary)]">
            {"// THE DATA"}
          </span>
        </div>
        <h2 className="max-w-2xl text-3xl font-bold leading-[1.1] tracking-[-0.02em] text-white md:text-4xl lg:text-[42px]">
          Vast footage spanning every environment{" "}
          <span className="text-white/40">your model needs.</span>
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/50 md:text-lg">
          Egocentric video. Game worlds. Driving scenes. Industrial robotics.
          Workplaces. All commercially licensed. All annotated.
        </p>
      </div>

      {/* Marquee rows — full bleed */}
      <div className="flex flex-col gap-3 md:gap-4">
        <MarqueeRow items={ROW_1_ITEMS} direction="left" />
        <MarqueeRow items={ROW_2_ITEMS} direction="right" />
      </div>

      {/* Closing line */}
      <div className="container mx-auto px-6 mt-14 md:mt-20">
        <p className="text-center font-mono text-sm text-white/50 tracking-wide">
          Thousands of hours. Growing daily.
        </p>
      </div>
    </section>
  );
}
