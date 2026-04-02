/**
 * src/trigger/blog-pipeline.ts
 *
 * Trigger.dev v3 weekly blog pipeline skeleton.
 *
 * TODO: Implement this task after Phase 1 (Next.js infrastructure) is merged.
 *
 * Setup checklist before enabling:
 *   1. npm install @trigger.dev/sdk@v3
 *   2. npx trigger.dev@latest init
 *   3. Add environment variables (see below)
 *   4. Deploy: npx trigger.dev@latest deploy
 *
 * Required environment variables:
 *   TRIGGER_SECRET_KEY       — from Trigger.dev dashboard
 *   ANTHROPIC_API_KEY        — already in env (for Phase 4 draft generation)
 *   APIFY_API_KEY            — for Twitter/X source (Phase 3, optional)
 *   SLACK_WEBHOOK_URL        — blog review channel notifications
 *   NEXT_PUBLIC_SUPABASE_URL — already in env
 *   SUPABASE_SERVICE_ROLE_KEY — already in env
 *
 * Architecture:
 *   WEEKLY CRON (Monday 08:00 UTC)
 *   ├── Phase 1: Source crawl (parallel fan-out)
 *   │   ├── arXiv API (cs.RO, cs.CV, cs.AI, cs.LG)
 *   │   ├── HN Algolia API (points > 50, last 7 days)
 *   │   ├── Reddit PRAW (r/MachineLearning, r/robotics, score > 100)
 *   │   ├── RSS feeds (DeepMind, OpenAI, Google Research, Meta AI)
 *   │   └── Twitter/X via Apify (optional, degrades gracefully)
 *   ├── Phase 2: Dedup + scoring (hash URLs → crawled_items table)
 *   ├── Phase 3: Topic selection via Claude API
 *   ├── Phase 4: Draft generation via Claude API (parallelised, 3 posts)
 *   └── Phase 5: Insert to blog_posts (status = 'pending_review') + Slack webhook
 */

// TODO: Uncomment after running: npm install @trigger.dev/sdk
// import { schedules } from "@trigger.dev/sdk/v3";

// TODO: Uncomment and implement after Trigger.dev is set up
// export const weeklyBlogPipeline = schedules.task({
//   id: "weekly-blog-pipeline",
//   cron: "0 8 * * 1", // Monday 08:00 UTC
//   run: async (_payload) => {
//     // Phase 1: crawl sources in parallel
//     const [arxivItems, hnItems, redditItems, rssItems] = await Promise.allSettled([
//       crawlArxiv(),
//       crawlHackerNews(),
//       crawlReddit(),
//       crawlRssFeeds(),
//     ]);
//
//     // Phase 2: dedup + score
//     const candidates = await deduplicateAndScore([
//       ...extractSettled(arxivItems),
//       ...extractSettled(hnItems),
//       ...extractSettled(redditItems),
//       ...extractSettled(rssItems),
//     ]);
//
//     // Phase 3: select top 3 topics via Claude
//     const selectedTopics = await selectTopicsViaClaude(candidates);
//
//     // Phase 4: generate drafts (parallelised)
//     const drafts = await Promise.all(
//       selectedTopics.map((topic) => generateDraftViaClaude(topic))
//     );
//
//     // Phase 5: insert to Supabase + notify Slack
//     for (const draft of drafts) {
//       await insertDraftToSupabase(draft);
//       await notifySlack(draft);
//     }
//   },
// });

export {};
