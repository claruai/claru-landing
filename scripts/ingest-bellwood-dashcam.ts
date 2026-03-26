/**
 * Ingest 300 Bellwood dashcam clips into the Supabase database.
 *
 * 1. Creates (or finds) a "Municipal / Government" category
 * 2. Creates the "Bellwood Municipal Dashcam Collection" dataset
 * 3. Lists S3 files, inserts clips, links via dataset_clips
 * 4. Marks 6 specific clips as showcase
 *
 * Run with:
 *   npx tsx scripts/ingest-bellwood-dashcam.ts
 */

import { createClient } from "@supabase/supabase-js";
import { execSync } from "child_process";
import { config } from "dotenv";
import { resolve } from "path";

// Load .env.local (Next.js convention)
config({ path: resolve(process.cwd(), ".env.local") });

// ---------------------------------------------------------------------------
// Supabase admin client
// ---------------------------------------------------------------------------
function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }
  return createClient(url, key);
}

// ---------------------------------------------------------------------------
// Parse S3 listing line
// ---------------------------------------------------------------------------
interface S3File {
  filename: string;
  sizeBytes: number;
}

function parseS3Line(line: string): S3File | null {
  // Format: "2026-03-25 10:28:55 1136656384 20260304_131030_00001_N_A DRIVER_01 2026-03-04.MP4"
  const match = line.match(/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\s+(\d+)\s+(.+)$/);
  if (!match) return null;
  return {
    sizeBytes: parseInt(match[1], 10),
    filename: match[2].trim(),
  };
}

// ---------------------------------------------------------------------------
// Parse metadata from filename
// Format examples:
//   20260304_131030_00001_N_A DRIVER_01 2026-03-04.MP4
//   20260305_171341_00042_N_A driver_04.MP4
//   20260312_102634_00006_T_A.MP4
// ---------------------------------------------------------------------------
interface ClipMetadata {
  project: string;
  driver: string;
  capture_date: string; // YYYY-MM-DD
  sequence: string;
}

function parseFilenameMetadata(filename: string): ClipMetadata {
  // Extract the date from the first 8 chars: 20260304 -> 2026-03-04
  const dateStr = filename.slice(0, 8);
  const captureDate = `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;

  // Extract sequence number (5 digits after second underscore)
  const seqMatch = filename.match(/_(\d{5})_/);
  const sequence = seqMatch ? seqMatch[1] : "00000";

  // Extract driver name from the part after "N_A " or "T_A " and before the date or .MP4
  // Pattern: ...00001_N_A DRIVER_01 2026-03-04.MP4
  // Pattern: ...00042_N_A driver_04.MP4
  // Pattern: ...00006_T_A.MP4  (no driver name)
  let driver = "Unknown";

  // Try to match: _N_A <name> YYYY-MM-DD.MP4  or  _T_A <name> YYYY-MM-DD.MP4
  const nameWithDateMatch = filename.match(/_[NT]_A\s+(.+?)\s+\d{4}-\d{2}-\d{2}\.MP4$/i);
  if (nameWithDateMatch) {
    driver = nameWithDateMatch[1].trim();
  } else {
    // Try: _N_A <name>.MP4  or  _T_A <name>.MP4
    const nameOnlyMatch = filename.match(/_[NT]_A\s+(.+?)\.MP4$/i);
    if (nameOnlyMatch) {
      driver = nameOnlyMatch[1].trim();
    } else {
      // Try: _T_A.MP4 (no space, no name)
      const noNameMatch = filename.match(/_[NT]_A\.MP4$/i);
      if (noNameMatch) {
        driver = "Unknown";
      }
    }
  }

  return {
    project: "Bellwood Municipal",
    driver,
    capture_date: captureDate,
    sequence,
  };
}

// ---------------------------------------------------------------------------
// Showcase filenames (exact match)
// ---------------------------------------------------------------------------
const SHOWCASE_FILENAMES = [
  "20260305_090516_00023_N_A DRIVER_03 2026-03-05.MP4",
  "20260304_161714_00009_N_A DRIVER_02 2026-03-04.MP4",
  "20260305_074341_00014_N_A DRIVER_03 2026-03-05.MP4",
  "20260304_131030_00001_N_A DRIVER_01 2026-03-04.MP4",
  "20260312_152344_00001_N_A driver_04.MP4",
  "20260304_152326_00010_N_A DRIVER_04 2026-03-04.MP4",
];

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const supabase = createSupabaseAdminClient();

  // =========================================================================
  // 1. Find or create category
  // =========================================================================
  console.log("Step 1: Finding or creating category...");

  // Check for existing categories
  const { data: existingCats, error: catListErr } = await supabase
    .from("dataset_categories")
    .select("*")
    .order("display_order", { ascending: true });

  if (catListErr) {
    console.error("Failed to list categories:", catListErr);
    process.exit(1);
  }

  console.log("Existing categories:", existingCats?.map((c) => `${c.name} (${c.slug})`));

  // Look for an existing fitting category
  let categoryId: string;
  const existingMunicipal = existingCats?.find(
    (c) => c.slug === "municipal-government" || c.slug === "municipal"
  );

  if (existingMunicipal) {
    categoryId = existingMunicipal.id;
    console.log(`Using existing category: ${existingMunicipal.name} (${categoryId})`);
  } else {
    // Create new category
    const maxOrder = existingCats?.reduce((max, c) => Math.max(max, c.display_order || 0), 0) ?? 0;
    const { data: newCat, error: newCatErr } = await supabase
      .from("dataset_categories")
      .insert({
        name: "Municipal / Government",
        slug: "municipal-government",
        description:
          "Video data captured for municipal infrastructure monitoring, government fleet operations, and public works projects.",
        display_order: maxOrder + 1,
      })
      .select()
      .single();

    if (newCatErr) {
      console.error("Failed to create category:", newCatErr);
      process.exit(1);
    }
    categoryId = newCat.id;
    console.log(`Created new category: Municipal / Government (${categoryId})`);
  }

  // =========================================================================
  // 2. Create dataset
  // =========================================================================
  console.log("\nStep 2: Creating dataset...");

  const { data: dataset, error: dsErr } = await supabase
    .from("datasets")
    .upsert(
      {
        name: "Bellwood Municipal Dashcam Collection",
        slug: "bellwood-dashcam",
        category_id: categoryId,
        type: "short_form",
        source_type: "collected",
        subcategory: "dashcam",
        description:
          "Dashcam footage collected across Bellwood, Illinois for a municipal infrastructure monitoring project. 300 clips from 5 drivers across 10 days, capturing streets, intersections, sidewalks, and neighborhoods. Used to build a VLM-powered platform that detects graffiti, potholes, damaged infrastructure, and maintenance needs.",
        total_samples: 300,
        total_duration_hours: 75,
        geographic_coverage: "Bellwood, Illinois, USA",
        annotation_types: ["COLLECTION", "DASHCAM"],
        is_published: true,
        s3_bucket: "moonvalley-annotation-platform",
      },
      { onConflict: "slug" }
    )
    .select()
    .single();

  if (dsErr) {
    console.error("Failed to create dataset:", dsErr);
    process.exit(1);
  }
  console.log(`Dataset created/updated: ${dataset.name} (${dataset.id})`);

  // =========================================================================
  // 3. List S3 files
  // =========================================================================
  console.log("\nStep 3: Listing S3 files...");

  const s3Output = execSync(
    "aws s3 ls s3://moonvalley-annotation-platform/bellwood-dashcam/",
    { encoding: "utf-8", maxBuffer: 10 * 1024 * 1024 }
  );

  const files: S3File[] = s3Output
    .split("\n")
    .map(parseS3Line)
    .filter((f): f is S3File => f !== null);

  console.log(`Found ${files.length} files in S3`);

  if (files.length === 0) {
    console.error("No files found in S3. Exiting.");
    process.exit(1);
  }

  // =========================================================================
  // 4. Insert clips in batches
  // =========================================================================
  console.log("\nStep 4: Inserting clips...");

  const BATCH_SIZE = 50;
  const allClipIds: Map<string, string> = new Map(); // filename -> clip id

  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);
    const clipRows = batch.map((f) => {
      const metadata = parseFilenameMetadata(f.filename);
      return {
        s3_bucket: "moonvalley-annotation-platform",
        s3_key: `bellwood-dashcam/${f.filename}`,
        mime_type: "video/mp4",
        filename: f.filename,
        tech_file_size_bytes: f.sizeBytes,
        ann_metadata: metadata,
      };
    });

    const { data: inserted, error: insertErr } = await supabase
      .from("clips")
      .upsert(clipRows, {
        onConflict: "s3_bucket,s3_key",
        ignoreDuplicates: false,
      })
      .select("id, filename");

    if (insertErr) {
      console.error(`Failed to insert clip batch ${i / BATCH_SIZE + 1}:`, insertErr);
      process.exit(1);
    }

    for (const clip of inserted ?? []) {
      allClipIds.set(clip.filename, clip.id);
    }

    console.log(
      `  Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(files.length / BATCH_SIZE)}: ${inserted?.length ?? 0} clips upserted`
    );
  }

  console.log(`Total clips in map: ${allClipIds.size}`);

  // =========================================================================
  // 5. Insert dataset_clips rows (all with is_showcase: false initially)
  // =========================================================================
  console.log("\nStep 5: Linking clips to dataset...");

  const dcRows = [...allClipIds.entries()].map(([, clipId]) => ({
    dataset_id: dataset.id,
    clip_id: clipId,
    is_showcase: false,
    added_by: "ingest-script",
    note: null as string | null,
    lead_id: null as string | null,
  }));

  for (let i = 0; i < dcRows.length; i += BATCH_SIZE) {
    const batch = dcRows.slice(i, i + BATCH_SIZE);

    const { error: dcErr } = await supabase
      .from("dataset_clips")
      .upsert(batch, {
        onConflict: "dataset_id,clip_id",
        ignoreDuplicates: false,
      });

    if (dcErr) {
      // If upsert on expression index fails, try insert with ON CONFLICT DO NOTHING approach
      // by just inserting and ignoring duplicates
      console.warn(`  dataset_clips upsert batch ${Math.floor(i / BATCH_SIZE) + 1} warning:`, dcErr.message);

      // Fall back to individual inserts
      for (const row of batch) {
        const { error: singleErr } = await supabase.from("dataset_clips").insert(row);
        if (singleErr && !singleErr.message.includes("duplicate")) {
          console.error(`  Failed to link clip ${row.clip_id}:`, singleErr.message);
        }
      }
    } else {
      console.log(
        `  Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(dcRows.length / BATCH_SIZE)}: linked`
      );
    }
  }

  // =========================================================================
  // 6. Mark 6 showcase clips
  // =========================================================================
  console.log("\nStep 6: Marking showcase clips...");

  let showcaseCount = 0;
  for (const showcaseFilename of SHOWCASE_FILENAMES) {
    const clipId = allClipIds.get(showcaseFilename);
    if (!clipId) {
      console.warn(`  Showcase clip not found: ${showcaseFilename}`);
      continue;
    }

    const { error: updateErr } = await supabase
      .from("dataset_clips")
      .update({ is_showcase: true })
      .eq("dataset_id", dataset.id)
      .eq("clip_id", clipId);

    if (updateErr) {
      console.error(`  Failed to mark showcase: ${showcaseFilename}:`, updateErr.message);
    } else {
      showcaseCount++;
      console.log(`  Marked showcase: ${showcaseFilename}`);
    }
  }

  // =========================================================================
  // 7. Summary
  // =========================================================================
  console.log("\n========================================");
  console.log("INGESTION COMPLETE");
  console.log("========================================");
  console.log(`Category ID:      ${categoryId}`);
  console.log(`Dataset ID:       ${dataset.id}`);
  console.log(`Dataset slug:     ${dataset.slug}`);
  console.log(`Clips inserted:   ${allClipIds.size}`);
  console.log(`Showcase clips:   ${showcaseCount}`);
  console.log("========================================");

  // Quick verification
  const { count: dcCount } = await supabase
    .from("dataset_clips")
    .select("*", { count: "exact", head: true })
    .eq("dataset_id", dataset.id);

  const { count: showcaseVerify } = await supabase
    .from("dataset_clips")
    .select("*", { count: "exact", head: true })
    .eq("dataset_id", dataset.id)
    .eq("is_showcase", true);

  console.log(`\nVerification:`);
  console.log(`  dataset_clips rows: ${dcCount}`);
  console.log(`  showcase rows:      ${showcaseVerify}`);

  // List unique drivers
  const { data: driverClips } = await supabase
    .from("clips")
    .select("ann_metadata")
    .in(
      "id",
      [...allClipIds.values()]
    );

  const drivers = new Set<string>();
  for (const clip of driverClips ?? []) {
    const meta = clip.ann_metadata as ClipMetadata | null;
    if (meta?.driver) drivers.add(meta.driver);
  }
  console.log(`  Unique drivers:     ${drivers.size} — ${[...drivers].join(", ")}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
