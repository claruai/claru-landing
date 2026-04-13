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

export const reveloComparison: ComparisonData = {
  slug: "revelo-alternatives",
  competitor: {
    name: "Revelo",
    siteUrl: "https://www.revelo.com",
    category: "Human data for LLM code training",
  },
  meta: {
    title: "Revelo Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Revelo and Claru for physical AI training data. Revelo provides expert human data for code LLMs, including SFT, RLHF, and preference datasets. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Revelo alternative",
      "Revelo alternatives",
      "Revelo vs Claru",
      "LLM human data",
      "code LLM datasets",
      "physical AI training data",
      "robotics data capture",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Revelo Alternatives",
    title: "Revelo Alternatives: Code LLM Data vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://www.revelo.com/human-data-llm-training"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Revelo
        </a>{" "}
        provides expert human data for LLM code training. If you need
        physical-world capture and enrichment for robotics, Claru is built for
        physical AI from day one.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Revelo delivers fully managed human data for code-focused LLM training.",
      "Its offerings include SFT, RLHF, audits, and preference datasets.",
      "Revelo also promotes expert-curated code datasets and evaluation suites.",
      "Claru is purpose-built for physical AI capture and multi-layer enrichment.",
      "Choose Revelo for code LLM data; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What Revelo Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Revelo is focused on human data for code LLMs. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        Revelo positions itself as a provider of fully managed human data for
        LLM code training, including SFT, RLHF, audits, and preference datasets.
        {sourceLink("https://www.revelo.com/human-data-llm-training", "[1]")}
      </>,
      <>
        The company also highlights expert-curated code datasets and custom
        evaluation suites for specialized architectures and domains.
        {sourceLink("https://humandata.revelo.com/human-data-expert-curated-code-datasets", "[2]")}
      </>,
      "Revelo was originally known as a Latin American tech talent marketplace connecting software engineers with companies. The company pivoted to focus on human data for LLM training, leveraging its existing network of technical professionals to provide expert-quality code data for SFT, RLHF, and evaluation programs. This pivot positioned Revelo in the growing market for specialized human data that supports large language model development and fine-tuning.",
      "For physical AI and robotics teams, Revelo addresses a fundamentally different problem domain. Code LLM training data involves expert software engineers writing, reviewing, and evaluating code samples. Physical AI training data requires task-specific video captured in real-world environments with dense enrichment layers like depth estimation, pose tracking, instance segmentation, and optical flow. The data types, capture methods, and enrichment requirements have no overlap between these two domains. Teams building embodied AI systems should evaluate providers designed specifically for physical-world data capture and enrichment.",
      "If your bottleneck is code-focused human data for LLM training, Revelo is a strong fit. If your bottleneck is physical-world capture and enrichment, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Revelo at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                Human data for code LLM training. {sourceLink("https://www.revelo.com/human-data-llm-training", "[1]")}
              </>
            ),
          },
          {
            label: "Offerings",
            value: (
              <>
                SFT, RLHF, audits, and preference datasets. {sourceLink("https://www.revelo.com/human-data-llm-training", "[2]")}
              </>
            ),
          },
          {
            label: "Data products",
            value: (
              <>
                Expert-curated code datasets and evaluation suites.
                {sourceLink("https://humandata.revelo.com/human-data-expert-curated-code-datasets", "[3]")}
              </>
            ),
          },
          {
            label: "Best fit",
            value: "Teams training or evaluating code-focused LLMs",
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
        Revelo provides fully managed human data for LLM code training.
        {sourceLink("https://www.revelo.com/human-data-llm-training", "[1]")}
      </>,
      <>
        Revelo highlights SFT, RLHF, audits, and preference datasets.
        {sourceLink("https://www.revelo.com/human-data-llm-training", "[2]")}
      </>,
      <>
        Revelo promotes expert-curated code datasets and evaluation suites.
        {sourceLink("https://humandata.revelo.com/human-data-expert-curated-code-datasets", "[3]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Revelo Is Strong",
    intro:
      "Based on Revelo's public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "Code-focused human data",
        description: (
          <>
            Revelo is positioned around code LLM training data.
            {sourceLink("https://www.revelo.com/human-data-llm-training", "[1]")}
          </>
        ),
      },
      {
        title: "Full-spectrum data programs",
        description: (
          <>
            Offerings include SFT, RLHF, audits, and preference datasets.
            {sourceLink("https://www.revelo.com/human-data-llm-training", "[2]")}
          </>
        ),
      },
      {
        title: "Expert-curated datasets",
        description: (
          <>
            The Human Data program highlights custom code datasets and
            evaluation suites. {sourceLink("https://humandata.revelo.com/human-data-expert-curated-code-datasets", "[3]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "Revelo focuses on code LLM data. Claru is a capture-and-enrichment pipeline for physical AI.",
    cards: [
      {
        title: "Capture-first",
        description:
          "Claru starts by capturing physical-world data instead of labeling text or code-only datasets.",
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
    title: "Revelo vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing Revelo's code LLM specialization.",
    columns: [
      { key: "revelo", label: "Revelo" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          revelo: (
            <>
              Human data for code LLM training.
              {sourceLink("https://www.revelo.com/human-data-llm-training", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Data types",
        values: {
          revelo: "Code, preference, and evaluation datasets",
          claru: "Egocentric video, manipulation, depth, pose, segmentation",
        },
      },
      {
        dimension: "Capture model",
        values: {
          revelo: "Expert human data programs for LLMs",
          claru: "Collector network plus task-specific capture",
        },
      },
      {
        dimension: "Enrichment",
        values: {
          revelo: "Human preference signals and evaluation suites",
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Best fit",
        values: {
          revelo: "Teams training or evaluating code LLMs",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Revelo vs Claru",
    intro:
      "Revelo specializes in code LLM data. Claru specializes in physical-world capture and enrichment.",
    blocks: [
      {
        title: "Code data vs physical data",
        paragraphs: [
          "Revelo focuses on human data for LLM code training and evaluation.",
          "Claru focuses on real-world capture and enrichment for robotics tasks.",
        ],
      },
      {
        title: "Output format",
        paragraphs: [
          "Revelo outputs code datasets and preference signals for model training.",
          "Claru outputs multimodal robotics-ready datasets with rich annotations.",
        ],
      },
      {
        title: "Domain differences",
        paragraphs: [
          "Code LLM training and physical AI training are fundamentally different data domains. Code data involves structured text written by software engineers, with quality measured by correctness, style, and complexity. Physical AI data involves video and sensor streams captured in real environments, with quality measured by task coverage, enrichment density, and temporal alignment.",
          "Revelo excels in the code domain because of its network of technical professionals. Claru excels in the physical AI domain because of its capture infrastructure, enrichment pipelines, and robotics-native delivery formats.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "Revelo is a strong fit for code LLM programs that need expert-curated datasets, SFT data, RLHF feedback, and evaluation suites from experienced software engineers. If your model is a code assistant or code generation system, Revelo provides the domain expertise to create high-quality training data.",
          "Claru is better when the bottleneck is physical-world capture and enrichment. If your model needs egocentric video with aligned depth maps, pose tracks, and segmentation masks delivered in robotics-native formats like WebDataset or HDF5, Claru is designed for that pipeline.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Revelo Is a Fit",
    competitorBullets: [
      "You need expert-curated code datasets for LLM training or evaluation.",
      "You are running SFT, RLHF, or preference data programs.",
      "You want a managed human data partner for code-focused LLMs.",
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
        title: "Surge AI Alternatives",
        desc: "RLHF services vs physical AI capture.",
        href: "/compare/surge-ai-alternatives",
      },
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
        title: "Claru vs Luel",
        desc: "Marketplace data vs training-ready physical AI datasets.",
        href: "/compare/claru-vs-luel",
      },
    ],
  },
  decision: {
    title: "How to Choose",
    paragraphs: [
      "Choose Revelo when you need expert-curated code datasets and human preference data for LLMs.",
      "Choose Claru when you need capture and enrichment for physical-world robotics data.",
      "Some teams use both: Revelo for code LLM data, Claru for physical AI datasets.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Revelo?",
        answer: (
          <>
            Revelo provides fully managed human data for LLM code training. Originally a Latin American tech talent marketplace, Revelo pivoted to focus on human data for large language model development. The company leverages its network of technical professionals to deliver expert-quality code datasets including SFT data, RLHF feedback, preference datasets, and custom evaluation suites. Revelo targets AI labs and companies that are training or fine-tuning code-focused language models.
            {sourceLink("https://www.revelo.com/human-data-llm-training", "[1]")}
          </>
        ),
      },
      {
        question: "What data programs does Revelo offer?",
        answer: (
          <>
            Revelo offers several data programs for code LLM training including supervised fine-tuning data, reinforcement learning from human feedback datasets, code audits, and preference datasets. These programs are designed for teams that need expert software engineers to create, review, and evaluate code samples at scale. The managed service model means Revelo handles recruiting, quality assurance, and delivery so AI teams can focus on model development.
            {sourceLink("https://www.revelo.com/human-data-llm-training", "[2]")}
          </>
        ),
      },
      {
        question: "Does Revelo provide curated code datasets?",
        answer: (
          <>
            Yes. Revelo's Human Data program highlights expert-curated code datasets and custom evaluation suites for specialized architectures and domains. These datasets are created by experienced software engineers who can produce high-quality code samples across multiple programming languages and complexity levels. The evaluation suites help teams benchmark their code models against domain-specific criteria.
            {sourceLink("https://humandata.revelo.com/human-data-expert-curated-code-datasets", "[3]")}
          </>
        ),
      },
      {
        question: "Is Revelo a fit for robotics data?",
        answer:
          "Revelo focuses exclusively on code and text data for LLM training rather than physical-world data for robotics. The company's expertise is in software engineering domain knowledge, not in sensor-rich video capture or physical AI enrichment. Teams building embodied AI systems that require task-specific video capture, enrichment layers like depth estimation and pose tracking, and delivery in robotics-native formats should evaluate providers designed specifically for physical AI data pipelines.",
      },
      {
        question: "When is Claru a better fit?",
        answer:
          "Claru is a better fit when your primary need is capturing physical-world data and enriching it for robotics or embodied AI training. This includes scenarios where you need egocentric video from specific environments, enrichment layers such as monocular depth, pose estimation, segmentation, and optical flow, and delivery in formats like WebDataset, HDF5, or RLDS. If your team is training a code generation or code assistance model, Revelo is the more appropriate choice for that domain.",
      },
      {
        question: "Can teams use both Revelo and Claru?",
        answer:
          "Using both Revelo and Claru would make sense for organizations developing both code-focused LLMs and physical AI robotics systems. This is a relatively uncommon combination, but some large AI labs work across both domains. Revelo would supply expert code data for language model training, while Claru would provide capture-first physical AI datasets for robotics training. The two providers address entirely separate data needs.",
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
    { label: "Revelo Human Data", url: "https://www.revelo.com/human-data-llm-training" },
    {
      label: "Revelo Human Data Datasets",
      url: "https://humandata.revelo.com/human-data-expert-curated-code-datasets",
    },
  ],
};
