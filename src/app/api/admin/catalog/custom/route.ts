import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
// =============================================================================
// POST /api/admin/catalog/custom
//
// Creates a custom curated catalog for a specific lead.
// Steps:
//   1. Create a new dataset (source_type=curated, category=Custom Curations)
//   2. Insert selected clips as lead-specific samples
//   3. Grant lead access to the new dataset
//   4. Return the new dataset + portal link
// =============================================================================

const CUSTOM_CURATIONS_CATEGORY_ID = "46cf5324-f3e3-484f-9cb3-7b1dffff0094";

const itemSchema = z.object({
  video_index_id: z.string().uuid().optional(),
  dataset_sample_id: z.string().uuid().optional(),
});

const requestSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  lead_id: z.string().uuid("Invalid lead ID"),
  dataset_id: z.string().uuid().optional().describe("If provided, add clips to this existing dataset instead of creating a new one"),
  items: z.array(itemSchema).min(1, "At least one item is required"),
  note: z.string().optional(),
});

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Validation failed" },
      { status: 400 }
    );
  }

  const { name, lead_id, dataset_id: existingDatasetId, items, note } = parsed.data;
  const supabase = createSupabaseAdminClient();

  // Verify lead exists
  const { data: lead } = await supabase
    .from("leads")
    .select("id, name, company")
    .eq("id", lead_id)
    .single();

  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  // 1. Use existing dataset or create a new one
  let dataset: { id: string; name: string; slug: string };

  if (existingDatasetId) {
    const { data: existing } = await supabase
      .from("datasets")
      .select("id, name, slug")
      .eq("id", existingDatasetId)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Dataset not found" }, { status: 404 });
    }
    dataset = existing;
  } else {
    const slug = slugify(name) + "-" + Date.now().toString(36);
    const { data: created, error: dsError } = await supabase
      .from("datasets")
      .insert({
        name,
        slug,
        category_id: CUSTOM_CURATIONS_CATEGORY_ID,
        type: "short_form",
        source_type: "curated",
        subcategory: "",
        description: `Custom curated collection for ${lead.name} (${lead.company})`,
        total_samples: 0,
        total_duration_hours: 0,
        geographic_coverage: "",
        annotation_types: [],
        is_published: true,
      })
      .select()
      .single();

    if (dsError || !created) {
      console.error("[POST /api/admin/catalog/custom] create dataset", dsError);
      return NextResponse.json({ error: "Failed to create dataset" }, { status: 500 });
    }
    dataset = created;
  }

  // 2. Process each item — resolve S3 info and insert as lead-specific samples
  const mimeMap: Record<string, string> = {
    mp4: "video/mp4", mov: "video/quicktime", webm: "video/webm",
    jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
  };

  let inserted = 0;

  for (const item of items) {
    if (item.video_index_id) {
      // Full corpus clip → look up video_index, create dataset_samples row
      const { data: vi } = await supabase
        .from("video_index")
        .select("s3_bucket, s3_key, caption_text, enrichment_source")
        .eq("id", item.video_index_id)
        .single();

      if (!vi) continue;

      const ext = vi.s3_key.split(".").pop()?.toLowerCase();
      const mimeType = (ext && mimeMap[ext]) || "video/mp4";

      const { error: insErr } = await supabase
        .from("dataset_samples")
        .insert({
          dataset_id: dataset.id,
          lead_id,
          s3_object_key: vi.s3_key,
          s3_bucket: vi.s3_bucket,
          filename: vi.s3_key.split("/").pop() || "sample",
          mime_type: mimeType,
          file_size_bytes: 0,
          metadata_json: {
            caption: vi.caption_text,
            source: vi.enrichment_source,
            note,
          },
          added_by: "admin",
          source_video_index_id: item.video_index_id,
        });

      if (!insErr) inserted++;
    } else if (item.dataset_sample_id) {
      // Existing catalog sample → copy its S3 info into the new dataset
      const { data: existing } = await supabase
        .from("dataset_samples")
        .select("s3_object_key, s3_bucket, filename, mime_type, file_size_bytes, metadata_json, agent_context")
        .eq("id", item.dataset_sample_id)
        .single();

      if (!existing) continue;

      const { error: insErr } = await supabase
        .from("dataset_samples")
        .insert({
          dataset_id: dataset.id,
          lead_id,
          s3_object_key: existing.s3_object_key,
          s3_bucket: existing.s3_bucket,
          filename: existing.filename,
          mime_type: existing.mime_type,
          file_size_bytes: existing.file_size_bytes,
          metadata_json: {
            ...(existing.metadata_json as Record<string, unknown>),
            note,
            source_sample_id: item.dataset_sample_id,
          },
          agent_context: existing.agent_context,
          added_by: "admin",
        });

      if (!insErr) inserted++;
    }
  }

  // 3. Update dataset sample count (use actual count for existing datasets)
  const { count: totalCount } = await supabase
    .from("dataset_samples")
    .select("id", { count: "exact", head: true })
    .eq("dataset_id", dataset.id);

  await supabase
    .from("datasets")
    .update({ total_samples: totalCount ?? inserted })
    .eq("id", dataset.id);

  // 4. Grant lead access
  await supabase
    .from("lead_dataset_access")
    .upsert(
      { lead_id, dataset_id: dataset.id },
      { onConflict: "lead_id,dataset_id" }
    );

  // 5. Generate signed URLs for the first sample (for the portal link preview)
  const portalUrl = `/portal/catalog/${dataset.id}`;

  return NextResponse.json(
    {
      dataset: { id: dataset.id, name: dataset.name, slug: dataset.slug },
      samples_added: inserted,
      portal_url: portalUrl,
      lead: { id: lead.id, name: lead.name, company: lead.company },
    },
    { status: 201 }
  );
}
