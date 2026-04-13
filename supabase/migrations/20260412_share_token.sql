-- =============================================================================
-- Share Token — Add sharing columns to datasets table
-- Enables public share links for curated dataset catalogs sent to prospects.
-- =============================================================================

ALTER TABLE datasets
  ADD COLUMN IF NOT EXISTS share_token text UNIQUE,
  ADD COLUMN IF NOT EXISTS share_expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS share_first_viewed_at timestamptz,
  ADD COLUMN IF NOT EXISTS share_view_count integer NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_datasets_share_token
  ON datasets (share_token)
  WHERE share_token IS NOT NULL;
