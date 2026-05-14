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

  // ---------------------------------------------------------------------
  // Rollback tests — verify cleanupLeadIfNew() actually runs and only
  // touches newly-created leads. We force a post-find-or-create failure
  // by wrapping the supabase client in a Proxy that makes the very next
  // `datasets.insert(...).select().single()` resolve with a PG error.
  // ---------------------------------------------------------------------
  function makeFailingDatasetsInsert() {
    return new Proxy(supabase, {
      get(target, prop, receiver) {
        if (prop !== "from") return Reflect.get(target, prop, receiver);
        return (table: string) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const builder: any = target.from(table);
          if (table !== "datasets") return builder;
          const origInsert = builder.insert.bind(builder);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          builder.insert = (...args: any[]) => {
            const realChain = origInsert(...args);
            return new Proxy(realChain, {
              get(t, p) {
                if (p !== "select") return Reflect.get(t, p);
                return () => ({
                  single: () =>
                    Promise.resolve({
                      data: null,
                      error: {
                        message:
                          "INJECTED: duplicate key value violates unique constraint datasets_slug_key",
                        code: "23505",
                      },
                    }),
                });
              },
            });
          };
          return builder;
        };
      },
    });
  }

  it("rollback path: pre-existing lead survives a forced dataset-insert failure", async () => {
    // The lead with TEST_EMAIL was created by the first test in this file.
    // Inject a failure at the datasets.insert step (which runs AFTER
    // findOrCreateLeadByEmail) and confirm:
    //   1. buildSamplePack throws
    //   2. The pre-existing lead row is still in the DB (leadCreated=false
    //      branch of cleanupLeadIfNew did not delete it)
    const failing = makeFailingDatasetsInsert();
    await expect(
      buildSamplePack(failing, {
        sourceDatasetSlugs: ["egocentric-long-form-salon-healthcare"],
        recipient: { name: "QA Prospect", email: TEST_EMAIL, company: TEST_COMPANY },
        testIsolation: true,
      }),
    ).rejects.toThrow(/Failed to create sample pack dataset/);

    const { data: stillThere } = await supabase
      .from("leads")
      .select("id")
      .eq("id", createdLeadId!)
      .maybeSingle();
    expect(stillThere?.id).toBe(createdLeadId);
  });

  it("rollback path: newly-created lead is cleaned up on forced dataset-insert failure", async () => {
    // Fresh email this test owns. cleanupLeadIfNew should delete the row
    // because leadCreated will be true.
    const FRESH_EMAIL = `qa+rollback-new-${Date.now()}@claru.ai`;
    const failing = makeFailingDatasetsInsert();

    await expect(
      buildSamplePack(failing, {
        sourceDatasetSlugs: ["egocentric-long-form-salon-healthcare"],
        recipient: { name: "QA Rollback", email: FRESH_EMAIL, company: "QA Rollback Co" },
        testIsolation: true,
      }),
    ).rejects.toThrow(/Failed to create sample pack dataset/);

    const { data: orphan } = await supabase
      .from("leads")
      .select("id")
      .eq("email", FRESH_EMAIL)
      .maybeSingle();
    expect(orphan).toBeNull();
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
