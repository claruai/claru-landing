import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Claru | The Training Data Catalog for Physical AI",
  description:
    "Curated video datasets with depth, pose, and segmentation — built for robotics and embodied AI teams. 3.7M+ annotations across 25+ commercially licensed datasets. Download, load, train.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://claru.ai/v2",
    siteName: "Claru",
    title: "Claru | The Training Data Catalog for Physical AI",
    description:
      "Curated video datasets with depth, pose, and segmentation. 3.7M+ annotations across 25+ datasets for robotics and embodied AI.",
    images: [
      {
        url: "/images/og-v2.webp",
        width: 1200,
        height: 630,
        alt: "Claru - The Training Data Catalog for Physical AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Claru | The Training Data Catalog for Physical AI",
    description:
      "Curated video datasets with depth, pose, and segmentation. 3.7M+ annotations for robotics and embodied AI.",
    images: ["/images/og-v2.webp"],
  },
  alternates: {
    canonical: "/v2",
  },
  robots: {
    index: false,
    follow: false,
  },
};

// JSON-LD Organization structured data
const v2JsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://claru.ai/#organization",
  name: "Claru",
  legalName: "Reka AI Inc.",
  url: "https://claru.ai",
  description:
    "The training data catalog for physical AI. Curated video datasets with depth, pose, and segmentation for robotics and embodied AI.",
  foundingDate: "2024",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: "team@claru.ai",
    url: "https://claru.ai/v2#contact",
  },
  sameAs: [
    "https://github.com/claruai",
    "https://www.linkedin.com/company/claruai",
  ],
};

export default function V2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(v2JsonLd) }}
      />
      {children}
    </>
  );
}
