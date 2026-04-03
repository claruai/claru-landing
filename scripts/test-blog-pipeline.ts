/**
 * Test script for the blog pipeline.
 * Runs all phases against real sources and inserts one draft into Supabase.
 *
 * Usage:
 *   npm run test:blog-pipeline
 *   (or: tsx scripts/test-blog-pipeline.ts)
 *
 * Principle 9: build the pipeline as an agent/script first, verify it works,
 * then it runs autonomously via Trigger.dev.
 */

import { config } from 'dotenv';
config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';
import { crawlArxiv, crawlHackerNews, crawlRedditRss, crawlRssFeeds } from '../src/lib/blog-pipeline/crawlers';
import { deduplicateAndStore } from '../src/lib/blog-pipeline/dedup';
import { selectTopics, generateDraft } from '../src/lib/blog-pipeline/generate';
import { notifySlack } from '../src/lib/blog-pipeline/notify';

async function main() {
  console.log('=== Blog Pipeline Test Run ===\n');

  // -------------------------------------------------------------------------
  // Phase 1: Crawl all sources
  // -------------------------------------------------------------------------
  console.log('Phase 1: Crawling sources...');
  const [arxivResult, hnResult, redditResult, rssResult] = await Promise.allSettled([
    crawlArxiv(),
    crawlHackerNews(),
    crawlRedditRss(),
    crawlRssFeeds(),
  ]);

  const arxivItems  = arxivResult.status  === 'fulfilled' ? arxivResult.value  : [];
  const hnItems     = hnResult.status     === 'fulfilled' ? hnResult.value     : [];
  const redditItems = redditResult.status === 'fulfilled' ? redditResult.value : [];
  const rssItems    = rssResult.status    === 'fulfilled' ? rssResult.value    : [];

  if (arxivResult.status  === 'rejected') console.error('  arXiv error:', arxivResult.reason);
  if (hnResult.status     === 'rejected') console.error('  HN error:', hnResult.reason);
  if (redditResult.status === 'rejected') console.error('  Reddit error:', redditResult.reason);
  if (rssResult.status    === 'rejected') console.error('  RSS error:', rssResult.reason);

  console.log(`  arXiv:  ${arxivItems.length} items`);
  console.log(`  HN:     ${hnItems.length} items`);
  console.log(`  Reddit: ${redditItems.length} items`);
  console.log(`  RSS:    ${rssItems.length} items`);

  const allItems = [...arxivItems, ...hnItems, ...redditItems, ...rssItems];
  console.log(`  Total:  ${allItems.length} items\n`);

  if (allItems.length === 0) {
    console.error('No items crawled — check your network or source URLs.');
    process.exit(1);
  }

  console.log('Sample (first 5 items):');
  allItems.slice(0, 5).forEach(i => console.log(`  [${i.source}] ${i.title}`));
  console.log();

  // -------------------------------------------------------------------------
  // Phase 2: Dedup
  // -------------------------------------------------------------------------
  console.log('Phase 2: Deduplicating against Supabase crawled_items...');
  const newItems = await deduplicateAndStore(allItems);
  console.log(`  ${newItems.length} new items (${allItems.length - newItems.length} already seen)\n`);

  if (newItems.length === 0) {
    console.log('All items already seen — nothing to do. Run again next week.');
    process.exit(0);
  }

  // -------------------------------------------------------------------------
  // Phase 3: Topic selection
  // -------------------------------------------------------------------------
  console.log('Phase 3: Selecting topics via Claude...');
  const topics = await selectTopics(newItems);

  if (topics.length === 0) {
    console.error('Topic selection returned nothing. Check Claude API key.');
    process.exit(1);
  }

  console.log(`  Selected ${topics.length} topics:`);
  topics.forEach((t, i) => {
    console.log(`  ${i + 1}. ${t.topic}`);
    console.log(`     Query: "${t.targetQuery}"`);
  });
  console.log();

  // -------------------------------------------------------------------------
  // Phase 4: Generate ONE draft (save tokens — test with first topic only)
  // -------------------------------------------------------------------------
  const testTopic = topics[0];
  console.log(`Phase 4: Generating draft for: "${testTopic.topic}"`);

  const sourceItems = (testTopic.sourceItems ?? [])
    .map((i: number) => newItems[i])
    .filter(Boolean);

  const draft = await generateDraft(testTopic, sourceItems);

  if (!draft) {
    console.error('Draft generation failed. Check Claude API response above.');
    process.exit(1);
  }

  console.log(`  Title:       ${draft.title}`);
  console.log(`  Slug:        ${draft.slug}`);
  console.log(`  Excerpt:     ${draft.excerpt}`);
  console.log(`  Tags:        ${draft.tags.join(', ')}`);
  console.log(`  Body length: ${draft.body_mdx.length} chars`);
  console.log();

  // -------------------------------------------------------------------------
  // Phase 5: Insert to Supabase + Slack
  // -------------------------------------------------------------------------
  console.log('Phase 5: Inserting to Supabase...');

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from('blog_posts')
    .insert({
      slug: draft.slug,
      title: draft.title,
      excerpt: draft.excerpt,
      body_mdx: draft.body_mdx,
      tags: draft.tags,
      source_urls: draft.source_urls,
      mentions: draft.mentions ?? [],
      status: 'pending_review',
    })
    .select('id')
    .single();

  if (error) {
    console.error('  Insert failed:', error.message);
    process.exit(1);
  }

  console.log(`  Inserted: ${data.id}`);

  console.log('  Sending Slack notification...');
  await notifySlack(draft, data.id);
  console.log('  Slack notified.');

  console.log('\n=== Test complete ===');
  console.log(`Draft "${draft.slug}" is now pending review at /admin/blog-queue`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
