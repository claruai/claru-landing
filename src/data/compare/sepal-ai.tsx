import Link from "next/link";
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

export const sepalAiComparison: ComparisonData = {
  slug: "sepal-ai-alternatives",
  competitor: {
    name: "Sepal AI",
    siteUrl: "https://www.sepalai.com",
    category: "Expert-led data research for advanced AI",
  },
  meta: {
    title: "Sepal AI Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Sepal AI and Claru for advanced AI training data. Sepal focuses on expert-led RL environments and outcome-verifiable tasks. Claru specializes in physical AI capture and enrichment.",
    keywords: [
      "Sepal AI alternative",
      "Sepal AI alternatives",
      "Sepal AI vs Claru",
      "advanced AI data",
      "RL environments",
      "expert data labeling",
      "physical AI training data",
      "robotics data pipelines",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Sepal AI Alternatives",
    title: "Sepal AI Alternatives: Expert RL Environments vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://www.sepalai.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Sepal AI
        </a>{" "}
        positions itself as a data research company focused on RL environments
        and outcome-verifiable tasks for advanced AI systems. Claru is
        purpose-built for{" "}
        <Link
          href="/training-data-for-robotics"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          physical AI training data
        </Link>
        , with capture and enrichment pipelines for robotics and world models.
        This page compares the two approaches and when each is a fit.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Sepal AI focuses on expert-led RL environments, outcome-verifiable tasks, and data research for advanced AI systems.",
      "Sepal focuses on expert networks and task design rather than physical-world capture.",
      "Claru focuses on real-world physical AI data capture, enrichment, and robotics-native delivery.",
      "Choose Sepal when you need expert-designed RL environments or evaluation data.",
      "Choose Claru when you need real-world video and physical AI annotations for robotics training.",
    ],
  },
  overview: {
    title: "What Sepal AI Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Sepal is built around expert-led RL environments and outcome-verifiable tasks. Claru is built around real-world capture and enrichment for physical AI training.",
      <>
        Sepal AI describes itself as a data research company that builds RL
        environments and outcome-verifiable tasks for advanced AI. The company
        highlights partnerships with frontier labs and enterprises and leans on
        expert-driven work for complex domains.{" "}
        {sourceLink("https://www.sepalai.com/", "[3]")}
      </>,
      <>
        Their platform and operational process are designed around building RL
        environments and running large-scale human data projects. Sepal also
        calls out an expert network and tooling that can source, vet, and
        onboard specialists quickly when tasks require deep domain knowledge.{" "}
        {sourceLink("https://www.ycombinator.com/companies/sepal-ai", "[1]")}
      </>,
      "If your work depends on real-world physical data capture and enriched sensor signals, the problem looks different. Robotics teams often need a capture network, enrichment layers, and delivery formats tuned for physical AI training pipelines.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Sepal AI at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                RL environments, outcome-verifiable tasks, and expert-led data
                research.{" "}
                {sourceLink("https://www.ycombinator.com/companies/sepal-ai", "[1]")}
              </>
            ),
          },
          {
            label: "Core outputs",
            value: (
              <>
                Evaluation and training datasets from expert-designed tasks and
                environments.{" "}
                {sourceLink("https://www.ycombinator.com/companies/sepal-ai", "[1]")}
              </>
            ),
          },
          {
            label: "Expert network",
            value: (
              <>
                20k+ experts across STEM and professional services.{" "}
                {sourceLink("https://www.ycombinator.com/companies/sepal-ai", "[1]")}
              </>
            ),
          },
          {
            label: "Status",
            value: (
              <>
                Acquired by Mercor (2026).{" "}
                {sourceLink(
                  "https://www.orrick.com/en/News/2026/02/Mercor-Acquires-Sepal-AI",
                  "[2]"
                )}
              </>
            ),
          },
        ],
      },
      {
        title: "Claru at a Glance",
        items: [
          {
            label: "Focus",
            value:
              "Physical AI training data for robotics, world models, and embodied AI",
          },
          {
            label: "Capture",
            value:
              "Wearable camera network plus teleoperation and task-specific collection",
          },
          {
            label: "Enrichment",
            value:
              "Depth, pose, segmentation, optical flow, AI captions aligned to each clip",
          },
          {
            label: "Best fit",
            value:
              "Robotics teams needing real-world capture and training-ready delivery",
          },
        ],
      },
    ],
  },
  keyClaims: {
    title: "Key Claims (With Sources)",
    claims: [
      <>
        Sepal positions itself around RL environments and outcome-verifiable
        tasks for advanced AI.{" "}
        {sourceLink("https://www.ycombinator.com/companies/sepal-ai", "[1]")}
      </>,
      <>
        Sepal highlights an expert network supporting complex task design.{" "}
        {sourceLink("https://www.ycombinator.com/companies/sepal-ai", "[1]")}
      </>,
      <>
        Sepal was acquired by Mercor.{" "}
        {sourceLink(
          "https://www.orrick.com/en/News/2026/02/Mercor-Acquires-Sepal-AI",
          "[2]"
        )}
      </>,
      <>
        Sepal describes itself as a data research partner for advanced AI
        systems. {sourceLink("https://www.sepalai.com/", "[3]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Sepal AI Is Strong",
    intro:
      "Sepal AI&apos;s public materials focus on expert-led research workflows and structured RL environments. These are areas where they are a strong fit.",
    cards: [
      {
        title: "RL environments and tasks",
        description: (
          <>
            Sepal AI focuses on building RL environments and outcome-verifiable
            tasks for advanced AI systems, which is useful for evaluation and
            controlled training setups.{" "}
            {sourceLink("https://www.ycombinator.com/companies/sepal-ai", "[1]")}
          </>
        ),
      },
      {
        title: "Expert network",
        description: (
          <>
            Sepal highlights an expert network and tooling to source, vet, and
            onboard specialists for complex tasks that require domain
            knowledge.{" "}
            {sourceLink("https://www.ycombinator.com/companies/sepal-ai", "[1]")}
          </>
        ),
      },
      {
        title: "Data research orientation",
        description: (
          <>
            The company positions itself as a data research partner for
            frontier labs and enterprises working on advanced AI systems and
            challenging benchmarks.{" "}
            {sourceLink("https://www.sepalai.com/", "[3]")}
          </>
        ),
      },
      {
        title: "Dataset factory platform",
        description: (
          <>
            Sepal&apos;s YC profile describes a cloud-native agent dataset factory
            for standardized evaluation and training data workflows.{" "}
            {sourceLink("https://www.ycombinator.com/companies/sepal-ai", "[1]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Why Physical AI Teams Evaluate Alternatives",
    intro:
      "Robotics and embodied AI teams often need data captured from the physical world, along with dense enrichment layers that serve as model inputs.",
    cards: [
      {
        title: "Real-world capture",
        description:
          "Physical AI models improve fastest with task-specific, real-world video and sensor data that require dedicated capture programs.",
      },
      {
        title: "Enrichment layers",
        description:
          "Depth, pose, segmentation, and motion signals are core training inputs for robotics and world models.",
      },
      {
        title: "Robotics taxonomies",
        description:
          "Affordances, action boundaries, and manipulation intent demand specialized annotation guidelines and QA.",
      },
    ],
  },
  comparison: {
    title: "Sepal AI vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison centers on physical AI needs while acknowledging Sepal AI&apos;s focus on expert RL environments and data research.",
    columns: [
      { key: "sepal", label: "Sepal AI" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          sepal: (
            <>
              Expert-led data research, RL environments, and outcome-verifiable
              tasks.{" "}
              {sourceLink("https://www.ycombinator.com/companies/sepal-ai", "[1]")}
            </>
          ),
          claru:
            "Physical AI training data for robotics, world models, and embodied AI",
        },
      },
      {
        dimension: "Core output",
        values: {
          sepal: (
            <>
              Structured environments and evaluation data for advanced AI
              tasks.{" "}
              {sourceLink("https://www.ycombinator.com/companies/sepal-ai", "[1]")}
            </>
          ),
          claru:
            "Real-world physical AI datasets with capture and enrichment",
        },
      },
      {
        dimension: "Expert network",
        values: {
          sepal: (
            <>
              Expert-driven task design with rapid onboarding for specialists.{" "}
              {sourceLink("https://www.ycombinator.com/companies/sepal-ai", "[1]")}
            </>
          ),
          claru:
            "Trained contributors and expert annotators focused on physical tasks",
        },
      },
      {
        dimension: "Data capture",
        values: {
          sepal:
            "Focus on task design and RL environments rather than physical capture",
          claru:
            "Field capture network plus teleoperation and task-specific data collection",
        },
      },
      {
        dimension: "Enrichment",
        values: {
          sepal:
            "Evaluation signals tied to tasks and environments",
          claru:
            "Depth, pose, segmentation, optical flow, AI captions",
        },
      },
      {
        dimension: "Platform orientation",
        values: {
          sepal: (
            <>
              Cloud-native dataset factory for standardized evaluation and
              training data.{" "}
              {sourceLink("https://www.ycombinator.com/companies/sepal-ai", "[1]")}
            </>
          ),
          claru:
            "End-to-end physical AI pipeline from capture to delivery",
        },
      },
      {
        dimension: "Use cases",
        values: {
          sepal:
            "Advanced AI research, expert-led benchmarks, outcome-verifiable tasks",
          claru:
            "Robotics training data and real-world physical AI modeling",
        },
      },
      {
        dimension: "Delivery formats",
        values: {
          sepal:
            "Research-oriented outputs for tasks and evaluations",
          claru:
            "WebDataset, HDF5, RLDS, Parquet, COCO, and client-native formats",
        },
      },
      {
        dimension: "Best fit",
        values: {
          sepal:
            "Teams that need expert-driven RL environments and evaluation data",
          claru:
            "Teams that need capture, enrichment, and robotics-ready delivery",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Sepal AI vs Claru",
    intro:
      "Sepal AI and Claru solve different problems. Sepal focuses on expert-designed RL environments and evaluation data, while Claru builds physical AI datasets from capture to delivery.",
    blocks: [
      {
        title: "Sepal&apos;s focus on environments and experts",
        paragraphs: [
          "Sepal AI builds RL environments and outcome-verifiable tasks. The company positions itself as a data research partner for advanced AI systems and highlights its expert network.",
          "That model is powerful when tasks require deep domain expertise and precise evaluation signals that can be scored objectively.",
        ],
      },
      {
        title: "Outcome-verifiable tasks vs physical capture",
        paragraphs: [
          "Outcome-verifiable tasks are ideal for controlled evaluation and structured RL training. They are not the same as capturing real-world physical data from kitchens, warehouses, or outdoor environments.",
          "Physical AI needs real footage, not just task definitions. That is why capture and enrichment pipelines sit at the center of Claru&apos;s model.",
        ],
      },
      {
        title: "Expert network vs contributor network",
        paragraphs: [
          "Sepal focuses on specialists and experts for complex tasks, which is a better fit for research-heavy domains.",
          "Claru pairs trained contributors with expert annotators who are specifically trained on physical AI taxonomies, enabling large-scale data capture with consistent labeling.",
        ],
      },
      {
        title: "Where each provider fits",
        paragraphs: [
          "Sepal is a strong choice for RL environments, evaluation datasets, and expert-led research tasks where correctness is defined by outcomes.",
          "Claru is the better choice when the missing ingredient is real-world physical data and the enrichment layers that make it usable for robotics training.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Sepal AI Is a Fit",
    competitorBullets: [
      "You need expert-designed RL environments or outcome-verifiable tasks.",
      "Your work requires specialists rather than a large crowd workforce.",
      "You are focused on research benchmarks, evaluation datasets, or complex domain tasks.",
      "You want a data research partner to design and run the task pipeline.",
    ],
    claruTitle: "When Claru Is a Fit",
    claruBullets: [
      "You need real-world capture of physical tasks, not just simulated environments.",
      "Your model depends on dense enrichment layers like depth, pose, and segmentation.",
      "You want training-ready datasets delivered in robotics-native formats.",
      "You need a capture-to-delivery pipeline optimized for physical AI.",
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
        desc: "Expert RLHF vs physical AI data capture.",
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
      "If you need expert-designed RL environments or outcome-verifiable evaluation tasks, Sepal is built for that problem. Their model centers on expert networks and research-driven task design.",
      "If the critical gap is real-world physical data capture and enrichment, Claru is the better fit. The pipeline is built to deliver robotics-ready datasets from the ground up.",
      "Some teams use both: Sepal for evaluation and specialist tasks, Claru for physical AI data that powers embodied models.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Sepal AI?",
        answer: (
          <>
            Sepal AI focuses on expert-led data research, RL environments, and
            outcome-verifiable tasks for advanced AI systems.{" "}
            {sourceLink("https://www.ycombinator.com/companies/sepal-ai", "[1]")}
          </>
        ),
      },
      {
        question: "Does Sepal AI build RL environments?",
        answer: (
          <>
            Yes. Sepal AI highlights RL environments and structured tasks as
            part of its core offering for advanced AI evaluation and training.{" "}
            {sourceLink("https://www.ycombinator.com/companies/sepal-ai", "[1]")}
          </>
        ),
      },
      {
        question: "Is Sepal AI part of Mercor?",
        answer: (
          <>
            Sepal AI states it has been acquired by Mercor and is now part of
            Mercor&apos;s organization.{" "}
            {sourceLink(
              "https://www.orrick.com/en/News/2026/02/Mercor-Acquires-Sepal-AI",
              "[2]"
            )}
          </>
        ),
      },
      {
        question: "Can Sepal AI provide physical-world data capture?",
        answer: (
          <>
            Sepal AI focuses on expert task design and RL environments. If you
            need physical-world capture and enrichment, a specialist like Claru
            is built for that pipeline.{" "}
            {sourceLink("https://www.ycombinator.com/companies/sepal-ai", "[1]")}
          </>
        ),
      },
      {
        question: "How is Sepal AI different from Claru?",
        answer: (
          <>
            Sepal AI focuses on expert-driven task design and RL environments.
            Claru focuses on capturing and enriching real-world physical AI data
            for robotics and world models.{" "}
            {sourceLink("https://www.ycombinator.com/companies/sepal-ai", "[1]")}
          </>
        ),
      },
      {
        question: "What outputs does Claru deliver?",
        answer:
          "Claru delivers training-ready datasets in WebDataset, HDF5, RLDS, Parquet, and COCO, with enrichment layers aligned as side-channels.",
      },
    ],
  },
  cta: {
    title: "Need Training Data for Physical AI?",
    description:
      "Tell us what your model needs to learn. We will scope the dataset, define the collection protocol, and deliver training-ready data.",
    primary: {
      label: "Talk to Our Team",
      href: "/#contact",
    },
    secondary: {
      label: "Browse the Data Catalog",
      href: "/data-catalog",
    },
  },
  sources: [
    { label: "YC Sepal AI", url: "https://www.ycombinator.com/companies/sepal-ai" },
    { label: "Mercor Acquires Sepal AI", url: "https://www.orrick.com/en/News/2026/02/Mercor-Acquires-Sepal-AI" },
    { label: "Sepal AI", url: "https://www.sepalai.com/" },
  ],
};
