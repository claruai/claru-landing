// =============================================================================
// GET /api/admin/deck-builder/[id]/analytics
//
// Returns aggregate analytics for a shared deck.
// Admin JWT auth required.
//
// Response: {
//   total_views, unique_viewers, avg_completion_rate,
//   views_by_day: [{ date, count }],
//   top_slides: [{ index, avg_duration }],
//   device_breakdown: { desktop, mobile, tablet }
// }
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// ---------------------------------------------------------------------------
// Auth helper
// ---------------------------------------------------------------------------

async function requireAdmin(): Promise<NextResponse | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SlideViewEntry {
  index?: number;
  duration?: number;
}

interface DeckViewRow {
  id: string;
  token_id: string | null;
  viewer_email: string | null;
  device_type: string | null;
  slides_viewed: SlideViewEntry[] | null;
  total_duration_seconds: number | null;
  completion_rate: number | null;
  viewed_at: string;
  ip_address: string | null;
}

// ---------------------------------------------------------------------------
// GET handler
// ---------------------------------------------------------------------------

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { id } = await params;
  const supabase = createSupabaseAdminClient();

  // Verify template exists
  const { data: template, error: templateErr } = await supabase
    .from("slide_templates")
    .select("id")
    .eq("id", id)
    .single();

  if (templateErr || !template) {
    return NextResponse.json(
      { error: "Template not found" },
      { status: 404 },
    );
  }

  // Fetch all views for this template from the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: views, error: viewsErr } = await supabase
    .from("deck_views")
    .select(
      "id, token_id, viewer_email, device_type, slides_viewed, total_duration_seconds, completion_rate, viewed_at, ip_address",
    )
    .eq("template_id", id)
    .gte("viewed_at", thirtyDaysAgo.toISOString())
    .order("viewed_at", { ascending: true });

  if (viewsErr) {
    console.error("[analytics] Failed to fetch views:", viewsErr);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 },
    );
  }

  const rows = (views ?? []) as DeckViewRow[];

  // Also fetch all-time views for total count
  const { count: allTimeCount } = await supabase
    .from("deck_views")
    .select("id", { count: "exact", head: true })
    .eq("template_id", id);

  const totalViews = allTimeCount ?? rows.length;

  // ---- Unique viewers ----
  // Count distinct by (token_id, viewer_email, ip_address)
  const viewerSet = new Set<string>();
  for (const row of rows) {
    const key =
      row.token_id || row.viewer_email || row.ip_address || row.id;
    viewerSet.add(key);
  }
  const uniqueViewers = viewerSet.size;

  // ---- Average completion rate ----
  const completionRates = rows
    .map((r) => r.completion_rate)
    .filter((v): v is number => v !== null && v !== undefined);
  const avgCompletionRate =
    completionRates.length > 0
      ? Math.round(
          (completionRates.reduce((sum, v) => sum + v, 0) /
            completionRates.length) *
            100,
        ) / 100
      : 0;

  // ---- Views by day (last 30 days) ----
  const viewsByDayMap = new Map<string, number>();
  // Pre-fill last 30 days with 0
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    viewsByDayMap.set(dateStr, 0);
  }
  for (const row of rows) {
    const dateStr = new Date(row.viewed_at).toISOString().split("T")[0];
    viewsByDayMap.set(dateStr, (viewsByDayMap.get(dateStr) ?? 0) + 1);
  }
  const viewsByDay = Array.from(viewsByDayMap.entries()).map(
    ([date, count]) => ({ date, count }),
  );

  // ---- Top slides by avg duration ----
  const slideDurations = new Map<number, number[]>();
  for (const row of rows) {
    if (!Array.isArray(row.slides_viewed)) continue;
    for (const entry of row.slides_viewed) {
      const idx = entry.index ?? 0;
      const dur = entry.duration ?? 0;
      if (!slideDurations.has(idx)) {
        slideDurations.set(idx, []);
      }
      slideDurations.get(idx)!.push(dur);
    }
  }
  const topSlides = Array.from(slideDurations.entries())
    .map(([index, durations]) => ({
      index,
      avg_duration:
        Math.round(
          (durations.reduce((s, d) => s + d, 0) / durations.length) * 10,
        ) / 10,
    }))
    .sort((a, b) => b.avg_duration - a.avg_duration);

  // ---- Device breakdown ----
  const deviceCounts = { desktop: 0, mobile: 0, tablet: 0 };
  for (const row of rows) {
    const dt = (row.device_type ?? "desktop").toLowerCase();
    if (dt.includes("mobile") || dt.includes("phone")) {
      deviceCounts.mobile++;
    } else if (dt.includes("tablet") || dt.includes("ipad")) {
      deviceCounts.tablet++;
    } else {
      deviceCounts.desktop++;
    }
  }

  return NextResponse.json({
    total_views: totalViews,
    unique_viewers: uniqueViewers,
    avg_completion_rate: avgCompletionRate,
    views_by_day: viewsByDay,
    top_slides: topSlides,
    device_breakdown: deviceCounts,
  });
}
