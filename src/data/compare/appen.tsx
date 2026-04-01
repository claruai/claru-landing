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

export const appenComparison: ComparisonData = {
  slug: "appen-alternatives",
  competitor: {
    name: "Appen",
    siteUrl: "https://www.appen.com",
    category: "Global AI data collection and annotation services",
  },
  meta: {
    title: "Appen Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Appen and Claru for physical AI training data. Appen provides global data collection, annotation, and evaluation services across text, image, audio, and video, with a large crowd workforce. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Appen alternative",
      "Appen alternatives",
      "Appen vs Claru",
      "AI data collection",
      "data annotation services",
      "training data provider",
      "physical AI training data",
      "robotics data capture",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Appen Alternatives",
    title: "Appen Alternatives: Global Labeling vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://www.appen.com/ai-data"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Appen
        </a>{" "}
        provides global AI training data services, including data collection,
        annotation, and evaluation across text, image, audio, and video. If you
        need physical-world capture and enrichment for robotics, Claru is built
        for physical AI from day one.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Appen provides high-quality AI training data and data services at scale.",
      "It highlights a global crowd of more than 1 million AI training specialists.",
      "Data collection spans text, image, audio, and video modalities.",
      "Appen offers data annotation services across text, audio, image, and video.",
      "Evaluation and benchmarking are listed as part of the AI training data stack.",
      "Appen notes 25+ years of expertise in collection, curation, and annotation.",
      "Claru is purpose-built for physical AI capture and multi-layer enrichment.",
      "Choose Appen for global labeling services; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What Appen Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Appen is a global AI data services provider. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        Appen positions itself around high-quality AI training data and
        scalable data services. {sourceLink("https://www.appen.com/ai-data", "[1]")}
      </>,
      <>
        The company highlights a global crowd of more than 1 million AI training
        specialists. {sourceLink("https://www.appen.com/ai-data", "[2]")}
      </>,
      <>
        Appen&apos;s data collection spans text, image, audio, and video
        modalities. {sourceLink("https://www.appen.com/ai-data", "[3]")}
      </>,
      <>
        Its data annotation services cover text, audio, image, and video.
        {sourceLink("https://www.appen.com/ai-data", "[4]")}
      </>,
      <>
        Appen lists evaluation and benchmarking as part of its AI training data
        workflow. {sourceLink("https://www.appen.com/ai-data", "[5]")}
      </>,
      <>
        The company highlights 25+ years of expertise in collection, curation,
        and annotation. {sourceLink("https://www.appen.com/ai-data", "[6]")}
      </>,
      "If your bottleneck is global data collection and annotation at scale, Appen is a strong fit. If your bottleneck is physical-world capture and enrichment, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Appen at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                High-quality AI training data and data services.
                {sourceLink("https://www.appen.com/ai-data", "[1]")}
              </>
            ),
          },
          {
            label: "Workforce",
            value: (
              <>
                Global crowd of more than 1 million AI training specialists.
                {sourceLink("https://www.appen.com/ai-data", "[2]")}
              </>
            ),
          },
          {
            label: "Collection",
            value: (
              <>
                Custom data across text, image, audio, and video.
                {sourceLink("https://www.appen.com/ai-data", "[3]")}
              </>
            ),
          },
          {
            label: "Annotation",
            value: (
              <>
                Annotation across text, audio, image, and video.
                {sourceLink("https://www.appen.com/ai-data", "[4]")}
              </>
            ),
          },
          {
            label: "Experience",
            value: (
              <>
                25+ years of expertise in collection, curation, annotation.
                {sourceLink("https://www.appen.com/ai-data", "[6]")}
              </>
            ),
          },
          {
            label: "Best fit",
            value: "Teams needing global collection and annotation",
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
        Appen provides high-quality AI training data and scalable data services.
        {sourceLink("https://www.appen.com/ai-data", "[1]")}
      </>,
      <>
        The company highlights a global crowd of more than 1 million AI training
        specialists. {sourceLink("https://www.appen.com/ai-data", "[2]")}
      </>,
      <>
        Data collection spans text, image, audio, and video modalities.
        {sourceLink("https://www.appen.com/ai-data", "[3]")}
      </>,
      <>
        Data annotation services cover text, audio, image, and video.
        {sourceLink("https://www.appen.com/ai-data", "[4]")}
      </>,
      <>
        Evaluation and benchmarking are listed as services in the AI data
        workflow. {sourceLink("https://www.appen.com/ai-data", "[5]")}
      </>,
      <>
        Appen notes 25+ years of expertise in collection, curation, and
        annotation. {sourceLink("https://www.appen.com/ai-data", "[6]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Appen Is Strong",
    intro:
      "Based on Appen's public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "Global workforce scale",
        description: (
          <>
            Appen highlights a global crowd of more than 1 million AI training
            specialists. {sourceLink("https://www.appen.com/ai-data", "[2]")}
          </>
        ),
      },
      {
        title: "Multi-modal collection",
        description: (
          <>
            Data collection spans text, image, audio, and video.
            {sourceLink("https://www.appen.com/ai-data", "[3]")}
          </>
        ),
      },
      {
        title: "Annotation coverage",
        description: (
          <>
            Annotation services cover text, audio, image, and video.
            {sourceLink("https://www.appen.com/ai-data", "[4]")}
          </>
        ),
      },
      {
        title: "Evaluation services",
        description: (
          <>
            Appen lists evaluation and benchmarking workflows.
            {sourceLink("https://www.appen.com/ai-data", "[5]")}
          </>
        ),
      },
      {
        title: "Long-standing expertise",
        description: (
          <>
            Appen notes 25+ years of expertise in AI data services.
            {sourceLink("https://www.appen.com/ai-data", "[6]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "Appen provides global data services. Claru is a capture-and-enrichment pipeline for physical AI.",
    cards: [
      {
        title: "Capture-first",
        description:
          "Claru starts by capturing physical-world data instead of relying on generalized crowd workflows.",
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
      {
        title: "Task-specific collection",
        description:
          "Claru designs capture briefs around real robot behaviors and environments.",
      },
    ],
  },
  comparison: {
    title: "Appen vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing Appen's global data services strengths.",
    columns: [
      { key: "appen", label: "Appen" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          appen: (
            <>
              Global AI training data services at scale.
              {sourceLink("https://www.appen.com/ai-data", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Workforce",
        values: {
          appen: (
            <>
              Global crowd of 1M+ AI training specialists.
              {sourceLink("https://www.appen.com/ai-data", "[2]")}
            </>
          ),
          claru: "Specialized capture network for physical AI",
        },
      },
      {
        dimension: "Data collection",
        values: {
          appen: (
            <>
              Custom data across text, image, audio, and video.
              {sourceLink("https://www.appen.com/ai-data", "[3]")}
            </>
          ),
          claru: "Collector network plus task-specific capture",
        },
      },
      {
        dimension: "Annotation",
        values: {
          appen: (
            <>
              Annotation across text, audio, image, and video.
              {sourceLink("https://www.appen.com/ai-data", "[4]")}
            </>
          ),
          claru: "Expert annotation paired with enrichment outputs",
        },
      },
      {
        dimension: "Evaluation",
        values: {
          appen: (
            <>
              Evaluation and benchmarking services.
              {sourceLink("https://www.appen.com/ai-data", "[5]")}
            </>
          ),
          claru: "Quality scoring tied to capture and enrichment",
        },
      },
      {
        dimension: "Best fit",
        values: {
          appen: "Teams needing global collection and annotation",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Appen vs Claru",
    intro:
      "Appen specializes in large-scale data services. Claru specializes in physical-world capture and enrichment.",
    blocks: [
      {
        title: "Services vs pipeline",
        paragraphs: [
          "Appen provides global data collection, annotation, and evaluation.",
          "Claru provides capture, enrichment, and training-ready datasets.",
        ],
      },
      {
        title: "Workforce model",
        paragraphs: [
          "Appen relies on a large global crowd workforce.",
          "Claru uses a specialized capture network for physical AI data.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "Appen is strong when global scale and multilingual data are the bottleneck.",
          "Claru is stronger when physical-world capture is the bottleneck.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Appen Is a Fit",
    competitorBullets: [
      "You need global data collection and annotation at scale.",
      "You work across text, image, audio, and video modalities.",
      "You need evaluation and benchmarking services.",
      "You need a large crowd workforce for diverse data coverage.",
    ],
    claruTitle: "When Claru Is a Fit",
    claruBullets: [
      "You need physical-world data captured for robotics tasks.",
      "You want enrichment layers like depth, pose, and motion signals.",
      "You need datasets delivered in robotics-native formats.",
      "You want task-specific capture briefs for real-world behaviors.",
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
        title: "Scale AI Alternatives",
        desc: "Enterprise annotation vs physical AI pipelines.",
        href: "/compare/scale-ai-alternatives",
      },
      {
        title: "Labelbox Alternatives",
        desc: "Annotation platform vs capture-first datasets.",
        href: "/compare/labelbox-alternatives",
      },
      {
        title: "Surge AI Alternatives",
        desc: "RLHF providers vs capture-first robotics datasets.",
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
      "Choose Appen when you need global data collection, annotation, and evaluation services at scale.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: Appen for broad data services, Claru for capture-first datasets.",
      "If your project requires physical data collection, prioritize providers built for capture and enrichment from day one.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Appen?",
        answer: (
          <>
            Appen provides high-quality AI training data and scalable data
            services. {sourceLink("https://www.appen.com/ai-data", "[1]")}
          </>
        ),
      },
      {
        question: "How large is Appen's workforce?",
        answer: (
          <>
            Appen highlights a global crowd of more than 1 million AI training
            specialists. {sourceLink("https://www.appen.com/ai-data", "[2]")}
          </>
        ),
      },
      {
        question: "What modalities does Appen collect?",
        answer: (
          <>
            Appen lists data collection across text, image, audio, and video.
            {sourceLink("https://www.appen.com/ai-data", "[3]")}
          </>
        ),
      },
      {
        question: "Does Appen provide annotation services?",
        answer: (
          <>
            Appen provides annotation across text, audio, image, and video.
            {sourceLink("https://www.appen.com/ai-data", "[4]")}
          </>
        ),
      },
      {
        question: "Does Appen offer evaluation services?",
        answer: (
          <>
            Appen lists evaluation and benchmarking as part of its AI data
            services. {sourceLink("https://www.appen.com/ai-data", "[5]")}
          </>
        ),
      },
      {
        question: "When is Claru a better fit?",
        answer:
          "Claru is a better fit when you need capture, enrichment, and delivery of robotics-ready datasets.",
      },
      {
        question: "Can teams use both Appen and Claru?",
        answer:
          "Some teams use Appen for global data services and Claru for capture-first physical AI datasets.",
      },
      {
        question: "How long has Appen been in AI data?",
        answer: (
          <>
            Appen notes 25+ years of expertise in collection, curation, and
            annotation. {sourceLink("https://www.appen.com/ai-data", "[6]")}
          </>
        ),
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
    { label: "Appen AI Training Data", url: "https://www.appen.com/ai-data" },
  ],
};
