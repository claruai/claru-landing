import type { LabPageData } from "./types";

const page: LabPageData = {
  slug: "boston-dynamics",
  companyName: "Boston Dynamics",
  companyDescription:
    "Boston Dynamics builds the world's most advanced mobile robots: Spot (autonomous quadruped, 1,500+ deployments), Stretch (warehouse case unloading), and Atlas (electric humanoid for manufacturing). Founded in 1992 as a MIT spin-off by Marc Raibert, acquired by Hyundai Motor Group for $880 million in 2021, the company is now transitioning from viral demonstration videos to AI-powered commercial autonomy — partnering with Google DeepMind to accelerate Atlas's manipulation intelligence and deploying Spot across industrial facilities worldwide.",
  keyProducts: [
    "Atlas (all-electric humanoid, Hyundai manufacturing)",
    "Spot (autonomous quadruped, 1,500+ enterprise deployments)",
    "Stretch (warehouse case unloading robot)",
  ],
  researchFocus: [
    "AI-powered autonomous manipulation for manufacturing",
    "Dynamic locomotion with learned controllers",
    "Autonomous industrial inspection and monitoring",
    "Warehouse logistics automation at scale",
    "Sim-to-real transfer for locomotion and manipulation",
  ],
  dataNeedsSummary:
    "Boston Dynamics' strategic shift from scripted demonstrations to AI-powered autonomy creates data demands that the company has never faced before. The new electric Atlas needs manufacturing manipulation data for automotive assembly at Hyundai. Spot's expanding autonomous inspection deployments require visual and thermal data from diverse industrial facilities to train anomaly detection models. Stretch needs warehouse case-picking data at scale. The DeepMind partnership specifically targets the data bottleneck — teaching Atlas new manipulation tasks faster through data-efficient learning methods.",
  dataNeeds: [
    {
      title: "Manufacturing manipulation demonstrations for Atlas",
      source: "Atlas electric humanoid announcement (April 2024) and Hyundai partnership for automotive manufacturing",
      description:
        "Manipulation demonstrations for automotive assembly tasks — part insertion, cable routing, heavy panel positioning, bolt driving — captured with multi-modal sensors in real factory environments. Requires sub-millimeter positioning accuracy under varying lighting, vibration, and temperature conditions found on real production lines.",
    },
    {
      title: "Industrial facility inspection data for Spot",
      source: "Spot enterprise deployment portfolio: power plants, construction sites, oil refineries, data centers",
      description:
        "Visual, thermal, and acoustic inspection data from diverse industrial facilities for training autonomous inspection and anomaly detection models. Each facility type has unique equipment layouts, thermal signatures, normal operating patterns, and failure modes. Spot currently performs 1,500+ autonomous inspection missions but needs broader training data to generalize across facility types.",
    },
    {
      title: "Dynamic locomotion data across terrain types",
      source: "Atlas and Spot locomotion research history, DARPA challenge heritage",
      description:
        "Real-world locomotion data on challenging terrain — rubble, stairs, slopes, wet surfaces, loose gravel, construction debris — with full kinematic, IMU, foot-force, and visual data for validating sim-to-real transfer. Both Atlas (bipedal) and Spot (quadrupedal) face the fundamental gap between simulated and real-world ground contact dynamics.",
    },
    {
      title: "Warehouse case-picking data for Stretch",
      source: "Stretch commercial deployment documentation and DHL/Maersk partnership announcements",
      description:
        "Case-picking demonstrations from real warehouse environments with diverse product assortments — varying box sizes, weights, surface textures, stacking patterns, and conveyor configurations. Stretch must handle the full distribution of product SKUs found in real fulfillment centers, not just the uniform boxes in laboratory demonstrations.",
    },
    {
      title: "Multi-site environmental recordings for cross-facility generalization",
      source: "Boston Dynamics enterprise sales documentation showing diverse deployment environments",
      description:
        "Visual and spatial recordings of manufacturing plants, warehouses, construction sites, power plants, and oil refineries to pretrain perception systems on the visual distributions of actual deployment environments. Current data is concentrated in Boston Dynamics' Waltham facility and a small number of partner sites.",
    },
  ],
  dataMatches: [
    {
      labNeed: "Manufacturing manipulation demonstrations for Atlas",
      claruOffering: "Custom Manipulation Data Collection in Industrial Environments",
      rationale:
        "Claru can deploy collectors with teleoperation rigs and multi-camera setups in partner manufacturing facilities to capture the specific manipulation tasks Atlas needs for automotive production work. Collection across multiple factory environments provides the visual and operational diversity that single-site data from Hyundai's Savannah plant cannot.",
    },
    {
      labNeed: "Industrial facility inspection data for Spot",
      claruOffering: "Egocentric Activity Dataset + Custom Industrial Collection Campaigns",
      rationale:
        "Claru's existing egocentric video provides visual pretraining data for Spot's perception system. Targeted collection campaigns in diverse industrial facilities — power plants, construction sites, manufacturing floors — produce the facility-type diversity that Spot needs to generalize inspection capabilities across deployment environments.",
    },
    {
      labNeed: "Dynamic locomotion data across terrain types",
      claruOffering: "Custom Locomotion Data Collection with Body-Worn Sensors",
      rationale:
        "Claru's global collector network can capture body-worn IMU, foot-force, and camera data across diverse terrain conditions in dozens of real-world locations — construction sites, outdoor environments, industrial floors, stairways — providing the surface-property distributional coverage that sim-to-real locomotion transfer requires.",
    },
    {
      labNeed: "Warehouse case-picking data for Stretch",
      claruOffering: "Custom Warehouse Manipulation Collection",
      rationale:
        "Claru can coordinate case-picking data collection across partner warehouse facilities with real product assortments, capturing the box-type, weight, and stacking diversity that Stretch encounters in production deployment across DHL, Maersk, and other logistics customers.",
    },
  ],
  keyPapers: [
    {
      id: "atlas-electric-2024",
      title: "Introducing the New Atlas",
      authors: "Boston Dynamics",
      venue: "Company Announcement",
      year: 2024,
      url: "https://bostondynamics.com/atlas",
    },
    {
      id: "lee-locomotion-2020",
      title: "Learning Quadrupedal Locomotion over Challenging Terrain",
      authors: "Lee et al.",
      venue: "Science Robotics, Vol 5",
      year: 2020,
      url: "https://arxiv.org/abs/2010.11251",
    },
    {
      id: "brohan-rt2-2023",
      title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
      authors: "Brohan et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2307.15818",
    },
    {
      id: "miki-wild-locomotion-2022",
      title: "Learning Robust Perceptive Locomotion for Quadrupedal Robots in the Wild",
      authors: "Miki et al.",
      venue: "Science Robotics, Vol 7",
      year: 2022,
      url: "https://arxiv.org/abs/2201.08117",
    },
    {
      id: "radosavovic-humanoid-2024",
      title: "Real-World Humanoid Locomotion with Reinforcement Learning",
      authors: "Radosavovic et al.",
      venue: "Science Robotics, Vol 9",
      year: 2024,
      url: "https://arxiv.org/abs/2303.03381",
    },
  ],
  technicalAnalysis:
    "Boston Dynamics' transition from hydraulic showpieces to AI-powered commercial robots represents one of the most significant strategic pivots in robotics history. For three decades, the company built the world's most mechanically impressive robots — but relied primarily on hand-tuned controllers and scripted behaviors. The retirement of the hydraulic Atlas in April 2024 and the unveiling of an all-electric redesign built around AI marks a fundamental change in technical philosophy.\n\nThe DeepMind partnership, announced in October 2024, is the clearest signal of this shift. Google DeepMind brings the VLA paradigm (RT-2, RT-X) and massive-scale robot learning expertise, while Boston Dynamics contributes the most mechanically capable robot platforms in existence. The partnership specifically targets teaching Atlas new manipulation tasks more quickly — addressing the data bottleneck that limited the old approach of hand-programming each behavior. Initial Atlas deployments at DeepMind facilities and Hyundai plants are scheduled for 2026.\n\nThe electric Atlas runs its AI on NVIDIA processors, features a three-fingered gripper with tactile sensing, and is designed for the structured-but-variable environment of automotive manufacturing. The manipulation challenge here is substantial: automotive assembly involves high-precision tasks — inserting bolts, routing cables, positioning heavy panels — that require sub-millimeter accuracy under varying conditions. Each assembly line has different configurations, tolerances, and environmental factors. Hyundai operates dozens of plants worldwide, each with unique tooling and part geometries. Training manipulation policies that generalize across these facilities requires demonstration data from multiple real factory environments.\n\nSpot's autonomous inspection business generates a fundamentally different but equally demanding data requirement. With over 1,500 active enterprise deployments, Spot operates in power plants, oil refineries, construction sites, data centers, mines, and hazardous waste facilities. Each industrial facility has unique visual characteristics, equipment layouts, thermal baselines, and anomaly patterns. A thermal anomaly in a power plant (overheating transformer) looks nothing like an anomaly in an oil refinery (leaking valve). Spot's inspection AI must learn facility-specific baselines while maintaining generalizable anomaly detection — requiring training data from diverse industrial environments.\n\nThe locomotion dimension spans all three platforms but is most critical for Atlas. While Boston Dynamics pioneered dynamic locomotion through model-based control — Raibert's foundational work on running machines at MIT in the 1980s led directly to Spot and Atlas — their AI-driven approach requires real-world terrain data that captures surface properties (friction, compliance, texture) that MuJoCo and Isaac Sim approximate poorly. The gap between simulated and real-world ground contact is the primary cause of locomotion failures during deployment. Real locomotion recordings with synchronized IMU, foot-force, and visual data from challenging terrain provide the grounding signal for sim-to-real transfer.\n\nStretch's warehouse automation business faces its own data scaling challenge. Deployed at DHL, Maersk, and other major logistics providers for case unloading from trailers, Stretch must handle the enormous variety of product packaging found in real fulfillment: different box sizes, weights, surface textures, labeling positions, and stacking patterns. A policy trained on uniform shipping boxes in a laboratory fails when confronted with the long tail of real-world product packaging.",

  metaTitle: "Training Data for Boston Dynamics Atlas, Spot & Stretch | Claru",
  metaDescription:
    "Industrial manipulation, facility inspection, and locomotion data for Boston Dynamics' AI-powered Atlas, Spot, and Stretch robot platforms.",
  primaryKeyword: "Boston Dynamics training data",
  secondaryKeywords: ["Atlas robot data", "Spot training data", "industrial robot data", "manipulation data for manufacturing"],
  canonicalPath: "/for/boston-dynamics",
  h1: "Training Data for Boston Dynamics",
  heroSubtitle:
    "Boston Dynamics is transitioning from scripted demonstrations to AI-powered autonomy, partnering with Google DeepMind for Atlas's intelligence. Here is how real-world data supports that transformation across Atlas, Spot, and Stretch.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Labs", href: "/for" },
    { label: "Boston Dynamics", href: "/for/boston-dynamics" },
  ],
  sections: [
    {
      type: "prose",
      heading: "About Boston Dynamics",
      paragraphs: [
        "Boston Dynamics was founded in 1992 as a spin-off from MIT by Marc Raibert, whose foundational research on running machines in the 1980s established the principles of dynamic locomotion that still underpin the company's robots today. After acquisitions by Google (2013), SoftBank (2017), and Hyundai Motor Group ($880 million, 2021), the company is now positioned as Hyundai's robotics division with a mandate to deploy robots in automotive manufacturing, logistics, and industrial inspection at commercial scale.",
        "In April 2024, Boston Dynamics retired the hydraulic Atlas — famous for its viral videos of backflips, parkour, and dance routines — and unveiled a completely redesigned all-electric Atlas built for commercial deployment. The electric Atlas runs AI on NVIDIA processors, features a three-fingered gripper with tactile sensing for manipulation, and has begun real-world testing at Hyundai's manufacturing facility in Savannah, Georgia. Production has started at Boston Dynamics' headquarters in Waltham, Massachusetts.",
        "In October 2024, Boston Dynamics announced a partnership with Google DeepMind to accelerate Atlas's AI capabilities. The partnership focuses specifically on teaching the robot new manipulation tasks more quickly and improving its contextual understanding of factory and warehouse operations — leveraging DeepMind's VLA expertise (RT-2, RT-X) combined with Boston Dynamics' unmatched hardware. Initial customer deployments of the electric Atlas are scheduled for 2026 at both DeepMind and Hyundai facilities.",
      ],
    },
    {
      type: "stats",
      heading: "Boston Dynamics at a Glance",
      stats: [
        { value: "1992", label: "Founded (MIT spin-off)" },
        { value: "$880M", label: "Hyundai Acquisition" },
        { value: "3", label: "Commercial Platforms" },
        { value: "1,500+", label: "Spot Deployments" },
        { value: "DeepMind", label: "AI Partner (2024)" },
        { value: "2026", label: "Atlas Customer Deployments" },
      ],
    },
    {
      type: "prose",
      heading: "The Electric Atlas Transformation",
      paragraphs: [
        "The transition from hydraulic to electric Atlas represents more than a hardware redesign — it is a fundamental shift in how Boston Dynamics approaches robot intelligence. The hydraulic Atlas relied heavily on pre-programmed behaviors and model-based control, with each impressive demonstration requiring extensive manual tuning by engineers. The electric Atlas is designed around AI-powered autonomy, using learned manipulation and locomotion policies that adapt to new tasks and environments without per-task engineering.",
        "This AI-first architecture creates data requirements that the old Boston Dynamics never faced. The electric Atlas must learn manipulation skills for automotive assembly from demonstration data rather than hand-coded routines. Its three-fingered gripper with integrated tactile sensing needs training data that captures the contact dynamics of real factory tasks — inserting bolts, routing cables, handling heavy panels with sub-millimeter precision. These contact dynamics vary by part geometry, material, and environmental conditions in ways that require real-world data to capture.",
        "The DeepMind partnership targets exactly this capability gap. DeepMind brings the VLA paradigm and expertise in large-scale robot learning from the RT-2 and RT-X projects, while Boston Dynamics provides the most mechanically capable humanoid platform in existence. The combination requires real-world factory data from multiple manufacturing environments — a data collection challenge that neither organization can solve from their own laboratories alone.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Boston Dynamics Platforms: Data Needs by Robot",
      description: "Each Boston Dynamics platform has distinct data requirements shaped by its deployment context.",
      columns: ["Dimension", "Atlas (Electric)", "Spot", "Stretch"],
      rows: [
        { Dimension: "Primary Domain", "Atlas (Electric)": "Automotive manufacturing", Spot: "Industrial inspection", Stretch: "Warehouse logistics" },
        { Dimension: "Key Task", "Atlas (Electric)": "Assembly manipulation", Spot: "Anomaly detection", Stretch: "Case unloading" },
        { Dimension: "Data Type Needed", "Atlas (Electric)": "Manipulation demos + factory env", Spot: "Visual/thermal inspection data", Stretch: "Case-picking recordings" },
        { Dimension: "Diversity Requirement", "Atlas (Electric)": "Multiple factory configurations", Spot: "Many facility types", Stretch: "Product SKU variety" },
        { Dimension: "AI Partner", "Atlas (Electric)": "Google DeepMind (VLA)", Spot: "Internal AI team", Stretch: "Internal AI team" },
        { Dimension: "Deployment Scale", "Atlas (Electric)": "Pilot (2026)", Spot: "1,500+ active", Stretch: "Growing (DHL, Maersk)" },
      ],
    },
    {
      type: "prose",
      heading: "Data Requirements Analysis",
      paragraphs: [
        "Boston Dynamics' data needs span three distinct robot platforms, each with unique requirements. Atlas needs manufacturing manipulation demonstrations from real factory floors — authentic automotive components, production-line configurations, and industrial environmental conditions. Spot needs visual and thermal inspection data from diverse industrial facilities to train autonomous anomaly detection that generalizes across facility types. Stretch needs warehouse logistics data with real product assortments and conveyor configurations.",
        "The environmental diversity requirement is acute across all platforms. Each manufacturing facility has different tooling, lighting, floor vibration characteristics, and workspace layouts. Each industrial inspection site has unique equipment, thermal signatures, and anomaly patterns. Each warehouse has different product mixes, shelf configurations, and traffic patterns. Policies trained at a single site overfit to that site's characteristics — a Spot inspection model trained at one power plant may flag normal conditions at a different plant as anomalies because the visual baseline differs.",
        "The locomotion dimension spans Atlas and Spot. While Boston Dynamics pioneered dynamic locomotion through Raibert's model-based control principles, their AI-driven approach requires real-world terrain data with surface properties — friction coefficients, compliance characteristics, texture patterns — that MuJoCo and Isaac Sim approximate poorly. Real locomotion recordings from challenging terrain (rubble, wet concrete, stairs, slopes) provide the distributional grounding for reliable sim-to-real transfer.",
      ],
    },
    {
      type: "prose",
      heading: "How Claru Supports Boston Dynamics",
      paragraphs: [
        "Claru's ability to deploy collectors with multi-camera and force-sensing rigs in real manufacturing environments addresses Atlas's core data need. By collecting manipulation demonstrations with authentic automotive components under real factory conditions — including industrial lighting, floor vibrations, and production-line noise — Claru provides training data that laboratory mockups cannot replicate. Collection across multiple manufacturing facilities provides the cross-site variation that single-factory data misses.",
        "For Spot's inspection applications, Claru can coordinate visual and thermal data collection campaigns across diverse industrial facilities — power plants, construction sites, refineries, data centers. Each facility contributes unique visual characteristics, equipment layouts, and environmental conditions that make inspection models more robust across deployment sites. This multi-site data is critical for training anomaly detection that distinguishes genuine anomalies from site-specific normal variation.",
        "Claru's global collector network also provides the terrain and environment diversity needed for locomotion validation across both Atlas and Spot platforms. Body-worn IMU and camera data collected on construction sites, outdoor environments, and industrial facilities across 100+ cities gives Boston Dynamics the real-world distributional grounding needed for sim-to-real locomotion transfer.",
      ],
    },
    {
      type: "cards",
      heading: "Core Data Requirements",
      cards: [
        {
          title: "Industrial Manipulation",
          description: "High-precision manipulation demonstrations in real automotive manufacturing environments with authentic tooling, parts, and factory conditions.",
          icon: "🏭",
        },
        {
          title: "Facility Inspection",
          description: "Visual and thermal data from diverse industrial facilities for training Spot's autonomous anomaly detection and inspection capabilities.",
          icon: "🔍",
        },
        {
          title: "Terrain Locomotion",
          description: "Real-world walking and movement data on challenging surfaces — rubble, stairs, wet concrete, slopes — with full kinematic recordings.",
          icon: "🏔️",
        },
        {
          title: "Warehouse Logistics",
          description: "Case picking and conveyor loading demonstrations with diverse product assortments for Stretch's warehouse automation deployments.",
          icon: "📦",
        },
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        {
          id: "atlas-electric-2024",
          title: "Introducing the New Atlas",
          authors: "Boston Dynamics",
          venue: "Company Announcement",
          year: 2024,
          url: "https://bostondynamics.com/atlas",
        },
        {
          id: "lee-locomotion-2020",
          title: "Learning Quadrupedal Locomotion over Challenging Terrain",
          authors: "Lee et al.",
          venue: "Science Robotics, Vol 5",
          year: 2020,
          url: "https://arxiv.org/abs/2010.11251",
        },
        {
          id: "brohan-rt2-2023",
          title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
          authors: "Brohan et al.",
          venue: "CoRL 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2307.15818",
        },
        {
          id: "miki-wild-locomotion-2022",
          title: "Learning Robust Perceptive Locomotion for Quadrupedal Robots in the Wild",
          authors: "Miki et al.",
          venue: "Science Robotics, Vol 7",
          year: 2022,
          url: "https://arxiv.org/abs/2201.08117",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "How is Boston Dynamics' data needs changing with the electric Atlas?",
      answer: "The new electric Atlas is designed for AI-powered autonomous manipulation in manufacturing, unlike the hydraulic Atlas which relied on hand-programmed scripted movements. This shift requires massive amounts of real-world manipulation training data — teleoperated demonstrations of assembly tasks, factory environment recordings, and multi-modal sensor data. The DeepMind partnership targets exactly this need, bringing VLA expertise (RT-2, RT-X) to bear on Atlas's manipulation learning.",
    },
    {
      question: "What data does Spot need for autonomous industrial inspection?",
      answer: "Spot needs diverse visual and thermal data from many different industrial facility types — power plants, construction sites, refineries, data centers, mines. Each facility has unique visual characteristics, equipment layouts, thermal baselines, and anomaly patterns. With 1,500+ active deployments, Spot's inspection AI must generalize across facility types, which requires training data from a broad cross-section of industrial environments.",
    },
    {
      question: "How does the DeepMind partnership affect Atlas's data requirements?",
      answer: "The DeepMind partnership brings VLA (Vision-Language-Action) model expertise to Atlas, following the paradigm established by RT-2: co-train a vision-language backbone on both web data and robot demonstrations to produce a model that reasons about manipulation tasks. This approach requires large-scale robot demonstration data paired with language instructions — the same data pipeline that RT-2, OpenVLA, and Octo consume. The partnership specifically aims to reduce the amount of data needed to teach Atlas new tasks.",
    },
    {
      question: "How does real-world terrain data improve Boston Dynamics' locomotion?",
      answer: "While Boston Dynamics pioneered model-based locomotion control through Raibert's foundational work, their AI-driven approaches require real terrain data with surface properties (friction, compliance, texture) that simulators approximate poorly. The sim-to-real gap is the primary cause of locomotion failures during deployment. Real locomotion recordings with synchronized IMU, foot-force, and visual sensors from challenging surfaces provide the distributional grounding for reliable transfer from simulation to real-world conditions.",
    },
    {
      question: "What data does Stretch need for warehouse automation?",
      answer: "Stretch handles case unloading from trailers in warehouses operated by DHL, Maersk, and other logistics providers. The robot must handle enormous product variety — different box sizes, weights, surface textures, labeling positions, and stacking patterns. Training data must capture this full distribution of real-world product packaging rather than the uniform boxes used in laboratory demonstrations. Multi-site warehouse data with real product assortments is essential for robust deployment.",
    },
  ],
  ctaHeading: "Support Boston Dynamics' AI Transition",
  ctaDescription: "Discuss purpose-built data for Atlas manipulation, Spot inspection, and Stretch logistics applications.",
  relatedGlossaryTerms: ["humanoid-robot", "sim-to-real-gap", "dexterous-manipulation", "proprioceptive-data"],
  relatedGuidePages: ["how-to-collect-teleoperation-data", "how-to-bridge-sim-to-real-gap"],
  relatedSolutionSlugs: [],
};

export default page;
