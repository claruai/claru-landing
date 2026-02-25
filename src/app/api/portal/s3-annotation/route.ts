import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// =============================================================================
// POST /api/portal/s3-annotation
//
// Fetches an annotation JSON from an S3 object key (URL). When a sampleId is
// provided, the handler first checks whether the annotation has already been
// cached in the sample's `metadata_json` (via a `_cached_at` timestamp). If
// the cache is fresh and the `objectKey` matches the sample's stored
// `s3_annotation_key`, the cached value is returned immediately without an S3
// round-trip.
//
// After a successful S3 fetch the annotation data is written back to the
// sample's `metadata_json` in a fire-and-forget background write so that
// subsequent requests are served from cache.
//
// Auth: Supabase session required (enforced by middleware + getUser check).
// =============================================================================

// ---------------------------------------------------------------------------
// Request schema
// ---------------------------------------------------------------------------

const requestSchema = z.object({
  /** The S3 object key / URL to fetch the annotation JSON from. */
  objectKey: z.string().min(1, "objectKey is required"),
  /** Optional sample ID — when provided, enables Supabase cache lookup. */
  sampleId: z.string().uuid().optional(),
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Fetch an annotation JSON file from S3 via its object key (full URL).
 * Returns the parsed JSON object, or null on failure.
 */
async function fetchAnnotationJson(
  objectKey: string
): Promise<Record<string, unknown> | null> {
  try {
    const response = await fetch(objectKey, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      console.error(
        `[s3-annotation] S3 fetch failed: ${response.status} ${response.statusText} for key ${objectKey}`
      );
      return null;
    }

    const json = (await response.json()) as Record<string, unknown>;
    return json;
  } catch (err) {
    console.error("[s3-annotation] S3 fetch error:", err);
    return null;
  }
}

/**
 * Fire-and-forget: merge annotation data + `_cached_at` timestamp into the
 * sample's `metadata_json` column using the admin client (bypasses RLS).
 */
function cacheAnnotationInBackground(
  sampleId: string,
  existingMetadata: Record<string, unknown>,
  annotationData: Record<string, unknown>
): void {
  const adminClient = createSupabaseAdminClient();

  const mergedMetadata: Record<string, unknown> = {
    ...existingMetadata,
    ...annotationData,
    _cached_at: new Date().toISOString(),
  };

  // Fire-and-forget — we intentionally do NOT await this promise so the
  // response is returned to the client immediately.
  void adminClient
    .from("dataset_samples")
    .update({ metadata_json: mergedMetadata })
    .eq("id", sampleId)
    .then(({ error }) => {
      if (error) {
        console.error(
          "[s3-annotation] Background cache write failed:",
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

  const { objectKey, sampleId } = parsed.data;

  // 3. Cache check — if sampleId is provided, look up the sample's metadata
  if (sampleId) {
    const { data: sample, error: sampleError } = await supabase
      .from("dataset_samples")
      .select("metadata_json, s3_annotation_key")
      .eq("id", sampleId)
      .single();

    if (!sampleError && sample) {
      const metadata = (sample.metadata_json ?? {}) as Record<string, unknown>;
      const storedKey = sample.s3_annotation_key as string | null;
      const cachedAt = metadata._cached_at;

      // Cache is valid only if:
      // - `_cached_at` exists (annotation was previously cached)
      // - The requested objectKey matches the stored s3_annotation_key
      //   (if the key changed, the cache is stale)
      if (cachedAt && storedKey === objectKey) {
        return NextResponse.json({ annotation: metadata, cached: true });
      }
    }
    // If sample not found or cache miss, fall through to S3 fetch
  }

  // 4. Fetch annotation JSON from S3
  const annotationData = await fetchAnnotationJson(objectKey);

  if (!annotationData) {
    return NextResponse.json(
      { error: "Failed to fetch annotation from S3" },
      { status: 502 }
    );
  }

  // 5. Background cache write — non-blocking
  if (sampleId) {
    // Re-fetch the current metadata so we merge correctly (the sample query
    // above may have failed or the metadata may have been read before).
    const { data: currentSample } = await supabase
      .from("dataset_samples")
      .select("metadata_json")
      .eq("id", sampleId)
      .single();

    const existingMetadata = (
      currentSample?.metadata_json ?? {}
    ) as Record<string, unknown>;

    cacheAnnotationInBackground(sampleId, existingMetadata, annotationData);
  }

  // 6. Return the annotation data immediately
  return NextResponse.json({ annotation: annotationData, cached: false });
}
