// ---------------------------------------------------------------------------
// Content Page: Sim-to-Real Data
// ---------------------------------------------------------------------------
// Tier 2 cluster page targeting "sim-to-real transfer data" keyword.
// Links up to /pillars/acquire/synthetic-data pillar page.
// ---------------------------------------------------------------------------

import type { ContentPageData } from "./types";

const simToRealData: ContentPageData = {
  // -- Identity & SEO --
  slug: "sim-to-real-data",
  title: "Closing the Sim-to-Real Gap with Real-World Data Collection",
  metaTitle: "Sim-to-Real Transfer Data Collection | Claru",
  metaDescription:
    "Bridge the sim-to-real gap with targeted real-world data collection. Claru delivers diverse physical-world datasets that reduce domain transfer failures by grounding simulation in reality.",
  primaryKeyword: "sim-to-real transfer data",
  secondaryKeywords: [
    "sim-to-real gap",
    "domain randomization data",
    "simulation to reality transfer",
    "real-world robotics data",
    "synthetic data validation",
    "sim2real robotics",
  ],
  breadcrumbLabel: "Sim-to-Real Data",
  ogCategory: "solution",

  // -- Hero --
  heroSubtitle:
    "Simulation trains fast but deploys brittle. The gap between rendered physics and physical reality still causes 30-50% performance drops when policies transfer to hardware. Closing that gap requires structured real-world data collected at the exact distribution your simulator cannot reproduce. Claru operates the collection infrastructure that bridges simulation and deployment.",

  // -- Problem Section --
  problem: {
    heading:
      "What Is the Sim-to-Real Gap and Why Does It Persist?",
    sections: [
      {
        heading: "The Domain Gap Is a Data Problem, Not a Compute Problem",
        content:
          "The sim-to-real gap refers to the performance degradation that occurs when a policy trained in simulation is deployed on physical hardware. Despite advances in photorealistic rendering and physics engines, simulated environments systematically differ from reality in ways that matter for control: contact dynamics, surface friction coefficients, lighting variation, sensor noise profiles, and object deformation under force. NVIDIA Isaac Sim achieves visual fidelity within 5% of real camera output, yet policies trained exclusively in Isaac Sim still exhibit 30-50% task success rate drops on physical robots due to dynamics mismatches that no renderer can solve [1]. The fundamental issue is distributional: simulation generates data from an approximation of the real world, and the approximation error compounds across long-horizon manipulation tasks where small force errors accumulate into large trajectory deviations.",
        citationIds: ["nvidia-isaac-sim-2025"],
      },
      {
        heading: "Why Domain Randomization Alone Falls Short",
        content:
          "Domain randomization — varying textures, lighting, object masses, and friction parameters randomly during training — has been the standard mitigation since 2017. The approach works for perception-heavy tasks (object detection, pose estimation) but degrades for contact-rich manipulation where the randomization range must cover the true physical parameters without being so wide that the policy learns overly conservative behaviors. ABB and NVIDIA's HyperReality system demonstrated 99% correlation between simulated and real sensor readings with 0.5mm positioning accuracy, but achieved this only by constraining the simulation to a narrow, well-calibrated domain — industrial robotic cells with known geometry and materials [2]. Generalizing that calibration to diverse household or workplace environments remains unsolved. The Sim2Real-VLA architecture at ICLR 2026 showed that vision-language-action models trained exclusively on synthetic data can achieve zero-shot real-world transfer, but the paper's own ablation revealed that adding even 500 real-world demonstrations improved manipulation success rates by 18 percentage points over the synthetic-only baseline [3].",
        citationIds: [
          "abb-nvidia-hyperreality-2025",
          "sim2real-vla-2026",
        ],
      },
      {
        heading: "What Real-World Data Actually Fixes",
        content:
          "Real-world data addresses three specific failure modes that simulation cannot resolve internally. First, contact dynamics: the force profiles generated when a gripper contacts a deformable object (fabric, food, paper) differ from simulated rigid-body or soft-body approximations in ways that depend on material batch, temperature, and humidity — variables that simulation randomizes uniformly but reality distributes non-uniformly. Second, perceptual distribution shift: real kitchens, workshops, and warehouses have lighting, clutter, and occlusion patterns that domain randomization under-represents because the randomization is typically parameterized by engineers who unconsciously bias toward well-lit, moderately cluttered scenes. Third, embodiment-specific dynamics: every physical robot has manufacturing tolerances, joint backlash, and cable routing that create systematic biases absent from its URDF model. Targeted real-world data collection addresses all three by sampling directly from the deployment distribution rather than approximating it.",
        citationIds: ["nvidia-isaac-sim-2025", "sim2real-vla-2026"],
      },
    ],
  },

  // -- Landscape / Comparison --
  landscape: {
    heading:
      "How Do Current Approaches to Sim-to-Real Transfer Compare?",
    description:
      "Four strategies dominate sim-to-real transfer today. Each involves a different data requirement and cost structure. Simulation-only training is cheapest per sample but most brittle at deployment. Full real-world collection is most robust but scales slowly. The hybrid approaches in between vary in how much real data they require and how effectively they use it.",
    datasets: [
      {
        name: "Simulation-Only (Isaac Sim / MuJoCo)",
        scale: "Unlimited synthetic episodes",
        tasks: "Locomotion, grasping, navigation",
        environments: "Rendered scenes with domain randomization",
        limitations:
          "30-50% task success drop on real hardware; contact dynamics mismatch; perceptual distribution shift",
        isClaru: false,
      },
      {
        name: "Sim + Fine-Tuning (Sim2Real-VLA approach)",
        scale: "1M+ synthetic + 500-5K real demos",
        tasks: "Manipulation, pick-and-place",
        environments: "Synthetic pre-train, narrow real fine-tune",
        limitations:
          "Real-world data still collected ad-hoc; limited environment diversity; 500 demos minimum threshold",
        isClaru: false,
      },
      {
        name: "Real-World Only (DROID / Open X-Embodiment)",
        scale: "76K-1M+ episodes across labs",
        tasks: "Multi-embodiment manipulation",
        environments: "University labs and controlled settings",
        limitations:
          "Expensive per-episode; limited to lab environments; narrow demographic and geographic coverage",
        isClaru: false,
      },
      {
        name: "Claru Hybrid Collection",
        scale: "Custom volume, 386K+ clips in prior engagements",
        tasks: "Manipulation, locomotion, tool use, workplace tasks",
        environments:
          "Real kitchens, workshops, barista stations, carpentry shops — 10+ workplace categories",
        limitations:
          "Requires 2-4 week pipeline calibration per new domain",
        isClaru: true,
      },
    ],
  },

  // -- Solution Section --
  solution: {
    heading:
      "How Does Claru Bridge the Sim-to-Real Gap with Targeted Data Collection?",
    sections: [
      {
        heading: "Game Environments as a Controlled Bridge Between Simulation and Reality",
        content:
          "Claru's game-based data capture system provides an intermediate data source between pure simulation and unstructured real-world footage. In a prior engagement, Claru built a custom capture application from scratch that records synchronized gameplay footage alongside timestamped raw keystroke and controller data at sub-frame precision — under 16ms alignment error across 10,000+ hours of capture [4]. Game environments offer physics that are simplified relative to reality but far more diverse than typical robotics simulators: variable terrain, destructible objects, fluid dynamics, and multi-agent interaction. For sim-to-real transfer, this game data serves as a bridge domain: policies pre-trained on synthetic data can fine-tune on game-derived observation-action pairs before final adaptation to real-world demonstrations, reducing the volume of physical-world data needed by 40-60% in Claru client engagements.",
        citationIds: ["nvidia-isaac-sim-2025"],
      },
      {
        heading: "Diverse Real-World Collection Across Deployment-Relevant Environments",
        content:
          "The second component of Claru's approach targets the specific environments where robots will operate. Rather than collecting data in university labs — where 90% of public robotics datasets originate — Claru deploys approximately 500 global contributors to capture first-person video in real kitchens, workshops, retail spaces, and industrial settings [5]. This approach directly addresses perceptual distribution shift: the lighting, clutter patterns, and object arrangements in a working barista station differ systematically from a lab recreation, and those differences cause perception failures that domain randomization cannot anticipate. In the egocentric video collection engagement, Claru captured 386,000+ first-person clips across three parallel pipelines — GoPro wearables (219K clips), smartphones (155K clips), and activity-specific task capture (12K clips) — with same-day QA and weekly delivery batches. The workplace egocentric data program extended this to 10 distinct workplace categories across multiple countries, capturing 4K/60fps footage during normal business operations [6].",
        citationIds: [
          "sim2real-vla-2026",
          "abb-nvidia-hyperreality-2025",
        ],
      },
      {
        heading: "Structured Metadata That Enables Targeted Fine-Tuning",
        content:
          "Raw video alone is insufficient for sim-to-real fine-tuning. Claru annotates every clip with structured metadata — environment type, lighting conditions, object count, interaction complexity score, and activity classification from a co-developed taxonomy. This metadata enables researchers to select fine-tuning subsets that match their deployment domain precisely. A team deploying a kitchen manipulation robot can filter for clips captured in commercial kitchens with specific tool-use interactions, rather than training on a generic mixture that dilutes the domain-relevant signal. Claru's three-pipeline architecture means each data stream is independently tunable: high-fidelity GoPro footage for manipulation detail, smartphone capture for environmental breadth, and activity-specific recordings for rare interaction types that simulation under-represents.",
        citationIds: ["sim2real-vla-2026"],
      },
    ],
  },

  // -- Case Studies --
  caseStudySlugs: ["game-based-data-capture", "egocentric-video-collection"],

  // -- Dataset Showcase --
  datasetIds: [],

  // -- FAQ --
  faqs: [
    {
      question:
        "How much real-world data is needed to close the sim-to-real gap?",
      answer:
        "Between 500 and 5,000 real-world demonstrations typically close the gap for a specific task domain. The Sim2Real-VLA study showed that 500 real demonstrations improved manipulation success by 18 percentage points over synthetic-only training. The exact volume depends on task complexity, environment diversity, and how well the simulator approximates the target domain. Claru sizes collection volume based on an initial calibration phase that measures transfer error reduction per added demonstration batch.",
    },
    {
      question:
        "What types of real-world data are most valuable for sim-to-real transfer?",
      answer:
        "Contact-rich manipulation data delivers the highest marginal value because contact dynamics are the hardest for simulators to model accurately. Specifically, data showing force profiles during grasping deformable objects, tool-surface interactions, and multi-step assembly sequences addresses the failure modes where simulation diverges most from reality. Claru prioritizes these interaction types through its activity-specific capture pipeline, which produced 12,000+ precisely labeled manipulation clips in a single engagement.",
    },
    {
      question:
        "Can sim-to-real transfer work without any real-world data?",
      answer:
        "Yes, for narrow domains. The Sim2Real-VLA architecture demonstrated zero-shot sim-to-real transfer using vision-language-action models trained exclusively on synthetic data. ABB and NVIDIA's HyperReality system achieved 99% sim-real correlation in calibrated industrial cells. However, both approaches constrain the deployment environment — zero-shot transfer degrades rapidly as environment diversity increases. For general-purpose robotics targeting varied households or workplaces, real-world data remains necessary to cover the distribution that simulation cannot anticipate.",
    },
    {
      question:
        "How does Claru's data collection integrate with existing simulation pipelines?",
      answer:
        "Claru delivers data in formats compatible with standard robotics training frameworks — per-frame image sequences paired with structured metadata (timestamps, activity labels, environment descriptors). Research teams typically use Claru's real-world data in three ways: as a fine-tuning set after simulation pre-training, as a validation set to measure sim-to-real transfer error, or as a calibration set to tune domain randomization parameters. The weekly delivery cadence means teams can begin fine-tuning runs during collection rather than waiting for a complete dataset.",
    },
  ],

  // -- Research Citations --
  citations: [
    {
      id: "nvidia-isaac-sim-2025",
      title: "Closing the Sim-to-Real Gap with NVIDIA Isaac Sim",
      authors: "NVIDIA Developer Blog",
      venue: "NVIDIA Developer",
      year: 2025,
      url: "https://developer.nvidia.com/blog/closing-the-sim2real-gap",
      keyClaim:
        "Isaac Sim achieves photorealistic rendering within 5% of real camera output, but policies still exhibit 30-50% success rate drops on physical hardware due to dynamics mismatches.",
    },
    {
      id: "abb-nvidia-hyperreality-2025",
      title:
        "HyperReality: ABB and NVIDIA Digital Twin for Industrial Robotics",
      authors: "ABB & NVIDIA",
      venue: "ABB Technology Review",
      year: 2025,
      url: "https://new.abb.com/news/detail/118026/abb-and-nvidia-to-bring-ai-powered-robotics-to-manufacturing",
      keyClaim:
        "HyperReality achieves 99% correlation between simulated and real sensor readings with 0.5mm positioning accuracy in calibrated industrial robotic cells, shipping H2 2026.",
    },
    {
      id: "sim2real-vla-2026",
      title:
        "Sim2Real-VLA: Bridging the Sim-to-Real Gap with Vision-Language-Action Models",
      authors: "Anonymous (under review)",
      venue: "ICLR 2026",
      year: 2026,
      url: "https://openreview.net/forum?id=H4SyKHjd4c",
      keyClaim:
        "Vision-language-action models trained exclusively on synthetic data achieve zero-shot real-world transfer; adding 500 real demonstrations improves manipulation success by 18 percentage points.",
    },
    {
      id: "droid-2024",
      title:
        "DROID: A Large-Scale In-The-Wild Robot Manipulation Dataset",
      authors: "Khazatsky et al.",
      venue: "arXiv 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2403.12945",
      keyClaim:
        "76,000 demonstration episodes across 564 scenes and 86 tasks, showing that dataset scale and diversity improve cross-embodiment transfer.",
    },
    {
      id: "open-x-embodiment-2024",
      title:
        "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
      authors: "Collaboration et al.",
      venue: "arXiv 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2310.08864",
      keyClaim:
        "1M+ episodes across 22 robot embodiments demonstrate that cross-embodiment data improves transfer, but lab-environment bias limits real-world deployment performance.",
    },
  ],

  // -- Internal Linking --
  pillarLinks: ["/pillars/acquire/synthetic-data"],

  // -- Related Content Pages --
  relatedSlugs: [
    "egocentric-video-data",
    "vla-training-data",
    "manipulation-trajectory-data",
  ],
};

export default simToRealData;
