-- =============================================================================
-- Enable RLS on CRM / outbound / pipeline tables (deny-all default)
--
-- Context: Security audit (2026-05-09) flagged these tables as having either
-- no RLS migration in source, or being created by a migration that did NOT
-- enable RLS. The `anon` key is shipped to the browser via
-- NEXT_PUBLIC_SUPABASE_ANON_KEY, so without RLS, anyone can read these via
-- the PostgREST endpoint.
--
-- All known callers for these tables use the service_role key (which bypasses
-- RLS), so a deny-all policy for anon/authenticated is safe:
--   - partnerships_leads     -> /api/partnerships (service role)
--   - lead_crm_data          -> /api/contact, /api/partnerships, /api/admin/lead-context (service role)
--   - digest_subscribers     -> /api/digest/subscribe (service role)
--   - enrichment_jobs        -> /api/admin/catalog/enrichment/* (service role)
--   - campaign_leads         -> agent swarm (service role)
--   - reply_events           -> Smartlead webhook handler (service role)
--   - community_signals      -> no in-repo references; flagged by audit, locked defensively
--
-- FORCE ROW LEVEL SECURITY also denies the table owner; service_role still
-- bypasses RLS regardless. Each table block is wrapped in IF EXISTS so the
-- migration is idempotent and survives if a table doesn't exist (some of
-- these were created via the dashboard, not a repo migration).
-- =============================================================================

-- ---------------------------------------------------------------------------
-- partnerships_leads
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'partnerships_leads') THEN
    EXECUTE 'ALTER TABLE public.partnerships_leads ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE public.partnerships_leads FORCE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "partnerships_leads_deny_all" ON public.partnerships_leads';
    EXECUTE $p$
      CREATE POLICY "partnerships_leads_deny_all" ON public.partnerships_leads
        FOR ALL
        TO public
        USING (false)
        WITH CHECK (false)
    $p$;
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- lead_crm_data
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'lead_crm_data') THEN
    EXECUTE 'ALTER TABLE public.lead_crm_data ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE public.lead_crm_data FORCE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "lead_crm_data_deny_all" ON public.lead_crm_data';
    EXECUTE $p$
      CREATE POLICY "lead_crm_data_deny_all" ON public.lead_crm_data
        FOR ALL
        TO public
        USING (false)
        WITH CHECK (false)
    $p$;
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- digest_subscribers
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'digest_subscribers') THEN
    EXECUTE 'ALTER TABLE public.digest_subscribers ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE public.digest_subscribers FORCE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "digest_subscribers_deny_all" ON public.digest_subscribers';
    EXECUTE $p$
      CREATE POLICY "digest_subscribers_deny_all" ON public.digest_subscribers
        FOR ALL
        TO public
        USING (false)
        WITH CHECK (false)
    $p$;
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- enrichment_jobs
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'enrichment_jobs') THEN
    EXECUTE 'ALTER TABLE public.enrichment_jobs ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE public.enrichment_jobs FORCE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "enrichment_jobs_deny_all" ON public.enrichment_jobs';
    EXECUTE $p$
      CREATE POLICY "enrichment_jobs_deny_all" ON public.enrichment_jobs
        FOR ALL
        TO public
        USING (false)
        WITH CHECK (false)
    $p$;
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- campaign_leads
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'campaign_leads') THEN
    EXECUTE 'ALTER TABLE public.campaign_leads ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE public.campaign_leads FORCE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "campaign_leads_deny_all" ON public.campaign_leads';
    EXECUTE $p$
      CREATE POLICY "campaign_leads_deny_all" ON public.campaign_leads
        FOR ALL
        TO public
        USING (false)
        WITH CHECK (false)
    $p$;
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- reply_events
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'reply_events') THEN
    EXECUTE 'ALTER TABLE public.reply_events ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE public.reply_events FORCE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "reply_events_deny_all" ON public.reply_events';
    EXECUTE $p$
      CREATE POLICY "reply_events_deny_all" ON public.reply_events
        FOR ALL
        TO public
        USING (false)
        WITH CHECK (false)
    $p$;
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- community_signals
-- Note: there is no `community_signals` table defined in repo migrations; the
-- file 20260411_community_signals.sql only adds columns to oss_datasets. The
-- audit flagged this name, so we lock it down defensively if it exists on
-- prod (e.g. created via the dashboard). No-op otherwise.
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'community_signals') THEN
    EXECUTE 'ALTER TABLE public.community_signals ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE public.community_signals FORCE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "community_signals_deny_all" ON public.community_signals';
    EXECUTE $p$
      CREATE POLICY "community_signals_deny_all" ON public.community_signals
        FOR ALL
        TO public
        USING (false)
        WITH CHECK (false)
    $p$;
  END IF;
END $$;
