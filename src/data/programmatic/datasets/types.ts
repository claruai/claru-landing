// ---------------------------------------------------------------------------
// Dataset Page — Type Extension for Wave 3
// ---------------------------------------------------------------------------
// Extends ProgrammaticPageBase with dataset-specific metadata including
// modalities, volume stats, comparison tables, and use cases.
// ---------------------------------------------------------------------------

import type { ProgrammaticPageBase, ProgrammaticCitation } from "../types";

/** Modalities captured in this dataset. */
export type DataModality =
  | "rgb"
  | "depth"
  | "stereo"
  | "thermal"
  | "lidar"
  | "imu"
  | "audio"
  | "force-torque"
  | "point-cloud"
  | "event-camera";

/** Technical profile of the dataset. */
export interface DatasetProfile {
  /** Sensor modalities included */
  modalities: DataModality[];
  /** Total number of clips / sequences */
  totalClips: string;
  /** Total hours of recording */
  totalHours: string;
  /** Annotation layers applied */
  annotationLayers: string[];
  /** Output delivery formats */
  formats: string[];
  /** Typical resolution, e.g. "1920x1080" */
  resolution: string;
  /** Frame rate, e.g. "30 fps" */
  fps: string;
}

/** Comparison row against a known public dataset. */
export interface PublicDatasetComparison {
  name: string;
  clips: string;
  hours: string;
  modalities: string;
  environments: string;
  annotations: string;
}

/** A use case showing which model type trains on this data. */
export interface DatasetUseCase {
  modelType: string;
  description: string;
  exampleModels: string[];
}

export interface DatasetPageData extends ProgrammaticPageBase {
  /** Technical profile of the dataset */
  datasetProfile: DatasetProfile;
  /** Comparison against public academic datasets */
  comparisonWithPublic: PublicDatasetComparison[];
  /** Use cases and model types that benefit from this data */
  useCases: DatasetUseCase[];
  /** Key papers referenced */
  keyPapers: ProgrammaticCitation[];
  /** How Claru collects / delivers this data */
  claruRelevance: string;
}
