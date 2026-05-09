import { test, expect, request } from "@playwright/test";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "./helpers/admin-credentials";
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";
const MCP_TOKEN = process.env.ADMIN_MCP_TOKEN || "";

/**
 * Full UAT: catalog enrichment + MCP server verification.
 *
 * Requires:
 * - Populated agent_context + embeddings for 5+ samples
 * - Running dev server or PLAYWRIGHT_BASE_URL
 * - ADMIN_MCP_TOKEN set
 */

async function adminLogin(page: import("@playwright/test").Page) {
  await page.goto("/admin");
  await page.fill('input[type="email"], input[name="email"]', ADMIN_EMAIL);
  await page.fill('input[type="password"]', ADMIN_PASSWORD);
  await page.locator('button[type="submit"]').click();
  await page.waitForURL("**/admin/**", { timeout: 10000 });
}

test.describe("Catalog Enrichment UAT", () => {
  test("admin search: two queries return different results", async ({
    page,
  }) => {
    await adminLogin(page);
    await page.goto("/admin/catalog/search");

    // Query 1
    await page.fill('input[placeholder*="Semantic search"]', "kitchen cooking food");
    await page.locator('button:has-text("search")').click();
    await expect(
      page.getByText("result").or(page.getByText("No samples found")),
    ).toBeVisible({ timeout: 30000 });

    const results1Text = await page.locator(".grid").first().textContent();

    // Query 2
    await page.fill('input[placeholder*="Semantic search"]', "outdoor traffic vehicles");
    await page.locator('button:has-text("search")').click();
    await expect(
      page.getByText("result").or(page.getByText("No samples found")),
    ).toBeVisible({ timeout: 30000 });

    const results2Text = await page.locator(".grid").first().textContent();

    // Results should be different (or both empty)
    if (results1Text && results2Text && results1Text.length > 10 && results2Text.length > 10) {
      expect(results1Text).not.toBe(results2Text);
    }
  });

  test("admin enrichment: status overview shows counts", async ({ page }) => {
    await adminLogin(page);
    await page.goto("/admin/catalog/enrichment");

    // Should show enrichment status section
    await expect(page.getByText("enrichment status")).toBeVisible({
      timeout: 10000,
    });

    // Should show stats
    await expect(page.getByText("needs context")).toBeVisible();
    await expect(page.getByText("needs embedding")).toBeVisible();
  });

  test("MCP endpoint: search_catalog returns valid response", async () => {
    test.skip(!MCP_TOKEN, "ADMIN_MCP_TOKEN not set");

    const apiContext = await request.newContext();

    // Initialize MCP session
    const initRes = await apiContext.post(`${BASE_URL}/api/mcp`, {
      headers: {
        Authorization: `Bearer ${MCP_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: {
        jsonrpc: "2.0",
        method: "initialize",
        params: {
          protocolVersion: "2024-11-05",
          capabilities: {},
          clientInfo: { name: "test-client", version: "1.0.0" },
        },
        id: 1,
      },
    });

    expect(initRes.ok()).toBeTruthy();

    // Call search_catalog tool
    const searchRes = await apiContext.post(`${BASE_URL}/api/mcp`, {
      headers: {
        Authorization: `Bearer ${MCP_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: {
        jsonrpc: "2.0",
        method: "tools/call",
        params: {
          name: "search_catalog",
          arguments: { query: "indoor activity", limit: 5 },
        },
        id: 2,
      },
    });

    expect(searchRes.ok()).toBeTruthy();
    const body = await searchRes.json();

    // Verify response structure
    expect(body.result).toBeDefined();
    const content = body.result?.content?.[0]?.text;
    expect(content).toBeDefined();

    // Parse and verify no s3:// leaks
    const parsed = JSON.parse(content);
    const stringified = JSON.stringify(parsed);
    expect(stringified).not.toContain("s3://");
    expect(stringified).not.toContain("s3%3A%2F%2F");
    expect(stringified).not.toContain("arn:aws:s3");

    await apiContext.dispose();
  });

  test("no s3:// strings in search results", async ({ page }) => {
    await adminLogin(page);
    await page.goto("/admin/catalog/search");

    await page.fill('input[placeholder*="Semantic search"]', "person activity");
    await page.locator('button:has-text("search")').click();

    await expect(
      page.getByText("result").or(page.getByText("No samples found")),
    ).toBeVisible({ timeout: 30000 });

    // Check page content for S3 URL leaks
    const pageContent = await page.content();
    expect(pageContent).not.toContain("s3://");
    expect(pageContent).not.toContain("arn:aws:s3");
  });
});
