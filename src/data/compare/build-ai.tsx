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

export const buildAiComparison: ComparisonData = {
  slug: "build-ai-alternatives",
  competitor: {
    name: "Build AI",
    siteUrl: "https://www.build.ai",
    category: "Egocentric dataset provider",
  },
  meta: {
    title: "Build AI Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Build AI and Claru for physical AI training data. Build AI highlights the Egocentric-100K dataset with 100K+ hours and 10.8B frames of egocentric video. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Build AI alternative",
      "Build AI alternatives",
      "Build AI vs Claru",
      "egocentric dataset",
      "Egocentric-100K",
      "robotics dataset",
      "physical AI training data",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Build AI Alternatives",
    title: "Build AI Alternatives: Egocentric Dataset vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://www.build.ai/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Build AI
        </a>{" "}
        highlights the Egocentric-100K dataset, presented as 100K hours and
        10.8B frames of egocentric video. If you need physical-world capture and
        enrichment for robotics, Claru is built for physical AI from day one.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Build AI highlights the Egocentric-100K dataset on its homepage.",
      "Egocentric-100K lists 100,405 total hours and 10.8 billion total frames.",
      "The dataset includes 2,010,759 video clips and a WebDataset format.",
      "Tags include egocentric, video, and robotics.",
      "The dataset is described as the largest dataset of manual labor.",
      "Claru is purpose-built for physical AI capture and multi-layer enrichment.",
      "Choose Build AI for a large egocentric dataset; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What Build AI Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Build AI highlights a large egocentric dataset. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        Build AI&apos;s homepage promotes the Egocentric-100K dataset and lists
        100K hours and 10.8B frames. {sourceLink("https://www.build.ai/", "[1]")}
      </>,
      <>
        The dataset card lists 100,405 total hours and 10.8 billion total
        frames. {sourceLink("https://huggingface.co/datasets/builddotai/Egocentric-100K", "[2]")}
      </>,
      <>
        Egocentric-100K includes 2,010,759 video clips and is formatted as
        WebDataset. {sourceLink("https://huggingface.co/datasets/builddotai/Egocentric-100K", "[3]")}
      </>,
      <>
        Tags on the dataset include video, egocentric, and robotics.
        {sourceLink("https://huggingface.co/datasets/builddotai/Egocentric-100K", "[4]")}
      </>,
      <>
        The dataset card describes Egocentric-100K as the largest dataset of
        manual labor. {sourceLink("https://huggingface.co/datasets/builddotai/Egocentric-100K", "[5]")}
      </>,
      "If your bottleneck is accessing large-scale egocentric datasets, Build AI is a strong fit. If your bottleneck is physical-world capture and enrichment, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Build AI at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                Egocentric-100K dataset highlighted on homepage.
                {sourceLink("https://www.build.ai/", "[1]")}
              </>
            ),
          },
          {
            label: "Scale",
            value: (
              <>
                100,405 total hours and 10.8B frames.
                {sourceLink("https://huggingface.co/datasets/builddotai/Egocentric-100K", "[2]")}
              </>
            ),
          },
          {
            label: "Format",
            value: (
              <>
                WebDataset format with 2,010,759 video clips.
                {sourceLink("https://huggingface.co/datasets/builddotai/Egocentric-100K", "[3]")}
              </>
            ),
          },
          {
            label: "Tags",
            value: (
              <>
                Video, egocentric, robotics.
                {sourceLink("https://huggingface.co/datasets/builddotai/Egocentric-100K", "[4]")}
              </>
            ),
          },
          {
            label: "Best fit",
            value: "Teams seeking a large-scale egocentric dataset",
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
        Build AI highlights the Egocentric-100K dataset with 100K hours and
        10.8B frames on its homepage.
        {sourceLink("https://www.build.ai/", "[1]")}
      </>,
      <>
        The dataset card lists 100,405 total hours and 10.8 billion total
        frames. {sourceLink("https://huggingface.co/datasets/builddotai/Egocentric-100K", "[2]")}
      </>,
      <>
        Egocentric-100K includes 2,010,759 video clips and is formatted as
        WebDataset. {sourceLink("https://huggingface.co/datasets/builddotai/Egocentric-100K", "[3]")}
      </>,
      <>
        Tags include video, egocentric, and robotics.
        {sourceLink("https://huggingface.co/datasets/builddotai/Egocentric-100K", "[4]")}
      </>,
      <>
        Egocentric-100K is described as the largest dataset of manual labor.
        {sourceLink("https://huggingface.co/datasets/builddotai/Egocentric-100K", "[5]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Build AI Is Strong",
    intro:
      "Based on Build AI's public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "Large-scale egocentric data",
        description: (
          <>
            Egocentric-100K lists 100,405 total hours and 10.8B frames.
            {sourceLink("https://huggingface.co/datasets/builddotai/Egocentric-100K", "[2]")}
          </>
        ),
      },
      {
        title: "Video clip volume",
        description: (
          <>
            The dataset includes 2,010,759 video clips.
            {sourceLink("https://huggingface.co/datasets/builddotai/Egocentric-100K", "[3]")}
          </>
        ),
      },
      {
        title: "Robotics-relevant tags",
        description: (
          <>
            Tags include video, egocentric, and robotics.
            {sourceLink("https://huggingface.co/datasets/builddotai/Egocentric-100K", "[4]")}
          </>
        ),
      },
      {
        title: "Manual labor focus",
        description: (
          <>
            The dataset is described as the largest dataset of manual labor.
            {sourceLink("https://huggingface.co/datasets/builddotai/Egocentric-100K", "[5]")}
          </>
        ),
      },
      {
        title: "WebDataset format",
        description: (
          <>
            Egocentric-100K is structured in WebDataset format.
            {sourceLink("https://huggingface.co/datasets/builddotai/Egocentric-100K", "[3]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "Build AI focuses on a large egocentric dataset. Claru is a capture-and-enrichment pipeline for physical AI.",
    cards: [
      {
        title: "Capture-first",
        description:
          "Claru starts by capturing physical-world data instead of relying on a fixed dataset.",
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
    title: "Build AI vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing Build AI's dataset scale.",
    columns: [
      { key: "build", label: "Build AI" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          build: (
            <>
              Egocentric-100K dataset highlighted on homepage.
              {sourceLink("https://www.build.ai/", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Scale",
        values: {
          build: (
            <>
              100,405 total hours and 10.8B frames.
              {sourceLink("https://huggingface.co/datasets/builddotai/Egocentric-100K", "[2]")}
            </>
          ),
          claru: "Task-specific capture and enrichment",
        },
      },
      {
        dimension: "Format",
        values: {
          build: (
            <>
              WebDataset format with 2,010,759 video clips.
              {sourceLink("https://huggingface.co/datasets/builddotai/Egocentric-100K", "[3]")}
            </>
          ),
          claru: "Capture pipeline plus enrichment and delivery",
        },
      },
      {
        dimension: "Tags",
        values: {
          build: (
            <>
              Video, egocentric, robotics tags.
              {sourceLink("https://huggingface.co/datasets/builddotai/Egocentric-100K", "[4]")}
            </>
          ),
          claru: "Capture tailored to robotics tasks",
        },
      },
      {
        dimension: "Enrichment",
        values: {
          build: "Dataset scale and structure",
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Best fit",
        values: {
          build: "Teams needing large egocentric datasets",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Build AI vs Claru",
    intro:
      "Build AI delivers a large egocentric dataset. Claru delivers capture-first, enrichment-heavy datasets.",
    blocks: [
      {
        title: "Dataset vs pipeline",
        paragraphs: [
          "Build AI focuses on a large, fixed egocentric dataset.",
          "Claru focuses on capturing new data tailored to specific tasks.",
        ],
      },
      {
        title: "Scale vs specificity",
        paragraphs: [
          "Egocentric-100K emphasizes scale with 100K+ hours and billions of frames.",
          "Claru emphasizes task-specific capture and enrichment depth.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "Build AI is strong when scale of egocentric data is the bottleneck.",
          "Claru is stronger when custom capture and enrichment are required.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Build AI Is a Fit",
    competitorBullets: [
      "You need a large egocentric dataset with massive scale.",
      "You want a WebDataset-formatted collection ready for streaming.",
      "You are training on broad manual-labor egocentric data.",
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
        title: "Appen Alternatives",
        desc: "Managed labeling services vs capture-first robotics datasets.",
        href: "/compare/appen-alternatives",
      },
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
        title: "Claru vs Luel",
        desc: "Marketplace data vs training-ready physical AI datasets.",
        href: "/compare/claru-vs-luel",
      },
    ],
  },
  decision: {
    title: "How to Choose",
    paragraphs: [
      "Choose Build AI when you need a large egocentric dataset like Egocentric-100K.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: Build AI for scale, Claru for capture-first datasets.",
      "If your project requires task-specific physical data collection, prioritize providers built for capture and enrichment.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Build AI?",
        answer: (
          <>
            Build AI highlights the Egocentric-100K dataset on its homepage.
            {sourceLink("https://www.build.ai/", "[1]")}
          </>
        ),
      },
      {
        question: "How large is Egocentric-100K?",
        answer: (
          <>
            The dataset card lists 100,405 total hours and 10.8 billion frames.
            {sourceLink("https://huggingface.co/datasets/builddotai/Egocentric-100K", "[2]")}
          </>
        ),
      },
      {
        question: "What format is the dataset in?",
        answer: (
          <>
            Egocentric-100K is provided in WebDataset format with 2,010,759
            video clips. {sourceLink("https://huggingface.co/datasets/builddotai/Egocentric-100K", "[3]")}
          </>
        ),
      },
      {
        question: "Is the dataset relevant to robotics?",
        answer: (
          <>
            The dataset tags include video, egocentric, and robotics.
            {sourceLink("https://huggingface.co/datasets/builddotai/Egocentric-100K", "[4]")}
          </>
        ),
      },
      {
        question: "How is Egocentric-100K positioned?",
        answer: (
          <>
            The dataset card describes it as the largest dataset of manual
            labor. {sourceLink("https://huggingface.co/datasets/builddotai/Egocentric-100K", "[5]")}
          </>
        ),
      },
      {
        question: "When is Claru a better fit?",
        answer:
          "Claru is a better fit when you need capture, enrichment, and delivery of robotics-ready datasets.",
      },
      {
        question: "Can teams use both Build AI and Claru?",
        answer:
          "Some teams use Build AI for a large egocentric dataset and Claru for capture-first physical AI datasets.",
      },
      {
        question: "Is Build AI a fit for custom capture?",
        answer:
          "Build AI highlights a fixed dataset. Claru is better for task-specific capture and enrichment.",
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
    { label: "Build AI", url: "https://www.build.ai/" },
    { label: "Egocentric-100K Dataset", url: "https://huggingface.co/datasets/builddotai/Egocentric-100K" },
  ],
};
