import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { DeckEditorClient } from "./DeckEditorClient";

export default async function DeckEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let template: Record<string, unknown> | null = null;

  try {
    const supabase = createSupabaseAdminClient();
    const { data } = await supabase
      .from("slide_templates")
      .select("*")
      .eq("id", id)
      .single();
    template = data;
  } catch {
    // Supabase may not be set up yet
  }

  if (!template) notFound();

  return <DeckEditorClient initialTemplate={template} />;
}
