// ---------------------------------------------------------------------------
// JSON-LD builders for Wave 3 programmatic SEO pages
// (datasets, formats, industry verticals)
// ---------------------------------------------------------------------------

import type { ProgrammaticPageBase } from "@/data/programmatic/types";
import type { DatasetPageData } from "@/data/programmatic/datasets/types";
import type { FormatPageData } from "@/data/programmatic/formats/types";
import type { IndustryPageData } from "@/data/programmatic/industries/types";
import { BUILD_DATE } from "@/lib/constants";

const BASE_URL = "https://claru.ai";
const ORG_ID = `${BASE_URL}/#organization`;

function buildBreadcrumbJsonLd(page: ProgrammaticPageBase) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: page.breadcrumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@id": crumb.href.startsWith("http")
          ? crumb.href
          : `${BASE_URL}${crumb.href}`,
        name: crumb.label,
      },
    })),
  };
}

function buildFaqJsonLd(page: ProgrammaticPageBase) {
  if (page.faqs.length === 0) return null;
  return {
    "@type": "FAQPage",
    mainEntity: page.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildDatasetJsonLd(page: DatasetPageData): object {
  const graph: object[] = [
    buildBreadcrumbJsonLd(page),
    {
      "@type": "Dataset",
      name: page.h1,
      description: page.metaDescription,
      url: `${BASE_URL}${page.canonicalPath}`,
      creator: { "@id": ORG_ID },
      dateModified: BUILD_DATE,
      keywords: page.secondaryKeywords.join(", "),
      measurementTechnique: page.datasetProfile.modalities.join(", "),
    },
    {
      "@type": "Article",
      headline: page.h1,
      description: page.metaDescription,
      author: { "@id": ORG_ID },
      publisher: { "@id": ORG_ID },
      datePublished: BUILD_DATE,
      dateModified: BUILD_DATE,
      mainEntityOfPage: `${BASE_URL}${page.canonicalPath}`,
    },
  ];

  const faq = buildFaqJsonLd(page);
  if (faq) graph.push(faq);

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export function buildFormatJsonLd(page: FormatPageData): object {
  const graph: object[] = [
    buildBreadcrumbJsonLd(page),
    {
      "@type": "TechArticle",
      headline: page.h1,
      description: page.metaDescription,
      author: { "@id": ORG_ID },
      publisher: { "@id": ORG_ID },
      datePublished: BUILD_DATE,
      dateModified: BUILD_DATE,
      mainEntityOfPage: `${BASE_URL}${page.canonicalPath}`,
      proficiencyLevel: "Expert",
    },
  ];

  const faq = buildFaqJsonLd(page);
  if (faq) graph.push(faq);

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export function buildIndustryJsonLd(page: IndustryPageData): object {
  const graph: object[] = [
    buildBreadcrumbJsonLd(page),
    {
      "@type": "Article",
      headline: page.h1,
      description: page.metaDescription,
      author: { "@id": ORG_ID },
      publisher: { "@id": ORG_ID },
      datePublished: BUILD_DATE,
      dateModified: BUILD_DATE,
      mainEntityOfPage: `${BASE_URL}${page.canonicalPath}`,
      about: {
        "@type": "Thing",
        name: page.h1,
      },
    },
  ];

  const faq = buildFaqJsonLd(page);
  if (faq) graph.push(faq);

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
