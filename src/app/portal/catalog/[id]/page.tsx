import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { ArrowLeft, Clock, MapPin, Database, Film, Shield } from "lucide-react";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { verifyAdminToken } from "@/lib/admin-auth";
import { getSignedUrl } from "@/lib/supabase/storage";
import { getS3SignedUrl } from "@/lib/s3/presigner";
import type { Dataset, DatasetCategory, DatasetSample } from "@/types/data-catalog";

import { SampleGallery } from "./SampleGallery";
import { scrubS3Urls } from "@/lib/scrub-s3-urls";

// =============================================================================
// Dataset Detail Page (Server Component)
// Route: /portal/catalog/[id]
// Fetches dataset + samples via Supabase server client (RLS enforced).
// Admin preview: admin-token cookie bypasses RLS, ?as_lead= impersonates a lead.
// Samples are rendered by the SampleGallery client component (US-007).
// =============================================================================

interface DatasetDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ sample?: string; as_lead?: string }>;
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

/** Keys to strip entirely from metadata before sending to portal clients. */
const PORTAL_HIDDEN_KEYS = new Set([
  "userId", "reviewerId", "payoutId", "amount", "paymentStatus",
  "paymentDate", "cost", "browserMetadata", "rejectionReason",
  "rejectionCount", "rejectedAt", "isTestTemplate", "annotationIndex",
  "source_bucket", "source_torage_key", "source_url", "delivery", "tranche",
  "annotationCost", "reviewCost", "projectGuideLink", "slackChannel",
]);

/** Recursively strip hidden keys from a value. */
function stripHiddenKeys(value: unknown, key?: string): unknown {
  if (key && PORTAL_HIDDEN_KEYS.has(key)) return undefined;
  if (Array.isArray(value)) return value.map((v) => stripHiddenKeys(v));
  if (value !== null && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      const stripped = stripHiddenKeys(v, k);
      if (stripped !== undefined) result[k] = stripped;
    }
    return result;
  }
  return value;
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
  searchParams,
}: DatasetDetailPageProps) {
  const { id } = await params;
  const { sample: initialSampleId, as_lead: asLeadId } = await searchParams;

  // Detect admin preview mode
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("admin-token")?.value;
  const isAdminPreview = adminToken ? await verifyAdminToken(adminToken) : false;

  // Use admin client (bypasses RLS) when admin, otherwise session client
  const supabase = isAdminPreview
    ? createSupabaseAdminClient()
    : await createSupabaseServerClient();

  // Fetch dataset
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

  // Determine lead_id for sample filtering
  let leadId: string | undefined;
  let impersonatedLeadName: string | null = null;

  if (isAdminPreview && asLeadId) {
    // Admin impersonating a specific lead
    const { data: impersonatedLead } = await supabase
      .from("leads")
      .select("id, name, company")
      .eq("id", asLeadId)
      .single();
    leadId = impersonatedLead?.id;
    impersonatedLeadName = impersonatedLead
      ? `${impersonatedLead.name} (${impersonatedLead.company})`
      : null;
  } else if (isAdminPreview) {
    // Admin without impersonation — show all samples
    leadId = undefined;
  } else {
    // Normal portal user — resolve lead from Supabase session
    const { data: { user } } = await supabase.auth.getUser();
    const { data: leadRow } = user ? await supabase
      .from("leads")
      .select("id")
      .eq("supabase_user_id", user.id)
      .single() : { data: null };
    leadId = leadRow?.id;
  }

  // Fetch samples
  // Admin (no impersonation): show ALL samples
  // Admin (impersonating): show base + that lead's samples
  // Normal user: show base + their samples
  let samplesQuery = supabase
    .from("dataset_samples")
    .select("*")
    .eq("dataset_id", id)
    .order("created_at", { ascending: true });

  if (isAdminPreview && !asLeadId) {
    // Admin sees everything — no lead filter
  } else {
    samplesQuery = samplesQuery.or(
      leadId ? `lead_id.is.null,lead_id.eq.${leadId}` : "lead_id.is.null"
    );
  }

  const { data: samples } = await samplesQuery.returns<DatasetSample[]>();

  const samplesList = samples ?? [];

  // Generate signed URLs for each sample. Resolution order:
  // 1. s3_object_key  -> AWS S3 presigned URL (primary for new uploads)
  // 2. media_url      -> direct URL (legacy / external hosting)
  // 3. storage_path   -> Supabase Storage signed URL (legacy)
  // 4. fallback       -> empty string (no preview available)
  // Use dataset-level s3_bucket if set, otherwise default
  const bucketOverride = dataset.s3_bucket && dataset.s3_bucket !== "moonvalley-annotation-platform"
    ? dataset.s3_bucket
    : undefined;

  const signedUrls = await Promise.all(
    samplesList.map((sample) =>
      sample.s3_object_key
        ? getS3SignedUrl(sample.s3_object_key, 3600, bucketOverride)
        : sample.media_url
          ? Promise.resolve(sample.media_url)
          : sample.storage_path
            ? getSignedUrl(sample.storage_path)
            : Promise.resolve("")
    )
  );

  // Pair samples with their resolved URLs for the client component.
  // Coerce null signed URLs to empty string so the gallery can handle
  // the "no preview" state without nullable types.
  // Also scrub any s3:// paths from metadata_json before sending to client.
  const samplesWithUrls = samplesList.map((sample, i) => ({
    sample: {
      ...sample,
      metadata_json: (scrubS3Urls(stripHiddenKeys(sample.metadata_json)) ?? {}) as Record<string, unknown>,
    },
    signedUrl: signedUrls[i] ?? "",
  }));

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Admin preview banner */}
      {isAdminPreview && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center gap-3 font-mono text-xs">
            <Shield className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="text-amber-400 font-semibold">ADMIN PREVIEW</span>
            {impersonatedLeadName ? (
              <span className="text-amber-400/70">
                Viewing as: <span className="text-amber-300">{impersonatedLeadName}</span>
              </span>
            ) : (
              <span className="text-amber-400/70">
                Showing all samples (no lead filter)
              </span>
            )}
            <Link
              href="/admin/catalog"
              className="ml-auto text-amber-400 hover:text-amber-300 transition-colors"
            >
              [back to admin]
            </Link>
          </div>
        </div>
      )}

      {/* Wider container for gallery grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Back link */}
        <Link
          href={isAdminPreview ? "/admin/catalog" : "/portal/catalog"}
          className="inline-flex items-center gap-2 text-sm font-mono text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors duration-200 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          {isAdminPreview ? "Back to Admin Catalog" : "Back to Catalog"}
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
                Dataset Size
              </span>
            </div>
            <span className="block font-mono text-xl font-bold text-[var(--text-primary)]">
              {dataset.total_samples.toLocaleString()}
            </span>
          </div>

          {dataset.total_duration_hours > 0 && (
          <div className="rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-[var(--accent-primary)]" />
              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                Total Duration
              </span>
            </div>
            <span className="block font-mono text-xl font-bold text-[var(--text-primary)]">
              {dataset.total_duration_hours.toLocaleString()}h
            </span>
          </div>
          )}

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
            <SampleGallery samplesWithUrls={samplesWithUrls} initialSampleId={initialSampleId} />
          )}
        </div>
      </div>
    </div>
  );
}
