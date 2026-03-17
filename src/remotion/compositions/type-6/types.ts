// ---------------------------------------------------------------------------
// Type 6 — Quality Rubric Composition Types
// ---------------------------------------------------------------------------
// Uses real annotation data from the Video Quality Annotations dataset
// (4bda56db). Each video is scored on 5 quality dimensions using string
// labels that map to numeric scores for gauge/radar visualization.
// ---------------------------------------------------------------------------

/**
 * Documented mapping from annotation string values to numeric scores [0, 1].
 *
 * Pattern:
 *   "good-*"   -> 0.8  (high quality signal)
 *   "not-*"    -> 0.2–0.3 (low quality signal, varies by dimension)
 *   "interesting" -> 0.7 (above average)
 *   "not-interesting" -> 0.3
 *
 * Specific mappings used in the composition:
 *   isCinematic:
 *     "cinematic"        -> 0.8
 *     "not-cinematic"    -> 0.2
 *   hasGoodMotion:
 *     "good-motion"      -> 0.8
 *     "not-good-motion"  -> 0.2
 *   isHighQuality:
 *     "high-quality"     -> 0.8
 *     "not-high-quality" -> 0.3
 *   isVideoInteresting:
 *     "interesting"      -> 0.7
 *     "not-interesting"  -> 0.3
 *   hasGoodTextAlignment:
 *     "good-alignment"   -> 0.8
 *     "not-good-alignment" -> 0.2
 */
export const DIMENSION_SCORE_MAP: Record<string, number> = {
  // Cinematic
  "cinematic": 0.8,
  "not-cinematic": 0.2,
  // Motion
  "good-motion": 0.8,
  "not-good-motion": 0.2,
  // Quality
  "high-quality": 0.8,
  "not-high-quality": 0.3,
  // Interest
  "interesting": 0.7,
  "not-interesting": 0.3,
  // Text Alignment
  "good-alignment": 0.8,
  "not-good-alignment": 0.2,
};

/** Fallback score when a string value is not recognized */
export const FALLBACK_SCORE = 0.5;

/** Resolve an annotation string value to a numeric score */
export function resolveScore(value: string): number {
  return DIMENSION_SCORE_MAP[value] ?? FALLBACK_SCORE;
}

// ---------------------------------------------------------------------------
// Quality dimension definition
// ---------------------------------------------------------------------------

export interface QualityDimension {
  /** Display name for the gauge label */
  name: string;
  /** Raw string value from annotation JSON (e.g. "good-motion") */
  value: string;
  /** Numeric score [0, 1] derived from the string value */
  numericScore: number;
}

// ---------------------------------------------------------------------------
// Type6Annotation — shape of the annotation JSON for Quality Rubric
// ---------------------------------------------------------------------------

export interface Type6Annotation {
  type: 6;
  compositionId: string;
  /** Raw annotation string values */
  isCinematic: string;
  hasGoodMotion: string;
  isHighQuality: string;
  isVideoInteresting: string;
  hasGoodTextAlignment: string;
  /** Human-written video description/assessment */
  videoDescription: string;
  /** Pre-computed numeric scores (optional — will be derived if absent) */
  scores?: {
    cinematic: number;
    motion: number;
    quality: number;
    interest: number;
    textAlignment: number;
  };
  /** Project type identifier */
  projectType?: string;
}

// ---------------------------------------------------------------------------
// Parsed quality data used by the composition
// ---------------------------------------------------------------------------

export interface ParsedQualityData {
  dimensions: [
    QualityDimension,
    QualityDimension,
    QualityDimension,
    QualityDimension,
    QualityDimension,
  ];
  videoDescription: string;
}

/**
 * Color for a gauge based on its numeric score.
 *   >= 0.7 -> green (success)
 *   >= 0.4 -> orange (warning)
 *   <  0.4 -> red (error)
 */
export function scoreColor(score: number): string {
  if (score >= 0.7) return "#22c55e"; // green
  if (score >= 0.4) return "#f5a623"; // orange
  return "#ef4444"; // red
}

/**
 * Parse a Type6Annotation JSON into the structured data the composition needs.
 */
export function parseAnnotation(data: Type6Annotation): ParsedQualityData {
  const cinematic = resolveScore(data.isCinematic);
  const motion = resolveScore(data.hasGoodMotion);
  const quality = resolveScore(data.isHighQuality);
  const interest = resolveScore(data.isVideoInteresting);
  const alignment = resolveScore(data.hasGoodTextAlignment);

  return {
    dimensions: [
      { name: "Cinematic", value: data.isCinematic, numericScore: cinematic },
      { name: "Motion", value: data.hasGoodMotion, numericScore: motion },
      { name: "Quality", value: data.isHighQuality, numericScore: quality },
      { name: "Interest", value: data.isVideoInteresting, numericScore: interest },
      { name: "Alignment", value: data.hasGoodTextAlignment, numericScore: alignment },
    ],
    videoDescription: data.videoDescription,
  };
}
