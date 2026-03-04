import { config } from "dotenv";
config({ path: ".env.local" });

import { callResearchAgent } from "../src/lib/deck-builder/agents/executor";
import { createSupabaseAdminClient } from "../src/lib/supabase/admin";

async function test() {
  const supabase = createSupabaseAdminClient();

  console.log("=== Test 1: Lead lookup ===\n");
  const leadResult = await callResearchAgent(
    "What do we know about any leads we have? Look up our lead info.",
    300,
    supabase,
  );
  console.log(leadResult);
  console.log("\n---\n");

  console.log("=== Test 2: Data catalog ===\n");
  const catalogResult = await callResearchAgent(
    "What datasets do we have in our data catalog?",
    300,
    supabase,
  );
  console.log(catalogResult);
  console.log("\n---\n");

  console.log("=== Test 3: Case studies ===\n");
  const caseResult = await callResearchAgent(
    "What case studies do we have? Find any related to video or safety.",
    300,
    supabase,
  );
  console.log(caseResult);
}

test().catch((err) => console.error("FAILED:", err.message));
