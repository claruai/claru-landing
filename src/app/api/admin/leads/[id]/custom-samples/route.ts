import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getS3SignedUrl } from "@/lib/s3/presigner";

const addSchema = z.object({
  video_index_id: z.string().uuid().optional(),
  dataset_sample_id: z.string().uuid().optional(),
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

  const { video_index_id, dataset_sample_id, note } = parsed.data;

  if (!video_index_id && !dataset_sample_id) {
    return NextResponse.json(
      { error: "Either video_index_id or dataset_sample_id is required" },
      { status: 400 }
    );
  }

  const supabase = createSupabaseAdminClient();

  // Denormalize s3_bucket + s3_key from the source
  let s3_bucket: string | null = null;
  let s3_key: string | null = null;

  if (video_index_id) {
    const { data: vi } = await supabase
      .from("video_index")
      .select("s3_bucket, s3_key")
      .eq("id", video_index_id)
      .single();
    if (vi) {
      s3_bucket = vi.s3_bucket;
      s3_key = vi.s3_key;
    }
  } else if (dataset_sample_id) {
    const { data: ds } = await supabase
      .from("dataset_samples")
      .select("s3_object_key")
      .eq("id", dataset_sample_id)
      .single();
    if (ds?.s3_object_key) {
      s3_key = ds.s3_object_key;
    }
  }

  const { data, error } = await supabase
    .from("lead_custom_samples")
    .insert({
      lead_id: id,
      video_index_id: video_index_id ?? null,
      dataset_sample_id: dataset_sample_id ?? null,
      s3_bucket,
      s3_key,
      added_by: "admin",
      note: note ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error("[POST custom-samples]", error);
    return NextResponse.json({ error: "Insert failed" }, { status: 500 });
  }

  return NextResponse.json({ sample: data }, { status: 201 });
}
