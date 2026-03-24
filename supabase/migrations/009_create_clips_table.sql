-- =============================================================
-- clips: unified clip table for all media assets
-- =============================================================

CREATE TABLE public.clips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Core identity
  s3_bucket text NOT NULL,
  s3_key text NOT NULL,
  mime_type text,
  filename text,

  -- Annotation columns
  ann_metadata jsonb,
  ann_annotation_key text,
  ann_specs_key text,

  -- Technical columns
  tech_file_size_bytes bigint,
  tech_duration_seconds numeric,
  tech_resolution_width int,
  tech_resolution_height int,
  tech_fps numeric,
  tech_codec text,
  tech_bit_depth int,

  -- AI columns
  ai_caption text,
  ai_agent_context jsonb,
  ai_enrichment_source text,
  ai_enrichment_json jsonb,

  -- Derived fields
  caption_text text,
  embedding vector(768),
  caption_rebuilt_at timestamptz,

  -- Timestamps
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  -- Unique constraint
  CONSTRAINT clips_s3_bucket_s3_key_unique UNIQUE (s3_bucket, s3_key)
);

-- Auto-update trigger for updated_at
CREATE OR REPLACE FUNCTION public.clips_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER clips_updated_at
  BEFORE UPDATE ON public.clips
  FOR EACH ROW
  EXECUTE FUNCTION public.clips_set_updated_at();

-- =============================================================
-- Indexes
-- =============================================================

-- HNSW index on embedding column for vector similarity search
CREATE INDEX idx_clips_embedding_hnsw
  ON public.clips
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- GIN index on ann_metadata for JSONB queries
CREATE INDEX idx_clips_ann_metadata_gin
  ON public.clips
  USING gin (ann_metadata);

-- B-tree index on s3_bucket for filtered queries
CREATE INDEX idx_clips_s3_bucket
  ON public.clips (s3_bucket);

-- =============================================================
-- RLS: service-role only
-- =============================================================

ALTER TABLE public.clips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access"
  ON public.clips
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
