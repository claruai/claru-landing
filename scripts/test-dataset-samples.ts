import { config } from "dotenv";
config({ path: ".env.local" });

import { callResearchAgent } from "../src/lib/deck-builder/agents/executor";
import { createSupabaseAdminClient } from "../src/lib/supabase/admin";

async function test() {
  const supabase = createSupabaseAdminClient();

  console.log("=== Test: Find video samples from datasets ===\n");
  const result = await callResearchAgent(
    "Find actual video sample files from our egocentric video datasets. I need URLs I can embed in a slide deck.",
    300,
    supabase,
  );
  console.log(result);
}

test().catch((err) => console.error("FAILED:", err.message));
