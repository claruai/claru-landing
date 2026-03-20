import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import CatalogSearchClient from "./CatalogSearchClient";

export const dynamic = "force-dynamic";

export default async function CatalogSearchPage() {
  const supabase = createSupabaseAdminClient();

  const [{ data: datasets }, { count: videoIndexCount }, { data: bucketRows }] =
    await Promise.all([
      supabase.from("datasets").select("id, name").order("name"),
      supabase
        .from("video_index")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("video_index")
        .select("s3_bucket")
        .limit(1000),
    ]);

  // Extract distinct buckets
  const bucketSet = new Set<string>();
  for (const r of bucketRows ?? []) {
    if (r.s3_bucket) bucketSet.add(r.s3_bucket);
  }
  const buckets = [...bucketSet].sort();

  return (
    <CatalogSearchClient
      datasets={datasets ?? []}
      buckets={buckets}
      videoIndexCount={videoIndexCount ?? 0}
    />
  );
}
