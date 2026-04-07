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

export const imeritComparison: ComparisonData = {
  slug: "imerit-alternatives",
  competitor: {
    name: "iMerit",
    siteUrl: "https://imerit.net",
    category: "Expert-led data annotation and model tuning",
  },
  meta: {
    title: "iMerit Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare iMerit and Claru for physical AI training data. iMerit provides expert-led annotation, model tuning, and evaluation across modalities including CV, LiDAR, sensor fusion, text, and audio. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "iMerit alternative",
      "iMerit alternatives",
      "iMerit vs Claru",
      "expert data annotation",
      "model tuning",
      "multimodal annotation",
      "RLHF",
      "physical AI training data",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "iMerit Alternatives",
    title: "iMerit Alternatives: Expert Annotation vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://imerit.net/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          iMerit
        </a>{" "}
        provides expert-led AI data solutions including annotation, model
        tuning, and evaluation across modalities. If you need physical-world
        capture and enrichment for robotics, Claru is built for physical AI from
        day one.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "iMerit positions itself around advanced AI data solutions and expert-led annotation.",
      "It highlights model tuning services such as supervised fine-tuning, RLHF, and alignment workflows.",
      "iMerit lists evaluation and testing services for AI systems.",
      "Modalities span image/video, LiDAR and sensor fusion, DICOM and 2D/3D, text/PDF, and audio.",
      "Industry focus areas include generative AI, medical imaging, and autonomous mobility.",
      "Claru is purpose-built for physical AI capture and multi-layer enrichment.",
      "Choose iMerit for expert annotation and model tuning; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What iMerit Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: iMerit delivers expert-led annotation and model tuning services. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        iMerit highlights advanced AI data solutions that combine intelligent
        annotation and labeling to accelerate model development.
        {sourceLink("https://imerit.net/", "[1]")}
      </>,
      <>
        The company lists model tuning services including supervised fine
        tuning, RLHF, and alignment workflows.
        {sourceLink("https://imerit.net/", "[2]")}
      </>,
      <>
        iMerit also positions evaluation and testing as part of its AI data
        services. {sourceLink("https://imerit.net/", "[3]")}
      </>,
      <>
        Modalities include image/video, LiDAR and sensor fusion, DICOM and
        2D/3D, text/PDF, and audio. {sourceLink("https://imerit.net/", "[4]")}
      </>,
      <>
        iMerit highlights industry domains such as generative AI, medical
        imaging, and autonomous mobility. {sourceLink("https://imerit.net/", "[5]")}
      </>,
      "iMerit was founded in 2012 in India and has grown into one of the larger AI data services companies, employing thousands of trained annotators across multiple facilities. The company has built deep expertise in specialized domains including medical imaging, autonomous vehicles, and geospatial analysis, where annotation requires subject-matter knowledge beyond basic labeling skills. iMerit has raised significant venture funding and counts major technology companies among its clients. The company differentiates itself through its emphasis on expert-led annotation rather than crowd-sourced labeling, arguing that complex AI applications require annotators with domain training.",
      "For physical AI and robotics teams, iMerit's multi-modal coverage and domain expertise in autonomous mobility are relevant strengths. However, the core distinction between iMerit and capture-first providers like Claru remains: iMerit annotates and tunes models using data that already exists, while robotics teams often need to collect new task-specific data before any annotation or tuning can begin. Egocentric video demonstrations, manipulation sequences, and sensor-aligned capture programs require specialized collection infrastructure that annotation and tuning services do not provide.",
      "If your bottleneck is expert annotation, model tuning, or evaluation, iMerit is a strong fit. If your bottleneck is physical-world capture and enrichment, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "iMerit at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                Advanced AI data solutions with expert annotation.
                {sourceLink("https://imerit.net/", "[1]")}
              </>
            ),
          },
          {
            label: "Model tuning",
            value: (
              <>
                Supervised fine tuning, RLHF, and alignment workflows.
                {sourceLink("https://imerit.net/", "[2]")}
              </>
            ),
          },
          {
            label: "Modalities",
            value: (
              <>
                Image/video, LiDAR and sensor fusion, DICOM/2D/3D, text/PDF,
                audio. {sourceLink("https://imerit.net/", "[4]")}
              </>
            ),
          },
          {
            label: "Domains",
            value: (
              <>
                Generative AI, medical imaging, autonomous mobility, and more.
                {sourceLink("https://imerit.net/", "[5]")}
              </>
            ),
          },
          {
            label: "Best fit",
            value: "Teams needing expert annotation and model tuning",
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
        iMerit provides advanced AI data solutions combining annotation and
        labeling. {sourceLink("https://imerit.net/", "[1]")}
      </>,
      <>
        iMerit lists supervised fine tuning, RLHF, and alignment as model
        tuning services. {sourceLink("https://imerit.net/", "[2]")}
      </>,
      <>
        Evaluation and testing are part of iMerit&apos;s AI data services.
        {sourceLink("https://imerit.net/", "[3]")}
      </>,
      <>
        Modalities include image/video, LiDAR and sensor fusion, DICOM/2D/3D,
        text/PDF, and audio. {sourceLink("https://imerit.net/", "[4]")}
      </>,
      <>
        iMerit highlights domains such as generative AI, medical imaging, and
        autonomous mobility. {sourceLink("https://imerit.net/", "[5]")}
      </>,
    ],
  },
  strengths: {
    title: "Where iMerit Is Strong",
    intro:
      "Based on iMerit&apos;s public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "Expert annotation",
        description: (
          <>
            iMerit emphasizes expert-led annotation and labeling services.
            {sourceLink("https://imerit.net/", "[1]")}
          </>
        ),
      },
      {
        title: "Model tuning services",
        description: (
          <>
            The company lists supervised fine tuning, RLHF, and alignment.
            {sourceLink("https://imerit.net/", "[2]")}
          </>
        ),
      },
      {
        title: "Evaluation and testing",
        description: (
          <>
            iMerit highlights evaluation and testing workflows for AI systems.
            {sourceLink("https://imerit.net/", "[3]")}
          </>
        ),
      },
      {
        title: "Multi-modal coverage",
        description: (
          <>
            Modalities span image/video, LiDAR and sensor fusion, DICOM/2D/3D,
            text/PDF, and audio. {sourceLink("https://imerit.net/", "[4]")}
          </>
        ),
      },
      {
        title: "Domain specialization",
        description: (
          <>
            iMerit lists focus areas such as generative AI, medical imaging, and
            autonomous mobility. {sourceLink("https://imerit.net/", "[5]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "iMerit provides expert annotation and model tuning. Claru is a capture-and-enrichment pipeline for physical AI.",
    cards: [
      {
        title: "Capture-first",
        description:
          "Claru starts by capturing physical-world data instead of focusing only on annotation services.",
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
    title: "iMerit vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing iMerit&apos;s expert data services.",
    columns: [
      { key: "imerit", label: "iMerit" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          imerit: (
            <>
              Expert-led AI data solutions and annotation services.
              {sourceLink("https://imerit.net/", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Model tuning",
        values: {
          imerit: (
            <>
              Supervised fine tuning, RLHF, and alignment workflows.
              {sourceLink("https://imerit.net/", "[2]")}
            </>
          ),
          claru: "Capture pipeline plus enrichment and delivery",
        },
      },
      {
        dimension: "Evaluation",
        values: {
          imerit: (
            <>
              Evaluation and testing services for AI systems.
              {sourceLink("https://imerit.net/", "[3]")}
            </>
          ),
          claru: "Quality scoring tied to capture and enrichment",
        },
      },
      {
        dimension: "Modalities",
        values: {
          imerit: (
            <>
              Image/video, LiDAR/sensor fusion, DICOM/2D/3D, text/PDF, audio.
              {sourceLink("https://imerit.net/", "[4]")}
            </>
          ),
          claru: "Egocentric video, depth, pose, and multi-sensor data",
        },
      },
      {
        dimension: "Industry focus",
        values: {
          imerit: (
            <>
              Generative AI, medical imaging, autonomous mobility, and more.
              {sourceLink("https://imerit.net/", "[5]")}
            </>
          ),
          claru: "Robotics, embodied AI, and world models",
        },
      },
      {
        dimension: "Data capture",
        values: {
          imerit: "Annotation and tuning for existing data",
          claru: "Collector network plus task-specific capture",
        },
      },
      {
        dimension: "Enrichment",
        values: {
          imerit: "Annotation outputs and evaluation workflows",
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Best fit",
        values: {
          imerit: "Teams needing expert annotation and model tuning",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: iMerit vs Claru",
    intro:
      "iMerit specializes in expert data services and model tuning. Claru specializes in capture and enrichment for physical AI.",
    blocks: [
      {
        title: "Services vs pipeline",
        paragraphs: [
          "iMerit provides expert annotation, tuning, and evaluation services.",
          "Claru delivers capture, enrichment, and training-ready datasets.",
        ],
      },
      {
        title: "Model tuning",
        paragraphs: [
          "iMerit highlights supervised fine tuning, RLHF, and alignment services.",
          "Claru focuses on capture-first datasets to support robotics training.",
        ],
      },
      {
        title: "Modalities",
        paragraphs: [
          "iMerit supports modalities including image/video, LiDAR, DICOM, text, and audio.",
          "Claru prioritizes physical-world video and sensor data with enrichment.",
        ],
      },
      {
        title: "Robotics AI data challenges",
        paragraphs: [
          "Modern robotics AI architectures such as vision-language-action networks, diffusion policies, and world models require training data with properties that go beyond annotation and tuning services: egocentric viewpoints matching robot sensor placements, manipulation sequences with hand-object interaction context, depth-aligned frames for spatial reasoning, and action-level temporal segmentation for policy learning.",
          "Claru addresses these upstream data requirements by designing capture protocols specifically for robotics tasks, deploying trained collectors with wearable cameras in real-world environments, and enriching every clip with depth estimation, pose detection, instance segmentation, and optical flow before delivery in robotics-native formats like RLDS and WebDataset.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "iMerit is strong when expert annotation and tuning are the bottleneck, particularly for teams working across specialized domains like medical imaging, autonomous vehicles, and generative AI that require annotators with deep subject-matter expertise.",
          "Claru is stronger when physical-world capture is the bottleneck, especially for robotics teams that need new task-specific data with multi-layer enrichment designed for embodied AI training from the ground up.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When iMerit Is a Fit",
    competitorBullets: [
      "You need expert annotation and validation workflows.",
      "You want model tuning services like SFT, RLHF, and alignment.",
      "You need evaluation and testing services for AI systems.",
      "You work across multiple modalities including LiDAR or medical imaging.",
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
        desc: "Annotation platform vs physical AI specialization.",
        href: "/compare/labelbox-alternatives",
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
      "Choose iMerit when you need expert annotation, model tuning, or evaluation services across multiple modalities.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: iMerit for expert labeling and tuning, Claru for capture-first datasets.",
      "If your project starts with real-world data collection, prioritize providers built for capture and enrichment from day one.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is iMerit?",
        answer: (
          <>
            iMerit provides advanced AI data solutions combining annotation and
            labeling services. {sourceLink("https://imerit.net/", "[1]")}
          </>
        ),
      },
      {
        question: "What model tuning services does iMerit offer?",
        answer: (
          <>
            iMerit lists supervised fine tuning, RLHF, and alignment workflows.
            {sourceLink("https://imerit.net/", "[2]")}
          </>
        ),
      },
      {
        question: "Does iMerit provide evaluation and testing?",
        answer: (
          <>
            iMerit highlights evaluation and testing services for AI systems.
            {sourceLink("https://imerit.net/", "[3]")}
          </>
        ),
      },
      {
        question: "What modalities does iMerit support?",
        answer: (
          <>
            iMerit lists image/video, LiDAR and sensor fusion, DICOM/2D/3D,
            text/PDF, and audio. {sourceLink("https://imerit.net/", "[4]")}
          </>
        ),
      },
      {
        question: "Which industries does iMerit mention?",
        answer: (
          <>
            The site highlights generative AI, medical imaging, and autonomous
            mobility among its focus areas. {sourceLink("https://imerit.net/", "[5]")}
          </>
        ),
      },
      {
        question: "Is iMerit a fit for robotics data capture?",
        answer:
          "iMerit focuses on expert annotation and tuning. Claru is the better fit if you need capture and enrichment for robotics-specific data.",
      },
      {
        question: "When is Claru a better fit?",
        answer:
          "Claru is a better fit when you need capture, enrichment, and delivery of robotics-ready datasets.",
      },
      {
        question: "Can teams use both iMerit and Claru?",
        answer:
          "Some teams use iMerit for expert labeling and tuning and Claru for capture-first physical AI datasets.",
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
    { label: "iMerit", url: "https://imerit.net/" },
  ],
};
