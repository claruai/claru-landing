"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* -------------------------------------------------------------------------- */
/*  Categories — what frontier labs care about                                 */
/* -------------------------------------------------------------------------- */

interface Category {
  label: string;
  hook: string;
  video: string;
  color: string;
}

const CATEGORIES: Category[] = [
  { label: "Egocentric", hook: "First-person manipulation for embodied agents", video: "/videos/catalog/egocentric/clip_1.mp4", color: "#92B090" },
  { label: "Gaming", hook: "Sim-to-real environments for RL and world models", video: "/videos/catalog/game-env/clip_1.mp4", color: "#4ADE80" },
  { label: "Driving", hook: "Urban navigation and scene understanding at scale", video: "/videos/catalog/driving/clip_1.mp4", color: "#4A9EDE" },
  { label: "Cinematic", hook: "Diverse angles and motion for video generation", video: "/videos/catalog/cinematic/clip_1.mp4", color: "#DE8A4A" },
  { label: "Manufacturing", hook: "Factory floor data for industrial automation", video: "/videos/catalog/circle/factory.mp4", color: "#DE4A6A" },
  { label: "Cooking", hook: "Fine-grained manipulation and activity recognition", video: "/videos/catalog/circle/cooking.mp4", color: "#DEA84A" },
  { label: "Warehouse", hook: "Pick-and-place, logistics, structured navigation", video: "/videos/catalog/circle/warehouse.mp4?v=2", color: "#4ADEDE" },
  { label: "Human Activity", hook: "Pose, action, and behavior across real environments", video: "/videos/catalog/circle/human.mp4?v=2", color: "#9E6ADE" },
];

/* -------------------------------------------------------------------------- */
/*  Main component — pinned circle that fades in at viewport center            */
/* -------------------------------------------------------------------------- */

export default function CatalogShowcase() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLDivElement | null)[]>([]);
  const orbitRingRef = useRef<SVGSVGElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);

  const setThumbRef = useCallback(
    (el: HTMLDivElement | null, i: number) => {
      thumbRefs.current[i] = el;
    },
    []
  );

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* GSAP animations */
  useGSAP(
    () => {
      if (reducedMotion || !sectionRef.current || !circleRef.current) return;

      const thumbs = thumbRefs.current.filter(Boolean) as HTMLDivElement[];

      // Phase 1 — Circle materializes as the section enters the viewport
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          end: "top 15%",
          scrub: 0.8,
        },
      });

      // Circle wrapper scales in with blur clear
      tl.fromTo(
        circleRef.current,
        { scale: 0.3, opacity: 0, filter: "blur(16px)" },
        { scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.6, ease: "power3.out" },
        0
      );

      // Orbit ring draws in with expanding scale
      if (orbitRingRef.current) {
        tl.fromTo(
          orbitRingRef.current,
          { scale: 0.5, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "power2.out" },
          0.1
        );
      }

      // Background glow pulses in
      if (glowRef.current) {
        tl.fromTo(
          glowRef.current,
          { scale: 0.3, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.6, ease: "power2.out" },
          0.05
        );
      }

      // Staggered thumbnail entrances — each flies in from its orbit angle
      thumbs.forEach((thumb, i) => {
        const angle = (i / CATEGORIES.length) * 360;
        const rad = (angle * Math.PI) / 180;
        // Fly in from further out along the radial direction
        const flyX = Math.sin(rad) * 120;
        const flyY = -Math.cos(rad) * 120;

        tl.fromTo(
          thumb,
          {
            opacity: 0,
            scale: 0,
            x: flyX,
            y: flyY,
          },
          {
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
            duration: 0.35,
            ease: "back.out(1.4)",
          },
          0.15 + i * 0.06
        );
      });

      // Center content fades up after thumbnails land
      if (centerRef.current) {
        tl.fromTo(
          centerRef.current,
          { opacity: 0, y: 24, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "power3.out" },
          0.55
        );
      }

      // Phase 2 — Pin for breathing room
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=40%",
        pin: stickyRef.current || undefined,
        pinSpacing: true,
      });

      // Continuous subtle glow pulse on the orbit ring (non-scroll-linked)
      if (orbitRingRef.current) {
        gsap.to(orbitRingRef.current, {
          opacity: 0.6,
          duration: 2.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }

      // Continuous background glow breathing
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          scale: 1.08,
          opacity: 0.8,
          duration: 3,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }
    },
    { dependencies: [reducedMotion, isMobile] }
  );

  const radius = isMobile ? 95 : 320;
  const thumbSize = isMobile ? 50 : 114;
  const orbitDuration = reducedMotion ? 0 : 40;

  /* ---- Mobile bento grid ---- */
  if (isMobile) {
    return (
      <section id="catalog" className="relative bg-[var(--bg-primary)] px-5 py-20">
        {/* Headline */}
        <div className="mb-8 text-center">
          <h2
            className="font-bold leading-[1] tracking-[-0.04em] text-white"
            style={{ fontSize: "clamp(28px, 8vw, 40px)" }}
          >
            Millions of clips.
          </h2>
          <p className="mt-1 text-lg tracking-[-0.02em] text-white/35">
            Every environment.
          </p>
        </div>

        {/* Bento grid — 2 cols, varying heights */}
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map((cat, i) => {
            const isLarge = i === 0 || i === 5; // First and 6th cards span more height
            return (
              <div
                key={cat.label}
                className={`group relative overflow-hidden rounded-2xl ${isLarge ? "row-span-2" : ""}`}
                style={{
                  height: isLarge ? 220 : 100,
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <video
                  src={cat.video}
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="none"
                  className="h-full w-full object-cover"
                />
                {/* Dark overlay for text */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                {/* Label */}
                <div className="absolute bottom-2 left-2.5">
                  <span
                    className="font-mono text-[10px] font-bold uppercase tracking-[0.1em]"
                    style={{ color: cat.color }}
                  >
                    {cat.label}
                  </span>
                  <p className="mt-0.5 text-[9px] leading-tight text-white/40">
                    {cat.hook}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Link
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-5 py-2.5 font-mono text-[11px] text-white/30 transition-all duration-300 hover:text-[var(--accent-primary)]"
          >
            Book a Call
            <span className="text-[var(--accent-primary)]">&rarr;</span>
          </Link>
        </div>
      </section>
    );
  }

  /* ---- Desktop orbit ---- */
  return (
    <section
      ref={sectionRef}
      id="catalog"
      className="relative overflow-hidden bg-[var(--bg-primary)]"
    >
      {/* Sticky container */}
      <div
        ref={stickyRef}
        className="flex h-screen items-center justify-center overflow-hidden"
      >
        {/* Circle wrapper — GSAP controls scale/opacity */}
        <div
          ref={circleRef}
          className="relative mx-auto flex-shrink-0"
          style={{
            width: (radius + thumbSize) * 2 + 60,
            height: (radius + thumbSize) * 2 + 60,
            maxWidth: "100vw",
            willChange: "transform, opacity, filter",
          }}
        >
          {/* Radial glow — large soft halo */}
          <div
            ref={glowRef}
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: radius * 2 + 280,
              height: radius * 2 + 280,
              background:
                "radial-gradient(circle, rgba(146,176,144,0.08) 0%, rgba(146,176,144,0.03) 35%, transparent 60%)",
              filter: "blur(60px)",
              willChange: "transform, opacity",
            }}
          />

          {/* Secondary inner glow */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: radius * 2 - 40,
              height: radius * 2 - 40,
              background:
                "radial-gradient(circle, rgba(146,176,144,0.04) 0%, transparent 70%)",
              filter: "blur(30px)",
            }}
          />

          {/* Orbit ring — animated dashed stroke with gradient */}
          <svg
            ref={orbitRingRef}
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: radius * 2 + 4,
              height: radius * 2 + 4,
              willChange: "transform, opacity",
            }}
            viewBox={`0 0 ${radius * 2 + 4} ${radius * 2 + 4}`}
          >
            <defs>
              <linearGradient id="orbit-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(146,176,144,0.25)" />
                <stop offset="25%" stopColor="rgba(146,176,144,0.06)" />
                <stop offset="50%" stopColor="rgba(146,176,144,0.2)" />
                <stop offset="75%" stopColor="rgba(146,176,144,0.04)" />
                <stop offset="100%" stopColor="rgba(146,176,144,0.25)" />
              </linearGradient>
            </defs>
            <circle
              cx={radius + 2}
              cy={radius + 2}
              r={radius}
              fill="none"
              stroke="url(#orbit-grad)"
              strokeWidth="1.5"
              strokeDasharray="8 12"
              className="catalog-ring-rotate"
            />
          </svg>

          {/* Second orbit ring — outer subtle solid */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: radius * 2 + 60,
              height: radius * 2 + 60,
              border: "1px solid rgba(146,176,144,0.03)",
            }}
          />

          {/* Orbiting container — rotates all thumbnails together */}
          <div
            className="absolute left-1/2 top-1/2"
            style={{
              width: 0,
              height: 0,
              animation: orbitDuration ? `catalog-orbit ${orbitDuration}s linear infinite` : "none",
            }}
          >
            {CATEGORIES.map((cat, i) => {
              const angle = (i / CATEGORIES.length) * 360;
              const rad = (angle * Math.PI) / 180;
              const x = Math.sin(rad) * radius;
              const y = -Math.cos(rad) * radius;

              // Depth simulation — thumbnails near the "back" (top) are slightly smaller/dimmer
              const depthFactor = 0.88 + 0.12 * ((Math.cos(rad) + 1) / 2);

              return (
                <div
                  key={cat.label}
                  className="absolute"
                  style={{
                    transform: `translate(${x - thumbSize / 2}px, ${y - thumbSize / 2}px)`,
                  }}
                >
                  {/* Counter-rotate to keep upright */}
                  <div
                    className="group"
                    style={{
                      animation: orbitDuration
                        ? `catalog-counter-orbit ${orbitDuration}s linear infinite`
                        : "none",
                    }}
                  >
                    <div
                      ref={(el) => setThumbRef(el, i)}
                      className="catalog-thumb relative cursor-pointer overflow-hidden rounded-2xl"
                      style={{
                        width: thumbSize,
                        height: thumbSize,
                        border: "1px solid rgba(255,255,255,0.1)",
                        boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 0 0px ${cat.color}00`,
                        transform: `scale(${depthFactor})`,
                        willChange: "transform, box-shadow",
                      }}
                    >
                      <video
                        src={cat.video}
                        muted
                        loop
                        playsInline
                        autoPlay
                        preload="none"
                        className="h-full w-full object-cover"
                      />
                      {/* Hover glow border + shadow */}
                      <div
                        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-all duration-500 group-hover:opacity-100"
                        style={{
                          boxShadow: `inset 0 0 0 2px ${cat.color}70, 0 0 30px ${cat.color}25, 0 0 60px ${cat.color}10`,
                        }}
                      />
                      {/* Subtle color wash on hover */}
                      <div
                        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-30"
                        style={{
                          background: `linear-gradient(135deg, ${cat.color}20 0%, transparent 60%)`,
                        }}
                      />
                    </div>
                    <div className="mt-1.5 text-center md:mt-2" style={{ maxWidth: isMobile ? thumbSize + 20 : undefined }}>
                      <span
                        className="block truncate font-mono text-[9px] font-bold uppercase tracking-[0.08em] transition-all duration-300 group-hover:tracking-[0.12em] md:text-[11px] md:tracking-[0.1em] md:group-hover:tracking-[0.15em]"
                        style={{ color: cat.color }}
                      >
                        {cat.label}
                      </span>
                      {/* Hover hook — appears below label */}
                      <p className="mt-1 hidden max-w-[160px] mx-auto text-[9px] leading-tight text-white/0 transition-all duration-300 group-hover:text-white/45 md:block md:text-[10px]">
                        {cat.hook}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Center content — bolder typography */}
          <div
            ref={centerRef}
            className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center"
            style={{ willChange: "transform, opacity" }}
          >
            <h2
              className="font-bold leading-[1] tracking-[-0.04em] text-white"
              style={{ fontSize: "clamp(28px, 4.5vw, 52px)" }}
            >
              Millions of clips.
            </h2>
            <p
              className="mt-1 leading-[1.1] tracking-[-0.02em] text-white/35"
              style={{ fontSize: "clamp(18px, 3vw, 32px)" }}
            >
              Every environment.
            </p>
            <Link
              href="#contact"
              className="group/cta mt-4 inline-flex items-center gap-2.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-5 py-2 font-mono text-[11px] text-white/30 backdrop-blur-sm transition-all duration-400 hover:border-[var(--accent-primary)]/20 hover:bg-[var(--accent-primary)]/5 hover:text-[var(--accent-primary)] md:text-[12px]"
            >
              Book a Call
              <span className="inline-block text-[var(--accent-primary)] transition-transform duration-300 group-hover/cta:translate-x-1">
                &rarr;
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Keyframes + utility styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes catalog-orbit {
              from { transform: translate(-50%, -50%) rotate(0deg); }
              to { transform: translate(-50%, -50%) rotate(360deg); }
            }
            @keyframes catalog-counter-orbit {
              from { transform: rotate(0deg); }
              to { transform: rotate(-360deg); }
            }
            @keyframes catalog-ring-spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            .catalog-ring-rotate {
              animation: catalog-ring-spin 90s linear infinite;
              transform-origin: center;
            }
            .catalog-thumb {
              transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                          box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .catalog-thumb:hover {
              transform: scale(1.12) !important;
              box-shadow: 0 12px 40px rgba(0,0,0,0.7),
                          0 0 40px rgba(146,176,144,0.08) !important;
            }
          `,
        }}
      />
    </section>
  );
}
