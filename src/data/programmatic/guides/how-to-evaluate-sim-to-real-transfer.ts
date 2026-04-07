import type { GuidePageData } from "../types";

const data: GuidePageData = {
  slug: "how-to-evaluate-sim-to-real-transfer",
  metaTitle: "How to Evaluate Sim-to-Real Transfer Performance (2026 Guide) | Claru",
  metaDescription: "Step-by-step guide to evaluating sim-to-real transfer for robot policies — covering reality gap metrics, benchmark protocols, domain adaptation diagnostics, and real-world evaluation methodology.",
  primaryKeyword: "how to evaluate sim-to-real transfer performance",
  secondaryKeywords: ["sim-to-real evaluation","reality gap measurement","sim2real benchmark","domain transfer robotics","simulation fidelity testing"],
  canonicalPath: "/guides/how-to-evaluate-sim-to-real-transfer",
  h1: "How to Evaluate Sim-to-Real Transfer Performance",
  heroSubtitle: "A practitioner's guide to measuring and diagnosing the sim-to-real gap for robot policies — covering visual fidelity metrics, dynamics mismatch analysis, controlled real-world evaluation protocols, and systematic gap attribution.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Guides", href: "/guides" },
    { label: "Evaluate Sim-to-Real Transfer Performance", href: "/guides/how-to-evaluate-sim-to-real-transfer" },
  ],
  sections: [],
  faqs: [
    {
      question: "What are the main sources of the sim-to-real gap?",
      answer: "The sim-to-real gap has three primary sources: (1) Visual domain gap — simulated images differ from real images in lighting, textures, reflections, shadows, and camera noise. This gap is most impactful for vision-based policies. Measure it by computing FID (Frechet Inception Distance) between rendered sim images and real camera images of the same scenes — FID below 50 indicates good visual fidelity, above 150 suggests significant domain shift. (2) Dynamics gap — simulated physics differ from real-world physics in contact dynamics, friction coefficients, object mass distributions, actuator response curves, and joint flexibility. This gap matters most for contact-rich manipulation. Measure it by commanding identical trajectories in sim and real and comparing the resulting state sequences (RMSE of joint positions over a standard trajectory). (3) Observation gap — differences in sensor models: simulated depth has no noise, real RealSense depth has holes and noise patterns; simulated proprioception is exact, real joint encoders have quantization and latency. Each source requires different mitigation strategies."
    },
    {
      question: "How many real-world evaluation trials are needed for statistically valid results?",
      answer: "The required number of trials depends on the desired confidence interval and the expected success rate. For a policy with ~70% real-world success rate, you need at least 100 trials to achieve a 95% confidence interval of +/-9 percentage points (using the Wilson score interval). For tighter intervals (+/-5pp), plan 200-300 trials. For comparing two policies (A vs. B), use a two-proportion z-test: detecting a 10% performance difference with 80% power requires ~200 trials per policy. In practice, run evaluation in batches of 50 trials with 5-10 objects, randomizing initial conditions between trials. Reset the environment identically between trials using fiducial markers or fixed placement jigs. Always report: mean success rate, 95% confidence interval, number of trials, per-task breakdown, and any excluded trials (with reasons). Many sim-to-real papers report results on fewer than 30 real trials — this is insufficient for reliable conclusions."
    },
    {
      question: "What simulators work best for sim-to-real robotics research?",
      answer: "The choice depends on your fidelity requirements and computational budget. NVIDIA Isaac Sim (built on PhysX 5) is the current state-of-the-art for sim-to-real: it provides ray-traced rendering for photorealistic images, GPU-accelerated rigid body and soft body physics, accurate sensor simulation (cameras, LiDAR, IMU), and domain randomization APIs. Running on an A100, it achieves 1,000+ environments in parallel. MuJoCo 3.x (now open-source) excels at contact-rich manipulation with fast, stable contact dynamics and integrates with the DeepMind Control Suite. Its rendering is less photorealistic than Isaac Sim but adequate for proprioception-heavy policies. PyBullet is the lightweight option — easy to install, good for prototyping, but has known contact instabilities with complex geometries. For the best sim-to-real transfer, use Isaac Sim for visual policies and MuJoCo for proprioception-based policies. Always validate your simulator against real-world measurements before investing in large-scale training."
    },
    {
      question: "How do you systematically attribute failures to specific gap sources?",
      answer: "Use a layered ablation approach to isolate which gap source causes each failure. (1) Replace sim observations with real observations: deploy the sim-trained policy but feed it real camera images and real joint states (via a ROS bridge to the physical robot). If performance drops significantly, the visual or observation gap is dominant. (2) Replace the controller: use the sim-trained planner but execute actions through the real robot's low-level controller with compliance. If performance improves versus direct sim-to-real, the dynamics gap in actuation is the bottleneck. (3) Controlled object swaps: evaluate the same policy on objects that were present in sim training versus novel objects. Performance difference indicates visual generalization failure. (4) Sim-in-the-loop: record the real robot's state trajectory during a failed trial, replay it in simulation, and check if sim predicts success. If sim shows success but real failed, the dynamics model is missing a critical physical effect. Document each failure with a video, the gap attribution, and the proposed fix (more domain randomization, better physics parameters, real data fine-tuning)."
    },
    {
      question: "When should you fine-tune a sim-trained policy on real data versus improving the simulation?",
      answer: "Fine-tune on real data when: (1) the visual gap is the primary bottleneck and cannot be closed by rendering improvements (e.g., the real environment has unique textures, complex lighting), (2) you have access to 50-500 real demonstrations for the target task, and (3) the dynamics gap is small (the policy's action space is robust to minor physics differences). Fine-tuning typically requires 10-20% of the data needed for training from scratch — for a sim policy trained on 10,000 episodes, 500-1,000 real episodes often suffice. Improve the simulation when: (1) you need to scale to many tasks or environments (amortizing the sim improvement across all future policies), (2) the dynamics gap is the primary bottleneck (contact parameters, actuator models), or (3) real data collection is expensive or dangerous. The best approach combines both: domain-randomize aggressively in sim, transfer, evaluate, identify gap sources, then either improve sim parameters or fine-tune with targeted real data."
    }
  ],
  ctaHeading: "Need Sim-to-Real Evaluation Support?",
  ctaDescription: "Claru conducts real-world robot policy evaluations across 100+ environments. We handle evaluation protocol design, controlled trial execution, gap attribution analysis, and real-data fine-tuning.",
  relatedGlossaryTerms: ["sim-to-real-gap","domain-randomization","synthetic-data"],
  relatedGuidePages: ["how-to-setup-domain-randomization-pipeline","how-to-create-a-robot-demonstration-dataset"],
  relatedSolutionSlugs: ["sim-to-real-data"],
  difficulty: "advanced",
  estimatedTime: "2-4 weeks",
  prerequisites: ["Sim-trained robot policy ready for transfer","Access to physical robot matching the simulated embodiment","Simulation environment (Isaac Sim, MuJoCo, or PyBullet)","Python 3.10+ with policy inference stack","Evaluation objects matching sim training distribution"],
  tools: ["NVIDIA Isaac Sim","MuJoCo","Python","NumPy","ROS2","matplotlib","scipy.stats"],
  steps: [
    {
      stepNumber: 1,
      title: "Establish Simulation Baseline and Identify Transfer Candidates",
      description: `Before transferring any policy to the real world, establish comprehensive sim-only baselines. Evaluate the policy on 1,000+ simulation episodes across the full task distribution: all object categories, initial condition variations, and distractor configurations. Record per-task success rates, failure mode distributions, and action trajectory statistics. A sim success rate below 90% indicates the policy is not yet ready for transfer — fix sim training first, as real-world performance will always be lower.

Compute sim observation statistics (image mean/std, joint state ranges, action value distributions) and compare against known real-world statistics from a calibration dataset. Large distributional differences (e.g., sim images have mean brightness of 120 while real images average 80) indicate visual domain shift that domain randomization should address before transfer. Rank your tasks by expected transfer difficulty: tasks with simple geometries, limited contact, and consistent lighting transfer best; tasks with deformable objects, tool use, or precise insertion are hardest. Start real-world evaluation with the easiest tasks to validate your evaluation protocol before investing in the difficult ones.`,
      tools: ["Isaac Sim or MuJoCo", "matplotlib for baseline visualization"],
      tips: ["Record sim evaluation rollouts as video — comparing sim videos against real-world videos side-by-side is the fastest way to spot visual and dynamics discrepancies"]
    },
    {
      stepNumber: 2,
      title: "Design the Real-World Evaluation Protocol",
      description: `A rigorous evaluation protocol ensures results are reproducible and statistically valid. Define: the exact object set (use the same objects as simulation, with 3D-printed or purchased physical copies), the initial state distribution (how objects are placed — use placement templates with marked positions for reproducibility), the number of trials per configuration (minimum 20 per object, 100+ total), the success criteria (identical to sim: object reaches target within 2cm tolerance, held for 3 seconds), and the failure taxonomy (same categories as sim evaluation).

Design the evaluation workspace to minimize uncontrolled variation: consistent overhead lighting (LED panels at 5000K, positioned to eliminate shadows), fixed camera mounts (never adjust between trials), temperature-controlled room (actuator behavior changes with temperature), and anti-vibration table surface. Between trials, reset the environment using a standardized protocol: return robot to home configuration, place objects using placement templates, verify camera views against reference images. Have a human observer log each trial with: success/failure, failure type if applicable, any anomalies (e.g., object slipped unexpectedly, robot hit joint limit). Run 10 warm-up trials that are not counted to verify the full system works end-to-end before beginning scored evaluation.`,
      tools: ["Placement templates", "LED lighting panels", "Trial logging spreadsheet"],
      tips: ["Video-record every real evaluation trial from at least 2 angles — failed trials that are not recorded cannot be debugged, and you will wish you had the footage when writing the gap attribution report"]
    },
    {
      stepNumber: 3,
      title: "Execute Controlled Evaluations and Collect Gap Diagnostics",
      description: `Run the evaluation in controlled batches. For each batch of 50 trials, execute the sim-trained policy on the real robot and record: high-level success/failure, the robot's executed state trajectory (joint positions at 100 Hz), camera observations (images at the policy's input frequency), and any force/torque readings if available. Simultaneously, for each real trial, run the same initial condition in simulation and record the sim trajectory. This paired sim-real data is essential for gap attribution.

Compute diagnostic metrics after each batch: (1) Success rate gap: sim_success - real_success. If this exceeds 20%, investigate before continuing. (2) Trajectory divergence: for each paired trial, compute the RMSE between sim and real joint trajectories at matched timesteps. Identify the timestep where trajectories diverge — this is usually the point where the gap manifests (e.g., at first contact, during a rotation, or when releasing). (3) Visual input diagnostics: save the real images the policy received and compute CLIP embedding distance from the sim training distribution — outlier frames indicate visual domain shift. (4) Action distribution comparison: plot histograms of predicted actions in sim versus real — distribution shift indicates the policy is encountering observations outside its training distribution.`,
      tools: ["ROS2 for trajectory recording", "NumPy for trajectory comparison", "CLIP for visual diagnostics"],
      tips: ["After each batch of 50 trials, review the worst 5 failures in detail before proceeding — early gap identification prevents wasting trials on a systematic issue"]
    },
    {
      stepNumber: 4,
      title: "Attribute Failures to Specific Gap Sources",
      description: `Use the paired sim-real diagnostic data to systematically attribute each failure to a gap source. For each failed real trial: (1) Check if the same trial succeeded in sim. If yes, the gap is in transfer, not the policy. If no, the failure exists in sim too and is a policy bug. (2) For transfer failures, examine the trajectory divergence point. If divergence occurs at the observation level (the policy outputs different actions for real vs. sim images of the same scene), the visual gap is the cause. If the policy outputs the same actions but the robot reaches different states, the dynamics gap is the cause. (3) For visual gap failures, further classify: is it a texture/appearance issue (domain randomization can help), a lighting issue (adjustable), or a geometric fidelity issue (sim objects do not match real object shapes accurately).

Create a gap attribution report with: total trials, success rate with confidence intervals, failure count by gap source (visual: N, dynamics: N, observation: N, policy bug: N), specific failure examples with paired sim-real videos, and recommended mitigations for each gap source. Prioritize mitigations by impact: if 60% of failures are visual, improving domain randomization or adding real-data fine-tuning will have more impact than tuning physics parameters. This report is the primary deliverable of the evaluation — it directly informs the next training iteration.`,
      tools: ["Custom analysis scripts", "Video comparison tools", "matplotlib"],
      tips: ["Build a simple web dashboard that displays paired sim-real videos side-by-side for each trial with the trajectory divergence plot — this makes gap attribution meetings with the team dramatically more productive"]
    },
    {
      stepNumber: 5,
      title: "Iterate: Close the Gap Through Domain Randomization or Fine-Tuning",
      description: `Based on the gap attribution report, implement targeted improvements. For visual gap: expand domain randomization ranges for the identified failure modes — if lighting caused failures, randomize light intensity (0.3-3.0x), color temperature (3000-7000K), and shadow direction. If texture caused failures, randomize object textures, table surface, and background. Use NVIDIA Isaac Sim's built-in randomization APIs or implement custom randomization in MuJoCo's XML. For dynamics gap: measure real-world physics parameters (object mass with a scale, friction coefficient with an inclined plane test, actuator response with step-input characterization) and update the simulation model. For residual gaps that randomization cannot close: collect 100-500 real demonstrations on the failing task variants and fine-tune the sim-trained policy using DAgger (dataset aggregation) or simple behavioral cloning fine-tuning with a reduced learning rate (10x lower than sim training).

After each improvement iteration, re-run the full evaluation protocol with the same trial count. Compare success rates using a two-proportion z-test to verify the improvement is statistically significant (p < 0.05). Track the gap attribution breakdown across iterations — a healthy trajectory shows the dominant failure source shifting (first visual, then dynamics, then edge cases) as each gap is progressively closed. Typically, 2-3 iterations of evaluate-diagnose-improve bring a well-randomized sim policy from 40-60% real success to 80-90%.`,
      tools: ["Isaac Sim domain randomization API", "Real data collection rig", "DAgger implementation"],
      tips: ["Do not randomize everything simultaneously — add randomization dimensions one at a time and evaluate their individual impact. Over-randomization makes sim training harder without improving transfer."]
    },
    {
      stepNumber: 6,
      title: "Document Results and Establish Ongoing Evaluation Infrastructure",
      description: `Package the evaluation results into a reproducible report. Include: sim baseline performance (per-task success rates, 95% CI), real-world performance per iteration (success rates, CI, trial counts), gap attribution per iteration (visual/dynamics/observation breakdown with examples), the final domain randomization configuration, any real data used for fine-tuning (episode count, collection protocol), and a statistical comparison between the final policy and the sim baseline (z-test p-value, effect size).

Establish ongoing evaluation infrastructure so that future sim-trained policies can be evaluated consistently. Create a standardized evaluation kit: the physical object set (stored in a labeled case), placement templates, camera mount positions (marked on the table), lighting configuration, and a scripted evaluation workflow that an operator can follow without researcher supervision. Build an automated evaluation pipeline: the operator triggers a batch of N trials, the system records all sensor data and logs success/failure per trial, and a post-processing script generates the diagnostic metrics and gap attribution. Store all evaluation data (trajectories, images, logs) in a versioned archive — this becomes invaluable for regression testing when you update the simulation or policy architecture months later.`,
      tools: ["Evaluation pipeline scripts", "Data archival system", "Report template"],
      tips: ["Run a monthly regression evaluation of 50 trials on the production policy to detect performance drift — hardware wear, environment changes, and firmware updates can all degrade real-world performance without any model changes"]
    }
  ],
  keyPapers: [
    {
      id: "tobin-domain-randomization-2017",
      title: "Domain Randomization for Transferring Deep Neural Networks from Simulation to the Real World",
      authors: "Tobin et al.",
      venue: "IROS 2017",
      year: 2017,
      url: "https://arxiv.org/abs/1703.06907"
    },
    {
      id: "chebotar-sim2real-2019",
      title: "Closing the Sim-to-Real Loop: Adapting Simulation Randomization with Real World Experience",
      authors: "Chebotar et al.",
      venue: "ICRA 2019",
      year: 2019,
      url: "https://arxiv.org/abs/1810.05687"
    },
    {
      id: "mittal-isaac-lab-2023",
      title: "Orbit: A Unified Simulation Framework for Interactive Robot Learning Environments",
      authors: "Mittal et al.",
      venue: "IEEE RA-L 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2301.04195"
    }
  ],
  claruRelevance: "Claru conducts real-world sim-to-real evaluations for teams transferring policies from Isaac Sim, MuJoCo, and other simulators. We provide evaluation infrastructure across 100+ environments, controlled trial execution with standardized protocols, gap attribution analysis with paired sim-real diagnostics, and targeted real-data fine-tuning when needed.",
};

export default data;
