// ---------------------------------------------------------------------------
// Type 1: Sensor-Fusion Tracking — annotation data interfaces
// ---------------------------------------------------------------------------

/** 6-DOF pose estimate for an object */
export interface Pose6DOF {
  roll: number;
  pitch: number;
  yaw: number;
}

/** Wrist 3D position estimate */
export interface WristPose {
  x: number;
  y: number;
  z_depth_est: number;
}

/** Hand annotation within a single frame */
export interface HandAnnotation {
  side: "left" | "right";
  /** Normalized bbox [x1, y1, x2, y2] in range [0, 1] */
  bbox: [number, number, number, number];
  action: string;
  holding: string | null;
  wrist_pose?: WristPose;
  finger_state?: string;
  force_estimate_N?: number;
  velocity_ms?: number;
}

/** Object annotation within a single frame */
export interface ObjectAnnotation {
  label: string;
  /** Normalized bbox [x1, y1, x2, y2] in range [0, 1] */
  bbox: [number, number, number, number];
  affordance: string;
  interacting: boolean;
  state?: string;
  fill_level_pct?: number | null;
  pose_6dof?: Pose6DOF;
}

/** Spatial estimation data */
export interface SpatialEstimate {
  camera_height_est_m: number;
  camera_pitch_deg: number;
  workspace_depth_m: number;
  dominant_hand_distance_m: number;
}

/** IMU (Inertial Measurement Unit) estimate */
export interface IMUEstimate {
  head_angular_vel_dps: { x: number; y: number; z: number };
  linear_accel_ms2: { x: number; y: number; z: number };
  head_stable: boolean;
}

/** Scene context information */
export interface SceneContext {
  environment?: string;
  lighting_lux_est: number;
  clutter_level: string;
  surface_material: string;
}

/** A single keyframe of Type 1 annotation data */
export interface Type1Frame {
  timestamp_s: number;
  manipulation_phase: string;
  task_step: string;
  task_pct: number;
  hands: HandAnnotation[];
  objects: ObjectAnnotation[];
  spatial?: SpatialEstimate;
  imu_estimate?: IMUEstimate;
  scene?: SceneContext;
}

/** Top-level annotation structure — either raw array or enrichment wrapper */
export interface Type1Annotation {
  compositionId?: string;
  type?: number;
  annotationSource?: string;
  generatedAt?: string;
  framesAnalyzed?: number;
  data?: {
    frames: Type1Frame[];
  };
}
