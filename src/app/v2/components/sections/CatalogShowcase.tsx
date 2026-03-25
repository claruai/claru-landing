"use client";

import { useRef, useEffect, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import Link from "next/link";
import { datasets, type Dataset } from "../../data/datasets";
import { useReducedMotion } from "../../hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current || value === 0) return;
    const el = ref.current;
    const obj = { val: 0 };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.to(obj, {
            val: value,
            duration: 1.5,
            ease: "power2.out",
            onUpdate: () => {
              if (value >= 1000) {
                el.textContent =
                  (obj.val / 1000).toFixed(obj.val >= 100000 ? 0 : 1) +
                  "K" +
                  suffix;
              } else {
                el.textContent = Math.round(obj.val) + suffix;
              }
            },
          });
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, suffix]);

  if (value === 0)
    return (
      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-0.5 font-mono text-xs text-white/40">
        Coming soon
      </span>
    );
  return (
    <span ref={ref} className="font-mono text-lg font-bold text-[var(--accent-primary)]">
      0
    </span>
  );
}

const modalityColors: Record<string, string> = {
  depth: "#4A9EDE",
  pose: "#DE8A4A",
  segmentation: "#9E6ADE",
  tracking: "#9E6ADE",
  "object-ids": "#9E6ADE",
  "physics-state": "#DE8A4A",
  "quality-scores": "#92B090",
  trajectories: "#DE8A4A",
};

function VideoThumbnail({ dataset }: { dataset: Dataset }) {
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
      threshold: 0.3,
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [handleIntersection]);

  const isGameEnv = dataset.id === "game-environment";

  return (
    <div ref={containerRef} className="relative h-56 lg:h-full">
      {dataset.video ? (
        <video
          ref={videoRef}
          src={dataset.video}
          poster={dataset.poster}
          muted
          autoPlay
          loop
          playsInline
          preload="none"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
      ) : (
        <img
          src={dataset.poster}
          alt={dataset.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          loading="lazy"
        />
      )}
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#121110]/70 opacity-0 transition-opacity duration-500 group-hover:opacity-100 lg:block hidden" />
      {/* Status badge */}
      {dataset.status === "coming_soon" && (
        <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/70 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white/50 backdrop-blur-md">
          Coming Soon
        </div>
      )}
      {dataset.status === "available" && (
        <div className="absolute left-3 top-3 rounded-full border border-[var(--accent-primary)]/20 bg-black/70 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[var(--accent-primary)] backdrop-blur-md">
          <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)] shadow-[0_0_6px_rgba(146,176,144,0.5)]" />
          Available
        </div>
      )}
      {/* Unique to Claru badge for Game Environment */}
      {isGameEnv && (
        <div className="absolute right-3 top-3 rounded-full border border-[var(--accent-primary)]/30 bg-black/80 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[var(--accent-primary)] backdrop-blur-md">
          Unique to Claru
        </div>
      )}
    </div>
  );
}

export default function CatalogShowcase() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reducedMotion || !cardsRef.current) return;
      if (window.innerWidth < 1024) return;

      const cards = gsap.utils.toArray<HTMLElement>(
        cardsRef.current.querySelectorAll(".catalog-card")
      );

      cards.forEach((card, i) => {
        const scale = 1 - (cards.length - i) * 0.025;

        ScrollTrigger.create({
          trigger: card,
          start: "top 80px",
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,
          endTrigger: cardsRef.current!,
          end: "bottom bottom",
          onEnter: () => {
            card.style.willChange = "transform";
            gsap.set(card, { scale });
          },
          onLeaveBack: () => {
            card.style.willChange = "auto";
            gsap.set(card, { scale: 1 });
          },
        });
      });

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("resize", refresh);
      window.addEventListener("orientationchange", refresh);
      return () => {
        window.removeEventListener("resize", refresh);
        window.removeEventListener("orientationchange", refresh);
      };
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  return (
    <section
      ref={sectionRef}
      id="catalog"
      className="relative bg-[var(--bg-primary)] py-32 md:py-40"
    >
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <div className="v2-section-label mb-6">
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--accent-primary)]">
              {"// DATA CATALOG"}
            </span>
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 className="max-w-lg text-3xl font-bold leading-[1.1] tracking-[-0.02em] text-white md:text-4xl lg:text-[42px]">
              Production-ready datasets{" "}
              <span className="text-white/40">with expert human annotation.</span>
            </h2>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 font-mono text-sm text-[var(--accent-primary)] transition-colors hover:text-[var(--accent-secondary)]"
            >
              View all 25+ datasets <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        <div ref={cardsRef} className="space-y-6">
          {datasets.map((dataset, i) => (
            <motion.div
              key={dataset.id}
              initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="catalog-card v2-card group !rounded-2xl !p-0 overflow-hidden lg:flex"
            >
              {/* Thumbnail */}
              <div className="relative shrink-0 overflow-hidden lg:w-80">
                <VideoThumbnail dataset={dataset} />
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col justify-between p-7 lg:p-8">
                <div>
                  <div className="mb-4 flex items-baseline gap-3">
                    <h3 className="text-xl font-bold tracking-[-0.01em] text-white lg:text-2xl">
                      {dataset.name}
                    </h3>
                    <CountUp value={dataset.countRaw} suffix="+" />
                  </div>

                  <div className="mb-5 flex flex-wrap gap-2">
                    {dataset.modalities.map((mod) => (
                      <span
                        key={mod}
                        className="rounded-full px-3 py-1 font-mono text-[11px]"
                        style={{
                          color: modalityColors[mod] || "#92B090",
                          backgroundColor: `${modalityColors[mod] || "#92B090"}08`,
                          border: `1px solid ${modalityColors[mod] || "#92B090"}18`,
                        }}
                      >
                        {mod}
                      </span>
                    ))}
                  </div>

                  <p className="text-sm leading-relaxed text-white/50">
                    {dataset.description}
                  </p>
                </div>

                <Link
                  href="/catalog"
                  className="mt-6 inline-flex items-center gap-2 font-mono text-sm font-medium text-[var(--accent-primary)] transition-all duration-300 hover:gap-3 hover:text-[var(--accent-secondary)]"
                >
                  View Dataset
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Spacer for pin compensation on desktop */}
        <div className="hidden lg:block" style={{ height: "50vh" }} />
      </div>
    </section>
  );
}
