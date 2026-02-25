import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/** Maximum rows per Supabase insert call. */
const CHUNK_SIZE = 100;

interface BulkSampleInput {
  media_url: string;
  metadata_json?: Record<string, unknown>;
  mime_type?: string;
  s3_object_key?: string | null;
  s3_annotation_key?: string | null;
  s3_specs_key?: string | null;
}

interface BulkError {
  index: number;
  error: string;
}

/**
 * POST /api/admin/catalog/[id]/samples/bulk
 *
 * Batch-creates dataset samples from an array of media URL + metadata JSON pairs,
 * with optional S3 object key fields for samples stored in S3.
 *
 * Body: { samples: Array<{
 *   media_url: string,
 *   metadata_json?: object,
 *   mime_type?: string,
 *   s3_object_key?: string | null,
 *   s3_annotation_key?: string | null,
 *   s3_specs_key?: string | null,
 * }> }
 *
 * Inserts in chunks of 100 for performance. Returns a summary with inserted count
 * and per-item errors.
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

  let body: { samples?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!Array.isArray(body.samples) || body.samples.length === 0) {
    return NextResponse.json(
      { error: "Body must contain a non-empty `samples` array" },
      { status: 400 }
    );
  }

  // ---- Validate each item upfront and collect per-item errors ----
  const validItems: { index: number; item: BulkSampleInput }[] = [];
  const errors: BulkError[] = [];

  for (let i = 0; i < body.samples.length; i++) {
    const raw = body.samples[i];

    if (!raw || typeof raw !== "object") {
      errors.push({ index: i, error: "Item must be an object" });
      continue;
    }

    const item = raw as Record<string, unknown>;

    if (typeof item.media_url !== "string") {
      errors.push({ index: i, error: "media_url is required and must be a string" });
      continue;
    }

    const mediaUrl = item.media_url as string;
    if (!mediaUrl.startsWith("http://") && !mediaUrl.startsWith("https://")) {
      errors.push({ index: i, error: "media_url must start with http:// or https://" });
      continue;
    }

    if (
      item.metadata_json !== undefined &&
      item.metadata_json !== null &&
      typeof item.metadata_json !== "object"
    ) {
      errors.push({ index: i, error: "metadata_json must be an object when provided" });
      continue;
    }

    if (
      item.mime_type !== undefined &&
      item.mime_type !== null &&
      typeof item.mime_type !== "string"
    ) {
      errors.push({ index: i, error: "mime_type must be a string when provided" });
      continue;
    }

    // Validate S3 key fields — each must be a string or null/undefined
    if (
      item.s3_object_key !== undefined &&
      item.s3_object_key !== null &&
      typeof item.s3_object_key !== "string"
    ) {
      errors.push({ index: i, error: "s3_object_key must be a string when provided" });
      continue;
    }

    if (
      item.s3_annotation_key !== undefined &&
      item.s3_annotation_key !== null &&
      typeof item.s3_annotation_key !== "string"
    ) {
      errors.push({ index: i, error: "s3_annotation_key must be a string when provided" });
      continue;
    }

    if (
      item.s3_specs_key !== undefined &&
      item.s3_specs_key !== null &&
      typeof item.s3_specs_key !== "string"
    ) {
      errors.push({ index: i, error: "s3_specs_key must be a string when provided" });
      continue;
    }

    validItems.push({
      index: i,
      item: {
        media_url: mediaUrl,
        metadata_json: (item.metadata_json as Record<string, unknown>) ?? {},
        mime_type: (item.mime_type as string) ?? undefined,
        s3_object_key: (item.s3_object_key as string) ?? null,
        s3_annotation_key: (item.s3_annotation_key as string) ?? null,
        s3_specs_key: (item.s3_specs_key as string) ?? null,
      },
    });
  }

  // ---- Batch insert valid items in chunks ----
  const supabase = createSupabaseAdminClient();
  let inserted = 0;

  for (let offset = 0; offset < validItems.length; offset += CHUNK_SIZE) {
    const chunk = validItems.slice(offset, offset + CHUNK_SIZE);

    const rows = chunk.map(({ item }) => ({
      dataset_id: datasetId,
      filename: item.media_url.split("/").pop()?.split("?")[0] || "sample",
      media_url: item.media_url,
      storage_path: null,
      mime_type: resolveMimeType(item),
      file_size_bytes: 0,
      metadata_json: item.metadata_json ?? {},
      s3_object_key: item.s3_object_key ?? null,
      s3_annotation_key: item.s3_annotation_key ?? null,
      s3_specs_key: item.s3_specs_key ?? null,
    }));

    const { data, error } = await supabase
      .from("dataset_samples")
      .insert(rows)
      .select("id");

    if (error) {
      // If the whole chunk fails, mark each item in the chunk as errored
      console.error("[POST /api/admin/catalog/[id]/samples/bulk] chunk error", error);
      for (const entry of chunk) {
        errors.push({ index: entry.index, error: error.message });
      }
    } else {
      inserted += data?.length ?? rows.length;
    }
  }

  return NextResponse.json({ inserted, errors }, { status: 201 });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Resolves the MIME type for a sample. Priority:
 * 1. Explicit `mime_type` field from the input
 * 2. Guess from `s3_object_key` extension (if present)
 * 3. Guess from `media_url` extension
 * 4. Fall back to `application/octet-stream`
 */
function resolveMimeType(item: BulkSampleInput): string {
  if (item.mime_type) {
    return item.mime_type;
  }

  if (item.s3_object_key) {
    const guessed = guessMimeType(item.s3_object_key);
    if (guessed !== "application/octet-stream") {
      return guessed;
    }
  }

  return guessMimeType(item.media_url);
}

/** Best-effort MIME type guess from a URL or key extension. */
function guessMimeType(pathOrUrl: string): string {
  const ext = pathOrUrl.split("?")[0].split(".").pop()?.toLowerCase();
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
    csv: "text/csv",
    txt: "text/plain",
    pdf: "application/pdf",
  };
  return (ext && map[ext]) || "application/octet-stream";
}
