// ---------------------------------------------------------------------------
// Type2Annotation — data model for Pairwise Arena compositions
// Used by: sol-video-gen, sol-rlhf, cs-vid-eval, cs-prompt-bench
// ---------------------------------------------------------------------------

export interface Type2VideoRef {
  /** URL or static file path for the video */
  url: string;
  /** Human-readable label (e.g. "A", "B", "Config 21", "Config 41") */
  label: string;
}

export interface Type2Annotation {
  /** Composition type identifier */
  type: 2;
  /** Composition ID */
  compositionId: string;
  /** Left-side video reference */
  videoA: Type2VideoRef;
  /** Right-side video reference */
  videoB: Type2VideoRef;
  /**
   * Which side won the comparison.
   * Determined from annotation data fields: betterVideoId, selectedAnswer, or bestVideo.
   * "A" = left video preferred, "B" = right video preferred.
   */
  winner: "A" | "B";
  /** The prompt or question being evaluated */
  promptText: string;
  /**
   * Optional config labels for cs-vid-eval (Quality Parameter Evaluations).
   * e.g. { a: "Config 21", b: "Config 41" }
   */
  configLabels?: { a: string; b: string };
  /**
   * Optional category label for cs-prompt-bench (Prompt Rankings).
   * e.g. "Kayaking"
   */
  categoryLabel?: string;
  /**
   * Whether the video belongs to the stated category (cs-prompt-bench).
   */
  categoryVerified?: boolean;
}

/**
 * Fallback annotation used when the annotation JSON file is missing or
 * fails to load. Provides reasonable defaults so the composition still
 * renders gracefully.
 */
export const FALLBACK_TYPE2_ANNOTATION: Type2Annotation = {
  type: 2,
  compositionId: "unknown",
  videoA: { url: "", label: "A" },
  videoB: { url: "", label: "B" },
  winner: "A",
  promptText: "Pairwise video comparison",
  configLabels: undefined,
  categoryLabel: undefined,
  categoryVerified: undefined,
};
