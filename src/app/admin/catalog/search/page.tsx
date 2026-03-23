import { Suspense } from "react";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import CatalogSearchClient from "./CatalogSearchClient";

export const dynamic = "force-dynamic";

export default async function CatalogSearchPage() {
  const supabase = createSupabaseAdminClient();

  const [{ data: datasets }, { count: clipCount }, { data: bucketRows }] =
    await Promise.all([
      supabase.from("datasets").select("id, name").order("name"),
      supabase
        .from("clips")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("clips")
        .select("s3_bucket")
        .limit(500),
    ]);

  // Derive distinct bucket list from clips table
  const bucketSet = new Set<string>();
  for (const row of bucketRows ?? []) {
    if (row.s3_bucket) bucketSet.add(row.s3_bucket);
  }
  const buckets = Array.from(bucketSet).sort();

  return (
    <Suspense>
      <CatalogSearchClient
        datasets={datasets ?? []}
        buckets={buckets}
        clipCount={clipCount ?? 0}
      />
    </Suspense>
  );
}
