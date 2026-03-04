import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// ---------------------------------------------------------------------------
// GET /api/admin/leads/[id]/deck-views
// Returns deck view analytics attributed to this lead via share tokens.
// ---------------------------------------------------------------------------

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: leadId } = await params;
  const supabase = createSupabaseAdminClient();

  // Verify lead exists
  const { data: lead, error: leadErr } = await supabase
    .from("leads")
    .select("id, email")
    .eq("id", leadId)
    .single();

  if (leadErr || !lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  // Find all share tokens for this lead (by lead_id or email match)
  const { data: tokens } = await supabase
    .from("deck_share_tokens")
    .select("id, template_id, email, token")
    .or(`lead_id.eq.${leadId},email.eq.${lead.email}`);

  if (!tokens || tokens.length === 0) {
    return NextResponse.json({ views: [] });
  }

  const tokenIds = tokens.map((t) => t.id);

  // Fetch all views attributed to these tokens
  const { data: views, error: viewsErr } = await supabase
    .from("deck_views")
    .select("id, template_id, token_id, viewer_email, device_type, slides_viewed, total_duration_seconds, completion_rate, viewed_at")
    .in("token_id", tokenIds)
    .order("viewed_at", { ascending: false });

  if (viewsErr) {
    console.error("[GET /api/admin/leads/[id]/deck-views]", viewsErr);
    return NextResponse.json(
      { error: "Failed to fetch deck views" },
      { status: 500 },
    );
  }

  // Get template names for all unique template_ids
  const templateIds = [...new Set((views ?? []).map((v) => v.template_id))];
  let templateNames: Record<string, string> = {};

  if (templateIds.length > 0) {
    const { data: templates } = await supabase
      .from("slide_templates")
      .select("id, name")
      .in("id", templateIds);

    if (templates) {
      templateNames = Object.fromEntries(
        templates.map((t) => [t.id, t.name as string]),
      );
    }
  }

  // Enrich views with template name
  const enrichedViews = (views ?? []).map((v) => ({
    ...v,
    template_name: templateNames[v.template_id] ?? "Unknown Deck",
    slides_count: Array.isArray(v.slides_viewed)
      ? (v.slides_viewed as unknown[]).length
      : 0,
  }));

  return NextResponse.json({ views: enrichedViews });
}
