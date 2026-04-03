import { createClient } from '@supabase/supabase-js';
import type { CrawledItem } from './types';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function deduplicateAndStore(items: CrawledItem[]): Promise<CrawledItem[]> {
  if (items.length === 0) return [];

  const supabase = getSupabase();
  const hashes = items.map(i => i.urlHash);

  const { data: existing } = await supabase
    .from('crawled_items')
    .select('url_hash')
    .in('url_hash', hashes);

  const seenHashes = new Set((existing ?? []).map((r: { url_hash: string }) => r.url_hash));
  const newItems = items.filter(i => !seenHashes.has(i.urlHash));

  if (newItems.length === 0) return [];

  await supabase.from('crawled_items').insert(
    newItems.map(i => ({
      url_hash: i.urlHash,
      url: i.url,
      title: i.title,
      source: i.source,
      score: i.score,
    }))
  );

  return newItems;
}
