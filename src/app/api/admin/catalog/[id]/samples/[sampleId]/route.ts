import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * PATCH /api/admin/catalog/[id]/samples/[sampleId]
 *
 * Partially updates a clip record in the clips table.
 * Unified Clip Architecture (US-019): edits clips directly, not dataset_samples.
 *
 * Accepts clip-native field names:
 *   s3_key, ann_annotation_key, ann_specs_key, ann_metadata,
 *   ai_enrichment_json, ai_caption, ai_agent_context,
 *   tech_duration_seconds, tech_resolution_width, tech_resolution_height,
 *   tech_fps, tech_codec, tech_bit_depth, tech_file_size_bytes
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sampleId: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: datasetId, sampleId: clipId } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // ---------------------------------------------------------------------
  // is_showcase lives on dataset_clips (the join), not on the clip itself.
  // Reject mixed payloads — callers should use one PATCH for the showcase
  // toggle (`{ is_showcase: bool }`) and another for clip-table edits.
  // Doing both atomically in this single endpoint risks half-applied writes
  // (one succeeds, the other 500s, no rollback path), which would silently
  // leave the catalog inconsistent.
  // ---------------------------------------------------------------------
  if ("is_showcase" in body && typeof body.is_showcase === "boolean") {
    const otherKeys = Object.keys(body).filter((k) => k !== "is_showcase");
    if (otherKeys.length > 0) {
      return NextResponse.json(
        {
          error:
            "Mixed payload not supported: send `is_showcase` in its own PATCH; clip-table fields in another.",
          rejected_fields: otherKeys,
        },
        { status: 400 },
      );
    }

    const supabaseDc = createSupabaseAdminClient();
    const { error: dcErr, count } = await supabaseDc
      .from("dataset_clips")
      .update({ is_showcase: body.is_showcase }, { count: "exact" })
      .eq("dataset_id", datasetId)
      .eq("clip_id", clipId)
      .is("lead_id", null);

    if (dcErr) {
      return NextResponse.json({ error: dcErr.message }, { status: 500 });
    }
    if (!count || count === 0) {
      return NextResponse.json(
        { error: "No matching dataset_clips row (clip may be lead-bound only)" },
        { status: 404 },
      );
    }

    const { count: showcaseCount } = await supabaseDc
      .from("dataset_clips")
      .select("clip_id", { count: "exact", head: true })
      .eq("dataset_id", datasetId)
      .eq("is_showcase", true)
      .is("lead_id", null);

    return NextResponse.json({
      ok: true,
      is_showcase: body.is_showcase,
      current_showcase_count: showcaseCount ?? 0,
    });
  }

  const allowedFields = [
    "s3_key",
    "ann_annotation_key",
    "ann_specs_key",
    "ann_metadata",
    "ai_enrichment_json",
    "ai_caption",
    "ai_agent_context",
    "tech_duration_seconds",
    "tech_resolution_width",
    "tech_resolution_height",
    "tech_fps",
    "tech_codec",
    "tech_bit_depth",
    "tech_file_size_bytes",
  ];

  const updates: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (field in body) {
      updates[field] = body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "At least one field must be provided" },
      { status: 400 }
    );
  }

  // Validate ann_metadata is valid JSON if provided as string
  if ("ann_metadata" in updates && updates.ann_metadata != null) {
    if (typeof updates.ann_metadata === "string") {
      try {
        updates.ann_metadata = JSON.parse(updates.ann_metadata);
      } catch {
        return NextResponse.json(
          { error: "ann_metadata must be valid JSON" },
          { status: 400 }
        );
      }
    }
  }

  // Validate ai_enrichment_json is valid JSON if provided as string
  if ("ai_enrichment_json" in updates && updates.ai_enrichment_json != null) {
    if (typeof updates.ai_enrichment_json === "string") {
      try {
        updates.ai_enrichment_json = JSON.parse(updates.ai_enrichment_json);
      } catch {
        return NextResponse.json(
          { error: "ai_enrichment_json must be valid JSON" },
          { status: 400 }
        );
      }
    }
  }

  const supabase = createSupabaseAdminClient();

  // Verify clip is linked to this dataset via dataset_clips
  const { data: existing, error: fetchError } = await supabase
    .from("dataset_clips")
    .select("id")
    .eq("clip_id", clipId)
    .eq("dataset_id", datasetId)
    .limit(1)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: "Clip not found in this dataset" }, { status: 404 });
  }

  const { data: updated, error: updateError } = await supabase
    .from("clips")
    .update(updates)
    .eq("id", clipId)
    .select()
    .single();

  if (updateError) {
    console.error("[PATCH /api/admin/catalog/[id]/samples/[sampleId]]", updateError);
    return NextResponse.json(
      { error: "Failed to update clip" },
      { status: 500 }
    );
  }

  return NextResponse.json(updated);
}

/**
 * DELETE /api/admin/catalog/[id]/samples/[sampleId]
 *
 * Removes a clip's association with a dataset by deleting the dataset_clips row.
 * Does NOT delete the clip itself (it may be referenced by other datasets).
 *
 * Unified Clip Architecture (US-019): deletes dataset_clips row, not dataset_samples.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; sampleId: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: datasetId, sampleId: clipId } = await params;
  const supabase = createSupabaseAdminClient();

  // Delete the dataset_clips row linking this clip to the dataset
  const { error: deleteError, count } = await supabase
    .from("dataset_clips")
    .delete({ count: "exact" })
    .eq("clip_id", clipId)
    .eq("dataset_id", datasetId);

  if (deleteError) {
    console.error("[DELETE /api/admin/catalog/[id]/samples/[sampleId]]", deleteError);
    return NextResponse.json(
      { error: "Failed to remove clip from dataset" },
      { status: 500 }
    );
  }

  if (count === 0) {
    return NextResponse.json({ error: "Clip not found in this dataset" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
