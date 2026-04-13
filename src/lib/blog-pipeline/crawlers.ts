import crypto from 'crypto';
import type { CrawledItem } from './types';

function hash(url: string): string {
  return crypto.createHash('sha256').update(url).digest('hex').slice(0, 32);
}

function extractXmlTag(xml: string, tag: string): string {
  const patterns = [
    new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`),
    new RegExp(`<${tag}[^>]*>([^<]*)<\\/${tag}>`),
  ];
  for (const p of patterns) {
    const m = xml.match(p);
    if (m?.[1]?.trim()) return m[1].trim();
  }
  return '';
}

function splitXmlItems(xml: string, tag: 'item' | 'entry'): string[] {
  const items: string[] = [];
  const re = new RegExp(`<${tag}[\\s>][\\s\\S]*?<\\/${tag}>`, 'g');
  let m;
  while ((m = re.exec(xml)) !== null) {
    items.push(m[0]);
  }
  return items;
}

const PHYSICAL_AI_KEYWORDS = [
  'vla', 'embodied', 'robot', 'physical ai', 'world model',
  'egocentric', 'teleoperation', 'manipulation', 'locomotion', 'humanoid',
  'sim-to-real', 'policy learning', 'diffusion policy', 'action chunking',
  'imitation learning', 'reinforcement learning from', 'vlm', 'vision-language',
];

function isRelevant(title: string, summary?: string): boolean {
  const text = `${title} ${summary ?? ''}`.toLowerCase();
  return PHYSICAL_AI_KEYWORDS.some(kw => text.includes(kw));
}

// ---------------------------------------------------------------------------
// arXiv
// ---------------------------------------------------------------------------
export async function crawlArxiv(): Promise<CrawledItem[]> {
  const query = encodeURIComponent(
    '(cat:cs.RO OR cat:cs.CV OR cat:cs.AI OR cat:cs.LG) AND (ti:VLA OR ti:embodied OR ti:robot OR ti:"physical AI" OR ti:"world model" OR ti:manipulation OR ti:locomotion OR ti:teleoperation)'
  );
  const url = `https://export.arxiv.org/api/query?search_query=${query}&sortBy=submittedDate&sortOrder=descending&max_results=30`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`arXiv fetch failed: ${res.status}`);
  const xml = await res.text();

  const entries = splitXmlItems(xml, 'entry');
  const now = Date.now();
  const items: CrawledItem[] = [];

  for (const entry of entries) {
    const idMatch = entry.match(/<id>([^<]+)<\/id>/);
    const entryUrl = idMatch?.[1]?.trim() ?? '';
    if (!entryUrl) continue;

    const title = extractXmlTag(entry, 'title').replace(/\s+/g, ' ');
    const summary = extractXmlTag(entry, 'summary').replace(/\s+/g, ' ').slice(0, 300);
    const published = extractXmlTag(entry, 'published');

    if (!isRelevant(title, summary)) continue;

    const ageDays = (now - new Date(published).getTime()) / (1000 * 60 * 60 * 24);
    const score = Math.max(20, Math.round(80 - ageDays * 5));

    items.push({ url: entryUrl, urlHash: hash(entryUrl), title, summary, source: 'arxiv', score, publishedAt: published });
  }

  return items;
}

// ---------------------------------------------------------------------------
// Hacker News (Algolia API)
// ---------------------------------------------------------------------------
export async function crawlHackerNews(): Promise<CrawledItem[]> {
  const queries = ['embodied AI', 'VLA model', 'physical AI robot', 'robot learning'];
  const weekAgo = Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60;
  const items: CrawledItem[] = [];
  const seen = new Set<string>();

  for (const query of queries) {
    const url = `https://hn.algolia.com/api/v1/search_by_date?query=${encodeURIComponent(query)}&tags=story&numericFilters=points>30,created_at_i>${weekAgo}&hitsPerPage=10`;
    const res = await fetch(url);
    if (!res.ok) continue;

    const data = await res.json() as {
      hits: Array<{ objectID: string; title?: string; url?: string; points?: number; created_at: string }>;
    };

    for (const hit of data.hits) {
      if (!hit.url || seen.has(hit.url)) continue;
      seen.add(hit.url);
      items.push({
        url: hit.url,
        urlHash: hash(hit.url),
        title: hit.title ?? '',
        source: 'hn',
        score: hit.points ?? 30,
        publishedAt: hit.created_at,
      });
    }

    await new Promise(r => setTimeout(r, 200));
  }

  return items;
}

// ---------------------------------------------------------------------------
// Reddit (public RSS — no auth required)
// ---------------------------------------------------------------------------
const REDDIT_SUBREDDITS = ['MachineLearning', 'robotics', 'artificial'];

export async function crawlRedditRss(): Promise<CrawledItem[]> {
  const items: CrawledItem[] = [];

  for (const sub of REDDIT_SUBREDDITS) {
    const url = `https://www.reddit.com/r/${sub}/top.rss?t=week&limit=15`;
    const res = await fetch(url, { headers: { 'User-Agent': 'ClaruBlogPipeline/1.0 (blog@claru.ai)' } });
    if (!res.ok) continue;

    const xml = await res.text();
    const entries = splitXmlItems(xml, 'entry');

    for (const entry of entries) {
      const linkMatch = entry.match(/<link[^>]+href="([^"]+)"/);
      const postUrl = linkMatch?.[1] ?? '';
      if (!postUrl || !postUrl.includes('/comments/')) continue;

      const title = extractXmlTag(entry, 'title').replace(/\s+/g, ' ');
      const published = extractXmlTag(entry, 'published') || extractXmlTag(entry, 'updated');

      if (!isRelevant(title)) continue;

      items.push({ url: postUrl, urlHash: hash(postUrl), title, source: 'reddit', score: 50, publishedAt: published });
    }

    await new Promise(r => setTimeout(r, 500));
  }

  return items;
}

// ---------------------------------------------------------------------------
// AI Lab RSS feeds
// ---------------------------------------------------------------------------
const RSS_FEEDS = [
  'https://huggingface.co/blog/feed.xml',
  'https://blog.google/technology/ai/rss/',
  'https://thegradient.pub/rss/',
  'https://bair.berkeley.edu/blog/feed.xml',
  'https://www.deepmind.com/blog/rss.xml',
];

export async function crawlRssFeeds(): Promise<CrawledItem[]> {
  const items: CrawledItem[] = [];
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  for (const feedUrl of RSS_FEEDS) {
    try {
      const res = await fetch(feedUrl, { headers: { 'User-Agent': 'ClaruBlogPipeline/1.0 (blog@claru.ai)' } });
      if (!res.ok) continue;

      const xml = await res.text();
      const rssItems = splitXmlItems(xml, 'item');
      const atomItems = splitXmlItems(xml, 'entry');

      for (const item of [...rssItems, ...atomItems]) {
        const title = extractXmlTag(item, 'title').replace(/\s+/g, ' ');
        const linkFromAttr = item.match(/<link[^>]+href="([^"]+)"/)?.[1] ?? '';
        const linkFromTag = extractXmlTag(item, 'link');
        const postUrl = linkFromAttr || linkFromTag;
        const pubDate = extractXmlTag(item, 'pubDate') || extractXmlTag(item, 'published');

        if (!postUrl) continue;
        if (pubDate && new Date(pubDate).getTime() < weekAgo) continue;
        if (!isRelevant(title)) continue;

        items.push({ url: postUrl, urlHash: hash(postUrl), title, source: 'rss', score: 40, publishedAt: pubDate });
      }
    } catch {
      // Graceful degradation — one bad feed doesn't kill the run
    }
  }

  return items;
}
