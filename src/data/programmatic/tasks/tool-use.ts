import type { TaskPageData } from "../types";

const data: TaskPageData = {
  slug: "tool-use",
  metaTitle: "Tool Use Training Data for Robotics | Claru",
  metaDescription:
    "Training data for robotic tool use: hammering, screwdriving, scooping, cutting. Demonstrations capturing tool-object interaction dynamics and affordance reasoning.",
  primaryKeyword: "robot tool use training data",
  secondaryKeywords: [
    "tool manipulation dataset",
    "robotic tool use demonstrations",
    "tool affordance data",
    "robot hammering data",
    "tool-object interaction dataset",
    "screwdriving robot data",
  ],
  canonicalPath: "/training-data/tool-use",
  h1: "Tool Use Training Data",
  heroSubtitle:
    "Demonstration datasets for robotic tool use — hammering, screwdriving, scooping, spreading, and cutting tasks that require understanding tool affordances, grip strategies, and applied force dynamics.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Training Data", href: "/training-data" },
    { label: "Tool Use", href: "/training-data/tool-use" },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Is Robotic Tool Use and Why Is Data Critical?",
      paragraphs: [
        "Tool use is a hallmark of intelligent behavior — it extends a manipulator's capabilities far beyond its native geometry. A robot with a spatula can flip pancakes; with a screwdriver, it can assemble furniture; with a hammer, it can drive nails. But training tool use policies is uniquely challenging because the robot must learn a compound skill: how to grasp the tool correctly, how to orient it for the task, and how to transmit force through the tool body to achieve the desired effect on the workpiece. This extended kinematic chain — robot arm to tool to object — means that small errors in grip or angle propagate and amplify through the tool, requiring data that captures the full range of successful and failed tool interactions.",
        "The data challenge for tool use is distinct from general manipulation. Force transmission through rigid and compliant tool bodies creates dynamics that are difficult to simulate accurately. A screwdriver transfers torque through a narrow tip with strict alignment tolerances. A hammer requires precise timing of the ballistic swing phase. A knife must maintain consistent angle and pressure during a cutting stroke. Force/torque data at the wrist captures both the gripping force on the tool handle and the applied force on the workpiece, and these components must be disambiguated through careful annotation for downstream policy learning.",
        "Recent research has shown that tool use is more learnable from demonstrations than previously thought. The ALOHA system (Zhao et al., 2023) demonstrated cooking tool use — spatula flipping, ladle scooping — from just 50 bimanual demonstrations per tool with Diffusion Policy. Qin et al. (2023) showed that vision-language models can infer tool affordances from demonstrations, enabling novel tool use through analogy: a model that learns to use a spoon for scooping can generalize to a ladle. These results suggest that tool use policy learning is highly data-efficient when the demonstrations are high-quality and richly annotated with force profiles and task phase labels.",
        "The critical gap in current tool use research is cross-tool generalization. Most demonstrations are collected with a single tool instance, but production deployment requires handling variation in tool size, weight, balance, and compliance. A policy trained on one specific spatula often fails with a different spatula that has a different handle angle or blade flexibility. Building robust tool use policies requires demonstrations across 3-5 instances per tool category, with explicit annotation of tool properties (weight, center of mass, compliance) that enable category-level generalization.",
      ],
    },
    {
      type: "stats",
      heading: "Tool Use Data by the Numbers",
      stats: [
        { value: "50", label: "Demonstrations per tool for ALOHA cooking tasks" },
        { value: "30-50%", label: "Success rate improvement with force/torque data" },
        { value: "6", label: "Core tool categories covering most applications" },
        { value: "200+ Hz", label: "Force sampling rate needed for impact transients" },
        { value: "3-5", label: "Tool instances per category for generalization" },
        { value: "85%", label: "Cross-tool transfer rate with affordance-aware policies" },
      ],
    },
    {
      type: "comparison-table",
      heading: "Data Requirements by Tool Use Approach",
      description:
        "Different learning architectures have distinct data requirements for tool use. Force data is critical for contact-rich tasks but less important for non-contact tool manipulation.",
      columns: [
        "Approach",
        "Data Volume",
        "Primary Modality",
        "Key Annotations",
        "Best For",
      ],
      rows: [
        {
          Approach: "Behavioral cloning (ACT/Diffusion Policy)",
          "Data Volume": "50-200 demos per tool per task",
          "Primary Modality": "Multi-view RGB + proprioception",
          "Key Annotations": "Full trajectory + tool grasp config + task phase labels",
          "Best For": "Single-tool high-fidelity manipulation",
        },
        {
          Approach: "Affordance-based transfer (VLM + policy)",
          "Data Volume": "500+ demos across 5+ tool instances per category",
          "Primary Modality": "RGB + language descriptions of tool properties",
          "Key Annotations": "Tool affordance labels + functional grasp points",
          "Best For": "Cross-tool generalization within categories",
        },
        {
          Approach: "Force-guided tool use (RL with force feedback)",
          "Data Volume": "1K-10K interaction episodes with force labels",
          "Primary Modality": "Force/torque + proprioception + RGB",
          "Key Annotations": "Force profiles + contact state + outcome labels",
          "Best For": "Contact-rich tasks (cutting, hammering, screwing)",
        },
        {
          Approach: "Foundation model fine-tuning (RT-2, OpenVLA)",
          "Data Volume": "5K-20K demos with language annotations",
          "Primary Modality": "RGB + language instruction",
          "Key Annotations": "Language-annotated tool use demos + tool name labels",
          "Best For": "Language-specified tool selection and use",
        },
        {
          Approach: "Sim-to-real with domain randomization",
          "Data Volume": "100K+ sim + 500-2K real for calibration",
          "Primary Modality": "RGB-D + simulated force",
          "Key Annotations": "Sim-generated trajectories + real success labels",
          "Best For": "Tools with well-modeled physics (rigid, simple geometry)",
        },
      ],
    },
    {
      type: "prose",
      heading: "State of the Art in Learned Tool Use",
      paragraphs: [
        "ALOHA (Zhao et al., 2023) demonstrated that bimanual tool use — including spatula flipping, ladle transfer, and chopstick manipulation — can be learned from as few as 50 teleoperated demonstrations per task when paired with Action Chunking with Transformers (ACT). The key was high-quality demonstrations with synchronized bimanual control at 50 Hz, enabling the policy to learn the precise timing coordination between the tool-wielding hand and the stabilizing hand. ALOHA achieved 80-96% success rates across cooking tool tasks, with failures primarily at the tool-grasping phase rather than during tool application.",
        "RoboTool (Xu et al., 2023) tackled creative tool use — selecting and applying novel tools to solve problems the robot has never encountered. By grounding GPT-4's tool reasoning in a set of parameterized tool-use primitives learned from demonstrations, RoboTool solved 12 out of 15 novel tool use challenges including using a stick to push an out-of-reach object and using a funnel to pour granular material. The approach required only 20-50 demonstrations of basic tool primitives (push, pull, scoop, lever) and relied on the LLM for compositional tool use planning.",
        "For industrial tool use, Luo et al. (2024) demonstrated that force-guided screw insertion with a power drill achieves 97.3% success rate when trained on 2,000 force-annotated demonstrations, compared to 73.1% for vision-only policies. The force data was critical for detecting cross-threading (a failure mode invisible to cameras) and for learning the compliance switching between the approach phase (position control) and the engagement phase (force-limited torque control). This result confirms that force/torque sensing is not optional for contact-rich industrial tool use.",
        "ManipGen (Duan et al., 2024) introduced category-level tool manipulation by learning a shared latent representation across tool instances. Trained on 500 demonstrations spanning 15 different hammers, the system achieved 82% success rate on novel hammer geometries versus 34% for a single-instance policy. The representation captured tool-invariant features — grip point relative to center of mass, swing trajectory relative to head position — that transferred across the shape variation within the hammer category.",
      ],
    },
    {
      type: "prose",
      heading: "Collection Methodology for Tool Use Data",
      paragraphs: [
        "Tool use data collection requires force-instrumented workstations that capture both the gripping force on the tool handle and the applied force at the tool tip. The standard setup uses a 6-axis force/torque sensor mounted at the robot wrist (ATI Mini45 or OnRobot HEX) recording at 500-1000 Hz, supplemented by strain gauges or a second F/T sensor at the tool tip when the tool allows instrumentation. Multi-view RGB cameras (minimum 3 viewpoints: overhead, wrist-mounted, and side) at 30 Hz provide the visual observations, with proprioceptive data from joint encoders at 100-200 Hz completing the sensor suite.",
        "Tool use data should be organized by tool category rather than by specific task, because affordance structure transfers within categories. The six core categories covering most applications are: (1) cutting/slicing tools (knives, scissors, saws), (2) scooping/serving tools (spoons, ladles, shovels), (3) turning/driving tools (screwdrivers, wrenches, keys), (4) gripping/holding tools (pliers, tongs, tweezers), (5) striking tools (hammers, mallets), and (6) spreading/smoothing tools (spatulas, trowels, rollers). Each category needs demonstrations across 3-5 specific tool instances varying in size, weight, and material to enable category-level generalization.",
        "Annotations must capture the full task phase structure. For cutting tasks: approach, blade engagement, cutting stroke (with pressure and angle), and withdrawal. For striking tasks: tool grasp, wind-up, ballistic swing, impact, and follow-through. For turning tasks: engagement, torque application, angle tracking, and disengagement. Phase boundaries are annotated by timestamps and validated against force profile transitions. Additionally, each demonstration should include the tool's physical properties (mass, length, center of mass) and grasp configuration (contact points on handle, grip orientation).",
        "Claru collects tool use data with dual force/torque instrumentation — wrist-mounted and tool-tip sensors — across all six tool categories using real household, workshop, and kitchen implements. Our operators are trained to demonstrate natural, efficient tool use with consistent quality across 3-5 instances per tool category. We deliver annotated datasets with force profiles, task phase segmentation, tool grasp configurations, and tool property metadata in formats compatible with Diffusion Policy, ACT, and VLA architectures.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Key Datasets for Robot Tool Use",
      description:
        "Public tool use datasets are sparse compared to general manipulation. Most cover limited tool categories with small demonstration counts.",
      columns: [
        "Dataset",
        "Year",
        "Scale",
        "Tool Categories",
        "Force Data",
        "Cross-Tool Variation",
      ],
      rows: [
        {
          Dataset: "ALOHA cooking (Zhao et al.)",
          Year: "2023",
          Scale: "50 demos per task",
          "Tool Categories": "Spatula, ladle, chopsticks",
          "Force Data": "No (vision + proprioception only)",
          "Cross-Tool Variation": "Single instance per tool",
        },
        {
          Dataset: "RoboTool (Xu et al.)",
          Year: "2023",
          Scale: "20-50 primitive demos",
          "Tool Categories": "Sticks, funnels, hooks, levers",
          "Force Data": "No",
          "Cross-Tool Variation": "Limited (focus on novel tools)",
        },
        {
          Dataset: "ToolFlowNet (Seita et al.)",
          Year: "2023",
          Scale: "1K+ demos for scooping/pouring",
          "Tool Categories": "Scoops, cups, ladles",
          "Force Data": "Partial (simulated)",
          "Cross-Tool Variation": "Multiple tool shapes in sim",
        },
        {
          Dataset: "Industrial Assembly (Luo et al.)",
          Year: "2024",
          Scale: "2K force-annotated screw insertions",
          "Tool Categories": "Power drill, manual screwdriver",
          "Force Data": "Yes (1000 Hz F/T)",
          "Cross-Tool Variation": "Multiple screw types",
        },
        {
          Dataset: "ManipGen Hammers (Duan et al.)",
          Year: "2024",
          Scale: "500 demos across 15 hammer instances",
          "Tool Categories": "Hammers only",
          "Force Data": "Yes (impact force profiles)",
          "Cross-Tool Variation": "15 different hammer geometries",
        },
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        {
          id: "zhao-aloha-2023",
          title: "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware",
          authors: "Zhao et al.",
          venue: "RSS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2304.13705",
        },
        {
          id: "xu-robotool-2023",
          title: "Creative Robot Tool Use with Large Language Models",
          authors: "Xu et al.",
          venue: "arXiv 2310.13065",
          year: 2023,
          url: "https://arxiv.org/abs/2310.13065",
        },
        {
          id: "luo-insertion-2024",
          title: "Force-Guided Industrial Assembly with Learned Compliance Switching",
          authors: "Luo et al.",
          venue: "ICRA 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2401.02870",
        },
        {
          id: "seita-toolflow-2023",
          title: "ToolFlowNet: Robotic Manipulation with Tools via Predicting Tool Flow",
          authors: "Seita et al.",
          venue: "CoRL 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2211.09006",
        },
        {
          id: "chi-diffusion-2023",
          title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
          authors: "Chi et al.",
          venue: "RSS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2303.04137",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "How many demonstrations per tool are needed?",
      answer:
        "With Diffusion Policy or ACT, 50-200 demonstrations per tool per task achieve 80-96% success rates for single-instance tool use, as demonstrated by the ALOHA system. For cross-tool generalization within a category (learning that all spatulas work similarly despite different sizes and materials), 500+ demonstrations across 5+ tool instances per category are recommended based on ManipGen's findings. Tool variation within a category — size, weight, handle angle, blade flexibility — is as important as task variation. Start with a single tool instance for proof-of-concept, then expand to the full category for production robustness.",
    },
    {
      question: "Is force data essential for tool use?",
      answer:
        "Critical for contact-rich tool tasks including cutting, hammering, screwing, and grinding. Force/torque data at the wrist improves success rates by 30-50% on these tasks compared to vision-only policies, as demonstrated by Luo et al. (2024) who showed 97.3% success with force versus 73.1% without for screw insertion. Force data captures failure modes invisible to cameras: cross-threading, blade binding, insufficient contact pressure. For non-contact tool use (pointing, stirring in air, sweeping), force data is less important but still useful for detecting tool-surface contact transitions. Record force at 200+ Hz minimum to capture impact transients during striking tasks and thread engagement during driving tasks.",
    },
    {
      question: "Can tool use transfer across robot embodiments?",
      answer:
        "Partially. The tool affordance understanding transfers well — where to grasp a hammer, what swing trajectory to use, how much force to apply — because these are properties of the tool-task pair, not the robot. However, specific joint trajectories do not transfer because different arm kinematics require different joint configurations to achieve the same end-effector pose. Cross-embodiment tool use datasets benefit from recording in the tool frame (position and force relative to the tool's functional point) rather than the robot frame, enabling embodiment-agnostic training. ViNT-style cross-embodiment approaches show promise but have not yet been validated specifically for tool use tasks.",
    },
    {
      question: "What tool categories should a general-purpose dataset cover?",
      answer:
        "Six core categories cover the vast majority of household and industrial tool use applications: (1) cutting/slicing tools — knives, scissors, saws, requiring precise blade angle and pressure control; (2) scooping/serving tools — spoons, ladles, shovels, requiring load estimation and tilt control; (3) turning/driving tools — screwdrivers, wrenches, keys, requiring torque control and alignment; (4) gripping/holding tools — pliers, tongs, tweezers, requiring force regulation for delicate objects; (5) striking tools — hammers, mallets, requiring ballistic swing timing; (6) spreading/smoothing tools — spatulas, trowels, rollers, requiring consistent pressure distribution. Each category needs 3-5 specific tool instances for within-category generalization.",
    },
    {
      question: "How do you annotate the extended kinematic chain in tool use?",
      answer:
        "The extended kinematic chain (robot arm to tool to object) requires multi-level annotation. At the robot level: joint positions, velocities, and end-effector pose at 100+ Hz. At the tool level: grasp configuration (contact points on handle, grip force, orientation relative to end-effector), tool pose in world frame, and tool-specific state (blade angle for knives, bit engagement for screwdrivers). At the object level: workpiece pose, material properties, and task-relevant state (cut depth, screw insertion depth, nail penetration). Force/torque annotation should decompose wrist forces into grip maintenance forces and task-application forces using the tool geometry as reference. Task phase labels (approach, engage, execute, withdraw) provide the temporal structure for curriculum learning.",
    },
  ],
  ctaHeading: "Get a Custom Quote for Tool Use Data",
  ctaDescription:
    "Tell us which tool categories and tasks you need, and we will design a force-instrumented data collection plan with real tool instances from your target domain.",
  relatedGlossaryTerms: [
    "hand-object-interaction",
    "contact-rich-manipulation",
    "action-segmentation",
    "tool-affordance",
    "force-torque-data",
  ],
  relatedGuidePages: [
    "how-to-label-robot-demonstrations",
    "how-to-build-a-manipulation-dataset",
  ],
  relatedSolutionSlugs: [],
  dataRequirements: {
    modality: "RGB multi-view + 6-axis force/torque + proprioception + tool state",
    volumeRange: "2K-20K demonstrations per tool category",
    temporalResolution: "30 Hz video, 500-1000 Hz force/torque, 100 Hz proprioception",
    keyAnnotations: [
      "Tool grasp configuration (contact points, grip force, orientation)",
      "Applied force profiles decomposed into grip and task components",
      "Tool-object contact state transitions",
      "Task phase segmentation (approach, engage, execute, withdraw)",
      "Tool physical properties (mass, CoM, compliance)",
      "Tool affordance labels (functional grasp points, application zones)",
    ],
  },
  relevantModels: [
    "Diffusion Policy",
    "ACT/ALOHA",
    "RT-2",
    "OpenVLA",
    "RoboTool",
    "ToolFlowNet",
  ],
  environmentTypes: [
    "Kitchen",
    "Workshop",
    "Construction site",
    "Laboratory",
    "Household",
    "Assembly line",
  ],
  keyPapers: [
    {
      id: "zhao-aloha-2023",
      title: "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware",
      authors: "Zhao et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2304.13705",
    },
    {
      id: "xu-robotool-2023",
      title: "Creative Robot Tool Use with Large Language Models",
      authors: "Xu et al.",
      venue: "arXiv 2310.13065",
      year: 2023,
      url: "https://arxiv.org/abs/2310.13065",
    },
    {
      id: "luo-insertion-2024",
      title: "Force-Guided Industrial Assembly with Learned Compliance Switching",
      authors: "Luo et al.",
      venue: "ICRA 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2401.02870",
    },
    {
      id: "seita-toolflow-2023",
      title: "ToolFlowNet: Robotic Manipulation with Tools via Predicting Tool Flow",
      authors: "Seita et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2211.09006",
    },
    {
      id: "chi-diffusion-2023",
      title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
      authors: "Chi et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2303.04137",
    },
  ],
  claruRelevance:
    "Claru provides tool use data collection with dual force/torque instrumentation — wrist-mounted ATI sensors recording at 500+ Hz and optional tool-tip strain gauges for decomposed force measurement. Our demonstrations span all six core tool categories (cutting, scooping, turning, gripping, striking, spreading) using real household, workshop, and kitchen implements with 3-5 instances per category for cross-tool generalization. Operators are trained to demonstrate natural, efficient tool use with consistent quality, and every demonstration includes force profiles, task phase segmentation, tool grasp configuration, and tool physical properties. We deliver datasets formatted for direct ingestion by Diffusion Policy, ACT, RT-2, and custom VLA architectures, with train/validation/test splits stratified by tool instance to validate cross-tool transfer before deployment.",
};

export default data;
