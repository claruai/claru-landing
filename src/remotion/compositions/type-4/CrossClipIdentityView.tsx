import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TOKENS } from "../../shared/DesignTokens";
import { BottomBar } from "../../shared/BottomBar";
import { TechMetadataOverlay } from "../../shared/TechMetadataOverlay";

// ---------------------------------------------------------------------------
// Cross-Clip Identity Persistence — Simplified Layout
// 1. Source segments (face + fedora crops)
// 2. 3 target frames with SAM2 mask overlays
// 3. JSON annotation output
// ---------------------------------------------------------------------------

// SAM2 mask paths
const FRAMES = ["0030", "0059", "0087"] as const;

const FACE_FILTER = "brightness(0) saturate(100%) invert(68%) sepia(11%) saturate(1089%) hue-rotate(83deg) brightness(93%) contrast(84%)";
const HAT_FILTER = "brightness(0) saturate(100%) invert(42%) sepia(50%) saturate(500%) hue-rotate(182deg) brightness(92%) contrast(87%)";

// Timeline
const T = {
  SOURCES_IN: 0,
  FRAME1_IN: 40,
  FRAME2_IN: 80,
  FRAME3_IN: 120,
  MASKS_IN: 160,   // all masks fade in together
  JSON_IN: 200,
  HOLD: 270,
};

const JSON_RESULT = {
  project: "OBJECT_IDENTITY_V4",
  source_clip: "clip_40",
  target_clip: "clip_39",
  segments: [
    { class: "face", score: 0.825, matched: "3/3 frames" },
    { class: "fedora", score: null, matched: "3/3 frames" },
  ],
  verdicts: {
    segment1: ["yes", "yes", "yes"],
    segment2: ["yes", "yes", "yes"],
  },
  agreement: "6/6 matches",
  status: "completed",
};

export default function CrossClipIdentityView() {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const timeS = frame / fps;

  const masterOpacity = interpolate(
    frame,
    [0, 12, durationInFrames - 15, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Phase label
  let phaseLabel = "Source Segments";
  if (frame >= T.FRAME1_IN) phaseLabel = "Cross-Clip Detection";
  if (frame >= T.MASKS_IN) phaseLabel = "Identity Tracking";
  if (frame >= T.JSON_IN) phaseLabel = "Annotation Output";

  // JSON build progress
  const jsonStr = JSON.stringify(JSON_RESULT, null, 2);
  const jsonProgress = interpolate(frame, [T.JSON_IN, T.JSON_IN + 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0908", opacity: masterOpacity }}>
      {/* ── Top: Source segment crops ── */}
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
          opacity: interpolate(frame, [T.SOURCES_IN, T.SOURCES_IN + 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {/* Face crop */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 80,
              height: 100,
              borderRadius: 6,
              overflow: "hidden",
              border: `2px solid ${TOKENS.colors.accent}`,
            }}
          >
            <Img
              src={staticFile("remotion-assets/samples/object-identity-face.png")}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div
            style={{
              fontFamily: TOKENS.fonts.mono,
              fontSize: 9,
              color: TOKENS.colors.accent,
              marginTop: 4,
            }}
          >
            face · 0.825
          </div>
        </div>

        {/* Fedora crop */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 80,
              height: 100,
              borderRadius: 6,
              overflow: "hidden",
              border: `2px solid ${TOKENS.colors.accentAlt}`,
            }}
          >
            <Img
              src={staticFile("remotion-assets/samples/object-identity-object.png")}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div
            style={{
              fontFamily: TOKENS.fonts.mono,
              fontSize: 9,
              color: TOKENS.colors.accentAlt,
              marginTop: 4,
            }}
          >
            fedora
          </div>
        </div>

        {/* Label */}
        <div
          style={{
            fontFamily: TOKENS.fonts.mono,
            fontSize: 10,
            color: TOKENS.colors.muted,
            marginTop: 40,
            maxWidth: 120,
            lineHeight: 1.4,
          }}
        >
          Source segments from clip_40
        </div>
      </div>

      {/* ── Middle: 3 target frames with SAM2 masks ── */}
      <div
        style={{
          position: "absolute",
          top: 145,
          left: 16,
          right: frame >= T.JSON_IN ? 290 : 16,
          display: "flex",
          gap: 8,
          transition: "right 0.3s ease",
        }}
      >
        {FRAMES.map((frameNum, idx) => {
          const frameIn =
            idx === 0 ? T.FRAME1_IN : idx === 1 ? T.FRAME2_IN : T.FRAME3_IN;

          const frameOpacity = interpolate(frame, [frameIn, frameIn + 15], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const maskOpacity = interpolate(
            frame,
            [T.MASKS_IN + idx * 10, T.MASKS_IN + idx * 10 + 20],
            [0, 0.45],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          return (
            <div
              key={frameNum}
              style={{
                flex: 1,
                opacity: frameOpacity,
                borderRadius: 6,
                overflow: "hidden",
                border: `1px solid ${maskOpacity > 0.1 ? TOKENS.colors.accent + "60" : "#2a2a28"}`,
                position: "relative",
              }}
            >
              {/* Base frame */}
              <Img
                src={staticFile(
                  `remotion-assets/samples/object-identity/frame_${frameNum}.jpg`
                )}
                style={{
                  width: "100%",
                  height: "100%",
                  aspectRatio: "16/9",
                  objectFit: "cover",
                  display: "block",
                }}
              />

              {/* Face SAM2 mask overlay */}
              <Img
                src={staticFile(
                  `remotion-assets/samples/obj-id-face-mask-${frameNum}.png`
                )}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  mixBlendMode: "screen",
                  opacity: maskOpacity,
                  filter: FACE_FILTER,
                }}
              />

              {/* Hat SAM2 mask overlay */}
              <Img
                src={staticFile(
                  `remotion-assets/samples/obj-id-hat-mask-${frameNum}.png`
                )}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  mixBlendMode: "screen",
                  opacity: maskOpacity,
                  filter: HAT_FILTER,
                }}
              />

              {/* Frame label */}
              <div
                style={{
                  position: "absolute",
                  bottom: 4,
                  left: 4,
                  fontFamily: TOKENS.fonts.mono,
                  fontSize: 8,
                  color: "#fff",
                  backgroundColor: "rgba(0,0,0,0.6)",
                  padding: "1px 4px",
                  borderRadius: 2,
                }}
              >
                frame_{frameNum}
              </div>

              {/* Match verdict */}
              {maskOpacity > 0.2 && (
                <div
                  style={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    fontFamily: TOKENS.fonts.mono,
                    fontSize: 8,
                    color: TOKENS.colors.accent,
                    backgroundColor: "rgba(0,0,0,0.7)",
                    padding: "2px 6px",
                    borderRadius: 2,
                    opacity: interpolate(
                      frame,
                      [T.MASKS_IN + idx * 10 + 15, T.MASKS_IN + idx * 10 + 25],
                      [0, 1],
                      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                    ),
                  }}
                >
                  2/2 matched
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Target clip label */}
      <div
        style={{
          position: "absolute",
          top: 130,
          left: 16,
          fontFamily: TOKENS.fonts.mono,
          fontSize: 9,
          color: TOKENS.colors.muted,
          opacity: interpolate(frame, [T.FRAME1_IN, T.FRAME1_IN + 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Target clip_39 — tracking segments across frames:
      </div>

      {/* ── Right: JSON output panel ── */}
      {frame >= T.JSON_IN && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 280,
            backgroundColor: TOKENS.colors.panelBg,
            backdropFilter: "blur(12px)",
            borderLeft: `1px solid ${TOKENS.colors.accent}30`,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            opacity: interpolate(frame, [T.JSON_IN, T.JSON_IN + 10], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {/* Terminal header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              borderBottom: `1px solid ${TOKENS.colors.accent}20`,
            }}
          >
            <div style={{ display: "flex", gap: 4 }}>
              {["rgba(239,68,68,0.5)", "rgba(234,179,8,0.5)", "rgba(34,197,94,0.5)"].map(
                (c, i) => (
                  <div
                    key={i}
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      backgroundColor: c,
                    }}
                  />
                )
              )}
            </div>
            <span
              style={{
                fontFamily: TOKENS.fonts.mono,
                fontSize: 9,
                color: TOKENS.colors.muted,
              }}
            >
              identity_result.json
            </span>
            <span
              style={{
                marginLeft: "auto",
                fontFamily: TOKENS.fonts.mono,
                fontSize: 9,
                color: TOKENS.colors.accent,
              }}
            >
              ✓
            </span>
          </div>

          <pre
            style={{
              padding: 12,
              margin: 0,
              fontFamily: TOKENS.fonts.mono,
              fontSize: 8,
              lineHeight: 1.5,
              color: TOKENS.colors.text,
              overflow: "hidden",
              whiteSpace: "pre-wrap",
            }}
          >
            {jsonStr.substring(0, Math.floor(jsonStr.length * jsonProgress))}
            <span
              style={{
                opacity: frame % 20 < 10 ? 1 : 0,
                color: TOKENS.colors.accent,
              }}
            >
              ▊
            </span>
          </pre>
        </div>
      )}

      {/* Bottom bar */}
      <BottomBar
        timeS={timeS}
        phaseLabel={phaseLabel}
        opacity={interpolate(frame, [10, 20], [0, 1], {
          extrapolateRight: "clamp",
          extrapolateLeft: "clamp",
        })}
        rightInset={frame >= T.JSON_IN ? 280 : 0}
      />

      <TechMetadataOverlay
        codec="h264"
        resolution="1920×1080"
        fps={30}
        duration="5.0s"
      />
    </AbsoluteFill>
  );
}
