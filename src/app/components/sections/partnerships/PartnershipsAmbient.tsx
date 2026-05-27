"use client";

import { useMemo } from "react";

// Sparse drifting ASCII chars — chosen to read as "data feed" not "decoration"
const CHARS = ["+", ":", ".", "/", "·", "◌", "◇", "▸", "·", "."];

// Deterministic seeded random so SSR/CSR match
function seedRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const DRIFTERS = (() => {
  const rng = seedRandom(7);
  return Array.from({ length: 28 }, (_, i) => ({
    id: i,
    char: CHARS[Math.floor(rng() * CHARS.length)],
    left: rng() * 100, // %
    top: rng() * 100, // %
    delay: rng() * 18, // s
    duration: 14 + rng() * 12, // s
    size: 11 + Math.floor(rng() * 4), // px
    opacity: 0.08 + rng() * 0.1,
  }));
})();

export default function PartnershipsAmbient() {
  // Memoize so the SSR snapshot and the CSR render produce identical markup
  const drifters = useMemo(() => DRIFTERS, []);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* SOFT TOP GRADIENT — sage-tinted lift right under the hero, fading
          out by mid-page so the lower sections feel grounded */}
      <div
        className="absolute inset-x-0 top-0 h-[120vh]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(146, 176, 144, 0.05) 0%, rgba(146, 176, 144, 0.02) 30%, transparent 100%)",
        }}
      />

      {/* SOFT RADIAL — slight elevation glow centered on the calculator/wall area */}
      <div
        className="absolute inset-x-0 top-0 h-[140vh]"
        style={{
          background:
            "radial-gradient(ellipse 60% 70% at 50% 25%, rgba(146, 176, 144, 0.04) 0%, rgba(146, 176, 144, 0.012) 45%, transparent 80%)",
        }}
      />

      {/* GRID — sage 1px lines on dark, ~64px cells, edges masked */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(146, 176, 144, 0.045) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(146, 176, 144, 0.045) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.18) 80%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.18) 80%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* Sub-grid: tighter dot-grid for fine texture */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(146, 176, 144, 0.06) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 8%, rgba(0,0,0,0.3) 92%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 8%, rgba(0,0,0,0.3) 92%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* Drifting ASCII characters — sparse, slow fade in/out */}
      <div className="absolute inset-0">
        {drifters.map((d) => (
          <span
            key={d.id}
            className="absolute font-mono text-[var(--accent-primary)] select-none tabular-nums"
            style={{
              left: `${d.left}%`,
              top: `${d.top}%`,
              fontSize: `${d.size}px`,
              opacity: 0,
              animation: `ambDrift ${d.duration}s ease-in-out ${d.delay}s infinite`,
              ["--amb-opacity" as string]: d.opacity.toFixed(3),
            } as React.CSSProperties}
          >
            {d.char}
          </span>
        ))}
      </div>

      {/* Edge vignette to taper grid into footer/header borders */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32"
        style={{
          background:
            "linear-gradient(to bottom, var(--bg-primary), transparent)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
        style={{
          background:
            "linear-gradient(to top, var(--bg-primary), transparent)",
        }}
      />

      <style jsx>{`
        @keyframes ambDrift {
          0%,
          100% {
            opacity: 0;
            transform: translateY(0) scale(0.9);
          }
          25% {
            opacity: var(--amb-opacity);
            transform: translateY(-4px) scale(1);
          }
          75% {
            opacity: calc(var(--amb-opacity) * 0.6);
            transform: translateY(4px) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
