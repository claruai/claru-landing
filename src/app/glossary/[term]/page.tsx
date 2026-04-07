import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ogImageUrl } from "@/lib/og";
import {
  getGlossaryDeepPage,
  getAllGlossaryDeepSlugs,
} from "@/data/programmatic/glossary-deep/index";
import { buildGlossaryDeepJsonLd } from "@/lib/programmatic-jsonld";
import ProgrammaticPageTemplate from "@/app/components/content/ProgrammaticPageTemplate";

// ==========================================================================
// STATIC GENERATION
// ==========================================================================

export async function generateStaticParams() {
  const slugs = getAllGlossaryDeepSlugs();
  return slugs.map((term) => ({ term }));
}

// ==========================================================================
// DYNAMIC METADATA
// ==========================================================================

export async function generateMetadata({
  params,
}: {
  params: Promise<{ term: string }>;
}): Promise<Metadata> {
  const { term } = await params;
  const page = getGlossaryDeepPage(term);

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
          url: ogImageUrl(page.h1, { category: "glossary" }),
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

export default async function GlossaryTermPage({
  params,
}: {
  params: Promise<{ term: string }>;
}) {
  const { term } = await params;
  const page = getGlossaryDeepPage(term);

  if (!page) {
    notFound();
  }

  const jsonLd = buildGlossaryDeepJsonLd(page);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProgrammaticPageTemplate page={page} variant="glossary-deep" />
    </>
  );
}
