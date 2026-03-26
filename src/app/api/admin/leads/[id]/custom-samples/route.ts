import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getS3SignedUrl } from "@/lib/s3/presigner";

const addSchema = z.object({
  clip_id: z.string().uuid(),
  dataset_id: z.string().uuid().optional(),
  note: z.string().optional(),
});

/**
 * GET /api/admin/leads/[id]/custom-samples
 * Lists all custom samples for a lead with signed URLs.
 */
export async function GET(
  _request: NextRequest,
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

  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("lead_custom_samples")
    .select("*")
    .eq("lead_id", id)
    .order("added_at", { ascending: false });

  if (error) {
    console.error("[GET custom-samples]", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }

  // Generate signed URLs
  const samples = await Promise.all(
    (data ?? []).map(async (sample) => {
      let signed_url: string | null = null;
      if (sample.s3_key) {
        signed_url = await getS3SignedUrl(
          sample.s3_key,
          3600,
          sample.s3_bucket || undefined
        );
      }
      return { ...sample, signed_url };
    })
  );

  return NextResponse.json({ samples });
}

/**
 * POST /api/admin/leads/[id]/custom-samples
 * Adds a single custom sample to a lead.
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

  const parsed = addSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const { clip_id, dataset_id: providedDatasetId, note } = parsed.data;

  const supabase = createSupabaseAdminClient();

  // 1. Look up the clip
  const { data: clip } = await supabase
    .from("clips")
    .select("id, s3_bucket, s3_key, mime_type, filename, ai_caption")
    .eq("id", clip_id)
    .single();

  if (!clip) {
    return NextResponse.json({ error: "Clip not found" }, { status: 404 });
  }

  // 2. Resolve dataset_id — use provided value, or find an existing dataset_clips row
  let datasetId = providedDatasetId ?? null;
  if (!datasetId) {
    const { data: existingLink } = await supabase
      .from("dataset_clips")
      .select("dataset_id")
      .eq("clip_id", clip_id)
      .limit(1)
      .single();

    datasetId = existingLink?.dataset_id ?? null;
  }

  if (!datasetId) {
    return NextResponse.json(
      { error: "No dataset_id provided and clip has no existing dataset association" },
      { status: 400 }
    );
  }

  // 3. Pre-check for duplicate dataset_clips row (same dataset + clip + lead)
  const { data: existingRow } = await supabase
    .from("dataset_clips")
    .select("id")
    .eq("dataset_id", datasetId)
    .eq("clip_id", clip_id)
    .eq("lead_id", id)
    .maybeSingle();

  if (existingRow) {
    return NextResponse.json(
      { error: "This clip is already added for this lead in this dataset" },
      { status: 409 }
    );
  }

  // 4. Insert dataset_clips row (plain insert, not upsert)
  const { error: insertError } = await supabase
    .from("dataset_clips")
    .insert({
      dataset_id: datasetId,
      clip_id,
      lead_id: id,
      added_by: "admin",
      note: note ?? null,
    });

  if (insertError) {
    console.error("[POST custom-samples] insert dataset_clips", insertError);
    return NextResponse.json({ error: "Insert failed" }, { status: 500 });
  }

  // 5. Grant lead access to the dataset
  await supabase
    .from("lead_dataset_access")
    .upsert({ lead_id: id, dataset_id: datasetId }, { onConflict: "lead_id,dataset_id" });

  // 6. Generate signed URL for the response
  let signed_url: string | null = null;
  if (clip.s3_key) {
    signed_url = await getS3SignedUrl(
      clip.s3_key,
      3600,
      clip.s3_bucket || undefined
    );
  }

  return NextResponse.json({
    clip: { ...clip, signed_url },
    dataset_id: datasetId,
    message: "Clip added to dataset for lead",
  }, { status: 201 });
}
