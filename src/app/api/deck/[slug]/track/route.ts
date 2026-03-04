// =============================================================================
// POST /api/deck/[slug]/track
//
// Records viewer engagement events for shared decks.
// No auth required -- called by the lightweight tracking script embedded in
// the public viewer page (/d/[slug]).
//
// Events:
//   view         — Creates a deck_views row, returns { view_id }
//   slide_change — Appends to slides_viewed JSONB array
//   complete     — Updates total_duration_seconds + completion_rate
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

interface TrackPayload {
  token?: string;
  event: "view" | "slide_change" | "complete";
  slide_index?: number;
  duration?: number;
  device?: string;
  view_id?: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  let body: TrackPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { event, token, slide_index, duration, device, view_id } = body;

  if (!event || !["view", "slide_change", "complete"].includes(event)) {
    return NextResponse.json(
      { error: "Invalid event type" },
      { status: 400 },
    );
  }

  const supabase = createSupabaseAdminClient();

  // Look up the template by slug
  const { data: template } = await supabase
    .from("slide_templates")
    .select("id, share_settings")
    .eq("share_settings->>slug", slug)
    .single();

  if (!template) {
    return NextResponse.json({ error: "Deck not found" }, { status: 404 });
  }

  // Resolve token to token_id and viewer email (if provided)
  let tokenId: string | null = null;
  let viewerEmail: string | null = null;

  if (token) {
    const { data: tokenRow } = await supabase
      .from("deck_share_tokens")
      .select("id, email")
      .eq("token", token)
      .eq("template_id", template.id)
      .single();

    if (tokenRow) {
      tokenId = tokenRow.id;
      viewerEmail = tokenRow.email;
    }
  }

  // -------------------------------------------------------------------------
  // Event: view — create a new deck_views row
  // -------------------------------------------------------------------------
  if (event === "view") {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

    const { data: view, error } = await supabase
      .from("deck_views")
      .insert({
        template_id: template.id,
        token_id: tokenId,
        viewer_email: viewerEmail,
        device_type: device ?? null,
        slides_viewed: [],
        total_duration_seconds: 0,
        completion_rate: 0,
        ip_address: ip,
      })
      .select("id")
      .single();

    if (error) {
      console.error("[track] Failed to create view:", error);
      return NextResponse.json(
        { error: "Failed to record view" },
        { status: 500 },
      );
    }

    return NextResponse.json({ view_id: view.id });
  }

  // -------------------------------------------------------------------------
  // Events below require an existing view_id
  // -------------------------------------------------------------------------
  if (!view_id) {
    return NextResponse.json(
      { error: "view_id is required for this event" },
      { status: 400 },
    );
  }

  // -------------------------------------------------------------------------
  // Event: slide_change — append to slides_viewed JSONB
  // -------------------------------------------------------------------------
  if (event === "slide_change") {
    // Fetch current slides_viewed
    const { data: existing } = await supabase
      .from("deck_views")
      .select("slides_viewed")
      .eq("id", view_id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "View not found" }, { status: 404 });
    }

    const slidesViewed = Array.isArray(existing.slides_viewed)
      ? existing.slides_viewed
      : [];

    slidesViewed.push({
      index: slide_index ?? 0,
      timestamp: new Date().toISOString(),
      duration: duration ?? 0,
    });

    const { error } = await supabase
      .from("deck_views")
      .update({ slides_viewed: slidesViewed })
      .eq("id", view_id);

    if (error) {
      console.error("[track] Failed to update slides_viewed:", error);
      return NextResponse.json(
        { error: "Failed to record slide change" },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  }

  // -------------------------------------------------------------------------
  // Event: complete — update duration + completion rate
  // -------------------------------------------------------------------------
  if (event === "complete") {
    const updateFields: Record<string, unknown> = {};

    if (typeof duration === "number") {
      updateFields.total_duration_seconds = Math.round(duration);
    }

    // Calculate completion rate from slides_viewed vs total slides
    const { data: view } = await supabase
      .from("deck_views")
      .select("slides_viewed, template_id")
      .eq("id", view_id)
      .single();

    if (!view) {
      return NextResponse.json({ error: "View not found" }, { status: 404 });
    }

    // Get total slide count from template
    const { data: tmpl } = await supabase
      .from("slide_templates")
      .select("slides_json")
      .eq("id", view.template_id)
      .single();

    if (tmpl) {
      const totalSlides = Array.isArray(tmpl.slides_json)
        ? tmpl.slides_json.length
        : 0;
      const slidesViewed = Array.isArray(view.slides_viewed)
        ? view.slides_viewed
        : [];
      // Count unique slide indexes viewed
      const uniqueIndexes = new Set(
        slidesViewed.map(
          (s: { index?: number }) => s.index,
        ),
      );
      if (totalSlides > 0) {
        updateFields.completion_rate =
          Math.min(uniqueIndexes.size / totalSlides, 1);
      }
    }

    if (Object.keys(updateFields).length > 0) {
      const { error } = await supabase
        .from("deck_views")
        .update(updateFields)
        .eq("id", view_id);

      if (error) {
        console.error("[track] Failed to update completion:", error);
        return NextResponse.json(
          { error: "Failed to record completion" },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unhandled event" }, { status: 400 });
}
