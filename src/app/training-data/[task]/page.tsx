import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ogImageUrl } from "@/lib/og";
import {
  getTaskPage,
  getAllTaskSlugs,
} from "@/data/programmatic/tasks/index";
import { buildTaskJsonLd } from "@/lib/programmatic-jsonld";
import ProgrammaticPageTemplate from "@/app/components/content/ProgrammaticPageTemplate";

// ==========================================================================
// STATIC GENERATION
// ==========================================================================

export async function generateStaticParams() {
  const slugs = getAllTaskSlugs();
  return slugs.map((task) => ({ task }));
}

// ==========================================================================
// DYNAMIC METADATA
// ==========================================================================

export async function generateMetadata({
  params,
}: {
  params: Promise<{ task: string }>;
}): Promise<Metadata> {
  const { task } = await params;
  const page = getTaskPage(task);

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
          url: ogImageUrl(page.h1, { category: "training-data" }),
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

export default async function TaskPage({
  params,
}: {
  params: Promise<{ task: string }>;
}) {
  const { task } = await params;
  const page = getTaskPage(task);

  if (!page) {
    notFound();
  }

  const jsonLd = buildTaskJsonLd(page);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProgrammaticPageTemplate page={page} variant="task" />
    </>
  );
}
