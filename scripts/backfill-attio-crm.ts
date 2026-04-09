#!/usr/bin/env ts-node
/**
 * US-012: Attio CSV backfill migration script
 *
 * Seeds lead_crm_data from an Attio CSV export, enriched with Smartlead
 * campaign IDs fetched from the Smartlead API.
 *
 * Usage:
 *   SUPABASE_SERVICE_ROLE_KEY=... SMARTLEAD_API_KEY=... \
 *   ts-node scripts/backfill-attio-crm.ts /path/to/attio-export.csv
 */

import * as fs from "fs";
import * as path from "path";
import { createClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const SMARTLEAD_API_KEY = process.env.SMARTLEAD_API_KEY!;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

const db = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// ---------------------------------------------------------------------------
// CSV parser (simple — assumes comma delimiter, double-quote escaping)
// ---------------------------------------------------------------------------
function parseCSV(content: string): Record<string, string>[] {
  const lines = content.split("\n").filter((l) => l.trim());
  if (lines.length < 2) return [];

  const headers = lines[0]
    .split(",")
    .map((h) => h.trim().replace(/^"|"$/g, "").toLowerCase());

  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ""]));
  });
}

// ---------------------------------------------------------------------------
// Map Attio status → thread_state
// ---------------------------------------------------------------------------
function mapThreadState(
  attioStatus: string
): "cold" | "warm" | "hot" | "negotiating" | "closed" | "dead" {
  const s = (attioStatus ?? "").toLowerCase();
  if (s.includes("closed") || s.includes("won")) return "closed";
  if (s.includes("negotiat")) return "negotiating";
  if (s.includes("hot") || s.includes("interested")) return "hot";
  if (s.includes("warm") || s.includes("active")) return "warm";
  if (s.includes("dead") || s.includes("lost") || s.includes("unsubscribe"))
    return "dead";
  return "cold";
}

// ---------------------------------------------------------------------------
// Map Attio tags → type
// ---------------------------------------------------------------------------
function mapType(
  tags: string
): "demand" | "supply" {
  return (tags ?? "").toLowerCase().includes("supply") ? "supply" : "demand";
}

// ---------------------------------------------------------------------------
// Smartlead: find campaign_id for a lead by email
// ---------------------------------------------------------------------------
async function getSmartleadCampaignId(
  email: string
): Promise<number | null> {
  if (!SMARTLEAD_API_KEY) return null;
  try {
    const res = await fetch(
      `https://server.smartlead.ai/api/v1/campaigns/lead?email=${encodeURIComponent(email)}&api_key=${SMARTLEAD_API_KEY}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    // Response may be array or single object depending on Smartlead version
    const entry = Array.isArray(data) ? data[0] : data;
    return entry?.campaign_id ?? null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const csvPath = process.argv[2];
  if (!csvPath) {
    console.error("Usage: ts-node scripts/backfill-attio-crm.ts <csv-path>");
    process.exit(1);
  }

  const content = fs.readFileSync(path.resolve(csvPath), "utf-8");
  const rows = parseCSV(content);
  console.log(`Parsed ${rows.length} rows from CSV`);

  let matched = 0;
  let skipped = 0;
  let upserted = 0;
  let smartleadFound = 0;

  for (const row of rows) {
    const email = (
      row.email ??
      row["email address"] ??
      row["primary email"] ??
      ""
    ).toLowerCase().trim();

    if (!email) {
      skipped++;
      continue;
    }

    // Match to leads table by email
    const { data: lead } = await db
      .from("leads")
      .select("id")
      .ilike("email", email)
      .single();

    if (!lead) {
      skipped++;
      continue;
    }

    matched++;

    // Fetch Smartlead campaign_id
    const smartleadCampaignId = await getSmartleadCampaignId(email);
    if (smartleadCampaignId) smartleadFound++;

    // Upsert lead_crm_data
    const type = mapType(row.tags ?? row.labels ?? "");
    const thread_state = mapThreadState(row.status ?? row.stage ?? "");

    const { error } = await db.from("lead_crm_data").upsert(
      {
        lead_id: lead.id,
        type,
        thread_state,
        ...(smartleadCampaignId
          ? { smartlead_campaign_id: smartleadCampaignId }
          : {}),
      },
      { onConflict: "lead_id" }
    );

    if (error) {
      console.error(`Error upserting lead_id ${lead.id}:`, error.message);
    } else {
      upserted++;
    }

    // Brief delay to avoid Smartlead rate limits
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log("\n--- Backfill summary ---");
  console.log(`Matched:        ${matched}`);
  console.log(`Skipped:        ${skipped} (no email or no leads match)`);
  console.log(`Upserted:       ${upserted} lead_crm_data rows`);
  console.log(`Smartlead IDs:  ${smartleadFound} found`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
