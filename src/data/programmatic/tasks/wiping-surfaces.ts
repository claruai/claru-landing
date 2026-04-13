import type { TaskPageData } from "../types";

const data: TaskPageData = {
  slug: "wiping-surfaces",
  metaTitle: "Surface Wiping Training Data for Robotics | Claru",
  metaDescription:
    "Training data for robotic surface wiping: cleaning, polishing, and decontamination. Compliance-controlled trajectories with force modulation and coverage planning annotations.",
  primaryKeyword: "robotic wiping training data",
  secondaryKeywords: [
    "surface wiping dataset",
    "robot cleaning demonstrations",
    "wiping task training data",
    "compliance control manipulation data",
    "surface cleaning automation dataset",
    "force-controlled wiping data",
  ],
  canonicalPath: "/training-data/wiping-surfaces",
  h1: "Surface Wiping Training Data",
  heroSubtitle:
    "Surface wiping datasets for robotic cleaning and maintenance — compliance-controlled trajectories with force modulation, coverage planning annotations, and adaptive surface-following behaviors for training cleaning and polishing policies.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Training Data", href: "/training-data" },
    { label: "Wiping Surfaces", href: "/training-data/wiping-surfaces" },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Is Robotic Surface Wiping and Why Does Data Matter?",
      paragraphs: [
        "Surface wiping — moving a tool or end-effector across a surface while maintaining controlled contact force — is a core capability for service robots, cleaning automation, and industrial surface treatment. Unlike pick-and-place or assembly, wiping is a continuous-contact task where the robot must simultaneously control its position trajectory across the surface, regulate the normal force against the surface (typically 2-15 N), adapt to surface geometry variations (curved surfaces, edges, obstacles), and ensure complete coverage of the target area. This combination of force control, trajectory planning, and coverage reasoning makes wiping one of the most challenging everyday manipulation tasks for robots.",
        "The commercial opportunity for robotic wiping is substantial and growing. The professional cleaning services market exceeds $350 billion globally, with surface cleaning and sanitization representing the largest segment. The COVID-19 pandemic accelerated demand for automated disinfection, with the cleaning robot market growing 25% annually since 2020. Industrial surface treatment — including deburring, polishing, and coating inspection — represents an additional $8 billion market where consistent force-controlled surface contact is critical for quality. In all these applications, the key challenge is adapting the wiping motion to surface geometry and contamination patterns that vary between episodes.",
        "Force control during wiping is fundamentally different from the transient contacts in pick-and-place manipulation. A wiping robot must maintain sustained contact at a controlled force while moving along the surface, requiring real-time impedance or admittance control that adapts to surface compliance and geometry. Too little force fails to clean; too much force damages the surface or the tool. Research by Leidner et al. (2016) showed that human wiping patterns exhibit characteristic force modulation — higher force on stains, lower force on delicate areas, and smooth force transitions at surface edges — patterns that must be captured in training data for learned wiping policies to achieve human-quality cleaning.",
        "Current research on learned wiping policies demonstrates that demonstration data with force feedback dramatically outperforms position-only approaches. Borras et al. (2020) showed that impedance-learning from human demonstrations achieves 92% surface coverage compared to 65% for position-only policies on curved surfaces, because the force feedback enables adaptive surface following. Similarly, Do and Romero (2022) demonstrated that force-augmented behavioral cloning for table wiping achieves 3x better cleaning uniformity than vision-only policies, as the force signal directly encodes cleaning effectiveness.",
      ],
    },
    {
      type: "stats",
      heading: "Wiping Data by the Numbers",
      stats: [
        { value: "$350B+", label: "Global professional cleaning market" },
        { value: "2-15 N", label: "Typical contact force range for surface wiping" },
        { value: "92%", label: "Surface coverage with impedance-learned wiping" },
        { value: "25%", label: "Annual cleaning robot market growth (post-2020)" },
        { value: "3x", label: "Cleaning uniformity improvement with force data" },
        { value: "30+ Hz", label: "Force control loop rate for adaptive wiping" },
      ],
    },
    {
      type: "comparison-table",
      heading: "Data Requirements by Wiping Approach",
      description:
        "Wiping policies range from simple trajectory replay to adaptive force-controlled methods. Force data becomes essential for any approach deployed on real surfaces.",
      columns: [
        "Approach",
        "Data Volume",
        "Key Modalities",
        "Force Control",
        "Strengths",
      ],
      rows: [
        {
          Approach: "Position trajectory replay",
          "Data Volume": "50-200 demonstrated paths per surface",
          "Key Modalities": "RGB + end-effector pose",
          "Force Control": "Open-loop; no adaptation",
          Strengths: "Simple; works for flat, known surfaces",
        },
        {
          Approach: "Impedance learning from demos",
          "Data Volume": "100-500 demonstrations per surface type",
          "Key Modalities": "Force/torque + pose + surface geometry",
          "Force Control": "Learned impedance profile",
          Strengths: "Adapts to curved surfaces; consistent contact",
        },
        {
          Approach: "Diffusion Policy for wiping",
          "Data Volume": "200-1K demonstrations per task variant",
          "Key Modalities": "Multi-view RGB + force/torque + proprioception",
          "Force Control": "Implicit in multimodal action prediction",
          Strengths: "Handles diverse contamination patterns; adaptable",
        },
        {
          Approach: "RL with force reward shaping",
          "Data Volume": "50K+ episodes (sim) + 200 real demos",
          "Key Modalities": "Simulated contact + real force calibration",
          "Force Control": "Reward-shaped force regulation",
          Strengths: "Optimizes coverage and efficiency jointly",
        },
        {
          Approach: "Hybrid vision + force feedback",
          "Data Volume": "500-2K demonstrations with visual state",
          "Key Modalities": "RGB (contamination detection) + F/T + proprioception",
          "Force Control": "Vision-guided force modulation",
          Strengths: "Targets dirty areas; skips clean areas",
        },
      ],
    },
    {
      type: "prose",
      heading: "State of the Art in Learned Wiping Policies",
      paragraphs: [
        "Learning from Demonstration (LfD) for wiping has advanced significantly with the integration of force sensing. Leidner et al. (2016) demonstrated that wiping behaviors learned from kinesthetic teaching — where a human physically guides the robot arm through wiping motions — capture force modulation patterns that transfer across surface types. Their system learned to increase force on textured surfaces and reduce force near edges, achieving 88% cleaning effectiveness on untrained surfaces compared to 71% for uniform-force wiping. The key was recording 6-axis force/torque data at 500 Hz alongside end-effector trajectories, enabling the policy to learn the relationship between surface contact state and appropriate force response.",
        "For coverage planning, Hess et al. (2012) formulated wiping as a coverage path planning problem, generating boustrophedon (back-and-forth) paths that guarantee complete coverage of bounded regions. However, real wiping requires adapting the path online based on cleaning progress — some areas need multiple passes while others need only one. Reinforcement learning approaches by Kim et al. (2021) address this by training coverage policies that observe partially cleaned surfaces and decide where to wipe next, achieving 95% coverage in 30% less time than fixed-pattern wiping by avoiding unnecessary re-wiping of already-clean areas.",
        "Contact-rich policy learning architectures have shown particular promise for wiping. ACT (Zhao et al., 2023) applied to wiping tasks achieves smooth, continuous wiping trajectories without the jerky transitions common in frame-by-frame behavioral cloning. The action chunking approach predicts 10-50 timestep action sequences, naturally producing the smooth arcing motions characteristic of effective wiping. On a table-cleaning benchmark, ACT achieved 94% surface coverage with uniform cleaning pressure, compared to 78% for standard BC which produces discontinuous wipe paths with force spikes at trajectory segment boundaries.",
        "The integration of contamination detection with wiping execution represents the most recent advance. Using RGB cameras to identify contamination (stains, dust, residue) and force sensors to verify cleaning effectiveness, hybrid policies can achieve targeted cleaning that adapts the wiping strategy to the specific contamination type and distribution. Guo et al. (2023) demonstrated a VLM-guided wiping system that interprets natural language cleaning instructions ('wipe the coffee stain near the edge of the table') and generates contamination-aware wiping trajectories, achieving 82% first-attempt cleaning success on specified targets.",
      ],
    },
    {
      type: "prose",
      heading: "Collection Methodology for Wiping Data",
      paragraphs: [
        "Wiping data collection requires force-instrumented end-effectors and surfaces with measurable contamination. The minimum setup includes a 6-axis force/torque sensor at the robot wrist (ATI Mini45 or Robotiq FT-300, recording at 500 Hz), an overhead RGB camera for surface state observation, and a wiping tool holder (sponge, cloth, or squeegee attachment at the end-effector). For contamination detection studies, prepare surfaces with controlled contamination: food-grade stains (ketchup, coffee), dust simulants (talcum powder), or UV-fluorescent markers that enable quantitative cleaning assessment under black light.",
        "Kinesthetic teaching is the preferred demonstration method for wiping because it naturally captures the force modulation patterns that define effective cleaning. The operator grasps the robot arm (in gravity-compensation mode) and performs wiping motions while the system records the full state: end-effector pose (6-DoF at 100 Hz), wrist force/torque (6-axis at 500 Hz), tool contact state, and surface image (30 Hz from overhead camera). Each demonstration covers one complete cleaning episode: initial surface scan, wiping execution with adaptive force, verification scan, and optional re-wiping of missed areas.",
        "Annotation requirements for wiping datasets include: surface type and geometry (flat, curved, edged), contamination type and initial distribution (annotated in pre-wiping image), wiping tool type and condition, force profile characterization (mean force, force variance, peak force), coverage percentage achieved (measured from pre/post comparison or UV inspection), wiping pattern classification (linear, circular, boustrophedon, targeted), and per-stroke annotations for multi-stroke cleaning episodes. For force-controlled policies, annotate the relationship between surface normal direction and applied force — this is critical for curved surface wiping where the force direction must continuously adapt.",
        "For diverse wiping data, collect across multiple surface types (flat table, curved bowl, textured countertop, glass window), multiple contamination types (wet stains, dry particles, greasy films), and multiple wiping tools (sponge for absorption, cloth for polishing, squeegee for liquid). Each surface-contamination-tool combination produces different optimal wiping strategies. Plan for 100-200 demonstrations per combination, with 50% clean-to-clean demonstrations (maintenance wiping) and 50% contaminated-to-clean demonstrations (deep cleaning). Include edge cases: stubborn stains requiring multiple passes, delicate surfaces requiring gentle force, and obstacles on the surface requiring path adaptation.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Key Datasets and Benchmarks for Robotic Wiping",
      description:
        "Wiping-specific datasets are relatively scarce. Most wiping research uses custom data collection, creating an opportunity for standardized wiping datasets.",
      columns: [
        "Dataset / Benchmark",
        "Year",
        "Scale",
        "Surface Types",
        "Key Features",
        "Limitations",
      ],
      rows: [
        {
          "Dataset / Benchmark": "Leidner et al. wiping LfD",
          Year: "2016",
          Scale: "50-100 demonstrations per surface",
          "Surface Types": "Flat table, curved surfaces",
          "Key Features": "Force-augmented kinesthetic teaching; impedance learning",
          Limitations: "Small scale; single robot platform",
        },
        {
          "Dataset / Benchmark": "RoboCasa cleaning tasks",
          Year: "2024",
          Scale: "500+ trajectories across cleaning subtasks",
          "Surface Types": "Kitchen counters, stovetops, tables",
          "Key Features": "Full household context; diverse cleaning tools",
          Limitations: "Simulation-based; no force data",
        },
        {
          "Dataset / Benchmark": "LIBERO wiping subtask",
          Year: "2023",
          Scale: "50 demonstrations",
          "Surface Types": "Tabletop simulation",
          "Key Features": "Part of lifelong learning benchmark",
          Limitations: "Single surface; limited scale",
        },
        {
          "Dataset / Benchmark": "Open X-Embodiment wiping tasks",
          Year: "2023",
          Scale: "Subset of 970K total episodes",
          "Surface Types": "Various tabletop surfaces",
          "Key Features": "Cross-embodiment; real-world data",
          Limitations: "Wiping is minor subset; inconsistent annotations",
        },
        {
          "Dataset / Benchmark": "DROID cleaning demonstrations",
          Year: "2024",
          Scale: "Subset of 76K total episodes",
          "Surface Types": "Household surfaces across 564 scenes",
          "Key Features": "Multi-site; diverse real environments",
          Limitations: "Not wiping-specific; no force annotations",
        },
      ],
    },
    {
      type: "prose",
      heading: "How Claru Supports Wiping Data Needs",
      paragraphs: [
        "Claru provides wiping data collection with force-instrumented end-effectors designed specifically for continuous-contact manipulation tasks. Each station features a 6-axis ATI Mini45 force/torque sensor at the wrist (0.01 N resolution, 500 Hz), interchangeable wiping tool holders (sponge, cloth, squeegee), overhead RGB-D cameras for surface state monitoring, and calibrated test surfaces spanning flat, curved, and textured geometries. We support kinesthetic teaching for high-fidelity force-modulated demonstrations and bilateral teleoperation for less accessible workspaces.",
        "Our operators are trained on wiping protocols that emphasize consistent force application, complete coverage, and adaptive wiping strategies. Each demonstration captures the full cleaning episode from initial surface assessment through wiping execution to verification, annotated with force profiles, coverage metrics, contamination type, and wiping pattern classification. We prepare surfaces with controlled contamination (food stains, dust, grease) and use UV-fluorescent markers for quantitative cleaning assessment.",
        "Claru delivers wiping datasets with continuous force/torque profiles at 500 Hz, synchronized end-effector trajectories at 100 Hz, overhead surface state images at 30 Hz, per-stroke force statistics, and coverage percentage measurements. Data is formatted for impedance learning, Diffusion Policy, ACT, or custom force-controlled architectures. Our throughput of 100-300 complete wiping demonstrations per day per station enables the 500-2,000 demonstration datasets that adaptive wiping policies require across multiple surface-contamination-tool combinations.",
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        {
          id: "leidner-wiping-2016",
          title: "Things Are Made for What They Are: Solving Manipulation Tasks by Using Functional Object Classes",
          authors: "Leidner et al.",
          venue: "Humanoids 2016",
          year: 2016,
          url: "https://doi.org/10.1109/HUMANOIDS.2016.7803355",
        },
        {
          id: "borras-wiping-2020",
          title: "A Compliant Robotic System for Surface Finishing Through Learning from Demonstration",
          authors: "Borras et al.",
          venue: "ICRA 2020",
          year: 2020,
          url: "https://doi.org/10.1109/ICRA40945.2020.9197527",
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
          id: "hess-coverage-2012",
          title: "Poisson-Disk Surface Cleaning",
          authors: "Hess et al.",
          venue: "IROS 2012",
          year: 2012,
          url: "https://doi.org/10.1109/IROS.2012.6386147",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "Is force/torque data essential for wiping demonstrations?",
      answer:
        "Yes, force data provides a 27-percentage-point improvement in surface coverage (92% vs 65%) compared to position-only demonstrations on curved surfaces. Force feedback is what distinguishes effective wiping from surface-scratching or air-wiping. At minimum, record wrist force/torque at 500 Hz. If budget is constrained, joint torque data from the robot arm provides a coarse force proxy at no additional hardware cost, though it cannot distinguish contact forces from gravity compensation torques without careful calibration.",
    },
    {
      question: "How many wiping demonstrations are needed?",
      answer:
        "For a single surface type with one wiping tool, 100-200 demonstrations produce a policy with 85%+ coverage. For multi-surface generalization (flat, curved, textured), 200-500 demonstrations per surface type are recommended. Each demonstration should cover one complete cleaning episode (30-120 seconds). Include 20% of demonstrations on already-clean surfaces to teach the policy when to stop wiping. For contamination-adaptive policies that modulate force based on stain type, add 50-100 demonstrations per contamination category.",
    },
    {
      question: "How do you measure cleaning effectiveness in training data?",
      answer:
        "Three approaches in decreasing precision: (1) UV-fluorescent contamination with blacklight imaging provides quantitative pixel-level cleaning assessment. (2) Before/after RGB comparison with contamination detection models gives 85-90% measurement accuracy. (3) Force-based proxy — sustained contact above 5 N for the required duration correlates with cleaning effectiveness at 80% accuracy. We recommend UV-fluorescent methods for high-quality datasets and RGB comparison for large-scale collection where UV setup is impractical.",
    },
    {
      question: "Can wiping policies transfer across different surfaces?",
      answer:
        "Transfer depends heavily on whether force feedback is in the loop. Position-only wiping policies transfer poorly (40-50% coverage on new surfaces) because the required trajectory changes with surface geometry. Force-controlled policies transfer much better (70-80%) because the force feedback provides online adaptation to surface curvature and compliance. Include at least 3 distinct surface types in training data (flat, gently curved, sharply curved/edged) for reasonable generalization. Material-specific adaptation requires additional demonstrations per material category.",
    },
  ],
  ctaHeading: "Get a Custom Quote for Surface Wiping Data",
  ctaDescription:
    "Describe your cleaning application — surface types, contamination types, and required cleaning standards — and we will design a force-instrumented data collection plan.",
  relatedGlossaryTerms: [
    "force-torque-data",
    "contact-rich-manipulation",
    "manipulation-trajectory",
    "behavioral-cloning",
    "proprioceptive-data",
  ],
  relatedGuidePages: [
    "how-to-build-a-contact-rich-manipulation-dataset",
    "how-to-label-robot-demonstrations",
  ],
  relatedSolutionSlugs: [],
  dataRequirements: {
    modality: "RGB + 6-axis force/torque + end-effector pose + surface geometry",
    volumeRange: "500-2,000 complete wiping demonstrations across surface types",
    temporalResolution: "30 Hz video, 500 Hz force/torque, 100 Hz end-effector pose",
    keyAnnotations: [
      "Continuous force/torque profile with surface normal decomposition",
      "Surface type and geometry classification",
      "Contamination type and initial/final distribution",
      "Coverage percentage (UV or image-based measurement)",
      "Wiping pattern classification per stroke",
      "Tool type and condition annotations",
    ],
  },
  relevantModels: [
    "Impedance learning from demonstrations",
    "Diffusion Policy",
    "ACT / ALOHA",
    "Force-controlled RL policies",
    "Coverage path planners",
    "VLM-guided cleaning systems",
  ],
  environmentTypes: [
    "Kitchen countertop",
    "Hospital disinfection surface",
    "Industrial polishing station",
    "Office desk cleaning",
    "Automotive surface treatment",
    "Window cleaning workspace",
  ],
  keyPapers: [
    {
      id: "leidner-wiping-2016",
      title: "Things Are Made for What They Are: Solving Manipulation Tasks by Using Functional Object Classes",
      authors: "Leidner et al.",
      venue: "Humanoids 2016",
      year: 2016,
      url: "https://doi.org/10.1109/HUMANOIDS.2016.7803355",
    },
    {
      id: "borras-wiping-2020",
      title: "A Compliant Robotic System for Surface Finishing Through Learning from Demonstration",
      authors: "Borras et al.",
      venue: "ICRA 2020",
      year: 2020,
      url: "https://doi.org/10.1109/ICRA40945.2020.9197527",
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
  ],
  claruRelevance:
    "Claru provides wiping data collection with force-instrumented workstations purpose-built for continuous-contact manipulation. Each station features a 6-axis ATI Mini45 force/torque sensor (0.01 N resolution, 500 Hz), interchangeable tool holders, overhead RGB-D for surface monitoring, and calibrated test surfaces (flat, curved, textured). We support kinesthetic teaching for natural force-modulated demonstrations and prepare surfaces with controlled contamination for quantitative cleaning assessment via UV-fluorescent marking. Operators follow wiping protocols emphasizing consistent force, complete coverage, and adaptive strategies. Deliverables include 500 Hz force profiles, 100 Hz end-effector trajectories, 30 Hz surface images, per-stroke annotations, and coverage measurements — formatted for impedance learning, Diffusion Policy, ACT, or custom force-controlled architectures. Throughput of 100-300 demonstrations/day/station enables rapid scaling across surface-contamination-tool combinations.",
};

export default data;
