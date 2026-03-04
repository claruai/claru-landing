import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createEmptySlide } from "@/types/deck-builder";

/**
 * GET /api/admin/deck-builder
 *
 * Lists all templates ordered by updated_at DESC.
 */
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("slide_templates")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("[GET /api/admin/deck-builder]", error);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }

  return NextResponse.json({ templates: data ?? [] });
}

/**
 * POST /api/admin/deck-builder
 *
 * Creates a new template with one empty slide.
 * Body: { name: string, description?: string, theme?: string, tags?: string[] }
 */
export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json(
      { error: "Name is required" },
      { status: 400 }
    );
  }

  const slides_json = [createEmptySlide(0)];

  const insertData: Record<string, unknown> = {
    name,
    slides_json,
  };

  if (typeof body.description === "string" && body.description.trim()) {
    insertData.description = body.description.trim();
  }
  if (typeof body.theme === "string" && body.theme.trim()) {
    insertData.theme = body.theme.trim();
  }
  if (Array.isArray(body.tags)) {
    insertData.tags = body.tags.filter(
      (t: unknown) => typeof t === "string"
    );
  }

  const supabase = createSupabaseAdminClient();

  const { data: template, error } = await supabase
    .from("slide_templates")
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error("[POST /api/admin/deck-builder]", error);
    return NextResponse.json(
      { error: "Failed to create template" },
      { status: 500 }
    );
  }

  return NextResponse.json({ template }, { status: 201 });
}
