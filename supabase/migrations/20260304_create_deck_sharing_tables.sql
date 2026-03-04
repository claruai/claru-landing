-- =============================================================================
-- Migration 20260304: Deck Sharing Tables
-- Adds share_settings to slide_templates and creates deck_share_tokens and
-- deck_views tables for external deck sharing and analytics tracking.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Add share_settings JSONB column to slide_templates
-- ---------------------------------------------------------------------------
ALTER TABLE slide_templates
  ADD COLUMN IF NOT EXISTS share_settings jsonb DEFAULT NULL;

-- ---------------------------------------------------------------------------
-- 2. Create deck_share_tokens table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS deck_share_tokens (
  id              uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id     uuid          NOT NULL REFERENCES slide_templates(id) ON DELETE CASCADE,
  lead_id         uuid          REFERENCES leads(id) ON DELETE SET NULL,
  email           text          NOT NULL,
  token           text          UNIQUE NOT NULL,
  parent_lead_id  uuid,
  created_at      timestamptz   NOT NULL DEFAULT now(),
  expires_at      timestamptz
);

-- ---------------------------------------------------------------------------
-- 3. Create deck_views table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS deck_views (
  id                      uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id             uuid          NOT NULL REFERENCES slide_templates(id) ON DELETE CASCADE,
  token_id                uuid          REFERENCES deck_share_tokens(id) ON DELETE SET NULL,
  viewer_email            text,
  device_type             text,
  slides_viewed           jsonb,
  total_duration_seconds  integer,
  completion_rate         decimal,
  viewed_at               timestamptz   NOT NULL DEFAULT now(),
  ip_address              text
);

-- ---------------------------------------------------------------------------
-- 4. Indexes
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_deck_share_tokens_token
  ON deck_share_tokens(token);

CREATE INDEX IF NOT EXISTS idx_deck_share_tokens_template_id
  ON deck_share_tokens(template_id);

CREATE INDEX IF NOT EXISTS idx_deck_views_template_viewed
  ON deck_views(template_id, viewed_at);

CREATE INDEX IF NOT EXISTS idx_deck_views_token_id
  ON deck_views(token_id);

-- ---------------------------------------------------------------------------
-- Notes:
-- - share_settings stores per-template sharing config (e.g. require_email,
--   allow_download, password_hash) as flexible JSONB. Defaults to NULL
--   (sharing not configured).
-- - deck_share_tokens links a unique token string to a template + recipient.
--   lead_id is nullable (recipient may not be a lead yet).
--   parent_lead_id tracks which lead generated the share link.
-- - deck_views records each view event with device info, slide engagement
--   data, and duration for analytics dashboards.
-- - ON DELETE CASCADE on template_id ensures tokens and views are cleaned up
--   when a template is deleted.
-- - ON DELETE SET NULL on token_id and lead_id preserves view/token records
--   if the related entity is removed.
-- ---------------------------------------------------------------------------
