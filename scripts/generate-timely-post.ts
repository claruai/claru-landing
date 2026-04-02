/**
 * Generate the timely post reacting to the MIT Tech Review article on gig workers
 * training humanoid robots (published 2026-04-01).
 *
 * Counter-angle: quality vs volume in humanoid training data collection.
 *
 * Usage:
 *   tsx scripts/generate-timely-post.ts
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';
import { generateDraft } from '../src/lib/blog-pipeline/generate';
import { notifySlack } from '../src/lib/blog-pipeline/notify';
import type { CrawledItem } from '../src/lib/blog-pipeline/types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Hard-code the source article — crawlers can't get past the paywall
const sourceItems: CrawledItem[] = [
  {
    source: 'rss',
    title: 'The gig workers who are training humanoid robots at home',
    url: 'https://www.technologyreview.com/2026/04/01/gig-workers-training-humanoid-robots',
    urlHash: 'mit-tr-gig-workers-2026-04-01',
    score: 95,
    summary: `MIT Technology Review investigation into the emerging gig economy around humanoid robot training data. Workers are paid $15-25/hour to teleoperate or demonstrate tasks at home for companies like Figure AI, Physical Intelligence (pi), and 1X Technologies. The piece raises concerns about data quality consistency, worker fatigue leading to degraded demonstrations, and the lack of standardized annotation protocols across the industry. One data manager at a major lab described rejecting 40% of submitted demonstrations due to quality issues.`,
    publishedAt: '2026-04-01',
  },
  {
    source: 'arxiv',
    title: 'Scaling Robot Learning with Semantically Imagined Experience',
    url: 'https://arxiv.org/abs/2302.11550',
    urlHash: 'arxiv-2302-11550',
    score: 80,
    summary: 'Demonstrates that demonstration quality and diversity (not just quantity) is the key bottleneck for robot policy generalization. Low-quality or repetitive demos can actively harm policy performance.',
    publishedAt: '2023-02-22',
  },
  {
    source: 'arxiv',
    title: 'Open X-Embodiment: Robotic Learning Datasets and RT-X Models',
    url: 'https://arxiv.org/abs/2310.08864',
    urlHash: 'arxiv-2310-08864',
    score: 85,
    summary: 'Open X-Embodiment aggregated 22 robot datasets from 21 institutions. Key finding: heterogeneous data quality was the primary challenge in cross-embodiment policy training, not dataset size.',
    publishedAt: '2023-10-13',
  },
];

const topic = {
  topic: "Gig worker model for humanoid training data: why volume alone isn't enough",
  targetQuery: 'gig workers training humanoid robots data quality',
  sourceItems: [0, 1, 2] as number[],
  twitterThread: ``,
};

async function main() {
  console.log('=== Generating timely post: MIT Tech Review counter-angle ===\n');
  console.log(`Topic: ${topic.topic}`);
  console.log(`Query: "${topic.targetQuery}"\n`);

  console.log('Generating draft via Claude...');
  const draft = await generateDraft(topic, sourceItems);

  if (!draft) {
    console.error('Draft generation failed.');
    process.exit(1);
  }

  console.log(`\nTitle:       ${draft.title}`);
  console.log(`Slug:        ${draft.slug}`);
  console.log(`Excerpt:     ${draft.excerpt}`);
  console.log(`Tags:        ${draft.tags.join(', ')}`);
  console.log(`Body length: ${draft.body_mdx.length} chars\n`);

  console.log('Inserting to Supabase...');
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
      twitter_thread: topic.twitterThread || null,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Insert failed:', error.message);
    process.exit(1);
  }

  console.log(`Inserted: ${data.id}`);

  // Mark the backlog timely entry as in_progress
  await supabase
    .from('blog_topic_backlog')
    .update({ status: 'in_progress', updated_at: new Date().toISOString() })
    .eq('query', 'gig workers training robots quality')
    .eq('post_type', 'timely');

  console.log('Sending Slack notification...');
  await notifySlack(draft, data.id, 'timely', topic.twitterThread || undefined);
  console.log('Done.\n');

  console.log(`=== Post ready for review ===`);
  console.log(`Slug: ${draft.slug}`);
  console.log(`Review at: https://claru.ai/admin/blog-queue`);
  console.log(`\nBody preview (first 500 chars):\n${draft.body_mdx.slice(0, 500)}...`);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
