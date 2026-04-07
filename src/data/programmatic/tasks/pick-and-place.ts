import type { TaskPageData } from "../types";

const data: TaskPageData = {
  slug: "pick-and-place",
  metaTitle: "Pick-and-Place Training Data for Robotics | Claru",
  metaDescription:
    "Training data for robotic pick-and-place: object grasping, transport, and precise placement. Full manipulation trajectories with grasp and placement annotations for policy learning.",
  primaryKeyword: "pick-and-place training data",
  secondaryKeywords: [
    "pick-and-place dataset",
    "robot pick-place demonstrations",
    "manipulation trajectory data",
    "grasp-transport-place training data",
    "object rearrangement dataset",
    "pick-and-place automation data",
  ],
  canonicalPath: "/training-data/pick-and-place",
  h1: "Pick-and-Place Training Data",
  heroSubtitle:
    "Pick-and-place datasets for robotic manipulation — complete grasp-transport-place trajectories with 6-DoF grasp annotations, placement precision labels, and multi-object sequencing for training end-to-end manipulation policies.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Training Data", href: "/training-data" },
    { label: "Pick-and-Place", href: "/training-data/pick-and-place" },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Is Pick-and-Place and Why Does Data Matter?",
      paragraphs: [
        "Pick-and-place is the most fundamental robotic manipulation primitive — grasping an object from one location and placing it at another. Despite its conceptual simplicity, production-grade pick-and-place must handle enormous object diversity (10,000+ SKUs in a warehouse), varying grasp strategies (top grasp, side grasp, pinch grasp), precision placement requirements (0.5-5 mm depending on the target receptacle), and dynamic environments where objects move or other agents operate in the workspace. The global pick-and-place robot market exceeded $12 billion in 2024, driven by e-commerce fulfillment, electronics assembly, and food packaging — yet most deployments are limited to structured environments with known object geometries.",
        "The data bottleneck in pick-and-place is not the grasp itself but the full cycle: approach planning that avoids collisions with neighboring objects, grasp execution that maintains grip through the lift phase, transport trajectories that prevent dropping, and placement that achieves the target pose within tolerance. The Google Robotics team demonstrated this with their RT-1 model (Brohan et al., 2022): training on 130,000 pick-and-place demonstrations across 700+ objects, RT-1 achieved 97% pick success but only 76% full pick-and-place success, meaning nearly one-quarter of failures occurred during transport or placement — phases that pure grasp datasets miss entirely.",
        "Foundation models have dramatically changed the data requirements for pick-and-place. RT-2 (Brohan et al., 2023) showed that a VLM fine-tuned on 130K robot demonstrations could generalize to novel objects with 62% zero-shot success on never-before-seen items, compared to 32% for RT-1. OpenVLA (Kim et al., 2024) achieved 73% success on unseen pick-and-place tasks using 970K demonstrations from the Open X-Embodiment dataset. These results demonstrate that scale and diversity of pick-and-place demonstrations — more objects, more environments, more grasp strategies — directly translates to generalization capability.",
        "The economic case for pick-and-place automation is compelling. Amazon's Sparrow system handles millions of picks per day across its fulfillment network, and each 1% improvement in pick-and-place success rate at their scale saves an estimated $50-100 million annually in reduced re-picks, damaged inventory, and throughput gains. For smaller operations, the break-even point for a pick-and-place robot system is typically 18-24 months at current labor costs. The primary technical barrier to wider adoption is training data: building the diverse demonstration datasets needed to handle the long tail of object shapes, materials, and placement configurations that appear in real operations.",
      ],
    },
    {
      type: "stats",
      heading: "Pick-and-Place Data by the Numbers",
      stats: [
        { value: "$12B+", label: "Global pick-and-place robot market (2024)" },
        { value: "130K", label: "Demonstrations used to train Google RT-1" },
        { value: "97%", label: "RT-1 pick success rate (grasp only)" },
        { value: "76%", label: "RT-1 full pick-and-place success rate" },
        { value: "970K", label: "Demonstrations in Open X-Embodiment dataset" },
        { value: "700+", label: "Object categories in RT-1 training data" },
      ],
    },
    {
      type: "comparison-table",
      heading: "Data Requirements by Policy Architecture",
      description:
        "Modern pick-and-place architectures range from modular pipelines to end-to-end visuomotor policies. Each has distinct data needs.",
      columns: [
        "Approach",
        "Data Volume",
        "Key Modalities",
        "Generalization",
        "Strengths",
      ],
      rows: [
        {
          Approach: "Modular (detect + grasp + place)",
          "Data Volume": "10K grasps + 5K placements per domain",
          "Key Modalities": "RGB-D + 6-DoF grasp + placement pose",
          Generalization: "Good within trained categories",
          Strengths: "Debuggable; each module is independently testable",
        },
        {
          Approach: "End-to-end BC (RT-1 style)",
          "Data Volume": "50K-200K full trajectories",
          "Key Modalities": "RGB + language + proprioception",
          Generalization: "Strong with sufficient data diversity",
          Strengths: "No hand-designed modules; captures entire behavior",
        },
        {
          Approach: "Diffusion Policy",
          "Data Volume": "1K-10K demos per task family",
          "Key Modalities": "Multi-view RGB + proprioception",
          Generalization: "Good for multimodal action distributions",
          Strengths: "Handles ambiguity; smooth trajectories",
        },
        {
          Approach: "VLA fine-tuning (RT-2, OpenVLA)",
          "Data Volume": "5K-50K demos + pretrained foundation",
          "Key Modalities": "RGB + language instructions",
          Generalization: "Best zero-shot to novel objects",
          Strengths: "Leverages web-scale pretraining; language-conditioned",
        },
        {
          Approach: "Sim-to-Real (IsaacGym + real fine-tune)",
          "Data Volume": "1M+ sim + 1K-10K real demos",
          "Key Modalities": "Sim RGB-D + real RGB-D for domain transfer",
          Generalization: "Depends on sim diversity",
          Strengths: "Scalable; low real-data requirement",
        },
      ],
    },
    {
      type: "prose",
      heading: "State of the Art in Learned Pick-and-Place",
      paragraphs: [
        "RT-1 (Brohan et al., 2022) established the scale frontier for pick-and-place learning. Trained on 130,000 demonstrations collected over 17 months by a fleet of 13 robots in a real office kitchen environment, RT-1 uses a Transformer architecture that maps sequences of RGB images and language instructions to discretized actions. On the full pick-and-place benchmark (pick object, transport, place in target location), RT-1 achieves 76% success across 700+ everyday objects, with performance scaling log-linearly with the number of training demonstrations — suggesting that 500K-1M demonstrations could push success rates above 90%.",
        "Diffusion Policy (Chi et al., 2023) demonstrated that action diffusion models outperform both behavioral cloning and implicit policy baselines on pick-and-place tasks. On the PushT and ToolHang benchmarks, Diffusion Policy achieves 88% and 80% success respectively, compared to 72% and 51% for BC-RNN. The key advantage for pick-and-place is handling multimodal placement strategies — when multiple valid placement positions exist, Diffusion Policy generates diverse, high-quality placement actions while BC collapses to the mean and misses all targets.",
        "The Open X-Embodiment (OXE) dataset (Padalkar et al., 2023) aggregated 970K robot episodes from 60+ datasets across 22 robot embodiments, with pick-and-place comprising the majority of tasks. Models trained on this combined dataset (RT-2-X, Octo) show 50-100% improvement in success rate on target robots compared to models trained on each dataset in isolation. This cross-embodiment transfer result demonstrates that pick-and-place skills learned on one robot (e.g., a Franka Panda) partially transfer to another (e.g., a UR5), provided the demonstrations capture similar manipulation strategies.",
        "GR-2 (Cheang et al., 2024) pushed the frontier of video-conditioned pick-and-place by training on 38 billion tokens of internet video data plus 10,000 robot demonstrations. The model achieves 85% success on 100 diverse pick-and-place tasks, including novel objects and configurations not seen during robot training. The key insight is that internet videos of humans performing pick-and-place (moving dishes, organizing shelves, sorting items) provide transferable spatial reasoning that reduces the amount of robot-specific data needed. This suggests that the optimal data strategy for pick-and-place combines large-scale human activity video with focused robot demonstration collection.",
      ],
    },
    {
      type: "prose",
      heading: "Collection Methodology for Pick-and-Place Data",
      paragraphs: [
        "Pick-and-place data collection requires capturing the complete manipulation cycle from object detection through final placement verification. The standard sensor setup includes 2-3 fixed RGB-D cameras covering the workspace from different viewpoints (overhead, left-angled, right-angled), a wrist-mounted RGB camera for close-range grasp guidance, and proprioceptive data from the robot joints (position, velocity, torque) at 50-100 Hz. Camera placement should ensure that the object is visible from at least two viewpoints throughout the entire pick-transport-place trajectory, including during the grasp phase when the robot hand may occlude overhead views.",
        "Teleoperation is the primary collection method for high-quality pick-and-place demonstrations. Bilateral teleoperation systems (leader-follower arms like ALOHA, or VR controller interfaces) enable operators to perform natural grasping and placement motions at speeds representative of real-world execution. Collection throughput varies by task complexity: simple single-object pick-and-place yields 100-200 demonstrations per hour, while multi-object sequencing with precise placement drops to 30-60 per hour. Operators should be trained to vary their grasp strategy (top, side, pinch) across demonstrations to ensure the policy learns multiple approaches per object.",
        "Annotation requirements for pick-and-place data depend on the target policy architecture. End-to-end policies (RT-1, Diffusion Policy) need only the raw sensor streams with success/failure labels. Modular approaches additionally require: 6-DoF grasp pose at contact, grasp type classification (parallel-jaw, suction, pinch), object identity and category, placement target pose and achieved pose, placement error (distance and angular deviation from target), and phase segmentation (approach, grasp, lift, transport, approach-placement, place, release, retract). Language-conditioned policies need natural language instructions describing each pick-and-place task in 1-3 sentences.",
        "Data diversity is the single largest predictor of pick-and-place policy generalization. The RT-1 team found that increasing object diversity from 100 to 700 categories improved novel-object success by 35%, while increasing demonstration count with fixed objects improved by only 10%. For maximum generalization, prioritize: object shape diversity (cuboids, cylinders, irregular shapes, deformable items), material diversity (rigid plastic, glass, metal, fabric, paper), size range (2 cm small objects to 30 cm large items), workspace variation (table height, lighting conditions, background clutter), and grasp strategy diversity (ensure each object is grasped from multiple angles and with different grip types).",
      ],
    },
    {
      type: "comparison-table",
      heading: "Key Datasets for Pick-and-Place",
      description:
        "The pick-and-place dataset landscape ranges from small research benchmarks to massive fleet-collected corpora. Scale and diversity are the strongest predictors of downstream policy performance.",
      columns: [
        "Dataset",
        "Year",
        "Scale",
        "Objects",
        "Key Features",
        "Limitations",
      ],
      rows: [
        {
          Dataset: "RT-1 (Google Robotics)",
          Year: "2022",
          Scale: "130K episodes, 700+ objects",
          Objects: "Kitchen/office everyday items",
          "Key Features": "Language-conditioned; real-world fleet data",
          Limitations: "Single environment; not publicly released",
        },
        {
          Dataset: "Open X-Embodiment",
          Year: "2023",
          Scale: "970K episodes, 22 embodiments",
          Objects: "Diverse household + lab objects",
          "Key Features": "Cross-embodiment; largest public robot dataset",
          Limitations: "Heterogeneous quality; inconsistent annotations",
        },
        {
          Dataset: "RoboSet (Bharadhwaj et al.)",
          Year: "2023",
          Scale: "100K+ demonstrations",
          Objects: "Kitchen objects across multiple scenes",
          "Key Features": "Multi-view; multi-task; high quality",
          Limitations: "Single robot type (Franka)",
        },
        {
          Dataset: "DROID (Khazatsky et al.)",
          Year: "2024",
          Scale: "76K episodes across 564 scenes",
          Objects: "Everyday objects in diverse environments",
          "Key Features": "Multi-site; diverse scenes; language labels",
          Limitations: "Moderate scale per scene",
        },
        {
          Dataset: "BridgeData V2",
          Year: "2023",
          Scale: "60K+ trajectories",
          Objects: "Toy/kitchen objects on tabletop",
          "Key Features": "Multi-task; WidowX robot; widely used",
          Limitations: "Low-cost robot; limited precision",
        },
      ],
    },
    {
      type: "prose",
      heading: "How Claru Supports Pick-and-Place Data Needs",
      paragraphs: [
        "Claru provides pick-and-place data collection at the scale and diversity needed for production manipulation policies. Our collection stations feature calibrated multi-view camera arrays (2 fixed RGB-D + 1 wrist-mounted RGB, synchronized at 30 Hz), proprioceptive recording at 50 Hz, and standardized workspace configurations that can be rapidly reconfigured for different object sets and placement targets. We support bilateral teleoperation for high-fidelity demonstrations and automated collection protocols for high-throughput data generation.",
        "We collect on real objects supplied by clients, covering the full diversity of their operational environment. Each demonstration captures the complete pick-transport-place cycle with automatic phase segmentation, 6-DoF grasp and placement pose annotations, success labels with failure mode classification (missed grasp, dropped object, placement miss), and natural language task descriptions. Our operators vary grasp strategies across demonstrations to ensure multi-approach coverage per object, and we systematically randomize object positions, orientations, and workspace clutter levels between trials.",
        "Claru delivers pick-and-place datasets formatted for direct ingestion by RT-1, RT-2, Diffusion Policy, ACT/ALOHA, OpenVLA, Octo, or custom architectures. Standard deliverables include synchronized multi-view video, proprioceptive streams, per-episode task annotations, and train/validation/test splits with held-out objects for generalization evaluation. Our daily throughput of 500-2,000 complete pick-and-place demonstrations per station enables the 10K-100K scale datasets that modern foundation models require, with object diversity matching real deployment conditions.",
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        {
          id: "brohan-rt1-2022",
          title: "RT-1: Robotics Transformer for Real-World Control at Scale",
          authors: "Brohan et al.",
          venue: "RSS 2023",
          year: 2022,
          url: "https://arxiv.org/abs/2212.06817",
        },
        {
          id: "brohan-rt2-2023",
          title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
          authors: "Brohan et al.",
          venue: "CoRL 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2307.15818",
        },
        {
          id: "chi-diffusion-2023",
          title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
          authors: "Chi et al.",
          venue: "RSS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2303.04137",
        },
        {
          id: "padalkar-oxe-2023",
          title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
          authors: "Padalkar et al.",
          venue: "ICRA 2024",
          year: 2023,
          url: "https://arxiv.org/abs/2310.08864",
        },
        {
          id: "kim-openvla-2024",
          title: "OpenVLA: An Open-Source Vision-Language-Action Model",
          authors: "Kim et al.",
          venue: "CoRL 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2406.09246",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "How many demonstrations do I need for pick-and-place?",
      answer:
        "It depends on the policy architecture and target generalization. For a single-task Diffusion Policy (pick specific object, place at specific location), 50-200 demonstrations suffice. For a multi-object behavioral cloning policy, 500-5,000 demonstrations across 50-100 objects are needed. For foundation model fine-tuning (RT-2, OpenVLA), 5,000-50,000 demonstrations provide meaningful generalization to novel objects. The RT-1 team found that object diversity matters more than demonstration count — 100 demonstrations each across 100 objects outperforms 1,000 demonstrations of 10 objects.",
    },
    {
      question: "Should I collect separate grasp and placement data?",
      answer:
        "Always collect full pick-and-place cycles rather than isolated grasps or isolated placements. Google's RT-1 data showed that 21% of failures occurred during transport or placement — phases invisible in grasp-only datasets. Full-cycle data captures critical behaviors like re-grasping after slippage, trajectory adjustment during transport to avoid obstacles, and approach angle selection for precise placement. If your architecture is modular, you can extract grasp and placement annotations from full-cycle data during post-processing.",
    },
    {
      question: "How important is language annotation for pick-and-place data?",
      answer:
        "Language annotations are essential for foundation model training and increasingly important for all architectures. RT-2 and OpenVLA require language instructions to condition their policies. Even for non-language-conditioned models, language annotations serve as structured metadata for filtering, curriculum design, and evaluation (e.g., 'pick the red cup and place it on the blue plate'). Each demonstration should have 1-3 sentence descriptions of the task. These can be generated post-hoc using VLMs if not collected during demonstrations, but human-written annotations are more accurate.",
    },
    {
      question: "What is the minimum object diversity for generalization?",
      answer:
        "The RT-1 team found that generalization to novel objects improves log-linearly with training object diversity. Below 50 object categories, policies overfit to specific shapes. At 100-200 categories, novel-object success reaches 40-50%. At 500+ categories with diverse shapes, materials, and sizes, novel-object success exceeds 60%. For production deployments, collect data on your actual product inventory plus 20-30% additional objects representing anticipated future products or edge cases.",
    },
    {
      question: "Can simulation replace real pick-and-place demonstrations?",
      answer:
        "Simulation is excellent for pretraining perception and generating diverse grasp attempts, but the sim-to-real gap for full pick-and-place remains 15-25 percentage points. Transport trajectories transfer reasonably (5-10% gap) because they are largely kinematic, but grasping and placement involve contact physics that simulation approximates poorly for deformable and irregularly shaped objects. The optimal approach is sim pretraining on 100K+ episodes followed by real-world fine-tuning on 5K-20K demonstrations, which outperforms either modality alone.",
    },
  ],
  ctaHeading: "Get a Custom Quote for Pick-and-Place Data",
  ctaDescription:
    "Share your object categories, placement requirements, and target policy architecture, and we will design a data collection plan that matches your specific deployment needs.",
  relatedGlossaryTerms: [
    "manipulation-trajectory",
    "grasping-dataset",
    "behavioral-cloning",
    "6-dof-grasp-planning",
    "sim-to-real-gap",
  ],
  relatedGuidePages: [
    "how-to-build-a-manipulation-dataset",
    "how-to-label-robot-demonstrations",
  ],
  relatedSolutionSlugs: [],
  dataRequirements: {
    modality: "Multi-view RGB-D + wrist RGB + proprioception + language instructions",
    volumeRange: "5K-200K full pick-transport-place trajectories",
    temporalResolution: "30 Hz video, 50 Hz proprioception, per-episode annotations",
    keyAnnotations: [
      "6-DoF grasp pose and grasp type classification",
      "6-DoF placement target and achieved pose with error metrics",
      "Phase segmentation (approach, grasp, lift, transport, place, release)",
      "Object identity, category, and physical properties",
      "Success/failure with failure mode classification",
      "Natural language task description (1-3 sentences)",
    ],
  },
  relevantModels: [
    "RT-1 / RT-2",
    "OpenVLA",
    "Diffusion Policy",
    "ACT / ALOHA",
    "Octo",
    "GR-2",
  ],
  environmentTypes: [
    "E-commerce fulfillment station",
    "Kitchen countertop",
    "Office desk organization",
    "Electronics assembly line",
    "Food packaging line",
    "Research tabletop workspace",
  ],
  keyPapers: [
    {
      id: "brohan-rt1-2022",
      title: "RT-1: Robotics Transformer for Real-World Control at Scale",
      authors: "Brohan et al.",
      venue: "RSS 2023",
      year: 2022,
      url: "https://arxiv.org/abs/2212.06817",
    },
    {
      id: "brohan-rt2-2023",
      title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
      authors: "Brohan et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2307.15818",
    },
    {
      id: "chi-diffusion-2023",
      title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
      authors: "Chi et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2303.04137",
    },
    {
      id: "padalkar-oxe-2023",
      title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
      authors: "Padalkar et al.",
      venue: "ICRA 2024",
      year: 2023,
      url: "https://arxiv.org/abs/2310.08864",
    },
  ],
  claruRelevance:
    "Claru provides pick-and-place data collection at the scale and diversity that modern foundation models demand. Our stations feature calibrated multi-view RGB-D arrays (2 fixed + 1 wrist-mounted, synchronized at 30 Hz) with proprioceptive recording at 50 Hz, supporting bilateral teleoperation for high-fidelity demonstrations. We collect on real client objects covering their operational diversity — shape, material, size, and weight ranges. Each demonstration captures the complete pick-transport-place cycle with automatic phase segmentation, 6-DoF grasp and placement annotations, success labels with failure mode taxonomy, and natural language task descriptions. Operators systematically vary grasp strategies and randomize workspace configurations to maximize data diversity. Deliverables are formatted for direct ingestion by RT-1, RT-2, Diffusion Policy, ACT/ALOHA, OpenVLA, Octo, or custom architectures. Daily throughput of 500-2,000 demonstrations per station enables the 10K-100K scale datasets that production pick-and-place systems require.",
};

export default data;
