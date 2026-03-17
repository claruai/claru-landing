import type { ContentPageData } from "./types";

const openDatasetsVsCustom: ContentPageData = {
  // -- Identity & SEO --
  slug: "open-datasets-vs-custom",
  title: "Open Robotics Datasets vs Custom Collection: When Open Isn't Enough",
  metaTitle: "Open Robotics Datasets vs Custom Collection | Claru",
  metaDescription:
    "Compare Open X-Embodiment, DROID, and AgiBot World against custom data collection for robotics. Scale, task coverage, and quality trade-offs explained.",
  primaryKeyword: "open robotics datasets",
  secondaryKeywords: [
    "open x-embodiment dataset",
    "DROID robotics dataset",
    "AgiBot World dataset",
    "custom robotics data collection",
    "robot learning datasets",
    "embodied AI training data",
  ],
  breadcrumbLabel: "Open vs Custom Datasets",
  ogCategory: "solution",

  // -- Hero --
  heroSubtitle:
    "Open robotics datasets like Open X-Embodiment offer million-trajectory scale at zero marginal cost, but frontier labs routinely find that scale alone does not translate to task performance. This guide compares the three largest open datasets against custom collection, using real project metrics from Claru engagements to quantify when open data reaches its ceiling and custom collection becomes the faster path to production performance.",
  videoSrc: "/videos/sol-open-vs-custom.mp4",

  // -- Problem Section --
  problem: {
    heading:
      "Why do open robotics datasets underperform on real-world manipulation tasks?",
    sections: [
      {
        heading: "Scale without task specificity produces diminishing returns",
        content:
          "Open X-Embodiment aggregates over 1 million trajectories from 22 robot embodiments across 527 skills, making it the largest open robotics dataset available [1]. Yet the AgiBot World team found that models trained on Open X-Embodiment were \"constrained within naive short-horizon tasks\" and struggled with multi-step manipulation sequences requiring tool use and bimanual coordination [3]. The problem is structural: aggregating data from 22 different robots with different action spaces, sensor configurations, and kinematic chains introduces distribution heterogeneity that a single policy must reconcile. DROID addresses embodiment diversity by standardizing on a single robot platform (Franka Emika Panda), but limits scale to 76,000 trajectories across 86 tasks in 564 scenes [2]. Neither approach solves the core tension between breadth and depth that custom collection resolves by design.",
        citationIds: ["oxe-2023", "droid-2024", "agibot-2025"],
      },
      {
        heading: "Quality variability in crowdsourced demonstrations",
        content:
          "Open X-Embodiment pools demonstrations from over 60 contributing institutions, each with different data collection protocols, operator skill levels, and quality standards [1]. This creates what robotics researchers call the \"data quality tax\": a portion of training compute is consumed learning to ignore inconsistent demonstrations rather than learning the target behavior. AgiBot World reports that its GO-1 model achieved a 30% improvement over Open X-Embodiment baselines on dexterous manipulation tasks, attributing the gap primarily to demonstration quality and consistency rather than raw scale [3]. Custom collection avoids this tax entirely by enforcing a single protocol across all operators, validated by same-day QA pipelines that flag kinematic anomalies and incomplete task sequences before they enter the training set.",
        citationIds: ["oxe-2023", "agibot-2025"],
      },
      {
        heading: "Environment coverage gaps limit generalization",
        content:
          "Lab environments dominate open datasets: DROID captured data across 564 scenes, but 78% are tabletop setups in university labs [2]. Real-world deployment requires manipulation in kitchens, warehouses, retail shelves, and outdoor construction sites, environments with variable lighting, clutter density, and surface materials. Claru's egocentric video collection project addressed this gap by deploying approximately 500 contributors with wearable cameras across geographically diverse environments, producing 386,000 clips spanning household tasks, fine-grained manipulation, walking, driving, and cooking in natural settings [4]. The resulting dataset covered 12 environment types compared to 3 in DROID's lab-centric distribution.",
        citationIds: ["droid-2024", "claru-ego-2025"],
      },
    ],
  },

  // -- Landscape / Comparison --
  landscape: {
    heading:
      "How do Open X-Embodiment, DROID, and AgiBot World compare on scale, diversity, and task coverage?",
    description:
      "The three largest open robotics datasets each optimize for different axes. Open X-Embodiment maximizes embodiment diversity, DROID maximizes scene diversity within a single platform, and AgiBot World maximizes task complexity with dual-arm manipulation. None cover all three axes simultaneously, which is why frontier labs supplement or replace them with custom collection.",
    datasets: [
      {
        name: "Open X-Embodiment",
        scale: "1M+ trajectories, 22 robots",
        tasks: "527 skills (mostly short-horizon pick-place)",
        environments: "60+ labs (heterogeneous protocols)",
        limitations:
          "Action space mismatch across embodiments; short-horizon bias; quality variability from 60+ contributing institutions",
        isClaru: false,
      },
      {
        name: "DROID",
        scale: "76K trajectories, 1 robot (Franka)",
        tasks: "86 tasks in 564 scenes",
        environments: "University labs (78% tabletop setups)",
        limitations:
          "Single embodiment limits transfer; 564 scenes concentrated in lab environments; no outdoor or industrial coverage",
        isClaru: false,
      },
      {
        name: "AgiBot World",
        scale: "1M+ trajectories, 5 embodiments",
        tasks: "217 tasks (including bimanual, tool use)",
        environments: "Controlled lab and simulated environments",
        limitations:
          "Limited to AgiBot hardware ecosystem; controlled environments only; not publicly released at time of writing",
        isClaru: false,
      },
      {
        name: "Claru Custom Collection",
        scale: "386K+ clips (single engagement), scalable",
        tasks: "Custom taxonomy per research spec",
        environments:
          "12+ environment types (kitchen, workshop, outdoor, retail)",
        limitations:
          "Requires 1-2 week calibration phase per new engagement; higher per-trajectory cost than open data",
        isClaru: true,
      },
    ],
  },

  // -- Solution Section --
  solution: {
    heading:
      "When should a robotics lab invest in custom data collection instead of open datasets?",
    sections: [
      {
        heading:
          "Custom collection closes the environment gap that open datasets cannot",
        content:
          "When a lab's target deployment environment is not represented in open datasets (industrial, outdoor, home, or retail), fine-tuning on lab-recorded demonstrations introduces a domain gap that no amount of augmentation fully resolves. Claru's approach deploys human operators in the actual target environments using standardized capture protocols. In a single engagement for egocentric video collection, Claru captured 386,000 clips across 12 environment types using three parallel pipelines: 219,000 GoPro wearable clips, 155,000 smartphone clips, and 12,000 activity-specific task clips [4]. The three-pipeline architecture enables independent tuning per capture modality, with geographic rebalancing managed through real-time dashboards.",
        citationIds: ["claru-ego-2025"],
      },
      {
        heading:
          "Consistent quality control eliminates the crowdsourced data tax",
        content:
          "Open datasets pool demonstrations from dozens of institutions with no shared quality standard. Claru enforces a single collection protocol validated by same-day QA: automated checks at upload verify resolution, duration, orientation, and file integrity before clips reach the annotation pipeline. An in-house QA team validates every submission within 24 hours. Contributor onboarding takes under 48 hours, and weekly delivery batches keep the training pipeline fed continuously [4]. This operational model eliminates the 15-30% of compute that robotics teams typically report spending on cleaning and filtering open dataset artifacts.",
        citationIds: ["claru-ego-2025"],
      },
      {
        heading: "Hybrid strategies: open data for pretraining, custom for fine-tuning",
        content:
          "The highest-performing approach for most labs combines open and custom data at different training stages. AgiBot World demonstrated this by pretraining on Open X-Embodiment before fine-tuning on their proprietary dataset, achieving the 30% performance lift over OXE-only baselines [3]. Claru supports this hybrid strategy by designing custom collection around the specific gaps identified in a lab's open-data analysis: if DROID covers tabletop manipulation but the lab needs outdoor mobile manipulation, Claru scopes collection to the missing environments and task categories. This targeted approach minimizes collection cost while maximizing the marginal value of each custom trajectory.",
        citationIds: ["agibot-2025"],
      },
    ],
  },

  // -- Case Studies --
  caseStudySlugs: ["egocentric-video-collection"],

  // -- Dataset Showcase --
  datasetIds: [],

  // -- FAQ --
  faqs: [
    {
      question:
        "How many trajectories do I need before custom collection outperforms open datasets?",
      answer:
        "There is no universal threshold; it depends on task complexity and environment similarity. AgiBot World showed meaningful gains over Open X-Embodiment with domain-specific data at similar scale (1M+ trajectories), but DROID demonstrated that 76,000 high-quality, single-embodiment trajectories can outperform heterogeneous datasets 10 times larger on Franka-specific tasks. The decision point is whether your target task and environment are well-represented in existing open data. If less than 40% of your deployment scenarios appear in the open dataset, custom collection typically yields faster performance gains than additional pretraining on mismatched data.",
    },
    {
      question:
        "Can I combine open robotics datasets with custom-collected data?",
      answer:
        "Yes, and this hybrid approach often produces the best results. Pretrain on a large open dataset like Open X-Embodiment for general motor primitives, then fine-tune on custom data collected in your specific deployment environment. AgiBot World's GO-1 model used this strategy to achieve a 30% improvement over OXE-only baselines on dexterous manipulation tasks. Claru designs custom collection around the specific gaps in your open-data coverage to maximize the marginal value of each new trajectory.",
    },
    {
      question:
        "What does custom robotics data collection cost compared to using open datasets?",
      answer:
        "Open datasets are free to download but not free to use: teams report 2-6 weeks of engineering time filtering, reformatting, and reconciling action spaces across sources. Custom collection costs vary by scale and complexity, but a typical Claru engagement delivers research-grade data within days of launch with same-day QA, weekly delivery batches, and no data cleaning overhead. The total cost of ownership comparison depends on the engineering hours your team spends making open data usable versus the per-trajectory cost of purpose-collected data.",
    },
    {
      question:
        "Which open robotics dataset is best for manipulation tasks?",
      answer:
        "DROID is the strongest open option for single-arm tabletop manipulation, with 76,000 trajectories standardized on Franka Emika Panda across 86 tasks. For bimanual and tool-use tasks, AgiBot World covers 217 tasks including dual-arm coordination. Open X-Embodiment is best as a pretraining source for general motor primitives due to its 1M+ trajectory scale, but its heterogeneous action spaces make it less effective as the sole training source for specific manipulation skills.",
    },
    {
      question:
        "How quickly can Claru launch a custom robotics data collection pipeline?",
      answer:
        "Platform launch takes days, not months. Claru's capture infrastructure, contributor onboarding, QA pipelines, and delivery formatting are reusable across engagement types. The primary variable is task-specific calibration: translating your research specifications into contributor instructions and QA criteria, which typically requires a 1-2 week calibration phase. Once calibrated, the egocentric video collection pipeline produced 386,000 clips across approximately 500 global contributors with weekly delivery batches.",
    },
  ],

  // -- Research Citations --
  citations: [
    {
      id: "oxe-2023",
      title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
      authors: "Padalkar et al.",
      venue: "arXiv",
      year: 2023,
      url: "https://arxiv.org/abs/2310.08864",
      keyClaim:
        "Aggregated 1M+ trajectories from 22 robot embodiments across 527 skills from 60+ institutions, enabling cross-embodiment transfer learning.",
    },
    {
      id: "droid-2024",
      title:
        "DROID: A Large-Scale In-The-Wild Robot Manipulation Dataset",
      authors: "Khazatsky et al.",
      venue: "arXiv",
      year: 2024,
      url: "https://arxiv.org/abs/2403.12945",
      keyClaim:
        "76,000 trajectories on Franka Emika Panda across 86 tasks and 564 scenes, demonstrating that single-embodiment consistency can outperform larger heterogeneous datasets.",
    },
    {
      id: "agibot-2025",
      title:
        "AgiBot World: A New Benchmark and Dataset for Robot Learning",
      authors: "Bu et al.",
      venue: "arXiv",
      year: 2025,
      url: "https://arxiv.org/abs/2503.06669",
      keyClaim:
        "1M+ trajectories across 217 tasks with 5 embodiments; GO-1 model achieved 30% improvement over Open X-Embodiment baselines on dexterous manipulation.",
    },
    {
      id: "claru-ego-2025",
      title:
        "Egocentric Video Data Collection for Robotics and World Modeling",
      authors: "Claru",
      venue: "Case Study",
      year: 2025,
      url: "/case-studies/egocentric-video-collection",
      keyClaim:
        "386,000+ first-person video clips captured across 3 parallel pipelines (GoPro, smartphone, activity-specific) with approximately 500 global contributors and same-day QA.",
    },
    {
      id: "rt2-2023",
      title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
      authors: "Brohan et al.",
      venue: "arXiv",
      year: 2023,
      url: "https://arxiv.org/abs/2307.15818",
      keyClaim:
        "Demonstrated that large vision-language models can transfer web-scale knowledge to robot control, but performance degrades on tasks not represented in the robot training data.",
    },
  ],

  // -- Internal Linking --
  pillarLinks: ["/pillars/acquire"],

  // -- Related Content Pages --
  relatedSlugs: [
    "egocentric-video-data",
    "vla-training-data",
    "manipulation-trajectory-data",
  ],
};

export default openDatasetsVsCustom;
