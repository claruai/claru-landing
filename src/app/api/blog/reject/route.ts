import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminSession } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// =============================================================================
// POST /api/blog/reject
//
// Rejects a blog post that is currently in 'pending_review' status.
// Sets status = 'rejected'. Optionally logs a rejection reason.
//
// Auth: requires valid admin-token JWT cookie.
// Input: { id: string, reason?: string }
// Output: { success: true }
// =============================================================================

interface RejectRequestBody {
  id: string;
  reason?: string;
}

export async function POST(request: NextRequest) {
  // --- Auth ---
  const cookieStore = await cookies();
  const isAuthenticated = await getAdminSession(cookieStore);

  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // --- Parse body ---
  let body: RejectRequestBody;
  try {
    body = (await request.json()) as RejectRequestBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const { id, reason } = body;

  if (!id || typeof id !== "string") {
    return NextResponse.json(
      { error: "Missing required field: id" },
      { status: 400 }
    );
  }

  // --- Verify post exists ---
  const supabase = createSupabaseAdminClient();

  const { data: existing, error: fetchError } = await supabase
    .from("blog_posts")
    .select("id, status")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  if (existing.status === "rejected") {
    // Already rejected — idempotent
    return NextResponse.json({ success: true });
  }

  if (existing.status !== "pending_review") {
    return NextResponse.json(
      { error: `Cannot reject a post with status: ${existing.status}` },
      { status: 409 }
    );
  }

  // --- Update post ---
  const { error: updateError } = await supabase
    .from("blog_posts")
    .update({ status: "rejected" })
    .eq("id", id)
    .eq("status", "pending_review");

  if (updateError) {
    console.error("[api/blog/reject] Update failed:", updateError.message);
    return NextResponse.json(
      { error: "Database update failed" },
      { status: 500 }
    );
  }

  if (reason) {
    console.info(
      `[api/blog/reject] Post ${id} rejected. Reason: ${reason}`
    );
  }

  return NextResponse.json({ success: true });
}
