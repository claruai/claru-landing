import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/** Maximum rows per Supabase insert call. */
const CHUNK_SIZE = 100;

interface BulkSampleInput {
  media_url: string;
  metadata_json?: Record<string, unknown>;
}

interface BulkError {
  index: number;
  error: string;
}

/**
 * POST /api/admin/catalog/[id]/samples/bulk
 *
 * Batch-creates dataset samples from an array of media URL + metadata JSON pairs.
 *
 * Body: { samples: Array<{ media_url: string, metadata_json?: object }> }
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

    validItems.push({
      index: i,
      item: {
        media_url: mediaUrl,
        metadata_json: (item.metadata_json as Record<string, unknown>) ?? {},
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
      mime_type: guessMimeType(item.media_url),
      file_size_bytes: 0,
      metadata_json: item.metadata_json ?? {},
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
  };
  return (ext && map[ext]) || "application/octet-stream";
}
