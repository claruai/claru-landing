// ---------------------------------------------------------------------------
// Content Page: Red Teaming Data
// ---------------------------------------------------------------------------
// Tier 1 pillar page targeting "red teaming AI models" — addresses the gap
// between automated vulnerability scanning and the expert adversarial testing
// that EU AI Act compliance and frontier model safety require.
// ---------------------------------------------------------------------------

import type { ContentPageData } from "./types";

const redTeamingData: ContentPageData = {
  // -- Identity & SEO --
  slug: "red-teaming-data",
  title: "Human Red Teaming Data for AI Safety and EU AI Act Compliance",
  metaTitle: "Human Red Teaming Data for AI Safety | Claru",
  metaDescription:
    "Expert human red teaming for AI models — structured adversarial testing that satisfies EU AI Act Articles 55 and 99. 241K+ safety annotations delivered.",
  primaryKeyword: "red teaming AI models",
  secondaryKeywords: [
    "AI red teaming",
    "EU AI Act compliance",
    "adversarial testing AI",
    "AI safety evaluation",
    "red team data",
    "AI vulnerability testing",
    "human red teaming",
  ],
  breadcrumbLabel: "Red Teaming Data",
  ogCategory: "solution",

  // -- Hero --
  heroSubtitle:
    "Automated scanners find the vulnerabilities they were programmed to find. Expert human red teamers find the vulnerabilities that matter — the novel attack vectors, social engineering exploits, and multi-step jailbreaks that automated tools miss entirely. Claru delivers structured adversarial testing data that satisfies EU AI Act requirements and closes the safety gaps that automated red teaming leaves open.",
  videoSrc: "/videos/sol-red-teaming.mp4",

  // -- Problem Section --
  problem: {
    heading:
      "Why Do Automated Red Teaming Tools Miss Critical Vulnerabilities?",
    sections: [
      {
        heading:
          "Why Do Automated Red Teaming Tools Miss Critical Vulnerabilities?",
        content:
          "Automated red teaming tools miss critical vulnerabilities because they operate within predefined attack taxonomies. They test for known jailbreak patterns and prompt injection templates, but they cannot invent novel attack strategies the way a skilled adversarial tester can. Anthropic's research on Constitutional AI classifiers demonstrated this gap directly: without defenses, 86% of jailbreak attempts succeeded across 183 human participants over 3,000+ hours of testing. With Constitutional Classifiers deployed, that rate dropped to 4.4% — but the attacks that still succeeded were creative multi-step strategies that no automated scanner had flagged. The 4.4% residual rate represents exactly the kind of sophisticated vulnerability that requires human adversarial reasoning to discover and characterize.\n\nOpenAI's approach to external red teaming reinforces this pattern. Their red teaming methodology relies on domain experts — not crowdsourced testers — because effective adversarial testing requires understanding the model's capabilities well enough to probe its boundaries in ways the developers did not anticipate. A cybersecurity researcher probing a code generation model will discover different failure modes than a automated fuzzer running template-based attacks, because the researcher understands the downstream consequences of generated code in ways that a pattern-matching system cannot.",
        citationIds: ["anthropic-constitutional-2025", "openai-red-teaming"],
      },
      {
        heading:
          "What Does the EU AI Act Require for Red Teaming?",
        content:
          "The EU AI Act creates binding obligations for adversarial testing of high-risk and general-purpose AI systems. Article 55 requires providers of general-purpose AI models with systemic risk to conduct adversarial testing, including red teaming, to identify and mitigate risks. Article 99 establishes enforcement with fines up to 35 million euros or 7% of global annual turnover — whichever is higher — for non-compliance. Full enforcement begins August 2026, giving providers a defined window to build compliant testing programs.\n\nThe regulation does not prescribe specific red teaming methodologies, but it requires that testing be proportionate to the risk profile of the system and that results be documented for regulatory review. The NIST AI Risk Management Framework provides complementary guidance, recommending structured adversarial evaluation as part of the Measure function — testing AI systems against known and emergent threat categories with documented results and remediation plans. Executive Order 14110 further defined AI red teaming as structured testing to identify flaws and vulnerabilities, though it was rescinded in January 2025. The regulatory direction is clear: providers need documented, repeatable adversarial testing — not ad hoc internal reviews — to demonstrate compliance.",
        citationIds: [
          "eu-ai-act-2024",
          "nist-ai-rmf-2023",
          "eo-14110-2023",
        ],
      },
    ],
  },

  // -- Landscape / Comparison --
  landscape: {
    heading:
      "How Do Different Red Teaming Approaches Compare for AI Safety?",
    description:
      "Red teaming approaches range from fully automated vulnerability scanners to expert-led adversarial testing programs. The trade-off is between coverage breadth and vulnerability depth — automated tools test thousands of known patterns quickly, while expert testers discover novel attack vectors that no scanner has been trained on. For EU AI Act compliance, the question is whether your testing methodology produces audit-ready documentation of both known and emergent risks.",
    datasets: [
      {
        name: "Automated Red Teaming Tools",
        scale: "10,000+ attacks/hour",
        tasks: "Known jailbreak patterns, prompt injection templates, toxicity probes",
        environments: "Text-only, single-turn",
        limitations:
          "Cannot discover novel attack vectors; limited to predefined taxonomies; no multi-step reasoning; miss social engineering and context-dependent exploits",
        isClaru: false,
      },
      {
        name: "Crowdsourced Red Teaming",
        scale: "100-500 testers",
        tasks: "Broad vulnerability discovery, creative prompt attacks",
        environments: "Text, some multi-modal",
        limitations:
          "Inconsistent tester quality; no domain expertise requirement; high noise-to-signal ratio; limited coverage of specialized domains (code, biomedical, legal)",
        isClaru: false,
      },
      {
        name: "Expert Human Red Teaming",
        scale: "10-50 specialists",
        tasks: "Novel attack discovery, multi-step jailbreaks, domain-specific exploits",
        environments: "Multi-modal, multi-turn, cross-system",
        limitations:
          "Higher cost per test; slower throughput than automated tools; requires careful specialist recruitment",
        isClaru: false,
      },
      {
        name: "Claru Expert Red Teaming",
        scale: "Calibrated teams of 10-50+ specialists",
        tasks: "Structured adversarial testing, EU AI Act compliance documentation, residual risk quantification, threshold calibration",
        environments: "Multi-modal (text, image, video), multi-turn, product-context-aware",
        limitations:
          "Requires 2-3 week ramp-up for novel safety taxonomies; best suited for systematic programs rather than one-off scans",
        isClaru: true,
      },
    ],
  },

  // -- Solution Section --
  solution: {
    heading:
      "How Does Claru Deliver Audit-Ready Red Teaming Data?",
    sections: [
      {
        heading:
          "How Does Claru Structure Adversarial Testing for Production Safety Systems?",
        content:
          "Claru's red teaming methodology decomposes adversarial testing into discrete, measurable workstreams — each targeting a specific failure mode category with calibrated detection thresholds. In one engagement, Claru built and red-teamed a production content moderation system across NSFW detection, celebrity likeness recognition, and IP likeness detection. The approach used structured adversarial datasets — including AI-generated pentesting prompts, known jailbreaking patterns, and manually crafted edge cases — run against the live moderation pipeline via a custom dashboard tracking block rates, false negative rates, and latency per model in real time. The result: sub-2% output rejection rate with full safety coverage and zero critical safety gaps remaining after red team cycles.\n\nThis structured approach differs fundamentally from ad hoc internal testing. Each red teaming cycle produces a documented report mapping failure modes to specific model configurations, enabling targeted threshold adjustments rather than blanket parameter changes. Confidence thresholds are calibrated per category using labeled evaluation datasets, with separate configurations validated through controlled A/B testing — consumer-facing products receive stricter enforcement while enterprise APIs use more permissive settings.",
        citationIds: ["anthropic-constitutional-2025"],
      },
      {
        heading:
          "How Does Claru Quantify Residual Safety Risk at Scale?",
        content:
          "Beyond adversarial attack discovery, Claru delivers the residual risk quantification that EU AI Act compliance requires — measuring the rate at which harmful content passes through automated moderation undetected. In a multi-modal safety annotation program, Claru completed 241,000+ safety annotations across text and video outputs that had already passed automated moderation. Annotators evaluated outputs against a multi-dimensional safety taxonomy covering nudity/NSFW content, violence, hate speech, self-harm, and illegal activity, maintaining below 2% violation rates against the client's threshold.\n\nAnnotator consistency is monitored continuously: calibration sets are seeded at a 5% rate with pre-labeled items, and annotators falling below 92% agreement are pulled for immediate retraining. This operational discipline produces the quantitative safety evidence that satisfies both internal governance requirements and external audit requests — residual violation rates broken down by product, modality, and safety category. The pattern analysis from this program surfaced 3 systematic gaps in the client's automated moderation pipeline that aggregate metrics alone had not detected, leading to targeted model retraining that reduced residual violations by an estimated 40%.",
        citationIds: ["eu-ai-act-2024", "nist-ai-rmf-2023"],
      },
    ],
  },

  // -- Case Studies --
  caseStudySlugs: ["red-teaming-moderation", "generative-ai-safety"],

  // -- Dataset Showcase --
  datasetIds: [],

  // -- FAQ --
  faqs: [
    {
      question:
        "What does the EU AI Act require for red teaming AI models?",
      answer:
        "The EU AI Act requires providers of general-purpose AI models with systemic risk to conduct adversarial testing, including red teaming, under Article 55. Article 99 establishes fines up to 35 million euros or 7% of global annual turnover for non-compliance. Full enforcement begins August 2026. The regulation requires that testing be proportionate to the system's risk profile and that results be documented for regulatory review — meaning providers need structured, repeatable adversarial testing programs with audit-ready output.",
    },
    {
      question:
        "How is human red teaming different from automated vulnerability scanning?",
      answer:
        "Human red teaming discovers novel attack vectors that automated scanners cannot find because automated tools are limited to predefined attack taxonomies. Anthropic's Constitutional Classifiers research showed that even after reducing jailbreak success from 86% to 4.4%, the remaining successful attacks were creative multi-step strategies no automated scanner had flagged. Human red teamers combine domain expertise with adversarial reasoning to probe boundaries in ways developers did not anticipate — particularly for social engineering, context-dependent exploits, and multi-modal attacks.",
    },
    {
      question:
        "How many red teaming annotations does Claru typically deliver?",
      answer:
        "Claru has delivered 241,000+ safety annotations in a single program across text and video modalities, with annotator calibration maintained above 92% agreement on gold-standard sets. Volume depends on scope — a focused moderation system red team may involve thousands of structured adversarial tests across 3 detection models, while a comprehensive residual risk assessment spans hundreds of thousands of post-filter annotations. Claru scales teams from 10 to 50+ calibrated specialists depending on the engagement.",
    },
    {
      question:
        "What safety categories does Claru's red teaming cover?",
      answer:
        "Claru's safety taxonomies cover nudity and NSFW content, violence and gore, hate speech and harassment, self-harm, illegal activity, celebrity and IP likeness, and domain-specific risk categories defined collaboratively with each client's trust and safety team. Each category includes detailed policy definitions with visual exemplars, boundary cases, and guidance on culturally variable norms. Taxonomies are versioned so that policy updates can be deployed to annotator teams within 3-5 business days.",
    },
    {
      question:
        "Can Claru's red teaming data satisfy multiple regulatory frameworks simultaneously?",
      answer:
        "Yes. Claru's structured adversarial testing produces documentation that maps to both EU AI Act requirements (Articles 55 and 99) and the NIST AI Risk Management Framework's Measure function. The output includes quantified residual risk metrics, failure mode categorization, remediation tracking, and audit-ready reports — evidence artifacts that satisfy regulatory review regardless of which framework the auditor is applying. This dual-framework approach is particularly relevant for companies operating in both EU and US markets.",
    },
  ],

  // -- Research Citations --
  citations: [
    {
      id: "anthropic-constitutional-2025",
      title: "Constitutional Classifiers: Defending against Universal Jailbreaks across Thousands of Hours of Red Teaming",
      authors: "Anthropic",
      venue: "Anthropic Research",
      year: 2025,
      url: "https://arxiv.org/abs/2501.18837",
      keyClaim:
        "Constitutional Classifiers reduced jailbreak success rate from 86% to 4.4% across 183 participants and 3,000+ hours of adversarial testing.",
    },
    {
      id: "openai-red-teaming",
      title: "OpenAI's Approach to External Red Teaming for AI Models and Systems",
      authors: "OpenAI",
      venue: "OpenAI Research",
      year: 2025,
      url: "https://cdn.openai.com/papers/openais-approach-to-external-red-teaming.pdf",
      keyClaim:
        "Effective red teaming requires domain experts rather than crowdsourced testers, because adversarial testing demands understanding model capabilities deeply enough to probe unanticipated boundaries.",
    },
    {
      id: "eu-ai-act-2024",
      title: "Regulation (EU) 2024/1689 — Artificial Intelligence Act",
      authors: "European Parliament and Council",
      venue: "Official Journal of the European Union",
      year: 2024,
      url: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
      keyClaim:
        "Article 55 requires adversarial testing (including red teaming) for general-purpose AI with systemic risk; Article 99 establishes fines up to 35 million euros or 7% of global turnover for non-compliance, with full enforcement from August 2026.",
    },
    {
      id: "nist-ai-rmf-2023",
      title: "Artificial Intelligence Risk Management Framework (AI RMF 1.0)",
      authors: "National Institute of Standards and Technology",
      venue: "NIST",
      year: 2023,
      url: "https://doi.org/10.6028/NIST.AI.100-1",
      keyClaim:
        "The Measure function recommends structured adversarial evaluation as part of AI risk management — testing systems against known and emergent threat categories with documented results and remediation plans.",
      doi: "10.6028/NIST.AI.100-1",
    },
    {
      id: "eo-14110-2023",
      title: "Executive Order 14110: Safe, Secure, and Trustworthy Development and Use of Artificial Intelligence",
      authors: "The White House",
      venue: "Federal Register",
      year: 2023,
      url: "https://www.federalregister.gov/documents/2023/11/01/2023-24283/safe-secure-and-trustworthy-development-and-use-of-artificial-intelligence",
      keyClaim:
        "Defined AI red-teaming as structured testing to identify flaws and vulnerabilities in AI systems; rescinded January 2025 but established the terminology now used across regulatory frameworks.",
    },
  ],

  // -- Internal Linking --
  pillarLinks: ["/pillars/validate/red-teaming"],

  // -- Related Content Pages --
  relatedSlugs: [
    "eu-ai-act-red-teaming",
    "expert-rlhf-annotation",
    "video-generation-training-data",
  ],
};

export default redTeamingData;
