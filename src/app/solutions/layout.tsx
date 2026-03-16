import type { Metadata } from "next";
import { ogImageUrl } from "@/lib/og";

/**
 * Shared layout for all /solutions/[slug] content pages.
 *
 * Provides common metadata defaults. Page-specific metadata (title,
 * description, canonical, OG image) is set via generateMetadata in
 * [slug]/page.tsx which merges with these defaults.
 *
 * JSON-LD (BreadcrumbList, Service, FAQPage) is injected at the PAGE
 * level, not here, because it requires page-specific data (title, slug,
 * faqs) that the layout does not have access to.
 */

export const metadata: Metadata = {
  openGraph: {
    type: "website",
    siteName: "Claru",
    images: [
      {
        url: ogImageUrl("AI Training Data Solutions", {
          category: "solution",
        }),
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function SolutionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
