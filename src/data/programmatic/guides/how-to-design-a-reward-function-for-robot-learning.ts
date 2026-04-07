import type { GuidePageData } from "../types";

const data: GuidePageData = {
  slug: "how-to-design-a-reward-function-for-robot-learning",
  metaTitle: "How to Design a Reward Function for Robot Learning (2026 Guide) | Claru",
  metaDescription: "Technical guide to designing reward functions for robot RL — covering sparse vs. dense rewards, reward shaping, learned reward models from human preferences, and common failure modes.",
  primaryKeyword: "how to design a reward function for robot learning",
  secondaryKeywords: ["robot reward function design","reward shaping robotics","learned reward model","RLHF robotics","reward engineering manipulation"],
  canonicalPath: "/guides/how-to-design-a-reward-function-for-robot-learning",
  h1: "How to Design a Reward Function for Robot Learning",
  heroSubtitle: "Technical guide to designing reward functions for robot reinforcement learning — covering sparse and dense reward formulations, reward shaping techniques, learned reward models from human preference data, and debugging reward hacking.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Guides", href: "/guides" },
    { label: "Design a Reward Function for Robot Learning", href: "/guides/how-to-design-a-reward-function-for-robot-learning" },
  ],
  sections: [],
  faqs: [
    {
      question: "What is the difference between sparse and dense reward functions for robotics?",
      answer: "A sparse reward function provides a non-zero signal only at task completion: +1 when the robot successfully places the object in the target zone, 0 everywhere else. A dense reward function provides a continuous signal at every timestep, typically based on progress toward the goal: for example, the negative Euclidean distance between the gripper and the target object, plus a bonus when the object is grasped, plus a bonus when the object reaches the goal. Sparse rewards are easier to specify correctly (fewer hyperparameters, less risk of reward hacking) but much harder to learn from because the agent must discover the entire task solution through random exploration before receiving any learning signal. Dense rewards provide richer gradient information that accelerates learning (often 10-100x faster convergence) but are prone to reward shaping errors where the agent finds a high-reward strategy that does not accomplish the intended task. For real robot learning where each episode costs real time and mechanical wear, dense rewards are almost always necessary — but they require careful engineering and validation."
    },
    {
      question: "How do I avoid reward hacking in robot manipulation tasks?",
      answer: "Reward hacking occurs when the agent finds a policy that maximizes the reward function without accomplishing the intended task. Classic examples in manipulation: the reward includes a distance-to-object term and the robot learns to hover near the object without ever grasping it (maximizing the distance reward without the harder grasp), or the reward includes a 'contact' term and the robot learns to repeatedly tap the object rather than pick it up. Defenses: (1) Use multiplicative reward structure rather than additive. Instead of r = -distance + grasp_bonus + place_bonus, use r = -distance * (1 - grasped) + place_bonus * grasped, which eliminates the incentive to stay near the object without grasping. (2) Include task completion as the dominant term. Make the task success bonus 10-100x larger than any shaping terms so that the optimal policy must complete the task. (3) Add negative shaping for known failure modes. If robots in your domain tend to drop objects, add a penalty for dropping (object height decreases rapidly after being lifted). (4) Validate with adversarial evaluation: train the policy, then systematically test edge cases. If the policy achieves high reward but low task success, the reward function has a loophole."
    },
    {
      question: "When should I use a learned reward model instead of a hand-designed reward?",
      answer: "Use a learned reward model when: (1) the task success criterion is subjective or hard to formalize (e.g., 'arrange the objects neatly', 'fold the cloth smoothly', 'pour without spilling'). These criteria are easy for humans to evaluate visually but difficult to express as mathematical functions of state variables. (2) The state space is high-dimensional and you cannot observe the reward-relevant features directly. For contact-rich manipulation where success depends on force distribution, deformation patterns, or internal object state, a vision-based learned reward model trained on human success/failure annotations can capture these implicit criteria. (3) You need to transfer a reward across environments or embodiments. A learned reward model that takes image observations as input can generalize to new camera viewpoints or robot morphologies, while a state-based hand-designed reward breaks when the state representation changes. The trade-off: learned reward models require a preference dataset (typically 500-5,000 pairwise comparisons from human evaluators) and introduce reward model training as an additional failure point. They work best when combined with a sparse task-completion indicator as a sanity check."
    },
    {
      question: "How many human preference comparisons do I need for a reward model?",
      answer: "For single-task manipulation reward models using the Bradley-Terry preference framework (the standard in RLHF), 1,000-3,000 pairwise comparisons are typically sufficient to train a reward model that correlates >0.8 with human evaluation on held-out examples. Each comparison takes a human evaluator 5-15 seconds: they watch two short video clips (2-5 seconds each) of robot behavior and indicate which clip shows better task progress. At $0.05-0.15 per comparison (depending on task complexity and annotator qualification), the total cost is $50-450. For multi-task reward models that must evaluate behavior across diverse tasks, scale to 5,000-10,000 comparisons with stratified sampling across task types. Quality matters more than quantity: 1,000 high-agreement comparisons (where 3 out of 3 annotators agree) train a better reward model than 5,000 noisy comparisons with frequent disagreement. Use a qualification test: show annotators 20 clearly correct comparisons and require >90% accuracy before they contribute to the production dataset. Compute inter-annotator agreement (Krippendorff's alpha) on a 15% overlap set — target alpha > 0.7."
    },
    {
      question: "How do I debug a reward function that is not producing the expected behavior?",
      answer: "Reward debugging follows a systematic protocol. Step 1: Verify reward values match your expectation. Record 10 episodes (5 successes, 5 failures) and manually compute the reward at every timestep. Plot reward vs. time for both groups. Successful episodes should have monotonically increasing cumulative reward, and the gap between success and failure total returns should be large (>2x). If successes and failures have similar total returns, the reward function does not sufficiently distinguish them. Step 2: Check for reward scale issues. If the shaping reward terms (distance, contact) dwarf the task completion bonus, the agent has no gradient toward completion. Normalize all reward components to similar scales. Step 3: Look for local optima. If the agent consistently reaches the same intermediate state and stops (e.g., approaches the object but never grasps), there may be a reward barrier — the reward decreases temporarily during the grasp transition because the distance to the object increases as the gripper opens. Add a small negative reward for inaction (standing still) to push through these barriers. Step 4: Visualize the reward landscape. If your state space is low-dimensional, plot the reward as a heatmap over 2D slices of the state space. If it is high-dimensional, use t-SNE or UMAP on state embeddings colored by reward value. Discontinuities or unintended optima in the landscape reveal reward design errors."
    }
  ],
  ctaHeading: "Need Reward Engineering Support?",
  ctaDescription: "Claru provides human preference data and reward model training for robot learning teams. We deliver annotated comparison datasets ready for RLHF training.",
  relatedGlossaryTerms: ["reward-model","rlhf","preference-annotation","imitation-learning"],
  relatedGuidePages: ["how-to-build-a-preference-dataset-for-rlhf","how-to-create-a-robot-demonstration-dataset"],
  relatedSolutionSlugs: ["expert-rlhf-annotation"],
  difficulty: "advanced",
  estimatedTime: "2-4 weeks",
  prerequisites: ["Understanding of reinforcement learning fundamentals (MDP, policy gradient)","Robot simulation environment (Isaac Gym, MuJoCo, or PyBullet)","Python 3.10+ with PyTorch and stable-baselines3","Access to robot state observations (joint states, object poses)"],
  tools: ["Python","PyTorch","stable-baselines3","Isaac Gym or MuJoCo","NumPy","wandb","Label Studio (for preference annotation)"],
  steps: [
    {
      stepNumber: 1,
      title: "Formalize the Task Objective and Success Criteria",
      description: "Before designing any reward function, write a precise mathematical specification of what constitutes task success. This specification becomes the ground truth against which the reward function is validated. For a pick-and-place task, the success criterion might be: 'The target object's center of mass is within 3cm of the goal position, the object is not in contact with the gripper (it has been released), and the object velocity magnitude is below 0.01 m/s (it is stationary).' Express this as a boolean function: success(state) = (||obj_pos - goal_pos|| < 0.03) AND (gripper_contact == False) AND (||obj_vel|| < 0.01).\n\nDocument the observable state variables that the reward function can access. In simulation, you typically have full access to object poses, velocities, contact forces, and gripper state through the physics engine API. On a real robot, you may only have camera images, joint positions, and force/torque sensor readings — the reward function must be computable from these observations alone. This observability constraint determines whether you can use a state-based reward (direct access to object positions) or need a learned vision-based reward model.\n\nList the known failure modes for the task. For pick-and-place: failing to grasp the object, dropping the object during transport, placing the object outside the goal zone, knocking over other objects, colliding with the environment. Each failure mode suggests a potential negative reward component. However, resist the urge to add a penalty for every possible failure — overspecified reward functions create a maze of conflicting gradients that are harder to optimize than a clean, minimal reward. Start with the simplest possible reward that distinguishes success from failure, then add shaping terms only if learning fails to converge.",
      tools: ["Python (for success criterion implementation)", "Simulation environment API"],
      tips: ["Write the success criterion as a unit-testable function and verify it against 20 hand-designed state configurations before using it in training — false positives in the success criterion directly corrupt the training signal"]
    },
    {
      stepNumber: 2,
      title: "Design the Base Reward Function with Shaping Terms",
      description: "Construct a reward function that combines a sparse task completion signal with dense shaping terms that guide the agent toward the solution. The general structure for manipulation tasks is:\n\nr(s, a, s') = w_success * success(s') + w_reach * r_reach(s') + w_grasp * r_grasp(s') + w_lift * r_lift(s') + w_place * r_place(s') + w_penalty * r_penalty(s, a)\n\nFor a pick-and-place task, the components are: r_reach = -||gripper_pos - obj_pos|| (negative distance to encourage approaching the object), r_grasp = 1.0 if object is grasped (binary contact detection), r_lift = max(0, obj_height - initial_height) (reward for lifting the object above its starting position), r_place = -||obj_pos - goal_pos|| * is_grasped (negative distance to goal, only active when holding the object), and r_penalty = -0.01 * ||a|| (small action magnitude penalty to encourage smooth motions). Set weights to enforce the priority ordering: w_success >> w_place > w_grasp > w_reach > w_penalty. A common weighting scheme: w_success = 10.0, w_place = 1.0, w_grasp = 0.5, w_reach = 0.1, w_penalty = 0.01.\n\nCritically, use a staged reward structure where later stages only activate when earlier stages are achieved. The r_place term should only be nonzero when the object is grasped, and the r_lift term should only be nonzero after the first grasp contact. This prevents the agent from exploiting shaping terms without making progress — for example, without staging, the agent could maximize r_place by pushing the object toward the goal without ever picking it up. Implement staging using boolean gates: is_grasped (updated by contact detection), is_lifted (updated when object height exceeds threshold), and is_placed (updated by the success criterion). Each shaping term is multiplied by its prerequisite gate.",
      tools: ["Python", "NumPy", "Simulation environment"],
      tips: ["Log every reward component separately to wandb during training — this shows which components dominate the total reward and reveals when shaping terms are being exploited"]
    },
    {
      stepNumber: 3,
      title: "Calibrate Reward Scale and Validate with Oracle Policy",
      description: "Before using the reward function for RL training, validate it against an oracle policy (a scripted or teleoperated controller that successfully completes the task). Run the oracle policy for 50 episodes and record the per-timestep reward, cumulative return, and success rate. Then run a random policy for 50 episodes and record the same metrics. Compute three diagnostic statistics: (1) Return gap: the difference between mean oracle return and mean random return. This should be at least 5x the standard deviation of the random return — if the gap is small, the reward function does not sufficiently distinguish good and bad behavior. (2) Reward monotonicity: for oracle episodes, compute the correlation between timestep and cumulative reward. It should be strongly positive (>0.8), indicating that the reward increases as the task progresses. Non-monotonic oracle rewards suggest conflicting shaping terms. (3) Per-component analysis: for each reward component, compare its contribution to total return in oracle vs. random episodes. Every shaping component should contribute more in oracle episodes.\n\nCalibrate the absolute reward scale. RL algorithms (especially PPO and SAC) are sensitive to reward magnitude. If the total per-step reward ranges from -100 to +100, the value function must estimate returns on a large scale, which can cause training instability. Normalize the reward so that a typical good-behavior step yields approximately +1 and a typical bad-behavior step yields approximately -1. The simplest approach: divide the entire reward by the standard deviation of per-step rewards observed during the oracle evaluation. Store this normalization constant and apply it consistently during training.\n\nIf the oracle evaluation reveals problems (low return gap, non-monotonicity, exploitable components), iterate on the reward design before running any RL training. Reward debugging at this stage is 10-100x cheaper than diagnosing the same issues through failed training runs.",
      tools: ["Oracle scripted policy", "wandb", "NumPy", "matplotlib"],
      tips: ["Record oracle evaluation videos alongside reward traces — watching a successful task with the reward plotted frame-by-frame is the most intuitive way to understand whether the reward captures your intent"]
    },
    {
      stepNumber: 4,
      title: "Train a Learned Reward Model from Human Preferences (Optional)",
      description: "For tasks where the success criterion is difficult to formalize (quality-of-motion judgments, aesthetic criteria, safety assessment), train a reward model from human preference data. This follows the RLHF (Reinforcement Learning from Human Feedback) paradigm.\n\nCollect preference data: generate pairs of trajectory segments (2-5 seconds each) from a partially trained policy, a random policy, and teleoperation demonstrations. Present each pair to human evaluators who select which segment shows better task progress. Use the Bradley-Terry preference model: P(segment_A > segment_B) = sigmoid(R(segment_A) - R(segment_B)), where R is the learned reward model. The model is trained to minimize the binary cross-entropy loss between predicted and actual preferences.\n\nArchitecture: for state-based reward models, use a 3-layer MLP (256-256-1) that takes the state vector as input and outputs a scalar reward. For vision-based reward models, use a pretrained ResNet-18 or ViT-S encoder followed by a 2-layer MLP head. The encoder can be frozen (if your visual domain is similar to ImageNet) or fine-tuned (for novel domains). Train with Adam optimizer, learning rate 1e-4, batch size 64, for 50-100 epochs on the preference dataset. Use 20% of preferences as a validation set and stop training when validation accuracy plateaus.\n\nValidation: compute the agreement between the learned reward model's ranking and held-out human preferences. Accuracy should exceed 75% for usable reward models. Also compute the correlation between the learned reward and the oracle success criterion (if available) — a well-trained reward model should assign higher rewards to successful trajectories. Visualize the reward model's output on 20 hand-selected trajectory segments covering common success and failure modes to verify it captures the intended criteria. If the reward model ranks obvious failures above successes, the preference data may contain noise — increase the annotator agreement threshold or collect more data.",
      tools: ["PyTorch", "Label Studio (for preference annotation)", "ResNet-18 or ViT-S", "wandb"],
      tips: ["Collect preferences from at least 3 annotators per pair and use majority vote — single-annotator preferences introduce substantial noise that degrades the reward model"]
    },
    {
      stepNumber: 5,
      title: "Train the RL Agent and Monitor for Reward Exploitation",
      description: "Run RL training with the designed (or learned) reward function and actively monitor for reward hacking. Use PPO (Proximal Policy Optimization) for discrete or low-dimensional action spaces and SAC (Soft Actor-Critic) for continuous high-dimensional action spaces. For manipulation tasks in simulation, SAC with automatic entropy tuning typically converges faster.\n\nConfigure training with these diagnostics enabled: log the total return per episode, the per-component reward breakdown per episode, the task success rate (computed using the boolean success criterion from Step 1, independent of the reward function), and video recordings of evaluation episodes every 10,000 steps. The critical diagnostic is the divergence between reward and success rate. In healthy training, both metrics increase together. If the return increases but success rate plateaus or decreases, the agent is exploiting the reward function — it has found a high-reward strategy that does not accomplish the task.\n\nCommon reward exploitation patterns in manipulation: (1) Approach exploitation — the agent learns to oscillate near the object, repeatedly approaching and retreating to accumulate the distance-based shaping reward without committing to a grasp. Fix: add a time penalty or replace the continuous distance reward with a one-time bonus for first reaching within 5cm of the object. (2) Grasp exploitation — the agent grasps the object and holds it without moving toward the goal, accumulating the grasp bonus indefinitely. Fix: make the grasp bonus a one-time reward (only awarded on the transition from not-grasped to grasped), not a per-step reward. (3) Lift exploitation — the agent lifts the object as high as possible to maximize the height reward without moving toward the goal. Fix: cap the lift reward at a maximum height (e.g., 20cm above the table) and activate the placement reward immediately upon first lift.\n\nWhen you detect reward exploitation, fix the reward function, retrain from scratch, and verify the fix. Do not attempt to fine-tune a policy trained on a broken reward — the policy has learned to exploit the reward, and this behavior is resistant to fine-tuning.",
      tools: ["stable-baselines3 (PPO, SAC)", "Isaac Gym or MuJoCo", "wandb", "Python"],
      tips: ["Always evaluate using the boolean success criterion, never using the reward function itself — the reward function is the hypothesis, the success criterion is the ground truth"]
    },
    {
      stepNumber: 6,
      title: "Validate and Transfer the Reward to Real Robot",
      description: "After successful training in simulation, validate the reward function's transferability to the real robot (if applicable). The sim-to-real reward gap is a common but underappreciated failure mode: a reward function that works perfectly in simulation may produce incorrect signals on a real robot due to sensor noise, calibration errors, and physics modeling inaccuracies.\n\nFor state-based rewards that depend on object poses: verify that your real-world object tracking system (AprilTags, visual tracking, or force-based estimation) provides poses in the same coordinate frame and units as the simulation. Run the oracle policy on the real robot for 10 episodes and compute the reward at each timestep using both the real sensor data and ground truth (measured with an external tracking system like OptiTrack or a calibrated overhead camera). The discrepancy between tracked and ground truth rewards quantifies the sensor-noise-induced reward error. If this error exceeds 20% of the inter-step reward variance, the reward signal is too noisy for learning — either improve the tracking system or switch to a learned vision-based reward that is more robust to per-frame noise.\n\nFor learned reward models: fine-tune on a small dataset of real-robot trajectory segments (50-200) with preference labels. The visual domain gap between simulation and real-world images can degrade vision-based reward models. Collect real-world preference data covering the same success/failure modes as the simulation training data. Fine-tune only the MLP head (freeze the vision encoder) with a small learning rate (1e-5) for 20 epochs. Validate on held-out real-world preferences.\n\nDocument the final reward function as a standalone Python module with: the reward computation function, all hyperparameters (weights, thresholds, normalization constants), the success criterion function, and a validation script that runs on recorded episodes and outputs per-component reward traces. This module becomes a reusable artifact that other team members can apply to new tasks by modifying the task-specific components while keeping the reward structure and validation framework.",
      tools: ["Python", "OptiTrack or AprilTag tracking", "Real robot platform", "PyTorch (for reward model fine-tuning)"],
      tips: ["Record real-robot episodes with synchronized reward traces and publish them as a reward function validation artifact — this helps the team debug reward issues months later when the original designer may not be available"]
    }
  ],
  keyPapers: [
    {
      id: "christiano-rlhf-2017",
      title: "Deep Reinforcement Learning from Human Preferences",
      authors: "Christiano et al.",
      venue: "NeurIPS 2017",
      year: 2017,
      url: "https://arxiv.org/abs/1706.03741"
    },
    {
      id: "ng-reward-shaping-1999",
      title: "Policy Invariance Under Reward Transformations: Theory and Application to Reward Shaping",
      authors: "Ng et al.",
      venue: "ICML 1999",
      year: 1999,
      url: "https://people.eecs.berkeley.edu/~pabbeel/cs287-fa09/readings/NgHaradaRussell-shaping-ICML1999.pdf"
    },
    {
      id: "shin-rlhf-robotics-2023",
      title: "Benchmarks and Algorithms for Offline Preference-Based Reward Learning",
      authors: "Shin et al.",
      venue: "ICLR 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2301.01392"
    },
    {
      id: "yu-eureka-2023",
      title: "Eureka: Human-Level Reward Design via Coding Large Language Models",
      authors: "Yu et al.",
      venue: "ICLR 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2310.12931"
    }
  ],
  claruRelevance: "Claru provides human preference annotation for training reward models in robot learning. Our annotators evaluate robot behavior video clips with calibrated protocols, delivering preference datasets ready for RLHF training. We also design and validate hand-crafted reward functions for manipulation tasks, leveraging experience across warehouse, kitchen, and industrial robotics domains.",
};

export default data;
