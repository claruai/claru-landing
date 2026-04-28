/**
 * Backfill leads.heard_about from PostHog person properties.
 *
 * Why: until now, the form sent heard_about to the API but route.ts dropped
 * the field. PostHog still recorded it via posthog.identify() as a person
 * property. This script reads those person properties and updates the
 * Supabase leads table where heard_about is NULL.
 *
 * Idempotent: only updates rows where heard_about IS NULL.
 *
 * Run: tsx scripts/backfill-heard-about.ts
 * Env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
 *      POSTHOG_PROJECT_API_KEY (Personal API Key with read scope), POSTHOG_PROJECT_ID
 */
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

// Snapshot pulled from PostHog persons table on 2026-04-28 via MCP query:
//   SELECT properties.email, properties.heard_about FROM persons
//   WHERE properties.heard_about IS NOT NULL AND properties.email IS NOT NULL
// To re-fetch live, set POSTHOG_PERSONAL_API_KEY and use the /query/ API.
const ROWS: Array<{ email: string; heard_about: string }> = [
  { email: "hugh@nexusdatastrategy.com", heard_about: "google" },
  { email: "george@slapshot.ai", heard_about: "twitter" },
  { email: "sadmire49@gmail.com", heard_about: "other" },
  { email: "kris.perez@welocalize.com", heard_about: "google" },
  { email: "Hassanjutt47623@gmail.com", heard_about: "google" },
  { email: "zpiao@asu.edu", heard_about: "ai_assistant" },
  { email: "aj@seedphysical.ai", heard_about: "twitter" },
  { email: "dmigdan@gmail.com", heard_about: "google" },
  { email: "sandhya.a@xtransmatrix.com", heard_about: "other" },
  { email: "fahadlangah067@gmail.com", heard_about: "ai_assistant" },
  { email: "amilmetchill@gmail.com", heard_about: "google" },
  { email: "shoaibmhashmi098@gmail.com", heard_about: "google" },
  { email: "musa17464@gmail.com", heard_about: "google" },
  { email: "jordanragunton29@gmail.com", heard_about: "google" },
  { email: "jiyanagpal816@gmail.com", heard_about: "other" },
  { email: "praveen.forhuman@gmail.com", heard_about: "twitter" },
  { email: "kambojsmile389@gmail.com", heard_about: "google" },
  { email: "bilalah98987@gmail.com", heard_about: "google" },
  { email: "nikitasadhnani@gmail.com", heard_about: "linkedin" },
  { email: "shalu.p@shaip.com", heard_about: "google" },
  { email: "balanciosherwin@gmail.com", heard_about: "word_of_mouth" },
  { email: "potskhverashvilitedo@gmail.com", heard_about: "other" },
  { email: "anand.b@shaip.com", heard_about: "ai_assistant" },
  { email: "jervosofrench23@gmail.com", heard_about: "google" },
  { email: "ebarviagabriel@gmail.com", heard_about: "other" },
  { email: "vaibhav@saturnlabs.ai", heard_about: "other" },
  { email: "cdossman91@gmail.com", heard_about: "twitter" },
  { email: "rawat@2by4.ai", heard_about: "twitter" },
  { email: "derek@odyssey.systems", heard_about: "word_of_mouth" },
];

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const rows = ROWS;
  console.log(`Backfilling ${rows.length} rows from PostHog snapshot`);

  let updated = 0;
  let skipped = 0;
  let missing = 0;

  for (const row of rows) {
    const { data, error } = await supabase
      .from("leads")
      .update({ heard_about: row.heard_about })
      .eq("email", row.email)
      .is("heard_about", null)
      .select("id");

    if (error) {
      console.error(`[error] ${row.email}: ${error.message}`);
      continue;
    }
    if (!data || data.length === 0) {
      // Either lead doesn't exist OR heard_about already set
      const { data: exists } = await supabase
        .from("leads")
        .select("id, heard_about")
        .eq("email", row.email)
        .maybeSingle();
      if (!exists) {
        missing++;
        console.log(`[miss] ${row.email} not in leads table`);
      } else {
        skipped++;
      }
    } else {
      updated++;
      console.log(`[ok]   ${row.email} → ${row.heard_about}`);
    }
  }

  console.log(`\nDone. updated=${updated} skipped=${skipped} missing=${missing}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
