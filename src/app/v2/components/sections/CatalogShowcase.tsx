"use client";

import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { datasets } from "../../data/datasets";
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

  if (value === 0) return <span className="font-mono text-[var(--accent-primary)]">Coming soon</span>;
  return (
    <span ref={ref} className="font-mono text-[var(--accent-primary)]">
      0
    </span>
  );
}

export default function CatalogShowcase() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reducedMotion || !cardsRef.current) return;

      // Only pin on lg+ screens
      if (window.innerWidth < 1024) return;

      const cards = gsap.utils.toArray<HTMLElement>(
        cardsRef.current.querySelectorAll(".catalog-card")
      );

      cards.forEach((card, i) => {
        // Scale down cards behind
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
      className="relative bg-[var(--bg-primary)] py-24"
    >
      <div className="container mx-auto px-6">
        <span className="mb-8 block font-mono text-sm text-[var(--accent-primary)]">
          {"// DATA CATALOG"}
        </span>

        <div ref={cardsRef} className="space-y-6">
          {datasets.map((dataset) => (
            <div
              key={dataset.id}
              className="catalog-card group rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 transition-all hover:border-[var(--accent-primary)]/40 hover:shadow-[0_0_24px_var(--accent-glow)] hover:-translate-y-1 lg:flex lg:gap-6"
            >
              {/* Thumbnail */}
              <div className="relative mb-4 shrink-0 overflow-hidden rounded-lg lg:mb-0 lg:h-48 lg:w-72">
                <img
                  src={dataset.poster}
                  alt={dataset.name}
                  className="h-48 w-full object-cover transition-transform group-hover:scale-[1.02] lg:h-full"
                  loading="lazy"
                />
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <div className="mb-2 flex items-baseline gap-3">
                    <h3 className="text-2xl font-bold text-white">
                      {dataset.name}
                    </h3>
                    <CountUp value={dataset.countRaw} suffix="+" />
                  </div>

                  <div className="mb-3 flex flex-wrap gap-2">
                    {dataset.modalities.map((mod) => (
                      <span
                        key={mod}
                        className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-3 py-0.5 font-mono text-xs text-white/60"
                      >
                        {mod}
                      </span>
                    ))}
                  </div>

                  <p className="text-sm text-white/70">
                    {dataset.description}
                  </p>
                </div>

                <Link
                  href="/catalog"
                  className="mt-4 inline-flex items-center gap-1 font-mono text-sm text-[var(--accent-primary)] transition-colors hover:text-[var(--accent-secondary)]"
                >
                  View Dataset <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Spacer for pin compensation on desktop */}
        <div className="hidden lg:block" style={{ height: "50vh" }} />

        <div className="mt-12 text-center">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 font-mono text-base text-[var(--accent-primary)] transition-colors hover:text-[var(--accent-secondary)]"
          >
            View all 25+ datasets <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
