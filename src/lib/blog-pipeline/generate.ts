import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import type { CrawledItem, TopicSelection, BlogDraft } from './types';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ---------------------------------------------------------------------------
// Fetch already-published/queued titles — injected into every topic selection
// so Claude never duplicates a post.
// ---------------------------------------------------------------------------
async function getPublishedTitles(): Promise<string[]> {
  try {
    const { data } = await getSupabase()
      .from('blog_posts')
      .select('title')
      .in('status', ['published', 'pending_review']);
    return (data ?? []).map((r: { title: string }) => r.title);
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// KEYWORD POST
// Pull the highest-priority queued item from the backlog and write a post
// optimised to rank for that exact query.
// ---------------------------------------------------------------------------
export async function selectKeywordTopic(): Promise<{ query: string; notes: string | null; backlogId: string } | null> {
  try {
    const { data } = await getSupabase()
      .from('blog_topic_backlog')
      .select('id, query, notes')
      .eq('post_type', 'keyword')
      .eq('status', 'queued')
      .order('priority', { ascending: true })
      .order('created_at', { ascending: true })
      .limit(1)
      .single();
    if (!data) return null;
    // Mark as in_progress immediately so concurrent runs don't double-pick it
    await getSupabase()
      .from('blog_topic_backlog')
      .update({ status: 'in_progress', updated_at: new Date().toISOString() })
      .eq('id', data.id);
    return { query: data.query, notes: data.notes, backlogId: data.id };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// TIMELY POST
// Claude picks the single most trending + relevant item from the crawl.
// Returns both the post topic and a Twitter thread draft.
// ---------------------------------------------------------------------------
export interface TimelySelection {
  topic: string;
  targetQuery: string;
  sourceItems: number[];
  twitterThread: string; // ready-to-post thread for the timely post
}

export async function selectTimelyTopic(candidates: CrawledItem[]): Promise<TimelySelection | null> {
  const existingTitles = await getPublishedTitles();
  const alreadyCovered = existingTitles.length > 0
    ? existingTitles.map((t) => `- ${t}`).join('\n')
    : '(none yet)';

  const itemList = candidates
    .slice(0, 40)
    .map((c, i) => `${i}. [${c.source.toUpperCase()}] ${c.title}${c.summary ? ` — ${c.summary.slice(0, 150)}` : ''}`)
    .join('\n');

  const response = await anthropic.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 2048,
    messages: [{
      role: 'user',
      content: `You select the single most timely, trending blog post topic for Claru — a physical AI training data company. Audience: ML researchers and engineers at frontier labs.

Crawled items this week:
${itemList}

Already published or in-queue (do NOT overlap):
${alreadyCovered}

Pick the ONE item that is most likely to be actively discussed in the robotics/physical AI community THIS WEEK — a new paper, model release, or technique that teams are trying to understand right now.

Also draft a Twitter thread (5-7 tweets) that will drive traffic to the post when it publishes. The thread should:
- Tweet 1: hook — the surprising finding or number, not "we wrote a post"
- Tweets 2-5: key insights from the post (each tweet standalone)
- Final tweet: CTA linking to the post (use [POST_URL] as placeholder)

Return JSON only:
{
  "topic": "Specific post angle",
  "targetQuery": "exact Google search query",
  "sourceItems": [0, 3],
  "twitterThread": "Tweet 1 text\\n\\n---\\n\\nTweet 2 text\\n\\n---\\n\\n[POST_URL]"
}`,
    }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON object in response');
    return JSON.parse(jsonMatch[0]) as TimelySelection;
  } catch {
    console.error('[generate] selectTimelyTopic parse error:', text.slice(0, 200));
    return null;
  }
}

// ---------------------------------------------------------------------------
// CASE STUDY POST
// Pull the next queued case study and transform it into a blog post.
// ---------------------------------------------------------------------------
interface CaseStudyRow {
  id: string;
  company: string;
  industry: string | null;
  headline: string;
  challenge: string;
  solution: string;
  results: string;
  data_types: string[] | null;
  volume_annotations: number | null;
}

export async function selectCaseStudy(): Promise<CaseStudyRow | null> {
  try {
    const { data } = await getSupabase()
      .from('blog_case_studies')
      .select('id, company, industry, headline, challenge, solution, results, data_types, volume_annotations')
      .eq('status', 'queued')
      .order('created_at', { ascending: true })
      .limit(1)
      .single();
    return data ?? null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// VOICE SYSTEM PROMPT (shared by all post types)
// ---------------------------------------------------------------------------
export const VOICE_SYSTEM_PROMPT = `You are a technical writer for Claru, a physical AI training data company.
Readers: ML researchers and engineers at frontier labs. Assume PhD-level ML background.

VOICE RULES:
- Specific over vague. Quote actual paper results with numbers.
- NEVER write sentences where the meaning depends on "the paper" or "the study" as an antecedent. Every sentence citing a result must name the source inline: "The UT Austin team (arXiv:2604.00744) found..." not "The paper found...". This is required for AI-crawler citability.
- NEVER use: game-changing, revolutionary, unleash, harness, paradigm shift, comprehensive, cutting-edge, state-of-the-art, robust, seamless, powerful, innovative, exciting, transformative, clever, promising, notable, strikingly, rapidly (as vague intensifier), reasonable (as a filler qualifier), "suggests that" when making a claim — use actual numbers or say you don't know.
- Opinion is fine. Hype is not.
- End each body section with one sentence that states a direct opinion or practical implication — not a summary of what was just discussed.
- Break symmetric structure — not every section needs the same format.
- Cite at least 5 named entities (real datasets, models, companies, papers) with inline arXiv IDs hyperlinked in body_mdx where applicable.
- For each key quantitative claim, include at least one version as a completely standalone sentence — source named inline, no antecedent required. These are the sentences AI assistants will quote.
- Include exactly one Claru data point, placed inside a practical or how-to section — never as a standalone aside. Connect Claru's specific capability to the post's exact topic.
- Name at least one real lab or company known to use the approach in production. If no public example exists, say so explicitly.
- End with a specific actionable observation — not "watch this space".
- Internal links: when a concept is covered by another Claru page, link to it naturally inline. Available: /glossary, /training-data-for-robotics, /physical-ai-training-data, /egocentric-video-datasets, /embodied-ai-datasets, /blog/vlm-vs-vla, /blog/sim-to-real-gap, /blog/vla-training-data-volume, /blog/physical-ai-stack, /blog/data-enrichment-pipeline-physical-ai, /blog/best-egocentric-data-providers.
- arXiv IDs in body text must be hyperlinked: [arXiv:2604.00744](https://arxiv.org/abs/2604.00744)

POST FORMAT (required, in this order):
1. H1 matching the target query (include year: 2026). MAX 10 WORDS — write it as a search query, not a paper title.
2. TL;DR box: use blockquote markdown (> prefix). Start with "> **TL;DR**" then 3-4 bullet lines as "> - sentence". Each bullet is a COMPLETE standalone sentence with inline source attribution.
3. "In This Post" table of contents with anchor links (use #section-slug format)
4. Body sections: min 1,200 words, max 2,800 words total. Section IDs must match ToC anchors.
5. At least one data table using markdown pipe syntax: | Col | Col |\\n|---|---|\\n| val | val |
6. Key Takeaways: 5-7 bullets, each a standalone citable sentence with source named inline
7. FAQ: 3-5 questions as LITERAL Google search queries (### heading per question). Each answer must be a complete paragraph that can stand alone as an AI assistant snippet.
8. Related Resources: link to one GEO page, one compare page, one glossary term — all from the internal links list above.

OUTPUT FORMAT — return valid JSON only, no other text:
{
  "title": "...",
  "slug": "kebab-case-slug-no-year-suffix",
  "excerpt": "Must start with a number or a named entity (not a gerund). One sentence. No AI slop words.",
  "tags": ["tag1", "tag2", "tag3"],
  "source_urls": ["url1", "url2"],
  "mentions": [
    {"name": "Allegro Hand", "url": "https://www.wonikrobotics.com/robot-hand"}
  ],
  "body_mdx": "Full markdown content starting directly after the H1 (do NOT repeat the H1 — the template renders it). Start with the TL;DR blockquote."
}`;

// ---------------------------------------------------------------------------
// generateDraft — keyword or timely post (topic-driven)
// ---------------------------------------------------------------------------
export async function generateDraft(
  topic: TopicSelection | { topic: string; targetQuery: string; sourceItems: number[] },
  sourceItems: CrawledItem[]
): Promise<BlogDraft | null> {
  const sources = sourceItems.length > 0
    ? sourceItems.map(s => `- ${s.title} (${s.url})`).join('\n')
    : '(no specific source items — use your knowledge of recent developments)';

  const response = await anthropic.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 8192,
    system: VOICE_SYSTEM_PROMPT,
    messages: [{
      role: 'user',
      content: `Write a blog post for:

Topic: ${topic.topic}
Target query: "${topic.targetQuery}"

Source material:
${sources}

Return the complete post as JSON per the system prompt format.`,
    }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON object in response');
    return JSON.parse(jsonMatch[0]) as BlogDraft;
  } catch {
    console.error('[generate] generateDraft parse error for topic:', topic.topic);
    console.error('[generate] Response snippet:', text.slice(0, 300));
    return null;
  }
}

// ---------------------------------------------------------------------------
// generateKeywordDraft — pulls query from backlog, writes SEO-optimised post
// ---------------------------------------------------------------------------
export async function generateKeywordDraft(): Promise<(BlogDraft & { backlogId: string }) | null> {
  const item = await selectKeywordTopic();
  if (!item) {
    console.log('[generate] No queued keyword topics in backlog');
    return null;
  }

  const contextNote = item.notes ? `\n\nAngle/context: ${item.notes}` : '';
  const response = await anthropic.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 8192,
    system: VOICE_SYSTEM_PROMPT,
    messages: [{
      role: 'user',
      content: `Write a blog post targeting this exact search query:

Target query: "${item.query}"${contextNote}

This is an evergreen SEO post. Prioritise ranking for the exact query above all else. The title must match the query as closely as possible while staying under 10 words with the year.

Source material: Use your knowledge of the field — there are no specific crawled items for this query.

Return the complete post as JSON per the system prompt format.`,
    }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON object in response');
    const draft = JSON.parse(jsonMatch[0]) as BlogDraft;
    return { ...draft, backlogId: item.backlogId };
  } catch {
    console.error('[generate] generateKeywordDraft parse error for query:', item.query);
    return null;
  }
}

// ---------------------------------------------------------------------------
// generateCaseStudyPost — transforms a case study row into a blog post
// ---------------------------------------------------------------------------
export async function generateCaseStudyPost(): Promise<BlogDraft | null> {
  const cs = await selectCaseStudy();
  if (!cs) {
    console.log('[generate] No queued case studies');
    return null;
  }

  const response = await anthropic.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 8192,
    system: VOICE_SYSTEM_PROMPT,
    messages: [{
      role: 'user',
      content: `Transform this customer case study into a publishable blog post for Claru.

Company: ${cs.company}${cs.industry ? ` (${cs.industry})` : ''}
Headline result: ${cs.headline}
Challenge: ${cs.challenge}
Solution: ${cs.solution}
Results: ${cs.results}${cs.data_types?.length ? `\nData types: ${cs.data_types.join(', ')}` : ''}${cs.volume_annotations ? `\nAnnotations delivered: ${cs.volume_annotations.toLocaleString()}` : ''}

Write this as a case study blog post. The target query should be something like "how [company type] [achieved result] with [data type]". Do NOT name the company in the title or slug — use their industry/use-case instead (e.g. "autonomous vehicle lab", "humanoid robotics startup"). Keep the company anonymous unless they are a public reference.

Structure: lead with the result (not "Company X faced a challenge"), walk through the technical approach, ground every claim in the specific data provided above.

Return the complete post as JSON per the system prompt format.`,
    }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON object in response');
    // Mark case study as in_progress
    await getSupabase()
      .from('blog_case_studies')
      .update({ status: 'in_progress' } as Record<string, string>)
      .eq('id', cs.id);
    return JSON.parse(jsonMatch[0]) as BlogDraft;
  } catch {
    console.error('[generate] generateCaseStudyPost parse error for:', cs.company);
    return null;
  }
}

// ---------------------------------------------------------------------------
// selectTopics — kept for backward compat with the Trigger.dev timely flow
// ---------------------------------------------------------------------------
export async function selectTopics(candidates: CrawledItem[]): Promise<TopicSelection[]> {
  const timely = await selectTimelyTopic(candidates);
  return timely ? [timely] : [];
}
