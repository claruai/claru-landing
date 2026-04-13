# PRD: Autonomous Blog Pipeline

**Status:** Draft
**Branch:** feat/glossary-and-blog-pipeline
**Date:** 2026-04-02
**Routes:** `/blog` (index), `/blog/[slug]` (post), `/admin/blog-queue` (review UI)
**Scoring requirement:** Each published post scores 9+/10 before going live

---

## Problem

Claru has 2 blog posts. Competitor Introspector.io has a growing "Interesting" editorial section. AI assistants (ChatGPT, Perplexity) cite editorial content to answer physical AI questions. Publishing manually is a bottleneck. The goal is a pipeline that finds relevant content, generates posts in Claru's voice, and surfaces them for a 5-minute human review before going live — running autonomously on a weekly schedule.

## Goals

1. Weekly autonomous content generation: 1-3 posts per week from crawled sources
2. Human review checkpoint before publish (not full auto)
3. Posts score 9+/10 on GEO scoring rubric
4. `/blog` index page exists and is well-structured (currently 404)
5. All posts link to glossary terms and GEO landing pages

---

## Architecture

### Platform: Trigger.dev v3

**Not** Vercel Cron (60s timeout kills LLM generation). Trigger.dev v3 cloud free tier: 5k runs/month, sufficient for weekly pipeline.

```
WEEKLY CRON (Trigger.dev, Monday 08:00 UTC)
│
├── PHASE 1: SOURCE CRAWL (parallel fan-out, ~5 min)
│   ├── arXiv API (cs.RO, cs.CV, cs.AI, cs.LG)
│   ├── HN Algolia API (filter: points > 50, last 7 days)
│   ├── Reddit PRAW (r/MachineLearning, r/robotics, score > 100)
│   ├── RSS feeds (DeepMind, OpenAI, Google Research, Meta AI)
│   └── Twitter/X via Apify actor (~$0.20/week)
│
├── PHASE 2: DEDUP + SCORING (~2 min)
│   ├── Hash URLs → Supabase crawled_items table
│   └── Score by: recency, HN points, Reddit upvotes, arXiv citation velocity
│
├── PHASE 3: TOPIC SELECTION via Claude API (~1 min)
│   └── "Given N items, identify 3 most blog-worthy topics for physical AI training data audience"
│
├── PHASE 4: DRAFT GENERATION via Claude API (~10 min, parallelized)
│   └── System prompt: Claru voice rules + post template → {title, slug, excerpt, body_mdx, tags, source_links}
│
├── PHASE 5: REVIEW QUEUE
│   ├── Insert to Supabase blog_posts: status = 'pending_review'
│   └── Slack webhook: post to review channel with preview link + Approve/Reject deep links
│
└── PHASE 6: PUBLISH (manual, via /admin/blog-queue)
    ├── Approve → status = 'published', published_at = now()
    └── revalidatePath('/blog', 'layout') + revalidatePath('/blog/' + slug)
```

---

## Data Storage

### Supabase Tables

#### `blog_posts`
```sql
CREATE TABLE blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text,
  body_mdx text NOT NULL,
  tags text[],
  source_urls text[],
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'published', 'rejected')),
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

#### `crawled_items`
```sql
CREATE TABLE crawled_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url_hash text UNIQUE NOT NULL,
  url text NOT NULL,
  title text,
  source text, -- 'arxiv' | 'hn' | 'reddit' | 'rss' | 'twitter'
  score int DEFAULT 0,
  crawled_at timestamptz DEFAULT now()
);
```

### RLS Rules
- `blog_posts`: anon SELECT only for `status = 'published'`, no anon INSERT/UPDATE
- Publish endpoint uses service role key
- `crawled_items`: no anon access, service role only

---

## Content Sources

### Priority Order (implement in this order)

1. **arXiv** — highest signal, free, clean API
   - Categories: `cs.RO`, `cs.CV`, `cs.AI`, `cs.LG`
   - Search terms: "embodied AI", "VLA", "world model", "manipulation", "egocentric", "RLHF", "teleoperation"
   - Library: `arxiv` Python package (lukasschwab/arxiv.py)
   - Rate limit: 3s between calls

2. **HN Algolia API** — free, no auth
   - Endpoint: `hn.algolia.com/api/v1/search_by_date`
   - Filter: `tags=story`, points > 50, last 7 days
   - Queries: "embodied AI", "VLA", "physical AI", "robot learning"

3. **Reddit PRAW** — official free API, 100 QPM
   - Subreddits: `r/MachineLearning`, `r/robotics`, `r/artificial`
   - Filter: top week, score > 100

4. **RSS feeds** — most reliable, zero auth
   - DeepMind, OpenAI, Google Research, Meta AI blogs
   - Filter: published last 7 days, title keyword match

5. **Twitter/X via Apify** — ~$0.20/week
   - Monitor: ~20 curated robotics/AI researcher accounts
   - Search: "physical AI data", "robot training data", "VLA training"
   - Fallback: pipeline degrades gracefully without Twitter

---

## Anti-Slop Voice Rules (Claude System Prompt)

```
You are a technical writer for Claru, a physical AI training data company.
Your readers are ML researchers and AI lab engineers at frontier labs.

VOICE RULES:
- Specific over vague. Quote actual paper results.
- Assume PhD-level ML background.
- Never use: "game-changing", "revolutionary", "unleash", "harness", "paradigm shift",
  "comprehensive", "cutting-edge", "state-of-the-art", "robust", "seamless", "powerful",
  "innovative", "exciting"
- Opinion is fine. Hype is not.
- Break symmetric structure deliberately — not every section needs the same format.
- Every post must cite at least 5 named entities (real datasets, models, companies, papers).
- End with a specific, actionable observation — not "watch this space".

POST FORMAT (required, in this order):
1. H1 matching the target query (include year)
2. TL;DR box: 3-4 standalone bullets, each a complete sentence
3. Table of contents
4. Body sections: min 1,200 words, max 2,800 words
5. At least one data table or comparison block
6. At least one stat Claru owns (annotation volume, environment count, etc.)
7. Key Takeaways section
8. FAQ section (3-5 questions phrased as literal search queries)
9. Related Resources (1 GEO page, 1 compare page, 1 glossary link)

FRONTMATTER OUTPUT (required):
{
  "title": "...",
  "slug": "...",
  "excerpt": "one sentence, opens with specific claim",
  "tags": ["tag1", "tag2"],
  "source_urls": ["url1", "url2"]
}
```

---

## Next.js Pages Required

### `/blog/page.tsx` (NEW — currently 404)
Blog index listing all published posts. Uses `Blog` JSON-LD type.
- Fetches from Supabase: `status = 'published'`, order by `published_at DESC`
- Shows: title, date, excerpt, tags
- Server component with ISR (revalidate: 3600)
- Matches existing dark aesthetic

### `/blog/[slug]/page.tsx` (NEW)
Individual post renderer using `next-mdx-remote` with strict component allowlist.
- Fetches post from Supabase by slug
- JSON-LD: BlogPosting + BreadcrumbList + FAQPage
- `mentions` array in BlogPosting (entities named in post)
- Freshness stamp in accent monospace
- Internal links to glossary on first mention of any defined term

### `/admin/blog-queue/page.tsx` (NEW)
Password-protected review UI for draft posts.
- Lists all `status = 'pending_review'` posts
- Renders MDX preview
- Approve / Reject / Edit actions → `/api/blog/publish`
- Reuses existing portal auth pattern (password: same as portal)

### `/api/blog/publish/route.ts` (NEW)
Service-role endpoint:
- Validates request auth
- Updates `status = 'published'`, sets `published_at`
- Calls `revalidatePath('/blog', 'layout')` and `revalidatePath('/blog/' + slug)`

---

## Trigger.dev Setup

### Location: `src/trigger/` directory

```typescript
// src/trigger/blog-pipeline.ts
import { schedules } from "@trigger.dev/sdk/v3";

export const weeklyBlogPipeline = schedules.task({
  id: "weekly-blog-pipeline",
  cron: "0 8 * * 1", // Monday 08:00 UTC
  run: async (payload) => {
    // Phase 1: crawl in parallel
    // Phase 2: dedup
    // Phase 3: topic selection
    // Phase 4: draft generation
    // Phase 5: insert to Supabase + email
  }
});
```

### Environment Variables Required
```
TRIGGER_SECRET_KEY=...
APIFY_API_KEY=...
ANTHROPIC_API_KEY=...  (already in env)
NEXT_PUBLIC_SUPABASE_URL=...  (already in env)
SUPABASE_SERVICE_ROLE_KEY=...  (already in env)
SLACK_WEBHOOK_URL=...  (blog review notifications)
```

---

## Blog Post Template (Post Scoring Rubric)

### Required for 9+/10

| Criterion | Weight | Pass |
|-----------|--------|------|
| TL;DR box: 3-4 standalone bullet sentences | 3x | All bullets complete sentences |
| H1 matches target query phrasing + year | 2x | Exact query phrasing |
| ≥1 original Claru data point | 2x | Quantified (clip count, annotation volume) |
| FAQPage JSON-LD with literal query strings | 2x | 3+ questions as actual search queries |
| Named entities count ≥5 | 2x | Real datasets/models/companies |
| `mentions` array in BlogPosting JSON-LD | 1x | 3+ entities with URLs |
| Zero AI slop signals | 2x | Verified against banned word list |
| Internal links (GEO + compare + glossary) | 2x | All 3 types present |
| BreadcrumbList JSON-LD: 3 levels | 1x | Home → Blog → Post |
| Meta description: specific first word | 1x | Number or named entity first |
| Post length: 1,200-2,800 words | 1x | Within range |
| Freshness stamp visible | 1x | Accent monospace |

**Hard fail gates:**
- Missing TL;DR box
- No FAQPage JSON-LD
- No internal link to GEO landing page
- Post under 900 words
- H1 contains banned words (comprehensive, cutting-edge, powerful, etc.)

---

## First 4 Posts (Manual, Pre-Pipeline)

These 4 posts get written before the pipeline is live to establish the blog and validate the template. Written by human + Claude, not the pipeline.

1. **VLM vs VLA: What's the Actual Difference?** — target query: "VLM vs VLA difference"
2. **How Much Training Data Does a VLA Model Need?** — target query: "how much training data vla model"
3. **What Is the Sim-to-Real Gap?** — target query: "sim to real gap explained"
4. **The Physical AI Stack: From Perception to Policy** — target query: "physical AI architecture explained"

---

## Acceptance Criteria

### Phase 1 (Landing page — in this PR):
- [ ] `/blog` index page renders with existing 2 posts + new posts
- [ ] `/blog/[slug]` renders with full JSON-LD (BlogPosting + Breadcrumb + FAQ + mentions)
- [ ] All 4 manual posts written, scored 9+/10, and published
- [ ] Sitemap updated: `/blog` (0.8, weekly) + each post (0.8, monthly)

### Phase 2 (Pipeline — separate PR after Phase 1):
- [ ] `blog_posts` + `crawled_items` Supabase tables created with RLS
- [ ] Trigger.dev task runs locally against real sources
- [ ] arXiv, HN, Reddit, RSS crawlers all return results
- [ ] Claude API generates a post that scores 7+/10 (auto-evaluation)
- [ ] Draft appears in Supabase with `status = 'pending_review'`
- [ ] `/admin/blog-queue` shows draft with Approve button
- [ ] Approve → post goes live via `revalidatePath`
- [ ] Slack webhook fires on new draft (message includes preview link + Approve/Reject deep links to /admin/blog-queue)

### Phase 3 (Twitter + Apify + polish — separate PR):
- [ ] Apify actor integrated as 5th source
- [ ] Pipeline degrades gracefully when Apify fails
- [ ] Auto-scoring: Claude scores its own draft against rubric before inserting
- [ ] Drafts below 7/10 are auto-rejected and logged
