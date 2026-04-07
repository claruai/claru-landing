import type { ContentPageData } from "./types";

const kitchenManipulationData: ContentPageData = {
  // -- Identity & SEO --
  slug: "kitchen-manipulation-data",
  title: "Kitchen Manipulation Data: Training Robots for Food Prep and Household Tasks",
  metaTitle: "Kitchen Manipulation Training Data | Claru",
  metaDescription:
    "Real-world kitchen task datasets for robot learning. Food preparation, cooking, cleaning, and tool use demonstrations from diverse home environments globally.",
  primaryKeyword: "kitchen manipulation data",
  secondaryKeywords: [
    "kitchen robot training data",
    "food preparation dataset",
    "household manipulation data",
    "cooking robot dataset",
    "kitchen task demonstration data",
    "domestic robot training",
  ],
  breadcrumbLabel: "Kitchen Manipulation Data",
  ogCategory: "solution",

  // -- Hero --
  heroSubtitle:
    "Kitchen environments are the most common deployment target for household robots, yet they present some of the hardest manipulation challenges: deformable food items, transparent containers, wet surfaces, and multi-step task sequences requiring tool use. Public datasets either simulate kitchens synthetically or capture a narrow range of tasks in a few lab kitchens, leaving a critical training data gap for real-world kitchen autonomy.",

  // -- Problem Section --
  problem: {
    heading: "Why Is Kitchen Manipulation One of the Hardest Data Problems in Robotics?",
    sections: [
      {
        heading: "Why Is Kitchen Manipulation One of the Hardest Data Problems in Robotics?",
        content:
          "Kitchen environments concentrate nearly every manipulation challenge into a single domain. Objects are deformable (dough, vegetables), transparent (glasses, bottles), reflective (pots, utensils), and small (spices, garnishes). Tasks are inherently multi-step and require tool use: cutting requires grasping a knife, stabilizing the food item, and applying controlled force along a trajectory. RoboCasa established a large-scale simulation benchmark spanning 150+ kitchen layouts with 2,500+ object instances and demonstrated that environment diversity is critical for policy generalization. However, the authors noted that simulated kitchens cannot capture the material properties that determine manipulation success: the friction of a wet cutting board, the deformability of bread under a knife, or the compliance of a garbage bag being pulled from its roll. BEHAVIOR-1K defined 1,000 everyday activities with kitchen tasks comprising the largest single category, highlighting that kitchen manipulation is central to household robot deployment but remains far from solved.",
        citationIds: ["robocasa-2024", "behavior1k-2023"],
      },
      {
        heading: "What Gaps Exist in Current Kitchen Manipulation Datasets?",
        content:
          "Existing kitchen datasets fall into two categories: simulation-based and lab-based, each with structural limitations. RoboCasa provides scale and diversity in simulation but cannot model contact-rich interactions with deformable food items. EPIC-KITCHENS offers 100 hours of real kitchen video from 45 kitchens but provides egocentric observation without robot action labels, making it suitable for activity recognition but not direct policy learning. The BridgeData V2 dataset includes real robot manipulation demonstrations, but kitchen-relevant tasks are a small fraction of its 60,000+ trajectories, and all data comes from a single lab setup. CALVIN provides language-conditioned manipulation benchmarks but operates in a simplified tabletop environment without realistic kitchen objects. The fundamental issue is that no existing dataset combines real kitchen environments, diverse food and tool manipulation, and the action-labeled demonstrations that learned policies require.",
        citationIds: ["epic-kitchens-2018", "bridgedata-v2-2024"],
      },
      {
        heading: "Why Does Kitchen Environment Diversity Matter for Policy Transfer?",
        content:
          "Kitchen layouts, appliances, and tool sets vary enormously across households, cultures, and geographies. A policy trained in a single kitchen with a specific knife set, cutting board, and stove configuration will fail when deployed in a kitchen with different spatial arrangements, tool sizes, or appliance interfaces. RoboCasa showed that training across 150+ unique kitchen layouts produced policies that generalized significantly better than single-layout training, but this result was in simulation where layout variation is free. In the real world, capturing kitchen diversity requires visiting many actual kitchens across different housing types, countries, and socioeconomic contexts. This is precisely the environment diversity gap that distinguishes lab-collected data from data that produces deployable policies.",
        citationIds: ["robocasa-2024"],
      },
    ],
  },

  // -- Landscape / Comparison --
  landscape: {
    heading: "How Do Open Kitchen Datasets Compare to Custom Collection?",
    description:
      "The table below compares datasets relevant to kitchen manipulation against Claru custom collection. The critical gaps in open data are real-world kitchen diversity, food manipulation coverage, and action-labeled demonstrations.",
    datasets: [
      {
        name: "RoboCasa (Sim)",
        scale: "100K+ trajectories, 150+ kitchen layouts",
        tasks: "Kitchen manipulation; opening, closing, picking, placing, cooking",
        environments: "Simulated kitchens with AI-generated textures and layouts",
        limitations:
          "Simulation only; no deformable food physics; cannot model wet/sticky surfaces or real material properties",
        isClaru: false,
      },
      {
        name: "EPIC-KITCHENS",
        scale: "100 hours, 45 kitchens, 20M frames",
        tasks: "Egocentric activity recognition; cooking, cleaning, food prep",
        environments: "Real home kitchens across multiple countries",
        limitations:
          "No action labels for robot learning; observation-only; unstructured annotations",
        isClaru: false,
      },
      {
        name: "BridgeData V2",
        scale: "60K+ trajectories, 24 environments",
        tasks: "Tabletop manipulation including some kitchen-adjacent tasks",
        environments: "Lab environments with toy kitchen objects",
        limitations:
          "Kitchen tasks are a small fraction; toy objects rather than real food; single lab setup",
        isClaru: false,
      },
      {
        name: "BEHAVIOR-1K",
        scale: "1,000 activity definitions, simulation benchmark",
        tasks: "1,000 household activities including extensive kitchen tasks",
        environments: "Simulated household environments with 50 scenes",
        limitations:
          "Benchmark definitions only; no real-world demonstrations; simulation physics limitations for deformable objects",
        isClaru: false,
      },
      {
        name: "Claru Custom",
        scale: "386K+ video clips, ~500 contributors, global kitchen coverage",
        tasks: "Configurable: food prep, cooking, cleaning, tool use, multi-step meal preparation across cuisines",
        environments: "Real home kitchens across multiple countries and housing types; professional kitchens; diverse appliance sets",
        limitations:
          "Requires engagement lead time (days to launch, 1-2 week calibration); not a public benchmark",
        isClaru: true,
      },
    ],
  },

  // -- Solution Section --
  solution: {
    heading: "How Does Claru Build Kitchen Manipulation Datasets?",
    sections: [
      {
        heading: "How Does Real-Kitchen Capture Solve the Simulation Gap?",
        content:
          "RoboCasa demonstrated that kitchen layout diversity improves policy generalization, but simulation cannot capture the contact physics that determine manipulation success with food items. Claru's egocentric video pipeline captures real human manipulation in real kitchens at scale. The 386,000+ clip base includes extensive kitchen activity footage from contributors across multiple countries, capturing the natural manipulation strategies people use for food preparation, cooking, and cleaning. Contributors record using standard smartphones at 4K resolution and 60fps during normal cooking activities, producing data that inherently captures material interactions — how people adjust grip force for a ripe tomato versus a hard apple, how cutting technique varies between crusty bread and soft cheese. This first-person perspective maps directly to the egocentric observation format that kitchen manipulation policies consume.",
        citationIds: ["robocasa-2024"],
      },
      {
        heading: "How Does Cross-Cultural Kitchen Coverage Improve Generalization?",
        content:
          "EPIC-KITCHENS captured kitchen activities across multiple countries but noted significant variation in kitchen layouts, tool sets, and cooking techniques across cultural contexts. A robot deployed in a Japanese kitchen encounters fundamentally different utensils (chopsticks, rice cookers, bento assembly) than one in an Italian kitchen (pasta machines, espresso makers, large cutting boards). Claru's global contributor network spans multiple countries and cultural contexts, producing kitchen data with genuine diversity in cooking styles, tool sets, ingredient types, and spatial configurations. The workplace egocentric program demonstrated this global capture capability across 10 workplace categories, and the same infrastructure extends to home kitchen capture. The structured activity taxonomy is adapted for kitchen-specific task hierarchies: meal preparation broken into ingredient preparation, cooking, plating, and cleaning phases, each with sub-task annotations that capture the sequential dependencies kitchen policies must learn.",
        citationIds: ["epic-kitchens-2018"],
      },
      {
        heading: "How Does Action-Labeled Kitchen Data Enable Policy Training?",
        content:
          "BridgeData V2 showed that real robot demonstrations with diverse objects improve manipulation policy generalization, but kitchen-relevant tasks were a small fraction of the dataset. Claru bridges this gap by providing kitchen-specific demonstrations with the action annotation quality that policy training requires. The synchronized capture pipeline, proven with sub-16ms temporal alignment in the game-based data capture project, can be configured for kitchen task sequences where precise timing matters: the moment a pan is flipped, the duration of a stir, the force profile of a cut. Every clip passes automated validation at upload time followed by same-day human QA review. The annotation pipeline supports kitchen-specific labels including ingredient state transitions (raw to chopped to cooked), tool grasp types, and task completion criteria that map directly to reward signals for policy training.",
        citationIds: ["bridgedata-v2-2024"],
      },
    ],
  },

  // -- Case Studies --
  caseStudySlugs: [],

  // -- Dataset Showcase --
  datasetIds: [],

  // -- FAQ --
  faqs: [
    {
      question: "What types of kitchen tasks does Claru's data cover?",
      answer:
        "Claru captures the full range of kitchen manipulation tasks: ingredient preparation (washing, peeling, chopping, slicing), cooking operations (stirring, flipping, pouring, seasoning), tool use (knives, spatulas, whisks, tongs), cleaning (wiping, scrubbing, loading dishwasher), and multi-step meal preparation sequences. Task coverage is configured per engagement based on the target deployment scenario.",
    },
    {
      question: "How many different kitchens are represented in Claru's dataset?",
      answer:
        "Kitchen count scales with engagement scope. Claru's global contributor network of approximately 500 people spans multiple countries and housing types, from compact apartments to large family homes to professional kitchens. Each kitchen contributes unique spatial layouts, appliance sets, and tool inventories that improve policy generalization across deployment environments.",
    },
    {
      question: "Can Claru provide data for deformable food manipulation?",
      answer:
        "Yes. Real-kitchen capture inherently includes deformable food manipulation that simulation cannot model: kneading dough, slicing ripe fruit, handling raw meat, wrapping tortillas, and assembling sandwiches. Annotations include object state transitions (e.g., whole to sliced, raw to cooked) and grasp adaptation labels that capture how human manipulation strategies change based on food item compliance and fragility.",
    },
    {
      question: "Does the kitchen data include language instructions for VLA training?",
      answer:
        "Kitchen demonstrations can be paired with natural language instructions at the task level (e.g., 'chop the onion into small pieces') and the step level (e.g., 'hold the onion steady with your left hand, then make vertical cuts'). Language annotation depth is configured per engagement. The structured activity taxonomy provides hierarchical task descriptions that can be converted to language instructions for VLA architectures.",
    },
  ],

  // -- Research Citations --
  citations: [
    {
      id: "robocasa-2024",
      title:
        "RoboCasa: Large-Scale Simulation of Everyday Tasks for Generalist Robots",
      authors: "Nasiriany et al.",
      venue: "arXiv 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2406.02523",
      keyClaim:
        "Large-scale kitchen simulation benchmark with 150+ layouts and 2,500+ objects; showed that environment diversity is critical for policy generalization but acknowledged simulation cannot model deformable food physics.",
    },
    {
      id: "epic-kitchens-2018",
      title:
        "Scaling Egocentric Vision: The EPIC-KITCHENS Dataset",
      authors: "Damen et al.",
      venue: "ECCV 2018",
      year: 2018,
      url: "https://arxiv.org/abs/1804.02748",
      keyClaim:
        "100 hours of egocentric kitchen video from 45 kitchens revealing significant cross-cultural variation in cooking activities, tools, and kitchen layouts.",
    },
    {
      id: "bridgedata-v2-2024",
      title:
        "BridgeData V2: A Dataset for Robot Learning at Scale",
      authors: "Walke et al.",
      venue: "CoRL 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2308.12952",
      keyClaim:
        "60,000+ real robot manipulation trajectories across 24 environments demonstrating that diverse real-world demonstrations improve policy generalization.",
    },
    {
      id: "behavior1k-2023",
      title:
        "BEHAVIOR-1K: A Human-Centered Benchmark for Embodied AI with 1,000 Everyday Activities",
      authors: "Li et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2403.09227",
      keyClaim:
        "Defined 1,000 everyday household activities with kitchen tasks as the largest single category, establishing that kitchen manipulation is central to household robot deployment.",
    },
  ],

  // -- Internal Linking --
  pillarLinks: [
    "/training-data/robotics",
    "/models/manipulation",
  ],

  // -- Related Content Pages --
  relatedSlugs: [
    "manipulation-trajectory-data",
    "humanoid-robot-training-data",
    "egocentric-video-data",
  ],
};

export default kitchenManipulationData;
