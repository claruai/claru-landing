"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import type { Job } from "@/types/job";
import { JOB_CATEGORIES } from "@/types/job";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type SortKey =
  | "title"
  | "category"
  | "compensation"
  | "datePosted"
  | "status";

type SortDirection = "asc" | "desc";

interface AdminJobsTableProps {
  jobs: Job[];
}

interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Format an ISO date string as YYYY-MM-DD. */
function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toISOString().slice(0, 10);
}

/** Render a human-readable category label. */
function categoryLabel(category: string): string {
  return (
    JOB_CATEGORIES[category as keyof typeof JOB_CATEGORIES] ?? category
  );
}

/* ------------------------------------------------------------------ */
/*  Toast component                                                    */
/* ------------------------------------------------------------------ */

function ToastContainer({ toasts }: { toasts: Toast[] }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-lg font-mono text-sm shadow-lg border animate-toast-in ${
            toast.type === "success"
              ? "bg-[var(--bg-secondary)] text-[var(--accent-primary)] border-[var(--accent-primary)]/30"
              : "bg-[var(--bg-secondary)] text-red-400 border-red-400/30"
          }`}
        >
          {toast.type === "success" ? "> " : "! "}
          {toast.message}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * Interactive admin table for managing job listings.
 *
 * Supports column sorting, search filtering, status badges, and
 * archive/unarchive actions with optimistic updates and toast feedback.
 */
export default function AdminJobsTable({ jobs: initialJobs }: AdminJobsTableProps) {
  /* ----- state ---------------------------------------------------- */
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("datePosted");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");
  const [pendingSlugs, setPendingSlugs] = useState<Set<string>>(new Set());
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);

  /** Keep local state in sync when the parent re-renders with new data. */
  useEffect(() => {
    setJobs(initialJobs);
  }, [initialJobs]);

  /* ----- toast helpers --------------------------------------------- */
  const addToast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  /* ----- derived -------------------------------------------------- */
  const filtered = useMemo(() => {
    if (!search.trim()) return jobs;
    const q = search.toLowerCase();
    return jobs.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        categoryLabel(j.category).toLowerCase().includes(q)
    );
  }, [jobs, search]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "title":
          cmp = a.title.localeCompare(b.title);
          break;
        case "category":
          cmp = categoryLabel(a.category).localeCompare(
            categoryLabel(b.category)
          );
          break;
        case "compensation":
          cmp = a.compensationMin - b.compensationMin;
          break;
        case "datePosted":
          cmp =
            new Date(a.datePosted).getTime() -
            new Date(b.datePosted).getTime();
          break;
        case "status":
          cmp = Number(a.archived) - Number(b.archived);
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [filtered, sortKey, sortDir]);

  const activeCount = useMemo(
    () => jobs.filter((j) => !j.archived).length,
    [jobs]
  );
  const archivedCount = useMemo(
    () => jobs.filter((j) => j.archived).length,
    [jobs]
  );

  /* ----- handlers ------------------------------------------------- */
  const handleSort = useCallback(
    (key: SortKey) => {
      if (sortKey === key) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortKey(key);
        setSortDir("asc");
      }
    },
    [sortKey]
  );

  const handleArchiveToggle = useCallback(
    async (job: Job) => {
      const action = job.archived ? "restore" : "archive";
      const confirmMessage = job.archived
        ? `Restore "${job.title}"? It will appear on the public job board.`
        : `Archive "${job.title}"? It will be hidden from the public job board.`;

      if (!window.confirm(confirmMessage)) return;

      // Mark this slug as pending (disable button while in-flight)
      setPendingSlugs((prev) => new Set(prev).add(job.slug));

      // Optimistic update: toggle archived in local state immediately
      const previousJobs = jobs;
      setJobs((prev) =>
        prev.map((j) =>
          j.slug === job.slug ? { ...j, archived: !j.archived } : j
        )
      );

      try {
        const res = await fetch(`/api/admin/jobs/${job.slug}/archive`, {
          method: "POST",
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({ error: "Unknown error" }));
          throw new Error(body.error ?? `HTTP ${res.status}`);
        }

        // Replace the optimistic value with the server response
        const updated: Job = await res.json();
        setJobs((prev) =>
          prev.map((j) => (j.slug === updated.slug ? updated : j))
        );

        addToast(
          action === "archive" ? "Job archived" : "Job restored",
          "success"
        );
      } catch (err) {
        // Roll back optimistic update
        setJobs(previousJobs);
        addToast(
          `Failed to ${action}: ${err instanceof Error ? err.message : "unknown error"}`,
          "error"
        );
      } finally {
        setPendingSlugs((prev) => {
          const next = new Set(prev);
          next.delete(job.slug);
          return next;
        });
      }
    },
    [jobs, addToast]
  );

  /* ----- sort arrow indicator ------------------------------------- */
  const arrow = (key: SortKey) => {
    if (sortKey !== key) return null;
    return (
      <span className="ml-1 text-[var(--accent-primary)]">
        {sortDir === "asc" ? "\u2191" : "\u2193"}
      </span>
    );
  };

  /* ----- column header helper ------------------------------------- */
  const th = (label: string, key: SortKey, extraClass?: string) => (
    <th
      className={`px-4 py-3 text-left text-xs font-mono uppercase tracking-wider text-[var(--text-tertiary)] cursor-pointer select-none hover:text-[var(--text-secondary)] transition-colors duration-150 ${extraClass ?? ""}`}
      onClick={() => handleSort(key)}
    >
      {label}
      {arrow(key)}
    </th>
  );

  /* ----- render --------------------------------------------------- */
  return (
    <div className="px-6 py-6 space-y-5">
      {/* Search + summary row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Search input */}
        <div className="relative w-full sm:max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-mono text-sm pointer-events-none">
            $
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="search jobs..."
            className="w-full pl-7 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition-colors duration-200"
          />
        </div>

        {/* Job count summary */}
        <p className="text-xs font-mono text-[var(--text-muted)] whitespace-nowrap">
          <span className="text-[var(--accent-primary)]">{activeCount}</span>{" "}
          active,{" "}
          <span className="text-[var(--text-tertiary)]">{archivedCount}</span>{" "}
          archived,{" "}
          <span className="text-[var(--text-secondary)]">{jobs.length}</span>{" "}
          total
        </p>
      </div>

      {/* Table wrapper -- horizontal scroll on mobile */}
      <div className="overflow-x-auto rounded-lg border border-[var(--border-subtle)]">
        <table className="w-full min-w-[720px] font-mono text-sm">
          <thead className="border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
            <tr>
              {th("Title", "title")}
              {th("Category", "category")}
              {th("Compensation", "compensation")}
              {th("Date Posted", "datePosted")}
              {th("Status", "status")}
              <th className="px-4 py-3 text-left text-xs font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--border-subtle)]">
            {sorted.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-sm text-[var(--text-muted)]"
                >
                  {search.trim()
                    ? "no jobs matching query"
                    : "no job listings found"}
                </td>
              </tr>
            ) : (
              sorted.map((job) => {
                const isPending = pendingSlugs.has(job.slug);

                return (
                  <tr
                    key={job.slug}
                    className="hover:bg-[var(--bg-secondary)] transition-colors duration-150"
                  >
                    {/* Title */}
                    <td className="px-4 py-3 text-[var(--text-primary)] font-medium">
                      {job.title}
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3 text-[var(--text-secondary)]">
                      {categoryLabel(job.category)}
                    </td>

                    {/* Compensation */}
                    <td className="px-4 py-3 text-[var(--text-secondary)]">
                      ${job.compensationMin}&ndash;${job.compensationMax}/hr
                    </td>

                    {/* Date Posted */}
                    <td className="px-4 py-3 text-[var(--text-muted)]">
                      {formatDate(job.datePosted)}
                    </td>

                    {/* Status badge */}
                    <td className="px-4 py-3">
                      {job.archived ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/5 text-[var(--text-muted)] border border-[var(--border-subtle)]">
                          Archived
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20">
                          Active
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/jobs/${job.slug}/edit`}
                          className="text-xs text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors duration-150"
                        >
                          [edit]
                        </Link>
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => handleArchiveToggle(job)}
                          className={`text-xs transition-colors duration-150 ${
                            isPending
                              ? "text-[var(--text-muted)]/50 cursor-wait"
                              : "text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                          }`}
                        >
                          {isPending
                            ? "[...]"
                            : job.archived
                              ? "[unarchive]"
                              : "[archive]"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} />

      {/* Toast animation keyframes (injected once) */}
      <style jsx global>{`
        @keyframes toast-in {
          from {
            opacity: 0;
            transform: translateY(8px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-toast-in {
          animation: toast-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
