"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const markerData = [
  { lat: 20.5937, lng: 78.9629, label: "Egocentric Video" },
  { lat: 37.7749, lng: -122.4194, label: "Game Capture" },
  { lat: 50.4501, lng: 30.5234, label: "Warehouse Data" },
  { lat: 13.7563, lng: 100.5018, label: "Traffic Data" },
  { lat: -15.7975, lng: -47.8919, label: "Workplace" },
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

function latLngToScreen(
  lat: number,
  lng: number,
  phi: number,
  theta: number,
  size: number,
  offsetX: number,
  offsetY: number
): { x: number; y: number; visible: boolean } {
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

  const visible = rz > -0.1;
  const halfSize = size / 2;

  return {
    x: offsetX + rx * halfSize,
    y: offsetY - ry * halfSize,
    visible,
  };
}

export default function CollectionNetwork() {
  const reducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const phiRef = useRef(0);
  const rafRef = useRef<number>(0);
  const [labelPositions, setLabelPositions] = useState<
    Array<{ x: number; y: number; visible: boolean; label: string }>
  >([]);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

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
    let globe: { update: (state: Record<string, unknown>) => void; destroy: () => void } | null =
      null;

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
        mapSamples: isMobile ? 8000 : 16000,
        mapBrightness: 6,
        baseColor: [0.05, 0.05, 0.04],
        markerColor: sageRGB,
        glowColor: [0.05, 0.08, 0.05],
        markers: markerData.map((m) => ({
          location: [m.lat, m.lng] as [number, number],
          size: 0.06,
        })),
        arcs: markerData
          .filter((m) => m.label !== "Game Capture")
          .map((m) => ({
            from: [m.lat, m.lng] as [number, number],
            to: sfHub,
          })),
        arcColor: sageRGB,
        arcWidth: 1,
        arcHeight: 0.3,
        devicePixelRatio: 2,
      });

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

          const positions = markerData.map((m) => {
            const pos = latLngToScreen(
              m.lat,
              m.lng,
              phiRef.current,
              0.3,
              canvasRect.width,
              offsetX,
              offsetY
            );
            return { ...pos, label: m.label };
          });

          setLabelPositions(positions);
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

  const envGrid = (
    <div className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
      {environments.map((env, i) => (
        <motion.div
          key={env.name}
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="group flex flex-col items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-5 transition-all duration-400 hover:border-[var(--accent-primary)]/20 hover:bg-[var(--bg-card-hover)] hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
        >
          <span className="font-mono text-xs font-medium text-white/60 group-hover:text-[var(--accent-primary)] transition-colors duration-300">
            {env.name}
          </span>
          <span className="font-mono text-[10px] text-white/25">
            {env.desc}
          </span>
        </motion.div>
      ))}
    </div>
  );

  // No-WebGL or reduced motion fallback
  if (!hasWebGL || reducedMotion) {
    return (
      <section id="collection" className="relative bg-[var(--bg-primary)] py-32 md:py-40">
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
                5
              </p>
              <p className="mb-4 font-mono text-xs text-white/40">
                collection hubs worldwide
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {markerData.map((m) => (
                  <span
                    key={m.label}
                    className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-3 py-1 font-mono text-xs text-white/50"
                  >
                    {m.label}
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

  return (
    <section id="collection" className="relative bg-[var(--bg-primary)] py-32 md:py-40">
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
          className="relative mx-auto"
          style={{
            width: isMobile ? 340 : 600,
            height: isMobile ? 340 : 600,
          }}
        >
          {/* Larger radial glow behind globe */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px]"
            style={{
              width: isMobile ? 280 : 450,
              height: isMobile ? 280 : 450,
              background: "radial-gradient(circle, rgba(146,176,144,0.08) 0%, rgba(146,176,144,0.03) 50%, transparent 70%)",
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

          {labelPositions.map((pos) => (
            <div
              key={pos.label}
              className="pointer-events-none absolute font-mono text-[11px] transition-opacity duration-300"
              style={{
                left: pos.x,
                top: pos.y,
                transform: "translate(-50%, -150%)",
                opacity: pos.visible ? 0.85 : 0,
                padding: "3px 8px",
                borderRadius: 6,
                background: "rgba(10, 9, 8, 0.7)",
                border: "1px solid rgba(146, 176, 144, 0.15)",
                backdropFilter: "blur(8px)",
                color: "var(--accent-primary)",
              }}
            >
              <span className="mr-1.5 inline-block h-1 w-1 rounded-full bg-[var(--accent-primary)]" />
              {pos.label}
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
          Suburban kitchens. Factory floors. City streets.
          Not lab environments — real ones.
        </motion.p>

        {envGrid}
      </div>
    </section>
  );
}
