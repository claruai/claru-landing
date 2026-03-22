"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Loader2, Copy, Check, ExternalLink, UserPlus, X, ChevronDown, ChevronLeft, ChevronRight, Link2, FolderPlus } from "lucide-react";
import AddToLeadButton from "./AddToLeadButton";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Dataset {
  id: string;
  name: string;
}

type SearchMode = "catalog" | "full_corpus" | "both";

interface AssignedLead {
  lead_id: string;
  lead_name: string;
  lead_company: string;
}

/** Unified result from the search API (discriminated by source) */
interface UnifiedResult {
  source: "catalog" | "full_corpus";
  id: string;
  similarity: number;
  description: string | null;
  signed_url: string | null;
  assigned_leads?: AssignedLead[];
  // catalog
  dataset_id?: string;
  dataset_name?: string;
  environments?: string[];
  activities?: string[];
  objects?: string[];
  camera_perspective?: string | null;
  mime_type?: string;
  // full_corpus
  s3_bucket?: string;
  s3_key?: string;
  caption_text?: string | null;
  enrichment_source?: string | null;
}

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
// Component
// ---------------------------------------------------------------------------

export default function CatalogSearchClient({
  datasets,
  buckets: _buckets,
  videoIndexCount,
}: {
  datasets: Dataset[];
  buckets?: string[];
  videoIndexCount?: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Init from URL params
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [mode, setMode] = useState<SearchMode>(
    (searchParams.get("mode") as SearchMode) || "catalog",
  );
  const [datasetFilter, setDatasetFilter] = useState(searchParams.get("dataset") ?? "");
  const [bucketFilter, setBucketFilter] = useState(searchParams.get("bucket") ?? "");
  const [subcategoryFilter, setSubcategoryFilter] = useState(searchParams.get("subcategory") ?? "");
  const [subcategories, setSubcategories] = useState<Array<{ name: string; count: number }>>([]);
  const [results, setResults] = useState<UnifiedResult[] | null>(null);
  const [detailResult, setDetailResult] = useState<UnifiedResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const fullCorpusDisabled = (videoIndexCount ?? 0) === 0;

  // Load subcategories when dataset filter changes
  useEffect(() => {
    if (!datasetFilter) {
      setSubcategories([]);
      setSubcategoryFilter("");
      return;
    }
    fetch(`/api/admin/catalog/${datasetFilter}/subcategories`)
      .then((r) => r.ok ? r.json() : null)
      .then((d) => {
        if (d?.categories) setSubcategories(d.categories);
        else setSubcategories([]);
      })
      .catch(() => setSubcategories([]));
  }, [datasetFilter]);

  const toggleSelected = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // Sync URL params
  const updateUrl = useCallback(
    (q: string, m: SearchMode, ds: string, bk: string) => {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (m !== "catalog") params.set("mode", m);
      if (ds) params.set("dataset", ds);
      if (bk) params.set("bucket", bk);
      const qs = params.toString();
      router.replace(`/admin/catalog/search${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [router],
  );

  const isBrowseMode = useCallback(
    (q: string) => !q.trim() && (!!datasetFilter || !!bucketFilter),
    [datasetFilter, bucketFilter],
  );

  const runSearch = useCallback(
    async (searchQuery: string, searchMode?: SearchMode, opts?: { append?: boolean; searchOffset?: number; overrideLimit?: number }) => {
      // Allow empty query when a dataset or bucket filter is set (browse mode)
      if (!searchQuery.trim() && !datasetFilter && !bucketFilter) return;
      const m = searchMode ?? mode;
      const browsing = !searchQuery.trim();
      const pageSize = opts?.overrideLimit ?? (browsing ? BROWSE_PAGE_SIZE : SEARCH_PAGE_SIZE);
      const requestOffset = opts?.searchOffset ?? 0;

      if (opts?.append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setError(null);
        setResults(null);
        setSelected(new Set());
        setOffset(requestOffset);
        setTotalCount(null);
        setHasMore(false);
      }

      try {
        const res = await fetch("/api/admin/catalog/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: searchQuery,
            mode: m,
            dataset_id: m === "catalog" || m === "both" ? datasetFilter || undefined : undefined,
            s3_bucket: m === "full_corpus" || m === "both" ? bucketFilter || undefined : undefined,
            subcategory: subcategoryFilter || undefined,
            limit: pageSize,
            offset: requestOffset,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || `Search failed (${res.status})`);
        }

        const data = await res.json();
        const newResults: UnifiedResult[] = data.results ?? [];

        if (browsing) {
          // Browse mode: replace results, track total
          setResults(newResults);
          setOffset(requestOffset);
          if (data.total_count !== undefined && data.total_count !== null) {
            setTotalCount(data.total_count);
          }
        } else {
          // Search mode: append or replace
          if (opts?.append) {
            // Deduplicate: semantic search returns top N by similarity,
            // so requesting a larger N may return overlapping results
            setResults((prev) => {
              const existingIds = new Set((prev ?? []).map((r) => r.id));
              const fresh = newResults.filter((r) => !existingIds.has(r.id));
              return [...(prev ?? []), ...fresh];
            });
            setHasMore(newResults.length >= pageSize);
          } else {
            setResults(newResults);
            setHasMore(newResults.length >= pageSize);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Search failed");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [mode, datasetFilter, bucketFilter, subcategoryFilter],
  );

  // Auto-run search from URL params on mount
  const hasRun = useRef(false);
  useEffect(() => {
    if (!hasRun.current && query.trim()) {
      hasRun.current = true;
      runSearch(query);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOffset(0);
    updateUrl(query, mode, datasetFilter, bucketFilter);
    runSearch(query);
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
    setOffset(0);
    updateUrl(example, mode, datasetFilter, bucketFilter);
    runSearch(example);
  };

  const handleModeChange = (newMode: SearchMode) => {
    setMode(newMode);
    setOffset(0);
    updateUrl(query, newMode, datasetFilter, bucketFilter);
    if (query.trim() || datasetFilter || bucketFilter) runSearch(query, newMode);
  };

  // Load more (search mode) — request total needed count since semantic
  // search doesn't support offset (it always returns top N by similarity)
  const handleLoadMore = () => {
    if (!results || loadingMore) return;
    const totalNeeded = results.length + SEARCH_PAGE_SIZE;
    runSearch(query, mode, { append: true, searchOffset: 0, overrideLimit: totalNeeded });
  };

  // Browse pagination
  const handleBrowsePage = (direction: "prev" | "next") => {
    const newOffset = direction === "next"
      ? offset + BROWSE_PAGE_SIZE
      : Math.max(0, offset - BROWSE_PAGE_SIZE);
    setOffset(newOffset);
    runSearch(query, mode, { searchOffset: newOffset });
  };

  // Reset offset when filters change
  useEffect(() => {
    setOffset(0);
    setTotalCount(null);
    setHasMore(false);
  }, [datasetFilter, subcategoryFilter]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="border-b border-[var(--border-subtle)] px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-mono font-semibold tracking-tight">
          <Link
            href="/admin/dashboard"
            className="hover:text-[var(--accent-primary)] transition-colors duration-150"
          >
            claru<span className="text-[var(--accent-primary)]">/</span>admin
          </Link>
          <span className="text-[var(--text-muted)]">/</span>
          <Link
            href="/admin/catalog"
            className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors duration-150"
          >
            catalog
          </Link>
          <span className="text-[var(--text-muted)]">/</span>
          <span className="text-[var(--text-primary)]">search</span>
        </h1>
        <div className="flex items-center gap-4">
          <Link
            href="/admin/catalog/enrichment"
            className="px-3 py-1.5 text-xs font-mono rounded-md bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 hover:bg-[var(--accent-primary)]/20 transition-colors duration-150"
          >
            [enrichment status]
          </Link>
          <Link
            href="/admin/catalog"
            className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors duration-200"
          >
            [back to catalog]
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Mode toggle */}
        <div className="flex items-center gap-1 mb-4">
          {(["catalog", "full_corpus", "both"] as const).map((m) => (
            <button
              key={m}
              onClick={() => handleModeChange(m)}
              disabled={m !== "catalog" && fullCorpusDisabled}
              className={`px-3 py-1.5 text-xs font-mono rounded-md border transition-colors ${
                mode === m
                  ? "bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border-[var(--accent-primary)]/30"
                  : "bg-[var(--bg-secondary)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-secondary)] hover:border-[var(--text-muted)]"
              } ${m !== "catalog" && fullCorpusDisabled ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              {m === "catalog" ? "Catalog Samples" : m === "full_corpus" ? "Full Corpus" : "Both"}
            </button>
          ))}
          {fullCorpusDisabled && (
            <span className="text-[10px] font-mono text-[var(--text-muted)] ml-2">
              (video_index empty)
            </span>
          )}
        </div>

        {/* Search form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={mode === "full_corpus" ? "Search full video corpus..." : "Semantic search across samples..."}
                className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-md font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors duration-150"
              />
            </div>
            {/* Dataset filter (catalog/both mode) */}
            {(mode === "catalog" || mode === "both") && (
              <select
                value={datasetFilter}
                onChange={(e) => setDatasetFilter(e.target.value)}
                className="px-3 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-md font-mono text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors duration-150"
              >
                <option value="">all datasets</option>
                {datasets.map((ds) => (
                  <option key={ds.id} value={ds.id}>
                    {ds.name}
                  </option>
                ))}
              </select>
            )}
            {/* Subcategory filter (level 2 — appears when a dataset is selected) */}
            {datasetFilter && subcategories.length > 0 && (
              <select
                value={subcategoryFilter}
                onChange={(e) => setSubcategoryFilter(e.target.value)}
                className="px-3 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-md font-mono text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors duration-150"
              >
                <option value="">all categories</option>
                {subcategories.map((sc) => (
                  <option key={sc.name} value={sc.name}>
                    {sc.name} ({sc.count.toLocaleString()})
                  </option>
                ))}
              </select>
            )}
            {/* Bucket filter (full_corpus/both mode, no dataset selected) */}
            {(mode === "full_corpus" || mode === "both") && !datasetFilter && (
              <input
                type="text"
                value={bucketFilter}
                onChange={(e) => setBucketFilter(e.target.value)}
                placeholder="s3 bucket filter..."
                className="px-3 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-md font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors duration-150 w-48"
              />
            )}
            <button
              type="submit"
              disabled={loading || (!query.trim() && !datasetFilter && !bucketFilter)}
              className="px-5 py-2.5 text-sm font-mono rounded-md bg-[var(--accent-primary)] text-[var(--bg-primary)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-150"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "search"
              )}
            </button>
          </div>
        </form>

        {/* Idle state: example queries */}
        {!results && !loading && !error && (
          <div className="mt-12 text-center">
            <p className="text-sm font-mono text-[var(--text-muted)] mb-4">
              try an example query:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {EXAMPLE_QUERIES.map((eq) => (
                <button
                  key={eq}
                  onClick={() => handleExampleClick(eq)}
                  className="px-3 py-1.5 text-xs font-mono rounded-md bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors duration-150"
                >
                  &quot;{eq}&quot;
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="mt-12 text-center">
            <Loader2 className="h-6 w-6 animate-spin text-[var(--accent-primary)] mx-auto mb-3" />
            <p className="text-sm font-mono text-[var(--text-muted)]">
              embedding query and searching...
            </p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="mt-6 p-4 rounded-md bg-red-500/10 border border-red-500/20">
            <div className="flex items-center justify-between">
              <p className="text-sm font-mono text-red-400">{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-xs font-mono text-red-400 hover:text-red-300"
              >
                [dismiss]
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {results && results.length === 0 && !loading && (
          <div className="mt-12 text-center">
            <p className="text-sm font-mono text-[var(--text-muted)]">
              No samples found. Try a broader query.
            </p>
          </div>
        )}

        {/* Results */}
        {results && results.length > 0 && (
          <div className="mt-6 space-y-3">
            <p className="text-xs font-mono text-[var(--text-muted)]">
              {isBrowseMode(query) && totalCount !== null
                ? `showing ${(offset + 1).toLocaleString()}\u2013${(offset + results.length).toLocaleString()} of ${totalCount.toLocaleString()}`
                : `${results.length} result${results.length !== 1 ? "s" : ""}${results.length >= SEARCH_MAX_RESULTS ? " (max)" : ""}`}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((r) => (
                <ResultCard
                  key={r.id}
                  result={r}
                  isSelected={selected.has(r.id)}
                  onToggleSelect={toggleSelected}
                  onOpen={() => setDetailResult(r)}
                />
              ))}
            </div>

            {/* Search mode: Load More */}
            {!isBrowseMode(query) && hasMore && results.length < SEARCH_MAX_RESULTS && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-6 py-2 text-xs font-mono rounded-md border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 flex items-center gap-2"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      loading...
                    </>
                  ) : (
                    `load more (${results.length} / ${SEARCH_MAX_RESULTS})`
                  )}
                </button>
              </div>
            )}

            {/* Browse mode: Prev / Next pagination */}
            {isBrowseMode(query) && totalCount !== null && (
              <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
                <button
                  onClick={() => handleBrowsePage("prev")}
                  disabled={offset === 0 || loading}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono rounded-md border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
                >
                  <ChevronLeft className="h-3 w-3" />
                  previous
                </button>
                <span className="text-xs font-mono text-[var(--text-muted)]">
                  page {Math.floor(offset / BROWSE_PAGE_SIZE) + 1} of {Math.max(1, Math.ceil(totalCount / BROWSE_PAGE_SIZE))}
                </span>
                <button
                  onClick={() => handleBrowsePage("next")}
                  disabled={offset + BROWSE_PAGE_SIZE >= totalCount || loading}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono rounded-md border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
                >
                  next
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Floating bulk action bar */}
        {selected.size > 0 && results && (
          <BulkActionBar
            selectedIds={selected}
            results={results}
            onClear={() => setSelected(new Set())}
          />
        )}

        {/* Detail modal */}
        {detailResult && (
          <ResultDetailModal
            result={detailResult}
            onClose={() => setDetailResult(null)}
            onNavigate={(dir) => {
              if (!results) return;
              const idx = results.findIndex(r => r.id === detailResult.id);
              const next = idx + (dir === "next" ? 1 : -1);
              if (next >= 0 && next < results.length) setDetailResult(results[next]);
            }}
            hasPrev={results ? results.findIndex(r => r.id === detailResult.id) > 0 : false}
            hasNext={results ? results.findIndex(r => r.id === detailResult.id) < results.length - 1 : false}
          />
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Result Card
// ---------------------------------------------------------------------------

function ResultCard({
  result,
  isSelected,
  onToggleSelect,
  onOpen,
}: {
  result: UnifiedResult;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onOpen: () => void;
}) {
  const similarityPct = Math.round(result.similarity * 100);
  const isFC = result.source === "full_corpus";
  const isVideo = isFC
    ? result.s3_key?.match(/\.(mp4|webm|mov)$/i)
    : result.mime_type?.startsWith("video/");
  const [copied, setCopied] = useState<"id" | "url" | "portal" | null>(null);

  const copyToClipboard = useCallback(async (text: string, type: "id" | "url" | "portal") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch { /* clipboard unavailable */ }
  }, []);

  return (
    <div className={`rounded-lg border bg-[var(--bg-secondary)] overflow-hidden transition-colors cursor-pointer ${
      isSelected
        ? "border-[var(--accent-primary)] ring-1 ring-[var(--accent-primary)]/30"
        : "border-[var(--border-subtle)] hover:border-[var(--text-muted)]"
    }`} onClick={onOpen}>
      {/* Thumbnail */}
      <div className="aspect-video bg-[var(--bg-primary)] relative overflow-hidden">
        {/* Checkbox */}
        <label className="absolute top-2 left-2 z-10 cursor-pointer" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(result.id)}
            className="sr-only peer"
          />
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            isSelected
              ? "bg-[var(--accent-primary)] border-[var(--accent-primary)]"
              : "bg-black/40 border-white/40 hover:border-white/70"
          }`}>
            {isSelected && <Check className="w-3 h-3 text-[var(--bg-primary)]" />}
          </div>
        </label>
        {result.signed_url ? (
          isVideo ? (
            <video
              src={result.signed_url}
              preload="metadata"
              muted
              playsInline
              className="w-full h-full object-cover"
              onMouseEnter={(e) => (e.target as HTMLVideoElement).play().catch(() => {})}
              onMouseLeave={(e) => {
                const v = e.target as HTMLVideoElement;
                v.pause();
                v.currentTime = 0;
              }}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={result.signed_url}
              alt={result.description ?? "Sample"}
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs font-mono text-[var(--text-muted)]">
            no preview
          </div>
        )}
        {/* Similarity badge */}
        <span className="absolute top-2 right-2 px-2 py-0.5 text-xs font-mono rounded bg-black/60 text-[var(--accent-primary)]">
          {similarityPct}%
        </span>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between gap-2">
          {isFC ? (
            <div className="flex items-center gap-2 min-w-0">
              <span className="flex-shrink-0 px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 uppercase tracking-wider">
                full corpus
              </span>
              <span className="text-[10px] font-mono text-[var(--text-muted)] truncate">
                {result.s3_bucket}
              </span>
            </div>
          ) : (
            <span className="text-xs font-mono text-[var(--text-muted)] truncate">
              {result.dataset_name}
            </span>
          )}
        </div>

        {result.description ? (
          <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
            {result.description}
          </p>
        ) : (
          <p className="text-sm text-[var(--text-muted)] italic">
            {isFC ? "No caption" : "Not yet enriched"}
          </p>
        )}

        {/* Tags — catalog only */}
        {!isFC && ((result.environments?.length ?? 0) > 0 || (result.activities?.length ?? 0) > 0) && (
          <div className="flex flex-wrap gap-1">
            {(result.environments ?? []).slice(0, 2).map((env) => (
              <span
                key={env}
                className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]"
              >
                {env}
              </span>
            ))}
            {(result.activities ?? []).slice(0, 2).map((act) => (
              <span
                key={act}
                className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-blue-500/10 text-blue-400"
              >
                {act}
              </span>
            ))}
          </div>
        )}

        {/* Full corpus: enrichment_source tag */}
        {isFC && result.enrichment_source && (
          <div className="flex flex-wrap gap-1">
            <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-purple-500/10 text-purple-400">
              {result.enrichment_source}
            </span>
          </div>
        )}

        {/* Assigned leads */}
        {result.assigned_leads && result.assigned_leads.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-mono text-[var(--text-muted)]">Added to:</span>
            {result.assigned_leads.map((l) => (
              <a
                key={l.lead_id}
                href={`/admin/leads/${l.lead_id}`}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono rounded bg-amber-500/15 text-amber-400 border border-amber-500/25 hover:border-amber-500/50 transition-colors"
              >
                {l.lead_name}
                <span className="text-amber-400/60">({l.lead_company})</span>
              </a>
            ))}
          </div>
        )}

        {/* Copy links + Add to Lead — stop propagation so clicks don't open modal */}
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
        <div className="flex items-center gap-2 pt-2 border-t border-[var(--border-subtle)]" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => copyToClipboard(result.id, "id")}
            className="flex items-center gap-1 text-[10px] font-mono text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
            title={`ID: ${result.id}`}
          >
            {copied === "id" ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
            {copied === "id" ? "copied" : result.id.slice(0, 8)}
          </button>
          {result.signed_url && (
            <a
              href={result.signed_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[10px] font-mono text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
              title="Open media in new tab"
            >
              <ExternalLink className="w-2.5 h-2.5" />
              open
            </a>
          )}
          {!isFC && result.dataset_id && (
            <button
              onClick={() => copyToClipboard(
                `${window.location.origin}/portal/catalog/${result.dataset_id}?sample=${result.id}`,
                "portal"
              )}
              className="flex items-center gap-1 text-[10px] font-mono text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
              title="Copy portal link for lead"
            >
              {copied === "portal" ? <Check className="w-2.5 h-2.5" /> : <Link2 className="w-2.5 h-2.5" />}
              {copied === "portal" ? "copied" : "lead link"}
            </button>
          )}
          <div className="ml-auto">
            <AddToLeadButton
              videoIndexId={isFC ? result.id : undefined}
              datasetSampleId={!isFC ? result.id : undefined}
              compact
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Bulk Action Bar (floating)
// ---------------------------------------------------------------------------

interface LeadOption {
  id: string;
  name: string;
  company: string;
}

interface DatasetOption {
  id: string;
  name: string;
}

type BulkMode = "add_to_lead" | "create_catalog" | "add_to_catalog";

function BulkActionBar({
  selectedIds,
  results,
  onClear,
}: {
  selectedIds: Set<string>;
  results: UnifiedResult[];
  onClear: () => void;
}) {
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

  // Fetch leads on mount
  useEffect(() => {
    setLeadsLoading(true);
    fetch("/api/admin/leads?status=approved")
      .then((r) => r.json())
      .then((d) => setLeads(d.leads ?? []))
      .catch(() => {})
      .finally(() => setLeadsLoading(false));
  }, []);

  // Fetch catalog list on mount
  useEffect(() => {
    setCatalogsLoading(true);
    fetch("/api/admin/catalog")
      .then((r) => r.json())
      .then((d) => setCatalogList(d.datasets ?? []))
      .catch(() => {})
      .finally(() => setCatalogsLoading(false));
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (catalogDropdownRef.current && !catalogDropdownRef.current.contains(e.target as Node)) {
        setCatalogDropdownOpen(false);
      }
    }
    if (dropdownOpen || catalogDropdownOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen, catalogDropdownOpen]);

  const filteredLeads = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
      l.company.toLowerCase().includes(leadSearch.toLowerCase()),
  );

  const handleConfirm = async () => {
    if (!selectedLead) return;
    setSubmitting(true);
    setError(null);

    try {
      const items = Array.from(selectedIds).map((id) => {
        const r = results.find((res) => res.id === id);
        if (r?.source === "full_corpus") return { video_index_id: id };
        return { dataset_sample_id: id };
      });

      const res = await fetch(
        `/api/admin/leads/${selectedLead.id}/custom-samples/bulk`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items, note: note || undefined }),
        },
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Bulk add failed");
      }

      const { inserted } = await res.json();
      setToast(`${inserted} sample${inserted !== 1 ? "s" : ""} added to ${selectedLead.name}`);
      onClear();
      setSelectedLead(null);
      setNote("");
      setTimeout(() => setToast(null), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bulk add failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateCatalog = async () => {
    if (!selectedLead || !catalogName.trim()) return;
    setSubmitting(true);
    setError(null);

    try {
      const items = Array.from(selectedIds).map((id) => {
        const r = results.find((res) => res.id === id);
        if (r?.source === "full_corpus") return { video_index_id: id };
        return { dataset_sample_id: id };
      });

      const res = await fetch("/api/admin/catalog/custom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: catalogName.trim(),
          lead_id: selectedLead.id,
          items,
          note: note || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create catalog");
      }

      const data = await res.json();
      const fullUrl = `${window.location.origin}${data.portal_url}`;
      setPortalLink(fullUrl);
      setToast(`Created "${data.dataset.name}" with ${data.samples_added} samples`);
      onClear();
      setSelectedLead(null);
      setCatalogName("");
      setNote("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create catalog");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddToCatalog = async () => {
    if (!selectedCatalog || !selectedLead) return;
    setSubmitting(true);
    setError(null);

    try {
      const items = Array.from(selectedIds).map((id) => {
        const r = results.find((res) => res.id === id);
        if (r?.source === "full_corpus") return { video_index_id: id };
        return { dataset_sample_id: id };
      });

      const res = await fetch("/api/admin/catalog/custom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selectedCatalog.name,
          lead_id: selectedLead.id,
          dataset_id: selectedCatalog.id,
          items,
          note: note || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add to catalog");
      }

      const data = await res.json();
      setToast(`Added ${data.samples_added} clips to "${selectedCatalog.name}"`);
      onClear();
      setSelectedLead(null);
      setSelectedCatalog(null);
      setNote("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add to catalog");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCatalogs = catalogList.filter((c) =>
    c.name.toLowerCase().includes(catalogSearch.toLowerCase())
  );

  // Toast + portal link
  if (toast) {
    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg bg-[var(--accent-primary)] text-[var(--bg-primary)] font-mono text-sm shadow-xl flex items-center gap-3">
        <Check className="w-4 h-4 flex-shrink-0" />
        <span>{toast}</span>
        {portalLink && (
          <button
            onClick={async () => {
              await navigator.clipboard.writeText(portalLink);
              setToast("Portal link copied!");
              setPortalLink(null);
              setTimeout(() => setToast(null), 2000);
            }}
            className="flex items-center gap-1 px-2 py-1 rounded bg-[var(--bg-primary)]/20 text-[var(--bg-primary)] hover:bg-[var(--bg-primary)]/30 text-xs whitespace-nowrap"
          >
            <Link2 className="w-3 h-3" />
            copy portal link
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4">
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] shadow-2xl">
        {/* Mode toggle tabs */}
        <div className="flex border-b border-[var(--border-subtle)]">
          <button
            onClick={() => setBulkMode("add_to_lead")}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-mono transition-colors ${
              bulkMode === "add_to_lead"
                ? "text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            }`}
          >
            <UserPlus className="w-3 h-3" />
            Add to Existing
          </button>
          <button
            onClick={() => setBulkMode("create_catalog")}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-mono transition-colors ${
              bulkMode === "create_catalog"
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            }`}
          >
            <FolderPlus className="w-3 h-3" />
            Create New
          </button>
          <button
            onClick={() => setBulkMode("add_to_catalog")}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-mono transition-colors ${
              bulkMode === "add_to_catalog"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            }`}
          >
            <FolderPlus className="w-3 h-3" />
            Add to Catalog
          </button>
        </div>

        <div className="px-4 py-3 flex items-center gap-3">
          {/* Count */}
          <span className="text-sm font-mono text-[var(--text-primary)] whitespace-nowrap">
            {selectedIds.size} selected
          </span>

          <span className="text-[var(--text-muted)]">—</span>

          {/* Catalog picker (add_to_catalog mode) */}
          {bulkMode === "add_to_catalog" && (
            <div className="relative flex-shrink-0" ref={catalogDropdownRef}>
              <button
                onClick={() => setCatalogDropdownOpen(!catalogDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-md bg-[var(--bg-primary)] border border-blue-500/30 text-[var(--text-secondary)] hover:border-blue-400 transition-colors min-w-[200px]"
              >
                <FolderPlus className="w-3 h-3" />
                {selectedCatalog ? (
                  <span className="truncate">{selectedCatalog.name}</span>
                ) : (
                  <span className="text-[var(--text-muted)]">Select catalog...</span>
                )}
                <ChevronDown className="w-3 h-3 ml-auto" />
              </button>

              {catalogDropdownOpen && (
                <div className="absolute bottom-full mb-1 left-0 w-80 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] shadow-xl">
                  <div className="p-2 border-b border-[var(--border-subtle)]">
                    <input
                      type="text"
                      value={catalogSearch}
                      onChange={(e) => setCatalogSearch(e.target.value)}
                      placeholder="Search catalogs..."
                      autoFocus
                      className="w-full px-2 py-1.5 text-xs font-mono bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {catalogsLoading ? (
                      <div className="p-3 text-center">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-400 mx-auto" />
                      </div>
                    ) : filteredCatalogs.length === 0 ? (
                      <div className="p-3 text-xs font-mono text-[var(--text-muted)] text-center">
                        No matching catalogs
                      </div>
                    ) : (
                      filteredCatalogs.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setSelectedCatalog(cat);
                            setCatalogDropdownOpen(false);
                          }}
                          className="w-full px-3 py-2 text-left text-xs font-mono text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] hover:text-blue-400 border-b border-[var(--border-subtle)] last:border-0 transition-colors"
                        >
                          {cat.name}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Catalog name input (create mode only) */}
          {bulkMode === "create_catalog" && (
            <input
              type="text"
              value={catalogName}
              onChange={(e) => setCatalogName(e.target.value)}
              placeholder="Catalog name..."
              className="w-48 flex-shrink-0 px-2 py-1.5 text-xs font-mono bg-[var(--bg-primary)] border border-purple-500/30 rounded-md text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-purple-400"
            />
          )}

          {/* Lead combobox */}
          <div className="relative flex-shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-md bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] transition-colors min-w-[160px]"
            >
              <UserPlus className="w-3 h-3" />
              {selectedLead ? (
                <span className="truncate">{selectedLead.name}</span>
              ) : (
                <span className="text-[var(--text-muted)]">Select lead...</span>
              )}
              <ChevronDown className="w-3 h-3 ml-auto" />
            </button>

            {dropdownOpen && (
              <div className="absolute bottom-full mb-1 left-0 w-64 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] shadow-xl">
                <div className="p-2 border-b border-[var(--border-subtle)]">
                  <input
                    type="text"
                    value={leadSearch}
                    onChange={(e) => setLeadSearch(e.target.value)}
                    placeholder="Search leads..."
                    autoFocus
                    className="w-full px-2 py-1.5 text-xs font-mono bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>
                <div className="max-h-40 overflow-y-auto">
                  {leadsLoading ? (
                    <div className="p-3 text-center">
                      <Loader2 className="w-4 h-4 animate-spin text-[var(--accent-primary)] mx-auto" />
                    </div>
                  ) : filteredLeads.length === 0 ? (
                    <div className="p-3 text-xs font-mono text-[var(--text-muted)] text-center">
                      No matching leads
                    </div>
                  ) : (
                    filteredLeads.map((lead) => (
                      <button
                        key={lead.id}
                        onClick={() => {
                          setSelectedLead(lead);
                          setDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left text-xs font-mono text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] hover:text-[var(--accent-primary)] border-b border-[var(--border-subtle)] last:border-0 transition-colors"
                      >
                        <span className="text-[var(--text-primary)]">{lead.name}</span>
                        <span className="text-[var(--text-muted)] ml-1">({lead.company})</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Note input */}
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Note (optional)"
            className="flex-1 min-w-0 px-2 py-1.5 text-xs font-mono bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-md text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
          />

          {/* Confirm */}
          <button
            onClick={
              bulkMode === "create_catalog"
                ? handleCreateCatalog
                : bulkMode === "add_to_catalog"
                  ? handleAddToCatalog
                  : handleConfirm
            }
            disabled={
              !selectedLead ||
              submitting ||
              (bulkMode === "create_catalog" && !catalogName.trim()) ||
              (bulkMode === "add_to_catalog" && !selectedCatalog)
            }
            className={`px-4 py-1.5 text-xs font-mono rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity whitespace-nowrap ${
              bulkMode === "create_catalog"
                ? "bg-purple-500 text-white"
                : bulkMode === "add_to_catalog"
                  ? "bg-blue-500 text-white"
                  : "bg-[var(--accent-primary)] text-[var(--bg-primary)]"
            }`}
          >
            {submitting ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : bulkMode === "create_catalog" ? (
              "Create Catalog"
            ) : bulkMode === "add_to_catalog" ? (
              "Add to Catalog"
            ) : (
              "Confirm"
            )}
          </button>

          {/* Clear */}
          <button
            onClick={onClear}
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            title="Clear selection"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Error */}
          {error && (
            <span className="text-[10px] font-mono text-red-400 whitespace-nowrap">
              {error}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Result Detail Modal — split view: media left, data right
// ---------------------------------------------------------------------------

function ResultDetailModal({
  result,
  onClose,
  onNavigate,
  hasPrev,
  hasNext,
}: {
  result: UnifiedResult;
  onClose: () => void;
  onNavigate: (dir: "prev" | "next") => void;
  hasPrev: boolean;
  hasNext: boolean;
}) {
  const isFC = result.source === "full_corpus";
  const isVideo = isFC
    ? result.s3_key?.match(/\.(mp4|webm|mov)$/i)
    : result.mime_type?.startsWith("video/");
  const similarityPct = Math.round(result.similarity * 100);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft" && hasPrev) onNavigate("prev");
      else if (e.key === "ArrowRight" && hasNext) onNavigate("next");
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onNavigate, hasPrev, hasNext]);

  const fields: Array<{ key: string; value: string | string[] }> = [];
  if (result.description) fields.push({ key: "description", value: result.description });
  if (result.dataset_name) fields.push({ key: "dataset", value: result.dataset_name });
  if (isFC && result.s3_bucket) fields.push({ key: "bucket", value: result.s3_bucket });
  if (isFC && result.enrichment_source) fields.push({ key: "source", value: result.enrichment_source });
  if (result.environments && result.environments.length > 0) fields.push({ key: "environments", value: result.environments });
  if (result.activities && result.activities.length > 0) fields.push({ key: "activities", value: result.activities });
  if (result.objects && result.objects.length > 0) fields.push({ key: "objects", value: result.objects });
  if (result.camera_perspective) fields.push({ key: "camera", value: result.camera_perspective });
  fields.push({ key: "similarity", value: `${similarityPct}%` });
  fields.push({ key: "id", value: result.id });
  if (isFC && result.s3_key) fields.push({ key: "s3_key", value: result.s3_key });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 lg:p-8"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      <button onClick={onClose} className="absolute top-4 right-4 z-[60] w-10 h-10 rounded-full flex items-center justify-center bg-[var(--bg-tertiary)]/80 border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
        <X className="w-5 h-5" />
      </button>

      {hasPrev && (
        <button onClick={() => onNavigate("prev")} className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-[60] w-10 h-10 rounded-full flex items-center justify-center bg-[var(--bg-tertiary)]/80 border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      {hasNext && (
        <button onClick={() => onNavigate("next")} className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-[60] w-10 h-10 rounded-full flex items-center justify-center bg-[var(--bg-tertiary)]/80 border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      <div className="relative z-[55] flex flex-col lg:flex-row w-full max-w-6xl max-h-[90vh] rounded-xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-secondary)] shadow-2xl shadow-black/50">
        {/* Left: Media */}
        <div className="lg:w-[60%] flex-shrink-0 bg-[var(--bg-primary)] flex items-center justify-center min-h-[240px]">
          {result.signed_url ? (
            isVideo ? (
              <video key={result.id} src={result.signed_url} controls autoPlay muted playsInline className="w-full h-full max-h-[50vh] lg:max-h-[90vh] object-contain" style={{ colorScheme: "dark" }} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={result.signed_url} alt="Sample" className="w-full h-full max-h-[50vh] lg:max-h-[90vh] object-contain" />
            )
          ) : (
            <span className="font-mono text-sm text-[var(--text-muted)]">No preview</span>
          )}
        </div>

        {/* Right: Data panel */}
        <div className="lg:w-[40%] flex flex-col min-h-0 border-t lg:border-t-0 lg:border-l border-[var(--border-subtle)]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/50 flex-shrink-0">
            <span className="font-mono text-xs text-[var(--accent-primary)] tracking-wider">{"// DETAILS"}</span>
            {isFC && (
              <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 uppercase">full corpus</span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {fields.map(({ key, value }) => (
              <div key={key}>
                <span className="text-[10px] font-mono text-[var(--accent-primary)] uppercase tracking-wider">{key}</span>
                {Array.isArray(value) ? (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {value.map((v) => (
                      <span key={v} className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">{v}</span>
                    ))}
                  </div>
                ) : (
                  <p className="font-mono text-xs text-[var(--text-secondary)] mt-0.5 break-all">{value}</p>
                )}
              </div>
            ))}
          </div>

          <div className="px-4 py-2.5 border-t border-[var(--border-subtle)] bg-[var(--bg-primary)]/30 flex-shrink-0 flex items-center justify-between">
            <span className="font-mono text-[10px] text-[var(--text-muted)]">esc close &middot; &larr;&rarr; navigate</span>
            {!isFC && result.dataset_id && (
              <CopyPortalLinkButton datasetId={result.dataset_id} sampleId={result.id} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Copy Portal Link Button (reusable for modal footer)
// ---------------------------------------------------------------------------

function CopyPortalLinkButton({ datasetId, sampleId }: { datasetId: string; sampleId: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = `${window.location.origin}/portal/catalog/${datasetId}?sample=${sampleId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-mono rounded bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 hover:bg-[var(--accent-primary)]/20 transition-colors"
    >
      {copied ? <Check className="w-3 h-3" /> : <Link2 className="w-3 h-3" />}
      {copied ? "copied!" : "copy lead link"}
    </button>
  );
}
