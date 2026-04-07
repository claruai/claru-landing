import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "trajectory-optimization",
  termSlug: "trajectory-optimization",
  category: "robotics-fundamentals",
  metaTitle: "Trajectory Optimization — Definition & Training Data | Claru",
  metaDescription: "Trajectory optimization computes smooth, collision-free robot motions that minimize cost functions like energy, time, or jerk. Learn methods, solvers, data requirements, and key papers.",
  primaryKeyword: "trajectory optimization",
  secondaryKeywords: ["motion optimization", "path optimization", "optimal control trajectory", "robot trajectory planning", "motion planning optimization", "collision-free trajectory"],
  canonicalPath: "/glossary/trajectory-optimization",
  h1: "Trajectory Optimization: Definition, Applications, and Training Data Requirements",
  heroSubtitle: "Trajectory optimization computes robot motion plans that minimize a cost function (energy, time, smoothness, or collision risk) subject to physical constraints. Unlike sampling-based planners that find any feasible path, trajectory optimization finds locally optimal paths with smooth dynamics. This page covers optimization methods, cost function design, the role of demonstration data, and applications in manipulation and locomotion.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Trajectory Optimization", href: "/glossary/trajectory-optimization" },
  ],
  sections: [],
  faqs: [
    {
      question: "What is the difference between trajectory optimization and motion planning?",
      answer: "Motion planning broadly refers to any method for computing a robot path from start to goal while avoiding obstacles. Sampling-based motion planners like RRT and PRM find feasible paths through random sampling of the configuration space — they guarantee finding a path if one exists but the resulting paths are typically jerky and suboptimal. Trajectory optimization is a specific approach within motion planning that formulates the problem as a continuous optimization: minimize a cost function (path length, energy, execution time, smoothness) subject to constraints (joint limits, collision avoidance, dynamics). The result is a smooth, locally optimal trajectory rather than just a feasible path. In practice, many systems use sampling-based planners to find an initial feasible path, then refine it with trajectory optimization to produce a smooth, efficient trajectory for execution.",
    },
    {
      question: "How does training data help trajectory optimization?",
      answer: "Classical trajectory optimization uses physics-based cost functions and does not require training data. However, learning-based extensions use demonstration data in several ways. First, warm-starting: human demonstrations provide initial trajectory guesses that are close to the optimal solution, dramatically reducing optimization time and avoiding poor local minima. The optimizer starts from the demonstration rather than from a random initialization. Second, learned cost functions: rather than hand-designing cost functions, a model learns what good trajectories look like from demonstrations — trajectories that are natural, efficient, and avoid unusual configurations. Third, learned dynamics models: neural networks trained on robot interaction data predict how the environment responds to actions (e.g., how objects move when pushed), enabling trajectory optimization in scenarios where analytical dynamics models are unavailable. Each application requires different training data: demonstrations for warm-starting, rated trajectories for cost learning, and state-action-next-state tuples for dynamics learning.",
    },
    {
      question: "What are the main trajectory optimization algorithms used in robotics?",
      answer: "The major algorithms are CHOMP (Covariant Hamiltonian Optimization for Motion Planning, Ratliff et al., 2009), TrajOpt (Sequential Convex Optimization, Schulman et al., 2014), iLQR (Iterative Linear Quadratic Regulator, Todorov and Li, 2005), and MPOT (Motion Planning via Optimal Transport, Le Cleac'h et al., 2024). CHOMP uses gradient descent on a cost functional that combines smoothness and collision avoidance, using the signed distance field of obstacles. TrajOpt formulates the problem as sequential convex optimization, handling collision constraints more robustly through convex approximations. iLQR is the standard for systems with nonlinear dynamics (legged robots, drones), computing locally optimal feedback policies along the trajectory. MPOT uses optimal transport to jointly optimize multiple trajectory candidates, avoiding the local minima problem that affects single-trajectory methods. For manipulation, TrajOpt and CHOMP are most common; for locomotion and drones, iLQR dominates.",
    },
    {
      question: "What role does trajectory optimization play in learning-based robot control?",
      answer: "Trajectory optimization serves as both a data generation tool and a planning backbone in learning-based systems. As a data generation tool, optimized trajectories provide high-quality demonstrations for imitation learning — instead of collecting human demonstrations (which are noisy and suboptimal), teams can generate optimal trajectories in simulation using trajectory optimization and train policies to reproduce them. MPC-based methods like Model Predictive Path Integral (MPPI) perform trajectory optimization at runtime, re-optimizing the trajectory at each control step. As a planning backbone, trajectory optimization is used within hierarchical systems where a high-level planner selects goals and a trajectory optimizer computes smooth paths between them. Diffusion Policy (Chi et al., 2023) can be viewed as a learned trajectory optimizer that generates entire motion trajectories conditioned on observations, combining the smoothness benefits of trajectory optimization with the generalization of neural networks.",
    },
    {
      question: "What data format is needed for learning trajectory optimization cost functions?",
      answer: "Learning cost functions from demonstrations requires paired data: trajectories labeled as good (demonstrations) and bad (failures or suboptimal alternatives). Inverse Reinforcement Learning (IRL) methods learn a reward function that assigns high reward to demonstrated trajectories and low reward to alternatives. The training data consists of demonstrated trajectories (state sequences from expert performance), negative examples (randomly sampled or perturbed trajectories that deviate from demonstrations), and optionally ranked trajectories (sets of trajectories ordered from best to worst). For maximum-entropy IRL (Ziebart et al., 2008), the demonstrations need to be reasonably diverse — different solutions to the same task, or the same task in different environments — so the learned cost function captures the invariant preferences rather than memorizing specific trajectories.",
    },
  ],
  ctaHeading: "Need Demonstration Data for Trajectory Optimization?",
  ctaDescription: "Claru provides manipulation and navigation trajectory datasets with smooth, high-quality demonstrations suitable for warm-starting optimizers, learning cost functions, and training trajectory prediction models.",
  relatedGlossaryTerms: ["manipulation-trajectory", "action-space", "task-and-motion-planning", "reward-model"],
  relatedGuidePages: ["how-to-annotate-manipulation-trajectories"],
  relatedSolutionSlugs: ["manipulation-trajectory-data"],

  longDefinition: `Trajectory optimization is the computational process of finding a robot motion plan that minimizes a cost function subject to physical and task constraints. Formally, it solves the problem: find a trajectory (a time-parameterized sequence of robot configurations or states) that minimizes a cost functional while satisfying constraints on collision avoidance, joint limits, velocity limits, torque limits, and task-specific requirements like reaching a target pose or maintaining a grasp.

The cost function typically combines multiple objectives. Smoothness costs penalize large accelerations or jerks, producing trajectories that are gentle on the robot hardware and predictable to human observers. Path length costs minimize the total distance traveled in configuration space, producing efficient motions. Collision costs penalize proximity to obstacles, using signed distance fields or swept volumes to keep the robot and its payload safely away from the environment. Task-specific costs encode application requirements: maintaining upright orientation while carrying a cup, keeping the end-effector within a workspace region, or reaching the goal within a time limit. The relative weighting of these costs is a design decision that balances competing objectives.

Trajectory optimization differs from sampling-based motion planning (RRT, PRM) in its formulation and output quality. Sampling-based planners explore the configuration space through random sampling and build connectivity graphs. They are probabilistically complete (guaranteed to find a path if given enough time) but produce piecewise-linear paths with unnecessary detours and sharp turns. Trajectory optimization starts from an initial trajectory guess and iteratively improves it through gradient-based or convex optimization, producing smooth, locally optimal trajectories. The tradeoff is that trajectory optimization can get stuck in local minima — if the initial guess is poor, the optimizer may converge to a suboptimal solution or fail to find a collision-free path. Practical systems combine both: a sampling-based planner finds an initial feasible path, and trajectory optimization refines it.

For physical AI and robot learning, trajectory optimization plays a dual role. First, it is a deployment-time planning method: given a current state and a goal, the optimizer computes a trajectory for the robot to execute. Model Predictive Control (MPC) formulations re-optimize at every control step, creating a feedback policy from open-loop trajectory optimization. Second, it is a data generation method: running trajectory optimization in simulation produces high-quality demonstration trajectories that can train imitation learning policies. These optimized demonstrations are smoother and more consistent than human teleoperation, making them useful training data for neural policies that must interpolate between demonstrated behaviors.

The connection between trajectory optimization and learned policies is deepening. Diffusion-based policies (Chi et al., 2023) generate entire action trajectories through a learned denoising process, effectively amortizing the optimization over the training set — the network learns to produce optimized trajectories without running an explicit optimizer at deployment time. This fusion of trajectory optimization principles with neural network generalization represents the current frontier of robot motion generation.`,

  historicalContext: `Trajectory optimization has deep roots in optimal control theory, dating to Pontryagin's Maximum Principle (1962) and Bellman's Dynamic Programming (1957), which provided the mathematical foundations for computing optimal control trajectories. These classical methods applied primarily to aerospace and process control, where the dynamics were known and the state space was relatively low-dimensional.

In robotics, trajectory optimization for manipulation was pioneered by Khatib (1986), who introduced the artificial potential field method where the robot is attracted to the goal and repelled by obstacles. While not a formal optimization, this gradient-following approach established the pattern of treating motion planning as an optimization over a cost landscape.

CHOMP (Covariant Hamiltonian Optimization for Motion Planning, Ratliff et al., 2009) was the first practical trajectory optimization algorithm for high-DOF robot manipulation. CHOMP formulated the motion planning problem as continuous optimization of a cost functional combining smoothness and obstacle clearance, solved via gradient descent on the trajectory. The key innovation was covariant gradient descent, which maintained the trajectory's dynamical structure during optimization.

TrajOpt (Schulman et al., 2014) improved upon CHOMP by using sequential convex optimization, which handled collision constraints more robustly and converged more reliably. TrajOpt became the standard trajectory optimizer in the MoveIt motion planning framework and remains widely used in industrial robotics.

The learning era introduced data-driven trajectory optimization. Inverse Reinforcement Learning (Ziebart et al., 2008; Finn et al., 2016) learned cost functions from demonstrations, enabling trajectory optimization in settings where the objective is difficult to specify analytically. Neural network dynamics models (Nagabandi et al., 2018) enabled trajectory optimization with learned physics, extending the approach to contact-rich manipulation where analytical dynamics are intractable. Most recently, diffusion-based trajectory generation (Janner et al., 2022; Chi et al., 2023) frames trajectory optimization as a learned generative process, producing optimized trajectories through iterative denoising rather than explicit cost minimization.`,

  practicalImplications: `For robotics teams, trajectory optimization is relevant in two ways: as a deployment-time planning method and as a training data source for learned policies.

As a deployment-time planner, trajectory optimization produces smooth, efficient robot motions. The practical implementation typically uses a two-phase approach: a sampling-based planner (RRT-Connect or BiRRT in MoveIt) finds a collision-free path, then a trajectory optimizer (TrajOpt, STOMP, or time-optimal parameterization) smooths and optimizes it. The optimization phase adds 50-200ms of computation but dramatically improves trajectory quality — reducing execution time by 20-40%, decreasing jerk by 50-80%, and improving obstacle clearance. For real-time applications, Model Predictive Control (MPC) runs trajectory optimization at each control step, typically optimizing a 0.5-2 second horizon at 10-50 Hz.

As a training data source, trajectory optimization generates demonstrations that are smoother and more consistent than human teleoperation. Running trajectory optimization across diverse initial conditions and goal states in simulation produces large datasets of high-quality trajectories that can train imitation learning policies. The advantage over human demonstrations is consistency: every optimized trajectory satisfies the same cost function, producing uniform quality. The disadvantage is that optimized trajectories may lack the natural variability and recovery behaviors present in human demonstrations, producing policies that are brittle when execution deviates from the plan.

The training data needed for learning-based trajectory optimization varies by approach. Warm-starting requires demonstration trajectories (50-500 per task) as initial guesses. Learned cost functions require diverse demonstrations (100-1000) plus negative examples. Learned dynamics models require state-action-next-state tuples (10,000-100,000) from robot interaction. Diffusion-based trajectory generation requires the largest datasets (10,000-1,000,000 trajectories) because the network must learn the full distribution of valid trajectories.

Claru provides trajectory datasets for both training and benchmarking. Our manipulation trajectory data includes kinematic trajectories from human demonstrations with millimeter-precision recording, suitable for warm-starting trajectory optimizers and training trajectory prediction models. Our egocentric video datasets include hand trajectory annotations that capture natural human motion patterns, providing the diverse, naturalistic trajectory data that learned cost functions need to capture human preferences.`,

  commonMisconceptions: [
    {
      misconception: "Trajectory optimization always finds the globally optimal trajectory.",
      correction: "Trajectory optimization finds locally optimal trajectories — the best solution near the initial guess. The cost landscape for robot motion planning is highly non-convex due to collision constraints: the same start-goal pair may have fundamentally different solutions (reaching over vs. around an obstacle) and a gradient-based optimizer will converge to whichever solution is closest to its initialization. Global optimality requires either exhaustive search (intractable for high-DOF robots) or multiple random restarts with the best result selected. Multi-trajectory methods like MPOT address this by optimizing a batch of trajectories simultaneously, improving coverage of the solution space.",
    },
    {
      misconception: "Learned policies have made trajectory optimization obsolete for robot control.",
      correction: "Learned policies and trajectory optimization serve complementary roles. Neural policies excel at reactive control and generalization across diverse scenarios, but they produce fixed-length action chunks without guarantees on smoothness, collision avoidance, or constraint satisfaction. Trajectory optimization provides formal guarantees on these properties but requires accurate models and does not generalize to novel scenarios. The most capable current systems combine both: learned policies for perception and high-level decision-making, trajectory optimization for producing smooth, constraint-satisfying motions. Even diffusion-based policies, which are essentially learned trajectory generators, benefit from test-time trajectory optimization refinement.",
    },
    {
      misconception: "Trajectory optimization requires perfect knowledge of the environment geometry.",
      correction: "Classical trajectory optimization requires a collision model of the environment, but modern approaches operate with partial and noisy geometric information. Point-cloud-based collision checking enables trajectory optimization directly on sensor observations without explicit scene reconstruction. Learned occupancy fields and neural signed distance functions provide differentiable collision representations that can be optimized through. Robust trajectory optimization methods add safety margins to account for geometric uncertainty. The practical requirement is not perfect geometry but a geometric representation accurate enough to distinguish between collision-free and colliding configurations at the resolution relevant to the task.",
    },
  ],

  keyPapers: [
    {
      id: "ratliff-chomp-2009",
      title: "CHOMP: Gradient Optimization Techniques for Efficient Motion Planning",
      authors: "Ratliff et al.",
      venue: "ICRA 2009",
      year: 2009,
      url: "https://www.ri.cmu.edu/pub_files/2009/5/icra09-chomp.pdf",
    },
    {
      id: "schulman-trajopt-2014",
      title: "Motion Planning with Sequential Convex Optimization and Convex Collision Checking",
      authors: "Schulman et al.",
      venue: "IJRR 2014",
      year: 2014,
      url: "https://journals.sagepub.com/doi/10.1177/0278364914528132",
    },
    {
      id: "chi-diffusionpolicy-2023",
      title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
      authors: "Chi et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2303.04137",
    },
    {
      id: "janner-diffuser-2022",
      title: "Planning with Diffusion for Flexible Behavior Synthesis",
      authors: "Janner et al.",
      venue: "ICML 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2205.09991",
    },
    {
      id: "lecleach-mpot-2024",
      title: "Motion Planning via Optimal Transport",
      authors: "Le Cleac'h et al.",
      venue: "RSS 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2407.01985",
    },
  ],

  claruRelevance: `Claru provides trajectory datasets that serve both as training data for learned trajectory generation models and as benchmarks for trajectory optimization methods. Our manipulation trajectory data captures human demonstrations with millimeter-precision motion recording, suitable for warm-starting trajectory optimizers, training diffusion-based trajectory generators, and learning cost functions through inverse reinforcement learning.

Our egocentric video catalog adds a complementary data modality: natural human motion trajectories observed in real-world environments. By combining precise robot trajectory data with the diverse, naturalistic motion patterns captured in egocentric video, Claru enables teams to build trajectory generation systems that are both precise (from robot data) and natural (from human observation data). Every trajectory dataset is delivered with the kinematic metadata, timestamp alignment, and environment context that trajectory optimization pipelines require.`,
};

export default data;
