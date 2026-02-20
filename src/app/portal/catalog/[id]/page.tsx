import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, MapPin, Database, Film } from "lucide-react";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSignedUrl } from "@/lib/supabase/storage";
import type { Dataset, DatasetCategory, DatasetSample } from "@/types/data-catalog";

import { SampleGallery } from "./SampleGallery";

// =============================================================================
// Dataset Detail Page (Server Component)
// Route: /portal/catalog/[id]
// Fetches dataset + samples via Supabase server client (RLS enforced).
// Samples are rendered by the SampleGallery client component (US-007).
// =============================================================================

interface DatasetDetailPageProps {
  params: Promise<{ id: string }>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDatasetType(type: string): string {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// ---------------------------------------------------------------------------
// Sub-components (server-safe)
// ---------------------------------------------------------------------------

function SectionHeader({ children }: { children: string }) {
  return (
    <span className="block text-xs font-mono text-[var(--accent-primary)] uppercase tracking-wider mb-3">
      {children}
    </span>
  );
}

function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "accent";
}) {
  const base =
    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs";
  const variants = {
    default:
      "bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-[var(--text-secondary)]",
    accent:
      "bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/40 text-[var(--accent-primary)]",
  };
  return <span className={`${base} ${variants[variant]}`}>{children}</span>;
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default async function DatasetDetailPage({
  params,
}: DatasetDetailPageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  // Fetch dataset (RLS ensures the lead has access)
  const { data: dataset, error: datasetError } = await supabase
    .from("datasets")
    .select("*")
    .eq("id", id)
    .single<Dataset>();

  if (datasetError || !dataset) {
    notFound();
  }

  // Fetch category
  const { data: category } = await supabase
    .from("dataset_categories")
    .select("*")
    .eq("id", dataset.category_id)
    .single<DatasetCategory>();

  // Fetch samples
  const { data: samples } = await supabase
    .from("dataset_samples")
    .select("*")
    .eq("dataset_id", id)
    .order("created_at", { ascending: true })
    .returns<DatasetSample[]>();

  const samplesList = samples ?? [];

  // Generate signed URLs for samples that use Supabase Storage;
  // for samples with media_url, use that directly.
  const signedUrls = await Promise.all(
    samplesList.map((sample) =>
      sample.media_url
        ? Promise.resolve(sample.media_url)
        : sample.storage_path
          ? getSignedUrl(sample.storage_path)
          : Promise.resolve("")
    )
  );

  // Pair samples with their resolved URLs for the client component.
  // Coerce null signed URLs to empty string so the gallery can handle
  // the "no preview" state without nullable types.
  const samplesWithUrls = samplesList.map((sample, i) => ({
    sample,
    signedUrl: signedUrls[i] ?? "",
  }));

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Wider container for gallery grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Back link */}
        <Link
          href="/portal/catalog"
          className="inline-flex items-center gap-2 text-sm font-mono text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors duration-200 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </Link>

        {/* ---------------------------------------------------------------- */}
        {/* Header                                                           */}
        {/* ---------------------------------------------------------------- */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {category && <Badge variant="accent">{category.name}</Badge>}
            <Badge>{formatDatasetType(dataset.type)}</Badge>
          </div>

          <h1 className="text-2xl md:text-3xl font-mono font-semibold tracking-tight text-[var(--text-primary)] mb-3">
            {dataset.name}
          </h1>

          {dataset.description && (
            <p className="font-mono text-sm text-[var(--text-secondary)] leading-relaxed max-w-3xl">
              {dataset.description}
            </p>
          )}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Stats Bar                                                        */}
        {/* ---------------------------------------------------------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-4">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-[var(--accent-primary)]" />
              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                Total Samples
              </span>
            </div>
            <span className="block font-mono text-xl font-bold text-[var(--text-primary)]">
              {dataset.total_samples.toLocaleString()}
            </span>
          </div>

          <div className="rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-[var(--accent-primary)]" />
              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                Total Duration
              </span>
            </div>
            <span className="block font-mono text-xl font-bold text-[var(--text-primary)]">
              {dataset.total_duration_hours > 0
                ? `${dataset.total_duration_hours.toLocaleString()}h`
                : "--"}
            </span>
          </div>

          <div className="rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-[var(--accent-primary)]" />
              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                Geographic Coverage
              </span>
            </div>
            <span className="block font-mono text-xl font-bold text-[var(--text-primary)]">
              {dataset.geographic_coverage || "--"}
            </span>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Annotation Types                                                 */}
        {/* ---------------------------------------------------------------- */}
        {dataset.annotation_types && dataset.annotation_types.length > 0 && (
          <div className="mb-10">
            <SectionHeader>{"// ANNOTATION TYPES"}</SectionHeader>
            <div className="flex flex-wrap gap-2">
              {dataset.annotation_types.map((type) => (
                <Badge key={type} variant="accent">
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Samples Gallery (US-007)                                         */}
        {/* ---------------------------------------------------------------- */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <SectionHeader>{"// SAMPLES"}</SectionHeader>
            <span className="font-mono text-xs text-[var(--text-muted)]">
              {samplesList.length}{" "}
              {samplesList.length === 1 ? "sample" : "samples"} loaded
            </span>
          </div>

          {samplesList.length === 0 ? (
            <div className="rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-12 text-center">
              <Film className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
              <p className="font-mono text-sm text-[var(--text-muted)]">
                No samples available for this dataset yet.
              </p>
            </div>
          ) : (
            <SampleGallery samplesWithUrls={samplesWithUrls} />
          )}
        </div>
      </div>
    </div>
  );
}
