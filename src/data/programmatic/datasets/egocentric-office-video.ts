import type { DatasetPageData } from "./types";

const data: DatasetPageData = {
  "slug": "egocentric-office-video",
  "metaTitle": "Egocentric Office Video Dataset for Robotics AI | Claru",
  "metaDescription": "First-person office environment video for training workplace assistants, telepresence robots, and office automation AI. 60K+ clips across 35+ office layouts.",
  "primaryKeyword": "egocentric office video dataset",
  "secondaryKeywords": [
    "office robot training data",
    "workplace assistant AI data",
    "telepresence robot dataset",
    "office automation video",
    "workplace activity recognition",
    "desk manipulation data"
  ],
  "canonicalPath": "/datasets/egocentric-office-video",
  "h1": "Egocentric Office Video Dataset",
  "heroSubtitle": "First-person video of real office environments — desks, meeting rooms, corridors — with workplace activity annotations for training telepresence robots and office automation AI.",
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
      "label": "Office Video",
      "href": "/datasets/egocentric-office-video"
    }
  ],
  "sections": [
    {
      "type": "stats",
      "heading": "Dataset at a Glance",
      "stats": [
        {
          "value": "60K+",
          "label": "Video clips"
        },
        {
          "value": "450+",
          "label": "Hours recorded"
        },
        {
          "value": "35+ office layouts",
          "label": "Environments"
        },
        {
          "value": "6+",
          "label": "Annotation layers"
        }
      ]
    },
    {
      "type": "comparison-table",
      "heading": "Comparison with Public Datasets",
      "description": "How Claru's dataset compares to publicly available alternatives.",
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
          "Dataset": "ADL Dataset",
          "Clips": "20K",
          "Hours": "10",
          "Modalities": "RGB-D",
          "Environments": "20 homes",
          "Annotations": "Activities of daily living"
        },
        {
          "Dataset": "Ego4D (office subset)",
          "Clips": "~10K",
          "Hours": "~60",
          "Modalities": "RGB",
          "Environments": "~30 offices",
          "Annotations": "Narrations, hands"
        },
        {
          "Dataset": "Claru Office",
          "Clips": "60K+",
          "Hours": "450+",
          "Modalities": "RGB, Depth",
          "Environments": "35+ offices",
          "Annotations": "Activities, objects, navigation, proximity"
        }
      ]
    },
    {
      "type": "cards",
      "heading": "Use Cases",
      "cards": [
        {
          "title": "Telepresence Robots",
          "description": "Office navigation and person finding in workplace environments. Example models: Double Robotics, Ava Robotics, OhmniLabs."
        },
        {
          "title": "Office Assistant Robots",
          "description": "Document delivery and supply restocking in corporate environments. Example models: Savioke Relay, Bear Robotics, Pudu Robotics."
        },
        {
          "title": "Workplace Activity Recognition",
          "description": "Understanding office workflows for productivity and workspace optimization. Example models: Microsoft Graph, Cisco Webex, Verizon Media."
        }
      ]
    },
    {
      "type": "citation-list",
      "heading": "Key References",
      "citations": [
        {
          "id": "pirsiavash-adl-2012",
          "title": "Detecting Activities of Daily Living in First-Person Camera Views",
          "authors": "Pirsiavash & Ramanan",
          "venue": "CVPR 2012",
          "year": 2012,
          "url": "https://www.cs.cmu.edu/~deva/papers/ADL.pdf"
        },
        {
          "id": "grauman-ego4d-2022",
          "title": "Ego4D: Around the World in 3,000 Hours of Egocentric Video",
          "authors": "Grauman et al.",
          "venue": "CVPR 2022",
          "year": 2022,
          "url": "https://arxiv.org/abs/2110.07058"
        },
        {
          "id": "truong-social-nav-2023",
          "title": "Rethinking Social Robot Navigation",
          "authors": "Truong & Ngo",
          "venue": "ICRA 2023",
          "year": 2023,
          "url": "https://arxiv.org/abs/2206.12640"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "How Claru Delivers This Data",
      "paragraphs": [
        "Claru captures office video in diverse real workplaces with privacy-preserving protocols. The egocentric perspective captures fine-grained desktop manipulation and spatial navigation patterns that office robots need."
      ]
    }
  ],
  "faqs": [
    {
      "question": "How is privacy handled?",
      "answer": "Collectors obtain site-level consent, visible signage notifies occupants, and our pipeline offers automated face blurring, screen content redaction, and badge masking."
    },
    {
      "question": "What office types are represented?",
      "answer": "Open-plan corporate offices, private suites, co-working spaces, medical offices, legal offices, and home offices with diverse furniture configurations."
    },
    {
      "question": "Can the data train social navigation?",
      "answer": "Yes. Person proximity detection and navigation path annotations enable training robots that navigate offices while maintaining appropriate social distances."
    }
  ],
  "ctaHeading": "Request a Sample Pack",
  "ctaDescription": "Get a curated sample of egocentric office video data with full annotations to evaluate for your project.",
  "relatedGlossaryTerms": [
    "egocentric-video",
    "teleoperation-data",
    "depth-data"
  ],
  "relatedGuidePages": [],
  "relatedSolutionSlugs": [],
  "datasetProfile": {
    "modalities": [
      "rgb",
      "depth"
    ],
    "totalClips": "60K+",
    "totalHours": "450+",
    "annotationLayers": [
      "Desktop activity segments",
      "Object manipulation events",
      "Room navigation paths",
      "Furniture interaction labels",
      "Person proximity detection",
      "Document handling"
    ],
    "formats": [
      "RLDS",
      "HDF5",
      "WebDataset",
      "MP4+JSON"
    ],
    "resolution": "1920x1080",
    "fps": "30 fps"
  },
  "comparisonWithPublic": [
    {
      "name": "ADL Dataset",
      "clips": "20K",
      "hours": "10",
      "modalities": "RGB-D",
      "environments": "20 homes",
      "annotations": "Activities of daily living"
    },
    {
      "name": "Ego4D (office subset)",
      "clips": "~10K",
      "hours": "~60",
      "modalities": "RGB",
      "environments": "~30 offices",
      "annotations": "Narrations, hands"
    },
    {
      "name": "Claru Office",
      "clips": "60K+",
      "hours": "450+",
      "modalities": "RGB, Depth",
      "environments": "35+ offices",
      "annotations": "Activities, objects, navigation, proximity"
    }
  ],
  "useCases": [
    {
      "modelType": "Telepresence Robots",
      "description": "Office navigation and person finding in workplace environments.",
      "exampleModels": [
        "Double Robotics",
        "Ava Robotics",
        "OhmniLabs"
      ]
    },
    {
      "modelType": "Office Assistant Robots",
      "description": "Document delivery and supply restocking in corporate environments.",
      "exampleModels": [
        "Savioke Relay",
        "Bear Robotics",
        "Pudu Robotics"
      ]
    },
    {
      "modelType": "Workplace Activity Recognition",
      "description": "Understanding office workflows for productivity and workspace optimization.",
      "exampleModels": [
        "Microsoft Graph",
        "Cisco Webex",
        "Verizon Media"
      ]
    }
  ],
  "keyPapers": [
    {
      "id": "pirsiavash-adl-2012",
      "title": "Detecting Activities of Daily Living in First-Person Camera Views",
      "authors": "Pirsiavash & Ramanan",
      "venue": "CVPR 2012",
      "year": 2012,
      "url": "https://www.cs.cmu.edu/~deva/papers/ADL.pdf"
    },
    {
      "id": "grauman-ego4d-2022",
      "title": "Ego4D: Around the World in 3,000 Hours of Egocentric Video",
      "authors": "Grauman et al.",
      "venue": "CVPR 2022",
      "year": 2022,
      "url": "https://arxiv.org/abs/2110.07058"
    },
    {
      "id": "truong-social-nav-2023",
      "title": "Rethinking Social Robot Navigation",
      "authors": "Truong & Ngo",
      "venue": "ICRA 2023",
      "year": 2023,
      "url": "https://arxiv.org/abs/2206.12640"
    }
  ],
  "claruRelevance": "Claru captures office video in diverse real workplaces with privacy-preserving protocols. The egocentric perspective captures fine-grained desktop manipulation and spatial navigation patterns that office robots need."
};

export default data;
