import type { IndustryPageData } from "./types";

const data: IndustryPageData = {
  "slug": "healthcare-robotics",
  "metaTitle": "Healthcare Robotics Training Data | Claru",
  "metaDescription": "Training data for healthcare robots: surgical assistants, patient care robots, pharmacy automation, and clinical workflow AI. HIPAA-compliant collection protocols.",
  "primaryKeyword": "healthcare robotics training data",
  "secondaryKeywords": [
    "healthcare robotics data",
    "healthcare robotics AI data",
    "healthcare robotics AI",
    "healthcare robotics datasets"
  ],
  "canonicalPath": "/industries/healthcare-robotics",
  "h1": "Healthcare Robotics Training Data",
  "heroSubtitle": "Training data for healthcare robots: surgical assistants, patient care robots, pharmacy automation, and clinical workflow AI. HIPAA-compliant collection protocols.",
  "breadcrumbs": [
    {
      "label": "Home",
      "href": "/"
    },
    {
      "label": "Industries",
      "href": "/industries"
    },
    {
      "label": "Healthcare Robotics",
      "href": "/industries/healthcare-robotics"
    }
  ],
  "sections": [
    {
      "type": "cards",
      "heading": "Regulatory Requirements",
      "cards": [
        {
          "title": "HIPAA (United States)",
          "description": "Health Insurance Portability and Accountability Act governs Protected Health Information (PHI). All patient-identifiable data must be de-identified or collected under Business Associate Agreements. Video must exclude patient faces, medical records, and identifying marks."
        },
        {
          "title": "FDA 21 CFR Part 820 (United States)",
          "description": "Quality System Regulation for medical devices including software as a medical device (SaMD). Training data for FDA-regulated robotic systems requires full traceability: provenance, annotation quality metrics, and validation against clinical ground truth."
        },
        {
          "title": "GDPR Article 9 (European Union)",
          "description": "Special category data rules covering health data processing. Health-related training data in the EU requires explicit consent or research exemption, with Data Protection Impact Assessments for large-scale processing."
        },
        {
          "title": "MDR (EU 2017/745) (European Union)",
          "description": "Medical Device Regulation covering AI/ML-based medical devices. Clinical training data must demonstrate representativeness across patient demographics and clinical presentations for CE-marked robotic devices."
        }
      ]
    },
    {
      "type": "cards",
      "heading": "Environment Characteristics",
      "cards": [
        {
          "title": "Sterile Environments",
          "description": "Operating rooms, procedure suites, and cleanrooms require sterile conditions. Data challenge: Data collection hardware must be sterilizable or contained. Reflective surfaces, bright surgical lights, and transparent fluids challenge depth sensors."
        },
        {
          "title": "Patient Privacy Zones",
          "description": "Hospital rooms, examination areas, and waiting rooms with patient presence. Data challenge: De-identification protocols must run before data leaves the collection site. Audio must be stripped or consented."
        },
        {
          "title": "Dynamic Clinical Workflow",
          "description": "Multi-person teams performing coordinated procedures with time-critical steps. Data challenge: Annotation requires clinical domain expertise. Action segmentation must capture medically meaningful boundaries, not just motion changes."
        }
      ]
    },
    {
      "type": "cards",
      "heading": "Common Robotics Tasks",
      "cards": [
        {
          "title": "Surgical Assistance",
          "description": "Robotic arms assisting in minimally invasive surgery — instrument handling, tissue retraction, suturing. Data requirements: High-resolution stereo video (4K+), instrument tracking, tissue deformation modeling, force feedback data at 1kHz."
        },
        {
          "title": "Patient Mobility Assistance",
          "description": "Helping patients stand, transfer to wheelchairs, and walk — requiring safe physical human-robot interaction. Data requirements: Multi-view video of patient transfers, force/torque at contact points, patient pose estimation, fall risk indicators."
        },
        {
          "title": "Pharmacy Automation",
          "description": "Automated medication dispensing, counting, sorting, and packaging in hospital pharmacies. Data requirements: High-res product images for medication identification, barcode/label reading, bin-picking trajectories for diverse medication packaging."
        },
        {
          "title": "Clinical Workflow Optimization",
          "description": "Understanding staff movement patterns, procedure timing, and resource utilization. Data requirements: Anonymized egocentric video of clinical workflows, temporal activity annotations, room occupancy data, equipment usage tracking."
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Relevant Data Modalities",
      "paragraphs": [
        "RGB video, Depth sensing, Force/torque, Stereo endoscopic, CT/MRI (synthetic) are the primary data modalities for healthcare robotics training data. Each modality captures different aspects of the healthcare robotics environment, and the optimal sensor mix depends on the specific robotic application."
      ]
    },
    {
      "type": "citation-list",
      "heading": "Key References",
      "citations": [
        {
          "id": "attanasio-surgical-2021",
          "title": "Autonomy in Surgical Robotics",
          "authors": "Attanasio et al.",
          "venue": "Annual Review of Control, Robotics, and Autonomous Systems 2021",
          "year": 2021,
          "url": "https://arxiv.org/abs/2006.12710"
        },
        {
          "id": "hein-patient-2020",
          "title": "Towards Safe Robot-Assisted Patient Transfer",
          "authors": "Hein et al.",
          "venue": "IEEE RA-L 2020",
          "year": 2020,
          "url": "https://ieeexplore.ieee.org/document/9001230"
        },
        {
          "id": "hashimoto-ai-surgery-2018",
          "title": "Artificial Intelligence in Surgery: Promises and Perils",
          "authors": "Hashimoto et al.",
          "venue": "Annals of Surgery 2018",
          "year": 2018,
          "url": "https://pubmed.ncbi.nlm.nih.gov/29389679/"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "How Claru Serves This Industry",
      "paragraphs": [
        "Claru operates HIPAA-compliant data collection under Business Associate Agreements, with on-site de-identification before data transfer. Our clinical collection partners include simulation centers and consenting clinical facilities. We provide the regulatory documentation (data provenance, annotation QA metrics, demographic representativeness reports) required for FDA and MDR regulatory submissions."
      ]
    }
  ],
  "faqs": [
    {
      "question": "Is Claru HIPAA compliant?",
      "answer": "Yes. Claru operates under Business Associate Agreements for healthcare data. All collection follows HIPAA Safe Harbor de-identification with automated face blurring, PHI redaction, and metadata scrubbing before data leaves collection sites."
    },
    {
      "question": "Can this data support FDA regulatory submissions?",
      "answer": "Claru provides full data provenance documentation, annotation quality metrics (inter-annotator agreement, error rates), and demographic representativeness analysis suitable for FDA 510(k) and De Novo regulatory submissions for AI/ML-based medical devices."
    },
    {
      "question": "What clinical environments does Claru collect in?",
      "answer": "Current collection spans surgical simulation centers, physical therapy clinics, pharmacy environments, and general hospital workflows. Operating room data is collected in simulation facilities with realistic surgical setups."
    },
    {
      "question": "How is patient data protected during collection?",
      "answer": "De-identification runs on-site before data transfer: automated face blurring, audio stripping, text/badge redaction, and metadata scrubbing. Only de-identified data enters Claru's annotation pipeline."
    },
    {
      "question": "What annotation expertise is required for healthcare data?",
      "answer": "Claru employs annotators with clinical domain training for healthcare datasets. Surgical annotations are reviewed by practicing surgeons. Physical therapy annotations are reviewed by licensed PTs."
    }
  ],
  "ctaHeading": "Discuss Healthcare Robotics Data Needs",
  "ctaDescription": "Tell us about your healthcare robotics project. Claru will scope a data collection and annotation plan tailored to your requirements.",
  "relatedGlossaryTerms": [
    "embodied-ai",
    "physical-ai",
    "teleoperation-data"
  ],
  "relatedGuidePages": [],
  "relatedSolutionSlugs": [],
  "regulations": [
    {
      "name": "HIPAA",
      "jurisdiction": "United States",
      "description": "Health Insurance Portability and Accountability Act governs Protected Health Information (PHI).",
      "dataImplications": "All patient-identifiable data must be de-identified or collected under Business Associate Agreements. Video must exclude patient faces, medical records, and identifying marks."
    },
    {
      "name": "FDA 21 CFR Part 820",
      "jurisdiction": "United States",
      "description": "Quality System Regulation for medical devices including software as a medical device (SaMD).",
      "dataImplications": "Training data for FDA-regulated robotic systems requires full traceability: provenance, annotation quality metrics, and validation against clinical ground truth."
    },
    {
      "name": "GDPR Article 9",
      "jurisdiction": "European Union",
      "description": "Special category data rules covering health data processing.",
      "dataImplications": "Health-related training data in the EU requires explicit consent or research exemption, with Data Protection Impact Assessments for large-scale processing."
    },
    {
      "name": "MDR (EU 2017/745)",
      "jurisdiction": "European Union",
      "description": "Medical Device Regulation covering AI/ML-based medical devices.",
      "dataImplications": "Clinical training data must demonstrate representativeness across patient demographics and clinical presentations for CE-marked robotic devices."
    }
  ],
  "environmentCharacteristics": [
    {
      "characteristic": "Sterile Environments",
      "description": "Operating rooms, procedure suites, and cleanrooms require sterile conditions.",
      "dataChallenge": "Data collection hardware must be sterilizable or contained. Reflective surfaces, bright surgical lights, and transparent fluids challenge depth sensors."
    },
    {
      "characteristic": "Patient Privacy Zones",
      "description": "Hospital rooms, examination areas, and waiting rooms with patient presence.",
      "dataChallenge": "De-identification protocols must run before data leaves the collection site. Audio must be stripped or consented."
    },
    {
      "characteristic": "Dynamic Clinical Workflow",
      "description": "Multi-person teams performing coordinated procedures with time-critical steps.",
      "dataChallenge": "Annotation requires clinical domain expertise. Action segmentation must capture medically meaningful boundaries, not just motion changes."
    }
  ],
  "commonTasks": [
    {
      "task": "Surgical Assistance",
      "description": "Robotic arms assisting in minimally invasive surgery — instrument handling, tissue retraction, suturing.",
      "dataRequirements": "High-resolution stereo video (4K+), instrument tracking, tissue deformation modeling, force feedback data at 1kHz."
    },
    {
      "task": "Patient Mobility Assistance",
      "description": "Helping patients stand, transfer to wheelchairs, and walk — requiring safe physical human-robot interaction.",
      "dataRequirements": "Multi-view video of patient transfers, force/torque at contact points, patient pose estimation, fall risk indicators."
    },
    {
      "task": "Pharmacy Automation",
      "description": "Automated medication dispensing, counting, sorting, and packaging in hospital pharmacies.",
      "dataRequirements": "High-res product images for medication identification, barcode/label reading, bin-picking trajectories for diverse medication packaging."
    },
    {
      "task": "Clinical Workflow Optimization",
      "description": "Understanding staff movement patterns, procedure timing, and resource utilization.",
      "dataRequirements": "Anonymized egocentric video of clinical workflows, temporal activity annotations, room occupancy data, equipment usage tracking."
    }
  ],
  "relevantModalities": [
    "RGB video",
    "Depth sensing",
    "Force/torque",
    "Stereo endoscopic",
    "CT/MRI (synthetic)"
  ],
  "keyPapers": [
    {
      "id": "attanasio-surgical-2021",
      "title": "Autonomy in Surgical Robotics",
      "authors": "Attanasio et al.",
      "venue": "Annual Review of Control, Robotics, and Autonomous Systems 2021",
      "year": 2021,
      "url": "https://arxiv.org/abs/2006.12710"
    },
    {
      "id": "hein-patient-2020",
      "title": "Towards Safe Robot-Assisted Patient Transfer",
      "authors": "Hein et al.",
      "venue": "IEEE RA-L 2020",
      "year": 2020,
      "url": "https://ieeexplore.ieee.org/document/9001230"
    },
    {
      "id": "hashimoto-ai-surgery-2018",
      "title": "Artificial Intelligence in Surgery: Promises and Perils",
      "authors": "Hashimoto et al.",
      "venue": "Annals of Surgery 2018",
      "year": 2018,
      "url": "https://pubmed.ncbi.nlm.nih.gov/29389679/"
    }
  ],
  "claruRelevance": "Claru operates HIPAA-compliant data collection under Business Associate Agreements, with on-site de-identification before data transfer. Our clinical collection partners include simulation centers and consenting clinical facilities. We provide the regulatory documentation (data provenance, annotation QA metrics, demographic representativeness reports) required for FDA and MDR regulatory submissions."
};

export default data;
