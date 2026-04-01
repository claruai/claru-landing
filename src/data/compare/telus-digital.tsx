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

export const telusDigitalComparison: ComparisonData = {
  slug: "telus-digital-alternatives",
  competitor: {
    name: "TELUS Digital",
    siteUrl: "https://www.telusdigital.com",
    category: "Global AI data services and annotation",
  },
  meta: {
    title: "TELUS Digital Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare TELUS Digital and Claru for physical AI training data. TELUS Digital provides global data collection, annotation, validation, and post-training services for AI systems, including multimodal and multilingual programs. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "TELUS Digital alternative",
      "TELUS Digital alternatives",
      "TELUS Digital vs Claru",
      "AI data services",
      "data annotation services",
      "multimodal data",
      "multilingual data",
      "physical AI training data",
      "robotics data labeling",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-04-02",
    modified: "2026-04-02",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "TELUS Digital Alternatives",
    title: "TELUS Digital Alternatives: AI Data Services vs Physical AI",
    subtitle: (
      <>
        <a
          href="https://www.telusdigital.com/solutions/data-for-ai-training"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          TELUS Digital
        </a>{" "}
        provides global data services for AI training, including collection,
        annotation, validation, and post-training workflows. If you need
        physical-world capture and enrichment for robotics, Claru is built for
        physical AI from day one.
      </>
    ),
    lastUpdated: "April 2, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "TELUS Digital positions itself as a neutral partner for data, technology, and intelligence solutions across multimodal AI, multilingual AI, and physical AI.",
      "The platform highlights access to niche expertise at scale with AI-powered interviews, proctored testing, and fraud detection.",
      "Data for generative AI includes post-training, LLM interactivity, fine-tuning, RLHF, and red-teaming workflows.",
      "Data collection spans multimodal, multilingual, and on-device capture with built-in feedback and quality checks.",
      "Data annotation includes automated labeling with expert-in-the-loop, 3D sensor fusion, and global scale claims of billions of annotations and 500 languages.",
      "TELUS Digital reports 1M+ global contributors and 20+ domains with 500+ annotation languages and dialects.",
      "Claru is purpose-built for physical AI capture and enrichment.",
      "Choose TELUS Digital for global AI data services; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What TELUS Digital Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: TELUS Digital is a broad AI data services partner. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        TELUS Digital positions itself as a neutral partner for data, tech, and
        intelligence solutions across multimodal, multilingual, multi-agent,
        and physical AI workloads.
        {sourceLink("https://www.telusdigital.com/solutions/data-for-ai-training", "[1]")}
      </>,
      <>
        The platform highlights access to niche expertise at scale with
        AI-powered interviews, proctored testing, fraud detection, and fair
        compensation controls.
        {sourceLink("https://www.telusdigital.com/solutions/data-for-ai-training", "[2]")}
      </>,
      <>
        Data for generative AI includes post-training solutions, LLM
        interactivity workflows, fine-tuning, RLHF, and red-teaming.
        {sourceLink("https://www.telusdigital.com/solutions/data-for-ai-training", "[3]")}
      </>,
      <>
        Data collection spans multimodal, multilingual, and on-device capture
        with dynamic UI and built-in feedback and quality checks.
        {sourceLink("https://www.telusdigital.com/solutions/data-for-ai-training", "[4]")}
      </>,
      <>
        Data annotation emphasizes automated labeling with expert-in-the-loop,
        3D sensor fusion, and global scale claims including billions of
        annotations across 500 languages.
        {sourceLink("https://www.telusdigital.com/solutions/data-for-ai-training", "[5]")}
      </>,
      <>
        TELUS Digital reports a global AI community of 1M+ contributors and
        20+ domains with 500+ annotation languages and dialects.
        {sourceLink("https://www.telusdigital.com/solutions/data-for-ai-training", "[6]")}
      </>,
      "If your bottleneck is global data collection and annotation across domains, TELUS Digital is a strong fit. If your bottleneck is physical-world capture and enrichment, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "TELUS Digital at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                Global data services for multimodal, multilingual, and physical
                AI workloads.
                {sourceLink("https://www.telusdigital.com/solutions/data-for-ai-training", "[1]")}
              </>
            ),
          },
          {
            label: "GenAI services",
            value: (
              <>
                Post-training, fine-tuning, RLHF, and red-teaming workflows.
                {sourceLink("https://www.telusdigital.com/solutions/data-for-ai-training", "[3]")}
              </>
            ),
          },
          {
            label: "Collection",
            value: (
              <>
                Multimodal, multilingual, on-device data capture with quality
                checks.
                {sourceLink("https://www.telusdigital.com/solutions/data-for-ai-training", "[4]")}
              </>
            ),
          },
          {
            label: "Annotation",
            value: (
              <>
                Automated labeling with expert-in-the-loop and 3D sensor fusion.
                {sourceLink("https://www.telusdigital.com/solutions/data-for-ai-training", "[5]")}
              </>
            ),
          },
          {
            label: "Scale",
            value: (
              <>
                1M+ contributors, 20+ domains, 500+ annotation languages.
                {sourceLink("https://www.telusdigital.com/solutions/data-for-ai-training", "[6]")}
              </>
            ),
          },
          {
            label: "Best fit",
            value: "Teams needing global AI data services at scale",
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
        TELUS Digital positions itself as a data partner across multimodal,
        multilingual, and physical AI workloads.
        {sourceLink("https://www.telusdigital.com/solutions/data-for-ai-training", "[1]")}
      </>,
      <>
        The platform highlights niche expertise at scale with AI-powered
        interviews, proctored testing, and fraud detection.
        {sourceLink("https://www.telusdigital.com/solutions/data-for-ai-training", "[2]")}
      </>,
      <>
        Data for generative AI includes post-training, fine-tuning, RLHF, and
        red-teaming workflows.
        {sourceLink("https://www.telusdigital.com/solutions/data-for-ai-training", "[3]")}
      </>,
      <>
        Data collection spans multimodal and multilingual on-device capture with
        quality checks.
        {sourceLink("https://www.telusdigital.com/solutions/data-for-ai-training", "[4]")}
      </>,
      <>
        Data annotation includes automated labeling with expert-in-the-loop and
        3D sensor fusion with global scale claims.
        {sourceLink("https://www.telusdigital.com/solutions/data-for-ai-training", "[5]")}
      </>,
      <>
        TELUS Digital reports 1M+ contributors and 500+ annotation languages and
        dialects.
        {sourceLink("https://www.telusdigital.com/solutions/data-for-ai-training", "[6]")}
      </>,
    ],
  },
  strengths: {
    title: "Where TELUS Digital Is Strong",
    intro:
      "TELUS Digital emphasizes global scale, multimodal coverage, and GenAI post-training workflows.",
    cards: [
      {
        title: "Global AI data services",
        description: (
          <>
            TELUS Digital provides data services across multimodal and
            multilingual AI programs.
            {sourceLink("https://www.telusdigital.com/solutions/data-for-ai-training", "[1]")}
          </>
        ),
      },
      {
        title: "GenAI post-training",
        description: (
          <>
            The platform lists fine-tuning, RLHF, and red-teaming workflows.
            {sourceLink("https://www.telusdigital.com/solutions/data-for-ai-training", "[3]")}
          </>
        ),
      },
      {
        title: "Scale and coverage",
        description: (
          <>
            TELUS Digital cites 1M+ contributors and 500+ annotation languages.
            {sourceLink("https://www.telusdigital.com/solutions/data-for-ai-training", "[6]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "TELUS Digital is a broad AI data services partner. Claru is a capture-and-enrichment pipeline for physical AI.",
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
    title: "TELUS Digital vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison highlights global AI data services versus a capture-first physical AI pipeline.",
    columns: [
      { key: "telus", label: "TELUS Digital" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          telus: (
            <>
              Data services for multimodal, multilingual, and physical AI.
              {sourceLink("https://www.telusdigital.com/solutions/data-for-ai-training", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "GenAI workflows",
        values: {
          telus: (
            <>
              Post-training, fine-tuning, RLHF, and red-teaming workflows.
              {sourceLink("https://www.telusdigital.com/solutions/data-for-ai-training", "[3]")}
            </>
          ),
          claru: "Capture and enrichment for robotics training",
        },
      },
      {
        dimension: "Annotation",
        values: {
          telus: (
            <>
              Automated labeling with expert-in-the-loop and 3D sensor fusion.
              {sourceLink("https://www.telusdigital.com/solutions/data-for-ai-training", "[5]")}
            </>
          ),
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Scale",
        values: {
          telus: (
            <>
              1M+ contributors and 500+ annotation languages.
              {sourceLink("https://www.telusdigital.com/solutions/data-for-ai-training", "[6]")}
            </>
          ),
          claru: "Specialized capture network focused on physical tasks",
        },
      },
      {
        dimension: "Best fit",
        values: {
          telus: "Teams needing global AI data services",
          claru: "Robotics teams needing capture + enrichment",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: TELUS Digital vs Claru",
    intro:
      "TELUS Digital provides broad AI data services. Claru specializes in physical AI capture and enrichment.",
    blocks: [
      {
        title: "Service breadth vs physical focus",
        paragraphs: [
          "TELUS Digital supports global data collection, annotation, and GenAI post-training workflows.",
          "Claru focuses on physical-world capture and enrichment for robotics.",
        ],
      },
      {
        title: "Global scale",
        paragraphs: [
          "TELUS Digital highlights a large global contributor community and multi-language coverage.",
          "Claru focuses on task-specific capture and enrichment rather than broad language coverage.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "TELUS Digital is a strong fit for large-scale, multi-domain data programs.",
          "Claru is a better fit when you need robotics-ready capture and enrichment.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When TELUS Digital Is a Fit",
    competitorBullets: [
      "You need global data collection and annotation services at scale.",
      "You want GenAI post-training workflows like RLHF and red-teaming.",
      "You need multilingual and multimodal coverage across domains.",
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
        title: "Welo Data Alternatives",
        desc: "Enterprise annotation programs vs physical AI pipelines.",
        href: "/compare/welodata-alternatives",
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
      "Choose TELUS Digital when you need broad AI data services and post-training workflows at global scale.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: TELUS Digital for broad data programs, Claru for physical capture.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is TELUS Digital?",
        answer: (
          <>
            TELUS Digital provides data services across multimodal, multilingual,
            and physical AI workloads.
            {sourceLink("https://www.telusdigital.com/solutions/data-for-ai-training", "[1]")}
          </>
        ),
      },
      {
        question: "Does TELUS Digital support GenAI post-training?",
        answer: (
          <>
            Yes. The site lists post-training, fine-tuning, RLHF, and red-teaming
            workflows.
            {sourceLink("https://www.telusdigital.com/solutions/data-for-ai-training", "[3]")}
          </>
        ),
      },
      {
        question: "How large is TELUS Digital&apos;s contributor network?",
        answer: (
          <>
            TELUS Digital reports 1M+ global contributors and 500+ annotation
            languages.
            {sourceLink("https://www.telusdigital.com/solutions/data-for-ai-training", "[6]")}
          </>
        ),
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
    { label: "TELUS Digital Data for AI Training", url: "https://www.telusdigital.com/solutions/data-for-ai-training" },
  ],
};
