// ---------------------------------------------------------------------------
// JSON-LD builders for Wave 4 programmatic SEO pages (labs + benchmarks)
// ---------------------------------------------------------------------------

import type { ProgrammaticPageBase } from "@/data/programmatic/types";
import type { LabPageData } from "@/data/programmatic/labs/types";
import type { BenchmarkPageData } from "@/data/programmatic/benchmarks/types";
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

export function buildLabJsonLd(page: LabPageData): object {
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
        "@type": "Organization",
        name: page.companyName,
        description: page.companyDescription,
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

export function buildBenchmarkJsonLd(page: BenchmarkPageData): object {
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
        "@type": "CreativeWork",
        name: page.benchmarkName,
        description: page.benchmarkDescription,
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
