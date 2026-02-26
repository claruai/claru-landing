-- =============================================================================
-- Migration 004: S3 Integration
-- Adds tags column to datasets and S3 object key columns to dataset_samples
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Add tags array column to datasets table
-- ---------------------------------------------------------------------------
ALTER TABLE datasets
  ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- ---------------------------------------------------------------------------
-- 2. Add S3 object key columns to dataset_samples table
--    All nullable for backward compatibility with existing samples that use
--    storage_path or media_url.
-- ---------------------------------------------------------------------------
ALTER TABLE dataset_samples
  ADD COLUMN IF NOT EXISTS s3_object_key text,
  ADD COLUMN IF NOT EXISTS s3_annotation_key text,
  ADD COLUMN IF NOT EXISTS s3_specs_key text;

-- ---------------------------------------------------------------------------
-- Notes:
-- - Existing RLS policies on dataset_samples grant SELECT on all columns,
--   so new columns are automatically covered.
-- - Nullable columns are backward-compatible: existing samples retain their
--   current storage_path / media_url references.
-- - S3 fields are used exclusively for new S3-referenced samples.
-- ---------------------------------------------------------------------------
