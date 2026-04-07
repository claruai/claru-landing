import type { LabPageData } from "./types";

const page: LabPageData = {
  slug: "apptronik",
  companyName: "Apptronik",
  companyDescription:
    "Apptronik builds Apollo, a general-purpose humanoid robot designed for manufacturing and logistics. Spun out of the Human Centered Robotics Lab at UT Austin, the company combines academic locomotion research with a commercial focus on automotive and warehouse applications.",
  keyProducts: ["Apollo"],
  researchFocus: [
    "Humanoid locomotion for industrial environments",
    "Force-controlled manipulation",
    "Human-robot collaboration in manufacturing",
    "Autonomous material handling",
    "Whole-body compliant control",
  ],
  dataNeedsSummary:
    "Apptronik's partnership with Mercedes-Benz for automotive manufacturing deployment drives demand for factory-specific manipulation data, industrial locomotion recordings, and human-robot handoff interactions. Apollo's force-controlled actuators enable compliant manipulation but require training data that captures real contact dynamics with industrial objects.",
  dataNeeds: [
    {
      title: "Automotive manufacturing manipulation",
      source: "Mercedes-Benz partnership announcement, 2024",
      description: "Manipulation demonstrations for automotive assembly tasks — part retrieval, component insertion, material transport — in real factory floor conditions.",
    },
    {
      title: "Industrial locomotion and navigation",
      source: "Apollo deployment context in manufacturing facilities",
      description: "Walking and navigation data in factory environments with industrial flooring, conveyor obstacles, and dynamic human traffic patterns.",
    },
    {
      title: "Compliant manipulation with force feedback",
      source: "Apptronik's actuator design emphasis on force control",
      description: "Contact-rich manipulation recordings with force measurements for training compliant control policies — fitting parts, tightening connections, handling deformable materials.",
    },
    {
      title: "Human-robot handoff interaction data",
      source: "Mercedes-Benz collaborative deployment model with human workers",
      description: "Recordings of direct human-to-robot and robot-to-human object transfers on assembly lines, capturing timing, force profiles, and gaze-based coordination signals that enable safe collaborative handoffs.",
    },
    {
      title: "Heavy payload transport trajectories",
      source: "Apollo's 25 kg payload capacity specification and logistics use case",
      description: "Whole-body locomotion and manipulation data during heavy object carrying — pallets, automotive components, material bins — where payload mass alters walking dynamics and grasp stability.",
    },
  ],
  dataMatches: [
    {
      labNeed: "Automotive manufacturing manipulation",
      claruOffering: "Custom Industrial Manipulation Collection",
      rationale: "Claru can deploy collectors in manufacturing environments to capture demonstrations of assembly-line tasks using standardized multi-camera and force-sensing recording protocols.",
    },
    {
      labNeed: "Industrial locomotion and navigation",
      claruOffering: "Custom Facility Navigation Collection",
      rationale: "Body-worn sensor data collected in real manufacturing facilities captures floor conditions, obstacle patterns, and workspace layouts that simulation cannot faithfully model.",
    },
    {
      labNeed: "Compliant manipulation with force feedback",
      claruOffering: "Manipulation Trajectory Dataset with force annotations",
      rationale: "Claru's manipulation data captures contact-rich interactions with force measurements, providing the training signal needed for Apollo's compliant actuators to learn safe, force-aware manipulation.",
    },
    {
      labNeed: "Human-robot handoff interaction data",
      claruOffering: "Egocentric Activity Dataset + Custom Handoff Collection",
      rationale: "Claru's egocentric video captures natural human-to-human handoff patterns in workplace scenarios, and targeted collection campaigns can capture standardized handoff protocols with force and gaze instrumentation.",
    },
  ],
  keyPapers: [
    {
      id: "apptronik-apollo-2023",
      title: "Apollo: A General-Purpose Humanoid Robot",
      authors: "Apptronik",
      venue: "Company Technical Overview",
      year: 2023,
      url: "https://apptronik.com/apollo",
    },
    {
      id: "sentis-compliant-2010",
      title: "Compliant Control of Whole-Body Multi-Contact Behaviors in Humanoid Robots",
      authors: "Sentis et al.",
      venue: "Springer STAR Series",
      year: 2010,
      url: "https://link.springer.com/chapter/10.1007/978-3-642-14743-2_4",
    },
    {
      id: "pang-contact-rich-2023",
      title: "Global Planning for Contact-Rich Manipulation via Local Smoothing of Quasi-Dynamic Contact Models",
      authors: "Pang et al.",
      venue: "TRO 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2206.10787",
    },
    {
      id: "sentis-whole-body-2006",
      title: "A Whole-Body Control Framework for Humanoids Operating in Human Environments",
      authors: "Sentis, L. and Khatib, O.",
      venue: "ICRA 2006",
      year: 2006,
      url: "https://ieeexplore.ieee.org/document/1642051",
    },
    {
      id: "haddadin-collision-2017",
      title: "Robot Collisions: A Survey on Detection, Isolation, and Identification",
      authors: "Haddadin et al.",
      venue: "TRO 2017",
      year: 2017,
      url: "https://ieeexplore.ieee.org/document/7801880",
    },
    {
      id: "radosavovic-humanoid-2024",
      title: "Real-World Humanoid Locomotion with Reinforcement Learning",
      authors: "Radosavovic et al.",
      venue: "Science Robotics 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2303.03381",
    },
  ],
  technicalAnalysis:
    "Apptronik's academic pedigree from UT Austin's Human Centered Robotics Lab gives them deep expertise in force-controlled locomotion and manipulation. Apollo's actuator design emphasizes backdrivability and force sensing — making it well-suited for compliant manipulation tasks in manufacturing. However, this hardware capability creates a corresponding data requirement: training data must include force measurements alongside visual and kinematic recordings.\n\nThe Mercedes-Benz partnership defines Apollo's initial deployment context with high specificity. Automotive assembly involves a well-characterized set of manipulation primitives — pick, place, insert, fasten, route, inspect — but each task must be performed under real factory conditions with authentic parts, tooling, and environmental constraints. The gap between laboratory demonstrations and factory-floor conditions (lighting, noise, thermal effects, floor vibrations) requires training data collected in actual manufacturing environments.\n\nApollo's compliant control architecture enables safe human-robot interaction but requires careful calibration through data. Force-controlled robots need to learn appropriate impedance profiles for different tasks — stiff for precise insertion, compliant for handoffs with humans, variable for contact-rich assembly. This calibration requires manipulation data with rich force and torque annotations that capture the full spectrum of contact conditions.\n\nThe locomotion challenge for Apollo in manufacturing is distinct from warehouse or outdoor settings. Factory floors have specific surface properties, embedded rails, floor drains, and level changes between production zones. Forklift traffic creates dynamic obstacles. Apollo needs navigation data from real factories to learn environment-specific locomotion strategies.\n\nApptronik's emphasis on a 25 kg payload capacity adds a further dimension. Carrying heavy automotive parts changes the robot's center of mass dynamically, requiring locomotion controllers that adapt gait patterns in real time based on payload weight and geometry. Training data must pair locomotion recordings with varying payload conditions — empty-handed walking versus carrying asymmetric loads versus pushing carts — to produce controllers that remain stable across the full operational envelope.",

  metaTitle: "Training Data for Apptronik Apollo Humanoid Robot | Claru",
  metaDescription:
    "Manufacturing manipulation, industrial locomotion, and compliant control data for Apptronik's Apollo humanoid robot and its Mercedes-Benz deployment.",
  primaryKeyword: "Apptronik training data",
  secondaryKeywords: ["Apollo humanoid data", "manufacturing robot data", "force-controlled manipulation data", "Mercedes-Benz robotics"],
  canonicalPath: "/for/apptronik",
  h1: "Training Data for Apptronik",
  heroSubtitle:
    "Apptronik's Apollo humanoid targets automotive manufacturing with force-controlled manipulation. Here is how real-world factory data enables that deployment.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Labs", href: "/for" },
    { label: "Apptronik", href: "/for/apptronik" },
  ],
  sections: [
    {
      type: "prose",
      heading: "About Apptronik",
      paragraphs: [
        "Apptronik was founded in 2016 as a spinout from the University of Texas at Austin's Human Centered Robotics Lab, led by Dr. Luis Sentis. The company's core thesis is that humanoid robots should be designed around compliant, force-controlled actuators rather than position-controlled servos — enabling robots that can safely share workspaces with humans while performing contact-rich manufacturing tasks.",
        "The company's flagship robot, Apollo, stands 5 feet 8 inches tall and is designed for a broad range of logistics and manufacturing tasks. Apollo features proprietary actuators with integrated force-torque sensing at every joint, a modular battery system for full-shift operation, and a sensor suite that includes stereo vision, LiDAR, and proprioceptive feedback. In 2024, Apptronik announced a partnership with Mercedes-Benz to deploy Apollo in automotive manufacturing — one of the first humanoid-in-factory commitments by a major automaker.",
        "Apptronik has raised over $350 million in funding from investors including Google Ventures, DCVC, and Capital Factory. The company is headquartered in Austin, Texas and operates a manufacturing and testing facility where Apollo units are assembled and validated before deployment.",
      ],
    },
    {
      type: "stats",
      heading: "Apptronik at a Glance",
      stats: [
        { value: "2016", label: "Founded" },
        { value: "UT Austin", label: "Origin Lab" },
        { value: "$350M+", label: "Total Funding" },
        { value: "Apollo", label: "Flagship Robot" },
        { value: "25 kg", label: "Payload Capacity" },
        { value: "Mercedes", label: "Deployment Partner" },
      ],
    },
    {
      type: "prose",
      heading: "Research Focus and Key Projects",
      paragraphs: [
        "Apptronik's research program centers on three pillars: compliant whole-body control, industrial-grade locomotion, and human-robot collaborative manipulation. Their actuator technology, derived from Dr. Sentis's work on series elastic actuators, enables Apollo to detect and respond to external forces in real time — a critical safety requirement for robots operating alongside human workers on assembly lines.",
        "The Mercedes-Benz partnership is Apptronik's primary near-term deployment program. Apollo is being trained for specific automotive manufacturing tasks including part retrieval from bins, component transport between workstations, and light assembly operations. Each of these tasks demands manipulation data collected under real factory conditions — with authentic automotive parts, production-line lighting, and the environmental noise and vibration that characterize active manufacturing floors.",
        "Apptronik has also explored logistics applications, demonstrating Apollo performing box-moving and pallet-handling tasks in warehouse-like settings. These applications require different locomotion profiles than factory work — longer traversal distances, different floor surfaces, and navigation through dynamic warehouse traffic with forklifts and human pickers.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Apollo Compared to Other Humanoid Platforms",
      description: "How Apollo's specifications compare to competing humanoid robots in the manufacturing deployment space.",
      columns: ["Specification", "Apollo (Apptronik)", "Figure 02", "Digit (Agility)"],
      rows: [
        { "Specification": "Height", "Apollo (Apptronik)": "5 ft 8 in", "Figure 02": "5 ft 6 in", "Digit (Agility)": "5 ft 9 in" },
        { "Specification": "Payload", "Apollo (Apptronik)": "25 kg", "Figure 02": "20 kg", "Digit (Agility)": "16 kg" },
        { "Specification": "Actuation", "Apollo (Apptronik)": "Force-controlled", "Figure 02": "Electric servo", "Digit (Agility)": "Electric servo" },
        { "Specification": "Primary Domain", "Apollo (Apptronik)": "Manufacturing", "Figure 02": "Warehouse", "Digit (Agility)": "Logistics" },
        { "Specification": "Force Sensing", "Apollo (Apptronik)": "Every joint", "Figure 02": "End-effector", "Digit (Agility)": "End-effector" },
      ],
    },
    {
      type: "prose",
      heading: "Data Requirements Analysis",
      paragraphs: [
        "Apollo's force-controlled design creates data requirements that are qualitatively different from position-controlled humanoids. Every training demonstration must include force and torque measurements at each joint alongside visual and kinematic recordings. Standard robot learning datasets that capture only images and joint angles are insufficient — Apollo's compliant controllers need the full contact dynamics signal to learn appropriate impedance profiles.",
        "The automotive manufacturing context further constrains data requirements. Parts on an assembly line have specific tolerances, weights, and fragility characteristics. A robot inserting a wiring harness must apply different force profiles than one placing a heavy metal bracket. Training data must span this range of contact conditions with real automotive components to produce reliable manufacturing policies.",
        "Navigation data for factory environments must capture the unique challenges of manufacturing floors: embedded conveyor rails, floor-level cable trays, level changes between production zones, and the dynamic obstacle patterns created by forklift traffic and walking workers. These conditions differ substantially from the flat-floor warehouse data that dominates existing locomotion datasets.",
      ],
    },
    {
      type: "prose",
      heading: "How Claru Supports Apptronik",
      paragraphs: [
        "Claru's distributed collector network can capture factory-environment data that Apptronik cannot generate in their Austin testing facility alone. By deploying standardized multi-camera and force-sensing recording rigs in actual manufacturing environments — automotive plants, logistics centers, and assembly workshops — Claru provides the environmental diversity that makes manipulation and locomotion policies robust.",
        "For force-annotated manipulation data, Claru's collection protocols can integrate force-torque sensors into manipulation recording setups, producing the synchronized visual-kinematic-force data that Apollo's compliant controllers require. Each collection campaign captures contact dynamics with real industrial objects under authentic factory conditions.",
        "Claru's egocentric activity dataset also provides a complementary pretraining resource. First-person video of human workers performing assembly, transport, and inspection tasks captures the visual patterns and task structures that Apollo needs to understand — even before being mapped to specific robot actions through imitation learning.",
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        {
          id: "apptronik-apollo-2023",
          title: "Apollo: A General-Purpose Humanoid Robot",
          authors: "Apptronik",
          venue: "Company Technical Overview",
          year: 2023,
          url: "https://apptronik.com/apollo",
        },
        {
          id: "sentis-whole-body-2006",
          title: "A Whole-Body Control Framework for Humanoids Operating in Human Environments",
          authors: "Sentis, L. and Khatib, O.",
          venue: "ICRA 2006",
          year: 2006,
          url: "https://ieeexplore.ieee.org/document/1642051",
        },
        {
          id: "haddadin-collision-2017",
          title: "Robot Collisions: A Survey on Detection, Isolation, and Identification",
          authors: "Haddadin et al.",
          venue: "TRO 2017",
          year: 2017,
          url: "https://ieeexplore.ieee.org/document/7801880",
        },
        {
          id: "radosavovic-humanoid-2024",
          title: "Real-World Humanoid Locomotion with Reinforcement Learning",
          authors: "Radosavovic et al.",
          venue: "Science Robotics 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2303.03381",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "What data does Apptronik need for Apollo's manufacturing deployment?",
      answer: "Apollo needs manipulation demonstrations for automotive assembly tasks collected in real factory environments with authentic parts and tooling. It also requires force-annotated contact data for compliant control calibration and industrial locomotion recordings for factory-floor navigation with dynamic obstacles and varied flooring.",
    },
    {
      question: "Why is force data important for Apollo's training?",
      answer: "Apollo's backdrivable actuators enable force-controlled manipulation, but training policies need force and torque measurements to learn appropriate impedance profiles — stiff for precision insertion, compliant for human handoffs, variable for contact-rich assembly. Visual data alone cannot teach these force-dependent behaviors.",
    },
    {
      question: "How does factory environment data differ from lab data?",
      answer: "Real factories have specific lighting conditions, floor vibrations, thermal effects, noise levels, embedded rails, floor drains, and dynamic forklift traffic that lab environments cannot replicate. Policies trained only on lab data fail to generalize to these real-world conditions, making on-site data collection essential.",
    },
    {
      question: "What makes Apollo's actuator design unique among humanoids?",
      answer: "Apollo uses proprietary force-controlled actuators with integrated force-torque sensing at every joint, derived from UT Austin's research on series elastic actuators. Most competing humanoids use position-controlled servos with force sensing only at the end-effector. This whole-body force awareness enables safer human-robot collaboration but requires force-rich training data throughout the kinematic chain.",
    },
    {
      question: "How does heavy payload carrying affect Apollo's data requirements?",
      answer: "Apollo's 25 kg payload capacity means carrying heavy automotive parts shifts the robot's center of mass dynamically. Locomotion controllers must adapt gait in real time based on payload weight and geometry. Training data must pair walking recordings with varying payload conditions — empty-handed, symmetric loads, asymmetric loads — to produce stable controllers across the full operational envelope.",
    },
  ],
  ctaHeading: "Enable Apollo's Factory Deployment",
  ctaDescription: "Discuss purpose-built manufacturing data for Apptronik's humanoid robot applications.",
  relatedGlossaryTerms: ["humanoid-robot", "contact-rich-manipulation", "proprioceptive-data", "sim-to-real-gap"],
  relatedGuidePages: ["how-to-build-a-contact-rich-manipulation-dataset", "how-to-collect-teleoperation-data"],
  relatedSolutionSlugs: [],
};

export default page;
