import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getS3SignedUrl } from "@/lib/s3/presigner";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const supabase = createSupabaseAdminClient();

  const { data: dataset } = await supabase
    .from("datasets")
    .select("id, s3_bucket, share_expires_at")
    .eq("share_token", token)
    .single();

  if (
    !dataset ||
    (dataset.share_expires_at &&
      new Date(dataset.share_expires_at) < new Date())
  ) {
    return NextResponse.json(
      { error: "Invalid or expired share link" },
      {
        status: 404,
        headers: { "Cache-Control": "private, no-store" },
      }
    );
  }

  const { data: rows } = await supabase
    .from("dataset_clips")
    .select(
      "clip_id, clips(id, s3_bucket, s3_key)"
    )
    .eq("dataset_id", dataset.id)
    .order("created_at", { ascending: true });

  const seen = new Set<string>();
  const clips: { id: string; signedUrl: string }[] = [];

  for (const row of rows ?? []) {
    const clip = row.clips as unknown as {
      id: string;
      s3_bucket: string;
      s3_key: string;
    } | null;

    if (!clip?.s3_key || seen.has(clip.id)) continue;
    seen.add(clip.id);

    const bucket =
      clip.s3_bucket &&
      clip.s3_bucket !== "moonvalley-annotation-platform"
        ? clip.s3_bucket
        : dataset.s3_bucket &&
            dataset.s3_bucket !== "moonvalley-annotation-platform"
          ? dataset.s3_bucket
          : undefined;

    const signedUrl =
      (await getS3SignedUrl(clip.s3_key, 3600, bucket ?? undefined)) ?? "";

    clips.push({ id: clip.id, signedUrl });
  }

  return NextResponse.json(
    { clips },
    {
      headers: { "Cache-Control": "private, no-store" },
    }
  );
}
