-- =============================================================================
-- Lock down SECURITY DEFINER functions and fix a misnamed RLS policy.
--
-- Context: Re-audit on 2026-05-09 found three CRITICAL/HIGH issues that were
-- NOT closed by the earlier 20260509_enable_rls_crm_tables.sql migration:
--
-- 1. public.get_pipeline_leads() is SECURITY DEFINER + EXECUTE granted to
--    anon/authenticated. It joins lead_crm_data + leads and returns the
--    entire CRM pipeline (names, emails, companies, thread_state, etc.) to
--    anyone with the publishable key. The RLS we put on lead_crm_data does
--    NOT protect against this since the function bypasses it.
--    grep across src/ shows zero callers — function is unused by the app.
--
-- 2. public.match_video_index is SECURITY DEFINER + EXECUTE granted to
--    anon. It exposes s3_bucket / s3_key / caption_text for every row in
--    video_index via vector search. The app uses match_clips instead
--    (per src/lib/mcp/tools/search.ts), so revoking anon access from
--    match_video_index is safe.
--
-- 3. public.blog_topic_backlog has a policy named "service_role_all" that
--    actually applies to roles={public} — meaning anon can SELECT, INSERT,
--    UPDATE, DELETE every row. Live anon probe confirmed exfil and that
--    DELETE is permitted (only the WHERE filter prevents row removal).
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Drop unused, anon-callable get_pipeline_leads()
-- ---------------------------------------------------------------------------
DROP FUNCTION IF EXISTS public.get_pipeline_leads();

-- ---------------------------------------------------------------------------
-- 2. Lock match_video_index to service_role
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'match_video_index'
  ) THEN
    EXECUTE 'REVOKE ALL ON FUNCTION public.match_video_index(vector, integer, text, double precision) FROM PUBLIC';
    EXECUTE 'REVOKE ALL ON FUNCTION public.match_video_index(vector, integer, text, double precision) FROM anon';
    EXECUTE 'REVOKE ALL ON FUNCTION public.match_video_index(vector, integer, text, double precision) FROM authenticated';
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.match_video_index(vector, integer, text, double precision) TO service_role';
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- 3. Replace the misnamed policy on blog_topic_backlog
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'blog_topic_backlog') THEN
    EXECUTE 'ALTER TABLE public.blog_topic_backlog ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE public.blog_topic_backlog FORCE ROW LEVEL SECURITY';

    -- Drop the broken "service_role_all" policy that's actually on roles=public
    EXECUTE 'DROP POLICY IF EXISTS "service_role_all" ON public.blog_topic_backlog';

    -- Create a properly-scoped service_role policy
    EXECUTE 'DROP POLICY IF EXISTS "blog_topic_backlog_service_role" ON public.blog_topic_backlog';
    EXECUTE $p$
      CREATE POLICY "blog_topic_backlog_service_role" ON public.blog_topic_backlog
        FOR ALL
        TO service_role
        USING (true)
        WITH CHECK (true)
    $p$;

    -- Belt-and-suspenders: deny-all for everyone else (anon/authenticated)
    EXECUTE 'DROP POLICY IF EXISTS "blog_topic_backlog_deny_all" ON public.blog_topic_backlog';
    EXECUTE $p$
      CREATE POLICY "blog_topic_backlog_deny_all" ON public.blog_topic_backlog
        FOR ALL
        TO public
        USING (false)
        WITH CHECK (false)
    $p$;
  END IF;
END $$;
