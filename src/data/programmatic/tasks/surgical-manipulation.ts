import type { TaskPageData } from "../types";

const data: TaskPageData = {
  slug: "surgical-manipulation",
  metaTitle: "Surgical Robot Training Data | Claru",
  metaDescription: "Training data for surgical robots: tissue manipulation, suturing, cutting. Sub-millimeter precision demonstrations with force feedback for autonomous surgical systems.",
  primaryKeyword: "surgical robot training data",
  secondaryKeywords: ["surgical manipulation dataset", "robotic surgery data", "da vinci training data", "suturing robot dataset", "surgical autonomy training", "dVRK demonstration data"],
  canonicalPath: "/training-data/surgical-manipulation",
  h1: "Surgical Manipulation Training Data",
  heroSubtitle: "High-precision surgical manipulation datasets — suturing, tissue retraction, cutting, and needle driving with sub-millimeter accuracy and force-guided demonstrations for autonomous surgical systems.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Training Data", href: "/training-data" },
    { label: "Surgical Manipulation", href: "/training-data/surgical-manipulation" },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Is Surgical Manipulation and Why Does Data Quality Matter More Here?",
      paragraphs: [
        "Surgical manipulation encompasses robotic tasks performed inside or on the human body: suturing wounds, retracting tissue for visibility, cutting along precise trajectories, driving needles through tissue layers, and manipulating surgical instruments through trocar ports. The stakes are uniquely high — errors measured in millimeters can mean the difference between a successful procedure and a complication. This makes surgical manipulation the most demanding robotics domain for data quality, with tolerance requirements an order of magnitude tighter than industrial or household tasks.",
        "The dominant surgical robot platform, Intuitive Surgical's da Vinci system, has been deployed in over 12 million procedures worldwide, generating massive quantities of surgical video and kinematics data. However, this data is largely unusable for policy training in its raw form. The JIGSAWS dataset (Gao et al., 2014) — the most widely used benchmark — contains only 103 demonstrations across three tasks (suturing, needle passing, knot tying) from 8 surgeons, recorded on the da Vinci Research Kit (dVRK). Modern learning approaches require 10-100x this volume, and the controlled conditions of JIGSAWS do not reflect the variability of real surgical environments.",
        "The regulatory landscape adds another data dimension. FDA-cleared surgical autonomy requires demonstration of safety across patient populations, tissue types, and failure scenarios. This means surgical training datasets need not just successful demonstrations but carefully curated failure cases — tissue tears, missed suture points, excessive force events — annotated with severity levels and corrective actions. The data annotation pipeline must be validated by credentialed surgeons, adding a quality assurance layer absent from other robotics domains.",
        "The cost structure of surgical data is fundamentally different from other manipulation domains. Collecting demonstrations requires access to surgical simulation centers ($500-2,000 per day facility cost), surgical-grade phantoms or ex-vivo tissue ($50-500 per specimen), credentialed operators ($150-500 per hour for experienced surgeons), and specialized annotation by clinical experts ($50-200 per annotated demonstration hour). A single dataset of 1,000 suturing demonstrations on phantom tissue costs $50K-150K — an order of magnitude more expensive than equivalent-scale manipulation data in other domains. This cost premium makes data efficiency critical: every surgical demonstration must be maximally annotated and every collection session optimally utilized.",
      ],
    },
    {
      type: "stats",
      heading: "Surgical Data Requirements",
      stats: [
        { value: "1K-10K", label: "Demos per procedure type" },
        { value: "1 kHz", label: "Force/torque sensing rate" },
        { value: "< 0.5 mm", label: "Required positional accuracy" },
        { value: "103", label: "Demos in JIGSAWS benchmark" },
      ],
    },
    {
      type: "comparison-table",
      heading: "Data Requirements by Surgical Task",
      description: "Surgical subtasks vary in their complexity, force sensitivity, and data requirements.",
      columns: ["Task", "Data Volume", "Force Sensitivity", "Visual Challenge", "Autonomy Level"],
      rows: [
        { "Task": "Tissue retraction", "Data Volume": "500-2K demos", "Force Sensitivity": "Medium (2-10 N)", "Visual Challenge": "Occlusion from instruments", "Autonomy Level": "Supervised autonomy" },
        { "Task": "Suturing", "Data Volume": "2K-5K demos", "Force Sensitivity": "High (0.1-5 N)", "Visual Challenge": "Needle tracking through tissue", "Autonomy Level": "Shared control" },
        { "Task": "Cutting/dissection", "Data Volume": "1K-3K demos", "Force Sensitivity": "Very high (tissue-dependent)", "Visual Challenge": "Bleeding obscures view", "Autonomy Level": "Supervised autonomy" },
        { "Task": "Knot tying", "Data Volume": "2K-5K demos", "Force Sensitivity": "High (thread tension)", "Visual Challenge": "Self-occlusion of thread", "Autonomy Level": "Full task autonomy" },
        { "Task": "Needle driving", "Data Volume": "1K-3K demos", "Force Sensitivity": "Very high (< 1 N precision)", "Visual Challenge": "Needle tip in tissue", "Autonomy Level": "Shared control" },
      ],
    },
    {
      type: "prose",
      heading: "State of the Art in Surgical Autonomy",
      paragraphs: [
        "The Surgical Robot Learning (SurRoL) platform (Xu et al., 2021) provides a simulation environment for surgical task learning, but the sim-to-real gap for tissue mechanics is severe — real tissue is heterogeneous, anisotropic, and patient-specific in ways that finite element models cannot capture. The most impactful recent work uses real demonstration data. Scheikl et al. (2023) trained a Diffusion Policy for suturing on the dVRK from 200 demonstrations and achieved 78% success on phantom tissue, but success dropped to 51% on ex-vivo tissue due to the visual and mechanical domain shift.",
        "The ORBIT-Surgical benchmark (Yu et al., 2024) from NVIDIA provides 14 surgical tasks in Isaac Sim, but acknowledges that real-world validation requires real data. The most promising hybrid approach trains perception modules (tissue segmentation, instrument tracking, needle detection) on simulation with domain randomization, then trains the manipulation policy on real demonstrations. This decomposition reduces the real-data requirement from 10K+ episodes to 1-3K per task, but only if the perception modules transfer reliably.",
        "Language-conditioned surgical policies represent the frontier. Surgical procedures follow structured protocols that can be expressed as step-by-step instructions. Training a VLA on (instruction, observation, action) tuples enables a single model to handle multiple procedure phases. However, this requires dense step-level annotations from credentialed surgeons — a bottleneck that makes large-scale surgical dataset creation expensive relative to other domains. Current estimates suggest $50-200 per annotated demonstration hour for surgeon-validated annotations.",
        "Transfer learning from non-surgical dexterous manipulation data shows promise for reducing the surgical data requirement. Pretraining manipulation encoders on large-scale general manipulation data (DROID, Open X-Embodiment) and then fine-tuning on surgical demonstrations can reduce the surgical-specific data requirement by 3-5x. The key insight is that visual features (instrument tracking, workspace awareness) and low-level motor patterns (approach, contact, retract) transfer between domains, while only the surgical-specific semantics (tissue interaction models, force safety thresholds, procedural knowledge) require domain-specific data.",
      ],
    },
    {
      type: "prose",
      heading: "Collection Methodology for Surgical Data",
      paragraphs: [
        "Surgical data collection operates under constraints absent from other domains. Collection uses surgical simulation platforms (dVRK, Raven II) with phantom tissue (silicone models replicating tissue mechanical properties) and, for higher-fidelity data, cadaveric or ex-vivo animal tissue. The sensor stack includes stereo endoscopic cameras (720p or 1080p at 30 Hz), 6-axis force/torque sensors on each instrument (1 kHz), and full joint kinematics (200+ Hz) capturing the 7-DoF instrument articulation.",
        "Annotation for surgical data follows the Surgical Gesture Classification framework from JIGSAWS: each demonstration is segmented into atomic gestures (reaching, positioning, pushing, pulling, orienting, inserting, retracting, transferring) with transition timestamps. Overlaid on gestures are safety annotations: force threshold violations (excessive force that would damage tissue), deviation from planned trajectory (measured as distance from the optimal path), and error events (dropped needle, missed tissue, inadvertent contact). All safety annotations require validation by a surgeon or surgical resident.",
        "Operator diversity is handled differently in surgical data. Rather than maximizing operator count, the goal is to capture skill levels: novice surgeons (residents in training), competent surgeons (5-10 years experience), and expert surgeons (attending surgeons). The JIGSAWS dataset demonstrated that gesture recognition models trained across skill levels generalize better than those trained on experts alone. Claru partners with simulation centers and surgical training facilities to collect across the full skill spectrum.",
        "Tissue preparation and management is a logistics challenge unique to surgical data. Phantom tissue degrades over repeated use (silicone tears, hydrogel dries out), requiring replacement every 10-50 demonstrations depending on the task. Ex-vivo tissue has a limited viability window (4-8 hours for porcine tissue at room temperature) and requires proper cold chain logistics. Cadaveric tissue requires institutional review board (IRB) approval and specialized handling protocols. Claru's collection planning accounts for these constraints, scheduling tissue-intensive tasks in concentrated bursts with pre-staged replacement specimens to maximize the demonstrations per tissue specimen and minimize waste. Each specimen is tagged with a unique identifier linking it to every demonstration collected on it, enabling tissue-specific analysis of data quality.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Key Datasets for Surgical Manipulation",
      columns: ["Dataset", "Year", "Demos", "Tasks", "Modalities", "Tissue Type"],
      rows: [
        { "Dataset": "JIGSAWS", "Year": "2014", "Demos": "103", "Tasks": "3 (suture, needle, knot)", "Modalities": "Stereo video + kinematics", "Tissue Type": "Phantom" },
        { "Dataset": "CATARACTS", "Year": "2017", "Demos": "50 surgical videos", "Tasks": "Cataract surgery", "Modalities": "Monocular video", "Tissue Type": "Live (human)" },
        { "Dataset": "CholecT50", "Year": "2022", "Demos": "50 surgical videos", "Tasks": "Cholecystectomy phases", "Modalities": "Video + instrument labels", "Tissue Type": "Live (human)" },
        { "Dataset": "SurRoL-generated", "Year": "2023", "Demos": "10K+ (sim)", "Tasks": "10 tasks", "Modalities": "RGB + kinematics", "Tissue Type": "Simulated" },
        { "Dataset": "Claru Custom", "Year": "2026", "Demos": "1K-10K", "Tasks": "Configurable", "Modalities": "Stereo + F/T + kinematics", "Tissue Type": "Phantom + ex-vivo" },
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        { id: "gao-jigsaws-2014", title: "JHU-ISI Gesture and Skill Assessment Working Set (JIGSAWS)", authors: "Gao et al.", venue: "Johns Hopkins Technical Report", year: 2014, url: "https://cirl.lcsr.jhu.edu/research/hmm/datasets/jigsaws_release/" },
        { id: "xu-surrol-2021", title: "SurRoL: An Open-Source Reinforcement Learning Centered and dVRK Compatible Platform for Surgical Robot Learning", authors: "Xu et al.", venue: "IROS 2021", year: 2021, url: "https://arxiv.org/abs/2108.13035" },
        { id: "scheikl-surgical-diffusion-2023", title: "Movement Primitive Diffusion for Surgical Autonomy", authors: "Scheikl et al.", venue: "CoRL 2023", year: 2023, url: "https://arxiv.org/abs/2312.12086" },
        { id: "yu-orbit-surgical-2024", title: "ORBIT-Surgical: An Open-Simulation Framework for Learning Surgical Augmented Dexterity", authors: "Yu et al.", venue: "ICRA 2024", year: 2024, url: "https://arxiv.org/abs/2404.16027" },
      ],
    },
  ],
  faqs: [
    {
      question: "How many surgical demonstrations are needed for autonomous suturing?",
      answer: "JIGSAWS contains 103 demonstrations — sufficient for gesture recognition but not policy learning. Current state-of-the-art suturing policies require 1,000-5,000 demonstrations for phantom tissue and 2,000-10,000 for robust performance on variable real tissue. Scheikl et al. achieved 78% success on phantom tissue from 200 demonstrations with Diffusion Policy, but production deployment would require 10x more data to cover tissue variability and edge cases.",
    },
    {
      question: "Can simulation replace real surgical data?",
      answer: "Simulation (SurRoL, ORBIT-Surgical) is valuable for pretraining perception and basic motor skills, generating 10K+ episodes cheaply. However, the tissue mechanics sim-to-real gap is the most severe in all of robotics — tissue stiffness, tearing thresholds, and bleeding behavior vary between patients and even within a single organ. Policies trained purely in simulation show 20-30% success rate drops on phantom tissue and larger drops on ex-vivo tissue. Real data is indispensable for the manipulation policy component.",
    },
    {
      question: "Who should annotate surgical manipulation data?",
      answer: "Surgical gesture segmentation can be performed by trained technicians using the JIGSAWS framework. Safety-critical annotations — force threshold violations, tissue damage risk, procedural errors — must be validated by credentialed surgeons or senior surgical residents. Claru partners with surgical training centers where residents annotate under attending surgeon supervision, achieving both cost efficiency and clinical validity.",
    },
    {
      question: "What tissue types should surgical training data cover?",
      answer: "A progression from controlled to realistic: silicone phantoms for initial data collection (consistent properties, reusable), hydrogel phantoms for improved mechanical fidelity, ex-vivo animal tissue (porcine is standard) for realistic mechanics, and cadaveric tissue for the highest fidelity. Each level costs more and is less reproducible, so the recommended strategy is 60% phantom, 25% ex-vivo, and 15% cadaveric demonstrations, with data clearly labeled by tissue type.",
    },
    {
      question: "What force sensing resolution is needed for surgical data?",
      answer: "Surgical manipulation involves forces from 0.01 N (gentle tissue palpation) to 10+ N (suture tightening). The force/torque sensor must resolve 0.01 N at 1 kHz to capture the rapid force transients during needle insertion and tissue interaction. The ATI Nano17, commonly used on the dVRK, meets these specs. Data should include both raw F/T readings and derived metrics like peak force per gesture, force integral, and threshold violation events.",
    },
    {
      question: "How does surgical data collection handle regulatory requirements?",
      answer: "FDA pathway for surgical autonomy (De Novo or 510(k) depending on predicate devices) requires demonstrating safety across patient populations and failure scenarios. This means datasets need documented traceability: every demonstration must be linked to the operator credentials, tissue specimen ID, equipment calibration records, and annotation validation chain. Claru's surgical data pipeline produces ISO 13485-aligned documentation packages including collection SOPs, operator qualification records, annotation validation certificates signed by credentialed surgeons, and full chain-of-custody for tissue specimens. This documentation enables clients to include the training data in their regulatory submission without additional retroactive validation work.",
    },
  ],
  ctaHeading: "Get a Custom Quote for Surgical Manipulation Data",
  ctaDescription: "Specify your target procedure types, tissue requirements, and autonomy level. We will design a collection plan with the clinical validation your application demands.",
  relatedGlossaryTerms: ["manipulation-trajectory", "behavioral-cloning", "imitation-learning", "force-torque-sensing"],
  relatedGuidePages: ["how-to-build-a-manipulation-dataset"],
  relatedSolutionSlugs: [],
  dataRequirements: {
    modality: "Stereo endoscope (30 Hz) + 6-axis force/torque (1 kHz) + full joint kinematics (200 Hz)",
    volumeRange: "1K-10K demonstrations per procedure type",
    temporalResolution: "30 Hz stereo video, 1000 Hz force/torque, 200 Hz kinematics",
    keyAnnotations: ["Surgical gesture segmentation (JIGSAWS framework)", "Force safety threshold violations", "Tissue interaction labels (contact, penetration, tearing)", "Procedure phase classification", "Skill level assessment (novice/competent/expert)"],
  },
  relevantModels: ["Surgical Diffusion Policy", "SurRoL RL policies", "JIGSAWS gesture classifiers", "Language-conditioned surgical VLAs"],
  environmentTypes: ["dVRK simulation center", "Phantom tissue lab", "Ex-vivo tissue station", "Cadaver lab"],
  keyPapers: [
    { id: "gao-jigsaws-2014", title: "JHU-ISI Gesture and Skill Assessment Working Set (JIGSAWS)", authors: "Gao et al.", venue: "Johns Hopkins Technical Report", year: 2014, url: "https://cirl.lcsr.jhu.edu/research/hmm/datasets/jigsaws_release/" },
    { id: "xu-surrol-2021", title: "SurRoL: An Open-Source Reinforcement Learning Centered and dVRK Compatible Platform for Surgical Robot Learning", authors: "Xu et al.", venue: "IROS 2021", year: 2021, url: "https://arxiv.org/abs/2108.13035" },
    { id: "scheikl-surgical-diffusion-2023", title: "Movement Primitive Diffusion for Surgical Autonomy", authors: "Scheikl et al.", venue: "CoRL 2023", year: 2023, url: "https://arxiv.org/abs/2312.12086" },
    { id: "yu-orbit-surgical-2024", title: "ORBIT-Surgical: An Open-Simulation Framework for Learning Surgical Augmented Dexterity", authors: "Yu et al.", venue: "ICRA 2024", year: 2024, url: "https://arxiv.org/abs/2404.16027" },
  ],
  claruRelevance: "Claru partners with surgical simulation centers and training facilities to collect high-fidelity surgical manipulation data on dVRK and compatible platforms. Our collection covers phantom tissue (silicone and hydrogel), ex-vivo porcine tissue, and cadaveric specimens. Each episode includes synchronized stereo endoscope video, 1 kHz force/torque readings, full joint kinematics, and surgical gesture segmentation validated by credentialed surgeons. Safety annotations — force threshold violations, tissue damage events, procedural errors — undergo clinical review. We support suturing, tissue retraction, cutting, needle driving, and knot tying tasks at configurable complexity levels. Deliverables include RLDS or HDF5 datasets with full instrument calibration, tissue type metadata, and skill-level-stratified train/val/test splits.",
};

export default data;
