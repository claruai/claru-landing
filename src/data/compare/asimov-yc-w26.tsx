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

export const asimovYcW26Comparison: ComparisonData = {
  slug: "asimov-yc-w26-alternatives",
  competitor: {
    name: "Asimov",
    siteUrl: "https://tryasimov.ai",
    category: "Real-world human data for robotics",
  },
  meta: {
    title: "Asimov Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Asimov and Claru for physical AI training data. Asimov collects real-world human activity data with egocentric video and rich annotations. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Asimov alternative",
      "Asimov alternatives",
      "Asimov vs Claru",
      "egocentric video datasets",
      "human activity data",
      "physical AI training data",
      "robotics data capture",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Asimov Alternatives",
    title: "Asimov Alternatives: Human Activity Data vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://tryasimov.ai"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Asimov
        </a>{" "}
        collects real-world human activity data at scale for robotics training.
        If you need broader physical-world capture and enrichment across
        robotics tasks, Claru is built for physical AI from day one.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Asimov collects real-world human activity data to train robots.",
      "The dataset focus includes egocentric video and rich annotations like 3D body pose and depth maps.",
      "Asimov runs an end-to-end pipeline: hardware distribution, data collection, QA, and post-processing.",
      "Claru is purpose-built for broader physical AI capture and multi-layer enrichment.",
      "Choose Asimov for human activity data; choose Claru for capture + enrichment across robotics tasks.",
    ],
  },
  overview: {
    title: "What Asimov Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Asimov focuses on real-world human activity data, often egocentric. Claru focuses on capture and enrichment across physical AI tasks.",
      <>
        Asimov states it collects diverse real-world human data at scale to
        power robots, with collection across multiple continents. {sourceLink("https://tryasimov.ai/", "[1]")}
      </>,
      <>
        The company highlights an end-to-end pipeline: hardware distribution,
        data collection, quality assurance, and post-processing. {sourceLink("https://tryasimov.ai/", "[2]")}
      </>,
      <>
        Asimov lists egocentric video plus rich annotations such as 3D body
        pose, depth maps, semantic labels, and activity segmentation. {sourceLink("https://tryasimov.ai/", "[3]")}
      </>,
      "Asimov was founded in 2026 by Lyem Ningthou and Anshul Verma and is part of the Y Combinator W26 batch. Lyem previously built data pipelines for the United States Air Force and was a founding engineer at Blume (YC W24). Anshul brings data infrastructure experience from Scale AI and ML research at BAIR (Berkeley Artificial Intelligence Research). The co-founders were roommates in college and previously co-founded a startup they grew to six figures in revenue.",
      "Asimov's approach involves deploying collectors wearing custom capture rigs into real households and businesses. Unlike factory datasets that capture repetitive tasks in controlled environments, Asimov focuses on delivering the full diversity of real human environments with thousands of hours of data per day flowing to leading robotics labs. The company also owns a growing cleaning company, offering free and reduced-price cleanings where cleaners wear custom rigs while performing their work, creating a natural and cost-effective data collection flywheel.",
      "For physical AI teams comparing Asimov and Claru, the key distinction is scope. Asimov specializes specifically in human movement and activity data captured from an egocentric perspective, which is highly relevant for humanoid robot training. Claru covers a broader range of physical AI tasks and environments, and provides multi-layer enrichment including depth estimation, segmentation, optical flow, and aligned captions as standard outputs alongside capture.",
      "If your bottleneck is egocentric human activity data, Asimov is a strong fit. If your bottleneck is broader physical-world capture and enrichment, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Asimov at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                Real-world human activity data for robotics. {sourceLink("https://tryasimov.ai/", "[1]")}
              </>
            ),
          },
          {
            label: "Pipeline",
            value: (
              <>
                Hardware distribution, data collection, QA, post-processing. {sourceLink("https://tryasimov.ai/", "[2]")}
              </>
            ),
          },
          {
            label: "Annotations",
            value: (
              <>
                3D body pose, depth maps, semantic labels, activity segmentation. {sourceLink("https://tryasimov.ai/", "[3]")}
              </>
            ),
          },
          {
            label: "Coverage",
            value: (
              <>
                Collecting across multiple continents. {sourceLink("https://tryasimov.ai/", "[4]")}
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
        Asimov collects diverse real-world human data at scale for robotics. {sourceLink("https://tryasimov.ai/", "[1]")}
      </>,
      <>
        Asimov runs an end-to-end pipeline: hardware distribution, data
        collection, QA, and post-processing. {sourceLink("https://tryasimov.ai/", "[2]")}
      </>,
      <>
        Asimov provides egocentric video and rich annotations such as 3D body
        pose and depth maps. {sourceLink("https://tryasimov.ai/", "[3]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Asimov Is Strong",
    intro:
      "Based on Asimov's public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "Egocentric human activity data",
        description: (
          <>
            Asimov focuses on real-world human activity data for robotics. {sourceLink("https://tryasimov.ai/", "[1]")}
          </>
        ),
      },
      {
        title: "Rich annotation layers",
        description: (
          <>
            The platform highlights 3D body pose, depth maps, semantic labels,
            and activity segmentation. {sourceLink("https://tryasimov.ai/", "[3]")}
          </>
        ),
      },
      {
        title: "End-to-end collection pipeline",
        description: (
          <>
            Asimov manages hardware distribution, data collection, QA, and
            post-processing. {sourceLink("https://tryasimov.ai/", "[2]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "Asimov focuses on human activity data. Claru is a capture-and-enrichment pipeline for broader physical AI tasks.",
    cards: [
      {
        title: "Task breadth",
        description:
          "Claru captures data across a wider range of physical tasks and environments.",
      },
      {
        title: "Multi-layer enrichment",
        description:
          "Claru delivers depth, pose, segmentation, optical flow, and aligned captions as standard outputs.",
      },
      {
        title: "Robotics-ready delivery",
        description:
          "Claru ships datasets in formats that plug directly into robotics stacks.",
      },
    ],
  },
  comparison: {
    title: "Asimov vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing Asimov's human activity data specialization.",
    columns: [
      { key: "asimov", label: "Asimov" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          asimov: (
            <>
              Human activity data for robotics. {sourceLink("https://tryasimov.ai/", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Capture model",
        values: {
          asimov: (
            <>
              End-to-end pipeline with hardware distribution and QA. {sourceLink("https://tryasimov.ai/", "[2]")}
            </>
          ),
          claru: "Collector network plus task-specific capture",
        },
      },
      {
        dimension: "Annotations",
        values: {
          asimov: (
            <>
              3D body pose, depth maps, semantic labels, activity segmentation. {sourceLink("https://tryasimov.ai/", "[3]")}
            </>
          ),
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Best fit",
        values: {
          asimov: "Teams focused on human activity data for robotics",
          claru: "Teams needing capture + enrichment across physical tasks",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Asimov vs Claru",
    intro:
      "Asimov specializes in human activity data. Claru specializes in broader physical AI capture and enrichment.",
    blocks: [
      {
        title: "Egocentric focus vs broader capture",
        paragraphs: [
          "Asimov emphasizes egocentric human activity data and annotations.",
          "Claru captures across tasks, environments, and modalities for robotics training.",
        ],
      },
      {
        title: "Pipeline coverage",
        paragraphs: [
          "Asimov manages hardware distribution, data collection, and QA end-to-end.",
          "Claru adds enrichment layers and delivers robotics-native dataset formats.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "Asimov is a strong fit for human activity data at scale.",
          "Claru is better when you need capture and enrichment across physical AI tasks.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Asimov Is a Fit",
    competitorBullets: [
      "You need egocentric human activity data for robotics training.",
      "You want rich annotations like 3D body pose and depth maps.",
      "You want a managed capture pipeline with hardware and QA.",
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
        title: "Surge AI Alternatives",
        desc: "RLHF services vs physical AI capture.",
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
      "Choose Asimov when you need large-scale human activity data with egocentric video and rich annotations.",
      "Choose Claru when you need capture and enrichment across a broader set of physical AI tasks.",
      "Some teams use both: Asimov for human activity datasets, Claru for task-specific physical data.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Asimov?",
        answer: (
          <>
            Asimov is a Y Combinator W26 startup founded by Lyem Ningthou and Anshul Verma that collects real-world human movement data from households and businesses to train humanoid robots. The company deploys collectors wearing custom capture rigs into real environments, delivering diverse egocentric video data at scale. Lyem previously built data pipelines for the US Air Force, and Anshul brings experience from Scale AI and ML research at BAIR.{" "}
            {sourceLink("https://tryasimov.ai/", "[1]")}
          </>
        ),
      },
      {
        question: "What annotations does Asimov provide?",
        answer: (
          <>
            Asimov provides rich annotations including 3D body pose, depth maps, semantic labels, and activity segmentation as part of its data pipeline. These annotation layers are generated through post-processing of the captured egocentric video, making the data immediately useful for training humanoid robot policies. The annotation coverage aligns closely with what robotics teams need for human motion imitation and task learning.{" "}
            {sourceLink("https://tryasimov.ai/", "[3]")}
          </>
        ),
      },
      {
        question: "Does Asimov mention privacy protections?",
        answer: (
          <>
            Yes. Asimov describes privacy-first data collection practices including no audio recording, automatic face blurring, and PII removal from captured data. This approach is important for collecting data in real homes and businesses where privacy concerns are paramount. The privacy-by-design approach enables Asimov to scale data collection across private environments that would otherwise be off-limits.{" "}
            {sourceLink("https://tryasimov.ai/", "[4]")}
          </>
        ),
      },
      {
        question: "How does Asimov compare to Claru?",
        answer:
          "Both Asimov and Claru capture physical-world data for robotics, but they differ in scope. Asimov specializes specifically in human movement and activity data captured from an egocentric perspective, primarily for humanoid robot training. Claru covers a broader range of physical AI tasks and environments, and provides multi-layer enrichment including depth, pose, segmentation, optical flow, and aligned captions as standard outputs. Teams focused solely on humanoid activity data may prefer Asimov, while teams with broader physical AI needs may prefer Claru.",
      },
      {
        question: "When is Claru a better fit?",
        answer:
          "Claru is a better fit when you need capture, enrichment, and delivery of robotics-ready datasets across multiple task types and environments. If your training needs extend beyond human activity data to include object manipulation, navigation, industrial scenarios, or other physical AI tasks, Claru's broader capture network and multi-layer enrichment pipeline provides the flexibility to address diverse data requirements.",
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
    { label: "Asimov", url: "https://tryasimov.ai/" },
    { label: "Asimov (YC)", url: "https://www.ycombinator.com/companies/asimov" },
  ],
};
