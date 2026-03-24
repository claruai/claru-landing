/**
 * One-time backfill: generate embeddings for samples that have agent_context
 * but no embedding yet.
 *
 * Run with:
 *   npx tsx scripts/backfill-embeddings.ts [--dry-run] [--limit <n>]
 *
 * Idempotent — only processes rows where agent_context IS NOT NULL AND embedding IS NULL.
 * Processes in batches of 20.
 */

import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

// Inline embedding helpers to avoid Deno/Node import issues with @/ aliases
import OpenAI from "openai";

interface AgentContext {
  scene_summary?: string;
  environments?: string[];
  activities?: string[];
  objects?: string[];
  camera_perspective?: string;
}

function agentContextToEmbeddingText(ctx: AgentContext): string {
  const parts: string[] = [];
  if (ctx.scene_summary) parts.push(ctx.scene_summary);
  if (ctx.environments?.length) parts.push(`Environments: ${ctx.environments.join(", ")}`);
  if (ctx.activities?.length) parts.push(`Activities: ${ctx.activities.join(", ")}`);
  if (ctx.objects?.length) parts.push(`Objects: ${ctx.objects.join(", ")}`);
  if (ctx.camera_perspective) parts.push(`Camera: ${ctx.camera_perspective}`);
  return parts.join(". ");
}

// ---------------------------------------------------------------------------
// CLI flags
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);

function getFlag(name: string): string | undefined {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 ? args[idx + 1] : undefined;
}

const DRY_RUN = args.includes("--dry-run");
const LIMIT = getFlag("limit") ? parseInt(getFlag("limit")!, 10) : undefined;
const BATCH_SIZE = 20;

// ---------------------------------------------------------------------------
// Clients
// ---------------------------------------------------------------------------

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const openaiKey = process.env.OPENAI_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
if (!openaiKey) {
  console.error("Missing OPENAI_API_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const openai = new OpenAI({ apiKey: openaiKey });

async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return response.data[0].embedding;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log(`[backfill-embeddings] dry_run=${DRY_RUN} limit=${LIMIT ?? "all"} batch_size=${BATCH_SIZE}`);

  let totalProcessed = 0;
  let totalFailed = 0;
  let hasMore = true;

  while (hasMore) {
    const remaining = LIMIT ? LIMIT - totalProcessed : BATCH_SIZE;
    if (remaining <= 0) break;

    const fetchSize = Math.min(BATCH_SIZE, remaining);

    const { data: samples, error } = await supabase
      .from("dataset_samples")
      .select("id, agent_context")
      .not("agent_context", "is", null)
      .is("embedding", null)
      .limit(fetchSize);

    if (error) {
      console.error("Fetch error:", error.message);
      process.exit(1);
    }

    if (!samples || samples.length === 0) {
      hasMore = false;
      break;
    }

    console.log(`  [batch] Processing ${samples.length} samples...`);

    for (const sample of samples) {
      try {
        const ctx = sample.agent_context as AgentContext;
        const text = agentContextToEmbeddingText(ctx);

        if (!text) {
          console.log(`  [skip] ${sample.id}: empty embedding text`);
          continue;
        }

        if (DRY_RUN) {
          console.log(`  [dry-run] ${sample.id}: "${text.slice(0, 80)}..."`);
          totalProcessed++;
          continue;
        }

        const embedding = await generateEmbedding(text);

        const { error: updateError } = await supabase
          .from("dataset_samples")
          .update({ embedding })
          .eq("id", sample.id);

        if (updateError) {
          console.error(`  [error] ${sample.id}: ${updateError.message}`);
          totalFailed++;
        } else {
          totalProcessed++;
        }
      } catch (err) {
        console.error(`  [error] ${sample.id}:`, err instanceof Error ? err.message : err);
        totalFailed++;
      }
    }

    if (samples.length < fetchSize) {
      hasMore = false;
    }
  }

  console.log(`\n[backfill-embeddings] Done. Processed ${totalProcessed} / failed ${totalFailed}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
