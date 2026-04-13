import type { BenchmarkPageData } from "./types";
const page: BenchmarkPageData = {
  "slug": "robocasa",
  "benchmarkName": "RoboCasa",
  "benchmarkDescription": "RoboCasa is a large-scale simulation benchmark for household robot manipulation. Built on robosuite, it provides photorealistic kitchen environments with over 150 object categories and 2,500 3D assets, evaluating robots on realistic home tasks like cooking, cleaning, and organizing.",
  "taskSet": "100 tasks across kitchen activities: opening/closing appliances, retrieving items from shelves and refrigerators, operating sinks and stoves, cleaning countertops, and multi-step cooking sequences. Tasks are parameterized across 120+ kitchen scene configurations.",
  "observationSpace": "RGB images from multiple cameras (agentview, eye-in-hand), depth maps, proprioceptive state, and natural language task descriptions.",
  "actionSpace": "End-effector delta poses with gripper control on single or dual-arm robot platforms.",
  "evaluationProtocol": "Task success rate across randomized kitchen configurations, object placements, and task variations. Multi-step tasks measured by subtask completion rate.",
  "simToRealGap": "RoboCasa provides photorealistic rendering and diverse kitchen layouts but simplifies material interactions (water, food, grease), thermal effects (stove heat, refrigerator cold), and deformable object physics. Real kitchens have unique layouts, non-standard appliance interfaces, and environmental conditions simulation cannot fully capture.",
  "realWorldDataNeeds": "Kitchen manipulation recordings in real homes across diverse kitchen styles and appliance brands. Food preparation data with authentic material interactions. Multi-step cooking task demonstrations showing natural task sequencing and error recovery.",
  "complementaryDatasets": [
    {
      "name": "Egocentric Activity Dataset",
      "rationale": "Real-world kitchen activity video provides authentic cooking, cleaning, and organizing demonstrations with natural environmental variation."
    },
    {
      "name": "Custom Kitchen Task Collection",
      "rationale": "Purpose-collected manipulation data in real kitchens with diverse layouts, appliances, and food items provides direct validation data for RoboCasa tasks."
    },
    {
      "name": "Manipulation Trajectory Dataset",
      "rationale": "Contact-rich manipulation recordings complement RoboCasa's emphasis on household object interaction."
    }
  ],
  "keyPapers": [
    {
      "id": "nasiriany-robocasa-2024",
      "title": "RoboCasa: Large-Scale Simulation of Everyday Tasks for Generalist Robots",
      "authors": "Nasiriany et al.",
      "venue": "RSS 2024",
      "year": 2024,
      "url": "https://arxiv.org/abs/2406.02523"
    },
    {
      "id": "mandlekar-robomimic-2022",
      "title": "RoboMimic: A Framework for Studying Robotic Manipulation Policy Learning",
      "authors": "Mandlekar et al.",
      "venue": "CoRL 2022",
      "year": 2022,
      "url": "https://arxiv.org/abs/2108.03298"
    },
    {
      "id": "ahn-saycan-2022",
      "title": "Do As I Can, Not As I Say: Grounding Language in Robotic Affordances",
      "authors": "Ahn et al.",
      "venue": "CoRL 2022",
      "year": 2022,
      "url": "https://arxiv.org/abs/2204.01691"
    }
  ],
  "technicalAnalysis": `RoboCasa represents the most comprehensive kitchen manipulation benchmark available. Its 2,500+ 3D assets and 120+ kitchen configurations create combinatorial diversity that challenges policy generalization. However, the diversity is still bounded by simulation — every kitchen uses the same physics engine, the same material model, and rendering from the same pipeline.

The food-related tasks highlight the biggest sim-to-real gap. Pouring, stirring, and cutting involve fluid dynamics, material deformation, and tool-material interactions that simulation approximates crudely. A policy that successfully 'stirs soup' in RoboCasa has not encountered real liquid viscosity, spoon resistance, or splashing.

The multi-step cooking sequences introduce temporal complexity. Real cooking involves natural interruptions (waiting for water to boil, checking oven temperature), adaptive timing (adjusting cooking time based on food state), and recovery from failures (saving over-seasoned food). These adaptive behaviors are absent from scripted simulation demonstrations.

Claru's ability to collect kitchen task data in real homes across 100+ cities provides the diversity RoboCasa aims to simulate — authentic kitchen layouts, real appliance interfaces, actual food preparation with true material interactions.`,
  "metaTitle": "Real-World Data for RoboCasa Kitchen Benchmark | Claru",
  "metaDescription": "Kitchen manipulation, cooking task, and household object data for RoboCasa's large-scale household robot simulation benchmark.",
  "primaryKeyword": "RoboCasa real-world data",
  "secondaryKeywords": [
    "RoboCasa sim-to-real",
    "kitchen robot data",
    "household manipulation data",
    "cooking robot training data"
  ],
  "canonicalPath": "/benchmarks/robocasa",
  "h1": "Real-World Data for RoboCasa",
  "heroSubtitle": "RoboCasa simulates realistic kitchen tasks. Real-world data adds the material interactions, thermal effects, and environmental chaos of actual cooking.",
  "breadcrumbs": [
    {
      "label": "Home",
      "href": "/"
    },
    {
      "label": "Benchmarks",
      "href": "/benchmarks"
    },
    {
      "label": "RoboCasa",
      "href": "/benchmarks/robocasa"
    }
  ],
  "sections": [
    {
      "type": "stats",
      "heading": "RoboCasa at a Glance",
      "stats": [
        { "value": "100", "label": "Tasks" },
        { "value": "2,500+", "label": "3D Assets" },
        { "value": "120+", "label": "Kitchen Configs" },
        { "value": "150+", "label": "Object Categories" },
        { "value": "MuJoCo", "label": "Physics Engine" },
        { "value": "2024", "label": "Released" }
      ]
    },
    {
      "type": "prose",
      "heading": "What Is RoboCasa?",
      "paragraphs": [
        "RoboCasa is a large-scale simulation benchmark for household robot manipulation, built on robosuite and MuJoCo by Nasiriany et al. and presented at RSS 2024. It provides photorealistic kitchen environments with over 2,500 3D assets across 150+ object categories and 120+ kitchen layout configurations, creating the most comprehensive simulated kitchen environment available for robot learning research.",
        "The benchmark evaluates robots on realistic home tasks — opening appliances, retrieving items from shelves and refrigerators, operating sinks and stoves, cleaning surfaces, and multi-step cooking sequences. Tasks are parameterized across kitchen configurations, so a policy trained on one layout must generalize to kitchens with different cabinet arrangements, appliance brands, and spatial organization.",
        "RoboCasa was created to address the scale gap between existing kitchen benchmarks and the diversity of real homes. Real kitchens vary enormously in layout, appliance selection, and organization. By providing 120+ configurations with 2,500+ realistic assets, RoboCasa creates combinatorial diversity that challenges policy generalization at a scale closer to real-world deployment conditions."
      ]
    },
    {
      "type": "comparison-table",
      "heading": "Kitchen Task Categories",
      "description": "RoboCasa's tasks span the full range of kitchen manipulation, each presenting different physical interaction challenges.",
      "columns": ["Category", "Example Tasks", "Key Challenge", "Sim-to-Real Gap"],
      "rows": [
        { "Category": "Appliance Operation", "Example Tasks": "Open fridge, microwave, oven", "Key Challenge": "Handle detection, hinge dynamics", "Sim-to-Real Gap": "Real hinge resistance, magnetic latches" },
        { "Category": "Item Retrieval", "Example Tasks": "Get item from shelf, fridge", "Key Challenge": "Spatial planning, grasp in clutter", "Sim-to-Real Gap": "Object weight variation, shelf friction" },
        { "Category": "Surface Cleaning", "Example Tasks": "Wipe counter, clean stove", "Key Challenge": "Contact-rich wiping motion", "Sim-to-Real Gap": "Real friction, material compliance, cleaning fluid" },
        { "Category": "Food Preparation", "Example Tasks": "Pour, stir, cut", "Key Challenge": "Material deformation, fluid dynamics", "Sim-to-Real Gap": "Liquid viscosity, food texture, knife friction" },
        { "Category": "Multi-Step Cooking", "Example Tasks": "Make coffee, prepare ingredients", "Key Challenge": "Long-horizon planning, state tracking", "Sim-to-Real Gap": "Thermal effects, timing adaptation, error recovery" }
      ]
    },
    {
      "type": "prose",
      "heading": "Evaluation Protocol",
      "paragraphs": [
        "RoboCasa evaluates policies on task success rate across randomized kitchen configurations, object placements, and task variations. Each task is tested across multiple kitchen layouts to measure generalization — a policy that succeeds in kitchen layout A must also work in layout B with different cabinet positions and appliance brands.",
        "Multi-step tasks are measured by subtask completion rate, providing granular feedback on where policies fail. A coffee-making task might succeed on retrieving the mug (step 1) but fail on operating the coffee machine (step 2), revealing which manipulation skills need improvement.",
        "The benchmark supports both single-arm and dual-arm robot platforms, enabling evaluation of bimanual kitchen tasks like holding a pot while stirring. Dual-arm evaluation is particularly relevant for realistic kitchen manipulation where many tasks require two-handed coordination."
      ]
    },
    {
      "type": "comparison-table",
      "heading": "RoboCasa vs. Related Kitchen Benchmarks",
      "columns": ["Feature", "RoboCasa", "Habitat 2.0", "BEHAVIOR-1K", "AI2-THOR"],
      "rows": [
        { "Feature": "Kitchen focus", "RoboCasa": "Dedicated kitchen benchmark", "Habitat 2.0": "Whole-home (incl. kitchen)", "BEHAVIOR-1K": "Multi-room household", "AI2-THOR": "Multi-room household" },
        { "Feature": "3D assets", "RoboCasa": "2,500+ kitchen-specific", "Habitat 2.0": "Real 3D scans", "BEHAVIOR-1K": "1,000+ household", "AI2-THOR": "300+ household" },
        { "Feature": "Kitchen layouts", "RoboCasa": "120+ configurations", "Habitat 2.0": "Scanned layouts", "BEHAVIOR-1K": "50 scenes", "AI2-THOR": "30 kitchens" },
        { "Feature": "Physics engine", "RoboCasa": "MuJoCo (robosuite)", "Habitat 2.0": "Habitat physics", "BEHAVIOR-1K": "OmniGibson", "AI2-THOR": "Unity physics" },
        { "Feature": "Manipulation focus", "RoboCasa": "Primary focus", "Habitat 2.0": "Navigation + manipulation", "BEHAVIOR-1K": "Manipulation + navigation", "AI2-THOR": "Interaction" }
      ]
    },
    {
      "type": "prose",
      "heading": "Bridging Simulated Kitchens to Real Homes",
      "paragraphs": [
        "RoboCasa's diversity is impressive for simulation but still bounded by what can be modeled. Real kitchens present challenges that simulation systematically misses: water behaves as particles rather than fluid, food items lack realistic deformation and cutting physics, thermal effects (stove heat affecting nearby objects) are absent, and appliance interfaces vary wildly across brands.",
        "The organizational diversity gap is also significant. RoboCasa randomizes object placement, but real kitchens have functional organization that reflects human preferences — frequently used items are accessible, heavy items are on lower shelves, cleaning supplies are under the sink. A robot that does not understand these conventions will waste time searching.",
        "Real-world kitchen data from diverse homes addresses both gaps simultaneously. Authentic cooking, cleaning, and organizing demonstrations capture material interactions simulation cannot model and organizational patterns that randomization cannot replicate. Each real kitchen contributes unique layout, appliance set, and organizational logic.",
        "Claru's ability to collect kitchen task data in real homes across 100+ cities provides this diversity at scale. Each home contributes a unique kitchen configuration, appliance set, and task context — providing natural variation that mirrors and exceeds RoboCasa's combinatorial diversity."
      ]
    },
    {
      "type": "prose",
      "heading": "How Claru Supports RoboCasa Users",
      "paragraphs": [
        "Claru provides the real-world kitchen manipulation data that validates and extends RoboCasa-trained policies. Our egocentric activity dataset captures authentic cooking, cleaning, and organizing demonstrations in real homes with naturally varying layouts, appliances, and food items.",
        "For teams targeting specific RoboCasa task categories, Claru coordinates custom collection campaigns in real kitchens — appliance operation across brands, food preparation with actual ingredients, surface cleaning with real materials. This task-matched real data enables direct sim-to-real comparison and policy fine-tuning.",
        "Our collection captures the material interactions that RoboCasa cannot simulate: liquid pouring with real viscosity, food cutting with real knife-material friction, and surface cleaning with actual cleaning agents. This physically authentic data is essential for deploying kitchen robots trained in simulation."
      ]
    },
    {
      "type": "citation-list",
      "heading": "Key References",
      "citations": [
        { "id": "nasiriany-robocasa-2024", "title": "RoboCasa: Large-Scale Simulation of Everyday Tasks for Generalist Robots", "authors": "Nasiriany et al.", "venue": "RSS 2024", "year": 2024, "url": "https://arxiv.org/abs/2406.02523" },
        { "id": "mandlekar-robomimic-2022", "title": "RoboMimic: A Framework for Studying Robotic Manipulation Policy Learning", "authors": "Mandlekar et al.", "venue": "CoRL 2022", "year": 2022, "url": "https://arxiv.org/abs/2108.03298" },
        { "id": "ahn-saycan-2022", "title": "Do As I Can, Not As I Say: Grounding Language in Robotic Affordances", "authors": "Ahn et al.", "venue": "CoRL 2022", "year": 2022, "url": "https://arxiv.org/abs/2204.01691" }
      ]
    }
  ],
  "faqs": [
    {
      "question": "Why does kitchen manipulation need real-world data?",
      "answer": "Kitchen tasks involve material interactions simulation cannot model well — pouring liquids, cutting food, operating real appliances. Every real kitchen also has a unique layout, appliance set, and organization system that simulation parametrizes but cannot fully represent."
    },
    {
      "question": "What makes RoboCasa different from other kitchen benchmarks?",
      "answer": "Scale. RoboCasa provides 2,500+ 3D assets across 120+ kitchen configurations, creating combinatorial diversity far beyond previous kitchen benchmarks. However, this simulated diversity must be validated against real-world kitchen variation to ensure policies transfer."
    },
    {
      "question": "How does Claru collect kitchen data at scale?",
      "answer": "Claru's collectors operate in their own homes and local environments across 100+ cities. Each kitchen contributes unique layout, appliances, and objects — providing natural diversity that mirrors the combinatorial variation RoboCasa aims to simulate."
    },
    {
      "question": "Can simulation handle food preparation physics?",
      "answer": "Not adequately. RoboCasa simulates pouring, stirring, and cutting with simplified physics that misses liquid viscosity, food deformation, knife-material friction, and thermal effects. A policy trained to 'stir soup' in simulation has never encountered real liquid resistance or splashing. Real food preparation data is essential for deploying kitchen manipulation policies."
    },
    {
      "question": "How many kitchen layouts does a robot need to generalize?",
      "answer": "RoboCasa provides 120+ configurations, which is more than previous benchmarks but far fewer than the millions of unique kitchens a deployed robot may encounter. Research suggests that policies need exposure to diverse layouts with varying cabinet positions, counter heights, and appliance locations to build spatial generalization. Real-world data from many homes provides this diversity authentically."
    }
  ],
  "ctaHeading": "Get Real Kitchen Manipulation Data",
  "ctaDescription": "Discuss authentic kitchen task data for validating RoboCasa-trained policies.",
  "relatedGlossaryTerms": [
    "egocentric-video",
    "manipulation-trajectory",
    "scene-understanding"
  ],
  "relatedGuidePages": [
    "how-to-collect-kitchen-activity-data",
    "how-to-build-a-manipulation-dataset"
  ],
  "relatedSolutionSlugs": []
};
export default page;
