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

export const turingComparison: ComparisonData = {
  slug: "turing-alternatives",
  competitor: {
    name: "Turing",
    siteUrl: "https://www.turing.com",
    category: "AI talent pods and AI system delivery",
  },
  meta: {
    title: "Turing Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Turing and Claru for physical AI training data. Turing provides embedded AI talent and AI system delivery. Claru focuses on capture, enrichment, and robotics-ready datasets.",
    keywords: [
      "Turing alternative",
      "Turing alternatives",
      "Turing vs Claru",
      "AI talent pods",
      "physical AI training data",
      "robotics data labeling",
      "training data provider comparison",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Turing Alternatives",
    title: "Turing Alternatives: AI Talent Pods vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://www.turing.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Turing
        </a>{" "}
        focuses on embedded AI talent and AI system delivery. If you need
        robotics-ready datasets with capture and enrichment, Claru is built for
        physical AI from the ground up. This page compares the two approaches.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Turing positions itself around AI system delivery and embedded AI talent pods.",
      "Turing offers AI talent integrated into client teams and workflows.",
      "Claru is specialized for physical-world data capture and enrichment.",
      "Choose Turing when you need AI-native teams to ship systems.",
      "Choose Claru when you need robotics-ready datasets delivered fast.",
    ],
  },
  overview: {
    title: "What Turing Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Turing is a talent + systems delivery model. Claru is a data pipeline built for physical AI capture and enrichment.",
      <>
        Turing markets AI system delivery through its “Deploy AI Systems”
        offering and positions itself as a partner for moving from pilot to
        production. {sourceLink("https://www.turing.com/intelligence/build", "[1]")}
      </>,
      <>
        Turing also highlights AI-native talent pods embedded into client teams
        and stacks. {sourceLink("https://www.turing.com/intelligence/talent", "[2]")}
      </>,
      "If your bottleneck is shipping AI systems or scaling AI talent, Turing is a strong fit. If your bottleneck is physical-world data, you need capture and enrichment infrastructure instead.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Turing at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                AI system delivery and embedded AI talent. {" "}
                {sourceLink("https://www.turing.com/intelligence/build", "[1]")}
              </>
            ),
          },
          {
            label: "Delivery model",
            value: (
              <>
                AI-native pods integrated into client workflows. {" "}
                {sourceLink("https://www.turing.com/intelligence/talent", "[2]")}
              </>
            ),
          },
          {
            label: "Core output",
            value: "AI systems and talent capacity for deployment",
          },
          {
            label: "Best fit",
            value: "Teams that need AI talent and system build support",
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
            value: "Wearable camera network plus teleoperation and task capture",
          },
          {
            label: "Enrichment",
            value: "Depth, pose, segmentation, optical flow, aligned captions",
          },
          {
            label: "Best fit",
            value: "Robotics teams that need data capture + enrichment",
          },
        ],
      },
    ],
  },
  keyClaims: {
    title: "Key Claims (With Sources)",
    claims: [
      <>
        Turing promotes “Deploy AI Systems” to move from pilot to production. {" "}
        {sourceLink("https://www.turing.com/intelligence/build", "[1]")}
      </>,
      <>
        Turing offers AI-native pods integrated into your team and stack. {" "}
        {sourceLink("https://www.turing.com/intelligence/build", "[2]")}
      </>,
      <>
        Turing highlights elite AI talent with embedded delivery capabilities. {" "}
        {sourceLink("https://www.turing.com/intelligence/talent", "[3]")}
      </>,
      <>
        Turing highlights curated datasets for AI training. {" "}
        {sourceLink("https://www.turing.com/advance/datasets", "[4]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Turing Is Strong",
    intro:
      "Based on Turing’s public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "AI system delivery",
        description: (
          <>
            Turing positions “Deploy AI Systems” as a path from pilot to
            production. {sourceLink("https://www.turing.com/intelligence/build", "[1]")}
          </>
        ),
      },
      {
        title: "Embedded AI talent pods",
        description: (
          <>
            Turing emphasizes AI-native pods integrated into your team and
            stack. {sourceLink("https://www.turing.com/intelligence/build", "[2]")}
          </>
        ),
      },
      {
        title: "Elite AI talent network",
        description: (
          <>
            Turing markets elite AI talent trusted by leading AI labs. {" "}
            {sourceLink("https://www.turing.com/intelligence/talent", "[3]")}
          </>
        ),
      },
      {
        title: "Curated datasets",
        description: (
          <>
            Turing highlights curated datasets for AI training. {" "}
            {sourceLink("https://www.turing.com/advance/datasets", "[4]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Why Physical AI Teams Evaluate Alternatives",
    intro:
      "Robotics teams often need capture and enrichment of physical-world data — not just AI talent or system delivery.",
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
    title: "Turing vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing Turing’s AI delivery and talent model.",
    columns: [
      { key: "turing", label: "Turing" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          turing: (
            <>
              AI system delivery and embedded AI talent. {" "}
              {sourceLink("https://www.turing.com/intelligence/build", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Delivery model",
        values: {
          turing: (
            <>
              AI-native pods integrated into client teams. {" "}
              {sourceLink("https://www.turing.com/intelligence/build", "[2]")}
            </>
          ),
          claru: "End-to-end pipeline from capture to enrichment",
        },
      },
      {
        dimension: "Data capture",
        values: {
          turing: "Not positioned as capture-first for physical datasets",
          claru: "Collector network plus teleoperation and task-specific capture",
        },
      },
      {
        dimension: "Enrichment",
        values: {
          turing: "Talent + system delivery; limited data enrichment focus",
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Training data",
        values: {
          turing: (
            <>
              Curated datasets for AI training. {" "}
              {sourceLink("https://www.turing.com/advance/datasets", "[4]")}
            </>
          ),
          claru: "Robotics-ready datasets captured from the physical world",
        },
      },
      {
        dimension: "Best fit",
        values: {
          turing: "Teams needing AI talent and system build support",
          claru: "Teams needing capture and enrichment for robotics data",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Turing vs Claru",
    intro:
      "Turing is built around AI delivery and talent. Claru is built around physical AI data capture and enrichment.",
    blocks: [
      {
        title: "Talent pods vs dataset pipelines",
        paragraphs: [
          "Turing’s model centers on embedded AI talent pods and system delivery, helping organizations execute on AI roadmaps.",
          "Claru focuses on the data pipeline: capture, enrichment, and delivery of robotics-ready datasets.",
        ],
      },
      {
        title: "System delivery vs physical capture",
        paragraphs: [
          "Turing is a strong partner when the gap is execution capacity to ship AI systems.",
          "Claru is a better fit when the missing piece is real-world data capture for robots and embodied models.",
        ],
      },
      {
        title: "Where each provider fits",
        paragraphs: [
          "Turing is ideal for AI talent augmentation and production delivery.",
          "Claru is ideal for teams that need dense physical-world datasets with enrichment layers.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Turing Is a Fit",
    competitorBullets: [
      "You need AI-native talent pods embedded into your team.",
      "You want help moving AI systems from pilot to production.",
      "You need execution capacity more than new data capture.",
    ],
    claruTitle: "When Claru Is a Fit",
    claruBullets: [
      "You need new physical-world data captured for robotics tasks.",
      "Your model depends on enrichment layers like depth, pose, and motion.",
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
      "If you need embedded AI talent and support to build production systems, Turing is designed for that.",
      "If you need physical-world data capture and enrichment, Claru is the better fit.",
      "Some teams use both: Turing for delivery capacity and Claru for robotics datasets.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What does Turing provide?",
        answer: (
          <>
            Turing promotes AI system delivery and embedded AI talent pods to
            help organizations move from pilot to production. {" "}
            {sourceLink("https://www.turing.com/intelligence/build", "[1]")}
          </>
        ),
      },
      {
        question: "Does Turing provide embedded AI talent?",
        answer: (
          <>
            Yes. Turing highlights AI-native pods integrated into client teams
            and stacks. {sourceLink("https://www.turing.com/intelligence/build", "[2]")}
          </>
        ),
      },
      {
        question: "Is Turing a physical AI data provider?",
        answer:
          "Turing’s core positioning is talent and system delivery rather than physical-world data capture.",
      },
      {
        question: "When is Claru a better fit?",
        answer:
          "Claru is a better fit when you need physical-world capture, enrichment, and robotics-ready dataset delivery.",
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
    { label: "Turing Build AI Systems", url: "https://www.turing.com/intelligence/build" },
    { label: "Turing AI Talent", url: "https://www.turing.com/intelligence/talent" },
    { label: "Turing Datasets", url: "https://www.turing.com/advance/datasets" },
  ],
};
