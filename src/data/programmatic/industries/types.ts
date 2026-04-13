// ---------------------------------------------------------------------------
// Industry Vertical Page — Type Extension for Wave 3
// ---------------------------------------------------------------------------
// Extends ProgrammaticPageBase with industry-specific metadata including
// regulations, environment characteristics, and task taxonomies.
// ---------------------------------------------------------------------------

import type { ProgrammaticPageBase, ProgrammaticCitation } from "../types";

/** A regulatory framework relevant to data collection in this industry. */
export interface RegulatoryRequirement {
  name: string;
  jurisdiction: string;
  description: string;
  dataImplications: string;
}

/** A characteristic of the physical environment. */
export interface EnvironmentCharacteristic {
  characteristic: string;
  description: string;
  dataChallenge: string;
}

/** A common robotics task in this industry. */
export interface IndustryTask {
  task: string;
  description: string;
  dataRequirements: string;
}

export interface IndustryPageData extends ProgrammaticPageBase {
  /** Regulatory frameworks affecting data collection */
  regulations: RegulatoryRequirement[];
  /** Physical environment characteristics */
  environmentCharacteristics: EnvironmentCharacteristic[];
  /** Common robotics tasks in this industry */
  commonTasks: IndustryTask[];
  /** Data modalities most relevant to this industry */
  relevantModalities: string[];
  /** Key papers or industry reports */
  keyPapers: ProgrammaticCitation[];
  /** How Claru serves this industry */
  claruRelevance: string;
}
