-- =============================================================================
-- Claru Data Catalog Portal -- Database Schema Migration
-- Run this SQL in the Supabase SQL Editor (Dashboard > SQL Editor > New Query)
--
-- Creates all tables, RLS policies, indexes, triggers, and seed data
-- for the gated data catalog portal.
--
-- Aligned with:
--   - docs/data-catalog-design.md Section 4
--   - src/types/data-catalog.ts
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. dataset_categories
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dataset_categories (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text        NOT NULL,
  slug          text        UNIQUE NOT NULL,
  description   text,
  display_order integer     NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 2. datasets
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS datasets (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id           uuid        NOT NULL REFERENCES dataset_categories(id),
  name                  text        NOT NULL,
  slug                  text        UNIQUE NOT NULL,
  description           text,
  type                  text        NOT NULL CHECK (type IN ('short_form','long_form','cinematic','game_capture')),
  subcategory           text,
  total_samples         integer     NOT NULL DEFAULT 0,
  total_duration_hours  numeric     NOT NULL DEFAULT 0,
  geographic_coverage   text,
  annotation_types      text[]      NOT NULL DEFAULT '{}',
  thumbnail_url         text,
  is_published          boolean     NOT NULL DEFAULT false,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 3. dataset_samples
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dataset_samples (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id        uuid        NOT NULL REFERENCES datasets(id) ON DELETE CASCADE,
  filename          text        NOT NULL,
  storage_path      text        NOT NULL,
  file_size_bytes   bigint,
  mime_type         text,
  duration_seconds  numeric,
  resolution_width  integer,
  resolution_height integer,
  fps               numeric,
  metadata_json     jsonb       NOT NULL DEFAULT '{}',
  annotation_id     text,
  created_at        timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 4. leads
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS leads (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name              text        NOT NULL,
  email             text        UNIQUE NOT NULL,
  company           text,
  role              text,
  data_needs        text,
  use_case          text,
  status            text        NOT NULL DEFAULT 'pending'
                                CHECK (status IN ('pending','approved','rejected')),
  admin_notes       text,
  supabase_user_id  uuid        UNIQUE REFERENCES auth.users(id),
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 5. lead_dataset_access
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS lead_dataset_access (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id     uuid        NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  dataset_id  uuid        NOT NULL REFERENCES datasets(id) ON DELETE CASCADE,
  granted_at  timestamptz NOT NULL DEFAULT now(),
  granted_by  text,
  UNIQUE (lead_id, dataset_id)
);

-- ---------------------------------------------------------------------------
-- 6. custom_requests
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS custom_requests (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id        uuid        NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  description    text        NOT NULL,
  data_modality  text,
  notes          text,
  status         text        NOT NULL DEFAULT 'pending'
                             CHECK (status IN ('pending','reviewed')),
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 7. settings (key-value store for admin-configurable values)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS settings (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  key         text        UNIQUE NOT NULL,
  value       text,
  updated_at  timestamptz NOT NULL DEFAULT now()
);


-- =============================================================================
-- updated_at trigger function (reusable)
-- =============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to tables that have an updated_at column
DROP TRIGGER IF EXISTS set_datasets_updated_at ON datasets;
CREATE TRIGGER set_datasets_updated_at
  BEFORE UPDATE ON datasets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_leads_updated_at ON leads;
CREATE TRIGGER set_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_settings_updated_at ON settings;
CREATE TRIGGER set_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- =============================================================================
-- Row-Level Security (RLS)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- dataset_categories: public read
-- ---------------------------------------------------------------------------
ALTER TABLE dataset_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read categories"
  ON dataset_categories FOR SELECT
  USING (true);

-- ---------------------------------------------------------------------------
-- datasets: anon can SELECT where is_published = true
-- ---------------------------------------------------------------------------
ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published datasets"
  ON datasets FOR SELECT TO anon
  USING (is_published = true);

CREATE POLICY "Leads can read their granted datasets"
  ON datasets FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM lead_dataset_access lda
      JOIN leads l ON l.id = lda.lead_id
      WHERE lda.dataset_id = datasets.id
        AND l.supabase_user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- dataset_samples: authenticated users with access via lead_dataset_access
-- ---------------------------------------------------------------------------
ALTER TABLE dataset_samples ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leads can read samples of granted datasets"
  ON dataset_samples FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM lead_dataset_access lda
      JOIN leads l ON l.id = lda.lead_id
      WHERE lda.dataset_id = dataset_samples.dataset_id
        AND l.supabase_user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- leads: authenticated users can SELECT/UPDATE their own record
-- ---------------------------------------------------------------------------
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leads can read own record"
  ON leads FOR SELECT TO authenticated
  USING (supabase_user_id = auth.uid());

CREATE POLICY "Leads can update own record"
  ON leads FOR UPDATE TO authenticated
  USING (supabase_user_id = auth.uid())
  WITH CHECK (supabase_user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- lead_dataset_access: authenticated where lead_id matches user's lead
-- ---------------------------------------------------------------------------
ALTER TABLE lead_dataset_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leads can read own access grants"
  ON lead_dataset_access FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leads l
      WHERE l.id = lead_dataset_access.lead_id
        AND l.supabase_user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- custom_requests: authenticated INSERT/SELECT where lead_id matches user
-- ---------------------------------------------------------------------------
ALTER TABLE custom_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leads can read own custom requests"
  ON custom_requests FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leads l
      WHERE l.id = custom_requests.lead_id
        AND l.supabase_user_id = auth.uid()
    )
  );

CREATE POLICY "Leads can insert own custom requests"
  ON custom_requests FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM leads l
      WHERE l.id = custom_requests.lead_id
        AND l.supabase_user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- settings: anon can SELECT (public settings like booking URL)
-- ---------------------------------------------------------------------------
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read settings"
  ON settings FOR SELECT
  USING (true);


-- =============================================================================
-- Indexes
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_datasets_category_id   ON datasets(category_id);
CREATE INDEX IF NOT EXISTS idx_datasets_slug          ON datasets(slug);
CREATE INDEX IF NOT EXISTS idx_dataset_samples_dataset ON dataset_samples(dataset_id);
CREATE INDEX IF NOT EXISTS idx_leads_email            ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status           ON leads(status);
CREATE INDEX IF NOT EXISTS idx_lead_access_lead_id    ON lead_dataset_access(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_access_dataset_id ON lead_dataset_access(dataset_id);


-- =============================================================================
-- Seed Data
-- =============================================================================
INSERT INTO settings (key, value)
VALUES ('booking_url', 'https://calendly.com/claru')
ON CONFLICT (key) DO NOTHING;
