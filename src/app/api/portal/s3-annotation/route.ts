import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { fetchAnnotationJson } from "@/lib/s3/annotation";
import { fetchAnnotationParquet } from "@/lib/s3/annotation-parquet";
import { scrubS3Urls } from "@/lib/scrub-s3-urls";
import {
  getGrantedDatasetIds,
  getDatasetIdsForClipId,
  getDatasetIdsForObjectKey,
  hasOverlap,
} from "@/lib/portal/access-control";

// =============================================================================
// POST /api/portal/s3-annotation
//
// Unified Clip Architecture (US-014):
// Fetches annotation JSON from S3 for a clip. Looks up the clip by ID from the
// clips table using the admin client (service role bypasses RLS -- the clips
// table has no per-user SELECT policy).
//
// Uses the clip's ann_annotation_key for S3 fetch path and s3_bucket for the
// correct bucket.
//
// Caching: writes annotation data to clips.ann_metadata (not the old
// dataset_samples.metadata_json). Background write uses admin client.
//
// Auth: Supabase session required (enforced by middleware + getUser check).
// =============================================================================

// ---------------------------------------------------------------------------
// Request schema
// ---------------------------------------------------------------------------

const requestSchema = z.object({
  /** The S3 object key / URL to fetch the annotation JSON from. */
  objectKey: z.string().min(1, "objectKey is required"),
  /** Clip ID -- enables cache lookup from clips.ann_metadata and correct bucket. */
  clipId: z.string().uuid().optional(),
  /** @deprecated Use clipId. Treated as a clip ID for backward compatibility. */
  sampleId: z.string().uuid().optional(),
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const SENSITIVE_KEYS = new Set([
  "userId", "reviewerId", "payoutId", "amount", "paymentStatus",
  "paymentDate", "cost", "browserMetadata", "rejectionReason",
  "rejectionCount", "rejectedAt", "isTestTemplate", "annotationIndex",
  "source_bucket", "source_storage_key", "source_url", "delivery", "tranche",
]);
const SENSITIVE_PROJECT_KEYS = new Set([
  "annotationCost", "annotationCostType", "reviewCost", "isCompleted",
  "isActive", "projectGuideLink", "slackChannel", "generalDataSchema",
  "templateData", "configuration",
]);

function stripSensitiveFields(data: unknown): unknown {
  if (data === null || data === undefined) return data;
  if (Array.isArray(data)) return data.map(stripSensitiveFields);
  if (typeof data !== "object") return data;

  const obj = data as Record<string, unknown>;
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (SENSITIVE_KEYS.has(key)) continue;
    if (key === "project" && value && typeof value === "object") {
      const project: Record<string, unknown> = {};
      for (const [pk, pv] of Object.entries(value as Record<string, unknown>)) {
        if (!SENSITIVE_PROJECT_KEYS.has(pk)) project[pk] = pv;
      }
      cleaned[key] = project;
    } else if (value && typeof value === "object") {
      cleaned[key] = stripSensitiveFields(value);
    } else {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

/**
 * Fire-and-forget: merge annotation data + `_cached_at` timestamp into the
 * clip's `ann_metadata` column using the admin client (bypasses RLS).
 */
function cacheAnnotationInBackground(
  clipId: string,
  existingMetadata: Record<string, unknown>,
  annotationData: Record<string, unknown>
): void {
  const adminClient = createSupabaseAdminClient();

  const mergedMetadata: Record<string, unknown> = {
    ...existingMetadata,
    ...annotationData,
    _cached_at: new Date().toISOString(),
  };

  // Fire-and-forget -- we intentionally do NOT await this promise so the
  // response is returned to the client immediately.
  void adminClient
    .from("clips")
    .update({ ann_metadata: mergedMetadata })
    .eq("id", clipId)
    .then(({ error }) => {
      if (error) {
        console.error(
          "[s3-annotation] Background cache write to clips.ann_metadata failed:",
          error.message
        );
      }
    });
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  // 1. Validate Supabase session
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Parse and validate request body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.format() },
      { status: 400 }
    );
  }

  const { objectKey, clipId, sampleId } = parsed.data;
  // Prefer clipId; fall back to sampleId for backward compatibility
  // (sampleId is now treated as a clip ID since clips replaced dataset_samples)
  const lookupId = clipId ?? sampleId;

  // Authorization: verify the requested clip / objectKey belongs to a dataset
  // the user has access to. lead_dataset_access lookup uses the AUTHED client
  // (RLS applies); clips/dataset_clips lookups use admin (service-role only RLS).
  const grantedDatasetIds = await getGrantedDatasetIds(supabase, user.id);
  if (!grantedDatasetIds || grantedDatasetIds.size === 0) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const candidateDatasetIds = lookupId
    ? await getDatasetIdsForClipId(lookupId)
    : await getDatasetIdsForObjectKey(objectKey);

  if (!hasOverlap(candidateDatasetIds, grantedDatasetIds)) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  // Use admin client for clips lookup (service role bypasses RLS --
  // the clips table has no per-user SELECT policy)
  const adminClient = createSupabaseAdminClient();

  // 3. Cache check -- look up clip by ID from clips table
  let clipBucket: string | null = null;

  if (lookupId) {
    const { data: clip, error: clipError } = await adminClient
      .from("clips")
      .select("ann_metadata, ann_annotation_key, s3_bucket")
      .eq("id", lookupId)
      .single();

    if (!clipError && clip) {
      clipBucket = clip.s3_bucket;
      const metadata = (clip.ann_metadata ?? {}) as Record<string, unknown>;
      const storedKey = clip.ann_annotation_key as string | null;
      const cachedAt = metadata._cached_at;

      // Cache is valid only if:
      // - `_cached_at` exists (annotation was previously cached)
      // - The requested objectKey matches the stored ann_annotation_key
      //   (if the key changed, the cache is stale)
      if (cachedAt && storedKey === objectKey) {
        return NextResponse.json({
          annotation: scrubS3Urls(stripSensitiveFields(metadata) as Record<string, unknown>),
          cached: true,
        });
      }
    }
    // If clip not found or cache miss, fall through to S3 fetch
  }

  // 4. Fetch annotation from S3 — parquet or JSON
  const isParquet = objectKey.endsWith(".parquet");
  const annotationData = isParquet
    ? await fetchAnnotationParquet(objectKey, clipBucket ?? undefined)
    : await fetchAnnotationJson(objectKey, clipBucket ?? undefined);

  if (!annotationData) {
    return NextResponse.json(
      { error: "Failed to fetch annotation from S3" },
      { status: 502 }
    );
  }

  // 5. Background cache write to clips.ann_metadata -- non-blocking
  if (lookupId) {
    // Re-fetch current ann_metadata so we merge correctly
    const { data: currentClip } = await adminClient
      .from("clips")
      .select("ann_metadata")
      .eq("id", lookupId)
      .single();

    const existingMetadata = (
      currentClip?.ann_metadata ?? {}
    ) as Record<string, unknown>;

    cacheAnnotationInBackground(lookupId, existingMetadata, annotationData);
  }

  // 6. Strip sensitive fields (costs, PII) before returning to leads
  return NextResponse.json({
    annotation: scrubS3Urls(stripSensitiveFields(annotationData) as Record<string, unknown>),
    cached: false,
  });
}
