import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createClient } from "@supabase/supabase-js";
import {
  mintShareToken,
  rotateShareToken,
  ShareModeMismatchError,
  DatasetNotFoundError,
} from "../mint-token";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

let testDatasetId: string;

const TEST_SLUG = `test-mint-token-${Date.now()}`;
const CUSTOM_CATEGORY = "46cf5324-f3e3-484f-9cb3-7b1dffff0094";

beforeAll(async () => {
  const { data, error } = await supabase
    .from("datasets")
    .insert({
      category_id: CUSTOM_CATEGORY,
      name: `[TEST] mint-token ${Date.now()}`,
      slug: TEST_SLUG,
      type: "long_form",
      source_type: "curated",
      modality: "video_text",
      is_published: false,
      share_mode: "all",
    })
    .select("id")
    .single();
  if (error || !data) throw new Error(`fixture insert failed: ${error?.message}`);
  testDatasetId = data.id;
});

afterAll(async () => {
  if (testDatasetId) {
    await supabase.from("datasets").delete().eq("id", testDatasetId);
  }
});

describe("mintShareToken", () => {
  it("mints a fresh token when none exists, defaulting share_mode='all'", async () => {
    const result = await mintShareToken(supabase, testDatasetId);
    expect(result.token).toMatch(/^[a-f0-9]{64}$/);
    expect(result.share_url).toContain(`/share/${result.token}`);
    expect(result.mode).toBe("all");
    expect(result.reused).toBe(false);
    expect(new Date(result.expires_at).getTime()).toBeGreaterThan(Date.now());

    const { data: row } = await supabase
      .from("datasets")
      .select("share_token, share_mode")
      .eq("id", testDatasetId)
      .single();
    expect(row?.share_token).toBe(result.token);
    expect(row?.share_mode).toBe("all");
  });

  it("returns the existing token (idempotent) when called again with same mode", async () => {
    const first = await mintShareToken(supabase, testDatasetId);
    const second = await mintShareToken(supabase, testDatasetId);
    expect(second.reused).toBe(true);
    expect(second.token).toBe(first.token);
  });

  it("throws ShareModeMismatchError when mode differs from existing", async () => {
    await expect(
      mintShareToken(supabase, testDatasetId, { mode: "showcase" }),
    ).rejects.toBeInstanceOf(ShareModeMismatchError);
  });

  it("rotates the token and updates share_mode when forceRotate=true", async () => {
    const before = await mintShareToken(supabase, testDatasetId);
    const rotated = await mintShareToken(supabase, testDatasetId, {
      mode: "showcase",
      forceRotate: true,
    });
    expect(rotated.reused).toBe(false);
    expect(rotated.token).not.toBe(before.token);
    expect(rotated.mode).toBe("showcase");

    const { data: row } = await supabase
      .from("datasets")
      .select("share_token, share_mode")
      .eq("id", testDatasetId)
      .single();
    expect(row?.share_mode).toBe("showcase");
    expect(row?.share_token).toBe(rotated.token);
  });

  it("rotateShareToken is a thin wrapper around forceRotate", async () => {
    const before = await mintShareToken(supabase, testDatasetId, { mode: "showcase" });
    const rotated = await rotateShareToken(supabase, testDatasetId, { mode: "all" });
    expect(rotated.token).not.toBe(before.token);
    expect(rotated.mode).toBe("all");
  });

  it("throws DatasetNotFoundError on bogus id", async () => {
    await expect(
      mintShareToken(supabase, "00000000-0000-0000-0000-000000000000"),
    ).rejects.toBeInstanceOf(DatasetNotFoundError);
  });
});
