import type { TaskPageData } from "../types";

const data: TaskPageData = {
  slug: "table-setting",
  metaTitle: "Table Setting Training Data for Robotics | Claru",
  metaDescription:
    "Training data for table setting robots: placing plates, utensils, glasses in correct arrangements. Spatial reasoning demonstrations with placement precision and cultural variation.",
  primaryKeyword: "table setting robot training data",
  secondaryKeywords: [
    "table arrangement dataset",
    "plate placement data",
    "dining setup robotics",
    "spatial arrangement training data",
    "tableware placement robot",
    "service robotics dataset",
  ],
  canonicalPath: "/training-data/table-setting",
  h1: "Table Setting Training Data",
  heroSubtitle:
    "Table setting and arrangement datasets — precise placement of plates, utensils, glasses, and napkins with spatial reasoning annotations, cultural arrangement variations, and placement accuracy measurements.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Training Data", href: "/training-data" },
    { label: "Table Setting", href: "/training-data/table-setting" },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Is Robotic Table Setting and Why Does Data Matter?",
      paragraphs: [
        "Table setting is a canonical benchmark for long-horizon spatial reasoning in service robotics. Unlike simple pick-and-place tasks where objects have a single target location, table setting requires understanding relational constraints: the fork goes to the left of the plate, the knife to the right with the blade facing inward, the water glass above the knife. These spatial relationships are culturally determined, context-dependent (formal vs. casual), and must be maintained across varying table shapes, sizes, and existing place settings. A robot that can reliably set a table demonstrates the spatial reasoning capabilities needed for dozens of downstream service tasks.",
        "The challenge compounds because table setting is inherently multi-step and multi-object. A typical formal place setting involves 8-12 items that must be placed in a specific sequence to avoid collisions and occlusion — you cannot place the bread plate after the main plate if the bread plate position overlaps the approach trajectory. SayCan (Ahn et al., 2022) demonstrated that combining LLM planning with learned manipulation primitives enables table-setting-like sequential tasks, but the manipulation policies themselves require demonstration data that captures the precise spatial relationships and gentle placement dynamics for fragile tableware.",
        "Current public datasets for table setting are extremely limited. The BEHAVIOR-1K benchmark (Li et al., 2023) includes table setting as one of 1,000 household activities but provides only simulated demonstrations. The RT-2 evaluation suite tests table setting with a few dozen configurations. Real-world table setting data that captures the diversity of tableware (ceramic plates, glass stemware, metal utensils of varying sizes), table surfaces (wood, glass, cloth-covered), and cultural conventions (Western formal, Japanese kaiseki, Chinese banquet) simply does not exist at scale in any public dataset.",
        "Building production-grade table setting policies requires 1,000-5,000 demonstrations across at least 20 distinct tableware sets and 5+ table configurations. Each demonstration must include precise placement coordinates (sub-centimeter accuracy), the spatial relationships between items (relative positions encoded as relational predicates), and arrangement rule compliance labels (correct/incorrect placement per cultural standard). Without this structured annotation, policies learn to place objects at approximate positions without understanding the relational rules that define a correctly set table.",
      ],
    },
    {
      type: "stats",
      heading: "Table Setting Data by the Numbers",
      stats: [
        { value: "8-12", label: "Items in a formal Western place setting" },
        { value: "<1 cm", label: "Placement accuracy target for production" },
        { value: "1K-5K", label: "Demonstrations needed for robust policy" },
        { value: "20+", label: "Distinct tableware sets for generalization" },
        { value: "5+", label: "Cultural setting styles in a diverse dataset" },
        { value: "90%+", label: "Arrangement rule compliance target" },
      ],
    },
    {
      type: "comparison-table",
      heading: "Data Requirements by Table Setting Approach",
      description:
        "Different approaches to learned table setting have distinct data requirements depending on how spatial relationships are represented.",
      columns: [
        "Approach",
        "Data Volume",
        "Primary Modality",
        "Key Annotations",
        "Best For",
      ],
      rows: [
        {
          Approach: "LLM planner + manipulation primitives (SayCan)",
          "Data Volume": "100-500 demos per primitive + language rules",
          "Primary Modality": "RGB + language instructions",
          "Key Annotations": "Primitive success labels + language scene descriptions",
          "Best For": "Flexible table configurations with verbal instructions",
        },
        {
          Approach: "End-to-end behavioral cloning (Diffusion Policy)",
          "Data Volume": "1K-5K full setting demonstrations",
          "Primary Modality": "Multi-view RGB + proprioception",
          "Key Annotations": "Full trajectories + placement coordinates",
          "Best For": "High-precision placement with consistent style",
        },
        {
          Approach: "Spatial relationship prediction + planning",
          "Data Volume": "5K-20K annotated table images + 500 demos",
          "Primary Modality": "Overhead RGB + depth",
          "Key Annotations": "Relational predicates (left-of, above, aligned-with)",
          "Best For": "Novel tableware generalization via spatial rules",
        },
        {
          Approach: "Foundation model fine-tuning (OpenVLA/RT-2)",
          "Data Volume": "2K-10K language-annotated setting demos",
          "Primary Modality": "RGB + language instruction per step",
          "Key Annotations": "Step-by-step language + cultural style label",
          "Best For": "Multi-style settings with language-specified conventions",
        },
      ],
    },
    {
      type: "prose",
      heading: "State of the Art in Learned Table Setting",
      paragraphs: [
        "SayCan (Ahn et al., 2022) demonstrated that grounding LLM planning in learned manipulation affordances enables multi-step tasks like table setting. The system decomposes natural language instructions into sequences of manipulation primitives, with each primitive scored by a learned value function trained on real robot data. For table setting, SayCan successfully planned and executed 8-item place settings by chaining pick-and-place primitives, achieving 74% end-to-end success rate on the full setting sequence. The primary failure mode was accumulating placement error across sequential items rather than individual primitive failure.",
        "TidyBot (Wu et al., 2023) addressed the personalization challenge in household arrangement tasks. By combining a small set of user-specific examples (5-10 demonstrations) with LLM-based category reasoning, TidyBot achieved 85% placement accuracy on novel items following the user's personal organization preferences. For table setting, this approach enables robots to learn household-specific conventions (which side the napkin goes on, whether wine glasses are used) from minimal examples rather than requiring exhaustive demonstrations of every configuration.",
        "Inner Monologue (Huang et al., 2023) showed that providing LLMs with continuous environmental feedback during multi-step tasks dramatically improves success rates. For table setting, Inner Monologue uses object detection to verify each placement before proceeding to the next item, catching and correcting errors in real-time. This closed-loop approach achieved 91% success on 6-item casual settings versus 67% for open-loop execution, demonstrating the importance of verification feedback in long-horizon sequential tasks.",
        "For the manipulation component, Diffusion Policy (Chi et al., 2023) has emerged as the preferred architecture for precise placement tasks. Diffusion Policy's ability to represent multi-modal action distributions is particularly valuable for table setting, where multiple valid placement trajectories exist (approach from left vs. right) but the final position must be precise. Training on 200-500 demonstrations per placement type (plate, fork, knife, glass), Diffusion Policy achieves sub-centimeter placement accuracy with 94% success rate on individual items.",
      ],
    },
    {
      type: "prose",
      heading: "Collection Methodology for Table Setting Data",
      paragraphs: [
        "Table setting data collection requires instrumented workstations with overhead and angled RGB-D cameras, a calibrated tabletop workspace, and a diverse inventory of real tableware. The primary sensor setup uses a high-resolution overhead camera (4K RGB at 30 Hz) for precise placement verification, supplemented by two angled side cameras for approach trajectory capture and a wrist-mounted camera for close-up grasp views. A depth sensor provides the 3D surface geometry needed for height-sensitive placement (stacking plates, positioning stemware).",
        "Tableware diversity is critical for generalization. A production dataset should include at least 20 distinct place setting sets covering: standard ceramic dinnerware (various sizes and shapes), fine china (thin, fragile, with varying rim profiles), glassware (water tumblers, wine stems, champagne flutes), metal utensils (different handle profiles and weights), and cloth napkins (folded in multiple styles). Each setting should be demonstrated on at least 3 different table surfaces (bare wood, tablecloth, glass) to ensure the policy handles varying friction and reflectivity.",
        "Annotation must capture both the absolute placement position and the relational structure of the setting. For each item placed, record: (1) final position in table coordinates (x, y, orientation, to millimeter precision), (2) relational predicates relative to neighboring items (left-of plate, above knife, aligned-with plate-center), (3) cultural compliance label (correct/incorrect per the specified setting style), and (4) placement quality score (centered, aligned, stable). These structured annotations enable training both end-to-end policies and hybrid systems that separate spatial reasoning from manipulation execution.",
        "Claru collects table setting data using instrumented tabletop workstations with overhead 4K cameras, precision-calibrated table coordinate systems, and inventories of 20+ tableware sets spanning casual, formal, and culturally diverse conventions. Our operators demonstrate complete place settings following specified cultural rules, with each item placement annotated with sub-centimeter coordinates, relational predicates, compliance labels, and quality scores. We deliver datasets formatted for Diffusion Policy, ACT, and VLA architectures with train/validation/test splits stratified by tableware set and cultural style.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Key Datasets for Table Setting and Arrangement",
      description:
        "Public datasets for table setting are sparse. Most provide simulated or limited real-world coverage.",
      columns: [
        "Dataset",
        "Year",
        "Scale",
        "Real/Sim",
        "Setting Styles",
        "Spatial Annotations",
      ],
      rows: [
        {
          Dataset: "BEHAVIOR-1K (Li et al.)",
          Year: "2023",
          Scale: "1,000 activity definitions incl. table setting",
          "Real/Sim": "Simulation (NVIDIA Omniverse)",
          "Setting Styles": "Western casual only",
          "Spatial Annotations": "Object poses in sim",
        },
        {
          Dataset: "RT-2 evaluation (Brohan et al.)",
          Year: "2023",
          Scale: "~50 table setting configurations",
          "Real/Sim": "Real (Everyday Robots)",
          "Setting Styles": "Simple 3-4 item settings",
          "Spatial Annotations": "Success/failure only",
        },
        {
          Dataset: "SayCan kitchen (Ahn et al.)",
          Year: "2022",
          Scale: "101 tasks incl. table arrangement",
          "Real/Sim": "Real",
          "Setting Styles": "Informal kitchen counter",
          "Spatial Annotations": "Task completion labels",
        },
        {
          Dataset: "TidyBot household (Wu et al.)",
          Year: "2023",
          Scale: "30 household environments",
          "Real/Sim": "Real",
          "Setting Styles": "Personalized placement",
          "Spatial Annotations": "User preference labels",
        },
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        {
          id: "ahn-saycan-2022",
          title: "Do As I Can, Not As I Say: Grounding Language in Robotic Affordances",
          authors: "Ahn et al.",
          venue: "arXiv 2204.01691",
          year: 2022,
          url: "https://arxiv.org/abs/2204.01691",
        },
        {
          id: "wu-tidybot-2023",
          title: "TidyBot: Personalized Robot Assistance with Large Language Models",
          authors: "Wu et al.",
          venue: "IROS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2305.11461",
        },
        {
          id: "chi-diffusion-2023",
          title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
          authors: "Chi et al.",
          venue: "RSS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2303.04137",
        },
        {
          id: "huang-inner-2023",
          title: "Inner Monologue: Embodied Reasoning through Planning with Language Models",
          authors: "Huang et al.",
          venue: "CoRL 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2207.05608",
        },
        {
          id: "li-behavior-2023",
          title: "BEHAVIOR-1K: A Human-Centered Benchmark for Embodied AI",
          authors: "Li et al.",
          venue: "CoRL 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2403.09227",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "How many demonstrations are needed for table setting policy training?",
      answer:
        "For a single cultural style (e.g., Western casual 4-item setting), 200-500 demonstrations with Diffusion Policy achieve 94% single-item placement success. For a complete formal setting (8-12 items), 1,000-2,000 demonstrations capture the sequential dependencies and collision avoidance needed for end-to-end execution. For cross-style generalization (Western formal + casual + Asian conventions), 3,000-5,000 demonstrations across styles are recommended, with at least 500 per cultural convention. Each demonstration should use a different tableware set to prevent overfitting to specific item geometries.",
    },
    {
      question: "What sensor modalities are essential for table setting data?",
      answer:
        "The minimum viable setup is an overhead RGB camera at 4K resolution for sub-centimeter placement verification, plus a wrist-mounted camera for grasp-phase observations. Adding a depth sensor (structured light or stereo) enables 3D workspace understanding critical for height-sensitive placement like stacking plates or positioning stemware. Proprioceptive data at 50+ Hz captures the gentle placement dynamics needed to avoid chipping fragile tableware. Force/torque sensing at the wrist is valuable for detecting surface contact during placement, reducing the risk of excessive impact force on delicate items like wine glasses.",
    },
    {
      question: "How do you handle cultural variation in table settings?",
      answer:
        "Cultural setting styles should be treated as distinct task categories with shared low-level manipulation skills. Western formal, Western casual, Japanese kaiseki, Chinese banquet, and Indian thali settings each have specific spatial rules governing item placement. Annotate each demonstration with the cultural style label, and within each style, annotate per-item compliance with the style rules. A hybrid architecture works best: train a shared manipulation policy on all styles for the low-level pick-and-place skills, then train style-specific spatial planners on the relational rules for each convention. This architecture requires only 200-300 demonstrations per new cultural style once the base manipulation policy is trained.",
    },
    {
      question: "Can simulation replace real table setting data?",
      answer:
        "Simulation is useful for pre-training spatial reasoning (learning that forks go left of plates) but cannot replace real data for the manipulation component. The sim-to-real gap is particularly severe for tableware because of material diversity (ceramic friction, glass reflectivity, metal weight distribution), fragility constraints (force limits that vary by material), and visual appearance (the sheen of porcelain, transparency of glass, and patina of silver cannot be rendered accurately enough for visual policy transfer). A practical approach uses simulation for spatial layout planning (80% sim) combined with real demonstrations for manipulation execution (100% real). The spatial planner transfers well; the manipulation policy does not.",
    },
    {
      question: "What placement accuracy is needed for production table setting?",
      answer:
        "Sub-centimeter absolute accuracy and sub-2-degree rotational accuracy are the minimum for production deployment. Human table setters typically achieve 3-5mm placement consistency, and diners notice misalignment beyond 1cm. For utensil placement, rotational accuracy matters more than positional: a fork rotated 5 degrees looks wrong even if positioned correctly. For glass placement, height accuracy matters — a wine glass placed too close to the plate edge risks being knocked over. Annotation should capture position error, rotation error, and stability margin (distance from nearest collision) for each placement, enabling curriculum training from coarse to fine placement accuracy.",
    },
  ],
  ctaHeading: "Get a Custom Quote for Table Setting Data",
  ctaDescription:
    "Share your target setting styles and tableware types, and we will design a data collection plan with the precise spatial annotations your policy needs.",
  relatedGlossaryTerms: [
    "manipulation-trajectory",
    "behavioral-cloning",
    "imitation-learning",
    "spatial-reasoning",
    "long-horizon-planning",
  ],
  relatedGuidePages: [
    "how-to-build-a-manipulation-dataset",
    "how-to-label-robot-demonstrations",
  ],
  relatedSolutionSlugs: [],
  dataRequirements: {
    modality: "RGB overhead (4K) + side cameras + depth + wrist camera + proprioception",
    volumeRange: "1K-5K complete setting demonstrations across styles",
    temporalResolution: "30 Hz video, 50 Hz proprioception",
    keyAnnotations: [
      "Sub-centimeter item placement coordinates",
      "Relational predicates (left-of, above, aligned-with)",
      "Arrangement rule compliance per cultural style",
      "Placement quality score (centered, aligned, stable)",
      "Cultural setting style label",
      "Sequential ordering constraints",
    ],
  },
  relevantModels: [
    "Diffusion Policy",
    "SayCan",
    "TidyBot",
    "Inner Monologue",
    "OpenVLA",
    "ACT",
  ],
  environmentTypes: [
    "Dining room",
    "Restaurant",
    "Banquet hall",
    "Test tabletop",
    "Kitchen counter",
  ],
  keyPapers: [
    {
      id: "ahn-saycan-2022",
      title: "Do As I Can, Not As I Say: Grounding Language in Robotic Affordances",
      authors: "Ahn et al.",
      venue: "arXiv 2204.01691",
      year: 2022,
      url: "https://arxiv.org/abs/2204.01691",
    },
    {
      id: "wu-tidybot-2023",
      title: "TidyBot: Personalized Robot Assistance with Large Language Models",
      authors: "Wu et al.",
      venue: "IROS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2305.11461",
    },
    {
      id: "chi-diffusion-2023",
      title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
      authors: "Chi et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2303.04137",
    },
    {
      id: "huang-inner-2023",
      title: "Inner Monologue: Embodied Reasoning through Planning with Language Models",
      authors: "Huang et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2207.05608",
    },
    {
      id: "li-behavior-2023",
      title: "BEHAVIOR-1K: A Human-Centered Benchmark for Embodied AI",
      authors: "Li et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2403.09227",
    },
  ],
  claruRelevance:
    "Claru collects table setting data using instrumented tabletop workstations with overhead 4K cameras, precision-calibrated coordinate systems, and inventories of 20+ real tableware sets spanning Western formal, Western casual, Asian, and custom conventions. Each demonstration is annotated with sub-centimeter placement coordinates, relational spatial predicates between items, cultural compliance labels, and placement quality scores. Our operators demonstrate complete place settings following specified cultural rules with natural variation in approach trajectories, and every dataset includes train/validation/test splits stratified by tableware set and cultural style. We deliver in RLDS, HDF5, or Zarr formats compatible with Diffusion Policy, ACT, SayCan, and foundation model architectures, with standard throughput of 100-200 annotated settings per day per workstation.",
};

export default data;
