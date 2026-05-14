import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/admin/leads/[id]/sample-packs
 *
 * Returns the audit trail of Custom Curation sample packs that were built
 * for this lead (datasets.created_for_lead_id = lead.id), with share URL,
 * view stats, and clip counts.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createSupabaseAdminClient();

  const { data: datasets, error } = await supabase
    .from("datasets")
    .select(
      "id, name, slug, description, share_token, share_expires_at, share_first_viewed_at, share_view_count, share_mode, created_at, total_samples, tags",
    )
    .eq("created_for_lead_id", id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://claru.ai";
  const packs = (datasets ?? []).map((d) => ({
    dataset_id: d.id,
    name: d.name,
    slug: d.slug,
    description: d.description,
    created_at: d.created_at,
    clip_count: d.total_samples ?? 0,
    tags: d.tags,
    share_url: d.share_token ? `${siteUrl}/share/${d.share_token}` : null,
    share_token: d.share_token,
    share_mode: d.share_mode,
    share_expires_at: d.share_expires_at,
    share_first_viewed_at: d.share_first_viewed_at,
    share_view_count: d.share_view_count ?? 0,
    is_expired:
      d.share_expires_at != null && new Date(d.share_expires_at) < new Date(),
  }));

  return NextResponse.json({ packs });
}
