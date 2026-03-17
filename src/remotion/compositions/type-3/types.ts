// ---------------------------------------------------------------------------
// Type3Annotation — AI Image Generation Evaluation dataset
// Matches the extraction schema in scripts/extract-annotations.ts
// ---------------------------------------------------------------------------

export interface Type3Generation {
  /** Generation image identifier */
  id: string;
  /** S3 or public URL for the generation image */
  url: string;
}

export interface Type3Annotation {
  type: 3;
  compositionId: string;
  /** The text prompt used to generate the images */
  prompt: string | null;
  /** Array of generated images (typically 8) */
  generations: Type3Generation[];
  /** IDs of images that passed quality review (typically 6 of 8) */
  selectedImages: string[];
  /** ID of the single best image chosen by the annotator */
  bestImage: string | null;
  /** Overall quality verdict string */
  hasGoodQuality: string | null;
  /** Project type from the annotation platform */
  projectType?: string | null;
}

// ---------------------------------------------------------------------------
// Fallback data used when annotation JSON is not yet extracted
// ---------------------------------------------------------------------------

export const FALLBACK_TYPE3: Type3Annotation = {
  type: 3,
  compositionId: "fallback",
  prompt:
    "A photorealistic portrait of an astronaut floating in a neon-lit space station, cinematic lighting, 8K detail",
  generations: Array.from({ length: 8 }, (_, i) => ({
    id: `gen-${i + 1}`,
    url: "",
  })),
  selectedImages: ["gen-1", "gen-2", "gen-3", "gen-5", "gen-6", "gen-7"],
  bestImage: "gen-1",
  hasGoodQuality: "good",
};
