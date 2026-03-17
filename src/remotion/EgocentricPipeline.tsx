import {
  AbsoluteFill,
  Video,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  staticFile,
} from "remotion";
import keyframes from "../../public/remotion-assets/video-annotations.json";

// ---------------------------------------------------------------------------
// Design tokens
// ---------------------------------------------------------------------------
const ACCENT = "#92B090";
const BBOX_HAND = "#92B090";
const BBOX_OBJECT = "#4a90d9";
const TEXT = "#e8e8e8";
const MUTED = "#888";
const PANEL_BG = "rgba(10, 9, 8, 0.88)";

// ---------------------------------------------------------------------------
// Interpolate between keyframes for smooth bbox tracking
// ---------------------------------------------------------------------------

type Keyframe = (typeof keyframes)[0];

function getAnnotationAtTime(timeS: number): Keyframe {
  if (keyframes.length === 0) return keyframes[0];
  if (timeS <= keyframes[0].timestamp_s) return keyframes[0];
  if (timeS >= keyframes[keyframes.length - 1].timestamp_s)
    return keyframes[keyframes.length - 1];

  // Find surrounding keyframes
  let before = keyframes[0];
  let after = keyframes[1];
  for (let i = 0; i < keyframes.length - 1; i++) {
    if (keyframes[i].timestamp_s <= timeS && keyframes[i + 1].timestamp_s > timeS) {
      before = keyframes[i];
      after = keyframes[i + 1];
      break;
    }
  }

  const t =
    (timeS - before.timestamp_s) /
    Math.max(0.001, after.timestamp_s - before.timestamp_s);

  // Interpolate bboxes for matching objects
  const interpObjects = before.objects.map((obj) => {
    const match = after.objects.find((o) => o.label === obj.label);
    if (!match) return obj;
    return {
      ...obj,
      bbox: obj.bbox.map((v, i) => v + (match.bbox[i] - v) * t) as [number, number, number, number],
    };
  });

  // Interpolate hand bboxes
  const interpHands = before.hands.map((hand) => {
    const match = after.hands.find((h) => h.side === hand.side);
    if (!match) return hand;
    return {
      ...hand,
      bbox: hand.bbox.map((v, i) => v + (match.bbox[i] - v) * t) as [number, number, number, number],
      action: t < 0.5 ? hand.action : match.action,
    };
  });

  // Add any new hands from 'after' that don't exist in 'before' (fade in)
  for (const afterHand of after.hands) {
    if (!before.hands.find((h) => h.side === afterHand.side)) {
      interpHands.push({ ...afterHand });
    }
  }

  return {
    ...before,
    timestamp_s: timeS,
    manipulation_phase: t < 0.5 ? before.manipulation_phase : after.manipulation_phase,
    objects: interpObjects,
    hands: interpHands,
    task_step: t < 0.5 ? before.task_step : after.task_step,
    task_pct: Math.round(before.task_pct + (after.task_pct - before.task_pct) * t),
  };
}

// ---------------------------------------------------------------------------
// Bounding box with smooth animation
// ---------------------------------------------------------------------------
function BBox({
  bbox,
  label,
  color,
  sublabel,
  opacity,
}: {
  bbox: number[];
  label: string;
  color: string;
  sublabel?: string;
  opacity: number;
}) {
  const [x1, y1, x2, y2] = bbox;

  return (
    <div
      style={{
        position: "absolute",
        left: `${x1 * 100}%`,
        top: `${y1 * 100}%`,
        width: `${(x2 - x1) * 100}%`,
        height: `${(y2 - y1) * 100}%`,
        border: `2px solid ${color}`,
        borderRadius: 3,
        opacity: Math.min(opacity, 0.9),
        transition: "all 0.05s linear",
        boxShadow: `0 0 8px ${color}40`,
      }}
    >
      {/* Label */}
      <div
        style={{
          position: "absolute",
          top: -18,
          left: -1,
          backgroundColor: color,
          color: "#000",
          fontSize: 9,
          fontFamily: "JetBrains Mono, monospace",
          fontWeight: 700,
          padding: "1px 5px",
          borderRadius: "2px 2px 0 0",
          whiteSpace: "nowrap",
          letterSpacing: 0.5,
        }}
      >
        {label}
        {sublabel && (
          <span style={{ fontWeight: 400, marginLeft: 4, opacity: 0.8 }}>
            {sublabel}
          </span>
        )}
      </div>

      {/* Corner markers */}
      {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([cx, cy], i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: cx === 0 ? -2 : undefined,
            right: cx === 1 ? -2 : undefined,
            top: cy === 0 ? -2 : undefined,
            bottom: cy === 1 ? -2 : undefined,
            width: 6,
            height: 6,
            backgroundColor: color,
            borderRadius: 1,
          }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Side metadata panel — sensor-fusion grade
// ---------------------------------------------------------------------------
function SidePanel({ annotation, show }: { annotation: Keyframe; show: boolean }) {
  const hand = annotation.hands[0]; // primary hand
  const spatial = (annotation as Record<string, unknown>).spatial as { camera_height_est_m?: number; camera_pitch_deg?: number; workspace_depth_m?: number; dominant_hand_distance_m?: number } | undefined;
  const imu = (annotation as Record<string, unknown>).imu_estimate as { head_angular_vel_dps?: { x: number; y: number; z: number }; linear_accel_ms2?: { x: number; y: number; z: number }; head_stable?: boolean } | undefined;
  const scene = (annotation as Record<string, unknown>).scene as { lighting_lux_est?: number; clutter_level?: string; surface_material?: string } | undefined;

  return (
    <div
      style={{
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        width: 320,
        backgroundColor: PANEL_BG,
        backdropFilter: "blur(12px)",
        borderLeft: `1px solid ${ACCENT}30`,
        opacity: show ? 1 : 0,
        transform: show ? "translateX(0)" : "translateX(20px)",
        transition: "all 0.3s ease",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Terminal header */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderBottom: `1px solid ${ACCENT}20` }}>
        <div style={{ display: "flex", gap: 4 }}>
          {["rgba(239,68,68,0.5)", "rgba(234,179,8,0.5)", "rgba(34,197,94,0.5)"].map((c, i) => (
            <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: c }} />
          ))}
        </div>
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: MUTED }}>
          sensor_fusion.json
        </span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: ACCENT }} />
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: ACCENT }}>LIVE</span>
        </div>
      </div>

      {/* Scrollable data */}
      <div style={{ padding: "8px 12px", flex: 1, fontFamily: "JetBrains Mono, monospace", fontSize: 9, overflow: "hidden", lineHeight: 1.6 }}>

        {/* ── Task State ── */}
        <SectionLabel text="TASK STATE" />
        <Row label="phase" value={annotation.manipulation_phase} color={ACCENT} />
        <Row label="step" value={annotation.task_step} />
        <Row label="completion" value={`${annotation.task_pct}%`} color={ACCENT} />

        {/* Progress bar */}
        <div style={{ margin: "4px 0 8px", height: 2, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 1, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${annotation.task_pct}%`, backgroundColor: ACCENT, borderRadius: 1, transition: "width 0.3s" }} />
        </div>

        {/* ── Hand Telemetry ── */}
        {hand && (
          <>
            <SectionLabel text={`${hand.side.toUpperCase()} HAND TELEMETRY`} />
            <Row label="action" value={hand.action} color={BBOX_HAND} />
            <Row label="holding" value={hand.holding ?? "—"} />
            <Row label="grip" value={(hand as Record<string, unknown>).finger_state as string ?? "—"} />
            <Row label="force" value={`${(hand as Record<string, unknown>).force_estimate_N ?? 0} N`} color="#f5a623" />
            <Row label="velocity" value={`${(hand as Record<string, unknown>).velocity_ms ?? 0} m/s`} />
            {(hand as Record<string, unknown>).wrist_pose && (
              <Row
                label="wrist xyz"
                value={`(${((hand as Record<string, unknown>).wrist_pose as Record<string, number>).x?.toFixed(2)}, ${((hand as Record<string, unknown>).wrist_pose as Record<string, number>).y?.toFixed(2)}, ${((hand as Record<string, unknown>).wrist_pose as Record<string, number>).z_depth_est?.toFixed(2)})`}
                color={MUTED}
              />
            )}
          </>
        )}

        {/* ── Objects ── */}
        <SectionLabel text="OBJECT STATES" />
        {annotation.objects.filter(o => o.interacting).slice(0, 3).map((obj) => (
          <div key={obj.label} style={{ marginBottom: 4 }}>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <span style={{ color: BBOX_OBJECT }}>■</span>
              <span style={{ color: TEXT }}>{obj.label}</span>
              <span style={{ color: MUTED, fontSize: 8 }}>[{obj.affordance}]</span>
            </div>
            <div style={{ paddingLeft: 14, color: MUTED }}>
              {Boolean((obj as Record<string, unknown>).state) && <span>state: {String((obj as Record<string, unknown>).state)} · </span>}
              {(obj as Record<string, unknown>).fill_level_pct != null && <span>fill: {String((obj as Record<string, unknown>).fill_level_pct)}% · </span>}
              {Boolean((obj as Record<string, unknown>).pose_6dof) && (
                <span>pitch: {((obj as Record<string, unknown>).pose_6dof as Record<string, number>).pitch}°</span>
              )}
            </div>
          </div>
        ))}

        {/* ── Spatial Estimation ── */}
        {spatial && (
          <>
            <SectionLabel text="SPATIAL" />
            <Row label="cam_height" value={`${spatial.camera_height_est_m ?? "—"} m`} />
            <Row label="cam_pitch" value={`${spatial.camera_pitch_deg ?? 0}°`} />
            <Row label="work_depth" value={`${spatial.workspace_depth_m ?? "—"} m`} />
            <Row label="hand_dist" value={`${spatial.dominant_hand_distance_m ?? "—"} m`} />
          </>
        )}

        {/* ── IMU ── */}
        {imu && (
          <>
            <SectionLabel text="IMU ESTIMATE" />
            <Row label="head" value={imu.head_stable ? "STABLE" : "MOVING"} color={imu.head_stable ? ACCENT : "#f5a623"} />
            {imu.head_angular_vel_dps && (
              <Row label="ang_vel" value={`(${imu.head_angular_vel_dps.x}, ${imu.head_angular_vel_dps.y}, ${imu.head_angular_vel_dps.z}) °/s`} color={MUTED} />
            )}
            {imu.linear_accel_ms2 && (
              <Row label="accel" value={`(${imu.linear_accel_ms2.x}, ${imu.linear_accel_ms2.y?.toFixed(1)}, ${imu.linear_accel_ms2.z}) m/s²`} color={MUTED} />
            )}
          </>
        )}

        {/* ── Scene ── */}
        {scene && (
          <>
            <SectionLabel text="SCENE" />
            <Row label="lux" value={`${scene.lighting_lux_est ?? "—"}`} />
            <Row label="clutter" value={scene.clutter_level ?? "—"} />
            <Row label="surface" value={scene.surface_material ?? "—"} />
          </>
        )}
      </div>
    </div>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, margin: "6px 0 4px" }}>
      <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 8, color: ACCENT, letterSpacing: 1.5, fontWeight: 700 }}>
        {text}
      </span>
      <div style={{ flex: 1, height: 1, background: `${ACCENT}20` }} />
    </div>
  );
}

function Row({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 3 }}>
      <span style={{ color: ACCENT, minWidth: 70 }}>{label}:</span>
      <span style={{ color: color ?? TEXT, wordBreak: "break-word" }}>{value}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main composition
// ---------------------------------------------------------------------------
export default function EgocentricPipeline() {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const timeS = frame / fps;
  const annotation = getAnnotationAtTime(timeS);

  // Fade in overlay after 0.5s
  const overlayOpacity = interpolate(frame, [0, fps * 0.5, fps * 0.8], [0, 0, 1], {
    extrapolateRight: "clamp",
  });

  // Show panel after 1s
  const showPanel = frame > fps * 1;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Real video */}
      <Video
        src={staticFile("remotion-assets/pour-liquid.mp4")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* Gradient overlay for panel area */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: showPanel
            ? "linear-gradient(to right, transparent 0%, transparent 55%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,0.9) 100%)"
            : "none",
          transition: "background 0.5s ease",
        }}
      />

      {/* Bounding box overlays */}
      <AbsoluteFill style={{ opacity: overlayOpacity }}>
        {/* Object bboxes */}
        {annotation.objects
          .filter((o) => o.interacting || annotation.objects.length <= 3)
          .slice(0, 4)
          .map((obj, i) => (
            <BBox
              key={`${obj.label}-${i}`}
              bbox={obj.bbox}
              label={obj.label}
              color={BBOX_OBJECT}
              sublabel={obj.affordance ?? undefined}
              opacity={overlayOpacity}
            />
          ))}

        {/* Hand bboxes */}
        {annotation.hands.map((hand) => (
          <BBox
            key={hand.side}
            bbox={hand.bbox}
            label={`${hand.side.toUpperCase()}_HAND`}
            color={BBOX_HAND}
            sublabel={hand.action}
            opacity={overlayOpacity}
          />
        ))}
      </AbsoluteFill>

      {/* Side panel */}
      <SidePanel annotation={annotation} show={showPanel} />

      {/* Bottom bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: showPanel ? 300 : 0,
          height: 32,
          backgroundColor: "rgba(10, 9, 8, 0.85)",
          display: "flex",
          alignItems: "center",
          padding: "0 12px",
          gap: 16,
          opacity: overlayOpacity,
        }}
      >
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: ACCENT }}>
          CLARU
        </span>
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: MUTED }}>
          t={timeS.toFixed(1)}s
        </span>
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: TEXT }}>
          {annotation.manipulation_phase}
        </span>
        {/* Scrub bar */}
        <div style={{ flex: 1, height: 2, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 1, marginLeft: 8 }}>
          <div style={{ height: "100%", width: `${(frame / durationInFrames) * 100}%`, backgroundColor: ACCENT, borderRadius: 1 }} />
        </div>
      </div>
    </AbsoluteFill>
  );
}
