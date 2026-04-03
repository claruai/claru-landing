process.env.SKIP_REMOTION = 'true';

import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';
import { runPipeline } from '../src/lib/blog-pipeline/orchestrator';
import { crawlArxiv, crawlHackerNews, crawlRedditRss, crawlRssFeeds } from '../src/lib/blog-pipeline/crawlers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  console.log('Crawling sources...');
  const [arxiv, hn, reddit, rss] = await Promise.allSettled([
    crawlArxiv(),
    crawlHackerNews(),
    crawlRedditRss(),
    crawlRssFeeds(),
  ]);
  const crawledItems = [
    ...(arxiv.status === 'fulfilled' ? arxiv.value : []),
    ...(hn.status === 'fulfilled' ? hn.value : []),
    ...(reddit.status === 'fulfilled' ? reddit.value : []),
    ...(rss.status === 'fulfilled' ? rss.value : []),
  ];
  console.log(`Found ${crawledItems.length} relevant items.\n`);

  console.log('Triggering timely pipeline...\n');
  const start = Date.now();
  const result = await runPipeline('timely', { crawledItems });
  const elapsed = ((Date.now() - start) / 1000).toFixed(0);

  console.log(`\nDone in ${elapsed}s`);
  console.log('Result:', JSON.stringify(result, null, 2));

  if (!result.postId) {
    console.log('No post ID — pipeline may have failed.');
    return;
  }

  const { data } = await supabase
    .from('blog_posts')
    .select('title, slug, excerpt, slop_score, geo_score, citability_score, editorial_notes, body_mdx, composition_id, input_props')
    .eq('id', result.postId)
    .single();

  console.log('\n─────────────────────────────────────────');
  console.log('POST PREVIEW');
  console.log('─────────────────────────────────────────');
  console.log('Title:         ', data?.title);
  console.log('Slug:          ', data?.slug);
  console.log('Excerpt:       ', data?.excerpt);
  console.log('Slop score:    ', data?.slop_score, '/ 10');
  console.log('GEO score:     ', data?.geo_score, '/ 100');
  console.log('Citability:    ', data?.citability_score, '/ 100');
  console.log('Composition:   ', data?.composition_id ?? '(none)');
  console.log('Input props:   ', JSON.stringify(data?.input_props, null, 2));
  console.log('Notes:         ', JSON.stringify(data?.editorial_notes, null, 2));
  console.log('\nBody preview (first 1500 chars):');
  console.log('─────────────────────────────────────────');
  console.log(data?.body_mdx?.slice(0, 1500));
  console.log('\n─────────────────────────────────────────');
  console.log(`Review at: https://claru.ai/admin/blog-queue`);
  console.log(`Preview at: http://localhost:3000/blog/${data?.slug}`);
}

main().catch(err => { console.error(err); process.exit(1); });
