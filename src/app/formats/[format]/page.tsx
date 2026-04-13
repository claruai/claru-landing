import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ogImageUrl } from "@/lib/og";
import {
  getFormatPage,
  getAllFormatSlugs,
} from "@/data/programmatic/formats/index";
import { buildFormatJsonLd } from "@/lib/wave3-jsonld";
import Wave3PageTemplate from "@/app/components/content/Wave3PageTemplate";

// ==========================================================================
// STATIC GENERATION
// ==========================================================================

export async function generateStaticParams() {
  const slugs = getAllFormatSlugs();
  return slugs.map((format) => ({ format }));
}

// ==========================================================================
// DYNAMIC METADATA
// ==========================================================================

export async function generateMetadata({
  params,
}: {
  params: Promise<{ format: string }>;
}): Promise<Metadata> {
  const { format } = await params;
  const page = getFormatPage(format);

  if (!page) return {};

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    keywords: page.secondaryKeywords,
    alternates: {
      canonical: page.canonicalPath,
    },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      type: "article",
      url: `https://claru.ai${page.canonicalPath}`,
      images: [
        {
          url: ogImageUrl(page.h1, { category: "format" }),
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.metaTitle,
      description: page.metaDescription,
    },
  };
}

// ==========================================================================
// PAGE (SERVER COMPONENT)
// ==========================================================================

export default async function FormatPage({
  params,
}: {
  params: Promise<{ format: string }>;
}) {
  const { format } = await params;
  const page = getFormatPage(format);

  if (!page) {
    notFound();
  }

  const jsonLd = buildFormatJsonLd(page);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Wave3PageTemplate page={page} />
    </>
  );
}
