import type { TaskPageData } from "../types";

const data: TaskPageData = {
  slug: "food-preparation",
  metaTitle: "Food Preparation Training Data for Robotics | Claru",
  metaDescription: "Training data for food preparation robots: ingredient handling, cutting, mixing, plating. Multi-step cooking demonstrations with food state tracking and recipe grounding.",
  primaryKeyword: "food preparation robot training data",
  secondaryKeywords: ["cooking robot dataset", "food manipulation data", "recipe execution training data", "kitchen robot training", "food state tracking dataset", "meal preparation robotics data"],
  canonicalPath: "/training-data/food-preparation",
  h1: "Food Preparation Training Data",
  heroSubtitle: "Multi-step food preparation datasets — ingredient handling, precision cutting, mixing, seasoning, cooking, and plating demonstrations with food state tracking and natural language recipe grounding.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Training Data", href: "/training-data" },
    { label: "Food Preparation", href: "/training-data/food-preparation" },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Is Robotic Food Preparation and Why Is It the Hardest Kitchen Task?",
      paragraphs: [
        "Robotic food preparation spans the full cooking pipeline: retrieving ingredients, measuring quantities, cutting and slicing, mixing and stirring, applying heat, seasoning, and plating. It is arguably the most demanding manipulation domain because it combines nearly every robotics challenge in a single workflow: deformable object manipulation (dough, vegetables), liquid handling (pouring, stirring), tool use (knives, spatulas), thermal management (not burning food), and long-horizon sequential planning (following a recipe with 10-30 steps).",
        "The data challenge is compounded by irreversibility. Most manipulation tasks are retry-friendly — a failed grasp can be reattempted. In cooking, many operations are one-way: over-chopped vegetables cannot be reassembled, burnt sauce cannot be unburnt, and seasoning cannot be removed. This means training data must capture not just successful executions but the perceptual cues that signal when to stop — the color change of sauteed onions, the consistency of whipped cream, the sound of sizzling oil reaching temperature. These multi-modal signals require sensor stacks beyond standard RGB cameras.",
        "Commercial interest is substantial. Companies like Moley Robotics, Dexai Robotics, Miso Robotics (Flippy), and Samsung (Bot Chef) are building kitchen automation systems. The restaurant industry alone spends $350B annually on labor in the US, and fast-food chains see kitchen robots as critical for staffing-challenged locations. However, each recipe variant requires dedicated training data, and a single restaurant menu with 30 items may need 50,000+ demonstrations to cover the ingredient and technique diversity of production cooking.",
        "The safety dimension in food preparation is unique to this domain. Robots handling sharp knives, hot pans, and open flames operate in a workspace that is hazardous to both the robot and nearby humans. Cutting demonstrations must capture safe knife handling practices: blade orientation during transport, cutting board stabilization, and finger-safe grip positions. Heat-related demonstrations must include safe distance maintenance from open flames and hot surfaces, pan handle orientation to avoid tipping, and monitoring of oil temperature to prevent flash fires. These safety-critical behaviors must be explicitly captured and annotated in training data — they are rarely the focus of academic datasets but are non-negotiable for commercial deployment.",
      ],
    },
    {
      type: "stats",
      heading: "Food Preparation Data at a Glance",
      stats: [
        { value: "2K-20K", label: "Demos per recipe family" },
        { value: "10-30", label: "Steps in a typical recipe" },
        { value: "$350B", label: "US restaurant labor cost/year" },
        { value: "Irreversible", label: "Most cooking operations" },
      ],
    },
    {
      type: "comparison-table",
      heading: "Data Requirements by Cooking Subtask",
      description: "Each cooking primitive has different modality needs and data volumes.",
      columns: ["Subtask", "Data Volume", "Key Modalities", "Critical Sensor", "Failure Mode"],
      rows: [
        { "Subtask": "Cutting/slicing", "Data Volume": "1K-5K demos", "Key Modalities": "RGB + F/T + proprioception", "Critical Sensor": "Force feedback (blade control)", "Failure Mode": "Uneven cuts, crushing" },
        { "Subtask": "Mixing/stirring", "Data Volume": "500-2K demos", "Key Modalities": "RGB + torque", "Critical Sensor": "Torque (viscosity estimation)", "Failure Mode": "Inadequate mixing, splashing" },
        { "Subtask": "Pouring/measuring", "Data Volume": "1K-3K demos", "Key Modalities": "RGB + weight scale", "Critical Sensor": "Weight (volume accuracy)", "Failure Mode": "Overshoot, spillage" },
        { "Subtask": "Heat application", "Data Volume": "500-2K demos", "Key Modalities": "RGB + temperature + IR", "Critical Sensor": "Temperature (doneness)", "Failure Mode": "Burning, undercooking" },
        { "Subtask": "Plating", "Data Volume": "500-2K demos", "Key Modalities": "RGB overhead + proprioception", "Critical Sensor": "Vision (aesthetics)", "Failure Mode": "Sloppy presentation" },
      ],
    },
    {
      type: "prose",
      heading: "State of the Art in Kitchen Robot Learning",
      paragraphs: [
        "The ALOHA system (Zhao et al., 2023) demonstrated bimanual food preparation from teleoperation — including stir-frying shrimp and flipping pancakes — but required dedicated training per dish. Mobile ALOHA (Fu et al., 2024) extended this to include navigation (moving between counter and stove) with 50 demonstrations per task. SayCan (Ahn et al., 2022) showed language-conditioned kitchen task execution but was limited to pick-and-place operations, not actual cooking.",
        "The emerging paradigm is recipe-grounded manipulation. Rather than training one policy per dish, a recipe-conditioned policy takes natural language recipe steps as input and executes the corresponding manipulation. This requires paired (instruction, demonstration) data where each recipe step is aligned with the video segment showing its execution. The EPIC-KITCHENS dataset (Damen et al., 2022) provides 100 hours of egocentric kitchen video with narration, but these are human recordings without robot action labels — a gap between observation and manipulation data.",
        "Food state tracking is the critical perception challenge. A policy must detect when dough has been kneaded enough (elasticity visual cues), when vegetables are sauteed (color change from green to golden), and when liquid has reduced to the right consistency (viscosity from stirring resistance). These are learned perceptual concepts that require large annotated datasets. Current datasets annotate food state transitions coarsely (raw/cooking/done); production systems need continuous state estimation with quantitative metrics (internal temperature, moisture content, texture score).",
        "Multi-step reasoning presents the most complex planning challenge. A recipe like stir-fry involves parallel execution: heating oil while cutting vegetables, monitoring rice while sauteing the main dish, and timing sauce reduction to finish simultaneously with the protein. Demonstrations of multi-step recipes must capture not just individual technique execution but the operator's temporal planning — when they choose to start heating a pan, how they interleave cutting with monitoring, and how they adjust timing when an ingredient takes longer than expected. This temporal reasoning data, annotated with parallel task state and timing decisions, is essential for training policies that can manage the concurrent workflows of real cooking.",
      ],
    },
    {
      type: "prose",
      heading: "Collection Methodology for Food Preparation Data",
      paragraphs: [
        "Food preparation collection requires a fully equipped kitchen station: countertop workspace with cutting boards and prep surfaces, cooking stations (stovetop, oven access), a sink for washing, and organized ingredient storage. The sensor stack includes overhead RGB-D cameras for workspace coverage, side-view cameras for tool use visibility, wrist cameras for close-up food state observation, weight scales for portioning, and temperature sensors (IR thermometer and probe thermometer) for cooking tasks.",
        "Each collection session follows a recipe card that specifies ingredients, quantities, steps, and target outcomes. The operator executes the recipe via teleoperation while a recipe annotator timestamps each step transition. Post-hoc annotations add food state labels at key transitions (raw, chopping, chopped, cooking, seared, plated), ingredient identification tags for each item in frame, technique classification (julienne, dice, mince, fold, whip, saute), and quality assessments for the final dish (appearance, portioning accuracy, completion of all steps).",
        "Ingredient diversity is managed through a structured ingredient matrix. Each recipe is collected with 3-5 ingredient substitutions (e.g., chicken versus tofu, broccoli versus green beans) to prevent the policy from overfitting to specific ingredients. Claru's food preparation protocol also includes deliberate variation in ingredient presentation — pre-washed versus unwashed vegetables, different cut sizes in raw ingredients, varying initial workspace organization — to build robustness to real kitchen conditions.",
        "Safety annotations form a mandatory layer in Claru's food preparation data. Every episode involving a knife includes blade-orientation-during-transport labels, grip safety assessments, and cutting board stability checks. Heat-related episodes include pan handle orientation, safe distance compliance, and temperature hazard flags. These safety annotations enable training policies that do not just execute the cooking technique correctly but do so while maintaining safe operating practices — a requirement for any commercial food preparation robot that operates near human workers or in consumer-accessible spaces.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Key Datasets for Food Preparation Research",
      columns: ["Dataset", "Year", "Scale", "Content", "Robot Actions", "Environment"],
      rows: [
        { "Dataset": "EPIC-KITCHENS", "Year": "2022", "Scale": "100 hrs video", "Content": "Egocentric cooking", "Robot Actions": "No (human only)", "Environment": "32 real kitchens" },
        { "Dataset": "YouCook2", "Year": "2018", "Scale": "2K videos", "Content": "Cooking procedures", "Robot Actions": "No (human only)", "Environment": "YouTube kitchens" },
        { "Dataset": "ALOHA Kitchen", "Year": "2023", "Scale": "~50 demos/task", "Content": "Robot cooking", "Robot Actions": "Yes", "Environment": "Lab kitchen" },
        { "Dataset": "Mobile ALOHA Kitchen", "Year": "2024", "Scale": "~50 demos/task", "Content": "Mobile cooking", "Robot Actions": "Yes", "Environment": "Lab kitchen" },
        { "Dataset": "Claru Custom", "Year": "2026", "Scale": "2K-20K+", "Content": "Full recipe pipeline", "Robot Actions": "Yes", "Environment": "Real kitchens" },
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        { id: "zhao-aloha-2023", title: "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware", authors: "Zhao et al.", venue: "RSS 2023", year: 2023, url: "https://arxiv.org/abs/2304.13705" },
        { id: "fu-mobile-aloha-2024", title: "Mobile ALOHA: Learning Bimanual Mobile Manipulation with Low-Cost Whole-Body Teleoperation", authors: "Fu et al.", venue: "arXiv 2401.02117", year: 2024, url: "https://arxiv.org/abs/2401.02117" },
        { id: "ahn-saycan-2022", title: "Do As I Can, Not As I Say: Grounding Language in Robotic Affordances", authors: "Ahn et al.", venue: "arXiv 2204.01691", year: 2022, url: "https://arxiv.org/abs/2204.01691" },
        { id: "damen-epic-2022", title: "Rescaling Egocentric Vision: Collection, Pipeline and Challenges for EPIC-KITCHENS-100", authors: "Damen et al.", venue: "IJCV 2022", year: 2022, url: "https://arxiv.org/abs/2006.13256" },
      ],
    },
  ],
  faqs: [
    {
      question: "How many demonstrations does a single recipe require?",
      answer: "A single fixed recipe (e.g., scrambled eggs) with Diffusion Policy needs 50-200 demonstrations. With ingredient substitutions (3-5 variants per recipe) and equipment variation, expect 500-1,000 demonstrations per recipe family. For a recipe-conditioned policy that generalizes across a menu of 10+ dishes, 5,000-20,000 total demonstrations are typical. Start with 2-3 simple recipes and scale based on cross-recipe generalization performance.",
    },
    {
      question: "How do you annotate food state transitions in training data?",
      answer: "Use a hierarchical scheme: coarse state labels (raw, cooking, done) at the recipe step level, plus continuous food state features (color histogram, texture score, estimated temperature) at the frame level. Color change is the most reliable visual indicator and can be partially automated from calibrated overhead camera images. Texture and doneness require human annotation. Annotate both the target state (what 'done' looks like for this ingredient) and the current state at each timestep.",
    },
    {
      question: "Is temperature sensing necessary for cooking data?",
      answer: "For tasks involving heat (saute, fry, bake, boil), temperature data is essential for learning doneness control. An IR thermometer provides non-contact surface temperature at 10 Hz, while probe thermometers give internal temperature for proteins. Without temperature data, the policy must rely on visual cues alone, which is unreliable for opaque foods. At minimum, include a kitchen-grade IR thermometer pointed at the primary cooking surface.",
    },
    {
      question: "Can simulation help with food preparation data?",
      answer: "Simulation is useful for pre-cutting tool use (knife trajectories, spatula motions) and high-level recipe planning, but food physics simulation is extremely limited. Simulating the deformation of dough, the browning of onions, or the reduction of a sauce is beyond current physics engines. Real-world data is essential for any task involving food state changes, heat application, or liquid behavior. Simulation pretraining for the manipulation primitives combined with real-data fine-tuning is the practical approach.",
    },
    {
      question: "How should ingredient diversity be structured in the dataset?",
      answer: "Use a substitution matrix: for each recipe, define 3-5 ingredient variants per slot (protein, vegetable, starch, seasoning). Collect at least 50 demonstrations per substitution variant. This teaches the policy that 'dice the onion' and 'dice the carrot' share a cutting technique while requiring different force profiles. Tag each episode with full ingredient metadata so the dataset can be sliced by technique (all cutting demos) or by ingredient (all carrot demos).",
    },
    {
      question: "What safety annotations are necessary for food preparation data?",
      answer: "At minimum: blade orientation during knife transport (blade down/sheathed), cutting grip safety (fingers clear of blade path), pan handle positioning (turned inward to prevent tipping), hot surface proximity warnings (hand distance from burners and heated surfaces), and oil temperature monitoring (flash point proximity). Each safety-relevant frame should be flagged with a binary safe/unsafe label plus the specific hazard type. Negative examples — demonstrations where the operator handles a knife unsafely or reaches over a hot pan — should be included at 5-10% of total episodes with explicit unsafe-behavior labels to enable safety-aware policy training.",
    },
  ],
  ctaHeading: "Get a Custom Quote for Food Preparation Data",
  ctaDescription: "Tell us your target recipes, kitchen setup, and output requirements. We will design a collection plan covering the ingredient diversity and cooking techniques your robot needs.",
  relatedGlossaryTerms: ["manipulation-trajectory", "behavioral-cloning", "imitation-learning"],
  relatedGuidePages: ["how-to-build-a-manipulation-dataset"],
  relatedSolutionSlugs: [],
  dataRequirements: {
    modality: "RGB-D multi-view + weight scale + temperature (IR + probe) + proprioception",
    volumeRange: "2K-20K recipe execution demonstrations",
    temporalResolution: "30 Hz video, 10 Hz weight/temperature, per-step recipe annotations",
    keyAnnotations: ["Food state transition labels (raw/cooking/done)", "Recipe step alignment timestamps", "Ingredient identification per frame", "Technique classification (dice/julienne/fold/saute)", "Plating quality assessment"],
  },
  relevantModels: ["ACT/ALOHA", "Mobile ALOHA", "SayCan", "Diffusion Policy", "Recipe-conditioned VLAs"],
  environmentTypes: ["Test kitchen", "Restaurant kitchen", "Home kitchen", "Fast-food prep station"],
  keyPapers: [
    { id: "zhao-aloha-2023", title: "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware", authors: "Zhao et al.", venue: "RSS 2023", year: 2023, url: "https://arxiv.org/abs/2304.13705" },
    { id: "fu-mobile-aloha-2024", title: "Mobile ALOHA: Learning Bimanual Mobile Manipulation with Low-Cost Whole-Body Teleoperation", authors: "Fu et al.", venue: "arXiv 2401.02117", year: 2024, url: "https://arxiv.org/abs/2401.02117" },
    { id: "ahn-saycan-2022", title: "Do As I Can, Not As I Say: Grounding Language in Robotic Affordances", authors: "Ahn et al.", venue: "arXiv 2204.01691", year: 2022, url: "https://arxiv.org/abs/2204.01691" },
    { id: "damen-epic-2022", title: "Rescaling Egocentric Vision: Collection, Pipeline and Challenges for EPIC-KITCHENS-100", authors: "Damen et al.", venue: "IJCV 2022", year: 2022, url: "https://arxiv.org/abs/2006.13256" },
  ],
  claruRelevance: "Claru collects food preparation data in fully equipped kitchen stations with multi-camera rigs, calibrated weight scales, IR and probe thermometers, and organized ingredient libraries. Our recipe-card collection protocol ensures structured coverage of cooking primitives (cutting, mixing, pouring, heating, plating) across ingredient substitutions. Each episode includes recipe step timestamps, food state transition labels, ingredient identification tags, technique classifications, and final dish quality assessments. We support single-step primitive training and full multi-step recipe execution data across test kitchens, restaurant kitchens, and home environments. Datasets are delivered with full sensor calibration, ingredient metadata, and recipe-stratified train/val/test splits in RLDS, HDF5, or custom formats.",
};

export default data;
