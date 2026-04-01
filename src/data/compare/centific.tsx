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

export const centificComparison: ComparisonData = {
  slug: "centific-alternatives",
  competitor: {
    name: "Centific",
    siteUrl: "https://www.centific.com",
    category: "AI data services and annotation platform",
  },
  meta: {
    title: "Centific Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Centific and Claru for physical AI training data. Centific offers AI data services and the Data Canvas annotation platform. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Centific alternative",
      "Centific alternatives",
      "Centific vs Claru",
      "Data Canvas annotation platform",
      "AI data services",
      "physical AI training data",
      "robotics data labeling",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Centific Alternatives",
    title: "Centific Alternatives: Data Canvas vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://www.centific.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Centific
        </a>{" "}
        provides AI data services and the Data Canvas annotation platform. If
        you need physical-world capture and enrichment for robotics, Claru is
        built for physical AI from day one.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Centific offers AI data services and a data annotation platform called Data Canvas.",
      "Data Canvas highlights end-to-end workflows from preprocessing to QA and post-processing.",
      "Centific is a services-plus-platform model rather than a capture-first robotics pipeline.",
      "Claru is purpose-built for physical AI capture and enrichment.",
      "Choose Centific for AI data services and annotation tooling; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What Centific Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Centific provides AI data services and an annotation platform. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        Centific positions Data Canvas as an annotation and data transformation
        platform. {sourceLink("https://www.centific.com/products/data-canvas", "[1]")}
      </>,
      <>
        Data Canvas highlights end-to-end workflows from preprocessing through
        QA and post-processing. {sourceLink("https://www.centific.com/products/data-canvas", "[2]")}
      </>,
      "If your bottleneck is labeling workflows and AI data services, Centific is a strong fit. If your bottleneck is capture and enrichment of physical-world data, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Centific at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                AI data services and annotation platform. {sourceLink("https://www.centific.com/products/data-canvas", "[1]")}
              </>
            ),
          },
          {
            label: "Platform",
            value: (
              <>
                Data Canvas annotation and data transformation workflows. {sourceLink("https://www.centific.com/products/data-canvas", "[2]")}
              </>
            ),
          },
          {
            label: "Core output",
            value: "Labeled datasets and managed AI data services",
          },
          {
            label: "Best fit",
            value: "Teams needing AI data services plus annotation tooling",
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
        Data Canvas is positioned as an annotation and data transformation
        platform. {sourceLink("https://www.centific.com/products/data-canvas", "[1]")}
      </>,
      <>
        Data Canvas highlights end-to-end workflows from preprocessing to QA and
        post-processing. {sourceLink("https://www.centific.com/products/data-canvas", "[2]")}
      </>,
      <>
        Centific presents Data Canvas as part of its AI data services offering. {sourceLink("https://www.centific.com/products/data-canvas", "[3]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Centific Is Strong",
    intro:
      "Based on Centific's public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "Annotation platform",
        description: (
          <>
            Data Canvas is positioned as an annotation and data transformation
            platform. {sourceLink("https://www.centific.com/products/data-canvas", "[1]")}
          </>
        ),
      },
      {
        title: "End-to-end workflows",
        description: (
          <>
            Data Canvas highlights workflows from preprocessing through QA. {sourceLink("https://www.centific.com/products/data-canvas", "[2]")}
          </>
        ),
      },
      {
        title: "AI data services",
        description: (
          <>
            Centific positions the platform as part of its AI data services
            portfolio. {sourceLink("https://www.centific.com/products/data-canvas", "[3]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "Centific offers AI data services and a platform. Claru is a capture-and-enrichment pipeline for physical AI.",
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
    title: "Centific vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing Centific's services-plus-platform model.",
    columns: [
      { key: "centific", label: "Centific" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          centific: (
            <>
              AI data services and annotation platform. {sourceLink("https://www.centific.com/products/data-canvas", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Platform",
        values: {
          centific: (
            <>
              Data Canvas workflows from preprocessing to QA. {sourceLink("https://www.centific.com/products/data-canvas", "[2]")}
            </>
          ),
          claru: "Capture + enrichment + expert annotation",
        },
      },
      {
        dimension: "Data capture",
        values: {
          centific: "Bring-your-own data",
          claru: "Collector network plus task-specific capture",
        },
      },
      {
        dimension: "Enrichment",
        values: {
          centific: "Annotation workflows and QA",
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Best fit",
        values: {
          centific: "Teams needing AI data services + annotation tooling",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Centific vs Claru",
    intro:
      "Centific provides data services and an annotation platform. Claru specializes in physical AI capture and enrichment.",
    blocks: [
      {
        title: "Services vs pipeline",
        paragraphs: [
          "Centific provides data services and tooling through Data Canvas.",
          "Claru delivers capture, enrichment, and training-ready datasets.",
        ],
      },
      {
        title: "Data ownership",
        paragraphs: [
          "Centific assumes you already have data to annotate.",
          "Claru acquires new physical-world data and enriches it for training.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "Centific is a strong fit for teams needing data services plus platform tooling.",
          "Claru is better when capture and enrichment are the bottleneck.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Centific Is a Fit",
    competitorBullets: [
      "You need AI data services and a managed annotation platform.",
      "You already have data and need labeling workflows and QA.",
      "You want platform tooling alongside services delivery.",
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
      "Choose Centific when you need AI data services and annotation platform tooling.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: Centific for labeling services, Claru for physical data capture.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Data Canvas?",
        answer: (
          <>
            Data Canvas is an annotation and data transformation platform from
            Centific. {sourceLink("https://www.centific.com/products/data-canvas", "[1]")}
          </>
        ),
      },
      {
        question: "What workflows does Data Canvas support?",
        answer: (
          <>
            Data Canvas highlights workflows from preprocessing through QA and
            post-processing. {sourceLink("https://www.centific.com/products/data-canvas", "[2]")}
          </>
        ),
      },
      {
        question: "Is Centific a physical AI data provider?",
        answer:
          "Centific focuses on data services and annotation tooling rather than capture-first physical data pipelines.",
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
    { label: "Centific Data Canvas", url: "https://www.centific.com/products/data-canvas" },
    { label: "Centific", url: "https://www.centific.com/" },
  ],
};
