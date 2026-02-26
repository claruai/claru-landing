import { z } from 'zod';

// ---------------------------------------------------------------------------
// generalData Schemas — three polymorphic shapes from S3 annotation-data.json
// ---------------------------------------------------------------------------

/**
 * Egocentric short-form annotation metadata.
 * Contains a main category and subcategory for the clip.
 */
export const EgocentricShortFormSchema = z
  .object({
    mainCategory: z.string(),
    subcategory: z.string(),
  })
  .passthrough();

export type EgocentricShortForm = z.infer<typeof EgocentricShortFormSchema>;

/**
 * Egocentric long-form annotation metadata.
 * Contains a flow description and list of observed activities.
 */
export const EgocentricLongFormSchema = z
  .object({
    flow: z.string(),
    activities: z.array(z.string()),
  })
  .passthrough();

export type EgocentricLongForm = z.infer<typeof EgocentricLongFormSchema>;

/**
 * Video game annotation metadata.
 * Identifies which game was being played during the clip.
 */
export const VideoGameSchema = z
  .object({
    selectedGame: z.string(),
  })
  .passthrough();

export type VideoGame = z.infer<typeof VideoGameSchema>;

// ---------------------------------------------------------------------------
// RekVision Metadata — structured metadata from CSV inline fields
// ---------------------------------------------------------------------------

/**
 * RekVision metadata attached to processed video samples.
 * Includes technical specs, environment labels, and hand-tracking data.
 */
export const RekVisionMetadataSchema = z
  .object({
    domain: z.string(),
    task: z.string().optional(),
    task_description: z.string().optional(),
    technical_specs: z
      .object({
        duration_s: z.number(),
        resolution_px: z
          .object({
            width: z.number(),
            height: z.number(),
          })
          .optional(),
        fps_estimate: z.number().optional(),
        aspect_ratio: z.string().optional(),
      })
      .optional(),
    environment_label: z.string().optional(),
    environment_description: z.string().optional(),
    hands: z
      .object({
        hands_visible: z.boolean(),
        right_hand_pct: z.number(),
        left_hand_pct: z.number(),
        both_hands_pct: z.number(),
        primary_hand: z.string(),
        confidence: z.number(),
      })
      .optional(),
  })
  .passthrough();

export type RekVisionMetadata = z.infer<typeof RekVisionMetadataSchema>;

// ---------------------------------------------------------------------------
// Chunking Schema — timestamped segments within a video
// ---------------------------------------------------------------------------

/**
 * A single chunking segment with start/end timestamps and labels.
 */
export const ChunkingItemSchema = z.object({
  start_s: z.number(),
  end_s: z.number(),
  label: z.string(),
  objects: z.array(z.string()).optional(),
  actions: z.array(z.string()).optional(),
  confidence: z.number().optional(),
});

export type ChunkingItem = z.infer<typeof ChunkingItemSchema>;

// ---------------------------------------------------------------------------
// Discriminated parse helper — tries each generalData schema in order
// ---------------------------------------------------------------------------

export type AnnotationMetadataType = 'short_form' | 'long_form' | 'game' | 'unknown';

export type ParsedAnnotationMetadata =
  | { _type: 'short_form'; data: EgocentricShortForm }
  | { _type: 'long_form'; data: EgocentricLongForm }
  | { _type: 'game'; data: VideoGame }
  | { _type: 'unknown'; data: unknown };

/**
 * Attempt to parse raw generalData JSON from an S3 annotation-data.json file.
 *
 * Tries each known schema in order of specificity (short_form and long_form
 * have more required fields than game) and returns the first successful match
 * tagged with its `_type`. Falls back to `{ _type: 'unknown', data: raw }`
 * for unrecognized shapes.
 */
export function parseAnnotationMetadata(raw: unknown): ParsedAnnotationMetadata {
  // Try short_form first — requires both mainCategory AND subcategory
  const shortForm = EgocentricShortFormSchema.safeParse(raw);
  if (shortForm.success) {
    return { _type: 'short_form', data: shortForm.data };
  }

  // Try long_form — requires flow AND activities array
  const longForm = EgocentricLongFormSchema.safeParse(raw);
  if (longForm.success) {
    return { _type: 'long_form', data: longForm.data };
  }

  // Try game — requires selectedGame
  const game = VideoGameSchema.safeParse(raw);
  if (game.success) {
    return { _type: 'game', data: game.data };
  }

  // Unrecognized shape — return raw data as-is
  return { _type: 'unknown', data: raw };
}
