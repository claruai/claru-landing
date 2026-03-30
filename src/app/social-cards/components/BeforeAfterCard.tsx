"use client";

import React from "react";
import CardShell from "./CardShell";

interface BeforeAfterCardProps {
  title: string;
  beforeLabel?: string;
  afterLabel?: string;
  accent?: string;
  beforeSrc?: string;
  afterSrc?: string;
  width?: number;
  height?: number;
}

export default function BeforeAfterCard({
  title,
  beforeLabel = "RAW",
  afterLabel = "ENRICHED",
  accent = "#92B090",
  beforeSrc,
  afterSrc,
  width = 1200,
  height = 675,
}: BeforeAfterCardProps) {
  return (
    <CardShell width={width} height={height} accent={accent}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "0",
        }}
      >
        {/* Title bar */}
        <div
          style={{
            padding: "28px 80px 0",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: accent,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            {title}
          </div>
        </div>

        {/* Split panels */}
        <div
          style={{
            flex: 1,
            display: "flex",
            padding: "24px 48px 48px",
            gap: 0,
          }}
        >
          {/* Before panel */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              marginRight: 1,
            }}
          >
            {/* Label */}
            <div
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: "rgba(255,255,255,0.35)",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: 12,
                paddingLeft: 4,
              }}
            >
              {beforeLabel}
            </div>

            {/* Image area */}
            <div
              style={{
                flex: 1,
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 2,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(255,255,255,0.02)",
              }}
            >
              {beforeSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={beforeSrc}
                  alt={`${title} - ${beforeLabel}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  {/* Placeholder pattern */}
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 4,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                      color: "rgba(255,255,255,0.12)",
                    }}
                  >
                    {"//"}
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      color: "rgba(255,255,255,0.12)",
                      letterSpacing: "0.06em",
                    }}
                  >
                    source frame
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Center divider */}
          <div
            style={{
              width: 24,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              paddingTop: 28,
            }}
          >
            <div
              style={{
                width: 1,
                flex: 1,
                backgroundColor: "rgba(255,255,255,0.08)",
              }}
            />
            <span
              style={{
                fontSize: 10,
                color: accent,
                opacity: 0.5,
              }}
            >
              {"->"}
            </span>
            <div
              style={{
                width: 1,
                flex: 1,
                backgroundColor: "rgba(255,255,255,0.08)",
              }}
            />
          </div>

          {/* After panel */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              marginLeft: 1,
            }}
          >
            {/* Label */}
            <div
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: accent,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: 12,
                paddingLeft: 4,
                opacity: 0.8,
              }}
            >
              {afterLabel}
            </div>

            {/* Image area */}
            <div
              style={{
                flex: 1,
                border: `1px solid ${accent}33`,
                borderRadius: 2,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: `${accent}08`,
              }}
            >
              {afterSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={afterSrc}
                  alt={`${title} - ${afterLabel}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  {/* Placeholder pattern */}
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      border: `1px solid ${accent}22`,
                      borderRadius: 4,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                      color: `${accent}44`,
                    }}
                  >
                    {"{}"}
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      color: `${accent}44`,
                      letterSpacing: "0.06em",
                    }}
                  >
                    enriched output
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </CardShell>
  );
}
