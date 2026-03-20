"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Loader2, Copy, Check, ExternalLink, UserPlus, X, ChevronDown } from "lucide-react";
import AddToLeadButton from "./AddToLeadButton";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Dataset {
  id: string;
  name: string;
}

type SearchMode = "catalog" | "full_corpus" | "both";

/** Unified result from the search API (discriminated by source) */
interface UnifiedResult {
  source: "catalog" | "full_corpus";
  id: string;
  similarity: number;
  description: string | null;
  signed_url: string | null;
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

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CatalogSearchClient({
  datasets,
  buckets,
  videoIndexCount,
}: {
  datasets: Dataset[];
  buckets: string[];
  videoIndexCount: number;
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
  const [results, setResults] = useState<UnifiedResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const fullCorpusDisabled = videoIndexCount === 0;

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

  const runSearch = useCallback(
    async (searchQuery: string, searchMode?: SearchMode) => {
      if (!searchQuery.trim()) return;
      const m = searchMode ?? mode;

      setLoading(true);
      setError(null);
      setResults(null);
      setSelected(new Set());

      try {
        const res = await fetch("/api/admin/catalog/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: searchQuery,
            mode: m,
            dataset_id: m === "catalog" || m === "both" ? datasetFilter || undefined : undefined,
            s3_bucket: m === "full_corpus" || m === "both" ? bucketFilter || undefined : undefined,
            limit: 20,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || `Search failed (${res.status})`);
        }

        const data = await res.json();
        setResults(data.results ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Search failed");
      } finally {
        setLoading(false);
      }
    },
    [mode, datasetFilter, bucketFilter],
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
    updateUrl(query, mode, datasetFilter, bucketFilter);
    runSearch(query);
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
    updateUrl(example, mode, datasetFilter, bucketFilter);
    runSearch(example);
  };

  const handleModeChange = (newMode: SearchMode) => {
    setMode(newMode);
    updateUrl(query, newMode, datasetFilter, bucketFilter);
    if (query.trim()) runSearch(query, newMode);
  };

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
            {/* Bucket filter (full_corpus/both mode) */}
            {(mode === "full_corpus" || mode === "both") && buckets.length > 0 && (
              <select
                value={bucketFilter}
                onChange={(e) => setBucketFilter(e.target.value)}
                className="px-3 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-md font-mono text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors duration-150"
              >
                <option value="">all buckets</option>
                {buckets.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            )}
            <button
              type="submit"
              disabled={loading || !query.trim()}
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
              {results.length} result{results.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((r) => (
                <ResultCard
                  key={r.id}
                  result={r}
                  isSelected={selected.has(r.id)}
                  onToggleSelect={toggleSelected}
                />
              ))}
            </div>
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
}: {
  result: UnifiedResult;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}) {
  const similarityPct = Math.round(result.similarity * 100);
  const isFC = result.source === "full_corpus";
  const isVideo = isFC
    ? result.s3_key?.match(/\.(mp4|webm|mov)$/i)
    : result.mime_type?.startsWith("video/");
  const [copied, setCopied] = useState<"id" | "url" | null>(null);

  const copyToClipboard = useCallback(async (text: string, type: "id" | "url") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch { /* clipboard unavailable */ }
  }, []);

  return (
    <div className={`rounded-lg border bg-[var(--bg-secondary)] overflow-hidden transition-colors ${
      isSelected
        ? "border-[var(--accent-primary)] ring-1 ring-[var(--accent-primary)]/30"
        : "border-[var(--border-subtle)]"
    }`}>
      {/* Thumbnail */}
      <div className="aspect-video bg-[var(--bg-primary)] relative overflow-hidden">
        {/* Checkbox */}
        <label className="absolute top-2 left-2 z-10 cursor-pointer">
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
        {/* FULL CORPUS badge */}
        {isFC && (
          <span className="absolute bottom-2 left-2 px-1.5 py-0.5 text-[9px] font-mono font-bold rounded bg-purple-600/80 text-white uppercase tracking-wider">
            full corpus
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-[var(--text-muted)] truncate">
            {isFC ? result.s3_bucket : result.dataset_name}
          </span>
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

        {/* Copy links + Add to Lead */}
        <div className="flex items-center gap-2 pt-2 border-t border-[var(--border-subtle)]">
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

function BulkActionBar({
  selectedIds,
  results,
  onClear,
}: {
  selectedIds: Set<string>;
  results: UnifiedResult[];
  onClear: () => void;
}) {
  const [leads, setLeads] = useState<LeadOption[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LeadOption | null>(null);
  const [leadSearch, setLeadSearch] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
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

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

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

  // Toast only
  if (toast) {
    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg bg-[var(--accent-primary)] text-[var(--bg-primary)] font-mono text-sm shadow-xl flex items-center gap-2">
        <Check className="w-4 h-4" />
        {toast}
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-4">
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] shadow-2xl px-4 py-3 flex items-center gap-3">
        {/* Count */}
        <span className="text-sm font-mono text-[var(--text-primary)] whitespace-nowrap">
          {selectedIds.size} selected
        </span>

        <span className="text-[var(--text-muted)]">—</span>

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
          onClick={handleConfirm}
          disabled={!selectedLead || submitting}
          className="px-4 py-1.5 text-xs font-mono rounded-md bg-[var(--accent-primary)] text-[var(--bg-primary)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity whitespace-nowrap"
        >
          {submitting ? (
            <Loader2 className="w-3 h-3 animate-spin" />
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
  );
}
