import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { z } from "zod";

/**
 * MCP Server endpoint for Claru catalog tools.
 *
 * Serverless compatibility: Uses WebStandardStreamableHTTPServerTransport
 * which works with web standard Request/Response (compatible with Next.js
 * route handlers, Cloudflare Workers, etc.). Runs in stateless mode
 * (no session management) since each Vercel invocation is independent.
 *
 * The enableJsonResponse option ensures simple JSON-RPC responses instead
 * of SSE streams, which is more compatible with serverless cold starts
 * and short-lived function executions.
 */

function createServer(): McpServer {
  const server = new McpServer(
    { name: "claru-catalog", version: "1.0.0" },
    { capabilities: { tools: {} } },
  );

  // Test tool — will be replaced by real tools in US-010+
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

async function handleMcpRequest(request: Request): Promise<Response> {
  const server = createServer();
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // stateless mode
    enableJsonResponse: true,
  });

  await server.connect(transport);

  try {
    return await transport.handleRequest(request);
  } finally {
    await transport.close();
    await server.close();
  }
}

export async function POST(request: Request): Promise<Response> {
  return handleMcpRequest(request);
}

export async function GET(request: Request): Promise<Response> {
  return handleMcpRequest(request);
}

export async function DELETE(request: Request): Promise<Response> {
  return handleMcpRequest(request);
}
