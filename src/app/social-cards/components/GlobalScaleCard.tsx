"use client";

import React from "react";
import CardShell from "./CardShell";

interface GlobalScaleCardProps {
  cities: string[];
  stat: string;
  label: string;
  accent?: string;
  width?: number;
  height?: number;
}

export default function GlobalScaleCard({
  cities,
  stat,
  label,
  accent = "#92B090",
  width = 1200,
  height = 675,
}: GlobalScaleCardProps) {
  // Deterministic "highlight" — every 3rd city gets accent color
  const highlightIndices = new Set(
    cities.map((_, i) => i).filter((i) => i % 3 === 0)
  );

  return (
    <CardShell width={width} height={height} accent={accent}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "56px 80px",
          justifyContent: "space-between",
        }}
      >
        {/* Top: terminal-style header */}
        <div>
          <div
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.08em",
              marginBottom: 6,
            }}
          >
            $ claru --list-nodes --active
          </div>
          <div
            style={{
              width: "100%",
              height: 1,
              backgroundColor: "rgba(255,255,255,0.06)",
              marginBottom: 24,
            }}
          />
        </div>

        {/* Middle: city grid */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px 24px",
            flex: 1,
            alignContent: "center",
            maxWidth: 900,
          }}
        >
          {cities.map((city, i) => {
            const isHighlighted = highlightIndices.has(i);
            return (
              <span
                key={`${city}-${i}`}
                style={{
                  fontSize: 13,
                  fontWeight: isHighlighted ? 500 : 400,
                  color: isHighlighted ? accent : "rgba(255,255,255,0.22)",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  lineHeight: 2,
                  transition: "none",
                }}
              >
                {isHighlighted ? `[${city}]` : city}
              </span>
            );
          })}
        </div>

        {/* Bottom: stat overlay */}
        <div
          style={{
            marginTop: 24,
          }}
        >
          <div
            style={{
              width: "100%",
              height: 1,
              backgroundColor: "rgba(255,255,255,0.06)",
              marginBottom: 20,
            }}
          />
          <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
            <span
              style={{
                fontSize: 56,
                fontWeight: 700,
                color: accent,
                lineHeight: 1,
              }}
            >
              {stat}
            </span>
            <span
              style={{
                fontSize: 18,
                fontWeight: 400,
                color: "rgba(255,255,255,0.5)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {label}
            </span>
          </div>
        </div>
      </div>
    </CardShell>
  );
}
