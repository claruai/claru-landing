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
  { name: "Kitchens", icon: "🍳" },
  { name: "Warehouses", icon: "📦" },
  { name: "Roads", icon: "🛣️" },
  { name: "Offices", icon: "🏢" },
  { name: "Game Studios", icon: "🎮" },
  { name: "Retail", icon: "🏪" },
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

      const size = isMobile ? 300 : 500;
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

      // Animation loop
      const animate = () => {
        if (destroyed || !globe) return;

        phiRef.current += 0.003;
        globe.update({ phi: phiRef.current });

        // Update label positions
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

  // No-WebGL or reduced motion fallback
  if (!hasWebGL || reducedMotion) {
    return (
      <section
        id="collection"
        className="relative bg-[var(--bg-primary)] py-24"
      >
        <div className="container mx-auto px-6">
          <span className="mb-8 block font-mono text-sm text-[var(--accent-primary)]">
            {"// GLOBAL COLLECTION"}
          </span>

          <div className="mx-auto flex max-w-lg items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] p-12">
            <div className="text-center">
              <div className="mb-4 text-4xl">🌍</div>
              <p className="font-mono text-sm text-[var(--accent-primary)]">
                5 collection hubs worldwide
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {markerData.map((m) => (
                  <span
                    key={m.label}
                    className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-3 py-1 font-mono text-xs text-white/60"
                  >
                    {m.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <p className="mx-auto mt-8 max-w-2xl text-center text-base text-white/80">
            We collect where your robots will operate. Suburban kitchens.
            Factory floors. City streets. Not lab environments — real ones.
          </p>

          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-3 gap-4 md:grid-cols-6">
            {environments.map((env) => (
              <div
                key={env.name}
                className="flex flex-col items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4"
              >
                <span className="text-2xl">{env.icon}</span>
                <span className="font-mono text-xs text-white/60">
                  {env.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="collection" className="relative bg-[var(--bg-primary)] py-24">
      <div className="container mx-auto px-6">
        <span className="mb-8 block font-mono text-sm text-[var(--accent-primary)]">
          {"// GLOBAL COLLECTION"}
        </span>

        <div
          ref={containerRef}
          className="relative mx-auto"
          style={{
            width: isMobile ? 300 : 500,
            height: isMobile ? 300 : 500,
          }}
        >
          <canvas
            ref={canvasRef}
            className="h-full w-full"
            style={{
              width: isMobile ? 300 : 500,
              height: isMobile ? 300 : 500,
            }}
          />

          {labelPositions.map((pos) => (
            <div
              key={pos.label}
              className="pointer-events-none absolute font-mono text-xs text-[var(--accent-primary)] transition-opacity duration-300"
              style={{
                left: pos.x,
                top: pos.y,
                transform: "translate(-50%, -150%)",
                opacity: pos.visible ? 0.9 : 0,
                backdropFilter: "blur(4px)",
                padding: "2px 6px",
                borderRadius: 4,
                background: "rgba(10, 9, 8, 0.6)",
              }}
            >
              {pos.label}
            </div>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-base text-white/80">
          We collect where your robots will operate. Suburban kitchens.
          Factory floors. City streets. Not lab environments — real ones.
        </p>

        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-3 gap-4 md:grid-cols-6">
          {environments.map((env, i) => (
            <motion.div
              key={env.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className="flex flex-col items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4"
            >
              <span className="text-2xl">{env.icon}</span>
              <span className="font-mono text-xs text-white/60">
                {env.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
