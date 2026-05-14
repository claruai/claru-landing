import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { generateSignedUploadUrl } from "@/lib/supabase/storage";
import { getS3SignedUrl } from "@/lib/s3/presigner";

/**
 * GET /api/admin/catalog/[id]/samples
 *
 * Lists all clips for a dataset via dataset_clips JOIN clips,
 * ordered by creation date descending.
 *
 * Unified Clip Architecture (US-019): queries dataset_clips + clips
 * instead of legacy dataset_samples.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createSupabaseAdminClient();

  // Parse optional pagination + filter params
  const url = new URL(request.url);
  const pageParam = url.searchParams.get("page");
  const perPageParam = url.searchParams.get("per_page");
  const showcaseParam = url.searchParams.get("showcase");
  const paginated = pageParam != null || perPageParam != null;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const perPage = Math.max(1, Math.min(200, parseInt(perPageParam ?? "50", 10) || 50));
  const showcaseOnly = showcaseParam === "true" || showcaseParam === "1";

  // Query dataset_clips JOIN clips for this dataset
  let query = supabase
    .from("dataset_clips")
    .select(
      "id, dataset_id, clip_id, lead_id, is_showcase, added_by, note, created_at, clips(*)",
      paginated ? { count: "exact" } : {}
    )
    .eq("dataset_id", id)
    .order("created_at", { ascending: false });

  if (showcaseOnly) {
    query = query.eq("is_showcase", true);
  }

  if (paginated) {
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    query = query.range(from, to);
  }

  const { data: datasetClips, error, count } = await query;

  if (error) {
    console.error("[GET /api/admin/catalog/[id]/samples]", error);
    return NextResponse.json(
      { error: "Failed to fetch clips" },
      { status: 500 }
    );
  }

  // Flatten: merge clip data with dataset_clip metadata (lead_id, added_by, note)
  const rows = (datasetClips ?? []) as Array<Record<string, unknown>>;
  const samples: Array<Record<string, unknown>> = rows
    .filter((dc) => dc.clips != null)
    .map((dc) => {
      const clip = dc.clips as Record<string, unknown>;
      return {
        ...clip,
        dataset_clip_id: dc.id,
        lead_id: dc.lead_id,
        is_showcase: dc.is_showcase,
        added_by: dc.added_by,
        note: dc.note,
      };
    });

  // Fetch format issue counts per clip for admin badge display
  const clipIds = samples.map((s) => s.id as string);
  let formatIssueCounts: Record<string, number> = {};

  if (clipIds.length > 0) {
    const { data: issues } = await supabase
      .from("format_issues")
      .select("sample_id")
      .in("sample_id", clipIds);

    if (issues) {
      formatIssueCounts = issues.reduce<Record<string, number>>((acc, row: { sample_id: string }) => {
        acc[row.sample_id] = (acc[row.sample_id] || 0) + 1;
        return acc;
      }, {});
    }
  }

  // Presign URLs using clip's own s3_bucket + s3_key
  const samplesWithUrls = await Promise.all(
    samples.map(async (clip) => {
      const s3Key = clip.s3_key as string | null;
      const s3Bucket = clip.s3_bucket as string | null;
      if (s3Key) {
        const bucketOverride = s3Bucket && s3Bucket !== "moonvalley-annotation-platform"
          ? s3Bucket
          : undefined;
        const signedUrl = await getS3SignedUrl(s3Key, 3600, bucketOverride);
        if (signedUrl) {
          return { ...clip, media_url: signedUrl };
        }
      }
      return clip;
    })
  );

  // When paginated, return pagination metadata
  if (paginated) {
    const total = count ?? 0;
    return NextResponse.json({
      samples: samplesWithUrls,
      total,
      page,
      per_page: perPage,
      total_pages: Math.ceil(total / perPage),
      formatIssueCounts,
    });
  }

  // Backward compatible: return all clips without pagination metadata
  return NextResponse.json({
    samples: samplesWithUrls,
    formatIssueCounts,
  });
}

/**
 * POST /api/admin/catalog/[id]/samples
 *
 * Unified Clip Architecture (US-019): writes to `clips` + `dataset_clips`
 * instead of legacy `dataset_samples`.
 *
 * Four modes controlled by the request body:
 *
 * 1. body.action === "get-upload-url"
 *    Returns a signed upload URL so the client can upload directly to storage.
 *    Body: { action: "get-upload-url", filename: string }
 *
 * 2. body.mode === "s3_uri"
 *    Creates a clip from an S3 object key + optional annotation/specs keys.
 *    Body: { mode: "s3_uri", s3_object_key: string, s3_bucket?: string,
 *            s3_annotation_key?, s3_specs_key?, metadata_json? }
 *
 * 3. body.media_url
 *    Creates a clip from an external media URL + optional metadata JSON.
 *    Body: { media_url: string, metadata_json?: object }
 *
 * 4. body.storage_path (legacy fallback)
 *    Creates a clip from a Supabase storage upload.
 *    Body: { storage_path, filename, mime_type, file_size, duration_seconds?,
 *            resolution_width?, resolution_height?, fps? }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: datasetId } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  // ------- Mode 1: Generate signed upload URL -------
  if (body.action === "get-upload-url") {
    const filename = body.filename as string | undefined;
    if (!filename) {
      return NextResponse.json(
        { error: "filename is required" },
        { status: 400 }
      );
    }

    // Generate a unique sample ID for the storage path
    const sampleId = crypto.randomUUID();
    const storagePath = `${datasetId}/samples/${sampleId}/${filename}`;

    const result = await generateSignedUploadUrl(storagePath);
    if (!result) {
      return NextResponse.json(
        { error: "Failed to generate upload URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      signedUrl: result.signedUrl,
      token: result.token,
      storagePath,
      sampleId,
    });
  }

  const supabase = createSupabaseAdminClient();
  const DEFAULT_BUCKET = "moonvalley-annotation-platform";

  // ------- Mode 4: Create clip from S3 URI -------
  if (body.mode === "s3_uri") {
    const rawKey = body.s3_object_key as string | undefined;
    if (!rawKey) {
      return NextResponse.json(
        { error: "s3_object_key is required for s3_uri mode" },
        { status: 400 }
      );
    }

    // Strip s3://bucket-name/ prefix if present
    const s3Key = rawKey.replace(/^s3:\/\/[^/]+\//, "");
    const s3Bucket = (body.s3_bucket as string) || DEFAULT_BUCKET;

    // Validate metadata_json if provided
    let metadataJson: Record<string, unknown> = {};
    if (body.metadata_json != null) {
      if (typeof body.metadata_json === "string") {
        try {
          metadataJson = JSON.parse(body.metadata_json);
        } catch {
          return NextResponse.json(
            { error: "metadata_json must be valid JSON" },
            { status: 400 }
          );
        }
      } else if (typeof body.metadata_json === "object") {
        metadataJson = body.metadata_json as Record<string, unknown>;
      }
    }

    const filename = s3Key.split("/").pop() || "sample";

    // Upsert into clips using (s3_bucket, s3_key) as natural key
    const clipId = await upsertClip(supabase, {
      s3_bucket: s3Bucket,
      s3_key: s3Key,
      filename,
      mime_type: guessMimeType(s3Key),
      ann_annotation_key: (body.s3_annotation_key as string) || null,
      ann_specs_key: (body.s3_specs_key as string) || null,
      ann_metadata: metadataJson,
      tech_file_size_bytes: 0,
    });

    if (!clipId) {
      return NextResponse.json(
        { error: "Failed to upsert clip record" },
        { status: 500 }
      );
    }

    // Link clip to dataset
    const linkError = await linkClipToDataset(supabase, datasetId, clipId);
    if (linkError) {
      return NextResponse.json(
        { error: "Failed to link clip to dataset" },
        { status: 500 }
      );
    }

    // Return the full clip for the response
    const { data: clip } = await supabase
      .from("clips")
      .select("*")
      .eq("id", clipId)
      .single();

    return NextResponse.json({ sample: clip }, { status: 201 });
  }

  // ------- Mode 2: Create clip from external media URL -------
  if (typeof body.media_url === "string") {
    const mediaUrl = body.media_url as string;
    if (!mediaUrl.startsWith("http://") && !mediaUrl.startsWith("https://")) {
      return NextResponse.json(
        { error: "media_url must start with http:// or https://" },
        { status: 400 }
      );
    }

    const metadataJson =
      body.metadata_json && typeof body.metadata_json === "object"
        ? (body.metadata_json as Record<string, unknown>)
        : {};

    // Derive a filename from the URL for display purposes
    const urlFilename = mediaUrl.split("/").pop()?.split("?")[0] || "sample";

    // For URL-based clips, use the URL as the s3_key (no actual S3 object)
    const clipId = await upsertClip(supabase, {
      s3_bucket: DEFAULT_BUCKET,
      s3_key: mediaUrl,
      filename: urlFilename,
      mime_type: guessMimeType(mediaUrl),
      ann_metadata: metadataJson,
      tech_file_size_bytes: 0,
    });

    if (!clipId) {
      return NextResponse.json(
        { error: "Failed to upsert clip record" },
        { status: 500 }
      );
    }

    // Link clip to dataset
    const linkError = await linkClipToDataset(supabase, datasetId, clipId);
    if (linkError) {
      return NextResponse.json(
        { error: "Failed to link clip to dataset" },
        { status: 500 }
      );
    }

    const { data: clip } = await supabase
      .from("clips")
      .select("*")
      .eq("id", clipId)
      .single();

    return NextResponse.json({ sample: clip }, { status: 201 });
  }

  // ------- Mode 3: Create clip from storage upload (legacy) -------
  const {
    storage_path,
    filename,
    mime_type,
    file_size,
    duration_seconds,
    resolution_width,
    resolution_height,
    fps,
  } = body as Record<string, unknown>;

  if (!storage_path || !filename || !mime_type || file_size === undefined) {
    return NextResponse.json(
      { error: "storage_path, filename, mime_type, and file_size are required" },
      { status: 400 }
    );
  }

  // Use the storage_path as the s3_key for storage-uploaded clips
  const clipId = await upsertClip(supabase, {
    s3_bucket: DEFAULT_BUCKET,
    s3_key: storage_path as string,
    filename: filename as string,
    mime_type: mime_type as string,
    tech_file_size_bytes: Number(file_size),
    tech_duration_seconds: duration_seconds ? Number(duration_seconds) : null,
    tech_resolution_width: resolution_width ? Number(resolution_width) : null,
    tech_resolution_height: resolution_height ? Number(resolution_height) : null,
    tech_fps: fps ? Number(fps) : null,
    ann_metadata: {},
  });

  if (!clipId) {
    return NextResponse.json(
      { error: "Failed to upsert clip record" },
      { status: 500 }
    );
  }

  // Link clip to dataset
  const linkError = await linkClipToDataset(supabase, datasetId, clipId);
  if (linkError) {
    return NextResponse.json(
      { error: "Failed to link clip to dataset" },
      { status: 500 }
    );
  }

  const { data: clip } = await supabase
    .from("clips")
    .select("*")
    .eq("id", clipId)
    .single();

  return NextResponse.json({ sample: clip }, { status: 201 });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type SupabaseAdmin = ReturnType<typeof createSupabaseAdminClient>;

/**
 * Upsert a clip using (s3_bucket, s3_key) as the natural key.
 * If a clip with the same (s3_bucket, s3_key) already exists, returns its id.
 * Otherwise inserts a new clip and returns the new id.
 * Returns null on error.
 */
async function upsertClip(
  supabase: SupabaseAdmin,
  clipData: Record<string, unknown>
): Promise<string | null> {
  const s3Bucket = clipData.s3_bucket as string;
  const s3Key = clipData.s3_key as string;

  // Check if clip already exists with this (s3_bucket, s3_key)
  const { data: existing } = await supabase
    .from("clips")
    .select("id")
    .eq("s3_bucket", s3Bucket)
    .eq("s3_key", s3Key)
    .maybeSingle();

  if (existing) {
    return existing.id;
  }

  // Insert new clip
  const { data: newClip, error } = await supabase
    .from("clips")
    .insert(clipData)
    .select("id")
    .single();

  if (error) {
    // Handle race condition: another request may have inserted the same clip
    // between our SELECT and INSERT (unique constraint on s3_bucket + s3_key)
    if (error.code === "23505") {
      const { data: raceWinner } = await supabase
        .from("clips")
        .select("id")
        .eq("s3_bucket", s3Bucket)
        .eq("s3_key", s3Key)
        .maybeSingle();
      if (raceWinner) return raceWinner.id;
    }
    console.error("[upsertClip] insert error", error);
    return null;
  }

  return newClip.id;
}

/**
 * Links a clip to a dataset via dataset_clips.
 * Checks for an existing link first to avoid duplicate key errors.
 * Returns null on success, or an error string on failure.
 */
async function linkClipToDataset(
  supabase: SupabaseAdmin,
  datasetId: string,
  clipId: string
): Promise<string | null> {
  // Check if link already exists
  const { data: existingLink } = await supabase
    .from("dataset_clips")
    .select("id")
    .eq("dataset_id", datasetId)
    .eq("clip_id", clipId)
    .maybeSingle();

  if (existingLink) {
    return null; // Already linked
  }

  // is_showcase default false — showcase is opt-in via the per-clip toggle
  // (`PATCH /api/admin/catalog/[id]/samples/[clipId]`). Setting true on every
  // attach would mean every new add becomes publicly visible to portal users.
  const { error } = await supabase
    .from("dataset_clips")
    .insert({
      dataset_id: datasetId,
      clip_id: clipId,
      is_showcase: false,
      added_by: "admin",
    });

  if (error) {
    console.error("[linkClipToDataset] insert error", error);
    return error.message;
  }

  return null;
}

/** Best-effort MIME type guess from a URL extension. */
function guessMimeType(url: string): string {
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase();
  const map: Record<string, string> = {
    mp4: "video/mp4",
    webm: "video/webm",
    mov: "video/quicktime",
    avi: "video/x-msvideo",
    mkv: "video/x-matroska",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    json: "application/json",
  };
  return (ext && map[ext]) || "application/octet-stream";
}
