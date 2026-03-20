// =============================================================================
// Data Catalog Portal -- TypeScript Types
// Matches database schema from docs/data-catalog-design.md Section 4
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

export interface VideoIndexRecord {
  id: string;
  s3_bucket: string;
  s3_key: string;
  dataset_id: string | null;
  caption_text: string | null;
  embedding: number[] | null;
  enrichment_source: string | null;
  indexed_at: string;
}

export interface LeadCustomSample {
  id: string;
  lead_id: string;
  video_index_id: string | null;
  dataset_sample_id: string | null;
  s3_bucket: string | null;
  s3_key: string | null;
  added_by: string | null;
  note: string | null;
  added_at: string;
}

// ---------------------------------------------------------------------------
// Unified Search Result (discriminated union for catalog vs full_corpus)
// ---------------------------------------------------------------------------

interface BaseSearchResult {
  id: string;
  similarity: number;
  description: string | null;
  signed_url: string | null;
}

export interface CatalogSearchResult extends BaseSearchResult {
  source: 'catalog';
  dataset_id: string;
  dataset_name: string;
  environments: string[];
  activities: string[];
  objects: string[];
  camera_perspective: string | null;
  mime_type: string;
}

export interface FullCorpusSearchResult extends BaseSearchResult {
  source: 'full_corpus';
  s3_bucket: string;
  s3_key: string;
  caption_text: string | null;
  enrichment_source: string | null;
}

export type UnifiedSearchResult = CatalogSearchResult | FullCorpusSearchResult;

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
