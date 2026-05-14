import { afterAll, describe, expect, it } from "vitest";
import { createClient } from "@supabase/supabase-js";
import { findOrCreateLeadByEmail } from "../find-or-create";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const TEST_EMAIL = `qa+find-or-create-${Date.now()}@claru.ai`;
let createdLeadId: string | undefined;

afterAll(async () => {
  if (createdLeadId) {
    await supabase.from("leads").delete().eq("id", createdLeadId);
  }
});

describe("findOrCreateLeadByEmail", () => {
  it("creates a new lead when email is unknown", async () => {
    const result = await findOrCreateLeadByEmail(supabase, TEST_EMAIL, {
      name: "QA Tester",
      company: "Claru QA",
    });
    expect(result.created).toBe(true);
    expect(result.lead.email).toBe(TEST_EMAIL);
    expect(result.lead.name).toBe("QA Tester");
    expect(result.lead.company).toBe("Claru QA");
    createdLeadId = result.lead.id;
  });

  it("returns existing lead unchanged on subsequent call (idempotent)", async () => {
    const result = await findOrCreateLeadByEmail(supabase, TEST_EMAIL, {
      name: "Override Should Not Apply",
      company: "Override Co",
    });
    expect(result.created).toBe(false);
    expect(result.lead.id).toBe(createdLeadId);
    expect(result.lead.name).toBe("QA Tester");
    expect(result.lead.company).toBe("Claru QA");
  });

  it("normalizes email (lowercase + trim) for lookup", async () => {
    const result = await findOrCreateLeadByEmail(supabase, `  ${TEST_EMAIL.toUpperCase()}  `);
    expect(result.created).toBe(false);
    expect(result.lead.id).toBe(createdLeadId);
  });

  it("rejects invalid emails", async () => {
    await expect(findOrCreateLeadByEmail(supabase, "not-an-email")).rejects.toThrow(/Invalid email/);
    await expect(findOrCreateLeadByEmail(supabase, "")).rejects.toThrow(/Invalid email/);
  });
});
