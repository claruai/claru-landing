-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text,
  body_mdx text NOT NULL,
  tags text[] DEFAULT '{}',
  source_urls text[] DEFAULT '{}',
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'published', 'rejected')),
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crawled items deduplication table
CREATE TABLE IF NOT EXISTS crawled_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url_hash text UNIQUE NOT NULL,
  url text NOT NULL,
  title text,
  source text CHECK (source IN ('arxiv', 'hn', 'reddit', 'rss', 'twitter')),
  score int DEFAULT 0,
  crawled_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE crawled_items ENABLE ROW LEVEL SECURITY;

-- blog_posts: anon can only read published posts
CREATE POLICY "Public can read published posts" ON blog_posts
  FOR SELECT USING (status = 'published');

-- crawled_items: no anon access
CREATE POLICY "No anon access to crawled items" ON crawled_items
  FOR ALL USING (false);

-- updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
