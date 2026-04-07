// ---------------------------------------------------------------------------
// JSON-LD builders for programmatic SEO pages
// ---------------------------------------------------------------------------

import type { GlossaryDeepPageData, GuidePageData, TaskPageData, ModelPageData, AcademicAltPageData, ProgrammaticPageBase } from "@/data/programmatic/types";
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
        "@id": crumb.href.startsWith("http") ? crumb.href : `${BASE_URL}${crumb.href}`,
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

export function buildGlossaryDeepJsonLd(page: GlossaryDeepPageData): object {
  const graph: object[] = [
    buildBreadcrumbJsonLd(page),
    {
      "@type": "DefinedTerm",
      "@id": `${BASE_URL}/glossary/${page.slug}`,
      name: page.h1,
      description: page.metaDescription,
      inDefinedTermSet: `${BASE_URL}/glossary`,
      url: `${BASE_URL}/glossary/${page.slug}`,
      dateModified: BUILD_DATE,
    },
    {
      "@type": "Article",
      headline: page.h1,
      description: page.metaDescription,
      author: { "@id": ORG_ID },
      publisher: { "@id": ORG_ID },
      datePublished: BUILD_DATE,
      dateModified: BUILD_DATE,
      mainEntityOfPage: `${BASE_URL}/glossary/${page.slug}`,
    },
  ];

  const faq = buildFaqJsonLd(page);
  if (faq) graph.push(faq);

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

/**
 * Convert human-readable time estimates like "2-4 weeks", "1-3 days",
 * "3-6 months" to ISO 8601 duration format for JSON-LD totalTime.
 * Uses the upper bound of the range.
 */
function toISO8601Duration(estimatedTime: string): string {
  const lower = estimatedTime.toLowerCase();
  // Extract the last number before the unit
  const nums = lower.match(/(\d+)/g);
  if (!nums || nums.length === 0) return "PT1H";
  const upperBound = parseInt(nums[nums.length - 1], 10);

  if (lower.includes("month")) return `P${upperBound * 30}D`;
  if (lower.includes("week")) return `P${upperBound * 7}D`;
  if (lower.includes("day")) return `P${upperBound}D`;
  if (lower.includes("hour")) return `PT${upperBound}H`;
  if (lower.includes("min")) return `PT${upperBound}M`;
  return `P${upperBound}D`;
}

export function buildGuideJsonLd(page: GuidePageData): object {
  const graph: object[] = [
    buildBreadcrumbJsonLd(page),
    {
      "@type": "HowTo",
      name: page.h1,
      description: page.metaDescription,
      step: page.steps.map((step) => ({
        "@type": "HowToStep",
        position: step.stepNumber,
        name: step.title,
        text: step.description.slice(0, 300),
      })),
      totalTime: toISO8601Duration(page.estimatedTime),
    },
    {
      "@type": "Article",
      headline: page.h1,
      description: page.metaDescription,
      author: { "@id": ORG_ID },
      publisher: { "@id": ORG_ID },
      datePublished: BUILD_DATE,
      dateModified: BUILD_DATE,
      mainEntityOfPage: `${BASE_URL}/guides/${page.slug}`,
    },
  ];

  const faq = buildFaqJsonLd(page);
  if (faq) graph.push(faq);

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export function buildTaskJsonLd(page: TaskPageData): object {
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
      mainEntityOfPage: `${BASE_URL}/training-data/${page.slug}`,
      about: {
        "@type": "Thing",
        name: page.h1,
        description: page.heroSubtitle,
      },
    },
    {
      "@type": "DataCatalog",
      name: `${page.h1} — Claru`,
      description: page.metaDescription,
      provider: { "@id": ORG_ID },
      url: `${BASE_URL}/training-data/${page.slug}`,
    },
  ];

  const faqTask = buildFaqJsonLd(page);
  if (faqTask) graph.push(faqTask);

  return { "@context": "https://schema.org", "@graph": graph };
}

export function buildModelJsonLd(page: ModelPageData): object {
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
      mainEntityOfPage: `${BASE_URL}/models/${page.slug}`,
      about: {
        "@type": "SoftwareApplication",
        name: page.modelName,
        applicationCategory: "Robot Learning Model",
        creator: { "@type": "Organization", name: page.organization },
        datePublished: String(page.year),
      },
    },
  ];

  const faqModel = buildFaqJsonLd(page);
  if (faqModel) graph.push(faqModel);

  return { "@context": "https://schema.org", "@graph": graph };
}

export function buildAcademicAltJsonLd(page: AcademicAltPageData): object {
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
      mainEntityOfPage: `${BASE_URL}/compare/${page.slug}`,
      about: {
        "@type": "Dataset",
        name: page.datasetName,
        description: page.academicProfile.scale,
        creator: { "@type": "Organization", name: page.academicProfile.institution },
        datePublished: String(page.academicProfile.year),
        license: page.academicProfile.license,
      },
    },
  ];

  const faqAlt = buildFaqJsonLd(page);
  if (faqAlt) graph.push(faqAlt);

  return { "@context": "https://schema.org", "@graph": graph };
}
