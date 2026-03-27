import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Claru \u2014 The Training Data Catalog for Physical AI",
  description:
    "3.7M+ human annotations across real-world video, game environments, and custom captures. 25+ commercially licensed datasets built for robotics and embodied AI teams.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://claru.ai/v2",
    siteName: "Claru",
    title: "Claru \u2014 The Training Data Catalog for Physical AI",
    description:
      "3.7M+ human annotations across real-world video, game environments, and custom captures. 25+ licensed datasets for robotics and embodied AI.",
    images: [
      {
        url: "/images/og-v2.webp",
        width: 1200,
        height: 630,
        alt: "Claru \u2014 The Training Data Catalog for Physical AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Claru \u2014 The Training Data Catalog for Physical AI",
    description:
      "3.7M+ human annotations across real-world video and game environments. Built for robotics and embodied AI.",
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
    "The training data catalog for physical AI. 3.7M+ human annotations across real-world video and game environments for robotics and embodied AI.",
  foundingDate: "2024",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: "contact@claru.ai",
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
