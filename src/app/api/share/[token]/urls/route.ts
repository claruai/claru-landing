import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getS3SignedUrl } from "@/lib/s3/presigner";

const TOKEN_RE = /^[a-f0-9]{64}$/;

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  if (!TOKEN_RE.test(token)) {
    return NextResponse.json({ error: "Invalid token" }, { status: 404 });
  }

  const supabase = createSupabaseAdminClient();

  const { data: dataset } = await supabase
    .from("datasets")
    .select("id, s3_bucket, share_expires_at, share_mode")
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

  const shareMode: "all" | "showcase" =
    (dataset as { share_mode?: "all" | "showcase" }).share_mode ?? "all";

  let clipsQuery = supabase
    .from("dataset_clips")
    .select(
      "clip_id, clips(id, s3_bucket, s3_key)"
    )
    .eq("dataset_id", dataset.id)
    .order("created_at", { ascending: true });

  if (shareMode === "showcase") {
    clipsQuery = clipsQuery.eq("is_showcase", true).is("lead_id", null);
  }

  const { data: rows } = await clipsQuery;

  // Deduplicate rows first, then sign URLs in parallel
  const seen = new Set<string>();
  type ClipRow = { id: string; s3_bucket: string; s3_key: string };
  const uniqueClips: ClipRow[] = [];

  for (const row of rows ?? []) {
    const clip = row.clips as unknown as ClipRow | null;
    if (!clip?.s3_key || seen.has(clip.id)) continue;
    seen.add(clip.id);
    uniqueClips.push(clip);
  }

  const clips = await Promise.all(
    uniqueClips.map(async (clip) => {
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

      return { id: clip.id, signedUrl };
    })
  );

  return NextResponse.json(
    { clips },
    {
      headers: { "Cache-Control": "private, max-age=30, no-transform" },
    }
  );
}
