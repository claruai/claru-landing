-- Formalize video_index table from PoC → production schema
-- Changes: embedding column from untyped vector(1536) to vector(768)
-- PoC data (90k rows) will be re-loaded by loader scripts (US-202+)

-- Drop existing PoC function first (depends on table)
DROP FUNCTION IF EXISTS match_video_index(vector, integer, text, double precision);

-- Drop PoC table and recreate with correct schema
DROP TABLE IF EXISTS video_index CASCADE;

CREATE TABLE video_index (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  s3_bucket       text NOT NULL,
  s3_key          text NOT NULL,
  dataset_id      uuid REFERENCES datasets(id) ON DELETE SET NULL,
  caption_text    text,
  embedding       extensions.vector(768),
  enrichment_source text,
  indexed_at      timestamptz DEFAULT now(),
  UNIQUE (s3_bucket, s3_key)
);

-- Supporting indexes (no HNSW yet — deferred to US-205b)
CREATE INDEX idx_video_index_bucket  ON video_index (s3_bucket);
CREATE INDEX idx_video_index_dataset ON video_index (dataset_id);

-- Semantic search RPC
CREATE OR REPLACE FUNCTION match_video_index(
  query_embedding extensions.vector(768),
  match_count     integer,
  filter_bucket   text DEFAULT NULL,
  match_threshold double precision DEFAULT 0.40
)
RETURNS TABLE (
  id                uuid,
  s3_bucket         text,
  s3_key            text,
  caption_text      text,
  similarity        double precision,
  enrichment_source text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    vi.id,
    vi.s3_bucket,
    vi.s3_key,
    vi.caption_text,
    1 - (vi.embedding <=> query_embedding) AS similarity,
    vi.enrichment_source
  FROM video_index vi
  WHERE
    vi.embedding IS NOT NULL
    AND (filter_bucket IS NULL OR vi.s3_bucket = filter_bucket)
    AND 1 - (vi.embedding <=> query_embedding) >= match_threshold
  ORDER BY vi.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
