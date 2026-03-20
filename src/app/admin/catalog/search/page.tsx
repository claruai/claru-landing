import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import CatalogSearchClient from "./CatalogSearchClient";

export const dynamic = "force-dynamic";

export default async function CatalogSearchPage() {
  const supabase = createSupabaseAdminClient();

  const { data: datasets } = await supabase
    .from("datasets")
    .select("id, name")
    .order("name");

  return <CatalogSearchClient datasets={datasets ?? []} />;
}
