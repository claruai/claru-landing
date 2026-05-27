-- Sample Pack Workflow (2026-05-14)
-- Adds share_mode + created_for_lead_id to datasets. Both additive and
-- fully backwards compatible: existing rows get share_mode = 'all' which
-- preserves today's "show every clip" behavior on existing share tokens.

BEGIN;

ALTER TABLE public.datasets
  ADD COLUMN IF NOT EXISTS share_mode text NOT NULL DEFAULT 'all',
  ADD COLUMN IF NOT EXISTS created_for_lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL;

ALTER TABLE public.datasets
  DROP CONSTRAINT IF EXISTS datasets_share_mode_check;

ALTER TABLE public.datasets
  ADD CONSTRAINT datasets_share_mode_check
  CHECK (share_mode IN ('all', 'showcase'));

CREATE INDEX IF NOT EXISTS idx_datasets_created_for_lead_id
  ON public.datasets(created_for_lead_id)
  WHERE created_for_lead_id IS NOT NULL;

COMMENT ON COLUMN public.datasets.share_mode IS
  'Controls clip visibility for /share/<token> view. ''all'' (default) shows every clip in the dataset; ''showcase'' filters to dataset_clips.is_showcase=true.';

COMMENT ON COLUMN public.datasets.created_for_lead_id IS
  'When this dataset is a per-prospect Sample Pack curation, points to the recipient lead. NULL for regular catalog datasets.';

COMMIT;
