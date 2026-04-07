import type { DatasetPageData } from "./types";
const data: DatasetPageData = {
  slug: "multi-view-kitchen",
  metaTitle: "Multi-View Kitchen Dataset for Robotics AI | Claru",
  metaDescription: "Multi-camera kitchen recordings from 4-8 synchronized viewpoints. 65K+ clips for training embodied AI, robotic perception, and automation systems.",
  primaryKeyword: "multi-view kitchen dataset",
  secondaryKeywords: ["multi-view reconstruction data","kitchen 3D capture","synchronized camera kitchen","multi-camera cooking data","novel view synthesis kitchen"],
  canonicalPath: "/datasets/multi-view-kitchen",
  h1: "Multi-View Kitchen Dataset",
  heroSubtitle: "Synchronized multi-camera recordings of real kitchen activities from 4-8 viewpoints — enabling 3D reconstruction, novel view synthesis, and multi-perspective manipulation training for kitchen robotics.",
  breadcrumbs: [{ label: "Home", href: "/" },{ label: "Datasets", href: "/datasets" },{ label: "Multi-View Kitchen Dataset", href: "/datasets/multi-view-kitchen" }],
  sections: [
    { type: "prose", heading: "Why This Data Matters for Robotics", paragraphs: [
      "The Kitchen Reconstruction domain represents a critical frontier for robotic perception and autonomous systems. Real-world deployment demands training data captured in authentic environments with the specific sensor modalities, environmental conditions, and task complexity that target applications encounter. Simulation and synthetic data provide useful pre-training signals, but the domain gap between synthetic and real-world rgb data remains a fundamental bottleneck for reliable deployment.",
      "This dataset addresses the gap by providing purpose-collected rgb recordings from real-world environments with dense, human-verified annotations. Every clip captures genuine interactions and conditions — not staged demonstrations or simplified lab setups. The environmental diversity across collection sites ensures trained models generalize to the range of conditions they will encounter in production.",
      "For teams building Kitchen Reconstruction systems, the annotation quality and density determines the ceiling of model performance. Claru's multi-layer annotation pipeline applies task-specific labels with human verification at every stage, producing training data where annotation accuracy matches the precision requirements of the downstream application."
    ]},
    { type: "stats", heading: "Dataset at a Glance", stats: [{ value: "65K+", label: "Clips / scans" },{ value: "420+", label: "Hours captured" },{ value: "15+", label: "Collection sites" },{ value: "8+", label: "Annotation layers" }]},
    { type: "prose", heading: "Collection Methodology", paragraphs: [
      "Claru collectors deploy calibrated rgb sensor rigs in real-world environments following standardized collection protocols. Each session captures continuous recordings across varied conditions — different times of day, weather states, and activity levels — to ensure the dataset covers the full operational distribution of the target application.",
      "Collection sites are selected for diversity across geographic regions, facility types, and environmental conditions. Each site contributes unique characteristics that broaden the training distribution and reduce overfitting to any single environment. Collectors follow facility-specific safety protocols and data handling procedures.",
      "Raw sensor data is captured at full resolution with synchronized metadata including timestamps, sensor calibration parameters, and environmental condition logs. This metadata enables researchers to filter, subset, and augment the data for specific training objectives."
    ]},
    { type: "cards", heading: "Annotation Layers", cards: [
      { title: "Spatial Annotations", description: "Bounding boxes, segmentation masks, or point labels for all objects and regions of interest in each frame or scan. Tracked across temporal sequences for object persistence.", icon: "📐" },
      { title: "Temporal Segments", description: "Start/end timestamps for activities, events, and state changes. Enables training temporal reasoning models that understand process sequences and event causality.", icon: "🕐" },
      { title: "Semantic Labels", description: "Category and attribute labels for objects, surfaces, and environmental features. Provides the classification ground truth for perception model training.", icon: "🏷️" },
      { title: "Quality Indicators", description: "Annotations marking data quality factors: occlusion level, motion blur, sensor artifacts. Enables quality-aware training that weights clean samples appropriately.", icon: "✅" }
    ]},
    { type: "comparison-table", heading: "How Claru Compares", columns: ["Dimension","Academic Datasets","Claru"], rows: [
      { Dimension: "Environment diversity", "Academic Datasets": "1-5 locations", Claru: "15+ sites across regions" },
      { Dimension: "Annotation density", "Academic Datasets": "1-3 layers", Claru: "8+ layers, human-verified" },
      { Dimension: "Collection conditions", "Academic Datasets": "Controlled", Claru: "Real-world operational" },
      { Dimension: "Format flexibility", "Academic Datasets": "Single format", Claru: "Any format (RLDS, HDF5, custom)" },
      { Dimension: "Custom collection", "Academic Datasets": "Fixed dataset", Claru: "On-demand expansion" }
    ]},
    { type: "prose", heading: "Use Cases and Model Training", paragraphs: [
      "Perception models for Kitchen Reconstruction applications train on this dataset to build robust feature representations that handle the visual complexity and environmental variation of real-world deployment. The multi-layer annotations provide supervision signals for object detection, segmentation, tracking, and scene understanding tasks.",
      "Policy learning systems that use visual observations as input benefit from the dataset's environmental diversity. Models trained on data from 15+ collection sites learn features that transfer across environments rather than memorizing site-specific visual patterns.",
      "Evaluation and benchmarking teams use held-out subsets to measure model performance under realistic conditions. The environmental diversity and condition variation in the dataset enable rigorous evaluation of model robustness that controlled datasets cannot provide."
    ]}
  ],
  faqs: [
    { question: "What sensor specifications are used?", answer: "Collection uses calibrated rgb sensors at full resolution with synchronized metadata. Specific sensor models and configurations vary by collection site and are documented in the dataset metadata. Custom sensor configurations can be accommodated for new collection campaigns." },
    { question: "How many unique environments are represented?", answer: "The dataset includes 15+ unique collection sites across multiple geographic regions, covering diverse environmental conditions, layouts, and operational contexts. Each site is documented with facility metadata and environmental condition logs." },
    { question: "Can the data be delivered in custom formats?", answer: "Yes. Claru delivers data in any standard format including RLDS, HDF5, WebDataset, zarr, and custom formats. We handle all format conversion and packaging as part of the delivery pipeline." }
  ],
  ctaHeading: "Request a Sample Pack",
  ctaDescription: "Get a curated sample of this dataset with full annotations to evaluate for your project.",
  relatedGlossaryTerms: ["rgb","manipulation-trajectory","activity-annotation","temporal-annotation"],
  relatedGuidePages: [],
  relatedSolutionSlugs: [],
  datasetProfile: { modalities: ["rgb" as any], totalClips: "65K+", totalHours: "420+", annotationLayers: ["Spatial annotations","Temporal segments","Semantic labels","Quality indicators","Object tracking","Scene classification"], formats: ["RLDS","HDF5","WebDataset","MP4+JSON"], resolution: "1920x1080", fps: "30 fps" },
  comparisonWithPublic: [
    { name: "Academic Baseline A", clips: "~10K", hours: "~50", modalities: "rgb", environments: "1-3 sites", annotations: "Basic labels" },
    { name: "Academic Baseline B", clips: "~25K", hours: "~100", modalities: "rgb", environments: "3-5 sites", annotations: "Actions, objects" }
  ],
  useCases: [
    { modelType: "Perception Models", description: "Object detection, segmentation, and scene understanding for Kitchen Reconstruction applications.", exampleModels: ["DINO","SAM","Grounding DINO"] },
    { modelType: "Policy Learning", description: "Visual observation-based policy training for robotic systems operating in Kitchen Reconstruction environments.", exampleModels: ["RT-2","OpenVLA","ACT"] },
    { modelType: "World Models", description: "Physical dynamics prediction and scene forecasting for planning in Kitchen Reconstruction domains.", exampleModels: ["UniSim","Genie 2","DIAMOND"] }
  ],
  keyPapers: [
    { id: "brohan-rt2-2023", title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control", authors: "Brohan et al.", venue: "CoRL 2023", year: 2023, url: "https://arxiv.org/abs/2307.15818" },
    { id: "kirillov-sam-2023", title: "Segment Anything", authors: "Kirillov et al.", venue: "ICCV 2023", year: 2023, url: "https://arxiv.org/abs/2304.02643" },
    { id: "oquab-dinov2-2024", title: "DINOv2: Learning Robust Visual Features without Supervision", authors: "Oquab et al.", venue: "TMLR 2024", year: 2024, url: "https://arxiv.org/abs/2304.07193" }
  ],
  claruRelevance: "Claru's distributed collector network captures rgb data in real-world Kitchen Reconstruction environments across 100+ cities. Unlike academic datasets limited to a few controlled settings, Claru provides the environmental diversity, annotation density, and format flexibility that production ML pipelines require. Every clip receives multi-layer human-verified annotation through Claru's quality-controlled pipeline."
};
export default data;
