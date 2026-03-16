import type { ContentPageData } from "./types";

const euAiActRedTeaming: ContentPageData = {
  // -- Identity & SEO --
  slug: "eu-ai-act-red-teaming",
  title: "EU AI Act Red Teaming Requirements: What Data You Actually Need",
  metaTitle: "EU AI Act Red Teaming Requirements & Data | Claru",
  metaDescription:
    "EU AI Act Articles 5, 55, and 99 mandate adversarial testing for AI systems. Enforcement timeline, fine structure, and the red teaming data you need to comply.",
  primaryKeyword: "EU AI Act red teaming",
  secondaryKeywords: [
    "EU AI Act compliance",
    "EU AI Act adversarial testing",
    "AI Act red teaming requirements",
    "GPAI provider obligations",
    "EU AI Act enforcement timeline",
    "AI safety testing EU regulation",
  ],
  breadcrumbLabel: "EU AI Act Red Teaming",
  ogCategory: "solution",

  // -- Hero --
  heroSubtitle:
    "The EU AI Act introduces the first legally binding red teaming requirements for AI systems. Article 55 mandates adversarial testing for general-purpose AI (GPAI) providers, with fines up to 35 million euros or 7% of global turnover for prohibited practices under Article 99. This guide breaks down the specific articles, enforcement dates, and the red teaming data infrastructure you need to demonstrate compliance before the August 2025 deadline for new GPAI providers.",

  // -- Problem Section --
  problem: {
    heading:
      "What does the EU AI Act actually require for red teaming and adversarial testing?",
    sections: [
      {
        heading: "Article 55 mandates adversarial testing for GPAI providers with systemic risk",
        content:
          "Article 55 of the EU AI Act requires providers of general-purpose AI models with systemic risk to \"perform adversarial testing, including through red teaming\" to identify and mitigate risks [1]. This is not a suggestion or best practice; it is a legal obligation with enforcement mechanisms. GPAI models are classified as systemic risk when their cumulative compute exceeds 10^25 FLOPs or when designated by the AI Office based on other criteria. For providers above this threshold, Article 55 requires documented adversarial testing protocols, structured reporting of identified vulnerabilities, and evidence of mitigation measures. The requirement applies to new GPAI providers starting August 2, 2025, with existing providers given until August 2, 2027 to comply [1].",
        citationIds: ["eu-ai-act-2024"],
      },
      {
        heading: "The enforcement timeline creates immediate compliance pressure",
        content:
          "The EU AI Act enforcement follows a phased timeline. Article 5 prohibitions on unacceptable-risk AI practices took effect February 2, 2025 [1]. Article 55 obligations for new GPAI providers with systemic risk take effect August 2, 2025. Full enforcement under Article 99 begins August 2, 2026, with national authorities empowered to impose fines. Existing GPAI providers who were on the market before August 2, 2025 have a transitional period: they must comply with Article 55 adversarial testing requirements by August 2, 2027. Annex XI specifies the technical documentation that GPAI providers must maintain, including descriptions of adversarial testing methodologies and results [1]. This documentation becomes the evidentiary basis for compliance assessments.",
        citationIds: ["eu-ai-act-2024"],
      },
      {
        heading: "Fines scale with revenue, making non-compliance existentially expensive",
        content:
          "Article 99 establishes a three-tier fine structure. Violations of prohibited AI practices (Article 5) carry fines up to 35 million euros or 7% of global annual turnover, whichever is higher [1]. Violations of other obligations, including Article 55 adversarial testing requirements, carry fines up to 15 million euros or 3% of global turnover [1]. For a company with 500 million euros in annual revenue, the maximum Article 55 non-compliance fine is 15 million euros. For a company with 5 billion euros revenue, it rises to 150 million euros. These penalties make the cost of implementing a structured red teaming program negligible relative to the cost of non-compliance.",
        citationIds: ["eu-ai-act-2024"],
      },
    ],
  },

  // -- Landscape / Comparison --
  landscape: {
    heading:
      "What is the EU AI Act enforcement timeline for red teaming obligations?",
    description:
      "The EU AI Act rolls out enforcement in phases between February 2025 and August 2027. Each milestone introduces new obligations for AI providers, with GPAI adversarial testing requirements landing in August 2025 for new providers. This timeline determines when your red teaming data infrastructure must be operational.",
    datasets: [
      {
        name: "February 2, 2025",
        scale: "Article 5 — Prohibited Practices",
        tasks: "Ban on social scoring, manipulative AI, real-time biometric surveillance (with exceptions)",
        environments: "All AI providers operating in EU market",
        limitations:
          "Applies immediately; no transitional period; 35M euros or 7% turnover fines",
        isClaru: false,
      },
      {
        name: "August 2, 2025",
        scale: "Article 55 — GPAI Systemic Risk (new providers)",
        tasks: "Adversarial testing, red teaming, vulnerability reporting, risk mitigation documentation",
        environments: "New GPAI providers with systemic risk classification",
        limitations:
          "Applies to providers entering market after this date; Annex XI documentation required",
        isClaru: false,
      },
      {
        name: "August 2, 2026",
        scale: "Article 99 — Full Enforcement",
        tasks: "National authorities can impose fines; compliance audits begin",
        environments: "All AI providers in scope of the Act",
        limitations:
          "15M euros or 3% turnover for Article 55 violations; 35M euros or 7% for prohibited practices",
        isClaru: false,
      },
      {
        name: "August 2, 2027",
        scale: "Article 55 — Existing GPAI Compliance Deadline",
        tasks: "Full adversarial testing compliance for pre-existing GPAI providers",
        environments: "GPAI providers on market before August 2, 2025",
        limitations:
          "No further extensions; full fine schedule applies after this date",
        isClaru: false,
      },
    ],
  },

  // -- Solution Section --
  solution: {
    heading:
      "How should AI labs build a red teaming program that satisfies EU AI Act requirements?",
    sections: [
      {
        heading: "Structured adversarial testing produces audit-ready documentation",
        content:
          "Article 55 and Annex XI require GPAI providers to document their adversarial testing methodology, the vulnerabilities identified, and the mitigation measures implemented. Ad hoc internal testing does not satisfy this requirement; the documentation must demonstrate systematic coverage across risk categories. Claru's red teaming engagements produce structured reports mapping each adversarial test to specific failure modes, with block rates, false negative rates, and latency metrics tracked per detection model [3]. This report format directly maps to Annex XI documentation requirements, providing the evidentiary record that compliance auditors need.",
        citationIds: ["claru-redteam-2026"],
      },
      {
        heading: "Scale matters: Anthropic's 183-participant red team reduced jailbreak rates from 86% to 4.4%",
        content:
          "Anthropic's Constitutional Classifiers paper demonstrates the scale of adversarial testing required to meaningfully reduce model vulnerabilities: 183 human participants spent over 3,000 hours attempting to elicit harmful outputs, achieving an initial 86% jailbreak success rate that was reduced to 4.4% through iterative model hardening [2]. This scale is not optional for EU AI Act compliance; Article 55 requires providers to demonstrate that adversarial testing was comprehensive enough to identify systemic risks. Claru has delivered comparable programs: 241,000+ safety annotations across text and video modalities for a generative AI company, maintaining violation rates below 2% with 92%+ annotator calibration agreement [4].",
        citationIds: ["anthropic-cc-2025", "claru-safety-2025"],
      },
      {
        heading: "Continuous red teaming, not one-time audits, is the compliance-safe approach",
        content:
          "The EU AI Act does not prescribe a specific testing frequency, but Article 55 requires providers to \"keep the model up to date\" with respect to safety. In practice, this means adversarial testing must be repeated after each significant model update, fine-tuning run, or deployment to a new use case. Claru's content moderation red teaming engagement built a real-time dashboard that runs structured adversarial datasets against live models, tracking block rates and false negatives continuously [3]. This operational infrastructure transforms red teaming from a periodic audit into an ongoing compliance function, which is the interpretation most likely to satisfy EU regulators given the Act's emphasis on continuous risk management.",
        citationIds: ["claru-redteam-2026"],
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
        "When do EU AI Act red teaming requirements take effect?",
      answer:
        "New GPAI providers with systemic risk must comply with Article 55 adversarial testing requirements by August 2, 2025. Existing GPAI providers who were on the market before that date have until August 2, 2027 to achieve full compliance. Article 5 prohibitions on unacceptable-risk AI practices already took effect February 2, 2025. Full enforcement with fine authority under Article 99 begins August 2, 2026.",
    },
    {
      question:
        "What are the fines for failing to comply with EU AI Act red teaming obligations?",
      answer:
        "Article 99 imposes fines up to 15 million euros or 3% of global annual turnover (whichever is higher) for violations of Article 55 adversarial testing requirements. Violations of Article 5 prohibited practices carry higher penalties: up to 35 million euros or 7% of global turnover. For a company with 1 billion euros in annual revenue, the maximum Article 55 fine is 30 million euros.",
    },
    {
      question:
        "Does the EU AI Act specify a red teaming methodology?",
      answer:
        "No. Article 55 requires GPAI providers to \"perform adversarial testing, including through red teaming\" but does not prescribe a specific methodology. Annex XI requires documentation of the testing approach, vulnerabilities found, and mitigations applied. In practice, this means providers have flexibility in methodology but must demonstrate systematic coverage and produce audit-ready documentation. NIST AI RMF and the Anthropic Constitutional Classifiers approach provide reference frameworks that align with the Act's intent.",
    },
    {
      question:
        "How many red teamers does a compliance-grade program need?",
      answer:
        "There is no minimum specified in the Act. Anthropic's published red teaming program used 183 participants over 3,000 hours to achieve meaningful vulnerability reduction (86% to 4.4% jailbreak rate). Claru's safety annotation programs have deployed teams producing 241,000+ annotations with continuous 92%+ calibration agreement. The appropriate scale depends on model complexity, risk classification, and the number of safety categories requiring coverage.",
    },
    {
      question:
        "Do GPAI providers outside the EU need to comply with the AI Act?",
      answer:
        "Yes, if their models are placed on the EU market or their outputs are used within the EU. The AI Act applies based on market presence, not corporate domicile. A US-based GPAI provider whose model is available to EU users must comply with Article 55 adversarial testing requirements on the same timeline as EU-based providers. This extraterritorial scope mirrors the GDPR enforcement model.",
    },
  ],

  // -- Research Citations --
  citations: [
    {
      id: "eu-ai-act-2024",
      title:
        "Regulation (EU) 2024/1689 — The Artificial Intelligence Act",
      authors: "European Parliament and Council",
      venue: "Official Journal of the European Union",
      year: 2024,
      url: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
      keyClaim:
        "Establishes legally binding adversarial testing requirements for GPAI providers with systemic risk (Article 55), with fines up to 35M euros or 7% turnover for prohibited practices (Article 99).",
    },
    {
      id: "anthropic-cc-2025",
      title: "Constitutional Classifiers: Defending Against Universal Jailbreaks",
      authors: "Anthropic",
      venue: "Anthropic Research",
      year: 2025,
      url: "https://www.anthropic.com/research/constitutional-classifiers",
      keyClaim:
        "183 human red team participants spent 3,000+ hours testing; jailbreak success rate reduced from 86% to 4.4% through iterative model hardening with constitutional classifiers.",
    },
    {
      id: "claru-redteam-2026",
      title:
        "Building and Red-Teaming an AI Content Moderation System",
      authors: "Claru",
      venue: "Case Study",
      year: 2026,
      url: "/case-studies/red-teaming-moderation",
      keyClaim:
        "Achieved sub-2% output rejection rate with full safety coverage across NSFW, celebrity, and IP detection categories through structured adversarial testing and real-time monitoring dashboards.",
    },
    {
      id: "claru-safety-2025",
      title:
        "Scaling Generative AI Safety Through Human-Led Data Labeling",
      authors: "Claru",
      venue: "Case Study",
      year: 2025,
      url: "/case-studies/generative-ai-safety",
      keyClaim:
        "241,000+ safety annotations across text and video outputs, maintaining violation rates below 2% with 92%+ annotator calibration agreement through continuous monitoring.",
    },
    {
      id: "nist-ai-rmf-2023",
      title: "Artificial Intelligence Risk Management Framework (AI RMF 1.0)",
      authors: "National Institute of Standards and Technology",
      venue: "NIST",
      year: 2023,
      url: "https://www.nist.gov/artificial-intelligence/executive-order-safe-secure-and-trustworthy-artificial-intelligence",
      keyClaim:
        "Provides a voluntary framework for AI risk management including adversarial testing, red teaming, and continuous monitoring practices that align with EU AI Act requirements.",
    },
  ],

  // -- Internal Linking --
  pillarLinks: ["/pillars/validate/red-teaming"],

  // -- Related Content Pages --
  relatedSlugs: [
    "red-teaming-data",
    "expert-rlhf-annotation",
    "crowdsourced-vs-expert-rlhf",
  ],
};

export default euAiActRedTeaming;
