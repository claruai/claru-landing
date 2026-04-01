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

export const prodigyComparison: ComparisonData = {
  slug: "prodigy-alternatives",
  competitor: {
    name: "Prodigy",
    siteUrl: "https://prodi.gy",
    category: "Downloadable annotation tool for NLP and CV",
  },
  meta: {
    title: "Prodigy Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Prodigy and Claru for physical AI training data. Prodigy is a downloadable annotation tool and developer library for information extraction, language model training, computer vision, audio/video, and prompt engineering. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Prodigy alternative",
      "Prodigy alternatives",
      "Prodigy vs Claru",
      "annotation tool",
      "NLP annotation",
      "computer vision annotation",
      "prompt engineering",
      "physical AI training data",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Prodigy Alternatives",
    title: "Prodigy Alternatives: Annotation Tool vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://prodi.gy/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Prodigy
        </a>{" "}
        is a downloadable annotation tool and developer library for LLM, NLP,
        and computer vision tasks, plus audio/video and prompt engineering. If
        you need physical-world capture and enrichment for robotics, Claru is
        built for physical AI from day one.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Prodigy is a downloadable annotation tool and developer library.",
      "It highlights use cases like information extraction, language model training, computer vision, audio/video, and prompt engineering.",
      "Prodigy positions itself around local control, with no lock-in and running on your own machines.",
      "The platform emphasizes creating, reviewing, and training from annotations.",
      "Prodigy targets developers who want to build custom annotation workflows.",
      "Claru is purpose-built for physical AI capture and multi-layer enrichment.",
      "Choose Prodigy for annotation tooling; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What Prodigy Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Prodigy is a downloadable annotation tool for NLP and CV tasks. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        Prodigy describes itself as a downloadable annotation tool and
        developer library. {sourceLink("https://prodi.gy/", "[1]")}
      </>,
      <>
        The site lists use cases like information extraction, language model
        training, computer vision, audio/video, and prompt engineering.
        {sourceLink("https://prodi.gy/", "[2]")}
      </>,
      <>
        Prodigy emphasizes local control with no lock-in and running entirely on
        your own machines. {sourceLink("https://prodi.gy/", "[3]")}
      </>,
      <>
        The platform highlights workflows to create, review, and train from
        annotations. {sourceLink("https://prodi.gy/", "[4]")}
      </>,
      <>
        Prodigy positions itself around building custom annotation workflows
        for teams. {sourceLink("https://prodi.gy/", "[5]")}
      </>,
      "If your bottleneck is annotation tooling for NLP or CV, Prodigy is a strong fit. If your bottleneck is physical-world capture and enrichment, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Prodigy at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                Downloadable annotation tool and developer library.
                {sourceLink("https://prodi.gy/", "[1]")}
              </>
            ),
          },
          {
            label: "Use cases",
            value: (
              <>
                Information extraction, LM training, CV, audio/video, prompt
                engineering. {sourceLink("https://prodi.gy/", "[2]")}
              </>
            ),
          },
          {
            label: "Deployment",
            value: (
              <>
                Runs locally with no lock-in on your own machines.
                {sourceLink("https://prodi.gy/", "[3]")}
              </>
            ),
          },
          {
            label: "Workflow",
            value: (
              <>
                Create, review, and train from annotations.
                {sourceLink("https://prodi.gy/", "[4]")}
              </>
            ),
          },
          {
            label: "Best fit",
            value: "Teams needing customizable annotation tooling",
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
        Prodigy is a downloadable annotation tool and developer library.
        {sourceLink("https://prodi.gy/", "[1]")}
      </>,
      <>
        Use cases include information extraction, language model training,
        computer vision, audio/video, and prompt engineering.
        {sourceLink("https://prodi.gy/", "[2]")}
      </>,
      <>
        Prodigy runs entirely on your own machines with no lock-in.
        {sourceLink("https://prodi.gy/", "[3]")}
      </>,
      <>
        The platform highlights workflows to create, review, and train from
        annotations. {sourceLink("https://prodi.gy/", "[4]")}
      </>,
      <>
        Prodigy positions itself around custom annotation workflows.
        {sourceLink("https://prodi.gy/", "[5]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Prodigy Is Strong",
    intro:
      "Based on Prodigy's public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "Downloadable developer tooling",
        description: (
          <>
            Prodigy is positioned as a downloadable tool and developer library.
            {sourceLink("https://prodi.gy/", "[1]")}
          </>
        ),
      },
      {
        title: "Broad use cases",
        description: (
          <>
            The site lists information extraction, LM training, CV, audio/video,
            and prompt engineering.
            {sourceLink("https://prodi.gy/", "[2]")}
          </>
        ),
      },
      {
        title: "Local control",
        description: (
          <>
            Prodigy emphasizes running locally with no lock-in.
            {sourceLink("https://prodi.gy/", "[3]")}
          </>
        ),
      },
      {
        title: "Annotation workflows",
        description: (
          <>
            Prodigy highlights create, review, and train workflows.
            {sourceLink("https://prodi.gy/", "[4]")}
          </>
        ),
      },
      {
        title: "Customization",
        description: (
          <>
            The platform positions itself for custom annotation workflows.
            {sourceLink("https://prodi.gy/", "[5]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "Prodigy provides annotation tooling. Claru is a capture-and-enrichment pipeline for physical AI.",
    cards: [
      {
        title: "Capture-first",
        description:
          "Claru starts by capturing physical-world data instead of focusing only on tooling.",
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
    title: "Prodigy vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing Prodigy's tooling strengths.",
    columns: [
      { key: "prodigy", label: "Prodigy" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          prodigy: (
            <>
              Downloadable annotation tool and developer library.
              {sourceLink("https://prodi.gy/", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Use cases",
        values: {
          prodigy: (
            <>
              Information extraction, LM training, CV, audio/video, prompt
              engineering. {sourceLink("https://prodi.gy/", "[2]")}
            </>
          ),
          claru: "Capture pipeline plus enrichment and delivery",
        },
      },
      {
        dimension: "Deployment",
        values: {
          prodigy: (
            <>
              Runs locally with no lock-in on your own machines.
              {sourceLink("https://prodi.gy/", "[3]")}
            </>
          ),
          claru: "Secure dataset delivery to your storage or pipelines",
        },
      },
      {
        dimension: "Workflow",
        values: {
          prodigy: (
            <>
              Create, review, and train from annotations.
              {sourceLink("https://prodi.gy/", "[4]")}
            </>
          ),
          claru: "Capture, enrichment, and robotics-ready delivery",
        },
      },
      {
        dimension: "Customization",
        values: {
          prodigy: (
            <>
              Custom annotation workflows for teams.
              {sourceLink("https://prodi.gy/", "[5]")}
            </>
          ),
          claru: "Task-specific capture briefs for physical data",
        },
      },
      {
        dimension: "Data capture",
        values: {
          prodigy: "Annotation tool for existing data",
          claru: "Collector network plus task-specific capture",
        },
      },
      {
        dimension: "Enrichment",
        values: {
          prodigy: "Annotation outputs and evaluation workflows",
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Best fit",
        values: {
          prodigy: "Teams needing customizable annotation tooling",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Prodigy vs Claru",
    intro:
      "Prodigy provides annotation tooling. Claru provides capture-first datasets for physical AI.",
    blocks: [
      {
        title: "Tooling vs pipeline",
        paragraphs: [
          "Prodigy is a downloadable tool for annotation workflows.",
          "Claru delivers capture, enrichment, and training-ready datasets.",
        ],
      },
      {
        title: "Local control",
        paragraphs: [
          "Prodigy emphasizes running locally with no lock-in.",
          "Claru emphasizes secure delivery and dataset ownership.",
        ],
      },
      {
        title: "Workflow focus",
        paragraphs: [
          "Prodigy focuses on creating, reviewing, and training from annotations.",
          "Claru focuses on physical-world capture and enrichment.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "Prodigy is strong when annotation tooling is the bottleneck.",
          "Claru is stronger when physical-world capture is the bottleneck.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Prodigy Is a Fit",
    competitorBullets: [
      "You need a downloadable annotation tool for NLP or CV.",
      "You want local control and no lock-in.",
      "You need custom annotation workflows for your team.",
      "You work across information extraction, LM training, or CV.",
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
        title: "Labelbox Alternatives",
        desc: "Annotation platform vs capture-first robotics datasets.",
        href: "/compare/labelbox-alternatives",
      },
      {
        title: "Scale AI Alternatives",
        desc: "Enterprise annotation vs physical AI pipelines.",
        href: "/compare/scale-ai-alternatives",
      },
      {
        title: "Appen Alternatives",
        desc: "Managed labeling services vs capture-first robotics datasets.",
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
      "Choose Prodigy when you need a downloadable annotation tool with local control.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: Prodigy for tooling, Claru for capture-first datasets.",
      "If your project requires physical data collection, prioritize providers built for capture and enrichment from day one.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Prodigy?",
        answer: (
          <>
            Prodigy is a downloadable annotation tool and developer library.
            {sourceLink("https://prodi.gy/", "[1]")}
          </>
        ),
      },
      {
        question: "What use cases does Prodigy list?",
        answer: (
          <>
            The site lists information extraction, LM training, CV, audio/video,
            and prompt engineering.
            {sourceLink("https://prodi.gy/", "[2]")}
          </>
        ),
      },
      {
        question: "Does Prodigy run locally?",
        answer: (
          <>
            Prodigy highlights local control and running on your own machines
            with no lock-in. {sourceLink("https://prodi.gy/", "[3]")}
          </>
        ),
      },
      {
        question: "What workflows does Prodigy emphasize?",
        answer: (
          <>
            Prodigy highlights creating, reviewing, and training from
            annotations. {sourceLink("https://prodi.gy/", "[4]")}
          </>
        ),
      },
      {
        question: "Is Prodigy a fit for robotics data capture?",
        answer:
          "Prodigy focuses on annotation tooling. Claru is better for capture-first robotics data collection and enrichment.",
      },
      {
        question: "When is Claru a better fit?",
        answer:
          "Claru is a better fit when you need capture, enrichment, and delivery of robotics-ready datasets.",
      },
      {
        question: "Can teams use both Prodigy and Claru?",
        answer:
          "Some teams use Prodigy for annotation tooling and Claru for capture-first physical AI datasets.",
      },
      {
        question: "Is Prodigy customizable?",
        answer: (
          <>
            Prodigy positions itself around custom annotation workflows.
            {sourceLink("https://prodi.gy/", "[5]")}
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
    { label: "Prodigy", url: "https://prodi.gy/" },
  ],
};
