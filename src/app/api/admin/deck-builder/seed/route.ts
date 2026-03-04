import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { generateDemoDeck } from "@/lib/deck-builder/seed-demo-deck";

/**
 * POST /api/admin/deck-builder/seed
 *
 * Seeds a demo sales deck from landing page content.
 * Creates a new template named "Claru Sales Deck -- Demo" with
 * is_active = true (deactivates existing active templates first).
 */
export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();

  // Deactivate all currently active templates
  await supabase
    .from("slide_templates")
    .update({ is_active: false })
    .eq("is_active", true);

  // Generate demo slides
  const slides = generateDemoDeck();

  // Insert demo template
  const { data: template, error } = await supabase
    .from("slide_templates")
    .insert({
      name: "Claru Sales Deck \u2014 Demo",
      description: "Pre-built demo deck generated from landing page content",
      tags: ["demo", "sales", "first-call"],
      slides_json: slides,
      theme: "terminal-green",
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    console.error("[POST /api/admin/deck-builder/seed]", error);
    return NextResponse.json(
      { error: "Failed to create demo template" },
      { status: 500 }
    );
  }

  return NextResponse.json({ template }, { status: 201 });
}
