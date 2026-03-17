import type { ContentPageData } from "@/data/content-pages/types";
import { BUILD_DATE } from "@/lib/constants";
import { entityProfile } from "@/lib/entity-profile";

/**
 * Builds a JSON-LD `@graph` array for a content page containing:
 * - BreadcrumbList: Home > Solutions > {page.breadcrumbLabel}
 * - Service: linked to Organization via @id reference
 * - FAQPage: from page.faqs array
 *
 * Injected at the page level (in [slug]/page.tsx) because it requires
 * page-specific data that the shared layout does not have access to.
 */
export function buildContentPageJsonLd(page: ContentPageData): object {
  const baseUrl = entityProfile.url;

  return {
    "@context": "https://schema.org",
    "@graph": [
      // -- BreadcrumbList --
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            item: {
              "@id": baseUrl,
              name: "Home",
            },
          },
          {
            "@type": "ListItem",
            position: 2,
            item: {
              "@id": `${baseUrl}/solutions`,
              name: "Solutions",
            },
          },
          {
            "@type": "ListItem",
            position: 3,
            item: {
              "@id": `${baseUrl}/solutions/${page.slug}`,
              name: page.breadcrumbLabel,
            },
          },
        ],
      },

      // -- Service (linked to Organization) --
      {
        "@type": "Service",
        name: page.title,
        serviceType: "AI Training Data",
        provider: {
          "@id": `${baseUrl}/#organization`,
        },
        description: page.metaDescription,
        areaServed: "Worldwide",
        dateModified: BUILD_DATE,
      },

      // -- FAQPage --
      {
        "@type": "FAQPage",
        mainEntity: page.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };
}
