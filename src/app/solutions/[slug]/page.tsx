import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ogImageUrl } from "@/lib/og";
import {
  getContentPage,
  getAllContentPageSlugs,
} from "@/data/content-pages/index";
import { buildContentPageJsonLd } from "@/lib/content-page-jsonld";
import ContentPageTemplate from "@/app/components/content/ContentPageTemplate";

/* ==========================================================================
   ISR — revalidate every hour for Supabase dataset refresh
   ========================================================================== */

export const revalidate = 3600;

/* ==========================================================================
   STATIC GENERATION
   ========================================================================== */

export async function generateStaticParams() {
  const slugs = getAllContentPageSlugs();
  return slugs.map((slug) => ({ slug }));
}

/* ==========================================================================
   DYNAMIC METADATA
   ========================================================================== */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getContentPage(slug);

  if (!page) {
    return {};
  }

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    keywords: page.secondaryKeywords,
    alternates: {
      canonical: `/solutions/${slug}`,
    },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      type: "article",
      url: `https://claru.ai/solutions/${slug}`,
      images: [
        {
          url: ogImageUrl(page.title, { category: "solution" }),
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

/* ==========================================================================
   PAGE (SERVER COMPONENT)
   ========================================================================== */

export default async function SolutionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getContentPage(slug);

  if (!page) {
    notFound();
  }

  const jsonLd = buildContentPageJsonLd(page);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContentPageTemplate page={page} />
    </>
  );
}
