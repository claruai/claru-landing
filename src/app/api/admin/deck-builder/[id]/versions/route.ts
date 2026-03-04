import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/admin/deck-builder/[id]/versions
 *
 * Returns all versions for a template, ordered by version_number DESC.
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

  const { data, error } = await supabase
    .from("slide_template_versions")
    .select("*")
    .eq("template_id", id)
    .order("version_number", { ascending: false });

  if (error) {
    console.error("[GET /api/admin/deck-builder/[id]/versions]", error);
    return NextResponse.json(
      { error: "Failed to fetch versions" },
      { status: 500 }
    );
  }

  return NextResponse.json({ versions: data ?? [] });
}

/**
 * POST /api/admin/deck-builder/[id]/versions
 *
 * Snapshots the current template state as a new version.
 * Auto-increments version_number using COALESCE(MAX(version_number), 0) + 1.
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

  // Fetch current template state
  const { data: template, error: fetchErr } = await supabase
    .from("slide_templates")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchErr || !template) {
    return NextResponse.json(
      { error: "Template not found" },
      { status: 404 }
    );
  }

  // Get the next version number
  const { data: maxRow, error: maxErr } = await supabase
    .from("slide_template_versions")
    .select("version_number")
    .eq("template_id", id)
    .order("version_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (maxErr) {
    console.error(
      "[POST /api/admin/deck-builder/[id]/versions] Failed to get max version:",
      maxErr
    );
    return NextResponse.json(
      { error: "Failed to determine version number" },
      { status: 500 }
    );
  }

  const nextVersion = (maxRow?.version_number ?? 0) + 1;

  // Create the version snapshot
  const { data: version, error: insertErr } = await supabase
    .from("slide_template_versions")
    .insert({
      template_id: id,
      version_number: nextVersion,
      slides_json: template.slides_json,
      name: template.name,
      description: template.description ?? "",
      theme: template.theme,
    })
    .select()
    .single();

  if (insertErr) {
    console.error("[POST /api/admin/deck-builder/[id]/versions]", insertErr);
    return NextResponse.json(
      { error: "Failed to create version" },
      { status: 500 }
    );
  }

  return NextResponse.json({ version }, { status: 201 });
}
