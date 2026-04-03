/**
 * Idempotent seed script for content team pipeline testing.
 * Usage: npm run seed:content-team
 */
import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  console.log('=== Seeding content team test data ===\n');

  // Upsert blog_topic_backlog keyword row
  const keyword = 'diffusion policy training data';
  const { data: existingKeyword } = await supabase
    .from('blog_topic_backlog')
    .select('id')
    .eq('query', keyword)
    .limit(1)
    .single();

  if (!existingKeyword) {
    const { error } = await supabase.from('blog_topic_backlog').insert({
      query: keyword,
      priority: 1,
      status: 'queued',
      post_type: 'keyword',
      notes: 'Seed row for content team pipeline test',
    });
    if (error) {
      console.error('Failed to insert blog_topic_backlog:', error.message);
    } else {
      console.log(`✓ Inserted keyword: "${keyword}"`);
    }
  } else {
    // Reset to queued so the test can pick it up
    await supabase
      .from('blog_topic_backlog')
      .update({ status: 'queued', updated_at: new Date().toISOString() })
      .eq('id', existingKeyword.id);
    console.log(`✓ Reset keyword to queued: "${keyword}"`);
  }

  // Upsert blog_case_studies row
  const caseStudyHeadline = '10,000 episodes collected in 2 weeks';
  const { data: existingCs } = await supabase
    .from('blog_case_studies')
    .select('id')
    .eq('headline', caseStudyHeadline)
    .limit(1)
    .single();

  if (!existingCs) {
    const { error } = await supabase.from('blog_case_studies').insert({
      company: 'Test Lab',
      headline: caseStudyHeadline,
      challenge: 'Needed diverse manipulation data at scale',
      solution: 'Deployed 50 egocentric collectors across 3 cities',
      results: 'Policy achieved 78% success rate on held-out tasks',
      data_types: ['egocentric_video', 'teleop'],
      status: 'queued',
    });
    if (error) {
      console.error('Failed to insert blog_case_studies:', error.message);
    } else {
      console.log(`✓ Inserted case study: "${caseStudyHeadline}"`);
    }
  } else {
    await supabase
      .from('blog_case_studies')
      .update({ status: 'queued' })
      .eq('id', existingCs.id);
    console.log(`✓ Reset case study to queued: "${caseStudyHeadline}"`);
  }

  // Clean up stale running pipeline runs (older than 10 minutes)
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { data: staleRuns } = await supabase
    .from('blog_pipeline_runs')
    .delete()
    .eq('status', 'running')
    .lt('started_at', tenMinutesAgo)
    .select('id');
  if (staleRuns && staleRuns.length > 0) {
    console.log(`✓ Cleaned up ${staleRuns.length} stale running pipeline runs`);
  }

  console.log('\n=== Seed complete ===');
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
