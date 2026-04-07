import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "zero-shot-manipulation",
  termSlug: "zero-shot-manipulation",
  category: "robotics-fundamentals",
  metaTitle: "Zero-Shot Manipulation — Definition & Training Data | Claru",
  metaDescription: "Zero-shot manipulation enables robots to handle novel objects without task-specific training. Learn the data and model strategies that make it work.",
  primaryKeyword: "zero-shot manipulation",
  secondaryKeywords: ["zero-shot robotic grasping", "novel object manipulation", "open-world manipulation", "generalist robot manipulation"],
  canonicalPath: "/glossary/zero-shot-manipulation",
  h1: "Zero-Shot Manipulation: Handling Novel Objects Without Task-Specific Training",
  heroSubtitle: "Zero-shot manipulation is a robot's ability to grasp, move, or interact with objects it has never seen during training. This capability distinguishes generalist robot policies from narrow, object-specific controllers and is a prerequisite for deploying robots in unstructured real-world environments.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Zero-Shot Manipulation", href: "/glossary/zero-shot-manipulation" },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Is Zero-Shot Manipulation?",
      paragraphs: [
        "Zero-shot manipulation refers to a robot policy's ability to perform manipulation tasks on objects, configurations, or environments not present in the training data. In machine learning terminology, 'zero-shot' means the policy receives zero examples of the specific test scenario during training. A robot trained to pick up mugs, bowls, and bottles that can also pick up a stapler it has never encountered is demonstrating zero-shot manipulation.",
        "The challenge is fundamentally about generalization. Traditional robot manipulation systems are engineered for specific objects with known geometry — an automotive assembly line robot is programmed with the exact CAD model of every part it handles. Zero-shot manipulation requires the robot to perceive novel geometry, infer graspable surfaces, predict physical properties like weight and friction, and plan motions that avoid collisions — all without prior experience with the target object.",
        "Two distinct approaches enable zero-shot manipulation. The first is large-scale data diversity: by training on demonstrations spanning thousands of different objects, the policy learns general manipulation primitives that transfer to novel objects. RT-2 (Google DeepMind, 2023) demonstrated this approach, using a VLA model trained on thousands of objects to manipulate novel items specified by natural language instructions. The second is explicit geometric reasoning: systems like AnyGrasp compute grasps directly from point clouds using learned geometric features, without requiring any task demonstrations.",
      ],
    },
    {
      type: "stats",
      heading: "Zero-Shot Manipulation at a Glance",
      stats: [
        { value: "RT-2", label: "VLA with zero-shot transfer" },
        { value: "1000+", label: "Object categories in training" },
        { value: "70-85%", label: "Zero-shot grasp success" },
        { value: "SigLIP", label: "Vision encoder for generalization" },
        { value: "Language", label: "Common conditioning modality" },
        { value: "2023", label: "Breakout year for zero-shot" },
      ],
    },
    {
      type: "prose",
      heading: "Data Strategies for Zero-Shot Generalization",
      paragraphs: [
        "The most reliable path to zero-shot manipulation is training data diversity. A policy trained on 100 demonstrations of picking up one specific mug will fail on novel objects. A policy trained on 10,000 demonstrations across 500 different objects — varying in shape, size, material, color, and weight — learns general features that transfer. The critical insight is that diversity in training objects matters more than volume per object. Ten demonstrations each across 1,000 objects outperforms 10,000 demonstrations of a single object for zero-shot tasks.",
        "Language conditioning dramatically improves zero-shot manipulation by providing a compositional interface for specifying novel tasks. Instead of training a separate policy for 'pick up the red ball' and 'pick up the blue cube', a language-conditioned policy learns to compose color, shape, and action concepts. At test time, it can handle 'pick up the green cylinder' — a combination never seen in training — because it has learned the individual concepts. This requires training data with diverse language instructions paired with diverse objects and actions.",
        "Synthetic data augmentation extends zero-shot capabilities by exposing the policy to procedurally generated object variations. Tools like Blender and Isaac Sim can create thousands of object meshes with varied geometry, texture, and physical properties. Policies trained on a mixture of real demonstrations and synthetic renderings achieve better zero-shot performance than either alone. The key is careful domain randomization: varying textures, lighting, camera positions, and background clutter so the policy cannot overfit to any single visual distribution.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Approaches to Zero-Shot Manipulation",
      description: "Different strategies for achieving manipulation of novel objects, each with distinct data requirements.",
      columns: ["Approach", "Mechanism", "Data Needed", "Strength", "Limitation"],
      rows: [
        { Approach: "Large-scale imitation", Mechanism: "Diverse demonstrations + VLA", "Data Needed": "10K-100K demos", Strength: "General-purpose", Limitation: "Data collection cost" },
        { Approach: "Language conditioning", Mechanism: "Compositional task specification", "Data Needed": "5K+ annotated demos", Strength: "Novel task composition", Limitation: "Language ambiguity" },
        { Approach: "Geometric grasping", Mechanism: "Point cloud grasp detection", "Data Needed": "Sim-generated grasps", Strength: "Any rigid object", Limitation: "Grasp-only, no tasks" },
        { Approach: "Foundation model transfer", Mechanism: "Web-pretrained vision features", "Data Needed": "100-1K demos + pretrained", Strength: "Strong visual features", Limitation: "Action gap from web data" },
      ],
    },
    {
      type: "prose",
      heading: "Evaluation and Benchmarks",
      paragraphs: [
        "Evaluating zero-shot manipulation requires careful protocol design. The standard approach is a held-out object test: train on a set of objects, test on a disjoint set the policy never saw. Success rate on held-out objects is the primary metric. More rigorous evaluations also measure category-level generalization (training on mugs, testing on mugs with very different shapes) versus cross-category generalization (training on kitchenware, testing on tools).",
        "SIMPLER (Li et al., 2024) and RLBench (James et al., 2020) provide standardized benchmarks for zero-shot manipulation evaluation. SIMPLER includes Google Robot and WidowX environments with curated held-out object sets. RLBench defines 100 manipulation tasks with procedurally varied initial configurations. For real-world evaluation, teams typically define a set of 20-50 novel household objects spanning diverse categories and report grasp and task success rates across 10+ trials per object.",
        "Common failure modes in zero-shot manipulation include transparent objects (depth sensors and vision models struggle with glass), deformable objects (bags, cloth), very small objects (below the gripper's minimum aperture), and extremely heavy objects (exceeding the robot's payload). Understanding these failure modes is essential for scoping the practical deployment envelope of a zero-shot manipulation system and for targeting data collection efforts at the boundary cases.",
      ],
    },
    {
      type: "citation-list",
      heading: "Key References",
      citations: [
        {
          id: "rt2-2023",
          title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
          authors: "Brohan et al.",
          venue: "arXiv 2307.15818",
          year: 2023,
          url: "https://arxiv.org/abs/2307.15818",
        },
        {
          id: "fang-anygrasp-2023",
          title: "AnyGrasp: Robust and Efficient Grasp Perception in Spatial and Temporal Domains",
          authors: "Fang et al.",
          venue: "IEEE T-RO 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2212.08390",
        },
        {
          id: "simpler-2024",
          title: "Evaluating Real-World Robot Manipulation Policies in Simulation",
          authors: "Li et al.",
          venue: "arXiv 2405.05941",
          year: 2024,
          url: "https://arxiv.org/abs/2405.05941",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "How many different objects should training data include for zero-shot manipulation?",
      answer: "Empirically, 200-500 distinct object instances provide a reasonable foundation for zero-shot generalization to novel objects within similar categories. For cross-category zero-shot (generalizing to entirely new object types), 1,000+ training objects spanning diverse categories shows significantly better results. The Open X-Embodiment dataset covers thousands of distinct objects across 22 robot embodiments.",
    },
    {
      question: "Can zero-shot manipulation work with deformable objects like cloth or rope?",
      answer: "Deformable objects remain one of the hardest cases for zero-shot manipulation. Current methods achieve reasonable zero-shot performance on rigid and semi-rigid objects but struggle with deformable items because their infinite-dimensional configuration space makes generalization much harder. Specialized deformable manipulation research exists but has not yet achieved robust zero-shot transfer.",
    },
    {
      question: "Does zero-shot manipulation require language instructions?",
      answer: "No. Language conditioning is one path to zero-shot manipulation but not the only one. Geometric grasping systems like AnyGrasp achieve zero-shot grasping purely from point cloud geometry. However, language conditioning adds compositional generalization — the ability to combine concepts seen separately in training — which is particularly valuable for task-level zero-shot transfer beyond just grasping.",
    },
    {
      question: "What vision encoders work best for zero-shot manipulation?",
      answer: "Pretrained vision foundation models — SigLIP, DINOv2, and CLIP — provide the strongest visual features for zero-shot manipulation because they were trained on internet-scale image datasets covering millions of object categories. Fine-tuning these encoders on robot data preserves their broad visual knowledge while adapting features to the manipulation domain. Training a vision encoder from scratch on robot data alone produces inferior zero-shot generalization.",
    },
  ],
  ctaHeading: "Building Datasets for Zero-Shot Manipulation?",
  ctaDescription: "Claru provides diverse object manipulation datasets spanning hundreds of object categories, enabling robust zero-shot generalization for your robot policies.",
  relatedGlossaryTerms: ["zero-shot-generalization", "foundation-model-robotics", "grasping-dataset", "language-conditioned-policy", "vla"],
  relatedGuidePages: ["how-to-collect-teleoperation-data"],
  relatedSolutionSlugs: ["manipulation-trajectory-data", "grasping-dataset"],
  longDefinition: "Zero-shot manipulation is a robot's ability to perform manipulation tasks involving objects, configurations, or environments that were not present in its training data. The term 'zero-shot' indicates that the policy receives zero training examples of the specific test scenario — it must generalize entirely from experience with other objects and tasks.\n\nThis capability is critical for real-world deployment because no training dataset can cover every object a robot will encounter. A warehouse robot will face novel product packaging, a kitchen robot will encounter unfamiliar utensils, and a home assistant robot will need to handle personal items unique to each household. Zero-shot manipulation is the bridge between laboratory demonstrations and practical utility.\n\nThe technical foundation rests on learning representations that capture general manipulation-relevant features rather than object-specific memorization. Shape, surface normals, material properties, affordances (where to grasp, where to push), and physical dynamics must be inferred from visual and tactile observation without prior knowledge of the specific object. Modern approaches achieve this through massive training data diversity, pretrained vision encoders, and language-conditioned policies that enable compositional generalization.",
  historicalContext: "Early robot manipulation systems were entirely object-specific. Industrial robots in the 1970s-1990s operated with precise CAD models and fixture-based localization — zero generalization was assumed and accepted. The first steps toward zero-shot manipulation came from the grasp planning community. Miller et al. (2003) introduced shape primitives for grasp transfer, showing that grasps computed for a cylinder could transfer to novel cylindrical objects.\n\nThe deep learning era brought data-driven approaches to zero-shot manipulation. Levine et al. (2018) trained a large-scale grasping system on 800,000 grasp attempts across diverse objects, achieving zero-shot grasping on novel items. Kalashnikov et al. (2018) with QT-Opt pushed this further with 580,000 real-world grasps, demonstrating 96% grasp success on novel objects.\n\nThe emergence of Vision-Language-Action models in 2022-2023 represented a paradigm shift. RT-1 (Brohan et al., 2022) and RT-2 (Brohan et al., 2023) showed that training on diverse manipulation data with language conditioning enabled zero-shot transfer to novel objects and novel task descriptions. The key insight was that web-pretrained language and vision models already encode extensive knowledge about objects and their affordances.",
  practicalImplications: "For teams building zero-shot manipulation systems, the primary practical lever is training data diversity. The marginal value of an additional demonstration of an existing object diminishes rapidly, while demonstrations of novel objects have high marginal value. Data collection protocols should prioritize breadth: many objects, many environments, many initial configurations. Claru's data collection operations target exactly this diversity, providing demonstrations across hundreds of object categories with controlled variation in pose, lighting, and background.\n\nEvaluation protocol design is crucial. The held-out test set must be genuinely novel — objects that differ meaningfully from training objects, not just new instances of the same category. Best practice is to define three evaluation tiers: in-distribution (same objects as training), category-level zero-shot (new instances of training categories), and cross-category zero-shot (entirely new categories). Reporting success rates at each tier gives a realistic picture of generalization capability.\n\nFor production deployment, zero-shot manipulation systems should be paired with failure detection and recovery mechanisms. Even the best zero-shot systems fail on some objects, and the failure rate increases for objects further from the training distribution. Real-time grasp confidence estimation, force-based failure detection, and retry strategies with varied grasp poses make zero-shot systems practical for deployment rather than purely academic evaluation.",
  commonMisconceptions: [
    {
      misconception: "Zero-shot manipulation means the robot needs no training data at all.",
      correction: "Zero-shot refers to the test condition, not the training requirement. The robot is trained on large, diverse datasets of manipulation demonstrations — it simply is not trained on the specific objects it encounters at test time. More training data diversity generally leads to better zero-shot performance.",
    },
    {
      misconception: "Zero-shot manipulation works equally well on all object types.",
      correction: "Zero-shot performance varies dramatically by object category. Rigid objects with clear graspable surfaces achieve 80-90% success rates. Transparent objects, deformable objects, very small objects, and articulated objects remain significantly harder. Understanding the generalization boundary is essential for practical deployment.",
    },
    {
      misconception: "Language-conditioned policies automatically achieve zero-shot manipulation.",
      correction: "Language conditioning enables compositional generalization — combining concepts seen separately — but it does not eliminate the need for visual and motor generalization. A language-conditioned policy still needs to have seen enough visual and manipulation diversity in training to handle novel objects physically, not just linguistically.",
    },
  ],
  keyPapers: [
    {
      id: "rt2-2023",
      title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
      authors: "Brohan et al.",
      venue: "arXiv 2307.15818",
      year: 2023,
      url: "https://arxiv.org/abs/2307.15818",
    },
    {
      id: "fang-anygrasp-2023",
      title: "AnyGrasp: Robust and Efficient Grasp Perception in Spatial and Temporal Domains",
      authors: "Fang et al.",
      venue: "IEEE T-RO 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2212.08390",
    },
    {
      id: "kalashnikov-qtopt-2018",
      title: "Scalable Deep Reinforcement Learning for Vision-Based Robotic Manipulation",
      authors: "Kalashnikov et al.",
      venue: "CoRL 2018",
      year: 2018,
      url: "https://arxiv.org/abs/1806.10293",
    },
  ],
  claruRelevance: "Claru's data collection operations prioritize object diversity — the single most important factor for zero-shot manipulation performance. Our datasets cover hundreds of object categories across household, industrial, and commercial domains, with controlled variation in pose, lighting, and scene configuration. This diversity is what enables policies trained on Claru data to generalize to objects they have never seen.",
};

export default data;
