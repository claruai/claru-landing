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
        10.8B frames of egocentric video. Founded by 18-year-old Columbia
        dropout Eddy Xu and backed by $15M in total funding from Abstract
        Ventures, Pear VC, and HF0, Build AI has quickly become a notable
        player in egocentric data for robotics. If you need physical-world
        capture and enrichment for robotics, Claru is built for physical AI
        from day one.
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
      "Build AI was founded by Eddy Xu, an 18-year-old Columbia dropout, and has raised $15M from Abstract Ventures, Pear VC, and HF0.",
      "The dataset was collected from 14,228 factory workers wearing camera glasses for an average of 7 hours each, licensed under Apache 2.0.",
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
      <>
        Build AI was founded by Eddy Xu, who dropped out of Columbia at age 18
        to focus on egocentric data for robotics. The company has raised $15
        million in total funding from Abstract Ventures, Pear VC, and HF0, with
        additional support from ZFellows.{" "}
        {sourceLink("https://www.startuphub.ai/ai-news/funding-round/2025/build-ais-5m-bet-on-human-view-robotics/", "[6]")}
      </>,
      <>
        The Egocentric-100K dataset was collected from 14,228 factory workers
        who each wore camera glasses for an average of 7 hours. Each clip
        averages 180 seconds in length, and the entire dataset is licensed under
        Apache 2.0, making it available for commercial use with minimal
        restrictions.{" "}
        {sourceLink("https://mikekalil.com/blog/build-ai-ecocentric-100k-dataset/", "[7]")}
      </>,
      "For robotics teams, the key consideration is whether you need a large pre-existing egocentric dataset or whether you need custom data captured and enriched for your specific tasks. Build AI provides the former at impressive scale. Claru provides the latter with a full pipeline from capture brief to training-ready delivery.",
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
            label: "Funding",
            value: (
              <>
                $15M total from Abstract Ventures, Pear VC, HF0, and ZFellows.
                {sourceLink("https://www.startuphub.ai/ai-news/funding-round/2025/build-ais-5m-bet-on-human-view-robotics/", "[6]")}
              </>
            ),
          },
          {
            label: "License",
            value: "Apache 2.0, commercial use permitted",
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
        dimension: "Data licensing",
        values: {
          build: "Apache 2.0 open license",
          claru: "Custom licensing with full IP transfer options",
        },
      },
      {
        dimension: "Customization",
        values: {
          build: "Fixed dataset, no custom capture",
          claru: "Task-specific capture briefs and custom environments",
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
          "Build AI focuses on a large, fixed egocentric dataset collected from over 14,000 factory workers wearing camera glasses. The dataset is pre-built and available for download in WebDataset format, which makes it straightforward to stream into training pipelines.",
          "Claru focuses on capturing new data tailored to specific tasks and environments. Rather than offering a fixed corpus, Claru designs capture briefs around the specific robot behaviors and manipulation tasks a team needs to train, then enriches that data with depth, pose, segmentation, and motion signals.",
        ],
      },
      {
        title: "Scale vs specificity",
        paragraphs: [
          "Egocentric-100K emphasizes scale with 100K+ hours and billions of frames. This is valuable for teams that need broad pre-training data or want to fine-tune on diverse manual labor scenarios without worrying about data volume.",
          "Claru emphasizes task-specific capture and enrichment depth. For teams building models that need to handle specific objects, environments, or manipulation sequences, having data that precisely matches the target domain often matters more than sheer volume.",
        ],
      },
      {
        title: "Licensing and flexibility",
        paragraphs: [
          "Build AI releases Egocentric-100K under Apache 2.0, which allows commercial use with minimal restrictions. This open approach makes it easy for research teams and startups to experiment without licensing negotiations.",
          "Claru offers custom licensing with options for full IP transfer, exclusive datasets, and tailored capture programs. This is important for teams building proprietary models where data exclusivity provides a competitive advantage.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "Build AI is strong when scale of egocentric data is the bottleneck and you want an off-the-shelf dataset you can start training on immediately.",
          "Claru is stronger when custom capture and enrichment are required, especially when your robotics application needs data from specific environments, objects, or task sequences that do not exist in public datasets.",
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
            Build AI is a robotics data company founded by Eddy Xu, who dropped
            out of Columbia at age 18 to build large-scale egocentric datasets
            for physical AI. The company has raised $15 million in total funding
            from Abstract Ventures, Pear VC, HF0, and ZFellows. Its flagship
            product is the Egocentric-100K dataset, which it highlights
            prominently on its homepage as the largest dataset of manual labor.
            {sourceLink("https://www.build.ai/", "[1]")}
          </>
        ),
      },
      {
        question: "How large is Egocentric-100K?",
        answer: (
          <>
            The dataset card lists 100,405 total hours and 10.8 billion frames
            across 2,010,759 video clips. The data was captured from 14,228
            factory workers who each wore camera glasses for an average of 7
            hours. Each clip averages 180 seconds in length. This makes it one
            of the largest publicly available egocentric video datasets,
            particularly for manual labor and industrial tasks.
            {sourceLink("https://huggingface.co/datasets/builddotai/Egocentric-100K", "[2]")}
          </>
        ),
      },
      {
        question: "What format is the dataset in?",
        answer: (
          <>
            Egocentric-100K is provided in WebDataset format with 2,010,759
            video clips. WebDataset is a streaming-friendly format that makes it
            efficient to load large-scale video data directly into training
            pipelines without downloading the entire dataset first. This is
            particularly useful for teams running distributed training across
            multiple GPUs or nodes.
            {sourceLink("https://huggingface.co/datasets/builddotai/Egocentric-100K", "[3]")}
          </>
        ),
      },
      {
        question: "Is the dataset relevant to robotics?",
        answer: (
          <>
            The dataset tags include video, egocentric, and robotics. The
            first-person perspective of workers performing manual labor tasks
            makes it relevant for training manipulation policies and world
            models that need to understand hand-object interactions in real
            factory environments. However, it focuses on a single domain
            (factory work) and does not cover other robotics scenarios like
            household tasks, logistics, or outdoor navigation.
            {sourceLink("https://huggingface.co/datasets/builddotai/Egocentric-100K", "[4]")}
          </>
        ),
      },
      {
        question: "How is Egocentric-100K positioned?",
        answer: (
          <>
            The dataset card describes it as the largest dataset of manual
            labor. This positioning reflects the growing recognition that
            robotics models need large volumes of real-world human activity data
            for pre-training, similar to how LLMs benefit from web-scale text
            corpora. The Apache 2.0 license makes it accessible for both
            research and commercial use.
            {sourceLink("https://huggingface.co/datasets/builddotai/Egocentric-100K", "[5]")}
          </>
        ),
      },
      {
        question: "When is Claru a better fit?",
        answer:
          "Claru is a better fit when you need capture, enrichment, and delivery of robotics-ready datasets tailored to your specific use case. If your model needs to learn manipulation tasks in specific environments with specific objects, a custom capture program will produce more relevant training data than a general-purpose egocentric dataset. Claru also adds enrichment layers like depth maps, body and hand pose estimation, segmentation masks, and optical flow that are not included in Egocentric-100K.",
      },
      {
        question: "Can teams use both Build AI and Claru?",
        answer:
          "Yes. Some teams use Build AI for broad pre-training on large-scale egocentric data and then use Claru for task-specific fine-tuning data captured in their target domain. This two-stage approach lets teams benefit from the scale of Egocentric-100K while getting the precision and enrichment depth that comes from a custom capture program.",
      },
      {
        question: "Is Build AI a fit for custom capture?",
        answer:
          "Build AI highlights a fixed dataset rather than custom capture services. If you need data collected in specific environments, with specific objects, or following specific task protocols, you will need a provider that offers custom capture programs. Claru designs capture briefs around real robot behaviors and environments, then delivers enriched datasets ready for robotics training pipelines.",
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
    { label: "Build AI Funding", url: "https://www.startuphub.ai/ai-news/funding-round/2025/build-ais-5m-bet-on-human-view-robotics/" },
    { label: "Build AI Dataset Overview", url: "https://mikekalil.com/blog/build-ai-ecocentric-100k-dataset/" },
  ],
};
