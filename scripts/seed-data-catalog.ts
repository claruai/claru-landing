/**
 * Seed the Supabase data catalog with initial dataset categories and datasets.
 *
 * Based on the Notion catalog structure (US-016).
 *
 * Run with:
 *   npx tsx scripts/seed-data-catalog.ts
 *
 * Requires env vars:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

// ---------------------------------------------------------------------------
// Admin client (mirrors src/lib/supabase/admin.ts but avoids path alias issues
// when running via tsx outside of Next.js)
// ---------------------------------------------------------------------------

function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error(
      "Missing env vars: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required."
    );
    process.exit(1);
  }

  return createClient(url, key);
}

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

interface SeedCategory {
  name: string;
  slug: string;
  description: string;
  display_order: number;
}

interface SeedDataset {
  /** Must match the slug of the parent category */
  category_slug: string;
  name: string;
  slug: string;
  description: string;
  type: "short_form" | "long_form" | "cinematic" | "game_capture";
  subcategory: string;
  is_published: boolean;
}

const CATEGORIES: SeedCategory[] = [
  {
    name: "Egocentric Crowd",
    slug: "egocentric-crowd",
    description:
      "First-person video data captured in crowded, public environments with diverse human interactions.",
    display_order: 1,
  },
  {
    name: "Egocentric Workplaces",
    slug: "egocentric-workplaces",
    description:
      "First-person video data captured in professional and vocational workplace settings.",
    display_order: 2,
  },
  {
    name: "Licensed Cinematic",
    slug: "licensed-cinematic",
    description:
      "High-quality licensed cinematic footage covering action and adventure scenarios.",
    display_order: 3,
  },
  {
    name: "Game Capture",
    slug: "game-capture",
    description:
      "Screen-captured gameplay footage from interactive 3D environments and game engines.",
    display_order: 4,
  },
];

const DATASETS: SeedDataset[] = [
  // -- Egocentric Crowd --
  {
    category_slug: "egocentric-crowd",
    name: "Object Manipulation \u2014 Short Form",
    slug: "object-manipulation-short-form",
    description:
      "Short-form egocentric clips of fine-grained object manipulation activities in everyday settings.",
    type: "short_form",
    subcategory:
      "Twist, Draw/sketch, Tie, Iron Clothes, Pick Up Object, Fold, Unfold, Pour Liquid, Fasten & Unfasten, Buckle Seatbelt",
    is_published: true,
  },
  {
    category_slug: "egocentric-crowd",
    name: "Household Activities \u2014 Long Form",
    slug: "household-activities-long-form",
    description:
      "Long-form egocentric recordings of continuous household activities and domestic routines.",
    type: "long_form",
    subcategory:
      "Washing Dishes, Stirring Food, Cooking, Peeling, Folding Clothes, Mopping Floor, Loading Clothes, Hanging Clothes, Walking",
    is_published: true,
  },

  // -- Egocentric Workplaces --
  {
    category_slug: "egocentric-workplaces",
    name: "Workplace Activities",
    slug: "workplace-activities",
    description:
      "Long-form egocentric recordings of skilled vocational and professional workplace tasks.",
    type: "long_form",
    subcategory:
      "Barista, Tailor, Arts & Craft, Clothing Manufacturing, Home Furniture Assembly, Textile Shop, Phone Repair, Screen Printing",
    is_published: true,
  },

  // -- Licensed Cinematic --
  {
    category_slug: "licensed-cinematic",
    name: "Cinematic Action Footage",
    slug: "cinematic-action-footage",
    description:
      "Licensed high-resolution cinematic footage of outdoor action and adventure sports.",
    type: "cinematic",
    subcategory: "Ski, Safari, Snowboarding",
    is_published: true,
  },

  // -- Game Capture --
  {
    category_slug: "game-capture",
    name: "Game Environment Capture",
    slug: "game-environment-capture",
    description:
      "Screen-captured gameplay footage from first-person shooter environments and interactive 3D worlds.",
    type: "game_capture",
    subcategory: "FPS Games",
    is_published: true,
  },
];

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const supabase = createSupabaseAdminClient();

  console.log("Seeding data catalog...\n");

  // ---- Upsert categories ----
  console.log("--- Categories ---");

  const { data: upsertedCategories, error: catError } = await supabase
    .from("dataset_categories")
    .upsert(CATEGORIES, { onConflict: "slug", ignoreDuplicates: true })
    .select("id, slug");

  if (catError) {
    console.error("Error upserting categories:", catError.message);
    process.exit(1);
  }

  console.log(`  Upserted ${upsertedCategories?.length ?? 0} categories`);
  for (const cat of upsertedCategories ?? []) {
    console.log(`    - ${cat.slug} (${cat.id})`);
  }

  // Build slug -> id lookup (fetch all in case some already existed via ignoreDuplicates)
  const { data: allCategories, error: fetchCatError } = await supabase
    .from("dataset_categories")
    .select("id, slug");

  if (fetchCatError) {
    console.error("Error fetching categories:", fetchCatError.message);
    process.exit(1);
  }

  const categoryMap = new Map<string, string>();
  for (const cat of allCategories ?? []) {
    categoryMap.set(cat.slug, cat.id);
  }

  // ---- Upsert datasets ----
  console.log("\n--- Datasets ---");

  const datasetRows = DATASETS.map((ds) => {
    const categoryId = categoryMap.get(ds.category_slug);
    if (!categoryId) {
      console.error(
        `Category slug "${ds.category_slug}" not found. Cannot seed dataset "${ds.name}".`
      );
      process.exit(1);
    }
    return {
      category_id: categoryId,
      name: ds.name,
      slug: ds.slug,
      description: ds.description,
      type: ds.type,
      subcategory: ds.subcategory,
      is_published: ds.is_published,
    };
  });

  const { data: upsertedDatasets, error: dsError } = await supabase
    .from("datasets")
    .upsert(datasetRows, { onConflict: "slug", ignoreDuplicates: true })
    .select("id, slug, name");

  if (dsError) {
    console.error("Error upserting datasets:", dsError.message);
    process.exit(1);
  }

  console.log(`  Upserted ${upsertedDatasets?.length ?? 0} datasets`);
  for (const ds of upsertedDatasets ?? []) {
    console.log(`    - ${ds.slug} (${ds.id}) — "${ds.name}"`);
  }

  // ---- Summary ----
  console.log("\n=== Seed Summary ===");
  console.log(`  Categories: ${CATEGORIES.length}`);
  console.log(`  Datasets:   ${DATASETS.length}`);
  console.log("\nDone.");
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
