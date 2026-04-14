import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { register as registerSearch } from "./tools/search";
import { register as registerCrm } from "./tools/crm";
import { register as registerCatalog } from "./tools/catalog";
import { register as registerQa } from "./tools/qa";
import { register as registerPipeline } from "./tools/pipeline";

// Re-export auth utilities for backward compatibility with route.ts
export { validateBearerToken, checkRateLimit } from "./auth";

/**
 * Create and configure the MCP server with all catalog tools.
 * Tools are registered via domain modules; the route handler manages transport and auth.
 */
export function createMcpServer(): McpServer {
  const server = new McpServer(
    { name: "claru-catalog", version: "2.0.0" },
    { capabilities: { tools: {} } },
  );

  registerSearch(server);
  registerCrm(server);
  registerCatalog(server);
  registerQa(server);
  registerPipeline(server);

  return server;
}
