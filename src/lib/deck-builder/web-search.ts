// =============================================================================
// Web Search — Tavily API integration for real-time web research
// =============================================================================

interface SearchResult {
  title: string;
  url: string;
  content: string;
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
  error?: string;
}

export async function webSearch(query: string, maxResults = 5): Promise<SearchResponse> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    return { query, results: [], error: 'TAVILY_API_KEY not configured. Using training knowledge instead.' };
  }

  try {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        max_results: maxResults,
        include_answer: false,
        include_raw_content: false,
        search_depth: 'basic',
      }),
    });

    if (!res.ok) throw new Error(`Tavily API returned ${res.status}`);

    const data = await res.json();
    return {
      query,
      results: (data.results ?? []).map((r: Record<string, unknown>) => ({
        title: r.title as string,
        url: r.url as string,
        content: ((r.content as string) ?? '').slice(0, 500),
      })),
    };
  } catch (err) {
    return {
      query,
      results: [],
      error: `Search failed: ${err instanceof Error ? err.message : 'unknown error'}`,
    };
  }
}
