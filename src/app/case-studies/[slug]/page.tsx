import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllCaseStudies,
  getCaseStudyBySlug,
  getRelatedCaseStudies,
} from "@/lib/case-studies";
import { CASE_STUDY_CATEGORIES } from "@/types/case-study";
import CaseStudyDetailClient from "./CaseStudyDetailClient";

/* ==========================================================================
   STATIC GENERATION
   ========================================================================== */

export async function generateStaticParams() {
  const caseStudies = getAllCaseStudies();
  return caseStudies.map((cs) => ({ slug: cs.slug }));
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
  const cs = getCaseStudyBySlug(slug);

  if (!cs) {
    return {
      title: "Case Study Not Found | Claru AI",
    };
  }

  return {
    title: cs.metaTitle,
    description: cs.metaDescription,
    openGraph: {
      title: cs.metaTitle,
      description: cs.metaDescription,
      type: "article",
      url: `https://claru.ai/case-studies/${cs.slug}`,
      publishedTime: cs.datePublished,
    },
    twitter: {
      card: "summary_large_image",
      title: cs.metaTitle,
      description: cs.metaDescription,
    },
  };
}

/* ==========================================================================
   PAGE (SERVER COMPONENT)
   ========================================================================== */

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = getCaseStudyBySlug(slug);

  if (!cs) {
    notFound();
  }

  const related = getRelatedCaseStudies(slug, 3);

  const categoryLabel =
    CASE_STUDY_CATEGORIES[
      cs.category as keyof typeof CASE_STUDY_CATEGORIES
    ] || cs.category;

  // Article JSON-LD
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: cs.title,
    description: cs.metaDescription,
    datePublished: cs.datePublished,
    dateModified: cs.dateModified ?? cs.datePublished,
    author: {
      "@type": "Organization",
      name: "Claru AI",
      url: "https://claru.ai",
    },
    publisher: {
      "@type": "Organization",
      name: "Claru AI",
      url: "https://claru.ai",
      logo: {
        "@type": "ImageObject",
        url: "https://claru.ai/images/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://claru.ai/case-studies/${cs.slug}`,
    },
  };

  // FAQPage JSON-LD
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: cs.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  // BreadcrumbList JSON-LD
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://claru.ai",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Case Studies",
        item: "https://claru.ai/case-studies",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: cs.title,
        item: `https://claru.ai/case-studies/${cs.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <CaseStudyDetailClient
        caseStudy={cs}
        categoryLabel={categoryLabel}
        relatedCaseStudies={related}
      />
    </>
  );
}
