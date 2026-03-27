"use client";

import React from "react";

/**
 * Shared wrapper that provides the terminal-aesthetic foundation
 * for all social card variants: noise texture, scanlines, border,
 * and the dim CLARU watermark.
 *
 * Renders at a fixed pixel size so screenshots are predictable.
 */

interface CardShellProps {
  children: React.ReactNode;
  width?: number;
  height?: number;
  accent?: string;
  className?: string;
}

export default function CardShell({
  children,
  width = 1200,
  height = 675,
  accent = "#92B090",
  className = "",
}: CardShellProps) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        width,
        height,
        backgroundColor: "#0a0908",
        fontFamily:
          "var(--font-jetbrains), 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace",
        border: `1px solid ${accent}`,
        borderRadius: 0,
      }}
    >
      {/* Noise texture via CSS */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.035,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Scanline overlay */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Content layer */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          zIndex: 3,
        }}
      >
        {children}
      </div>

      {/* CLARU watermark — bottom left */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          bottom: 24,
          left: 32,
          fontSize: 11,
          letterSpacing: "0.2em",
          color: "rgba(255,255,255,0.18)",
          fontFamily: "inherit",
          zIndex: 4,
          textTransform: "uppercase",
        }}
      >
        claru
      </span>

      {/* Terminal prompt — top right */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: 24,
          right: 32,
          fontSize: 13,
          color: `${accent}44`,
          fontFamily: "inherit",
          zIndex: 4,
        }}
      >
        {">_"}
      </span>
    </div>
  );
}
