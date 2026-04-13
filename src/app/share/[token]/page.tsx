export const dynamic = "force-dynamic";

import { cache } from "react";
import type { Metadata } from "next";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getS3SignedUrl } from "@/lib/s3/presigner";
import { scrubS3Urls } from "@/lib/scrub-s3-urls";
import ShareCatalog, { type ShareClip } from "./ShareCatalog";

interface SharePageProps {
  params: Promise<{ token: string }>;
}

const getShareData = cache(async (token: string) => {
  const supabase = createSupabaseAdminClient();

  const { data: dataset } = await supabase
    .from("datasets")
    .select(
      "id, name, description, s3_bucket, share_expires_at, share_first_viewed_at, share_view_count"
    )
    .eq("share_token", token)
    .single();

  if (!dataset) return null;
  if (
    dataset.share_expires_at &&
    new Date(dataset.share_expires_at) < new Date()
  )
    return null;

  const { data: accessRow } = await supabase
    .from("lead_dataset_access")
    .select("leads(company)")
    .eq("dataset_id", dataset.id)
    .limit(1)
    .single();

  const companyName: string | null =
    (accessRow?.leads as unknown as { company: string } | null)?.company ??
    null;

  return { dataset, companyName };
});

export async function generateMetadata({
  params,
}: SharePageProps): Promise<Metadata> {
  const { token } = await params;
  const data = await getShareData(token);

  const datasetName = data?.dataset.name ?? "Sample Catalog";
  const companyName = data?.companyName;

  const title = `${datasetName} — Claru`;
  const description = companyName
    ? `Prepared for ${companyName}. Curated data samples from Claru.`
    : "Curated data samples from Claru.";

  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: { title, description },
  };
}

export default async function SharePage({ params }: SharePageProps) {
  const { token } = await params;
  const data = await getShareData(token);

  if (!data) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="font-mono text-[var(--accent-primary)] text-4xl mb-4">
            404
          </div>
          <h1 className="font-mono text-xl text-[var(--text-primary)] mb-2">
            This link is no longer available
          </h1>
          <p className="font-mono text-sm text-[var(--text-secondary)]">
            The shared catalog you&apos;re looking for has expired or
            doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  const { dataset, companyName } = data;
  const supabase = createSupabaseAdminClient();

  // View tracking — read-then-write is acceptable for low-traffic share pages
  await supabase
    .from("datasets")
    .update({
      share_view_count: (dataset.share_view_count ?? 0) + 1,
      share_first_viewed_at:
        dataset.share_first_viewed_at ?? new Date().toISOString(),
    })
    .eq("id", dataset.id);

  const { data: rows } = await supabase
    .from("dataset_clips")
    .select(
      "clip_id, clips(id, filename, mime_type, s3_bucket, s3_key, ann_metadata, ai_enrichment_json, ai_caption, tech_duration_seconds, tech_resolution_width, tech_resolution_height, tech_fps)"
    )
    .eq("dataset_id", dataset.id)
    .order("created_at", { ascending: true });

  const seen = new Set<string>();
  const clips: ShareClip[] = [];

  for (const row of rows ?? []) {
    const clip = row.clips as unknown as {
      id: string;
      filename: string | null;
      mime_type: string | null;
      s3_bucket: string;
      s3_key: string;
      ann_metadata: Record<string, unknown> | null;
      ai_enrichment_json: Record<string, unknown> | null;
      ai_caption: string | null;
      tech_duration_seconds: number | null;
      tech_resolution_width: number | null;
      tech_resolution_height: number | null;
      tech_fps: number | null;
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

    clips.push({
      id: clip.id,
      filename: clip.filename,
      signedUrl,
      caption: clip.ai_caption,
      metadata: scrubS3Urls(clip.ann_metadata) as Record<
        string,
        unknown
      > | null,
      enrichment: scrubS3Urls(clip.ai_enrichment_json) as Record<
        string,
        unknown
      > | null,
      techSpecs: {
        duration: clip.tech_duration_seconds,
        width: clip.tech_resolution_width,
        height: clip.tech_resolution_height,
        fps: clip.tech_fps,
      },
    });
  }

  return (
    <ShareCatalog
      clips={clips}
      datasetName={dataset.name}
      companyName={companyName}
      token={token}
    />
  );
}
