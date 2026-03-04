// =============================================================================
// Seed Demo Deck — Claru First Call Sales Presentation
// ~20 slides, structured narrative arc
// =============================================================================

import type { SlideData } from "@/types/deck-builder";

// ---------------------------------------------------------------------------
// Visual assets
// ---------------------------------------------------------------------------
export const CLARU_VISUAL_ASSETS = {
  robotFace: "/images/robot-face7.webp",
  logo: "/images/logo-animated-small.gif",
  egocentricProcess: "/images/case-studies/egocentric-video-collection/process.png",
  workplaceProcess: "/images/case-studies/workplace-egocentric-data/process.png",
  workplaceHero: "/images/case-studies/workplace-egocentric-data/hero.png",
  fashionSampleData: "/images/case-studies/fashion-ai-annotation/sample-data.png",
  fashionBbox: "/images/case-studies/fashion-ai-annotation/annotated-bbox.png",
  safetyProcess: "/images/case-studies/generative-ai-safety/process.png",
  safetyHero: "/images/case-studies/generative-ai-safety/hero.png",
  videoClassResults: "/images/case-studies/video-content-classification/results.png",
  identityPersistence: "/images/case-studies/object-identity-persistence/hero.png",
  dataEngineProcess: "/images/case-studies/data-engine-world-models/process.png",
  promptResults: "/images/case-studies/prompt-enhancement-benchmark/results.png",
} as const;

export function generateDemoDeck(): SlideData[] {
  const dark = { type: "solid" as const, value: "#0a0908" };
  const elevated = { type: "solid" as const, value: "#121110" };
  const accent = { type: "solid" as const, value: "#161514" };

  return [
    // =======================================================================
    // SECTION 1: WHO WE ARE (slides 1–3)
    // =======================================================================

    // 1 — Title
    {
      id: crypto.randomUUID(),
      order: 0,
      layout: "title",
      title: "Purpose-Built Data for Frontier AI Labs",
      body: "Source. Label. Ship.\n\nClaru AI — First Call Overview",
      background: { type: "image", value: CLARU_VISUAL_ASSETS.robotFace },
      metadata: {},
    },

    // 2 — Who we are
    {
      id: crypto.randomUUID(),
      order: 1,
      layout: "title-body",
      title: "We Built Claru From Inside the Labs",
      body: "Before this, we were on the other side — hunting for training data our models needed, filing tickets to annotation vendors, waiting for batch cycles, fixing labels that missed the context of what we were building.\n\nThe next generation of models won't differentiate on architecture. **They'll differentiate on data.** Not volume — quality, specificity, and the end-to-end pipeline from raw capture to golden dataset.\n\nA labor marketplace can't build that. A team that's shipped production datasets for frontier labs can.",
      background: dark,
      metadata: {},
    },

    // 3 — Two things we do
    {
      id: crypto.randomUUID(),
      order: 2,
      layout: "two-column",
      title: "What We Do",
      body: "**1. Data Collection**\n\nWe source and capture raw training data at scale — egocentric video, gameplay footage, workplace capture, and more.\n\n- 500+ global contributors across 30+ countries\n- Custom capture platforms built in days\n- Smartphones to GoPros to wearable cameras\n- Research specs translated into field-ready tasks\n---\n**2. Data Labeling & Evaluation**\n\nWe annotate, evaluate, and red-team AI systems with domain-expert humans.\n\n- 1,000+ trained annotators\n- Multi-layer QA (automated + peer + expert)\n- Safety annotation, RLHF, model benchmarking\n- Embedded teams aligned to your workflow",
      background: elevated,
      metadata: {},
    },

    // =======================================================================
    // SECTION 2: DATA COLLECTION — THE WORK (slides 4–7)
    // =======================================================================

    // 4 — Data Collection section opener with video mosaic
    {
      id: crypto.randomUUID(),
      order: 3,
      layout: "blank",
      title: "Data Collection",
      body: "",
      html: `<div style="display:flex;flex-direction:column;width:100%;height:100%;position:relative;">
        <!-- Video mosaic background -->
        <div style="position:absolute;inset:0;display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(3,1fr);gap:3px;opacity:0.4;">
          ${Array.from({ length: 12 }, (_, i) => `<video src="/videos/mosaic/mosaic-${String(i + 1).padStart(2, '0')}.mp4" autoplay muted loop playsinline style="width:100%;height:100%;object-fit:cover;"></video>`).join('\n          ')}
        </div>
        <!-- Gradient overlay -->
        <div style="position:absolute;inset:0;background:linear-gradient(135deg, rgba(10,9,8,0.85) 0%, rgba(10,9,8,0.6) 50%, rgba(10,9,8,0.85) 100%);"></div>
        <!-- Content -->
        <div style="position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;padding:60px;">
          <div style="font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#92B090;margin-bottom:24px;">// Section 01</div>
          <h1 style="font-family:'Geist Sans',-apple-system,sans-serif;font-size:clamp(40px,5vw,72px);font-weight:700;color:#fff;letter-spacing:-0.03em;line-height:1.1;margin:0 0 20px 0;">Data Collection</h1>
          <p style="font-family:'Geist Sans',sans-serif;font-size:clamp(16px,1.6vw,22px);color:rgba(255,255,255,0.6);max-width:600px;line-height:1.6;">Capturing raw training data at scale — egocentric video, gameplay footage, workplace capture — across 30+ countries.</p>
        </div>
      </div>`,
      background: dark,
      metadata: {},
    },

    // 5 — Egocentric video
    {
      id: crypto.randomUUID(),
      order: 4,
      layout: "title-body",
      title: "1,000+ Hours of Egocentric Video",
      body: "**Egocentric Video for World Models & Robotics**\n\nDelivered 1,000+ hours of geographically diverse, research-grade first-person video.\n\n- **~500 global contributors** across smartphones, GoPros, and wearable cameras\n- **Platform launched in days** — full dataset delivered in weeks\n- **Weekly delivery cadence** so research teams could iterate continuously\n- Continuous QA on framing, motion, and duration\n\nWe translated research specifications into contributor-friendly tasks and rebalanced dynamically as lab requirements shifted.",
      background: dark,
      metadata: {},
    },

    // 6 — Workplace capture
    {
      id: crypto.randomUUID(),
      order: 5,
      layout: "title-body",
      title: "Real-World Capture From Active Workplaces",
      body: "**Workplace Egocentric Data for Robotics**\n\nFirst-person video captured inside active businesses globally — food service, tailoring, cleaning, furniture assembly, factory settings.\n\n- **No specialized hardware** — smartphone capture only\n- **Minimal disruption** to normal business operations\n- **Real-world conditions** — cluttered spaces, time pressure, improvisation\n- Multi-step task sequencing under real constraints\n\nLab-captured robotics data fails to represent real work. We embed capture into real business operations to get the exact distribution that staged datasets lack.",
      background: elevated,
      metadata: {},
    },

    // 7 — Game-based capture
    {
      id: crypto.randomUUID(),
      order: 6,
      layout: "title-body",
      title: "10,000+ Hours of Synchronized Gameplay Data",
      body: "**Game-Based Data Capture for Embodied AI**\n\nBuilt a custom capture solution recording simultaneous screen video and raw timestamped control data for training embodied AI agents.\n\n- **<16ms** video-to-input temporal alignment error\n- **Zero data loss** across all sessions\n- **4+ hour** sustained capture sessions without frame drops\n- Custom application — no off-the-shelf tool existed\n\nTraining agents on paired observation-action data eliminates noisy inverse dynamics inference, enabling higher-fidelity behavior simulation.",
      background: dark,
      metadata: {},
    },

    // =======================================================================
    // SECTION 3: DATA LABELING — THE WORK (slides 8–13)
    // =======================================================================

    // 8 — Data Labeling section opener with bento video demos
    {
      id: crypto.randomUUID(),
      order: 7,
      layout: "blank",
      title: "Data Labeling & Evaluation",
      body: "",
      html: `<div style="display:flex;flex-direction:column;width:100%;height:100%;position:relative;">
        <!-- Bento grid of annotation demos -->
        <div style="position:absolute;inset:0;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:3px;opacity:0.35;">
          <video src="/videos/bento-annotation-interface.mp4" autoplay muted loop playsinline style="width:100%;height:100%;object-fit:cover;"></video>
          <video src="/videos/bento-autonomous-driving.mp4" autoplay muted loop playsinline style="width:100%;height:100%;object-fit:cover;"></video>
          <video src="/videos/bento-frame-tracking.mp4" autoplay muted loop playsinline style="width:100%;height:100%;object-fit:cover;"></video>
          <video src="/videos/bento-robot-arm.mp4" autoplay muted loop playsinline style="width:100%;height:100%;object-fit:cover;"></video>
        </div>
        <!-- Gradient overlay -->
        <div style="position:absolute;inset:0;background:linear-gradient(135deg, rgba(10,9,8,0.85) 0%, rgba(10,9,8,0.55) 50%, rgba(10,9,8,0.85) 100%);"></div>
        <!-- Content -->
        <div style="position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;padding:60px;">
          <div style="font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#92B090;margin-bottom:24px;">// Section 02</div>
          <h1 style="font-family:'Geist Sans',-apple-system,sans-serif;font-size:clamp(40px,5vw,72px);font-weight:700;color:#fff;letter-spacing:-0.03em;line-height:1.1;margin:0 0 20px 0;">Data Labeling & Evaluation</h1>
          <p style="font-family:'Geist Sans',sans-serif;font-size:clamp(16px,1.6vw,22px);color:rgba(255,255,255,0.6);max-width:600px;line-height:1.6;">Expert human annotation, safety evaluation, and model benchmarking — with the rigor frontier labs demand.</p>
        </div>
      </div>`,
      background: dark,
      metadata: {},
    },

    // 9 — Fashion annotation at scale
    {
      id: crypto.randomUUID(),
      order: 8,
      layout: "title-body",
      title: "3M+ Images Annotated With 1,000+ Labelers",
      body: "**Fashion AI — Structured Taxonomy at Scale**\n\n- **>0.85 Cohen's kappa** inter-annotator agreement\n- **3-layer QA** — automated + peer review + expert validation\n- **1,000+ annotators** organized by product category\n- Controlled vocabularies enforced at the UI level\n- Weekly retraining triggers at <0.80 kappa\n\nAt 3M+ images, even 2% inconsistency means 60K+ mislabeled items propagating systematic errors. Our multi-layer QA ensures scale amplifies signal, not noise.",
      background: dark,
      metadata: {},
    },

    // 10 — Video classification speed
    {
      id: crypto.randomUUID(),
      order: 9,
      layout: "title-body",
      title: "105K Video Clips Classified in 7 Days",
      body: "**Video Content Classification — Speed + Quality**\n\nMid-project, we spotted 15% inter-annotator disagreement. We paused, redesigned the framework from scratch in <24 hours, revalidated early outputs, and still delivered on time.\n\n- **4 automated confidence tiers**\n- **0 downstream rework**\n- Abstract definitions replaced with criteria-driven decision paths\n\nTraining data quality directly determines model performance. Resolving subjectivity early prevents hidden quality debt.",
      background: elevated,
      metadata: {},
    },

    // 11 — Safety & red teaming
    {
      id: crypto.randomUUID(),
      order: 10,
      layout: "title-body",
      title: "AI Safety: 205K Annotations, <2% Violation Rate",
      body: "**Generative AI Safety & Content Moderation**\n\nMulti-modal safety annotation across text and video — validating, strengthening, and operationalizing content safety at scale.\n\n- **92%+ annotator calibration** agreement\n- Multi-dimensional taxonomy: nudity, violence, hate speech, self-harm\n- Calibrated thresholds via A/B testing per category\n- Live dashboards for ongoing monitoring\n- Annotator fatigue managed with rotation schedules\n\nAutomated moderation alone can't quantify residual risk. Human-labeled ground truth provides evidence-based safety metrics.",
      background: dark,
      metadata: {},
    },

    // 12 — Model evaluation
    {
      id: crypto.randomUUID(),
      order: 11,
      layout: "title-body",
      title: "Benchmarking: 39K Pairwise Model Evaluations",
      body: "**Video Model Evaluation — ELO-Based Human Ranking**\n\n- **51 model configurations** compared\n- **3 input modalities** ranked (text-to-video, image-to-video, video-to-video)\n- **>0.70 Krippendorff's alpha** on retained metrics\n- Swiss-style tournament pairing with fixed baseline\n- 95% confidence intervals via bootstrap resampling\n\nAutomated metrics (FVD, FID, CLIP) correlate poorly with human perception. We provide statistically defensible evaluation that turns model selection from art into science.",
      background: elevated,
      metadata: {},
    },

    // =======================================================================
    // SECTION 4: BY THE NUMBERS (slide 13)
    // =======================================================================

    // 13 — Aggregate proof
    {
      id: crypto.randomUUID(),
      order: 12,
      layout: "two-column",
      title: "By the Numbers",
      body: "**Data Collection**\n\n- **1,000+** hours of egocentric video\n- **10,000+** hours of gameplay footage\n- **500+** global contributors\n- **30+** countries covered\n- Days to platform launch\n---\n**Data Labeling & Evaluation**\n\n- **3M+** images annotated\n- **205K** safety annotations\n- **105K** video clips in 7 days\n- **39K** pairwise evaluations\n- **1,000+** trained annotators\n- **>0.85** inter-annotator agreement",
      background: accent,
      metadata: {},
    },

    // =======================================================================
    // SECTION 5: HOW TO WORK WITH US (slides 14–16)
    // =======================================================================

    // 14 — Section divider
    {
      id: crypto.randomUUID(),
      order: 13,
      layout: "title",
      title: "How to Work With Us",
      body: "Three ways in — from buying existing datasets to full end-to-end pipeline management.",
      background: dark,
      metadata: {},
    },

    // 15 — Buy or collect
    {
      id: crypto.randomUUID(),
      order: 14,
      layout: "two-column",
      title: "Need Training Data?",
      body: "**Buy From Our Catalog**\n\nBrowse our existing datasets — egocentric video, gameplay footage, workplace capture, and more. Preview samples, check coverage, and license what fits your model.\n\n- Instant access to preview samples\n- Geographic and demographic metadata\n- Pre-labeled and raw options\n- Volume licensing available\n---\n**Let Us Go Collect It**\n\nTell us what you need. We'll design the capture protocol, recruit contributors, build the platform, and deliver production-ready data.\n\n- Custom capture protocols\n- Global contributor network\n- Multi-device support\n- Continuous QA + weekly delivery",
      background: elevated,
      metadata: {},
    },

    // 16 — Labeling services
    {
      id: crypto.randomUUID(),
      order: 15,
      layout: "title-body",
      title: "Need Labeling, Safety, or Evaluation?",
      body: "**Expert Annotation**\nDomain-specialist annotators for video, vision, and robotics. Structured taxonomies, multi-layer QA, real-time guideline iteration. From 5 to 50+ dedicated annotators embedded in your workflow.\n\n**Red Teaming & Safety**\nAdversarial testing of your AI systems. Structured moderation taxonomy, threshold calibration, live monitoring dashboards. Evidence-based safety metrics for audits and governance.\n\n**Model Benchmarking**\nHuman evaluation with statistical rigor. ELO-based ranking, pairwise comparison, side-by-side protocols. We identify winners at p < 0.01 so you can make data-driven model decisions.\n\n**Golden Set Evaluation**\nPristine, expert-verified answer keys for your model's evaluation. Versioned and reproducible for longitudinal tracking.",
      background: dark,
      metadata: {},
    },

    // =======================================================================
    // SECTION 6: PROCESS + PROOF + CTA (slides 17–20)
    // =======================================================================

    // 17 — Process
    {
      id: crypto.randomUUID(),
      order: 16,
      layout: "title-body",
      title: "Our Process: First Call to Production in 8 Weeks",
      body: "**Week 1–2: Discovery & Scoping**\nWe learn your model, architecture, and data needs. We define the annotation taxonomy or capture protocol together.\n\n**Week 2–3: Team Assembly**\nWe match domain experts to your modality and train them on your guidelines. You meet your dedicated team.\n\n**Week 3–6: Production**\nEmbedded team executes with real-time QA loops and daily syncs. Guidelines iterate live — not on the next batch cycle.\n\n**Week 6–8: Delivery & Iteration**\nFinal dataset delivery, benchmark validation, and continuous improvement pipeline. We don't disappear after handoff.",
      background: elevated,
      metadata: {},
    },

    // 18 — Black box vs glass box
    {
      id: crypto.randomUUID(),
      order: 17,
      layout: "two-column",
      title: "Why We're Different",
      body: "**The Black Box** — Traditional Vendors\n\n- **Transactional** — you pay per task\n- **Opaque** — who labeled this? No idea\n- **Slow** — feedback takes days to loop\n- **Commodity** — random crowd workers\n- Quality degrades as you scale\n---\n**The Glass Box** — The Claru Way\n\n- **Relational** — you lease a team\n- **Transparent** — you know their names\n- **Instant** — real-time debug loops\n- **Expert** — PhDs, coders, domain specialists\n- Quality improves as the team learns your model",
      background: dark,
      metadata: {},
    },

    // 19 — Social proof
    {
      id: crypto.randomUUID(),
      order: 18,
      layout: "quote",
      title: "What Our Partners Say",
      body: "Most annotation vendors give you a portal and a prayer. Claru gave us a dedicated team who actually understood what we were building. They caught edge cases our internal QA missed and helped us define annotation guidelines that scaled.\n\n— Principal Research Engineer, Bessemer Ventures-backed company",
      background: elevated,
      metadata: {},
    },

    // 20 — CTA
    {
      id: crypto.randomUUID(),
      order: 19,
      layout: "title",
      title: "Next Steps",
      body: "**1.** A deeper call to understand your specific data requirements\n**2.** We scope a pilot project — small, fast, measurable\n**3.** Your dedicated team starts delivering in weeks\n\nteam@claru.ai",
      background: { type: "image", value: CLARU_VISUAL_ASSETS.robotFace },
      metadata: {},
    },
  ];
}
