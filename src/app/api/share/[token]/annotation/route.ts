import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getS3SignedUrl } from "@/lib/s3/presigner";
import { stripHiddenKeys } from "@/lib/strip-hidden-keys";
import { scrubS3Urls } from "@/lib/scrub-s3-urls";
import { parquetReadObjects } from "hyparquet";

const TOKEN_RE = /^[a-f0-9]{64}$/;

/**
 * Parse a parquet buffer into a JSON-serialisable object.
 * Returns the top-level scalar fields plus a summary of frame_data
 * (too large to send raw — thousands of per-frame action records).
 */
async function parseParquetAnnotation(
  buffer: ArrayBuffer
): Promise<Record<string, unknown>> {
  const rows = await parquetReadObjects({ file: buffer });

  if (rows.length === 0) return {};

  const row = rows[0];
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(row)) {
    if (key === "frame_data" && Array.isArray(value)) {
      // Summarise frame_data instead of sending all frames
      const frames = value as Record<string, unknown>[];
      const actionCounts: Record<string, number> = {};
      let framesWithExtrinsics = 0;

      for (const frame of frames) {
        const actions = String(frame.actions ?? "");
        for (const ch of actions) {
          if (ch !== "-") actionCounts[ch] = (actionCounts[ch] || 0) + 1;
        }
        if (frame.camera_extrinsics_defined) framesWithExtrinsics++;
      }

      result.frame_count = frames.length;
      result.action_distribution = actionCounts;
      result.frames_with_extrinsics = framesWithExtrinsics;
      result.extrinsics_coverage =
        frames.length > 0
          ? Number((framesWithExtrinsics / frames.length).toFixed(3))
          : 0;

      // Include first 3 frames as a preview
      result.frame_preview = frames.slice(0, 3);
    } else {
      // Convert BigInt to number for JSON serialisation
      result[key] = typeof value === "bigint" ? Number(value) : value;
    }
  }

  return result;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  if (!TOKEN_RE.test(token)) {
    return NextResponse.json({ error: "Invalid token" }, { status: 404 });
  }

  const clipId = request.nextUrl.searchParams.get("clipId");
  if (!clipId) {
    return NextResponse.json(
      { error: "clipId required" },
      { status: 400 }
    );
  }

  const supabase = createSupabaseAdminClient();

  const { data: dataset } = await supabase
    .from("datasets")
    .select("id, share_expires_at")
    .eq("share_token", token)
    .single();

  if (
    !dataset ||
    (dataset.share_expires_at &&
      new Date(dataset.share_expires_at) < new Date())
  ) {
    return NextResponse.json(
      { error: "Invalid or expired share link" },
      { status: 404 }
    );
  }

  const { data: clipRow } = await supabase
    .from("dataset_clips")
    .select("clips(ann_annotation_key, s3_bucket)")
    .eq("dataset_id", dataset.id)
    .eq("clip_id", clipId)
    .limit(1)
    .single();

  const clipData = clipRow?.clips as unknown as {
    ann_annotation_key: string | null;
    s3_bucket: string | null;
  } | null;
  const annKey = clipData?.ann_annotation_key;
  const clipBucket = clipData?.s3_bucket;

  if (!annKey) {
    return NextResponse.json({ error: "No annotation data" }, { status: 404 });
  }

  // Use the clip's bucket if it differs from the default
  const defaultBucket = process.env.S3_BUCKET_NAME;
  const bucketOverride =
    clipBucket && clipBucket !== defaultBucket ? clipBucket : undefined;

  const signedUrl = await getS3SignedUrl(annKey, 300, bucketOverride);
  if (!signedUrl) {
    return NextResponse.json(
      { error: "Failed to sign annotation URL" },
      { status: 500 }
    );
  }

  const res = await fetch(signedUrl);
  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch annotation data" },
      { status: 502 }
    );
  }

  const isParquet = annKey.endsWith(".parquet");

  if (isParquet) {
    const buffer = await res.arrayBuffer();
    const data = await parseParquetAnnotation(buffer);

    return NextResponse.json(data, {
      headers: { "Cache-Control": "private, max-age=300, no-transform" },
    });
  }

  // Default: JSON annotation
  const raw = await res.json();
  const data = scrubS3Urls(stripHiddenKeys(raw));

  return NextResponse.json(data, {
    headers: { "Cache-Control": "private, max-age=300, no-transform" },
  });
}
