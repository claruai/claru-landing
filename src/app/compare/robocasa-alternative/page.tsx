import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ogImageUrl } from "@/lib/og";
import { getAcademicAltPage } from "@/data/programmatic/academic-alts/index";
import { buildAcademicAltJsonLd } from "@/lib/programmatic-jsonld";
import ProgrammaticPageTemplate from "@/app/components/content/ProgrammaticPageTemplate";

const SLUG = "robocasa-alternative";

// ==========================================================================
// METADATA
// ==========================================================================

export async function generateMetadata(): Promise<Metadata> {
  const page = getAcademicAltPage(SLUG);
  if (!page) return {};

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    keywords: page.secondaryKeywords,
    alternates: { canonical: page.canonicalPath },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      type: "article",
      url: `https://claru.ai${page.canonicalPath}`,
      images: [{ url: ogImageUrl(page.h1, { category: "compare" }), width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.metaTitle,
      description: page.metaDescription,
    },
  };
}

// ==========================================================================
// PAGE
// ==========================================================================

export default function AcademicAltPage() {
  const page = getAcademicAltPage(SLUG);
  if (!page) notFound();

  const jsonLd = buildAcademicAltJsonLd(page);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProgrammaticPageTemplate page={page} variant="academic-alt" />
    </>
  );
}
