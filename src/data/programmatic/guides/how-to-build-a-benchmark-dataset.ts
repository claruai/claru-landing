import type { GuidePageData } from "../types";

const data: GuidePageData = {
  slug: "how-to-build-a-benchmark-dataset",
  metaTitle: "How to Build a Benchmark Dataset for Robot Evaluation (2026 Guide) | Claru",
  metaDescription: "Step-by-step guide to designing rigorous robot evaluation benchmarks with standardized tasks, metrics, environmental controls, and reproducibility protocols.",
  primaryKeyword: "how to build a benchmark dataset for robot evaluation",
  secondaryKeywords: ["robot benchmark creation","robot evaluation dataset","manipulation benchmark design","standardized robot testing","robot policy evaluation"],
  canonicalPath: "/guides/how-to-build-a-benchmark-dataset",
  h1: "How to Build a Benchmark Dataset for Robot Evaluation",
  heroSubtitle: "Step-by-step guide to designing rigorous robot evaluation benchmarks with standardized tasks, controlled initial conditions, multi-axis metrics, and reproducibility protocols.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Guides", href: "/guides" },
    { label: "Build a Benchmark Dataset for Robot Evaluation", href: "/guides/how-to-build-a-benchmark-dataset" },
  ],
  sections: [],
  faqs: [
    {
      question: "How many evaluation episodes per task are needed for statistically meaningful benchmark results?",
      answer: "You need enough episodes to report confidence intervals that distinguish between models of different quality. For binary success/failure metrics, 50 episodes per task gives a 95% confidence interval width of approximately plus or minus 14 percentage points (for a 50% success rate), which is too wide to distinguish a 60% model from a 75% one. At 100 episodes, the interval narrows to plus or minus 10 points. At 200 episodes, it reaches plus or minus 7 points, which is the minimum for making meaningful comparisons between policies. The LIBERO benchmark uses 20 episodes per task across 130 tasks; the RLBench benchmark uses 25 per task. For a focused benchmark with 10-20 tasks, aim for 100-200 evaluation episodes per task. Compute statistical significance between model pairs using a two-proportion z-test or bootstrap resampling with 10,000 iterations to get tighter confidence intervals."
    },
    {
      question: "Should a benchmark dataset include training demonstrations or only evaluation episodes?",
      answer: "Include both, but separate them clearly. The benchmark value comes from the evaluation protocol (standardized initial conditions, metrics, and reporting), but providing a canonical training set ensures all published results are comparable. Without a shared training set, researchers who train on 10,000 demonstrations cannot be compared against those who train on 100. The CALVIN benchmark provides both: a training set of 24 hours of play data and a standardized evaluation protocol. If your benchmark targets few-shot learning, provide a small canonical training set (10-50 demonstrations per task) and a larger optional training set. Always lock the evaluation set as immutable once published. Training data can be extended in future versions, but changing evaluation episodes invalidates all prior published results."
    },
    {
      question: "How do you prevent benchmark overfitting without a hidden test set?",
      answer: "Robot benchmarks cannot use hidden test sets like NLP benchmarks because evaluation requires physical robot access or simulator runs. Instead, use three strategies. First, define a held-out generalization axis: include test scenarios that differ systematically from training (novel objects, novel initial positions, novel environments). Report results separately on in-distribution and out-of-distribution test episodes. Second, require reporting of multiple random seeds (minimum 3) and report mean plus standard deviation. This catches methods that succeed on one lucky initialization but fail on others. Third, publish a versioned evaluation protocol with exact initial state specifications (object poses to millimeter precision, camera angles, lighting parameters) so that results are reproducible and auditable. The ManiSkill benchmark additionally provides automated evaluation servers that run submitted policies against hidden environment configurations, preventing cherry-picking."
    },
    {
      question: "What metrics should a robot manipulation benchmark report beyond success rate?",
      answer: "Success rate alone is insufficient because it conflates efficient and inefficient task completion. Report at minimum five metrics: (1) success rate (binary, task-specific criteria), (2) normalized path length (actual path divided by straight-line distance, lower is more efficient), (3) completion time (seconds from start to task success), (4) smoothness (mean jerk magnitude in m/s^3, lower indicates more natural motion), and (5) safety violations (number of collisions or excessive force events above 20N). For benchmarks targeting real-world deployment, also report: grasp stability (percentage of grasps that held through transport), near-miss rate (episodes that came within 1cm of collision without contact), and recovery rate (percentage of perturbations the policy recovered from). Present results as radar plots per model to visualize multi-dimensional performance. The RoboCasa benchmark additionally tracks task completion under disturbances, which is a strong indicator of policy robustness."
    },
    {
      question: "How do you ensure benchmark reproducibility across different labs?",
      answer: "Reproducibility requires specifying every variable that affects evaluation outcomes. Publish: (1) exact object models with 3D mesh files (STL/OBJ), mass, friction coefficients, and center-of-mass location; (2) exact initial state specifications as JSON files with object 6-DoF poses and joint configurations to 4 decimal places; (3) camera intrinsics and extrinsics calibration matrices; (4) success criteria as deterministic code (a Python function that takes final state and returns bool), not prose descriptions; (5) robot URDF and controller gains; and (6) a containerized evaluation harness (Docker image) that runs the full evaluation pipeline. For simulation benchmarks, pin all simulator versions (MuJoCo 3.1.1, not just MuJoCo 3.x). For real-robot benchmarks, provide a physical setup guide with measurements and photographs, accept that perfect reproducibility is impossible, and instead quantify the inter-lab variance by having 2-3 labs run the same policy and reporting the spread."
    }
  ],
  ctaHeading: "Need Help With This?",
  ctaDescription: "Talk to a Claru data collection specialist about your specific requirements.",
  relatedGlossaryTerms: ["benchmark-curation","data-quality-scoring","dataset-diversity"],
  relatedGuidePages: ["how-to-evaluate-training-data-quality"],
  relatedSolutionSlugs: ["egocentric-video-data"],
  difficulty: "advanced",
  estimatedTime: "4-8 weeks",
  prerequisites: [
    "Robot platform with calibrated sensors (or simulation environment with physics engine)",
    "Python 3.9+ with NumPy, SciPy, and a robot simulator (MuJoCo, Isaac Sim, or robosuite)",
    "Defined task taxonomy with at least 5 manipulation tasks of varying difficulty",
    "Object set with known physical properties (mesh, mass, friction)",
    "Understanding of the policy architectures you intend to benchmark (Diffusion Policy, ACT, RT-2, Octo)"
  ],
  tools: ["MuJoCo","robosuite","ManiSkill","Python","NumPy","Docker","HDF5","RLDS"],
  steps: [
    {
      stepNumber: 1,
      title: "Design the Task Suite and Difficulty Progression",
      description: "Define a set of benchmark tasks that spans the skill axes you want to evaluate, with a deliberate difficulty progression from simple to complex. A strong benchmark tests multiple capabilities in isolation (reaching accuracy, grasping reliability, placement precision, multi-step planning) rather than bundling them into a single monolithic task where it is impossible to diagnose which capability a failing policy lacks.\n\nStructure your task suite into three difficulty tiers. Tier 1 (basic, 3-5 tasks): single-step manipulation primitives that isolate individual capabilities. Examples: 'reach to target pose' (tests position control), 'pick up cube from fixed position' (tests basic grasping), 'push object to goal zone' (tests force control). Success on Tier 1 is necessary for any competent policy. Tier 2 (intermediate, 5-8 tasks): multi-step tasks requiring sequencing and spatial reasoning. Examples: 'pick and place mug on shelf' (tests grasp plus transport plus precision placement), 'stack two blocks' (tests sequential grasping with inter-object reasoning), 'open drawer and retrieve object' (tests articulated object interaction). Tier 3 (advanced, 3-5 tasks): long-horizon tasks with tool use, deformable objects, or reactive behaviors. Examples: 'pour water from pitcher to cup' (tests pouring with visual feedback), 'fold cloth over object' (tests deformable manipulation), 'sort 5 objects by color into bins' (tests long-horizon planning).\n\nFor each task, write a formal specification document with: task name, natural language description, initial state specification (exact object poses, joint configuration), success criterion as executable code (`def is_success(obs) -> bool`), maximum episode length in timesteps, and the specific capabilities being tested. Reference existing benchmark designs: LIBERO defines 130 tasks across 5 task suites, RLBench defines 100+ tasks, and ManiSkill provides 20 tasks with 4 difficulty levels. Your benchmark should have at least 10 tasks to cover sufficient skill diversity, but no more than 50 to keep evaluation tractable (200 episodes x 50 tasks = 10,000 evaluation rollouts, which takes 2-3 days on a single GPU).",
      tools: ["Python", "MuJoCo", "robosuite"],
      tips: [
        "Include at least one task that no current method solves reliably (below 30% success rate). This 'aspirational' task gives the benchmark longevity by preventing ceiling effects within a year of publication.",
        "Define success criteria as tight as your real-world deployment requires. If your deployment needs 2cm placement accuracy, do not set the benchmark threshold at 5cm. Loose thresholds inflate success rates and mask real performance differences.",
        "Include both scripted-reset and random-reset variants of each task. Scripted resets (exact same initial state every time) measure deterministic performance. Random resets (objects sampled from a distribution) measure generalization."
      ]
    },
    {
      stepNumber: 2,
      title: "Specify Initial State Distributions and Environmental Controls",
      description: "The initial state distribution is the single largest source of variance in benchmark results, and under-specifying it makes results across labs incomparable. For each task, define exactly how the initial scene is configured and what variations are permitted.\n\nCreate an initial state specification file (JSON or YAML) per task that contains: robot home joint configuration (7 or more floats to 4 decimal places), object poses as 6-DoF (position in meters, orientation as quaternion) with explicit coordinate frame, camera poses (4x4 homogeneous transform matrices), and environment parameters (table height, surface friction coefficient, lighting direction and intensity). For randomized evaluations, specify the sampling distribution for each variable: object position sampled uniformly from a 20x20 cm region centered at (0.5, 0.0, 0.02) in the robot base frame, object orientation sampled uniformly over z-rotation [0, 2*pi], other orientations fixed.\n\nImplement a state initialization function that deterministically reconstructs the scene from the specification: `def reset_to_state(env, state_spec: dict) -> obs`. For simulation benchmarks, set the random seed before each episode: `np.random.seed(episode_id)` where `episode_id` is a fixed sequence (0, 1, 2, ..., N-1). This ensures that every lab evaluating the same policy with the same seed sequence gets identical initial conditions. Publish the full seed sequence in the benchmark repository.\n\nFor real-robot benchmarks, design physical alignment jigs that constrain object placement to within 5mm of the target pose. 3D-print custom fixtures for each initial position. Photograph the initial state from the evaluation camera viewpoint and include these reference images in the benchmark documentation. Accept that real-robot initial states will vary by 5-10mm between labs and report this variance alongside results.\n\nControl environmental variables that affect perception: lighting should be specified in lux with direction (overhead, side, mixed), background should be a specified color or material, and any reflective or transparent objects must use consistent surface treatments across evaluation sites.",
      tools: ["MuJoCo", "Python", "NumPy", "JSON Schema"],
      tips: [
        "Publish pre-generated initial state files for all evaluation episodes rather than just the sampling distribution. This eliminates implementation differences in random number generators across labs.",
        "Include deliberately adversarial initial states in 10-20% of episodes: objects at workspace edges, unfavorable orientations, partial occlusions. These test policy robustness beyond the nominal operating envelope.",
        "Version your initial state specifications. If you fix a bug in the object position sampler after publication, create a v2 specification and require new submissions to report on both v1 and v2."
      ]
    },
    {
      stepNumber: 3,
      title: "Define Metrics, Success Criteria, and Reporting Standards",
      description: "Design a multi-axis evaluation framework that goes beyond binary success rate to capture the quality dimensions that matter for real-world deployment. Implement all metrics as deterministic Python functions that take episode data and return scalar values.\n\nImplement five core metrics. First, task success rate: a binary function per episode evaluated by the task-specific success criterion. Report as mean plus 95% Wilson score confidence interval (not the normal approximation, which breaks at extreme success rates). Use `from statsmodels.stats.proportion import proportion_confint; ci = proportion_confint(successes, total, method='wilson')`. Second, normalized episode length: actual steps divided by the minimum steps (computed by running an oracle policy or shortest-path planner). Values above 1.5 indicate inefficient trajectories. Third, path efficiency: ratio of straight-line distance from start to goal versus the actual end-effector path length. Fourth, action smoothness: mean squared jerk (third time derivative of end-effector position), computed as `jerk = np.diff(pos, n=3, axis=0) * (hz**3)` then `smoothness = np.mean(np.sum(jerk**2, axis=-1))`. Lower is smoother. Fifth, collision rate: fraction of episodes with any collision event (force on non-target objects exceeding 5N or self-collision detected).\n\nFor each metric, define what constitutes a meaningful difference between two methods. For success rate on 200 episodes, a difference of 10 percentage points is statistically significant at p<0.05 using a two-proportion z-test. For continuous metrics, use a paired t-test or Wilcoxon signed-rank test across episodes. Require all benchmark submissions to include episode-level metric values (not just means), enabling post-hoc statistical analysis.\n\nCreate a standardized results table format. Each row is a model, columns are: model name, parameter count, training data size, training compute (GPU-hours), and then per-task success rates plus aggregate metrics. Include a 'compute-normalized' column that reports success rate per GPU-hour of training to prevent brute-force scaling from dominating the leaderboard. Publish a LaTeX template for the results table so that all papers using the benchmark report results in a consistent format.",
      tools: ["Python", "NumPy", "SciPy", "statsmodels", "pandas"],
      tips: [
        "Report confidence intervals, not just means. A paper claiming 85% success rate without confidence intervals on a 50-episode evaluation could easily be 72-98%. This is useless for comparison.",
        "Include a 'no-op' baseline (a policy that does nothing) and a 'random' baseline (uniform random actions within action bounds). If these achieve non-zero success rates, your success criterion is too lenient.",
        "Track wall-clock evaluation time per method. A method that achieves 5% higher success rate but takes 10x longer to run may not be preferable for real-world deployment."
      ]
    },
    {
      stepNumber: 4,
      title: "Create Canonical Training Data and Demonstration Sets",
      description: "Produce the reference training dataset that all benchmark participants will use for comparable results. This dataset should be collected with the same robot, sensors, and environment configuration as the evaluation setup, and should be high-quality enough that failure on the benchmark reflects policy limitations, not training data issues.\n\nFor each task, collect demonstrations using a teleoperation interface (VR controller for 6-DoF tasks, keyboard for simple tasks). Target 100-200 successful demonstrations per task for the standard training set, plus 20-50 for a few-shot training set. Collect demonstrations from at least 3 different operators to avoid operator-specific motion biases. Record at the robot's native control frequency (10-50 Hz) with synchronized RGB images (224x224 or 256x256), depth maps (if using RGB-D), joint positions, joint velocities, end-effector poses (position + quaternion), gripper state, and the action commands sent to the robot.\n\nApply quality filters before including demonstrations in the canonical set. Discard episodes with: tracking error above 3cm between commanded and actual end-effector pose (indicates teleoperation lag), any collision events, episode length above 2x the median for that task (indicates operator confusion or recovery attempts), or missing sensor data (dropped camera frames, proprioception gaps). Re-collect to maintain the target count. After filtering, verify that the training set covers the full initial state distribution by plotting end-effector start and goal positions and checking coverage.\n\nStore the training dataset in two standard formats. HDF5 following the robomimic convention: `/data/demo_N/obs/rgb_wrist` (uint8, T x H x W x 3), `/data/demo_N/obs/state` (float64, T x state_dim), `/data/demo_N/actions` (float64, T x action_dim), with a `/data/demo_N/attrs` group containing task_id, operator_id, and success (always True for canonical training data). RLDS format for users of RT-X, Octo, and OpenVLA: TFRecord episodes with standardized feature names. Include action normalization statistics (mean, std per dimension) computed on the training set, stored in the dataset metadata.\n\nPublish the training data with a permissive license (CC-BY-4.0 or Apache 2.0). A benchmark with restricted training data will not be adopted because researchers cannot publish derivative work.",
      tools: ["robomimic", "HDF5", "RLDS", "TensorFlow Datasets", "Python"],
      tips: [
        "Collect 20% more demonstrations than your target to account for quality filtering. Filtering out 15-20% of episodes is normal for teleop data.",
        "Include a small 'validation' split (10% of training episodes) held out for hyperparameter tuning. Without this, researchers tune on the test set, which invalidates results.",
        "Provide a visualization script that renders any training episode as a video with trajectory overlay. This is the first thing every new benchmark user will run."
      ]
    },
    {
      stepNumber: 5,
      title: "Build the Automated Evaluation Harness",
      description: "Create a containerized evaluation pipeline that takes a policy checkpoint as input and produces a standardized results report. This harness is the single most important component for benchmark adoption because it eliminates implementation differences in evaluation code that cause result discrepancies between labs.\n\nBuild the harness as a Docker container with all dependencies pinned (MuJoCo 3.1.6, Python 3.11.8, PyTorch 2.2.1, etc.). The entry point is: `python evaluate.py --policy_path /path/to/checkpoint --output_dir /path/to/results`. The script loads the policy, runs it on all evaluation episodes (iterating through the pre-generated initial state files from Step 2), computes all metrics from Step 3, and writes a results JSON file with episode-level data and aggregate statistics.\n\nFor each evaluation episode, the harness: (1) resets the environment to the pre-specified initial state using the episode's seed, (2) runs the policy in a loop: `obs = env.reset(); for t in range(max_steps): action = policy(obs); obs, reward, done, info = env.step(action); if done: break`, (3) evaluates the success criterion on the final state, (4) computes per-episode metrics (path length, smoothness, collisions, completion time), and (5) saves the full trajectory (observations, actions, rewards) for post-hoc analysis. Implement a timeout of 2x the maximum episode length to catch policies that loop infinitely.\n\nAdd a policy interface abstraction so that any model can be evaluated without modifying the harness code. Define an abstract base class: `class BenchmarkPolicy: def __init__(self, checkpoint_path); def predict(self, obs: dict) -> np.ndarray`. Provide reference implementations for common frameworks: DiffusionPolicyWrapper, ACTPolicyWrapper, OctoWrapper, OpenVLAWrapper. These wrappers handle observation preprocessing (image resizing, normalization) and action postprocessing (denormalization, coordinate transforms) specific to each framework.\n\nGenerate the final report as both JSON (machine-readable) and HTML (human-readable with charts). The HTML report includes: per-task success rate bar charts with confidence intervals, aggregate metrics table, per-episode scatter plots (success vs. episode length, success vs. initial state difficulty), and failure mode analysis (most common failure frame as a thumbnail grid). Run the full evaluation on a reference policy (a well-tuned Diffusion Policy) and publish its results as the benchmark baseline.",
      tools: ["Docker", "Python", "MuJoCo", "robosuite", "matplotlib", "NumPy"],
      tips: [
        "Pin EVERY dependency version in the Docker image. A numpy update changing floating-point behavior can shift success rates by 2-3%. This is not hypothetical -- it has broken multiple published benchmarks.",
        "Include a 'dry run' mode that evaluates on 5 episodes in 2 minutes so users can verify their policy integration before committing to the full 3-hour evaluation.",
        "Log the full random state at the start of each episode. If a user reports different results, you can reproduce their exact evaluation by replaying their random state sequence."
      ]
    },
    {
      stepNumber: 6,
      title: "Validate, Document, and Publish the Benchmark",
      description: "Before releasing the benchmark, run a thorough validation protocol to catch design flaws that would undermine its utility. Have at least two independent teams (ideally at different institutions) run the full evaluation on two different policies and compare results.\n\nValidation step 1 (reproducibility): run the same policy through the evaluation harness 3 times with the same seeds. Results must be bit-identical for simulation benchmarks. If they are not, there is a nondeterminism bug (often from GPU operations or uncontrolled threading). Fix it by forcing deterministic mode: `torch.use_deterministic_algorithms(True)`, `torch.backends.cudnn.deterministic = True`.\n\nValidation step 2 (discriminative power): evaluate at least 3 policies of clearly different quality (a random baseline, a simple BC policy, and a strong Diffusion Policy or ACT checkpoint). The benchmark must rank them in the expected order on every task. If the random baseline achieves above 5% success rate on any task, tighten the success criterion. If the strong baseline achieves above 95% on all tasks, the benchmark has a ceiling effect and needs harder tasks or tighter criteria.\n\nValidation step 3 (cross-lab reproducibility): have an external team set up the benchmark from scratch using only your documentation and reproduce the baseline policy results within 3 percentage points for simulation and 10 percentage points for real robot. Gaps larger than this indicate insufficient documentation or underspecified environmental variables.\n\nPackage the benchmark as a GitHub repository with the following structure: `/envs/` (task environments and assets), `/data/` (canonical training and evaluation episodes), `/evaluation/` (harness code and Docker image), `/baselines/` (reference policy checkpoints and training configs), `/docs/` (task specifications, initial state specs, metric definitions, setup guide), and a `BENCHMARK_CARD.md` documenting: benchmark name, version, creation date, task count, training data size, evaluation protocol, known limitations, intended use, and citation BibTeX. Host the data files on Hugging Face Hub or a persistent cloud bucket with a DOI. Submit a paper to a datasets track (NeurIPS Datasets, ICRA) describing the benchmark design rationale, baseline results, and analysis of what the benchmark measures. This publication provides the citable reference that drives adoption.",
      tools: ["Docker", "GitHub", "Hugging Face Hub", "Python", "LaTeX"],
      tips: [
        "Assign a version number (v1.0) from day one and commit to not changing evaluation episodes or metrics within a major version. Breaking changes get a new major version (v2.0) with a migration guide.",
        "Include a leaderboard page (GitHub Pages or a simple static site) that tracks published results. Researchers are more motivated to use benchmarks with visible leaderboards.",
        "Plan for maintenance. Benchmarks that are published and abandoned lose value rapidly. Commit to updating baselines annually with new methods and adding tasks if ceiling effects emerge."
      ]
    }
  ],
  keyPapers: [
    {
      id: "liu-libero-2023",
      title: "LIBERO: Benchmarking Knowledge Transfer for Lifelong Robot Learning",
      authors: "Liu et al.",
      venue: "NeurIPS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2306.03310"
    },
    {
      id: "james-rlbench-2020",
      title: "RLBench: The Robot Learning Benchmark & Learning Environment",
      authors: "James et al.",
      venue: "IEEE RA-L 2020",
      year: 2020,
      url: "https://arxiv.org/abs/1909.12271"
    },
    {
      id: "gu-maniskill2-2023",
      title: "ManiSkill2: A Unified Benchmark for Generalizable Manipulation Skills",
      authors: "Gu et al.",
      venue: "ICLR 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2302.04659"
    },
    {
      id: "nasiriany-robocasa-2024",
      title: "RoboCasa: Large-Scale Simulation of Everyday Tasks for Generalist Robots",
      authors: "Nasiriany et al.",
      venue: "RSS 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2406.02523"
    },
    {
      id: "mees-calvin-2022",
      title: "CALVIN: A Benchmark for Language-Conditioned Policy Learning for Long-Horizon Robot Manipulation Tasks",
      authors: "Mees et al.",
      venue: "IEEE RA-L 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2112.03227"
    }
  ],
  claruRelevance: "Building a robot evaluation benchmark requires diverse, precisely controlled evaluation data that most individual labs cannot produce in-house. Claru provides benchmark-grade data collection across 100+ real-world environments with calibrated sensor rigs, standardized object sets with known physical properties, and millimeter-precise initial state placement using custom alignment jigs. We support both the training data collection (diverse teleoperation demonstrations with multi-operator protocols) and evaluation data preparation (controlled initial states, multi-camera recording, automated success verification). For teams publishing new benchmarks, Claru delivers the real-world data component in RLDS or HDF5 format with full reproducibility documentation.",
};

export default data;
