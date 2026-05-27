import { randomBytes } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { findOrCreateLeadByEmail, type LeadRow } from "@/lib/leads/find-or-create";
import { mintShareToken } from "@/lib/share/mint-token";

export const CUSTOM_CURATIONS_CATEGORY_ID = "46cf5324-f3e3-484f-9cb3-7b1dffff0094";

export interface SamplePackInput {
  sourceDatasetSlugs: string[];
  recipient: { name: string; email: string; company: string };
  note?: string;
  expiresInDays?: number;
  /** When true (default), the generated dataset uses a slug prefixed `test-` for easy QA cleanup. */
  testIsolation?: boolean;
}

export interface SamplePackResult {
  dataset_id: string;
  dataset_name: string;
  dataset_slug: string;
  share_url: string;
  share_token: string;
  expires_at: string;
  lead: LeadRow;
  lead_created: boolean;
  clip_count: number;
  per_source_breakdown: Array<{
    slug: string;
    name: string;
    contributed_clips: number;
  }>;
}

const DEFAULT_EXPIRES_DAYS = 30;

const slugify = (s: string): string =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

export async function buildSamplePack(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any, "public", "public", any, any>,
  input: SamplePackInput,
): Promise<SamplePackResult> {
  if (!input.sourceDatasetSlugs?.length) {
    throw new Error("buildSamplePack: at least one source dataset slug required");
  }
  if (!input.recipient?.email) {
    throw new Error("buildSamplePack: recipient.email required");
  }

  // 1. Resolve source datasets
  const { data: sourceDatasets, error: srcErr } = await supabase
    .from("datasets")
    .select("id, slug, name")
    .in("slug", input.sourceDatasetSlugs);

  if (srcErr) {
    throw new Error(`Source dataset lookup failed: ${srcErr.message}`);
  }
  if (!sourceDatasets || sourceDatasets.length === 0) {
    throw new Error(`No source datasets found for slugs: ${input.sourceDatasetSlugs.join(", ")}`);
  }

  const missing = input.sourceDatasetSlugs.filter(
    (s) => !sourceDatasets.find((d) => d.slug === s),
  );
  if (missing.length) {
    throw new Error(`Unknown source datasets: ${missing.join(", ")}`);
  }

  // 2. Collect showcase clips from sources
  const sourceIds = sourceDatasets.map((d) => d.id);
  const { data: clipRows, error: clipErr } = await supabase
    .from("dataset_clips")
    .select("clip_id, dataset_id")
    .in("dataset_id", sourceIds)
    .eq("is_showcase", true)
    .is("lead_id", null);

  if (clipErr) {
    throw new Error(`Showcase clip lookup failed: ${clipErr.message}`);
  }

  const uniqueClipIds = Array.from(new Set((clipRows ?? []).map((r) => r.clip_id)));
  if (uniqueClipIds.length === 0) {
    throw new Error(
      `No showcase clips found across source datasets. Mark some clips as is_showcase=true first.`,
    );
  }

  const perSource = sourceDatasets.map((d) => ({
    slug: d.slug,
    name: d.name,
    contributed_clips: (clipRows ?? []).filter((r) => r.dataset_id === d.id).length,
  }));

  // 3. Find-or-create lead
  const { lead, created: leadCreated } = await findOrCreateLeadByEmail(supabase, input.recipient.email, {
    name: input.recipient.name,
    company: input.recipient.company,
    source: "sample-pack",
  });

  // Helper: undo a *newly-created* lead row only. Pre-existing leads
  // (leadCreated=false) are independently useful and must not be deleted.
  // Called when any later step fails so we don't leak orphan leads.
  const cleanupLeadIfNew = async () => {
    if (!leadCreated) return;
    const { error: leadErr } = await supabase.from("leads").delete().eq("id", lead.id);
    if (leadErr) {
      console.error(
        `[buildSamplePack:rollback] orphan lead delete failed for ${lead.id}: ${leadErr.message}`,
      );
    }
  };

  // 4. Create the curation dataset
  const today = new Date().toISOString().slice(0, 10);
  const baseName = `Sample — ${input.recipient.company} — ${today}`;
  const isolation = input.testIsolation ?? false;
  const slugPrefix = isolation ? "test-sample-" : "sample-";
  // 8 hex chars (~4B combos) from crypto.randomBytes — collision-resistant
  // across many same-day packs for the same company. UNIQUE constraint on
  // datasets.slug still acts as a final safety net.
  const slug = `${slugPrefix}${slugify(input.recipient.company)}-${today}-${randomBytes(4).toString("hex")}`;

  const totalDurationHours = 0; // can be recomputed later from clip durations

  const { data: newDataset, error: insertErr } = await supabase
    .from("datasets")
    .insert({
      category_id: CUSTOM_CURATIONS_CATEGORY_ID,
      name: baseName,
      slug,
      description: `Sample pack curated for ${input.recipient.company}. Pulled from: ${sourceDatasets
        .map((d) => d.name)
        .join("; ")}.${input.note ? ` Note: ${input.note}` : ""}`,
      type: "long_form",
      source_type: "curated",
      modality: "video_text",
      s3_bucket: "moonvalley-annotation-platform",
      show_enrichment: false,
      is_published: false,
      total_samples: uniqueClipIds.length,
      total_duration_hours: totalDurationHours,
      geographic_coverage: "Mixed",
      annotation_types: ["COLLECTION"],
      tags: ["sample-pack", ...sourceDatasets.map((d) => d.slug)],
      created_for_lead_id: lead.id,
      share_mode: "all",
    })
    .select("id, slug, name")
    .single();

  if (insertErr || !newDataset) {
    // Dataset insert failed — clean up the orphan lead before throwing.
    await cleanupLeadIfNew();
    throw new Error(`Failed to create sample pack dataset: ${insertErr?.message}`);
  }

  // Helper: rollback dataset if any later step fails. Logs each step
  // explicitly so a half-failed rollback can be triaged from prod logs.
  // Cleans up the orphan lead too (so a 5-step pack always leaves an
  // all-or-nothing footprint).
  const rollback = async () => {
    const { error: dcErr } = await supabase
      .from("dataset_clips")
      .delete()
      .eq("dataset_id", newDataset.id);
    if (dcErr) {
      console.error(
        `[buildSamplePack:rollback] dataset_clips delete failed for ${newDataset.id}: ${dcErr.message}`,
      );
    }
    const { error: ldaErr } = await supabase
      .from("lead_dataset_access")
      .delete()
      .eq("dataset_id", newDataset.id);
    if (ldaErr) {
      console.error(
        `[buildSamplePack:rollback] lead_dataset_access delete failed for ${newDataset.id}: ${ldaErr.message}`,
      );
    }
    const { error: dsErr } = await supabase
      .from("datasets")
      .delete()
      .eq("id", newDataset.id);
    if (dsErr) {
      console.error(
        `[buildSamplePack:rollback] datasets delete failed for ${newDataset.id}: ${dsErr.message}`,
      );
    }
    await cleanupLeadIfNew();
  };

  try {
    // 5. Attach clips
    const datasetClipRows = uniqueClipIds.map((clip_id) => ({
      dataset_id: newDataset.id,
      clip_id,
      lead_id: lead.id,
      is_showcase: true,
      added_by: "sample-pack-builder",
      note: input.note ?? null,
    }));

    const { error: linkErr } = await supabase.from("dataset_clips").insert(datasetClipRows);
    if (linkErr) {
      throw new Error(`Failed to attach clips: ${linkErr.message}`);
    }

    // 6. Grant lead access
    const { error: grantErr } = await supabase
      .from("lead_dataset_access")
      .upsert(
        { lead_id: lead.id, dataset_id: newDataset.id, granted_by: "sample-pack-builder" },
        { onConflict: "lead_id,dataset_id" },
      );
    if (grantErr) {
      throw new Error(`Failed to grant lead access: ${grantErr.message}`);
    }

    // 7. Mint share token (mode='all' since this dataset IS the curated subset)
    const tokenResult = await mintShareToken(supabase, newDataset.id, {
      expiresInDays: input.expiresInDays ?? DEFAULT_EXPIRES_DAYS,
      mode: "all",
    });

    return {
      dataset_id: newDataset.id,
      dataset_name: newDataset.name,
      dataset_slug: newDataset.slug,
      share_url: tokenResult.share_url,
      share_token: tokenResult.token,
      expires_at: tokenResult.expires_at,
      lead,
      lead_created: leadCreated,
      clip_count: uniqueClipIds.length,
      per_source_breakdown: perSource,
    };
  } catch (err) {
    await rollback();
    throw err;
  }
}
