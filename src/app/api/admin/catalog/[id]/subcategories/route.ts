import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/admin/catalog/[id]/subcategories
 * Returns the distinct categories/subcategories found in the video_index
 * for this dataset's mapped S3 prefixes. Used as a level-2 filter dropdown.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: datasetId } = await params;
  const supabase = createSupabaseAdminClient();

  // Get prefix routes for this dataset
  const { data: routes } = await supabase
    .from("dataset_prefix_routes")
    .select("s3_bucket, key_prefix")
    .eq("dataset_id", datasetId);

  if (!routes || routes.length === 0) {
    return NextResponse.json({ subcategories: [] });
  }

  const bucket = routes[0].s3_bucket;
  const prefixes = routes.map((r) => r.key_prefix).filter(Boolean);

  // Query distinct categories from caption_text in video_index
  // Caption format: "Subcategory: X. Category: Y"
  let query = supabase
    .from("video_index")
    .select("caption_text")
    .eq("s3_bucket", bucket);

  // We can't do LIKE filters easily with supabase-js for multiple prefixes
  // So fetch a sample and extract categories
  if (prefixes.length === 1) {
    query = query.like("s3_key", `${prefixes[0]}%`);
  }

  const { data } = await query.limit(10000);

  // Extract unique categories from caption_text
  const categoryCount: Record<string, number> = {};
  const subcategoryCount: Record<string, number> = {};

  for (const row of data ?? []) {
    const text = row.caption_text ?? "";
    const catMatch = text.match(/Category:\s*(.+?)$/);
    const subMatch = text.match(/Subcategory:\s*(.+?)\./);
    if (catMatch) {
      const cat = catMatch[1].trim();
      categoryCount[cat] = (categoryCount[cat] ?? 0) + 1;
    }
    if (subMatch) {
      const sub = subMatch[1].trim();
      subcategoryCount[sub] = (subcategoryCount[sub] ?? 0) + 1;
    }
  }

  // Return both levels sorted by count
  const categories = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));

  const subcategories = Object.entries(subcategoryCount)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));

  return NextResponse.json({
    total_corpus: (data ?? []).length,
    categories,
    subcategories,
  });
}
