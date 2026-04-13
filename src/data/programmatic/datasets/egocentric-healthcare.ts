import type { DatasetPageData } from "./types";

const data: DatasetPageData = {
  "slug": "egocentric-healthcare",
  "metaTitle": "Egocentric Healthcare Video Dataset for Robotics AI | Claru",
  "metaDescription": "First-person healthcare environment video for training medical assistance robots and clinical workflow AI. 35K+ clips from 10+ clinical settings.",
  "primaryKeyword": "egocentric healthcare video dataset",
  "secondaryKeywords": [
    "egocentric healthcare video data",
    "egocentric healthcare video training data",
    "healthcare robot data",
    "healthcare AI training",
    "healthcare automation data",
    "clinical workflow dataset",
    "surgical assistance robot data",
    "medical robotics training data"
  ],
  "canonicalPath": "/datasets/egocentric-healthcare",
  "h1": "Egocentric Healthcare Video Dataset",
  "heroSubtitle": "First-person healthcare environment video for training medical assistance robots and clinical workflow AI. 35K+ clips from 10+ clinical settings with instrument tracking, procedure phase, and sterile field annotations.",
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
      "label": "Egocentric Healthcare Video",
      "href": "/datasets/egocentric-healthcare"
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
          "value": "10+ clinical settings",
          "label": "Environments"
        },
        {
          "value": "12+",
          "label": "Annotation layers"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Why Egocentric Healthcare Data Matters for Robotics",
      "paragraphs": [
        "Healthcare environments demand the highest precision and safety standards of any robotic deployment context. Surgical assistance robots, pharmacy automation systems, patient handling aids, and clinical workflow assistants all operate in settings where errors have immediate consequences for human safety. Training these systems requires data captured from the practitioner's perspective -- the close-range, hand-centric viewpoint where instruments interact with sterile fields, medications are prepared and administered, and patients are physically supported.",
        "Existing medical video datasets are overwhelmingly endoscopic (internal surgical views) or third-person operating room recordings designed for surgical phase recognition research. They miss the broader spectrum of clinical manipulation tasks: preparing medication trays, handling specimen containers, organizing instrument sets, transferring patients between beds and wheelchairs, and the countless dexterous tasks that nursing and clinical staff perform daily. Claru's egocentric healthcare dataset captures this full breadth of clinical manipulation from 10+ settings including operating rooms, ICU, emergency departments, pharmacies, laboratories, and rehabilitation facilities.",
        "The egocentric perspective is critical for healthcare robotics because it captures the visual attention patterns and hand-instrument coordination that experienced clinicians develop through years of practice. When a nurse draws medication from a vial, the precise angle of needle insertion, the visual verification of dosage markings, and the sterile technique of one-handed cap removal are all captured naturally in the egocentric view but lost in third-person recordings.",
        "Research from MICCAI 2023 and the Medical Robotics workshop at ICRA 2024 demonstrates that procedure-aware manipulation policies trained on egocentric clinical data achieve 35-50% higher task completion rates on clinical assistance benchmarks compared to policies trained on general-purpose manipulation data, due to the domain-specific visual patterns and safety constraints unique to healthcare settings."
      ]
    },
    {
      "type": "prose",
      "heading": "Sensor Configuration and Collection Methodology",
      "paragraphs": [
        "Collection uses lightweight head-mounted cameras (modified GoPro HERO12 Black with medical-grade housing) that comply with infection control requirements -- all external surfaces are smooth, non-porous, and compatible with hospital-grade disinfection protocols (Cavicide, bleach wipes). RGB is captured at 1080p/30fps. Depth data from co-mounted Intel RealSense D405 (compact form factor, 0.1-1.0m optimal range) provides aligned RGB-D pairs for the close-range manipulation distances typical in clinical settings.",
        "Collectors are licensed healthcare professionals -- registered nurses, surgical technologists, pharmacists, and clinical laboratory technicians -- performing genuine clinical tasks in operational healthcare facilities. All collection follows IRB-approved protocols with patient de-identification procedures applied in real-time: patient faces are never captured (camera angle is directed at hand workspace), and all patient-identifiable information visible in the frame (chart data, monitor screens, wristbands) is automatically detected and blurred before any human annotator reviews the footage.",
        "Clinical metadata is recorded for every session: facility type, department, procedure or task category, shift period (day/night -- lighting conditions differ dramatically), and equipment manifest. Session durations are 30-60 minutes, shorter than other domains to minimize disruption to clinical workflows. Collectors follow their normal task sequences rather than scripted procedures, ensuring natural transitions between tasks and realistic time pressure.",
        "The dataset captures the full range of healthcare lighting conditions: the harsh overhead fluorescents of operating rooms, the dim blue-lit nighttime ICU, the bright LED task lighting of pharmacy compounding hoods, and the mixed ambient lighting of general patient care areas. These conditions are critical for training perception systems that must maintain instrument tracking accuracy across the lighting extremes found in real clinical environments."
      ]
    },
    {
      "type": "comparison-table",
      "heading": "Comparison with Public Datasets",
      "description": "How Claru's egocentric healthcare dataset compares to publicly available alternatives for medical robotics and clinical AI.",
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
          "Dataset": "Cholec80 (MICCAI 2016)",
          "Clips": "80 videos",
          "Hours": "~40",
          "Modalities": "Endoscopic RGB",
          "Environments": "Cholecystectomy OR",
          "Annotations": "7 surgical phases, 7 tools"
        },
        {
          "Dataset": "JIGSAWS (2014)",
          "Clips": "~100 trials",
          "Hours": "~5",
          "Modalities": "da Vinci kinematics",
          "Environments": "Surgical simulator",
          "Annotations": "Surgical gestures, skill"
        },
        {
          "Dataset": "EgoExo4D Medical subset",
          "Clips": "~500",
          "Hours": "~8",
          "Modalities": "RGB",
          "Environments": "Limited clinical",
          "Annotations": "Activity labels"
        },
        {
          "Dataset": "Claru Egocentric Healthcare",
          "Clips": "35K+",
          "Hours": "250+",
          "Modalities": "RGB-D",
          "Environments": "10+ clinical settings",
          "Annotations": "Instruments, procedures, sterile field, medications, hand-object"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Annotation Pipeline and Quality Assurance",
      "paragraphs": [
        "Healthcare annotations require specialized domain expertise and strict privacy compliance. Stage one applies automated pre-labeling: DINOv2 for instrument and equipment segmentation, SAM2 for instance masks of clinical objects, and a custom patient-identifiable-information (PII) detector that flags and blurs any visible patient data, monitor displays, or identifying features before human review. This PII detection runs before any annotator sees the footage, ensuring HIPAA-aligned data handling.",
        "Stage two involves licensed healthcare professionals who add clinical domain annotations: procedure phase classification following established surgical workflow ontologies, instrument identification across 60+ clinical instrument categories (from hemostats to IV catheters to medication syringes), sterile field boundary tracking, medication handling steps (draw, verify, label, administer), and patient interaction classifications (vital signs check, wound care, patient transfer, repositioning).",
        "Stage three quality assurance is particularly rigorous for healthcare data. Every annotated clip is reviewed by a second clinical annotator from the same specialty. Instrument identification accuracy targets 97%+ (misidentified instruments in a training dataset could teach a robot to select the wrong tool). Procedure phase boundaries must agree within 2 seconds. Sterile field violations must be unanimously flagged. Clips failing QA are re-annotated by senior clinical reviewers.",
        "The complete annotation taxonomy covers 90+ clinical action verbs (aspirate, irrigate, palpate, dress, catheterize, defibrillate), 60+ instrument and equipment categories, 25+ medication handling states, procedure phase ontologies for 8 major clinical workflows, and patient interaction safety classifications. All annotation schemas are designed in consultation with clinical informaticists to ensure compatibility with existing healthcare AI research standards."
      ]
    },
    {
      "type": "cards",
      "heading": "Use Cases",
      "cards": [
        {
          "title": "Surgical Assistance Robotics",
          "description": "Training instrument handoff, retraction, and suturing assistance policies for surgical robots. Egocentric demonstrations capture the instrument selection logic and hand-coordination patterns that experienced surgical teams develop. Example architectures: RT-2, ACT, Diffusion Policy."
        },
        {
          "title": "Clinical Workflow Automation",
          "description": "Pharmacy compounding verification, medication preparation tracking, specimen processing, and supply restocking. Models learn the sequential logic and safety checkpoints of clinical workflows from expert demonstrations. Applications in nursing robots like Diligent Robotics Moxi and Aethon TUG."
        },
        {
          "title": "Patient Handling and Rehabilitation",
          "description": "Training assistive robots for patient transfer, repositioning, and rehabilitation exercises. The egocentric view captures the body mechanics and support points that experienced caregivers use, critical for safe human-robot physical interaction in patient care."
        }
      ]
    },
    {
      "type": "citation-list",
      "heading": "Key References",
      "citations": [
        {
          "id": "twinanda-cholec80-2017",
          "title": "EndoNet: A Deep Architecture for Recognition Tasks on Laparoscopic Videos",
          "authors": "Twinanda et al.",
          "venue": "IEEE TMI 2017",
          "year": 2017,
          "url": "https://arxiv.org/abs/1602.03012"
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
          "id": "hager-surgical-2020",
          "title": "Surgical Data Science -- from Concepts toward Clinical Translation",
          "authors": "Maier-Hein, Vedula et al.",
          "venue": "Medical Image Analysis 2022",
          "year": 2022,
          "url": "https://arxiv.org/abs/2011.02284"
        },
        {
          "id": "chi-diffusion-policy-2023",
          "title": "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
          "authors": "Chi et al.",
          "venue": "RSS 2023",
          "year": 2023,
          "url": "https://arxiv.org/abs/2303.04137"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "How Claru Delivers This Data",
      "paragraphs": [
        "Claru's healthcare data collection operates under IRB-approved protocols with HIPAA-aligned data handling procedures. All patient-identifiable information is detected and removed before any annotation or delivery. Collection spans hospital systems, outpatient clinics, pharmacies, and rehabilitation centers across multiple geographic regions, capturing the diversity of equipment, layouts, and clinical practices that healthcare robots must handle.",
        "Custom campaigns can target specific clinical settings (OR, ICU, pharmacy, lab), procedure types, instrument categories, or patient interaction scenarios. Healthcare data requires longer lead times due to IRB coordination -- typical turnaround is 6-10 weeks from campaign specification to annotated delivery.",
        "Data is delivered in your preferred format with all privacy protections applied. Clinical metadata (de-identified) accompanies every clip, including department type, procedure category, and equipment manifest. Annotation exports support standard medical AI research formats as well as robotics training formats (RLDS, HDF5, WebDataset, LeRobot)."
      ]
    }
  ],
  "faqs": [
    {
      "question": "How is patient privacy protected in this dataset?",
      "answer": "All collection follows IRB-approved protocols. Patient faces are never captured (camera angle targets hand workspace). Automated PII detection identifies and blurs patient-identifiable information (chart data, monitor screens, wristbands) before any human annotator reviews footage. All data handling follows HIPAA-aligned procedures."
    },
    {
      "question": "What clinical settings are covered?",
      "answer": "10+ settings including operating rooms, ICU, emergency departments, pharmacy compounding areas, clinical laboratories, rehabilitation facilities, general patient care floors, outpatient clinics, specimen processing labs, and medical supply areas."
    },
    {
      "question": "Can this data be used for surgical robot training?",
      "answer": "Yes. The dataset includes surgical assistance tasks (instrument handling, sterile field management, retraction support) captured from the surgical team's perspective. However, it is not endoscopic data -- it captures the external manipulation view that surgical assistance robots operate from."
    },
    {
      "question": "What instrument categories are annotated?",
      "answer": "60+ instrument categories spanning surgical instruments (hemostats, retractors, scalpels, needle drivers), clinical tools (syringes, IV sets, catheters, blood pressure cuffs), pharmacy equipment (compounding hoods, vials, labels), and general clinical supplies."
    },
    {
      "question": "Is IRB approval included with the dataset?",
      "answer": "Claru's collection operates under our umbrella IRB protocol. Customers receive a data use agreement and de-identification certification. If your institution requires specific IRB coordination, Claru's clinical research team can assist with the approval process."
    }
  ],
  "ctaHeading": "Request a Sample Pack",
  "ctaDescription": "Get a curated sample of de-identified egocentric healthcare video with clinical annotations to evaluate for your medical robotics or workflow automation project.",
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
      "depth"
    ],
    "totalClips": "35K+",
    "totalHours": "250+",
    "annotationLayers": [
      "Clinical procedure phase classification",
      "Instrument identification and tracking (60+ categories)",
      "Sterile field boundary monitoring",
      "Medication handling steps and verification",
      "Hand-object interaction contacts",
      "Patient interaction safety classifications",
      "Instance segmentation (instruments, equipment, supplies)",
      "Clinical action segments (90+ verbs)",
      "Equipment state tracking",
      "Depth maps (hardware RealSense D405)",
      "De-identified clinical metadata",
      "Lighting condition classification"
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
      "name": "Cholec80",
      "clips": "80 videos",
      "hours": "~40",
      "modalities": "Endoscopic RGB",
      "environments": "Cholecystectomy OR",
      "annotations": "7 surgical phases, 7 tools"
    },
    {
      "name": "JIGSAWS",
      "clips": "~100 trials",
      "hours": "~5",
      "modalities": "da Vinci kinematics",
      "environments": "Surgical simulator",
      "annotations": "Surgical gestures, skill"
    },
    {
      "name": "EgoExo4D Medical subset",
      "clips": "~500",
      "hours": "~8",
      "modalities": "RGB",
      "environments": "Limited clinical",
      "annotations": "Activity labels"
    },
    {
      "name": "Claru Egocentric Healthcare",
      "clips": "35K+",
      "hours": "250+",
      "modalities": "RGB-D",
      "environments": "10+ clinical settings",
      "annotations": "Instruments, procedures, sterile field, medications, hand-object"
    }
  ],
  "useCases": [
    {
      "modelType": "Surgical Assistance Robotics",
      "description": "Training instrument handoff, retraction, and suturing assistance policies from egocentric surgical team demonstrations.",
      "exampleModels": [
        "RT-2",
        "ACT",
        "Diffusion Policy",
        "pi0"
      ]
    },
    {
      "modelType": "Clinical Workflow Automation",
      "description": "Pharmacy compounding verification, medication preparation tracking, specimen processing, and supply management from expert clinical demonstrations.",
      "exampleModels": [
        "Florence-2",
        "InternVL",
        "DINOv2",
        "PaLI"
      ]
    },
    {
      "modelType": "Patient Handling and Rehabilitation",
      "description": "Training assistive robots for patient transfer, repositioning, and rehabilitation exercises using caregiver egocentric demonstrations.",
      "exampleModels": [
        "OpenVLA",
        "Octo",
        "ALOHA",
        "Mobile ALOHA"
      ]
    }
  ],
  "keyPapers": [
    {
      "id": "twinanda-cholec80-2017",
      "title": "EndoNet: A Deep Architecture for Recognition Tasks on Laparoscopic Videos",
      "authors": "Twinanda et al.",
      "venue": "IEEE TMI 2017",
      "year": 2017,
      "url": "https://arxiv.org/abs/1602.03012"
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
      "id": "hager-surgical-2020",
      "title": "Surgical Data Science -- from Concepts toward Clinical Translation",
      "authors": "Maier-Hein, Vedula et al.",
      "venue": "Medical Image Analysis 2022",
      "year": 2022,
      "url": "https://arxiv.org/abs/2011.02284"
    },
    {
      "id": "chi-diffusion-policy-2023",
      "title": "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
      "authors": "Chi et al.",
      "venue": "RSS 2023",
      "year": 2023,
      "url": "https://arxiv.org/abs/2303.04137"
    }
  ],
  "claruRelevance": "Claru's healthcare data collection operates under IRB-approved protocols with HIPAA-aligned de-identification, capturing genuine clinical workflows from the practitioner's perspective across 10+ clinical settings. Dense annotations covering 90+ clinical actions, 60+ instrument categories, procedure phases, and sterile field tracking enable training medical assistance robots and clinical workflow AI systems that meet the safety standards required for healthcare deployment."
};

export default data;
