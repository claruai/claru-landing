import OpenAI from "openai";
import type { AgentContext } from "@/lib/enrichment/types";

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not set");
    }
    client = new OpenAI({ apiKey });
  }
  return client;
}

/**
 * Generate a 1536-dimension embedding using text-embedding-3-small.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const openai = getClient();
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return response.data[0].embedding;
}

/**
 * Convert an AgentContext into a single text string suitable for embedding.
 * Concatenates the most semantically relevant fields.
 */
export function agentContextToEmbeddingText(ctx: AgentContext): string {
  const parts: string[] = [];

  if (ctx.scene_summary) parts.push(ctx.scene_summary);
  if (ctx.environments?.length) parts.push(`Environments: ${ctx.environments.join(", ")}`);
  if (ctx.activities?.length) parts.push(`Activities: ${ctx.activities.join(", ")}`);
  if (ctx.objects?.length) parts.push(`Objects: ${ctx.objects.join(", ")}`);
  if (ctx.camera_perspective) parts.push(`Camera: ${ctx.camera_perspective}`);

  return parts.join(". ");
}
