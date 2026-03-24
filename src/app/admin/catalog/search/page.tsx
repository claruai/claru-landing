import { Suspense } from "react";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import CatalogSearchClient from "./CatalogSearchClient";

export const dynamic = "force-dynamic";

export default async function CatalogSearchPage() {
  const supabase = createSupabaseAdminClient();

  const [{ data: datasets }, { count: clipCount }] =
    await Promise.all([
      supabase.from("datasets").select("id, name").order("name"),
      supabase
        .from("clips")
        .select("id", { count: "estimated", head: true }),
    ]);

  // Known buckets — avoids expensive DISTINCT query on 1M+ rows
  const buckets = ["moonvalley-annotation-platform", "mv-abaka-external", "mv-artlist-external"];

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
