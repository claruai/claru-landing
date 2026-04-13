export const dynamic = "force-dynamic";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { verifyAdminToken } from "@/lib/admin-auth";
import { getS3SignedUrl } from "@/lib/s3/presigner";
import type {
  Lead,
  Dataset,
  DatasetCategory,
} from "@/types/data-catalog";
import { CatalogBrowser } from "./CatalogBrowser";
import { OtherDatasets } from "./OtherDatasets";
import { CuratedForYou } from "./CuratedForYou";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Data Fetching
// ---------------------------------------------------------------------------

async function getCatalogData() {
  // Detect admin preview mode — requires ?admin_preview=true param (not just cookie)
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("admin-token")?.value;
  // Note: getCatalogData doesn't have access to searchParams, so we check the cookie only
  // The middleware already gates admin preview on ?admin_preview=true OR /admin/ referer
  const isAdminPreview = false; // Disabled on catalog index — admin uses /admin/catalog instead

  let leadId: string;

  if (isAdminPreview) {
    // Admin preview — use a synthetic lead ID that won't match anything,
    // but show all published datasets
    leadId = "admin-preview";
  } else {
    const supabase = await createSupabaseServerClient();

    // Verify the authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/portal/login");
    }

    // Confirm the user is a valid lead
    const { data: lead } = await supabase
      .from("leads")
      .select("id")
      .eq("supabase_user_id", user.id)
      .single<Pick<Lead, "id">>();

    if (!lead) {
      redirect("/portal/login");
    }

    leadId = lead.id;
  }

  // Fetch datasets — admin sees all published, leads see only granted
  const adminClient = createSupabaseAdminClient();

  const datasets: Array<
    Dataset & {
      category: Pick<DatasetCategory, "id" | "name" | "slug"> | null;
    }
  > = [];

  const categoryMap = new Map<
    string,
    Pick<DatasetCategory, "id" | "name" | "slug">
  >();

  if (isAdminPreview) {
    // Admin: show all published datasets
    const { data: allPublished } = await adminClient
      .from("datasets")
      .select("*, dataset_categories(id, name, slug)")
      .eq("is_published", true)
      .order("name");

    for (const ds of (allPublished ?? []) as Array<Dataset & { dataset_categories: Pick<DatasetCategory, "id" | "name" | "slug"> | null }>) {
      const cat = ds.dataset_categories ?? null;
      datasets.push({ ...ds, category: cat });
      if (cat && !categoryMap.has(cat.id)) categoryMap.set(cat.id, cat);
    }
  } else {
    const supabase = await createSupabaseServerClient();
    const { data: accessGrants } = await supabase
      .from("lead_dataset_access")
      .select(
        `
        dataset_id,
        granted_at,
        datasets (
          id,
          name,
          slug,
          description,
          type,
          subcategory,
          tags,
          total_samples,
          total_duration_hours,
          thumbnail_url,
          tags,
          is_published,
          category_id,
          dataset_categories ( id, name, slug )
        )
      `
      )
      .eq("lead_id", leadId)
      .order("granted_at", { ascending: false });

    for (const grant of accessGrants ?? []) {
      const ds = grant.datasets as unknown as
        | (Dataset & {
            dataset_categories: Pick<
              DatasetCategory,
              "id" | "name" | "slug"
            > | null;
          })
        | null;

      if (!ds) continue;

      const cat = ds.dataset_categories ?? null;
      datasets.push({
        ...ds,
        category: cat,
      });

      if (cat && !categoryMap.has(cat.id)) {
        categoryMap.set(cat.id, cat);
      }
    }
  }

  const categories = Array.from(categoryMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // Fetch all other published datasets the user does NOT have access to
  const grantedIds = datasets.map((d) => d.id);

  let otherDatasets: Array<{
    id: string;
    name: string;
    description: string | null;
    total_samples: number;
    category_name: string | null;
    source_type: string;
  }> = [];

  if (!isAdminPreview) {
    // Only show "other datasets" for regular leads — admin already sees everything
    const anonClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: allPublished } = await anonClient
      .from("datasets")
      .select("id, name, description, total_samples, source_type, dataset_categories(name)")
      .eq("is_published", true)
      .order("total_samples", { ascending: false });

    if (allPublished) {
      otherDatasets = allPublished
        .filter((d) => !grantedIds.includes(d.id))
        .map((d) => ({
          id: d.id,
          name: d.name,
          description: d.description,
          total_samples: d.total_samples,
          source_type: d.source_type,
          category_name: (d.dataset_categories as unknown as { name: string } | null)?.name ?? null,
        }));
    }
  }

  // -------------------------------------------------------------------------
  // Fetch curated clips (skip for admin preview)
  // Unified clip architecture: query dataset_clips WHERE lead_id = current lead
  // and enrich from the clips table instead of video_index.
  // -------------------------------------------------------------------------
  interface CuratedSample {
    id: string;
    caption_text: string | null;
    s3_bucket: string | null;
    s3_key: string | null;
    dataset_id: string | null;
    note: string | null;
    signed_url: string | null;
  }

  const curatedSamples: CuratedSample[] = [];

  if (!isAdminPreview) {
    const { data: curatedClipRows } = await adminClient
      .from("dataset_clips")
      .select("id, dataset_id, clip_id, note, created_at, clips(s3_bucket, s3_key, ai_caption)")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false })
      .limit(20);

    for (const row of curatedClipRows ?? []) {
      const clip = row.clips as unknown as {
        s3_bucket: string | null;
        s3_key: string | null;
        ai_caption: string | null;
      } | null;

      const s3_bucket = clip?.s3_bucket ?? null;
      const s3_key = clip?.s3_key ?? null;

      let signed_url: string | null = null;
      if (s3_key) {
        signed_url = await getS3SignedUrl(
          s3_key,
          3600,
          s3_bucket && s3_bucket !== "moonvalley-annotation-platform" ? s3_bucket : undefined
        );
      }

      curatedSamples.push({
        id: row.id,
        caption_text: clip?.ai_caption ?? null,
        s3_bucket,
        s3_key,
        dataset_id: row.dataset_id,
        note: row.note ?? null,
        signed_url,
      });
    }
  }

  return { datasets, categories, otherDatasets, curatedSamples, isAdminPreview };
}

// ---------------------------------------------------------------------------
// Page Component (Server)
// ---------------------------------------------------------------------------

export default async function PortalCatalogPage() {
  const { datasets, categories, otherDatasets, curatedSamples, isAdminPreview } = await getCatalogData();

  // Fetch booking URL
  const adminClient = createSupabaseAdminClient();
  const { data: bookingSetting } = await adminClient
    .from("settings")
    .select("value")
    .eq("key", "booking_url")
    .single<{ value: string }>();
  const bookingUrl = bookingSetting?.value ?? "mailto:team@claru.ai";

  return (
    <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding)] py-12">
      {/* Admin preview banner */}
      {isAdminPreview && (
        <div className="mb-6 px-4 py-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 font-mono text-xs">
          <span className="text-amber-400 font-semibold">ADMIN PREVIEW</span>
          <span className="text-amber-400/70">Showing all published datasets</span>
          <Link href="/admin/catalog" className="ml-auto text-amber-400 hover:text-amber-300">[back to admin]</Link>
        </div>
      )}

      {/* Header */}
      <section className="mb-8">
        <p className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] mb-2">
          <span className="text-[var(--accent-primary)]">$</span> portal / catalog
        </p>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
          Dataset Catalog
        </h1>
        <p className="mt-2 text-sm font-mono text-[var(--text-muted)]">
          {datasets.length} dataset{datasets.length !== 1 ? "s" : ""} available
          to you
        </p>
      </section>

      {/* Client-side browsing UI (search, filter, grid) */}
      <Suspense>
        <CatalogBrowser
          datasets={datasets}
          categories={categories}
        />
      </Suspense>

      {/* Other available datasets (expandable) */}
      {otherDatasets.length > 0 && (
        <OtherDatasets datasets={otherDatasets} bookingUrl={bookingUrl} />
      )}
    </div>
  );
}
