import type { TaskPageData } from "../types";

const data: TaskPageData = {
  slug: "bimanual-manipulation",
  metaTitle: "Bimanual Manipulation Training Data | Claru",
  metaDescription:
    "Training data for bimanual robot manipulation: coordinated two-arm tasks, handovers, collaborative assembly. ALOHA-compatible demonstrations with synchronized dual-arm recordings.",
  primaryKeyword: "bimanual manipulation training data",
  secondaryKeywords: [
    "dual arm robot data",
    "two-arm manipulation dataset",
    "bimanual demonstrations",
    "ALOHA training data",
    "coordinated manipulation dataset",
    "dual arm teleoperation data",
  ],
  canonicalPath: "/training-data/bimanual-manipulation",
  h1: "Bimanual Manipulation Training Data",
  heroSubtitle:
    "Coordinated two-arm manipulation demonstrations — collaborative lifting, bimanual assembly, in-hand handover, and asymmetric tasks where one arm stabilizes while the other acts.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Training Data", href: "/training-data" },
    {
      label: "Bimanual Manipulation",
      href: "/training-data/bimanual-manipulation",
    },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Is Bimanual Manipulation in Robotics?",
      paragraphs: [
        "Bimanual manipulation enables tasks that are physically impossible with a single arm: holding a pot steady while stirring, stabilizing a board while screwing in a bolt, folding a towel where both ends must move simultaneously, or peeling a banana where one hand grips while the other executes a precise peel motion. These tasks require coordinated planning across two kinematic chains totaling 14+ degrees of freedom (7-DoF per arm), with the added complexity that each arm's optimal action depends on the other arm's current state and near-future trajectory.",
        "The ALOHA project (Zhao et al., 2023) transformed the field by demonstrating that bimanual policies can be learned from remarkably small demonstration sets. Using Action Chunking with Transformers (ACT), ALOHA achieved 80-96% success rates on tasks including transferring a ball between cups (96%), zipping a bag (76%), and cooking shrimp (40 out of 50 trials) from just 50 teleoperated demonstrations per task. The key insight was action chunking: predicting sequences of 50-100 future actions at once, which naturally captures the temporal coordination between arms without explicit synchronization constraints.",
        "The coordination challenge is what makes bimanual data uniquely valuable and difficult to generate synthetically. Two-armed manipulation exhibits distinct coordination modes — symmetric (both arms do the same thing, like lifting a box), leader-follower (one arm positions while the other works), alternating (arms take turns, like hand-over-hand rope pulling), and independent (arms do different tasks in different workspace regions). Pure simulation struggles to generate the natural coordination patterns humans use because these patterns emerge from embodied experience rather than optimization. Real teleoperated demonstrations remain the primary data source for bimanual policies.",
        "Mobile ALOHA (Fu et al., 2024) extended bimanual manipulation to a mobile base, enabling whole-body coordination tasks like opening a two-handled cabinet while walking forward, pushing furniture, and elevator operation. These mobile bimanual tasks added a further 2-DoF base (linear and angular velocity) to the 14-DoF arm action space, creating a 16-DoF coordination problem. The dataset requirements grew accordingly: Mobile ALOHA needed 50-100 demonstrations per task but also required demonstrations of recovery behaviors when the base position drifted during dual-arm manipulation.",
      ],
    },
    {
      type: "stats",
      heading: "Bimanual Data by the Numbers",
      stats: [
        { value: "14-DoF", label: "Action space for dual 7-DoF arms" },
        { value: "50", label: "Demos for 80%+ success on structured tasks" },
        { value: "96%", label: "ALOHA success rate on ball transfer" },
        { value: "<1 ms", label: "Required inter-arm synchronization" },
        { value: "4+", label: "Cameras needed (2 wrist + 2 third-person)" },
        { value: "100", label: "Action chunk size for ACT policy" },
      ],
    },
    {
      type: "comparison-table",
      heading: "Data Requirements by Learning Approach",
      description:
        "Different architectures for bimanual policy learning impose distinct requirements on the demonstration dataset.",
      columns: [
        "Approach",
        "Data Volume",
        "Coordination Handling",
        "Action Space",
        "Strengths",
      ],
      rows: [
        {
          Approach: "ACT (Action Chunking with Transformers)",
          "Data Volume": "50-100 demos per task",
          "Coordination Handling":
            "Implicit via joint action prediction",
          "Action Space": "14-DoF joint positions chunked at 50-100 steps",
          Strengths:
            "Most data-efficient; natural coordination from chunking",
        },
        {
          Approach: "Diffusion Policy (bimanual)",
          "Data Volume": "100-300 demos per task",
          "Coordination Handling":
            "Joint distribution over both arms' actions",
          "Action Space": "14-DoF joint positions or end-effector poses",
          Strengths:
            "Handles multimodal coordination; robust to demonstration variability",
        },
        {
          Approach: "Hierarchical (task plan + arm controllers)",
          "Data Volume": "200-500 demos + subtask annotations",
          "Coordination Handling":
            "Explicit role assignment per subtask",
          "Action Space": "Per-arm subtask primitives",
          Strengths:
            "Interpretable; transfers across embodiments; long-horizon tasks",
        },
        {
          Approach: "Multi-agent RL (each arm is an agent)",
          "Data Volume": "50-200 demos for BC warmstart + 50K RL episodes",
          "Coordination Handling":
            "Emergent from shared reward signal",
          "Action Space": "Independent per-arm actions with shared observation",
          Strengths:
            "Can discover novel coordination; handles adversarial contacts",
        },
        {
          Approach: "VLA (Vision-Language-Action) fine-tuning",
          "Data Volume": "500-5,000 demos across task families",
          "Coordination Handling":
            "Language instruction conditions both arms",
          "Action Space": "Tokenized joint actions for both arms",
          Strengths:
            "Language-conditioned task selection; cross-task transfer",
        },
      ],
    },
    {
      type: "prose",
      heading: "State of the Art in Bimanual Manipulation",
      paragraphs: [
        "ALOHA Unleashed (Zhao et al., 2024) pushed bimanual manipulation to a new level of dexterity. By scaling the ACT architecture with a larger Transformer backbone and training on 500-1,000 demonstrations per task (compared to ALOHA's original 50), ALOHA Unleashed achieved consistent success on tasks previously considered too difficult: tying shoelaces (78% success), hanging a shirt on a hanger (85%), and repairing a velcro strap (91%). The critical finding was that dexterous bimanual tasks have a data efficiency threshold — below ~200 demonstrations, success rates are near-zero, but performance jumps sharply between 200-500 demonstrations as the policy captures the full distribution of coordination strategies.",
        "DexCap (Wang et al., 2024) addressed the teleoperation bottleneck for bimanual data collection by using hand motion capture to retarget human bimanual manipulation directly to robot arms. The operator wears motion capture gloves and performs the task naturally, and DexCap solves inverse kinematics to generate feasible robot joint trajectories. On 6 bimanual tasks (pouring, scooping, handover, folding, stirring, stacking), DexCap demonstrations trained ACT policies to 72% average success — lower than direct teleoperation (85%) but with 3x faster collection throughput because operators do not need to learn the teleoperation interface.",
        "Bi-VLA (Wu et al., 2025) explored bimanual manipulation through the lens of vision-language-action models. By fine-tuning a pretrained VLA (OpenVLA) on 2,000 bimanual demonstrations spanning 12 task types, Bi-VLA achieved 75% zero-shot success on held-out bimanual tasks given only language instructions. The model learned to infer coordination modes from task descriptions — 'hold the bowl and stir' triggers leader-follower coordination, while 'lift the box' triggers symmetric coordination. This result suggests that language-conditioned bimanual policies can generalize across tasks with sufficient data diversity.",
        "For industrial bimanual applications, the ALOHA 2 system (Aldaco et al., 2024) demonstrated that production-quality bimanual data can be collected at scale with a redesigned teleoperation setup costing under $20K per station. ALOHA 2 improved data collection ergonomics with a reconfigurable leader arm mounting, reduced operator fatigue by 40% compared to the original ALOHA design, and standardized the recording pipeline to produce RLDS-formatted datasets compatible with the Open X-Embodiment ecosystem.",
      ],
    },
    {
      type: "prose",
      heading: "Collection Methodology for Bimanual Data",
      paragraphs: [
        "Bimanual teleoperation requires specialized hardware that preserves the operator's natural two-handed coordination. The ALOHA system uses a pair of leader arms that the operator physically manipulates in free space, with follower robot arms mirroring the motion at 50 Hz. This leader-follower approach provides the most natural bimanual control because the operator uses their native hand coordination — the same neural pathways that make everyday bimanual tasks effortless. However, the leader arms must be precisely calibrated so that the mapping between leader and follower workspace is intuitive, typically requiring 30-60 minutes of setup per session.",
        "Temporal synchronization between arms is the single most critical quality factor in bimanual data. The two arms' proprioceptive streams, action labels, and camera frames must be aligned within 1 ms (ideally hardware-synchronized via a shared clock signal). Even 5 ms of desynchronization between arms creates coordination artifacts that degrade policy performance by 15-25% on tasks requiring tight timing like handovers and simultaneous grasps. All cameras and joint encoders should be triggered from the same hardware clock, and timestamps should be validated during quality checking.",
        "Operator management is uniquely important for bimanual collection. Controlling two arms simultaneously is cognitively demanding — dual-task interference causes coordination quality to degrade measurably after 30-45 minutes of continuous teleoperation. Sessions should be limited to 30 minutes with mandatory 10-minute breaks. Operator qualification should assess bimanual coordination quality specifically: smooth, natural arm-to-arm timing; consistent role assignment (same arm leads consistently for asymmetric tasks); and graceful recovery from errors rather than abrupt resets.",
        "Each bimanual demonstration should be annotated with the coordination mode (symmetric, leader-follower, alternating, or independent), synchronization events (handover moments, simultaneous grasp/release), per-arm task role labels (stabilizer vs. manipulator), and contact events between the two arms or between each arm and the workspace. For long-horizon bimanual tasks, subtask boundary annotations enable hierarchical policy training where a high-level planner selects bimanual primitives and low-level controllers execute them.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Key Datasets for Bimanual Manipulation",
      description:
        "Public bimanual datasets range from small task-specific collections to large multi-task corpora. Most use the ALOHA hardware platform.",
      columns: [
        "Dataset",
        "Year",
        "Scale",
        "Hardware",
        "Task Types",
        "Coordination Types",
      ],
      rows: [
        {
          Dataset: "ALOHA (Zhao et al.)",
          Year: "2023",
          Scale: "50 demos x 6 tasks",
          Hardware: "ViperX 300 leader-follower pairs",
          "Task Types":
            "Cup transfer, bag zipping, cooking, threading",
          "Coordination Types": "Leader-follower, symmetric",
        },
        {
          Dataset: "Mobile ALOHA (Fu et al.)",
          Year: "2024",
          Scale: "50-100 demos x 8 tasks",
          Hardware: "ViperX 300 + mobile base",
          "Task Types":
            "Door opening, furniture pushing, elevator, cooking",
          "Coordination Types":
            "Leader-follower + base coordination",
        },
        {
          Dataset: "ALOHA Unleashed (Zhao et al.)",
          Year: "2024",
          Scale: "500-1K demos x 5 tasks",
          Hardware: "Custom ALOHA 2 station",
          "Task Types":
            "Shoelace tying, shirt hanging, velcro, wiping",
          "Coordination Types":
            "All four modes; high dexterity",
        },
        {
          Dataset: "DexCap (Wang et al.)",
          Year: "2024",
          Scale: "200 demos x 6 tasks",
          Hardware: "MoCap gloves + UR5e pair",
          "Task Types":
            "Pouring, scooping, handover, folding",
          "Coordination Types":
            "Natural human coordination (retargeted)",
        },
        {
          Dataset: "RoboTwin (Mu et al.)",
          Year: "2024",
          Scale: "5K+ episodes across 40 tasks",
          Hardware: "COBOT Magic dual arms",
          "Task Types": "Tabletop bimanual with language instructions",
          "Coordination Types": "Leader-follower, symmetric, independent",
        },
      ],
    },
    {
      type: "prose",
      heading: "How Claru Supports Bimanual Data Needs",
      paragraphs: [
        "Claru operates ALOHA-compatible bimanual collection stations with hardware-synchronized dual leader-follower arms, each equipped with wrist-mounted cameras and 4+ third-person cameras covering the full bimanual workspace. All sensor streams are triggered from a shared hardware clock, guaranteeing sub-millisecond inter-arm synchronization that is verified automatically during post-collection quality checks. Our stations support both the original ALOHA (ViperX 300) and the ALOHA 2 form factor, with quick-swap end-effectors for different gripper configurations.",
        "Our operators are specifically selected and trained for bimanual coordination quality. Each operator completes a bimanual qualification protocol that assesses arm-to-arm timing smoothness, role assignment consistency, and recovery behavior quality. Operators work in strict 30-minute collection sessions with mandatory breaks, and per-session coordination quality metrics are tracked to detect fatigue-induced degradation before it contaminates the dataset.",
        "Claru delivers bimanual datasets with per-arm action labels, coordination mode annotations, synchronization event timestamps, task role assignments, and subtask phase segmentation. Data is formatted for direct ingestion by ACT, Diffusion Policy, and VLA architectures in RLDS or HDF5 format. For clients building multi-task bimanual systems, we provide cross-task data packages with consistent annotation schemas that enable training a single policy across diverse bimanual tasks. Our collection throughput is 200-400 quality demonstrations per station per day for structured bimanual tasks.",
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        {
          id: "zhao-aloha-2023",
          title:
            "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware",
          authors: "Zhao et al.",
          venue: "RSS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2304.13705",
        },
        {
          id: "fu-mobile-aloha-2024",
          title:
            "Mobile ALOHA: Learning Bimanual Mobile Manipulation with Low-Cost Whole-Body Teleoperation",
          authors: "Fu et al.",
          venue: "arXiv 2401.02117",
          year: 2024,
          url: "https://arxiv.org/abs/2401.02117",
        },
        {
          id: "zhao-aloha-unleashed-2024",
          title:
            "ALOHA Unleashed: A Simple Recipe for Robot Dexterity",
          authors: "Zhao et al.",
          venue: "arXiv 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2410.13126",
        },
        {
          id: "wang-dexcap-2024",
          title:
            "DexCap: Scalable and Portable Mocap Data Collection System for Dexterous Manipulation",
          authors: "Wang et al.",
          venue: "RSS 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2403.07788",
        },
        {
          id: "aldaco-aloha2-2024",
          title: "ALOHA 2: An Enhanced Low-Cost Hardware for Bimanual Teleoperation",
          authors: "Aldaco et al.",
          venue: "arXiv 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2405.02292",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "How many demonstrations are needed for bimanual tasks?",
      answer:
        "ALOHA achieved 80%+ success with 50 demonstrations per task for structured bimanual tasks (cup transfer, bag zipping). More complex dexterous tasks like shoelace tying require 200-500 demonstrations before success rates exceed 50% — there is a sharp threshold effect. Multi-task bimanual policies (one policy for many tasks) require 5,000+ demonstrations across task families. Start with your highest-value task and 50 demonstrations as a proof of concept.",
    },
    {
      question:
        "Can single-arm demonstrations help train bimanual policies?",
      answer:
        "Transfer is limited. Single-arm data can pretrain individual arm perception encoders (visual feature extractors), but the bimanual coordination patterns — timing, force distribution, role assignment between arms — are fundamentally absent from single-arm data. Research shows that bimanual policies initialized from single-arm pretraining converge 30% faster but reach the same final performance as training from scratch, so the benefit is only compute savings, not data savings.",
    },
    {
      question:
        "What is the biggest challenge in bimanual data collection?",
      answer:
        "Operator fatigue. Controlling two arms simultaneously imposes dual-task cognitive load that causes coordination quality to degrade measurably after 30-45 minutes. Signs include increased arm collision rate, loss of smooth coordination timing, and inconsistent role assignment between arms. Enforce strict 30-minute session limits with 10-minute breaks. Quality degrades 3x faster for bimanual compared to single-arm teleoperation.",
    },
    {
      question: "Do I need separate cameras for each arm?",
      answer:
        "Yes. Each arm should have a wrist-mounted camera (320x240 or 640x480) for close-up manipulation context that captures what happens at the fingertips. Additionally, 2-3 third-person cameras should capture the full bimanual workspace from complementary viewpoints. A minimum of 4 cameras total (2 wrist + 2 third-person) is the standard in ALOHA-derived setups. All cameras must be hardware-synchronized to the same clock signal.",
    },
    {
      question:
        "How does bimanual data differ from just recording two single-arm tasks simultaneously?",
      answer:
        "Bimanual data captures inter-arm coordination that is absent from independent single-arm recordings. The critical information is the temporal relationship between arms: when one arm pauses to let the other catch up, how grip force in the stabilizing arm adjusts in response to manipulation by the active arm, and how both arms synchronize during handover events. Recording two independent arms misses these coordination signals entirely, producing data that trains policies that collide or fail to coordinate.",
    },
  ],
  ctaHeading: "Get a Custom Quote for Bimanual Manipulation Data",
  ctaDescription:
    "Describe your bimanual tasks — coordination type, object categories, and environment — and we will design an ALOHA-compatible collection plan.",
  relatedGlossaryTerms: [
    "manipulation-trajectory",
    "imitation-learning",
    "action-chunking",
    "teleoperation",
    "behavioral-cloning",
  ],
  relatedGuidePages: [
    "how-to-collect-teleoperation-data",
    "how-to-build-a-manipulation-dataset",
  ],
  relatedSolutionSlugs: [],
  dataRequirements: {
    modality:
      "Dual RGB wrist cameras + 2-3 third-person cameras + dual proprioception + dual gripper states",
    volumeRange: "50-1,000 demonstrations per bimanual task",
    temporalResolution:
      "30 Hz video per camera (hardware-synced), 50 Hz proprioception per arm",
    keyAnnotations: [
      "Coordination mode (symmetric, leader-follower, alternating, independent)",
      "Inter-arm synchronization events (handover, simultaneous grasp/release)",
      "Per-arm task role assignment (stabilizer vs. manipulator)",
      "Subtask phase boundaries for long-horizon bimanual tasks",
      "Contact events (arm-to-arm, arm-to-object, arm-to-environment)",
      "Bimanual grasp strategy labels",
    ],
  },
  relevantModels: [
    "ACT (Action Chunking with Transformers)",
    "ALOHA / Mobile ALOHA",
    "ALOHA Unleashed",
    "Diffusion Policy (bimanual)",
    "OpenVLA (bimanual fine-tune)",
    "Bi-VLA",
  ],
  environmentTypes: [
    "Kitchen countertop",
    "Assembly workstation",
    "Tabletop workspace",
    "Laundry/fabric handling",
    "Laboratory bench",
    "Mobile manipulation (with base)",
  ],
  keyPapers: [
    {
      id: "zhao-aloha-2023",
      title:
        "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware",
      authors: "Zhao et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2304.13705",
    },
    {
      id: "fu-mobile-aloha-2024",
      title:
        "Mobile ALOHA: Learning Bimanual Mobile Manipulation with Low-Cost Whole-Body Teleoperation",
      authors: "Fu et al.",
      venue: "arXiv 2401.02117",
      year: 2024,
      url: "https://arxiv.org/abs/2401.02117",
    },
    {
      id: "zhao-aloha-unleashed-2024",
      title: "ALOHA Unleashed: A Simple Recipe for Robot Dexterity",
      authors: "Zhao et al.",
      venue: "arXiv 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2410.13126",
    },
    {
      id: "wang-dexcap-2024",
      title:
        "DexCap: Scalable and Portable Mocap Data Collection System for Dexterous Manipulation",
      authors: "Wang et al.",
      venue: "RSS 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2403.07788",
    },
    {
      id: "aldaco-aloha2-2024",
      title:
        "ALOHA 2: An Enhanced Low-Cost Hardware for Bimanual Teleoperation",
      authors: "Aldaco et al.",
      venue: "arXiv 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2405.02292",
    },
  ],
  claruRelevance:
    "Claru operates ALOHA-compatible bimanual collection stations with hardware-synchronized dual leader-follower arms, wrist-mounted cameras on each arm, and 2-3 third-person cameras covering the full bimanual workspace. All sensor streams share a hardware clock signal guaranteeing sub-millisecond inter-arm synchronization, verified automatically during post-collection quality checks. Our operators are specifically selected and trained for bimanual coordination quality, completing a qualification protocol that assesses arm-to-arm timing, role consistency, and recovery behavior before production collection begins. Strict 30-minute session limits with mandatory breaks prevent fatigue-induced coordination degradation. We deliver bimanual datasets with per-arm action labels, coordination mode annotations, synchronization event timestamps, and subtask phase segmentation in RLDS or HDF5 format. Collection throughput reaches 200-400 quality demonstrations per station per day for structured bimanual tasks, enabling rapid dataset scaling for ACT, Diffusion Policy, and VLA training pipelines.",
};

export default data;
