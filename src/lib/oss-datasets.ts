// ---------------------------------------------------------------------------
// OSS Datasets — Server-side data fetching from Supabase
// ---------------------------------------------------------------------------

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { OSSDataset, FilterOptions, FilterOption } from "@/types/oss-datasets";

const COLUMNS = `
  id, dataset_id, slug, name, description, parent_project, author,
  modalities, robot_embodiments, action_space, environment_type,
  task_types, num_episodes, total_hours, license, annotation_types,
  data_format, year_released, paper_url, paper_title,
  physical_ai_relevance, hf_downloads, hf_likes, hf_last_modified,
  hf_tags, citation_count, citing_papers_sample,
  hf_discussion_count, hf_discussions_sample, hf_downloads_rank,
  reddit_posts, hn_posts,
  is_active, is_gated, is_private, extraction_completeness,
  card_text_source, last_crawled_at, last_verified_at,
  created_at, updated_at
`.replace(/\s+/g, " ").trim();

/**
 * Fetch all active OSS datasets (server-side, service role).
 * Returns full dataset list for client-side filtering.
 */
export async function fetchAllOSSDatasets(): Promise<OSSDataset[]> {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("oss_datasets")
    .select(COLUMNS)
    .eq("is_active", true)
    .eq("is_private", false)
    .order("hf_downloads", { ascending: false });

  if (error) {
    console.error("[oss-datasets] fetchAllOSSDatasets error:", error);
    return [];
  }

  return (data ?? []) as unknown as OSSDataset[];
}

/**
 * Fetch a single OSS dataset by slug.
 */
export async function fetchOSSDatasetBySlug(
  slug: string,
): Promise<OSSDataset | null> {
  if (!/^[a-z0-9][a-z0-9._-]*$/.test(slug)) return null;

  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("oss_datasets")
    .select(COLUMNS)
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data as unknown as OSSDataset;
}

/**
 * Fetch related datasets — same parent_project first, then overlapping modalities/tasks.
 */
export async function fetchRelatedDatasets(
  dataset: OSSDataset,
  limit: number = 6,
): Promise<OSSDataset[]> {
  const supabase = createSupabaseAdminClient();

  // Run both queries in parallel for faster TTFB
  const [parentResult, modalityResult] = await Promise.all([
    dataset.parent_project
      ? supabase
          .from("oss_datasets")
          .select(COLUMNS)
          .eq("parent_project", dataset.parent_project)
          .eq("is_active", true)
          .eq("is_private", false)
          .neq("slug", dataset.slug)
          .order("hf_downloads", { ascending: false })
          .limit(limit)
      : Promise.resolve({ data: null }),
    dataset.modalities.length > 0
      ? supabase
          .from("oss_datasets")
          .select(COLUMNS)
          .eq("is_active", true)
          .eq("is_private", false)
          .neq("slug", dataset.slug)
          .overlaps("modalities", dataset.modalities)
          .order("hf_downloads", { ascending: false })
          .limit(limit)
      : Promise.resolve({ data: null }),
  ]);

  // Merge and deduplicate — parent project results first
  const seen = new Set<string>([dataset.slug]);
  const results: OSSDataset[] = [];

  for (const d of (parentResult.data ?? []) as unknown as OSSDataset[]) {
    if (!seen.has(d.slug)) {
      results.push(d);
      seen.add(d.slug);
    }
  }
  for (const d of (modalityResult.data ?? []) as unknown as OSSDataset[]) {
    if (!seen.has(d.slug) && results.length < limit) {
      results.push(d);
      seen.add(d.slug);
    }
  }

  return results.slice(0, limit);
}

/**
 * Derive filter options from the full dataset list (client-side computation).
 */
export function deriveFilterOptions(datasets: OSSDataset[]): FilterOptions {
  const modalityCounts = new Map<string, number>();
  const embodimentCounts = new Map<string, number>();
  const environmentCounts = new Map<string, number>();
  const taskCounts = new Map<string, number>();
  const licenseCounts = new Map<string, number>();
  const formatCounts = new Map<string, number>();

  for (const ds of datasets) {
    for (const m of ds.modalities) {
      modalityCounts.set(m, (modalityCounts.get(m) ?? 0) + 1);
    }
    for (const e of ds.robot_embodiments) {
      embodimentCounts.set(e, (embodimentCounts.get(e) ?? 0) + 1);
    }
    for (const e of ds.environment_type) {
      environmentCounts.set(e, (environmentCounts.get(e) ?? 0) + 1);
    }
    for (const t of ds.task_types) {
      taskCounts.set(t, (taskCounts.get(t) ?? 0) + 1);
    }
    if (ds.license) {
      licenseCounts.set(ds.license, (licenseCounts.get(ds.license) ?? 0) + 1);
    }
    if (ds.data_format) {
      formatCounts.set(ds.data_format, (formatCounts.get(ds.data_format) ?? 0) + 1);
    }
  }

  const toOptions = (map: Map<string, number>): FilterOption[] =>
    Array.from(map.entries())
      .map(([value, count]) => ({
        value,
        label: value.replace(/_/g, " "),
        count,
      }))
      .sort((a, b) => b.count - a.count);

  return {
    modalities: toOptions(modalityCounts),
    robot_embodiments: toOptions(embodimentCounts),
    environment_type: toOptions(environmentCounts),
    task_types: toOptions(taskCounts),
    license: toOptions(licenseCounts),
    data_format: toOptions(formatCounts),
  };
}

/**
 * Client-side filter + search + sort logic.
 * All 421 datasets are loaded at once and filtered in-memory.
 */
export function filterAndSortDatasets(
  datasets: OSSDataset[],
  filters: {
    search: string;
    modalities: string[];
    robot_embodiments: string[];
    environment_type: string[];
    task_types: string[];
    license: string[];
    data_format: string[];
    sort: string;
  },
): OSSDataset[] {
  let result = [...datasets];

  // Text search (client-side) — searches name, description, structured arrays, and editorial fields
  if (filters.search && filters.search.length >= 2) {
    const q = filters.search.toLowerCase();
    const qUnderscored = q.replace(/\s+/g, "_"); // "force torque" → "force_torque"
    result = result.filter(
      (ds) =>
        ds.name.toLowerCase().includes(q) ||
        (ds.description ?? "").toLowerCase().includes(q) ||
        (ds.physical_ai_relevance ?? "").toLowerCase().includes(q) ||
        (ds.parent_project ?? "").toLowerCase().includes(q) ||
        (ds.author ?? "").toLowerCase().includes(q) ||
        ds.modalities.some((m) => m.toLowerCase().includes(q) || m.toLowerCase().includes(qUnderscored)) ||
        ds.robot_embodiments.some((r) => r.toLowerCase().includes(q)) ||
        ds.task_types.some((t) => t.toLowerCase().includes(q) || t.toLowerCase().includes(qUnderscored)) ||
        ds.environment_type.some((e) => e.toLowerCase().includes(q)) ||
        (ds.action_space ?? "").toLowerCase().includes(q) ||
        (ds.data_format ?? "").toLowerCase().includes(q) ||
        (ds.license ?? "").toLowerCase().includes(q),
    );
  }

  // Array containment filters (AND within each facet)
  if (filters.modalities.length > 0) {
    result = result.filter((ds) =>
      filters.modalities.every((m) => ds.modalities.includes(m)),
    );
  }
  if (filters.robot_embodiments.length > 0) {
    result = result.filter((ds) =>
      filters.robot_embodiments.every((e) => ds.robot_embodiments.includes(e)),
    );
  }
  if (filters.environment_type.length > 0) {
    result = result.filter((ds) =>
      filters.environment_type.every((e) => ds.environment_type.includes(e)),
    );
  }
  if (filters.task_types.length > 0) {
    result = result.filter((ds) =>
      filters.task_types.every((t) => ds.task_types.includes(t)),
    );
  }
  if (filters.license.length > 0) {
    result = result.filter((ds) =>
      ds.license ? filters.license.includes(ds.license) : false,
    );
  }
  if (filters.data_format.length > 0) {
    result = result.filter((ds) =>
      ds.data_format ? filters.data_format.includes(ds.data_format) : false,
    );
  }

  // Sort
  switch (filters.sort) {
    case "downloads":
      result.sort((a, b) => b.hf_downloads - a.hf_downloads);
      break;
    case "recent":
      result.sort((a, b) => {
        const ya = a.year_released ?? 0;
        const yb = b.year_released ?? 0;
        if (yb !== ya) return yb - ya;
        const da = a.hf_last_modified ?? "";
        const db = b.hf_last_modified ?? "";
        return db.localeCompare(da);
      });
      break;
    case "citations":
      result.sort(
        (a, b) => (b.citation_count ?? 0) - (a.citation_count ?? 0),
      );
      break;
    case "name":
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  return result;
}

/**
 * Fetch all OSS dataset slugs for sitemap generation.
 */
export async function fetchAllOSSSlugs(): Promise<string[]> {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("oss_datasets")
    .select("slug")
    .eq("is_active", true)
    .eq("is_private", false);

  if (error) return [];
  return (data ?? []).map((d: { slug: string }) => d.slug);
}
