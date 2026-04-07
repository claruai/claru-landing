import type { TaskPageData } from "../types";

const data: TaskPageData = {
  slug: "cleaning-tasks",
  metaTitle: "Cleaning Robot Training Data | Claru",
  metaDescription: "Training data for cleaning robots: wiping surfaces, mopping floors, organizing clutter. Demonstrations with cleanliness assessment and coverage path planning data.",
  primaryKeyword: "cleaning robot training data",
  secondaryKeywords: ["cleaning robot dataset", "surface wiping data", "tidying robot demonstrations", "robotic cleaning training", "wiping manipulation data", "floor mopping robot dataset"],
  canonicalPath: "/training-data/cleaning-tasks",
  h1: "Cleaning Task Training Data",
  heroSubtitle: "Cleaning and tidying datasets for service robots — surface wiping, floor mopping, clutter organization, and sanitation tasks with cleanliness assessment labels and coverage path planning annotations.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Training Data", href: "/training-data" },
    { label: "Cleaning Task", href: "/training-data/cleaning-tasks" },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Are Robotic Cleaning Tasks and Why Do They Need Real-World Data?",
      paragraphs: [
        "Robotic cleaning encompasses contact-rich manipulation tasks — wiping counters, scrubbing surfaces, mopping floors, vacuuming, and organizing clutter — that require force control, coverage planning, and cleanliness assessment. Unlike autonomous vacuum robots that follow simple coverage algorithms, manipulation-based cleaning requires understanding what is dirty, choosing the right tool and technique, applying appropriate force without damaging surfaces, and verifying the result. A robot wiping a kitchen counter must distinguish between a water stain (light wipe), dried food (scrubbing with force), and a delicate surface (gentle pressure) — all from visual observation alone.",
        "The market pull is enormous. The global professional cleaning services market exceeds $340B annually, with labor shortages driving automation interest. Companies like Aeolus Robotics, Avidbots, and Hello Robot are building cleaning-capable mobile manipulators, but the data bottleneck is severe. TidyBot (Wu et al., 2023) demonstrated personalized tidying from a handful of demonstrations per household, but surface cleaning — which involves contact, force modulation, and quality assessment — requires 10-100x more demonstrations than non-contact rearrangement tasks.",
        "The data challenge is three-fold. First, cleaning is inherently subjective — different people have different standards for 'clean enough.' This requires collecting demonstrations from multiple operators and annotating cleanliness on a continuous scale rather than a binary pass/fail. Second, cleaning involves sustained contact with force modulation, making force/torque sensing essential alongside vision. Third, coverage planning (ensuring every part of a surface is cleaned) requires trajectory annotations that go beyond point-to-point movements to capture sweeping, circular, and back-and-forth cleaning patterns.",
        "Unlike most manipulation tasks where success is binary (the object is in the right place or it is not), cleaning success exists on a continuum. A surface can be partially clean, mostly clean, or spotlessly clean — and the acceptable threshold varies by deployment context. A hospital operating room demands sterilization-grade coverage, while a household kitchen counter just needs visible debris removed. This continuous quality spectrum means cleaning datasets must include not just demonstrations but paired quality assessments at multiple thresholds, enabling policies that adapt cleaning effort to the deployment standard. No other manipulation domain has this quality-adaptive requirement.",
      ],
    },
    {
      type: "stats",
      heading: "Cleaning Task Data at a Glance",
      stats: [
        { value: "2K-20K", label: "Cleaning episodes needed" },
        { value: "100 Hz", label: "Force/torque sensing rate" },
        { value: "$340B", label: "Global cleaning services market" },
        { value: "10+", label: "Surface types in production" },
      ],
    },
    {
      type: "comparison-table",
      heading: "Data Requirements by Cleaning Task Type",
      description: "Different cleaning subtasks have distinct data modality and volume needs.",
      columns: ["Task", "Data Volume", "Key Modality", "Force Range", "Coverage Metric"],
      rows: [
        { "Task": "Surface wiping", "Data Volume": "1K-5K demos", "Key Modality": "RGB + F/T", "Force Range": "1-15 N", "Coverage Metric": "% surface area cleaned" },
        { "Task": "Floor mopping", "Data Volume": "2K-10K demos", "Key Modality": "RGB + base odom", "Force Range": "5-30 N", "Coverage Metric": "Coverage map overlap" },
        { "Task": "Clutter organization", "Data Volume": "2K-10K demos", "Key Modality": "RGB-D + language", "Force Range": "Low (pick-and-place)", "Coverage Metric": "Clutter density reduction" },
        { "Task": "Scrubbing/stain removal", "Data Volume": "1K-3K demos", "Key Modality": "RGB + F/T + tactile", "Force Range": "10-50 N", "Coverage Metric": "Stain area reduction %" },
        { "Task": "Sanitization", "Data Volume": "500-2K demos", "Key Modality": "RGB + coverage map", "Force Range": "5-20 N", "Coverage Metric": "100% surface required" },
      ],
    },
    {
      type: "prose",
      heading: "State of the Art in Learned Cleaning Policies",
      paragraphs: [
        "Research on learned cleaning policies lags behind other manipulation tasks because cleaning requires sustained contact — most robot learning research focuses on discrete pick-and-place or short-horizon tasks. The most relevant work comes from three directions. TidyBot (Wu et al., 2023) uses LLM-based personalization to learn tidying preferences from few-shot demonstrations, achieving 85% success on object placement but not addressing surface cleaning. Mobile ALOHA (Fu et al., 2024) demonstrated bimanual wiping and mopping from 50 demonstrations per task, with the bimanual setup enabling one arm to hold a cleaning tool while the other stabilizes the surface or object being cleaned.",
        "Force-controlled wiping has been studied more extensively in industrial contexts. Luo et al. (2023) trained a hybrid force-position controller from demonstrations that adapts wiping force to the surface compliance — pressing harder on rigid counters and softer on wood. Their approach requires 500+ demonstrations per surface type to learn the force-compliance mapping. For coverage planning, Gaussian process models trained on human wiping trajectories can predict effective coverage paths, but these require dense trajectory annotations with per-timestep force readings — a data collection burden that limits scalability.",
        "The frontier is whole-task cleaning: a robot that enters a room, assesses what needs cleaning, selects tools, cleans surfaces, organizes clutter, and verifies the result. This requires integrating navigation, manipulation, force control, and quality assessment in a single system. No existing dataset covers this full pipeline. Current approaches decompose it into subtask policies (navigate, pick tool, wipe, assess), each trained on separate datasets, with an LLM-based task planner orchestrating the sequence.",
        "An emerging research direction uses visual language models to assess cleanliness from images. Rather than relying solely on before/after difference maps, these systems use VLMs to answer questions like 'is this counter clean enough for food preparation?' This semantic assessment aligns better with real deployment needs than pixel-level metrics. However, training these assessment models requires large datasets of images labeled with cleanliness judgments at multiple semantic levels — another data requirement that compounds the already demanding modality stack for cleaning robot training.",
      ],
    },
    {
      type: "prose",
      heading: "Collection Methodology for Cleaning Data",
      paragraphs: [
        "Cleaning data collection stations combine a mobile manipulator or table-mounted arm with surface workspaces of varying materials (granite, wood, stainless steel, glass, laminate), a set of cleaning tools (sponges, microfiber cloths, mop heads, spray bottles), and standardized mess creation protocols. Messes are created using reproducible methods: food coloring drops for liquid stains, ketchup smears for semi-viscous substances, dried coffee rings for aged stains, and scattered objects for clutter. This ensures diversity while maintaining reproducibility across collection sessions.",
        "The annotation pipeline for cleaning data captures before-and-after cleanliness scores (rated on a 1-5 scale by human evaluators from overhead images), surface coverage percentage (computed from registered before/after frames using color difference thresholding), force profiles throughout the cleaning motion, and cleaning technique classification (linear wiping, circular scrubbing, spot treatment, sweeping). Episodes where the operator damages the surface (scratching, excessive water) are annotated as negative examples with damage type labels.",
        "Environment diversity is critical for deployment generalization. Claru collects cleaning data across home kitchens, offices, bathrooms, and commercial spaces. Each environment introduces different surfaces, mess types, and spatial constraints. We use a before/after photography protocol where overhead images are captured pre- and post-cleaning under consistent lighting, enabling automated cleanliness assessment that supplements human ratings. A minimum of 5 environment types and 10 surface materials per collection campaign ensures policy robustness.",
        "Operator fatigue management is especially important for cleaning data because the physical effort of sustained wiping and scrubbing degrades demonstration quality faster than other manipulation tasks. Sessions are limited to 25 minutes for scrubbing tasks (versus 45 minutes for standard teleoperation) with mandatory 15-minute breaks. Force profile analysis provides an objective fatigue indicator: when the operator's average wiping force drops below 70% of their session-start baseline, the session is terminated and the remaining demonstrations are flagged for quality review. This ensures that late-session demonstrations do not train the policy to under-clean.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Key Datasets for Cleaning Research",
      columns: ["Dataset", "Year", "Scale", "Tasks", "Force Data", "Environment"],
      rows: [
        { "Dataset": "TidyBot", "Year": "2023", "Scale": "68 episodes", "Tasks": "Object tidying", "Force Data": "No", "Environment": "Home (real)" },
        { "Dataset": "Mobile ALOHA Cleaning", "Year": "2024", "Scale": "~50 demos/task", "Tasks": "Wipe, mop, sweep", "Force Data": "Indirect", "Environment": "Lab kitchen" },
        { "Dataset": "Industrial Wiping (Luo)", "Year": "2023", "Scale": "2K demos", "Tasks": "Surface wiping", "Force Data": "Yes (100 Hz)", "Environment": "Factory workbench" },
        { "Dataset": "Claru Custom", "Year": "2026", "Scale": "2K-20K+", "Tasks": "Full cleaning pipeline", "Force Data": "Yes (100 Hz)", "Environment": "Multi-environment" },
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        { id: "wu-tidybot-2023", title: "TidyBot: Personalized Robot Assistance with Large Language Models", authors: "Wu et al.", venue: "IROS 2023", year: 2023, url: "https://arxiv.org/abs/2305.11461" },
        { id: "fu-mobile-aloha-2024", title: "Mobile ALOHA: Learning Bimanual Mobile Manipulation with Low-Cost Whole-Body Teleoperation", authors: "Fu et al.", venue: "arXiv 2401.02117", year: 2024, url: "https://arxiv.org/abs/2401.02117" },
        { id: "chi-diffusion-2023", title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion", authors: "Chi et al.", venue: "RSS 2023", year: 2023, url: "https://arxiv.org/abs/2303.04137" },
        { id: "brohan-rt2-2023", title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control", authors: "Brohan et al.", venue: "arXiv 2307.15818", year: 2023, url: "https://arxiv.org/abs/2307.15818" },
      ],
    },
  ],
  faqs: [
    {
      question: "How many cleaning demonstrations are needed per surface type?",
      answer: "For a single cleaning subtask (e.g., countertop wiping) on a single surface material, 500-1,000 demonstrations with force data achieve 80%+ coverage success. For a multi-surface, multi-mess policy, expect 2,000-5,000 demonstrations per surface type. TidyBot showed that object tidying can work from few-shot demos, but contact-rich cleaning tasks like scrubbing and mopping require 10-100x more data due to the force modulation complexity.",
    },
    {
      question: "Why is force/torque sensing essential for cleaning data?",
      answer: "Cleaning is fundamentally a contact task. The difference between effective wiping and surface damage is a matter of applied force — 5 N on glass versus 30 N on a stained granite counter. Without force/torque data, the policy cannot learn force modulation and will either under-clean (too little force) or damage surfaces (too much force). Force data at 100+ Hz captures the rapid force transients during scrubbing motions that vision-only policies miss entirely.",
    },
    {
      question: "How should cleanliness be assessed and annotated in training data?",
      answer: "Use a two-tier system: automated assessment from before/after overhead images (color difference thresholding gives coverage percentage) plus human ratings on a 1-5 cleanliness scale from the same images. The automated metric provides objective coverage data; the human rating captures subjective cleanliness standards that vary by application (hospital-grade versus household). Both annotations together enable training policies that optimize for measurable coverage while respecting deployment-specific quality thresholds.",
    },
    {
      question: "Can a cleaning policy trained in one environment transfer to another?",
      answer: "Surface-level manipulation skills (wiping force, scrubbing pattern) transfer reasonably well across environments because the contact physics are similar. Navigation and object arrangement skills do not transfer — each new environment requires layout-specific data. The recommended approach is training core cleaning primitives on 2,000+ demonstrations across 5+ surfaces, then fine-tuning the navigation and task planning components with 200-500 demonstrations per new environment.",
    },
    {
      question: "What cleaning tools should be included in training data?",
      answer: "At minimum: microfiber cloth (dry wiping), sponge (wet wiping), mop head (floor cleaning), and spray bottle (applying cleaning solution). Each tool has different force profiles, coverage patterns, and grip requirements that the policy must learn. Include tool-change demonstrations where the robot switches between tools based on the mess type. Label each episode with the active tool for tool-conditioned policy training.",
    },
    {
      question: "How should mess diversity be structured for reproducible collection?",
      answer: "Use a standardized mess creation protocol with controlled substances: food coloring drops for liquid stains (0.5 mL per stain, random placement), ketchup smears for semi-viscous (2 cm diameter, drawn with template), coffee ring dried for 30 minutes for aged stains, scattered small objects (paper clips, crumbs, pen caps) for clutter. Each mess type gets a reproducible creation procedure documented in a collection SOP. This ensures that demonstrations from different sessions and operators encounter comparable messes, preventing the dataset from being biased toward easy or hard messes based on random preparation. Label each episode with the mess creation protocol ID for analysis.",
    },
  ],
  ctaHeading: "Get a Custom Quote for Cleaning Task Data",
  ctaDescription: "Describe your target cleaning tasks, surface types, and deployment environments. We will design a collection plan with the force sensing and coverage annotations your policy needs.",
  relatedGlossaryTerms: ["manipulation-trajectory", "behavioral-cloning", "imitation-learning", "force-torque-sensing"],
  relatedGuidePages: ["how-to-build-a-manipulation-dataset"],
  relatedSolutionSlugs: [],
  dataRequirements: {
    modality: "RGB-D multi-view + force/torque (100 Hz) + base odometry + proprioception",
    volumeRange: "2K-20K cleaning episodes across surface types",
    temporalResolution: "30 Hz video, 100 Hz force/torque, 10 Hz coverage map updates",
    keyAnnotations: ["Cleanliness before/after scores (1-5 + automated)", "Surface coverage percentage", "Force application profile per stroke", "Surface material classification", "Cleaning technique label (wipe/scrub/mop/spot)"],
  },
  relevantModels: ["TidyBot", "Mobile ALOHA", "Diffusion Policy", "Force-adaptive controllers"],
  environmentTypes: ["Home kitchen", "Office space", "Hospital room", "Hotel room", "Restaurant"],
  keyPapers: [
    { id: "wu-tidybot-2023", title: "TidyBot: Personalized Robot Assistance with Large Language Models", authors: "Wu et al.", venue: "IROS 2023", year: 2023, url: "https://arxiv.org/abs/2305.11461" },
    { id: "fu-mobile-aloha-2024", title: "Mobile ALOHA: Learning Bimanual Mobile Manipulation with Low-Cost Whole-Body Teleoperation", authors: "Fu et al.", venue: "arXiv 2401.02117", year: 2024, url: "https://arxiv.org/abs/2401.02117" },
    { id: "chi-diffusion-2023", title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion", authors: "Chi et al.", venue: "RSS 2023", year: 2023, url: "https://arxiv.org/abs/2303.04137" },
    { id: "brohan-rt2-2023", title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control", authors: "Brohan et al.", venue: "arXiv 2307.15818", year: 2023, url: "https://arxiv.org/abs/2307.15818" },
  ],
  claruRelevance: "Claru collects cleaning task data across real homes, offices, and commercial spaces using mobile manipulators and table-mounted arms equipped with 100 Hz force/torque sensors. Our standardized mess creation protocol ensures reproducible diversity across liquid stains, semi-viscous substances, dried residue, and scattered clutter. Each episode includes before/after overhead images for automated cleanliness scoring, force profiles per cleaning stroke, coverage maps, and human-rated cleanliness assessments. We support surface wiping, floor mopping, scrubbing, and clutter organization across 10+ surface materials. Datasets are delivered with full force sensor calibration, surface material labels, cleaning tool metadata, and stratified splits by environment type, surface material, and mess category.",
};

export default data;
