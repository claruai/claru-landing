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

export const helpwareComparison: ComparisonData = {
  slug: "helpware-alternatives",
  competitor: {
    name: "Helpware",
    siteUrl: "https://www.helpware.com",
    category: "Data labeling and annotation services",
  },
  meta: {
    title: "Helpware Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Helpware and Claru for physical AI training data. Helpware provides data labeling services across text, image, audio, and video with managed QA. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Helpware alternative",
      "Helpware alternatives",
      "Helpware vs Claru",
      "data labeling services",
      "annotation services",
      "physical AI training data",
      "robotics data capture",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Helpware Alternatives",
    title: "Helpware Alternatives: Labeling Services vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://www.helpware.com/services/data-labeling-service/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Helpware
        </a>{" "}
        provides data labeling services across text, image, audio, and video. If
        you need physical-world capture and enrichment for robotics, Claru is
        built for physical AI from day one.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Helpware provides data labeling and annotation services for AI/ML.",
      "They highlight support for text, image, audio, and video labeling.",
      "Helpware emphasizes managed QA and human-in-the-loop workflows.",
      "Claru is purpose-built for physical AI capture and multi-layer enrichment.",
      "Choose Helpware for labeling services; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What Helpware Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Helpware provides managed labeling services. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        Helpware highlights data labeling and annotation services.
        {sourceLink("https://www.helpware.com/services/data-labeling-service/", "[1]")}
      </>,
      <>
        The service supports text, image, audio, and video labeling.
        {sourceLink("https://www.helpware.com/services/data-labeling-service/", "[2]")}
      </>,
      <>
        Helpware emphasizes human-in-the-loop workflows and QA.
        {sourceLink("https://www.helpware.com/services/data-labeling-service/", "[3]")}
      </>,
      "If your bottleneck is managed labeling services and QA, Helpware is a strong fit. If your bottleneck is physical-world capture and enrichment, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Helpware at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                Data labeling and annotation services.
                {sourceLink("https://www.helpware.com/services/data-labeling-service/", "[1]")}
              </>
            ),
          },
          {
            label: "Modalities",
            value: (
              <>
                Text, image, audio, and video labeling.
                {sourceLink("https://www.helpware.com/services/data-labeling-service/", "[2]")}
              </>
            ),
          },
          {
            label: "Delivery",
            value: (
              <>
                Human-in-the-loop workflows and QA.
                {sourceLink("https://www.helpware.com/services/data-labeling-service/", "[3]")}
              </>
            ),
          },
          {
            label: "Best fit",
            value: "Teams needing managed labeling services",
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
        Helpware provides data labeling and annotation services.
        {sourceLink("https://www.helpware.com/services/data-labeling-service/", "[1]")}
      </>,
      <>
        The service supports text, image, audio, and video labeling.
        {sourceLink("https://www.helpware.com/services/data-labeling-service/", "[2]")}
      </>,
      <>
        Helpware emphasizes human-in-the-loop workflows and QA.
        {sourceLink("https://www.helpware.com/services/data-labeling-service/", "[3]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Helpware Is Strong",
    intro:
      "Based on Helpware's public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "Managed labeling services",
        description: (
          <>
            Helpware offers managed data labeling and annotation services.
            {sourceLink("https://www.helpware.com/services/data-labeling-service/", "[1]")}
          </>
        ),
      },
      {
        title: "Multi-modal coverage",
        description: (
          <>
            Services span text, image, audio, and video labeling.
            {sourceLink("https://www.helpware.com/services/data-labeling-service/", "[2]")}
          </>
        ),
      },
      {
        title: "HITL quality",
        description: (
          <>
            Helpware emphasizes human-in-the-loop QA workflows.
            {sourceLink("https://www.helpware.com/services/data-labeling-service/", "[3]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "Helpware provides labeling services. Claru is a capture-and-enrichment pipeline for physical AI.",
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
    title: "Helpware vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing Helpware's services model.",
    columns: [
      { key: "helpware", label: "Helpware" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          helpware: (
            <>
              Data labeling and annotation services.
              {sourceLink("https://www.helpware.com/services/data-labeling-service/", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Modalities",
        values: {
          helpware: (
            <>
              Text, image, audio, and video labeling.
              {sourceLink("https://www.helpware.com/services/data-labeling-service/", "[2]")}
            </>
          ),
          claru: "Egocentric video, manipulation, depth, pose, segmentation",
        },
      },
      {
        dimension: "Delivery",
        values: {
          helpware: (
            <>
              Human-in-the-loop workflows and QA.
              {sourceLink("https://www.helpware.com/services/data-labeling-service/", "[3]")}
            </>
          ),
          claru: "Collector network plus task-specific capture",
        },
      },
      {
        dimension: "Enrichment",
        values: {
          helpware: "Annotation services and QA",
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Best fit",
        values: {
          helpware: "Teams needing managed labeling services",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Helpware vs Claru",
    intro:
      "Helpware specializes in managed labeling services. Claru specializes in physical-world capture and enrichment.",
    blocks: [
      {
        title: "Services vs pipeline",
        paragraphs: [
          "Helpware delivers managed annotation services.",
          "Claru delivers capture, enrichment, and training-ready datasets.",
        ],
      },
      {
        title: "Data sourcing",
        paragraphs: [
          "Helpware helps label existing datasets.",
          "Claru captures new physical-world data tailored to robotics tasks.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "Helpware is strong when you need scalable labeling services.",
          "Claru is stronger when physical-world capture is the bottleneck.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Helpware Is a Fit",
    competitorBullets: [
      "You need managed labeling services across multiple data types.",
      "You already have data and need annotation throughput.",
      "You want human-in-the-loop QA workflows.",
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
      "Choose Helpware when you need managed labeling services and QA.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: Helpware for labeling services, Claru for capture-first datasets.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Helpware?",
        answer: (
          <>
            Helpware provides data labeling and annotation services.
            {sourceLink("https://www.helpware.com/services/data-labeling-service/", "[1]")}
          </>
        ),
      },
      {
        question: "What data types does Helpware support?",
        answer: (
          <>
            Helpware highlights text, image, audio, and video labeling.
            {sourceLink("https://www.helpware.com/services/data-labeling-service/", "[2]")}
          </>
        ),
      },
      {
        question: "Does Helpware provide QA workflows?",
        answer: (
          <>
            Helpware emphasizes human-in-the-loop QA workflows.
            {sourceLink("https://www.helpware.com/services/data-labeling-service/", "[3]")}
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
    { label: "Helpware Data Labeling", url: "https://www.helpware.com/services/data-labeling-service/" },
  ],
};
