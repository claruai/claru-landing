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

export const v7LabsComparison: ComparisonData = {
  slug: "v7-labs-alternatives",
  competitor: {
    name: "V7 Labs",
    siteUrl: "https://www.v7labs.com",
    category: "Operational AI for document-heavy workflows",
  },
  meta: {
    title: "V7 Labs Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare V7 Labs and Claru for physical AI training data. V7 Labs promotes operational AI to automate document-heavy workflows with AI agents for tasks like contract review, claims processing, and OCR/data extraction. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "V7 Labs alternative",
      "V7 Labs alternatives",
      "V7 Labs vs Claru",
      "AI agent platform",
      "document automation",
      "contract review automation",
      "claims processing automation",
      "physical AI training data",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "V7 Labs Alternatives",
    title: "V7 Labs Alternatives: Document AI vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://www.v7labs.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          V7 Labs
        </a>{" "}
        positions itself around operational AI for complex, document-heavy
        workflows, using AI agents to automate tasks like contract review and
        claims processing. If you need physical-world capture and enrichment for
        robotics, Claru is built for physical AI from day one.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "V7 Labs promotes operational AI for complex document workflows.",
      "It highlights turning complex documents into structured, repeatable workflows.",
      "The platform lists AI agents for roles like contract manager, legal bill auditor, and more.",
      "It emphasizes automating document-heavy workflows with AI agents.",
      "Use cases include AI contract review, insurance claims processing, OCR/data extraction, and financial statement analysis.",
      "Claru is purpose-built for physical AI capture and multi-layer enrichment.",
      "Choose V7 Labs for document automation; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What V7 Labs Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: V7 Labs focuses on operational AI for document-heavy workflows. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        V7 Labs describes its focus as operational AI for complex document
        workflows. {sourceLink("https://www.v7labs.com/", "[1]")}
      </>,
      <>
        The platform highlights turning complex documents into structured,
        repeatable workflows. {sourceLink("https://www.v7labs.com/", "[2]")}
      </>,
      <>
        V7 Labs emphasizes automating document-heavy workflows with AI agents.
        {sourceLink("https://www.v7labs.com/", "[3]")}
      </>,
      <>
        The site lists AI agents for roles like legal bill auditors, contract
        managers, investor relations, and more.
        {sourceLink("https://www.v7labs.com/", "[4]")}
      </>,
      <>
        Use cases listed include AI contract review, insurance claims
        processing, OCR/data extraction, and financial statement analysis.
        {sourceLink("https://www.v7labs.com/", "[5]")}
      </>,
      "If your bottleneck is document automation, V7 Labs is a strong fit. If your bottleneck is physical-world capture and enrichment, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "V7 Labs at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                Operational AI for complex document workflows.
                {sourceLink("https://www.v7labs.com/", "[1]")}
              </>
            ),
          },
          {
            label: "Approach",
            value: (
              <>
                Turn complex documents into structured workflows.
                {sourceLink("https://www.v7labs.com/", "[2]")}
              </>
            ),
          },
          {
            label: "Agents",
            value: (
              <>
                AI agents for roles like contract manager and legal bill
                auditor. {sourceLink("https://www.v7labs.com/", "[4]")}
              </>
            ),
          },
          {
            label: "Use cases",
            value: (
              <>
                Contract review, claims processing, OCR/data extraction,
                financial statement analysis.
                {sourceLink("https://www.v7labs.com/", "[5]")}
              </>
            ),
          },
          {
            label: "Best fit",
            value: "Teams automating document-heavy workflows",
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
        V7 Labs positions itself around operational AI for complex document
        workflows. {sourceLink("https://www.v7labs.com/", "[1]")}
      </>,
      <>
        The platform highlights turning complex documents into structured,
        repeatable workflows. {sourceLink("https://www.v7labs.com/", "[2]")}
      </>,
      <>
        V7 Labs emphasizes automating document-heavy workflows with AI agents.
        {sourceLink("https://www.v7labs.com/", "[3]")}
      </>,
      <>
        The site lists AI agents for roles like legal bill auditor and contract
        manager. {sourceLink("https://www.v7labs.com/", "[4]")}
      </>,
      <>
        Use cases include AI contract review, insurance claims processing,
        OCR/data extraction, and financial statement analysis.
        {sourceLink("https://www.v7labs.com/", "[5]")}
      </>,
    ],
  },
  strengths: {
    title: "Where V7 Labs Is Strong",
    intro:
      "Based on V7 Labs' public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "Document workflow automation",
        description: (
          <>
            V7 Labs focuses on operational AI for document-heavy workflows.
            {sourceLink("https://www.v7labs.com/", "[1]")}
          </>
        ),
      },
      {
        title: "Structured document flows",
        description: (
          <>
            The platform highlights turning complex documents into structured
            workflows. {sourceLink("https://www.v7labs.com/", "[2]")}
          </>
        ),
      },
      {
        title: "AI agents for specific roles",
        description: (
          <>
            The site lists AI agents for roles like contract manager and legal
            bill auditor. {sourceLink("https://www.v7labs.com/", "[4]")}
          </>
        ),
      },
      {
        title: "Enterprise use cases",
        description: (
          <>
            Use cases include contract review, claims processing, OCR/data
            extraction, and financial analysis.
            {sourceLink("https://www.v7labs.com/", "[5]")}
          </>
        ),
      },
      {
        title: "Operational AI positioning",
        description: (
          <>
            V7 Labs positions itself around operational AI for document
            workflows. {sourceLink("https://www.v7labs.com/", "[1]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "V7 Labs focuses on document automation. Claru is a capture-and-enrichment pipeline for physical AI.",
    cards: [
      {
        title: "Capture-first",
        description:
          "Claru starts by capturing physical-world data instead of document automation.",
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
    title: "V7 Labs vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing V7 Labs' automation strengths.",
    columns: [
      { key: "v7labs", label: "V7 Labs" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          v7labs: (
            <>
              Operational AI for complex document workflows.
              {sourceLink("https://www.v7labs.com/", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Workflow approach",
        values: {
          v7labs: (
            <>
              Turn complex documents into structured, repeatable workflows.
              {sourceLink("https://www.v7labs.com/", "[2]")}
            </>
          ),
          claru: "Capture pipeline plus enrichment and delivery",
        },
      },
      {
        dimension: "Automation",
        values: {
          v7labs: (
            <>
              Automate document-heavy workflows with AI agents.
              {sourceLink("https://www.v7labs.com/", "[3]")}
            </>
          ),
          claru: "Capture automation and enrichment pipelines",
        },
      },
      {
        dimension: "Use cases",
        values: {
          v7labs: (
            <>
              Contract review, claims processing, OCR/data extraction, financial
              statement analysis.
              {sourceLink("https://www.v7labs.com/", "[5]")}
            </>
          ),
          claru: "Egocentric video, robotics capture, and enrichment",
        },
      },
      {
        dimension: "Data capture",
        values: {
          v7labs: "Document automation tooling",
          claru: "Collector network plus task-specific capture",
        },
      },
      {
        dimension: "Enrichment",
        values: {
          v7labs: "Workflow automation and document parsing",
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Best fit",
        values: {
          v7labs: "Teams automating document-heavy workflows",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: V7 Labs vs Claru",
    intro:
      "V7 Labs automates document-heavy workflows. Claru captures and enriches physical-world data.",
    blocks: [
      {
        title: "Automation vs capture",
        paragraphs: [
          "V7 Labs focuses on AI agents for document workflows.",
          "Claru focuses on physical-world capture and enrichment.",
        ],
      },
      {
        title: "Workflow structure",
        paragraphs: [
          "V7 Labs turns complex documents into structured workflows.",
          "Claru turns capture briefs into robotics-ready datasets.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "V7 Labs is strong when document automation is the bottleneck.",
          "Claru is stronger when physical-world capture is the bottleneck.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When V7 Labs Is a Fit",
    competitorBullets: [
      "You need operational AI for complex document workflows.",
      "You want AI agents for contract review or claims processing.",
      "You need structured, repeatable workflows from messy documents.",
      "You are automating OCR and data extraction tasks.",
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
      "Choose V7 Labs when you need AI agents to automate document-heavy workflows.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: V7 Labs for document automation, Claru for capture-first datasets.",
      "If your project requires physical data collection, prioritize providers built for capture and enrichment from day one.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is V7 Labs?",
        answer: (
          <>
            V7 Labs positions itself around operational AI for complex document
            workflows. {sourceLink("https://www.v7labs.com/", "[1]")}
          </>
        ),
      },
      {
        question: "What does V7 Labs automate?",
        answer: (
          <>
            V7 Labs highlights automating document-heavy workflows with AI
            agents. {sourceLink("https://www.v7labs.com/", "[3]")}
          </>
        ),
      },
      {
        question: "What are example V7 Labs use cases?",
        answer: (
          <>
            The site lists AI contract review, claims processing, OCR/data
            extraction, and financial statement analysis.
            {sourceLink("https://www.v7labs.com/", "[5]")}
          </>
        ),
      },
      {
        question: "Does V7 Labs offer AI agents for specific roles?",
        answer: (
          <>
            V7 Labs lists AI agents for roles like contract manager and legal
            bill auditor. {sourceLink("https://www.v7labs.com/", "[4]")}
          </>
        ),
      },
      {
        question: "Is V7 Labs a fit for robotics data capture?",
        answer:
          "V7 Labs focuses on document automation. Claru is a better fit when you need physical-world capture and enrichment for robotics data.",
      },
      {
        question: "When is Claru a better fit?",
        answer:
          "Claru is a better fit when you need capture, enrichment, and delivery of robotics-ready datasets.",
      },
      {
        question: "Can teams use both V7 Labs and Claru?",
        answer:
          "Some teams use V7 Labs for document automation and Claru for capture-first physical AI datasets.",
      },
      {
        question: "How does V7 Labs structure workflows?",
        answer: (
          <>
            V7 Labs highlights turning complex documents into structured,
            repeatable workflows. {sourceLink("https://www.v7labs.com/", "[2]")}
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
    { label: "V7 Labs", url: "https://www.v7labs.com/" },
  ],
};
