import type { DatasetPageData } from "./types";

const data: DatasetPageData = {
  slug: "egocentric-kitchen-video",
  metaTitle: "Egocentric Kitchen Video Dataset for Robotics AI | Claru",
  metaDescription:
    "First-person kitchen video dataset with manipulation annotations for training robotic chefs, VLA models, and embodied AI systems. 120K+ clips across 50+ kitchen layouts.",
  primaryKeyword: "egocentric kitchen video dataset",
  secondaryKeywords: [
    "kitchen robot training data",
    "first-person cooking video",
    "egocentric manipulation data",
    "kitchen activity recognition dataset",
    "robotic chef training data",
    "food preparation video dataset",
  ],
  canonicalPath: "/datasets/egocentric-kitchen-video",
  h1: "Egocentric Kitchen Video Dataset",
  heroSubtitle:
    "First-person video of real kitchen activities — cooking, cleaning, organizing — captured across diverse home and commercial kitchen layouts with dense manipulation annotations for training robotic kitchen assistants and embodied AI systems.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Datasets", href: "/datasets" },
    { label: "Egocentric Kitchen Video", href: "/datasets/egocentric-kitchen-video" },
  ],
  sections: [
    {
      type: "prose",
      heading: "Why Kitchen Video Data Matters for Robotics",
      paragraphs: [
        "Kitchens are the primary target environment for household robotics. Companies building robotic kitchen assistants need training data that captures the full complexity of real cooking workflows — multi-step recipes, tool handling, ingredient manipulation, and the spatial reasoning required to navigate cluttered countertops. First-person video from real kitchens provides this signal in a way that simulation cannot replicate.",
        "The egocentric viewpoint is critical because it matches the camera perspective of a robot operating in the same space. A head-mounted or chest-mounted camera captures exactly what a robot's onboard camera would see: hands reaching into drawers, objects partially occluded by other items, steam from cooking, and the dynamic lighting conditions of real kitchens. This perspective alignment dramatically reduces the domain gap between training data and deployment.",
        "Kitchen environments present unique challenges for computer vision and robot learning. Transparent objects (glass bowls, measuring cups), deformable materials (dough, vegetables being chopped), liquids, and steam create visual complexity that standard object detection struggles with. Training on diverse real kitchen video is the most reliable path to robust perception in these conditions.",
      ],
    },
    {
      type: "stats",
      heading: "Dataset at a Glance",
      stats: [
        { value: "120K+", label: "Video clips" },
        { value: "800+", label: "Hours recorded" },
        { value: "50+", label: "Kitchen layouts" },
        { value: "15+", label: "Annotation layers" },
      ],
    },
    {
      type: "prose",
      heading: "Collection Methodology",
      paragraphs: [
        "Claru collectors wear lightweight head-mounted cameras (GoPro Hero 12 or similar) while performing genuine cooking tasks in their own kitchens. This is not scripted — collectors follow actual recipes and perform real meal preparation, generating naturalistic data with authentic object interactions, timing, and error recovery behaviors that scripted collection cannot produce.",
        "Each collection session captures 30-90 minutes of continuous activity. Collectors are recruited across geographic regions to ensure diversity in kitchen layouts (galley, L-shaped, island, commercial), equipment (gas vs electric, various appliance brands), and cooking styles (Western, Asian, South Asian, Latin American). This diversity is essential for training models that generalize beyond a single kitchen configuration.",
        "Raw video is captured at 1080p or 4K resolution at 30fps, with optional depth sensing from RealSense D435 cameras for collectors who use our depth rig. Each session includes metadata: kitchen layout sketch, appliance inventory, and recipe or task description. This metadata enables researchers to filter and subset the data for specific training objectives.",
      ],
    },
    {
      type: "cards",
      heading: "Annotation Layers",
      cards: [
        {
          title: "Temporal Action Segments",
          description:
            "Start/end timestamps for every discrete action: open fridge, pick up knife, chop onion, stir pot. Follows EPIC-KITCHENS taxonomy with extensions for 200+ kitchen-specific verbs and nouns.",
          icon: "🕐",
        },
        {
          title: "Hand-Object Contact Frames",
          description:
            "Per-frame labels marking which hand is in contact with which object, including grasp type classification (power grasp, precision grasp, pinch) for manipulation policy training.",
          icon: "🤲",
        },
        {
          title: "Object Bounding Boxes",
          description:
            "2D bounding boxes tracked across frames for all manipulated objects, ingredients, tools, and containers. Includes object identity tracking through occlusion events.",
          icon: "📦",
        },
        {
          title: "Semantic Segmentation",
          description:
            "Pixel-level segmentation masks for countertop surfaces, appliances, tools, food items, and hands. Enables scene understanding and spatial reasoning training.",
          icon: "🎨",
        },
      ],
    },
    {
      type: "comparison-table",
      heading: "Comparison with Public Kitchen Datasets",
      description:
        "How Claru's kitchen video compares to publicly available academic datasets.",
      columns: ["Dataset", "Clips", "Hours", "Kitchens", "Annotations"],
      rows: [
        {
          Dataset: "EPIC-KITCHENS-100",
          Clips: "90K",
          Hours: "100",
          Kitchens: "45",
          Annotations: "Actions, nouns, verbs",
        },
        {
          Dataset: "Ego4D (kitchen subset)",
          Clips: "~40K",
          Hours: "~200",
          Kitchens: "~100",
          Annotations: "Narrations, hands",
        },
        {
          Dataset: "YouCook2",
          Clips: "2K",
          Hours: "176",
          Kitchens: "N/A (YouTube)",
          Annotations: "Recipe steps, descriptions",
        },
        {
          Dataset: "Claru Kitchen",
          Clips: "120K+",
          Hours: "800+",
          Kitchens: "50+",
          Annotations: "Actions, hands, objects, segmentation, depth",
        },
      ],
    },
    {
      type: "prose",
      heading: "Use Cases and Model Training",
      paragraphs: [
        "VLA models like RT-2 and OpenVLA require diverse manipulation demonstrations to learn kitchen tasks. Claru's kitchen dataset provides the observation sequences these models need, with consistent action annotations that can be mapped to robot action spaces through retargeting. The diversity of kitchen layouts ensures the model does not overfit to a single environment.",
        "World models trained on kitchen video learn the causal structure of cooking: what happens when you pour liquid into a hot pan, how dough deforms when kneaded, how steam disperses. These physical dynamics are critical for predictive models that plan multi-step cooking sequences. The temporal density of our annotations (every action boundary labeled) provides the supervision signal world models need.",
        "Activity recognition and anticipation models benefit from the naturalistic collection protocol. Because collectors perform real cooking rather than scripted motions, the data includes genuine error recovery, multitasking (stirring while chopping), and realistic timing variation that synthetic or scripted datasets lack.",
      ],
    },
  ],
  faqs: [
    {
      question: "What resolution and frame rate is the kitchen video captured at?",
      answer:
        "Standard collection is at 1920x1080 at 30fps. We also support 4K (3840x2160) collection at 30fps for projects requiring higher spatial resolution, and 60fps for projects studying fast hand movements. Depth data, when included, is captured at 848x480 at 30fps from Intel RealSense D435 cameras.",
    },
    {
      question: "How many unique kitchen layouts are represented?",
      answer:
        "The current dataset includes over 50 unique kitchen layouts across North America, Europe, and Asia. Layouts range from compact apartment kitchens (under 50 sq ft) to large commercial kitchens (500+ sq ft), with diverse configurations including galley, L-shaped, U-shaped, and island layouts. Each kitchen is documented with a floor plan sketch and appliance inventory.",
    },
    {
      question: "Can the data be delivered in RLDS or HDF5 format?",
      answer:
        "Yes. Claru delivers kitchen video data in any standard robotics format including RLDS (TensorFlow Datasets), HDF5, WebDataset, zarr, and LeRobot format. We handle all format conversion as part of the delivery pipeline, so you receive data ready to load directly into your training framework.",
    },
  ],
  ctaHeading: "Request a Sample Pack",
  ctaDescription:
    "Get a curated sample of egocentric kitchen video with full annotations to evaluate for your robotics or embodied AI project.",
  relatedGlossaryTerms: [
    "egocentric-video",
    "hand-object-interaction",
    "activity-annotation",
    "temporal-annotation",
  ],
  relatedGuidePages: [],
  relatedSolutionSlugs: [],
  datasetProfile: {
    modalities: ["rgb", "depth"],
    totalClips: "120,000+",
    totalHours: "800+",
    annotationLayers: [
      "Temporal action segments",
      "Hand-object contact",
      "Object bounding boxes",
      "Semantic segmentation",
      "Object identity tracking",
      "Grasp type classification",
    ],
    formats: ["RLDS", "HDF5", "WebDataset", "MP4+JSON"],
    resolution: "1920x1080",
    fps: "30 fps",
  },
  comparisonWithPublic: [
    {
      name: "EPIC-KITCHENS-100",
      clips: "90K",
      hours: "100",
      modalities: "RGB",
      environments: "45 kitchens",
      annotations: "Actions, nouns, verbs",
    },
    {
      name: "Ego4D",
      clips: "~40K kitchen",
      hours: "~200 kitchen",
      modalities: "RGB, IMU, gaze",
      environments: "~100 kitchens",
      annotations: "Narrations, hands, forecasting",
    },
    {
      name: "YouCook2",
      clips: "2K",
      hours: "176",
      modalities: "RGB (YouTube)",
      environments: "Unknown",
      annotations: "Recipe steps",
    },
  ],
  useCases: [
    {
      modelType: "Vision-Language-Action (VLA) Models",
      description:
        "Kitchen demonstrations provide the observation sequences VLA models need to learn cooking tasks from language instructions.",
      exampleModels: ["RT-2", "OpenVLA", "Octo"],
    },
    {
      modelType: "World Models",
      description:
        "Kitchen physics — pouring, heating, deformation — train world models to predict physical outcomes of cooking actions.",
      exampleModels: ["UniSim", "Genie 2", "DIAMOND"],
    },
    {
      modelType: "Activity Recognition",
      description:
        "Dense temporal annotations enable training fine-grained activity recognition and anticipation models for kitchen assistants.",
      exampleModels: ["VideoMAE", "InternVideo", "EgoVLP"],
    },
  ],
  keyPapers: [
    {
      id: "damen-epic-2022",
      title: "Rescaling Egocentric Vision: Collection, Pipeline and Challenges for EPIC-KITCHENS-100",
      authors: "Damen et al.",
      venue: "IJCV 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2006.13256",
    },
    {
      id: "grauman-ego4d-2022",
      title: "Ego4D: Around the World in 3,000 Hours of Egocentric Video",
      authors: "Grauman et al.",
      venue: "CVPR 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2110.07058",
    },
    {
      id: "brohan-rt2-2023",
      title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
      authors: "Brohan et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2307.15818",
    },
  ],
  claruRelevance:
    "Claru operates a distributed network of 10,000+ collectors who capture egocentric kitchen video in their own homes across 100+ cities. Unlike academic datasets limited to university labs, Claru's collection spans real residential and commercial kitchens with authentic cooking workflows. Every clip receives multi-layer annotation through Claru's quality-controlled pipeline, delivering training-ready data in your preferred format within weeks of a request.",
};

export default data;
