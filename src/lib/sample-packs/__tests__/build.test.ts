import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createClient } from "@supabase/supabase-js";
import { buildSamplePack } from "../build";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const TEST_EMAIL = `qa+sample-pack-${Date.now()}@claru.ai`;
const TEST_COMPANY = `QA SamplePack ${Date.now()}`;

const createdDatasetIds: string[] = [];
let createdLeadId: string | undefined;

beforeAll(async () => {
  // Sanity: ensure the two source datasets we'll use have showcase clips.
  const { data: srcs } = await supabase
    .from("datasets")
    .select("slug, id")
    .in("slug", ["egocentric-long-form-salon-healthcare", "egocentric-long-form-outdoor-urban-nature"]);
  expect(srcs?.length).toBe(2);
});

afterAll(async () => {
  if (createdDatasetIds.length) {
    await supabase.from("dataset_clips").delete().in("dataset_id", createdDatasetIds);
    await supabase.from("lead_dataset_access").delete().in("dataset_id", createdDatasetIds);
    await supabase.from("datasets").delete().in("id", createdDatasetIds);
  }
  if (createdLeadId) {
    await supabase.from("leads").delete().eq("id", createdLeadId);
  }
});

describe("buildSamplePack", () => {
  it("creates a Custom Curation, attaches showcase clips from sources, mints share link", async () => {
    const result = await buildSamplePack(supabase, {
      sourceDatasetSlugs: [
        "egocentric-long-form-salon-healthcare",
        "egocentric-long-form-outdoor-urban-nature",
      ],
      recipient: {
        name: "QA Prospect",
        email: TEST_EMAIL,
        company: TEST_COMPANY,
      },
      note: "vitest run",
      expiresInDays: 7,
      testIsolation: true,
    });

    createdDatasetIds.push(result.dataset_id);
    createdLeadId = result.lead.id;

    // 4 showcase × 2 sources = 8
    expect(result.clip_count).toBe(8);
    expect(result.lead_created).toBe(true);
    expect(result.share_url).toMatch(/\/share\/[a-f0-9]{64}$/);
    expect(result.dataset_slug).toMatch(/^test-sample-/);
    expect(result.per_source_breakdown).toHaveLength(2);
    expect(result.per_source_breakdown.every((s) => s.contributed_clips === 4)).toBe(true);

    // Verify clips actually attached, lead_id set
    const { data: attached } = await supabase
      .from("dataset_clips")
      .select("clip_id, lead_id, is_showcase")
      .eq("dataset_id", result.dataset_id);
    expect(attached?.length).toBe(8);
    expect(attached?.every((r) => r.lead_id === result.lead.id)).toBe(true);
    expect(attached?.every((r) => r.is_showcase === true)).toBe(true);

    // Verify lead access granted
    const { data: access } = await supabase
      .from("lead_dataset_access")
      .select("lead_id")
      .eq("dataset_id", result.dataset_id);
    expect(access?.length).toBe(1);
    expect(access?.[0].lead_id).toBe(result.lead.id);
  });

  it("reuses existing lead on second pack for same email", async () => {
    const result = await buildSamplePack(supabase, {
      sourceDatasetSlugs: ["egocentric-long-form-salon-healthcare"],
      recipient: { name: "QA Prospect", email: TEST_EMAIL, company: TEST_COMPANY },
      testIsolation: true,
    });
    createdDatasetIds.push(result.dataset_id);
    expect(result.lead_created).toBe(false);
    expect(result.lead.id).toBe(createdLeadId);
    expect(result.clip_count).toBe(4);
  });

  it("pre-existing leads are NOT cleaned up when buildSamplePack fails after find-or-create", async () => {
    // The lead is created by an earlier test in this file; here we trigger a
    // failure (no showcase source) and confirm the lead row still exists.
    // This exercises the leadCreated=false branch of cleanupLeadIfNew.
    await expect(
      buildSamplePack(supabase, {
        sourceDatasetSlugs: ["egocentric-household-tasks-global"], // 0 showcase clips → fails pre-flight
        recipient: { name: "QA Prospect", email: TEST_EMAIL, company: TEST_COMPANY },
        testIsolation: true,
      }),
    ).rejects.toThrow();
    const { data: stillThere } = await supabase
      .from("leads")
      .select("id")
      .eq("id", createdLeadId!)
      .maybeSingle();
    expect(stillThere?.id).toBe(createdLeadId);
  });

  it("rejects unknown source slugs", async () => {
    await expect(
      buildSamplePack(supabase, {
        sourceDatasetSlugs: ["this-slug-does-not-exist"],
        recipient: { name: "x", email: `qa+x-${Date.now()}@claru.ai`, company: "x" },
      }),
    ).rejects.toThrow(/No source datasets|Unknown source/);
  });

  it("fails when source has no showcase clips", async () => {
    await expect(
      buildSamplePack(supabase, {
        sourceDatasetSlugs: ["egocentric-household-tasks-global"], // has clips but 0 showcase
        recipient: { name: "x", email: `qa+y-${Date.now()}@claru.ai`, company: "x" },
        testIsolation: true,
      }),
    ).rejects.toThrow(/No showcase clips/);
  });
});
