// ---------------------------------------------------------------------------
// Type 4: Detection + Annotation — data types
// Supports both Object/Face Identity and Product Image annotation structures
// ---------------------------------------------------------------------------

/** A single detected segment with bounding box and classification */
export interface DetectionSegment {
  /** Bounding box coordinates [x1, y1, x2, y2] in pixel space */
  bbox: number[];
  /** Detection class label (e.g. "face") */
  class: string;
  /** Detection confidence score [0, 1] */
  score: number;
  /** Frame index within video (-3 = 3rd from end) */
  frameIndex?: number | null;
  /** Segment identifier linking to clip */
  segmentId?: string | null;
  /** S3 path to cropped thumbnail */
  thumbnailKey?: string | null;
}

/** Product bounding box in image coordinates */
export interface ProductBBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/** Identity match verdicts: segment1_image1 -> "yes"/"no" */
export type IdentityMatches = Record<string, string>;

/**
 * Type4Annotation — union of Object Identity and Product Image annotation data.
 * Matches the schema produced by scripts/extract-annotations.ts extractType4().
 */
export interface Type4Annotation {
  type: 4;
  compositionId: string;

  // --- Object / Face Identity fields ---
  /** Detected segments with bboxes, class, and confidence */
  segments?: DetectionSegment[];
  /** Per-segment identity match verdicts */
  identityMatches?: IdentityMatches;

  // --- Product Image fields ---
  /** Brand name (e.g. "Craghoppers") */
  brandName?: string | null;
  /** Product category (e.g. "Fashion (Men's)") */
  category?: string | null;
  /** Product subcategory (e.g. "Tops") */
  subcategory?: string | null;
  /** Short product caption */
  caption?: string | null;
  /** Extended product description */
  longCaption?: string | null;
  /** Lifestyle image bounding box for product region */
  bbox?: ProductBBox | null;

  /** Project type identifier */
  projectType?: string | null;
}

/**
 * Determine if annotation data represents an Object Identity composition
 * (has face/object segments) vs a Product Image composition (has product bbox/brand).
 */
export function isObjectIdentity(data: Type4Annotation): boolean {
  return Array.isArray(data.segments) && data.segments.length > 0;
}

/**
 * Determine if annotation data represents a Product Image composition.
 */
export function isProductImage(data: Type4Annotation): boolean {
  return data.bbox != null || data.brandName != null;
}
