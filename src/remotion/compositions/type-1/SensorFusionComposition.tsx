import React from "react";
import {
  AbsoluteFill,
  Video,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";
import { TOKENS } from "../../shared/DesignTokens";
import { BoundingBox } from "../../shared/BoundingBox";
import { MetadataPanel } from "../../shared/MetadataPanel";
import type { MetadataSection, MetadataRow } from "../../shared/MetadataPanel";
import { BottomBar } from "../../shared/BottomBar";
import { TechMetadataOverlay } from "../../shared/TechMetadataOverlay";
import type {
  Type1Frame,
  Type1Annotation,
  HandAnnotation,
  ObjectAnnotation,
} from "./types";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface SensorFusionCompositionProps {
  compositionId: string;
}

// ---------------------------------------------------------------------------
// Data loading helpers
// ---------------------------------------------------------------------------

/**
 * Attempt to load annotation JSON from multiple possible locations:
 * 1. staticFile(`remotion-assets/annotations/${id}.json`) — direct annotation
 * 2. staticFile(`remotion-assets/enrichments/${id}.json`) — Gemini enrichment wrapper
 *
 * Returns null if neither exists (handled gracefully).
 */
function useAnnotationData(compositionId: string): Type1Frame[] | null {
  // Try loading the annotation JSON at build time via require
  // Remotion bundles these — we try/catch for graceful fallback
  try {
    // First try annotations directory (direct array format like video-annotations.json)
    const annotationsPath = `remotion-assets/annotations/${compositionId}.json`;
    const rawAnnotations = fetch(staticFile(annotationsPath));
    // If we get here, we have a potential file — but fetch is async.
    // In Remotion, we use a different approach: load via staticFile + delayRender.
    // However, for simplicity and to match EgocentricPipeline's pattern,
    // we use a synchronous approach with pre-imported data.
    void rawAnnotations; // suppress unused
  } catch {
    // File doesn't exist
  }

  return null;
}

// Since Remotion compositions are bundled at build time, and we need to support
// dynamic compositionId, we load all possible annotation files via a registry.
// For the actual implementation, we use fetch + delayRender pattern.

/**
 * Parse raw JSON data into Type1Frame[] regardless of format:
 * - Direct array of frames (like video-annotations.json)
 * - Enrichment wrapper with { data: { frames: [...] } }
 */
function parseAnnotationData(raw: unknown): Type1Frame[] {
  if (Array.isArray(raw)) {
    return raw as Type1Frame[];
  }
  const wrapper = raw as Type1Annotation;
  if (wrapper?.data?.frames && Array.isArray(wrapper.data.frames)) {
    return wrapper.data.frames;
  }
  return [];
}

// ---------------------------------------------------------------------------
// Keyframe interpolation — same algorithm as EgocentricPipeline.tsx
// ---------------------------------------------------------------------------

function getAnnotationAtTime(
  keyframes: Type1Frame[],
  timeS: number
): Type1Frame {
  if (keyframes.length === 0) {
    return createEmptyFrame(timeS);
  }
  if (keyframes.length === 1) return { ...keyframes[0], timestamp_s: timeS };
  if (timeS <= keyframes[0].timestamp_s) return keyframes[0];
  if (timeS >= keyframes[keyframes.length - 1].timestamp_s) {
    return keyframes[keyframes.length - 1];
  }

  // Find surrounding keyframes
  let before = keyframes[0];
  let after = keyframes[1];
  for (let i = 0; i < keyframes.length - 1; i++) {
    if (
      keyframes[i].timestamp_s <= timeS &&
      keyframes[i + 1].timestamp_s > timeS
    ) {
      before = keyframes[i];
      after = keyframes[i + 1];
      break;
    }
  }

  const t =
    (timeS - before.timestamp_s) /
    Math.max(0.001, after.timestamp_s - before.timestamp_s);

  // Interpolate object bboxes
  const interpObjects: ObjectAnnotation[] = before.objects.map((obj) => {
    const match = after.objects.find((o) => o.label === obj.label);
    if (!match) return obj;
    return {
      ...obj,
      bbox: obj.bbox.map((v, i) => v + (match.bbox[i] - v) * t) as [
        number,
        number,
        number,
        number,
      ],
    };
  });

  // Interpolate hand bboxes
  const interpHands: HandAnnotation[] = before.hands.map((hand) => {
    const match = after.hands.find((h) => h.side === hand.side);
    if (!match) return hand;
    return {
      ...hand,
      bbox: hand.bbox.map((v, i) => v + (match.bbox[i] - v) * t) as [
        number,
        number,
        number,
        number,
      ],
      action: t < 0.5 ? hand.action : match.action,
    };
  });

  // Add new hands from 'after' that don't exist in 'before'
  for (const afterHand of after.hands) {
    if (!before.hands.find((h) => h.side === afterHand.side)) {
      interpHands.push({ ...afterHand });
    }
  }

  return {
    ...before,
    timestamp_s: timeS,
    manipulation_phase:
      t < 0.5 ? before.manipulation_phase : after.manipulation_phase,
    objects: interpObjects,
    hands: interpHands,
    task_step: t < 0.5 ? before.task_step : after.task_step,
    task_pct: Math.round(
      before.task_pct + (after.task_pct - before.task_pct) * t
    ),
  };
}

function createEmptyFrame(timeS: number): Type1Frame {
  return {
    timestamp_s: timeS,
    manipulation_phase: "idle",
    task_step: "—",
    task_pct: 0,
    hands: [],
    objects: [],
  };
}

// ---------------------------------------------------------------------------
// Build MetadataPanel sections from annotation frame
// ---------------------------------------------------------------------------

function buildSections(annotation: Type1Frame): MetadataSection[] {
  const sections: MetadataSection[] = [];

  // TASK STATE
  sections.push({
    label: "TASK STATE",
    rows: [
      { key: "phase", value: annotation.manipulation_phase, color: TOKENS.colors.accent },
      { key: "step", value: annotation.task_step },
      { key: "completion", value: `${annotation.task_pct}%`, color: TOKENS.colors.accent, progress: annotation.task_pct },
    ],
  });

  // HAND TELEMETRY
  const hand = annotation.hands[0];
  if (hand) {
    const handRows: MetadataRow[] = [
      { key: "action", value: hand.action, color: TOKENS.bbox.hand },
      { key: "holding", value: hand.holding ?? "—" },
      { key: "grip", value: hand.finger_state ?? "—" },
      {
        key: "force",
        value: `${hand.force_estimate_N ?? 0} N`,
        color: TOKENS.colors.warning,
      },
      { key: "velocity", value: `${hand.velocity_ms ?? 0} m/s` },
    ];
    if (hand.wrist_pose) {
      handRows.push({
        key: "wrist xyz",
        value: `(${hand.wrist_pose.x.toFixed(2)}, ${hand.wrist_pose.y.toFixed(2)}, ${hand.wrist_pose.z_depth_est.toFixed(2)})`,
        color: TOKENS.colors.muted,
      });
    }
    sections.push({
      label: `${hand.side.toUpperCase()} HAND TELEMETRY`,
      rows: handRows,
    });
  }

  // OBJECT STATES
  const interactingObjects = annotation.objects
    .filter((o) => o.interacting)
    .slice(0, 3);
  const objectRows = interactingObjects.length > 0
    ? interactingObjects
    : annotation.objects.slice(0, 3);

  if (objectRows.length > 0) {
    sections.push({
      label: "OBJECT STATES",
      rows: objectRows.flatMap((obj): MetadataRow[] => {
        const objRows: MetadataRow[] = [
          {
            key: obj.label,
            value: `[${obj.affordance}]`,
            color: TOKENS.bbox.object,
          },
        ];
        if (obj.state) {
          objRows.push({ key: "  state", value: obj.state, color: TOKENS.colors.muted });
        }
        if (obj.fill_level_pct != null) {
          objRows.push({
            key: "  fill",
            value: `${obj.fill_level_pct}%`,
            color: TOKENS.colors.muted,
          });
        }
        if (obj.pose_6dof) {
          objRows.push({
            key: "  pitch",
            value: `${obj.pose_6dof.pitch}°`,
            color: TOKENS.colors.muted,
          });
        }
        return objRows;
      }),
    });
  }

  // SPATIAL
  if (annotation.spatial) {
    const s = annotation.spatial;
    sections.push({
      label: "SPATIAL",
      rows: [
        { key: "cam_height", value: `${s.camera_height_est_m ?? "—"} m` },
        { key: "cam_pitch", value: `${s.camera_pitch_deg ?? 0}°` },
        { key: "work_depth", value: `${s.workspace_depth_m ?? "—"} m` },
        { key: "hand_dist", value: `${s.dominant_hand_distance_m ?? "—"} m` },
      ],
    });
  }

  // IMU ESTIMATE
  if (annotation.imu_estimate) {
    const imu = annotation.imu_estimate;
    const imuRows: MetadataRow[] = [
      {
        key: "head",
        value: imu.head_stable ? "STABLE" : "MOVING",
        color: imu.head_stable ? TOKENS.colors.accent : TOKENS.colors.warning,
      },
    ];
    if (imu.head_angular_vel_dps) {
      imuRows.push({
        key: "ang_vel",
        value: `(${imu.head_angular_vel_dps.x}, ${imu.head_angular_vel_dps.y}, ${imu.head_angular_vel_dps.z}) °/s`,
        color: TOKENS.colors.muted,
      });
    }
    if (imu.linear_accel_ms2) {
      imuRows.push({
        key: "accel",
        value: `(${imu.linear_accel_ms2.x}, ${imu.linear_accel_ms2.y?.toFixed(1)}, ${imu.linear_accel_ms2.z}) m/s²`,
        color: TOKENS.colors.muted,
      });
    }
    sections.push({ label: "IMU ESTIMATE", rows: imuRows });
  }

  // SCENE
  if (annotation.scene) {
    const sc = annotation.scene;
    sections.push({
      label: "SCENE",
      rows: [
        { key: "lux", value: `${sc.lighting_lux_est ?? "—"}` },
        { key: "clutter", value: sc.clutter_level ?? "—" },
        { key: "surface", value: sc.surface_material ?? "—" },
      ],
    });
  }

  return sections;
}

// ---------------------------------------------------------------------------
// Placeholder fallback when annotation/video files are missing
// ---------------------------------------------------------------------------

const PlaceholderFallback: React.FC<{ compositionId: string; message: string }> = ({
  compositionId,
  message,
}) => (
  <AbsoluteFill
    style={{
      backgroundColor: "#0a0908",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: TOKENS.fonts.mono,
    }}
  >
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div
        style={{
          fontSize: 14,
          color: TOKENS.colors.muted,
          textTransform: "uppercase",
          letterSpacing: 4,
        }}
      >
        Type 1 — Sensor-Fusion Tracking
      </div>
      <div
        style={{
          fontSize: 24,
          color: TOKENS.colors.accent,
          fontWeight: 600,
        }}
      >
        {compositionId}
      </div>
      <div
        style={{
          fontSize: 11,
          color: TOKENS.colors.muted,
          marginTop: 8,
          maxWidth: 400,
          textAlign: "center",
          lineHeight: 1.6,
        }}
      >
        {message}
      </div>
    </div>
  </AbsoluteFill>
);

// ---------------------------------------------------------------------------
// Main Composition
// ---------------------------------------------------------------------------

const SensorFusionComposition: React.FC<SensorFusionCompositionProps> = ({
  compositionId,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();
  const timeS = frame / fps;

  // -- Data Loading --
  // Use delayRender + fetch pattern for dynamic compositionId
  const [keyframes, setKeyframes] = React.useState<Type1Frame[] | null>(null);
  const [videoAvailable, setVideoAvailable] = React.useState(false);
  const [dataError, setDataError] = React.useState<string | null>(null);

  // Suppress unused warning for useAnnotationData — kept for reference
  void useAnnotationData;

  const [handle] = React.useState(() => {
    // Dynamic import of delayRender
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { delayRender } = require("remotion") as {
        delayRender: (label?: string) => number;
      };
      return delayRender("Loading annotation data");
    } catch {
      return null;
    }
  });

  React.useEffect(() => {
    let cancelled = false;

    async function loadData() {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { continueRender } = require("remotion") as {
        continueRender: (handle: number) => void;
      };

      // Check if video sample exists (HEAD request to avoid downloading full file)
      try {
        const videoRes = await fetch(
          staticFile(`remotion-assets/samples/${compositionId}.mp4`),
          { method: "HEAD" }
        );
        if (!cancelled && videoRes.ok) {
          setVideoAvailable(true);
        }
      } catch {
        // Video not available — will render placeholder
      }

      // Try annotations directory first, then enrichments
      const paths = [
        `remotion-assets/annotations/${compositionId}.json`,
        `remotion-assets/enrichments/${compositionId}.json`,
      ];

      for (const path of paths) {
        try {
          const res = await fetch(staticFile(path));
          if (!res.ok) continue;
          const raw: unknown = await res.json();
          if (cancelled) return;
          const frames = parseAnnotationData(raw);
          if (frames.length > 0) {
            setKeyframes(frames);
            if (handle !== null) continueRender(handle);
            return;
          }
        } catch {
          // Try next path
        }
      }

      // No annotation data found — show placeholder
      if (!cancelled) {
        setDataError(
          `No annotation data found for "${compositionId}". Run the Gemini enrichment pipeline or place annotation JSON at remotion-assets/annotations/${compositionId}.json`
        );
        if (handle !== null) continueRender(handle);
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, [compositionId, handle]);

  // -- Fallback: no data --
  if (dataError) {
    return (
      <PlaceholderFallback compositionId={compositionId} message={dataError} />
    );
  }

  // -- Still loading --
  if (!keyframes) {
    return (
      <AbsoluteFill style={{ backgroundColor: "#0a0908" }} />
    );
  }

  // -- Interpolated annotation at current time --
  const annotation = getAnnotationAtTime(keyframes, timeS);

  // -- Timeline: frames 0-15 video only, 15-24 bboxes fade in,
  //    24-30 panel slides in, 30-270 full, 270-300 fade --
  const bboxOpacity = interpolate(frame, [15, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const showPanel = frame >= 24;
  const panelVisible = frame >= 30;

  // Global fade out at end: 270-300
  const globalOpacity = interpolate(
    frame,
    [0, 2, durationInFrames - 30, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Video source path
  const videoSrc = staticFile(`remotion-assets/samples/${compositionId}.mp4`);

  // Duration in seconds for TechMetadataOverlay
  const durationS = `${(durationInFrames / fps).toFixed(1)}s`;

  // Build metadata panel sections
  const sections = buildSections(annotation);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", opacity: globalOpacity }}>
      {/* Hero video — only rendered if sample exists to avoid delayRender timeout */}
      {videoAvailable ? (
        <Video
          src={videoSrc}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          onError={() => {}}
        />
      ) : (
        <AbsoluteFill
          style={{
            backgroundColor: "#0a0908",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: TOKENS.fonts.mono,
            fontSize: 12,
            color: TOKENS.colors.muted,
          }}
        >
          Video not found: {compositionId}.mp4
        </AbsoluteFill>
      )}

      {/* Gradient overlay for panel area */}
      {showPanel && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, transparent 0%, transparent 55%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,0.9) 100%)",
            opacity: interpolate(frame, [24, 30], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        />
      )}

      {/* Bounding box overlays */}
      <AbsoluteFill style={{ opacity: bboxOpacity }}>
        {/* Object bboxes */}
        {annotation.objects
          .filter((o) => o.interacting || annotation.objects.length <= 4)
          .slice(0, 5)
          .map((obj, i) => (
            <BoundingBox
              key={`obj-${obj.label}-${i}`}
              bbox={obj.bbox}
              label={obj.label}
              color={TOKENS.bbox.object}
              sublabel={obj.affordance}
              opacity={bboxOpacity}
            />
          ))}

        {/* Hand bboxes */}
        {annotation.hands.map((hand) => (
          <BoundingBox
            key={`hand-${hand.side}`}
            bbox={hand.bbox}
            label={`${hand.side.toUpperCase()}_HAND`}
            color={TOKENS.bbox.hand}
            sublabel={hand.action}
            opacity={bboxOpacity}
          />
        ))}
      </AbsoluteFill>

      {/* Sensor-fusion metadata panel */}
      <MetadataPanel
        title="sensor_fusion.json"
        sections={sections}
        width={320}
        visible={panelVisible}
        position="right"
        statusLabel="LIVE"
        statusColor={TOKENS.colors.accent}
      />

      {/* Tech metadata overlay */}
      <TechMetadataOverlay
        codec="h264"
        resolution={`${width}x${height}`}
        fps={fps}
        duration={durationS}
      />

      {/* Bottom bar */}
      <BottomBar
        timeS={timeS}
        phaseLabel={annotation.manipulation_phase}
        opacity={bboxOpacity}
        rightInset={panelVisible ? 320 : 0}
      />
    </AbsoluteFill>
  );
};

export default SensorFusionComposition;
