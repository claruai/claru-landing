import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "task-and-motion-planning",
  termSlug: "task-and-motion-planning",
  category: "robotics-fundamentals",
  metaTitle: "Task and Motion Planning (TAMP) — Definition & Training Data | Claru",
  metaDescription: "Task and motion planning (TAMP) integrates symbolic task planning with geometric motion planning to solve long-horizon robot manipulation. Learn TAMP methods, data needs, and key papers.",
  primaryKeyword: "task and motion planning",
  secondaryKeywords: ["TAMP robotics", "combined planning", "symbolic and geometric planning", "integrated task motion planning", "long-horizon manipulation", "hierarchical robot planning"],
  canonicalPath: "/glossary/task-and-motion-planning",
  h1: "Task and Motion Planning (TAMP): Definition, Applications, and Training Data Requirements",
  heroSubtitle: "Task and motion planning (TAMP) integrates symbolic reasoning about what actions to take with geometric reasoning about how to execute those actions physically. A TAMP system simultaneously decides the sequence of high-level actions (pick, place, open, pour) and computes collision-free robot motions for each action. This page covers TAMP algorithms, the role of training data, integration with learned models, and applications in manipulation.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Task and Motion Planning (TAMP)", href: "/glossary/task-and-motion-planning" },
  ],
  sections: [],
  faqs: [
    {
      question: "What is task and motion planning (TAMP)?",
      answer: "Task and motion planning is a framework for robot decision-making that jointly solves two intertwined problems: task planning (deciding the sequence of symbolic actions to achieve a goal) and motion planning (computing collision-free robot trajectories for each action). Classical task planning operates over symbolic state spaces — objects have discrete predicates like 'on(cup, table)' or 'in_hand(robot, cup)' — and uses search algorithms like STRIPS or PDDL planners to find action sequences. Classical motion planning operates over continuous configuration spaces and uses algorithms like RRT or PRM to find collision-free paths. TAMP integrates both because the feasibility of a symbolic plan depends on geometric constraints: 'place cup on shelf' is only feasible if there is a collision-free path to the shelf and enough clearance for the cup. Systems like PDDLStream (Garrett et al., 2020) and Logic-Geometric Programming (Toussaint, 2015) provide principled frameworks for this integration.",
    },
    {
      question: "Why does TAMP need training data if it is based on classical planning?",
      answer: "Classical TAMP systems do not need training data — they rely on hand-specified symbolic domains, geometric models, and search algorithms. However, pure classical TAMP has critical limitations: it requires complete symbolic models of the world (every object, every possible action, every precondition), accurate geometric models (exact 3D meshes and poses), and computational budgets that grow exponentially with task complexity. Modern approaches use training data in three ways. First, learned perception: neural networks trained on annotated data estimate object poses, classify object types, and predict physical properties that the planner needs. Second, learned feasibility predictors: models trained on planning outcomes predict which symbolic actions are geometrically feasible, pruning the search space dramatically. Third, learned skill primitives: neural policies trained on demonstrations execute individual actions (grasping, pouring) more robustly than analytical controllers. The training data needs are diverse: annotated scenes for perception, planning traces for feasibility prediction, and demonstrations for skill learning.",
    },
    {
      question: "How do foundation models and LLMs integrate with TAMP?",
      answer: "Large language models serve as high-level task planners in modern TAMP systems, replacing hand-crafted PDDL domain specifications with natural language task descriptions. SayCan (Ahn et al., 2022) pioneered this approach: an LLM proposes high-level action steps ('pick up the sponge, move to the counter, wipe the counter'), and a learned affordance model scores each proposal based on what the robot can physically execute. The LLM provides common-sense knowledge about task decomposition that would be tedious to encode in PDDL, while the affordance model grounds these proposals in physical feasibility. Subsequent work like Inner Monologue, Code as Policies, and VoxPoser extended this paradigm with feedback loops (the robot reports execution outcomes to the LLM for replanning), code generation (the LLM writes executable motion plans), and spatial grounding (VLMs create value maps in 3D space for motion optimization). These systems still need training data for the grounding components — the affordance models, manipulation skills, and perception systems that bridge language instructions to physical execution.",
    },
    {
      question: "What are the main TAMP benchmarks and how are they evaluated?",
      answer: "The primary TAMP benchmarks evaluate multi-step manipulation tasks requiring both symbolic and geometric reasoning. The BEHAVIOR benchmark (Srivastava et al., 2022) defines 100 household activities in simulation, each requiring 5-50 actions. The LIBERO benchmark (Liu et al., 2023) provides 130 language-conditioned manipulation tasks with systematic variation in initial conditions. The RLBench benchmark (James et al., 2020) defines 100 tabletop manipulation tasks with varying complexity. Evaluation metrics include task success rate, planning time, plan length (number of actions), and execution success rate (distinguishing planning failures from execution failures). A key distinction is between oracle evaluation (given perfect perception and skill execution, can the planner find a valid plan?) and end-to-end evaluation (does the complete system, including perception and execution, succeed?). End-to-end success rates are typically 30-60% of oracle rates, highlighting that perception and execution errors, not planning failures, are the primary bottleneck.",
    },
    {
      question: "What training data formats does TAMP require?",
      answer: "TAMP systems require training data across multiple levels of abstraction. For perception: annotated 3D scenes with object categories, 6-DoF poses, and physical properties (mass, friction, articulation). For skill learning: demonstrations of individual manipulation primitives — grasping, placing, pouring, pushing — with action trajectories, contact events, and success/failure labels. For feasibility prediction: planning traces recording which symbolic actions were attempted, their geometric parameters, and whether motion planning succeeded or failed. For LLM-based task planning: natural language task specifications paired with correct action sequences and common failure modes. The critical data challenge for TAMP is coverage: the system must have skills and perception capabilities for every type of action and object it might encounter, because a single missing capability causes the entire multi-step plan to fail. This makes diverse, comprehensive training data essential.",
    },
  ],
  ctaHeading: "Need Multi-Step Manipulation Data?",
  ctaDescription: "Claru provides long-horizon manipulation datasets with temporal annotations, sub-task decompositions, and the multi-level labels that TAMP systems need for perception, skill learning, and feasibility prediction.",
  relatedGlossaryTerms: ["action-space", "manipulation-trajectory", "world-model", "scene-understanding"],
  relatedGuidePages: ["how-to-build-a-manipulation-dataset"],
  relatedSolutionSlugs: ["manipulation-trajectory-data"],

  longDefinition: `Task and motion planning (TAMP) is a computational framework for robot decision-making that integrates symbolic task-level reasoning with continuous motion-level planning. The core challenge TAMP addresses is that long-horizon manipulation tasks require reasoning at two fundamentally different levels of abstraction simultaneously. At the task level, the robot must decide what to do: which objects to interact with, in what order, and toward what goal state. At the motion level, the robot must decide how to do it: computing collision-free trajectories, stable grasps, and feasible placements that satisfy the geometric constraints of the physical world.

Classical TAMP formulations represent the task level using symbolic planning languages like PDDL (Planning Domain Definition Language), where the world state is described by logical predicates (on(cup, table), clear(shelf_top), in_gripper(nothing)) and actions have symbolic preconditions and effects. A task planner searches over symbolic action sequences to find a plan that transforms the initial state into the goal state. For each candidate symbolic plan, a motion planner verifies geometric feasibility — computing actual robot trajectories and checking for collisions, joint limits, and physical stability. If motion planning fails for a step, the task planner backtracks and tries alternative symbolic plans.

This interleaved search over symbolic and geometric spaces is computationally expensive because the spaces are enormous: even a modest kitchen scene with 20 objects has billions of possible configurations. The key algorithmic innovation in TAMP research has been developing efficient interfaces between the two planning levels. PDDLStream (Garrett et al., 2020) introduced the concept of "streams" — lazy generators that produce geometric parameters (grasp poses, placement poses, motion plans) on demand during symbolic search, avoiding the combinatorial explosion of pre-computing all possible geometric solutions. Logic-Geometric Programming (Toussaint, 2015) formulates the entire TAMP problem as a single optimization, jointly optimizing over discrete action choices and continuous motion parameters.

Modern TAMP increasingly incorporates learned components to overcome the limitations of pure planning. Learned perception models replace hand-specified object models with neural networks that estimate poses, segment scenes, and predict physical properties from camera observations. Learned skill policies replace analytical controllers with neural networks trained on demonstrations, handling contact-rich manipulation tasks (grasping deformable objects, pouring liquids) that analytical methods struggle with. Learned feasibility predictors reduce planning time by predicting which actions are likely to succeed geometrically, focusing the search on promising plan branches. These learned components create training data requirements that classical TAMP did not have.

The integration of large language models with TAMP represents the current frontier. LLMs encode vast common-sense knowledge about everyday tasks — they know that making coffee requires grinding beans, boiling water, and filtering — which would be laborious to specify in PDDL. However, LLMs lack grounding in physical constraints: they might suggest actions that are physically impossible for the specific robot in the specific scene. Systems like SayCan, Code as Policies, and VoxPoser address this by pairing LLM task proposals with learned affordance models that score proposals based on physical feasibility, creating a synergy between language-scale knowledge and robot-scale physical reasoning.`,

  historicalContext: `The roots of TAMP trace to the early AI planning systems of the 1970s. STRIPS (Fikes and Nilsson, 1971) introduced symbolic planning with preconditions and effects, enabling robots to reason about action sequences. The Shakey robot (1966-1972) at SRI International was the first system to integrate symbolic planning with physical execution, though its motion planning was primitive by modern standards.

Motion planning developed as a separate field through the 1980s and 1990s, with foundational algorithms like Rapidly-exploring Random Trees (RRT, LaValle, 1998) and Probabilistic Road Maps (PRM, Kavraki et al., 1996) enabling efficient path planning in high-dimensional configuration spaces. These algorithms could find collision-free robot trajectories but had no concept of task-level goals or action sequencing.

The explicit integration of task and motion planning began with aSyMov (Cambon et al., 2009), which interleaved a symbolic planner with a motion planner, backtracking at the symbolic level when motion planning failed. This established the basic TAMP architecture: symbolic search guided by geometric feasibility checks. Srivastava et al. (2014) formalized the interface between task and motion planning, showing how to abstract geometric information for the task planner while maintaining completeness.

The PDDLStream framework (Garrett et al., 2020) unified prior TAMP approaches by introducing a general formalism for integrating discrete and continuous planning. This became the standard algorithmic framework for TAMP research. Around the same time, the integration of learning with TAMP began: Driess et al. (2020) used learned models to predict geometric feasibility, and Kim et al. (2022) used learned skill policies within a TAMP framework.

The LLM revolution (2022-present) transformed TAMP by providing powerful task-level planners that require no hand-crafted domain specifications. SayCan (Ahn et al., 2022), Inner Monologue (Huang et al., 2023), and Code as Policies (Liang et al., 2023) demonstrated that LLMs could decompose natural language goals into actionable robot plans, with learned affordance models providing physical grounding. This shift has made TAMP accessible to a much wider range of applications, because defining tasks in natural language is dramatically easier than writing PDDL domain specifications.`,

  practicalImplications: `For teams building robots that perform multi-step tasks — warehouse fulfillment, kitchen assistance, manufacturing assembly — TAMP provides the planning infrastructure that connects perception to action. The practical question is which TAMP components to build classically versus learn from data.

Perception is almost always learned: the robot needs neural networks to segment objects, estimate poses, and classify materials from camera observations. These perception models require annotated 3D scene data — images with object masks, bounding boxes, and 6-DoF pose labels. The annotation effort is substantial but well-understood, with established tools (CVAT, Label Studio) and pre-annotation from models like SAM and FoundationPose.

Skill primitives (individual manipulation actions) are increasingly learned from demonstrations rather than hand-coded. A pouring skill, for example, requires complex force and angle control that is easier to learn from 50-100 demonstrations than to derive analytically. The training data for skills consists of demonstration trajectories — sequences of robot states and actions that accomplish the skill — with success/failure labels and task parameter variation (different containers, fill levels, pour targets).

Task-level planning is where the choice between classical and learned approaches matters most. Classical PDDL planners guarantee completeness (they will find a plan if one exists) but require complete domain specifications. LLM-based planners are flexible and require no domain engineering but offer no completeness guarantees and can produce physically impossible plans. The practical approach for production systems is to use LLMs for initial plan proposals and classical planners for verification and refinement, combining the flexibility of LLMs with the reliability of classical planning.

Claru supports TAMP development with multi-level annotated datasets: 3D scene annotations for perception, individual skill demonstrations with trajectory data for skill learning, and long-horizon task demonstrations with temporal segmentation and sub-task labels for end-to-end evaluation. Our egocentric video catalog captures the natural task structures of human activities — the sub-task decompositions, object interaction sequences, and timing patterns that TAMP systems need to understand.`,

  commonMisconceptions: [
    {
      misconception: "TAMP is being replaced by end-to-end learned policies that directly map observations to actions.",
      correction: "End-to-end policies struggle with long-horizon tasks requiring 10+ sequential actions with precise geometric constraints. Current vision-language-action models achieve strong results on short-horizon tasks (1-3 steps) but degrade rapidly as task length increases. TAMP's strength is exactly long-horizon reasoning — planning 20-step sequences where each step's feasibility depends on prior actions. The practical trend is hybrid systems: end-to-end learning for short-horizon skills within a TAMP framework that handles the long-horizon sequencing and geometric reasoning. Data requirements exist for both: demonstrations for skills, and annotated tasks for planning.",
    },
    {
      misconception: "LLM-based task planners make TAMP training data unnecessary.",
      correction: "LLMs handle task-level decomposition but cannot replace the data needs for perception, skill execution, and physical feasibility prediction. An LLM can propose 'pick up the cup and place it on the shelf,' but the robot still needs trained perception to locate the cup, a trained grasping policy to pick it up, and motion planning with a learned feasibility model to find a collision-free path to the shelf. Each of these components requires training data. What LLMs reduce is the engineering effort for symbolic domain specification, not the data requirement for physical grounding.",
    },
    {
      misconception: "TAMP is only relevant for structured environments like factories — it does not work in unstructured homes.",
      correction: "Classical TAMP struggled in unstructured environments because it required exact object models and complete world state specifications. Modern TAMP with learned perception and LLM-based task planning operates effectively in unstructured settings. The BEHAVIOR benchmark evaluates TAMP systems on 100 household activities in realistic home environments. The key enabler is learned perception that handles partial observability and novel objects, combined with LLM common sense that handles task decomposition without explicit domain engineering. Data diversity remains critical: the perception and skill models must have seen sufficient variation in home environments to generalize.",
    },
  ],

  keyPapers: [
    {
      id: "garrett-pddlstream-2020",
      title: "PDDLStream: Integrating Symbolic Planners and Blackbox Samplers via Optimistic Adaptive Planning",
      authors: "Garrett et al.",
      venue: "ICAPS 2020",
      year: 2020,
      url: "https://arxiv.org/abs/1802.08705",
    },
    {
      id: "ahn-saycan-2022",
      title: "Do As I Can, Not As I Say: Grounding Language in Robotic Affordances",
      authors: "Ahn et al.",
      venue: "CoRL 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2204.01691",
    },
    {
      id: "toussaint-lgp-2015",
      title: "Logic-Geometric Programming: An Optimization-Based Approach to Combined Task and Motion Planning",
      authors: "Toussaint",
      venue: "IJCAI 2015",
      year: 2015,
      url: "https://www.ijcai.org/Proceedings/15/Papers/469.pdf",
    },
    {
      id: "srivastava-behavior-2022",
      title: "BEHAVIOR: Benchmark for Everyday Household Activities in Virtual, Interactive, and Ecological Environments",
      authors: "Srivastava et al.",
      venue: "CoRL 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2108.09019",
    },
    {
      id: "liang-codepolicies-2023",
      title: "Code as Policies: Language Model Programs for Embodied Control",
      authors: "Liang et al.",
      venue: "ICRA 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2209.07753",
    },
  ],

  claruRelevance: `Claru provides the multi-level training data that modern TAMP systems require. Our datasets include 3D scene annotations for perception training (object categories, 6-DoF poses, spatial relationships), individual manipulation skill demonstrations with trajectory data, and long-horizon activity recordings with temporal sub-task segmentation — the complete data stack for building perception, skills, and planning components.

Our egocentric video catalog is particularly valuable for TAMP development because it captures natural human task decompositions. When a human makes coffee in an egocentric video, the recording naturally encodes the sub-task sequence (get cup, grind beans, boil water, pour), the object interactions at each step, and the timing and ordering constraints that a TAMP planner must respect. Claru annotates these temporal structures with action boundaries, object labels, and hand-state descriptions, producing training data that teaches both the symbolic structure and physical execution of complex multi-step tasks.`,
};

export default data;
