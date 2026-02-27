"use client";

import { useCallback, useEffect, useState } from "react";
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
} from "lucide-react";
import type { DatasetSample } from "@/types/data-catalog";
import SampleEditPanel from "./SampleEditPanel";
import BatchEditModal from "./BatchEditModal";
import SamplesGrid from "./SamplesGrid";
import SamplePreviewModal from "./SamplePreviewModal";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SamplesListProps {
  datasetId: string;
  refreshKey: number;
}

interface PaginatedResponse {
  samples: DatasetSample[];
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
  const [samples, setSamples] = useState<DatasetSample[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formatIssueCounts, setFormatIssueCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Edit panel
  const [editingSample, setEditingSample] = useState<DatasetSample | null>(null);

  // Batch edit modal
  const [showBatchEdit, setShowBatchEdit] = useState(false);

  // Delete state
  const [confirmBatchDelete, setConfirmBatchDelete] = useState(false);
  const [batchDeleting, setBatchDeleting] = useState(false);

  // View mode (table or grid), persisted in sessionStorage
  const [viewMode, setViewMode] = useState<"table" | "grid">(() => {
    if (typeof window !== "undefined") {
      return (sessionStorage.getItem("admin-samples-view") as "table" | "grid") ?? "table";
    }
    return "table";
  });

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
        const res = await fetch(
          `/api/admin/catalog/${datasetId}/samples?page=${p}&per_page=${PER_PAGE}`
        );
        if (!res.ok) throw new Error("Failed to fetch samples");
        const data: PaginatedResponse = await res.json();
        setSamples(data.samples);
        setTotal(data.total);
        setPage(data.page);
        setTotalPages(data.total_pages);
        setFormatIssueCounts(data.formatIssueCounts ?? {});
      } catch (err) {
        setSamples([]);
        setError(err instanceof Error ? err.message : "Failed to load samples");
      } finally {
        setLoading(false);
      }
    },
    [datasetId]
  );

  useEffect(() => {
    fetchSamples(1);
    // Reset to page 1 when refreshKey changes
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
  // Pagination
  // -----------------------------------------------------------------------

  const goToPage = useCallback(
    (p: number) => {
      if (p < 1 || p > totalPages) return;
      setSelectedIds(new Set());
      setConfirmBatchDelete(false);
      fetchSamples(p);
    },
    [fetchSamples, totalPages]
  );

  // -----------------------------------------------------------------------
  // Helpers
  // -----------------------------------------------------------------------

  const truncate = (str: string | null | undefined, len: number) => {
    if (!str) return "—";
    return str.length > len ? str.slice(0, len) + "…" : str;
  };

  const metadataPreview = (meta: Record<string, unknown> | null) => {
    if (!meta) return "—";
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
          No samples yet. Add samples individually or import from CSV.
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
        <h4 className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
          Samples ({total})
        </h4>
        <div className="flex items-center gap-2">
          {loading && <Loader2 className="w-4 h-4 animate-spin text-[var(--text-muted)]" />}
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

      {/* Batch action bar (table view only) */}
      {viewMode === "table" && selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-md border border-[var(--accent-primary)] bg-[var(--bg-secondary)] px-4 py-2">
          <span className="text-sm font-mono text-[var(--accent-primary)]">
            {selectedIds.size} selected
          </span>
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
              Delete Selected
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[var(--error)]">
                Delete {selectedIds.size} samples?
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
                <th className="px-3 py-2 text-left text-[var(--text-muted)]">S3 Object Key</th>
                <th className="px-3 py-2 text-center text-[var(--text-muted)] w-12">Ann.</th>
                <th className="px-3 py-2 text-center text-[var(--text-muted)] w-12">Specs</th>
                <th className="px-3 py-2 text-left text-[var(--text-muted)]">Metadata</th>
                <th className="px-3 py-2 text-center text-[var(--text-muted)] w-16">Issues</th>
              </tr>
            </thead>
            <tbody>
              {samples.map((sample) => {
                const issueCount = formatIssueCounts[sample.id] ?? 0;
                return (
                  <tr
                    key={sample.id}
                    onClick={() => setEditingSample(sample)}
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
                    <td className="px-3 py-2 text-[var(--text-primary)] max-w-[300px] truncate">
                      {truncate(sample.s3_object_key ?? sample.filename, 60)}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {sample.s3_annotation_key ? (
                        <Check className="w-3 h-3 mx-auto text-[var(--accent-primary)]" />
                      ) : (
                        <Minus className="w-3 h-3 mx-auto text-[var(--text-muted)]" />
                      )}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {sample.s3_specs_key ? (
                        <Check className="w-3 h-3 mx-auto text-[var(--accent-primary)]" />
                      ) : (
                        <Minus className="w-3 h-3 mx-auto text-[var(--text-muted)]" />
                      )}
                    </td>
                    <td className="px-3 py-2 text-[var(--text-secondary)] max-w-[200px] truncate">
                      {metadataPreview(sample.metadata_json)}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {issueCount > 0 ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] bg-[var(--error)]/20 text-[var(--error)]">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          {issueCount}
                        </span>
                      ) : (
                        <span className="text-[var(--text-muted)]">—</span>
                      )}
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
          onSelectSample={(sample, index) => setPreviewIndex(index)}
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
        />
      )}
    </div>
  );
}
