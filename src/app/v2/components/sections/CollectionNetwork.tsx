"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

/* ------------------------------------------------------------------ */
/*  Marker data — 18 global collection hubs with live video clips     */
/* ------------------------------------------------------------------ */
const markerData = [
  {
    lat: 37.7749,
    lng: -122.4194,
    city: "San Francisco",
    videoSrc: "/videos/globe/point-01.mp4",
  },
  {
    lat: 19.076,
    lng: 72.8777,
    city: "Mumbai",
    videoSrc: "/videos/globe/point-14.mp4",
  },
  {
    lat: 10.8231,
    lng: 106.6297,
    city: "Ho Chi Minh",
    videoSrc: "/videos/globe/point-03.mp4",
  },
  {
    lat: -23.5505,
    lng: -46.6333,
    city: "S\u00e3o Paulo",
    videoSrc: "/videos/globe/point-04.mp4",
  },
  {
    lat: 50.4501,
    lng: 30.5234,
    city: "Kyiv",
    videoSrc: "/videos/globe/point-09.mp4",
  },
  {
    lat: 6.5244,
    lng: 3.3792,
    city: "Lagos",
    videoSrc: "/videos/globe/point-06.mp4",
  },
  {
    lat: 14.5995,
    lng: 120.9842,
    city: "Manila",
    videoSrc: "/videos/globe/point-07.mp4",
  },
  {
    lat: 13.7563,
    lng: 100.5018,
    city: "Bangkok",
    videoSrc: "/videos/globe/point-08.mp4",
  },
  {
    lat: 51.5074,
    lng: -0.1278,
    city: "London",
    videoSrc: "/videos/globe/point-05.mp4",
  },
  {
    lat: 19.4326,
    lng: -99.1332,
    city: "Mexico City",
    videoSrc: "/videos/globe/point-10.mp4",
  },
  {
    lat: -6.2088,
    lng: 106.8456,
    city: "Jakarta",
    videoSrc: "/videos/globe/point-11.mp4",
  },
  {
    lat: -1.2921,
    lng: 36.8219,
    city: "Nairobi",
    videoSrc: "/videos/globe/point-12.mp4",
  },
  {
    lat: 30.0444,
    lng: 31.2357,
    city: "Cairo",
    videoSrc: "/videos/globe/point-13.mp4",
  },
  {
    lat: 23.8103,
    lng: 90.4125,
    city: "Dhaka",
    videoSrc: "/videos/globe/point-02.mp4",
  },
  {
    lat: -12.0464,
    lng: -77.0428,
    city: "Lima",
    videoSrc: "/videos/globe/point-15.mp4",
  },
  {
    lat: 4.711,
    lng: -74.0721,
    city: "Bogot\u00e1",
    videoSrc: "/videos/globe/point-16.mp4",
  },
  {
    lat: 24.8607,
    lng: 67.0011,
    city: "Karachi",
    videoSrc: "/videos/globe/point-17.mp4",
  },
  {
    lat: 5.6037,
    lng: -0.187,
    city: "Accra",
    videoSrc: "/videos/globe/point-18.mp4",
  },
];

const sfHub: [number, number] = [37.7749, -122.4194];
const sageRGB: [number, number, number] = [146 / 255, 176 / 255, 144 / 255];

const environments = [
  { name: "Kitchens", desc: "Domestic prep & cooking" },
  { name: "Warehouses", desc: "Industrial logistics" },
  { name: "Roads", desc: "Traffic & driving" },
  { name: "Offices", desc: "Workplace interaction" },
  { name: "Game Worlds", desc: "Synthetic environments" },
  { name: "Retail", desc: "Shopping & commerce" },
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
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function CollectionNetwork() {
  const reducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const phiRef = useRef(0);
  const rafRef = useRef<number>(0);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

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
      const animate = () => {
        if (destroyed || !globe) return;

        phiRef.current += 0.003;
        globe.update({ phi: phiRef.current });

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
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: i * 0.06,
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="group flex flex-col items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-5 transition-all duration-400 hover:border-[var(--accent-primary)]/20 hover:bg-[var(--bg-card-hover)] hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
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
            <h2 className="max-w-lg text-3xl font-bold leading-[1.1] tracking-[-0.02em] text-white md:text-4xl lg:text-[42px]">
              We collect where your robots{" "}
              <span className="text-white/40">will actually operate.</span>
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
                    {m.city}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-white/55">
            Suburban kitchens. Factory floors. City streets.
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
      id="collection"
      className="relative bg-[var(--bg-primary)] py-32 md:py-40"
    >
      <div className="container mx-auto px-6">
        <motion.div
          className="mb-16"
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
          <h2 className="max-w-lg text-3xl font-bold leading-[1.1] tracking-[-0.02em] text-white md:text-4xl lg:text-[42px]">
            We collect where your robots{" "}
            <span className="text-white/40">will actually operate.</span>
          </h2>
        </motion.div>

        <div
          ref={containerRef}
          className="relative mx-auto overflow-visible"
          style={{
            width: isMobile ? 340 : 600,
            height: isMobile ? 340 : 600,
          }}
        >
          {/* Radial glow behind globe */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px]"
            style={{
              width: isMobile ? 280 : 450,
              height: isMobile ? 280 : 450,
              background:
                "radial-gradient(circle, rgba(146,176,144,0.08) 0%, rgba(146,176,144,0.03) 50%, transparent 70%)",
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
                {/* Live video clip */}
                <video
                  src={marker.videoSrc}
                  muted
                  autoPlay
                  loop
                  playsInline
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

              {/* City label */}
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
                {marker.city}
              </p>
            </div>
          ))}
        </div>

        <motion.p
          className="mx-auto mt-12 max-w-2xl text-center text-[15px] leading-relaxed text-white/45"
          initial={reducedMotion ? {} : { opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Suburban kitchens. Factory floors. City streets. Not lab environments
          — real ones.
        </motion.p>

        {envGrid}
      </div>

      {/* Pulsing dot keyframe animation — plain <style> for reliability */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes collection-pulse {
              0%, 100% { opacity: 1; transform: scale(1); }
              50% { opacity: 0.4; transform: scale(0.7); }
            }
          `,
        }}
      />
    </section>
  );
}
