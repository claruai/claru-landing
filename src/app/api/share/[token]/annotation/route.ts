import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getS3SignedUrl } from "@/lib/s3/presigner";
import { stripHiddenKeys } from "@/lib/strip-hidden-keys";
import { scrubS3Urls } from "@/lib/scrub-s3-urls";
import { fetchAnnotationParquet } from "@/lib/s3/annotation-parquet";

const TOKEN_RE = /^[a-f0-9]{64}$/;

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

  // Parquet annotations: use shared utility (handles its own S3 fetch)
  if (annKey.endsWith(".parquet")) {
    const data = await fetchAnnotationParquet(annKey, bucketOverride);
    if (!data) {
      return NextResponse.json(
        { error: "Failed to parse parquet annotation" },
        { status: 502 }
      );
    }
    return NextResponse.json(data, {
      headers: { "Cache-Control": "private, max-age=300, no-transform" },
    });
  }

  // JSON annotations: sign URL, fetch, strip sensitive fields
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

  const raw = await res.json();
  const data = scrubS3Urls(stripHiddenKeys(raw));

  return NextResponse.json(data, {
    headers: { "Cache-Control": "private, max-age=300, no-transform" },
  });
}
