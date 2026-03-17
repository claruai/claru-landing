// ---------------------------------------------------------------------------
// Type 8: Cinematic Showcase — annotation data interfaces
// ---------------------------------------------------------------------------

/** Category and subcategory label metadata */
export interface CategoryMeta {
  category: string;
  subcategory: string;
}

/** Technical quality signals for the source footage */
export interface TechnicalQuality {
  /** Native resolution string, e.g. "3840x2160" */
  resolution: string;
  /** Codec identifier, e.g. "h264", "h265" */
  codec: string;
  /** Frame rate, e.g. 30, 24 */
  fps: number;
  /** Color depth string, e.g. "10-bit", "8-bit" */
  colorDepth: string;
}

/** Top-level annotation structure for Type 8 compositions */
export interface Type8Annotation {
  compositionId?: string;
  type?: number;
  annotationSource?: string;
  generatedAt?: string;
  /** Category label (e.g. "Travel & Exploration") */
  category: string;
  /** Subcategory label (e.g. "Safari & Wildlife Tours") */
  subcategory: string;
  /** Gemini-generated natural language scene description */
  sceneDescription: string;
  /** Licensing type string (e.g. "Licensed 4K") */
  licensingType: string;
  /** Native resolution string for prominent badge display */
  resolution: string;
  /** Technical quality signals */
  technical?: TechnicalQuality;
  /** Optional: for cs-egocentric cross-fade, secondary clip metadata */
  secondaryClip?: {
    category: string;
    subcategory: string;
    sceneDescription?: string;
  };
  /** Optional: for sol-open-vs-custom, premium label flag */
  isCustomData?: boolean;
}

/** Fallback annotation when no JSON is available */
export const FALLBACK_TYPE8_ANNOTATION: Type8Annotation = {
  category: "Cinematic Footage",
  subcategory: "Premium Collection",
  sceneDescription:
    "High-fidelity cinematic footage captured for AI training data pipelines.",
  licensingType: "Licensed 4K",
  resolution: "3840x2160",
  technical: {
    resolution: "3840x2160",
    codec: "h264",
    fps: 30,
    colorDepth: "8-bit",
  },
};
