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

export const abakaComparison: ComparisonData = {
  slug: "abaka-ai-alternatives",
  competitor: {
    name: "Abaka AI",
    siteUrl: "https://www.abaka.ai",
    category: "Data collection, annotation, and workflow platform",
  },
  meta: {
    title: "Abaka AI Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Abaka AI and Claru for physical AI training data. Abaka AI provides data collection and annotation services with the Abaka Forge platform. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Abaka AI alternative",
      "Abaka AI alternatives",
      "Abaka AI vs Claru",
      "data collection services",
      "data annotation platform",
      "physical AI training data",
      "robotics data labeling",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Abaka AI Alternatives",
    title: "Abaka AI Alternatives: Data Platforms vs Physical AI Capture",
    subtitle: (
      <>
        <a
          href="https://www.abaka.ai"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Abaka AI
        </a>{" "}
        provides data collection and annotation services with its Abaka Forge
        platform. If you need physical-world capture and enrichment for
        robotics, Claru is built for physical AI from day one.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Abaka AI provides data collection and annotation services for AI teams.",
      "Abaka AI promotes Abaka Forge as an end-to-end data workflow platform.",
      "Claru is purpose-built for physical AI data capture and enrichment.",
      "Choose Abaka AI when you need data collection + annotation workflows.",
      "Choose Claru when you need robotics-ready datasets captured from the physical world.",
    ],
  },
  overview: {
    title: "What Abaka AI Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Abaka AI is a data services provider with a platform for collection and annotation. Claru is a physical AI pipeline focused on capture and enrichment for robotics.",
      <>
        Abaka AI highlights data collection and data annotation services on its
        site. {sourceLink("https://www.abaka.ai/", "[1]")}
      </>,
      <>
        The company also promotes the Abaka Forge platform for managing data
        workflows. {sourceLink("https://www.abaka.ai/", "[2]")}
      </>,
      "If your bottleneck is data collection or labeling workflows, Abaka AI is a strong fit. If your bottleneck is physical-world capture and robotics enrichment, you need a specialized pipeline.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Abaka AI at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                Data collection and data annotation services. {" "}
                {sourceLink("https://www.abaka.ai/", "[1]")}
              </>
            ),
          },
          {
            label: "Platform",
            value: (
              <>
                Abaka Forge data workflow platform. {" "}
                {sourceLink("https://www.abaka.ai/", "[2]")}
              </>
            ),
          },
          {
            label: "Core output",
            value: "Labeled datasets and managed data workflows",
          },
          {
            label: "Best fit",
            value: "Teams needing data collection + annotation workflows",
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
            value: "Robotics teams that need capture + enrichment",
          },
        ],
      },
    ],
  },
  keyClaims: {
    title: "Key Claims (With Sources)",
    claims: [
      <>
        Abaka AI lists data collection and data annotation services. {" "}
        {sourceLink("https://www.abaka.ai/", "[1]")}
      </>,
      <>
        Abaka AI promotes Abaka Forge as a platform for data workflows. {" "}
        {sourceLink("https://www.abaka.ai/", "[2]")}
      </>,
      <>
        Abaka AI highlights multiple data types including image, text, video,
        audio, and point cloud. {sourceLink("https://www.abaka.ai/", "[3]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Abaka AI Is Strong",
    intro:
      "Based on Abaka AI’s public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "Collection + annotation services",
        description: (
          <>
            Abaka AI lists both data collection and data annotation services. {" "}
            {sourceLink("https://www.abaka.ai/", "[1]")}
          </>
        ),
      },
      {
        title: "Workflow platform",
        description: (
          <>
            Abaka Forge is positioned as a data workflow platform. {" "}
            {sourceLink("https://www.abaka.ai/", "[2]")}
          </>
        ),
      },
      {
        title: "Multi-modal coverage",
        description: (
          <>
            The site highlights multiple data types including image, text,
            video, audio, and point cloud. {" "}
            {sourceLink("https://www.abaka.ai/", "[3]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Why Physical AI Teams Evaluate Alternatives",
    intro:
      "Robotics teams often need capture and enrichment of physical-world data — not just data workflows.",
    cards: [
      {
        title: "Capture-first pipelines",
        description:
          "Physical AI models require real-world data collection with task-specific capture programs.",
      },
      {
        title: "Enrichment layers",
        description:
          "Depth, pose, segmentation, and motion signals are critical for robotics training.",
      },
      {
        title: "Training-ready delivery",
        description:
          "Claru ships datasets in formats that plug directly into robotics stacks.",
      },
    ],
  },
  comparison: {
    title: "Abaka AI vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing Abaka AI’s data services model.",
    columns: [
      { key: "abaka", label: "Abaka AI" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          abaka: (
            <>
              Data collection and data annotation services. {" "}
              {sourceLink("https://www.abaka.ai/", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Platform",
        values: {
          abaka: (
            <>
              Abaka Forge data workflow platform. {" "}
              {sourceLink("https://www.abaka.ai/", "[2]")}
            </>
          ),
          claru: "End-to-end pipeline from capture to enrichment",
        },
      },
      {
        dimension: "Modalities",
        values: {
          abaka: (
            <>
              Image, text, video, audio, and point cloud. {" "}
              {sourceLink("https://www.abaka.ai/", "[3]")}
            </>
          ),
          claru: "Egocentric video, manipulation, depth, pose, and segmentation",
        },
      },
      {
        dimension: "Data capture",
        values: {
          abaka: "Collection programs and annotation workflows",
          claru: "Collector network plus teleoperation and task-specific capture",
        },
      },
      {
        dimension: "Best fit",
        values: {
          abaka: "Teams needing data collection and labeling workflows",
          claru: "Robotics teams needing capture + enrichment",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Abaka AI vs Claru",
    intro:
      "Abaka AI is a data workflow and services provider. Claru is a physical AI data pipeline.",
    blocks: [
      {
        title: "Workflow platform vs dataset delivery",
        paragraphs: [
          "Abaka AI emphasizes a platform plus services for data collection and annotation.",
          "Claru delivers training-ready datasets enriched for robotics.",
        ],
      },
      {
        title: "Multi-modality vs robotics-specific signals",
        paragraphs: [
          "Abaka AI highlights multi-modal data types across common AI datasets.",
          "Claru adds enrichment layers like depth and pose that are core inputs for robotics models.",
        ],
      },
      {
        title: "Where each provider fits",
        paragraphs: [
          "Abaka AI is a strong fit for teams needing managed data workflows.",
          "Claru is a better fit when you need capture and enrichment of physical-world data.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Abaka AI Is a Fit",
    competitorBullets: [
      "You need data collection and annotation services.",
      "You want a platform to manage data workflows.",
      "You already have data and need labeling support.",
    ],
    claruTitle: "When Claru Is a Fit",
    claruBullets: [
      "You need new physical-world data captured for robotics tasks.",
      "Your model depends on enrichment layers like depth and motion.",
      "You want datasets delivered in robotics-native formats.",
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
        desc: "Global data services vs physical AI specialization.",
        href: "/compare/appen-alternatives",
      },
      {
        title: "Scale AI Alternatives",
        desc: "Enterprise annotation vs physical AI pipelines.",
        href: "/compare/scale-ai-alternatives",
      },
      {
        title: "Surge AI Alternatives",
        desc: "Expert RLHF vs physical AI capture.",
        href: "/compare/surge-ai-alternatives",
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
      "If you need data collection, annotation, or workflow tooling, Abaka AI is designed for that scope.",
      "If you need capture and enrichment of physical-world data for robotics training, Claru is the better fit.",
      "Some teams use both: Abaka AI for data workflows, Claru for physical datasets.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Abaka AI?",
        answer: (
          <>
            Abaka AI provides data collection and annotation services and
            promotes the Abaka Forge platform. {" "}
            {sourceLink("https://www.abaka.ai/", "[1]")}
          </>
        ),
      },
      {
        question: "What is Abaka Forge?",
        answer: (
          <>
            Abaka Forge is presented as a data workflow platform. {" "}
            {sourceLink("https://www.abaka.ai/", "[2]")}
          </>
        ),
      },
      {
        question: "Is Abaka AI a physical AI data provider?",
        answer:
          "Abaka AI focuses on data workflows and annotation rather than capture-first physical-world data for robotics.",
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
    { label: "Abaka AI", url: "https://www.abaka.ai/" },
  ],
};
