import { cache } from "react";
import { createClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Supabase client (anon, no cookies) — mirrors src/app/api/public/datasets/route.ts
// ---------------------------------------------------------------------------

const getDatasets = cache(async (ids: string[]) => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("datasets")
    .select(
      "id, name, slug, description, type, subcategory, source_type, modality, total_samples, total_duration_hours, geographic_coverage, annotation_types, dataset_categories(name, slug, display_order)"
    )
    .in("id", ids)
    .eq("is_published", true)
    .order("name", { ascending: true });

  if (error) {
    console.error("[DatasetShowcase] Supabase error:", error.message);
    return [];
  }

  return (data ?? []).map((row) => {
    const category = row.dataset_categories as unknown as {
      name: string;
      slug: string;
      display_order: number;
    } | null;

    return {
      id: row.id as string,
      name: row.name as string,
      slug: row.slug as string,
      description: (row.description as string) ?? null,
      type: row.type as string,
      subcategory: (row.subcategory as string) ?? null,
      source_type: row.source_type as string,
      modality: (row.modality as string) ?? null,
      total_samples: row.total_samples as number,
      total_duration_hours: row.total_duration_hours as number,
      geographic_coverage: (row.geographic_coverage as string) ?? null,
      annotation_types: row.annotation_types as string[],
      category_name: category?.name ?? null,
    };
  });
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatSampleCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return n.toLocaleString();
}

function formatDuration(hours: number): string | null {
  if (!hours || hours <= 0) return null;
  if (hours >= 1) return `${hours.toFixed(0)}h`;
  const minutes = Math.round(hours * 60);
  return `${minutes}m`;
}

const SOURCE_TYPE_LABELS: Record<string, string> = {
  COLLECTED: "Collected",
  SYNTHETIC: "Synthetic",
  CURATED: "Curated",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface DatasetShowcaseProps {
  datasetIds: string[];
}

export default async function DatasetShowcase({ datasetIds }: DatasetShowcaseProps) {
  if (!datasetIds || datasetIds.length === 0) return null;

  const datasets = await getDatasets(datasetIds);

  // Build a map of fetched datasets by id for ordering & missing-detection
  const datasetMap = new Map(datasets.map((d) => [d.id, d]));

  return (
    <section className="w-full">
      <h3
        className="text-sm uppercase tracking-widest mb-6"
        style={{ color: "#92B090", fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)" }}
      >
        Relevant Datasets
      </h3>

      {/* Horizontal scroll on mobile, grid on desktop */}
      <div
        className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-x-visible"
        style={{ scrollbarWidth: "thin" }}
      >
        {datasetIds.map((id) => {
          const ds = datasetMap.get(id);

          if (!ds) {
            return (
              <div
                key={id}
                className="min-w-[260px] flex-shrink-0 rounded-lg px-5 py-4 flex items-center justify-center"
                style={{
                  backgroundColor: "#121210",
                  border: "1px solid #2a2a28",
                }}
              >
                <span
                  className="text-xs px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: "rgba(146, 176, 144, 0.1)",
                    color: "#92B090",
                    border: "1px solid rgba(146, 176, 144, 0.2)",
                  }}
                >
                  Dataset unavailable
                </span>
              </div>
            );
          }

          const duration = formatDuration(ds.total_duration_hours);
          const sourceLabel =
            SOURCE_TYPE_LABELS[ds.source_type?.toUpperCase()] ?? ds.source_type;

          return (
            <div
              key={ds.id}
              className="min-w-[260px] flex-shrink-0 rounded-lg px-5 py-5 flex flex-col gap-3"
              style={{
                backgroundColor: "#121210",
                border: "1px solid #2a2a28",
              }}
            >
              {/* Name */}
              <h4 className="text-sm font-medium leading-tight" style={{ color: "#FFFFFF" }}>
                {ds.name}
              </h4>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {ds.category_name && (
                  <span
                    className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: "rgba(146, 176, 144, 0.12)",
                      color: "#92B090",
                      fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                    }}
                  >
                    {ds.category_name}
                  </span>
                )}
                {sourceLabel && (
                  <span
                    className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.06)",
                      color: "rgba(255, 255, 255, 0.5)",
                      fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                    }}
                  >
                    {sourceLabel}
                  </span>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 mt-auto pt-2">
                <div className="flex flex-col">
                  <span
                    className="text-xs"
                    style={{
                      color: "#92B090",
                      fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                    }}
                  >
                    {formatSampleCount(ds.total_samples)}
                  </span>
                  <span className="text-[10px]" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                    samples
                  </span>
                </div>
                {duration && (
                  <div className="flex flex-col">
                    <span
                      className="text-xs"
                      style={{
                        color: "#92B090",
                        fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                      }}
                    >
                      {duration}
                    </span>
                    <span className="text-[10px]" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                      duration
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
