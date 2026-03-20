import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

/**
 * Create and configure the MCP server with all catalog tools.
 * Tools are registered here; the route handler manages transport and auth.
 */
export function createMcpServer(): McpServer {
  const server = new McpServer(
    { name: "claru-catalog", version: "1.0.0" },
    { capabilities: { tools: {} } },
  );

  // Test tool — will be replaced/extended by US-010, US-011, US-012
  server.tool(
    "echo",
    "Echo back the input (test tool)",
    { message: z.string().describe("Message to echo") },
    async ({ message }) => ({
      content: [{ type: "text", text: `Echo: ${message}` }],
    }),
  );

  return server;
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
