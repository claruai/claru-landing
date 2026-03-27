"use client";

import React from "react";
import CardShell from "./CardShell";

interface StatCardProps {
  stat: string;
  label: string;
  accent?: string;
  sublabel?: string;
  width?: number;
  height?: number;
}

export default function StatCard({
  stat,
  label,
  accent = "#92B090",
  sublabel,
  width = 1200,
  height = 675,
}: StatCardProps) {
  return (
    <CardShell width={width} height={height} accent={accent}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          height: "100%",
          padding: "64px 80px",
        }}
      >
        {/* Stat */}
        <div
          style={{
            fontSize: 120,
            fontWeight: 700,
            lineHeight: 1,
            color: accent,
            letterSpacing: "-0.02em",
            marginBottom: 16,
          }}
        >
          {stat}
        </div>

        {/* Label */}
        <div
          style={{
            fontSize: 24,
            fontWeight: 400,
            color: "#FFFFFF",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            opacity: 0.85,
          }}
        >
          {label}
        </div>

        {/* Sublabel */}
        {sublabel && (
          <div
            style={{
              fontSize: 15,
              fontWeight: 400,
              color: "rgba(255,255,255,0.4)",
              marginTop: 12,
              letterSpacing: "0.02em",
            }}
          >
            {sublabel}
          </div>
        )}
      </div>
    </CardShell>
  );
}
