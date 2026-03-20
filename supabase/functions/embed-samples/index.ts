// supabase/functions/embed-samples/index.ts
// Deno Edge Function: polls for samples with agent_context but no embedding,
// generates embeddings via OpenAI, and writes them back.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const BATCH_SIZE = 10;

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

async function generateEmbedding(
  text: string,
  apiKey: string,
): Promise<number[]> {
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "text-embedding-3-small",
      input: text,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${err}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

Deno.serve(async (req) => {
  // Auth: validate service role key only
  const authHeader = req.headers.get("Authorization");
  const expectedKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const token = authHeader?.replace("Bearer ", "");

  if (!token || token !== expectedKey) {
    return new Response("Unauthorized", { status: 401 });
  }

  const openaiKey = Deno.env.get("OPENAI_API_KEY");
  if (!openaiKey) {
    return new Response("OPENAI_API_KEY not configured", { status: 500 });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabase = createClient(supabaseUrl, expectedKey!);

  // Poll for samples needing embeddings
  const { data: samples, error: fetchError } = await supabase
    .from("dataset_samples")
    .select("id, agent_context")
    .not("agent_context", "is", null)
    .is("embedding", null)
    .limit(BATCH_SIZE);

  if (fetchError) {
    console.error("Fetch error:", fetchError.message);
    return new Response(JSON.stringify({ error: fetchError.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!samples || samples.length === 0) {
    return new Response(
      JSON.stringify({ processed: 0, message: "No pending samples" }),
      { headers: { "Content-Type": "application/json" } },
    );
  }

  let processed = 0;
  let failed = 0;
  const errors: Array<{ id: string; error: string }> = [];

  for (const sample of samples) {
    try {
      const ctx = sample.agent_context as AgentContext;
      const text = agentContextToEmbeddingText(ctx);

      if (!text) {
        console.log(`Skipping ${sample.id}: empty embedding text`);
        continue;
      }

      const embedding = await generateEmbedding(text, openaiKey);

      const { error: updateError } = await supabase
        .from("dataset_samples")
        .update({ embedding })
        .eq("id", sample.id);

      if (updateError) {
        console.error(`Update error for ${sample.id}:`, updateError.message);
        errors.push({ id: sample.id, error: updateError.message });
        failed++;
      } else {
        processed++;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`Error processing ${sample.id}:`, msg);
      errors.push({ id: sample.id, error: msg });
      failed++;
    }
  }

  return new Response(
    JSON.stringify({ processed, failed, errors }),
    { headers: { "Content-Type": "application/json" } },
  );
});
