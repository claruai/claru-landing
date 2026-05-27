import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "node:crypto";
import {
  isValidShareTokenFormat,
  lookupDatasetByShareToken,
  listShareableClipIds,
  isClipShareable,
} from "../lookup-by-token";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const CUSTOM_CATEGORY = "46cf5324-f3e3-484f-9cb3-7b1dffff0094";

// Salon dataset: we know it has 20 clips, 4 of which are is_showcase=true
const SALON_SLUG = "egocentric-long-form-salon-healthcare";

let allModeToken: string;
let showcaseModeToken: string;
let expiredToken: string;
let salonDatasetId: string;
let testAllDatasetId: string;
let testShowcaseDatasetId: string;
let testExpiredDatasetId: string;

beforeAll(async () => {
  const { data: salon } = await supabase
    .from("datasets")
    .select("id")
    .eq("slug", SALON_SLUG)
    .single();
  if (!salon) throw new Error(`fixture missing: ${SALON_SLUG} dataset`);
  salonDatasetId = salon.id;

  // Three temp datasets sharing the salon's clips: one all-mode, one showcase-mode, one expired
  for (const [mode, expired] of [
    ["all", false],
    ["showcase", false],
    ["all", true],
  ] as const) {
    const token = randomBytes(32).toString("hex");
    const expires = expired
      ? new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // yesterday
      : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // tomorrow

    const { data: ds, error } = await supabase
      .from("datasets")
      .insert({
        category_id: CUSTOM_CATEGORY,
        name: `[TEST] lookup-by-token ${mode}${expired ? " expired" : ""}`,
        slug: `test-lookup-${mode}-${expired ? "exp-" : ""}${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: "long_form",
        source_type: "curated",
        modality: "video_text",
        is_published: false,
        share_token: token,
        share_expires_at: expires,
        share_mode: mode,
      })
      .select("id")
      .single();
    if (error || !ds) throw new Error(`fixture insert failed: ${error?.message}`);

    // copy all 20 salon clips into this temp dataset (lead_id null, is_showcase preserved)
    const { data: salonClips } = await supabase
      .from("dataset_clips")
      .select("clip_id, is_showcase")
      .eq("dataset_id", salonDatasetId)
      .is("lead_id", null);
    if (salonClips?.length) {
      await supabase.from("dataset_clips").insert(
        salonClips.map((c) => ({
          dataset_id: ds.id,
          clip_id: c.clip_id,
          is_showcase: c.is_showcase,
          added_by: "lookup-test",
        })),
      );
    }

    if (mode === "all" && !expired) {
      allModeToken = token;
      testAllDatasetId = ds.id;
    } else if (mode === "showcase") {
      showcaseModeToken = token;
      testShowcaseDatasetId = ds.id;
    } else {
      expiredToken = token;
      testExpiredDatasetId = ds.id;
    }
  }
});

afterAll(async () => {
  const ids = [testAllDatasetId, testShowcaseDatasetId, testExpiredDatasetId].filter(Boolean);
  if (ids.length) {
    await supabase.from("dataset_clips").delete().in("dataset_id", ids);
    await supabase.from("datasets").delete().in("id", ids);
  }
});

describe("isValidShareTokenFormat", () => {
  it("accepts 64-char hex", () => {
    expect(isValidShareTokenFormat("a".repeat(64))).toBe(true);
  });
  it("rejects wrong length", () => {
    expect(isValidShareTokenFormat("a".repeat(63))).toBe(false);
  });
  it("rejects non-hex chars", () => {
    expect(isValidShareTokenFormat("z".repeat(64))).toBe(false);
  });
});

describe("lookupDatasetByShareToken", () => {
  it("returns dataset row with share_mode='all' default", async () => {
    const row = await lookupDatasetByShareToken(supabase, allModeToken);
    expect(row).not.toBeNull();
    expect(row!.share_mode).toBe("all");
    expect(row!.id).toBe(testAllDatasetId);
  });

  it("returns dataset row with share_mode='showcase'", async () => {
    const row = await lookupDatasetByShareToken(supabase, showcaseModeToken);
    expect(row).not.toBeNull();
    expect(row!.share_mode).toBe("showcase");
  });

  it("returns null on expired token", async () => {
    const row = await lookupDatasetByShareToken(supabase, expiredToken);
    expect(row).toBeNull();
  });

  it("returns null on unknown token", async () => {
    const row = await lookupDatasetByShareToken(supabase, "0".repeat(64));
    expect(row).toBeNull();
  });
});

describe("listShareableClipIds — backwards compatibility", () => {
  it("'all' mode returns every clip (20)", async () => {
    const ids = await listShareableClipIds(supabase, testAllDatasetId, "all");
    expect(ids.length).toBe(20);
  });

  it("'showcase' mode returns only the 4 showcase clips", async () => {
    const ids = await listShareableClipIds(supabase, testShowcaseDatasetId, "showcase");
    expect(ids.length).toBe(4);
  });
});

describe("isClipShareable", () => {
  it("authorises any clip in 'all' mode", async () => {
    const ids = await listShareableClipIds(supabase, testAllDatasetId, "all");
    const ok = await isClipShareable(supabase, testAllDatasetId, ids[0], "all");
    expect(ok).toBe(true);
  });

  it("rejects non-showcase clip in showcase mode", async () => {
    // pick a clip that's in the dataset but NOT showcase
    const { data: nonShowcase } = await supabase
      .from("dataset_clips")
      .select("clip_id")
      .eq("dataset_id", testShowcaseDatasetId)
      .eq("is_showcase", false)
      .limit(1);
    const nonShowcaseId = nonShowcase?.[0]?.clip_id;
    expect(nonShowcaseId).toBeTruthy();
    const ok = await isClipShareable(supabase, testShowcaseDatasetId, nonShowcaseId!, "showcase");
    expect(ok).toBe(false);
  });

  it("authorises showcase clip in showcase mode", async () => {
    const ids = await listShareableClipIds(supabase, testShowcaseDatasetId, "showcase");
    const ok = await isClipShareable(supabase, testShowcaseDatasetId, ids[0], "showcase");
    expect(ok).toBe(true);
  });
});
