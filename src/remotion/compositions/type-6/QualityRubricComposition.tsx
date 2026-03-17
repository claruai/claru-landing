import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  delayRender,
  continueRender,
} from "remotion";
import { TOKENS } from "../../shared/DesignTokens";
import { BottomBar } from "../../shared/BottomBar";
import { TechMetadataOverlay } from "../../shared/TechMetadataOverlay";

// ---------------------------------------------------------------------------
// Type 6: Quality Rubric — Multi-Labeler Annotation Workflow
// Shows: Video prompt → Labeler 1 evaluates → Labeler 2 evaluates →
//        Aggregate score → Full JSON output with enriched metadata
// ---------------------------------------------------------------------------

interface Props {
  compositionId: string;
}

// Real annotation data from two actual labelers (different user IDs, real timestamps)
const LABELER_1 = {
  id: "019b55f0",
  evaluations: {
    isCinematic: null as string | null, // undefined in original = skipped
    hasGoodMotion: "good-motion",
    isHighQuality: "high-quality",
    isVideoInteresting: "interesting",
    hasGoodTextAlignment: "good-alignment",
  },
  timeToComplete: "1m 22s",
  watchedTo: "4.84s",
};

const LABELER_2 = {
  id: "311b2560",
  evaluations: {
    isCinematic: null as string | null,
    hasGoodMotion: "good-motion",
    isHighQuality: "high-quality",
    isVideoInteresting: "interesting",
    hasGoodTextAlignment: "good-alignment",
  },
  timeToComplete: "2m 05s",
  watchedTo: "4.87s",
};

const DIMENSIONS = [
  { key: "isCinematic", label: "Cinematic", options: ["cinematic", "not-cinematic"] },
  { key: "hasGoodMotion", label: "Motion", options: ["good-motion", "bad-motion"] },
  { key: "isHighQuality", label: "Quality", options: ["high-quality", "not-high-quality"] },
  { key: "isVideoInteresting", label: "Interest", options: ["interesting", "not-interesting"] },
  { key: "hasGoodTextAlignment", label: "Alignment", options: ["good-alignment", "bad-alignment"] },
];

const VIDEO_META = {
  prompt_key: "dt_2024_11_28_02_04_798319910_clips_79oejzc7_clip_1.mp4",
  source: "s3://mv-troveo/2024_11_28_tranche4/delivery41/",
  description: "A vibrant pool party atmosphere, filled with people lounging on inflatable floats and enjoying the water. Colorful inflatables dominate the scene as groups socialize in a sunlit outdoor pool.",
  num_frames: 149,
  subcategory: "Outdoor Recreation",
};

// Timeline phases (360 frames = 12s at 30fps)
const T = {
  FADE_IN: 0,
  PROMPT_SHOW: 15,       // show the video source/prompt info
  LABELER_1_START: 60,   // labeler 1 evaluates
  LABELER_1_END: 150,
  LABELER_2_START: 160,  // labeler 2 evaluates
  LABELER_2_END: 240,
  AGGREGATE: 250,        // show aggregate + agreement
  JSON_OUTPUT: 290,      // final JSON result
  HOLD: 340,
};

function PromptPanel({ frame }: { frame: number }) {
  const opacity = interpolate(frame, [T.PROMPT_SHOW, T.PROMPT_SHOW + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [T.LABELER_1_START - 10, T.LABELER_1_START], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  if (frame >= T.LABELER_1_START) return null;

  return (
    <Panel opacity={opacity * fadeOut} title="source_metadata.json">
      <Row label="file" value={VIDEO_META.prompt_key} mono />
      <Row label="source" value={VIDEO_META.source} mono />
      <Row label="category" value={VIDEO_META.subcategory} color={TOKENS.colors.accent} />
      <Row label="frames" value={String(VIDEO_META.num_frames)} />
      <div style={{ marginTop: 8, fontSize: 9, color: TOKENS.colors.muted, lineHeight: 1.5 }}>
        <span style={{ color: TOKENS.colors.accent }}>description: </span>
        {VIDEO_META.description}
      </div>
    </Panel>
  );
}

function LabelerPanel({ frame, labeler, labelerId, startFrame, endFrame }: {
  frame: number;
  labeler: typeof LABELER_1;
  labelerId: number;
  startFrame: number;
  endFrame: number;
}) {
  const opacity = interpolate(frame, [startFrame, startFrame + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = frame >= endFrame + 10 ? interpolate(frame, [endFrame + 10, endFrame + 20], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;

  if (frame < startFrame || frame > endFrame + 20) return null;

  const stepsPerDim = (endFrame - startFrame) / 5;
  const currentDim = Math.min(Math.floor((frame - startFrame) / stepsPerDim), 4);
  const withinDim = (frame - startFrame) - currentDim * stepsPerDim;
  const isClicking = withinDim >= stepsPerDim * 0.6 && withinDim <= stepsPerDim * 0.75;

  return (
    <Panel opacity={opacity * fadeOut} title={`labeler_${labelerId} (${labeler.id})`} statusLabel={`${labeler.timeToComplete}`}>
      {DIMENSIONS.map((dim, idx) => {
        const val = labeler.evaluations[dim.key as keyof typeof labeler.evaluations];
        const isSkipped = val === null;
        const isDone = idx < currentDim || (idx === currentDim && withinDim > stepsPerDim * 0.75);
        const isActive = idx === currentDim;
        const hovering = isActive && withinDim >= stepsPerDim * 0.3 && !isDone;

        return (
          <div key={dim.key} style={{ marginBottom: 8, opacity: idx <= currentDim + 1 ? 1 : 0.3 }}>
            <div style={{ fontSize: 8, color: isActive ? TOKENS.colors.accent : TOKENS.colors.muted, fontWeight: isActive ? 700 : 400, marginBottom: 3 }}>
              {dim.label}
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {isSkipped && isDone ? (
                <div style={{ padding: "2px 6px", borderRadius: 2, fontSize: 8, color: TOKENS.colors.muted, fontStyle: "italic" }}>
                  skipped
                </div>
              ) : (
                dim.options.map((opt) => {
                  const selected = isDone && opt === val;
                  const hovered = hovering && opt === val;
                  return (
                    <div
                      key={opt}
                      style={{
                        padding: "2px 6px",
                        borderRadius: 2,
                        fontSize: 8,
                        border: `1px solid ${selected ? TOKENS.colors.accent : hovered ? TOKENS.colors.accent + "50" : "rgba(255,255,255,0.08)"}`,
                        backgroundColor: selected ? TOKENS.colors.accent + "20" : "transparent",
                        color: selected ? TOKENS.colors.accent : TOKENS.colors.text,
                      }}
                    >
                      {opt}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
      {/* Cursor */}
      {isClicking && (
        <div style={{ position: "absolute", right: 60, top: 50 + currentDim * 42, opacity: 0.8 }}>
          <svg width="12" height="15" viewBox="0 0 12 15" fill="none">
            <path d="M1 1L1 11L3.5 8.5L6.5 14L8.5 13L5.5 7.5L9 7.5L1 1Z" fill="white" stroke="#333" strokeWidth="0.5" />
          </svg>
        </div>
      )}
    </Panel>
  );
}

function AggregatePanel({ frame }: { frame: number }) {
  const opacity = interpolate(frame, [T.AGGREGATE, T.AGGREGATE + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = frame >= T.JSON_OUTPUT - 5 ? interpolate(frame, [T.JSON_OUTPUT - 5, T.JSON_OUTPUT + 5], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;

  if (frame < T.AGGREGATE || frame > T.JSON_OUTPUT + 10) return null;

  return (
    <Panel opacity={opacity * fadeOut} title="inter_rater_agreement">
      {DIMENSIONS.map((dim) => {
        const v1 = LABELER_1.evaluations[dim.key as keyof typeof LABELER_1.evaluations];
        const v2 = LABELER_2.evaluations[dim.key as keyof typeof LABELER_2.evaluations];
        const bothSkipped = v1 === null && v2 === null;
        const agree = v1 === v2;
        return (
          <div key={dim.key} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <span style={{ fontSize: 8, color: TOKENS.colors.muted, width: 55 }}>{dim.label}</span>
            <span style={{ fontSize: 8, color: TOKENS.colors.text, width: 75 }}>{v1 ?? "skipped"}</span>
            <span style={{ fontSize: 8, color: bothSkipped ? TOKENS.colors.muted : agree ? TOKENS.colors.success : TOKENS.colors.error }}>
              {bothSkipped ? "— skipped" : agree ? "✓ agree" : "✗ disagree"}
            </span>
          </div>
        );
      })}
      <div style={{ marginTop: 10, padding: "4px 8px", backgroundColor: TOKENS.colors.accent + "15", borderRadius: 3, border: `1px solid ${TOKENS.colors.accent}30` }}>
        <div style={{ fontSize: 9, color: TOKENS.colors.accent, fontWeight: 700 }}>
          Agreement: 5/5 (100%)
        </div>
        <div style={{ fontSize: 8, color: TOKENS.colors.muted, marginTop: 2 }}>
          Consensus: 3/5 dimensions passed
        </div>
      </div>
    </Panel>
  );
}

function JsonOutputPanel({ frame }: { frame: number }) {
  const buildProgress = interpolate(frame, [T.JSON_OUTPUT, T.JSON_OUTPUT + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  if (buildProgress <= 0) return null;

  const result = {
    annotation_type: "HIGH_QUALITY_VIDEO_EVALUATION",
    source_key: "dt_2024_11_28...clip_1.mp4",
    category: "Outdoor Recreation",
    description: "Vibrant pool party with inflatable floats...",
    num_frames: 149,
    evaluations: {
      isCinematic: "skipped",
      hasGoodMotion: "good-motion",
      isHighQuality: "high-quality",
      isVideoInteresting: "interesting",
      hasGoodTextAlignment: "good-alignment",
    },
    labeler_count: 2,
    agreement_rate: "100%",
    consensus_score: "4/5 passed",
    status: "completed",
  };

  const jsonStr = JSON.stringify(result, null, 2);
  const visible = jsonStr.substring(0, Math.floor(jsonStr.length * buildProgress));

  return (
    <Panel opacity={1} title="final_output.json" statusLabel="✓">
      <pre style={{ fontSize: 8, lineHeight: 1.5, color: TOKENS.colors.text, whiteSpace: "pre-wrap", margin: 0 }}>
        {visible}
        <span style={{ opacity: frame % 20 < 10 ? 1 : 0, color: TOKENS.colors.accent }}>▊</span>
      </pre>
    </Panel>
  );
}

function Panel({ children, opacity, title, statusLabel }: { children: React.ReactNode; opacity: number; title: string; statusLabel?: string }) {
  return (
    <div style={{
      position: "absolute", right: 0, top: 0, bottom: 0, width: 280,
      backgroundColor: TOKENS.colors.panelBg, backdropFilter: "blur(12px)",
      borderLeft: `1px solid ${TOKENS.colors.accent}30`, opacity,
      display: "flex", flexDirection: "column", overflow: "hidden",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderBottom: `1px solid ${TOKENS.colors.accent}20` }}>
        <div style={{ display: "flex", gap: 4 }}>
          {["rgba(239,68,68,0.5)", "rgba(234,179,8,0.5)", "rgba(34,197,94,0.5)"].map((c, i) => (
            <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: c }} />
          ))}
        </div>
        <span style={{ fontFamily: TOKENS.fonts.mono, fontSize: 9, color: TOKENS.colors.muted }}>{title}</span>
        {statusLabel && <span style={{ marginLeft: "auto", fontFamily: TOKENS.fonts.mono, fontSize: 9, color: TOKENS.colors.accent }}>{statusLabel}</span>}
      </div>
      <div style={{ padding: "8px 12px", flex: 1, fontFamily: TOKENS.fonts.mono, fontSize: 9, position: "relative", overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );
}

function Row({ label, value, color, mono }: { label: string; value: string; color?: string; mono?: boolean }) {
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 3 }}>
      <span style={{ color: TOKENS.colors.accent, minWidth: 60 }}>{label}:</span>
      <span style={{ color: color ?? TOKENS.colors.text, fontSize: mono ? 8 : 9, wordBreak: "break-all" }}>{value}</span>
    </div>
  );
}

export default function QualityRubricComposition({ compositionId }: Props) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const timeS = frame / fps;

  const [videoReady, setVideoReady] = useState(false);
  const [handle] = useState(() => delayRender("Checking video"));

  useEffect(() => {
    fetch(staticFile(`remotion-assets/samples/${compositionId}.mp4`), { method: "HEAD" })
      .then((r) => { setVideoReady(r.ok); continueRender(handle); })
      .catch(() => { setVideoReady(false); continueRender(handle); });
  }, [compositionId, handle]);

  const masterOpacity = interpolate(frame, [0, 12, durationInFrames - 15, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Phase indicator
  let phaseLabel = "Source Review";
  if (frame >= T.LABELER_1_START) phaseLabel = "Labeler 1 Evaluating";
  if (frame >= T.LABELER_2_START) phaseLabel = "Labeler 2 Evaluating";
  if (frame >= T.AGGREGATE) phaseLabel = "Inter-Rater Agreement";
  if (frame >= T.JSON_OUTPUT) phaseLabel = "Output Generated";

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", opacity: masterOpacity }}>
      {videoReady ? (
        <OffthreadVideo src={staticFile(`remotion-assets/samples/${compositionId}.mp4`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <AbsoluteFill style={{ backgroundColor: "#0a0908", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: TOKENS.fonts.mono, fontSize: 14, color: TOKENS.colors.muted }}>{compositionId}</span>
        </AbsoluteFill>
      )}

      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 0%, transparent 50%, rgba(0,0,0,0.75) 75%, rgba(0,0,0,0.92) 100%)" }} />

      {/* Phase 1: Show prompt/source metadata */}
      <PromptPanel frame={frame} />

      {/* Phase 2: Labeler 1 evaluates */}
      <LabelerPanel frame={frame} labeler={LABELER_1} labelerId={1} startFrame={T.LABELER_1_START} endFrame={T.LABELER_1_END} />

      {/* Phase 3: Labeler 2 evaluates */}
      <LabelerPanel frame={frame} labeler={LABELER_2} labelerId={2} startFrame={T.LABELER_2_START} endFrame={T.LABELER_2_END} />

      {/* Phase 4: Aggregate agreement */}
      <AggregatePanel frame={frame} />

      {/* Phase 5: Final JSON output */}
      <JsonOutputPanel frame={frame} />

      <BottomBar timeS={timeS} phaseLabel={phaseLabel} opacity={interpolate(frame, [12, 20], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })} rightInset={280} />
      <TechMetadataOverlay codec="h264" resolution="1920×1080" fps={30} duration="5.0s" />
    </AbsoluteFill>
  );
}
