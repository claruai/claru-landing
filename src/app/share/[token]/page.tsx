export const dynamic = "force-dynamic";

import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
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

const TOKEN_RE = /^[a-f0-9]{64}$/;

export default async function SharePage({ params }: SharePageProps) {
  const { token } = await params;
  if (!TOKEN_RE.test(token)) return notFound();

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

  // Atomic view tracking via Postgres RPC — increments share_view_count and
  // sets share_first_viewed_at = COALESCE(share_first_viewed_at, now()) in one shot
  await supabase.rpc("increment_share_view", { p_dataset_id: dataset.id });

  const { data: rows } = await supabase
    .from("dataset_clips")
    .select(
      "clip_id, clips(id, filename, mime_type, s3_bucket, s3_key, ann_metadata, ann_annotation_key, ai_enrichment_json, ai_caption, tech_duration_seconds, tech_resolution_width, tech_resolution_height, tech_fps, tech_file_size_bytes, tech_codec, tech_bit_depth)"
    )
    .eq("dataset_id", dataset.id)
    .order("created_at", { ascending: true });

  // Deduplicate rows first, then sign URLs in parallel
  const seen = new Set<string>();
  type ClipRow = {
    id: string;
    filename: string | null;
    mime_type: string | null;
    s3_bucket: string;
    s3_key: string;
    ann_metadata: Record<string, unknown> | null;
    ann_annotation_key: string | null;
    ai_enrichment_json: Record<string, unknown> | null;
    ai_caption: string | null;
    tech_duration_seconds: number | null;
    tech_resolution_width: number | null;
    tech_resolution_height: number | null;
    tech_fps: number | null;
    tech_file_size_bytes: number | null;
    tech_codec: string | null;
    tech_bit_depth: number | null;
  };
  const uniqueClips: ClipRow[] = [];

  for (const row of rows ?? []) {
    const clip = row.clips as unknown as ClipRow | null;
    if (!clip?.s3_key || seen.has(clip.id)) continue;
    seen.add(clip.id);
    uniqueClips.push(clip);
  }

  const clips: ShareClip[] = await Promise.all(
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

      const annotationUrl = clip.ann_annotation_key
        ? (await getS3SignedUrl(clip.ann_annotation_key, 3600)) ?? null
        : null;

      return {
        id: clip.id,
        filename: clip.filename,
        signedUrl,
        annotationUrl,
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
          fileSize: clip.tech_file_size_bytes,
          codec: clip.tech_codec,
          bitDepth: clip.tech_bit_depth,
        },
      };
    })
  );

  return (
    <ShareCatalog
      clips={clips}
      datasetName={dataset.name}
      companyName={companyName}
      token={token}
    />
  );
}
