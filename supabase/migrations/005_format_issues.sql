-- =============================================================================
-- Migration 005: Format Issues
-- Tracks browser format compatibility issues reported by portal users
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Create format_issues table
-- ---------------------------------------------------------------------------
CREATE TABLE format_issues (
  id            uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  sample_id     uuid        NOT NULL REFERENCES dataset_samples(id) ON DELETE CASCADE,
  mime_type     text        NOT NULL,
  user_agent    text        NOT NULL,
  created_at    timestamptz DEFAULT NOW() NOT NULL
);

-- ---------------------------------------------------------------------------
-- 2. Index for fast lookup by sample_id (used in admin badge queries)
-- ---------------------------------------------------------------------------
CREATE INDEX idx_format_issues_sample_id ON format_issues (sample_id);

-- ---------------------------------------------------------------------------
-- 3. RLS: allow authenticated users to insert their own reports
-- ---------------------------------------------------------------------------
ALTER TABLE format_issues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can insert format issues"
  ON format_issues
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read format issues"
  ON format_issues
  FOR SELECT
  TO authenticated
  USING (true);

-- ---------------------------------------------------------------------------
-- Notes:
-- - ON DELETE CASCADE ensures that when a sample is deleted, its format
--   issue reports are cleaned up automatically.
-- - The index on sample_id supports efficient COUNT queries per sample
--   used to render the admin warning badge.
-- ---------------------------------------------------------------------------
