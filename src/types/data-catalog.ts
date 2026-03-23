// =============================================================================
// Data Catalog Portal -- TypeScript Types
// Matches database schema from docs/data-catalog-design.md Section 4
//
// Unified Clip Architecture (US-006):
// New types: Clip, DatasetClip, ClipSearchResult
// Legacy types DatasetSample, VideoIndexRecord, LeadCustomSample are @deprecated.
//
// Field mapping (old -> new):
//   dataset_samples.s3_object_key       -> clips.s3_key
//   dataset_samples.metadata_json       -> clips.ann_metadata
//   dataset_samples.agent_context       -> clips.ai_agent_context
//   dataset_samples.enrichment_json     -> clips.ai_enrichment_json
//   dataset_samples.duration_seconds    -> clips.tech_duration_seconds
//   dataset_samples.file_size_bytes     -> clips.tech_file_size_bytes
//   dataset_samples.resolution_width    -> clips.tech_resolution_width
//   dataset_samples.resolution_height   -> clips.tech_resolution_height
//   dataset_samples.fps                 -> clips.tech_fps
//   dataset_samples.s3_annotation_key   -> clips.ann_annotation_key
//   dataset_samples.s3_specs_key        -> clips.ann_specs_key
//   video_index.caption_text            -> clips.ai_caption
//   video_index.enrichment_source       -> clips.ai_enrichment_source
// =============================================================================

// ---------------------------------------------------------------------------
// Utility / Union Types
// ---------------------------------------------------------------------------

export type LeadStatus = 'pending' | 'approved' | 'rejected';

export type DatasetType = 'short_form' | 'long_form' | 'cinematic' | 'game_capture' | 'evaluation' | 'annotation' | 'moderation' | 'preference' | 'classification' | 'instruction' | 'generation';

export type RequestStatus = 'pending' | 'reviewed';

// ---------------------------------------------------------------------------
// Database Entity Interfaces
// ---------------------------------------------------------------------------

export interface DatasetCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  display_order: number;
  created_at: string;
}

export interface Dataset {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  type: DatasetType;
  source_type: string;
  modality: string | null;
  subcategory: string;
  tags: string[];
  total_samples: number;
  total_duration_hours: number;
  geographic_coverage: string;
  annotation_types: string[];
  thumbnail_url: string;
  is_published: boolean;
  show_enrichment: boolean;
  s3_bucket: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * @deprecated Use {@link Clip} + {@link DatasetClip} instead.
 * Will be removed after legacy table drop (US-020).
 */
export interface DatasetSample {
  id: string;
  dataset_id: string;
  filename: string;
  media_url: string;
  storage_path: string | null;
  file_size_bytes: number;
  mime_type: string;
  duration_seconds: number | null;
  resolution_width: number | null;
  resolution_height: number | null;
  fps: number | null;
  metadata_json: Record<string, unknown>;
  annotation_id: string;
  s3_object_key: string | null;
  s3_bucket: string | null;
  s3_annotation_key: string | null;
  s3_specs_key: string | null;
  enrichment_json: Record<string, unknown>;
  agent_context: Record<string, unknown> | null;
  embedding: number[] | null;
  lead_id: string | null;
  added_by: string | null;
  source_video_index_id: string | null;
  created_at: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  data_needs: string;
  use_case: string;
  status: LeadStatus;
  admin_notes: string;
  supabase_user_id: string | null;
  custom_page_slug: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadDatasetAccess {
  id: string;
  lead_id: string;
  dataset_id: string;
  granted_at: string;
  granted_by: string;
}

export interface CustomRequest {
  id: string;
  lead_id: string;
  description: string;
  data_modality: string;
  notes: string;
  status: RequestStatus;
  created_at: string;
}

export interface AdminSetting {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Unified Clip Architecture — new types (US-006)
// Matches canonical schema from supabase/migrations/009_create_clips_table.sql
// and supabase/migrations/010_create_dataset_clips_table.sql
// ---------------------------------------------------------------------------

/** Matches the `clips` table — single source of truth for all media assets. */
export interface Clip {
  id: string;

  // Core identity
  s3_bucket: string;
  s3_key: string;
  mime_type: string | null;
  filename: string | null;

  // Annotation columns (source: annotation loader / S3 metadata)
  ann_metadata: Record<string, unknown> | null;       // was: metadata_json
  ann_annotation_key: string | null;                   // was: s3_annotation_key
  ann_specs_key: string | null;                        // was: s3_specs_key

  // Technical columns (source: ffprobe / annotation loader)
  tech_file_size_bytes: number | null;                 // was: file_size_bytes
  tech_duration_seconds: number | null;                // was: duration_seconds
  tech_resolution_width: number | null;                // was: resolution_width
  tech_resolution_height: number | null;               // was: resolution_height
  tech_fps: number | null;                             // was: fps
  tech_codec: string | null;
  tech_bit_depth: number | null;

  // AI columns (source: Cobry captions, Gemini re-enrichment, agent context)
  ai_caption: string | null;                           // was: video_index.caption_text
  ai_agent_context: Record<string, unknown> | null;    // was: agent_context
  ai_enrichment_source: string | null;                 // was: video_index.enrichment_source
  ai_enrichment_json: Record<string, unknown> | null;  // was: enrichment_json

  // Derived fields (rebuilt by caption rebuild script)
  caption_text: string | null;
  embedding: number[] | null;                          // vector(768)
  caption_rebuilt_at: string | null;

  // Timestamps
  created_at: string;
  updated_at: string;
}

/** Matches the `dataset_clips` join table — links clips to datasets (and optionally to leads). */
export interface DatasetClip {
  id: string;
  dataset_id: string;
  clip_id: string;
  lead_id: string | null;
  added_by: string | null;
  note: string | null;
  created_at: string;
}

/**
 * Unified search result returned by match_clips RPC and the admin search API.
 * Replaces the old CatalogSearchResult / FullCorpusSearchResult discriminated union.
 * No `source` discriminator — all clips live in one table.
 */
export interface ClipSearchResult {
  id: string;
  similarity: number;
  signed_url: string | null;

  // Core identity
  s3_bucket: string;
  s3_key: string;
  mime_type: string | null;

  // Annotation
  ann_metadata: Record<string, unknown> | null;

  // Technical
  tech_resolution_width: number | null;
  tech_resolution_height: number | null;
  tech_fps: number | null;
  tech_duration_seconds: number | null;
  tech_codec: string | null;

  // AI
  ai_caption: string | null;
  ai_enrichment_source: string | null;
  ai_agent_context: Record<string, unknown> | null;

  // Derived
  caption_text: string | null;
}

// ---------------------------------------------------------------------------
// Public API Response Types
// ---------------------------------------------------------------------------

/** Shape returned by the public dataset API — nullable fields are honest. */
export interface PublicDataset {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  type: string;
  subcategory: string | null;
  source_type: string;
  modality: string | null;
  total_samples: number;
  total_duration_hours: number;
  geographic_coverage: string | null;
  annotation_types: string[];
  category: {
    name: string;
    slug: string;
    display_order: number;
  };
}
