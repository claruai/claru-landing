"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Dataset {
  id: string;
  name: string;
}

interface SearchResult {
  sample_id: string;
  dataset_id: string;
  dataset_name: string;
  similarity: number;
  scene_summary: string | null;
  environments: string[];
  activities: string[];
  objects: string[];
  camera_perspective: string | null;
  signed_url: string | null;
  mime_type: string;
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
}: {
  datasets: Dataset[];
}) {
  const [query, setQuery] = useState("");
  const [datasetFilter, setDatasetFilter] = useState("");
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) return;

      setLoading(true);
      setError(null);
      setResults(null);

      try {
        const res = await fetch("/api/admin/catalog/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: searchQuery,
            dataset_id: datasetFilter || undefined,
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
    [datasetFilter],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(query);
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
    runSearch(example);
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
        {/* Search form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Semantic search across all samples..."
                className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-md font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors duration-150"
              />
            </div>
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
                <ResultCard key={r.sample_id} result={r} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Result Card
// ---------------------------------------------------------------------------

function ResultCard({ result }: { result: SearchResult }) {
  const similarityPct = Math.round(result.similarity * 100);
  const isVideo = result.mime_type?.startsWith("video/");

  return (
    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] overflow-hidden">
      {/* Thumbnail */}
      <div className="aspect-video bg-[var(--bg-primary)] relative overflow-hidden">
        {result.signed_url ? (
          isVideo ? (
            <video
              src={result.signed_url}
              preload="none"
              muted
              className="w-full h-full object-cover"
              onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
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
              alt={result.scene_summary ?? "Sample"}
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
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-[var(--text-muted)] truncate">
            {result.dataset_name}
          </span>
        </div>

        {result.scene_summary ? (
          <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
            {result.scene_summary}
          </p>
        ) : (
          <p className="text-sm text-[var(--text-muted)] italic">
            Not yet enriched
          </p>
        )}

        {/* Tags */}
        {(result.environments.length > 0 || result.activities.length > 0) && (
          <div className="flex flex-wrap gap-1">
            {result.environments.slice(0, 2).map((env) => (
              <span
                key={env}
                className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]"
              >
                {env}
              </span>
            ))}
            {result.activities.slice(0, 2).map((act) => (
              <span
                key={act}
                className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-blue-500/10 text-blue-400"
              >
                {act}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
