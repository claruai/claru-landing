import { BUILD_DATE } from "@/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Red Teaming & Adversarial Testing | Claru",
  description:
    "Expert AI red teaming services for LLM safety evaluation. Jailbreak testing, prompt injection detection, and adversarial vulnerability assessment aligned with NIST AI RMF.",
  keywords: [
    "AI red teaming",
    "adversarial testing",
    "LLM jailbreak testing",
    "AI safety evaluation",
    "prompt injection testing",
    "vulnerability assessment",
    "NIST AI RMF",
    "EU AI Act compliance",
  ],
  alternates: {
    canonical: "/pillars/validate/red-teaming",
  },
  openGraph: {
    title: "AI Red Teaming & Adversarial Testing | Claru",
    description:
      "Expert red teaming for frontier AI systems. Find vulnerabilities before attackers do with human-led adversarial testing.",
    url: "/pillars/validate/red-teaming",
    type: "website",
  },
};

// JSON-LD Schema
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: "AI Red Teaming Services",
      serviceType: "AI Security & Safety Evaluation",
      provider: {
        "@type": "Organization",
        name: "Claru",
        url: "https://claru.ai",
      },
      description:
        "Expert adversarial testing and red teaming services for AI systems. Jailbreak testing, prompt injection detection, and comprehensive vulnerability assessment.",
      areaServed: "Worldwide",
      dateModified: BUILD_DATE,
      audience: {
        "@type": "Audience",
        audienceType: "AI Research Labs, ML Engineering Teams, Enterprise AI",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@id": "https://claru.ai",
            name: "Home",
          },
        },
        {
          "@type": "ListItem",
          position: 2,
          item: {
            "@id": "https://claru.ai/pillars/validate",
            name: "Validate",
          },
        },
        {
          "@type": "ListItem",
          position: 3,
          item: {
            "@id": "https://claru.ai/pillars/validate/red-teaming",
            name: "Red Teaming",
          },
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is AI red teaming and why is it important?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "AI red teaming is systematic adversarial testing where security experts attempt to bypass AI safety measures, find jailbreaks, and identify vulnerabilities. It's critical because automated testing misses creative attacks that human adversaries discover. NIST AI RMF and EU AI Act now require documented red teaming for high-risk systems.",
          },
        },
        {
          "@type": "Question",
          name: "What types of attacks does Claru test for?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We test 40+ vulnerability categories including multi-turn jailbreaks, prompt injection variants, encoding obfuscations, role-playing attacks, context manipulation, data extraction attempts, and emergent misuse patterns. Our methodology aligns with OWASP LLM Top 10 and covers both known attack patterns and novel vectors.",
          },
        },
        {
          "@type": "Question",
          name: "How does human red teaming differ from automated testing?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Automated tools execute known attack patterns at scale but miss creative combinations and context-dependent vulnerabilities. Human red teamers understand model architectures, adapt attacks based on responses, and discover novel failure modes. We combine both: automated scanning for coverage, human expertise for depth.",
          },
        },
      ],
    },
  ],
};

export default function RedTeamingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
