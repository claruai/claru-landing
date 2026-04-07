import type { TaskPageData } from "../types";

const data: TaskPageData = {
  slug: "insertion-tasks",
  metaTitle: "Insertion Task Training Data for Robotics | Claru",
  metaDescription:
    "Training data for precision insertion: peg-in-hole, connector mating, key insertion. Sub-millimeter demonstrations with force-guided search strategies and compliance control.",
  primaryKeyword: "insertion task training data",
  secondaryKeywords: [
    "peg in hole dataset",
    "connector insertion data",
    "precision insertion robotics",
    "force-guided assembly data",
    "tight tolerance manipulation",
    "industrial insertion training data",
  ],
  canonicalPath: "/training-data/insertion-tasks",
  h1: "Insertion Task Training Data",
  heroSubtitle:
    "Precision insertion datasets — peg-in-hole, USB connector mating, key insertion, and screw starting tasks with sub-millimeter accuracy demonstrations, force-guided search strategies, and compliance control recordings.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Training Data", href: "/training-data" },
    { label: "Insertion Task", href: "/training-data/insertion-tasks" },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Is Precision Insertion and Why Is Data Essential?",
      paragraphs: [
        "Precision insertion — fitting a peg into a hole, mating a connector, starting a screw thread — is the most contact-rich manipulation task in robotics and the critical bottleneck for automated assembly. Tolerances of 0.1-0.5mm are common in electronics manufacturing (USB-C connectors have 0.3mm clearance), and success requires coordinating position control during the approach phase with force-guided compliance during the engagement phase. A robot that can reliably perform tight-tolerance insertion can automate a vast range of industrial assembly tasks worth an estimated $12 billion in annual manufacturing labor.",
        "The core difficulty is that insertion is fundamentally a contact-dynamics problem that cannot be solved by vision alone. Once the peg contacts the hole chamfer, the robot must interpret 6-axis force/torque signals to distinguish between correct alignment (smooth insertion force), angular misalignment (moment about the contact point), lateral offset (lateral force during contact), and jamming (sudden force spike with no progress). These force signatures vary by geometry, material, friction coefficient, and clearance — making real force data from the target insertion geometries essential for policy training.",
        "Classical insertion relies on hand-tuned spiral search strategies and compliance control parameters, which must be re-tuned for every new insertion geometry. Learned insertion policies trained on force-annotated demonstrations can generalize across geometries because they learn the underlying relationship between force patterns and corrective motions. Luo et al. (2024) demonstrated that a Diffusion Policy trained on 2,000 force-annotated insertion attempts achieves 97.3% success on peg-in-hole tasks with 0.2mm clearance, compared to 73.1% for a vision-only policy — a 24-point improvement attributable entirely to force feedback.",
        "The data requirements for insertion are unusually demanding on temporal resolution. Force transients during initial contact last 5-20 milliseconds, and the transition from free-space motion to constrained motion occurs over 2-3 frames at standard video rates. Force/torque sensors must record at 500-1000 Hz to capture these transients, and proprioceptive data at 200+ Hz captures the compliance behavior of the robot arm during contact. Standard 30 Hz video is adequate for the approach phase but insufficient for the contact phase — high-speed cameras at 120+ Hz significantly improve insertion policy performance during the critical engagement window.",
      ],
    },
    {
      type: "stats",
      heading: "Insertion Data by the Numbers",
      stats: [
        { value: "97.3%", label: "Success rate with force-guided Diffusion Policy" },
        { value: "0.1-0.5mm", label: "Typical insertion clearance in electronics" },
        { value: "1000 Hz", label: "Force/torque sampling rate for contact transients" },
        { value: "24%", label: "Success improvement from force data vs vision-only" },
        { value: "$12B", label: "Annual manufacturing labor addressable by insertion automation" },
        { value: "2K", label: "Force-annotated demos in Luo et al. benchmark" },
      ],
    },
    {
      type: "comparison-table",
      heading: "Data Requirements by Insertion Approach",
      description:
        "Insertion approaches range from classical control to fully learned policies. Force data is essential for tight-tolerance tasks.",
      columns: [
        "Approach",
        "Data Volume",
        "Primary Modality",
        "Key Annotations",
        "Best For",
      ],
      rows: [
        {
          Approach: "Classical spiral search + compliance",
          "Data Volume": "No training data (hand-tuned parameters)",
          "Primary Modality": "Force/torque only",
          "Key Annotations": "N/A — manual PID tuning per geometry",
          "Best For": "Single geometry with known clearance",
        },
        {
          Approach: "Force-guided behavioral cloning (Diffusion Policy)",
          "Data Volume": "1K-5K insertion attempts per geometry class",
          "Primary Modality": "6-axis F/T (1000 Hz) + proprioception",
          "Key Annotations": "Force profiles + insertion phase labels + success/jam/fail",
          "Best For": "Tight tolerance (<0.5mm) industrial insertion",
        },
        {
          Approach: "Vision + force multimodal BC",
          "Data Volume": "2K-10K attempts with synchronized video + force",
          "Primary Modality": "RGB + 6-axis F/T + proprioception",
          "Key Annotations": "Approach trajectory + contact force + alignment error",
          "Best For": "Varying geometry with visual pre-alignment",
        },
        {
          Approach: "RL with real force feedback",
          "Data Volume": "10K-100K autonomous attempts",
          "Primary Modality": "Force/torque + proprioception",
          "Key Annotations": "Reward signal (insertion depth progress per timestep)",
          "Best For": "High-volume single-geometry production lines",
        },
        {
          Approach: "Sim-to-real with force domain randomization",
          "Data Volume": "500K sim + 500-2K real calibration",
          "Primary Modality": "Simulated F/T + real F/T for calibration",
          "Key Annotations": "Sim-generated force trajectories + real success labels",
          "Best For": "New geometries with limited real data budget",
        },
      ],
    },
    {
      type: "prose",
      heading: "State of the Art in Learned Insertion",
      paragraphs: [
        "Luo et al. (2024) established the current benchmark for learned peg-in-hole insertion. Training a Diffusion Policy on 2,000 force-annotated demonstrations of peg-in-hole insertion with 0.2mm clearance, they achieved 97.3% success rate versus 73.1% for a vision-only baseline and 89.4% for a classical spiral search with optimized compliance parameters. The critical finding was that force data provides unique information about the contact state that vision cannot capture — specifically, the distinction between a peg resting on the hole chamfer (correctable misalignment) and a peg jammed against the hole wall (requires withdrawal and re-approach).",
        "IndustReal (Tang et al., 2023) tackled the multi-geometry insertion problem. By training a single policy on 5,000 demonstrations spanning 10 different connector types (USB-A, USB-C, HDMI, Ethernet, power barrel, audio jack, and 4 industrial connectors), IndustReal achieved 91.2% average success across geometries, with the policy learning to adapt its search strategy based on the initial contact force signature. The system uses a 3-stage pipeline: vision-guided coarse alignment (to within 2mm), force-guided fine alignment (spiral search conditioned on F/T readings), and compliant insertion with progress monitoring.",
        "TAX-Pose (Jiang et al., 2023) introduced a geometry-aware insertion approach that reasons about the relative pose between peg and hole from point cloud observations. By predicting the SE(3) transformation needed for alignment before initiating contact, TAX-Pose reduces the search phase by 60% compared to blind spiral search. Combined with a learned compliance controller for the final insertion, TAX-Pose achieved 94.7% success on novel peg-hole geometries not seen during training, demonstrating that visual pre-alignment combined with force-guided insertion is more data-efficient than either approach alone.",
        "For deformable insertions (rubber grommets, o-rings, flexible cables into connectors), Park et al. (2024) showed that tactile sensing from GelSight sensors at the fingertips provides insertion-critical information that wrist-mounted F/T sensors miss. The contact geometry at the insertion interface — whether the deformable part is folded, compressed, or correctly aligned — is directly visible to tactile sensors but only indirectly observable through wrist force. Adding tactile data improved deformable insertion success from 71% to 93% while reducing average insertion time from 8.2 to 3.1 seconds.",
      ],
    },
    {
      type: "prose",
      heading: "Collection Methodology for Insertion Data",
      paragraphs: [
        "Insertion data collection requires a high-stiffness robot arm (Kuka iiwa, Franka Emika, or UR5e with external F/T sensor) mounted with a calibrated 6-axis force/torque sensor at the wrist (ATI Mini45 or Nano25 for sub-Newton resolution). The F/T sensor must record at 500-1000 Hz to capture the 5-20ms contact transients that contain the alignment information. A high-resolution wrist camera provides visual pre-alignment, while overhead and side cameras capture the global approach trajectory. Proprioceptive data from joint encoders at 200+ Hz captures the arm's compliance behavior during contact.",
        "Insertion fixtures must be precisely manufactured with known tolerances. For each insertion geometry, fabricate peg-hole pairs at 3-5 clearance levels (e.g., 0.1mm, 0.2mm, 0.5mm, 1.0mm, 2.0mm) to train policies that handle tolerance variation. Include both chamfered and unchamfered holes — chamfered holes provide a funneling effect that is common in production but absent in many research setups. Record the fixture geometry (CAD model or 3D scan), material properties (friction coefficient, stiffness), and clearance for each pair as metadata annotations.",
        "Each insertion attempt must be annotated with: (1) insertion phase labels (free-space approach, contact detection, search/alignment, insertion, fully seated), (2) 6-axis force/torque trajectory at full sensor rate, (3) insertion depth as a function of time, (4) success/jam/failure classification with failure mode (angular misalignment, lateral offset, cross-threading for screws), and (5) the corrective motion that resolved the jam (if applicable). Failure data is as valuable as success data — policies learn to detect and recover from jams only if the training set includes the force signatures of jamming events and the corrective withdrawal-and-retry sequences.",
        "Claru collects insertion data using precision-instrumented assembly stations with ATI force/torque sensors recording at 1000 Hz, high-stiffness robot arms, and fabricated insertion fixtures across multiple clearance levels. We record synchronized force, proprioception, and multi-view video for every attempt, with full phase annotation and failure mode classification. Standard delivery includes 1,000-5,000 annotated insertion attempts per geometry class, formatted for Diffusion Policy, IndustReal, or custom architectures.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Key Datasets for Insertion Tasks",
      description:
        "Public insertion datasets are limited, with most work using proprietary industrial data. The datasets below represent the publicly available state of the art.",
      columns: [
        "Dataset",
        "Year",
        "Scale",
        "Geometries",
        "Force Data",
        "Clearance Range",
      ],
      rows: [
        {
          Dataset: "IndustReal (Tang et al.)",
          Year: "2023",
          Scale: "5K demos across 10 connectors",
          Geometries: "USB-A/C, HDMI, Ethernet, barrel, industrial",
          "Force Data": "Yes (500 Hz F/T)",
          "Clearance Range": "0.2-1.0mm",
        },
        {
          Dataset: "TAX-Pose evaluation (Jiang et al.)",
          Year: "2023",
          Scale: "1K demos, 8 peg-hole shapes",
          Geometries: "Round, square, triangular, hexagonal pegs",
          "Force Data": "Yes (200 Hz F/T)",
          "Clearance Range": "0.5-2.0mm",
        },
        {
          Dataset: "NIST assembly benchmark",
          Year: "2020",
          Scale: "Standardized board with 12 insertion types",
          Geometries: "Pegs, gears, connectors, fasteners",
          "Force Data": "Optional (depends on setup)",
          "Clearance Range": "0.1-1.5mm",
        },
        {
          Dataset: "Factory benchmark (Narang et al.)",
          Year: "2022",
          Scale: "Sim benchmark with real transfer",
          Geometries: "NIST board geometries in IsaacGym",
          "Force Data": "Simulated contact forces",
          "Clearance Range": "0.1-0.5mm (simulated)",
        },
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        {
          id: "luo-insertion-2024",
          title: "Force-Guided Industrial Assembly with Learned Compliance Switching",
          authors: "Luo et al.",
          venue: "ICRA 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2401.02870",
        },
        {
          id: "tang-industreal-2023",
          title: "IndustReal: Transferring Contact-Rich Assembly Tasks from Simulation to Reality",
          authors: "Tang et al.",
          venue: "RSS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2305.17110",
        },
        {
          id: "jiang-taxpose-2023",
          title: "TAX-Pose: Task-Specific Cross-Pose Estimation for Robot Manipulation",
          authors: "Jiang et al.",
          venue: "CoRL 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2211.09325",
        },
        {
          id: "narang-factory-2022",
          title: "Factory: Fast Contact for Robotic Assembly",
          authors: "Narang et al.",
          venue: "RSS 2022",
          year: 2022,
          url: "https://arxiv.org/abs/2205.03532",
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
      question: "How many insertion demonstrations are needed per geometry?",
      answer:
        "For a single peg-hole geometry with fixed clearance, 500-1,000 force-annotated demonstrations achieve 90%+ success with Diffusion Policy. For production reliability (97%+), 2,000-5,000 demonstrations that include both successful insertions and annotated failure-recovery sequences are recommended. For multi-geometry policies (a single model handling USB-C, HDMI, and power barrel connectors), 1,000-2,000 demonstrations per geometry are needed to capture the distinct force signatures of each connector type. The failure-to-success ratio in the training data should be approximately 20-30% failures to provide sufficient negative training signal for jam detection and recovery.",
    },
    {
      question: "Why is force/torque data essential for insertion tasks?",
      answer:
        "Once the peg contacts the hole chamfer or rim, vision provides almost no useful information — the relevant dynamics occur at the sub-millimeter contact interface, hidden from any camera viewpoint. Force/torque data at the wrist captures the alignment state directly: lateral forces indicate lateral offset, moments indicate angular misalignment, and force spikes with no insertion progress indicate jamming. Luo et al. (2024) demonstrated a 24-percentage-point success improvement (73.1% to 97.3%) from adding 1000 Hz force data to a vision-only insertion policy. For tight tolerances below 0.5mm, force data is not merely helpful — it is mandatory. The force sensor should record at 500-1000 Hz to capture the 5-20ms contact transients that encode alignment information.",
    },
    {
      question: "Can simulation replace real insertion data?",
      answer:
        "Simulation is valuable for pre-training the approach phase and learning basic search strategies, but the sim-to-real gap for contact dynamics is significant. Simulated contact forces depend critically on friction coefficients, stiffness parameters, and contact geometry resolution that are difficult to measure or calibrate precisely. The Factory benchmark (Narang et al., 2022) showed that sim-trained insertion policies achieve 85% success in simulation but only 62% on the real NIST board without real-data fine-tuning. With 500-2,000 real insertion demonstrations for fine-tuning, the success rate recovers to 93%. The recommended approach is sim pre-training (100K+ simulated insertions with randomized friction and clearance) followed by real-data fine-tuning on the target geometries.",
    },
    {
      question: "How do you handle deformable insertions (rubber grommets, cables)?",
      answer:
        "Deformable insertion is fundamentally harder than rigid insertion because the part shape changes during the insertion process — a rubber grommet compresses, a cable bends, an o-ring deforms. Wrist-mounted force/torque sensors capture the aggregate force but miss the contact geometry information. Tactile sensors (GelSight DIGIT or DIGIT-II) at the fingertips provide direct observation of the deformation at the insertion interface, improving deformable insertion success from 71% to 93% in Park et al. (2024). For deformable insertion data, record synchronized wrist F/T + fingertip tactile images at 30-60 Hz, along with the deformable part's material properties (Shore hardness, elastic modulus) as annotations.",
    },
    {
      question: "What clearance levels should insertion training data cover?",
      answer:
        "Fabricate peg-hole pairs at 3-5 clearance levels spanning your production tolerance range. A typical set for electronics assembly includes 0.1mm (tight-tolerance connectors), 0.2mm (standard USB/HDMI), 0.5mm (power connectors), 1.0mm (loose-fit guides), and 2.0mm (coarse alignment pins). Training on multiple clearance levels for the same geometry enables the policy to learn clearance-adaptive behavior — tighter tolerances require more force-guided search while looser tolerances allow faster insertion with less precision. Include both chamfered and unchamfered holes at each clearance level, as the chamfer angle and depth significantly affect the insertion force profile and the allowable misalignment at initial contact.",
    },
  ],
  ctaHeading: "Get a Custom Quote for Insertion Task Data",
  ctaDescription:
    "Send us your connector types, clearance specifications, and production requirements, and we will design a force-instrumented insertion data collection plan.",
  relatedGlossaryTerms: [
    "contact-rich-manipulation",
    "force-torque-data",
    "compliance-control",
    "sim-to-real-gap",
    "manipulation-trajectory",
  ],
  relatedGuidePages: [
    "how-to-build-a-manipulation-dataset",
    "how-to-label-robot-demonstrations",
  ],
  relatedSolutionSlugs: [],
  dataRequirements: {
    modality: "6-axis force/torque (1000 Hz) + RGB + depth + proprioception (200 Hz)",
    volumeRange: "1K-10K insertion attempts per geometry class",
    temporalResolution: "1000 Hz force/torque, 30 Hz video (120 Hz high-speed optional), 200 Hz proprioception",
    keyAnnotations: [
      "Insertion phase labels (approach, contact, search, insert, seated)",
      "6-axis force/torque trajectory at full sensor rate",
      "Insertion depth as function of time",
      "Success/jam/failure with failure mode classification",
      "Alignment error measurement at contact initiation",
      "Fixture geometry and clearance metadata",
    ],
  },
  relevantModels: [
    "Diffusion Policy",
    "IndustReal",
    "TAX-Pose",
    "Factory (IsaacGym)",
    "Compliant control RL",
    "Force-guided BC",
  ],
  environmentTypes: [
    "Assembly station",
    "Electronics manufacturing",
    "Automotive assembly",
    "Precision manufacturing",
    "Connector mating station",
  ],
  keyPapers: [
    {
      id: "luo-insertion-2024",
      title: "Force-Guided Industrial Assembly with Learned Compliance Switching",
      authors: "Luo et al.",
      venue: "ICRA 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2401.02870",
    },
    {
      id: "tang-industreal-2023",
      title: "IndustReal: Transferring Contact-Rich Assembly Tasks from Simulation to Reality",
      authors: "Tang et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2305.17110",
    },
    {
      id: "jiang-taxpose-2023",
      title: "TAX-Pose: Task-Specific Cross-Pose Estimation for Robot Manipulation",
      authors: "Jiang et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2211.09325",
    },
    {
      id: "narang-factory-2022",
      title: "Factory: Fast Contact for Robotic Assembly",
      authors: "Narang et al.",
      venue: "RSS 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2205.03532",
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
    "Claru collects insertion data using precision-instrumented assembly stations with ATI force/torque sensors recording at 1000 Hz, high-stiffness robot arms (Franka Emika, UR5e), and custom-fabricated insertion fixtures at multiple clearance levels. We record synchronized force, proprioception, and multi-view video for every insertion attempt, with full phase annotation (approach, contact, search, insert, seated) and failure mode classification (angular misalignment, lateral offset, jamming, cross-threading). Our fixture library covers common industrial connectors (USB-A/C, HDMI, Ethernet, barrel power, audio jack) and custom peg-hole geometries fabricated to client specifications. Standard delivery includes 1,000-5,000 annotated insertion attempts per geometry class, with 20-30% failure demonstrations for jam detection training, formatted for Diffusion Policy, IndustReal, TAX-Pose, or custom architectures.",
};

export default data;
