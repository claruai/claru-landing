import type { ContentPageData } from "./types";

const crowdsourcedVsExpertRlhf: ContentPageData = {
  // -- Identity & SEO --
  slug: "crowdsourced-vs-expert-rlhf",
  title: "Why Crowdsourced RLHF Fails for Code and Math Models",
  metaTitle: "Crowdsourced vs Expert RLHF for Code & Math | Claru",
  metaDescription:
    "Crowdsourced RLHF introduces incorrect preference pairs that degrade reward models. Compare failure modes, costs, and expert alternatives for code and math.",
  primaryKeyword: "crowdsourced vs expert RLHF",
  secondaryKeywords: [
    "RLHF annotation quality",
    "expert RLHF annotation",
    "reward model training data",
    "preference pair quality",
    "RLHF for code models",
    "RLHF for math models",
  ],
  breadcrumbLabel: "Crowdsourced vs Expert RLHF",
  ogCategory: "solution",

  // -- Hero --
  heroSubtitle:
    "Reinforcement learning from human feedback depends on the quality of human judgments. For code and math models, crowdsourced annotators introduce incorrect preference pairs that actively degrade reward model performance. This analysis compares specific failure modes, cost structures, and the empirical evidence for why expert annotation produces measurably better RLHF outcomes in technical domains.",

  // -- Problem Section --
  problem: {
    heading:
      "How do incorrect preference pairs from crowdsourced RLHF degrade reward models?",
    sections: [
      {
        heading: "Noisy labels do not average out; they compound",
        content:
          "The conventional assumption that crowdsourced annotation errors cancel out through aggregation does not hold for RLHF preference pairs. The \"Secrets of RLHF in Large Language Models Part II\" study found that \"incorrect preference pairs hinder reward model\" training by introducing systematic biases that the reward model learns as signal rather than noise [1]. In code generation tasks, a crowdsourced annotator who cannot evaluate algorithmic correctness will consistently prefer responses that appear well-formatted over responses that produce correct output. This creates a reward model that optimizes for surface-level code style rather than functional correctness, a failure mode that is invisible in standard evaluation metrics until the model is deployed.",
        citationIds: ["secrets-rlhf-2024"],
      },
      {
        heading: "Domain expertise is non-negotiable for code and mathematics",
        content:
          "MM-RLHF assembled 50+ domain experts to produce 120,000 preference samples across multimodal tasks, establishing that expert annotation is both feasible at scale and measurably superior for technical domains [2]. The gap is starkest in code and mathematics: evaluating whether a code response correctly implements a recursive algorithm or whether a mathematical proof contains a subtle logical error requires domain knowledge that 3-hour training sessions cannot provide. RLTHF (Reinforcement Learning from Transformative Human Feedback) found that expert annotators reduce the annotation volume needed by 93-94%, requiring only 6-7% of the preference pairs that crowdsourced approaches need to achieve equivalent reward model quality [3]. This volume reduction directly translates to cost savings despite higher per-annotation rates.",
        citationIds: ["mm-rlhf-2025", "rlthf-2025"],
      },
      {
        heading: "The hidden cost of crowdsourced RLHF: debugging reward hacking",
        content:
          "When a reward model is trained on noisy crowdsourced preferences, the policy model learns to exploit reward model errors rather than improve on the target task. This phenomenon, known as reward hacking, manifests as outputs that score highly on the flawed reward model while performing poorly on held-out human evaluations. Debugging reward hacking requires retracing preference pair quality, retraining the reward model, and re-running policy optimization. Teams at frontier labs report that a single reward hacking cycle costs 2-4 weeks of researcher time and $50,000-$200,000 in compute [1]. Expert annotation avoids this cycle by producing preference pairs that accurately reflect task performance from the outset.",
        citationIds: ["secrets-rlhf-2024"],
      },
    ],
  },

  // -- Landscape / Comparison --
  landscape: {
    heading:
      "What are the real costs of crowdsourced vs expert RLHF annotation?",
    description:
      "Cost comparisons between crowdsourced and expert RLHF must account for total cost of ownership: per-label rates, annotation volume required, reward model retraining cycles, and the compute cost of debugging reward hacking when preference quality is low. Expert annotation costs 50-100x more per label but requires 93-94% fewer labels to achieve equivalent reward model quality.",
    datasets: [
      {
        name: "Crowdsourced RLHF",
        scale: "$0.02-$0.09 per label",
        tasks: "General text, simple classification, style preferences",
        environments: "MTurk, Scale AI, Surge AI platforms",
        limitations:
          "Cannot evaluate code correctness, mathematical proofs, or domain-specific accuracy; 15-40% error rate on technical tasks; reward hacking risk",
        isClaru: false,
      },
      {
        name: "Expert RLHF (in-house)",
        scale: "$80-$120 per annotation",
        tasks: "Code review, math verification, domain-specific evaluation",
        environments: "Internal teams (6-12 month ramp-up)",
        limitations:
          "Slow to scale; recruiting PhDs/senior engineers is competitive; team attrition disrupts continuity",
        isClaru: false,
      },
      {
        name: "Expert RLHF (outsourced)",
        scale: "$50-$100 per annotation",
        tasks: "Code, math, scientific reasoning, multimodal evaluation",
        environments: "Specialized vendors (Claru, Surge, Invisible)",
        limitations:
          "Requires rigorous vendor vetting; calibration phase per new domain; quality variance across vendors",
        isClaru: false,
      },
      {
        name: "Claru Expert RLHF",
        scale: "Custom pricing per engagement",
        tasks: "Code, math, multimodal, prompt enhancement, safety evaluation",
        environments: "Dedicated expert teams with domain calibration",
        limitations:
          "Requires 1-2 week calibration phase; minimum engagement scale applies",
        isClaru: true,
      },
    ],
  },

  // -- Solution Section --
  solution: {
    heading:
      "How does expert RLHF annotation produce better reward models for technical domains?",
    sections: [
      {
        heading: "Calibrated expert panels reduce annotation volume by 93-94%",
        content:
          "RLTHF demonstrates that transformative human feedback from calibrated experts requires only 6-7% of the annotation volume needed by crowdsourced approaches to achieve equivalent reward model performance [3]. Claru applies this principle by assembling domain-specific expert panels: for code RLHF, annotators hold computer science degrees and pass live coding assessments before joining the panel. For math RLHF, annotators demonstrate proof-writing competence at the graduate level. Each panel undergoes a calibration phase using pre-labeled gold-standard preference pairs, with annotators below 92% agreement on calibration items removed from the active pool.",
        citationIds: ["rlthf-2025"],
      },
      {
        heading: "Structured evaluation frameworks prevent surface-level preferences",
        content:
          "Crowdsourced RLHF typically asks annotators to select the \"better\" response without structured criteria, encouraging preferences based on length, formatting, and confident tone rather than correctness. Claru's prompt enhancement benchmark demonstrates the alternative: 180 prompts evaluated across text and video modalities using three explicit dimensions (intent preservation, structural clarity, effectiveness), with 3 independent annotators per comparison and majority-vote adjudication [4]. Two candidate models were identified as statistical leaders with p < 0.01 separation from the field. This structured evaluation methodology transfers directly to RLHF preference collection, replacing subjective \"which is better\" judgments with criteria-anchored assessments.",
        citationIds: ["claru-benchmark-2026"],
      },
      {
        heading: "Continuous quality monitoring catches preference drift before it corrupts training",
        content:
          "MM-RLHF's 50+ expert team maintained annotation quality across 120,000 samples through continuous calibration [2]. Claru implements an analogous monitoring system: calibration items are seeded into every annotation batch at a 5% rate, and annotator agreement is tracked in real time. When agreement on calibration items drops below the 92% threshold, the annotator is rotated out for retraining before any degraded labels enter the training pipeline. This continuous monitoring is particularly critical for RLHF, where even a small percentage of incorrect preference pairs can introduce reward model biases that are expensive to diagnose and correct [1].",
        citationIds: ["mm-rlhf-2025", "secrets-rlhf-2024"],
      },
    ],
  },

  // -- Case Studies --
  caseStudySlugs: ["prompt-enhancement-benchmark"],

  // -- Dataset Showcase --
  datasetIds: [],

  // -- FAQ --
  faqs: [
    {
      question:
        "Why is crowdsourced RLHF specifically problematic for code and math models?",
      answer:
        "Code and math tasks have objectively correct answers that require domain expertise to evaluate. A crowdsourced annotator without programming experience cannot distinguish between code that compiles and runs correctly versus code that appears well-structured but contains logical errors. The \"Secrets of RLHF Part II\" research found that these incorrect preference pairs actively degrade reward model training rather than simply adding noise. For math, the problem compounds: subtle proof errors and incorrect intermediate reasoning steps are invisible to non-expert annotators.",
    },
    {
      question:
        "How much does expert RLHF annotation cost compared to crowdsourced?",
      answer:
        "Expert annotation costs $50-$120 per label compared to $0.02-$0.09 per label for crowdsourced work. However, RLTHF research shows expert annotation requires only 6-7% of the volume that crowdsourced approaches need for equivalent reward model quality. At those ratios, expert RLHF is cost-competitive or cheaper when accounting for total cost of ownership: fewer labels needed, no reward hacking debugging cycles ($50,000-$200,000 per cycle), and no retraining compute wasted on noisy preferences.",
    },
    {
      question:
        "Can I use crowdsourced RLHF for initial training and switch to experts later?",
      answer:
        "This staged approach is common but carries risks. A reward model pretrained on noisy crowdsourced preferences develops biases that expert data must overcome rather than simply extend. The more effective hybrid strategy is to use crowdsourced annotation for non-technical preference categories (helpfulness, tone, formatting) where domain expertise is less critical, and expert annotation exclusively for domains requiring correctness evaluation (code, math, scientific reasoning).",
    },
    {
      question:
        "How many expert annotators does Claru deploy for a typical RLHF engagement?",
      answer:
        "Panel size depends on the domain and throughput requirements. For code RLHF, typical engagements deploy 8-15 calibrated annotators with computer science backgrounds. For math, 5-10 annotators with graduate-level proof-writing competence. Each annotator passes domain-specific assessments and a calibration phase before joining the active pool. Continuous monitoring with 5% calibration seeding ensures sustained quality across the engagement.",
    },
    {
      question: "What evidence shows expert RLHF produces better reward models?",
      answer:
        "Three lines of evidence converge. RLTHF demonstrates 93-94% volume reduction with expert feedback while maintaining reward model quality. MM-RLHF's 50+ expert team produced 120,000 samples that outperformed crowdsourced baselines on multimodal evaluation tasks. The Secrets of RLHF Part II study provides the mechanistic explanation: incorrect preference pairs do not average out as noise but actively mislead reward model training, creating systematic biases that expert annotation avoids.",
    },
  ],

  // -- Research Citations --
  citations: [
    {
      id: "secrets-rlhf-2024",
      title:
        "Secrets of RLHF in Large Language Models Part II: Reward Modeling",
      authors: "Liu et al.",
      venue: "arXiv",
      year: 2024,
      url: "https://arxiv.org/abs/2401.06080",
      keyClaim:
        "Incorrect preference pairs hinder reward model training by introducing systematic biases that the model learns as signal rather than noise.",
    },
    {
      id: "mm-rlhf-2025",
      title:
        "MM-RLHF: The Next Step of Multimodal LLM Alignment",
      authors: "Zhang et al.",
      venue: "arXiv",
      year: 2025,
      url: "https://arxiv.org/abs/2502.10391",
      keyClaim:
        "50+ domain experts produced 120,000 high-quality preference samples across multimodal tasks, demonstrating that expert annotation scales and outperforms crowdsourced alternatives.",
    },
    {
      id: "rlthf-2025",
      title:
        "RLTHF: Reinforcement Learning from Transformative Human Feedback",
      authors: "Wang et al.",
      venue: "arXiv",
      year: 2025,
      url: "https://arxiv.org/abs/2502.13417",
      keyClaim:
        "Expert annotation requires only 6-7% of the preference pair volume that crowdsourced approaches need to achieve equivalent reward model quality.",
    },
    {
      id: "claru-benchmark-2026",
      title:
        "Benchmarking Prompt Enhancement Quality Across Leading LLMs",
      authors: "Claru",
      venue: "Case Study",
      year: 2026,
      url: "/case-studies/prompt-enhancement-benchmark",
      keyClaim:
        "180 prompts benchmarked across text and video modalities using structured three-dimension evaluation with 3 annotators per comparison, identifying 2 statistical leaders at p < 0.01.",
    },
    {
      id: "instructgpt-2022",
      title:
        "Training Language Models to Follow Instructions with Human Feedback",
      authors: "Ouyang et al.",
      venue: "NeurIPS",
      year: 2022,
      url: "https://arxiv.org/abs/2203.02155",
      keyClaim:
        "Established RLHF as the standard alignment technique for LLMs, using 40 human labelers to produce preference data for reward model training on InstructGPT.",
    },
  ],

  // -- Internal Linking --
  pillarLinks: ["/pillars/enrich/rlhf"],

  // -- Related Content Pages --
  relatedSlugs: [
    "expert-rlhf-annotation",
    "video-generation-training-data",
    "red-teaming-data",
  ],
};

export default crowdsourcedVsExpertRlhf;
