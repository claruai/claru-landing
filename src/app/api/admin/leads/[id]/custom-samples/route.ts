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

  if (video_index_id) {
    // ------------------------------------------------------------------
    // Adding a full-corpus clip → create a dataset_samples row with lead_id
    // ------------------------------------------------------------------
    const { data: vi } = await supabase
      .from("video_index")
      .select("s3_bucket, s3_key, caption_text, enrichment_source")
      .eq("id", video_index_id)
      .single();

    if (!vi) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Resolve which dataset this clip belongs to via prefix routing
    const { data: routeResult } = await supabase.rpc("resolve_dataset_for_s3_key", {
      p_bucket: vi.s3_bucket,
      p_key: vi.s3_key,
    });

    const datasetId = routeResult as string | null;
    if (!datasetId) {
      return NextResponse.json(
        { error: `No dataset mapping found for ${vi.s3_bucket}/${vi.s3_key.split("/")[0]}` },
        { status: 400 }
      );
    }

    // Guess mime type from extension
    const ext = vi.s3_key.split(".").pop()?.toLowerCase();
    const mimeMap: Record<string, string> = {
      mp4: "video/mp4", mov: "video/quicktime", webm: "video/webm",
      jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
    };
    const mimeType = (ext && mimeMap[ext]) || "video/mp4";

    // Insert as a lead-specific sample in the resolved dataset
    const { data: sample, error } = await supabase
      .from("dataset_samples")
      .insert({
        dataset_id: datasetId,
        lead_id: id,
        s3_object_key: vi.s3_key,
        filename: vi.s3_key.split("/").pop() || "sample",
        mime_type: mimeType,
        file_size_bytes: 0,
        metadata_json: { caption: vi.caption_text, source: vi.enrichment_source, note },
        added_by: "admin",
        source_video_index_id: video_index_id,
      })
      .select()
      .single();

    if (error) {
      console.error("[POST custom-samples] insert dataset_samples", error);
      return NextResponse.json({ error: "Insert failed" }, { status: 500 });
    }

    // Ensure the lead has access to this dataset
    await supabase
      .from("lead_dataset_access")
      .upsert({ lead_id: id, dataset_id: datasetId }, { onConflict: "lead_id,dataset_id" });

    return NextResponse.json({
      sample,
      dataset_id: datasetId,
      message: "Added to dataset as lead-specific sample",
    }, { status: 201 });

  } else {
    // ------------------------------------------------------------------
    // Adding an existing catalog sample → just tag it for the lead
    // (This is for cases where the sample already exists in dataset_samples
    // but the lead doesn't have access to that dataset yet)
    // ------------------------------------------------------------------
    const { data: ds } = await supabase
      .from("dataset_samples")
      .select("dataset_id")
      .eq("id", dataset_sample_id!)
      .single();

    if (!ds) {
      return NextResponse.json({ error: "Sample not found" }, { status: 404 });
    }

    // Grant lead access to the dataset
    await supabase
      .from("lead_dataset_access")
      .upsert({ lead_id: id, dataset_id: ds.dataset_id }, { onConflict: "lead_id,dataset_id" });

    return NextResponse.json({
      dataset_id: ds.dataset_id,
      message: "Lead granted access to dataset containing this sample",
    }, { status: 201 });
  }
}
