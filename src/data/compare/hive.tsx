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

export const hiveComparison: ComparisonData = {
  slug: "hive-alternatives",
  competitor: {
    name: "Hive",
    siteUrl: "https://thehive.ai",
    category: "Managed data labeling and collection",
  },
  meta: {
    title: "Hive Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Hive and Claru for physical AI training data. Hive provides fully managed data collection and annotation services with a global workforce. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Hive alternative",
      "Hive alternatives",
      "Hive vs Claru",
      "data labeling services",
      "data collection services",
      "physical AI training data",
      "robotics data capture",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Hive Alternatives",
    title: "Hive Alternatives: Data Services vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://thehive.ai/data-labeling"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Hive
        </a>{" "}
        provides fully managed data collection and annotation services with a
        global workforce. If you need physical-world capture and enrichment for
        robotics, Claru is built for physical AI from day one.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Hive offers fully managed data collection and annotation services.",
      "Hive highlights a global workforce of over 5 million contributors.",
      "The company reports labeling over 10 million items daily across modalities.",
      "Claru is purpose-built for physical AI capture and multi-layer enrichment.",
      "Choose Hive for managed data services; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What Hive Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Hive provides managed data collection and annotation services. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        Hive offers fully managed data collection and annotation services.
        {sourceLink("https://thehive.ai/data-labeling", "[1]")}
      </>,
      <>
        The company highlights a global workforce of over 5 million
        contributors. {sourceLink("https://thehive.ai/data-labeling", "[2]")}
      </>,
      <>
        Hive reports labeling over 10 million items daily across video, image,
        text, and audio. {sourceLink("https://thehive.ai/data-labeling", "[3]")}
      </>,
      "If your bottleneck is managed labeling capacity, Hive is a strong fit. If your bottleneck is physical-world capture and enrichment, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Hive at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                Managed data collection and annotation services.
                {sourceLink("https://thehive.ai/data-labeling", "[1]")}
              </>
            ),
          },
          {
            label: "Workforce",
            value: (
              <>
                Global network of 5M+ contributors.
                {sourceLink("https://thehive.ai/data-labeling", "[2]")}
              </>
            ),
          },
          {
            label: "Throughput",
            value: (
              <>
                10M+ items labeled daily across modalities.
                {sourceLink("https://thehive.ai/data-labeling", "[3]")}
              </>
            ),
          },
          {
            label: "Best fit",
            value: "Teams needing large-scale managed labeling",
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
        Hive provides fully managed data collection and annotation services.
        {sourceLink("https://thehive.ai/data-labeling", "[1]")}
      </>,
      <>
        Hive highlights a global workforce of 5M+ contributors.
        {sourceLink("https://thehive.ai/data-labeling", "[2]")}
      </>,
      <>
        Hive reports labeling over 10M items daily across multiple modalities.
        {sourceLink("https://thehive.ai/data-labeling", "[3]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Hive Is Strong",
    intro:
      "Based on Hive's public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "Managed services",
        description: (
          <>
            Hive offers managed data collection and annotation services.
            {sourceLink("https://thehive.ai/data-labeling", "[1]")}
          </>
        ),
      },
      {
        title: "Large workforce",
        description: (
          <>
            The company highlights a global network of over 5 million
            contributors. {sourceLink("https://thehive.ai/data-labeling", "[2]")}
          </>
        ),
      },
      {
        title: "High throughput",
        description: (
          <>
            Hive reports labeling 10M+ items daily across modalities.
            {sourceLink("https://thehive.ai/data-labeling", "[3]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "Hive provides managed labeling services. Claru is a capture-and-enrichment pipeline for physical AI.",
    cards: [
      {
        title: "Capture-first",
        description:
          "Claru starts by capturing physical-world data instead of relying only on labeling services.",
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
    title: "Hive vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing Hive's managed services model.",
    columns: [
      { key: "hive", label: "Hive" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          hive: (
            <>
              Managed data collection and annotation services.
              {sourceLink("https://thehive.ai/data-labeling", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Scale",
        values: {
          hive: (
            <>
              5M+ workforce and 10M+ items labeled daily.
              {sourceLink("https://thehive.ai/data-labeling", "[2]")}
            </>
          ),
          claru: "Collector network plus task-specific capture",
        },
      },
      {
        dimension: "Data types",
        values: {
          hive: "Video, image, text, and audio labeling",
          claru: "Egocentric video, manipulation, depth, pose, segmentation",
        },
      },
      {
        dimension: "Enrichment",
        values: {
          hive: "Annotation workflows and QA",
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Best fit",
        values: {
          hive: "Teams needing high-throughput labeling",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Hive vs Claru",
    intro:
      "Hive specializes in managed data services. Claru specializes in physical-world capture and enrichment.",
    blocks: [
      {
        title: "Managed services vs pipeline",
        paragraphs: [
          "Hive delivers large-scale labeling and data collection services.",
          "Claru delivers capture, enrichment, and training-ready datasets.",
        ],
      },
      {
        title: "Data sourcing",
        paragraphs: [
          "Hive relies on a large global workforce for data labeling.",
          "Claru captures new physical-world data tailored to robotics tasks.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "Hive is strong when you need massive labeling throughput.",
          "Claru is stronger when physical-world capture is the bottleneck.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Hive Is a Fit",
    competitorBullets: [
      "You need large-scale managed data labeling services.",
      "You already have data and need annotation throughput.",
      "You want a global workforce for QA and scale.",
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
      "Choose Hive when you need large-scale managed data collection and labeling services.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: Hive for labeling scale, Claru for capture-first datasets.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Hive?",
        answer: (
          <>
            Hive provides fully managed data collection and annotation services.
            {sourceLink("https://thehive.ai/data-labeling", "[1]")}
          </>
        ),
      },
      {
        question: "How large is Hive's workforce?",
        answer: (
          <>
            Hive highlights a global workforce of over 5 million contributors.
            {sourceLink("https://thehive.ai/data-labeling", "[2]")}
          </>
        ),
      },
      {
        question: "How much data does Hive label daily?",
        answer: (
          <>
            Hive reports labeling over 10 million items daily across modalities.
            {sourceLink("https://thehive.ai/data-labeling", "[3]")}
          </>
        ),
      },
      {
        question: "When is Claru a better fit?",
        answer:
          "Claru is a better fit when you need capture, enrichment, and delivery of robotics-ready datasets.",
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
    { label: "Hive Data Labeling", url: "https://thehive.ai/data-labeling" },
  ],
};
