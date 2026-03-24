import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { ArrowLeft, Clock, MapPin, Database, Film, Shield } from "lucide-react";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { verifyAdminToken } from "@/lib/admin-auth";
import { getS3SignedUrl } from "@/lib/s3/presigner";
import type { Dataset, DatasetCategory, Clip } from "@/types/data-catalog";

import { SampleGallery } from "./SampleGallery";
import { scrubS3Urls } from "@/lib/scrub-s3-urls";

// =============================================================================
// Dataset Detail Page (Server Component)
// Route: /portal/catalog/[id]
// Fetches dataset + clips via dataset_clips JOIN clips (unified clip architecture).
// Admin preview: admin-token cookie bypasses RLS, ?as_lead= impersonates a lead.
// Clips are rendered by the SampleGallery client component.
// =============================================================================

interface DatasetDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ clip?: string; sample?: string; as_lead?: string }>;
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
  // Hide internal AI fields from portal clients
  "ai_enrichment_source",
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
  const { clip: initialClipId, sample: legacySampleId, as_lead: asLeadId } = await searchParams;

  // Support both ?clip= and legacy ?sample= deep-link params
  const deepLinkId = initialClipId ?? legacySampleId;

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

  // Determine lead_id for clip filtering
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
    // Admin without impersonation -- show all clips
    leadId = undefined;
  } else {
    // Normal portal user -- resolve lead from Supabase session
    const { data: { user } } = await supabase.auth.getUser();
    const { data: leadRow } = user ? await supabase
      .from("leads")
      .select("id")
      .eq("supabase_user_id", user.id)
      .single() : { data: null };
    leadId = leadRow?.id;
  }

  // -------------------------------------------------------------------------
  // Fetch clips via dataset_clips JOIN clips
  // -------------------------------------------------------------------------
  // Admin (no impersonation): show ALL clips for this dataset
  // Admin (impersonating): show base clips + that lead's clips
  // Normal user: show base clips + their clips
  //
  // We query dataset_clips with a nested select on clips(*) to get the
  // joined clip data. Lead filtering uses the dataset_clips.lead_id column.
  // Deduplication by clip_id prevents duplicates when a clip has both a
  // base entry (lead_id IS NULL) and a lead-specific entry.
  // -------------------------------------------------------------------------

  let clipsQuery = supabase
    .from("dataset_clips")
    .select("clip_id, lead_id, is_showcase, clips(*)")
    .eq("dataset_id", id)
    .order("created_at", { ascending: true });

  if (isAdminPreview && !asLeadId) {
    // Admin sees everything -- no filter
  } else {
    // Leads see: showcase clips + their lead-specific clips
    clipsQuery = clipsQuery.or(
      leadId
        ? `is_showcase.eq.true,lead_id.eq.${leadId}`
        : "is_showcase.eq.true"
    );
  }

  const { data: datasetClipRows } = await clipsQuery;

  // Deduplicate by clip_id (prefer lead-specific entry over base entry)
  const clipMap = new Map<string, Clip>();
  for (const row of datasetClipRows ?? []) {
    const clip = row.clips as unknown as Clip | null;
    if (!clip) continue;
    // If we already have this clip and the current row is lead-specific, replace
    if (!clipMap.has(clip.id) || row.lead_id) {
      clipMap.set(clip.id, clip);
    }
  }
  const clipsList = Array.from(clipMap.values());

  // -------------------------------------------------------------------------
  // Generate signed URLs for each clip using s3_bucket + s3_key
  // -------------------------------------------------------------------------
  const signedUrls = await Promise.all(
    clipsList.map((clip) => {
      if (!clip.s3_key) return Promise.resolve("");
      // Use clip's own s3_bucket; fall back to dataset bucket
      const bucket = clip.s3_bucket && clip.s3_bucket !== "moonvalley-annotation-platform"
        ? clip.s3_bucket
        : dataset.s3_bucket && dataset.s3_bucket !== "moonvalley-annotation-platform"
          ? dataset.s3_bucket
          : undefined;
      return getS3SignedUrl(clip.s3_key, 3600, bucket);
    })
  );

  // Pair clips with their resolved URLs for the client component.
  // Scrub S3 paths from ann_metadata before sending to portal clients.
  const clipsWithUrls = clipsList.map((clip, i) => ({
    clip: {
      ...clip,
      ann_metadata: (scrubS3Urls(stripHiddenKeys(clip.ann_metadata)) ?? {}) as Record<string, unknown>,
      // Strip ai_enrichment_source from portal view
      ai_enrichment_source: null,
    } as Clip,
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
                Showing all clips (no lead filter)
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
        {/* Clips Gallery                                                    */}
        {/* ---------------------------------------------------------------- */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <SectionHeader>{"// SAMPLES"}</SectionHeader>
            <span className="font-mono text-xs text-[var(--text-muted)]">
              {clipsList.length}{" "}
              {clipsList.length === 1 ? "clip" : "clips"} loaded
            </span>
          </div>

          {clipsList.length === 0 ? (
            <div className="rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-12 text-center">
              <Film className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
              <p className="font-mono text-sm text-[var(--text-muted)]">
                No samples available for this dataset yet.
              </p>
            </div>
          ) : (
            <SampleGallery clipsWithUrls={clipsWithUrls} initialClipId={deepLinkId} />
          )}
        </div>
      </div>
    </div>
  );
}
