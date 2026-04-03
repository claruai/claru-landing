-- Add new columns to blog_posts (all IF NOT EXISTS via DO block)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='blog_posts' AND column_name='video_url') THEN
    ALTER TABLE blog_posts ADD COLUMN video_url text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='blog_posts' AND column_name='slop_score') THEN
    ALTER TABLE blog_posts ADD COLUMN slop_score smallint;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='blog_posts' AND column_name='seo_score') THEN
    ALTER TABLE blog_posts ADD COLUMN seo_score smallint;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='blog_posts' AND column_name='geo_score') THEN
    ALTER TABLE blog_posts ADD COLUMN geo_score smallint;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='blog_posts' AND column_name='citability_score') THEN
    ALTER TABLE blog_posts ADD COLUMN citability_score smallint;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='blog_posts' AND column_name='post_type') THEN
    ALTER TABLE blog_posts ADD COLUMN post_type text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='blog_posts' AND column_name='editorial_notes') THEN
    ALTER TABLE blog_posts ADD COLUMN editorial_notes jsonb DEFAULT '[]';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='blog_posts' AND column_name='research_sources') THEN
    ALTER TABLE blog_posts ADD COLUMN research_sources jsonb DEFAULT '[]';
  END IF;
END $$;

-- Create blog_pipeline_runs table
CREATE TABLE IF NOT EXISTS blog_pipeline_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_type text NOT NULL,
  backlog_id uuid,
  status text DEFAULT 'running',
  phase text,
  blog_post_id uuid,
  error text,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Enable RLS — service role only (no public policies)
ALTER TABLE blog_pipeline_runs ENABLE ROW LEVEL SECURITY;
