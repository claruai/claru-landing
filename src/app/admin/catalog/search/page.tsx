import { Suspense } from "react";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import CatalogSearchClient from "./CatalogSearchClient";

export const dynamic = "force-dynamic";

export default async function CatalogSearchPage() {
  const supabase = createSupabaseAdminClient();

  const [{ data: datasets }, { count: videoIndexCount }] =
    await Promise.all([
      supabase.from("datasets").select("id, name").order("name"),
      supabase
        .from("video_index")
        .select("id", { count: "exact", head: true }),
    ]);

  return (
    <Suspense>
      <CatalogSearchClient
        datasets={datasets ?? []}
        videoIndexCount={videoIndexCount ?? 0}
      />
    </Suspense>
  );
}
