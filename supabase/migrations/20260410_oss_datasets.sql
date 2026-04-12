-- =============================================================================
-- OSS Datasets Portal — Database Schema Migration
-- Creates the oss_datasets table for the Physical AI Dataset Directory.
-- 421+ datasets crawled from HuggingFace, enriched via Claude Haiku.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. oss_datasets table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS oss_datasets (
  id                      uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id              text        UNIQUE NOT NULL,   -- HuggingFace repo ID
  slug                    text        UNIQUE NOT NULL,   -- URL-safe slug
  name                    text        NOT NULL,
  description             text,
  parent_project          text,
  author                  text,
  modalities              text[]      DEFAULT '{}',
  robot_embodiments       text[]      DEFAULT '{}',
  action_space            text,
  environment_type        text[]      DEFAULT '{}',
  task_types              text[]      DEFAULT '{}',
  num_episodes            text,
  total_hours             text,
  license                 text,
  annotation_types        text[]      DEFAULT '{}',
  data_format             text,
  year_released           smallint,
  paper_url               text,
  paper_title             text,
  physical_ai_relevance   text,
  hf_downloads            integer     DEFAULT 0,
  hf_likes                integer     DEFAULT 0,
  hf_last_modified        timestamptz,
  hf_tags                 text[]      DEFAULT '{}',
  citation_count          integer,
  reddit_posts            jsonb       DEFAULT '[]'::jsonb,
  hn_posts                jsonb       DEFAULT '[]'::jsonb,
  is_active               boolean     DEFAULT true,
  is_gated                boolean     DEFAULT false,
  is_private              boolean     DEFAULT false,
  extraction_completeness real,
  card_text_source        text,
  last_crawled_at         timestamptz DEFAULT now(),
  last_verified_at        timestamptz,
  created_at              timestamptz DEFAULT now(),
  updated_at              timestamptz DEFAULT now(),

  -- Full-text search column
  fts                     tsvector GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, '') || ' ' || coalesce(physical_ai_relevance, ''))
  ) STORED
);

-- ---------------------------------------------------------------------------
-- 2. Indexes
-- ---------------------------------------------------------------------------
-- Array containment (GIN)
CREATE INDEX IF NOT EXISTS idx_oss_modalities       ON oss_datasets USING gin (modalities);
CREATE INDEX IF NOT EXISTS idx_oss_embodiments      ON oss_datasets USING gin (robot_embodiments);
CREATE INDEX IF NOT EXISTS idx_oss_environment      ON oss_datasets USING gin (environment_type);
CREATE INDEX IF NOT EXISTS idx_oss_task_types       ON oss_datasets USING gin (task_types);
CREATE INDEX IF NOT EXISTS idx_oss_annotation_types ON oss_datasets USING gin (annotation_types);

-- Sort indexes (B-tree)
CREATE INDEX IF NOT EXISTS idx_oss_downloads        ON oss_datasets (hf_downloads DESC);
CREATE INDEX IF NOT EXISTS idx_oss_year             ON oss_datasets (year_released DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_oss_citations        ON oss_datasets (citation_count DESC NULLS LAST);

-- Full-text search (GIN)
CREATE INDEX IF NOT EXISTS idx_oss_fts              ON oss_datasets USING gin (fts);

-- Grouping / filtering (B-tree)
CREATE INDEX IF NOT EXISTS idx_oss_parent_project   ON oss_datasets (parent_project);
CREATE INDEX IF NOT EXISTS idx_oss_is_active        ON oss_datasets (is_active);
CREATE INDEX IF NOT EXISTS idx_oss_slug             ON oss_datasets (slug);

-- ---------------------------------------------------------------------------
-- 3. RLS policies
-- ---------------------------------------------------------------------------
ALTER TABLE oss_datasets ENABLE ROW LEVEL SECURITY;

-- Public read access for active, non-private datasets
CREATE POLICY "oss_datasets_anon_select" ON oss_datasets
  FOR SELECT
  TO anon
  USING (is_active = true AND is_private = false);

-- Authenticated users also get read access
CREATE POLICY "oss_datasets_authenticated_select" ON oss_datasets
  FOR SELECT
  TO authenticated
  USING (is_active = true AND is_private = false);

-- Service role can do everything (for pipeline upserts)
CREATE POLICY "oss_datasets_service_role_all" ON oss_datasets
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- 4. updated_at trigger
-- ---------------------------------------------------------------------------
-- Reuse existing trigger function if it exists, otherwise create
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_oss_datasets_updated_at
  BEFORE UPDATE ON oss_datasets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ---------------------------------------------------------------------------
-- 5. dataset_portal_leads table (for email gate)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dataset_portal_leads (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  email               text        NOT NULL,
  company             text,
  source_dataset_slug text,
  utm_source          text,
  utm_medium          text,
  utm_campaign        text,
  created_at          timestamptz DEFAULT now(),
  UNIQUE (email)
);

ALTER TABLE dataset_portal_leads ENABLE ROW LEVEL SECURITY;

-- Only service role can insert (via API route)
CREATE POLICY "portal_leads_service_insert" ON dataset_portal_leads
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "portal_leads_service_select" ON dataset_portal_leads
  FOR SELECT
  TO service_role
  USING (true);
