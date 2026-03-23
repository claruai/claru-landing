"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search, Loader2, Copy, Check, ExternalLink, X,
  ChevronDown, ChevronLeft, ChevronRight, Link2, FolderPlus, UserPlus,
  Cpu, FileText, Sparkles,
} from "lucide-react";
import AddToLeadButton from "./AddToLeadButton";
import type { ClipSearchResult } from "@/types/data-catalog";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Dataset {
  id: string;
  name: string;
}

interface AssignedLead {
  lead_id: string;
  lead_name: string;
  lead_company: string;
}

/** ClipSearchResult + assigned_leads from the API response */
interface EnrichedClipResult extends ClipSearchResult {
  assigned_leads?: AssignedLead[];
}

type ResolutionFilter = "all" | "720p" | "1080p" | "4k";

// ---------------------------------------------------------------------------
// Example queries (clickable to auto-execute)
// ---------------------------------------------------------------------------

const EXAMPLE_QUERIES = [
  "person cooking in a kitchen",
  "outdoor traffic intersection with vehicles",
  "egocentric hand manipulation",
  "aerial view of city buildings",
  "robot arm grasping objects",
];

const SEARCH_PAGE_SIZE = 24;
const SEARCH_MAX_RESULTS = 100;
const BROWSE_PAGE_SIZE = 48;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getResolutionLabel(w: number | null, h: number | null): string | null {
  if (!w || !h) return null;
  const maxDim = Math.max(w, h);
  if (maxDim >= 3840) return "4K";
  if (maxDim >= 1920) return "1080p";
  if (maxDim >= 1280) return "720p";
  if (maxDim >= 640) return "480p";
  return `${w}x${h}`;
}

function passesResolutionFilter(r: EnrichedClipResult, filter: ResolutionFilter): boolean {
  if (filter === "all") return true;
  const maxDim = Math.max(r.tech_resolution_width ?? 0, r.tech_resolution_height ?? 0);
  if (filter === "720p") return maxDim >= 1280;
  if (filter === "1080p") return maxDim >= 1920;
  if (filter === "4k") return maxDim >= 3840;
  return true;
}

function passesAiFilter(r: EnrichedClipResult, hasAi: boolean): boolean {
  if (!hasAi) return true;
  return !!(r.ai_caption || r.caption_text);
}

function formatDuration(seconds: number | null): string | null {
  if (seconds == null) return null;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function extractMetaTags(ann: Record<string, unknown> | null): { categories: string[]; activities: string[] } {
  if (!ann) return { categories: [], activities: [] };
  const categories: string[] = [];
  const activities: string[] = [];
  if (typeof ann.category === "string") categories.push(ann.category);
  if (typeof ann.subcategory === "string") categories.push(ann.subcategory);
  if (Array.isArray(ann.categories)) categories.push(...ann.categories.filter((c): c is string => typeof c === "string"));
  if (typeof ann.activity === "string") activities.push(ann.activity);
  if (Array.isArray(ann.activities)) activities.push(...ann.activities.filter((a): a is string => typeof a === "string"));
  if (Array.isArray(ann.environments)) activities.push(...ann.environments.filter((e): e is string => typeof e === "string"));
  return { categories, activities };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CatalogSearchClient({
  datasets,
  buckets,
  clipCount,
}: {
  datasets: Dataset[];
  buckets: string[];
  clipCount: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [datasetFilter, setDatasetFilter] = useState(searchParams.get("dataset") ?? "");
  const [bucketFilter, setBucketFilter] = useState(searchParams.get("bucket") ?? "");
  const [subcategoryFilter, setSubcategoryFilter] = useState(searchParams.get("subcategory") ?? "");
  const [subcategories, setSubcategories] = useState<Array<{ name: string; count: number }>>([]);
  const [resolutionFilter, setResolutionFilter] = useState<ResolutionFilter>("all");
  const [hasAiFilter, setHasAiFilter] = useState(false);
  const [results, setResults] = useState<EnrichedClipResult[] | null>(null);
  const [detailResult, setDetailResult] = useState<EnrichedClipResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    if (!datasetFilter) { setSubcategories([]); setSubcategoryFilter(""); return; }
    fetch(`/api/admin/catalog/${datasetFilter}/subcategories`)
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d?.categories) setSubcategories(d.categories); else setSubcategories([]); })
      .catch(() => setSubcategories([]));
  }, [datasetFilter]);

  const toggleSelected = useCallback((id: string) => {
    setSelected((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  }, []);

  const updateUrl = useCallback((q: string, ds: string, bk: string) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (ds) params.set("dataset", ds);
    if (bk) params.set("bucket", bk);
    const qs = params.toString();
    router.replace(`/admin/catalog/search${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [router]);

  const isBrowseMode = useCallback((q: string) => !q.trim() && (!!datasetFilter || !!bucketFilter), [datasetFilter, bucketFilter]);

  const runSearch = useCallback(async (searchQuery: string, opts?: { append?: boolean; searchOffset?: number; overrideLimit?: number }) => {
    if (!searchQuery.trim() && !datasetFilter && !bucketFilter) return;
    const browsing = !searchQuery.trim();
    const pageSize = opts?.overrideLimit ?? (browsing ? BROWSE_PAGE_SIZE : SEARCH_PAGE_SIZE);
    const requestOffset = opts?.searchOffset ?? 0;

    if (opts?.append) { setLoadingMore(true); }
    else { setLoading(true); setError(null); setResults(null); setSelected(new Set()); setOffset(requestOffset); setTotalCount(null); setHasMore(false); }

    try {
      const res = await fetch("/api/admin/catalog/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery, dataset_id: datasetFilter || undefined, s3_bucket: bucketFilter || undefined, subcategory: subcategoryFilter || undefined, limit: pageSize, offset: requestOffset }),
      });
      if (!res.ok) { const data = await res.json(); throw new Error(data.error || `Search failed (${res.status})`); }

      const data = await res.json();
      const newResults: EnrichedClipResult[] = data.results ?? [];

      if (browsing) {
        setResults(newResults);
        setOffset(requestOffset);
        if (data.total_count !== undefined && data.total_count !== null) setTotalCount(data.total_count);
      } else {
        if (opts?.append) {
          setResults((prev) => { const existingIds = new Set((prev ?? []).map((r) => r.id)); const fresh = newResults.filter((r) => !existingIds.has(r.id)); return [...(prev ?? []), ...fresh]; });
          setHasMore(newResults.length >= pageSize);
        } else { setResults(newResults); setHasMore(newResults.length >= pageSize); }
      }
    } catch (err) { setError(err instanceof Error ? err.message : "Search failed"); }
    finally { setLoading(false); setLoadingMore(false); }
  }, [datasetFilter, bucketFilter, subcategoryFilter]);

  const hasRun = useRef(false);
  useEffect(() => { if (!hasRun.current && query.trim()) { hasRun.current = true; runSearch(query); } }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setOffset(0); updateUrl(query, datasetFilter, bucketFilter); runSearch(query); };
  const handleExampleClick = (example: string) => { setQuery(example); setOffset(0); updateUrl(example, datasetFilter, bucketFilter); runSearch(example); };
  const handleLoadMore = () => { if (!results || loadingMore) return; runSearch(query, { append: true, searchOffset: 0, overrideLimit: results.length + SEARCH_PAGE_SIZE }); };
  const handleBrowsePage = (direction: "prev" | "next") => { const newOffset = direction === "next" ? offset + BROWSE_PAGE_SIZE : Math.max(0, offset - BROWSE_PAGE_SIZE); setOffset(newOffset); runSearch(query, { searchOffset: newOffset }); };

  useEffect(() => { setOffset(0); setTotalCount(null); setHasMore(false); }, [datasetFilter, subcategoryFilter]);

  const filteredResults = results ? results.filter((r) => passesResolutionFilter(r, resolutionFilter) && passesAiFilter(r, hasAiFilter)) : null;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <header className="border-b border-[var(--border-subtle)] px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 sm:justify-between">
        <h1 className="text-base sm:text-lg font-mono font-semibold tracking-tight">
          <Link href="/admin/dashboard" className="hover:text-[var(--accent-primary)] transition-colors duration-150">claru<span className="text-[var(--accent-primary)]">/</span>admin</Link>
          <span className="text-[var(--text-muted)]">/</span>
          <Link href="/admin/catalog" className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors duration-150">catalog</Link>
          <span className="text-[var(--text-muted)]">/</span>
          <span className="text-[var(--text-primary)]">search</span>
        </h1>
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="text-[10px] font-mono text-[var(--text-muted)]">{clipCount.toLocaleString()} clips</span>
          <Link href="/admin/catalog/enrichment" className="px-3 py-1.5 text-xs font-mono rounded-md bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 hover:bg-[var(--accent-primary)]/20 transition-colors duration-150">[enrichment status]</Link>
          <Link href="/admin/catalog" className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors duration-200">[back to catalog]</Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-2 sm:gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
              <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Semantic search across all clips..." className="w-full pl-10 pr-4 py-3 sm:py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-md font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors duration-150" />
            </div>
            <button type="submit" disabled={loading || (!query.trim() && !datasetFilter && !bucketFilter)} className="px-5 py-3 sm:py-2.5 text-sm font-mono rounded-md bg-[var(--accent-primary)] text-[var(--bg-primary)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-150 flex-shrink-0">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "search"}
            </button>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <select value={datasetFilter} onChange={(e) => setDatasetFilter(e.target.value)} className="flex-1 min-w-0 sm:flex-none sm:min-w-[180px] px-3 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-md font-mono text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors duration-150">
              <option value="">all datasets</option>
              {datasets.map((ds) => <option key={ds.id} value={ds.id}>{ds.name}</option>)}
            </select>
            {datasetFilter && subcategories.length > 0 && (
              <select value={subcategoryFilter} onChange={(e) => setSubcategoryFilter(e.target.value)} className="flex-1 min-w-0 sm:flex-none sm:min-w-[180px] px-3 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-md font-mono text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors duration-150">
                <option value="">all categories</option>
                {subcategories.map((sc) => <option key={sc.name} value={sc.name}>{sc.name} ({sc.count.toLocaleString()})</option>)}
              </select>
            )}
            {!datasetFilter && (
              <select value={bucketFilter} onChange={(e) => setBucketFilter(e.target.value)} className="flex-1 min-w-0 sm:flex-none sm:min-w-[180px] px-3 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-md font-mono text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors duration-150">
                <option value="">all buckets</option>
                {buckets.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            )}
            <select value={resolutionFilter} onChange={(e) => setResolutionFilter(e.target.value as ResolutionFilter)} className="flex-1 min-w-0 sm:flex-none sm:min-w-[120px] px-3 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-md font-mono text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors duration-150">
              <option value="all">all resolutions</option>
              <option value="720p">720p+</option>
              <option value="1080p">1080p+</option>
              <option value="4k">4K</option>
            </select>
            <label className="flex items-center gap-2 px-3 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-md font-mono text-sm text-[var(--text-primary)] cursor-pointer hover:border-[var(--accent-primary)] transition-colors duration-150 select-none">
              <input type="checkbox" checked={hasAiFilter} onChange={(e) => setHasAiFilter(e.target.checked)} className="sr-only peer" />
              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${hasAiFilter ? "bg-[var(--accent-primary)] border-[var(--accent-primary)]" : "border-[var(--text-muted)]"}`}>
                {hasAiFilter && <Check className="w-2.5 h-2.5 text-[var(--bg-primary)]" />}
              </div>
              <Sparkles className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              <span className="text-xs whitespace-nowrap">has AI desc</span>
            </label>
          </div>
        </form>

        {!results && !loading && !error && (
          <div className="mt-12 text-center">
            <p className="text-sm font-mono text-[var(--text-muted)] mb-4">try an example query:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {EXAMPLE_QUERIES.map((eq) => <button key={eq} onClick={() => handleExampleClick(eq)} className="px-3 py-1.5 text-xs font-mono rounded-md bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors duration-150">&quot;{eq}&quot;</button>)}
            </div>
          </div>
        )}

        {loading && (
          <div className="mt-12 text-center">
            <Loader2 className="h-6 w-6 animate-spin text-[var(--accent-primary)] mx-auto mb-3" />
            <p className="text-sm font-mono text-[var(--text-muted)]">embedding query and searching...</p>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 rounded-md bg-red-500/10 border border-red-500/20">
            <div className="flex items-center justify-between">
              <p className="text-sm font-mono text-red-400">{error}</p>
              <button onClick={() => setError(null)} className="text-xs font-mono text-red-400 hover:text-red-300">[dismiss]</button>
            </div>
          </div>
        )}

        {filteredResults && filteredResults.length === 0 && !loading && (
          <div className="mt-12 text-center">
            <p className="text-sm font-mono text-[var(--text-muted)]">
              {results && results.length > 0 ? "No results match your filters. Try adjusting resolution or AI description filters." : "No clips found. Try a broader query."}
            </p>
          </div>
        )}

        {filteredResults && filteredResults.length > 0 && (
          <div className="mt-6 space-y-3">
            <p className="text-xs font-mono text-[var(--text-muted)]">
              {isBrowseMode(query) && totalCount !== null
                ? `showing ${(offset + 1).toLocaleString()}\u2013${(offset + (results?.length ?? 0)).toLocaleString()} of ${totalCount.toLocaleString()}${filteredResults.length !== (results?.length ?? 0) ? ` (${filteredResults.length} after filters)` : ""}`
                : `${filteredResults.length} result${filteredResults.length !== 1 ? "s" : ""}${results && results.length !== filteredResults.length ? ` (${results.length} before filters)` : ""}${(results?.length ?? 0) >= SEARCH_MAX_RESULTS ? " (max)" : ""}`}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filteredResults.map((r) => <ResultCard key={r.id} result={r} isSelected={selected.has(r.id)} onToggleSelect={toggleSelected} onOpen={() => setDetailResult(r)} />)}
            </div>

            {!isBrowseMode(query) && hasMore && (results?.length ?? 0) < SEARCH_MAX_RESULTS && (
              <div className="flex justify-center pt-4">
                <button onClick={handleLoadMore} disabled={loadingMore} className="px-6 py-2 text-xs font-mono rounded-md border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 flex items-center gap-2">
                  {loadingMore ? <><Loader2 className="h-3 w-3 animate-spin" />loading...</> : `load more (${(results?.length ?? 0)} / ${SEARCH_MAX_RESULTS})`}
                </button>
              </div>
            )}

            {isBrowseMode(query) && totalCount !== null && (
              <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
                <button onClick={() => handleBrowsePage("prev")} disabled={offset === 0 || loading} className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono rounded-md border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"><ChevronLeft className="h-3 w-3" />previous</button>
                <span className="text-xs font-mono text-[var(--text-muted)]">page {Math.floor(offset / BROWSE_PAGE_SIZE) + 1} of {Math.max(1, Math.ceil(totalCount / BROWSE_PAGE_SIZE))}</span>
                <button onClick={() => handleBrowsePage("next")} disabled={offset + BROWSE_PAGE_SIZE >= totalCount || loading} className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono rounded-md border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150">next<ChevronRight className="h-3 w-3" /></button>
              </div>
            )}
          </div>
        )}

        {selected.size > 0 && results && <div className="h-48 sm:h-24" />}
        {selected.size > 0 && results && <BulkActionBar selectedIds={selected} results={results} onClear={() => setSelected(new Set())} />}

        {detailResult && (
          <ResultDetailModal result={detailResult} onClose={() => setDetailResult(null)}
            onNavigate={(dir) => { if (!filteredResults) return; const idx = filteredResults.findIndex(r => r.id === detailResult.id); const next = idx + (dir === "next" ? 1 : -1); if (next >= 0 && next < filteredResults.length) setDetailResult(filteredResults[next]); }}
            hasPrev={filteredResults ? filteredResults.findIndex(r => r.id === detailResult.id) > 0 : false}
            hasNext={filteredResults ? filteredResults.findIndex(r => r.id === detailResult.id) < filteredResults.length - 1 : false}
          />
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Result Card
// ---------------------------------------------------------------------------

function ResultCard({ result, isSelected, onToggleSelect, onOpen }: { result: EnrichedClipResult; isSelected: boolean; onToggleSelect: (id: string) => void; onOpen: () => void; }) {
  const similarityPct = Math.round(result.similarity * 100);
  const isVideo = result.mime_type?.startsWith("video/") || result.s3_key?.match(/\.(mp4|webm|mov)$/i);
  const [copied, setCopied] = useState<"id" | "url" | "portal" | null>(null);
  const resLabel = getResolutionLabel(result.tech_resolution_width, result.tech_resolution_height);
  const duration = formatDuration(result.tech_duration_seconds);
  const { categories, activities } = extractMetaTags(result.ann_metadata);
  const captionText = result.ai_caption || result.caption_text;

  const copyToClipboard = useCallback(async (text: string, type: "id" | "url" | "portal") => {
    try { await navigator.clipboard.writeText(text); setCopied(type); setTimeout(() => setCopied(null), 2000); } catch { /* clipboard unavailable */ }
  }, []);

  return (
    <div className={`rounded-lg border bg-[var(--bg-secondary)] overflow-hidden transition-colors cursor-pointer ${isSelected ? "border-[var(--accent-primary)] ring-1 ring-[var(--accent-primary)]/30" : "border-[var(--border-subtle)] hover:border-[var(--text-muted)]"}`} onClick={onOpen}>
      <div className="aspect-video bg-[var(--bg-primary)] relative overflow-hidden">
        <label className="absolute top-0 left-0 z-10 cursor-pointer p-2 sm:p-2" onClick={(e) => e.stopPropagation()}>
          <input type="checkbox" checked={isSelected} onChange={() => onToggleSelect(result.id)} className="sr-only peer" />
          <div className={`w-6 h-6 sm:w-5 sm:h-5 rounded border-2 flex items-center justify-center transition-colors ${isSelected ? "bg-[var(--accent-primary)] border-[var(--accent-primary)]" : "bg-black/40 border-white/40 hover:border-white/70"}`}>
            {isSelected && <Check className="w-3.5 h-3.5 sm:w-3 sm:h-3 text-[var(--bg-primary)]" />}
          </div>
        </label>
        {result.signed_url ? (
          isVideo ? (
            <video src={result.signed_url} preload="metadata" muted playsInline className="w-full h-full object-cover" onMouseEnter={(e) => (e.target as HTMLVideoElement).play().catch(() => {})} onMouseLeave={(e) => { const v = e.target as HTMLVideoElement; v.pause(); v.currentTime = 0; }} />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={result.signed_url} alt={captionText ?? "Clip"} className="w-full h-full object-cover" />
          )
        ) : <div className="w-full h-full flex items-center justify-center text-xs font-mono text-[var(--text-muted)]">no preview</div>}
        <div className="absolute top-2 right-2 flex items-center gap-1">
          {resLabel && <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-black/60 text-blue-400">{resLabel}</span>}
          <span className="px-2 py-0.5 text-xs font-mono rounded bg-black/60 text-[var(--accent-primary)]">{similarityPct}%</span>
        </div>
        {duration && <span className="absolute bottom-2 right-2 px-1.5 py-0.5 text-[10px] font-mono rounded bg-black/60 text-white/80">{duration}</span>}
      </div>

      <div className="p-3 space-y-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[10px] font-mono text-[var(--text-muted)] truncate">{result.s3_bucket}</span>
          {result.ai_enrichment_source && <span className="flex-shrink-0 px-1.5 py-0.5 text-[10px] font-mono rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">{result.ai_enrichment_source}</span>}
        </div>
        {captionText ? <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{captionText}</p> : <p className="text-sm text-[var(--text-muted)] italic">No AI description</p>}
        {(categories.length > 0 || activities.length > 0) && (
          <div className="flex flex-wrap gap-1">
            {categories.slice(0, 2).map((cat) => <span key={cat} className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">{cat}</span>)}
            {activities.slice(0, 2).map((act) => <span key={act} className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-blue-500/10 text-blue-400">{act}</span>)}
          </div>
        )}
        {result.assigned_leads && result.assigned_leads.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-mono text-[var(--text-muted)]">Added to:</span>
            {result.assigned_leads.map((l) => <a key={l.lead_id} href={`/admin/leads/${l.lead_id}`} className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono rounded bg-amber-500/15 text-amber-400 border border-amber-500/25 hover:border-amber-500/50 transition-colors">{l.lead_name}<span className="text-amber-400/60">({l.lead_company})</span></a>)}
          </div>
        )}
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
        <div className="flex flex-wrap items-center gap-1 sm:gap-2 pt-2 border-t border-[var(--border-subtle)]" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => copyToClipboard(result.id, "id")} className="flex items-center gap-1 min-h-[44px] sm:min-h-0 px-1.5 py-1 text-[11px] sm:text-[10px] font-mono text-[var(--text-muted)] hover:text-[var(--accent-primary)] active:text-[var(--accent-primary)] transition-colors" title={`ID: ${result.id}`}>
            {copied === "id" ? <Check className="w-3.5 h-3.5 sm:w-2.5 sm:h-2.5 flex-shrink-0" /> : <Copy className="w-3.5 h-3.5 sm:w-2.5 sm:h-2.5 flex-shrink-0" />}
            {copied === "id" ? "copied" : result.id.slice(0, 8)}
          </button>
          {result.signed_url && <a href={result.signed_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 min-h-[44px] sm:min-h-0 px-1.5 py-1 text-[11px] sm:text-[10px] font-mono text-[var(--text-muted)] hover:text-[var(--accent-primary)] active:text-[var(--accent-primary)] transition-colors" title="Open media in new tab"><ExternalLink className="w-3.5 h-3.5 sm:w-2.5 sm:h-2.5 flex-shrink-0" />open</a>}
          <div className="ml-auto"><AddToLeadButton clipId={result.id} compact /></div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Bulk Action Bar
// ---------------------------------------------------------------------------

interface LeadOption { id: string; name: string; company: string; }
interface DatasetOption { id: string; name: string; }
type BulkMode = "add_to_lead" | "create_catalog" | "add_to_catalog";

function BulkActionBar({ selectedIds, results: _results, onClear }: { selectedIds: Set<string>; results: EnrichedClipResult[]; onClear: () => void; }) {
  const [bulkMode, setBulkMode] = useState<BulkMode>("add_to_lead");
  const [leads, setLeads] = useState<LeadOption[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LeadOption | null>(null);
  const [leadSearch, setLeadSearch] = useState("");
  const [catalogList, setCatalogList] = useState<DatasetOption[]>([]);
  const [catalogsLoading, setCatalogsLoading] = useState(false);
  const [selectedCatalog, setSelectedCatalog] = useState<DatasetOption | null>(null);
  const [catalogSearch, setCatalogSearch] = useState("");
  const [catalogDropdownOpen, setCatalogDropdownOpen] = useState(false);
  const catalogDropdownRef = useRef<HTMLDivElement>(null);
  const [note, setNote] = useState("");
  const [catalogName, setCatalogName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [portalLink, setPortalLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setLeadsLoading(true); fetch("/api/admin/leads?status=approved").then((r) => r.json()).then((d) => setLeads(d.leads ?? [])).catch(() => {}).finally(() => setLeadsLoading(false)); }, []);
  useEffect(() => { setCatalogsLoading(true); fetch("/api/admin/catalog").then((r) => r.json()).then((d) => setCatalogList(d.datasets ?? [])).catch(() => {}).finally(() => setCatalogsLoading(false)); }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) { if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false); if (catalogDropdownRef.current && !catalogDropdownRef.current.contains(e.target as Node)) setCatalogDropdownOpen(false); }
    if (dropdownOpen || catalogDropdownOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen, catalogDropdownOpen]);

  const filteredLeads = leads.filter((l) => l.name.toLowerCase().includes(leadSearch.toLowerCase()) || l.company.toLowerCase().includes(leadSearch.toLowerCase()));

  const handleConfirm = async () => {
    if (!selectedLead) return; setSubmitting(true); setError(null);
    try {
      const items = Array.from(selectedIds).map((id) => ({ clip_id: id }));
      const res = await fetch(`/api/admin/leads/${selectedLead.id}/custom-samples/bulk`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items, note: note || undefined }) });
      if (!res.ok) { const data = await res.json(); throw new Error(data.error || "Bulk add failed"); }
      const { inserted } = await res.json();
      setToast(`${inserted} clip${inserted !== 1 ? "s" : ""} added to ${selectedLead.name}`); onClear(); setSelectedLead(null); setNote(""); setTimeout(() => setToast(null), 4000);
    } catch (err) { setError(err instanceof Error ? err.message : "Bulk add failed"); } finally { setSubmitting(false); }
  };

  const handleCreateCatalog = async () => {
    if (!selectedLead || !catalogName.trim()) return; setSubmitting(true); setError(null);
    try {
      const items = Array.from(selectedIds).map((id) => ({ clip_id: id }));
      const res = await fetch("/api/admin/catalog/custom", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: catalogName.trim(), lead_id: selectedLead.id, items, note: note || undefined }) });
      if (!res.ok) { const data = await res.json(); throw new Error(data.error || "Failed to create catalog"); }
      const data = await res.json(); setPortalLink(`${window.location.origin}${data.portal_url}`);
      setToast(`Created "${data.dataset.name}" with ${data.samples_added} clips`); onClear(); setSelectedLead(null); setCatalogName(""); setNote("");
    } catch (err) { setError(err instanceof Error ? err.message : "Failed to create catalog"); } finally { setSubmitting(false); }
  };

  const handleAddToCatalog = async () => {
    if (!selectedCatalog || !selectedLead) return; setSubmitting(true); setError(null);
    try {
      const items = Array.from(selectedIds).map((id) => ({ clip_id: id }));
      const res = await fetch("/api/admin/catalog/custom", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: selectedCatalog.name, lead_id: selectedLead.id, dataset_id: selectedCatalog.id, items, note: note || undefined }) });
      if (!res.ok) { const data = await res.json(); throw new Error(data.error || "Failed to add to catalog"); }
      const data = await res.json(); setToast(`Added ${data.samples_added} clips to "${selectedCatalog.name}"`); onClear(); setSelectedLead(null); setSelectedCatalog(null); setNote("");
    } catch (err) { setError(err instanceof Error ? err.message : "Failed to add to catalog"); } finally { setSubmitting(false); }
  };

  const filteredCatalogs = catalogList.filter((c) => c.name.toLowerCase().includes(catalogSearch.toLowerCase()));

  if (toast) {
    return (
      <div className="fixed bottom-4 sm:bottom-6 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:w-auto z-50 px-4 sm:px-6 py-3 rounded-lg bg-[var(--accent-primary)] text-[var(--bg-primary)] font-mono text-sm shadow-xl flex items-center gap-3">
        <Check className="w-4 h-4 flex-shrink-0" /><span className="truncate">{toast}</span>
        {portalLink && <button onClick={async () => { await navigator.clipboard.writeText(portalLink); setToast("Portal link copied!"); setPortalLink(null); setTimeout(() => setToast(null), 2000); }} className="flex items-center gap-1 px-2 py-1.5 rounded bg-[var(--bg-primary)]/20 text-[var(--bg-primary)] hover:bg-[var(--bg-primary)]/30 text-xs whitespace-nowrap flex-shrink-0"><Link2 className="w-3 h-3" />copy portal link</button>}
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 sm:bottom-6 left-0 sm:left-1/2 sm:-translate-x-1/2 z-50 w-full sm:max-w-4xl sm:px-4">
      <div className="rounded-t-xl sm:rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] shadow-2xl">
        <div className="flex border-b border-[var(--border-subtle)] overflow-x-auto">
          {(["add_to_lead", "create_catalog", "add_to_catalog"] as const).map((m) => (
            <button key={m} onClick={() => setBulkMode(m)} className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 sm:py-2 text-xs font-mono transition-colors whitespace-nowrap flex-1 sm:flex-none justify-center sm:justify-start ${bulkMode === m ? (m === "create_catalog" ? "text-purple-400 border-b-2 border-purple-400" : m === "add_to_catalog" ? "text-blue-400 border-b-2 border-blue-400" : "text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]") : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"}`}>
              {m === "add_to_lead" ? <UserPlus className="w-3.5 h-3.5 sm:w-3 sm:h-3" /> : <FolderPlus className="w-3.5 h-3.5 sm:w-3 sm:h-3" />}
              <span className="hidden sm:inline">{m === "add_to_lead" ? "Add to Existing" : m === "create_catalog" ? "Create New" : "Add to Catalog"}</span>
              <span className="sm:hidden">{m === "add_to_lead" ? "Existing" : m === "create_catalog" ? "New" : "Catalog"}</span>
            </button>
          ))}
        </div>
        <div className="px-3 sm:px-4 py-3 space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-3">
          <div className="flex items-center justify-between sm:justify-start sm:gap-3">
            <span className="text-sm font-mono text-[var(--text-primary)] whitespace-nowrap">{selectedIds.size} selected</span>
            <button onClick={onClear} className="sm:hidden p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors" title="Clear selection"><X className="w-4 h-4" /></button>
            <span className="hidden sm:inline text-[var(--text-muted)]">&mdash;</span>
          </div>
          {bulkMode === "add_to_catalog" && (
            <div className="relative" ref={catalogDropdownRef}>
              <button onClick={() => setCatalogDropdownOpen(!catalogDropdownOpen)} className="flex items-center gap-1.5 w-full sm:w-auto px-3 py-2.5 sm:py-1.5 text-xs font-mono rounded-md bg-[var(--bg-primary)] border border-blue-500/30 text-[var(--text-secondary)] hover:border-blue-400 transition-colors sm:min-w-[200px]">
                <FolderPlus className="w-3 h-3 flex-shrink-0" />{selectedCatalog ? <span className="truncate">{selectedCatalog.name}</span> : <span className="text-[var(--text-muted)]">Select catalog...</span>}<ChevronDown className="w-3 h-3 ml-auto flex-shrink-0" />
              </button>
              {catalogDropdownOpen && (
                <div className="absolute bottom-full mb-1 left-0 right-0 sm:right-auto sm:w-80 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] shadow-xl">
                  <div className="p-2 border-b border-[var(--border-subtle)]"><input type="text" value={catalogSearch} onChange={(e) => setCatalogSearch(e.target.value)} placeholder="Search catalogs..." autoFocus className="w-full px-2 py-2 sm:py-1.5 text-xs font-mono bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-blue-400" /></div>
                  <div className="max-h-48 overflow-y-auto">
                    {catalogsLoading ? <div className="p-3 text-center"><Loader2 className="w-4 h-4 animate-spin text-blue-400 mx-auto" /></div> : filteredCatalogs.length === 0 ? <div className="p-3 text-xs font-mono text-[var(--text-muted)] text-center">No matching catalogs</div> : filteredCatalogs.map((cat) => <button key={cat.id} onClick={() => { setSelectedCatalog(cat); setCatalogDropdownOpen(false); }} className="w-full px-3 py-2.5 sm:py-2 text-left text-xs font-mono text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] hover:text-blue-400 border-b border-[var(--border-subtle)] last:border-0 transition-colors">{cat.name}</button>)}
                  </div>
                </div>
              )}
            </div>
          )}
          {bulkMode === "create_catalog" && <input type="text" value={catalogName} onChange={(e) => setCatalogName(e.target.value)} placeholder="Catalog name..." className="w-full sm:w-48 flex-shrink-0 px-2 py-2.5 sm:py-1.5 text-xs font-mono bg-[var(--bg-primary)] border border-purple-500/30 rounded-md text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-purple-400" />}
          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-1.5 w-full sm:w-auto px-3 py-2.5 sm:py-1.5 text-xs font-mono rounded-md bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] transition-colors sm:min-w-[160px]">
              <UserPlus className="w-3 h-3 flex-shrink-0" />{selectedLead ? <span className="truncate">{selectedLead.name}</span> : <span className="text-[var(--text-muted)]">Select lead...</span>}<ChevronDown className="w-3 h-3 ml-auto flex-shrink-0" />
            </button>
            {dropdownOpen && (
              <div className="absolute bottom-full mb-1 left-0 right-0 sm:right-auto sm:w-64 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] shadow-xl">
                <div className="p-2 border-b border-[var(--border-subtle)]"><input type="text" value={leadSearch} onChange={(e) => setLeadSearch(e.target.value)} placeholder="Search leads..." autoFocus className="w-full px-2 py-2 sm:py-1.5 text-xs font-mono bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]" /></div>
                <div className="max-h-40 overflow-y-auto">
                  {leadsLoading ? <div className="p-3 text-center"><Loader2 className="w-4 h-4 animate-spin text-[var(--accent-primary)] mx-auto" /></div> : filteredLeads.length === 0 ? <div className="p-3 text-xs font-mono text-[var(--text-muted)] text-center">No matching leads</div> : filteredLeads.map((lead) => <button key={lead.id} onClick={() => { setSelectedLead(lead); setDropdownOpen(false); }} className="w-full px-3 py-2.5 sm:py-2 text-left text-xs font-mono text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] hover:text-[var(--accent-primary)] border-b border-[var(--border-subtle)] last:border-0 transition-colors"><span className="text-[var(--text-primary)]">{lead.name}</span><span className="text-[var(--text-muted)] ml-1">({lead.company})</span></button>)}
                </div>
              </div>
            )}
          </div>
          <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note (optional)" className="w-full sm:flex-1 sm:min-w-0 px-2 py-2.5 sm:py-1.5 text-xs font-mono bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-md text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]" />
          <div className="flex items-center gap-2">
            <button onClick={bulkMode === "create_catalog" ? handleCreateCatalog : bulkMode === "add_to_catalog" ? handleAddToCatalog : handleConfirm} disabled={!selectedLead || submitting || (bulkMode === "create_catalog" && !catalogName.trim()) || (bulkMode === "add_to_catalog" && !selectedCatalog)} className={`flex-1 sm:flex-none px-4 py-2.5 sm:py-1.5 text-xs font-mono rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity whitespace-nowrap ${bulkMode === "create_catalog" ? "bg-purple-500 text-white" : bulkMode === "add_to_catalog" ? "bg-blue-500 text-white" : "bg-[var(--accent-primary)] text-[var(--bg-primary)]"}`}>
              {submitting ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : bulkMode === "create_catalog" ? "Create Catalog" : bulkMode === "add_to_catalog" ? "Add to Catalog" : "Confirm"}
            </button>
            <button onClick={onClear} className="hidden sm:block p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors" title="Clear selection"><X className="w-4 h-4" /></button>
          </div>
          {error && <p className="text-[11px] sm:text-[10px] font-mono text-red-400">{error}</p>}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Result Detail Modal -- structured tabs
// ---------------------------------------------------------------------------

type DetailTab = "annotation" | "ai" | "technical";

function ResultDetailModal({ result, onClose, onNavigate, hasPrev, hasNext }: { result: EnrichedClipResult; onClose: () => void; onNavigate: (dir: "prev" | "next") => void; hasPrev: boolean; hasNext: boolean; }) {
  const isVideo = result.mime_type?.startsWith("video/") || result.s3_key?.match(/\.(mp4|webm|mov)$/i);
  const similarityPct = Math.round(result.similarity * 100);
  const [activeTab, setActiveTab] = useState<DetailTab>("ai");

  useEffect(() => {
    function handleKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); else if (e.key === "ArrowLeft" && hasPrev) onNavigate("prev"); else if (e.key === "ArrowRight" && hasNext) onNavigate("next"); }
    document.addEventListener("keydown", handleKey); document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handleKey); document.body.style.overflow = ""; };
  }, [onClose, onNavigate, hasPrev, hasNext]);

  const ann = result.ann_metadata;
  const annEntries: Array<{ key: string; value: string | string[] }> = [];
  if (ann) { for (const [k, v] of Object.entries(ann)) { if (v == null) continue; if (Array.isArray(v)) { const strs = v.filter((x): x is string => typeof x === "string"); if (strs.length > 0) annEntries.push({ key: k, value: strs }); } else if (typeof v === "string" && v.trim()) annEntries.push({ key: k, value: v }); else if (typeof v === "number" || typeof v === "boolean") annEntries.push({ key: k, value: String(v) }); } }

  const aiCaption = result.ai_caption || result.caption_text;
  const agentCtx = result.ai_agent_context;
  const aiEntries: Array<{ key: string; value: string | string[] }> = [];
  if (aiCaption) aiEntries.push({ key: "caption", value: aiCaption });
  if (result.ai_enrichment_source) aiEntries.push({ key: "source", value: result.ai_enrichment_source });
  if (agentCtx) { for (const [k, v] of Object.entries(agentCtx)) { if (v == null) continue; if (Array.isArray(v)) { const strs = v.filter((x): x is string => typeof x === "string"); if (strs.length > 0) aiEntries.push({ key: k, value: strs }); } else if (typeof v === "string" && v.trim()) aiEntries.push({ key: k, value: v }); } }

  const techEntries: Array<{ key: string; value: string }> = [];
  const resLabel = getResolutionLabel(result.tech_resolution_width, result.tech_resolution_height);
  if (result.tech_resolution_width && result.tech_resolution_height) techEntries.push({ key: "resolution", value: `${result.tech_resolution_width}x${result.tech_resolution_height}${resLabel ? ` (${resLabel})` : ""}` });
  if (result.tech_fps) techEntries.push({ key: "fps", value: `${result.tech_fps}` });
  if (result.tech_duration_seconds != null) techEntries.push({ key: "duration", value: formatDuration(result.tech_duration_seconds) ?? `${result.tech_duration_seconds}s` });
  if (result.tech_codec) techEntries.push({ key: "codec", value: result.tech_codec });
  if (result.mime_type) techEntries.push({ key: "mime type", value: result.mime_type });
  techEntries.push({ key: "bucket", value: result.s3_bucket });
  techEntries.push({ key: "s3_key", value: result.s3_key });
  techEntries.push({ key: "similarity", value: `${similarityPct}%` });
  techEntries.push({ key: "id", value: result.id });

  const tabs: Array<{ id: DetailTab; label: string; icon: React.ReactNode; count: number }> = [
    { id: "ai", label: "AI Enrichment", icon: <Sparkles className="w-3 h-3" />, count: aiEntries.length },
    { id: "annotation", label: "Annotation", icon: <FileText className="w-3 h-3" />, count: annEntries.length },
    { id: "technical", label: "Technical", icon: <Cpu className="w-3 h-3" />, count: techEntries.length },
  ];

  const activeEntries = activeTab === "annotation" ? annEntries : activeTab === "ai" ? aiEntries : techEntries;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-4 md:p-6 lg:p-8" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <button onClick={onClose} className="absolute top-3 right-3 sm:top-4 sm:right-4 z-[60] w-11 h-11 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-[var(--bg-tertiary)]/80 border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"><X className="w-5 h-5" /></button>
      {hasPrev && <button onClick={() => onNavigate("prev")} className="hidden sm:flex absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-[60] w-10 h-10 rounded-full items-center justify-center bg-[var(--bg-tertiary)]/80 border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"><ChevronLeft className="w-5 h-5" /></button>}
      {hasNext && <button onClick={() => onNavigate("next")} className="hidden sm:flex absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-[60] w-10 h-10 rounded-full items-center justify-center bg-[var(--bg-tertiary)]/80 border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"><ChevronRight className="w-5 h-5" /></button>}

      <div className="relative z-[55] flex flex-col lg:flex-row w-full h-full sm:h-auto sm:max-w-6xl sm:max-h-[90vh] sm:rounded-xl overflow-hidden sm:border border-[var(--border-subtle)] bg-[var(--bg-secondary)] shadow-2xl shadow-black/50">
        <div className="lg:w-[60%] flex-shrink-0 bg-[var(--bg-primary)] flex items-center justify-center min-h-[200px] sm:min-h-[240px]">
          {result.signed_url ? (isVideo ? <video key={result.id} src={result.signed_url} controls autoPlay muted playsInline className="w-full h-full max-h-[40vh] sm:max-h-[50vh] lg:max-h-[90vh] object-contain" style={{ colorScheme: "dark" }} /> : /* eslint-disable-next-line @next/next/no-img-element */ <img src={result.signed_url} alt="Clip" className="w-full h-full max-h-[40vh] sm:max-h-[50vh] lg:max-h-[90vh] object-contain" />) : <span className="font-mono text-sm text-[var(--text-muted)]">No preview</span>}
        </div>

        <div className="lg:w-[40%] flex flex-col min-h-0 flex-1 border-t lg:border-t-0 lg:border-l border-[var(--border-subtle)]">
          <div className="flex border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/50 flex-shrink-0 overflow-x-auto">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-1.5 px-3 py-2.5 text-[11px] sm:text-[10px] font-mono transition-colors whitespace-nowrap ${activeTab === tab.id ? "text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"}`}>
                {tab.icon}{tab.label}
                {tab.count > 0 && <span className={`px-1 py-0.5 text-[9px] rounded-full ${activeTab === tab.id ? "bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]" : "bg-[var(--bg-tertiary)] text-[var(--text-muted)]"}`}>{tab.count}</span>}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {activeEntries.length === 0 ? <div className="text-center py-8"><p className="text-sm font-mono text-[var(--text-muted)]">No {activeTab === "annotation" ? "annotation" : activeTab === "ai" ? "AI enrichment" : "technical"} data available</p></div> : activeEntries.map(({ key, value }) => (
              <div key={key}>
                <span className="text-[11px] sm:text-[10px] font-mono text-[var(--accent-primary)] uppercase tracking-wider">{key}</span>
                {Array.isArray(value) ? <div className="flex flex-wrap gap-1 mt-1">{value.map((v) => <span key={v} className="px-2 py-1 sm:px-1.5 sm:py-0.5 text-[11px] sm:text-[10px] font-mono rounded bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">{v}</span>)}</div> : <p className="font-mono text-sm sm:text-xs text-[var(--text-secondary)] mt-0.5 break-all">{value}</p>}
              </div>
            ))}
          </div>

          <div className="px-4 py-3 sm:py-2.5 border-t border-[var(--border-subtle)] bg-[var(--bg-primary)]/30 flex-shrink-0 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:hidden">
              <button onClick={() => onNavigate("prev")} disabled={!hasPrev} className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"><ChevronLeft className="w-5 h-5" /></button>
              <button onClick={() => onNavigate("next")} disabled={!hasNext} className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"><ChevronRight className="w-5 h-5" /></button>
            </div>
            <span className="hidden sm:inline font-mono text-[10px] text-[var(--text-muted)]">esc close &middot; &larr;&rarr; navigate</span>
            <CopyPortalLinkButton clipId={result.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Copy Portal Link Button (uses clip ID)
// ---------------------------------------------------------------------------

function CopyPortalLinkButton({ clipId }: { clipId: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => { try { await navigator.clipboard.writeText(`${window.location.origin}/portal/clip/${clipId}`); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* clipboard unavailable */ } };
  return (
    <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-2 sm:px-2 sm:py-1 text-[11px] sm:text-[10px] font-mono rounded bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 hover:bg-[var(--accent-primary)]/20 active:bg-[var(--accent-primary)]/30 transition-colors">
      {copied ? <Check className="w-3.5 h-3.5 sm:w-3 sm:h-3" /> : <Link2 className="w-3.5 h-3.5 sm:w-3 sm:h-3" />}
      {copied ? "copied!" : "copy clip link"}
    </button>
  );
}
