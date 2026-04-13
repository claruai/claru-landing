import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getS3SignedUrl } from "@/lib/s3/presigner";

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
    .select("clips(ann_annotation_key)")
    .eq("dataset_id", dataset.id)
    .eq("clip_id", clipId)
    .limit(1)
    .single();

  const annKey = (clipRow?.clips as unknown as { ann_annotation_key: string | null } | null)
    ?.ann_annotation_key;

  if (!annKey) {
    return NextResponse.json({ error: "No annotation data" }, { status: 404 });
  }

  const signedUrl = await getS3SignedUrl(annKey, 300);
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

  const data = await res.json();

  return NextResponse.json(data, {
    headers: { "Cache-Control": "private, max-age=300, no-transform" },
  });
}
