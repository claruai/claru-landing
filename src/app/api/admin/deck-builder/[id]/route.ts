import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/admin/deck-builder/[id]
 *
 * Fetches a single template by ID.
 */
export async function GET(
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

  const { data: template, error } = await supabase
    .from("slide_templates")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !template) {
    return NextResponse.json(
      { error: "Template not found" },
      { status: 404 }
    );
  }

  // Also fetch recent chat messages for this template
  const { data: chatMessages } = await supabase
    .from("template_chat_messages")
    .select("*")
    .eq("template_id", id)
    .order("created_at", { ascending: true })
    .limit(100);

  return NextResponse.json({ template, chat_messages: chatMessages ?? [] });
}

/**
 * PATCH /api/admin/deck-builder/[id]
 *
 * Updates editable fields on a template.
 * Accepts any subset of: { name, description, tags, slides_json, theme, custom_theme, is_active }
 * When is_active is set to true, first deactivates all templates, then activates the target.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();

  // Build update object from allowed fields
  const updateFields: Record<string, unknown> = {};

  if (typeof body.name === "string") {
    const name = body.name.trim();
    if (!name) {
      return NextResponse.json(
        { error: "Name must be a non-empty string" },
        { status: 400 }
      );
    }
    updateFields.name = name;
  }
  if (typeof body.description === "string") {
    updateFields.description = body.description.trim();
  }
  if (Array.isArray(body.tags)) {
    updateFields.tags = body.tags.filter(
      (t: unknown) => typeof t === "string"
    );
  }
  if (Array.isArray(body.slides_json)) {
    updateFields.slides_json = body.slides_json;
  }
  if (typeof body.theme === "string") {
    updateFields.theme = body.theme.trim();
  }
  if (body.custom_theme !== undefined) {
    // Allow null to clear custom theme or an object to set it
    updateFields.custom_theme =
      body.custom_theme === null ? null : body.custom_theme;
  }
  if (typeof body.is_active === "boolean") {
    updateFields.is_active = body.is_active;
  }

  if (Object.keys(updateFields).length === 0) {
    return NextResponse.json(
      { error: "No fields to update" },
      { status: 400 }
    );
  }

  // If activating this template, first deactivate all others
  if (updateFields.is_active === true) {
    const { error: deactivateErr } = await supabase
      .from("slide_templates")
      .update({ is_active: false })
      .neq("id", id);

    if (deactivateErr) {
      console.error(
        "[PATCH /api/admin/deck-builder/[id]] Failed to deactivate templates:",
        deactivateErr
      );
      return NextResponse.json(
        { error: "Failed to update active status" },
        { status: 500 }
      );
    }
  }

  const { data: template, error } = await supabase
    .from("slide_templates")
    .update(updateFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[PATCH /api/admin/deck-builder/[id]]", error);
    return NextResponse.json(
      { error: "Failed to update template" },
      { status: 500 }
    );
  }

  if (!template) {
    return NextResponse.json(
      { error: "Template not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ template });
}

/**
 * DELETE /api/admin/deck-builder/[id]
 *
 * Deletes a template by ID. FK cascades handle related records
 * (versions, chat messages, media assets).
 */
export async function DELETE(
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

  const { error } = await supabase
    .from("slide_templates")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[DELETE /api/admin/deck-builder/[id]]", error);
    return NextResponse.json(
      { error: "Failed to delete template" },
      { status: 500 }
    );
  }

  return new NextResponse(null, { status: 204 });
}
