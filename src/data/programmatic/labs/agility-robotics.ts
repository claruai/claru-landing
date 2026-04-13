import type { LabPageData } from "./types";

const page: LabPageData = {
  slug: "agility-robotics",
  companyName: "Agility Robotics",
  companyDescription:
    "Agility Robotics builds Digit, the first humanoid robot designed and built for real-world warehouse work. Founded in 2015 as a spin-out from Oregon State University by Jonathan Hurst and Damion Shelton, Agility has raised over $179 million and opened RoboFab — the world's first factory purpose-built for manufacturing humanoid robots — in Salem, Oregon. Digit is the only bipedal robot with active commercial deployments in Amazon fulfillment centers and GXO logistics warehouses.",
  keyProducts: [
    "Digit (commercial bipedal humanoid)",
    "RoboFab (humanoid manufacturing facility)",
  ],
  researchFocus: [
    "Bipedal locomotion on real warehouse floors",
    "Tote and bin manipulation for logistics",
    "Human-robot collaboration in shared workspaces",
    "Sim-to-real transfer for dynamic locomotion",
    "Perception-guided mobile manipulation",
  ],
  dataNeedsSummary:
    "Agility's deployment of Digit in Amazon and GXO warehouses creates acute demand for real-world warehouse navigation data, tote manipulation recordings, and human co-worker interaction patterns. Unlike research humanoids chasing general-purpose intelligence, Agility's commercial focus means they need data that captures the long-tail distribution of real warehouse conditions — varied lighting, floor conditions, obstacle configurations, and workflow patterns — at the fidelity required for safety-critical bipedal locomotion.",
  dataNeeds: [
    {
      title: "Warehouse navigation trajectories on real floors",
      source: "Agility Robotics partnership announcements with Amazon and GXO Logistics, 2023-2024",
      description:
        "Navigation paths through real warehouse aisles with varying congestion, floor conditions (polished concrete, dock plates, slope transitions, seams between floor sections), and dynamic obstacle layouts. Must capture the distributional diversity of floor friction coefficients, liquid spills, and uneven surfaces that simulation cannot faithfully reproduce for bipedal locomotion.",
    },
    {
      title: "Tote and bin manipulation recordings at scale",
      source: "Digit product specifications and Amazon BOS27 deployment documentation",
      description:
        "Pick-and-place demonstrations for standard warehouse totes (Amazon's yellow and black totes, GXO containers) with varying weights (1-25 kg), fill levels, orientations, and stacking configurations. Multi-viewpoint recordings with force sensing to capture grasp stability and tote-to-tote variation across thousands of picks.",
    },
    {
      title: "Human proximity and interaction data in shared workspaces",
      source: "Agility safety documentation, ANSI/RIA safety standards for collaborative robots",
      description:
        "Recordings of humans working near bipedal robots in warehouse environments — approach patterns, handoff interactions, collision-avoidance scenarios, and human intent prediction data. Safety-critical: Digit shares workspace with human packers and must predict human trajectories to avoid collisions while maintaining throughput.",
    },
    {
      title: "Dynamic locomotion on varied terrain and floor surfaces",
      source: "Agility CTO Jonathan Hurst's published work on bipedal locomotion and DARPA Robotics Challenge heritage",
      description:
        "Real-world locomotion data on commercial warehouse floors, loading docks, dock plates with slope transitions, and outdoor surfaces between warehouse buildings. Synchronized IMU, foot-contact, and visual data for validating sim-to-real transfer of locomotion controllers trained in Isaac Gym or MuJoCo.",
    },
    {
      title: "Conveyor and shelving interaction recordings",
      source: "Digit deployment videos showing conveyor-loading and shelf-stocking tasks",
      description:
        "Manipulation recordings of loading totes onto conveyors, placing items on shelves at varying heights, and retrieving items from deep shelving — tasks that combine locomotion (positioning the body), reaching (arm extension), and manipulation (grasping and placing) in a coordinated sequence.",
    },
  ],
  dataMatches: [
    {
      labNeed: "Warehouse navigation trajectories on real floors",
      claruOffering: "Custom Egocentric Collection in Warehouse Environments",
      rationale:
        "Claru's collector network can deploy body-worn cameras and IMUs in partner warehouses across its network of 100+ cities to capture hundreds of hours of navigation data with ground-truth paths, floor surface characterization, obstacle annotations, and environmental metadata. Multiple warehouse facilities provide the floor-condition diversity that single-site data collection misses.",
    },
    {
      labNeed: "Tote and bin manipulation recordings at scale",
      claruOffering: "Manipulation Trajectory Dataset + Custom Warehouse Collection",
      rationale:
        "Claru's manipulation data captures multi-camera object interaction recordings with temporal annotations. Targeted collection campaigns in warehouse facilities produce tote manipulation data with the weight, fill-level, and stacking variation that Digit encounters in production — not the clean, uniform objects found in lab demonstrations.",
    },
    {
      labNeed: "Human proximity and interaction data in shared workspaces",
      claruOffering: "Egocentric Activity Dataset + Custom Human-Robot Interaction Collection",
      rationale:
        "Claru's egocentric video captures humans performing activities in real-world settings, providing visual diversity for training human detection and proximity estimation models. Targeted collection in warehouse environments with natural human traffic patterns provides the interaction data Digit needs for safe co-working in shared spaces.",
    },
    {
      labNeed: "Dynamic locomotion on varied terrain and floor surfaces",
      claruOffering: "Custom Locomotion Data Collection with Body-Worn Sensors",
      rationale:
        "Claru can coordinate body-worn IMU, foot-force sensor, and camera data collection on diverse real-world surfaces — warehouse floors, loading docks, outdoor terrain — across dozens of locations, providing the ground-contact distributional coverage that sim-to-real locomotion transfer requires.",
    },
  ],
  keyPapers: [
    {
      id: "hurst-digit-2023",
      title: "Digit: A Platform for Legged Robot Research and Deployment",
      authors: "Agility Robotics",
      venue: "Company Technical Report",
      year: 2023,
      url: "https://agilityrobotics.com/digit",
    },
    {
      id: "radosavovic-humanoid-2024",
      title: "Real-World Humanoid Locomotion with Reinforcement Learning",
      authors: "Radosavovic et al.",
      venue: "Science Robotics, Vol 9",
      year: 2024,
      url: "https://arxiv.org/abs/2303.03381",
    },
    {
      id: "dao-sim2real-warehouse-2023",
      title: "Sim-to-Real Transfer for Mobile Manipulation in Warehouse Settings",
      authors: "Dao et al.",
      venue: "ICRA 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2301.11616",
    },
    {
      id: "hurst-spring-mass-2008",
      title: "The Role and Implementation of Compliance in Legged Locomotion",
      authors: "Hurst, J.W.",
      venue: "PhD Thesis, Carnegie Mellon University",
      year: 2008,
      url: "https://www.ri.cmu.edu/pub_files/2008/8/JonathanHurst_Thesis_Aug08.pdf",
    },
    {
      id: "agrawal-legged-2022",
      title: "Legged Locomotion in Challenging Terrains using Egocentric Vision",
      authors: "Agrawal et al.",
      venue: "CoRL 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2211.07638",
    },
  ],
  technicalAnalysis:
    "Agility Robotics occupies a unique position in the humanoid landscape: rather than pursuing general-purpose intelligence, they have narrowed Digit's initial deployment to warehouse logistics — a domain with predictable task structures but highly variable environmental conditions. This strategic focus means their data needs are simultaneously more specific and more demanding than general humanoid research. They do not need data covering every possible household task, but they need exhaustive coverage of the environmental variation within warehouses.\n\nThe core technical challenge for Digit in warehouse settings is robust bipedal locomotion on real warehouse floors. Commercial warehouses have polished concrete with varying friction coefficients, occasional liquid spills, uneven seams between floor sections, and dock plates with slope transitions. Digit's spring-loaded legs — a design inherited from Jonathan Hurst's PhD research at CMU on series-elastic actuators — give it compliance advantages over rigid-legged humanoids, but this compliance also means the locomotion controller is more sensitive to ground-contact dynamics. Simulated locomotion policies trained on flat terrain in Isaac Gym transfer poorly to these conditions. Agility needs hours of real locomotion data collected in actual warehouses with ground-truth foot contact measurements, IMU recordings, and environmental surface characterization.\n\nRoboFab represents a critical inflection point. When Agility opened the world's first humanoid robot factory in Salem, Oregon in 2023, they announced capacity to produce 10,000 Digits per year. This manufacturing scale creates an urgent data scaling challenge: each deployed Digit needs policies robust enough for the specific warehouse it operates in, while benefiting from shared representations learned across the full fleet's experience. The ratio of training data to deployed units must increase dramatically as production scales.\n\nManipulation presents a different but equally demanding challenge. Digit's end-effectors are designed for grasping standardized warehouse totes — a seemingly simple task that becomes complex when totes vary in weight (1-25 kg), fill level, surface friction (dry versus condensation-covered plastic), and stacking configuration. A tote at the bottom of a stack behaves differently than one on top. A tote packed with heavy items has different inertial properties than one with lightweight goods. Real-world manipulation data must capture these variations across thousands of picks to build policies that generalize beyond the narrow distributions seen in laboratory demonstrations.\n\nThe human-robot interaction dimension adds a safety-critical data requirement. Digit operates in shared spaces with human workers at Amazon's BOS27 facility and GXO warehouses, requiring accurate perception of human proximity, intent prediction, and safe motion planning. This demands training data collected in authentic mixed human-robot work environments — something that cannot be ethically or practically simulated at scale.",

  metaTitle: "Training Data for Agility Robotics & Digit | Claru",
  metaDescription:
    "Real-world warehouse navigation, tote manipulation, and human-robot interaction data for Agility Robotics' Digit bipedal robot deployments.",
  primaryKeyword: "Agility Robotics training data",
  secondaryKeywords: [
    "Digit robot data",
    "warehouse robot training data",
    "bipedal locomotion data",
    "logistics robot training",
  ],
  canonicalPath: "/for/agility-robotics",
  h1: "Training Data for Agility Robotics",
  heroSubtitle:
    "Agility Robotics is deploying Digit in real warehouses at Amazon and GXO. Here is how purpose-collected data addresses the sim-to-real challenges of commercial bipedal logistics.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Labs", href: "/for" },
    { label: "Agility Robotics", href: "/for/agility-robotics" },
  ],
  sections: [
    {
      type: "prose",
      heading: "About Agility Robotics",
      paragraphs: [
        "Agility Robotics was founded in 2015 by Jonathan Hurst and Damion Shelton as a spin-out from Oregon State University. Hurst, a former Carnegie Mellon robotics PhD whose thesis on series-elastic actuators for legged locomotion became foundational to the field, brought decades of bipedal locomotion research to a company focused on commercial deployment rather than academic demonstrations. The company has raised over $179 million from investors including Amazon Industrial Innovation Fund, DCVC, and Playground Global.",
        "Digit is the company's flagship product — a bipedal humanoid with 16+ degrees of freedom designed specifically for warehouse logistics work. Unlike humanoids from Figure AI or 1X Technologies that target general-purpose applications, Digit is purpose-built for moving totes, loading conveyors, and navigating warehouse aisles. This narrower scope allows Agility to optimize for a specific set of tasks while still facing the fundamental challenge of robust bipedal operation in uncontrolled environments.",
        "In 2023, Agility opened RoboFab in Salem, Oregon — the world's first factory purpose-built for manufacturing humanoid robots — with announced capacity to produce 10,000 Digit units per year. The same year, Amazon began testing Digit at its BOS27 fulfillment center in Massachusetts, marking the first commercial deployment of a bipedal humanoid in a real warehouse. GXO Logistics, the world's largest pure-play contract logistics provider, followed with its own Digit deployment program.",
      ],
    },
    {
      type: "stats",
      heading: "Agility Robotics at a Glance",
      stats: [
        { value: "2015", label: "Founded" },
        { value: "$179M+", label: "Total Funding" },
        { value: "16+ DOF", label: "Digit Joints" },
        { value: "Amazon", label: "Key Deployment Partner" },
        { value: "10,000/yr", label: "RoboFab Capacity" },
        { value: "GXO", label: "Logistics Partner" },
      ],
    },
    {
      type: "prose",
      heading: "Research Focus and Deployment Strategy",
      paragraphs: [
        "Agility's strategy diverges sharply from the general-purpose humanoid approach pursued by Figure AI, Tesla, and 1X Technologies. Rather than attempting to build a robot that can do anything, Agility focuses Digit on a specific, commercially viable niche: moving things in warehouses. This focus means Digit does not need to fold laundry, cook meals, or hold conversations. It needs to walk reliably on warehouse floors, pick up totes, load conveyors, and operate safely alongside human co-workers.",
        "The locomotion challenge is where Agility's academic heritage becomes most relevant. Hurst's research on spring-mass locomotion — the idea that efficient walking comes from storing and releasing energy in compliant leg structures, the same principle biological legs use — is embodied in Digit's mechanical design. Digit's legs use series-elastic actuators that provide compliance and energy efficiency but also make the controller more sensitive to ground-contact dynamics. A rigid-legged robot can brute-force its way through floor variations; Digit's compliant legs require more nuanced control that accounts for surface properties.",
        "The sim-to-real transfer problem is particularly acute for this reason. Locomotion policies trained in simulation must account for the specific compliance characteristics of Digit's actuators interacting with the specific surface properties of real warehouse floors — friction coefficients, surface compliance, seam geometry, slope angles. These properties vary between warehouses and even within a single warehouse (loading dock versus storage area versus mezzanine level).",
      ],
    },
    {
      type: "comparison-table",
      heading: "Digit vs. Other Warehouse Humanoids",
      description:
        "How Agility's Digit compares to other robots targeting warehouse and logistics automation.",
      columns: ["Dimension", "Digit (Agility)", "Atlas (Boston Dynamics)", "Stretch (Boston Dynamics)", "Optimus (Tesla)"],
      rows: [
        { Dimension: "Locomotion", "Digit (Agility)": "Bipedal (spring-loaded)", "Atlas (Boston Dynamics)": "Bipedal (electric)", "Stretch (Boston Dynamics)": "Wheeled base", "Optimus (Tesla)": "Bipedal" },
        { Dimension: "Primary Task", "Digit (Agility)": "Tote handling + conveyors", "Atlas (Boston Dynamics)": "Automotive assembly", "Stretch (Boston Dynamics)": "Case unloading", "Optimus (Tesla)": "General-purpose" },
        { Dimension: "Deployment Status", "Digit (Agility)": "Active (Amazon, GXO)", "Atlas (Boston Dynamics)": "Pilot (Hyundai)", "Stretch (Boston Dynamics)": "Active (multiple)", "Optimus (Tesla)": "Factory testing" },
        { Dimension: "Manufacturing", "Digit (Agility)": "RoboFab (10K/yr)", "Atlas (Boston Dynamics)": "Waltham HQ", "Stretch (Boston Dynamics)": "Waltham HQ", "Optimus (Tesla)": "Tesla factories" },
        { Dimension: "AI Approach", "Digit (Agility)": "RL + sim-to-real", "Atlas (Boston Dynamics)": "VLA (w/ DeepMind)", "Stretch (Boston Dynamics)": "Perception + planning", "Optimus (Tesla)": "End-to-end learning" },
      ],
    },
    {
      type: "prose",
      heading: "Data Requirements Analysis",
      paragraphs: [
        "Digit's data needs are shaped by its commercial deployment context. Unlike research robots that operate in controlled lab environments, Digit must perform reliably across the full distribution of conditions found in real commercial warehouses. This distribution is broader than most people realize: warehouses vary enormously in floor surface quality, lighting conditions (fluorescent versus LED versus natural light from loading docks), aisle width, racking configuration, ambient temperature, and human traffic patterns.",
        "The tote manipulation challenge scales with deployment breadth. Amazon alone uses multiple tote sizes and materials across its fulfillment network. GXO handles totes and containers from hundreds of different customers, each with different dimensions, weights, and surface properties. A policy trained on yellow Amazon totes at a single fulfillment center must generalize to different tote types at different facilities — requiring manipulation data with systematic variation across container types, weights, and environmental conditions.",
        "The human-robot interaction data requirement is the most safety-critical. Warehouse workers move unpredictably — carrying boxes that obstruct their vision, turning corners at speed, stopping suddenly to check labels. Digit must predict these behaviors to avoid collisions while maintaining the throughput its commercial viability depends on. This requires training data from real mixed human-robot environments with authentic human behavior patterns — not staged interactions where people know they are being recorded.",
      ],
    },
    {
      type: "prose",
      heading: "How Claru Supports Agility Robotics",
      paragraphs: [
        "Claru's distributed collector network across 100+ cities provides the multi-site warehouse data that Digit's generalization requires. By deploying collectors with body-worn cameras and IMUs in partner warehouse facilities, Claru captures navigation data with the floor-condition diversity, lighting variation, and aisle-configuration coverage that single-site collection cannot provide. Each warehouse contributes unique environmental characteristics — different floor coatings, different racking systems, different ambient conditions — that make trained policies more robust.",
        "For tote manipulation, Claru can coordinate collection campaigns that systematically vary tote type, weight, fill level, and stacking configuration across multiple facilities. This produces the manipulation data breadth that Digit needs to handle the full range of containers encountered in production logistics — not just the clean, uniform totes available in a laboratory setting.",
        "Claru's egocentric activity dataset of 386K+ clips also serves as a foundation for training Digit's human perception and intent prediction systems. The dataset captures humans performing activities in real-world environments with temporal annotations and activity labels, providing the visual diversity needed to recognize and predict human behavior in shared workspace scenarios. Targeted collection in active warehouse environments supplements this with logistics-specific human behavior patterns.",
      ],
    },
    {
      type: "cards",
      heading: "Core Data Requirements",
      cards: [
        {
          title: "Warehouse Navigation",
          description: "Bipedal locomotion on real warehouse floors with varied friction, obstacles, dock plates, and congestion patterns captured with body-worn sensors and ground-truth paths.",
          icon: "🏭",
        },
        {
          title: "Tote Manipulation",
          description: "Thousands of pick-and-place demonstrations with real warehouse totes varying in weight, fill level, surface condition, and stacking configuration.",
          icon: "📦",
        },
        {
          title: "Human-Robot Interaction",
          description: "Proximity and interaction data from shared human-robot workspaces for training safe co-working behaviors and human intent prediction.",
          icon: "🤝",
        },
        {
          title: "Environmental Diversity",
          description: "Sensor data from dozens of real warehouses capturing the long-tail distribution of lighting, floor, racking, and layout conditions.",
          icon: "🌍",
        },
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        {
          id: "hurst-digit-2023",
          title: "Digit: A Platform for Legged Robot Research and Deployment",
          authors: "Agility Robotics",
          venue: "Company Technical Report",
          year: 2023,
          url: "https://agilityrobotics.com/digit",
        },
        {
          id: "radosavovic-humanoid-2024",
          title: "Real-World Humanoid Locomotion with Reinforcement Learning",
          authors: "Radosavovic et al.",
          venue: "Science Robotics, Vol 9",
          year: 2024,
          url: "https://arxiv.org/abs/2303.03381",
        },
        {
          id: "agrawal-legged-2022",
          title: "Legged Locomotion in Challenging Terrains using Egocentric Vision",
          authors: "Agrawal et al.",
          venue: "CoRL 2022",
          year: 2022,
          url: "https://arxiv.org/abs/2211.07638",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "What data does Agility Robotics need for Digit's warehouse deployments?",
      answer:
        "Digit requires warehouse navigation trajectories on real floors with varied friction and surface conditions, tote manipulation demonstrations with diverse weights and container types, human-robot interaction data from shared workspaces, and multi-site environmental recordings. The focus is on capturing the distributional diversity of real commercial warehouse conditions that simulation cannot reproduce — especially for bipedal locomotion where ground-contact dynamics are safety-critical.",
    },
    {
      question: "Why can't Agility Robotics rely on simulated warehouse data alone?",
      answer:
        "Commercial warehouses have unique floor friction properties, surface compliance characteristics, lighting conditions, obstacle layouts, and human traffic patterns that simulators approximate poorly. Digit's spring-loaded bipedal locomotion is particularly sensitive to ground contact dynamics — small simulation errors in friction or surface compliance compound into unstable walking on real hardware. The gap between simulated and real warehouse floors is the primary cause of locomotion failures during deployment.",
    },
    {
      question: "How does Claru collect warehouse-specific training data?",
      answer:
        "Claru deploys collectors with standardized sensor packages (body-worn cameras, IMUs, force-sensing arrays) in partner warehouse facilities across its network of 100+ cities. Data is collected during actual warehouse operations to capture authentic environmental conditions, workflow patterns, and human activity. Multiple warehouse sites provide the cross-facility variation that single-site collection misses — different floor coatings, racking systems, lighting, and ambient conditions.",
    },
    {
      question: "What is RoboFab and why does it affect data requirements?",
      answer:
        "RoboFab is the world's first factory purpose-built for manufacturing humanoid robots, opened by Agility in Salem, Oregon in 2023 with capacity to produce 10,000 Digit units per year. This production scale dramatically increases data requirements: each deployed Digit needs policies robust enough for its specific warehouse, while benefiting from shared representations trained across fleet-wide data. The ratio of training data to deployed units must increase with manufacturing volume.",
    },
    {
      question: "How does Digit compare to other warehouse robots like Stretch?",
      answer:
        "Boston Dynamics' Stretch is a wheeled robot specialized for case unloading. Digit is bipedal, allowing it to navigate stairs, step over obstacles, and operate in spaces designed for human workers. This bipedal capability comes with greater data requirements — locomotion on two legs is fundamentally more complex than wheeled navigation, and Digit must handle the full range of terrain humans traverse in warehouses, including dock plates, ramps, and uneven floor seams.",
    },
  ],
  ctaHeading: "Support Digit's Real-World Deployment",
  ctaDescription:
    "Discuss purpose-collected warehouse data for Agility Robotics' bipedal logistics applications.",
  relatedGlossaryTerms: ["humanoid-robot", "sim-to-real-gap", "egocentric-video"],
  relatedGuidePages: ["how-to-collect-egocentric-video-data", "how-to-bridge-sim-to-real-gap"],
  relatedSolutionSlugs: [],
};

export default page;
