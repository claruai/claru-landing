-- Blog topic backlog: seeded by humans + DataForSEO, consumed by pipeline
CREATE TABLE IF NOT EXISTS blog_topic_backlog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  query text NOT NULL,
  post_type text NOT NULL DEFAULT 'keyword'
    CHECK (post_type IN ('keyword', 'timely', 'case_study')),
  volume integer,
  kd integer,
  priority integer NOT NULL DEFAULT 5
    CHECK (priority BETWEEN 1 AND 10),
  notes text,
  status text NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued', 'in_progress', 'published', 'rejected')),
  blog_post_id uuid REFERENCES blog_posts(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS blog_topic_backlog_status_priority_idx
  ON blog_topic_backlog (status, priority, created_at);

ALTER TABLE blog_topic_backlog ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_all" ON blog_topic_backlog
  USING (true) WITH CHECK (true);

-- Case studies: transformed from internal docs/decks into blog posts
CREATE TABLE IF NOT EXISTS blog_case_studies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company text NOT NULL,
  industry text,
  headline text NOT NULL,
  challenge text NOT NULL,
  solution text NOT NULL,
  results text NOT NULL,
  data_types text[],
  volume_annotations integer,
  source_doc_url text,
  status text NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued', 'published', 'rejected')),
  blog_post_id uuid REFERENCES blog_posts(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE blog_case_studies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_all" ON blog_case_studies
  USING (true) WITH CHECK (true);
