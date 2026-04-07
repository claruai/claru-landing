import type { TaskPageData } from "../types";

const data: TaskPageData = {
  slug: "assembly",
  metaTitle: "Assembly Task Training Data for Robotics | Claru",
  metaDescription:
    "Training data for robotic assembly: part insertion, screw driving, connector mating. Precision manipulation demonstrations with force-guided assembly sequences.",
  primaryKeyword: "robotic assembly training data",
  secondaryKeywords: [
    "assembly task dataset",
    "robot assembly demonstrations",
    "precision assembly data",
    "peg-in-hole training data",
    "force-guided assembly",
    "industrial robot assembly dataset",
  ],
  canonicalPath: "/training-data/assembly",
  h1: "Assembly Task Training Data",
  heroSubtitle:
    "Precision assembly datasets for industrial robotics — peg-in-hole insertion, screw driving, connector mating, and multi-part assembly sequences with force/torque feedback and sub-millimeter accuracy.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Training Data", href: "/training-data" },
    { label: "Assembly Task", href: "/training-data/assembly" },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Is Robotic Assembly and Why Does Data Matter?",
      paragraphs: [
        "Assembly tasks push manipulation precision to its absolute limits. Inserting a USB-C connector demands 0.1 mm positional accuracy and 0.5-degree angular tolerance — an order of magnitude tighter than typical pick-and-place operations. Screw driving requires coordinated rotation under sustained axial force with real-time torque monitoring to detect cross-threading. Snap-fit connector mating involves non-linear force profiles where a 2 N push suddenly drops to near-zero as the latch engages. These tight-tolerance, contact-rich behaviors cannot be captured by vision alone, making high-fidelity demonstration data with force/torque feedback essential for learning assembly policies.",
        "Industrial assembly represents one of the largest commercial opportunities for robot learning. The International Federation of Robotics reports that automotive and electronics manufacturing account for over 60% of global robot installations, yet most assembly operations still rely on hand-coded trajectories that must be reprogrammed for every product variant. A single automotive model change can require 6-12 months of reprogramming across hundreds of stations. Learning-based assembly policies that generalize across part variations from demonstration data could compress this timeline to days, making high-mix low-volume production economically viable for the first time.",
        "The fundamental data challenge in assembly is that success depends on force-guided search strategies during the contact phase. When a peg approaches a hole with positional uncertainty, the robot must detect initial contact, apply lateral search motions guided by contact force direction, and then execute a controlled insertion. Inoue et al. (2017) showed that these force-guided search patterns account for 60-80% of total assembly time in tight-tolerance tasks. Without force/torque data in the demonstrations, the policy learns only the approach trajectory and fails at the critical contact phase.",
        "Research has demonstrated conclusively that multimodal data dramatically improves assembly policy performance. Chi et al. (2023) showed that Diffusion Policy with force feedback achieves 95% success on peg-in-hole insertion versus 55% for vision-only policies — a 40-percentage-point improvement. Lee et al. (2020) demonstrated that learned multimodal representations combining vision and tactile sensing achieve 85% success on contact-rich tasks where vision-only policies plateau at 45%. These results establish force/torque data as non-optional for assembly training datasets.",
      ],
    },
    {
      type: "stats",
      heading: "Assembly Data by the Numbers",
      stats: [
        { value: "0.1 mm", label: "Positional accuracy for USB-C insertion" },
        { value: "500 Hz", label: "Minimum force/torque sample rate" },
        { value: "95%", label: "Diffusion Policy success rate with force data" },
        { value: "40 pp", label: "Success improvement from adding force modality" },
        { value: "100-500", label: "Demos per single-part insertion task" },
        { value: "6-axis", label: "Force/torque DOF required at wrist" },
      ],
    },
    {
      type: "comparison-table",
      heading: "Data Requirements by Learning Approach",
      description:
        "Different learning methods for assembly have distinct data requirements. This comparison helps you plan data collection based on your chosen policy architecture.",
      columns: [
        "Approach",
        "Data Volume",
        "Key Modalities",
        "Force Data Required",
        "Strengths",
      ],
      rows: [
        {
          Approach: "Behavioral Cloning (BC)",
          "Data Volume": "100-500 demos per task",
          "Key Modalities": "RGB + proprioception + force/torque",
          "Force Data Required": "Yes (critical)",
          Strengths: "Simple pipeline; works for single-variant assembly",
        },
        {
          Approach: "Diffusion Policy",
          "Data Volume": "50-200 demos per task",
          "Key Modalities": "RGB + force/torque + proprioception",
          "Force Data Required": "Yes (40% improvement)",
          Strengths: "Handles multimodal action distributions; best for tight tolerance",
        },
        {
          Approach: "Residual RL (pretrain BC + RL fine-tune)",
          "Data Volume": "50-100 demos + 10K RL episodes",
          "Key Modalities": "Force/torque + proprioception",
          "Force Data Required": "Yes (essential for reward shaping)",
          Strengths: "Adapts to part variation; recovers from imprecise demos",
        },
        {
          Approach: "Sim-to-Real Transfer",
          "Data Volume": "1M+ sim episodes + 50-200 real demos",
          "Key Modalities": "Simulated force + real force/torque for calibration",
          "Force Data Required": "Yes (sim force calibration)",
          Strengths: "Scalable; handles diverse part geometries",
        },
        {
          Approach: "Compliance Control Learning",
          "Data Volume": "200-1K force profiles per task",
          "Key Modalities": "Force/torque + joint torque + stiffness parameters",
          "Force Data Required": "Primary modality",
          Strengths: "Learns variable impedance; safest for delicate parts",
        },
      ],
    },
    {
      type: "prose",
      heading: "State of the Art in Learned Assembly",
      paragraphs: [
        "Diffusion Policy (Chi et al., 2023) has emerged as the leading architecture for contact-rich assembly tasks. On the NIST gear insertion benchmark — a standardized peg-in-hole task with 0.2 mm clearance — Diffusion Policy achieves 95.8% success over 120 consecutive trials when trained with 200 demonstrations containing wrist-mounted force/torque data at 500 Hz. The policy learns a multimodal action distribution that naturally encodes the spiral search pattern human operators use during insertion, without any explicit search heuristic.",
        "TAX-Pose (Eisner et al., 2022) takes a different approach by learning SE(3) relative placement transformations between parts. Given a single demonstration of how two parts fit together, TAX-Pose predicts the 6-DoF pose transformation to achieve assembly from a novel initial configuration. On the NIST gear assembly benchmark, TAX-Pose achieves 89% success with just one demonstration, making it extremely data-efficient for rigid-body assembly where the contact geometry is well-defined. However, it struggles with compliant parts and multi-step assembly sequences.",
        "For multi-step assembly, IndustReal (Tang et al., 2023) demonstrated sim-to-real transfer for sequential insertion tasks on the NIST Task Board. Trained entirely in IsaacGym simulation with domain randomization over part dimensions, surface friction, and sensor noise, IndustReal achieved 91% success on a 4-part assembly sequence in the real world. The critical insight was that force-based reward shaping in simulation (rewarding insertion force profiles that match real data) reduced the sim-to-real gap from 35% to 8%.",
        "Compliant manipulation learning has also advanced significantly. Luo et al. (2024) demonstrated learned impedance control for cable routing and connector insertion, achieving 87% first-try success on USB-A insertion — a task with 0.3 mm tolerance and asymmetric friction. The key was training on demonstrations that explicitly captured the operator's stiffness modulation: loose compliance during search, increasing stiffness during alignment, and firm compliance during final insertion. This work highlights that assembly data must capture not just positions and forces, but the underlying control strategy.",
      ],
    },
    {
      type: "prose",
      heading: "Collection Methodology for Assembly Data",
      paragraphs: [
        "Assembly data collection demands precision fixturing and calibration beyond standard manipulation setups. The workspace must be instrumented with a 6-axis force/torque sensor (typically ATI Mini45 or Robotiq FT-300) mounted at the wrist, recording at 500+ Hz to capture the fast force transients during contact and insertion events. The ATI Mini45 provides 0.01 N force resolution and 0.0005 Nm torque resolution — sufficient for detecting the subtle contact forces during initial part alignment. Part poses must be tracked to sub-millimeter accuracy using fiducial markers, precision fixture plates, or high-resolution depth sensors.",
        "Teleoperation for assembly requires specialized interfaces that preserve the operator's force sensitivity. Direct kinesthetic teaching — where the operator physically guides the robot through the assembly motion — produces the highest-quality force profiles because the operator naturally applies the compliant search strategies needed for tight-tolerance insertion. However, kinesthetic teaching is limited to accessible workspaces and requires the robot to be in gravity-compensation mode. For less accessible assemblies, bilateral teleoperation with force feedback provides the operator with haptic sensation of contact forces, enabling natural insertion behavior even when the robot is in a different room.",
        "Each assembly demonstration should capture the complete sequence: part acquisition from a known fixture or feeder, alignment approach, initial contact detection, force-guided search and alignment, controlled insertion or mating, and success verification (typically a force signature or visual confirmation). Annotations must include assembly phase boundaries (approach, contact, search, insertion, verification), force profile characteristics (peak insertion force, compliance regions, friction transitions), part state labels (free, in-contact, partially-inserted, fully-mated), and binary success/failure with failure mode classification (misalignment, cross-threading, excessive force, dropped part).",
        "For multi-part assemblies, the dataset must capture the dependency graph of part ordering constraints and the geometric accessibility constraints that determine feasible assembly sequences. A four-part gear train assembly, for example, has a strict ordering (shaft, then gear 1, then spacer, then gear 2) but each step has its own alignment challenge. Demonstrations should cover both the nominal assembly sequence and recovery from common failure states (partial insertion, dropped part, misaligned fixture).",
      ],
    },
    {
      type: "comparison-table",
      heading: "Key Datasets for Robotic Assembly",
      description:
        "Public assembly datasets vary significantly in scale, modality coverage, and task complexity. This comparison helps identify gaps your custom dataset needs to fill.",
      columns: [
        "Dataset",
        "Year",
        "Scale",
        "Modalities",
        "Task Types",
        "Tolerance Range",
      ],
      rows: [
        {
          Dataset: "NIST Task Board (Tang et al.)",
          Year: "2023",
          Scale: "4 task variants, ~1K episodes",
          Modalities: "RGB + F/T + proprioception",
          "Task Types": "Peg-in-hole, gear insertion, connector mating",
          "Tolerance Range": "0.2-1.0 mm",
        },
        {
          Dataset: "IndustReal (Narang et al.)",
          Year: "2023",
          Scale: "3 assembly types, sim + 200 real episodes",
          Modalities: "RGB-D + F/T + proprioception",
          "Task Types": "Peg insertion, gear meshing, connector plug",
          "Tolerance Range": "0.1-0.5 mm",
        },
        {
          Dataset: "FMB (Luo et al.)",
          Year: "2024",
          Scale: "22K demos across 4 task families",
          Modalities: "Multi-view RGB + wrist F/T + proprioception",
          "Task Types": "Single-object insertion with shape variation",
          "Tolerance Range": "0.5-2.0 mm",
        },
        {
          Dataset: "ManiSkill2 Assembly",
          Year: "2023",
          Scale: "100K+ sim episodes, limited real",
          Modalities: "RGB-D + F/T (simulated) + proprioception",
          "Task Types": "Peg-in-hole, gear assembly, plug insertion",
          "Tolerance Range": "0.3-1.5 mm (sim)",
        },
        {
          Dataset: "RoboCasa Assembly",
          Year: "2024",
          Scale: "5K trajectories across household assembly",
          Modalities: "RGB + proprioception (no F/T)",
          "Task Types": "Furniture assembly subtasks, loose-tolerance",
          "Tolerance Range": "1-5 mm",
        },
      ],
    },
    {
      type: "prose",
      heading: "How Claru Supports Assembly Data Needs",
      paragraphs: [
        "Claru provides end-to-end assembly data collection with precision-instrumented workstations designed specifically for tight-tolerance manipulation tasks. Each station is equipped with a 6-axis ATI Mini45 force/torque sensor at the wrist (0.01 N resolution, 500 Hz), calibrated multi-view cameras (2 fixed third-person + 1 wrist-mounted, 30 Hz synchronized), and precision fixture plates with sub-millimeter repeatability. Our stations support both kinesthetic teaching and bilateral teleoperation with force feedback, allowing operators to choose the interface that produces the highest-quality demonstrations for each assembly type.",
        "Our operators are trained on manufacturing assembly procedures with real production parts supplied by clients. Each operator completes a qualification protocol that verifies they can achieve target success rates (80%+) on the client's specific assembly tasks before production data collection begins. Operators work in 30-minute collection sessions with mandatory breaks to prevent fatigue-induced quality degradation — a critical consideration for precision tasks where sub-millimeter accuracy matters.",
        "Claru delivers assembly datasets with complete force profiles (raw 500 Hz + filtered 50 Hz), phase segmentation (approach, contact, search, insertion, verification), part state annotations, and success criteria aligned to industrial quality standards. We format data for direct ingestion by Diffusion Policy, ACT, or custom architectures, and provide per-demonstration quality scores based on insertion force smoothness, trajectory efficiency, and success repeatability. For clients requiring sim-to-real calibration data, we provide real force profiles paired with part geometry measurements to calibrate simulation contact parameters.",
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        {
          id: "chi-diffusion-2023",
          title:
            "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
          authors: "Chi et al.",
          venue: "RSS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2303.04137",
        },
        {
          id: "lee-multimodal-2020",
          title:
            "Making Sense of Vision and Touch: Learning Multimodal Representations for Contact-Rich Tasks",
          authors: "Lee et al.",
          venue: "ICRA 2020",
          year: 2020,
          url: "https://arxiv.org/abs/1907.13098",
        },
        {
          id: "eisner-taxpose-2022",
          title:
            "FlowBot3D: Learning 3D Articulation Flow to Manipulate Articulated Objects",
          authors: "Eisner et al.",
          venue: "RSS 2022",
          year: 2022,
          url: "https://arxiv.org/abs/2205.04382",
        },
        {
          id: "tang-industreal-2023",
          title:
            "IndustReal: Transferring Contact-Rich Assembly Tasks from Simulation to Reality",
          authors: "Tang et al.",
          venue: "RSS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2305.17110",
        },
        {
          id: "luo-fmb-2024",
          title:
            "FMB: a Functional Manipulation Benchmark for Generalizable Robotic Learning",
          authors: "Luo et al.",
          venue: "ICRA 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2401.08553",
        },
        {
          id: "narang-factory-2022",
          title:
            "Factory: Fast Contact for Robotic Assembly",
          authors: "Narang et al.",
          venue: "RSS 2022",
          year: 2022,
          url: "https://arxiv.org/abs/2205.03532",
        },
      ],
    },
  ],
  faqs: [
    {
      question:
        "What force/torque sensor resolution is needed for assembly data?",
      answer:
        "A minimum resolution of 0.01 N for force and 0.001 Nm for torque is needed for tight-tolerance assembly with clearances under 0.5 mm. The ATI Mini45 and Robotiq FT-300 both meet this specification. Sample at 500 Hz minimum to capture insertion force transients that typically last 10-50 ms. For sub-0.1 mm tolerance tasks (microelectronics assembly), consider the ATI Nano17 with 0.003 N resolution at 1000 Hz.",
    },
    {
      question:
        "How many demonstrations per assembly type are sufficient?",
      answer:
        "For single-part insertion tasks (peg-in-hole, connector mating), 100-500 demonstrations with Diffusion Policy typically achieve 80%+ success rates. TAX-Pose can achieve 89% with as few as 1-10 demonstrations for rigid-body assembly with clear geometric constraints. For multi-part assembly sequences with ordering dependencies, 500-2,000 demonstrations covering assembly order variations and part presentation variations are recommended. Start with your highest-value assembly task and 50 demonstrations to validate the pipeline before scaling.",
    },
    {
      question:
        "Can assembly data be collected without force/torque sensors?",
      answer:
        "Position-only demonstrations can work for loose-tolerance assembly where clearance exceeds 1 mm (such as placing parts in large fixtures), but consistently fail for tight-tolerance tasks. Force/torque data adds a 40-percentage-point success rate improvement for sub-millimeter assembly according to Diffusion Policy ablation studies. If budget is limited, record gripper motor current as a proxy for contact forces — it provides coarse force estimation at no additional hardware cost, though it cannot distinguish force directions.",
    },
    {
      question:
        "How do you handle part variation in assembly datasets?",
      answer:
        "Collect demonstrations across 3-5 part variations per assembly type, spanning the dimensional tolerance range specified in the part drawing. Include both nominal parts and edge-of-tolerance specimens (largest and smallest within spec). Annotate each demonstration with the specific part variant ID and measured dimensions. For learning generalizable insertion policies, the dataset should include at least 20% of demonstrations with intentionally offset initial poses to teach the policy robust alignment strategies.",
    },
    {
      question:
        "What is the difference between peg-in-hole and real industrial assembly?",
      answer:
        "Peg-in-hole is a simplified proxy for assembly research — cylindrical symmetry, uniform clearance, rigid parts. Real industrial assembly involves asymmetric parts (USB connectors have specific orientation), variable compliance (rubber grommets deform during insertion), multi-step sequences (install gasket, then bolt, then torque to spec), and quality verification (torque-to-yield, visual inspection). Training data for production assembly must capture these complexities, not just the insertion primitive.",
    },
  ],
  ctaHeading: "Get a Custom Quote for Assembly Task Data",
  ctaDescription:
    "Tell us about your assembly tasks — part types, tolerances, and production volumes — and we will design a data collection plan matched to your specific requirements.",
  relatedGlossaryTerms: [
    "contact-rich-manipulation",
    "manipulation-trajectory",
    "proprioceptive-data",
    "force-torque-data",
    "behavioral-cloning",
  ],
  relatedGuidePages: [
    "how-to-build-a-contact-rich-manipulation-dataset",
    "how-to-label-robot-demonstrations",
  ],
  relatedSolutionSlugs: [],
  dataRequirements: {
    modality: "RGB + depth + 6-axis force/torque + proprioception + CAD models",
    volumeRange: "100-2,000 demonstrations per assembly type",
    temporalResolution:
      "30 Hz video, 500 Hz force/torque, 100 Hz proprioception",
    keyAnnotations: [
      "Assembly phase segmentation (approach, contact, search, insertion, verification)",
      "Force profile annotations (peak force, compliance region, friction transitions)",
      "Part alignment labels (offset magnitude, angular error)",
      "Success/failure with failure mode classification",
      "Contact state transitions (free, in-contact, partially-inserted, fully-mated)",
      "Part variant ID and measured dimensions",
    ],
  },
  relevantModels: [
    "Diffusion Policy",
    "TAX-Pose",
    "IndustReal",
    "ACT/ALOHA",
    "Residual RL policies",
    "Learned impedance control",
  ],
  environmentTypes: [
    "Electronics assembly line",
    "Automotive assembly station",
    "Precision manufacturing cell",
    "NIST Task Board benchmark",
    "Cleanroom assembly",
    "Laboratory workbench",
  ],
  keyPapers: [
    {
      id: "chi-diffusion-2023",
      title:
        "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
      authors: "Chi et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2303.04137",
    },
    {
      id: "lee-multimodal-2020",
      title:
        "Making Sense of Vision and Touch: Learning Multimodal Representations for Contact-Rich Tasks",
      authors: "Lee et al.",
      venue: "ICRA 2020",
      year: 2020,
      url: "https://arxiv.org/abs/1907.13098",
    },
    {
      id: "tang-industreal-2023",
      title:
        "IndustReal: Transferring Contact-Rich Assembly Tasks from Simulation to Reality",
      authors: "Tang et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2305.17110",
    },
    {
      id: "luo-fmb-2024",
      title:
        "FMB: a Functional Manipulation Benchmark for Generalizable Robotic Learning",
      authors: "Luo et al.",
      venue: "ICRA 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2401.08553",
    },
    {
      id: "narang-factory-2022",
      title: "Factory: Fast Contact for Robotic Assembly",
      authors: "Narang et al.",
      venue: "RSS 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2205.03532",
    },
  ],
  claruRelevance:
    "Claru provides assembly task data collection with precision-instrumented workstations purpose-built for tight-tolerance manipulation. Each station features a 6-axis ATI Mini45 force/torque sensor at the wrist recording at 500 Hz with 0.01 N resolution, synchronized multi-view cameras (2 fixed + 1 wrist-mounted at 30 Hz), and precision fixture plates with sub-millimeter repeatability. Our operators are trained on actual client assembly procedures using real production parts, completing a qualification protocol before data collection begins. We support both kinesthetic teaching for optimal force profiles and bilateral teleoperation with haptic feedback for less accessible assemblies. Delivered datasets include complete force profiles, assembly phase segmentation, part state annotations, failure mode labels, and per-demonstration quality scores based on insertion smoothness and trajectory efficiency. Data is formatted for direct ingestion by Diffusion Policy, ACT, or custom architectures. For clients building sim-to-real pipelines, we provide real force profile calibration data paired with part geometry measurements to close the simulation contact gap.",
};

export default data;
