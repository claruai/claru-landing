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

export const micro1Comparison: ComparisonData = {
  slug: "micro1-alternatives",
  competitor: {
    name: "micro1",
    siteUrl: "https://www.micro1.ai",
    category: "Human data platform and robotics data",
  },
  meta: {
    title: "micro1 Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare micro1 and Claru for physical AI training data. micro1 provides an end-to-end human data engine and highlights robotics data collection and annotation. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "micro1 alternative",
      "micro1 alternatives",
      "micro1 vs Claru",
      "human data engine",
      "robotics data",
      "physical AI training data",
      "robotics data capture",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "micro1 Alternatives",
    title: "micro1 Alternatives: Human Data Engine vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://www.micro1.ai/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          micro1
        </a>{" "}
        provides an end-to-end human data engine and robotics data collection.
        If you need physical-world capture and enrichment for robotics, Claru is
        built for physical AI from day one.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "micro1 positions itself as an end-to-end human data engine for frontier AI.",
      "The platform highlights a data engine for collecting and annotating real-world robotics data.",
      "micro1 also highlights high-fidelity real-world robotics data for training humanoids.",
      "Claru is purpose-built for physical AI capture and multi-layer enrichment.",
      "Choose micro1 for human data platforming; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What micro1 Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: micro1 provides a human data engine and robotics data programs. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        micro1 positions itself as an end-to-end human data engine for frontier
        AI. {sourceLink("https://www.micro1.ai/", "[1]")}
      </>,
      <>
        The platform highlights a data engine to collect and annotate real
        world robotics data. {sourceLink("https://www.micro1.ai/", "[2]")}
      </>,
      <>
        micro1 also highlights high-fidelity real-world robotics data for
        training next-generation humanoids. {sourceLink("https://www.micro1.ai/", "[3]")}
      </>,
      "If your bottleneck is human data operations or robotics data at scale, micro1 is a strong fit. If your bottleneck is physical-world capture and enrichment, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "micro1 at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                End-to-end human data engine.
                {sourceLink("https://www.micro1.ai/", "[1]")}
              </>
            ),
          },
          {
            label: "Robotics data",
            value: (
              <>
                Collect and annotate real world robotics data.
                {sourceLink("https://www.micro1.ai/", "[2]")}
              </>
            ),
          },
          {
            label: "Specialization",
            value: (
              <>
                High-fidelity real-world robotics data for humanoids.
                {sourceLink("https://www.micro1.ai/", "[3]")}
              </>
            ),
          },
          {
            label: "Best fit",
            value: "Teams needing human data operations and robotics datasets",
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
        micro1 positions itself as an end-to-end human data engine.
        {sourceLink("https://www.micro1.ai/", "[1]")}
      </>,
      <>
        The platform highlights a data engine to collect and annotate real
        world robotics data. {sourceLink("https://www.micro1.ai/", "[2]")}
      </>,
      <>
        micro1 highlights high-fidelity real-world robotics data for training
        humanoids. {sourceLink("https://www.micro1.ai/", "[3]")}
      </>,
    ],
  },
  strengths: {
    title: "Where micro1 Is Strong",
    intro:
      "Based on micro1's public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "Human data engine",
        description: (
          <>
            micro1 positions itself as an end-to-end human data engine.
            {sourceLink("https://www.micro1.ai/", "[1]")}
          </>
        ),
      },
      {
        title: "Robotics data collection",
        description: (
          <>
            The platform highlights collection and annotation of real-world
            robotics data. {sourceLink("https://www.micro1.ai/", "[2]")}
          </>
        ),
      },
      {
        title: "High-fidelity robotics datasets",
        description: (
          <>
            micro1 highlights high-fidelity robotics data for humanoids.
            {sourceLink("https://www.micro1.ai/", "[3]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "micro1 provides human data platforming. Claru is a capture-and-enrichment pipeline for physical AI.",
    cards: [
      {
        title: "Capture-first",
        description:
          "Claru starts by capturing physical-world data with a dedicated collector network.",
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
    title: "micro1 vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing micro1's human data platform focus.",
    columns: [
      { key: "micro1", label: "micro1" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          micro1: (
            <>
              End-to-end human data engine.
              {sourceLink("https://www.micro1.ai/", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Robotics data",
        values: {
          micro1: (
            <>
              Collect and annotate real world robotics data.
              {sourceLink("https://www.micro1.ai/", "[2]")}
            </>
          ),
          claru: "Capture pipeline plus enrichment and delivery",
        },
      },
      {
        dimension: "Specialization",
        values: {
          micro1: (
            <>
              High-fidelity robotics data for humanoids.
              {sourceLink("https://www.micro1.ai/", "[3]")}
            </>
          ),
          claru: "Training-ready datasets across physical AI tasks",
        },
      },
      {
        dimension: "Best fit",
        values: {
          micro1: "Teams needing human data operations and robotics datasets",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: micro1 vs Claru",
    intro:
      "micro1 specializes in human data operations. Claru specializes in physical-world capture and enrichment.",
    blocks: [
      {
        title: "Human data platform vs pipeline",
        paragraphs: [
          "micro1 focuses on human data operations and domain experts.",
          "Claru focuses on capture, enrichment, and training-ready datasets.",
        ],
      },
      {
        title: "Data sourcing",
        paragraphs: [
          "micro1 highlights expert-driven data programs.",
          "Claru captures new physical-world data tailored to robotics tasks.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "micro1 is strong when expert human data is the bottleneck.",
          "Claru is stronger when physical-world capture is the bottleneck.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When micro1 Is a Fit",
    competitorBullets: [
      "You need expert human data operations for frontier AI.",
      "You want robotics datasets from high-fidelity real-world capture.",
      "You need a platform for expert data creation and review.",
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
        title: "Asimov Alternatives",
        desc: "Egocentric human data vs physical AI capture.",
        href: "/compare/asimov-yc-w26-alternatives",
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
      "Choose micro1 when you need expert-driven human data operations.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: micro1 for expert data operations, Claru for capture-first datasets.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is micro1?",
        answer: (
          <>
            micro1 positions itself as an end-to-end human data engine.
            {sourceLink("https://www.micro1.ai/", "[1]")}
          </>
        ),
      },
      {
        question: "Does micro1 collect robotics data?",
        answer: (
          <>
            micro1 highlights a data engine to collect and annotate real world
            robotics data. {sourceLink("https://www.micro1.ai/", "[2]")}
          </>
        ),
      },
      {
        question: "What robotics focus does micro1 mention?",
        answer: (
          <>
            The company highlights high-fidelity robotics data for humanoids.
            {sourceLink("https://www.micro1.ai/", "[3]")}
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
    { label: "micro1", url: "https://www.micro1.ai/" },
  ],
};
