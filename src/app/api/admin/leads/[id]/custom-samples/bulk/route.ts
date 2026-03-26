import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const bulkSchema = z.object({
  items: z.array(
    z.object({
      clip_id: z.string().uuid(),
    })
  ).min(1),
  note: z.string().optional(),
});

/**
 * POST /api/admin/leads/[id]/custom-samples/bulk
 * Bulk-adds clips to a lead via dataset_clips rows.
 *
 * Unified Clip Architecture: inserts into dataset_clips join table
 * instead of legacy lead_custom_samples / dataset_samples tables.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const idParsed = z.string().uuid().safeParse(id);
  if (!idParsed.success) {
    return NextResponse.json({ error: "Invalid lead ID" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const parsed = bulkSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const { items, note } = parsed.data;
  const supabase = createSupabaseAdminClient();

  const clipIds = items.map((i) => i.clip_id);

  // 1. Batch-fetch clips to verify they exist
  const { data: clips } = await supabase
    .from("clips")
    .select("id")
    .in("id", clipIds);

  const validClipIds = new Set((clips ?? []).map((c) => c.id));
  const verifiedClipIds = clipIds.filter((cid) => validClipIds.has(cid));

  if (verifiedClipIds.length === 0) {
    return NextResponse.json({ error: "No valid clips found" }, { status: 404 });
  }

  // 2. Find existing dataset associations for these clips
  const { data: existingLinks } = await supabase
    .from("dataset_clips")
    .select("clip_id, dataset_id")
    .in("clip_id", verifiedClipIds);

  // Map clip_id -> first dataset_id found
  const clipDatasetMap = new Map<string, string>();
  for (const link of existingLinks ?? []) {
    if (!clipDatasetMap.has(link.clip_id)) {
      clipDatasetMap.set(link.clip_id, link.dataset_id);
    }
  }

  // 3. Pre-check for existing dataset_clips rows for this lead
  //    to avoid inserting duplicates
  const { data: existingLeadRows } = await supabase
    .from("dataset_clips")
    .select("clip_id, dataset_id")
    .eq("lead_id", id)
    .in("clip_id", verifiedClipIds);

  const existingLeadClipKeys = new Set(
    (existingLeadRows ?? []).map((r) => `${r.dataset_id}:${r.clip_id}`)
  );

  // 4. Build rows for insertion — skip clips without a dataset and duplicates
  const newRows: Array<{
    dataset_id: string;
    clip_id: string;
    lead_id: string;
    added_by: string;
    note: string | null;
  }> = [];

  const datasetIdsToGrant = new Set<string>();

  for (const clipId of verifiedClipIds) {
    const datasetId = clipDatasetMap.get(clipId);
    if (!datasetId) continue; // skip clips with no dataset association

    const key = `${datasetId}:${clipId}`;
    if (existingLeadClipKeys.has(key)) continue; // skip duplicates

    newRows.push({
      dataset_id: datasetId,
      clip_id: clipId,
      lead_id: id,
      added_by: "admin",
      note: note ?? null,
    });
    datasetIdsToGrant.add(datasetId);
  }

  // 5. Insert in batches
  let inserted = 0;
  const BATCH_SIZE = 100;

  for (let i = 0; i < newRows.length; i += BATCH_SIZE) {
    const batch = newRows.slice(i, i + BATCH_SIZE);
    const { data: insertedRows, error: insErr } = await supabase
      .from("dataset_clips")
      .insert(batch)
      .select("id");

    if (insErr) {
      console.error("[POST custom-samples/bulk] insert dataset_clips batch", insErr);
      // Continue with remaining batches
    } else {
      inserted += insertedRows?.length ?? 0;
    }
  }

  // 6. Grant lead access to all relevant datasets
  if (datasetIdsToGrant.size > 0) {
    const accessRows = Array.from(datasetIdsToGrant).map((dataset_id) => ({
      lead_id: id,
      dataset_id,
    }));
    await supabase
      .from("lead_dataset_access")
      .upsert(accessRows, { onConflict: "lead_id,dataset_id" });
  }

  const skipped = items.length - inserted;

  return NextResponse.json({ inserted, skipped }, { status: 201 });
}
