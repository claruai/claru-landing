-- =============================================================================
-- Harden increment_share_view RPC
--
-- Context: 20260412_increment_share_view.sql defined this as SECURITY DEFINER
-- with no explicit search_path and default PUBLIC EXECUTE grants. That means:
--   1. The function inherits the caller's search_path -> potential for
--      function/operator hijacking via a malicious schema in front of public.
--   2. Anyone with the anon key (i.e. anyone) can call it via PostgREST and
--      arbitrarily inflate share_view_count for any dataset id.
--
-- Fix: pin search_path to (public, pg_temp), revoke EXECUTE from PUBLIC and
-- the anon/authenticated roles, grant only to service_role. The single
-- in-app caller (src/app/share/[token]/page.tsx) already uses
-- createSupabaseAdminClient (service role), so no app behavior changes.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.increment_share_view(p_dataset_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE public.datasets
  SET share_view_count = share_view_count + 1,
      share_first_viewed_at = COALESCE(share_first_viewed_at, now())
  WHERE id = p_dataset_id;
END;
$$;

-- Lock down execute grants
REVOKE ALL ON FUNCTION public.increment_share_view(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.increment_share_view(uuid) FROM anon;
REVOKE ALL ON FUNCTION public.increment_share_view(uuid) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.increment_share_view(uuid) TO service_role;
