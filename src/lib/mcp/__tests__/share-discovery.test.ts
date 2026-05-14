/**
 * Unit tests for the share-discovery MCP tool LOGIC.
 *
 * The MCP tool wrappers call Supabase directly. These tests exercise the
 * same queries with the real prod Supabase client and assert the returned
 * shapes — without going through the MCP HTTP transport (which requires
 * an ADMIN_MCP_TOKEN that's not provisioned locally).
 */

import { describe, expect, it } from "vitest";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

describe("get_share_link query", () => {
  it("returns share metadata for a dataset that has a token (by slug)", async () => {
    const { data, error } = await supabase
      .from("datasets")
      .select(
        "id, slug, name, share_token, share_mode, share_expires_at, share_view_count, share_first_viewed_at, is_published",
      )
      .eq("slug", "egocentric-long-form-salon-healthcare")
      .single();
    expect(error).toBeNull();
    expect(data).toBeTruthy();
    expect(data!.slug).toBe("egocentric-long-form-salon-healthcare");
    // Should expose the share fields the MCP tool returns
    expect(data!).toHaveProperty("share_token");
    expect(data!).toHaveProperty("share_mode");
    expect(data!).toHaveProperty("share_expires_at");
    expect(data!).toHaveProperty("share_view_count");
  });

  it("returns null share_token when none has been minted", async () => {
    // Use a dataset known to have no minted share token. workplace-activities
    // has been kept tokenless since session-start.
    const { data } = await supabase
      .from("datasets")
      .select("share_token")
      .eq("slug", "workplace-activities")
      .single();
    expect(data?.share_token).toBeNull();
  });
});

describe("list_share_links query", () => {
  it("returns datasets with non-null share_token", async () => {
    const { data, error } = await supabase
      .from("datasets")
      .select("slug, share_token, share_mode, dataset_categories(slug)")
      .not("share_token", "is", null);
    expect(error).toBeNull();
    expect((data ?? []).length).toBeGreaterThan(0);
    expect((data ?? []).every((r) => r.share_token != null)).toBe(true);
  });

  it("filters by category_slug client-side correctly", async () => {
    const { data } = await supabase
      .from("datasets")
      .select("slug, share_token, dataset_categories(slug)")
      .not("share_token", "is", null);
    const egocentricOnly = (data ?? []).filter(
      (r) =>
        (r.dataset_categories as { slug?: string } | null)?.slug === "egocentric",
    );
    expect(egocentricOnly.length).toBeGreaterThan(0);
    expect(egocentricOnly.every((r) => r.slug.startsWith("egocentric"))).toBe(true);
  });

  it("excludes expired tokens when include_expired=false", async () => {
    const now = new Date().toISOString();
    const { data } = await supabase
      .from("datasets")
      .select("slug, share_expires_at")
      .not("share_token", "is", null)
      .or(`share_expires_at.is.null,share_expires_at.gt.${now}`);
    expect(
      (data ?? []).every(
        (r) => r.share_expires_at == null || new Date(r.share_expires_at) > new Date(),
      ),
    ).toBe(true);
  });
});

describe("get_mcp_capabilities", () => {
  // Pure logic — no DB needed. The tool returns a static-ish structure.
  it("exposes the expected capability groups", async () => {
    // Pull in the static map by parsing the module — easier to reach in via the
    // exported register and a captured McpServer mock would be heavier than
    // this minimal smoke check.
    const { register } = await import("../tools/capabilities");
    const captured: Array<{ name: string; handler: (args: unknown) => unknown }> = [];
    const fakeServer = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tool: (name: string, _desc: string, _schema: unknown, handler: any) => {
        captured.push({ name, handler });
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
    register(fakeServer);

    expect(captured).toHaveLength(1);
    expect(captured[0].name).toBe("get_mcp_capabilities");

    const result = (await captured[0].handler({})) as {
      content: Array<{ type: string; text: string }>;
    };
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.server).toBe("claru-catalog");
    expect(Array.isArray(parsed.groups)).toBe(true);
    expect(parsed.groups.length).toBeGreaterThanOrEqual(7);
    expect(parsed.groups.map((g: { group: string }) => g.group)).toContain(
      "Share links",
    );
    expect(parsed.groups.map((g: { group: string }) => g.group)).toContain(
      "Sample packs (orchestrator)",
    );
    expect(Array.isArray(parsed.intents)).toBe(true);
    expect(parsed.intents.length).toBeGreaterThan(5);
  });

  it("supports group filter (case-insensitive partial match)", async () => {
    const { register } = await import("../tools/capabilities");
    let handler: ((args: unknown) => unknown) | null = null;
    const fakeServer = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tool: (_n: string, _d: string, _s: unknown, h: any) => {
        handler = h;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
    register(fakeServer);
    expect(handler).not.toBeNull();

    const result = (await handler!({ group: "share" })) as {
      content: Array<{ type: string; text: string }>;
    };
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.groups).toHaveLength(1);
    expect(parsed.groups[0].group).toBe("Share links");
  });
});
