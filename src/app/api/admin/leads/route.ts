import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/admin/leads
 *
 * Returns all leads, optionally filtered by ?q= search query (matches name or email).
 * Requires admin authentication.
 */
export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  let query = supabase
    .from("leads")
    .select("id, name, email, company, status")
    .order("created_at", { ascending: false });

  if (q) {
    // Search by name or email (case-insensitive)
    query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%`);
  }

  const { data: leads, error } = await query.limit(50);

  if (error) {
    console.error("[GET /api/admin/leads]", error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }

  return NextResponse.json({ leads: leads ?? [] });
}

/**
 * POST /api/admin/leads
 *
 * Creates a new lead. Requires admin authentication.
 * Body: { name, email, company?, role?, data_needs?, use_case?, admin_notes? }
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

  // Validate required fields
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { error: "Invalid email format" },
      { status: 400 }
    );
  }

  // Build insert object with optional fields
  const insertData: Record<string, unknown> = {
    name,
    email,
    status: "pending",
  };

  if (typeof body.company === "string" && body.company.trim()) {
    insertData.company = body.company.trim();
  }
  if (typeof body.role === "string" && body.role.trim()) {
    insertData.role = body.role.trim();
  }
  if (typeof body.data_needs === "string" && body.data_needs.trim()) {
    insertData.data_needs = body.data_needs.trim();
  }
  if (typeof body.use_case === "string" && body.use_case.trim()) {
    insertData.use_case = body.use_case.trim();
  }
  if (typeof body.admin_notes === "string" && body.admin_notes.trim()) {
    insertData.admin_notes = body.admin_notes.trim();
  }

  const supabase = createSupabaseAdminClient();

  const { data: lead, error } = await supabase
    .from("leads")
    .insert(insertData)
    .select()
    .single();

  if (error) {
    // UNIQUE violation on email
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "A lead with this email already exists" },
        { status: 409 }
      );
    }
    console.error("[POST /api/admin/leads]", error);
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 }
    );
  }

  return NextResponse.json({ lead }, { status: 201 });
}
