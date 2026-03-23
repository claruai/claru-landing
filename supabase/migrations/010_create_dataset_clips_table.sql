-- =============================================================
-- dataset_clips: join table linking clips to datasets
-- =============================================================

CREATE TABLE public.dataset_clips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id uuid NOT NULL REFERENCES public.datasets(id) ON DELETE CASCADE,
  clip_id uuid NOT NULL REFERENCES public.clips(id) ON DELETE CASCADE,
  lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  added_by text,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Expression-based unique index (not a UNIQUE constraint)
-- Uses COALESCE to handle NULL lead_id for uniqueness
CREATE UNIQUE INDEX idx_dataset_clips_unique
  ON public.dataset_clips (dataset_id, clip_id, COALESCE(lead_id, '00000000-0000-0000-0000-000000000000'));

-- =============================================================
-- RLS: service-role only
-- =============================================================

ALTER TABLE public.dataset_clips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access"
  ON public.dataset_clips
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
