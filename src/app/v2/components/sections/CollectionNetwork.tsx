"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ------------------------------------------------------------------ */
/*  Marker data — 18 global collection hubs with live video clips     */
/* ------------------------------------------------------------------ */
const markerData = [
  {
    lat: 37.7749,
    lng: -122.4194,
    city: "San Francisco",
    label: "Kitchens in San Francisco",
    videoSrc: "/videos/globe/real-sf.mp4",
  },
  {
    lat: 19.076,
    lng: 72.8777,
    city: "Mumbai",
    label: "Kitchens in Mumbai",
    videoSrc: "/videos/globe/real-mumbai.mp4",
  },
  {
    lat: 10.8231,
    lng: 106.6297,
    city: "Ho Chi Minh",
    label: "Streets in Ho Chi Minh",
    videoSrc: "/videos/globe/real-hcmc.mp4",
  },
  {
    lat: -23.5505,
    lng: -46.6333,
    city: "São Paulo",
    label: "Workshops in São Paulo",
    videoSrc: "/videos/globe/real-saopaulo.mp4",
  },
  {
    lat: 50.4501,
    lng: 30.5234,
    city: "Kyiv",
    label: "Kitchens in Kyiv",
    videoSrc: "/videos/globe/real-kyiv.mp4",
  },
  {
    lat: 6.5244,
    lng: 3.3792,
    city: "Lagos",
    label: "Warehouses in Lagos",
    videoSrc: "/videos/globe/real-lagos.mp4",
  },
  {
    lat: 14.5995,
    lng: 120.9842,
    city: "Manila",
    label: "Markets in Manila",
    videoSrc: "/videos/globe/real-manila.mp4",
  },
  {
    lat: 13.7563,
    lng: 100.5018,
    city: "Bangkok",
    label: "Streets in Bangkok",
    videoSrc: "/videos/globe/real-bangkok.mp4",
  },
  {
    lat: 51.5074,
    lng: -0.1278,
    city: "London",
    label: "Homes in London",
    videoSrc: "/videos/globe/real-london.mp4",
  },
  {
    lat: 19.4326,
    lng: -99.1332,
    city: "Mexico City",
    label: "Gardens in Mexico City",
    videoSrc: "/videos/globe/real-mexico.mp4",
  },
  {
    lat: -6.2088,
    lng: 106.8456,
    city: "Jakarta",
    label: "Stores in Jakarta",
    videoSrc: "/videos/globe/real-jakarta.mp4",
  },
  {
    lat: -1.2921,
    lng: 36.8219,
    city: "Nairobi",
    label: "Homes in Nairobi",
    videoSrc: "/videos/globe/real-nairobi.mp4",
  },
  {
    lat: 30.0444,
    lng: 31.2357,
    city: "Cairo",
    label: "Garages in Cairo",
    videoSrc: "/videos/globe/real-cairo.mp4",
  },
  {
    lat: 23.8103,
    lng: 90.4125,
    city: "Dhaka",
    label: "Kitchens in Dhaka",
    videoSrc: "/videos/globe/real-dhaka.mp4",
  },
  {
    lat: -12.0464,
    lng: -77.0428,
    city: "Lima",
    label: "Offices in Lima",
    videoSrc: "/videos/globe/real-lima.mp4",
  },
  {
    lat: 4.711,
    lng: -74.0721,
    city: "Bogotá",
    label: "Outdoors in Bogotá",
    videoSrc: "/videos/globe/real-bogota.mp4",
  },
  {
    lat: 24.8607,
    lng: 67.0011,
    city: "Karachi",
    label: "Parking in Karachi",
    videoSrc: "/videos/globe/real-karachi.mp4",
  },
  {
    lat: 5.6037,
    lng: -0.187,
    city: "Accra",
    label: "Homes in Accra",
    videoSrc: "/videos/globe/real-accra.mp4",
  },
];

const sfHub: [number, number] = [37.7749, -122.4194];
const sageRGB: [number, number, number] = [146 / 255, 176 / 255, 144 / 255];

const environments = [
  { name: "Kitchens", desc: "Domestic prep & cooking" },
  { name: "Streets & Markets", desc: "Urban activity" },
  { name: "Warehouses", desc: "Industrial logistics" },
  { name: "Workshops", desc: "Crafting & assembly" },
  { name: "Homes & Gardens", desc: "Residential spaces" },
  { name: "Offices & Stores", desc: "Workplace & retail" },
];

/* ------------------------------------------------------------------ */
/*  Lat/Lng -> screen-space projection (matches COBE camera)          */
/* ------------------------------------------------------------------ */
function latLngToScreen(
  lat: number,
  lng: number,
  phi: number,
  theta: number,
  size: number,
  offsetX: number,
  offsetY: number
): { x: number; y: number; visible: boolean; depth: number } {
  const latRad = (lat * Math.PI) / 180;
  const lngRad = (lng * Math.PI) / 180;

  const x = Math.cos(latRad) * Math.sin(lngRad);
  const y = Math.sin(latRad);
  const z = Math.cos(latRad) * Math.cos(lngRad);

  const cosPhi = Math.cos(phi);
  const sinPhi = Math.sin(phi);
  const cosTheta = Math.cos(theta);
  const sinTheta = Math.sin(theta);

  const rx = x * cosPhi + z * sinPhi;
  const ry = y * cosTheta - (-x * sinPhi + z * cosPhi) * sinTheta;
  const rz = y * sinTheta + (-x * sinPhi + z * cosPhi) * cosTheta;

  // visible when facing camera; depth used for opacity falloff
  const visible = rz > 0.05;
  const halfSize = size / 2;

  return {
    x: offsetX + rx * halfSize,
    y: offsetY - ry * halfSize,
    visible,
    depth: rz,
  };
}

/* ------------------------------------------------------------------ */
/*  Thumbnail card size                                                */
/* ------------------------------------------------------------------ */
const THUMB_SIZE = 56;
const THUMB_SIZE_MOBILE = 44;

/* ------------------------------------------------------------------ */
/*  Animated hub counter — ticks up when in view                       */
/* ------------------------------------------------------------------ */
function HubCounter({ inView, reducedMotion }: { inView: boolean; reducedMotion: boolean }) {
  const [count, setCount] = useState(0);
  const target = 18;

  useEffect(() => {
    if (!inView || reducedMotion) {
      setCount(target);
      return;
    }
    setCount(0);
    const duration = 1000;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, reducedMotion]);

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <div className="flex items-center gap-2">
        <span className="font-mono text-2xl font-black tabular-nums text-[var(--accent-primary)] md:text-4xl">
          10,000+
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35 md:text-[11px]">
          collectors
        </span>
      </div>
      <span className="hidden text-white/15 sm:inline">|</span>
      <div className="flex items-center gap-2">
        <span className="font-mono text-2xl font-black tabular-nums text-[var(--accent-primary)] md:text-4xl">
          {count}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35 md:text-[11px]">
          cities
        </span>
      </div>
      <span className="hidden text-white/15 sm:inline">|</span>
      <div className="flex items-center gap-2">
        <span className="font-mono text-2xl font-black tabular-nums text-[var(--accent-primary)] md:text-4xl">
          6
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35 md:text-[11px]">
          continents
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function CollectionNetwork() {
  const reducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const globeWrapperRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const phiRef = useRef(0);
  const rafRef = useRef<number>(0);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // For triggering the hub counter animation
  const counterRef = useRef<HTMLDivElement>(null);
  const counterInView = useInView(counterRef, { once: true, margin: "-60px" });

  // Refs for each thumbnail DOM element — avoids React re-renders per frame
  const thumbRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setThumbRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      thumbRefs.current[index] = el;
    },
    []
  );

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ---------------------------------------------------------------- */
  /*  GSAP: Orbital approach — globe materializes from a glow point    */
  /* ---------------------------------------------------------------- */
  const glowRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (reducedMotion || !sectionRef.current || !globeWrapperRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 85%",
        end: "top -5%",
        scrub: 1,
      },
    });

    // Phase 1: Globe materializes from a bright dot — scaling up from tiny with blur clearing
    tl.fromTo(
      globeWrapperRef.current,
      {
        scale: 0.15,
        opacity: 0,
        y: 120,
        filter: "blur(20px) brightness(2)",
      },
      {
        scale: 0.6,
        opacity: 0.7,
        y: 40,
        filter: "blur(6px) brightness(1.3)",
        duration: 0.4,
        ease: "power1.out",
      },
      0
    );

    // Phase 2: Globe settles into final position — blur clears, full scale
    tl.to(
      globeWrapperRef.current,
      {
        scale: 1,
        opacity: 1,
        y: 0,
        filter: "blur(0px) brightness(1)",
        duration: 0.6,
        ease: "power2.out",
      },
      0.4
    );

    // Glow intensifies during approach then settles
    if (glowRef.current) {
      tl.fromTo(
        glowRef.current,
        { scale: 0.3, opacity: 0 },
        { scale: 1.8, opacity: 1, duration: 0.5, ease: "power1.out" },
        0
      );
      tl.to(
        glowRef.current,
        { scale: 1, opacity: 0.7, duration: 0.5, ease: "power2.inOut" },
        0.5
      );
    }
  }, { dependencies: [reducedMotion] });

  /* ---------------------------------------------------------------- */
  /*  GSAP: Parallax headline — floats up at different scroll rate     */
  /* ---------------------------------------------------------------- */
  useGSAP(() => {
    if (reducedMotion || !headlineRef.current || !sectionRef.current) return;

    gsap.to(headlineRef.current, {
      y: -60,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }, { dependencies: [reducedMotion] });

  useEffect(() => {
    if (reducedMotion || !canvasRef.current) return;

    const testCanvas = document.createElement("canvas");
    const gl =
      testCanvas.getContext("webgl") ||
      testCanvas.getContext("experimental-webgl");
    if (!gl) {
      setHasWebGL(false);
      return;
    }

    let destroyed = false;
    let globe: {
      update: (state: Record<string, unknown>) => void;
      destroy: () => void;
    } | null = null;

    import("cobe").then((COBE) => {
      if (destroyed || !canvasRef.current) return;

      const size = isMobile ? 340 : 600;
      canvasRef.current.width = size * 2;
      canvasRef.current.height = size * 2;

      globe = COBE.default(canvasRef.current, {
        width: size * 2,
        height: size * 2,
        phi: 0,
        theta: 0.3,
        dark: 1,
        diffuse: 1.2,
        mapSamples: isMobile ? 8000 : 20000,
        mapBrightness: 6,
        baseColor: [0.05, 0.05, 0.04],
        markerColor: sageRGB,
        glowColor: [0.05, 0.08, 0.05],
        markers: markerData.map((m) => ({
          location: [m.lat, m.lng] as [number, number],
          size: 0.06,
        })),
        arcs: markerData
          .filter((m) => m.city !== "San Francisco")
          .map((m) => ({
            from: [m.lat, m.lng] as [number, number],
            to: sfHub,
          })),
        arcColor: sageRGB,
        arcWidth: 1,
        arcHeight: 0.3,
        devicePixelRatio: 2,
      });

      /* -------------------------------------------------------------- */
      /*  Animation loop — direct DOM updates, no React state           */
      /* -------------------------------------------------------------- */
      let frameCount = 0;
      const animate = () => {
        if (destroyed || !globe) return;

        phiRef.current += 0.003;
        globe.update({ phi: phiRef.current });
        frameCount++;

        const canvasEl = canvasRef.current;
        const containerEl = containerRef.current;
        if (canvasEl && containerEl) {
          const canvasRect = canvasEl.getBoundingClientRect();
          const containerRect = containerEl.getBoundingClientRect();

          const offsetX =
            canvasRect.left - containerRect.left + canvasRect.width / 2;
          const offsetY =
            canvasRect.top - containerRect.top + canvasRect.height / 2;

          const thumbSize = isMobile ? THUMB_SIZE_MOBILE : THUMB_SIZE;
          const halfThumb = thumbSize / 2;

          // Only check video play/pause every ~30 frames to avoid perf hit
          const shouldCheckVideos = frameCount % 30 === 0;

          for (let i = 0; i < markerData.length; i++) {
            const el = thumbRefs.current[i];
            if (!el) continue;

            const m = markerData[i];
            const pos = latLngToScreen(
              m.lat,
              m.lng,
              phiRef.current,
              0.3,
              canvasRect.width,
              offsetX,
              offsetY
            );

            // Smooth opacity based on depth (rz). Fully visible when facing
            // camera (depth ~1), starts fading around 0.3, hidden at 0.
            const opacity = pos.visible
              ? Math.min(1, Math.max(0, (pos.depth - 0.05) / 0.35)) * 0.95
              : 0;

            el.style.transform = `translate(${pos.x - halfThumb}px, ${pos.y - thumbSize - 16}px)`;
            el.style.opacity = String(opacity);
            el.style.pointerEvents = opacity > 0.3 ? "auto" : "none";

            // Lazy video play/pause based on visibility
            if (shouldCheckVideos) {
              const video = el.querySelector("video[data-globe-video]") as HTMLVideoElement | null;
              if (video) {
                if (opacity > 0.3 && video.paused) {
                  video.play().catch(() => {});
                } else if (opacity <= 0.1 && !video.paused) {
                  video.pause();
                }
              }
            }
          }
        }

        rafRef.current = requestAnimationFrame(animate);
      };

      rafRef.current = requestAnimationFrame(animate);
    });

    return () => {
      destroyed = true;
      cancelAnimationFrame(rafRef.current);
      globe?.destroy();
    };
  }, [reducedMotion, isMobile]);

  /* ---------------------------------------------------------------- */
  /*  Environment grid (shared between fallback and main render)      */
  /* ---------------------------------------------------------------- */
  const envGrid = (
    <div className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
      {environments.map((env, i) => (
        <motion.div
          key={env.name}
          initial={reducedMotion ? {} : { opacity: 0, y: 28, scale: 0.85, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{
            delay: i * 0.09,
            duration: 0.65,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="group flex flex-col items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-5 transition-all duration-400 hover:border-[var(--accent-primary)]/20 hover:bg-[var(--bg-card-hover)] hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(146,176,144,0.06)]"
        >
          <span className="font-mono text-xs font-medium text-white/60 transition-colors duration-300 group-hover:text-[var(--accent-primary)]">
            {env.name}
          </span>
          <span className="font-mono text-[10px] text-white/25">
            {env.desc}
          </span>
        </motion.div>
      ))}
    </div>
  );

  /* ---------------------------------------------------------------- */
  /*  No-WebGL or reduced motion fallback                             */
  /* ---------------------------------------------------------------- */
  if (!hasWebGL || reducedMotion) {
    return (
      <section
        id="collection"
        className="relative bg-[var(--bg-primary)] py-32 md:py-40"
      >
        <div className="container mx-auto px-6">
          <div className="mb-16">
            <div className="v2-section-label mb-6">
              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--accent-primary)]">
                {"// GLOBAL COLLECTION"}
              </span>
            </div>
            <h2 className="max-w-2xl text-3xl font-bold leading-[1.1] tracking-[-0.02em] text-white md:text-4xl lg:text-[42px]">
              10,000+ collectors. 18 cities.{" "}
              <span className="text-white/40">Every environment your model needs.</span>
            </h2>
          </div>

          <div className="mx-auto flex max-w-lg items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-12">
            <div className="text-center">
              <p className="mb-1 font-mono text-2xl font-bold text-[var(--accent-primary)]">
                18
              </p>
              <p className="mb-4 font-mono text-xs text-white/40">
                collection hubs worldwide
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {markerData.map((m) => (
                  <span
                    key={m.city}
                    className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-3 py-1 font-mono text-xs text-white/50"
                  >
                    {m.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-white/55">
            Suburban kitchens. Factory floors. City streets. 10,000+ collectors
            ready to capture any environment your model needs — not lab data,
            real-world data at scale.
          </p>

          {envGrid}
        </div>
      </section>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Main render with globe + thumbnail overlays                     */
  /* ---------------------------------------------------------------- */
  const thumbSize = isMobile ? THUMB_SIZE_MOBILE : THUMB_SIZE;

  return (
    <section
      ref={sectionRef}
      id="collection"
      className="relative overflow-hidden bg-[var(--bg-primary)] py-32 md:py-40"
    >
      {/* Star field background — subtle space feel */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {Array.from({ length: 60 }, (_, i) => {
          // Deterministic pseudo-random positions
          const x = ((i * 17 + 31) % 97);
          const y = ((i * 23 + 47) % 89);
          const size = 1 + ((i * 7) % 3);
          const baseOpacity = 0.08 + ((i * 13) % 20) / 100;
          const delay = ((i * 11) % 30) / 10;
          return (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: size,
                height: size,
                opacity: baseOpacity,
                animation: `globe-twinkle ${2.5 + delay}s ease-in-out infinite`,
                animationDelay: `${delay}s`,
              }}
            />
          );
        })}
      </div>

      <div className="container relative mx-auto px-6">
        <div ref={headlineRef}>
          <motion.div
            className="mb-8"
            initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="v2-section-label mb-6">
              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--accent-primary)]">
                {"// GLOBAL COLLECTION"}
              </span>
            </div>
            <h2 className="max-w-2xl text-3xl font-bold leading-[1.1] tracking-[-0.02em] text-white md:text-4xl lg:text-[42px]">
              10,000+ collectors. 18 cities.{" "}
              <span className="text-white/40">Every environment your model needs.</span>
            </h2>
          </motion.div>

          {/* Animated hub counter */}
          <motion.div
            ref={counterRef}
            className="mb-12"
            initial={reducedMotion ? {} : { opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <HubCounter inView={counterInView} reducedMotion={reducedMotion} />
          </motion.div>
        </div>

        <div ref={globeWrapperRef} style={{ willChange: "transform, opacity" }}>
          <div
            ref={containerRef}
            className="relative mx-auto overflow-visible"
            style={{
              width: isMobile ? 340 : 600,
              height: isMobile ? 340 : 600,
            }}
          >
          {/* Radial glow behind globe — animated during approach */}
          <div
            ref={glowRef}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: isMobile ? 400 : 700,
              height: isMobile ? 400 : 700,
              background:
                "radial-gradient(circle, rgba(146,176,144,0.14) 0%, rgba(146,176,144,0.06) 35%, rgba(146,176,144,0.02) 60%, transparent 80%)",
              filter: "blur(60px)",
              willChange: "transform, opacity",
            }}
          />

          <canvas
            ref={canvasRef}
            className="h-full w-full"
            style={{
              width: isMobile ? 340 : 600,
              height: isMobile ? 340 : 600,
            }}
          />

          {/* -------------------------------------------------------- */}
          {/*  Thumbnail cards — positioned via direct DOM in rAF loop */}
          {/* -------------------------------------------------------- */}
          {markerData.map((marker, i) => (
            <div
              key={marker.city}
              ref={setThumbRef(i)}
              className="pointer-events-none absolute left-0 top-0 will-change-transform"
              style={{
                opacity: 0,
                transition: "opacity 0.25s ease-out",
              }}
            >
              {/* Thumbnail container */}
              <div
                className="relative overflow-hidden"
                style={{
                  width: thumbSize,
                  height: thumbSize,
                  borderRadius: 8,
                  border: "1px solid rgba(146, 176, 144, 0.3)",
                  boxShadow:
                    "0 0 12px rgba(146, 176, 144, 0.12), 0 2px 8px rgba(0, 0, 0, 0.4)",
                  background: "rgba(10, 9, 8, 0.8)",
                }}
              >
                {/* Live video clip — managed by rAF loop visibility */}
                <video
                  src={marker.videoSrc}
                  muted
                  loop
                  playsInline
                  preload="none"
                  data-globe-video
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />

                {/* Pulsing "active capture" dot */}
                <span
                  className="absolute"
                  style={{
                    top: 4,
                    right: 4,
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "var(--accent-primary)",
                    boxShadow: "0 0 6px rgba(146, 176, 144, 0.6)",
                    animation: "collection-pulse 2s ease-in-out infinite",
                    animationDelay: `${i * 0.2}s`,
                  }}
                />

                {/* Subtle scanline overlay for that data-collection feel */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
                    pointerEvents: "none",
                  }}
                />
              </div>

              {/* Environment label */}
              <p
                className="mt-1 text-center font-mono"
                style={{
                  fontSize: isMobile ? 8 : 10,
                  color: "var(--accent-primary)",
                  opacity: 0.7,
                  lineHeight: 1.2,
                  textShadow: "0 1px 4px rgba(0,0,0,0.8)",
                  whiteSpace: "nowrap",
                }}
              >
                {marker.label}
              </p>
            </div>
          ))}
          </div>
        </div>

        <motion.p
          className="mx-auto mt-12 max-w-2xl text-center text-[15px] leading-relaxed text-white/45"
          initial={reducedMotion ? {} : { opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Suburban kitchens. Factory floors. City streets. 10,000+ collectors
          ready to capture any environment your model needs — not lab data,
          real-world data at scale.
        </motion.p>

        {envGrid}
      </div>

      {/* Keyframe animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes collection-pulse {
              0%, 100% { opacity: 1; transform: scale(1); }
              50% { opacity: 0.4; transform: scale(0.7); }
            }
            @keyframes globe-twinkle {
              0%, 100% { opacity: inherit; }
              50% { opacity: 0.02; }
            }
          `,
        }}
      />
    </section>
  );
}
