// ---------------------------------------------------------------------------
// Benchmark Page — Type Definitions (Wave 4)
// ---------------------------------------------------------------------------
// Extends ProgrammaticPageBase with benchmark-specific fields.
// These pages explain how real-world data bridges the sim-to-real gap.
// ---------------------------------------------------------------------------

import type {
  ProgrammaticPageBase,
  ProgrammaticCitation,
} from "../types";

/** A Claru dataset that complements the benchmark. */
export interface ComplementaryDataset {
  /** Dataset name */
  name: string;
  /** Why this dataset helps */
  rationale: string;
}

export interface BenchmarkPageData extends ProgrammaticPageBase {
  /** Display name, e.g. "RLBench" */
  benchmarkName: string;

  /** Benchmark overview — what it is, who created it, when */
  benchmarkDescription: string;

  /** Types of tasks in the benchmark */
  taskSet: string;

  /** Observation space description (RGB, depth, proprioception, etc.) */
  observationSpace: string;

  /** Action space description (joint angles, end-effector poses, etc.) */
  actionSpace: string;

  /** How performance is measured */
  evaluationProtocol: string;

  /** The sim-to-real gap specific to this benchmark */
  simToRealGap: string;

  /** What real-world data is needed to bridge that gap */
  realWorldDataNeeds: string;

  /** Which Claru datasets complement this benchmark */
  complementaryDatasets: ComplementaryDataset[];

  /** Key papers about or using this benchmark */
  keyPapers: ProgrammaticCitation[];

  /** Technical prose on bridging the gap */
  technicalAnalysis: string;
}
