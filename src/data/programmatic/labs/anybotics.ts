import type { LabPageData } from "./types";

const page: LabPageData = {
  slug: "anybotics",
  companyName: "ANYbotics",
  companyDescription: "ANYbotics develops autonomous legged robots for industrial inspection and hazardous environment operations. Founded in 2016 as a spin-off from ETH Zurich, the company builds ANYmal, a quadrupedal robot that autonomously navigates industrial facilities to perform inspection tasks. ANYbotics has raised over $50 million and deploys robots across energy, mining, and chemical facilities.",
  keyProducts: ["ANYmal D (autonomous quadrupedal robot)", "ANYmal X (ATEX-certified for hazardous zones)", "Workforce Intelligence (fleet management)"],
  researchFocus: ["Quadrupedal locomotion on industrial terrain", "Autonomous inspection and anomaly detection", "Reinforcement learning for locomotion", "Multi-sensor industrial perception", "Fleet autonomy for inspection routing"],
  dataNeedsSummary: "ANYbotics' deployment in industrial inspection requires training data from real industrial environments \u2014 oil refineries, chemical plants, power stations, mines \u2014 where autonomous robots must navigate complex terrain, detect equipment anomalies, and operate safely around human workers. The diversity of industrial environments and the specific visual patterns of equipment defects demand purpose-collected data.",
  dataNeeds: [
    {
        "title": "Industrial facility terrain recordings",
        "source": "ANYmal deployment documentation and terrain adaptation research",
        "description": "Visual and geometric recordings of industrial facility terrain: grated walkways, stairs, ramps, gravel, wet surfaces, cable trays. ANYmal must locomote reliably across these surfaces in all conditions."
    },
    {
        "title": "Equipment inspection imagery",
        "source": "ANYbotics inspection workflow documentation",
        "description": "Close-range visual recordings of industrial equipment \u2014 valves, gauges, pipes, electrical panels \u2014 in various states (normal, degraded, failed) for training anomaly detection models."
    },
    {
        "title": "Industrial navigation recordings",
        "source": "ANYmal autonomous navigation research, ETH Zurich",
        "description": "Sensor data from navigation through industrial facilities capturing the specific obstacle types, passage widths, and dynamic conditions (workers, vehicles, open hatches) that ANYmal encounters."
    }
],
  dataMatches: [
    {
        "labNeed": "Industrial facility terrain recordings",
        "claruOffering": "Custom Industrial LiDAR + Visual Collection",
        "rationale": "Claru can deploy sensors in partner industrial facilities to capture terrain geometry and visual appearance data across the diverse surfaces ANYmal must traverse."
    },
    {
        "labNeed": "Equipment inspection imagery",
        "claruOffering": "Custom Inspection Data Collection",
        "rationale": "Claru can coordinate close-range visual capture of industrial equipment across multiple facilities, building the defect detection training set ANYbotics needs for their inspection workflow."
    },
    {
        "labNeed": "Industrial navigation recordings",
        "claruOffering": "Custom Multi-Sensor Industrial Collection",
        "rationale": "Purpose-collected sensor data from diverse industrial environments provides the navigation training data that covers the specific obstacle types and passage geometries of real facilities."
    }
],
  keyPapers: [
    {
        "id": "hutter-anymal-2016",
        "title": "ANYmal \u2014 A Highly Mobile and Dynamic Quadrupedal Robot",
        "authors": "Hutter et al.",
        "venue": "IROS 2016",
        "year": 2016,
        "url": "https://arxiv.org/abs/1606.04557"
    },
    {
        "id": "lee-learning-2020",
        "title": "Learning Quadrupedal Locomotion over Challenging Terrain",
        "authors": "Lee et al.",
        "venue": "Science Robotics 2020",
        "year": 2020,
        "url": "https://arxiv.org/abs/2010.11251"
    },
    {
        "id": "miki-wild-2022",
        "title": "Learning Robust Perceptive Locomotion for Quadrupedal Robots in the Wild",
        "authors": "Miki et al.",
        "venue": "Science Robotics 2022",
        "year": 2022,
        "url": "https://arxiv.org/abs/2201.08117"
    }
],
  technicalAnalysis: "ANYbotics sits at the intersection of legged locomotion and industrial inspection \u2014 two domains where real-world data is both essential and difficult to obtain. ANYmal must navigate terrain that would challenge most wheeled or tracked robots: metal grated walkways, steep industrial stairs, uneven gravel surfaces, and areas cluttered with pipes, cables, and equipment.\n\nThe locomotion challenge for industrial environments is distinct from the outdoor walking that most legged robot research addresses. Industrial terrain includes specific surface types \u2014 grated metal with specific pitch, industrial stairs with non-standard dimensions, oil-slicked surfaces, and transitions between indoor and outdoor sections. Simulation can model some of these, but the contact dynamics of robot feet on grated metal or wet concrete require real-world data to calibrate.\n\nThe inspection task adds a perception dimension that locomotion alone does not address. ANYmal must not only navigate to inspection points but capture high-quality sensor data of equipment and then detect anomalies \u2014 corrosion, leaks, abnormal gauge readings, thermal hotspots. Training anomaly detection models requires labeled examples of both normal and degraded equipment conditions from real industrial facilities.\n\nScaling inspection to new facilities is the key growth challenge. Each industrial site has unique equipment configurations, terrain characteristics, and inspection requirements. ANYbotics must either collect site-specific training data for each new deployment or build models general enough to transfer across facilities. Diverse industrial environment data is the path to transferable models.",
  metaTitle: "Training Data for ANYbotics | Claru",
  metaDescription: "How real-world data addresses ANYbotics\'s training data requirements for robotic systems and AI-powered automation.",
  primaryKeyword: "ANYbotics training data",
  secondaryKeywords: ["anybotics data", "anybotics robot data", "ANYbotics AI training", "robotics training data anybotics"],
  canonicalPath: "/for/anybotics",
  h1: "Training Data for ANYbotics",
  heroSubtitle: "ANYbotics is building advanced robotic systems. Here is how real-world data accelerates their development from prototype to production deployment.",
  breadcrumbs: [{ label: "Home", href: "/" }, { label: "Labs", href: "/for" }, { label: "ANYbotics", href: "/for/anybotics" }],
  sections: [
    { type: "prose", heading: "About ANYbotics", paragraphs: ["ANYbotics develops autonomous legged robots for industrial inspection and hazardous environment operations. Founded in 2016 as a spin-off from ETH Zurich, the company builds ANYmal, a quadrupedal robot that autonomously navigates industrial facilities to perform inspection tasks. ANYbotics has raised over $50 million and deploys robots across energy, mining, and chemical facilities."] },
    { type: "stats", heading: "ANYbotics at a Glance", stats: [{ value: "2017+", label: "Founded" }, { value: "Series B+", label: "Funding Stage" }, { value: "Global", label: "Deployment" }, { value: "AI-First", label: "Approach" }] },
    { type: "prose", heading: "Data Requirements Analysis", paragraphs: ["ANYbotics' deployment in industrial inspection requires training data from real industrial environments \u2014 oil refineries, chemical plants, power stations, mines \u2014 where autonomous robots must navigate complex terrain, detect equipment anomalies, and operate safely around human workers. The diversity of industrial environments and the specific visual patterns of equipment defects demand purpose-collected data."] },
    { type: "prose", heading: "How Claru Supports ANYbotics", paragraphs: ["Claru addresses ANYbotics\'s data needs through purpose-built collection campaigns coordinated across our global network of 10,000+ collectors in 100+ cities. For manipulation data, Claru captures multi-modal recordings with dense annotations in diverse real-world environments. For perception pretraining, Claru\'s egocentric activity datasets provide the visual grounding data that AI systems need.", "Custom collection campaigns can target specific environments, object categories, and sensor configurations that ANYbotics\'s pipeline requires. Each dataset receives multi-layer annotation through Claru\'s quality-controlled pipeline and is delivered in any standard robotics format."] },
    { type: "citation-list", heading: "References", citations: [{"id": "hutter-anymal-2016", "title": "ANYmal \u2014 A Highly Mobile and Dynamic Quadrupedal Robot", "authors": "Hutter et al.", "venue": "IROS 2016", "year": 2016, "url": "https://arxiv.org/abs/1606.04557"}, {"id": "lee-learning-2020", "title": "Learning Quadrupedal Locomotion over Challenging Terrain", "authors": "Lee et al.", "venue": "Science Robotics 2020", "year": 2020, "url": "https://arxiv.org/abs/2010.11251"}, {"id": "miki-wild-2022", "title": "Learning Robust Perceptive Locomotion for Quadrupedal Robots in the Wild", "authors": "Miki et al.", "venue": "Science Robotics 2022", "year": 2022, "url": "https://arxiv.org/abs/2201.08117"}] }
  ],
  faqs: [
    { question: "What type of training data does ANYbotics need?", answer: "ANYbotics' deployment in industrial inspection requires training data from real industrial environments \u2014 oil refineries, chemical plants, power stations, mines \u2014 where autonomous robots must navigate complex terrain, detect equipment anomalies, and operate safely around human workers. The diversity of industrial environments and the specific visual patterns of equipment defects demand purpose-collected data." },
    { question: "How does real-world data help ANYbotics\'s sim-to-real transfer?", answer: "Simulation cannot faithfully model the contact dynamics, material properties, and environmental conditions that ANYbotics\'s robots encounter in deployment. Real-world data provides the distributional coverage that fills simulation gaps — authentic surfaces, lighting conditions, and object interactions from actual deployment environments." },
    { question: "Can Claru provide custom data collection for ANYbotics?", answer: "Yes. Claru operates a global network of 10,000+ data collectors across 100+ cities who can capture teleoperated demonstrations, egocentric video, and sensor data in target environments using standardized recording protocols." }
  ],
  ctaHeading: "Accelerate ANYbotics\'s Data Pipeline",
  ctaDescription: "Talk to our team about purpose-built datasets for ANYbotics\'s robotic systems.",
  relatedGlossaryTerms: ["manipulation-trajectory", "egocentric-video", "sim-to-real"],
  relatedGuidePages: [],
  relatedSolutionSlugs: []
};

export default page;
