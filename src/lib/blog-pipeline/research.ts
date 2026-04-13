import Anthropic from '@anthropic-ai/sdk';
import { crawlHackerNews } from './crawlers';
import type { AnalystResult, ResearchFindings, ResearchBrief } from './types';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MAX_ITEMS = 10;

// ---------------------------------------------------------------------------
// Agent 1: arXiv researcher
// ---------------------------------------------------------------------------
async function runArxivAgent(query: string): Promise<ResearchFindings> {
  try {
    const searchUrl = `https://export.arxiv.org/api/query?search_query=${encodeURIComponent(query)}&sortBy=relevance&sortOrder=descending&max_results=8`;
    const res = await fetch(searchUrl);
    if (!res.ok) throw new Error(`arXiv status ${res.status}`);
    const xml = await res.text();

    // Extract entry titles and abstracts
    const entries: string[] = [];
    const entryRe = /<entry[\s>][\s\S]*?<\/entry>/g;
    let m;
    while ((m = entryRe.exec(xml)) !== null) {
      entries.push(m[0]);
    }

    if (entries.length === 0) {
      return { sources: [], keyInsights: ['No relevant arXiv papers found'] };
    }

    const paperSummaries = entries.slice(0, MAX_ITEMS).map(entry => {
      const title = entry.match(/<title>([^<]+)<\/title>/)?.[1]?.trim() ?? '';
      const idMatch = entry.match(/<id>([^<]+)<\/id>/);
      const url = idMatch?.[1]?.trim() ?? '';
      const abstractMatch = entry.match(/<summary[^>]*>([\s\S]*?)<\/summary>/);
      const abstract = abstractMatch?.[1]?.replace(/\s+/g, ' ').trim().slice(0, 250) ?? '';
      return `${title} — ${url}\n${abstract}`;
    }).join('\n\n');

    // Ask Claude to extract key insights
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 512,
      messages: [{
        role: 'user',
        content: `Extract 3-5 key quantitative findings from these arXiv papers relevant to: "${query}"

Papers:
${paperSummaries}

Return JSON only: {"sources": ["arXiv URL1", "URL2"], "keyInsights": ["Specific finding with number from Paper Title (arXiv:XXXX.XXXXX)", "..."]}

If no specific findings relevant to the query, return: {"sources": [], "keyInsights": ["No relevant arXiv papers found"]}`,
      }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    const parsed = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] ?? '{}') as ResearchFindings;
    return {
      sources: (parsed.sources ?? []).slice(0, MAX_ITEMS),
      keyInsights: (parsed.keyInsights ?? ['No relevant arXiv papers found']).slice(0, MAX_ITEMS),
    };
  } catch (err) {
    console.error('[research:arxiv] error:', err);
    return { sources: [], keyInsights: ['No relevant arXiv papers found'] };
  }
}

// ---------------------------------------------------------------------------
// Agent 2: Hacker News researcher
// ---------------------------------------------------------------------------
async function runHNAgent(query: string): Promise<ResearchFindings> {
  try {
    const items = await crawlHackerNews();
    const relevant = items
      .filter(i => {
        const text = `${i.title} ${i.summary ?? ''}`.toLowerCase();
        return query.toLowerCase().split(' ').some(word => word.length > 3 && text.includes(word));
      })
      .slice(0, MAX_ITEMS);

    if (relevant.length === 0) {
      return { sources: [], keyInsights: ['No relevant HN discussions found this week'] };
    }

    return {
      sources: relevant.map(i => i.url),
      keyInsights: relevant.map(i => `HN discussion (${i.score} pts): ${i.title}`),
    };
  } catch (err) {
    console.error('[research:hn] error:', err);
    return { sources: [], keyInsights: ['No relevant HN discussions found this week'] };
  }
}

// ---------------------------------------------------------------------------
// Agent 3: Web researcher (search result summary via Claude)
// ---------------------------------------------------------------------------
async function runWebAgent(query: string, briefing: string): Promise<ResearchFindings> {
  try {
    // Fetch DuckDuckGo HTML search results (no auth required)
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query + ' site:arxiv.org OR site:openreview.net OR site:huggingface.co OR research')}`;
    const res = await fetch(searchUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ClaruResearch/1.0)' },
    });
    const html = await res.ok ? await res.text() : '';

    // Extract result snippets
    const snippets: string[] = [];
    const re = /class="result__snippet"[^>]*>([^<]{50,300})</g;
    let m;
    while ((m = re.exec(html)) !== null && snippets.length < 8) {
      snippets.push(m[1].trim());
    }

    if (snippets.length === 0) {
      return { sources: [], keyInsights: ['No web research findings'] };
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 512,
      messages: [{
        role: 'user',
        content: `You are a research assistant. Extract practical insights for a blog post about: "${query}"

Research briefing: ${briefing}

Web snippets found:
${snippets.join('\n---\n')}

Return JSON only: {"sources": [], "keyInsights": ["Insight 1 — specific and practical for ML engineers", "..."]}`,
      }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    try {
      const parsed = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] ?? '{}') as ResearchFindings;
      return {
        sources: (parsed.sources ?? []).slice(0, MAX_ITEMS),
        keyInsights: (parsed.keyInsights ?? []).slice(0, MAX_ITEMS),
      };
    } catch {
      return { sources: [], keyInsights: ['No web research findings'] };
    }
  } catch (err) {
    console.error('[research:web] error:', err);
    return { sources: [], keyInsights: ['No web research findings'] };
  }
}

// ---------------------------------------------------------------------------
// Agent 4: SERP analyst (keyword only — DataForSEO PAA)
// ---------------------------------------------------------------------------
async function runSerpAgent(
  query: string,
  postType: string,
  serpFAQs?: string[]
): Promise<ResearchFindings> {
  if (postType !== 'keyword') {
    return { sources: [], keyInsights: [] };
  }

  const faqs = serpFAQs ?? [];
  if (faqs.length === 0) {
    return { sources: [], keyInsights: [] };
  }

  return {
    sources: [],
    keyInsights: faqs.map(q => `SERP FAQ (People Also Ask): ${q}`).slice(0, MAX_ITEMS),
  };
}

// ---------------------------------------------------------------------------
// Synthesizer — merges all findings into ResearchBrief
// ---------------------------------------------------------------------------
async function synthesize(
  analystResult: AnalystResult,
  findings: (ResearchFindings | null)[]
): Promise<ResearchBrief> {
  const valid = findings.filter(Boolean) as ResearchFindings[];
  const allSources = valid.flatMap(f => f.sources).slice(0, 20);
  const allInsights = valid.flatMap(f => f.keyInsights).filter(i => i && !i.startsWith('No ')).slice(0, 20);

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `You are a research synthesis specialist. Create a research brief for a blog post about: "${analystResult.query}"

Post angle: ${analystResult.angle}
Post type: ${analystResult.postType}

Research findings:
${allInsights.map(i => `- ${i}`).join('\n') || '(limited research available)'}

Research briefing: ${analystResult.researchBriefing}

Return JSON only:
{
  "topInsights": ["Top 5-8 most important findings for the writer, specific with numbers"],
  "keyNumbers": ["Stats and numbers that support the angle, e.g. '40% rejection rate in MIT TR study'"],
  "citableSources": ["Full citation: Title — URL (for inline citation in the post)"],
  "faqQuestions": ["Exact Google search queries users ask about this topic"],
  "recommendedAngle": ["1-2 sentences: the exact angle and why it beats competitors"],
  "internalLinks": ["/glossary", "/training-data-for-robotics"]
}

Cap each array at 8 items. Be specific — the writer uses this brief to write without doing their own research.`,
    }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  try {
    const parsed = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] ?? '{}') as ResearchBrief;
    return {
      topInsights: (parsed.topInsights ?? []).slice(0, 8),
      keyNumbers: (parsed.keyNumbers ?? []).slice(0, 8),
      citableSources: [...(parsed.citableSources ?? []), ...allSources.slice(0, 5)].slice(0, 8),
      faqQuestions: (parsed.faqQuestions ?? []).slice(0, 8),
      recommendedAngle: (parsed.recommendedAngle ?? [analystResult.angle]).slice(0, 2),
      internalLinks: (parsed.internalLinks ?? []).slice(0, 6),
    };
  } catch {
    // Fallback minimal brief
    return {
      topInsights: allInsights.slice(0, 5),
      keyNumbers: [],
      citableSources: allSources.slice(0, 5),
      faqQuestions: analystResult.serpFAQs?.slice(0, 5) ?? [],
      recommendedAngle: [analystResult.angle],
      internalLinks: ['/glossary', '/training-data-for-robotics'],
    };
  }
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------
export async function runResearchTeam(analystResult: AnalystResult): Promise<ResearchBrief> {
  const [arxivResult, hnResult, webResult, serpResult] = await Promise.allSettled([
    runArxivAgent(analystResult.query),
    runHNAgent(analystResult.query),
    runWebAgent(analystResult.query, analystResult.researchBriefing),
    runSerpAgent(analystResult.query, analystResult.postType, analystResult.serpFAQs),
  ]);

  const findings = [arxivResult, hnResult, webResult, serpResult].map(r =>
    r.status === 'fulfilled' ? r.value : null
  );

  if (findings.every(f => f === null)) {
    console.warn('[research] All agents failed — returning minimal brief');
  }

  return synthesize(analystResult, findings);
}
