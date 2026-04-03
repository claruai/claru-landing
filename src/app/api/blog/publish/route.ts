import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getAdminSession } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// =============================================================================
// POST /api/blog/publish
//
// Publishes a blog post that is currently in 'pending_review' status.
// Sets status = 'published', published_at = now(), then revalidates
// the blog index and the individual post path for ISR.
//
// Auth: requires valid admin-token JWT cookie.
// Input: { id: string }
// Output: { success: true, slug: string }
// =============================================================================

interface PublishRequestBody {
  id: string;
}

export async function POST(request: NextRequest) {
  // --- Auth ---
  const cookieStore = await cookies();
  const isAuthenticated = await getAdminSession(cookieStore);

  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // --- Parse body ---
  let body: PublishRequestBody;
  try {
    body = (await request.json()) as PublishRequestBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const { id } = body;

  if (!id || typeof id !== "string") {
    return NextResponse.json(
      { error: "Missing required field: id" },
      { status: 400 }
    );
  }

  // --- Fetch post to get slug (needed for revalidation) ---
  const supabase = createSupabaseAdminClient();

  const { data: existing, error: fetchError } = await supabase
    .from("blog_posts")
    .select("id, slug, status")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  if (existing.status === "published") {
    // Already published — idempotent, return success
    return NextResponse.json({ success: true, slug: existing.slug });
  }

  if (existing.status !== "pending_review") {
    return NextResponse.json(
      { error: `Cannot publish a post with status: ${existing.status}` },
      { status: 409 }
    );
  }

  // --- Update post ---
  const { error: updateError } = await supabase
    .from("blog_posts")
    .update({
      status: "published",
      published_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("status", "pending_review");

  if (updateError) {
    console.error("[api/blog/publish] Update failed:", updateError.message);
    return NextResponse.json(
      { error: "Database update failed" },
      { status: 500 }
    );
  }

  // --- Revalidate ISR paths ---
  revalidatePath("/blog", "layout");
  revalidatePath(`/blog/${existing.slug}`);

  return NextResponse.json({ success: true, slug: existing.slug });
}
