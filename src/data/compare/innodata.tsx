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

export const innodataComparison: ComparisonData = {
  slug: "innodata-alternatives",
  competitor: {
    name: "Innodata",
    siteUrl: "https://innodata.com",
    category: "AI data annotation services",
  },
  meta: {
    title: "Innodata Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Innodata and Claru for physical AI training data. Innodata provides data annotation services across modalities. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Innodata alternative",
      "Innodata alternatives",
      "Innodata vs Claru",
      "data annotation services",
      "AI training data",
      "physical AI training data",
      "robotics data labeling",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Innodata Alternatives",
    title: "Innodata Alternatives: Data Annotation vs Physical AI Capture",
    subtitle: (
      <>
        <a
          href="https://innodata.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Innodata
        </a>{" "}
        provides data annotation services across modalities. If you need
        physical-world capture and enrichment for robotics, Claru is built for
        physical AI from day one.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Innodata provides data annotation services for AI training data.",
      "Innodata highlights annotation support across text, image, audio, and video.",
      "Claru is purpose-built for physical AI data capture and enrichment.",
      "Choose Innodata when you need general annotation services.",
      "Choose Claru when you need robotics-ready datasets captured from the physical world.",
    ],
  },
  overview: {
    title: "What Innodata Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Innodata is a data annotation services provider. Claru is a physical AI pipeline focused on capture and enrichment for robotics.",
      <>
        Innodata highlights data annotation services across text, image, audio,
        and video. {sourceLink("https://solutions.innodata.com/data-annotation/", "[1]")}
      </>,
      <>
        Innodata also promotes domain expertise and quality-driven workflows in
        its annotation offering. {" "}
        {sourceLink("https://solutions.innodata.com/data-annotation/", "[2]")}
      </>,
      "If your bottleneck is general data annotation, Innodata is a strong fit. If your bottleneck is physical-world capture and robotics enrichment, you need a specialized pipeline.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Innodata at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                Data annotation services for AI training data. {" "}
                {sourceLink("https://solutions.innodata.com/data-annotation/", "[1]")}
              </>
            ),
          },
          {
            label: "Modalities",
            value: "Text, image, audio, and video",
          },
          {
            label: "Core output",
            value: "Labeled datasets and annotation workflows",
          },
          {
            label: "Best fit",
            value: "Teams needing general annotation services",
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
        Innodata highlights data annotation services across text, image, audio,
        and video. {sourceLink("https://solutions.innodata.com/data-annotation/", "[1]")}
      </>,
      <>
        Innodata emphasizes domain expertise and quality-focused workflows in
        annotation. {sourceLink("https://solutions.innodata.com/data-annotation/", "[2]")}
      </>,
      <>
        Innodata describes managed annotation services for AI training data. {" "}
        {sourceLink("https://solutions.innodata.com/data-annotation/", "[3]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Innodata Is Strong",
    intro:
      "Based on Innodata’s public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "Annotation services",
        description: (
          <>
            Innodata provides data annotation across modalities. {" "}
            {sourceLink("https://solutions.innodata.com/data-annotation/", "[1]")}
          </>
        ),
      },
      {
        title: "Quality focus",
        description: (
          <>
            The site emphasizes expert-driven, quality-focused annotation. {" "}
            {sourceLink("https://solutions.innodata.com/data-annotation/", "[2]")}
          </>
        ),
      },
      {
        title: "Managed workflows",
        description: (
          <>
            Innodata describes managed annotation services for AI training
            datasets. {sourceLink("https://solutions.innodata.com/data-annotation/", "[3]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Why Physical AI Teams Evaluate Alternatives",
    intro:
      "Robotics teams often need capture and enrichment of physical-world data — not just annotation services.",
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
    title: "Innodata vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing Innodata’s annotation services model.",
    columns: [
      { key: "innodata", label: "Innodata" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          innodata: (
            <>
              Data annotation services for AI training data. {" "}
              {sourceLink("https://solutions.innodata.com/data-annotation/", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Modalities",
        values: {
          innodata: "Text, image, audio, and video",
          claru: "Egocentric video, manipulation, depth, pose, and segmentation",
        },
      },
      {
        dimension: "Data capture",
        values: {
          innodata: "Annotation services for existing data",
          claru: "Collector network plus teleoperation and task-specific capture",
        },
      },
      {
        dimension: "Enrichment",
        values: {
          innodata: "Annotation layers based on client schema",
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Best fit",
        values: {
          innodata: "Teams needing general annotation services",
          claru: "Robotics teams needing capture + enrichment",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Innodata vs Claru",
    intro:
      "Innodata is a general annotation services provider. Claru is a physical AI data pipeline.",
    blocks: [
      {
        title: "Annotation services vs capture pipelines",
        paragraphs: [
          "Innodata focuses on annotation services across data types.",
          "Claru focuses on real-world capture and enrichment for robotics training.",
        ],
      },
      {
        title: "Quality workflows vs enrichment layers",
        paragraphs: [
          "Innodata emphasizes quality and domain expertise in annotation workflows.",
          "Claru adds enrichment layers like depth and pose that are core inputs for robotics models.",
        ],
      },
      {
        title: "Where each provider fits",
        paragraphs: [
          "Innodata is a strong fit for teams needing general annotation services.",
          "Claru is a better fit when you need physical-world capture and enrichment.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Innodata Is a Fit",
    competitorBullets: [
      "You need data annotation services across modalities.",
      "You already have data and need labeling support.",
      "You want managed workflows with quality oversight.",
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
      "If you need general annotation services with quality oversight, Innodata is designed for that scope.",
      "If you need capture and enrichment of physical-world data for robotics training, Claru is a better fit.",
      "Some teams use both: Innodata for labeling workflows, Claru for physical datasets.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Innodata?",
        answer: (
          <>
            Innodata provides data annotation services across text, image,
            audio, and video. {" "}
            {sourceLink("https://solutions.innodata.com/data-annotation/", "[1]")}
          </>
        ),
      },
      {
        question: "Does Innodata focus on quality workflows?",
        answer: (
          <>
            Yes. Innodata highlights domain expertise and quality-focused
            annotation workflows. {" "}
            {sourceLink("https://solutions.innodata.com/data-annotation/", "[2]")}
          </>
        ),
      },
      {
        question: "Is Innodata a physical AI data provider?",
        answer:
          "Innodata focuses on annotation services rather than capture-first physical-world data for robotics.",
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
    { label: "Innodata Data Annotation", url: "https://solutions.innodata.com/data-annotation/" },
  ],
};
