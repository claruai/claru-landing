import type { DatasetPageData } from "./types";

const data: DatasetPageData = {
  slug: "egocentric-assembly-line",
  metaTitle: "Egocentric Assembly Line Video Dataset for AI | Claru",
  metaDescription:
    "First-person manufacturing assembly line video with step-level annotations for training industrial cobots, quality inspection AI, and process automation. 70K+ clips across 25+ facility types.",
  primaryKeyword: "egocentric assembly line video dataset",
  secondaryKeywords: [
    "manufacturing robot training data",
    "first-person factory video",
    "assembly process video dataset",
    "industrial cobot training data",
    "quality inspection video data",
    "production line egocentric data",
  ],
  canonicalPath: "/datasets/egocentric-assembly-line",
  h1: "Egocentric Assembly Line Video Dataset",
  heroSubtitle:
    "First-person video of real manufacturing assembly tasks — part insertion, fastening, wiring, inspection — captured across diverse production facilities with step-level process annotations for training industrial cobots and quality monitoring AI.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Datasets", href: "/datasets" },
    { label: "Egocentric Assembly Line", href: "/datasets/egocentric-assembly-line" },
  ],
  sections: [
    {
      type: "prose",
      heading: "Why Assembly Line Video Data Matters for Robotics",
      paragraphs: [
        "Manufacturing assembly is the largest near-term market for collaborative robots. Automotive, electronics, appliance, and aerospace manufacturers spend billions on manual assembly tasks that cobots could perform or assist with. Training these cobots requires data captured on real production lines with the specific parts, tooling, fixtures, and environmental conditions of actual manufacturing environments — not simplified lab setups.",
        "The egocentric perspective captures what an assembly operator actually sees during work: parts at close range, hands navigating tight spaces, tooling engagement from the operator's viewpoint, and the visual cues that experienced workers use to verify assembly quality. This perspective maps directly to the camera viewpoint of a collaborative robot working alongside or replacing a human operator.",
        "Assembly tasks demand a level of sequential precision that distinguishes them from general manipulation. Each step must be completed in order, with specific torque values, alignment tolerances, and verification checks. Training data must capture this sequential structure with step-level annotations that preserve the process logic, not just the physical motions.",
      ],
    },
    {
      type: "stats",
      heading: "Dataset at a Glance",
      stats: [
        { value: "70K+", label: "Video clips" },
        { value: "480+", label: "Hours recorded" },
        { value: "25+", label: "Facility types" },
        { value: "14+", label: "Annotation layers" },
      ],
    },
    {
      type: "prose",
      heading: "Collection Methodology",
      paragraphs: [
        "Claru collectors wear head-mounted cameras while performing genuine assembly tasks on production lines. Collection covers automotive component assembly, electronics PCB population, appliance assembly, aerospace sub-assembly, and light manufacturing. Collectors follow real work instructions and use production tooling, generating data with authentic cycle times, quality checks, and error recovery procedures.",
        "Each collection session captures 30-120 minutes of continuous assembly work across multiple production cycles. Facilities span automotive OEMs and Tier 1 suppliers, consumer electronics manufacturers, appliance plants, and aerospace sub-assembly shops across North America, Europe, and Asia. This diversity ensures coverage of different tooling standards, ergonomic setups, and quality systems.",
        "Raw video is captured at 1080p at 30fps with optional depth from wrist-mounted RealSense sensors. Each session includes the work instruction document, bill of materials for assembled components, and process parameters (torque specs, alignment tolerances). This metadata enables researchers to correlate visual data with engineering specifications.",
      ],
    },
    {
      type: "cards",
      heading: "Annotation Layers",
      cards: [
        { title: "Assembly Step Segments", description: "Start/end timestamps for every discrete assembly operation mapped to work instruction steps. Enables training models that track process completion and detect step omissions.", icon: "🔧" },
        { title: "Part Identity Tracking", description: "Bounding boxes and identity labels for every component handled during assembly, tracked through insertion and fastening operations. Supports pick-and-place policy training.", icon: "📦" },
        { title: "Tool-Use Classification", description: "Per-frame labels for tool type and engagement state: torque driver active, rivet gun firing, test probe contacting. Essential for training tool-aware manipulation policies.", icon: "🛠️" },
        { title: "Quality Verification Points", description: "Annotations marking visual inspection moments, go/no-go checks, and measurement verification. Trains automated quality monitoring systems.", icon: "✅" },
      ],
    },
    {
      type: "comparison-table",
      heading: "Comparison with Public Assembly Datasets",
      description: "How Claru's assembly data compares to publicly available alternatives.",
      columns: ["Dataset", "Clips", "Hours", "Facilities", "Annotations"],
      rows: [
        { Dataset: "IndustReal", Clips: "~5K", Hours: "~20", Facilities: "1 lab", Annotations: "Keypoints, success/fail" },
        { Dataset: "Assembly101", Clips: "~100K", Hours: "513", Facilities: "1 lab setup", Annotations: "Actions, objects" },
        { Dataset: "IKEA ASM", Clips: "~17K", Hours: "35", Facilities: "3 setups", Annotations: "Actions, poses" },
        { Dataset: "Claru Assembly Line", Clips: "70K+", Hours: "480+", Facilities: "25+", Annotations: "Steps, parts, tools, quality, process params" },
      ],
    },
    {
      type: "prose",
      heading: "Use Cases and Model Training",
      paragraphs: [
        "Cobot manufacturers training manipulation policies for assembly tasks use this data to learn the step sequences, tool usage patterns, and force application strategies that experienced assembly operators demonstrate. The step-level annotations provide the process structure that enables cobots to track where they are in an assembly sequence and what comes next.",
        "Quality inspection AI systems train on the quality verification annotations to learn what visual features distinguish good assemblies from defective ones. The diversity of facility types ensures these models generalize across different product lines, lighting conditions, and quality standards rather than overfitting to a single production environment.",
        "Digital twin platforms for manufacturing use the process timing data to calibrate simulation models against real-world cycle times. The correlation between visual data and process parameters (torque values, alignment measurements) provides ground truth for validating simulation fidelity.",
      ],
    },
  ],
  faqs: [
    { question: "What types of manufacturing facilities are represented?", answer: "The dataset covers automotive component assembly, consumer electronics manufacturing, appliance production, aerospace sub-assembly, and general light manufacturing across 25+ facilities in North America, Europe, and Asia. Each facility type includes multiple product lines and assembly stations." },
    { question: "Are work instructions and process parameters included?", answer: "Yes. Each collection session includes the associated work instruction document, bill of materials, and relevant process parameters such as torque specifications and alignment tolerances. This enables researchers to correlate visual data with engineering requirements." },
    { question: "Can the data be delivered in RLDS or HDF5 format?", answer: "Yes. Claru delivers assembly line data in any standard robotics format including RLDS, HDF5, WebDataset, zarr, and LeRobot format. We handle all format conversion as part of the delivery pipeline." },
  ],
  ctaHeading: "Request an Assembly Line Sample Pack",
  ctaDescription: "Get a curated sample of egocentric assembly video with full annotations for your industrial robotics or quality inspection project.",
  relatedGlossaryTerms: ["egocentric-video", "activity-annotation", "temporal-annotation", "manipulation-trajectory"],
  relatedGuidePages: [],
  relatedSolutionSlugs: [],
  datasetProfile: {
    modalities: ["rgb", "depth"],
    totalClips: "70,000+",
    totalHours: "480+",
    annotationLayers: ["Assembly step segments", "Part identity tracking", "Tool-use classification", "Quality verification points", "Object bounding boxes", "Hand-tool contact"],
    formats: ["RLDS", "HDF5", "WebDataset", "MP4+JSON"],
    resolution: "1920x1080",
    fps: "30 fps",
  },
  comparisonWithPublic: [
    { name: "Assembly101", clips: "~100K", hours: "513", modalities: "RGB, depth", environments: "1 lab setup", annotations: "Actions, objects" },
    { name: "IndustReal", clips: "~5K", hours: "~20", modalities: "RGB, depth", environments: "1 lab", annotations: "Keypoints, success/fail" },
    { name: "IKEA ASM", clips: "~17K", hours: "35", modalities: "RGB, depth, IMU", environments: "3 setups", annotations: "Actions, poses" },
  ],
  useCases: [
    { modelType: "Cobot Assembly Policies", description: "Step-sequenced manipulation demonstrations train cobots to execute assembly workflows with process-aware decision making.", exampleModels: ["RT-2", "OpenVLA", "ACT"] },
    { modelType: "Quality Inspection AI", description: "Visual inspection annotations train automated quality monitoring systems for production-line deployment.", exampleModels: ["DINO", "SAM", "Grounding DINO"] },
    { modelType: "Process Digital Twins", description: "Cycle time and process parameter data calibrate manufacturing simulation models against real-world performance.", exampleModels: ["UniSim", "NVIDIA Omniverse"] },
  ],
  keyPapers: [
    { id: "sermanet-assembly101-2022", title: "Assembly101: A Large-Scale Multi-View Video Dataset for Understanding Procedural Activities", authors: "Sermanet et al.", venue: "CVPR 2022", year: 2022, url: "https://arxiv.org/abs/2203.14712" },
    { id: "tang-industreal-2023", title: "IndustReal: Transferring Contact-Rich Assembly Tasks from Simulation to Reality", authors: "Tang et al.", venue: "RSS 2023", year: 2023, url: "https://arxiv.org/abs/2305.17110" },
    { id: "brohan-rt2-2023", title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control", authors: "Brohan et al.", venue: "CoRL 2023", year: 2023, url: "https://arxiv.org/abs/2307.15818" },
  ],
  claruRelevance: "Claru partners with manufacturing facilities to capture assembly data on real production lines with authentic tooling and process standards. Unlike lab-based assembly datasets using simplified setups, Claru's data reflects the visual complexity, ergonomic constraints, and quality requirements of actual manufacturing. Every clip receives step-level annotation aligned to production work instructions.",
};

export default data;
