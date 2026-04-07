import type { AcademicAltPageData } from "../types";

const data: AcademicAltPageData = {
  slug: "rh20t-alternative",
  metaTitle: "RH20T Alternative for Production Robot Training | Claru",
  metaDescription:
    "Compare RH20T's 110K contact-rich manipulation demos with Claru's commercial data. Multi-modal coverage, force/torque data, and production deployment compared.",
  primaryKeyword: "rh20t alternative",
  secondaryKeywords: [
    "rh20t vs claru",
    "rh20t dataset limitations",
    "rh20t commercial alternative",
    "contact-rich manipulation data",
    "robot manipulation training data",
  ],
  canonicalPath: "/compare/rh20t-alternative",
  h1: "RH20T Alternative: Commercial Training Data for Contact-Rich Manipulation",
  heroSubtitle:
    "RH20T set a new bar for multi-modal robot data with 110K+ contact-rich demonstrations including force/torque sensing. But fixed tasks, single-lab environments, and specific robot configurations limit its production applicability. Compare RH20T with Claru's customizable data collection.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Compare", href: "/compare" },
    { label: "RH20T Alternative", href: "/compare/rh20t-alternative" },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Is RH20T?",
      paragraphs: [
        "RH20T (Robot-Human 20 Tasks) is a large-scale multi-modal dataset for contact-rich manipulation, published by researchers at Tsinghua University and the Shanghai AI Lab in 2023. It contains over 110,000 demonstrations across roughly 147 unique task configurations organized into 20 broad task families, including pouring, stacking, wiping, stirring, cutting, scooping, and various tool-use scenarios. The dataset was collected using a Flexiv Rizon 4 robotic arm equipped with a Dahuan AG-95 parallel gripper and, notably, a wrist-mounted ATI force/torque sensor.",
        "What distinguishes RH20T from most robot learning datasets is its multi-modal richness. Each demonstration records synchronized data from four RGB cameras (two third-person views, one eye-in-hand, one overhead), a wrist-mounted force/torque sensor capturing 6-axis forces at 500 Hz, full 7-DoF joint positions and velocities, end-effector poses, and gripper aperture. This makes RH20T one of the few large-scale datasets that captures the haptic feedback critical for contact-rich manipulation -- tasks where the robot must modulate force based on interaction with objects.",
        "Demonstrations were collected via kinesthetic teaching (physically guiding the robot arm) and teleoperation, with both expert and non-expert operators contributing. The dataset includes language task descriptions and timestamps marking contact events and task-phase transitions. Data is stored in HDF5 format with a hierarchical structure organizing demonstrations by task family and configuration.",
        "RH20T is released under the Apache 2.0 license, making it commercially permissive. It has been used as a pretraining and evaluation resource for manipulation policies that require multi-modal inputs, particularly those learning from visual-tactile or visual-force feedback. The dataset's contact-rich focus fills a gap that most manipulation datasets -- which record only RGB and proprioception -- leave open.",
      ],
    },
    {
      type: "stats",
      heading: "RH20T at a Glance",
      stats: [
        { value: "110K+", label: "Demonstrations" },
        { value: "147", label: "Task Configurations" },
        { value: "20", label: "Task Families" },
        { value: "4", label: "RGB Camera Views" },
        { value: "500 Hz", label: "Force/Torque Sampling" },
        { value: "Apache 2.0", label: "License" },
      ],
    },
    {
      type: "comparison-table",
      heading: "RH20T vs. Claru: Side-by-Side Comparison",
      description:
        "A detailed comparison for teams evaluating contact-rich manipulation data for production deployment.",
      columns: ["Dimension", "RH20T", "Claru"],
      rows: [
        {
          Dimension: "Scale",
          RH20T: "110K+ demos across 147 task configurations",
          Claru: "1K to 1M+ demos, scoped to your tasks",
        },
        {
          Dimension: "Robot Platform",
          RH20T: "Flexiv Rizon 4 with Dahuan AG-95 gripper",
          Claru: "Any robot platform with any end-effector",
        },
        {
          Dimension: "Force/Torque Data",
          RH20T: "6-axis ATI F/T sensor at 500 Hz",
          Claru: "Your F/T sensor at your control rate (up to 1 kHz)",
        },
        {
          Dimension: "Visual Data",
          RH20T: "4 RGB cameras (no depth)",
          Claru: "RGB + depth, configurable multi-view with calibrated extrinsics",
        },
        {
          Dimension: "Environment",
          RH20T: "Single university lab setting",
          Claru: "Your actual deployment environment",
        },
        {
          Dimension: "Object Set",
          RH20T: "Fixed lab objects across 20 task families",
          Claru: "Your production objects and materials",
        },
        {
          Dimension: "Collection Method",
          RH20T: "Kinesthetic teaching + teleoperation (mixed quality)",
          Claru: "Expert teleoperation with standardized QC",
        },
        {
          Dimension: "Tactile Sensing",
          RH20T: "Not included (force/torque only)",
          Claru: "Tactile arrays available on supported grippers",
        },
        {
          Dimension: "License",
          RH20T: "Apache 2.0",
          Claru: "Commercial license with IP assignment",
        },
        {
          Dimension: "Expansion",
          RH20T: "Static release",
          Claru: "Continuous collection, expanding as needed",
        },
      ],
    },
    {
      type: "prose",
      heading: "Key Limitations of RH20T for Production Use",
      paragraphs: [
        "RH20T is collected on a single robot configuration: the Flexiv Rizon 4 with a Dahuan AG-95 parallel-jaw gripper. Teams deploying different arms (Franka, UR, KUKA, xArm), different grippers (Robotiq, custom fingers, suction), or different morphologies (dual-arm, mobile manipulator, dexterous hand) cannot directly use RH20T's demonstrations. The kinematic trajectories, force profiles, and workspace geometry are specific to the Flexiv platform and do not transfer to other hardware without substantial adaptation.",
        "While RH20T's force/torque data is a major differentiator, it captures only the 6-axis wrist force/torque sensor. It does not include fingertip tactile arrays, joint torque measurements, or contact microphone data that many production contact-rich applications require. For tasks like deformable object manipulation, precision insertion, or surface finishing, distributed tactile sensing at the fingertip provides crucial information that a wrist-mounted F/T sensor alone cannot capture.",
        "The dataset's demonstrations come from a single university lab environment with fixed lighting, fixed backgrounds, and a limited set of lab objects. Production environments differ dramatically: industrial settings have reflective metal surfaces and variable overhead lighting; commercial kitchens have steam, splashes, and cluttered countertops; warehouses have dynamic obstacles and low ambient light. Policies trained on RH20T's controlled lab setting are brittle when deployed in these real-world conditions.",
        "Demonstration quality in RH20T varies because both expert and non-expert operators contributed, using both kinesthetic teaching and teleoperation. Kinesthetic teaching tends to produce slower, less natural trajectories than teleoperation, and non-expert operators introduce suboptimal motion patterns. Production training data benefits from consistent, expert-level demonstrations that reflect the efficiency and robustness expected in deployment.",
        "RH20T includes no depth data from its camera setup -- only RGB images. Depth information is increasingly important for manipulation policies that must reason about object geometry, estimate grasp points, or avoid collisions in cluttered scenes. The absence of depth limits the visual-spatial reasoning that policies can learn from RH20T alone.",
      ],
    },
    {
      type: "prose",
      heading: "When to Use RH20T vs. Commercial Data",
      paragraphs: [
        "RH20T is the right choice for research on contact-rich manipulation where force/torque integration is central to the investigation. If you are studying how robots can learn to modulate grip force during pouring, detect contact events during insertion, or adapt force profiles across tool-use scenarios, RH20T provides multi-modal data that few other datasets offer. Its 20 task families span a meaningful range of contact-rich skills, making it a solid benchmark for force-aware policy learning.",
        "RH20T is also useful for pretraining multi-modal policies that fuse visual and haptic inputs. Even if the F/T sensor in your deployment differs from RH20T's ATI sensor, pretraining on RH20T's force-conditioned demonstrations can teach policies the general structure of force-aware manipulation before fine-tuning on your specific sensor's characteristics.",
        "Switch to Claru when your production requirements diverge from RH20T's fixed configuration. If your robot is not a Flexiv Rizon 4, if your tasks are not among RH20T's 20 families, if your environment is not a university lab, or if you need depth and tactile data alongside force/torque -- Claru collects exactly what you need. Our data collection covers any robot platform, any environment, and any sensor configuration, with consistent quality from trained teleoperators.",
      ],
    },
    {
      type: "prose",
      heading: "How Claru Complements RH20T",
      paragraphs: [
        "Claru extends RH20T's multi-modal philosophy to your specific deployment context. Where RH20T demonstrated that force/torque data dramatically improves contact-rich manipulation learning, Claru applies that insight with your hardware: your force/torque sensor at your control rate, your tactile arrays, your depth cameras, synchronized with RGB and proprioception in a unified data schema.",
        "For teams that have used RH20T to validate that multi-modal inputs improve their policy architecture, Claru provides the domain-specific data to deploy that architecture in production. We match RH20T's sensor synchronization standards while adding depth sensing and expanding to your actual task set, object inventory, and environmental conditions.",
        "Our teleoperators are trained specifically for contact-rich tasks where force modulation matters. Unlike RH20T's mixed expert/non-expert collection, every Claru demonstration represents an expert execution that models the efficient, reliable behavior your production policy should replicate. Quality control includes automated force-profile validation that flags demonstrations with excessive contact forces or abnormal force transients.",
        "Data is delivered in HDF5 (matching RH20T's format), RLDS, zarr, or LeRobot format. For teams combining RH20T pretraining with Claru fine-tuning, we ensure schema compatibility so that the transition is seamless. Every demonstration includes calibrated camera extrinsics, sensor timestamp alignment documentation, and force/torque zero-offset calibration data.",
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        {
          id: "fang-rh20t-2023",
          title: "RH20T: A Robotic Dataset for Learning Diverse Skills in One-Shot",
          authors: "Fang et al.",
          venue: "RSS Workshop on Learning for Task and Motion Planning 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2307.00595",
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
          id: "zhao-act-2023",
          title: "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware",
          authors: "Zhao et al.",
          venue: "RSS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2304.13705",
        },
        {
          id: "embodiment-collaboration-2024",
          title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
          authors: "Open X-Embodiment Collaboration",
          venue: "ICRA 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2310.08864",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "Is RH20T the best dataset for contact-rich manipulation?",
      answer:
        "RH20T is one of the few large-scale datasets that includes synchronized force/torque data with visual observations, making it uniquely valuable for contact-rich manipulation research. However, it is limited to one robot platform, one lab environment, and no depth or tactile data. For production deployment, you need data from your specific setup. Claru collects multi-modal data including force/torque on any platform.",
    },
    {
      question: "Can I use RH20T commercially?",
      answer:
        "Yes. RH20T is released under the Apache 2.0 license, which permits commercial use. The practical limitation is that the data is from a single robot (Flexiv Rizon 4) in a single lab, so most production teams need supplemental data matching their specific deployment configuration.",
    },
    {
      question: "Does RH20T include depth data?",
      answer:
        "No. RH20T records only RGB images from four camera viewpoints. It does not include depth maps. For policies that require depth-based geometric reasoning (grasp planning, collision avoidance, shape estimation), supplemental depth data from a service like Claru is necessary.",
    },
    {
      question: "How does RH20T's force/torque data compare to Claru's?",
      answer:
        "RH20T uses an ATI wrist-mounted 6-axis force/torque sensor sampling at 500 Hz. Claru collects force/torque data from whatever sensor your robot uses, at your preferred sampling rate (up to 1 kHz). We also support fingertip tactile arrays and joint torque measurements that RH20T does not include, providing richer haptic feedback for contact-sensitive policies.",
    },
    {
      question: "Can I combine RH20T and Claru data for training?",
      answer:
        "Yes. Claru can deliver data in HDF5 format matching RH20T's schema structure, or in RLDS/zarr/LeRobot format. For cross-platform training, both datasets can be loaded into a unified training pipeline. RH20T provides broad contact-rich manipulation priors, while Claru's data grounds the policy in your specific robot, objects, and deployment conditions.",
    },
  ],
  ctaHeading: "Get Contact-Rich Data on Your Hardware",
  ctaDescription:
    "Collect multi-modal demonstrations with force/torque, tactile, and depth data on your specific robot platform. Talk to our team about matching RH20T's multi-modal depth for your deployment.",
  relatedGlossaryTerms: [
    "force-torque-sensing",
    "contact-rich-manipulation",
    "imitation-learning",
    "cross-embodiment-data",
  ],
  relatedGuidePages: [
    "how-to-build-a-cross-embodiment-dataset",
    "how-to-evaluate-training-data-quality",
  ],
  relatedSolutionSlugs: ["vla-training-data"],
  datasetName: "RH20T",
  academicProfile: {
    institution: "Tsinghua University / Shanghai AI Lab",
    year: 2023,
    scale:
      "110,000+ contact-rich manipulation demonstrations across 147 task configurations in 20 task families",
    license: "Apache 2.0",
    modalities: [
      "4x RGB cameras (third-person, eye-in-hand, overhead)",
      "6-axis wrist force/torque sensor at 500 Hz",
      "7-DoF joint positions and velocities",
      "End-effector pose",
      "Gripper aperture",
      "Language task descriptions",
    ],
  },
  limitations: [
    "Single robot platform (Flexiv Rizon 4 + Dahuan AG-95 gripper) -- data does not transfer to other hardware",
    "No depth data from any camera viewpoint",
    "No fingertip tactile sensing -- only wrist-mounted force/torque",
    "Single university lab environment with fixed lighting and backgrounds",
    "Mixed expert/non-expert operator quality with kinesthetic and teleoperated demos",
    "Fixed object set limited to lab supplies -- no production SKUs or industrial components",
    "Static dataset with no mechanism for task or environment expansion",
    "Kinesthetic teaching produces slower, less natural trajectories than production teleoperation",
  ],
  claruAdvantages: [
    "Data on your exact robot platform with your specific end-effector and sensors",
    "Full depth sensing alongside RGB for geometric reasoning and grasp planning",
    "Force/torque from your sensor at your control rate, plus optional tactile arrays",
    "Expert teleoperators producing efficient, natural demonstrations consistently",
    "Demonstrations in your actual deployment environment with real lighting and objects",
    "Custom task design matching your production workflow, not fixed academic tasks",
    "Commercial license with IP assignment covering all data",
    "Continuous collection and expansion as your task requirements evolve",
  ],
  keyPapers: [
    {
      id: "fang-rh20t-2023",
      title: "RH20T: A Robotic Dataset for Learning Diverse Skills in One-Shot",
      authors: "Fang et al.",
      venue: "RSS Workshop on Learning for Task and Motion Planning 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2307.00595",
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
      id: "zhao-act-2023",
      title: "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware",
      authors: "Zhao et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2304.13705",
    },
    {
      id: "embodiment-collaboration-2024",
      title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
      authors: "Open X-Embodiment Collaboration",
      venue: "ICRA 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2310.08864",
    },
  ],
  claruRelevance:
    "RH20T demonstrated a critical insight for the robot learning community: multi-modal data that includes force/torque sensing significantly improves learning for contact-rich manipulation tasks. Its 110K demonstrations with synchronized 6-axis force data filled a gap that RGB-only datasets leave wide open. However, RH20T's value is bounded by its single-platform, single-lab design. Teams deploying on different robots, in different environments, with different sensor configurations cannot directly leverage RH20T's demonstrations without substantial domain adaptation. Claru applies RH20T's multi-modal philosophy to your specific deployment. We collect synchronized visual, force/torque, tactile, and depth data on your robot platform, in your environment, with your objects. Our trained teleoperators specialize in contact-rich tasks where force modulation is critical -- insertion, assembly, packing, polishing, and tool use. The result is multi-modal data that matches RH20T's richness while eliminating the domain gap between a Tsinghua lab bench and your production floor. We deliver in HDF5, RLDS, or zarr format with timestamp-aligned sensor streams and calibration data, making it straightforward to extend RH20T-inspired training pipelines to production-grade models.",
};

export default data;
