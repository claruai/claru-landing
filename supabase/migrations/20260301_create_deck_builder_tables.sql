-- =============================================================================
-- Deck Builder Tables
-- Created for the Slide Deck Builder feature (Phase 1)
--
-- Tables: slide_templates, slide_template_versions, template_chat_messages,
--         slide_media_assets
--
-- Aligned with:
--   - prd.json US-002
--   - src/types/deck-builder.ts
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. slide_templates - Base templates for sales presentations
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS slide_templates (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT        NOT NULL,
  description   TEXT        DEFAULT '',
  tags          TEXT[]      NOT NULL DEFAULT '{}',
  slides_json   JSONB       NOT NULL DEFAULT '[]',
  theme         TEXT        NOT NULL DEFAULT 'terminal-green',
  custom_theme  JSONB       DEFAULT NULL,
  is_active     BOOLEAN     NOT NULL DEFAULT false,
  created_by    TEXT        DEFAULT 'admin',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 2. slide_template_versions - Version history for templates
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS slide_template_versions (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id     UUID        NOT NULL REFERENCES slide_templates(id) ON DELETE CASCADE,
  version_number  INTEGER     NOT NULL,
  slides_json     JSONB       NOT NULL,
  name            TEXT        NOT NULL,
  description     TEXT        DEFAULT '',
  theme           TEXT        NOT NULL DEFAULT 'terminal-green',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 3. template_chat_messages - Chat history for AI agent per template
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS template_chat_messages (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id   UUID        NOT NULL REFERENCES slide_templates(id) ON DELETE CASCADE,
  role          TEXT        NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content       TEXT        NOT NULL,
  metadata_json JSONB       DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 4. slide_media_assets - Uploaded images for slides
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS slide_media_assets (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id     UUID        NOT NULL REFERENCES slide_templates(id) ON DELETE CASCADE,
  filename        TEXT        NOT NULL,
  storage_path    TEXT        NOT NULL,
  url             TEXT        NOT NULL,
  mime_type       TEXT        NOT NULL DEFAULT 'image/png',
  file_size_bytes INTEGER     DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- =============================================================================
-- Indexes
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_slide_templates_is_active
  ON slide_templates(is_active);

CREATE INDEX IF NOT EXISTS idx_slide_template_versions_template_version
  ON slide_template_versions(template_id, version_number);

CREATE INDEX IF NOT EXISTS idx_template_chat_messages_template_created
  ON template_chat_messages(template_id, created_at);

CREATE INDEX IF NOT EXISTS idx_slide_media_assets_template
  ON slide_media_assets(template_id);


-- =============================================================================
-- Auto-update updated_at trigger
-- =============================================================================
CREATE OR REPLACE FUNCTION update_slide_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_slide_templates_updated_at
  BEFORE UPDATE ON slide_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_slide_templates_updated_at();
