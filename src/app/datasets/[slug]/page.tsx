import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ogImageUrl } from "@/lib/og";
import {
  getDatasetPage,
  getAllDatasetSlugs,
} from "@/data/programmatic/datasets/index";
import { buildDatasetJsonLd } from "@/lib/wave3-jsonld";
import Wave3PageTemplate from "@/app/components/content/Wave3PageTemplate";
import {
  fetchOSSDatasetBySlug,
  fetchRelatedDatasets,
} from "@/lib/oss-datasets";
import GeoPageShell from "@/app/components/content/GeoPageShell";
import OSSDatasetDetail from "../components/OSSDatasetDetail";

export const revalidate = 3600; // ISR: 1 hour for OSS pages
export const dynamicParams = true; // OSS slugs not in generateStaticParams are rendered dynamically

// ==========================================================================
// STATIC GENERATION — Claru pages only, OSS pages use dynamic rendering
// ==========================================================================

export async function generateStaticParams() {
  const staticSlugs = getAllDatasetSlugs();
  return staticSlugs.map((slug) => ({ slug }));
}

// ==========================================================================
// DYNAMIC METADATA
// ==========================================================================

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  // 1. Check static Claru pages first
  const staticPage = getDatasetPage(slug);
  if (staticPage) {
    return {
      title: staticPage.metaTitle,
      description: staticPage.metaDescription,
      keywords: staticPage.secondaryKeywords,
      alternates: { canonical: staticPage.canonicalPath },
      openGraph: {
        title: staticPage.metaTitle,
        description: staticPage.metaDescription,
        type: "article",
        url: `https://claru.ai${staticPage.canonicalPath}`,
        images: [
          {
            url: ogImageUrl(staticPage.h1, { category: "dataset" }),
            width: 1200,
            height: 630,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: staticPage.metaTitle,
        description: staticPage.metaDescription,
      },
    };
  }

  // 2. Check OSS dataset from Supabase
  const ossDataset = await fetchOSSDatasetBySlug(slug);
  if (!ossDataset) return {};

  const title = `${ossDataset.name} - Physical AI Dataset | Claru`;
  const description =
    ossDataset.description ??
    `Explore the ${ossDataset.name} dataset — metadata, modalities, robot embodiments, and download links for physical AI research.`;
  const keywords = [
    ...ossDataset.modalities,
    ...ossDataset.task_types,
    ...ossDataset.environment_type,
    ossDataset.name,
    "physical AI dataset",
    "robotics dataset",
  ].filter(Boolean);

  return {
    title,
    description,
    keywords,
    alternates: { canonical: `https://claru.ai/datasets/${slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://claru.ai/datasets/${slug}`,
      images: [
        {
          url: ogImageUrl(ossDataset.name, { category: "oss-dataset" }),
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

// ==========================================================================
// PAGE (SERVER COMPONENT)
// ==========================================================================

export default async function DatasetPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // 1. Check static Claru pages first (priority)
  const staticPage = getDatasetPage(slug);
  if (staticPage) {
    const jsonLd = buildDatasetJsonLd(staticPage);
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c").replace(/>/g, "\\u003e") }}
        />
        <Wave3PageTemplate page={staticPage} />
      </>
    );
  }

  // 2. Check OSS dataset from Supabase
  const ossDataset = await fetchOSSDatasetBySlug(slug);
  if (!ossDataset) {
    notFound();
  }

  // Fetch related datasets
  const relatedDatasets = await fetchRelatedDatasets(ossDataset, 6);

  // Build JSON-LD Dataset schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: ossDataset.name,
    description: ossDataset.description,
    url: `https://claru.ai/datasets/${slug}`,
    license: ossDataset.license,
    creator: ossDataset.author
      ? { "@type": "Organization", name: ossDataset.author }
      : undefined,
    datePublished: ossDataset.year_released
      ? `${ossDataset.year_released}-01-01`
      : undefined,
    distribution: [
      {
        "@type": "DataDownload",
        contentUrl: `https://huggingface.co/datasets/${ossDataset.dataset_id}`,
        encodingFormat: ossDataset.data_format || undefined,
      },
    ],
    keywords: [
      ...ossDataset.modalities,
      ...ossDataset.task_types,
      ...ossDataset.environment_type,
    ]
      .filter(Boolean)
      .join(", "),
  };

  return (
    <GeoPageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c").replace(/>/g, "\\u003e") }}
      />
      <OSSDatasetDetail dataset={ossDataset} relatedDatasets={relatedDatasets} />
    </GeoPageShell>
  );
}
