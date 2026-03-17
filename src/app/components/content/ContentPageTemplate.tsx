// ---------------------------------------------------------------------------
// ContentPageTemplate — Server Component
// ---------------------------------------------------------------------------
// Main template that composes all sections for a /solutions/[slug] content
// page. Each page.tsx passes its ContentPageData object to this template.
//
// This is a server component — no client-side JavaScript. Sections that need
// interactivity (ContentFAQ) are individually marked 'use client'.
// ---------------------------------------------------------------------------

import type { ContentPageData } from "@/data/content-pages/types";

import ContentHero from "./ContentHero";
import VideoHero from "@/app/components/media/VideoHero";
import ProblemSection from "./ProblemSection";
import DatasetComparison from "./DatasetComparison";
import InlineCaseStudy from "./InlineCaseStudy";
import DatasetShowcase from "@/app/components/prospect/DatasetShowcase";
import DataPreview from "./DataPreview";
import WorkforceStats from "@/app/components/prospect/WorkforceStats";
import ContentFAQ from "./ContentFAQ";
import FinalCTA from "@/app/components/sections/FinalCTA";
import ResearchCitations from "./ResearchCitations";
import RelatedSolutions from "./RelatedSolutions";

interface ContentPageTemplateProps {
  /** The full content page data object */
  page: ContentPageData;
}

export default function ContentPageTemplate({
  page,
}: ContentPageTemplateProps) {
  return (
    <article style={{ backgroundColor: "#0a0908" }}>
      {/* 1. Hero */}
      <ContentHero
        title={page.title}
        subtitle={page.heroSubtitle}
        breadcrumbLabel={page.breadcrumbLabel}
      />

      {/* 1b. Video Hero (pre-rendered Remotion composition) */}
      {page.videoSrc && <VideoHero videoSrc={page.videoSrc} />}

      {/* 2. Problem Section */}
      {page.problem.sections.length > 0 && (
        <ProblemSection
          sections={page.problem.sections}
          citations={page.citations}
        />
      )}

      {/* 3. Data Preview — real samples with video + metadata side-by-side */}
      {page.sampleIds && page.sampleIds.length > 0 && (
        <DataPreview
          sampleIds={page.sampleIds.slice(0, 6)}
          heading={page.sampleShowcaseHeading ?? "Inside the Data"}
          subheading={page.sampleShowcaseSubheading ?? "Real samples with metadata and enrichment — exactly what gets delivered to your training pipeline."}
        />
      )}

      {/* 4. Dataset Comparison (landscape) — only if rows exist */}
      {page.landscape.datasets.length > 0 && (
        <DatasetComparison
          title={page.landscape.heading}
          description={page.landscape.description}
          rows={page.landscape.datasets}
        />
      )}

      {/* 4. Inline Case Studies */}
      {page.caseStudySlugs.length > 0 && (
        <section id="case-studies" className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6 space-y-8">
            {page.caseStudySlugs.map((slug) => (
              <InlineCaseStudy key={slug} slug={slug} />
            ))}
          </div>
        </section>
      )}

      {/* 5. Dataset Showcase (existing async server component) — only if IDs exist */}
      {page.datasetIds.length > 0 && (
        <section id="datasets" className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <DatasetShowcase datasetIds={page.datasetIds} />
          </div>
        </section>
      )}

      {/* 6. Workforce Stats (existing client component) */}
      <section id="workforce" className="w-full py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <WorkforceStats />
        </div>
      </section>

      {/* 7. FAQ */}
      {page.faqs.length > 0 && (
        <ContentFAQ faqs={page.faqs} />
      )}

      {/* 8. Final CTA (existing client component) */}
      <FinalCTA />

      {/* 9. Research Citations */}
      {page.citations.length > 0 && (
        <ResearchCitations citations={page.citations} />
      )}

      {/* 10. Related Solutions */}
      {page.relatedSlugs.length > 0 && (
        <RelatedSolutions slugs={page.relatedSlugs} />
      )}
    </article>
  );
}
