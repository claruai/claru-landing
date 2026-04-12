-- =============================================================================
-- Community Signals — Add new columns to oss_datasets
-- Rebuilt signal sources: Semantic Scholar citing papers, HF discussions,
-- Reddit ML-subreddit posts, HF downloads percentile rank
-- =============================================================================

-- citing_papers_sample: top 3 most recent papers that cite this dataset's paper
ALTER TABLE oss_datasets
  ADD COLUMN IF NOT EXISTS citing_papers_sample jsonb DEFAULT '[]'::jsonb;

-- hf_discussion_count: total number of discussions on the HF dataset page
ALTER TABLE oss_datasets
  ADD COLUMN IF NOT EXISTS hf_discussion_count integer DEFAULT 0;

-- hf_discussions_sample: top 3 discussions by upvotes
ALTER TABLE oss_datasets
  ADD COLUMN IF NOT EXISTS hf_discussions_sample jsonb DEFAULT '[]'::jsonb;

-- hf_downloads_rank: percentile rank within the catalog by download count
-- Values: top_1_pct | top_5_pct | top_10_pct | top_25_pct | top_50_pct | bottom_50_pct
ALTER TABLE oss_datasets
  ADD COLUMN IF NOT EXISTS hf_downloads_rank text;

-- Index on downloads rank for badge filtering
CREATE INDEX IF NOT EXISTS idx_oss_downloads_rank ON oss_datasets (hf_downloads_rank);
