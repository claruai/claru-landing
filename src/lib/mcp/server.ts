import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { generateEmbedding } from "@/lib/embeddings/openai";
import { getS3SignedUrl } from "@/lib/s3/presigner";
import { scrubS3Urls } from "@/lib/scrub-s3-urls";
import type { AgentContext } from "@/lib/enrichment/types";

/**
 * Create and configure the MCP server with all catalog tools.
 * Tools are registered here; the route handler manages transport and auth.
 */
export function createMcpServer(): McpServer {
  const server = new McpServer(
    { name: "claru-catalog", version: "1.0.0" },
    { capabilities: { tools: {} } },
  );

  registerSearchCatalog(server);

  return server;
}

// ---------------------------------------------------------------------------
// search_catalog tool
// ---------------------------------------------------------------------------

function registerSearchCatalog(server: McpServer) {
  server.tool(
    "search_catalog",
    "Semantic search over annotated dataset samples. Returns samples ranked by relevance to the query.",
    {
      query: z.string().describe("Natural language search query"),
      limit: z.number().min(1).max(50).default(10).describe("Max results (default 10, max 50)"),
      dataset_id: z.string().uuid().optional().describe("Optional: restrict to a single dataset"),
    },
    async ({ query, limit, dataset_id }) => {
      const supabase = createSupabaseAdminClient();

      // Embed the query
      const queryEmbedding = await generateEmbedding(query);

      // Call match_samples RPC
      const { data: matches, error } = await supabase.rpc("match_samples", {
        query_embedding: queryEmbedding,
        match_count: limit,
        filter_dataset_id: dataset_id ?? null,
      });

      if (error) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: error.message }) }],
        };
      }

      if (!matches || matches.length === 0) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ results: [], message: "No samples found matching query" }) }],
        };
      }

      // Generate signed URLs and format results
      const results = await Promise.all(
        matches.map(async (match: {
          sample_id: string;
          dataset_id: string;
          dataset_name: string;
          similarity: number;
          agent_context: AgentContext | null;
          s3_object_key: string | null;
          mime_type: string;
        }) => {
          let signed_url: string | null = null;
          if (match.s3_object_key) {
            signed_url = await getS3SignedUrl(match.s3_object_key, 3600);
          }

          const ctx = match.agent_context;
          return {
            sample_id: match.sample_id,
            dataset_id: match.dataset_id,
            dataset_name: match.dataset_name,
            similarity: Math.round(match.similarity * 1000) / 1000,
            scene_summary: ctx?.scene_summary ?? null,
            environments: ctx?.environments ?? [],
            activities: ctx?.activities ?? [],
            objects: ctx?.objects ?? [],
            camera_perspective: ctx?.camera_perspective ?? null,
            signed_url,
            mime_type: match.mime_type,
          };
        }),
      );

      // Scrub any leaked S3 URLs
      const scrubbed = scrubS3Urls({ results });

      return {
        content: [{ type: "text" as const, text: JSON.stringify(scrubbed) }],
      };
    },
  );
}

// ---------------------------------------------------------------------------
// Auth: Bearer token validation using timing-safe comparison
// ---------------------------------------------------------------------------

export function validateBearerToken(request: Request): boolean {
  const expectedToken = process.env.ADMIN_MCP_TOKEN;
  if (!expectedToken) return false;

  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;

  const token = authHeader.slice(7);

  // Timing-safe comparison
  if (token.length !== expectedToken.length) return false;

  const encoder = new TextEncoder();
  const a = encoder.encode(token);
  const b = encoder.encode(expectedToken);

  // Use crypto.subtle for timing-safe compare in web standard environments
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a[i] ^ b[i];
  }
  return result === 0;
}

// ---------------------------------------------------------------------------
// Rate limiting: in-memory per-IP limits
// ---------------------------------------------------------------------------

interface RateLimitEntry {
  minuteCount: number;
  minuteStart: number;
  hourCount: number;
  hourStart: number;
}

const RATE_LIMIT_MINUTE = 100;
const RATE_LIMIT_HOUR = 1000;
const rateLimitStore = new Map<string, RateLimitEntry>();

export function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  let entry = rateLimitStore.get(ip);

  if (!entry) {
    entry = {
      minuteCount: 0,
      minuteStart: now,
      hourCount: 0,
      hourStart: now,
    };
    rateLimitStore.set(ip, entry);
  }

  // Reset minute window
  if (now - entry.minuteStart > 60_000) {
    entry.minuteCount = 0;
    entry.minuteStart = now;
  }

  // Reset hour window
  if (now - entry.hourStart > 3_600_000) {
    entry.hourCount = 0;
    entry.hourStart = now;
  }

  entry.minuteCount++;
  entry.hourCount++;

  if (entry.minuteCount > RATE_LIMIT_MINUTE) {
    const retryAfter = Math.ceil((entry.minuteStart + 60_000 - now) / 1000);
    return { allowed: false, retryAfter: Math.max(1, retryAfter) };
  }

  if (entry.hourCount > RATE_LIMIT_HOUR) {
    const retryAfter = Math.ceil((entry.hourStart + 3_600_000 - now) / 1000);
    return { allowed: false, retryAfter: Math.max(1, retryAfter) };
  }

  return { allowed: true };
}
