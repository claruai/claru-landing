import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  staticFile,
  delayRender,
  continueRender,
} from "remotion";
import { TOKENS } from "../../shared/DesignTokens";
import { BottomBar } from "../../shared/BottomBar";
import { TechMetadataOverlay } from "../../shared/TechMetadataOverlay";

// ===========================================================================
// Shared helpers
// ===========================================================================

interface Props {
  compositionId: string;
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, margin: "6px 0 3px" }}>
      <span style={{ fontFamily: TOKENS.fonts.mono, fontSize: 7, color: TOKENS.colors.accent, letterSpacing: 1.5, fontWeight: 700 }}>
        {text}
      </span>
      <div style={{ flex: 1, height: 1, background: `${TOKENS.colors.accent}20` }} />
    </div>
  );
}

function Row({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 2 }}>
      <span style={{ color: TOKENS.colors.accent, minWidth: 65 }}>{label}:</span>
      <span style={{ color: color ?? TOKENS.colors.text }}>{value}</span>
    </div>
  );
}

const CursorIcon: React.FC<{ clicking?: boolean }> = ({ clicking }) => (
  <svg
    width="20"
    height="24"
    viewBox="0 0 24 28"
    fill="none"
    style={{ filter: clicking ? "drop-shadow(0 0 6px #fff)" : "none" }}
  >
    <path
      d="M5 2L5 22L10 17L16 26L19 24L13 15L20 15L5 2Z"
      fill={clicking ? "#fff" : "rgba(255,255,255,0.95)"}
      stroke="rgba(0,0,0,0.5)"
      strokeWidth="1.5"
    />
  </svg>
);

// ===========================================================================
// TYPE 5-A: Game Capture Telemetry  (cs-game-capture, sol-sim2real)
// ===========================================================================

interface InputEvent {
  timeUs: number;
  event: "keydown" | "keyup" | "mousemove" | "rightclickdown" | "rightclickup";
  value: string;
}

const KEY_CONFIG: Record<string, { x: number; y: number; w: number; h: number; label: string }> = {
  W:         { x: 38, y: 0,  w: 30, h: 28, label: "W" },
  A:         { x: 0,  y: 32, w: 30, h: 28, label: "A" },
  S:         { x: 38, y: 32, w: 30, h: 28, label: "S" },
  D:         { x: 76, y: 32, w: 30, h: 28, label: "D" },
  LeftShift: { x: 0,  y: 64, w: 48, h: 24, label: "SHIFT" },
  Space:     { x: 52, y: 64, w: 54, h: 24, label: "SPACE" },
  E:         { x: 76, y: 0,  w: 30, h: 28, label: "E" },
};

function KeyboardViz({ activeKeys, inputRate }: { activeKeys: Set<string>; inputRate: number }) {
  return (
    <div>
      <div style={{ position: "relative", width: 110, height: 92 }}>
        {Object.entries(KEY_CONFIG).map(([key, cfg]) => {
          const active = activeKeys.has(key);
          return (
            <div
              key={key}
              style={{
                position: "absolute",
                left: cfg.x,
                top: cfg.y,
                width: cfg.w,
                height: cfg.h,
                backgroundColor: active ? `${TOKENS.colors.accent}35` : "rgba(255,255,255,0.03)",
                border: `1px solid ${active ? TOKENS.colors.accent : "rgba(255,255,255,0.08)"}`,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: TOKENS.fonts.mono,
                fontSize: cfg.label.length > 2 ? 7 : 10,
                fontWeight: 600,
                color: active ? TOKENS.colors.accent : "rgba(255,255,255,0.2)",
                boxShadow: active ? `0 0 8px ${TOKENS.colors.accent}20` : "none",
              }}
            >
              {cfg.label}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 6, fontFamily: TOKENS.fonts.mono, fontSize: 8, color: TOKENS.colors.muted }}>
        <span style={{ color: TOKENS.colors.accent }}>{inputRate}</span> events/sec
      </div>
    </div>
  );
}

function MouseTrail({ positions }: { positions: Array<{ x: number; y: number }> }) {
  if (positions.length < 2) return null;

  const minX = Math.min(...positions.map(p => p.x));
  const maxX = Math.max(...positions.map(p => p.x));
  const minY = Math.min(...positions.map(p => p.y));
  const maxY = Math.max(...positions.map(p => p.y));
  const rangeX = Math.max(maxX - minX, 1);
  const rangeY = Math.max(maxY - minY, 1);

  const points = positions.map(p => ({
    x: ((p.x - minX) / rangeX) * 90 + 5,
    y: ((p.y - minY) / rangeY) * 50 + 5,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <svg width="100" height="60" viewBox="0 0 100 60" style={{ opacity: 0.6 }}>
      <path d={pathD} fill="none" stroke={TOKENS.colors.accent} strokeWidth={1} strokeOpacity={0.4} />
      {points.length > 0 && (
        <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r={3} fill={TOKENS.colors.accent} />
      )}
    </svg>
  );
}

function TelemetryPanel({
  frame,
  fps,
  durationInFrames,
  inputEvents,
}: {
  frame: number;
  fps: number;
  durationInFrames: number;
  inputEvents: InputEvent[];
}) {
  const timeUs = (frame / fps) * 1_000_000;

  const activeKeys = new Set<string>();
  for (const evt of inputEvents) {
    if (evt.timeUs > timeUs) break;
    if (evt.event === "keydown") activeKeys.add(evt.value);
    if (evt.event === "keyup") activeKeys.delete(evt.value);
  }

  const windowStart = timeUs - 1_000_000;
  const inputRate = inputEvents.filter(e => e.timeUs >= windowStart && e.timeUs <= timeUs).length;

  const mouseWindow = timeUs - 500_000;
  const recentMouse = inputEvents
    .filter(e => e.event === "mousemove" && e.timeUs >= mouseWindow && e.timeUs <= timeUs)
    .map(e => {
      const [x, y] = e.value.split(":").map(Number);
      return { x, y };
    });

  const totalEvents = inputEvents.filter(e => e.timeUs <= timeUs).length;
  const timeS = frame / fps;

  const panelOpacity = interpolate(frame, [20, 35], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const slideX = interpolate(frame, [20, 35], [20, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        width: 260,
        backgroundColor: TOKENS.colors.panelBg,
        backdropFilter: "blur(12px)",
        borderLeft: `1px solid ${TOKENS.colors.accent}30`,
        opacity: panelOpacity,
        transform: `translateX(${slideX}px)`,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Terminal header */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderBottom: `1px solid ${TOKENS.colors.accent}20` }}>
        <div style={{ display: "flex", gap: 4 }}>
          {["rgba(239,68,68,0.5)", "rgba(234,179,8,0.5)", "rgba(34,197,94,0.5)"].map((c, i) => (
            <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: c }} />
          ))}
        </div>
        <span style={{ fontFamily: TOKENS.fonts.mono, fontSize: 9, color: TOKENS.colors.muted }}>
          input_capture.jsonl
        </span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: "#ef4444" }} />
          <span style={{ fontFamily: TOKENS.fonts.mono, fontSize: 9, color: "#ef4444" }}>REC</span>
        </div>
      </div>

      <div style={{ padding: "8px 12px", flex: 1, fontFamily: TOKENS.fonts.mono, fontSize: 9, lineHeight: 1.6 }}>
        <SectionLabel text="GAME" />
        <Row label="title" value="Red Dead Redemption 2" color={TOKENS.colors.accent} />
        <Row label="scene" value="Rooftop Chase" />

        <SectionLabel text="CAPTURE SPECS" />
        <Row label="resolution" value="1920×1200" color={TOKENS.colors.accent} />
        <Row label="framerate" value="30 fps" />
        <Row label="codec" value="x264 High" />
        <Row label="sync_err" value="<16ms" color={TOKENS.colors.accent} />

        <SectionLabel text="INPUT STREAM" />
        <Row label="events" value={`${totalEvents} / ${inputEvents.length}`} />
        <Row label="rate" value={`${inputRate} evt/s`} color={inputRate > 50 ? TOKENS.colors.accent : TOKENS.colors.text} />
        <Row label="elapsed" value={`${timeS.toFixed(1)}s`} />

        <div style={{ marginTop: 6 }}>
          <KeyboardViz activeKeys={activeKeys} inputRate={inputRate} />
        </div>

        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 8, color: TOKENS.colors.muted, marginBottom: 2 }}>MOUSE TRAIL (500ms)</div>
          <MouseTrail positions={recentMouse} />
        </div>

        <SectionLabel text="SESSION" />
        <Row label="cost" value={`$${(timeS * 0.00417).toFixed(4)}/s`} />
        <Row label="status" value="APPROVED" color={TOKENS.colors.success} />
      </div>
    </div>
  );
}

function GameCaptureWorkflow({ compositionId }: { compositionId: string }) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const timeS = frame / fps;

  const [videoReady, setVideoReady] = useState(false);
  const [inputEvents, setInputEvents] = useState<InputEvent[]>([]);
  const [handle] = useState(() => delayRender("Loading game capture assets"));

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const vResp = await fetch(staticFile(`remotion-assets/samples/${compositionId}.mp4`), { method: "HEAD" });
        if (!cancelled) setVideoReady(vResp.ok);
      } catch {
        if (!cancelled) setVideoReady(false);
      }

      try {
        const iResp = await fetch(staticFile(`remotion-assets/annotations/${compositionId}-input.json`));
        if (iResp.ok) {
          const data = await iResp.json();
          if (!cancelled) setInputEvents(data);
        }
      } catch {
        // No input data available
      }

      continueRender(handle);
    }

    load();
    return () => { cancelled = true; };
  }, [compositionId, handle]);

  const masterOpacity = interpolate(frame, [0, 15, durationInFrames - 20, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", opacity: masterOpacity }}>
      {videoReady ? (
        <OffthreadVideo
          src={staticFile(`remotion-assets/samples/${compositionId}.mp4`)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <AbsoluteFill style={{ backgroundColor: "#0a0908", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: TOKENS.fonts.mono, fontSize: 14, color: TOKENS.colors.muted }}>{compositionId}</span>
        </AbsoluteFill>
      )}

      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 0%, transparent 55%, rgba(0,0,0,0.75) 78%, rgba(0,0,0,0.92) 100%)" }} />

      <div
        style={{
          position: "absolute",
          top: 14,
          left: 14,
          display: "flex",
          gap: 6,
          opacity: interpolate(frame, [10, 22], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }),
        }}
      >
        <div style={{ backgroundColor: "rgba(0,0,0,0.7)", padding: "3px 8px", borderRadius: 3, border: `1px solid ${TOKENS.colors.accent}40`, fontFamily: TOKENS.fonts.mono, fontSize: 10, color: TOKENS.colors.accent, fontWeight: 700 }}>
          RED DEAD REDEMPTION 2
        </div>
        <div style={{ backgroundColor: "rgba(0,0,0,0.7)", padding: "3px 6px", borderRadius: 3, fontFamily: TOKENS.fonts.mono, fontSize: 8, color: TOKENS.colors.muted }}>
          ADVENTURE
        </div>
      </div>

      <TelemetryPanel frame={frame} fps={fps} durationInFrames={durationInFrames} inputEvents={inputEvents} />

      <BottomBar timeS={timeS} phaseLabel="Game Capture" opacity={interpolate(frame, [15, 25], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })} rightInset={260} />

      <TechMetadataOverlay codec="x264" resolution="1920x1200" fps={30} duration="4m 05s" />
    </AbsoluteFill>
  );
}

// ===========================================================================
// TYPE 5-B: Classification Workflow  (cs-vid-classify)
// ===========================================================================

const ANNOTATION = {
  category: "Technology & Computing",
  subcategory: "Smartphones & Gadget Use",
  concept: "People",
  metaCategory: "Portrait photography",
  metaSubcategory: "Urban outdoor portraits",
  caption:
    "a young man with light brown hair, wearing a patterned button-down shirt, is engaged in a phone conversation outdoors. he is smiling slightly as he holds the phone to his ear. behind him, a large building with intricate architectural details is partially visible, along with green trees that suggest a park or urban green space. the lighting indicates it is likely daytime, with the sun casting a bright glow around the scene.",
  projectType: "SUPERVISED_FINE_TUNING",
};

const CONTENT_OPTIONS = ["Nature & Environment", "People", "Technology & Computing"];
const SUBCATEGORY_OPTIONS = ["Mobile Photography", "Smartphones & Gadget Use", "Telephony"];
const STYLE_OPTIONS = ["Candid photography", "Portrait photography"];
const STYLE_SUB_OPTIONS = ["Studio portraits", "Urban outdoor portraits"];

const PIPELINE_STAGES = ["Raw Capture", "Classification", "Review", "Approved"];

// Phase boundaries (360 frames total)
const P1_END = 40;   // Video + Question
const P2_END = 100;  // Content Classification
const P3_END = 160;  // Visual Style Classification
const P4_END = 220;  // Caption
const P5_END = 300;  // Pipeline + JSON (last 60 frames fade out)

function getPhaseLabel(frame: number): string {
  if (frame < P1_END) return "Video Analysis";
  if (frame < P2_END) return "Content Classification";
  if (frame < P3_END) return "Visual Style";
  if (frame < P4_END) return "Captioning";
  return "Output";
}

// ---------------------------------------------------------------------------
// Animated Dropdown — simulates cursor hover and click to select an option
// ---------------------------------------------------------------------------
interface DropdownAnimProps {
  label: string;
  options: string[];
  selectedIndex: number;
  /** Frame at which the dropdown begins opening */
  startFrame: number;
  /** Total frames for the full open-hover-select sequence */
  durationFrames: number;
  frame: number;
}

function AnimatedDropdown({ label, options, selectedIndex, startFrame, durationFrames, frame }: DropdownAnimProps) {
  const localF = frame - startFrame;
  const phaseDur = durationFrames;

  // Timing: open at 0, hover items, click at ~70%, close at ~85%
  const isVisible = localF >= 0;
  const openProgress = isVisible ? interpolate(localF, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const isOpen = localF >= 0 && localF < phaseDur * 0.85;
  const isSelected = localF >= phaseDur * 0.7;

  // Which item is the cursor hovering?
  const hoverIdx = isOpen
    ? Math.min(
        Math.floor(interpolate(localF, [6, phaseDur * 0.65], [0, selectedIndex + 0.99], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })),
        options.length - 1,
      )
    : -1;

  // Cursor position relative to dropdown
  const cursorY = isOpen && hoverIdx >= 0
    ? 26 + hoverIdx * 22 + 11
    : 12;
  const cursorX = 140;
  const clicking = localF >= phaseDur * 0.65 && localF < phaseDur * 0.72;

  const cursorOpacity = isVisible && localF < phaseDur * 0.85
    ? interpolate(localF, [0, 4, phaseDur * 0.8, phaseDur * 0.85], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  return (
    <div style={{ marginBottom: 8, position: "relative" }}>
      {/* Label */}
      <div
        style={{
          fontFamily: TOKENS.fonts.mono,
          fontSize: 8,
          color: TOKENS.colors.muted,
          marginBottom: 3,
          letterSpacing: 0.8,
          textTransform: "uppercase",
          opacity: isVisible ? interpolate(localF, [0, 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0,
        }}
      >
        {label}
      </div>

      {/* Selected value display / dropdown trigger */}
      <div
        style={{
          fontFamily: TOKENS.fonts.mono,
          fontSize: 10,
          padding: "4px 8px",
          backgroundColor: "rgba(255,255,255,0.04)",
          border: `1px solid ${isOpen ? TOKENS.colors.accent : "rgba(255,255,255,0.1)"}`,
          borderRadius: 3,
          color: isSelected ? TOKENS.colors.accent : TOKENS.colors.muted,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          opacity: isVisible ? openProgress : 0,
        }}
      >
        <span>{isSelected ? options[selectedIndex] : "Select..."}</span>
        <span style={{ fontSize: 7, color: TOKENS.colors.muted }}>{isOpen ? "\u25B2" : "\u25BC"}</span>
      </div>

      {/* Dropdown options */}
      {isOpen && openProgress > 0.5 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 26,
            backgroundColor: "rgba(15,15,15,0.95)",
            border: `1px solid ${TOKENS.colors.accent}40`,
            borderRadius: 3,
            zIndex: 10,
            overflow: "hidden",
            opacity: interpolate(localF, [4, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          {options.map((opt, i) => {
            const isHovered = hoverIdx === i;
            const isChosen = isSelected && i === selectedIndex;
            return (
              <div
                key={opt}
                style={{
                  fontFamily: TOKENS.fonts.mono,
                  fontSize: 9,
                  padding: "4px 8px",
                  backgroundColor: isChosen
                    ? `${TOKENS.colors.accent}25`
                    : isHovered
                      ? "rgba(255,255,255,0.06)"
                      : "transparent",
                  color: isChosen ? TOKENS.colors.accent : isHovered ? TOKENS.colors.text : TOKENS.colors.muted,
                  borderLeft: isChosen ? `2px solid ${TOKENS.colors.accent}` : "2px solid transparent",
                }}
              >
                {opt}
              </div>
            );
          })}
        </div>
      )}

      {/* Cursor */}
      {cursorOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            left: cursorX,
            top: cursorY,
            opacity: cursorOpacity,
            zIndex: 20,
            pointerEvents: "none",
          }}
        >
          <CursorIcon clicking={clicking} />
          {clicking && (
            <div
              style={{
                position: "absolute",
                left: 4,
                top: 4,
                width: 16,
                height: 16,
                borderRadius: "50%",
                border: `1.5px solid ${TOKENS.colors.accent}`,
                opacity: 0.6,
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Taxonomy Tree — shows the final dual taxonomy as a vertical tree
// ---------------------------------------------------------------------------
function TaxonomyTree({
  label,
  levels,
  progress,
}: {
  label: string;
  levels: string[];
  progress: number; // 0..1
}) {
  const visibleCount = Math.floor(progress * (levels.length + 1));

  return (
    <div style={{ marginBottom: 6 }}>
      {/* Root */}
      <div
        style={{
          fontFamily: TOKENS.fonts.mono,
          fontSize: 9,
          fontWeight: 700,
          color: TOKENS.colors.accent,
          opacity: visibleCount >= 1 ? 1 : 0.2,
          marginBottom: 2,
        }}
      >
        {label}
      </div>
      {levels.map((lvl, i) => (
        <div
          key={lvl}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            paddingLeft: 8 + i * 8,
            opacity: visibleCount >= i + 2 ? 1 : 0.15,
          }}
        >
          <span style={{ fontFamily: TOKENS.fonts.mono, fontSize: 8, color: TOKENS.colors.muted }}>{i < levels.length - 1 ? "\u251C\u2500" : "\u2514\u2500"}</span>
          <span
            style={{
              fontFamily: TOKENS.fonts.mono,
              fontSize: 9,
              color: i === levels.length - 1 ? TOKENS.colors.accent : TOKENS.colors.text,
              fontWeight: i === levels.length - 1 ? 600 : 400,
            }}
          >
            {lvl}
          </span>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pipeline Stages — horizontal flow: Raw Capture -> Classification -> Review -> Approved
// ---------------------------------------------------------------------------
function PipelineStages({ activeIndex }: { activeIndex: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {PIPELINE_STAGES.map((stage, i) => {
        const isActive = i <= activeIndex;
        const isCurrent = i === activeIndex;
        return (
          <React.Fragment key={stage}>
            <div
              style={{
                fontFamily: TOKENS.fonts.mono,
                fontSize: 8,
                padding: "3px 6px",
                borderRadius: 3,
                backgroundColor: isActive ? `${TOKENS.colors.accent}20` : "rgba(255,255,255,0.03)",
                border: `1px solid ${isCurrent ? TOKENS.colors.accent : isActive ? `${TOKENS.colors.accent}40` : "rgba(255,255,255,0.06)"}`,
                color: isActive ? TOKENS.colors.accent : TOKENS.colors.muted,
                fontWeight: isCurrent ? 700 : 400,
              }}
            >
              {stage}
            </div>
            {i < PIPELINE_STAGES.length - 1 && (
              <span style={{ fontFamily: TOKENS.fonts.mono, fontSize: 8, color: isActive ? TOKENS.colors.accent : "rgba(255,255,255,0.1)" }}>
                {"\u2192"}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// JSON Output Builder — builds the dual-taxonomy JSON result line by line
// ---------------------------------------------------------------------------
function JsonOutputBuilder({ progress }: { progress: number }) {
  const lines = [
    `{`,
    `  "content": {`,
    `    "concept": "${ANNOTATION.concept}",`,
    `    "category": "${ANNOTATION.category}",`,
    `    "subcategory": "${ANNOTATION.subcategory}"`,
    `  },`,
    `  "visual_style": {`,
    `    "category": "${ANNOTATION.metaCategory}",`,
    `    "subcategory": "${ANNOTATION.metaSubcategory}"`,
    `  },`,
    `  "status": "APPROVED"`,
    `}`,
  ];

  const visibleLines = Math.floor(progress * lines.length);

  return (
    <div
      style={{
        fontFamily: TOKENS.fonts.mono,
        fontSize: 8,
        lineHeight: 1.5,
        padding: "6px 8px",
        backgroundColor: "rgba(0,0,0,0.4)",
        borderRadius: 3,
        border: `1px solid ${TOKENS.colors.accent}15`,
      }}
    >
      {lines.slice(0, visibleLines).map((line, i) => (
        <div key={i}>
          <span style={{ color: line.includes(":") ? TOKENS.colors.muted : "rgba(255,255,255,0.3)" }}>
            {line.split(":").map((part, j) =>
              j === 0 ? (
                <span key={j} style={{ color: line.trim().startsWith('"') && line.includes(":") ? TOKENS.colors.accent : "rgba(255,255,255,0.3)" }}>{part}</span>
              ) : (
                <span key={j} style={{ color: TOKENS.colors.text }}>:{part}</span>
              ),
            )}
          </span>
        </div>
      ))}
      {visibleLines < lines.length && (
        <span style={{ color: TOKENS.colors.accent, animation: "blink 1s step-end infinite" }}>{"\u2588"}</span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ClassificationWorkflow — the main component for cs-vid-classify
// ---------------------------------------------------------------------------
function ClassificationWorkflow({ compositionId }: { compositionId: string }) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const timeS = frame / fps;

  const [videoReady, setVideoReady] = useState(false);
  const [handle] = useState(() => delayRender("Loading classification assets"));

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const vResp = await fetch(staticFile(`remotion-assets/samples/${compositionId}.mp4`), { method: "HEAD" });
        if (!cancelled) setVideoReady(vResp.ok);
      } catch {
        if (!cancelled) setVideoReady(false);
      }
      continueRender(handle);
    }
    load();
    return () => { cancelled = true; };
  }, [compositionId, handle]);

  const masterOpacity = interpolate(frame, [0, 15, durationInFrames - 20, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const panelOpacity = interpolate(frame, [5, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const panelSlide = interpolate(frame, [5, 20], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Caption typewriter
  const captionStart = P3_END;
  const captionEnd = P4_END;
  const captionProgress = interpolate(frame, [captionStart, captionEnd - 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const captionChars = Math.floor(captionProgress * ANNOTATION.caption.length);

  // Pipeline animation
  const pipelineActiveIdx = frame < P4_END
    ? Math.min(Math.floor(interpolate(frame, [0, P4_END], [0, 3.99], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })), 3)
    : 3;

  // JSON progress (phase 5)
  const jsonProgress = interpolate(frame, [P4_END, P5_END - 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Right panel width
  const PANEL_W = 480;

  // Determine current phase label for BottomBar
  const phaseLabel = getPhaseLabel(frame);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", opacity: masterOpacity }}>
      {/* Video — left 60% */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 32, width: `calc(100% - ${PANEL_W}px)` }}>
        {videoReady ? (
          <OffthreadVideo
            src={staticFile(`remotion-assets/samples/${compositionId}.mp4`)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", backgroundColor: "#0a0908", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: TOKENS.fonts.mono, fontSize: 14, color: TOKENS.colors.muted }}>{compositionId}</span>
          </div>
        )}

        {/* Gradient overlay for blending into panel */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, transparent 0%, transparent 70%, rgba(0,0,0,0.8) 100%)",
          }}
        />

        {/* Project badge */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            display: "flex",
            gap: 6,
            opacity: interpolate(frame, [8, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(0,0,0,0.7)",
              padding: "3px 8px",
              borderRadius: 3,
              border: `1px solid ${TOKENS.colors.accent}40`,
              fontFamily: TOKENS.fonts.mono,
              fontSize: 9,
              color: TOKENS.colors.accent,
              fontWeight: 700,
              letterSpacing: 0.8,
            }}
          >
            {ANNOTATION.projectType}
          </div>
          <div
            style={{
              backgroundColor: "rgba(0,0,0,0.7)",
              padding: "3px 6px",
              borderRadius: 3,
              fontFamily: TOKENS.fonts.mono,
              fontSize: 8,
              color: TOKENS.colors.muted,
            }}
          >
            VIDEO CLASSIFICATION
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 32,
          width: PANEL_W,
          backgroundColor: TOKENS.colors.panelBg,
          backdropFilter: "blur(12px)",
          borderLeft: `1px solid ${TOKENS.colors.accent}20`,
          opacity: panelOpacity,
          transform: `translateX(${panelSlide}px)`,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Terminal header */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderBottom: `1px solid ${TOKENS.colors.accent}20` }}>
          <div style={{ display: "flex", gap: 4 }}>
            {["rgba(239,68,68,0.5)", "rgba(234,179,8,0.5)", "rgba(34,197,94,0.5)"].map((c, i) => (
              <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: c }} />
            ))}
          </div>
          <span style={{ fontFamily: TOKENS.fonts.mono, fontSize: 9, color: TOKENS.colors.muted }}>
            classify_video.task
          </span>
        </div>

        {/* Scrollable content area */}
        <div style={{ flex: 1, padding: "8px 14px", overflow: "hidden" }}>
          {/* Phase 1: Task header */}
          <div
            style={{
              opacity: interpolate(frame, [5, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              marginBottom: 8,
            }}
          >
            <div style={{ fontFamily: TOKENS.fonts.sans, fontSize: 13, fontWeight: 600, color: TOKENS.colors.text, marginBottom: 4 }}>
              Classify this video clip
            </div>
            <div style={{ fontFamily: TOKENS.fonts.mono, fontSize: 8, color: TOKENS.colors.muted }}>
              Apply content and visual style taxonomy labels
            </div>
          </div>

          {/* Phase 2: Content Classification */}
          {frame >= P1_END && (
            <div
              style={{
                opacity: interpolate(frame, [P1_END, P1_END + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              }}
            >
              <SectionLabel text="CONTENT CLASSIFICATION" />

              {/* Content Category — first dropdown: hover People, then select Technology & Computing */}
              <AnimatedDropdown
                label="Concept"
                options={CONTENT_OPTIONS}
                selectedIndex={1} // "People"
                startFrame={P1_END + 2}
                durationFrames={18}
                frame={frame}
              />

              <AnimatedDropdown
                label="Content Category"
                options={["Nature & Environment", "Technology & Computing", "Art & Design"]}
                selectedIndex={1} // "Technology & Computing"
                startFrame={P1_END + 22}
                durationFrames={18}
                frame={frame}
              />

              <AnimatedDropdown
                label="Subcategory"
                options={SUBCATEGORY_OPTIONS}
                selectedIndex={1} // "Smartphones & Gadget Use"
                startFrame={P1_END + 42}
                durationFrames={18}
                frame={frame}
              />
            </div>
          )}

          {/* Phase 3: Visual Style Classification */}
          {frame >= P2_END && (
            <div
              style={{
                opacity: interpolate(frame, [P2_END, P2_END + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                marginTop: 4,
              }}
            >
              <SectionLabel text="VISUAL STYLE" />

              <AnimatedDropdown
                label="Style Category"
                options={STYLE_OPTIONS}
                selectedIndex={1} // "Portrait photography"
                startFrame={P2_END + 4}
                durationFrames={22}
                frame={frame}
              />

              <AnimatedDropdown
                label="Style Subcategory"
                options={STYLE_SUB_OPTIONS}
                selectedIndex={1} // "Urban outdoor portraits"
                startFrame={P2_END + 30}
                durationFrames={22}
                frame={frame}
              />
            </div>
          )}

          {/* Phase 4: Caption */}
          {frame >= P3_END && (
            <div
              style={{
                opacity: interpolate(frame, [P3_END, P3_END + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                marginTop: 4,
              }}
            >
              <SectionLabel text="CAPTION" />
              <div
                style={{
                  fontFamily: TOKENS.fonts.mono,
                  fontSize: 9,
                  lineHeight: 1.5,
                  color: TOKENS.colors.text,
                  padding: "6px 8px",
                  backgroundColor: "rgba(255,255,255,0.02)",
                  borderRadius: 3,
                  border: "1px solid rgba(255,255,255,0.06)",
                  minHeight: 40,
                }}
              >
                {ANNOTATION.caption.slice(0, captionChars)}
                {captionChars < ANNOTATION.caption.length && (
                  <span style={{ color: TOKENS.colors.accent }}>{"\u2588"}</span>
                )}
              </div>
            </div>
          )}

          {/* Phase 5: Taxonomy trees + Pipeline + JSON */}
          {frame >= P4_END && (
            <div
              style={{
                opacity: interpolate(frame, [P4_END, P4_END + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                marginTop: 6,
              }}
            >
              <SectionLabel text="TAXONOMY RESULT" />

              <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
                <TaxonomyTree
                  label="Content"
                  levels={[ANNOTATION.concept, ANNOTATION.category, ANNOTATION.subcategory]}
                  progress={interpolate(frame, [P4_END + 4, P4_END + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
                />
                <TaxonomyTree
                  label="Visual Style"
                  levels={[ANNOTATION.metaCategory, ANNOTATION.metaSubcategory]}
                  progress={interpolate(frame, [P4_END + 12, P4_END + 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
                />
              </div>

              {/* Pipeline stages */}
              <div style={{ marginBottom: 8 }}>
                <SectionLabel text="PIPELINE" />
                <PipelineStages activeIndex={pipelineActiveIdx} />
              </div>

              {/* JSON output */}
              <SectionLabel text="OUTPUT" />
              <JsonOutputBuilder progress={jsonProgress} />
            </div>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <BottomBar
        timeS={timeS}
        phaseLabel={phaseLabel}
        opacity={interpolate(frame, [10, 20], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })}
        rightInset={0}
      />

      {/* Tech metadata */}
      <TechMetadataOverlay codec="h264" resolution="1280x720" fps={30} duration="12s" />
    </AbsoluteFill>
  );
}

// ===========================================================================
// Main Export — routes based on compositionId
// ===========================================================================

const GAME_CAPTURE_IDS = new Set(["cs-game-capture", "sol-sim2real"]);

export default function ClassificationPipelineComposition({ compositionId }: Props) {
  if (GAME_CAPTURE_IDS.has(compositionId)) {
    return <GameCaptureWorkflow compositionId={compositionId} />;
  }
  // cs-vid-classify and any future classification compositions
  return <ClassificationWorkflow compositionId={compositionId} />;
}
