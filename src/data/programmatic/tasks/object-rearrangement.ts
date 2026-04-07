import type { TaskPageData } from "../types";

const data: TaskPageData = {
  slug: "object-rearrangement",
  metaTitle: "Object Rearrangement Training Data | Claru",
  metaDescription: "Training data for object rearrangement: scene organization, shelf stocking, desk tidying. Goal-conditioned demonstrations with spatial reasoning and efficiency metrics.",
  primaryKeyword: "object rearrangement training data",
  secondaryKeywords: ["rearrangement dataset", "scene organization data", "goal-conditioned manipulation data", "shelf stocking robot data", "desk tidying robot dataset", "scene reconstruction training"],
  canonicalPath: "/training-data/object-rearrangement",
  h1: "Object Rearrangement Training Data",
  heroSubtitle: "Goal-conditioned rearrangement datasets — desk organization, shelf stocking, room tidying, and scene reconstruction tasks with goal state specifications, efficiency metrics, and spatial reasoning annotations.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Training Data", href: "/training-data" },
    { label: "Object Rearrangement", href: "/training-data/object-rearrangement" },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Is Object Rearrangement and Why Does It Require Massive Data?",
      paragraphs: [
        "Object rearrangement is the task of moving a set of objects from an initial configuration to a target arrangement. It sounds simple, but it sits at the intersection of perception (identifying what needs to move), planning (determining the order and placement), and manipulation (executing picks and places without collisions). A robot tidying a kitchen counter must recognize which items are out of place, reason about where each belongs (plates in the rack, cups on the shelf, utensils in the drawer), and execute a sequence of grasps and placements that avoids toppling or breaking anything.",
        "The combinatorial complexity makes rearrangement a data-hungry task. With N objects, there are N! possible placement orderings, and each placement requires spatial reasoning about collision-free approach trajectories. The Habitat Rearrangement Challenge (Szot et al., 2021) showed that even with millions of simulation episodes, agents struggle with multi-object rearrangement in unseen environments. Real-world data is essential because simulation cannot faithfully capture cluttered scenes with diverse object geometries, surface friction, and visual appearance at production quality.",
        "Commercial interest in rearrangement spans retail inventory (restocking shelves at $11B annual labor cost), warehouse fulfillment (object putaway after receiving), home robotics (tidying rooms), and manufacturing (kitting parts for assembly). Each application demands a different notion of the goal state — retail requires planogram compliance, warehousing optimizes for access frequency, and home tidying follows implicit cultural norms. Training data must encode these domain-specific goal specifications alongside the manipulation demonstrations.",
        "The personalization dimension is uniquely important for rearrangement. Every household organizes differently — one person's 'tidy' kitchen is another person's disorganized mess. TidyBot (Wu et al., 2023) showed that LLMs can infer organizational preferences from a handful of examples, but the underlying manipulation policy still needs diverse training data to handle the physical act of rearranging objects across varied surfaces and containers. This creates a two-tier data requirement: a large general manipulation dataset (5K-50K episodes) that teaches the robot how to pick and place diverse objects, plus a per-user personalization dataset (50-200 episodes) that teaches where each user wants things placed. Both tiers are necessary for deployment-grade rearrangement.",
      ],
    },
    {
      type: "stats",
      heading: "Rearrangement Data at a Glance",
      stats: [
        { value: "5K-50K", label: "Rearrangement episodes needed" },
        { value: "8-25", label: "Objects per typical scene" },
        { value: "N!", label: "Possible orderings for N objects" },
        { value: "73%", label: "Best Habitat Challenge success (2023)" },
      ],
    },
    {
      type: "comparison-table",
      heading: "Data Requirements by Rearrangement Paradigm",
      description: "Rearrangement approaches differ in how they specify goals and decompose the task.",
      columns: ["Paradigm", "Data Volume", "Goal Specification", "Key Modalities", "Planning Horizon"],
      rows: [
        { "Paradigm": "Goal-image conditioned", "Data Volume": "5K-20K episodes", "Goal Specification": "Target scene image", "Key Modalities": "RGB-D multi-view", "Planning Horizon": "Per-object" },
        { "Paradigm": "Language-conditioned", "Data Volume": "10K-50K episodes", "Goal Specification": "Natural language instruction", "Key Modalities": "RGB + language", "Planning Horizon": "Multi-step" },
        { "Paradigm": "Planogram/template", "Data Volume": "2K-10K episodes", "Goal Specification": "Structured layout spec", "Key Modalities": "RGB-D + pose estimation", "Planning Horizon": "Full scene" },
        { "Paradigm": "Semantic rearrangement", "Data Volume": "10K-30K episodes", "Goal Specification": "Category-level rules", "Key Modalities": "RGB + object detection", "Planning Horizon": "Category-based" },
      ],
    },
    {
      type: "prose",
      heading: "State of the Art in Rearrangement",
      paragraphs: [
        "The field has progressed from single-object pick-and-place to multi-object sequential rearrangement. SayCan (Ahn et al., 2022) chains language model planning with learned manipulation primitives to execute rearrangement instructions like 'put all the fruit in the bowl,' scoring 84% success on seen objects but dropping to 47% on novel arrangements. StructFormer (Liu et al., 2022) predicts the spatial structure of target arrangements using transformer architectures, achieving 78% accuracy on multi-object placements by learning structural priors from 10,000+ training scenes.",
        "DALL-E-Bot (Kapelyukh et al., 2023) introduces a novel approach: using text-to-image models to generate goal images from language descriptions, then using visual difference between current and goal states to plan rearrangement actions. This decouples goal specification from manipulation, but requires high-quality paired data (current state, goal state, action sequence) for training the manipulation policy. The data requirement shifts from goal diversity (handled by the generative model) to manipulation diversity (varied grasps, placements, and obstacle avoidance).",
        "The current bottleneck is long-horizon rearrangement — scenes with 10+ objects requiring 20+ sequential manipulation steps. Error compounds across steps: a 95% per-step success rate yields only 36% success over 20 steps. TidyBot (Wu et al., 2023) addresses this by learning personalized tidying preferences from user demonstrations, reducing the planning search space. The data implication is that rearrangement datasets need not just diverse scenes but diverse users whose organizational preferences create natural variety in goal states.",
        "For retail applications, rearrangement data must capture planogram compliance — placing products in exact positions defined by a store layout document. This requires sub-centimeter placement accuracy and front-facing orientation for labeled products. The data annotation must include not just where objects are placed but their orientation (label facing forward), spacing (equal gaps between products), and depth (pushed to the back of the shelf). Retail rearrangement data is uniquely structured because the goal state is precisely specified by the planogram rather than approximately specified by an image or language description, enabling quantitative placement accuracy metrics that other rearrangement domains lack.",
      ],
    },
    {
      type: "prose",
      heading: "Collection Methodology for Rearrangement Data",
      paragraphs: [
        "Rearrangement data collection uses a paired-scene protocol. For each episode: (1) arrange the scene in its goal state and capture multi-view images plus object poses, (2) disturb the scene by randomly displacing 3-10 objects, (3) record the demonstration as the operator rearranges objects back to the goal state via teleoperation. This produces matched (initial state, goal state, trajectory) triplets. The goal state images serve as conditioning for goal-conditioned policies, while the language descriptions of the arrangement serve language-conditioned approaches.",
        "Object diversity is the primary scaling axis. A production rearrangement dataset should cover 50-200 unique object types spanning categories relevant to deployment: groceries, kitchenware, office supplies, household items. Each object needs consistent mesh or point cloud models for pose estimation ground truth. Scene complexity should be stratified: 30% of episodes with 3-5 objects (easy), 40% with 6-12 objects (medium), and 30% with 13-25 objects (hard) to enable curriculum learning.",
        "Claru's rearrangement collection protocol uses modular scene templates — standardized shelving units, desk surfaces, and counter spaces that are physically shipped to collection sites. Operators receive target arrangement photos and natural language descriptions before each episode. Post-hoc annotations include per-object placement accuracy (centimeters from target pose), ordering efficiency (how close to optimal was the sequence), and collision events during manipulation. All episodes include synchronized RGB-D from 3+ views, robot proprioception, and language descriptions.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Key Datasets for Object Rearrangement",
      columns: ["Dataset", "Year", "Episodes", "Objects", "Goal Type", "Environment"],
      rows: [
        { "Dataset": "AI2-THOR Rearrange", "Year": "2021", "Episodes": "Millions (sim)", "Objects": "120 types", "Goal Type": "Scene images", "Environment": "Simulated rooms" },
        { "Dataset": "Habitat Rearrange", "Year": "2022", "Episodes": "100K+ (sim)", "Objects": "200+ types", "Goal Type": "Object poses", "Environment": "ReplicaCAD scenes" },
        { "Dataset": "TidyBot", "Year": "2023", "Episodes": "68 episodes", "Objects": "~10 per scene", "Goal Type": "User preference", "Environment": "Real tabletop" },
        { "Dataset": "RT-2 Rearrange", "Year": "2023", "Episodes": "~130K real", "Objects": "17 types", "Goal Type": "Language", "Environment": "Kitchen counters" },
        { "Dataset": "Claru Custom", "Year": "2026", "Episodes": "5K-50K+", "Objects": "50-200 types", "Goal Type": "Multi-modal", "Environment": "Real, configurable" },
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        { id: "ahn-saycan-2022", title: "Do As I Can, Not As I Say: Grounding Language in Robotic Affordances", authors: "Ahn et al.", venue: "arXiv 2204.01691", year: 2022, url: "https://arxiv.org/abs/2204.01691" },
        { id: "liu-structformer-2022", title: "StructFormer: Learning Spatial Structure for Language-Guided Semantic Rearrangement of Novel Objects", authors: "Liu et al.", venue: "ICRA 2022", year: 2022, url: "https://arxiv.org/abs/2110.10189" },
        { id: "wu-tidybot-2023", title: "TidyBot: Personalized Robot Assistance with Large Language Models", authors: "Wu et al.", venue: "IROS 2023", year: 2023, url: "https://arxiv.org/abs/2305.11461" },
        { id: "szot-habitat-2021", title: "Habitat 2.0: Training Home Assistants to Rearrange their Habitat", authors: "Szot et al.", venue: "NeurIPS 2021", year: 2021, url: "https://arxiv.org/abs/2106.14405" },
        { id: "kapelyukh-dallebot-2023", title: "DALL-E-Bot: Introducing Web-Scale Diffusion Models to Robotics", authors: "Kapelyukh et al.", venue: "IEEE RA-L 2023", year: 2023, url: "https://arxiv.org/abs/2210.02438" },
      ],
    },
  ],
  faqs: [
    {
      question: "How many rearrangement episodes are needed for reliable deployment?",
      answer: "For tabletop rearrangement with 5-10 known object types and goal-image conditioning, 5,000 episodes suffice for 80%+ per-episode success. For language-conditioned rearrangement across 50+ object types in varied environments, 20,000-50,000 episodes are typical. The key scaling factor is object diversity — each new object category requires 100-200 episodes of manipulation data to cover its grasp and placement variations.",
    },
    {
      question: "Should rearrangement data include the goal state or just the manipulation?",
      answer: "Both. Each episode needs three components: the goal state specification (image, language, or structured layout), the initial disturbed state, and the full manipulation trajectory. Goal-conditioned policies train on (goal, observation, action) tuples, so missing any component reduces the data's utility. For language-conditioned approaches, also include multiple paraphrases of the same goal to improve language grounding robustness.",
    },
    {
      question: "How important is manipulation ordering in rearrangement data?",
      answer: "Very important for long-horizon tasks. With 10+ objects, the order in which items are moved determines whether later placements are feasible — moving a large item first may block access to smaller items behind it. Annotating ordering efficiency (ratio of actual steps to optimal) enables learning of efficient planning. However, for initial policy training, any successful completion order is useful data. Optimality annotations become important at the fine-tuning stage.",
    },
    {
      question: "Can simulation data substitute for real rearrangement demonstrations?",
      answer: "Simulation is effective for pretraining navigation and high-level planning components. AI2-THOR and Habitat provide millions of simulated episodes that teach sequential decision-making. However, the low-level manipulation component — grasping diverse real objects, placing them precisely on cluttered surfaces — requires real-world data. A hybrid approach using simulation for planning pretraining and 5,000-10,000 real episodes for manipulation fine-tuning is the established best practice.",
    },
    {
      question: "What scene complexity should rearrangement data target?",
      answer: "Use a difficulty-stratified distribution: 30% easy scenes (3-5 objects, wide spacing), 40% medium scenes (6-12 objects, moderate clutter), and 30% hard scenes (13-25 objects, dense packing). This supports curriculum learning where the policy trains on easy scenes first and progressively handles harder configurations. Include metadata for number of objects, average inter-object distance, and scene clutter density to enable stratified splitting.",
    },
    {
      question: "How should rearrangement data handle fragile or stackable objects?",
      answer: "Fragile objects (glasses, electronics, ceramic) and stackable objects (plates, books, boxes) require specialized placement strategies that must be captured in demonstrations. Fragile objects need demonstrations of careful placement with controlled release and stability verification — not just dropping them on the surface. Stackable objects need demonstrations of alignment during stacking, weight distribution awareness (heavy items on bottom), and stack stability testing. Annotate each episode with object fragility level (robust, moderate, fragile) and stackability (non-stackable, stackable-on-top, stackable-base). Budget 100+ dedicated demonstrations for fragile and stacking scenarios, as these are the highest-liability failure modes in deployment.",
    },
  ],
  ctaHeading: "Get a Custom Quote for Object Rearrangement Data",
  ctaDescription: "Describe your target environment, object categories, and goal specification method. We will build a collection plan covering the scene diversity your policy requires.",
  relatedGlossaryTerms: ["manipulation-trajectory", "behavioral-cloning", "imitation-learning", "spatial-reasoning"],
  relatedGuidePages: ["how-to-build-a-manipulation-dataset"],
  relatedSolutionSlugs: [],
  dataRequirements: {
    modality: "RGB-D multi-view + language descriptions + goal state images",
    volumeRange: "5K-50K rearrangement episodes",
    temporalResolution: "30 Hz video, goal-state image pairs, per-object pose estimates",
    keyAnnotations: ["Goal state specification (image + language)", "Object placement accuracy (cm from target)", "Manipulation ordering efficiency", "Collision events during placement", "Scene complexity metadata"],
  },
  relevantModels: ["SayCan", "StructFormer", "DALL-E-Bot", "TidyBot", "OpenVLA", "Diffusion Policy"],
  environmentTypes: ["Tabletop", "Kitchen counter", "Shelf/bookcase", "Desk workspace", "Retail display fixture"],
  keyPapers: [
    { id: "ahn-saycan-2022", title: "Do As I Can, Not As I Say: Grounding Language in Robotic Affordances", authors: "Ahn et al.", venue: "arXiv 2204.01691", year: 2022, url: "https://arxiv.org/abs/2204.01691" },
    { id: "liu-structformer-2022", title: "StructFormer: Learning Spatial Structure for Language-Guided Semantic Rearrangement of Novel Objects", authors: "Liu et al.", venue: "ICRA 2022", year: 2022, url: "https://arxiv.org/abs/2110.10189" },
    { id: "wu-tidybot-2023", title: "TidyBot: Personalized Robot Assistance with Large Language Models", authors: "Wu et al.", venue: "IROS 2023", year: 2023, url: "https://arxiv.org/abs/2305.11461" },
    { id: "szot-habitat-2021", title: "Habitat 2.0: Training Home Assistants to Rearrange their Habitat", authors: "Szot et al.", venue: "NeurIPS 2021", year: 2021, url: "https://arxiv.org/abs/2106.14405" },
  ],
  claruRelevance: "Claru builds rearrangement datasets using modular scene fixtures (shelving units, counters, desk surfaces) shipped to our distributed collection network. Each episode captures paired initial and goal states with multi-view RGB-D, natural language goal descriptions, and full manipulation trajectories via teleoperation. Our object library spans 200+ items across grocery, kitchenware, office, and household categories with calibrated meshes for pose estimation ground truth. Annotations include per-object placement accuracy, ordering efficiency scores, collision events, and scene complexity metadata. We deliver difficulty-stratified datasets in RLDS, HDF5, or custom formats with splits by object count, scene type, and goal specification modality. Typical campaigns produce 5,000-20,000 annotated episodes within 3-6 weeks.",
};

export default data;
