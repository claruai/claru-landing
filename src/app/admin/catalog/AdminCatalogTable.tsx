"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import type { Dataset, DatasetCategory, DatasetType } from "@/types/data-catalog";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type SortKey =
  | "name"
  | "category"
  | "type"
  | "subcategory"
  | "total_samples"
  | "is_published"
  | "updated_at"
  | "created_at";
type SortDirection = "asc" | "desc";
type ScopeFilter = "all" | "general" | "lead";

interface DatasetWithCategory extends Dataset {
  dataset_categories: { name: string } | null;
}

type LeadRef = { id: string; name: string; company: string };

interface AdminCatalogTableProps {
  datasets: DatasetWithCategory[];
  categories: DatasetCategory[];
  sampleCounts?: Record<string, number>;
  leadsByDataset?: Record<string, LeadRef[]>;
}

function isLeadSpecific(d: DatasetWithCategory): boolean {
  return d.source_type === "curated";
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const TYPE_LABELS: Record<DatasetType, string> = {
  short_form: "Short Form",
  long_form: "Long Form",
  cinematic: "Cinematic",
  game_capture: "Game Capture",
  evaluation: "Evaluation",
  annotation: "Annotation",
  moderation: "Moderation",
  preference: "Preference",
  classification: "Classification",
  instruction: "Instruction",
  generation: "Generation",
};

function publishedBadge(isPublished: boolean) {
  if (isPublished) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20">
        Published
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-500/10 text-neutral-400 border border-neutral-500/20">
      Draft
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * Interactive admin table for viewing and filtering catalog datasets.
 *
 * Features:
 * - Category filter dropdown
 * - Search filtering by name
 * - Column sorting with visual indicators
 * - Summary stats bar
 * - Row links to /admin/catalog/[id] edit pages
 */
export default function AdminCatalogTable({
  datasets,
  categories,
  sampleCounts = {},
  leadsByDataset = {},
}: AdminCatalogTableProps) {
  /* ----- state ---------------------------------------------------- */
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("updated_at");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [scopeFilter, setScopeFilter] = useState<ScopeFilter>("all");

  /* ----- counts --------------------------------------------------- */
  const counts = useMemo(() => {
    let published = 0;
    let draft = 0;
    let general = 0;
    let lead = 0;
    for (const d of datasets) {
      if (d.is_published) published++;
      else draft++;
      if (isLeadSpecific(d)) lead++;
      else general++;
    }
    return { total: datasets.length, published, draft, general, lead };
  }, [datasets]);

  /* ----- derived: filter by scope (general / lead-specific) -------- */
  const scopeFiltered = useMemo(() => {
    if (scopeFilter === "all") return datasets;
    if (scopeFilter === "lead") return datasets.filter(isLeadSpecific);
    return datasets.filter((d) => !isLeadSpecific(d));
  }, [datasets, scopeFilter]);

  /* ----- derived: filter by category ------------------------------ */
  const categoryFiltered = useMemo(() => {
    if (categoryFilter === "all") return scopeFiltered;
    return scopeFiltered.filter((d) => d.category_id === categoryFilter);
  }, [scopeFiltered, categoryFilter]);

  /* ----- derived: filter by search -------------------------------- */
  const searchFiltered = useMemo(() => {
    if (!search.trim()) return categoryFiltered;
    const q = search.toLowerCase();
    return categoryFiltered.filter((d) =>
      d.name.toLowerCase().includes(q)
    );
  }, [categoryFiltered, search]);

  /* ----- derived: sort -------------------------------------------- */
  const sorted = useMemo(() => {
    const copy = [...searchFiltered];
    copy.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "category":
          cmp = (a.dataset_categories?.name ?? "").localeCompare(
            b.dataset_categories?.name ?? ""
          );
          break;
        case "type":
          cmp = a.type.localeCompare(b.type);
          break;
        case "subcategory":
          cmp = a.subcategory.localeCompare(b.subcategory);
          break;
        case "total_samples":
          cmp = a.total_samples - b.total_samples;
          break;
        case "is_published":
          cmp = Number(a.is_published) - Number(b.is_published);
          break;
        case "updated_at":
          cmp =
            new Date(a.updated_at ?? 0).getTime() -
            new Date(b.updated_at ?? 0).getTime();
          break;
        case "created_at":
          cmp =
            new Date(a.created_at ?? 0).getTime() -
            new Date(b.created_at ?? 0).getTime();
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [searchFiltered, sortKey, sortDir]);

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
      key={key}
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
      {/* Summary stats */}
      <div className="flex flex-wrap gap-6 px-4 py-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
        <div className="font-mono text-sm">
          <span className="text-[var(--text-muted)] text-xs uppercase tracking-wider">
            Total
          </span>
          <p className="text-lg text-[var(--text-primary)] font-semibold">
            {counts.total}
          </p>
        </div>
        <div className="font-mono text-sm">
          <span className="text-[var(--text-muted)] text-xs uppercase tracking-wider">
            Published
          </span>
          <p className="text-lg text-[var(--accent-primary)] font-semibold">
            {counts.published}
          </p>
        </div>
        <div className="font-mono text-sm">
          <span className="text-[var(--text-muted)] text-xs uppercase tracking-wider">
            Draft
          </span>
          <p className="text-lg text-neutral-400 font-semibold">
            {counts.draft}
          </p>
        </div>
        <div className="font-mono text-sm">
          <span className="text-[var(--text-muted)] text-xs uppercase tracking-wider">
            General
          </span>
          <p className="text-lg text-[var(--text-primary)] font-semibold">
            {counts.general}
          </p>
        </div>
        <div className="font-mono text-sm">
          <span className="text-[var(--text-muted)] text-xs uppercase tracking-wider">
            Lead-specific
          </span>
          <p className="text-lg text-[var(--text-primary)] font-semibold">
            {counts.lead}
          </p>
        </div>
      </div>

      {/* Scope tabs: All / General / Lead-specific */}
      <div className="flex items-center gap-1 p-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] w-fit">
        {(
          [
            { key: "all", label: `All (${counts.total})` },
            { key: "general", label: `General (${counts.general})` },
            { key: "lead", label: `Lead-specific (${counts.lead})` },
          ] as const
        ).map((tab) => {
          const active = scopeFilter === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setScopeFilter(tab.key)}
              className={`px-3 py-1.5 rounded-md font-mono text-xs uppercase tracking-wider transition-colors duration-150 ${
                active
                  ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] border border-transparent"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Filters: Category dropdown + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Category filter */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
            Category
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg font-mono text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition-colors duration-200"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-mono text-sm pointer-events-none">
            $
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="search datasets..."
            className="w-full pl-7 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition-colors duration-200"
          />
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs font-mono text-[var(--text-muted)]">
        showing{" "}
        <span className="text-[var(--text-secondary)]">{sorted.length}</span>{" "}
        {sorted.length === 1 ? "dataset" : "datasets"}
        {search.trim() && (
          <>
            {" "}
            matching &ldquo;
            <span className="text-[var(--accent-primary)]">{search}</span>
            &rdquo;
          </>
        )}
      </p>

      {/* Table wrapper -- horizontal scroll on mobile */}
      <div className="overflow-x-auto rounded-lg border border-[var(--border-subtle)]">
        <table className="w-full min-w-[1200px] font-mono text-sm">
          <thead className="border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
            <tr>
              {th("Name", "name")}
              {th("Category", "category")}
              {th("Type", "type")}
              {th("Size", "total_samples")}
              <th className="px-4 py-3 text-left text-xs font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                Lead
              </th>
              {th("Uploaded", "created_at")}
              {th("Updated", "updated_at")}
              {th("Published", "is_published")}
              <th className="px-4 py-3 text-left text-xs font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--border-subtle)]">
            {sorted.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-12 text-center text-sm text-[var(--text-muted)]"
                >
                  {search.trim()
                    ? "no datasets matching query"
                    : "no datasets found"}
                </td>
              </tr>
            ) : (
              sorted.map((dataset) => {
                const leads = leadsByDataset[dataset.id] ?? [];
                const leadSpecific = isLeadSpecific(dataset);
                return (
                <tr
                  key={dataset.id}
                  className="hover:bg-[var(--bg-secondary)] transition-colors duration-150"
                >
                  {/* Name */}
                  <td className="px-4 py-3 text-[var(--text-primary)] font-medium">
                    <Link
                      href={`/admin/catalog/${dataset.id}`}
                      className="hover:text-[var(--accent-primary)] transition-colors duration-150"
                    >
                      {dataset.name}
                    </Link>
                    {leadSpecific && (
                      <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20">
                        curated
                      </span>
                    )}
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3 text-[var(--text-secondary)]">
                    {dataset.dataset_categories?.name ?? "\u2014"}
                  </td>

                  {/* Type */}
                  <td className="px-4 py-3 text-[var(--text-secondary)]">
                    {TYPE_LABELS[dataset.type] ?? dataset.type}
                  </td>

                  {/* Dataset Size + actual sample count */}
                  <td className="px-4 py-3 tabular-nums">
                    <span className="text-[var(--text-secondary)]">
                      {dataset.total_samples.toLocaleString()}
                    </span>
                    {" "}
                    <span className={`text-[10px] font-mono ${
                      (sampleCounts[dataset.id] ?? 0) > 0
                        ? "text-[var(--accent-primary)]"
                        : "text-[var(--text-muted)]"
                    }`}>
                      ({sampleCounts[dataset.id] ?? 0} clips)
                    </span>
                  </td>

                  {/* Lead(s) */}
                  <td className="px-4 py-3 text-xs">
                    {leads.length === 0 ? (
                      <span className="text-[var(--text-muted)]">{"\u2014"}</span>
                    ) : (
                      <div className="flex flex-col gap-0.5">
                        {leads.slice(0, 2).map((l) => (
                          <span
                            key={l.id}
                            className="text-[var(--text-secondary)] truncate max-w-[180px]"
                            title={`${l.name} \u2014 ${l.company}`}
                          >
                            {l.name}
                            {l.company ? (
                              <span className="text-[var(--text-muted)]">
                                {" \u00b7 "}
                                {l.company}
                              </span>
                            ) : null}
                          </span>
                        ))}
                        {leads.length > 2 && (
                          <span className="text-[var(--text-muted)]">
                            +{leads.length - 2} more
                          </span>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Uploaded / created */}
                  <td
                    className="px-4 py-3 text-xs text-[var(--text-muted)] tabular-nums whitespace-nowrap"
                    title={dataset.created_at ?? ""}
                  >
                    {formatDate(dataset.created_at)}
                  </td>

                  {/* Updated */}
                  <td
                    className="px-4 py-3 text-xs text-[var(--text-muted)] tabular-nums whitespace-nowrap"
                    title={dataset.updated_at ?? ""}
                  >
                    {formatDate(dataset.updated_at)}
                  </td>

                  {/* Published badge */}
                  <td className="px-4 py-3">
                    {publishedBadge(dataset.is_published)}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/catalog/${dataset.id}`}
                      className="text-xs text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors duration-150"
                    >
                      [edit]
                    </Link>
                  </td>
                </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
