import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Zod schema for the format issue report request body.
 */
const RequestBodySchema = z.object({
  sampleId: z.string().min(1, "sampleId is required"),
  mimeType: z.string().min(1, "mimeType is required"),
  userAgent: z.string().min(1, "userAgent is required"),
});

/**
 * POST /api/portal/format-issue
 *
 * Reports a video format compatibility issue for a given sample.
 * Called automatically by the VideoPlayer component when the browser
 * cannot play the video format and the fallback UI is displayed.
 *
 * Requires an authenticated Supabase session (portal user).
 *
 * Request body: { sampleId: string, mimeType: string, userAgent: string }
 * Response:     { success: true } on success
 *               { error: string } on failure
 */
export async function POST(request: NextRequest) {
  // ---------- Auth: validate Supabase session ----------
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ---------- Parse and validate request body ----------
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = RequestBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request body" },
      { status: 400 }
    );
  }

  const { sampleId, mimeType, userAgent } = parsed.data;

  // ---------- Insert format issue row ----------
  const { error: insertError } = await supabase
    .from("format_issues")
    .insert({
      sample_id: sampleId,
      mime_type: mimeType,
      user_agent: userAgent,
    });

  if (insertError) {
    console.error(
      "[format-issue] Insert error:",
      insertError.message
    );
    return NextResponse.json(
      { error: "Failed to report format issue" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
