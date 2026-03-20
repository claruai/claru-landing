import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const bulkSchema = z.object({
  items: z.array(
    z.object({
      video_index_id: z.string().uuid().optional(),
      dataset_sample_id: z.string().uuid().optional(),
    })
  ).min(1),
  note: z.string().optional(),
});

/**
 * POST /api/admin/leads/[id]/custom-samples/bulk
 * Bulk-adds custom samples to a lead in one transaction.
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

  // Resolve s3_bucket + s3_key for each item
  const rows: Array<{
    lead_id: string;
    video_index_id: string | null;
    dataset_sample_id: string | null;
    s3_bucket: string | null;
    s3_key: string | null;
    added_by: string;
    note: string | null;
  }> = [];

  // Batch-fetch video_index records
  const viIds = items
    .map((i) => i.video_index_id)
    .filter((v): v is string => !!v);

  let viMap = new Map<string, { s3_bucket: string; s3_key: string }>();
  if (viIds.length > 0) {
    const { data: viRecords } = await supabase
      .from("video_index")
      .select("id, s3_bucket, s3_key")
      .in("id", viIds);
    for (const vi of viRecords ?? []) {
      viMap.set(vi.id, { s3_bucket: vi.s3_bucket, s3_key: vi.s3_key });
    }
  }

  // Batch-fetch dataset_samples
  const dsIds = items
    .map((i) => i.dataset_sample_id)
    .filter((v): v is string => !!v);

  let dsMap = new Map<string, { s3_object_key: string | null }>();
  if (dsIds.length > 0) {
    const { data: dsRecords } = await supabase
      .from("dataset_samples")
      .select("id, s3_object_key")
      .in("id", dsIds);
    for (const ds of dsRecords ?? []) {
      dsMap.set(ds.id, { s3_object_key: ds.s3_object_key });
    }
  }

  for (const item of items) {
    let s3_bucket: string | null = null;
    let s3_key: string | null = null;

    if (item.video_index_id) {
      const vi = viMap.get(item.video_index_id);
      if (vi) {
        s3_bucket = vi.s3_bucket;
        s3_key = vi.s3_key;
      }
    } else if (item.dataset_sample_id) {
      const ds = dsMap.get(item.dataset_sample_id);
      if (ds?.s3_object_key) {
        s3_key = ds.s3_object_key;
      }
    }

    rows.push({
      lead_id: id,
      video_index_id: item.video_index_id ?? null,
      dataset_sample_id: item.dataset_sample_id ?? null,
      s3_bucket,
      s3_key,
      added_by: "admin",
      note: note ?? null,
    });
  }

  // Upsert — skip duplicates
  const { data, error } = await supabase
    .from("lead_custom_samples")
    .insert(rows)
    .select();

  if (error) {
    console.error("[POST custom-samples/bulk]", error);
    return NextResponse.json({ error: "Bulk insert failed" }, { status: 500 });
  }

  const inserted = data?.length ?? 0;
  const skipped = items.length - inserted;

  return NextResponse.json({ inserted, skipped }, { status: 201 });
}
