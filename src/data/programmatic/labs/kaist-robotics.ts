import type { LabPageData } from "./types";

const page: LabPageData = {
  slug: "kaist-robotics",
  companyName: "KAIST Robotics",
  companyDescription:
    "Korea Advanced Institute of Science and Technology (KAIST) is a leading robotics research center in Asia. KAIST's HUBO Lab, directed by Professor Jun Ho Oh, created the DRC-HUBO humanoid that won the 2015 DARPA Robotics Challenge. Their research spans humanoid locomotion, disaster response robotics, and industrial automation. KAIST's proximity to Samsung, Hyundai, and LG creates a strong industry-research pipeline that connects cutting-edge academic work to Korean manufacturing needs.",
  keyProducts: [
    "HUBO Humanoid",
    "DRC-HUBO (DARPA Challenge Winner)",
    "Albert HUBO",
    "PIBOT (Aircraft Pilot Robot)",
  ],
  researchFocus: [
    "Humanoid locomotion in disaster and industrial environments",
    "Industrial manipulation for Korean manufacturing",
    "Transformer-style humanoid design (walking + wheeled modes)",
    "Human-robot collaboration in factories",
    "Autonomous aerial and field robotics",
  ],
  dataNeedsSummary:
    "KAIST's robotics research bridges Korean manufacturing industry needs with cutting-edge humanoid development. Their DRC-HUBO lineage demands locomotion data from disaster and industrial environments, while Samsung, Hyundai, and LG partnerships require manipulation data specific to Korean electronics and automotive manufacturing processes. The geographic bias in existing robotics datasets — overwhelmingly Western — creates an additional need for data from Asian environments.",
  dataNeeds: [
    {
      title: "Disaster environment locomotion data",
      source:
        "DRC-HUBO research and DARPA Robotics Challenge legacy (Kim et al., Journal of Field Robotics 2015)",
      description:
        "Locomotion recordings in degraded environments — rubble, uneven terrain, partially collapsed structures — with full kinematic and force measurements for disaster response robot training. The DRC revealed that lab-trained robots fail catastrophically in real disaster conditions.",
    },
    {
      title: "Korean manufacturing manipulation data",
      source:
        "Industry partnerships with Samsung, Hyundai, and LG",
      description:
        "Manipulation demonstrations for electronics assembly, automotive part handling, and semiconductor manufacturing processes specific to Korean industrial standards and workflows.",
    },
    {
      title: "Multi-terrain outdoor navigation",
      source: "PIBOT and field robotics research programs",
      description:
        "Navigation data across diverse Korean terrain — urban streets, mountain trails, coastal areas, industrial zones — for outdoor mobile robot deployment beyond controlled indoor environments.",
    },
    {
      title: "Human-robot collaborative handoff data",
      source:
        "KAIST factory automation research with Korean manufacturers",
      description:
        "Recordings of human-to-robot and robot-to-human object transfers in manufacturing settings, with timing, force profiles, and safety-relevant coordination signals for shared workspace operation.",
    },
    {
      title: "Asian domestic environment data",
      source:
        "KAIST assistive robotics research for Korean residential settings",
      description:
        "Navigation and manipulation data from Korean homes — smaller rooms, floor-level living areas, Korean kitchen layouts, and household objects like rice cookers, ondol heating systems, and traditional furniture — which differ substantially from Western training data.",
    },
  ],
  dataMatches: [
    {
      labNeed: "Disaster environment locomotion data",
      claruOffering: "Custom Terrain Locomotion Collection",
      rationale:
        "Claru can collect body-worn sensor data in challenging terrain conditions across its global network, including construction sites and industrial environments that approximate the debris-strewn conditions where disaster response robots must operate.",
    },
    {
      labNeed: "Korean manufacturing manipulation data",
      claruOffering: "Custom Industrial Manipulation Collection",
      rationale:
        "Claru's collector network includes Asian locations where manufacturing-specific data collection can capture the processes and standards relevant to Korean industry partners like Samsung and Hyundai.",
    },
    {
      labNeed: "Multi-terrain outdoor navigation",
      claruOffering:
        "Egocentric Activity Dataset + Custom Outdoor Collection",
      rationale:
        "Claru's existing egocentric data includes outdoor navigation. Targeted collection in diverse Asian terrain types provides the geographic variety needed for robust outdoor navigation models.",
    },
    {
      labNeed: "Asian domestic environment data",
      claruOffering: "Custom Asian Domestic Environment Collection",
      rationale:
        "Claru's collectors in Asian cities can capture navigation and manipulation data in authentic Korean and Asian domestic settings — floor-level living areas, compact kitchens, culturally specific household objects — addressing the Western bias in current training datasets.",
    },
  ],
  keyPapers: [
    {
      id: "kim-kaist-drc-2015",
      title:
        "Team KAIST's Humanoid Robot DRC-HUBO in the DARPA Robotics Challenge Finals",
      authors: "Kim et al.",
      venue: "Journal of Field Robotics, Vol 34, No 2",
      year: 2015,
      url: "https://onlinelibrary.wiley.com/doi/abs/10.1002/rob.21680",
    },
    {
      id: "oh-hubo-2017",
      title:
        "Technical Overview of the HUBO Humanoid Robot Platform",
      authors: "Oh et J.H. et al.",
      venue: "IROS 2017",
      year: 2017,
      url: "https://ieeexplore.ieee.org/document/8205228",
    },
    {
      id: "park-loco-2019",
      title:
        "Robust Locomotion Control for Biped Robots over Rough Terrain",
      authors: "Park et al.",
      venue: "IROS 2019",
      year: 2019,
      url: "https://ieeexplore.ieee.org/document/8967688",
    },
    {
      id: "lim-hubo-design-2007",
      title:
        "Mechanical Design of the Humanoid Robot Platform, HUBO",
      authors: "Lim et al.",
      venue: "Advanced Robotics, Vol 21, No 11",
      year: 2007,
      url: "https://www.tandfonline.com/doi/abs/10.1163/156855307781503781",
    },
    {
      id: "lee-quadrupedal-2020",
      title:
        "Learning Quadrupedal Locomotion over Challenging Terrain",
      authors: "Lee et al.",
      venue: "Science Robotics, Vol 5",
      year: 2020,
      url: "https://arxiv.org/abs/2010.11251",
    },
    {
      id: "kim-transformer-hubo-2015",
      title:
        "Design of a Humanoid Robot for Disaster Response: DRC-HUBO+",
      authors: "Kim et al.",
      venue: "Humanoids 2015",
      year: 2015,
      url: "https://ieeexplore.ieee.org/document/7363437",
    },
  ],
  technicalAnalysis:
    "KAIST's HUBO humanoid lineage represents one of the most successful humanoid programs in history. Professor Jun Ho Oh built the first HUBO in 2004, and the program has iterated through multiple generations. Their DRC-HUBO won the 2015 DARPA Robotics Challenge — a $3.5 million first prize — by demonstrating capabilities in driving vehicles, opening doors, climbing stairs, and using tools in degraded disaster environments. The key innovation was DRC-HUBO's transformer design: the robot could switch between walking upright on two legs and rolling on four wheels by bending its knees, giving it both humanoid dexterity and wheeled stability.\n\nThe DARPA Robotics Challenge revealed a critical data gap that remains relevant today. Robots trained in laboratory conditions failed catastrophically when encountering real-world terrain variability — many fell repeatedly on flat ground, let alone rubble or stairs. Teams that performed well had collected extensive test data in conditions approximating the competition environment. This lesson drives KAIST's ongoing need for diverse locomotion data collected in authentically challenging terrain, not just flat laboratory floors.\n\nKAIST's proximity to Korean industrial giants creates research opportunities unavailable to most academic labs. Samsung's semiconductor fabrication requires sub-millimeter precision manipulation in cleanroom environments. Hyundai's automotive assembly demands high-payload handling with safety-critical human-robot coordination. LG's electronics manufacturing involves delicate component assembly with diverse part geometries. Training robots for these tasks requires manipulation data collected in actual Korean manufacturing environments with authentic components and processes specific to each industry.\n\nThe geographic dimension is significant and underappreciated. Virtually all major robotics training datasets — Open X-Embodiment, Bridge, DROID — are collected in North American and European environments. Asian environments differ meaningfully: different architectural styles, street layouts, signage systems, household objects, and cultural conventions. Korean homes feature ondol floor heating, floor-level dining, compact galley kitchens, and household objects like rice cookers, kimchi refrigerators, and low tables. KAIST's research on domestic assistive robots would benefit enormously from data collected across Asian environments, which Claru's global collector network can provide from locations throughout the Asia-Pacific region.\n\nThe Albert HUBO project — which combined a HUBO body with a Hanson Robotics animatronic Einstein head — illustrates KAIST's interest in human-robot interaction beyond pure manipulation. As humanoid robots move toward commercial deployment in Korean factories and homes, the data requirements expand beyond locomotion and manipulation to include interaction data: how humans naturally communicate with, hand objects to, and coordinate with robotic coworkers.",

  metaTitle: "Training Data for KAIST Robotics & HUBO Lab | Claru",
  metaDescription:
    "Disaster locomotion, manufacturing manipulation, and multi-terrain navigation data for KAIST's robotics research programs and Korean industry partnerships.",
  primaryKeyword: "KAIST robotics training data",
  secondaryKeywords: [
    "HUBO humanoid data",
    "Korean robotics data",
    "disaster robot training data",
    "Asian manufacturing robot data",
  ],
  canonicalPath: "/for/kaist-robotics",
  h1: "Training Data for KAIST Robotics",
  heroSubtitle:
    "KAIST won the DARPA Robotics Challenge and partners with Korea's manufacturing giants. Here is how real-world data supports both research frontiers.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Labs", href: "/for" },
    { label: "KAIST Robotics", href: "/for/kaist-robotics" },
  ],
  sections: [
    {
      type: "prose",
      heading: "About KAIST Robotics",
      paragraphs: [
        "The Korea Advanced Institute of Science and Technology is South Korea's premier science and engineering university, located in Daejeon. KAIST's HUBO Lab, directed by Professor Jun Ho Oh in the Department of Mechanical Engineering, has been developing humanoid robots since 2004 when the first HUBO was created. The lab has produced multiple generations of humanoid platforms, each advancing the state of the art in bipedal locomotion and whole-body control.",
        "KAIST's DRC-HUBO made global headlines by winning the 2015 DARPA Robotics Challenge Finals, defeating teams from MIT, CMU, NASA, and other top institutions. The $3.5 million prize validated KAIST's approach to humanoid design — particularly the transformer concept that allows the robot to switch between bipedal walking and wheeled locomotion. This design philosophy prioritized reliability in unstructured environments over raw athletic performance.",
        "Beyond the HUBO Lab, KAIST maintains active robotics research across multiple departments. The university's relationships with Samsung, Hyundai Motor Group, and LG create a research-to-industry pipeline that channels academic innovations into Korean manufacturing — the world's fourth-largest manufacturing economy by output.",
      ],
    },
    {
      type: "stats",
      heading: "KAIST Robotics at a Glance",
      stats: [
        { value: "2015", label: "DRC Challenge Winner" },
        { value: "2004", label: "First HUBO Built" },
        { value: "HUBO", label: "Flagship Humanoid" },
        { value: "$3.5M", label: "DARPA Prize Won" },
        { value: "Samsung", label: "Industry Partner" },
        { value: "Daejeon", label: "Location" },
      ],
    },
    {
      type: "prose",
      heading: "Research Focus and Key Projects",
      paragraphs: [
        "The HUBO Lab's primary research focus is robust humanoid locomotion in unstructured environments. DRC-HUBO's transformer design — which allows the robot to fold its legs and roll on knee-mounted wheels — was a direct response to the reliability challenges of bipedal walking on unpredictable terrain. This approach trades some humanoid mobility for dramatically improved stability, a pragmatic engineering choice that won the DARPA competition.",
        "KAIST's industry partnerships drive applied robotics research in manufacturing automation. Hyundai Motor Group's robotics investments connect directly to KAIST research on automotive assembly tasks, while Samsung's semiconductor manufacturing creates demand for precision manipulation in cleanroom environments. These partnerships produce research with immediate commercial relevance — and corresponding data requirements that academic datasets do not satisfy.",
        "The PIBOT project demonstrates KAIST's ambition beyond ground-based robotics. PIBOT is a humanoid robot designed to fly aircraft using standard cockpit controls — a task that requires visual perception, manual dexterity, and cognitive planning simultaneously. While primarily a research demonstration, PIBOT illustrates the breadth of manipulation and perception challenges that KAIST addresses.",
      ],
    },
    {
      type: "prose",
      heading: "Data Requirements Analysis",
      paragraphs: [
        "KAIST's data requirements fall into three categories: disaster-response locomotion, manufacturing manipulation, and domestic navigation for the Asian market. Each category has specific characteristics that existing Western-dominated datasets fail to address.",
        "For disaster locomotion, the lesson of the DARPA Robotics Challenge is that no amount of flat-floor laboratory testing prepares a robot for rubble, wet surfaces, loose debris, and structural instability. Real-world terrain data with full kinematic and force measurements — collected on construction sites, earthquake-damaged structures, and industrial facilities — provides the training signal that simulation alone cannot replicate.",
        "The manufacturing data need is domain-specific. Samsung semiconductor fabrication involves wafer handling in ISO Class 1 cleanrooms with specific vibration and contamination constraints. Hyundai automotive assembly involves high-payload manipulation with real car components in noisy, vibrating factory environments. These are fundamentally different data domains that require collection in authentic manufacturing settings.",
      ],
    },
    {
      type: "prose",
      heading: "How Claru Supports KAIST Robotics",
      paragraphs: [
        "Claru addresses the geographic and cultural data gap that limits KAIST's research. By deploying collectors across Asian cities, Claru provides navigation and manipulation data from environments that visually and spatially match KAIST's deployment targets — Korean homes, Asian factories, Asian street environments — rather than the Western environments that dominate current training datasets.",
        "For manufacturing data, Claru's ability to coordinate collection campaigns in industrial environments provides the domain-specific training data that KAIST's industry partnerships require. Multi-camera and force-sensing recording setups in real factories capture the authentic conditions — lighting, vibration, temperature, noise — that laboratory mockups cannot replicate.",
        "Claru's egocentric activity dataset also supports KAIST's research on human-robot interaction in shared workspaces. First-person video of human workers performing manufacturing and domestic tasks captures the natural movement patterns, timing, and coordination strategies that robots must learn to work alongside people safely.",
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        {
          id: "kim-kaist-drc-2015",
          title:
            "Team KAIST's Humanoid Robot DRC-HUBO in the DARPA Robotics Challenge Finals",
          authors: "Kim et al.",
          venue: "Journal of Field Robotics",
          year: 2015,
          url: "https://onlinelibrary.wiley.com/doi/abs/10.1002/rob.21680",
        },
        {
          id: "oh-hubo-2017",
          title:
            "Technical Overview of the HUBO Humanoid Robot Platform",
          authors: "Oh et al.",
          venue: "IROS 2017",
          year: 2017,
          url: "https://ieeexplore.ieee.org/document/8205228",
        },
        {
          id: "lee-quadrupedal-2020",
          title:
            "Learning Quadrupedal Locomotion over Challenging Terrain",
          authors: "Lee et al.",
          venue: "Science Robotics",
          year: 2020,
          url: "https://arxiv.org/abs/2010.11251",
        },
      ],
    },
  ],
  faqs: [
    {
      question:
        "What data did the DARPA Robotics Challenge reveal was missing?",
      answer:
        "The DRC showed that robots trained in labs fail in real disaster conditions. Varied terrain, degraded structures, poor lighting, and debris create conditions simulation cannot replicate. Teams that tested in realistic conditions performed best, demonstrating the value of diverse real-world locomotion data. Many robots fell repeatedly even on flat ground due to the gap between laboratory and real-world conditions.",
    },
    {
      question:
        "Why does KAIST need manufacturing-specific data from Korean factories?",
      answer:
        "Korean manufacturing — Samsung semiconductors, Hyundai automotive, LG electronics — involves precision processes with specific components, tolerances, and workflows. Generic manipulation data does not capture these domain-specific requirements. Samsung cleanroom wafer handling is fundamentally different from Hyundai assembly line bolt insertion. Data collected in actual Korean factories provides the task-specific training signal.",
    },
    {
      question:
        "How does geographic diversity help Asian robotics research?",
      answer:
        "Most robotics training data comes from North America and Europe. Asian environments differ in architecture, street layout, signage, household objects, and cultural conventions. Korean homes have floor heating, floor-level dining, and compact kitchen layouts. Models trained on Western data underperform in Asian settings because the visual and spatial distributions are fundamentally different.",
    },
    {
      question: "What made DRC-HUBO's transformer design innovative?",
      answer:
        "DRC-HUBO could switch between walking upright on two legs and rolling on four wheels by folding its knees to use built-in knee wheels. This transformer approach traded some humanoid mobility for dramatically improved stability on unstructured terrain — a pragmatic choice that won the DARPA competition by prioritizing reliability over athletic performance.",
    },
    {
      question:
        "How does KAIST's industry partnership model affect data needs?",
      answer:
        "KAIST works directly with Samsung, Hyundai, and LG on manufacturing robotics. These partnerships create highly specific data requirements tied to real production processes — semiconductor handling, automotive assembly, electronics manufacturing. Generic academic manipulation datasets do not cover these industrial domains, requiring purpose-collected data from actual factory environments.",
    },
  ],
  ctaHeading: "Data for Asian Robotics Innovation",
  ctaDescription:
    "Discuss diverse, region-specific training data for KAIST's robotics research and industry partnerships.",
  relatedGlossaryTerms: [
    "humanoid-robot",
    "sim-to-real-gap",
    "proprioceptive-data",
  ],
  relatedGuidePages: [
    "how-to-bridge-sim-to-real-gap",
    "how-to-collect-teleoperation-data",
  ],
  relatedSolutionSlugs: [],
};

export default page;
