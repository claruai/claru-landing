import type { TaskPageData } from "../types";

const data: TaskPageData = {
  slug: "mobile-manipulation",
  metaTitle: "Mobile Manipulation Training Data | Claru",
  metaDescription:
    "Training data for mobile manipulation robots: navigating to objects, picking from shelves, and performing tasks while moving. Whole-body control demonstrations.",
  primaryKeyword: "mobile manipulation training data",
  secondaryKeywords: [
    "mobile manipulator dataset",
    "whole-body manipulation data",
    "fetch robot training data",
    "navigate and grasp dataset",
    "home robot training data",
    "mobile ALOHA dataset",
  ],
  canonicalPath: "/training-data/mobile-manipulation",
  h1: "Mobile Manipulation Training Data",
  heroSubtitle:
    "Whole-body demonstration data for mobile manipulators — coordinated navigation and manipulation tasks including shelf picking, table clearing, object delivery, and household chores requiring simultaneous base movement and arm control.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Training Data", href: "/training-data" },
    { label: "Mobile Manipulation", href: "/training-data/mobile-manipulation" },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Is Mobile Manipulation and Why Is Data the Bottleneck?",
      paragraphs: [
        "Mobile manipulation combines navigation and manipulation into a single system: a robot that can move through an environment, approach objects, and manipulate them. This capability underlies virtually every useful household and commercial service robot application — fetching objects from shelves, clearing tables, loading dishwashers, organizing rooms. The global service robot market is projected to exceed $130 billion by 2030, and mobile manipulation is the core technical capability that unlocks this market.",
        "The fundamental challenge is whole-body coordination. A fixed-base manipulator has 6-7 degrees of freedom (DoF); a mobile manipulator has 10-15+ DoF when combining the base (2-3 DoF), arm (6-7 DoF), and gripper (1-2 DoF). These must be coordinated to perform tasks that require simultaneous base repositioning and arm movement — for example, walking up to a table while reaching for an object, or repositioning the base mid-task when the arm reaches its workspace limit. Classical motion planning decomposes this into sequential navigate-then-manipulate, losing the fluid whole-body coordination that makes human task execution efficient.",
        "Mobile ALOHA (Fu et al., 2024) demonstrated that whole-body teleoperation followed by behavioral cloning produces surprisingly capable mobile manipulation policies. Using a bimanual mobile platform teleoperated by a human at walking speed, Mobile ALOHA trained Diffusion Policies on 50-100 demonstrations per task that achieved 80-90% success on complex tasks like opening a two-door cabinet while repositioning, loading dishes into a drying rack, and pushing chairs under a table. The key insight was co-training with static manipulation data: combining 50 mobile demos with 3,000 static tabletop demos improved mobile task success by 34% compared to training on mobile data alone.",
        "The data challenge for mobile manipulation is environment diversity. A policy trained in one apartment fails in another because the spatial layout, furniture arrangement, and object locations differ completely. NaVILA (Chiang et al., 2024) showed that internet-scale vision-language pre-training provides the perceptual generalization needed for mobile manipulation in novel environments, but the manipulation policies themselves still require real demonstration data across at least 10-20 distinct environments to handle the diversity of object positions, approach angles, and cluttered spaces encountered in real deployment.",
      ],
    },
    {
      type: "stats",
      heading: "Mobile Manipulation Data by the Numbers",
      stats: [
        { value: "50-100", label: "Mobile ALOHA demos per task for 80-90% success" },
        { value: "34%", label: "Improvement from co-training with static data" },
        { value: "10-15+", label: "Degrees of freedom in typical mobile manipulator" },
        { value: "$130B", label: "Projected service robot market by 2030" },
        { value: "10-20", label: "Distinct environments needed for generalization" },
        { value: "3,000", label: "Static demos used for co-training in Mobile ALOHA" },
      ],
    },
    {
      type: "comparison-table",
      heading: "Data Requirements by Mobile Manipulation Approach",
      description:
        "Different approaches to mobile manipulation trade off between data volume and generalization capability.",
      columns: [
        "Approach",
        "Data Volume",
        "Primary Modality",
        "Key Annotations",
        "Best For",
      ],
      rows: [
        {
          Approach: "Sequential navigate-then-manipulate",
          "Data Volume": "Separate nav + manipulation datasets",
          "Primary Modality": "RGB + LiDAR (nav) + RGB + proprio (manip)",
          "Key Annotations": "Navigation goals + manipulation demos separately",
          "Best For": "Simple pickup tasks in known environments",
        },
        {
          Approach: "Whole-body BC (Mobile ALOHA style)",
          "Data Volume": "50-100 demos per task + 3K static co-training",
          "Primary Modality": "Multi-view RGB + base odometry + arm proprioception",
          "Key Annotations": "Full whole-body trajectories + task labels",
          "Best For": "Complex tasks requiring coordinated base-arm motion",
        },
        {
          Approach: "Foundation model fine-tuning (NaVILA, RT-2)",
          "Data Volume": "5K-20K diverse mobile demos + web pre-training",
          "Primary Modality": "RGB + language instruction",
          "Key Annotations": "Language-annotated demonstrations + environment labels",
          "Best For": "Cross-environment generalization with language control",
        },
        {
          Approach: "Hierarchical planning (SayCan, Code as Policies)",
          "Data Volume": "200-500 demos per manipulation primitive",
          "Primary Modality": "RGB + language + navigation graph",
          "Key Annotations": "Primitive success labels + semantic maps",
          "Best For": "Long-horizon tasks with many sub-steps",
        },
        {
          Approach: "Sim-to-real with domain randomization",
          "Data Volume": "100K+ sim + 1K-5K real fine-tuning",
          "Primary Modality": "Simulated RGB-D + real RGB",
          "Key Annotations": "Sim trajectories + real success labels",
          "Best For": "High-volume single-environment deployment",
        },
      ],
    },
    {
      type: "prose",
      heading: "State of the Art in Mobile Manipulation",
      paragraphs: [
        "Mobile ALOHA (Fu et al., 2024) set the current standard for learned mobile manipulation. The system uses a bimanual mobile platform with two 6-DoF arms mounted on a wheeled base, teleoperated by a single human operator using a matching leader-follower interface. Trained on 50 demonstrations per task, Mobile ALOHA achieved 90% success on table clearing, 85% on cabinet opening, and 80% on dishwasher loading. The breakthrough finding was that co-training with 3,000 static tabletop manipulation demonstrations from the ALOHA dataset improved mobile task success by 34 percentage points — the static data teaches generalizable manipulation skills that transfer to the mobile context.",
        "NaVILA (Chiang et al., 2024) tackled cross-environment mobile manipulation by combining a vision-language foundation model with learned navigation and manipulation policies. NaVILA can execute open-vocabulary instructions ('bring me the water bottle from the kitchen counter') in apartments it has never seen by leveraging VLM-based scene understanding for navigation target identification and approach planning. In zero-shot evaluations across 10 novel apartments, NaVILA achieved 68% task success versus 31% for Mobile ALOHA without VLM guidance, demonstrating the importance of semantic understanding for mobile manipulation in diverse environments.",
        "TidyBot (Wu et al., 2023) demonstrated that LLM-based preference learning enables personalized mobile manipulation. Given 5-10 examples of how a specific user organizes their home, TidyBot's LLM-based planner generalizes to organize novel items following the same personal preferences with 85% accuracy. The manipulation primitives are trained on 200-500 demonstrations per skill (pick, place, open, close), while the high-level planning leverages GPT-4's category reasoning to determine where new items should go.",
        "For industrial mobile manipulation, Spot from Boston Dynamics combined with learned manipulation policies demonstrates warehouse-relevant capabilities. Hawkins et al. (2023) showed that a Spot robot with a 6-DoF arm trained on 2,000 demonstrations achieves 93% pick success from shelving units at varying heights, with the learned policy coordinating base approach angle and arm reach to maximize the reachable workspace. The critical data requirement was demonstrations at 30+ different shelf configurations spanning the full range of heights, depths, and clutter levels.",
      ],
    },
    {
      type: "prose",
      heading: "Collection Methodology for Mobile Manipulation Data",
      paragraphs: [
        "Mobile manipulation data collection requires a teleoperation-capable mobile platform and diverse indoor environments. The standard approach uses a leader-follower teleoperation interface (Mobile ALOHA style) where the human operator walks alongside or behind the robot, controlling arm and base simultaneously through mirrored joints. This produces the most natural whole-body coordination patterns. Alternative approaches include VR teleoperation (more intuitive but higher latency) and waypoint-based collection (lower quality but higher throughput for simple tasks).",
        "The sensor suite must capture the full state of the mobile manipulator and its environment. At minimum: head/body-mounted RGB cameras (2-3 views at 30 Hz) for scene understanding, wrist-mounted cameras for close-up manipulation views, base odometry (50+ Hz) for position tracking, arm joint positions and velocities (100+ Hz), and optionally a 2D LiDAR (10-20 Hz) for obstacle avoidance context. All sensors must be hardware-synchronized and calibrated to a common robot body frame. Record base velocity commands alongside odometry to capture the intended motion, not just the achieved motion.",
        "Environment diversity is the primary driver of mobile manipulation policy generalization. Collect data in at least 10-20 distinct indoor environments (apartments, offices, retail spaces) with naturally varied furniture arrangements, lighting conditions, and clutter levels. For each environment, record 5-10 episodes of each target task from different starting positions to ensure coverage of the approach angle distribution. Randomize object placement between episodes (move cups to different counter positions, change which shelves contain target objects) to prevent the policy from memorizing fixed locations.",
        "Claru collects mobile manipulation data using instrumented mobile platforms with synchronized multi-view cameras, LiDAR, proprioception, and base odometry across our global network of collection sites. Our operators use whole-body teleoperation interfaces to produce natural coordinated base-arm demonstrations in real homes, offices, and retail spaces. We deliver datasets with full kinematic recordings, environment metadata, task phase labels, and manipulation outcome annotations in RLDS format compatible with Mobile ALOHA, NaVILA, and foundation model architectures.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Key Datasets for Mobile Manipulation",
      description:
        "Public mobile manipulation datasets are growing rapidly as whole-body teleoperation becomes more accessible.",
      columns: [
        "Dataset",
        "Year",
        "Scale",
        "Platform",
        "Tasks",
        "Environments",
      ],
      rows: [
        {
          Dataset: "Mobile ALOHA (Fu et al.)",
          Year: "2024",
          Scale: "50-100 demos per task, 10 tasks",
          Platform: "Custom bimanual mobile base",
          Tasks: "Cabinet opening, table clearing, cooking",
          Environments: "1 kitchen lab",
        },
        {
          Dataset: "NaVILA training (Chiang et al.)",
          Year: "2024",
          Scale: "20K mobile episodes",
          Platform: "Stretch RE1",
          Tasks: "Object fetch, room organization",
          Environments: "10+ apartments (simulated + real)",
        },
        {
          Dataset: "TidyBot (Wu et al.)",
          Year: "2023",
          Scale: "200-500 demos per primitive",
          Platform: "Fetch mobile manipulator",
          Tasks: "Room tidying, object sorting",
          Environments: "30 household layouts",
        },
        {
          Dataset: "Open X-Embodiment (mobile subset)",
          Year: "2024",
          Scale: "~50K mobile manip episodes",
          Platform: "Various (Fetch, Spot, Stretch)",
          Tasks: "Mixed manipulation tasks",
          Environments: "Multiple labs and homes",
        },
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        {
          id: "fu-mobilealoha-2024",
          title: "Mobile ALOHA: Learning Bimanual Mobile Manipulation with Low-Cost Whole-Body Teleoperation",
          authors: "Fu et al.",
          venue: "arXiv 2401.02117",
          year: 2024,
          url: "https://arxiv.org/abs/2401.02117",
        },
        {
          id: "chiang-navila-2024",
          title: "NaVILA: Legged Robot Vision-Language-Action Model for Navigation",
          authors: "Chiang et al.",
          venue: "arXiv 2412.04453",
          year: 2024,
          url: "https://arxiv.org/abs/2412.04453",
        },
        {
          id: "wu-tidybot-2023",
          title: "TidyBot: Personalized Robot Assistance with Large Language Models",
          authors: "Wu et al.",
          venue: "IROS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2305.11461",
        },
        {
          id: "ahn-saycan-2022",
          title: "Do As I Can, Not As I Say: Grounding Language in Robotic Affordances",
          authors: "Ahn et al.",
          venue: "arXiv 2204.01691",
          year: 2022,
          url: "https://arxiv.org/abs/2204.01691",
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
      question: "How many demonstrations are needed for mobile manipulation?",
      answer:
        "Mobile ALOHA demonstrated that 50-100 whole-body teleoperation demonstrations per task achieve 80-90% success when co-trained with 3,000 static manipulation demonstrations. Without co-training, 200-500 mobile demonstrations per task are needed to reach comparable performance. For cross-environment generalization (operating in apartments the robot has never seen), 5,000-20,000 demonstrations across 10-20 distinct environments are recommended based on NaVILA's training regime. Start with a single environment and 50-100 demonstrations for proof-of-concept, then scale environment diversity for production deployment.",
    },
    {
      question: "What is co-training and why does it help mobile manipulation?",
      answer:
        "Co-training means training a single policy on both mobile manipulation demonstrations (where the base moves) and static manipulation demonstrations (tabletop tasks with a fixed base). Mobile ALOHA found that adding 3,000 static ALOHA demonstrations to 50 mobile demonstrations improved mobile task success by 34 percentage points. The static data teaches generalizable manipulation skills (grasping, precise placement, bimanual coordination) that transfer to the mobile context, while the smaller mobile dataset teaches whole-body coordination. This dramatically reduces the amount of expensive mobile teleoperation data needed. For maximum benefit, the static data should use the same robot arms and similar objects.",
    },
    {
      question: "How do you handle varying environment layouts?",
      answer:
        "Environment diversity is the primary driver of mobile manipulation generalization. Collect data in at least 10-20 distinct indoor environments with naturally varied furniture arrangements. For each environment, record demonstrations from different starting positions (5-10 per task) and randomize object locations between episodes. Annotate each demonstration with the environment ID and a semantic map of furniture positions so the training pipeline can stratify by environment for validation. Without environment diversity, policies memorize specific navigation paths and object locations, achieving high accuracy in the training environment but failing catastrophically in new spaces.",
    },
    {
      question: "What teleoperation interface works best for mobile manipulation?",
      answer:
        "Leader-follower teleoperation (Mobile ALOHA style) produces the highest quality demonstrations because the operator physically feels the robot's dynamics and naturally coordinates base and arm motion. The operator walks alongside the robot, controlling a pair of leader arms that mirror the robot's follower arms, while a foot pedal or body motion controls the base. VR teleoperation is more intuitive for new operators but introduces 50-100ms latency that degrades contact-rich manipulation quality. Keyboard/joystick control produces the lowest quality demonstrations due to the cognitive load of separately controlling 10+ DoF. For data quality, invest in leader-follower hardware even though it is more expensive.",
    },
    {
      question: "Can simulation data help with mobile manipulation?",
      answer:
        "Simulation is valuable for navigation pre-training (learning to approach objects from different angles) and basic manipulation skill pre-training, but the combined sim-to-real gap for mobile manipulation is larger than for either component alone. The navigation gap (floor textures, lighting, obstacle distribution) and the manipulation gap (contact dynamics, object properties) compound. Habitat and AI2-THOR provide useful simulated apartment environments for pre-training spatial reasoning, but real-data fine-tuning is essential. The most cost-effective approach uses 100K+ simulated episodes for basic skills followed by 1K-5K real whole-body demonstrations for production deployment.",
    },
  ],
  ctaHeading: "Get a Custom Quote for Mobile Manipulation Data",
  ctaDescription:
    "Tell us your target tasks and deployment environments, and we will design a whole-body data collection plan with diverse indoor environments.",
  relatedGlossaryTerms: [
    "manipulation-trajectory",
    "behavioral-cloning",
    "imitation-learning",
    "whole-body-control",
    "navigation",
  ],
  relatedGuidePages: [
    "how-to-build-a-manipulation-dataset",
    "how-to-build-a-navigation-dataset",
  ],
  relatedSolutionSlugs: [],
  dataRequirements: {
    modality: "RGB multi-view + LiDAR + arm proprioception + base odometry + wrist camera",
    volumeRange: "50-100 demos per task (with co-training) or 5K-50K for cross-environment",
    temporalResolution: "30 Hz video, 10-20 Hz LiDAR, 100 Hz proprioception, 50 Hz base odometry",
    keyAnnotations: [
      "Whole-body trajectory (base velocity + arm joints simultaneously)",
      "Navigation phase vs manipulation phase labels",
      "Base-arm coordination events (simultaneous movement)",
      "Object goal locations and grasp outcomes",
      "Environment ID and semantic map metadata",
      "Task phase segmentation (approach, grasp, transport, place)",
    ],
  },
  relevantModels: [
    "Mobile ALOHA / Diffusion Policy",
    "NaVILA",
    "SayCan",
    "RT-2",
    "TidyBot",
    "Code as Policies",
  ],
  environmentTypes: [
    "Home",
    "Office",
    "Retail store",
    "Hospital",
    "Warehouse",
    "Restaurant",
  ],
  keyPapers: [
    {
      id: "fu-mobilealoha-2024",
      title: "Mobile ALOHA: Learning Bimanual Mobile Manipulation with Low-Cost Whole-Body Teleoperation",
      authors: "Fu et al.",
      venue: "arXiv 2401.02117",
      year: 2024,
      url: "https://arxiv.org/abs/2401.02117",
    },
    {
      id: "chiang-navila-2024",
      title: "NaVILA: Legged Robot Vision-Language-Action Model for Navigation",
      authors: "Chiang et al.",
      venue: "arXiv 2412.04453",
      year: 2024,
      url: "https://arxiv.org/abs/2412.04453",
    },
    {
      id: "wu-tidybot-2023",
      title: "TidyBot: Personalized Robot Assistance with Large Language Models",
      authors: "Wu et al.",
      venue: "IROS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2305.11461",
    },
    {
      id: "ahn-saycan-2022",
      title: "Do As I Can, Not As I Say: Grounding Language in Robotic Affordances",
      authors: "Ahn et al.",
      venue: "arXiv 2204.01691",
      year: 2022,
      url: "https://arxiv.org/abs/2204.01691",
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
    "Claru collects mobile manipulation data using instrumented mobile platforms with synchronized multi-view cameras, LiDAR, arm proprioception, and base odometry. Our operators use whole-body teleoperation interfaces to produce natural coordinated base-arm demonstrations in real homes, offices, retail spaces, and other indoor environments across our global network of 100+ cities. We leverage environment diversity — the single most important factor for mobile manipulation generalization — by collecting in 10-20+ distinct indoor spaces per dataset. Standard delivery includes whole-body kinematic recordings, environment semantic maps, task phase annotations, and manipulation outcome labels in RLDS format compatible with Mobile ALOHA, NaVILA, and foundation model architectures. For teams using co-training, we can provide matched static manipulation datasets collected on the same robot arms.",
};

export default data;
