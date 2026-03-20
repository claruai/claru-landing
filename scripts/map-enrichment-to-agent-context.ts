/**
 * Map existing enrichment_json to agent_context for dataset_samples.
 *
 * Run with:
 *   npx tsx scripts/map-enrichment-to-agent-context.ts [--dry-run] [--dataset-id <uuid>] [--limit <n>]
 *
 * Only processes samples where agent_context IS NULL and enrichment_json is non-empty.
 * Idempotent — running twice produces no changes on the second run.
 */

import { createClient } from "@supabase/supabase-js";
import "dotenv/config";
import { mapEnrichmentToAgentContext } from "../src/lib/enrichment/field-mapper";

// ---------------------------------------------------------------------------
// CLI flags
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);

function getFlag(name: string): string | undefined {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 ? args[idx + 1] : undefined;
}

const DRY_RUN = args.includes("--dry-run");
const DATASET_ID = getFlag("dataset-id");
const LIMIT = getFlag("limit") ? parseInt(getFlag("limit")!, 10) : undefined;

// ---------------------------------------------------------------------------
// Supabase client
// ---------------------------------------------------------------------------

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log(`[map-enrichment] dry_run=${DRY_RUN} dataset_id=${DATASET_ID ?? "all"} limit=${LIMIT ?? "none"}`);

  // Fetch candidates: agent_context IS NULL and enrichment_json is non-empty
  let query = supabase
    .from("dataset_samples")
    .select("id, dataset_id, enrichment_json")
    .is("agent_context", null)
    .not("enrichment_json", "eq", "{}");

  if (DATASET_ID) {
    query = query.eq("dataset_id", DATASET_ID);
  }

  if (LIMIT) {
    query = query.limit(LIMIT);
  } else {
    query = query.limit(5000);
  }

  const { data: candidates, error } = await query;

  if (error) {
    console.error("Failed to fetch candidates:", error.message);
    process.exit(1);
  }

  if (!candidates || candidates.length === 0) {
    console.log("[map-enrichment] No candidates found — nothing to do.");
    return;
  }

  console.log(`[map-enrichment] Found ${candidates.length} candidates`);

  let mapped = 0;
  let skipped = 0;
  let failed = 0;

  for (const row of candidates) {
    try {
      const enrichmentJson = row.enrichment_json as Record<string, unknown>;
      if (!enrichmentJson || Object.keys(enrichmentJson).length === 0) {
        skipped++;
        continue;
      }

      const agentContext = mapEnrichmentToAgentContext(enrichmentJson);

      if (!agentContext.scene_summary && agentContext.environments.length === 0) {
        skipped++;
        continue;
      }

      if (DRY_RUN) {
        console.log(`  [dry-run] ${row.id} → scene: "${agentContext.scene_summary.slice(0, 80)}..."`);
        mapped++;
        continue;
      }

      const { error: updateError } = await supabase
        .from("dataset_samples")
        .update({ agent_context: agentContext })
        .eq("id", row.id);

      if (updateError) {
        console.error(`  [error] ${row.id}: ${updateError.message}`);
        failed++;
      } else {
        mapped++;
      }
    } catch (err) {
      console.error(`  [error] ${row.id}:`, err);
      failed++;
    }
  }

  console.log(`\n[map-enrichment] Done. Mapped ${mapped} / skipped ${skipped} / failed ${failed}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
