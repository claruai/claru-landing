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

export const redbrickAiComparison: ComparisonData = {
  slug: "redbrick-ai-alternatives",
  competitor: {
    name: "RedBrick AI",
    siteUrl: "https://www.redbrickai.com",
    category: "Medical imaging annotation platform",
  },
  meta: {
    title: "RedBrick AI Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare RedBrick AI and Claru for physical AI training data. RedBrick AI focuses on medical imaging annotation. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "RedBrick AI alternative",
      "RedBrick AI alternatives",
      "RedBrick AI vs Claru",
      "medical imaging annotation",
      "radiology labeling platform",
      "physical AI training data",
      "robotics data labeling",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "RedBrick AI Alternatives",
    title: "RedBrick AI Alternatives: Medical Imaging vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://www.redbrickai.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          RedBrick AI
        </a>{" "}
        focuses on medical imaging annotation. If you need physical-world
        capture and enrichment for robotics, Claru is built for physical AI
        from day one.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "RedBrick AI positions itself as a radiology and medical imaging annotation platform.",
      "The platform emphasizes tooling for medical imaging workflows.",
      "RedBrick AI is a medical imaging-focused platform rather than a capture-first robotics pipeline.",
      "Claru is purpose-built for physical AI capture and enrichment.",
      "Choose RedBrick AI for medical imaging annotation; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What RedBrick AI Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: RedBrick AI focuses on medical imaging annotation. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        RedBrick AI positions itself as a radiology and medical imaging
        annotation platform. {sourceLink("https://www.redbrickai.com/", "[1]")}
      </>,
      <>
        The company highlights tooling for medical imaging workflows in its
        platform documentation. {sourceLink("https://docs.redbrickai.com/", "[2]")}
      </>,
      "If your bottleneck is medical imaging annotation, RedBrick AI is a strong fit. If your bottleneck is physical-world capture and enrichment for robotics, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "RedBrick AI at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                Medical imaging and radiology annotation platform. {sourceLink("https://www.redbrickai.com/", "[1]")}
              </>
            ),
          },
          {
            label: "Platform",
            value: (
              <>
                Tooling for medical imaging annotation workflows. {sourceLink("https://docs.redbrickai.com/", "[2]")}
              </>
            ),
          },
          {
            label: "Core output",
            value: "Annotated medical imaging datasets",
          },
          {
            label: "Best fit",
            value: "Healthcare and medical imaging AI teams",
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
        RedBrick AI positions itself as a medical imaging annotation platform. {sourceLink("https://www.redbrickai.com/", "[1]")}
      </>,
      <>
        The platform documentation covers tooling for medical imaging workflows. {sourceLink("https://docs.redbrickai.com/", "[2]")}
      </>,
      <>
        RedBrick AI emphasizes radiology-focused annotation workflows. {sourceLink("https://www.redbrickai.com/", "[3]")}
      </>,
    ],
  },
  strengths: {
    title: "Where RedBrick AI Is Strong",
    intro:
      "Based on RedBrick AI's public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "Medical imaging focus",
        description: (
          <>
            RedBrick AI positions itself as a radiology and medical imaging
            annotation platform. {sourceLink("https://www.redbrickai.com/", "[1]")}
          </>
        ),
      },
      {
        title: "Specialized tooling",
        description: (
          <>
            Documentation highlights tooling for medical imaging workflows. {sourceLink("https://docs.redbrickai.com/", "[2]")}
          </>
        ),
      },
      {
        title: "Healthcare use cases",
        description: (
          <>
            The platform is targeted at healthcare AI teams. {sourceLink("https://www.redbrickai.com/", "[3]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "RedBrick AI focuses on medical imaging annotation. Claru is a capture-and-enrichment pipeline for physical AI.",
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
    title: "RedBrick AI vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing RedBrick AI's medical imaging specialization.",
    columns: [
      { key: "redbrick", label: "RedBrick AI" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          redbrick: (
            <>
              Medical imaging annotation platform. {sourceLink("https://www.redbrickai.com/", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Data types",
        values: {
          redbrick: "Medical imaging and radiology workflows",
          claru: "Egocentric video, manipulation, depth, pose, segmentation",
        },
      },
      {
        dimension: "Data capture",
        values: {
          redbrick: "Bring-your-own medical imaging data",
          claru: "Collector network plus task-specific capture",
        },
      },
      {
        dimension: "Enrichment",
        values: {
          redbrick: "Medical imaging annotation tooling",
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Best fit",
        values: {
          redbrick: "Healthcare and medical imaging AI teams",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: RedBrick AI vs Claru",
    intro:
      "RedBrick AI focuses on medical imaging workflows. Claru specializes in physical AI capture and enrichment.",
    blocks: [
      {
        title: "Medical imaging vs physical capture",
        paragraphs: [
          "RedBrick AI is tailored to radiology and medical imaging annotation.",
          "Claru captures real-world data for robotics and embodied AI.",
        ],
      },
      {
        title: "Annotation vs enrichment",
        paragraphs: [
          "RedBrick AI provides specialized medical imaging annotation tooling.",
          "Claru enriches each clip with depth, pose, and motion signals.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "RedBrick AI is a strong fit for healthcare AI programs.",
          "Claru is better when you need capture and enrichment for physical AI.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When RedBrick AI Is a Fit",
    competitorBullets: [
      "You need medical imaging annotation workflows.",
      "You work with radiology or clinical imaging datasets.",
      "You already have medical imaging data to label.",
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
      "Choose RedBrick AI when you need medical imaging annotation workflows.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: RedBrick AI for medical imaging, Claru for physical data capture.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is RedBrick AI?",
        answer: (
          <>
            RedBrick AI positions itself as a medical imaging annotation
            platform. {sourceLink("https://www.redbrickai.com/", "[1]")}
          </>
        ),
      },
      {
        question: "Does RedBrick AI focus on medical imaging?",
        answer: (
          <>
            Yes. The platform highlights medical imaging workflows in its
            documentation. {sourceLink("https://docs.redbrickai.com/", "[2]")}
          </>
        ),
      },
      {
        question: "Is RedBrick AI a physical AI data provider?",
        answer:
          "RedBrick AI focuses on medical imaging annotation rather than capture-first physical data pipelines.",
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
    { label: "RedBrick AI", url: "https://www.redbrickai.com/" },
    { label: "RedBrick AI Docs", url: "https://docs.redbrickai.com/" },
  ],
};
