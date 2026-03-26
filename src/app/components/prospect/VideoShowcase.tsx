import { createClient } from "@supabase/supabase-js";
import { getS3SignedUrl } from "@/lib/s3/presigner";
import type { Clip } from "@/types/data-catalog";
import { VideoShowcaseClient } from "./VideoShowcaseClient";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface VideoShowcaseProps {
  /**
   * Clip IDs from the clips table.
   *
   * BREAKING CHANGE (US-006 migration): These must be clips.id UUIDs, NOT
   * legacy dataset_samples.id values. All callers (prospect pages, content
   * pages) need their hardcoded UUIDs remapped to the corresponding clip IDs.
   */
  sampleIds: string[];
  /** Optional heading override */
  heading?: string;
  /** Optional subheading */
  subheading?: string;
}

// ---------------------------------------------------------------------------
// Supabase client (anon, no auth cookies)
// ---------------------------------------------------------------------------

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// ---------------------------------------------------------------------------
// Server component — fetches clips + signs URLs, passes to client
// ---------------------------------------------------------------------------

export default async function VideoShowcase({
  sampleIds,
  heading = "Sample Data",
  subheading = "Real examples from our capture and annotation pipelines.",
}: VideoShowcaseProps) {
  if (!sampleIds || sampleIds.length === 0) return null;

  const supabase = getSupabase();

  const { data: clips } = await supabase
    .from("clips")
    .select("*")
    .in("id", sampleIds)
    .not("s3_key", "is", null);

  if (!clips || clips.length === 0) return null;

  // Pre-sign all URLs in parallel
  const clipsWithUrls = (
    await Promise.all(
      clips.map(async (clip) => {
        const url = await getS3SignedUrl(clip.s3_key!, 3600);
        if (!url) return null;
        return {
          clip: clip as Clip,
          signedUrl: url,
        };
      })
    )
  ).filter((v): v is { clip: Clip; signedUrl: string } => v !== null);

  if (clipsWithUrls.length === 0) return null;

  return (
    <VideoShowcaseClient
      clipsWithUrls={clipsWithUrls}
      heading={heading}
      subheading={subheading}
    />
  );
}
