-- =============================================================
-- Drop legacy tables — only execute after ALL code references are migrated
-- and staging is fully validated.
--
-- Tables dropped:
--   - dataset_samples (replaced by clips + dataset_clips)
--   - video_index (replaced by clips)
--   - lead_custom_samples (replaced by dataset_clips with lead_id)
--
-- RPCs dropped:
--   - match_samples (replaced by match_clips)
--   - match_video_index (replaced by match_clips)
-- =============================================================

-- Drop RPCs first (they reference the tables)
DROP FUNCTION IF EXISTS public.match_samples(vector, int, uuid, float);
DROP FUNCTION IF EXISTS public.match_video_index(vector, int, text, float);

-- Drop tables (CASCADE drops dependent objects like triggers, indexes, policies)
DROP TABLE IF EXISTS public.lead_custom_samples CASCADE;
DROP TABLE IF EXISTS public.dataset_samples CASCADE;
DROP TABLE IF EXISTS public.video_index CASCADE;

-- Drop the dataset_prefix_routes table (only used for full_corpus mode routing)
DROP TABLE IF EXISTS public.dataset_prefix_routes CASCADE;
