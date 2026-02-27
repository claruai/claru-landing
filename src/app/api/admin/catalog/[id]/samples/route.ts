import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { generateSignedUploadUrl } from "@/lib/supabase/storage";
import { getS3SignedUrl } from "@/lib/s3/presigner";

/**
 * GET /api/admin/catalog/[id]/samples
 *
 * Lists all samples for a dataset, ordered by creation date.
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

  // Parse optional pagination params
  const url = new URL(request.url);
  const pageParam = url.searchParams.get("page");
  const perPageParam = url.searchParams.get("per_page");
  const paginated = pageParam != null || perPageParam != null;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const perPage = Math.max(1, Math.min(200, parseInt(perPageParam ?? "50", 10) || 50));

  let query = supabase
    .from("dataset_samples")
    .select("*", paginated ? { count: "exact" } : {})
    .eq("dataset_id", id)
    .order("created_at", { ascending: false });

  if (paginated) {
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    query = query.range(from, to);
  }

  const { data: samples, error, count } = await query;

  if (error) {
    console.error("[GET /api/admin/catalog/[id]/samples]", error);
    return NextResponse.json(
      { error: "Failed to fetch samples" },
      { status: 500 }
    );
  }

  // Fetch format issue counts per sample for admin badge display
  const sampleIds = (samples ?? []).map((s: { id: string }) => s.id);
  let formatIssueCounts: Record<string, number> = {};

  if (sampleIds.length > 0) {
    const { data: issues } = await supabase
      .from("format_issues")
      .select("sample_id")
      .in("sample_id", sampleIds);

    if (issues) {
      formatIssueCounts = issues.reduce<Record<string, number>>((acc, row: { sample_id: string }) => {
        acc[row.sample_id] = (acc[row.sample_id] || 0) + 1;
        return acc;
      }, {});
    }
  }

  // Presign S3 URLs so admin thumbnails and video previews work
  const samplesWithUrls = await Promise.all(
    (samples ?? []).map(async (sample: Record<string, unknown>) => {
      if (typeof sample.s3_object_key === "string" && sample.s3_object_key) {
        const signedUrl = await getS3SignedUrl(sample.s3_object_key);
        if (signedUrl) {
          return { ...sample, media_url: signedUrl };
        }
      }
      return sample;
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

  // Backward compatible: return all samples without pagination metadata
  return NextResponse.json({
    samples: samplesWithUrls,
    formatIssueCounts,
  });
}

/**
 * POST /api/admin/catalog/[id]/samples
 *
 * Three modes controlled by the request body:
 *
 * 1. body.action === "get-upload-url"
 *    Returns a signed upload URL so the client can upload directly to storage.
 *    Body: { action: "get-upload-url", filename: string }
 *
 * 2. body.media_url (primary path)
 *    Creates a sample from an external media URL + optional metadata JSON.
 *    Body: { media_url: string, metadata_json?: object }
 *
 * 3. body.storage_path (legacy fallback)
 *    Creates a dataset_samples row after the file has been uploaded to storage.
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

  // ------- Mode 4: Create sample from S3 URI -------
  if (body.mode === "s3_uri") {
    const rawKey = body.s3_object_key as string | undefined;
    if (!rawKey) {
      return NextResponse.json(
        { error: "s3_object_key is required for s3_uri mode" },
        { status: 400 }
      );
    }

    // Strip s3://bucket-name/ prefix if present
    const s3ObjectKey = rawKey.replace(/^s3:\/\/[^/]+\//, "");

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

    const filename = s3ObjectKey.split("/").pop() || "sample";

    const { data: sample, error } = await supabase
      .from("dataset_samples")
      .insert({
        dataset_id: datasetId,
        filename,
        media_url: null,
        storage_path: null,
        s3_object_key: s3ObjectKey,
        s3_annotation_key: (body.s3_annotation_key as string) || null,
        s3_specs_key: (body.s3_specs_key as string) || null,
        mime_type: guessMimeType(s3ObjectKey),
        file_size_bytes: 0,
        metadata_json: metadataJson,
      })
      .select()
      .single();

    if (error) {
      console.error("[POST /api/admin/catalog/[id]/samples] s3_uri mode", error);
      return NextResponse.json(
        { error: "Failed to create sample record" },
        { status: 500 }
      );
    }

    return NextResponse.json({ sample }, { status: 201 });
  }

  // ------- Mode 2: Create sample from external media URL -------
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

    const { data: sample, error } = await supabase
      .from("dataset_samples")
      .insert({
        dataset_id: datasetId,
        filename: urlFilename,
        media_url: mediaUrl,
        storage_path: null,
        mime_type: guessMimeType(mediaUrl),
        file_size_bytes: 0,
        metadata_json: metadataJson,
      })
      .select()
      .single();

    if (error) {
      console.error("[POST /api/admin/catalog/[id]/samples] media_url mode", error);
      return NextResponse.json(
        { error: "Failed to create sample record" },
        { status: 500 }
      );
    }

    return NextResponse.json({ sample }, { status: 201 });
  }

  // ------- Mode 3: Create sample record from storage upload (legacy) -------
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

  const { data: sample, error } = await supabase
    .from("dataset_samples")
    .insert({
      dataset_id: datasetId,
      filename: filename as string,
      storage_path: storage_path as string,
      mime_type: mime_type as string,
      file_size_bytes: Number(file_size),
      duration_seconds: duration_seconds ? Number(duration_seconds) : null,
      resolution_width: resolution_width ? Number(resolution_width) : null,
      resolution_height: resolution_height ? Number(resolution_height) : null,
      fps: fps ? Number(fps) : null,
      metadata_json: {},
    })
    .select()
    .single();

  if (error) {
    console.error("[POST /api/admin/catalog/[id]/samples]", error);
    return NextResponse.json(
      { error: "Failed to create sample record" },
      { status: 500 }
    );
  }

  return NextResponse.json({ sample }, { status: 201 });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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
