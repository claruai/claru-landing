// ---------------------------------------------------------------------------
// Format / Standard Page — Type Extension for Wave 3
// ---------------------------------------------------------------------------
// Extends ProgrammaticPageBase with format-specific metadata including
// schema details, framework compatibility, and conversion guidance.
// ---------------------------------------------------------------------------

import type { ProgrammaticPageBase, ProgrammaticCitation } from "../types";

/** A framework or model that natively uses this format. */
export interface FormatUser {
  name: string;
  description: string;
  url?: string;
}

/** A conversion path from another format. */
export interface FormatConversion {
  sourceFormat: string;
  toolOrLibrary: string;
  complexity: "trivial" | "moderate" | "complex";
  notes: string;
}

export interface FormatPageData extends ProgrammaticPageBase {
  /** File extension(s), e.g. ".hdf5", ".zarr" */
  fileExtensions: string[];
  /** Schema or structure description (plain text, rendered as code-like block) */
  schemaDescription: string;
  /** Frameworks and models that consume this format */
  frameworksUsing: FormatUser[];
  /** How to convert from other common formats */
  conversions: FormatConversion[];
  /** Key papers or specifications */
  keyPapers: ProgrammaticCitation[];
  /** How Claru delivers data in this format */
  claruDelivery: string;
}
