import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/admin/settings
 * Retrieve all settings (key-value pairs) from the settings table.
 */
export async function GET() {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .order("key");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ settings: data });
}

/**
 * PUT /api/admin/settings
 * Update a single setting by key.
 *
 * Body: { key: string, value: string }
 */
export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { key, value } = body as { key: string; value: string };

  if (!key || typeof key !== "string") {
    return NextResponse.json(
      { error: "Missing or invalid 'key'" },
      { status: 400 }
    );
  }

  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("settings")
    .upsert({ key, value }, { onConflict: "key" })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ setting: data });
}
