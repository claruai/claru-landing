"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pencil,
  Trash2,
  Check,
  Minus,
  AlertTriangle,
  List,
  LayoutGrid,
  Star,
} from "lucide-react";
import type { Clip } from "@/types/data-catalog";
import SampleEditPanel from "./SampleEditPanel";
import BatchEditModal from "./BatchEditModal";
import SamplesGrid from "./SamplesGrid";
import SamplePreviewModal from "./SamplePreviewModal";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * AdminClip: a Clip record enriched with dataset_clips join metadata.
 * The API GET endpoint flattens these onto the clip object.
 */
export interface AdminClip extends Clip {
  /** The dataset_clips row ID (not the clip ID). */
  dataset_clip_id: string;
  /** Non-null when the clip is assigned to a specific lead. */
  lead_id: string | null;
  /** dataset_clips.is_showcase — controls visibility under share_mode='showcase'. */
  is_showcase: boolean;
  /** Who added this clip to the dataset. */
  added_by: string | null;
  /** Optional note from dataset_clips. */
  note: string | null;
  /** Presigned media URL injected by the API. */
  media_url?: string;
}

interface SamplesListProps {
  datasetId: string;
  refreshKey: number;
}

interface PaginatedResponse {
  samples: AdminClip[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  formatIssueCounts: Record<string, number>;
}

const PER_PAGE = 50;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SamplesList({ datasetId, refreshKey }: SamplesListProps) {
  const [samples, setSamples] = useState<AdminClip[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formatIssueCounts, setFormatIssueCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  /** Non-error feedback from a batch op (e.g. "X marked, Y skipped"). */
  const [batchInfo, setBatchInfo] = useState<string | null>(null);

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Edit panel
  const [editingSample, setEditingSample] = useState<AdminClip | null>(null);

  // Batch edit modal
  const [showBatchEdit, setShowBatchEdit] = useState(false);

  // Delete state
  const [confirmBatchDelete, setConfirmBatchDelete] = useState(false);
  const [batchDeleting, setBatchDeleting] = useState(false);

  // View mode (table or grid), persisted in sessionStorage
  const [viewMode, setViewMode] = useState<"table" | "grid">(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("admin-samples-view");
      return stored === "table" || stored === "grid" ? stored : "table";
    }
    return "table";
  });

  // Showcase-only filter, persisted in sessionStorage
  const [showcaseOnly, setShowcaseOnly] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("admin-samples-showcase-only") === "true";
    }
    return false;
  });

  useEffect(() => {
    sessionStorage.setItem("admin-samples-showcase-only", String(showcaseOnly));
  }, [showcaseOnly]);

  // Preview modal (grid view)
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  useEffect(() => {
    sessionStorage.setItem("admin-samples-view", viewMode);
  }, [viewMode]);

  // -----------------------------------------------------------------------
  // Fetch samples
  // -----------------------------------------------------------------------

  const fetchSamples = useCallback(
    async (p: number) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ page: String(p), per_page: String(PER_PAGE) });
        if (showcaseOnly) params.set("showcase", "true");
        const res = await fetch(
          `/api/admin/catalog/${datasetId}/samples?${params.toString()}`
        );
        if (!res.ok) throw new Error("Failed to fetch clips");
        const data: PaginatedResponse = await res.json();
        setSamples(data.samples);
        setTotal(data.total);
        setPage(data.page);
        setTotalPages(data.total_pages);
        setFormatIssueCounts(data.formatIssueCounts ?? {});
      } catch (err) {
        setSamples([]);
        setError(err instanceof Error ? err.message : "Failed to load clips");
      } finally {
        setLoading(false);
      }
    },
    [datasetId, showcaseOnly]
  );

  useEffect(() => {
    fetchSamples(1);
    // Reset to page 1 when refreshKey or showcase filter changes
  }, [fetchSamples, refreshKey]);

  // -----------------------------------------------------------------------
  // Selection
  // -----------------------------------------------------------------------

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    const currentPageIds = samples.map((s) => s.id);
    const allSelected = currentPageIds.every((id) => selectedIds.has(id));

    if (allSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        for (const id of currentPageIds) next.delete(id);
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        for (const id of currentPageIds) next.add(id);
        return next;
      });
    }
  }, [samples, selectedIds]);

  const currentPageAllSelected =
    samples.length > 0 && samples.every((s) => selectedIds.has(s.id));

  const selectedSamples = samples.filter((s) => selectedIds.has(s.id));

  // -----------------------------------------------------------------------
  // Batch delete
  // -----------------------------------------------------------------------

  const handleBatchDelete = useCallback(async () => {
    setBatchDeleting(true);
    const idsToDelete = Array.from(selectedIds);

    const results = await Promise.allSettled(
      idsToDelete.map(async (id) => {
        const res = await fetch(`/api/admin/catalog/${datasetId}/samples/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error(`Failed to delete ${id}`);
      })
    );

    const failed = results.filter((r) => r.status === "rejected").length;

    setSelectedIds(new Set());
    setConfirmBatchDelete(false);
    setBatchDeleting(false);
    if (failed > 0) {
      setError(`${failed} of ${idsToDelete.length} deletes failed`);
    }
    fetchSamples(page);
  }, [datasetId, selectedIds, fetchSamples, page]);

  // -----------------------------------------------------------------------
  // Showcase toggling — single + bulk. Both hit the existing PATCH endpoint
  // which honors is_showcase. Lead-bound clips are skipped (server returns
  // 404; we surface that count as "skipped" rather than as an error).
  // -----------------------------------------------------------------------

  const [batchShowcasing, setBatchShowcasing] = useState(false);

  const patchShowcaseOne = useCallback(
    async (clipId: string, value: boolean): Promise<"ok" | "skipped" | "failed"> => {
      const res = await fetch(
        `/api/admin/catalog/${datasetId}/samples/${clipId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_showcase: value }),
        },
      );
      if (res.ok) return "ok";
      if (res.status === 404) return "skipped"; // lead-bound clip
      return "failed";
    },
    [datasetId],
  );

  const handleToggleShowcase = useCallback(
    async (clip: AdminClip) => {
      if (clip.lead_id) return; // safety: lead-bound clips can't toggle showcase here
      const next = !clip.is_showcase;
      // Optimistic update
      setSamples((prev) =>
        prev.map((s) => (s.id === clip.id ? { ...s, is_showcase: next } : s)),
      );
      const result = await patchShowcaseOne(clip.id, next);
      if (result === "failed") {
        // Revert
        setSamples((prev) =>
          prev.map((s) => (s.id === clip.id ? { ...s, is_showcase: !next } : s)),
        );
        setError(`Failed to update showcase flag on ${clip.id.slice(0, 8)}`);
      }
    },
    [patchShowcaseOne],
  );

  // Monotonic counter — discard stale batch results when the user
  // rapidly clicks Mark / Unmark in succession.
  const batchSeqRef = useRef(0);

  const handleBatchShowcase = useCallback(
    async (makeShowcase: boolean) => {
      const ids = Array.from(selectedIds);
      if (ids.length === 0) return;
      const seq = ++batchSeqRef.current;
      setBatchShowcasing(true);
      setError(null);
      setBatchInfo(null);
      // Optimistic update for non-lead-bound clips
      setSamples((prev) =>
        prev.map((s) =>
          ids.includes(s.id) && !s.lead_id ? { ...s, is_showcase: makeShowcase } : s,
        ),
      );
      const results = await Promise.allSettled(
        ids.map((id) => patchShowcaseOne(id, makeShowcase)),
      );
      // If a newer batch fired while we were awaiting, drop our results.
      if (seq !== batchSeqRef.current) return;
      const tally = { ok: 0, skipped: 0, failed: 0 };
      for (const r of results) {
        if (r.status === "rejected") tally.failed++;
        else tally[r.value]++;
      }
      setBatchShowcasing(false);
      setSelectedIds(new Set());
      if (tally.failed > 0) {
        setError(
          `${tally.failed} of ${ids.length} showcase updates failed${
            tally.skipped > 0 ? ` (${tally.skipped} skipped — lead-bound)` : ""
          }`,
        );
      } else if (tally.skipped > 0) {
        // Surface the skipped count even on otherwise-success so the user
        // knows lead-bound clips didn't change.
        setBatchInfo(
          `${tally.ok} updated · ${tally.skipped} skipped (lead-bound clips can't be showcased here)`,
        );
      } else {
        setBatchInfo(`${tally.ok} clip${tally.ok === 1 ? "" : "s"} ${makeShowcase ? "marked as" : "removed from"} showcase`);
      }
      // Always re-fetch the page so the UI reflects authoritative server state
      // (defends against optimistic drift if the server applies side effects).
      fetchSamples(page);
    },
    [selectedIds, patchShowcaseOne, fetchSamples, page],
  );

  // -----------------------------------------------------------------------
  // Pagination
  // -----------------------------------------------------------------------

  const goToPage = useCallback(
    (p: number) => {
      if (p < 1 || p > totalPages) return;
      setSelectedIds(new Set());
      setConfirmBatchDelete(false);
      setPreviewIndex(null);
      fetchSamples(p);
    },
    [fetchSamples, totalPages]
  );

  // -----------------------------------------------------------------------
  // Helpers
  // -----------------------------------------------------------------------

  const truncate = (str: string | null | undefined, len: number) => {
    if (!str) return "\u2014";
    return str.length > len ? str.slice(0, len) + "\u2026" : str;
  };

  const metadataPreview = (meta: Record<string, unknown> | null) => {
    if (!meta) return "\u2014";
    const entries = Object.entries(meta).slice(0, 2);
    if (entries.length === 0) return "{}";
    return entries.map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join(", ");
  };

  // -----------------------------------------------------------------------
  // Render: Loading skeleton
  // -----------------------------------------------------------------------

  if (loading && samples.length === 0) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-10 rounded-md bg-[var(--bg-secondary)] animate-pulse"
          />
        ))}
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // Render: Empty state
  // -----------------------------------------------------------------------

  if (!loading && samples.length === 0 && total === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm font-mono text-[var(--text-muted)]">
          No clips yet. Add clips individually or import from CSV.
        </p>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <div className="space-y-4">
      {/* Header with count and view toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h4 className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
            Clips ({total})
          </h4>
          {showcaseOnly && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--accent-primary)]/15 text-[var(--accent-primary)]">
              <Star className="w-2.5 h-2.5" fill="currentColor" />
              Showcase only
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {loading && <Loader2 className="w-4 h-4 animate-spin text-[var(--text-muted)]" />}

          {/* Showcase-only filter toggle */}
          <button
            type="button"
            onClick={() => setShowcaseOnly((v) => !v)}
            data-testid="showcase-only-filter"
            data-active={showcaseOnly ? "true" : "false"}
            title={showcaseOnly ? "Show all clips" : "Show showcase clips only"}
            className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-mono transition-colors ${
              showcaseOnly
                ? "border-[var(--accent-primary)] bg-[var(--accent-primary)] text-[var(--bg-primary)]"
                : "border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)]/40"
            }`}
          >
            <Star className="w-3 h-3" fill={showcaseOnly ? "currentColor" : "none"} />
            Showcase
          </button>

          <div className="flex items-center rounded-md border border-[var(--border-subtle)] overflow-hidden">
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 transition-colors ${
                viewMode === "table"
                  ? "bg-[var(--accent-primary)] text-[var(--bg-primary)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
              title="Table view"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 transition-colors ${
                viewMode === "grid"
                  ? "bg-[var(--accent-primary)] text-[var(--bg-primary)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
              title="Grid view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center justify-between rounded-md border border-[var(--error)] bg-[var(--error)]/10 px-4 py-2">
          <span className="text-xs font-mono text-[var(--error)]">{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Batch info banner (success / partial-skip feedback) */}
      {batchInfo && (
        <div
          data-testid="batch-info-banner"
          className="flex items-center justify-between rounded-md border border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 px-4 py-2"
        >
          <span className="text-xs font-mono text-[var(--accent-primary)]">{batchInfo}</span>
          <button
            onClick={() => setBatchInfo(null)}
            className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Batch action bar — visible in both table & grid view whenever clips are selected. */}
      {selectedIds.size > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-md border border-[var(--accent-primary)] bg-[var(--bg-secondary)] px-4 py-2">
          <span className="text-sm font-mono text-[var(--accent-primary)]">
            {selectedIds.size} selected
          </span>
          <button
            onClick={() => handleBatchShowcase(true)}
            disabled={batchShowcasing}
            data-testid="batch-mark-showcase"
            className="flex items-center gap-1 rounded-md border border-[var(--border-subtle)] px-3 py-1.5 text-xs font-mono text-[var(--accent-primary)] hover:border-[var(--accent-primary)] transition-colors disabled:opacity-50"
          >
            {batchShowcasing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Star className="w-3 h-3" fill="currentColor" />}
            Mark as Showcase
          </button>
          <button
            onClick={() => handleBatchShowcase(false)}
            disabled={batchShowcasing}
            data-testid="batch-unmark-showcase"
            className="flex items-center gap-1 rounded-md border border-[var(--border-subtle)] px-3 py-1.5 text-xs font-mono text-[var(--text-secondary)] hover:border-[var(--accent-primary)] transition-colors disabled:opacity-50"
          >
            <Star className="w-3 h-3" />
            Remove from Showcase
          </button>
          <button
            onClick={() => setShowBatchEdit(true)}
            className="flex items-center gap-1 rounded-md border border-[var(--border-subtle)] px-3 py-1.5 text-xs font-mono text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition-colors"
          >
            <Pencil className="w-3 h-3" />
            Edit Selected
          </button>
          {!confirmBatchDelete ? (
            <button
              onClick={() => setConfirmBatchDelete(true)}
              className="flex items-center gap-1 rounded-md border border-[var(--border-subtle)] px-3 py-1.5 text-xs font-mono text-[var(--error)] hover:border-[var(--error)] transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              Remove Selected
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[var(--error)]">
                Remove {selectedIds.size} clips from dataset?
              </span>
              <button
                onClick={handleBatchDelete}
                disabled={batchDeleting}
                className="flex items-center gap-1 rounded-md bg-[var(--error)] text-white px-3 py-1.5 text-xs font-mono font-semibold hover:opacity-90 disabled:opacity-50"
              >
                {batchDeleting && <Loader2 className="w-3 h-3 animate-spin" />}
                Confirm
              </button>
              <button
                onClick={() => setConfirmBatchDelete(false)}
                className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                Cancel
              </button>
            </div>
          )}
          <button
            onClick={() => setSelectedIds(new Set())}
            className="ml-auto text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            Clear
          </button>
        </div>
      )}

      {/* Table view */}
      {viewMode === "table" && (
        <div className="overflow-x-auto rounded-md border border-[var(--border-subtle)]">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="bg-[var(--bg-tertiary)]">
                <th className="px-3 py-2 text-left w-8">
                  <input
                    type="checkbox"
                    checked={currentPageAllSelected}
                    onChange={toggleSelectAll}
                    className="rounded border-[var(--border-subtle)] bg-[var(--bg-secondary)] accent-[var(--accent-primary)]"
                  />
                </th>
                <th className="px-3 py-2 text-left text-[var(--text-muted)]">S3 Key</th>
                <th className="px-3 py-2 text-center text-[var(--text-muted)] w-12">Ann.</th>
                <th className="px-3 py-2 text-center text-[var(--text-muted)] w-12">Specs</th>
                <th className="px-3 py-2 text-left text-[var(--text-muted)]">Metadata</th>
                <th className="px-3 py-2 text-center text-[var(--text-muted)] w-14">
                  <Star className="w-3 h-3 inline" aria-label="Showcase" />
                </th>
                <th className="px-3 py-2 text-center text-[var(--text-muted)] w-16">Issues</th>
                <th className="px-3 py-2 text-center text-[var(--text-muted)] w-12"></th>
              </tr>
            </thead>
            <tbody>
              {samples.map((sample, index) => {
                const issueCount = formatIssueCounts[sample.id] ?? 0;
                return (
                  <tr
                    key={sample.id}
                    onClick={() => setPreviewIndex(index)}
                    className="border-t border-[var(--border-subtle)] hover:bg-[var(--bg-secondary)] cursor-pointer transition-colors"
                  >
                    <td
                      className="px-3 py-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.has(sample.id)}
                        onChange={() => toggleSelect(sample.id)}
                        className="rounded border-[var(--border-subtle)] bg-[var(--bg-secondary)] accent-[var(--accent-primary)]"
                      />
                    </td>
                    <td className="px-3 py-2 text-[var(--text-primary)] max-w-[300px]">
                      <div className="flex items-center gap-2">
                        <span className="truncate">
                          {truncate(sample.s3_key ?? sample.filename, 60)}
                        </span>
                        {sample.lead_id && (
                          <span className="inline-flex items-center shrink-0 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                            LEAD-SPECIFIC
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center">
                      {sample.ann_annotation_key ? (
                        <Check className="w-3 h-3 mx-auto text-[var(--accent-primary)]" />
                      ) : (
                        <Minus className="w-3 h-3 mx-auto text-[var(--text-muted)]" />
                      )}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {sample.ann_specs_key ? (
                        <Check className="w-3 h-3 mx-auto text-[var(--accent-primary)]" />
                      ) : (
                        <Minus className="w-3 h-3 mx-auto text-[var(--text-muted)]" />
                      )}
                    </td>
                    <td className="px-3 py-2 text-[var(--text-secondary)] max-w-[200px] truncate">
                      {metadataPreview(sample.ann_metadata)}
                    </td>
                    <td className="px-3 py-2 text-center" onClick={(e) => e.stopPropagation()}>
                      <ShowcaseToggle
                        datasetId={datasetId}
                        clipId={sample.id}
                        initial={!!sample.is_showcase}
                        disabled={!!sample.lead_id}
                        onChange={(val) => {
                          setSamples((prev) =>
                            prev.map((s) => (s.id === sample.id ? { ...s, is_showcase: val } : s)),
                          );
                        }}
                      />
                    </td>
                    <td className="px-3 py-2 text-center">
                      {issueCount > 0 ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] bg-[var(--error)]/20 text-[var(--error)]">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          {issueCount}
                        </span>
                      ) : (
                        <span className="text-[var(--text-muted)]">{"\u2014"}</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setEditingSample(sample)}
                        className="text-[10px] font-mono text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
                      >
                        [edit]
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Grid view */}
      {viewMode === "grid" && (
        <SamplesGrid
          samples={samples}
          onSelectSample={(_sample, index) => setPreviewIndex(index)}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onToggleShowcase={handleToggleShowcase}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
            className="flex items-center gap-1 rounded-md border border-[var(--border-subtle)] px-3 py-1.5 text-xs font-mono text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition-colors disabled:opacity-40"
          >
            <ChevronLeft className="w-3 h-3" />
            Previous
          </button>
          <span className="text-xs font-mono text-[var(--text-muted)]">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages}
            className="flex items-center gap-1 rounded-md border border-[var(--border-subtle)] px-3 py-1.5 text-xs font-mono text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition-colors disabled:opacity-40"
          >
            Next
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Edit panel */}
      {editingSample && (
        <SampleEditPanel
          sample={editingSample}
          datasetId={datasetId}
          onSave={() => {
            setEditingSample(null);
            fetchSamples(page);
          }}
          onClose={() => setEditingSample(null)}
          onDelete={() => {
            setEditingSample(null);
            setSelectedIds((prev) => {
              const next = new Set(prev);
              next.delete(editingSample.id);
              return next;
            });
            fetchSamples(page);
          }}
        />
      )}

      {/* Batch edit modal */}
      {showBatchEdit && selectedSamples.length > 0 && (
        <BatchEditModal
          selectedSamples={selectedSamples}
          datasetId={datasetId}
          onSave={() => {
            setShowBatchEdit(false);
            setSelectedIds(new Set());
            fetchSamples(page);
          }}
          onClose={() => setShowBatchEdit(false)}
        />
      )}

      {/* Preview modal (grid view) */}
      {previewIndex !== null && (
        <SamplePreviewModal
          samples={samples}
          selectedIndex={previewIndex}
          onClose={() => setPreviewIndex(null)}
          onNavigate={(index) => setPreviewIndex(index)}
          onEdit={(sample) => {
            setPreviewIndex(null);
            setEditingSample(sample);
          }}
          onToggleShowcase={handleToggleShowcase}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ShowcaseToggle — star button that PATCHes dataset_clips.is_showcase
// ---------------------------------------------------------------------------

function ShowcaseToggle({
  datasetId,
  clipId,
  initial,
  disabled,
  onChange,
}: {
  datasetId: string;
  clipId: string;
  initial: boolean;
  disabled?: boolean;
  onChange?: (val: boolean) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [on, setOn] = useState(initial);

  useEffect(() => setOn(initial), [initial]);

  const toggle = async () => {
    if (busy || disabled) return;
    const next = !on;
    setBusy(true);
    setOn(next); // optimistic
    try {
      // The existing PATCH endpoint accepts is_showcase under the sampleId
      // segment; it routes to dataset_clips when is_showcase is the only field.
      const res = await fetch(`/api/admin/catalog/${datasetId}/samples/${clipId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_showcase: next }),
      });
      if (!res.ok) {
        // revert on failure
        setOn(!next);
      } else {
        onChange?.(next);
      }
    } catch {
      setOn(!next);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={disabled || busy}
      title={
        disabled
          ? "Lead-specific clip — toggle showcase on the base attachment instead"
          : on
            ? "Showcase clip (click to remove)"
            : "Not a showcase clip (click to mark)"
      }
      data-testid={`showcase-toggle-${clipId}`}
      data-showcase={on ? "true" : "false"}
      className={`inline-flex items-center justify-center w-7 h-7 rounded transition-colors ${
        on
          ? "text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10"
          : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
      } ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <Star className="w-4 h-4" fill={on ? "currentColor" : "none"} />
    </button>
  );
}
