-- =============================================================================
-- Enable RLS on all public tables and create least-privilege policies
--
-- Context: Supabase security audit flagged all tables as publicly accessible.
-- The admin portal uses service_role key (bypasses RLS). The client portal
-- uses anon key + user session (subject to RLS). The landing page uses
-- anon key without auth for public dataset listings.
--
-- Principle: deny everything by default, then allow only what the app needs.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. LEADS
--    Portal: authenticated user reads own record (by supabase_user_id)
--    Landing page contact form: service_role inserts (bypasses RLS)
-- ---------------------------------------------------------------------------
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to start clean
DROP POLICY IF EXISTS "leads_select_own" ON public.leads;
DROP POLICY IF EXISTS "Authenticated users can read own lead" ON public.leads;

CREATE POLICY "leads_select_own" ON public.leads
  FOR SELECT
  TO authenticated
  USING (supabase_user_id = auth.uid());

-- No INSERT/UPDATE/DELETE for anon or authenticated — admin uses service_role

-- ---------------------------------------------------------------------------
-- 2. DATASETS
--    Public (anon + authenticated): read published datasets
--    No write access for anon/authenticated
-- ---------------------------------------------------------------------------
ALTER TABLE public.datasets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "datasets_select_published" ON public.datasets;

CREATE POLICY "datasets_select_published" ON public.datasets
  FOR SELECT
  USING (is_published = true);

-- ---------------------------------------------------------------------------
-- 3. DATASET_CATEGORIES
--    Public reference data — read-only for everyone
-- ---------------------------------------------------------------------------
ALTER TABLE public.dataset_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "categories_select_all" ON public.dataset_categories;

CREATE POLICY "categories_select_all" ON public.dataset_categories
  FOR SELECT
  USING (true);

-- ---------------------------------------------------------------------------
-- 4. LEAD_DATASET_ACCESS
--    Authenticated: read own grants (where lead_id matches their lead record)
-- ---------------------------------------------------------------------------
ALTER TABLE public.lead_dataset_access ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "lda_select_own" ON public.lead_dataset_access;

CREATE POLICY "lda_select_own" ON public.lead_dataset_access
  FOR SELECT
  TO authenticated
  USING (
    lead_id IN (
      SELECT id FROM public.leads WHERE supabase_user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- 5. DATASET_SAMPLES (legacy table, still queried by portal dashboard)
--    Authenticated: read samples in datasets they have access to
-- ---------------------------------------------------------------------------
ALTER TABLE public.dataset_samples ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "samples_select_granted" ON public.dataset_samples;

CREATE POLICY "samples_select_granted" ON public.dataset_samples
  FOR SELECT
  TO authenticated
  USING (
    dataset_id IN (
      SELECT lda.dataset_id FROM public.lead_dataset_access lda
      JOIN public.leads l ON l.id = lda.lead_id
      WHERE l.supabase_user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- 6. CLIPS
--    No anon/authenticated access needed — portal queries use service_role.
--    Lock it down completely for non-service-role callers.
-- ---------------------------------------------------------------------------
ALTER TABLE public.clips ENABLE ROW LEVEL SECURITY;

-- No policies = no access for anon/authenticated (service_role bypasses)

-- ---------------------------------------------------------------------------
-- 7. DATASET_CLIPS
--    No anon/authenticated access needed — portal queries use service_role.
-- ---------------------------------------------------------------------------
ALTER TABLE public.dataset_clips ENABLE ROW LEVEL SECURITY;

-- No policies = no access for anon/authenticated (service_role bypasses)

-- ---------------------------------------------------------------------------
-- 8. CUSTOM_REQUESTS
--    Authenticated: insert own requests (lead_id must match their lead)
-- ---------------------------------------------------------------------------
ALTER TABLE public.custom_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "requests_insert_own" ON public.custom_requests;

CREATE POLICY "requests_insert_own" ON public.custom_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (
    lead_id IN (
      SELECT id FROM public.leads WHERE supabase_user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- 9. SETTINGS
--    Public read-only (booking_url etc.)
-- ---------------------------------------------------------------------------
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "settings_select_all" ON public.settings;

CREATE POLICY "settings_select_all" ON public.settings
  FOR SELECT
  USING (true);
