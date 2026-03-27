"use client";

import React from "react";
import CardShell from "./CardShell";

interface QuoteCardProps {
  quote: string;
  attribution?: string;
  accent?: string;
  width?: number;
  height?: number;
}

export default function QuoteCard({
  quote,
  attribution,
  accent = "#92B090",
  width = 1200,
  height = 675,
}: QuoteCardProps) {
  return (
    <CardShell width={width} height={height} accent={accent}>
      <div
        style={{
          display: "flex",
          height: "100%",
          padding: "64px 80px",
          gap: 32,
        }}
      >
        {/* Left accent bar */}
        <div
          style={{
            width: 3,
            flexShrink: 0,
            backgroundColor: accent,
            borderRadius: 2,
            opacity: 0.7,
          }}
        />

        {/* Text content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
          }}
        >
          {/* Quote */}
          <div
            style={{
              fontSize: quote.length > 140 ? 26 : quote.length > 80 ? 32 : 38,
              fontWeight: 400,
              color: "#FFFFFF",
              lineHeight: 1.5,
              letterSpacing: "0.01em",
            }}
          >
            {quote}
          </div>

          {/* Attribution */}
          {attribution && (
            <div
              style={{
                fontSize: 15,
                fontWeight: 400,
                color: "rgba(255,255,255,0.35)",
                marginTop: 32,
                letterSpacing: "0.02em",
              }}
            >
              -- {attribution}
            </div>
          )}
        </div>
      </div>
    </CardShell>
  );
}
