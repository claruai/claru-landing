import type { BenchmarkPageData } from "./types";

const page: BenchmarkPageData = {
  slug: "calvin",
  benchmarkName: "CALVIN",
  benchmarkDescription:
    "CALVIN (Composing Actions from Language and Vision) is a benchmark for evaluating language-conditioned multi-step manipulation. Created by Oier Mees et al. at the University of Freiburg in 2022, it tests whether robots can chain together long sequences of manipulation actions guided by natural language instructions in a simulated tabletop environment built on PyBullet.",
  taskSet:
    "34 unique manipulation tasks chainable into sequences of 1 to 5 steps. Tasks include sliding blocks, pushing buttons, rotating levers, lifting objects, stacking, toggling switches, opening and closing drawers, and LED color interactions. The benchmark evaluates how many sequential tasks a policy can complete without failure or environment reset.",
  observationSpace:
    "RGB images from a static third-person camera (200x200) and a wrist-mounted gripper camera (84x84), proprioceptive state comprising 7 joint angles plus gripper width, and natural language task descriptions. A structured scene observation is also available with 3D positions of all interactive objects.",
  actionSpace:
    "7-DOF relative end-effector actions: 3D position delta, 3D orientation delta (Euler angles), and binary gripper open/close. Actions are executed at 30 Hz control frequency on a simulated Franka Panda arm.",
  evaluationProtocol:
    "Average length of successfully completed task chains across 1,000 evaluation sequences. Each sequence requests up to 5 tasks in order; the policy scores higher by completing longer unbroken chains. Environments are split into 4 training scenes (A-D) with different object configurations, and a held-out evaluation scene (D) to test generalization. The primary metric is the average number of tasks completed in a row (1-5 scale).",
  simToRealGap:
    "CALVIN's PyBullet simulation uses simplified contact models where objects snap into stable configurations. Real-world sequential manipulation requires recovering from compounding errors across steps — a small positioning error in step 1 cascades through steps 2-5. CALVIN also uses uniform lighting and simple textures, lacking the visual complexity of real kitchens and workspaces. The reset-free evaluation partially captures real chaining dynamics but misses actuator drift, object state estimation errors, and the physical fatigue effects of extended manipulation sequences.",
  realWorldDataNeeds:
    "Long-horizon manipulation recordings with natural language annotations, showing multi-step task completion in real environments. Critical needs include demonstrations where errors compound and recovery is demonstrated, authentic visual complexity with clutter and varying lighting, diverse language instructions for the same task sequences, and demonstrations across multiple environment layouts to match CALVIN's multi-scene evaluation protocol.",
  complementaryDatasets: [
    {
      name: "Egocentric Activity Dataset",
      rationale:
        "Human activity video shows long-horizon task completion with natural recovery from errors — the real-world analog of CALVIN's chained task evaluation. Captured across 100+ locations with naturally varying visual conditions.",
    },
    {
      name: "Manipulation Trajectory Dataset",
      rationale:
        "Real-world manipulation with temporal annotations provides authentic multi-step task data for training policies that handle compounding errors across sequential manipulation.",
    },
    {
      name: "Custom Language-Paired Collection",
      rationale:
        "Purpose-collected demonstrations with concurrent natural language narration provide the language-action grounding that CALVIN's evaluation protocol specifically measures.",
    },
  ],
  keyPapers: [
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
      id: "mees-hulc-2022",
      title:
        "What Matters in Language Conditioned Robotic Imitation Learning over Unstructured Data",
      authors: "Mees et al.",
      venue: "RA-L 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2204.06252",
    },
    {
      id: "shi-susie-2024",
      title:
        "SUSIE: Subgoal Synthesis via Image Editing for Language-Conditioned Control",
      authors: "Shi et al.",
      venue: "CoRL 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2304.01580",
    },
    {
      id: "mees-grif-2023",
      title:
        "Grounding Language with Visual Affordances over Unstructured Data",
      authors: "Mees et al.",
      venue: "ICRA 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2210.01911",
    },
    {
      id: "ha-scaling-2023",
      title: "Scaling Up and Distilling Down: Language-Guided Robot Skill Acquisition",
      authors: "Ha et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2307.14535",
    },
  ],
  technicalAnalysis:
    "CALVIN addresses a critical limitation of single-task benchmarks: real robots must chain tasks together, and errors from one task affect the next. A policy that can open a drawer with 90% success and place an object with 85% success has only ~76% success at the two-step chain, and ~51% at a five-step chain. This compounding error problem makes long-horizon manipulation fundamentally harder than single tasks.\n\nThe sim-to-real challenge for CALVIN is compounded by this sequential structure. Real-world object states change unpredictably after each manipulation step — objects shift, rotate, or partially fall. The robot must perceive these state changes accurately and adapt subsequent actions. In CALVIN's simulation, object states are precisely known; in reality, state estimation errors add another source of compounding failure.\n\nCALVIN's multi-environment design (scenes A through D) is intended to test visual generalization. However, the visual variation between simulated scenes is minimal compared to the gap between any simulated scene and a real-world kitchen. Models that generalize across CALVIN scenes may still fail catastrophically when confronted with real textures, reflections, and lighting.\n\nThe language conditioning component adds further complexity. The instruction 'put the red block in the drawer' has many valid execution strategies depending on drawer state, block position, and surrounding clutter. In simulation, language-to-action grounding benefits from simplified perception. In reality, the language grounding must handle ambiguity, partial occlusion, and objects unseen during training.\n\nReal-world language-conditioned manipulation data addresses these gaps directly. Human demonstrations of multi-step kitchen tasks, for example, naturally include the kind of error recovery and adaptation that CALVIN evaluates. A human making a sandwich handles bread that tears, ingredients that shift, and tools that slip — exactly the robustness that CALVIN's sequential evaluation demands. Claru's egocentric activity dataset captures these interactions authentically across diverse environments.",
  metaTitle:
    "Real-World Data for CALVIN Language Manipulation Benchmark | Claru",
  metaDescription:
    "Bridge the sim-to-real gap for CALVIN's language-conditioned multi-step manipulation benchmark with real-world sequential task data and language-paired demonstrations.",
  primaryKeyword: "CALVIN benchmark real-world data",
  secondaryKeywords: [
    "CALVIN sim-to-real",
    "language-conditioned manipulation data",
    "multi-step manipulation data",
    "long-horizon robot data",
    "CALVIN benchmark transfer",
  ],
  canonicalPath: "/benchmarks/calvin",
  h1: "Real-World Data for CALVIN",
  heroSubtitle:
    "CALVIN evaluates language-conditioned multi-step manipulation in simulation. Real-world data addresses the compounding error problem that PyBullet physics and simplified visuals cannot replicate.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Benchmarks", href: "/benchmarks" },
    { label: "CALVIN", href: "/benchmarks/calvin" },
  ],
  sections: [
    {
      type: "stats",
      heading: "CALVIN at a Glance",
      stats: [
        { value: "34", label: "Unique Tasks" },
        { value: "5", label: "Max Chain Length" },
        { value: "7-DOF", label: "Action Space" },
        { value: "4", label: "Training Scenes" },
        { value: "30 Hz", label: "Control Frequency" },
        { value: "2022", label: "Released" },
      ],
    },
    {
      type: "prose",
      heading: "What Is CALVIN?",
      paragraphs: [
        "CALVIN — Composing Actions from Language and Vision — is a benchmark developed at the University of Freiburg to evaluate whether robot policies can execute long sequences of manipulation tasks guided by natural language. Unlike benchmarks that test one task at a time, CALVIN requires policies to chain up to five tasks without resetting, exposing the compounding error problem that plagues real-world deployment.",
        "The benchmark provides a simulated tabletop environment with a Franka Panda arm, a sliding door, a drawer, an LED button, and several colored blocks. Language instructions like 'push the red block left' or 'turn on the LED' direct the policy through task sequences. The environment is divided into four visually distinct scenes (A through D) for training and a held-out scene for evaluation, testing both sequential execution and visual generalization.",
        "CALVIN has become a standard evaluation target for language-conditioned imitation learning methods including HULC, HULC++, GRIF, and SUSIE. Its focus on compositionality — combining simple actions into complex sequences — reflects the reality that useful robots must handle multi-step instructions, not just isolated pick-and-place commands.",
        "The benchmark provides a large-scale dataset of teleoperated demonstrations (over 24 hours of play data across scenes) with paired language annotations, establishing a data-centric evaluation paradigm where both policy architecture and training data quality determine performance.",
      ],
    },
    {
      type: "comparison-table",
      heading: "CALVIN Task Suite Overview",
      description:
        "CALVIN's 34 tasks span drawer manipulation, block sliding, stacking, button pressing, and LED control. Tasks are grouped by interaction type and can be chained in arbitrary order.",
      columns: ["Task Category", "Example Tasks", "Observation Modality", "Difficulty"],
      rows: [
        {
          "Task Category": "Drawer Manipulation",
          "Example Tasks": "Open drawer, close drawer",
          "Observation Modality": "RGB + proprioception",
          Difficulty: "Medium",
        },
        {
          "Task Category": "Block Sliding",
          "Example Tasks": "Push block left/right, slide block to target",
          "Observation Modality": "RGB + proprioception",
          Difficulty: "Easy",
        },
        {
          "Task Category": "Block Stacking",
          "Example Tasks": "Stack block, unstack block",
          "Observation Modality": "RGB + proprioception",
          Difficulty: "Hard",
        },
        {
          "Task Category": "Lifting & Placing",
          "Example Tasks": "Lift colored block, place on slider",
          "Observation Modality": "RGB + proprioception",
          Difficulty: "Medium",
        },
        {
          "Task Category": "Switch & LED",
          "Example Tasks": "Toggle switch, turn on/off LED, change LED color",
          "Observation Modality": "RGB + proprioception",
          Difficulty: "Easy",
        },
        {
          "Task Category": "Lever Rotation",
          "Example Tasks": "Rotate lever left/right",
          "Observation Modality": "RGB + proprioception",
          Difficulty: "Medium",
        },
      ],
    },
    {
      type: "prose",
      heading: "Evaluation Protocol",
      paragraphs: [
        "CALVIN's evaluation protocol is uniquely challenging because it measures sequential task completion rather than isolated success rates. The primary metric is the average number of tasks completed in a row across 1,000 evaluation sequences, where each sequence requests up to 5 tasks. A policy that completes tasks 1 and 2 but fails on task 3 scores 2 for that sequence.",
        "This sequential evaluation exposes compounding errors. If a policy has 85% success on individual tasks, its expected chain completion rate drops to ~72% for 2 tasks, ~44% for 4 tasks, and ~37% for all 5. Small improvements in per-task reliability yield large improvements in chain metrics, making the benchmark highly sensitive to policy robustness.",
        "The benchmark also tests generalization through its multi-environment design. Policies train on scenes A-C (or A-D) with different table colors, object positions, and backgrounds, then evaluate on a held-out scene. The HULC baseline achieves an average chain length of ~2.8 on seen environments but drops to ~1.7 on unseen scenes, quantifying the visual generalization gap.",
        "Importantly, CALVIN does not reset the environment between tasks in a chain. Objects moved during task 1 remain displaced for task 2. This reset-free design forces policies to handle the messy intermediate states that real-world deployment requires.",
      ],
    },
    {
      type: "comparison-table",
      heading: "CALVIN vs. Related Benchmarks",
      description:
        "How CALVIN compares to other language-conditioned and multi-step manipulation benchmarks on key dimensions.",
      columns: ["Feature", "CALVIN", "LIBERO", "Language-Table", "RLBench"],
      rows: [
        {
          Feature: "Language conditioning",
          CALVIN: "Free-form natural language",
          LIBERO: "Templated language goals",
          "Language-Table": "Simple verb-noun instructions",
          RLBench: "Task name only",
        },
        {
          Feature: "Sequential evaluation",
          CALVIN: "1-5 task chains",
          LIBERO: "10-step suites (reset between)",
          "Language-Table": "Single task",
          RLBench: "Single task",
        },
        {
          Feature: "Environment reset",
          CALVIN: "No reset between chain tasks",
          LIBERO: "Reset between suite tasks",
          "Language-Table": "Reset per episode",
          RLBench: "Reset per episode",
        },
        {
          Feature: "Number of tasks",
          CALVIN: "34",
          LIBERO: "130",
          "Language-Table": "~10 verbs",
          RLBench: "100",
        },
        {
          Feature: "Simulation engine",
          CALVIN: "PyBullet",
          LIBERO: "MuJoCo (robosuite)",
          "Language-Table": "PyBullet",
          RLBench: "CoppeliaSim",
        },
      ],
    },
    {
      type: "prose",
      heading: "Bridging Simulation to Reality",
      paragraphs: [
        "Transferring CALVIN-trained policies to real robots faces three compounding challenges. First, PyBullet's contact physics simplifies object interactions — blocks snap into place, drawers glide without friction variation, and grasps either succeed perfectly or fail completely. Real objects slide, wobble, and resist differently depending on surface conditions and grip quality.",
        "Second, CALVIN's visual rendering is far simpler than real-world scenes. Uniform lighting, solid-color objects, and clean backgrounds mean the visual encoder can learn shortcuts that break in cluttered, variably-lit real environments. A policy trained on CALVIN's crisp red blocks may fail to identify a scuffed, partially occluded block under fluorescent lighting.",
        "Third, the language grounding gap is substantial. CALVIN's language annotations are paired with specific simulator states where object identities and positions are fully known. In the real world, grounding 'the red block next to the drawer' requires resolving spatial references, handling occlusion, and disambiguating among similar objects — capabilities CALVIN does not stress-test.",
        "Real-world data that shows long-horizon task execution with natural language narration addresses all three gaps simultaneously. Human demonstrations of multi-step manipulation tasks capture authentic contact dynamics, realistic visual complexity, and natural language usage in context. When a human narrates 'now I'm putting this in the drawer' while actually performing the action, the resulting data provides grounded language-action pairs that no simulation can generate.",
      ],
    },
    {
      type: "prose",
      heading: "How Claru Supports CALVIN Users",
      paragraphs: [
        "Claru provides the real-world data that bridges CALVIN's simulation-to-reality gap. Our egocentric activity dataset captures humans completing multi-step household tasks with natural language descriptions across 100+ real-world locations — providing precisely the long-horizon, visually diverse, language-grounded demonstrations that CALVIN-trained policies need for transfer.",
        "For teams fine-tuning CALVIN policies on real hardware, Claru coordinates custom data collection with concurrent language narration. We can match CALVIN's task categories — drawer manipulation, block stacking, button pressing — on real-world equivalents, providing the domain-specific demonstrations that accelerate sim-to-real adaptation.",
        "Our temporal annotation pipeline tags manipulation sequences with step boundaries and sub-goal labels, enabling researchers to train hierarchical policies that decompose long-horizon CALVIN-style tasks into recoverable sub-steps — the architectural pattern that current CALVIN leaderboard methods increasingly rely on.",
      ],
    },
    {
      type: "citation-list",
      heading: "Key References",
      citations: [
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
          id: "mees-hulc-2022",
          title:
            "What Matters in Language Conditioned Robotic Imitation Learning over Unstructured Data",
          authors: "Mees et al.",
          venue: "RA-L 2022",
          year: 2022,
          url: "https://arxiv.org/abs/2204.06252",
        },
        {
          id: "shi-susie-2024",
          title:
            "SUSIE: Subgoal Synthesis via Image Editing for Language-Conditioned Control",
          authors: "Shi et al.",
          venue: "CoRL 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2304.01580",
        },
        {
          id: "mees-grif-2023",
          title:
            "Grounding Language with Visual Affordances over Unstructured Data",
          authors: "Mees et al.",
          venue: "ICRA 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2210.01911",
        },
        {
          id: "ha-scaling-2023",
          title:
            "Scaling Up and Distilling Down: Language-Guided Robot Skill Acquisition",
          authors: "Ha et al.",
          venue: "CoRL 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2307.14535",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "What is the compounding error problem in CALVIN?",
      answer:
        "When tasks are chained sequentially without environment reset, each task's success rate multiplies. A 90% single-task rate becomes ~59% over 5 sequential tasks. Real-world conditions worsen this because object states change unpredictably after each step — a block shifted during step 1 is no longer where the policy expects it for step 3. This compounding dynamic is CALVIN's core evaluation insight and the primary reason high simulation scores do not predict deployment reliability.",
    },
    {
      question: "Why does language conditioning make sim-to-real harder for CALVIN?",
      answer:
        "Language adds ambiguity that simulation sidesteps. The instruction 'put the red block in the drawer' has many valid execution strategies depending on drawer state, block orientation, and surrounding objects. In CALVIN's simulation, object identities and positions are perfectly known. In the real world, language grounding must handle visual ambiguity, partial occlusion, objects not seen during training, and spatial references that depend on viewpoint.",
    },
    {
      question: "How does real-world sequential task data improve CALVIN-trained policies?",
      answer:
        "Real-world multi-step demonstrations show natural error recovery — adjusting grip when objects shift, re-approaching when initial grasps fail, adapting plans when task preconditions change. This recovery behavior is absent from simulation demonstrations where grasps either succeed or the episode ends. Training on real recoveries produces more robust sequential policies that maintain longer CALVIN-style task chains on physical hardware.",
    },
    {
      question: "What is the difference between CALVIN's training scenes A-D?",
      answer:
        "CALVIN provides four distinct scenes with different table textures, object placements, and background colors. Scenes A through C (or A through D depending on the evaluation protocol) are used for training, while the held-out scene tests visual generalization. The visual variation between scenes is controlled — same objects, different arrangements — making the sim-to-real gap much larger than the inter-scene gap.",
    },
    {
      question: "How many demonstrations does CALVIN provide for training?",
      answer:
        "CALVIN provides over 24 hours of teleoperated play data collected across its four scenes, consisting of approximately 350,000 transition frames with paired language annotations. This data includes both task-directed demonstrations and exploratory play, enabling research on learning from unstructured interaction data — a pattern increasingly relevant for real-world robot learning.",
    },
  ],
  ctaHeading: "Get Multi-Step Manipulation Data",
  ctaDescription:
    "Discuss language-paired, sequential manipulation data that parallels CALVIN's evaluation framework for sim-to-real transfer.",
  relatedGlossaryTerms: [
    "language-conditioned-policy",
    "behavioral-cloning",
    "action-chunking",
    "manipulation-trajectory",
    "sim-to-real-gap",
  ],
  relatedGuidePages: [
    "how-to-build-a-language-conditioned-dataset",
    "how-to-annotate-manipulation-trajectories",
  ],
  relatedSolutionSlugs: [],
};
export default page;
