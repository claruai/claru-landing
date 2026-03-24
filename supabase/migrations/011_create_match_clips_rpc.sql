CREATE OR REPLACE FUNCTION public.match_clips(
  query_embedding vector(768),
  match_count int DEFAULT 20,
  filter_dataset_id uuid DEFAULT NULL,
  filter_bucket text DEFAULT NULL,
  match_threshold float DEFAULT 0.0
)
RETURNS TABLE (
  id uuid,
  s3_bucket text,
  s3_key text,
  ai_caption text,
  caption_text text,
  similarity float,
  ai_enrichment_source text,
  ai_agent_context jsonb,
  mime_type text,
  tech_resolution_width int,
  tech_resolution_height int,
  tech_fps numeric,
  tech_duration_seconds numeric,
  tech_codec text,
  ann_metadata jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  PERFORM set_config('hnsw.ef_search', '100', true);

  RETURN QUERY
  SELECT
    c.id,
    c.s3_bucket,
    c.s3_key,
    c.ai_caption,
    c.caption_text,
    (1 - (c.embedding <=> query_embedding))::float AS similarity,
    c.ai_enrichment_source,
    c.ai_agent_context,
    c.mime_type,
    c.tech_resolution_width,
    c.tech_resolution_height,
    c.tech_fps,
    c.tech_duration_seconds,
    c.tech_codec,
    c.ann_metadata
  FROM clips c
  LEFT JOIN dataset_clips dc
    ON dc.clip_id = c.id
    AND filter_dataset_id IS NOT NULL
  WHERE
    c.embedding IS NOT NULL
    AND (filter_dataset_id IS NULL OR dc.dataset_id = filter_dataset_id)
    AND (filter_bucket IS NULL OR c.s3_bucket = filter_bucket)
    AND (1 - (c.embedding <=> query_embedding))::float >= match_threshold
  GROUP BY c.id
  ORDER BY c.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
