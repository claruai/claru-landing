import type { TaskPageData } from "../types";

const data: TaskPageData = {
  slug: "kitchen-tasks",
  metaTitle: "Kitchen Task Training Data for Robotics | Claru",
  metaDescription:
    "Training data for kitchen manipulation tasks: cooking, cleaning, organizing. Multi-step long-horizon demonstrations in real kitchen environments.",
  primaryKeyword: "kitchen robotics training data",
  secondaryKeywords: [
    "kitchen robot dataset",
    "cooking robot data",
    "kitchen manipulation demonstrations",
    "household robot training data",
    "meal preparation dataset",
    "long-horizon manipulation data",
  ],
  canonicalPath: "/training-data/kitchen-tasks",
  h1: "Kitchen Task Training Data",
  heroSubtitle:
    "Multi-step demonstration data for kitchen robotics — meal preparation, dishwashing, utensil handling, and food storage tasks in real residential and commercial kitchens.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Training Data", href: "/training-data" },
    { label: "Kitchen Task", href: "/training-data/kitchen-tasks" },
  ],
  sections: [
    {
      type: "prose",
      heading: "Why Kitchen Tasks Are the Benchmark for Embodied AI",
      paragraphs: [
        "Kitchen environments have become the de facto benchmark for embodied AI because they compress nearly every manipulation challenge into a single setting: multi-step sequential reasoning (following a recipe), diverse object categories (rigid containers, deformable food items, articulated appliances, granular materials), tool use (spatulas, knives, ladles), state changes that are irreversible (raw to cooked, whole to chopped, clean to dirty), and tight integration with natural language (recipe instructions). No other household environment demands this breadth of capabilities simultaneously.",
        "Google's RT-2 (Brohan et al., 2023) used a kitchen environment for evaluation, demonstrating that a vision-language-action model can follow novel language instructions like 'move the apple to the plate' with 62% success in a real kitchen — a 2x improvement over RT-1. The kitchen was chosen specifically because it tests generalization: the same model must handle rigid objects (plates), deformable objects (bags), articulated objects (cabinets), and objects with varying appearances (different types of fruit). SayCan (Ahn et al., 2022) demonstrated language-conditioned kitchen task planning across 101 different instructions, achieving 74% end-to-end success on multi-step tasks like 'I spilled my drink, can you help?'",
        "The long-horizon nature of kitchen tasks makes data collection uniquely demanding. A simple meal preparation involves 20-50 discrete manipulation steps spanning 5-15 minutes — compared to tabletop pick-and-place episodes of 5-15 seconds. Each step can fail independently, and failures cascade: if the robot drops an egg during cracking, the entire recipe fails. ALOHA demonstrated that even fine-grained kitchen tasks like cooking shrimp can be learned from 50 demonstrations, achieving 80% success (40/50 trials), but each demonstration required 2-4 minutes of continuous teleoperation. This long episode duration means kitchen data collection is 10-30x slower per demonstration than tabletop manipulation.",
        "Kitchen data is also uniquely perishable — literally. Real food ingredients introduce scheduling constraints (items expire, produce ripens, frozen items thaw), hygiene requirements (food safety protocols, surface sanitization between sessions), and variability that is difficult to control (no two tomatoes are identical). These practical challenges mean that kitchen robot data collection requires purpose-built facilities with standardized ingredients procurement, not just a robot in a lab with proxy objects. The difference between training on real food versus plastic food items is measurable: policies trained on real food achieve 15-25% higher success rates on food manipulation tasks because they learn the actual deformation, friction, and mass distribution properties.",
      ],
    },
    {
      type: "stats",
      heading: "Kitchen Data by the Numbers",
      stats: [
        { value: "20-50", label: "Manipulation steps in a meal preparation" },
        { value: "74%", label: "SayCan success rate on multi-step kitchen tasks" },
        { value: "62%", label: "RT-2 success on novel kitchen instructions" },
        { value: "80%", label: "ALOHA success on cooking shrimp (50 demos)" },
        { value: "5-15 min", label: "Episode duration for meal preparation" },
        { value: "101", label: "Distinct instructions evaluated in SayCan" },
      ],
    },
    {
      type: "comparison-table",
      heading: "Data Requirements by Learning Approach",
      description:
        "Kitchen robotics spans from simple pick-place to full meal preparation. Different approaches demand different data types and volumes.",
      columns: [
        "Approach",
        "Data Volume",
        "Episode Length",
        "Key Data Requirements",
        "Best For",
      ],
      rows: [
        {
          Approach: "Behavioral Cloning (single-task)",
          "Data Volume": "50-200 demos per task",
          "Episode Length": "10-60 seconds",
          "Key Data Requirements": "Multi-view RGB + proprioception + action labels",
          "Best For": "Individual kitchen primitives (pour, stir, chop)",
        },
        {
          Approach: "ACT / Diffusion Policy",
          "Data Volume": "50-500 demos per task",
          "Episode Length": "30 sec-5 min",
          "Key Data Requirements": "Multi-view RGB + proprioception + force (optional)",
          "Best For": "Fine-grained tasks (shrimp cooking, egg cracking)",
        },
        {
          Approach: "VLA (RT-2, OpenVLA)",
          "Data Volume": "5K-50K demos across task families",
          "Episode Length": "5-30 seconds per step",
          "Key Data Requirements": "RGB + language instruction pairs",
          "Best For": "Language-conditioned multi-task kitchen operation",
        },
        {
          Approach: "Hierarchical (SayCan-style)",
          "Data Volume": "500-5K demos + primitive library",
          "Episode Length": "Full task (5-15 min)",
          "Key Data Requirements": "Primitive demos + language-step annotations + affordance labels",
          "Best For": "Long-horizon multi-step meal preparation",
        },
        {
          Approach: "Simulation + Real fine-tuning",
          "Data Volume": "100K sim + 500-2K real demos",
          "Episode Length": "Variable",
          "Key Data Requirements": "Sim trajectories + real-world domain gap calibration",
          "Best For": "Rapid prototyping; articulated object manipulation",
        },
      ],
    },
    {
      type: "prose",
      heading: "State of the Art in Kitchen Robotics",
      paragraphs: [
        "RT-2 (Brohan et al., 2023) established the current state of the art for language-conditioned kitchen manipulation. By co-fine-tuning a PaLI-X vision-language model on 130K robot demonstrations from Google's kitchen fleet, RT-2 learned to follow novel instructions, perform rudimentary reasoning ('move the fruit to the empty bowl'), and even respond to instructions in languages not present in the robot data. On 3,000 real-world evaluation trials across 36 kitchen skills, RT-2 achieved 62% success on unseen instructions and 76% on seen instructions. The dataset's diversity — spanning 13 robots across 3 kitchens over 17 months — was more important than its size.",
        "ALOHA's kitchen demonstrations (Zhao et al., 2023) showed that bimanual dexterity in the kitchen is learnable with remarkably few examples. Using ACT (Action Chunking with Transformers), ALOHA achieved 80% success on cooking shrimp, 90% on wiping wine, and 96% on cup transfer — all from just 50 demonstrations per task. The Mobile ALOHA extension (Fu et al., 2024) enabled mobile kitchen tasks: opening cabinets while holding objects (85%), loading dishwashers (75%), and organizing kitchen counters (80%). These results demonstrate that kitchen tasks spanning from fine manipulation to whole-body coordination can be learned from real demonstrations.",
        "CALVIN (Mees et al., 2022) created a benchmark specifically for long-horizon kitchen-like tasks, evaluating whether policies can chain 5 sequential steps described in language ('open the drawer, pick up the block, place it on the table, push the slider, toggle the light'). On the CALVIN benchmark, the best current method (Hulc++) achieves 47% success on 5-step chains — meaning half the time, the policy fails before completing all steps. This result highlights that long-horizon kitchen data must capture not just individual step execution but transitions between steps and recovery from intermediate failures.",
        "For real-world kitchen deployment, TidyBot (Wu et al., 2023) demonstrated a practical approach to kitchen organization by combining LLM-based task planning with learned pick-and-place primitives. Using GPT-4 to infer where items belong based on user preferences (learned from 5-10 examples of placement decisions), TidyBot achieved 85% correct placement across 8 real kitchens with diverse layouts. The data requirement was modest — 50-100 pick-place demonstrations for the manipulation primitive plus 5-10 verbal preference examples for the planner — suggesting that kitchen systems benefit more from compositional data (separate primitive and planning data) than monolithic end-to-end demonstrations.",
      ],
    },
    {
      type: "prose",
      heading: "Collection Methodology for Kitchen Data",
      paragraphs: [
        "Kitchen data collection requires purpose-built test kitchens with standardized layouts, professional-grade lighting for consistent visual capture, and multi-view camera arrays. A minimum camera setup includes an overhead ceiling-mounted camera covering the full countertop workspace, a front-facing eye-level camera for object identification and hand-object interaction, a wrist-mounted camera on the robot for close-up manipulation detail, and optionally a side-view camera capturing the stovetop area. All cameras should operate at 30 Hz with hardware synchronization and be calibrated to a common reference frame for multi-view fusion.",
        "Language annotations are increasingly important for kitchen data. Each demonstration should include paired language descriptions at three granularities: task-level ('make a grilled cheese sandwich'), step-level ('place bread slice on pan'), and action-level ('move gripper 10 cm right to align with bread edge'). These hierarchical annotations enable training at different levels of abstraction — high-level planners that decompose instructions into steps, mid-level policies that execute step descriptions, and low-level controllers that follow fine-grained action narrations.",
        "Real food ingredients must be used for manipulation-relevant data. Food deformation properties (how a tomato squishes under gripper force, how dough stretches when pulled), friction characteristics (wet vs. dry cutting board, oily pan surface), and mass distribution (liquid sloshing in a half-full container) are fundamentally different from proxy objects. Each collection session should have standardized ingredient sets purchased with consistent specifications (vine tomatoes size M, whole wheat bread sliced 12 mm), and perishable items should be replaced on a defined schedule to prevent spoilage from affecting data quality.",
        "Claru operates dedicated test kitchen facilities for robotics data collection, equipped with standardized multi-view camera arrays, force-instrumented countertops (optional for force-aware policies), professional lighting rigs for consistent illumination across sessions, and procurement protocols for real food ingredients. Our kitchen task catalog spans 18 common manipulation tasks across 4 categories — preparation (cutting, peeling, mixing), cooking (stirring, flipping, monitoring), serving (plating, pouring), and cleanup (washing, drying, storing). Each task is demonstrated in 3-5 kitchen layout variations to build layout-invariant representations.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Key Datasets for Kitchen Robotics",
      description:
        "Public kitchen datasets range from small task-specific collections to large-scale fleet data. Most focus on tabletop manipulation rather than full kitchen workflows.",
      columns: [
        "Dataset",
        "Year",
        "Scale",
        "Environment",
        "Task Types",
        "Language Annotations",
      ],
      rows: [
        {
          Dataset: "RT-2 / Google Kitchen (Brohan et al.)",
          Year: "2023",
          Scale: "130K+ episodes, 13 robots",
          Environment: "3 Google kitchens",
          "Task Types": "Pick-place, open/close, wipe, pour",
          "Language Annotations": "Per-episode instruction + 36 skill templates",
        },
        {
          Dataset: "ALOHA Kitchen (Zhao et al.)",
          Year: "2023",
          Scale: "50 demos x 6 cooking tasks",
          Environment: "Single kitchen station",
          "Task Types": "Cooking shrimp, wiping, pouring, threading",
          "Language Annotations": "Task label only",
        },
        {
          Dataset: "CALVIN (Mees et al.)",
          Year: "2022",
          Scale: "24 hours of play data",
          Environment: "Simulated kitchen-like tabletop",
          "Task Types": "34 tasks chained in 5-step sequences",
          "Language Annotations": "Language-conditioned step instructions",
        },
        {
          Dataset: "LIBERO Kitchen (Liu et al.)",
          Year: "2023",
          Scale: "50 demos x 10 tasks x 5 suites",
          Environment: "Simulated kitchen scenes",
          "Task Types": "Pick-place, open, close, wipe (kitchen objects)",
          "Language Annotations": "Natural language task descriptions",
        },
        {
          Dataset: "RoboCasa (Nasiriany et al.)",
          Year: "2024",
          Scale: "100K+ trajectories, 150 layouts",
          Environment: "Procedurally generated kitchens (sim)",
          "Task Types": "100 tasks across kitchen activities",
          "Language Annotations": "Structured activity descriptions",
        },
      ],
    },
    {
      type: "prose",
      heading: "How Claru Supports Kitchen Task Data Needs",
      paragraphs: [
        "Claru operates dedicated test kitchen facilities specifically designed for robotics data collection, distinct from general-purpose kitchen spaces. Each facility features professional-grade LED lighting with consistent color temperature (5000K) and intensity across the workspace, eliminating the lighting variability that degrades visual policy performance. Multi-view camera arrays (overhead + eye-level + wrist + optional stovetop) are permanently mounted and calibrated, ensuring frame-to-frame geometric consistency across collection sessions.",
        "Our kitchen task catalog covers 18 manipulation tasks spanning 4 activity categories: preparation (cutting, peeling, mixing, measuring), cooking (stirring, flipping, monitoring temperature), serving (plating, pouring, garnishing), and cleanup (washing, drying, storing, organizing). Each task is demonstrated across 3-5 kitchen layout variations with real food ingredients procured under standardized specifications. Operators follow food safety protocols and session scheduling that accounts for ingredient perishability.",
        "Claru delivers kitchen datasets with hierarchical language annotations (task-level, step-level, action-level), temporal segmentation of task phases, object state change labels (raw/cooked, whole/chopped, clean/dirty), and success criteria annotations. Standard output formats include RLDS (for Open X-Embodiment compatibility), HDF5, and custom formats. For clients building language-conditioned policies, we provide paired instruction-demonstration data at multiple granularities. Our collection throughput is 100-300 quality kitchen task demonstrations per facility per day, depending on task complexity and episode duration.",
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        {
          id: "brohan-rt2-2023",
          title:
            "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
          authors: "Brohan et al.",
          venue: "arXiv 2307.15818",
          year: 2023,
          url: "https://arxiv.org/abs/2307.15818",
        },
        {
          id: "ahn-saycan-2022",
          title:
            "Do As I Can, Not As I Say: Grounding Language in Robotic Affordances",
          authors: "Ahn et al.",
          venue: "arXiv 2204.01691",
          year: 2022,
          url: "https://arxiv.org/abs/2204.01691",
        },
        {
          id: "zhao-aloha-2023",
          title:
            "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware",
          authors: "Zhao et al.",
          venue: "RSS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2304.13705",
        },
        {
          id: "mees-calvin-2022",
          title:
            "CALVIN: A Benchmark for Language-Conditioned Policy Learning for Long-Horizon Robot Manipulation Tasks",
          authors: "Mees et al.",
          venue: "RA-L 2022",
          year: 2022,
          url: "https://arxiv.org/abs/2112.03227",
        },
        {
          id: "nasiriany-robocasa-2024",
          title:
            "RoboCasa: Large-Scale Simulation of Everyday Tasks for Generalist Robots",
          authors: "Nasiriany et al.",
          venue: "arXiv 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2406.02523",
        },
      ],
    },
  ],
  faqs: [
    {
      question:
        "What kitchen tasks are most commonly needed for robot training?",
      answer:
        "The six most requested tasks in order: (1) pick-and-place of kitchen items (cups, plates, utensils), (2) opening and closing cabinets and drawers, (3) pouring liquids, (4) stirring and mixing, (5) cutting and chopping, (6) loading/unloading dishwasher. These six categories cover roughly 80% of kitchen robot use cases. Full meal preparation builds on these primitives and requires additional data for recipe sequencing and ingredient management.",
    },
    {
      question:
        "How many kitchen environments are needed for policy generalization?",
      answer:
        "A minimum of 5 distinct kitchen layouts is recommended for generalizable policies. RT-2 trained across 3 kitchens and achieved reasonable generalization to novel arrangements within those kitchens. For production deployment across diverse homes with different countertop heights, cabinet configurations, and appliance placements, 10-20 layouts significantly improve zero-shot transfer. Layout variation matters more than total demonstrations: 1,000 demos across 10 kitchens outperforms 5,000 demos in a single kitchen.",
    },
    {
      question:
        "Should kitchen data include failed demonstrations?",
      answer:
        "Yes. Kitchen tasks have complex, task-specific failure modes (spills, drops, burns, incorrect ingredient amounts, items breaking) that provide valuable training signal. A target success rate of 70-80% in collected data is ideal. Purely successful demonstrations create policies that are brittle when encountering the inevitable perturbations of real kitchens. Failed episodes should be annotated with failure type, failure timestamp, and severity (recoverable vs. terminal) for curriculum learning.",
    },
    {
      question:
        "What camera placement works best for kitchen data collection?",
      answer:
        "A three-camera minimum is recommended: overhead view covering the full countertop workspace (for spatial reasoning and object tracking), a front-facing eye-level camera for object identification and pouring-level views, and a wrist-mounted camera for close-up manipulation detail and contact detection. Commercial kitchens benefit from a fourth camera covering the stovetop area. All cameras should run at 30 Hz with hardware synchronization and be rigidly mounted to prevent view drift between sessions.",
    },
    {
      question:
        "Can simulated kitchen data replace real kitchen demonstrations?",
      answer:
        "Simulation (RoboCasa, LIBERO) is valuable for pretrained representations and policy architecture validation, but real kitchen demonstrations remain essential for two reasons: food manipulation physics (deformation, friction, granular behavior) are poorly approximated in simulation, and real kitchen variability (lighting, clutter, wear-and-tear on utensils) provides domain diversity that procedural generation struggles to match. The most effective approach uses 80-90% simulated data for pretraining and 10-20% real kitchen data for fine-tuning and domain adaptation.",
    },
  ],
  ctaHeading: "Get a Custom Quote for Kitchen Task Data",
  ctaDescription:
    "Tell us which kitchen tasks matter for your application and we will design a collection plan across our test kitchen facilities with real food ingredients.",
  relatedGlossaryTerms: [
    "vla",
    "behavioral-cloning",
    "imitation-learning",
    "action-segmentation",
    "long-horizon-planning",
  ],
  relatedGuidePages: [
    "how-to-collect-kitchen-activity-data",
    "how-to-build-a-manipulation-dataset",
  ],
  relatedSolutionSlugs: ["egocentric-video-data"],
  dataRequirements: {
    modality:
      "RGB multi-view (overhead + eye-level + wrist) + depth (optional) + proprioception + language instructions",
    volumeRange: "50-50K demonstrations across task families and kitchen layouts",
    temporalResolution:
      "30 Hz video (hardware-synced), 50 Hz proprioception, per-step and per-episode language annotations",
    keyAnnotations: [
      "Task phase segmentation (preparation, cooking, serving, cleanup)",
      "Object state changes (raw/cooked, whole/chopped, clean/dirty)",
      "Hierarchical language annotations (task, step, action level)",
      "Utensil and ingredient identification labels",
      "Success criteria with failure mode taxonomy",
      "Kitchen layout metadata for cross-environment training",
    ],
  },
  relevantModels: [
    "RT-2 (Google DeepMind)",
    "Diffusion Policy",
    "ACT / ALOHA",
    "SayCan",
    "OpenVLA",
    "TidyBot (compositional)",
  ],
  environmentTypes: [
    "Residential kitchen (standard layout)",
    "Commercial test kitchen",
    "Apartment kitchen (compact)",
    "Open-plan kitchen with island",
    "Kitchenette (minimal workspace)",
  ],
  keyPapers: [
    {
      id: "brohan-rt2-2023",
      title:
        "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
      authors: "Brohan et al.",
      venue: "arXiv 2307.15818",
      year: 2023,
      url: "https://arxiv.org/abs/2307.15818",
    },
    {
      id: "ahn-saycan-2022",
      title:
        "Do As I Can, Not As I Say: Grounding Language in Robotic Affordances",
      authors: "Ahn et al.",
      venue: "arXiv 2204.01691",
      year: 2022,
      url: "https://arxiv.org/abs/2204.01691",
    },
    {
      id: "zhao-aloha-2023",
      title:
        "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware",
      authors: "Zhao et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2304.13705",
    },
    {
      id: "mees-calvin-2022",
      title:
        "CALVIN: A Benchmark for Language-Conditioned Policy Learning for Long-Horizon Robot Manipulation Tasks",
      authors: "Mees et al.",
      venue: "RA-L 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2112.03227",
    },
    {
      id: "nasiriany-robocasa-2024",
      title:
        "RoboCasa: Large-Scale Simulation of Everyday Tasks for Generalist Robots",
      authors: "Nasiriany et al.",
      venue: "arXiv 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2406.02523",
    },
  ],
  claruRelevance:
    "Claru operates dedicated test kitchen facilities purpose-built for robotics data collection, equipped with permanent multi-view camera arrays (overhead + eye-level + wrist + stovetop), professional LED lighting at consistent 5000K color temperature, and standardized ingredient procurement protocols. Our kitchen task catalog spans 18 manipulation tasks across 4 activity categories (preparation, cooking, serving, cleanup), each demonstrated across 3-5 kitchen layout variations with real food ingredients. We deliver datasets with hierarchical language annotations at task, step, and action granularity, temporal phase segmentation, object state change labels, and success criteria annotations. Standard output formats include RLDS for Open X-Embodiment compatibility, HDF5, and custom schemas. Collection throughput reaches 100-300 quality demonstrations per facility per day. For clients building language-conditioned kitchen policies (RT-2, SayCan, OpenVLA), our paired instruction-demonstration data with multi-granularity language labels provides the exact training format these architectures require.",
};

export default data;
