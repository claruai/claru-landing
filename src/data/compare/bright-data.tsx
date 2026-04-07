import type { ComparisonData } from "@/data/compare/types";
import { claruPipelineSteps, claruProofStats } from "@/data/compare/shared";

const sourceLink = (href: string, label: string) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-xs text-[var(--accent-primary)] underline underline-offset-2"
  >
    {label}
  </a>
);

export const brightDataComparison: ComparisonData = {
  slug: "bright-data-alternatives",
  competitor: {
    name: "Bright Data",
    siteUrl: "https://brightdata.com",
    category: "Web data and dataset provider",
  },
  meta: {
    title: "Bright Data Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Bright Data and Claru for physical AI training data. Bright Data offers web data collection and datasets. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Bright Data alternative",
      "Bright Data alternatives",
      "Bright Data vs Claru",
      "web data collection",
      "dataset provider",
      "physical AI training data",
      "robotics data labeling",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Bright Data Alternatives",
    title: "Bright Data Alternatives: Web Data vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://brightdata.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Bright Data
        </a>{" "}
        provides web data collection and datasets. If you need physical-world
        capture and enrichment for robotics, Claru is built for physical AI from
        day one.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Bright Data offers web data collection and dataset products.",
      "The company focuses on web-sourced datasets and data pipelines.",
      "Bright Data is a web data provider rather than a capture-first robotics pipeline.",
      "Claru is purpose-built for physical AI capture and enrichment.",
      "Choose Bright Data for web data; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What Bright Data Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Bright Data focuses on web data collection and datasets. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        Bright Data highlights dataset products and web data collection. {sourceLink("https://brightdata.com/products/datasets", "[1]")}
      </>,
      <>
        Bright Data documentation covers dataset access and delivery workflows. {sourceLink("https://docs.brightdata.com/datasets", "[2]")}
      </>,
      "Bright Data was originally founded in 2014 as Luminati Networks, a division of the Hola VPN company. In 2017, the company was sold to EMK Capital, a London-based private investment fund, at a valuation of approximately 200 million dollars. The company rebranded to Bright Data in 2021. Headquartered in Netanya, Israel, Bright Data employs approximately 415 people and crossed 300 million dollars in annual revenue in 2025, with plans to reach 400 million dollars by 2026.",
      "Bright Data operates one of the largest proxy networks in the world with over 150 million residential IPs across 195 countries, achieving reported success rates exceeding 99 percent for web data extraction. The company supports over 20,000 enterprises across AI, e-commerce, finance, and market research verticals. Their dataset marketplace and scraper APIs make it straightforward to source structured web data at scale.",
      "For physical AI and robotics teams, the fundamental distinction is that Bright Data's entire infrastructure is built around extracting data from the web. Web-sourced data, no matter how well structured, is categorically different from physical-world data captured through wearable cameras and sensors. Robotics training requires egocentric video, depth maps, 3D pose data, object segmentation, and motion signals that cannot be sourced from web scraping. If your AI models operate in the physical world, you need a provider like Claru that captures and enriches real-world data rather than extracting data from web pages.",
      "If your bottleneck is sourcing web data at scale, Bright Data is a strong fit. If your bottleneck is physical-world capture and enrichment for robotics, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Bright Data at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                Web data collection and datasets. {sourceLink("https://brightdata.com/products/datasets", "[1]")}
              </>
            ),
          },
          {
            label: "Delivery",
            value: (
              <>
                Dataset access and delivery workflows. {sourceLink("https://docs.brightdata.com/datasets", "[2]")}
              </>
            ),
          },
          {
            label: "Core output",
            value: "Web-sourced datasets and data feeds",
          },
          {
            label: "Best fit",
            value: "Teams sourcing web data at scale",
          },
        ],
      },
      {
        title: "Claru at a Glance",
        items: [
          {
            label: "Focus",
            value: "Physical AI training data for robotics and world models",
          },
          {
            label: "Capture",
            value: "Wearable camera network plus task-specific collection",
          },
          {
            label: "Enrichment",
            value: "Depth, pose, segmentation, optical flow, aligned captions",
          },
          {
            label: "Best fit",
            value: "Teams that need capture + enrichment for embodied AI",
          },
        ],
      },
    ],
  },
  keyClaims: {
    title: "Key Claims (With Sources)",
    claims: [
      <>
        Bright Data offers dataset products and web data collection. {sourceLink("https://brightdata.com/products/datasets", "[1]")}
      </>,
      <>
        Bright Data provides dataset access and delivery workflows. {sourceLink("https://docs.brightdata.com/datasets", "[2]")}
      </>,
      <>
        Bright Data positions itself as a web data provider. {sourceLink("https://brightdata.com/products/datasets", "[3]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Bright Data Is Strong",
    intro:
      "Based on Bright Data's public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "Web data collection",
        description: (
          <>
            Bright Data focuses on web data collection and datasets. {sourceLink("https://brightdata.com/products/datasets", "[1]")}
          </>
        ),
      },
      {
        title: "Dataset delivery",
        description: (
          <>
            Documentation covers dataset access and delivery workflows. {sourceLink("https://docs.brightdata.com/datasets", "[2]")}
          </>
        ),
      },
      {
        title: "Data feeds",
        description: (
          <>
            Bright Data highlights dataset products and data feeds. {sourceLink("https://brightdata.com/products/datasets", "[3]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "Bright Data is a web data provider. Claru is a capture-and-enrichment pipeline for physical AI.",
    cards: [
      {
        title: "Physical capture",
        description:
          "Claru captures physical-world data instead of sourcing web data.",
      },
      {
        title: "Enrichment layers",
        description:
          "Depth, pose, and motion signals are generated as first-class outputs.",
      },
      {
        title: "Robotics-ready delivery",
        description:
          "Claru ships datasets in formats that plug directly into robotics stacks.",
      },
    ],
  },
  comparison: {
    title: "Bright Data vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing Bright Data's web data strengths.",
    columns: [
      { key: "brightdata", label: "Bright Data" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          brightdata: (
            <>
              Web data collection and datasets. {sourceLink("https://brightdata.com/products/datasets", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Data sourcing",
        values: {
          brightdata: "Web-sourced datasets and feeds",
          claru: "Capture + enrichment + expert annotation",
        },
      },
      {
        dimension: "Data capture",
        values: {
          brightdata: "Web data extraction",
          claru: "Collector network plus task-specific capture",
        },
      },
      {
        dimension: "Enrichment",
        values: {
          brightdata: "Dataset delivery and formatting",
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Best fit",
        values: {
          brightdata: "Teams needing web data at scale",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Bright Data vs Claru",
    intro:
      "Bright Data focuses on web data; Claru specializes in physical AI capture and enrichment.",
    blocks: [
      {
        title: "Web data vs physical data",
        paragraphs: [
          "Bright Data provides web-sourced datasets and data feeds.",
          "Claru captures real-world physical data for robotics training.",
        ],
      },
      {
        title: "Data pipelines",
        paragraphs: [
          "Bright Data emphasizes data extraction, access, and delivery.",
          "Claru emphasizes capture, enrichment, and robotics-ready formats.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "Bright Data is a strong fit for teams needing web data at scale.",
          "Claru is better when you need physical-world capture and enrichment.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Bright Data Is a Fit",
    competitorBullets: [
      "You need web data collection or web datasets.",
      "You want data feeds and extraction workflows.",
      "You do not need physical-world capture.",
    ],
    claruTitle: "When Claru Is a Fit",
    claruBullets: [
      "You need physical-world data captured for robotics tasks.",
      "You want enrichment layers like depth, pose, and motion signals.",
      "You need datasets delivered in robotics-native formats.",
    ],
  },
  pipeline: {
    title: "How Claru Delivers Physical AI Data",
    intro:
      "Claru provides an end-to-end pipeline so physical AI teams can move from brief to training-ready data quickly.",
    steps: claruPipelineSteps,
  },
  proof: {
    title: "Claru by the Numbers",
    stats: claruProofStats,
  },
  related: {
    title: "Other Alternatives Worth Considering",
    intro:
      "If you are mapping the data provider landscape, these comparisons cover adjacent options.",
    links: [
      {
        title: "Appen Alternatives",
        desc: "Global data services vs capture-first robotics datasets.",
        href: "/compare/appen-alternatives",
      },
      {
        title: "Scale AI Alternatives",
        desc: "Enterprise annotation vs physical AI pipelines.",
        href: "/compare/scale-ai-alternatives",
      },
      {
        title: "Labelbox Alternatives",
        desc: "Annotation platform vs physical AI specialization.",
        href: "/compare/labelbox-alternatives",
      },
      {
        title: "Claru vs Luel",
        desc: "Marketplace data vs training-ready physical AI datasets.",
        href: "/compare/claru-vs-luel",
      },
    ],
  },
  decision: {
    title: "How to Choose",
    paragraphs: [
      "Choose Bright Data when you need web data collection or datasets at scale.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: Bright Data for web data, Claru for physical data capture.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Bright Data?",
        answer: (
          <>
            Bright Data (formerly Luminati Networks) is a global web data collection and proxy company founded in 2014 and headquartered in Netanya, Israel. The company operates one of the world's largest proxy networks with over 150 million residential IPs across 195 countries. Acquired by EMK Capital in 2017, Bright Data crossed 300 million dollars in annual revenue in 2025 and supports over 20,000 enterprises across AI, e-commerce, finance, and market research.{" "}
            {sourceLink("https://brightdata.com/products/datasets", "[1]")}
          </>
        ),
      },
      {
        question: "Does Bright Data provide dataset delivery workflows?",
        answer: (
          <>
            Yes. Bright Data provides dataset access and delivery workflows through their platform, including a dataset marketplace, scraper APIs, and structured data feeds. Their infrastructure is designed for extracting and structuring data from web sources at enterprise scale. However, these delivery workflows are for web-sourced data and do not cover physical-world sensor data, video capture, or the enrichment layers that robotics teams require.{" "}
            {sourceLink("https://docs.brightdata.com/datasets", "[2]")}
          </>
        ),
      },
      {
        question: "Is Bright Data a physical AI data provider?",
        answer:
          "No. Bright Data's entire infrastructure is built around extracting data from the web using proxy networks and scraper APIs. Web-sourced data is categorically different from physical-world data captured through wearable cameras and sensors. Robotics training requires egocentric video, depth maps, 3D pose data, object segmentation, and motion signals that cannot be sourced from web scraping, regardless of how sophisticated the extraction pipeline is.",
      },
      {
        question: "How large is Bright Data?",
        answer:
          "Bright Data is a substantial company with approximately 415 employees, over 300 million dollars in annual revenue as of 2025, and more than 20,000 enterprise customers. The company operates over 150 million residential proxy IPs across 195 countries. They are privately owned by EMK Capital, a London-based private equity firm that acquired the company in 2017 at a valuation of approximately 200 million dollars.",
      },
      {
        question: "When is Claru a better fit?",
        answer:
          "Claru is a better fit whenever your AI models operate in the physical world rather than on web data. If you are training robotics policies, navigation models, manipulation systems, or world models that need egocentric video, depth maps, 3D pose, segmentation, and optical flow as training inputs, Claru provides the specialized capture and enrichment pipeline for those needs. Choose Bright Data when you need web-sourced datasets for text, pricing, or digital content analysis.",
      },
    ],
  },
  cta: {
    title: "Need Physical AI Data That Ships Fast?",
    description:
      "Tell us what you are training. We will scope a capture plan and deliver a pilot dataset in days.",
    primary: { label: "Book a call", href: "/contact" },
    secondary: { label: "Explore data catalog", href: "/data-catalog" },
  },
  sources: [
    { label: "Bright Data Datasets", url: "https://brightdata.com/products/datasets" },
    { label: "Bright Data Docs - Datasets", url: "https://docs.brightdata.com/datasets" },
  ],
};
