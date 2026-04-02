import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import type { AnalystResult, CrawledItem } from './types';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ---------------------------------------------------------------------------
// DataForSEO helper — SERP top-5 + PAA questions for a keyword
// ---------------------------------------------------------------------------
interface SerpResult {
  competitorUrls: string[];
  competitorTitles: string[];
  paaQuestions: string[];
}

async function fetchSerp(query: string): Promise<SerpResult> {
  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;
  if (!login || !password) {
    console.warn('[analyst] DataForSEO credentials not set — skipping SERP');
    return { competitorUrls: [], competitorTitles: [], paaQuestions: [] };
  }

  const auth = Buffer.from(`${login}:${password}`).toString('base64');
  try {
    const res = await fetch('https://api.dataforseo.com/v3/serp/google/organic/live/advanced', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{
        keyword: query,
        language_code: 'en',
        location_code: 2840, // United States
        depth: 10,
      }]),
    });

    const json = await res.json() as {
      tasks?: Array<{
        result?: Array<{
          items?: Array<{
            type: string;
            title?: string;
            url?: string;
            questions?: string[];
          }>;
        }>;
      }>;
    };

    const items = json.tasks?.[0]?.result?.[0]?.items ?? [];
    const organic = items.filter(i => i.type === 'organic');
    const paa = items.filter(i => i.type === 'people_also_ask');

    return {
      competitorUrls: organic.slice(0, 5).map(i => i.url ?? '').filter(Boolean),
      competitorTitles: organic.slice(0, 5).map(i => i.title ?? '').filter(Boolean),
      paaQuestions: paa.flatMap(i => i.questions ?? []).slice(0, 6),
    };
  } catch (err) {
    console.error('[analyst] DataForSEO fetch error:', err);
    return { competitorUrls: [], competitorTitles: [], paaQuestions: [] };
  }
}

// ---------------------------------------------------------------------------
// Keyword path
// ---------------------------------------------------------------------------
async function runKeywordAnalyst(): Promise<AnalystResult | null> {
  const supabase = getSupabase();

  const { data } = await supabase
    .from('blog_topic_backlog')
    .select('id, query, notes')
    .eq('post_type', 'keyword')
    .eq('status', 'queued')
    .order('priority', { ascending: true })
    .order('created_at', { ascending: true })
    .limit(1)
    .single();

  if (!data) return null;

  // Mark as in_progress immediately to prevent double-pick
  await supabase
    .from('blog_topic_backlog')
    .update({ status: 'in_progress', updated_at: new Date().toISOString() })
    .eq('id', data.id);

  const serp = await fetchSerp(data.query);

  // Identify content gap via Claude
  const gapResponse = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    messages: [{
      role: 'user',
      content: `You are an SEO content strategist for Claru (physical AI training data company).

Target keyword: "${data.query}"
Top competitor titles:
${serp.competitorTitles.map(t => `- ${t}`).join('\n') || '(no SERP data)'}
Notes: ${data.notes ?? 'none'}

Identify in 1-2 sentences: what angle or data would make Claru's post more useful than these results? Focus on practical specificity for ML engineers at frontier labs.

Return JSON only: {"angle": "...", "researchBriefing": "What researchers need to find and verify to write this post well"}`,
    }],
  });

  const gapText = gapResponse.content[0].type === 'text' ? gapResponse.content[0].text : '';
  let angle = `Definitive guide to ${data.query}`;
  let researchBriefing = `Research recent developments, key papers, and practical guidance for: ${data.query}`;
  try {
    const m = gapText.match(/\{[\s\S]*\}/);
    if (m) {
      const parsed = JSON.parse(m[0]) as { angle: string; researchBriefing: string };
      angle = parsed.angle ?? angle;
      researchBriefing = parsed.researchBriefing ?? researchBriefing;
    }
  } catch {
    // use defaults
  }

  return {
    query: data.query,
    angle,
    postType: 'keyword',
    competitorGaps: serp.competitorTitles,
    serpFAQs: serp.paaQuestions,
    researchBriefing,
    backlogId: data.id,
  };
}

// ---------------------------------------------------------------------------
// Timely path
// ---------------------------------------------------------------------------
async function runTimelyAnalyst(crawledItems: CrawledItem[]): Promise<AnalystResult | null> {
  if (crawledItems.length === 0) return null;

  const itemList = crawledItems
    .slice(0, 40)
    .map((c, i) => `${i}. [${c.source.toUpperCase()}] ${c.title}${c.summary ? ` — ${c.summary.slice(0, 150)}` : ''} (${c.publishedAt})`)
    .join('\n');

  const response = await anthropic.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `You are a content strategist for Claru, a physical AI training data company.

Crawled items this week:
${itemList}

Pick the ONE item most actively discussed in robotics/physical AI communities this week. Score each by: (recency * 0.4) + (physical AI relevance * 0.6).

Return JSON only:
{
  "selectedIndex": 0,
  "angle": "Specific post angle for ML engineers at frontier labs",
  "targetQuery": "exact Google search query",
  "twitterHook": "Tweet 1 hook — the surprising finding or number, not 'we wrote a post'",
  "researchBriefing": "What researchers need to find and verify to write this post well"
}`,
    }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  try {
    const m = text.match(/\{[\s\S]*\}/);
    if (!m) return null;
    const parsed = JSON.parse(m[0]) as {
      selectedIndex: number;
      angle: string;
      targetQuery: string;
      twitterHook: string;
      researchBriefing: string;
    };

    const selected = crawledItems[parsed.selectedIndex] ?? crawledItems[0];
    return {
      query: parsed.targetQuery,
      angle: parsed.angle,
      postType: 'timely',
      twitterHook: parsed.twitterHook,
      researchBriefing: parsed.researchBriefing,
    };
  } catch {
    console.error('[analyst] timely parse error:', text.slice(0, 200));
    return null;
  }
}

// ---------------------------------------------------------------------------
// Case study path
// ---------------------------------------------------------------------------
async function runCaseStudyAnalyst(): Promise<AnalystResult | null> {
  const supabase = getSupabase();

  const { data } = await supabase
    .from('blog_case_studies')
    .select('id, company, industry, headline, challenge, solution, results, data_types')
    .eq('status', 'queued')
    .order('created_at', { ascending: true })
    .limit(1)
    .single();

  if (!data) return null;

  const cs = data as {
    id: string;
    company: string;
    industry: string | null;
    headline: string;
    challenge: string;
    solution: string;
    results: string;
    data_types: string[] | null;
  };

  const angle = `Case study: how ${cs.industry ?? cs.company} ${cs.headline.toLowerCase()}`;
  const researchBriefing = `Research similar case studies, technical approaches, and industry context for: ${cs.challenge}. Key result to highlight: ${cs.results}`;

  return {
    query: `how ${cs.industry ?? 'AI lab'} ${cs.headline.toLowerCase().slice(0, 50)}`,
    angle,
    postType: 'case_study',
    researchBriefing,
    backlogId: cs.id,
  };
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------
export async function runAnalyst(
  postType: 'keyword' | 'timely' | 'case_study',
  context?: { crawledItems?: CrawledItem[] }
): Promise<AnalystResult | null> {
  try {
    switch (postType) {
      case 'keyword':
        return await runKeywordAnalyst();
      case 'timely':
        return await runTimelyAnalyst(context?.crawledItems ?? []);
      case 'case_study':
        return await runCaseStudyAnalyst();
      default:
        return null;
    }
  } catch (err) {
    console.error(`[analyst] Unexpected error for postType=${postType}:`, err);
    return null;
  }
}
