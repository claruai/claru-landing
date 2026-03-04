import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { DeckBuilderClient } from "./DeckBuilderClient";

export default async function DeckBuilderPage() {
  let templates: Record<string, unknown>[] = [];

  try {
    const supabase = createSupabaseAdminClient();
    const { data } = await supabase
      .from("slide_templates")
      .select("*")
      .order("updated_at", { ascending: false });
    templates = data ?? [];
  } catch {
    // Supabase may not be set up yet -- graceful fallback
  }

  return <DeckBuilderClient initialTemplates={templates} />;
}
