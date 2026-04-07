import type { BenchmarkPageData } from "./types";
const page: BenchmarkPageData = {
  "slug": "metaworld",
  "benchmarkName": "Meta-World",
  "benchmarkDescription": "Meta-World is a multi-task benchmark for meta-reinforcement learning and multi-task learning, providing 50 manipulation tasks with a simulated Sawyer robot arm. Created by researchers at UC Berkeley, it evaluates whether RL agents can learn shared representations across diverse manipulation skills.",
  "taskSet": "50 parametrically varied manipulation tasks including reach, push, pick-place, open door, close door, open drawer, button press, peg insert, hammer, and assembly. Tasks are grouped into ML1 (single-task), ML10 (10 meta-train tasks), ML45 (45 meta-train tasks), and MT50 (all 50 multi-task).",
  "observationSpace": "Low-dimensional state: end-effector position, gripper opening, object positions, and goal positions. Optional image observations from fixed camera.",
  "actionSpace": "4-DOF: 3D end-effector velocity + gripper torque.",
  "evaluationProtocol": "Average success rate across held-out tasks (for meta-learning) or all tasks (for multi-task learning). ML45 evaluates generalization to 5 unseen tasks after meta-training on 45.",
  "simToRealGap": "Meta-World uses MuJoCo with low-dimensional state observations that have no visual component in default configuration. Policies trained on perfect state information cannot directly transfer because real robots must estimate state from noisy sensors. The simplified Sawyer model ignores real arm dynamics. Task parametrization creates artificial task diversity that does not match the continuous variation of real manipulation.",
  "realWorldDataNeeds": "Real-world demonstrations of Meta-World task categories on physical hardware with full visual observations. Multi-task data showing how humans and robots adapt skills across different objects and configurations. Transfer learning validation data comparing simulated policy performance to real-world execution.",
  "complementaryDatasets": [
    {
      "name": "Manipulation Trajectory Dataset",
      "rationale": "Real-world recordings of diverse manipulation tasks provide the visual observations and contact dynamics missing from Meta-World's state-based evaluation."
    },
    {
      "name": "Egocentric Activity Dataset",
      "rationale": "Human demonstrations of daily manipulation tasks provide natural multi-task data showing how skills transfer and adapt across contexts."
    },
    {
      "name": "Custom Multi-Task Collection",
      "rationale": "Purpose-collected demonstrations across Meta-World task categories on real hardware provide direct sim-to-real validation data."
    }
  ],
  "keyPapers": [
    {
      "id": "yu-metaworld-2020",
      "title": "Meta-World: A Benchmark and Evaluation for Multi-Task and Meta Reinforcement Learning",
      "authors": "Yu et al.",
      "venue": "CoRL 2020",
      "year": 2020,
      "url": "https://arxiv.org/abs/1910.10897"
    },
    {
      "id": "kalashnikov-qt-opt-2018",
      "title": "QT-Opt: Scalable Deep Reinforcement Learning for Vision-Based Robotic Manipulation",
      "authors": "Kalashnikov et al.",
      "venue": "CoRL 2018",
      "year": 2018,
      "url": "https://arxiv.org/abs/1806.10293"
    },
    {
      "id": "xu-mtopt-2023",
      "title": "Multi-Task Reinforcement Learning with Soft Modularization",
      "authors": "Xu et al.",
      "venue": "NeurIPS 2023",
      "year": 2023,
      "url": "https://arxiv.org/abs/2003.13661"
    }
  ],
  "technicalAnalysis": `Meta-World serves an important role in multi-task RL research by providing a standardized set of manipulation tasks for evaluating task generalization. However, its reliance on low-dimensional state observations means that policies trained on Meta-World learn skill coordination but not visual perception.

The 50-task suite creates useful diversity for studying multi-task learning, but the tasks share the same robot, similar workspace geometry, and parametrically varied objects. Real multi-task manipulation involves dramatically different visual scenes, object categories, and workspace configurations. A policy that masters Meta-World's 50 tasks may still fail at the 51st if it requires different visual processing.

The meta-learning evaluation (ML45 train, 5 test) measures whether policies can adapt to new tasks with few demonstrations. Real-world few-shot adaptation requires visual generalization that state-based training does not provide. Bridging this gap requires real-world multi-task data with rich visual observations.

Claru's manipulation and egocentric datasets provide this real-world multi-task signal — diverse manipulation tasks across varied environments with full visual observations, showing how skills adapt across contexts.`,
  "metaTitle": "Real-World Data for Meta-World Multi-Task Benchmark | Claru",
  "metaDescription": "Multi-task manipulation data with visual observations to bridge Meta-World's state-based benchmark to real-world robot skill transfer.",
  "primaryKeyword": "Meta-World real-world data",
  "secondaryKeywords": [
    "Meta-World sim-to-real",
    "multi-task manipulation data",
    "meta-RL robot data",
    "Meta-World benchmark data"
  ],
  "canonicalPath": "/benchmarks/metaworld",
  "h1": "Real-World Data for Meta-World",
  "heroSubtitle": "Meta-World evaluates multi-task RL with perfect state information. Real-world data adds the visual complexity that actual robots face.",
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
      "label": "Meta-World",
      "href": "/benchmarks/metaworld"
    }
  ],
  "sections": [
    {
      "type": "stats",
      "heading": "Meta-World at a Glance",
      "stats": [
        { "value": "50", "label": "Tasks" },
        { "value": "ML45/MT50", "label": "Evaluation Splits" },
        { "value": "4-DOF", "label": "Action Space" },
        { "value": "Sawyer", "label": "Robot" },
        { "value": "MuJoCo", "label": "Physics Engine" },
        { "value": "2020", "label": "Released" }
      ]
    },
    {
      "type": "prose",
      "heading": "What Is Meta-World?",
      "paragraphs": [
        "Meta-World is a benchmark designed by Yu et al. at UC Berkeley to study multi-task and meta-reinforcement learning for manipulation. It provides 50 parametrically varied manipulation tasks with a simulated Sawyer robot arm in MuJoCo, establishing standardized evaluation splits that test whether RL agents can learn shared representations across diverse manipulation skills.",
        "The benchmark defines three evaluation protocols: ML1 (single-task learning), ML10/ML45 (meta-learning with 10 or 45 training tasks and held-out test tasks), and MT50 (multi-task learning across all 50 tasks simultaneously). This structured evaluation separates single-task mastery from cross-task transfer and few-shot adaptation.",
        "Meta-World uses low-dimensional state observations by default — exact object positions, end-effector coordinates, and goal locations — to isolate the multi-task learning problem from visual perception. This makes it a clean testbed for studying task transfer but creates a significant gap when deploying learned policies on real hardware where state must be estimated from cameras."
      ]
    },
    {
      "type": "comparison-table",
      "heading": "Meta-World Task Categories",
      "description": "Meta-World's 50 tasks span basic manipulation primitives and multi-step interactions, each with parametric variation.",
      "columns": ["Category", "Example Tasks", "Task Count", "State Dimensions"],
      "rows": [
        { "Category": "Reaching & Pushing", "Example Tasks": "Reach, push, push-wall", "Task Count": "~8", "State Dimensions": "End-effector + object + goal" },
        { "Category": "Pick & Place", "Example Tasks": "Pick-place, pick-out-of-hole", "Task Count": "~6", "State Dimensions": "End-effector + object + goal" },
        { "Category": "Door & Drawer", "Example Tasks": "Open door, close door, open drawer", "Task Count": "~6", "State Dimensions": "End-effector + handle + joint angle" },
        { "Category": "Button & Switch", "Example Tasks": "Button-press, button-press-wall", "Task Count": "~6", "State Dimensions": "End-effector + button state" },
        { "Category": "Assembly & Insertion", "Example Tasks": "Peg-insert, hammer, assembly", "Task Count": "~8", "State Dimensions": "End-effector + peg/tool + target" },
        { "Category": "Tool Use", "Example Tasks": "Hammer, sweep, coffee-push", "Task Count": "~8", "State Dimensions": "End-effector + tool + object" },
        { "Category": "Other", "Example Tasks": "Shelf-place, soccer, hand-insert", "Task Count": "~8", "State Dimensions": "Varies by task" }
      ]
    },
    {
      "type": "prose",
      "heading": "Evaluation Protocol",
      "paragraphs": [
        "Meta-World defines three evaluation levels. ML1 tests single-task RL: can a policy master one task with parametric variations? ML10 and ML45 test meta-learning: the agent meta-trains on 10 or 45 tasks and must adapt to held-out tasks with only a few demonstrations. MT50 tests multi-task learning: a single policy must perform all 50 tasks simultaneously.",
        "The meta-learning evaluation (ML45) is particularly demanding. The agent trains on 45 tasks, then receives 5 demonstrations of each held-out test task and must achieve high success rates. This tests whether manipulation knowledge transfers — whether learning to open doors helps the agent quickly learn to open drawers.",
        "Success rate is averaged across all evaluation tasks with 50 episodes per task. For multi-task (MT50), the benchmark reports both average success and per-task success, revealing whether a single policy achieves broad competence or specializes in a subset of tasks at the expense of others."
      ]
    },
    {
      "type": "comparison-table",
      "heading": "Meta-World vs. Related Multi-Task Benchmarks",
      "columns": ["Feature", "Meta-World", "LIBERO", "RLBench", "robosuite"],
      "rows": [
        { "Feature": "Primary evaluation", "Meta-World": "Multi-task / meta-RL", "LIBERO": "Continual learning", "RLBench": "Multi-task imitation", "robosuite": "Single-task benchmarking" },
        { "Feature": "Default observation", "Meta-World": "Low-dimensional state", "LIBERO": "RGB images", "RLBench": "Multi-view RGB-D", "robosuite": "Configurable" },
        { "Feature": "Task count", "Meta-World": "50", "LIBERO": "130", "RLBench": "100", "robosuite": "8" },
        { "Feature": "Meta-learning split", "Meta-World": "ML10/ML45 (train/test)", "LIBERO": "Sequential suites", "RLBench": "None (all tasks)", "robosuite": "None" },
        { "Feature": "Physics engine", "Meta-World": "MuJoCo", "LIBERO": "MuJoCo", "RLBench": "CoppeliaSim", "robosuite": "MuJoCo" }
      ]
    },
    {
      "type": "prose",
      "heading": "Bridging State-Based Training to Visual Real-World Deployment",
      "paragraphs": [
        "Meta-World's reliance on low-dimensional state observations creates a fundamental transfer challenge. Policies trained on perfect state (exact 3D positions of every object) cannot directly deploy on real robots that must estimate state from RGB cameras or depth sensors. The perception gap is not just visual — it changes what the policy can rely on for decision-making.",
        "A Meta-World policy that learns 'move to the object's x,y,z position' must be replaced with a policy that learns 'move toward the object visible in the image,' which requires visual grounding, depth estimation, and handling of occlusion. This is not a simple domain adaptation — it requires fundamentally different sensory processing.",
        "Real-world multi-task data bridges this gap by providing manipulation demonstrations with full visual observations across diverse tasks and environments. Instead of perfect state vectors, the training signal includes the noisy, occluded, variably-lit visual observations that real deployment requires.",
        "Claru's manipulation and egocentric datasets provide real-world multi-task signals — diverse manipulation tasks across varied environments with rich visual observations, showing how skills adapt across contexts with authentic visual complexity."
      ]
    },
    {
      "type": "prose",
      "heading": "How Claru Supports Meta-World Users",
      "paragraphs": [
        "Claru provides the visually rich, multi-task manipulation data that Meta-World's state-based training cannot generate. For teams developing multi-task or meta-learning algorithms on Meta-World, our datasets offer the real-world validation layer: do the transfer properties observed with perfect state hold when visual perception is in the loop?",
        "Our egocentric activity dataset captures humans performing diverse manipulation tasks across 100+ environments — natural multi-task data showing how manipulation skills transfer and adapt. This visual multi-task data can train the perception backbone that Meta-World-developed control strategies need for deployment.",
        "For teams extending Meta-World evaluations to real Sawyer robots, Claru can coordinate task-matched data collection on physical hardware, providing the real-world demonstrations needed for fine-tuning and sim-to-real validation."
      ]
    },
    {
      "type": "citation-list",
      "heading": "Key References",
      "citations": [
        { "id": "yu-metaworld-2020", "title": "Meta-World: A Benchmark and Evaluation for Multi-Task and Meta Reinforcement Learning", "authors": "Yu et al.", "venue": "CoRL 2020", "year": 2020, "url": "https://arxiv.org/abs/1910.10897" },
        { "id": "kalashnikov-qt-opt-2018", "title": "QT-Opt: Scalable Deep Reinforcement Learning for Vision-Based Robotic Manipulation", "authors": "Kalashnikov et al.", "venue": "CoRL 2018", "year": 2018, "url": "https://arxiv.org/abs/1806.10293" },
        { "id": "xu-mtopt-2023", "title": "Multi-Task Reinforcement Learning with Soft Modularization", "authors": "Xu et al.", "venue": "NeurIPS 2023", "year": 2023, "url": "https://arxiv.org/abs/2003.13661" }
      ]
    }
  ],
  "faqs": [
    {
      "question": "Why does Meta-World use state observations instead of images?",
      "answer": "Meta-World was designed to isolate the multi-task learning problem from visual perception. State observations let researchers study task transfer without confounding visual complexity. However, real robots must perceive state from cameras, making the transition to visual observations a critical research gap."
    },
    {
      "question": "Can Meta-World-trained policies work on real Sawyer robots?",
      "answer": "Not directly. Meta-World policies receive perfect state (exact object positions) while real Sawyers must estimate state from camera images. The MuJoCo Sawyer model also ignores real joint dynamics. Fine-tuning with real-world visual data is needed for transfer."
    },
    {
      "question": "How does real multi-task data differ from Meta-World tasks?",
      "answer": "Real multi-task manipulation involves dramatically different visual scenes, object categories, and workspaces. Meta-World tasks share the same robot, similar geometry, and parametrically varied objects. Real-world multi-task data provides the visual and physical diversity needed for policies that generalize broadly."
    },
    {
      "question": "What is the ML45 meta-learning evaluation?",
      "answer": "ML45 meta-trains an agent on 45 of Meta-World's 50 tasks, then tests few-shot adaptation to 5 held-out tasks. The agent receives only a handful of demonstrations of each new task and must achieve high success rates. This evaluates whether manipulation knowledge transfers — whether skills learned on training tasks accelerate learning of novel tasks."
    },
    {
      "question": "Why is Meta-World still relevant despite newer benchmarks?",
      "answer": "Meta-World remains the standard benchmark for multi-task RL and meta-learning research because its clean state-based evaluation isolates the task transfer problem from visual perception. Newer benchmarks add visual complexity but confound task transfer with visual generalization. Meta-World's simplicity makes it valuable for studying the fundamental structure of multi-task manipulation learning."
    }
  ],
  "ctaHeading": "Get Real Multi-Task Manipulation Data",
  "ctaDescription": "Discuss diverse, visually rich manipulation data for validating multi-task robot learning.",
  "relatedGlossaryTerms": [
    "transfer-learning-robotics",
    "manipulation-trajectory",
    "behavioral-cloning"
  ],
  "relatedGuidePages": [
    "how-to-build-a-manipulation-dataset",
    "how-to-evaluate-training-data-quality"
  ],
  "relatedSolutionSlugs": []
};
export default page;
