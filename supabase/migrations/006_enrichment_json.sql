-- =============================================================================
-- Migration 006: Enrichment JSON Storage & Dataset Visibility Toggle
-- Adds dedicated enrichment_json column to dataset_samples and
-- show_enrichment toggle to datasets for client visibility control.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Add enrichment_json JSONB column to dataset_samples
-- ---------------------------------------------------------------------------
ALTER TABLE dataset_samples
  ADD COLUMN enrichment_json jsonb DEFAULT '{}';

-- ---------------------------------------------------------------------------
-- 2. Add show_enrichment toggle to datasets
-- ---------------------------------------------------------------------------
ALTER TABLE datasets
  ADD COLUMN show_enrichment boolean DEFAULT false;

-- ---------------------------------------------------------------------------
-- Notes:
-- - enrichment_json stores AI-generated metadata (e.g. Reka Vision output)
--   in a dedicated column rather than mixing it into metadata_json.
-- - show_enrichment controls whether portal clients can see the enrichment
--   panel on sample detail views. Defaults to false (hidden).
-- - Both columns use safe defaults so existing rows are unaffected.
-- ---------------------------------------------------------------------------
