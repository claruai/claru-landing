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

export const basicAiComparison: ComparisonData = {
  slug: "basicai-alternatives",
  competitor: {
    name: "BasicAI",
    siteUrl: "https://www.basic.ai",
    category: "Data annotation platform and services",
  },
  meta: {
    title: "BasicAI Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare BasicAI and Claru for physical AI training data. BasicAI offers data annotation services and an all-in-one labeling platform. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "BasicAI alternative",
      "BasicAI alternatives",
      "BasicAI vs Claru",
      "data annotation services",
      "data labeling platform",
      "physical AI training data",
      "robotics data labeling",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "BasicAI Alternatives",
    title: "BasicAI Alternatives: Labeling Platform vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://www.basic.ai"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          BasicAI
        </a>{" "}
        provides data annotation services and an all-in-one labeling platform.
        If you need physical-world capture and enrichment for robotics, Claru is
        built for physical AI from day one.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "BasicAI offers data annotation services plus a smart data annotation platform.",
      "Its services cover image/video, LiDAR fusion, and LLM/Gen AI labeling.",
      "The platform emphasizes AI-assisted tooling and scalable workflows.",
      "Claru is purpose-built for physical AI capture and multi-layer enrichment.",
      "Choose BasicAI for labeling services; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What BasicAI Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: BasicAI provides data annotation services and a labeling platform. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        BasicAI highlights AI training data solutions and managed annotation
        services across multiple data types. {sourceLink("https://www.basic.ai/", "[1]")}
      </>,
      <>
        The services include image and video annotation, LiDAR fusion
        annotation, and LLM/Gen AI labeling. {sourceLink("https://www.basic.ai/", "[2]")}
      </>,
      <>
        BasicAI also promotes an all-in-one smart data annotation platform with
        an AI-powered toolset and scalable workflows. {sourceLink("https://www.basic.ai/", "[3]")}
      </>,
      "If your bottleneck is annotation tooling and managed labeling services, BasicAI is a strong fit. If your bottleneck is physical-world capture and enrichment, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "BasicAI at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                Data annotation services and a labeling platform. {sourceLink("https://www.basic.ai/", "[1]")}
              </>
            ),
          },
          {
            label: "Services",
            value: (
              <>
                Image/video, LiDAR fusion, and LLM/Gen AI labeling. {sourceLink("https://www.basic.ai/", "[2]")}
              </>
            ),
          },
          {
            label: "Platform",
            value: (
              <>
                All-in-one smart data annotation platform with AI-assisted tools.
                {sourceLink("https://www.basic.ai/", "[3]")}
              </>
            ),
          },
          {
            label: "Best fit",
            value: "Teams seeking managed labeling services and platform tooling",
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
        BasicAI provides data annotation services and a labeling platform.
        {sourceLink("https://www.basic.ai/", "[1]")}
      </>,
      <>
        The services include image/video, LiDAR fusion, and LLM/Gen AI labeling.
        {sourceLink("https://www.basic.ai/", "[2]")}
      </>,
      <>
        BasicAI promotes an AI-powered annotation toolset and scalable workflows.
        {sourceLink("https://www.basic.ai/", "[3]")}
      </>,
    ],
  },
  strengths: {
    title: "Where BasicAI Is Strong",
    intro:
      "Based on BasicAI's public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "Managed annotation services",
        description: (
          <>
            BasicAI highlights professional data annotation services for AI
            training data. {sourceLink("https://www.basic.ai/", "[1]")}
          </>
        ),
      },
      {
        title: "Multi-modal coverage",
        description: (
          <>
            Services span image/video, LiDAR fusion, and LLM/Gen AI labeling.
            {sourceLink("https://www.basic.ai/", "[2]")}
          </>
        ),
      },
      {
        title: "Annotation platform tooling",
        description: (
          <>
            BasicAI positions its platform as an all-in-one smart annotation
            toolset with scalable workflows. {sourceLink("https://www.basic.ai/", "[3]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "BasicAI is a labeling services + platform provider. Claru is a capture-and-enrichment pipeline for physical AI.",
    cards: [
      {
        title: "Capture-first",
        description:
          "Claru starts by capturing physical-world data instead of relying on existing datasets.",
      },
      {
        title: "Enrichment layers",
        description:
          "Depth, pose, and motion signals are generated as first-class outputs, not add-ons.",
      },
      {
        title: "Robotics-ready delivery",
        description:
          "Claru ships datasets in formats that plug directly into robotics stacks.",
      },
    ],
  },
  comparison: {
    title: "BasicAI vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing BasicAI's labeling services and platform model.",
    columns: [
      { key: "basicai", label: "BasicAI" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          basicai: (
            <>
              Data annotation services and platform tooling.
              {sourceLink("https://www.basic.ai/", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Data types",
        values: {
          basicai: (
            <>
              Image/video, LiDAR fusion, LLM/Gen AI labeling.
              {sourceLink("https://www.basic.ai/", "[2]")}
            </>
          ),
          claru: "Egocentric video, manipulation, depth, pose, segmentation",
        },
      },
      {
        dimension: "Capture model",
        values: {
          basicai: "Managed labeling services and annotation platform",
          claru: "Collector network plus task-specific capture",
        },
      },
      {
        dimension: "Enrichment",
        values: {
          basicai: "Annotation toolset and QA workflows",
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Best fit",
        values: {
          basicai: "Teams needing labeling services and annotation tooling",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: BasicAI vs Claru",
    intro:
      "BasicAI focuses on annotation services and platform tooling. Claru focuses on capture and enrichment for physical AI training data.",
    blocks: [
      {
        title: "Services vs pipeline",
        paragraphs: [
          "BasicAI delivers managed labeling services and an annotation platform.",
          "Claru delivers capture, enrichment, and training-ready datasets.",
        ],
      },
      {
        title: "Data sourcing",
        paragraphs: [
          "BasicAI helps label customer-provided data across multiple modalities.",
          "Claru captures new physical-world data tailored to robotics tasks.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "BasicAI is a strong fit for teams scaling annotation throughput.",
          "Claru is better when capture and enrichment are the bottleneck.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When BasicAI Is a Fit",
    competitorBullets: [
      "You need managed annotation services across multiple data types.",
      "You want an all-in-one labeling platform with AI-assisted tools.",
      "You already have data and need labeling throughput and QA.",
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
        title: "Labelbox Alternatives",
        desc: "Annotation platform vs physical AI specialization.",
        href: "/compare/labelbox-alternatives",
      },
      {
        title: "Scale AI Alternatives",
        desc: "Enterprise annotation vs physical AI pipelines.",
        href: "/compare/scale-ai-alternatives",
      },
      {
        title: "Appen Alternatives",
        desc: "Global data services vs capture-first robotics datasets.",
        href: "/compare/appen-alternatives",
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
      "Choose BasicAI when you need managed labeling services or an annotation platform for existing data.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: BasicAI for labeling, Claru for capture-first datasets.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is BasicAI?",
        answer: (
          <>
            BasicAI provides data annotation services and a labeling platform.
            {sourceLink("https://www.basic.ai/", "[1]")}
          </>
        ),
      },
      {
        question: "What data types does BasicAI support?",
        answer: (
          <>
            BasicAI highlights services for image/video, LiDAR fusion, and LLM/Gen
            AI labeling. {sourceLink("https://www.basic.ai/", "[2]")}
          </>
        ),
      },
      {
        question: "Does BasicAI offer a labeling platform?",
        answer: (
          <>
            BasicAI promotes an all-in-one smart data annotation platform with
            AI-powered tools. {sourceLink("https://www.basic.ai/", "[3]")}
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
    { label: "BasicAI", url: "https://www.basic.ai/" },
    { label: "BasicAI Docs", url: "https://docs.basic.ai/" },
  ],
};
