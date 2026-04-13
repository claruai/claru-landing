import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ogImageUrl } from "@/lib/og";
import {
  getGuidePage,
  getAllGuideSlugs,
} from "@/data/programmatic/guides/index";
import { buildGuideJsonLd } from "@/lib/programmatic-jsonld";
import ProgrammaticPageTemplate from "@/app/components/content/ProgrammaticPageTemplate";

// ==========================================================================
// STATIC GENERATION
// ==========================================================================

export async function generateStaticParams() {
  const slugs = getAllGuideSlugs();
  return slugs.map((topic) => ({ topic }));
}

// ==========================================================================
// DYNAMIC METADATA
// ==========================================================================

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}): Promise<Metadata> {
  const { topic } = await params;
  const page = getGuidePage(topic);

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
          url: ogImageUrl(page.h1, { category: "guide" }),
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

export default async function GuidePage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const page = getGuidePage(topic);

  if (!page) {
    notFound();
  }

  const jsonLd = buildGuideJsonLd(page);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProgrammaticPageTemplate page={page} variant="guide" />
    </>
  );
}
