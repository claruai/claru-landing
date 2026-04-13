import type { TaskPageData } from "../types";

const data: TaskPageData = {
  slug: "screw-driving",
  metaTitle: "Screw Driving Training Data for Robotics | Claru",
  metaDescription:
    "Training data for robotic screw driving: fastening, threading, and torque-controlled tightening. Force-guided demonstrations with torque profiles and cross-threading detection.",
  primaryKeyword: "robotic screw driving training data",
  secondaryKeywords: [
    "screw driving dataset",
    "robot fastening demonstrations",
    "torque-controlled tightening data",
    "automated screw insertion data",
    "robotic fastening training data",
    "thread engagement detection dataset",
  ],
  canonicalPath: "/training-data/screw-driving",
  h1: "Screw Driving Training Data",
  heroSubtitle:
    "Screw driving datasets for industrial robotic assembly — thread engagement, torque-controlled tightening, and cross-threading detection with high-frequency force/torque profiles and angular position tracking for learning fastening policies.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Training Data", href: "/training-data" },
    { label: "Screw Driving", href: "/training-data/screw-driving" },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Is Robotic Screw Driving and Why Does Data Matter?",
      paragraphs: [
        "Screw driving is one of the most common assembly operations in manufacturing, with an estimated 1.2 trillion screws and fasteners installed annually worldwide. Each screw insertion involves a precise sequence of phases: hole finding with positional accuracy of 0.5-1.0 mm, thread engagement requiring controlled downward force with rotation at 0.1-0.5 Nm initial torque, run-down where the screw advances at 100-500 RPM under light torque, and final tightening to a specified torque (typically 0.5-50 Nm depending on the fastener). Cross-threading — where the screw thread misaligns with the hole thread — is the most common failure mode, occurring in 2-5% of manual operations and detectable only through characteristic torque signature anomalies.",
        "Traditional automated screw driving uses fixed-sequence robots with compliant drivers, but these systems fail when screw positions vary by more than 0.3 mm or when product variants require different fastener types. The automotive industry alone spends $2.8 billion annually on fastening equipment, yet 30-40% of fastening operations in mixed-model assembly lines still require human operators because the variability exceeds what traditional automation can handle. Learning-based screw driving policies that adapt to position uncertainty, detect cross-threading in real time, and handle multiple fastener types from demonstration data could automate these remaining manual operations.",
        "The data challenge in screw driving centers on the torque profile during insertion. A successful screw insertion produces a characteristic torque curve: near-zero torque during hole finding, a small spike during thread engagement (0.1-0.3 Nm), steady low torque during run-down (0.2-1.0 Nm), and a sharp rise during final tightening to the target torque. Cross-threading produces an abnormally high torque spike during engagement (2-5x normal) followed by irregular oscillations. These torque signatures occur on a 10-50 ms timescale, requiring high-frequency torque recording (1000+ Hz) to capture the transient events that distinguish successful insertion from failure.",
        "Research by Inoue et al. (2017) demonstrated that learned screw driving policies using force/torque feedback achieve 97.5% insertion success with cross-threading detection, compared to 89% for position-only policies. The critical insight is that the torque profile contains real-time information about thread engagement quality that is invisible to vision. More recently, Kim et al. (2023) showed that transformer-based policies trained on 5,000 screw driving demonstrations can generalize across 12 different screw types (M2-M8, Phillips and hex) with 95% success, suggesting that a sufficiently diverse demonstration dataset can support multi-fastener policies.",
      ],
    },
    {
      type: "stats",
      heading: "Screw Driving Data by the Numbers",
      stats: [
        { value: "1.2T", label: "Screws installed annually worldwide" },
        { value: "$2.8B", label: "Annual automotive fastening equipment spend" },
        { value: "97.5%", label: "Insertion success with force/torque feedback" },
        { value: "1000+ Hz", label: "Minimum torque sampling rate for thread detection" },
        { value: "0.5 mm", label: "Positional accuracy for hole finding" },
        { value: "2-5%", label: "Cross-threading rate in manual operations" },
      ],
    },
    {
      type: "comparison-table",
      heading: "Data Requirements by Screw Driving Approach",
      description:
        "Screw driving learning methods range from torque-profile classification to end-to-end policies. All benefit significantly from high-frequency force/torque data.",
      columns: [
        "Approach",
        "Data Volume",
        "Key Modalities",
        "Torque Data",
        "Strengths",
      ],
      rows: [
        {
          Approach: "Torque-profile classification",
          "Data Volume": "1K-10K insertion profiles per screw type",
          "Key Modalities": "Torque + angular position at 1000+ Hz",
          "Torque Data": "Primary modality",
          Strengths: "Fast cross-threading detection; interpretable",
        },
        {
          Approach: "Behavioral cloning with force feedback",
          "Data Volume": "200-1K demonstrations per screw type",
          "Key Modalities": "RGB + F/T + torque + proprioception",
          "Torque Data": "Critical (8 pp improvement)",
          Strengths: "End-to-end; handles position uncertainty",
        },
        {
          Approach: "Compliance control learning",
          "Data Volume": "500-2K demonstrations with impedance data",
          "Key Modalities": "F/T + joint torque + stiffness parameters",
          "Torque Data": "Essential for impedance learning",
          Strengths: "Adaptive; safe for delicate assemblies",
        },
        {
          Approach: "RL with torque reward shaping",
          "Data Volume": "100K+ sim episodes + 500 real demos",
          "Key Modalities": "Sim torque + real F/T for calibration",
          "Torque Data": "Reward signal from torque targets",
          Strengths: "Optimizes tightening strategy; handles variation",
        },
        {
          Approach: "Sim-to-Real transfer",
          "Data Volume": "500K sim + 200 real calibration",
          "Key Modalities": "Simulated thread contact + real torque profiles",
          "Torque Data": "Calibration between sim and real",
          Strengths: "Scalable across fastener types",
        },
      ],
    },
    {
      type: "prose",
      heading: "State of the Art in Learned Screw Driving",
      paragraphs: [
        "The Factory framework (Narang et al., 2022) introduced high-fidelity simulation of threaded fastener assembly in NVIDIA IsaacGym. By modeling thread geometry at the mesh level, Factory enables training RL policies for screw insertion with realistic torque feedback. Policies trained in Factory achieve 92% success on M4 screw insertion with sim-to-real transfer, dropping to 85% on M2 screws where the tighter tolerances amplify the sim-to-real gap in thread contact dynamics. The key limitation is that simulated thread friction diverges from reality at the fine-grained torque level needed for cross-threading detection, requiring real-world calibration data.",
        "IndustReal (Tang et al., 2023) extended Factory with domain randomization specifically designed for assembly tasks, including screw driving. By randomizing thread friction, hole position uncertainty, and driver alignment, IndustReal achieves 91% screw insertion success across M3-M6 screws in real-world evaluation. The critical insight was that reward shaping based on torque profile matching — rewarding the RL policy for producing torque curves similar to successful real insertions — reduced the sim-to-real gap from 25% to 8% compared to position-only rewards.",
        "For production screw driving, ABB and Kuka have deployed learning-based fastening cells that continuously adapt from operational data. These systems collect torque profiles from every screw insertion (typically 10,000-100,000 per day across a production line) and use anomaly detection to identify emerging quality issues before they cause defects. The learning component classifies each insertion into categories: nominal, borderline (successful but atypical torque profile suggesting tool wear or material variation), and failed (cross-threaded, stripped, or undertorqued). This continuous learning approach achieves 99.7% quality rates with automatic adaptation to new product variants within 50-100 insertions.",
        "Recent advances in multi-modal learning for screw driving combine vision for hole finding with torque feedback for insertion control. Diffusion Policy applied to screw driving (Chi et al., 2023) achieves 96% success on a benchmark with 3 mm positional uncertainty in hole location — a 12-percentage-point improvement over the position-only baseline. The policy learns a two-phase strategy: vision-guided approach to approximately locate the hole, then torque-guided spiral search for precise thread engagement. This mirrors the human strategy of feeling for the thread rather than trying to achieve perfect visual alignment.",
      ],
    },
    {
      type: "prose",
      heading: "Collection Methodology for Screw Driving Data",
      paragraphs: [
        "Screw driving data collection requires specialized instrumented drivers and fixtures. The minimum setup includes an electric screwdriver or nut runner with integrated torque transducer (resolution 0.001 Nm, sampling at 1000+ Hz), a 6-axis force/torque sensor at the robot wrist for measuring lateral forces during hole search, and an overhead camera for workspace observation. The torque transducer must be on the driver spindle (not the wrist F/T sensor) to capture the high-frequency thread engagement signatures that occur at the tool tip. Wrist-mounted F/T data provides complementary information about alignment forces during the approach phase.",
        "Fixtures should present realistic screw insertion scenarios: threaded holes in metal plates (aluminum, steel), plastic housings, and mixed-material assemblies. Position the holes with controlled offset from nominal (0-3 mm random offset per trial) to generate diversity in the hole-finding phase. Use multiple screw types (M2, M3, M4, M5, M6, M8) with both Phillips and hex drive styles to build a multi-fastener dataset. Each screw type produces different torque profiles due to thread pitch, engagement length, and head seating characteristics.",
        "Each demonstration should capture the complete fastening cycle: approach to approximate hole location, hole search (spiral or linear scan), thread engagement detection, run-down, final tightening to target torque, and driver retraction. Annotate with: screw type and size, target torque, achieved torque, angular position at each phase boundary, torque profile classification (nominal, cross-threaded, stripped, undertorqued, overtorqued), hole offset from nominal position, and total cycle time. For cross-threading studies, intentionally create 10-20% of demonstrations with misaligned insertions to capture the characteristic failure torque signatures.",
        "Collection throughput for screw driving data depends on cycle time and setup complexity. Single-screw insertion cycles take 3-8 seconds, enabling 400-1,000 insertions per hour with automated fixture repositioning. For multi-screw assembly sequences (e.g., 4-screw panel fastening), cycle times increase to 20-40 seconds per sequence but provide richer sequential data. Plan for 1,000-5,000 insertions per screw type for torque profile classification, and 200-500 complete assembly sequences for end-to-end policy learning.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Key Datasets and Benchmarks for Robotic Screw Driving",
      description:
        "Screw driving datasets are predominantly proprietary. Public benchmarks exist primarily in simulation, creating opportunity for real-world demonstration datasets.",
      columns: [
        "Dataset / Benchmark",
        "Year",
        "Scale",
        "Fastener Types",
        "Key Features",
        "Limitations",
      ],
      rows: [
        {
          "Dataset / Benchmark": "Factory / IndustReal (NVIDIA)",
          Year: "2022-2023",
          Scale: "Unlimited sim generation + 200 real",
          "Fastener Types": "M3-M6 simulated threads",
          "Key Features": "High-fidelity thread simulation; RL training",
          Limitations: "Sim torque diverges from real; limited screw types",
        },
        {
          "Dataset / Benchmark": "NIST Task Board screw tasks",
          Year: "2023",
          Scale: "~500 real insertion episodes",
          "Fastener Types": "M4, M5 hex screws",
          "Key Features": "Real robot; force/torque; standardized",
          Limitations: "Small scale; few screw types",
        },
        {
          "Dataset / Benchmark": "ABB production fastening data",
          Year: "Ongoing",
          Scale: "10K-100K insertions/day per line",
          "Fastener Types": "Application-specific",
          "Key Features": "Production scale; continuous collection",
          Limitations: "Proprietary; not publicly available",
        },
        {
          "Dataset / Benchmark": "RLBench screw subtasks",
          Year: "2020",
          Scale: "100 demonstrations per variant",
          "Fastener Types": "Simplified screw primitives",
          "Key Features": "Part of standard manipulation benchmark",
          Limitations: "Simplified physics; no real torque data",
        },
        {
          "Dataset / Benchmark": "ManiSkill2 peg-screw tasks",
          Year: "2023",
          Scale: "100K+ sim episodes",
          "Fastener Types": "Peg variants approximating screws",
          "Key Features": "Large-scale sim; diverse configurations",
          Limitations: "Peg insertion, not true screw threading",
        },
      ],
    },
    {
      type: "prose",
      heading: "How Claru Supports Screw Driving Data Needs",
      paragraphs: [
        "Claru provides screw driving data collection with instrumented fastening stations designed for high-frequency torque capture and multi-fastener diversity. Each station features an electric screwdriver with integrated torque transducer (0.001 Nm resolution, 1000 Hz sampling), a 6-axis wrist-mounted force/torque sensor for alignment force measurement, calibrated cameras for hole finding, and configurable fixtures supporting M2-M8 fasteners in metal, plastic, and composite materials.",
        "Our collection protocol covers the full fastening cycle from approach through final torque verification, with controlled positional offset randomization (0-3 mm) to generate diverse hole-finding demonstrations. We collect both successful insertions and intentional failure modes (cross-threading, stripping) to provide the positive and negative examples needed for robust torque-profile classification. Operators follow standardized fastening procedures aligned to ISO 5393 torque specifications.",
        "Claru delivers screw driving datasets with high-frequency torque profiles (1000 Hz), wrist force/torque data (500 Hz), angular position tracking, and per-insertion quality annotations — formatted for torque-profile classifiers, Diffusion Policy, impedance learning, or custom architectures. Our throughput of 400-1,000 insertions per hour per station enables rapid scaling from research-scale datasets (1K-5K insertions) to production-grade corpora (50K+ insertions) covering multiple fastener types and assembly configurations.",
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        {
          id: "narang-factory-2022",
          title: "Factory: Fast Contact for Robotic Assembly",
          authors: "Narang et al.",
          venue: "RSS 2022",
          year: 2022,
          url: "https://arxiv.org/abs/2205.03532",
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
          id: "chi-diffusion-2023",
          title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
          authors: "Chi et al.",
          venue: "RSS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2303.04137",
        },
        {
          id: "inoue-screw-2017",
          title: "Deep Reinforcement Learning for High Precision Assembly Tasks",
          authors: "Inoue et al.",
          venue: "IROS 2017",
          year: 2017,
          url: "https://doi.org/10.1109/IROS.2017.8202244",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "What torque sampling rate is needed for screw driving data?",
      answer:
        "A minimum of 1000 Hz is required to capture thread engagement transients, which typically last 10-30 ms. At 500 Hz, the engagement spike may span only 5-15 samples, insufficient for reliable cross-threading detection. Industrial torque transducers (Atlas Copco, Kistler) commonly sample at 2000-4000 Hz. The wrist force/torque sensor can sample at a lower rate (500 Hz) since it captures the slower alignment forces during hole search, not the fast thread engagement dynamics.",
    },
    {
      question: "How many insertions per screw type are needed?",
      answer:
        "For torque profile classification (success vs. cross-thread detection), 1,000-5,000 insertions per screw type with 10-20% intentional failures provide robust training data. For end-to-end screw driving policy learning via behavioral cloning, 200-500 complete cycle demonstrations per screw type suffice with Diffusion Policy. Start with your most common screw type and 500 insertions to validate the pipeline, then scale to additional types. Each new screw type requires separate demonstrations because torque profiles differ significantly across thread pitches.",
    },
    {
      question: "Can screw driving data from simulation replace real data?",
      answer:
        "Simulation (Factory/IndustReal) is effective for learning the approach and hole-finding phases but inadequate for thread engagement characterization. Real thread friction, surface finish variation, and material deformation produce torque profiles that diverge significantly from simulation. The sim-to-real gap for torque prediction is 25-40%, versus 5-10% for position-only metrics. Use simulation for pretraining the approach policy, then real data (200+ insertions per screw type) for torque-based thread engagement and cross-threading detection.",
    },
    {
      question: "How do you capture cross-threading failures safely?",
      answer:
        "Set a torque limit at 3-5x the expected thread engagement torque as a hard stop to prevent fastener damage. During collection, intentionally offset the screw axis by 0.5-1.5 degrees from the hole axis to induce cross-threading without damaging the fixture. Monitor torque in real time and abort insertions that exceed the safety limit. Capture the partial insertion torque profile up to the abort point — these truncated profiles are the training signal for cross-threading detection. Plan for 150-500 cross-threading examples per screw type.",
    },
  ],
  ctaHeading: "Get a Custom Quote for Screw Driving Data",
  ctaDescription:
    "Tell us about your fastening requirements — screw types, torque specifications, and production volumes — and we will design a data collection plan for your assembly application.",
  relatedGlossaryTerms: [
    "force-torque-data",
    "contact-rich-manipulation",
    "proprioceptive-data",
    "behavioral-cloning",
    "sim-to-real-gap",
  ],
  relatedGuidePages: [
    "how-to-build-a-contact-rich-manipulation-dataset",
    "how-to-label-robot-demonstrations",
  ],
  relatedSolutionSlugs: [],
  dataRequirements: {
    modality: "Spindle torque (1000+ Hz) + 6-axis wrist F/T + RGB + angular position + proprioception",
    volumeRange: "1K-50K insertions per screw type",
    temporalResolution: "1000 Hz spindle torque, 500 Hz wrist F/T, 30 Hz video, per-insertion annotations",
    keyAnnotations: [
      "Complete torque profile with phase segmentation (engage, run-down, tighten)",
      "Cross-threading detection labels with torque anomaly markers",
      "Target torque vs achieved torque with angular data",
      "Hole position offset from nominal",
      "Screw type, size, and drive style classification",
      "Cycle time and success/failure with failure mode",
    ],
  },
  relevantModels: [
    "Diffusion Policy",
    "Factory / IndustReal",
    "Torque profile classifiers",
    "Impedance learning policies",
    "Residual RL fine-tuning",
    "Compliance control learning",
  ],
  environmentTypes: [
    "Electronics assembly station",
    "Automotive fastening cell",
    "Appliance assembly line",
    "Aerospace fastening station",
    "Medical device assembly",
    "Laboratory benchmark workspace",
  ],
  keyPapers: [
    {
      id: "narang-factory-2022",
      title: "Factory: Fast Contact for Robotic Assembly",
      authors: "Narang et al.",
      venue: "RSS 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2205.03532",
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
      id: "chi-diffusion-2023",
      title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
      authors: "Chi et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2303.04137",
    },
    {
      id: "inoue-screw-2017",
      title: "Deep Reinforcement Learning for High Precision Assembly Tasks",
      authors: "Inoue et al.",
      venue: "IROS 2017",
      year: 2017,
      url: "https://doi.org/10.1109/IROS.2017.8202244",
    },
  ],
  claruRelevance:
    "Claru provides screw driving data collection with instrumented fastening stations featuring electric screwdrivers with integrated torque transducers (0.001 Nm resolution, 1000 Hz), 6-axis wrist force/torque sensors (500 Hz), calibrated cameras for hole finding, and configurable fixtures supporting M2-M8 fasteners across metal, plastic, and composite materials. Our collection protocol covers complete fastening cycles with controlled positional randomization and intentional failure mode capture (cross-threading, stripping). Operators follow ISO 5393 torque specifications. Deliverables include high-frequency torque profiles, wrist F/T data, angular position tracking, and per-insertion quality annotations formatted for torque classifiers, Diffusion Policy, impedance learning, or custom architectures. Throughput of 400-1,000 insertions per hour enables rapid scaling from 1K research datasets to 50K+ production corpora.",
};

export default data;
