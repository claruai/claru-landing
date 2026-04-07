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

export const datacurveComparison: ComparisonData = {
  slug: "datacurve-alternatives",
  competitor: {
    name: "Datacurve",
    siteUrl: "https://datacurve.ai",
    category: "Frontier coding data for foundation models",
  },
  meta: {
    title: "Datacurve Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Datacurve and Claru for physical AI training data. Datacurve provides frontier coding data for foundation model labs, including SFT, RLHF, and evaluation data. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Datacurve alternative",
      "Datacurve alternatives",
      "Datacurve vs Claru",
      "coding data",
      "RLHF datasets",
      "physical AI training data",
      "robotics data capture",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Datacurve Alternatives",
    title: "Datacurve Alternatives: Coding Data vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://datacurve.ai"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Datacurve
        </a>{" "}
        provides frontier coding data for foundation model labs. If you need
        physical-world capture and enrichment for robotics, Claru is built for
        physical AI from day one.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Datacurve focuses on frontier coding data for foundation model labs.",
      "It offers high-quality post-training and evaluation data, including SFT, RL environments, and RLHF.",
      "Datacurve highlights agentic workflow traces and complex coding tasks.",
      "Claru is purpose-built for physical AI capture and multi-layer enrichment.",
      "Choose Datacurve for coding data; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What Datacurve Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Datacurve produces coding data for foundation model labs. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        Datacurve positions itself as a provider of frontier coding data for
        foundation model labs and enterprises. {sourceLink("https://datacurve.ai/", "[1]")}
      </>,
      <>
        The company highlights post-training and evaluation data formats,
        including SFT, reinforcement learning environments, and RLHF.
        {sourceLink("https://datacurve.ai/", "[2]")}
      </>,
      <>
        Datacurve also describes agentic workflow traces captured through a
        custom IDE and other complex coding tasks.
        {sourceLink("https://datacurve.ai/", "[3]")}
      </>,
      <>
        Datacurve was founded in 2024 by Serena Ge and Charley Lee and is
        based in San Francisco. The company went through Y Combinator&apos;s W24
        batch and has raised approximately $17.7 million in total funding,
        including a $15 million Series A led by Chemistry with participation
        from DeepMind, Vercel, Anthropic, and OpenAI employees.{" "}
        {sourceLink("https://techcrunch.com/2025/10/09/datacurve-raises-15-million-to-take-on-scaleai/", "[4]")}
      </>,
      <>
        Datacurve uses a bounty hunter system to attract skilled software
        engineers to complete the hardest-to-source coding datasets,
        distributing over $1 million in bounties. The company captures
        agentic workflow traces through a custom IDE and produces coding
        tasks that go beyond simple completions into complex multi-step
        software engineering scenarios.{" "}
        {sourceLink("https://datacurve.ai/", "[5]")}
      </>,
      "For robotics teams, Datacurve is not a relevant provider since it focuses exclusively on coding and software engineering data for LLM training. If your work involves embodied AI, manipulation policies, or world models that need physical-world data, you need a fundamentally different data pipeline.",
      "If your bottleneck is coding data for LLMs or agents, Datacurve is a strong fit. If your bottleneck is physical-world capture and enrichment, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Datacurve at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                Frontier coding data for foundation model labs.
                {sourceLink("https://datacurve.ai/", "[1]")}
              </>
            ),
          },
          {
            label: "Data formats",
            value: (
              <>
                SFT, RL environments, and RLHF for coding tasks.
                {sourceLink("https://datacurve.ai/", "[2]")}
              </>
            ),
          },
          {
            label: "Specialization",
            value: (
              <>
                Agentic workflow traces and complex coding tasks.
                {sourceLink("https://datacurve.ai/", "[3]")}
              </>
            ),
          },
          {
            label: "Best fit",
            value: "Teams training or evaluating code-focused foundation models",
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
        Datacurve focuses on frontier coding data for foundation model labs.
        {sourceLink("https://datacurve.ai/", "[1]")}
      </>,
      <>
        The company highlights SFT, RL environments, and RLHF data formats.
        {sourceLink("https://datacurve.ai/", "[2]")}
      </>,
      <>
        Datacurve describes agentic workflow traces and complex coding tasks.
        {sourceLink("https://datacurve.ai/", "[3]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Datacurve Is Strong",
    intro:
      "Based on Datacurve's public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "Coding data specialization",
        description: (
          <>
            Datacurve focuses on frontier coding data for foundation models.
            {sourceLink("https://datacurve.ai/", "[1]")}
          </>
        ),
      },
      {
        title: "Post-training formats",
        description: (
          <>
            The offering includes SFT, RL environments, and RLHF data.
            {sourceLink("https://datacurve.ai/", "[2]")}
          </>
        ),
      },
      {
        title: "Agentic traces",
        description: (
          <>
            Datacurve highlights agentic workflow traces captured via a custom
            IDE. {sourceLink("https://datacurve.ai/", "[3]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "Datacurve focuses on coding data. Claru is a capture-and-enrichment pipeline for physical AI.",
    cards: [
      {
        title: "Capture-first",
        description:
          "Claru starts by capturing physical-world data instead of code-only datasets.",
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
    title: "Datacurve vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing Datacurve's coding data specialization.",
    columns: [
      { key: "datacurve", label: "Datacurve" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          datacurve: (
            <>
              Frontier coding data for foundation model labs.
              {sourceLink("https://datacurve.ai/", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Data types",
        values: {
          datacurve: "Code SFT, RLHF, and evaluation datasets",
          claru: "Egocentric video, manipulation, depth, pose, segmentation",
        },
      },
      {
        dimension: "Capture model",
        values: {
          datacurve: "Human expert coding data programs",
          claru: "Collector network plus task-specific capture",
        },
      },
      {
        dimension: "Enrichment",
        values: {
          datacurve: "Agentic traces and evaluation tasks",
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Best fit",
        values: {
          datacurve: "Teams training or evaluating code-focused models",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Datacurve vs Claru",
    intro:
      "Datacurve specializes in coding data. Claru specializes in physical-world capture and enrichment.",
    blocks: [
      {
        title: "Code data vs physical data",
        paragraphs: [
          "Datacurve focuses on high-quality coding data for foundation models, using a bounty hunter system that pays skilled software engineers to complete complex coding tasks. The company has distributed over $1 million in bounties and captures agentic workflow traces through a custom IDE, producing data that goes beyond simple code completions.",
          "Claru focuses on real-world capture for robotics and embodied AI. The data types are fundamentally different: Datacurve works with code, terminal sessions, and browser interactions, while Claru works with egocentric video, depth maps, pose sequences, and manipulation recordings from physical environments.",
        ],
      },
      {
        title: "Output format and use cases",
        paragraphs: [
          "Datacurve outputs coding datasets including SFT data, reinforcement learning environments, RLHF preference data, and evaluation benchmarks. These formats are designed for training and evaluating code-focused foundation models, agent systems, and coding assistants.",
          "Claru outputs multimodal robotics-ready datasets with depth, pose, segmentation, optical flow, and aligned captions. These formats are designed for training manipulation policies, world models, and embodied AI systems that need to understand and interact with the physical world.",
        ],
      },
      {
        title: "Founding and funding",
        paragraphs: [
          "Datacurve was founded in 2024 by Serena Ge and Charley Lee, went through YC W24, and has raised $17.7M including a $15M Series A led by Chemistry. The company has attracted angel investment from employees at DeepMind, Anthropic, OpenAI, and Vercel.",
          "Both companies represent the trend toward specialized, high-quality data providers for AI training, but they serve completely different modalities and model types with no overlap in their target customer base.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "Datacurve is strong for code model training and evaluation, particularly for teams building coding assistants, software engineering agents, or evaluating LLM coding capabilities.",
          "Claru is stronger when physical-world capture is the bottleneck, particularly for teams building robotics systems, world models, or any embodied AI that needs to understand physical environments.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Datacurve Is a Fit",
    competitorBullets: [
      "You need coding SFT or RLHF data for foundation models.",
      "You are building code-focused model evaluation suites.",
      "You want agentic workflow traces for software agents.",
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
        title: "Revelo Alternatives",
        desc: "Code LLM human data vs physical AI capture.",
        href: "/compare/revelo-alternatives",
      },
      {
        title: "Humanloop Alternatives",
        desc: "LLM workflow tooling vs physical AI specialization.",
        href: "/compare/humanloop-alternatives",
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
      "Choose Datacurve when you need coding SFT or RLHF data for foundation models.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: Datacurve for coding data, Claru for physical AI datasets.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Datacurve?",
        answer: (
          <>
            Datacurve provides frontier coding data for foundation model labs.
            {sourceLink("https://datacurve.ai/", "[1]")}
          </>
        ),
      },
      {
        question: "What data formats does Datacurve highlight?",
        answer: (
          <>
            Datacurve highlights SFT, RL environments, and RLHF data formats.
            {sourceLink("https://datacurve.ai/", "[2]")}
          </>
        ),
      },
      {
        question: "Does Datacurve provide agentic workflow traces?",
        answer: (
          <>
            Datacurve describes agentic workflow traces captured via a custom
            IDE. {sourceLink("https://datacurve.ai/", "[3]")}
          </>
        ),
      },
      {
        question: "Who founded Datacurve and how much funding has it raised?",
        answer: (
          <>
            Datacurve was founded in 2024 by Serena Ge and Charley Lee and is
            based in San Francisco. The company went through Y Combinator W24
            and has raised approximately $17.7 million in total funding,
            including a $2.7M seed round and a $15M Series A led by Chemistry.
            Investors include employees from DeepMind, Anthropic, OpenAI, and
            Vercel, as well as former Coinbase CTO Balaji Srinivasan.
            {sourceLink("https://techcrunch.com/2025/10/09/datacurve-raises-15-million-to-take-on-scaleai/", "[4]")}
          </>
        ),
      },
      {
        question: "When is Claru a better fit?",
        answer:
          "Claru is a better fit when you need capture, enrichment, and delivery of robotics-ready datasets. Datacurve focuses exclusively on coding data for LLM training and evaluation, which serves a completely different use case. If you are building physical AI, robotics, or world models, you need a provider that captures real-world data and enriches it with depth, pose, segmentation, and motion signals.",
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
    { label: "Datacurve", url: "https://datacurve.ai/" },
  ],
};
