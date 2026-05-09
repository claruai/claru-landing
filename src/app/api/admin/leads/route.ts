import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/admin/leads
 * Lists leads, optionally filtered by status.
 * Query params: ?status=approved
 */
export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const status = request.nextUrl.searchParams.get("status");
  const supabase = createSupabaseAdminClient();

  let query = supabase
    .from("leads")
    .select("id, name, company, email, status")
    .order("name");

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[GET /api/admin/leads]", error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }

  return NextResponse.json({ leads: data ?? [] });
}

/**
 * Generate a cryptographically random 32-char URL-safe temp password.
 * The admin receives this in the API response and passes it to the lead;
 * the lead is expected to reset it on first login (force_password_reset
 * flag is set in user_metadata for a future hook to enforce).
 */
function generateTempPassword(): string {
  return randomBytes(24).toString("base64url");
}

/**
 * POST /api/admin/leads
 *
 * Creates a new lead + Supabase auth user with temp password.
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

  const supabase = createSupabaseAdminClient();
  const tempPassword = generateTempPassword();

  // Step 1: Create Supabase auth user with temp password
  const { data: authUser, error: authError } =
    await supabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true, // Skip email verification
      user_metadata: { force_password_reset: true },
    });

  if (authError) {
    // User may already exist in auth
    if (authError.message?.includes("already been registered")) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 409 }
      );
    }
    console.error("[POST /api/admin/leads] Auth user creation failed:", authError);
    return NextResponse.json(
      { error: `Failed to create auth user: ${authError.message}` },
      { status: 500 }
    );
  }

  // Step 2: Create lead record linked to the auth user
  const insertData: Record<string, unknown> = {
    name,
    email,
    status: "pending",
    supabase_user_id: authUser.user.id,
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

  const { data: lead, error } = await supabase
    .from("leads")
    .insert(insertData)
    .select()
    .single();

  if (error) {
    // UNIQUE violation on email — clean up the auth user we just created
    if (error.code === "23505") {
      await supabase.auth.admin.deleteUser(authUser.user.id);
      return NextResponse.json(
        { error: "A lead with this email already exists" },
        { status: 409 }
      );
    }
    // Other error — clean up auth user
    await supabase.auth.admin.deleteUser(authUser.user.id);
    console.error("[POST /api/admin/leads]", error);
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { lead, tempPassword },
    { status: 201 }
  );
}
