import type { AcademicAltPageData } from "../types";

const data: AcademicAltPageData = {
  slug: "bc-z-alternative",
  metaTitle: "BC-Z Alternative for Production Robot Training | Claru",
  metaDescription:
    "Compare BC-Z's 26K teleoperated demonstrations with Claru's real-world training data. Licensing, scale, zero-shot generalization, and production readiness compared.",
  primaryKeyword: "bc-z alternative",
  secondaryKeywords: [
    "bc-z vs claru",
    "bc-z dataset limitations",
    "bc-z commercial alternative",
    "bc-z zero-shot robotics",
    "robot imitation learning data",
  ],
  canonicalPath: "/compare/bc-z-alternative",
  h1: "BC-Z Alternative: Real-World Training Data for Production Robotics",
  heroSubtitle:
    "BC-Z demonstrated that zero-shot task generalization is achievable with large-scale imitation learning on a single robot platform. But its fixed hardware, limited modalities, and static scope create gaps for production deployment. Compare BC-Z with Claru's commercial data collection service.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Compare", href: "/compare" },
    { label: "BC-Z Alternative", href: "/compare/bc-z-alternative" },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Is BC-Z?",
      paragraphs: [
        "BC-Z (Behavioral Cloning -- Zero-shot) is a dataset and research framework published by Jang, Devin, Vanhoucke, and Levine at Google (Everyday Robots) in 2022. The project investigated whether large-scale imitation learning could produce policies capable of zero-shot generalization to novel tasks. The answer was a qualified yes: by collecting 25,877 teleoperated episodes across 100 diverse manipulation tasks on a fleet of mobile manipulators, the researchers showed that a single convolutional neural network could follow natural language instructions for 24 previously unseen tasks with a 44% average success rate.",
        "Data collection involved 7 human operators teleoperating 12 Everyday Robots mobile manipulators via VR controllers, accumulating approximately 125 hours of robot interaction time. The operators also recorded 18,726 human video demonstrations of the same tasks to explore cross-embodiment transfer. Each episode captures RGB images from the robot's head-mounted camera, 7-DoF joint positions, gripper state, and a textual task description. The task vocabulary spans picking and placing objects, opening and closing drawers, wiping surfaces, and other tabletop and kitchen-counter manipulations.",
        "BC-Z was a landmark contribution to the scaling hypothesis in robot learning: more tasks and more data yield better generalization. It directly influenced subsequent work including RT-1 and RT-2, which scaled the same insight to even larger datasets and more capable architectures. The dataset is released under Apache 2.0, making it one of the more permissively licensed large-scale robot datasets available.",
        "Despite its significance, BC-Z remains a product of a specific research program at a specific point in time. The robots, environments, and tasks are fixed. The dataset provides no depth, force/torque, or tactile information. And while Apache 2.0 permits commercial use, teams deploying robots outside of Google's lab environments need data that matches their own hardware and deployment contexts.",
      ],
    },
    {
      type: "stats",
      heading: "BC-Z at a Glance",
      stats: [
        { value: "25,877", label: "Teleoperated Episodes" },
        { value: "100+", label: "Manipulation Tasks" },
        { value: "125 hrs", label: "Robot Interaction Time" },
        { value: "12", label: "Robots Used" },
        { value: "7", label: "Human Operators" },
        { value: "18,726", label: "Human Video Demos" },
      ],
    },
    {
      type: "comparison-table",
      heading: "BC-Z vs. Claru: Side-by-Side Comparison",
      description:
        "A detailed comparison across the dimensions that matter most when moving from zero-shot research to production deployment.",
      columns: ["Dimension", "BC-Z", "Claru"],
      rows: [
        {
          Dimension: "Data Source",
          "BC-Z": "VR-teleoperated on Google Everyday Robots",
          Claru: "Teleoperated on your physical robot",
        },
        {
          Dimension: "Scale",
          "BC-Z": "25,877 episodes across 100+ tasks",
          Claru: "1K to 1M+ episodes, scaled to your needs",
        },
        {
          Dimension: "Robot Platform",
          "BC-Z": "Google Everyday Robots mobile manipulator only",
          Claru: "Any robot platform you deploy",
        },
        {
          Dimension: "Camera Setup",
          "BC-Z": "Single head-mounted RGB camera",
          Claru: "Multi-view RGB + depth, configurable placement",
        },
        {
          Dimension: "Sensor Modalities",
          "BC-Z": "RGB images, 7-DoF joint positions, gripper state",
          Claru: "RGB + depth + force/torque + proprioception + tactile",
        },
        {
          Dimension: "Task Customization",
          "BC-Z": "Fixed 100+ tasks chosen by researchers",
          Claru: "Custom tasks designed for your deployment",
        },
        {
          Dimension: "Environment Diversity",
          "BC-Z": "Google lab kitchen-counter setups",
          Claru: "Real kitchens, warehouses, labs, factories",
        },
        {
          Dimension: "Language Annotations",
          "BC-Z": "Textual task descriptions per episode",
          Claru: "Free-form natural language with multi-annotator agreement",
        },
        {
          Dimension: "License",
          "BC-Z": "Apache 2.0",
          Claru: "Commercial license with IP assignment",
        },
        {
          Dimension: "Ongoing Collection",
          "BC-Z": "Static dataset (no new collection)",
          Claru: "Continuous collection and iterative expansion",
        },
      ],
    },
    {
      type: "prose",
      heading: "Key Limitations of BC-Z for Production Use",
      paragraphs: [
        "BC-Z's most significant production limitation is its single robot platform. All 25,877 episodes were collected on Google's Everyday Robots mobile manipulator -- a custom-built platform that is not commercially available. Teams deploying Franka Panda, UR5, Kuka iiwa, or any other arm cannot directly use BC-Z demonstrations for imitation learning, because the action space, kinematic chain, and sensor configuration do not transfer. Cross-embodiment methods exist but introduce their own performance gaps.",
        "The dataset captures only RGB images from a single head-mounted camera. There is no depth information, no wrist camera, no force/torque sensing, and no tactile feedback. For tasks requiring contact-rich manipulation -- insertion, assembly, packing, tool use -- the absence of haptic and force data means BC-Z cannot serve as a complete training signal. Modern visuomotor policies increasingly rely on multi-modal inputs that BC-Z does not provide.",
        "Environmental diversity is limited to Google's lab facilities. While the researchers varied objects and task configurations, the lighting conditions, backgrounds, counter surfaces, and spatial layouts all come from a controlled lab environment. Policies pretrained on BC-Z data may struggle in visually distinct deployment settings like warehouses, retail environments, or residential kitchens where lighting, clutter, and surface properties differ substantially.",
        "The 44% zero-shot success rate on unseen tasks, while impressive for research, is far below production requirements. Deployment-grade manipulation policies typically need 90%+ success rates on their target tasks. Achieving this requires domain-specific demonstrations collected in the actual deployment environment, not generalist pretraining data alone.",
        "Finally, BC-Z is a static dataset. There is no mechanism to request additional demonstrations for specific tasks, to expand coverage to new object categories, or to collect data in new environments. Production teams whose requirements evolve need a data source that can grow with them.",
      ],
    },
    {
      type: "prose",
      heading: "When to Use BC-Z vs. Commercial Data",
      paragraphs: [
        "BC-Z is the right choice when your goal is to study zero-shot task generalization or multi-task imitation learning. Its 100+ tasks with consistent data collection methodology provide a clean experimental substrate for comparing policy architectures, representation learning strategies, and language conditioning approaches. If you are publishing research on how well a model generalizes to novel instructions, BC-Z offers a well-understood baseline.",
        "BC-Z is also valuable as a pretraining dataset when your target robot shares kinematic similarity with the Everyday Robots platform. The broad task coverage can provide useful manipulation priors -- grasp poses, approach trajectories, object-centric attention patterns -- that transfer through fine-tuning. Several research groups have demonstrated that pretraining on diverse robot data, including BC-Z, improves downstream performance on target tasks.",
        "Switch to Claru when you have a specific robot, environment, and task set that must reach production reliability. If your deployment involves a Franka Panda in a warehouse, a UR10 on a manufacturing line, or a mobile manipulator in a hospital, you need demonstrations on that exact hardware in that exact context. Claru collects teleoperated data on your robot with the sensor suite you will use in production -- including depth, force/torque, and tactile streams that BC-Z lacks.",
        "The strongest results typically come from combining both: use BC-Z (or similar large-scale datasets) to build broad manipulation priors during pretraining, then fine-tune on Claru's domain-specific demonstrations to achieve the reliability and task coverage your deployment demands.",
      ],
    },
    {
      type: "prose",
      heading: "How Claru Complements BC-Z",
      paragraphs: [
        "Claru's data collection service fills the specific gaps that BC-Z leaves open. Where BC-Z provides 25,877 episodes on a proprietary Google robot, Claru deploys trained teleoperators to collect demonstrations on whatever physical robot you are actually shipping. This eliminates the cross-embodiment transfer problem -- the training data matches the deployment platform from day one.",
        "For teams that have built initial policies using BC-Z as a pretraining corpus, Claru provides the fine-tuning layer that closes the gap to production performance. Our demonstrations are collected at the resolution, frame rate, and sensor configuration your policy expects. We support multi-view camera setups with calibrated extrinsics, synchronized force/torque and tactile streams, and high-frequency proprioceptive logging that BC-Z does not capture.",
        "Claru also provides the environmental diversity that production requires. Rather than collecting all data in a single lab, we dispatch collection teams to environments that match your deployment targets -- warehouses, kitchens, retail floors, manufacturing cells. This environmental variation during training is what produces policies robust enough for real-world reliability targets.",
        "Data is delivered in your preferred format -- RLDS, HDF5, zarr, or LeRobot -- with standardized schemas compatible with the same training pipelines you use for BC-Z. Every demonstration passes our multi-stage quality control process, ensuring that the fine-tuning data is not only domain-appropriate but production-grade.",
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        {
          id: "jang-bcz-2022",
          title:
            "BC-Z: Zero-Shot Task Generalization with Robotic Imitation Learning",
          authors: "Jang et al.",
          venue: "CoRL 2021",
          year: 2022,
          url: "https://arxiv.org/abs/2202.02005",
        },
        {
          id: "brohan-rt1-2023",
          title:
            "RT-1: Robotics Transformer for Real-World Control at Scale",
          authors: "Brohan et al.",
          venue: "RSS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2212.06817",
        },
        {
          id: "oneill-oxe-2024",
          title:
            "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
          authors: "O'Neill et al.",
          venue: "ICRA 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2310.08864",
        },
        {
          id: "chi-diffusion-2023",
          title:
            "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
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
      question:
        "Is BC-Z suitable for training production robot policies?",
      answer:
        "BC-Z was designed for research on zero-shot task generalization, not as production training data. Its 25,877 episodes are collected on a proprietary Google robot that is not commercially available, and it captures only single-camera RGB with no depth or force/torque data. For production, you need demonstrations on your specific robot in your deployment environment, which is what Claru provides.",
    },
    {
      question: "Can I use BC-Z data commercially?",
      answer:
        "Yes. BC-Z is released under the Apache 2.0 license, which permits commercial use. The practical limitation is that the data is collected on Google's Everyday Robots platform, so the demonstrations may not transfer effectively to your target robot without substantial cross-embodiment adaptation.",
    },
    {
      question:
        "How does BC-Z's zero-shot generalization compare to production requirements?",
      answer:
        "BC-Z achieved a 44% success rate on 24 unseen tasks, which was a research milestone for zero-shot generalization. Production deployment typically requires 90%+ success rates on specific tasks. Closing this gap requires domain-specific demonstrations collected on your target hardware, which is where Claru's custom data collection service adds value.",
    },
    {
      question:
        "What is the best way to combine BC-Z with real-world data?",
      answer:
        "The most effective approach is pretrain-then-fine-tune. Use BC-Z (or Open X-Embodiment, which includes BC-Z) to pretrain broad manipulation priors, then fine-tune on Claru demonstrations collected on your specific robot platform in your deployment environment. This combination leverages BC-Z's task diversity while grounding the policy in your real-world conditions.",
    },
    {
      question: "Does Claru support the same tasks as BC-Z?",
      answer:
        "Claru does not replicate BC-Z's specific task definitions. Instead, we collect demonstrations for the real-world tasks your deployment actually requires -- pick-and-place, packing, assembly, tool use, or any custom manipulation task -- on your specific robot platform and in your actual deployment environment.",
    },
  ],
  ctaHeading: "Move Beyond Zero-Shot to Production-Ready",
  ctaDescription:
    "Get real-world demonstrations on your robot, in your environment, with the sensor modalities your policy needs. Talk to our team about bridging the gap from BC-Z research to production deployment.",
  relatedGlossaryTerms: [
    "cross-embodiment-data",
    "imitation-learning",
    "zero-shot-generalization",
    "rlds",
  ],
  relatedGuidePages: [
    "how-to-build-a-cross-embodiment-dataset",
    "how-to-evaluate-training-data-quality",
  ],
  relatedSolutionSlugs: ["vla-training-data"],
  datasetName: "BC-Z",
  academicProfile: {
    institution: "Google (Everyday Robots)",
    year: 2022,
    scale:
      "25,877 teleoperated episodes across 100+ tasks, 125 hours of robot interaction",
    license: "Apache 2.0",
    modalities: [
      "RGB images (head-mounted camera)",
      "7-DoF joint positions",
      "Gripper state",
      "Textual task descriptions",
    ],
  },
  limitations: [
    "Collected entirely on Google's proprietary Everyday Robots platform -- not commercially available hardware",
    "Single RGB camera with no depth, force/torque, or tactile data",
    "All environments are Google lab facilities with controlled lighting and backgrounds",
    "44% zero-shot success rate on unseen tasks -- far below production requirements",
    "No wrist-mounted camera for close-range manipulation feedback",
    "Static dataset with no mechanism for domain-specific expansion",
    "18,726 human video demos included but cross-embodiment transfer from these remains an open research challenge",
  ],
  claruAdvantages: [
    "Demonstrations collected on your physical robot platform -- no cross-embodiment gap",
    "Multi-view RGB + depth + force/torque + tactile sensor coverage",
    "Data from real deployment environments: warehouses, kitchens, factories, labs",
    "Scalable from hundreds to hundreds of thousands of demonstrations per task",
    "Free-form natural language annotations with multi-annotator agreement validation",
    "Commercial license with full IP assignment for production deployment",
    "Continuous collection that evolves with your task and environment requirements",
    "Production-grade QC pipeline with automated trajectory validation",
  ],
  keyPapers: [
    {
      id: "jang-bcz-2022",
      title:
        "BC-Z: Zero-Shot Task Generalization with Robotic Imitation Learning",
      authors: "Jang et al.",
      venue: "CoRL 2021",
      year: 2022,
      url: "https://arxiv.org/abs/2202.02005",
    },
    {
      id: "brohan-rt1-2023",
      title:
        "RT-1: Robotics Transformer for Real-World Control at Scale",
      authors: "Brohan et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2212.06817",
    },
    {
      id: "oneill-oxe-2024",
      title:
        "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
      authors: "O'Neill et al.",
      venue: "ICRA 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2310.08864",
    },
    {
      id: "chi-diffusion-2023",
      title:
        "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
      authors: "Chi et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2303.04137",
    },
  ],
  claruRelevance:
    "BC-Z was a foundational contribution to the scaling hypothesis in robot learning, demonstrating that collecting diverse teleoperated data across 100+ tasks on a single platform could produce meaningful zero-shot generalization to novel instructions. Its inclusion in the Open X-Embodiment dataset has made it a standard pretraining component for generalist robot policies. However, the transition from research to production reveals BC-Z's core constraint: it is data from a proprietary robot in a controlled lab. The Everyday Robots platform is not commercially available, the single RGB camera provides no depth or haptic information, and the lab environments do not represent the visual complexity of real deployment settings. Claru directly addresses these gaps by collecting teleoperated demonstrations on your actual robot hardware, in the environments where your system will operate, with the full sensor suite your policy requires. Teams that have validated their approach using BC-Z as a pretraining corpus can use Claru's real-world data for the critical fine-tuning phase that takes a generalist model to deployment-grade reliability. We deliver data in RLDS, HDF5, or LeRobot format with standardized observation and action schemas, making integration with Open X-Embodiment training pipelines straightforward. The result is a policy that inherits broad manipulation priors from BC-Z's task diversity while achieving the domain-specific performance that only real-world, hardware-matched training data can provide.",
};

export default data;
