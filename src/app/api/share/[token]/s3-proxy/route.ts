import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getS3SignedUrl } from "@/lib/s3/presigner";

const TOKEN_RE = /^[a-f0-9]{64}$/;
const MAX_PROXY_BYTES = 10 * 1024 * 1024; // 10 MB

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  if (!TOKEN_RE.test(token)) {
    return NextResponse.json({ error: "Invalid token" }, { status: 404 });
  }

  const clipId = request.nextUrl.searchParams.get("clipId");
  const key = request.nextUrl.searchParams.get("key");
  if (!clipId || !key) {
    return NextResponse.json(
      { error: "clipId and key required" },
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

  // Verify clip belongs to this dataset
  const { data: clipRow } = await supabase
    .from("dataset_clips")
    .select("clips(s3_key, ann_annotation_key, ann_specs_key, ann_metadata)")
    .eq("dataset_id", dataset.id)
    .eq("clip_id", clipId)
    .limit(1)
    .single();

  if (!clipRow) {
    return NextResponse.json(
      { error: "Clip not found in dataset" },
      { status: 404 }
    );
  }

  // Build allowlist of every object key this clip is permitted to expose:
  // its primary s3_key, annotation/specs keys, and every objectId in the
  // ann_metadata.files[] array.
  const clipData = (clipRow as unknown as {
    clips:
      | {
          s3_key: string | null;
          ann_annotation_key: string | null;
          ann_specs_key: string | null;
          ann_metadata: Record<string, unknown> | null;
        }
      | null;
  }).clips;

  const allowedKeys = new Set<string>();
  if (clipData?.s3_key) allowedKeys.add(clipData.s3_key);
  if (clipData?.ann_annotation_key) allowedKeys.add(clipData.ann_annotation_key);
  if (clipData?.ann_specs_key) allowedKeys.add(clipData.ann_specs_key);

  const files = (clipData?.ann_metadata?.files ?? []) as Array<
    Record<string, unknown>
  >;
  if (Array.isArray(files)) {
    for (const f of files) {
      const oid = f?.objectId;
      if (typeof oid === "string" && oid.length > 0) allowedKeys.add(oid);
    }
  }

  if (!allowedKeys.has(key)) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const signedUrl = await getS3SignedUrl(key, 300);
  if (!signedUrl) {
    return NextResponse.json(
      { error: "Failed to sign URL" },
      { status: 500 }
    );
  }

  const res = await fetch(signedUrl);
  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch file" },
      { status: 502 }
    );
  }

  const contentLength = parseInt(res.headers.get("content-length") ?? "0", 10);
  if (contentLength > MAX_PROXY_BYTES) {
    return NextResponse.json(
      { error: "File too large" },
      { status: 413 }
    );
  }

  const buffer = await res.arrayBuffer();
  if (buffer.byteLength > MAX_PROXY_BYTES) {
    return NextResponse.json(
      { error: "File too large" },
      { status: 413 }
    );
  }

  const contentType = res.headers.get("content-type") ?? "application/octet-stream";

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "private, max-age=300, no-transform",
    },
  });
}
