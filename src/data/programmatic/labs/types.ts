// ---------------------------------------------------------------------------
// Lab-Specific Page — Type Definitions (Wave 4)
// ---------------------------------------------------------------------------
// Extends ProgrammaticPageBase with lab-specific fields.
// These pages serve as outbound sales collateral for robotics labs.
// ---------------------------------------------------------------------------

import type {
  ProgrammaticPageBase,
  ProgrammaticCitation,
} from "../types";

/** A known data need derived from job postings, papers, or public statements. */
export interface LabDataNeed {
  /** Short title, e.g. "Dexterous manipulation trajectories" */
  title: string;
  /** Where this need was surfaced, e.g. "Job posting for ML Engineer, Feb 2025" */
  source: string;
  /** Description of the data requirement */
  description: string;
}

/** Mapping between a lab's need and a Claru data type. */
export interface ClaruDataMatch {
  /** The lab's need */
  labNeed: string;
  /** The matching Claru data type or dataset */
  claruOffering: string;
  /** Why this is a good match */
  rationale: string;
}

export interface LabPageData extends ProgrammaticPageBase {
  /** Company / lab display name, e.g. "Figure AI" */
  companyName: string;

  /** What the lab builds — e.g. "general-purpose humanoid robots" */
  companyDescription: string;

  /** Key robots or systems the lab has built */
  keyProducts: string[];

  /** Primary research focus areas */
  researchFocus: string[];

  /** Known data needs derived from public sources */
  dataNeedsSummary: string;

  /** Specific data needs with sourcing */
  dataNeeds: LabDataNeed[];

  /** How Claru data types map to the lab's needs */
  dataMatches: ClaruDataMatch[];

  /** Published research papers referencing data requirements */
  keyPapers: ProgrammaticCitation[];

  /** Technical deep-dive prose on the lab's data challenges */
  technicalAnalysis: string;
}
