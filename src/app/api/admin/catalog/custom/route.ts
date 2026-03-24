import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
// =============================================================================
// POST /api/admin/catalog/custom
//
// Unified Clip Architecture (US-010):
// Creates or updates a dataset by inserting dataset_clips rows.
// NO data copying — clips already live in the clips table.
//
// Steps:
//   1. Use existing dataset or create a new one (source_type=curated)
//   2. Insert dataset_clips rows linking clip IDs to the dataset
//   3. Update dataset sample count from dataset_clips
//   4. Grant lead access to the dataset
//   5. Return dataset + portal link
// =============================================================================

const CUSTOM_CURATIONS_CATEGORY_ID = "46cf5324-f3e3-484f-9cb3-7b1dffff0094";

const requestSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  lead_id: z.string().uuid("Invalid lead ID"),
  dataset_id: z.string().uuid().optional().describe("If provided, add clips to this existing dataset instead of creating a new one"),
  /** Clip IDs from the clips table */
  clip_ids: z.array(z.string().uuid()).min(1, "At least one clip is required"),
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

  const { name, lead_id, dataset_id: existingDatasetId, clip_ids, note } = parsed.data;
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

  // 2. Insert dataset_clips rows — no data copying, just join table inserts
  const datasetClipRows = clip_ids.map((clip_id) => ({
    dataset_id: dataset.id,
    clip_id,
    lead_id,
    added_by: "admin",
    note: note ?? null,
  }));

  // Insert in batches to avoid hitting Supabase row limits.
  // Uses plain insert (not upsert) because dataset_clips has no unique
  // constraint on (dataset_id, clip_id, lead_id). Duplicates are skipped
  // by filtering out clip_ids that already have rows.
  let inserted = 0;
  const BATCH_SIZE = 100;

  // Pre-check: which clip_ids already exist for this dataset+lead?
  const { data: existingRows } = await supabase
    .from("dataset_clips")
    .select("clip_id")
    .eq("dataset_id", dataset.id)
    .eq("lead_id", lead_id)
    .in("clip_id", clip_ids);

  const existingClipIds = new Set((existingRows ?? []).map((r) => r.clip_id));
  const newRows = datasetClipRows.filter((r) => !existingClipIds.has(r.clip_id));

  for (let i = 0; i < newRows.length; i += BATCH_SIZE) {
    const batch = newRows.slice(i, i + BATCH_SIZE);
    const { data: insertedRows, error: insErr } = await supabase
      .from("dataset_clips")
      .insert(batch)
      .select("id");

    if (insErr) {
      console.error("[POST /api/admin/catalog/custom] insert dataset_clips batch", insErr);
      // Continue with remaining batches
    } else {
      inserted += insertedRows?.length ?? 0;
    }
  }

  // 3. Update dataset sample count from dataset_clips
  const { count: totalCount } = await supabase
    .from("dataset_clips")
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

  const portalUrl = `/portal/catalog/${dataset.id}`;

  return NextResponse.json(
    {
      dataset: { id: dataset.id, name: dataset.name, slug: dataset.slug },
      clips_added: inserted,
      // Keep backward-compatible alias
      samples_added: inserted,
      portal_url: portalUrl,
      lead: { id: lead.id, name: lead.name, company: lead.company },
    },
    { status: 201 }
  );
}
