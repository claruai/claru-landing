import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * POST /api/admin/deck-builder/[id]/duplicate
 *
 * Duplicates a template. Creates a copy with name "{original} (Copy)",
 * is_active false, and a new UUID.
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createSupabaseAdminClient();

  // Fetch the original template
  const { data: original, error: fetchErr } = await supabase
    .from("slide_templates")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchErr || !original) {
    return NextResponse.json(
      { error: "Template not found" },
      { status: 404 }
    );
  }

  // Create the duplicate
  const { data: template, error: insertErr } = await supabase
    .from("slide_templates")
    .insert({
      name: `${original.name} (Copy)`,
      description: original.description,
      tags: original.tags,
      slides_json: original.slides_json,
      theme: original.theme,
      custom_theme: original.custom_theme,
      is_active: false,
    })
    .select()
    .single();

  if (insertErr) {
    console.error("[POST /api/admin/deck-builder/[id]/duplicate]", insertErr);
    return NextResponse.json(
      { error: "Failed to duplicate template" },
      { status: 500 }
    );
  }

  return NextResponse.json({ template }, { status: 201 });
}
