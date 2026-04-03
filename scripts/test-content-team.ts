/**
 * End-to-end test for the content team pipeline.
 * Sets SKIP_REMOTION=true before imports so video rendering is bypassed.
 *
 * Usage: npm run test:content-team
 *   (or: SKIP_REMOTION=true tsx scripts/test-content-team.ts)
 */

// Must be set BEFORE any pipeline imports
process.env.SKIP_REMOTION = 'true';

import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

// Seed first (inline, so we don't need to spawn a subprocess)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function seed() {
  const keyword = 'diffusion policy training data';
  const { data: existing } = await supabase
    .from('blog_topic_backlog')
    .select('id')
    .eq('query', keyword)
    .limit(1)
    .single();

  if (!existing) {
    await supabase.from('blog_topic_backlog').insert({
      query: keyword,
      priority: 1,
      status: 'queued',
      post_type: 'keyword',
      notes: 'E2E test seed row',
    });
  } else {
    await supabase
      .from('blog_topic_backlog')
      .update({ status: 'queued', updated_at: new Date().toISOString() })
      .eq('id', existing.id);
  }

  // Clean stale runs
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  await supabase
    .from('blog_pipeline_runs')
    .delete()
    .eq('status', 'running')
    .lt('started_at', tenMinutesAgo);
}

type AssertResult = { label: string; pass: boolean; actual?: string };

function assert(label: string, condition: boolean, actual?: string): AssertResult {
  if (condition) {
    console.log(`  PASS: ${label}`);
  } else {
    console.log(`  FAIL: ${label}${actual ? ` — actual: ${actual}` : ''}`);
  }
  return { label, pass: condition, actual };
}

async function main() {
  console.log('=== Content Team Pipeline E2E Test ===\n');
  console.log('SKIP_REMOTION:', process.env.SKIP_REMOTION);

  // Seed
  console.log('\n[1] Seeding test data...');
  await seed();
  console.log('Seed complete.\n');

  // Import pipeline AFTER env vars are set
  const { runPipeline } = await import('../src/lib/blog-pipeline/orchestrator');

  // Run pipeline
  console.log('[2] Running pipeline (keyword, SKIP_REMOTION=true)...');
  const start = Date.now();
  const result = await runPipeline('keyword');
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`Pipeline finished in ${elapsed}s. Result:`, JSON.stringify(result, null, 2));

  const results: AssertResult[] = [];

  // Assert 1: success
  results.push(assert('result.success === true', result.success === true));

  if (!result.success || !result.postId) {
    console.log('\n❌ Pipeline returned failure — aborting assertions');
    console.log('Error:', result.error);
    process.exit(1);
  }

  // Assert 2: blog_posts row
  const { data: post } = await supabase
    .from('blog_posts')
    .select('status, body_mdx, slop_score, geo_score')
    .eq('id', result.postId)
    .single();

  results.push(assert(
    "post.status === 'pending_review'",
    post?.status === 'pending_review',
    post?.status
  ));

  results.push(assert(
    'body_mdx.length >= 1200',
    (post?.body_mdx?.length ?? 0) >= 1200,
    `${post?.body_mdx?.length ?? 0} chars`
  ));

  results.push(assert(
    'slop_score >= 1',
    (post?.slop_score ?? 0) >= 1,
    String(post?.slop_score)
  ));

  results.push(assert(
    'geo_score >= 1',
    (post?.geo_score ?? 0) >= 1,
    String(post?.geo_score)
  ));

  // Assert 3: pipeline run record
  if (result.runId) {
    const { data: run } = await supabase
      .from('blog_pipeline_runs')
      .select('status')
      .eq('id', result.runId)
      .single();

    results.push(assert(
      "pipeline run status === 'complete'",
      run?.status === 'complete',
      run?.status
    ));
  }

  // Assert 4: anti-slop word check
  const bodyLower = (post?.body_mdx ?? '').toLowerCase();
  results.push(assert(
    'body does not contain "game-changing"',
    !bodyLower.includes('game-changing')
  ));
  results.push(assert(
    'body does not contain "comprehensive"',
    !bodyLower.includes('comprehensive')
  ));

  // Summary
  const passed = results.filter(r => r.pass).length;
  const total = results.length;
  console.log(`\n=== ${passed}/${total} assertions passed ===`);

  if (passed < total) {
    console.log('\nFailed assertions:');
    results.filter(r => !r.pass).forEach(r => console.log(`  - ${r.label}${r.actual ? ` (actual: ${r.actual})` : ''}`));
    process.exit(1);
  } else {
    console.log('\n✅ All assertions passed');
  }
}

main().catch((err) => {
  console.error('Test script threw:', err);
  process.exit(1);
});
