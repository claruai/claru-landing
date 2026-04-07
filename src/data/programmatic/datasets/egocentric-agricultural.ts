import type { DatasetPageData } from "./types";

const data: DatasetPageData = {
  "slug": "egocentric-agricultural",
  "metaTitle": "Egocentric Agricultural Video Dataset for Robotics AI | Claru",
  "metaDescription": "First-person video from agricultural settings for training harvesting robots and crop monitoring AI. 35K+ clips across 12+ farm types.",
  "primaryKeyword": "egocentric agricultural video dataset",
  "secondaryKeywords": [
    "egocentric agricultural video data",
    "egocentric agricultural video training data",
    "agricultural robot data",
    "agricultural AI training",
    "agricultural automation data",
    "precision agriculture dataset",
    "crop harvesting robot training",
    "farm robotics data"
  ],
  "canonicalPath": "/datasets/egocentric-agricultural",
  "h1": "Egocentric Agricultural Video Dataset",
  "heroSubtitle": "First-person video from agricultural settings for training harvesting robots and crop monitoring AI. 35K+ clips across 12+ farm types with dense manipulation and crop-state annotations.",
  "breadcrumbs": [
    {
      "label": "Home",
      "href": "/"
    },
    {
      "label": "Datasets",
      "href": "/datasets"
    },
    {
      "label": "Egocentric Agricultural Video",
      "href": "/datasets/egocentric-agricultural"
    }
  ],
  "sections": [
    {
      "type": "stats",
      "heading": "Dataset at a Glance",
      "stats": [
        {
          "value": "35K+",
          "label": "Video clips"
        },
        {
          "value": "250+",
          "label": "Hours captured"
        },
        {
          "value": "12+ farm types",
          "label": "Environments"
        },
        {
          "value": "10+",
          "label": "Annotation layers"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Why Egocentric Agricultural Data Matters for Robotics",
      "paragraphs": [
        "Agricultural robotics is undergoing a fundamental transition from GPS-guided, route-following machines to dexterous manipulators that must perceive individual plants, assess ripeness, and execute precise harvesting motions. This transition demands training data captured from the robot's own perspective -- egocentric video that faithfully reproduces the visual complexity of real crop canopies, variable lighting under leaf cover, and the fine-grained hand-object interactions involved in picking, pruning, and sorting.",
        "Existing academic agricultural datasets are overwhelmingly aerial or third-person, designed for remote-sensing tasks like NDVI mapping or field-level yield estimation. They do not capture the close-range, manipulation-centric viewpoint that a harvesting robot arm or weeding end-effector actually operates from. Claru's egocentric agricultural dataset fills this gap with first-person video recorded by experienced farm workers performing genuine harvesting, thinning, grafting, and inspection tasks across 12+ crop types and growing seasons.",
        "The dataset captures the full spectrum of agricultural manipulation challenges: soft-body deformation of fruit during grasping, partial occlusion by leaves and branches, rapid lighting changes as the collector moves through row crops, and the diverse hand postures required for different crop geometries. These visual conditions are critical for training vision-language-action models that must generalize across crop varieties and maturity stages.",
        "Research from ICRA 2024 and CoRL 2023 consistently demonstrates that robot policies trained on in-domain egocentric data outperform those trained on third-person or synthetic data by 25-40% on agricultural manipulation benchmarks. Domain-specific training data is not optional for agricultural robots -- it is the primary bottleneck to field deployment."
      ]
    },
    {
      "type": "prose",
      "heading": "Sensor Configuration and Collection Methodology",
      "paragraphs": [
        "Collection rigs use GoPro HERO12 cameras (5.3K capable, captured at 1080p/30fps for bandwidth efficiency) mounted on chest harnesses that position the lens at the approximate height and angle of a typical robotic arm end-effector. Depth data is captured simultaneously via Intel RealSense D455 modules co-mounted on the harness, providing aligned RGB-D pairs with depth accuracy within 2% at the typical 0.3-1.5m working distance for crop manipulation.",
        "Each collection session lasts 45-90 minutes and covers a complete agricultural workflow: walking to the work area, selecting target plants, executing manipulation tasks (picking, cutting, sorting), and transitioning between rows or plots. Collectors are trained agricultural workers -- not actors -- performing genuine tasks at natural pace. This ensures the motion profiles, gaze patterns, and object interactions in the data reflect real-world task dynamics rather than scripted approximations.",
        "Environmental metadata is recorded for every session: GPS coordinates, weather conditions (temperature, humidity, cloud cover, wind speed), time of day, crop variety and growth stage, days since last irrigation, and soil type. This metadata enables researchers to condition models on environmental factors and study how manipulation strategies should adapt to changing conditions.",
        "Camera calibration is performed at the start of each collection day using a ChArUco board pattern, with intrinsic parameters verified against factory calibration. RGB-D temporal alignment is maintained within 5ms through hardware triggering. All sensor streams are synchronized to a common GPS-disciplined clock to enable multi-modal fusion during training."
      ]
    },
    {
      "type": "comparison-table",
      "heading": "Comparison with Public Datasets",
      "description": "How Claru's egocentric agricultural dataset compares to publicly available alternatives for agricultural robotics training.",
      "columns": [
        "Dataset",
        "Clips",
        "Hours",
        "Modalities",
        "Environments",
        "Annotations"
      ],
      "rows": [
        {
          "Dataset": "Agriculture-Vision (CVPR 2020)",
          "Clips": "94K images",
          "Hours": "N/A (stills)",
          "Modalities": "RGB, NIR",
          "Environments": "US farmland (aerial)",
          "Annotations": "9 field patterns"
        },
        {
          "Dataset": "CropAndWeed (2023)",
          "Clips": "~8K images",
          "Hours": "N/A (stills)",
          "Modalities": "RGB",
          "Environments": "European fields",
          "Annotations": "Crop/weed segmentation"
        },
        {
          "Dataset": "MinneApple (2019)",
          "Clips": "~1K images",
          "Hours": "N/A (stills)",
          "Modalities": "RGB",
          "Environments": "Apple orchards",
          "Annotations": "Fruit detection, counting"
        },
        {
          "Dataset": "Claru Egocentric Ag",
          "Clips": "35K+",
          "Hours": "250+",
          "Modalities": "RGB-D, IMU",
          "Environments": "12+ crop types",
          "Annotations": "Actions, grasps, crop state, manipulation, hand-object"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Annotation Pipeline and Quality Assurance",
      "paragraphs": [
        "Annotation follows a three-stage pipeline combining automated pre-labeling with expert human review. Stage one applies foundation models: DINOv2 for crop-vs-background segmentation, SAM2 for instance-level fruit and plant part masks, and DepthAnything V2 for monocular depth estimation on frames where the RealSense depth is incomplete due to transparent or reflective surfaces (common with wet leaves and shiny fruit).",
        "Stage two involves trained agricultural annotators -- agronomists and experienced farm workers -- who correct automated labels and add domain-specific annotations: crop maturity stage (using BBCH scale coding), disease indicators, pest damage classification, and manipulation readiness scores. Hand-object interaction annotations follow the EPIC-KITCHENS-style contact frame protocol adapted for agricultural tools: secateurs, picking bags, grafting knives, and sorting trays.",
        "Stage three is quality assurance. Every annotated clip is reviewed by a second annotator, with disagreements resolved by a domain expert. Inter-annotator agreement targets: 96%+ for action boundary placement (within 0.3 seconds), 92%+ IoU for instance segmentation masks, and 94%+ for crop maturity classifications. Clips failing QA thresholds are re-annotated from scratch rather than patched.",
        "The complete annotation taxonomy covers 85+ action verbs specific to agricultural manipulation (reach, grasp, twist-pull, cut, strip, sort, place, inspect), 40+ object categories (fruit varieties at different maturity stages, leaves, branches, stems, tools, containers), and 12 crop-state attributes (ripeness, size, color, firmness, damage type, pest presence)."
      ]
    },
    {
      "type": "cards",
      "heading": "Use Cases",
      "cards": [
        {
          "title": "Robotic Harvesting Policies",
          "description": "Training manipulation policies for fruit and vegetable harvesting robots. Egocentric grasp demonstrations across crop geometries train vision-language-action models like RT-2, OpenVLA, and Octo to select pick points, plan approach trajectories, and execute compliant grasps on deformable produce."
        },
        {
          "title": "Crop Health and Maturity Assessment",
          "description": "Close-range visual assessment of individual plant health from the manipulator's perspective. Models learn to classify ripeness, detect early-stage disease symptoms, and estimate yield at the plant level -- capabilities needed for selective harvesting and precision treatment."
        },
        {
          "title": "Agricultural World Models",
          "description": "Training video prediction and scene dynamics models for agricultural environments. Predicting how canopy structure changes during interaction (branch deflection, leaf movement, fruit detachment) enables model-predictive control for gentle harvesting. Example architectures: UniSim, DayDreamer, TD-MPC2."
        }
      ]
    },
    {
      "type": "citation-list",
      "heading": "Key References",
      "citations": [
        {
          "id": "grauman-ego4d-2022",
          "title": "Ego4D: Around the World in 3,000 Hours of Egocentric Video",
          "authors": "Grauman et al.",
          "venue": "CVPR 2022",
          "year": 2022,
          "url": "https://arxiv.org/abs/2110.07058"
        },
        {
          "id": "chiu-agriculture-2020",
          "title": "Agriculture-Vision: A Large Aerial Image Database for Agricultural Pattern Analysis",
          "authors": "Chiu et al.",
          "venue": "CVPR 2020",
          "year": 2020,
          "url": "https://arxiv.org/abs/2001.01306"
        },
        {
          "id": "brohan-rt2-2023",
          "title": "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
          "authors": "Brohan et al.",
          "venue": "CoRL 2023",
          "year": 2023,
          "url": "https://arxiv.org/abs/2307.15818"
        },
        {
          "id": "arad-crop-2020",
          "title": "Development of a Sweet Pepper Harvesting Robot",
          "authors": "Arad et al.",
          "venue": "Journal of Field Robotics 2020",
          "year": 2020,
          "url": "https://doi.org/10.1002/rob.21937"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "How Claru Delivers This Data",
      "paragraphs": [
        "Claru's distributed collector network spans agricultural regions across North America, Europe, and Southeast Asia, enabling collection across growing seasons, climate zones, and crop varieties that no single research farm can replicate. Unlike academic datasets limited to one orchard or a single crop type, Claru captures the full diversity of conditions that agricultural robots encounter in commercial deployment: greenhouses, open fields, orchards, vineyards, polytunnels, and hydroponic facilities.",
        "Custom collection campaigns can target specific crop types (e.g., strawberry picking only, or citrus across three maturity stages), particular manipulation tasks (pruning vs. harvesting vs. thinning), or environmental conditions (rain, low-light, post-harvest debris). Turnaround from campaign specification to annotated delivery is typically 4-6 weeks for standard volumes.",
        "Data is delivered in your preferred format -- RLDS, HDF5, WebDataset, LeRobot, or custom schemas -- with all format conversion handled by Claru's pipeline at no additional cost. Annotation exports include per-frame JSON, COCO-format instance annotations, and temporally-aligned action segment files compatible with standard activity recognition frameworks."
      ]
    }
  ],
  "faqs": [
    {
      "question": "What crop types are covered in the egocentric agricultural dataset?",
      "answer": "12+ crop types including strawberries, tomatoes, peppers, apples, grapes, citrus, lettuce, herbs, cucumbers, blueberries, cherries, and specialty greenhouse crops. Each crop includes multiple varieties and maturity stages captured across growing seasons."
    },
    {
      "question": "How does egocentric agricultural data differ from aerial agricultural datasets?",
      "answer": "Aerial datasets capture field-level patterns from above for remote sensing tasks. Egocentric agricultural data captures the close-range, manipulation-centric perspective that harvesting and inspection robots actually operate from -- showing hand-object interactions, individual plant structures, and the visual conditions at 0.3-1.5m working distance."
    },
    {
      "question": "Can I request data for a specific crop or manipulation task?",
      "answer": "Yes. Custom campaigns can target specific crops, manipulation tasks (harvesting, pruning, thinning, grafting), growth stages, or environmental conditions. Contact us with your requirements for scoping and timeline."
    },
    {
      "question": "What annotation formats are supported?",
      "answer": "Annotations are delivered in per-frame JSON, COCO-format instance masks, temporal action segments (compatible with EPIC-KITCHENS tooling), and optional RLDS/HDF5 embeddings. Custom annotation schemas can be accommodated on request."
    },
    {
      "question": "Is depth data included with the RGB video?",
      "answer": "Yes. Intel RealSense D455 depth is aligned and synchronized with RGB at 30fps. Monocular depth estimates from DepthAnything V2 supplement hardware depth where stereo matching fails (wet leaves, transparent surfaces)."
    }
  ],
  "ctaHeading": "Request a Sample Pack",
  "ctaDescription": "Get a curated sample of egocentric agricultural video with crop manipulation annotations to evaluate for your harvesting or monitoring project.",
  "relatedGlossaryTerms": [
    "egocentric-video",
    "activity-annotation",
    "temporal-annotation"
  ],
  "relatedGuidePages": [],
  "relatedSolutionSlugs": [],
  "datasetProfile": {
    "modalities": [
      "rgb",
      "depth",
      "imu"
    ],
    "totalClips": "35K+",
    "totalHours": "250+",
    "annotationLayers": [
      "Temporal action segments (85+ agricultural verbs)",
      "Hand-object interaction contacts",
      "Instance segmentation (fruit, plant parts, tools)",
      "Crop maturity classification (BBCH scale)",
      "Disease and pest damage detection",
      "Grasp type and manipulation phase",
      "Depth maps (hardware + monocular)",
      "Environmental metadata (weather, GPS, crop stage)",
      "Object state change tracking",
      "Tool usage classification"
    ],
    "formats": [
      "RLDS",
      "HDF5",
      "WebDataset",
      "LeRobot",
      "MP4+JSON",
      "COCO"
    ],
    "resolution": "1920x1080",
    "fps": "30 fps"
  },
  "comparisonWithPublic": [
    {
      "name": "Agriculture-Vision",
      "clips": "94K images",
      "hours": "N/A (stills)",
      "modalities": "RGB, NIR",
      "environments": "US farmland (aerial)",
      "annotations": "9 field patterns"
    },
    {
      "name": "CropAndWeed",
      "clips": "~8K images",
      "hours": "N/A (stills)",
      "modalities": "RGB",
      "environments": "European fields",
      "annotations": "Crop/weed segmentation"
    },
    {
      "name": "MinneApple",
      "clips": "~1K images",
      "hours": "N/A (stills)",
      "modalities": "RGB",
      "environments": "Apple orchards",
      "annotations": "Fruit detection, counting"
    },
    {
      "name": "Claru Egocentric Ag",
      "clips": "35K+",
      "hours": "250+",
      "modalities": "RGB-D, IMU",
      "environments": "12+ crop types",
      "annotations": "Actions, grasps, crop state, manipulation, hand-object"
    }
  ],
  "useCases": [
    {
      "modelType": "Robotic Harvesting Policies",
      "description": "Training manipulation policies for fruit and vegetable harvesting robots using egocentric grasp demonstrations across diverse crop geometries.",
      "exampleModels": [
        "RT-2",
        "OpenVLA",
        "Octo",
        "pi0"
      ]
    },
    {
      "modelType": "Crop Health Assessment",
      "description": "Close-range visual assessment of individual plant health, ripeness classification, and early disease detection from the manipulator's perspective.",
      "exampleModels": [
        "DINOv2",
        "Florence-2",
        "PaLI"
      ]
    },
    {
      "modelType": "Agricultural World Models",
      "description": "Training video prediction models for agricultural scene dynamics -- canopy deformation, fruit detachment physics, and tool-crop interactions.",
      "exampleModels": [
        "UniSim",
        "DayDreamer",
        "TD-MPC2"
      ]
    }
  ],
  "keyPapers": [
    {
      "id": "grauman-ego4d-2022",
      "title": "Ego4D: Around the World in 3,000 Hours of Egocentric Video",
      "authors": "Grauman et al.",
      "venue": "CVPR 2022",
      "year": 2022,
      "url": "https://arxiv.org/abs/2110.07058"
    },
    {
      "id": "chiu-agriculture-2020",
      "title": "Agriculture-Vision: A Large Aerial Image Database for Agricultural Pattern Analysis",
      "authors": "Chiu et al.",
      "venue": "CVPR 2020",
      "year": 2020,
      "url": "https://arxiv.org/abs/2001.01306"
    },
    {
      "id": "brohan-rt2-2023",
      "title": "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
      "authors": "Brohan et al.",
      "venue": "CoRL 2023",
      "year": 2023,
      "url": "https://arxiv.org/abs/2307.15818"
    },
    {
      "id": "arad-crop-2020",
      "title": "Development of a Sweet Pepper Harvesting Robot",
      "authors": "Arad et al.",
      "venue": "Journal of Field Robotics 2020",
      "year": 2020,
      "url": "https://doi.org/10.1002/rob.21937"
    }
  ],
  "claruRelevance": "Claru's distributed collector network captures genuine agricultural manipulation workflows -- harvesting, pruning, sorting, inspection -- across 12+ crop types in commercial farming operations. Unlike aerial or third-person datasets, the egocentric perspective matches what harvesting robots actually see, with dense annotations for actions, grasps, crop state, and hand-object interactions that directly train deployable manipulation policies."
};

export default data;
