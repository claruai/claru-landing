import { schedules } from '@trigger.dev/sdk/v3';
import { crawlArxiv, crawlHackerNews, crawlRedditRss, crawlRssFeeds } from '@/lib/blog-pipeline/crawlers';
import { deduplicateAndStore } from '@/lib/blog-pipeline/dedup';
import { runPipeline } from '@/lib/blog-pipeline/orchestrator';
import {
  generateDraft,
  generateKeywordDraft,
  generateCaseStudyPost,
  selectTimelyTopic,
} from '@/lib/blog-pipeline/generate';
import { notifySlack } from '@/lib/blog-pipeline/notify';
import { createClient } from '@supabase/supabase-js';
import type { BlogDraft } from '@/lib/blog-pipeline/types';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Legacy helper — kept for backward compat with generate.ts exports
async function insertDraft(
  supabase: ReturnType<typeof getSupabase>,
  draft: BlogDraft,
  postType: string,
  extra?: Record<string, unknown>
): Promise<string | null> {
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
      ...extra,
    })
    .select('id')
    .single();

  if (error) {
    console.error(`[blog-pipeline] Insert failed (${postType}):`, error.message, 'slug:', draft.slug);
    return null;
  }
  return data.id;
}

export const weeklyBlogPipeline = schedules.task({
  id: 'weekly-blog-pipeline',
  cron: '0 8 * * 1', // Monday 08:00 UTC
  run: async (_payload) => {
    console.log('[blog-pipeline] Starting weekly run — content team pipeline');
    const results = { keyword: false, timely: false, caseStudy: false };

    // ── POST 1: Keyword/evergreen — orchestrator selects backlog internally ──
    console.log('[blog-pipeline] Post 1: keyword (content team)');
    try {
      const result = await runPipeline('keyword');
      results.keyword = result.success;
      if (!result.success) {
        console.warn('[blog-pipeline] Keyword pipeline failed:', result.error);
      } else {
        console.log(`[blog-pipeline] Keyword done — post ${result.postId}`);
      }
    } catch (err) {
      console.error('[blog-pipeline] Keyword pipeline threw:', err);
    }

    // ── POST 2: Timely — pre-crawl, pass new items to orchestrator ──────────
    console.log('[blog-pipeline] Post 2: timely (content team)');
    try {
      const [arxivResult, hnResult, redditResult, rssResult] = await Promise.allSettled([
        crawlArxiv(),
        crawlHackerNews(),
        crawlRedditRss(),
        crawlRssFeeds(),
      ]);

      if (arxivResult.status  === 'rejected') console.error('[blog-pipeline] arXiv crawl failed:', arxivResult.reason);
      if (hnResult.status     === 'rejected') console.error('[blog-pipeline] HN crawl failed:', hnResult.reason);
      if (redditResult.status === 'rejected') console.error('[blog-pipeline] Reddit crawl failed:', redditResult.reason);
      if (rssResult.status    === 'rejected') console.error('[blog-pipeline] RSS crawl failed:', rssResult.reason);

      const allItems = [
        ...(arxivResult.status === 'fulfilled' ? arxivResult.value : []),
        ...(hnResult.status    === 'fulfilled' ? hnResult.value    : []),
        ...(redditResult.status === 'fulfilled' ? redditResult.value : []),
        ...(rssResult.status   === 'fulfilled' ? rssResult.value   : []),
      ];

      console.log(`[blog-pipeline] Crawled ${allItems.length} items`);
      const newItems = await deduplicateAndStore(allItems);
      console.log(`[blog-pipeline] ${newItems.length} new items after dedup`);

      const result = await runPipeline('timely', { crawledItems: newItems });
      results.timely = result.success;
      if (!result.success) {
        console.warn('[blog-pipeline] Timely pipeline failed:', result.error);
      } else {
        console.log(`[blog-pipeline] Timely done — post ${result.postId}`);
      }
    } catch (err) {
      console.error('[blog-pipeline] Timely pipeline threw:', err);
    }

    // ── POST 3: Case study — orchestrator selects next queued study ─────────
    console.log('[blog-pipeline] Post 3: case study (content team)');
    try {
      const result = await runPipeline('case_study');
      results.caseStudy = result.success;
      if (!result.success) {
        console.warn('[blog-pipeline] Case study pipeline failed:', result.error);
      } else {
        console.log(`[blog-pipeline] Case study done — post ${result.postId}`);
      }
    } catch (err) {
      console.error('[blog-pipeline] Case study pipeline threw:', err);
    }

    const drafted = Object.values(results).filter(Boolean).length;
    console.log(`[blog-pipeline] Done. ${drafted}/3 posts created.`, results);
    return { drafted, results };
  },
});

// ── Orphan cleanup cron — resets stuck in_progress rows every 30 minutes ──
export const orphanCleanup = schedules.task({
  id: 'blog-pipeline-orphan-cleanup',
  cron: '*/30 * * * *',
  maxDuration: 30,
  run: async () => {
    const supabase = getSupabase();
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

    // Reset stuck blog_topic_backlog
    const { data: backlogRows } = await supabase
      .from('blog_topic_backlog')
      .update({ status: 'queued' })
      .eq('status', 'in_progress')
      .lt('updated_at', twoHoursAgo)
      .select('id');
    const backlogCount = backlogRows?.length ?? 0;
    if (backlogCount) console.log(`[orphan-cleanup] Reset ${backlogCount} blog_topic_backlog rows`);

    // Reset stuck blog_case_studies
    const { data: csRows } = await supabase
      .from('blog_case_studies')
      .update({ status: 'queued' })
      .eq('status', 'in_progress')
      .lt('updated_at', twoHoursAgo)
      .select('id');
    const csCount = csRows?.length ?? 0;
    if (csCount) console.log(`[orphan-cleanup] Reset ${csCount} blog_case_studies rows`);

    // Mark stuck pipeline runs as failed
    const { data: runRows } = await supabase
      .from('blog_pipeline_runs')
      .update({ status: 'failed', error: 'orphan cleanup' })
      .eq('status', 'running')
      .lt('started_at', twoHoursAgo)
      .select('id');
    const runCount = runRows?.length ?? 0;
    if (runCount) console.log(`[orphan-cleanup] Marked ${runCount} pipeline runs as failed`);

    return { backlogCount, csCount, runCount };
  },
});
