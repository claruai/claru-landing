// =============================================================================
// Data Catalog Portal -- TypeScript Types
// Matches database schema from docs/data-catalog-design.md Section 4
// =============================================================================

// ---------------------------------------------------------------------------
// Utility / Union Types
// ---------------------------------------------------------------------------

export type LeadStatus = 'pending' | 'approved' | 'rejected';

export type DatasetType = 'short_form' | 'long_form' | 'cinematic' | 'game_capture';

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
