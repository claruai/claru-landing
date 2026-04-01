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

export const digitalBricksComparison: ComparisonData = {
  slug: "digital-bricks-alternatives",
  competitor: {
    name: "Digital Bricks",
    siteUrl: "https://www.digitalbricks.ai",
    category: "Data labeling and annotation services",
  },
  meta: {
    title: "Digital Bricks Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Digital Bricks and Claru for physical AI training data. Digital Bricks provides data labeling and annotation services across modalities. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Digital Bricks alternative",
      "Digital Bricks alternatives",
      "Digital Bricks vs Claru",
      "data labeling services",
      "data annotation services",
      "physical AI training data",
      "robotics data capture",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Digital Bricks Alternatives",
    title: "Digital Bricks Alternatives: Labeling Services vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://www.digitalbricks.ai/build-innovate/data-labeling-annotation"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Digital Bricks
        </a>{" "}
        provides data labeling and annotation services across modalities. If
        you need physical-world capture and enrichment for robotics, Claru is
        built for physical AI from day one.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Digital Bricks provides data labeling and annotation services.",
      "Services cover image, video, text, audio, and tabular data.",
      "They highlight multiple annotation types and managed QA workflows.",
      "Claru is purpose-built for physical AI capture and multi-layer enrichment.",
      "Choose Digital Bricks for labeling services; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What Digital Bricks Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Digital Bricks provides managed labeling services. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        Digital Bricks positions its offering as data labeling and annotation
        services for AI teams. {sourceLink("https://www.digitalbricks.ai/build-innovate/data-labeling-annotation", "[1]")}
      </>,
      <>
        The company lists support for image, video, text, audio, and tabular
        data labeling. {sourceLink("https://www.digitalbricks.ai/build-innovate/data-labeling-annotation", "[2]")}
      </>,
      <>
        Digital Bricks highlights multiple annotation types and managed QA
        workflows. {sourceLink("https://www.digitalbricks.ai/build-innovate/data-labeling-annotation", "[3]")}
      </>,
      "If your bottleneck is annotation services and QA, Digital Bricks is a strong fit. If your bottleneck is physical-world capture and enrichment, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Digital Bricks at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                Data labeling and annotation services.
                {sourceLink("https://www.digitalbricks.ai/build-innovate/data-labeling-annotation", "[1]")}
              </>
            ),
          },
          {
            label: "Modalities",
            value: (
              <>
                Image, video, text, audio, and tabular data labeling.
                {sourceLink("https://www.digitalbricks.ai/build-innovate/data-labeling-annotation", "[2]")}
              </>
            ),
          },
          {
            label: "Capabilities",
            value: (
              <>
                Multiple annotation types and QA workflows.
                {sourceLink("https://www.digitalbricks.ai/build-innovate/data-labeling-annotation", "[3]")}
              </>
            ),
          },
          {
            label: "Best fit",
            value: "Teams needing managed annotation services",
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
        Digital Bricks provides data labeling and annotation services.
        {sourceLink("https://www.digitalbricks.ai/build-innovate/data-labeling-annotation", "[1]")}
      </>,
      <>
        The services cover image, video, text, audio, and tabular data.
        {sourceLink("https://www.digitalbricks.ai/build-innovate/data-labeling-annotation", "[2]")}
      </>,
      <>
        Digital Bricks highlights multiple annotation types and QA workflows.
        {sourceLink("https://www.digitalbricks.ai/build-innovate/data-labeling-annotation", "[3]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Digital Bricks Is Strong",
    intro:
      "Based on Digital Bricks' public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "Managed labeling services",
        description: (
          <>
            Digital Bricks focuses on delivering annotation services.
            {sourceLink("https://www.digitalbricks.ai/build-innovate/data-labeling-annotation", "[1]")}
          </>
        ),
      },
      {
        title: "Multi-modal coverage",
        description: (
          <>
            Services span image, video, text, audio, and tabular data.
            {sourceLink("https://www.digitalbricks.ai/build-innovate/data-labeling-annotation", "[2]")}
          </>
        ),
      },
      {
        title: "Annotation breadth",
        description: (
          <>
            Digital Bricks highlights multiple annotation types and QA.
            {sourceLink("https://www.digitalbricks.ai/build-innovate/data-labeling-annotation", "[3]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "Digital Bricks provides labeling services. Claru is a capture-and-enrichment pipeline for physical AI.",
    cards: [
      {
        title: "Capture-first",
        description:
          "Claru starts by capturing physical-world data instead of relying on existing datasets.",
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
    title: "Digital Bricks vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing Digital Bricks' services model.",
    columns: [
      { key: "digitalbricks", label: "Digital Bricks" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          digitalbricks: (
            <>
              Data labeling and annotation services.
              {sourceLink("https://www.digitalbricks.ai/build-innovate/data-labeling-annotation", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Modalities",
        values: {
          digitalbricks: (
            <>
              Image, video, text, audio, and tabular data.
              {sourceLink("https://www.digitalbricks.ai/build-innovate/data-labeling-annotation", "[2]")}
            </>
          ),
          claru: "Egocentric video, manipulation, depth, pose, segmentation",
        },
      },
      {
        dimension: "Capture model",
        values: {
          digitalbricks: "Managed labeling services",
          claru: "Collector network plus task-specific capture",
        },
      },
      {
        dimension: "Enrichment",
        values: {
          digitalbricks: "Annotation workflows and QA",
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Best fit",
        values: {
          digitalbricks: "Teams needing managed annotation services",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Digital Bricks vs Claru",
    intro:
      "Digital Bricks specializes in annotation services. Claru specializes in physical-world capture and enrichment.",
    blocks: [
      {
        title: "Services vs pipeline",
        paragraphs: [
          "Digital Bricks delivers managed data labeling services.",
          "Claru delivers capture, enrichment, and training-ready datasets.",
        ],
      },
      {
        title: "Data sourcing",
        paragraphs: [
          "Digital Bricks helps label existing data across modalities.",
          "Claru captures new physical-world data tailored to robotics tasks.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "Digital Bricks is strong when you need labeling capacity and QA.",
          "Claru is stronger when capture and enrichment are the bottleneck.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Digital Bricks Is a Fit",
    competitorBullets: [
      "You need managed labeling services across multiple data types.",
      "You already have data and need annotation throughput.",
      "You want QA workflows for labeled data.",
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
      "Choose Digital Bricks when you need managed data labeling services and QA.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: Digital Bricks for labeling services, Claru for capture-first datasets.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Digital Bricks?",
        answer: (
          <>
            Digital Bricks provides data labeling and annotation services.
            {sourceLink("https://www.digitalbricks.ai/build-innovate/data-labeling-annotation", "[1]")}
          </>
        ),
      },
      {
        question: "What data types does Digital Bricks support?",
        answer: (
          <>
            The company lists image, video, text, audio, and tabular data
            labeling. {sourceLink("https://www.digitalbricks.ai/build-innovate/data-labeling-annotation", "[2]")}
          </>
        ),
      },
      {
        question: "Does Digital Bricks cover multiple annotation types?",
        answer: (
          <>
            Digital Bricks highlights multiple annotation types and QA
            workflows. {sourceLink("https://www.digitalbricks.ai/build-innovate/data-labeling-annotation", "[3]")}
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
    {
      label: "Digital Bricks Data Labeling",
      url: "https://www.digitalbricks.ai/build-innovate/data-labeling-annotation",
    },
  ],
};
