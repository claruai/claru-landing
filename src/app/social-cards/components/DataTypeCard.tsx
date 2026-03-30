"use client";

import React from "react";
import CardShell from "./CardShell";

interface DataTypeCardProps {
  category: string;
  stat: string;
  statLabel: string;
  description: string;
  accent?: string;
  videoSrc?: string;
  width?: number;
  height?: number;
}

export default function DataTypeCard({
  category,
  stat,
  statLabel,
  description,
  accent = "#92B090",
  videoSrc,
  width = 1200,
  height = 675,
}: DataTypeCardProps) {
  return (
    <CardShell width={width} height={height} accent={accent}>
      <div
        style={{
          display: "flex",
          height: "100%",
        }}
      >
        {/* Left side — text (60%) */}
        <div
          style={{
            width: "60%",
            padding: "64px 56px 64px 80px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {/* Category badge */}
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: accent,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              marginBottom: 24,
            }}
          >
            {category}
          </div>

          {/* Stat */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: "#FFFFFF",
              lineHeight: 1,
              marginBottom: 8,
            }}
          >
            {stat}
          </div>

          {/* Stat label */}
          <div
            style={{
              fontSize: 16,
              fontWeight: 400,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: 28,
            }}
          >
            {statLabel}
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: 16,
              fontWeight: 400,
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.65,
              maxWidth: 480,
            }}
          >
            {description}
          </div>
        </div>

        {/* Right side — visual (40%) */}
        <div
          style={{
            width: "40%",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Divider line */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 64,
              bottom: 64,
              width: 1,
              backgroundColor: "rgba(255,255,255,0.08)",
            }}
          />

          {videoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={videoSrc}
              alt={category}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.6,
              }}
            />
          ) : (
            /* Grid placeholder */
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              {/* Dot grid pattern */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 32,
                  backgroundImage: `radial-gradient(circle, ${accent}22 1px, transparent 1px)`,
                  backgroundSize: "20px 20px",
                }}
              />
              <span
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.15)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  zIndex: 1,
                }}
              >
                [sample frame]
              </span>
            </div>
          )}
        </div>
      </div>
    </CardShell>
  );
}
