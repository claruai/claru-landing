import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "action-chunking",
  termSlug: "action-chunking",
  category: "robotics-fundamentals",
  metaTitle: "Action Chunking for Robot Policies — Definition | Claru",
  metaDescription: "Action chunking predicts sequences of 8-32 future robot actions at once, reducing compounding errors in behavioral cloning. Learn the technique behind ACT and Diffusion Policy.",
  primaryKeyword: "action chunking",
  secondaryKeywords: ["action chunking robotics", "action chunk transformer", "ACT model", "multi-step action prediction", "temporal action prediction"],
  canonicalPath: "/glossary/action-chunking",
  h1: "Action Chunking: Multi-Step Action Prediction for Smoother Robot Control",
  heroSubtitle: "Action chunking is a technique where a robot policy predicts a sequence of K future actions (typically 8-32 timesteps) at once, rather than predicting a single action at each timestep. By committing to a coherent action plan and executing multiple steps before re-planning, action chunking reduces the compounding error problem that plagues single-step behavioral cloning and produces smoother, more temporally consistent robot motions.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Action Chunking", href: "/glossary/action-chunking" },
  ],
  sections: [],
  faqs: [
    {
      question: "What chunk size works best for manipulation tasks?",
      answer: "The optimal chunk size depends on the task's temporal structure and the control frequency. At 10 Hz control, chunks of 10-20 steps (1-2 seconds) work well for tabletop manipulation. At 50 Hz, chunks of 16-50 steps (0.3-1 second) are typical. The chunk should be long enough to cover a coherent sub-action (approach, grasp, lift) but short enough that the policy re-plans before the environment changes significantly. Zhao et al. (2023) used 100-step chunks at 50 Hz for bimanual manipulation in ACT. Diffusion Policy typically uses 8-32 step chunks at 10-20 Hz.",
    },
    {
      question: "How does action chunking solve the compounding error problem?",
      answer: "In single-step prediction, each prediction error shifts the robot to a slightly off-distribution state, causing the next prediction to be slightly worse, cascading over time. Action chunking mitigates this in two ways: (1) the model predicts a coherent multi-step plan that is internally consistent, so individual step errors are correlated rather than accumulating independently, and (2) temporal ensembling (averaging predictions from overlapping chunks) smooths out prediction noise. Empirically, chunking reduces effective error accumulation from quadratic (Ross et al., 2011) to approximately linear in the horizon.",
    },
    {
      question: "What is temporal ensembling with action chunking?",
      answer: "Temporal ensembling combines predictions from multiple overlapping chunks. At each timestep, the robot may have predictions from the current chunk and from previous chunks that extend to this timestep. By averaging (or weighted-averaging) these overlapping predictions, the robot smooths out noise and improves temporal consistency. Diffusion Policy uses a receding horizon approach where only the first N actions from each chunk are executed, then a new chunk is predicted. This creates natural ensembling and re-planning behavior.",
    },
  ],
  ctaHeading: "Need Training Data for Action Chunking Models?",
  ctaDescription: "Claru provides high-frequency teleoperation data with the temporal resolution and smoothness that action chunking architectures require.",
  relatedGlossaryTerms: ["behavioral-cloning", "diffusion-policy", "vla", "visuomotor-policy", "imitation-learning"],
  relatedGuidePages: ["how-to-create-action-chunked-dataset", "how-to-train-a-diffusion-policy"],
  relatedSolutionSlugs: ["manipulation-trajectory-data"],
  longDefinition: `Action chunking is a paradigm for robot policy prediction where the model outputs a sequence of K future actions at each decision point, rather than a single action. The robot then executes some or all of the predicted actions before querying the policy again for a new chunk. This approach was popularized by the ACT model (Action Chunking with Transformers) from Zhao et al. (2023) and is used by Diffusion Policy, pi-zero, and most modern manipulation policy architectures.

The theoretical motivation is to address compounding errors in behavioral cloning. When a policy predicts one action at a time, small prediction errors cause the robot to visit states slightly outside the training distribution. At these unfamiliar states, the next prediction is less accurate, creating a cascade where errors accumulate quadratically with the time horizon. Action chunking breaks this cascade by having the policy commit to a coherent multi-step plan: even if the starting state is slightly off-distribution, the predicted action sequence remains internally consistent, and the robot follows a smooth trajectory rather than accumulating independent errors.

Architecturally, action chunking changes the output layer of the policy from a single action vector to a matrix of shape (K, action_dim), where K is the chunk size. A policy with a 7-dimensional action space (x, y, z, roll, pitch, yaw, gripper) and chunk size 16 outputs 16 x 7 = 112 values at each prediction. The policy must learn temporal structure within the chunk — that the first few actions should approach the object, the middle actions should close the gripper, and the final actions should lift.

The execution strategy determines how chunks interact with the environment. In the simplest approach, the full chunk of K actions is executed open-loop, then a new chunk is predicted. This is efficient (the policy runs at 1/K the decision frequency) but cannot react to disturbances within a chunk. The receding-horizon approach executes only the first N < K actions from each chunk, then re-predicts a new chunk from the current observation. This provides reactivity (re-planning every N steps) while maintaining temporal consistency (each chunk is internally coherent). Most practical systems use N = K/4 to K/2.`,

  historicalContext: `Action chunking emerged from the intersection of two research threads: behavioral cloning for robotics and sequence prediction in deep learning.

The compounding error problem in behavioral cloning was formally characterized by Ross et al. (2011), who showed that error grows quadratically with the prediction horizon for single-step policies. This theoretical result motivated research into mitigations: DAgger addressed it through iterative data collection, while action chunking addresses it architecturally.

The direct predecessor of action chunking in robotics was multi-step prediction in model-based reinforcement learning, where dynamics models predict state trajectories and planners optimize over these predictions. Model-predictive control (MPC) frameworks like MPPI have long used multi-step prediction and receding-horizon execution. Action chunking brings this same principle to model-free imitation learning.

Zhao et al. (2023) formalized action chunking in the ACT (Action Chunking with Transformers) paper, demonstrating that a Transformer policy with CVAE-based action chunking could learn complex bimanual manipulation tasks from just 50 demonstrations. ACT used chunk sizes of 100 steps at 50 Hz, committing to 2-second action plans. The combination of action chunking with a conditional variational autoencoder (CVAE) allowed the model to handle multimodal action distributions while maintaining temporal coherence.

Chi et al. (2023) independently used action chunking in Diffusion Policy, where the denoising process generates a full action chunk rather than a single action. The chunk size in Diffusion Policy (typically 8-32 steps) is smaller than ACT's but paired with a more powerful generative model. Since 2023, essentially all state-of-the-art manipulation policy architectures use some form of action chunking.`,

  practicalImplications: `Data collection for action chunking models requires attention to temporal consistency and recording frequency that goes beyond standard behavioral cloning data.

The recording frequency must match or exceed the control frequency. If the policy will operate at 20 Hz with 16-step chunks, the data must be recorded at 20 Hz or higher. Down-sampling from higher frequencies is acceptable (record at 50 Hz, down-sample to 20 Hz for training), but up-sampling from lower frequencies introduces interpolation artifacts. Record at the highest practical frequency and down-sample during data loading.

Demonstration quality requirements are stricter for chunking models because the policy must learn temporal patterns within chunks. Demonstrations with frequent stops, reversals, or hesitations create inconsistent chunk targets — the model cannot learn a coherent multi-step plan from data where the demonstrator constantly changes direction. Operators should be trained to execute smooth, committed motions. Filtering demonstrations by trajectory smoothness metrics (jerk, velocity variance) is particularly important for chunking architectures.

Chunk size is a critical hyperparameter. Too small (2-4 steps) and the chunking provides little benefit over single-step prediction. Too large (100+ steps at low control frequencies) and the policy cannot react to disturbances within a chunk. The optimal chunk size correlates with the typical duration of coherent sub-actions in the task. For tabletop pick-and-place at 10 Hz, 16-step chunks (1.6 seconds) cover the approach-grasp-lift sequence well. For longer tasks, shorter chunks with receding-horizon execution provide the right balance of coherence and reactivity.

The data format must preserve exact temporal ordering and synchronization within episodes. Action chunks are extracted from consecutive timesteps in the training data, so any temporal misalignment between observation and action timestamps corrupts the chunk targets. This is more damaging than for single-step BC because the error propagates across the entire chunk length.`,

  commonMisconceptions: [
    {
      misconception: "Action chunking is just predicting multiple actions independently.",
      correction: "Action chunking predicts a coherent sequence where each action is conditioned on the preceding actions within the chunk. The model learns temporal structure — that an approach motion should be followed by a grasp, then a lift. Independent multi-action prediction would lose this temporal coherence and produce jerky, inconsistent motions. Both ACT and Diffusion Policy generate chunks as coupled sequences, not independent predictions.",
    },
    {
      misconception: "Larger chunk sizes always produce better performance.",
      correction: "There is an optimal chunk size that balances temporal coherence against reactivity. Chunks that are too large commit the robot to plans that cannot adapt to environmental changes (objects being moved, unexpected obstacles). On the ACT benchmark, chunk sizes of 50-100 at 50 Hz control outperformed both smaller (10-step) and larger (200-step) chunks. The optimal size depends on the task horizon, control frequency, and how dynamic the environment is.",
    },
    {
      misconception: "Action chunking requires specialized data collection protocols.",
      correction: "Action chunking uses standard teleoperation data — the same observation-action pairs collected for single-step behavioral cloning. The chunking is an architectural choice in the model, not a data collection requirement. However, data quality requirements are stricter: smooth, temporally consistent demonstrations produce better action chunks than jerky, hesitant demonstrations. This means operator training and quality filtering matter more for chunking models.",
    },
  ],
  keyPapers: [
    {
      id: "zhao-act-2023",
      title: "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware",
      authors: "Zhao et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2304.13705",
    },
    {
      id: "chi-diffusion-policy-2023",
      title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
      authors: "Chi et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2303.04137",
    },
    {
      id: "ross-compounding-errors-2011",
      title: "A Reduction of Imitation Learning and Structured Prediction to No-Regret Online Learning",
      authors: "Ross et al.",
      venue: "AISTATS 2011",
      year: 2011,
      url: "https://arxiv.org/abs/1011.0686",
    },
  ],
  claruRelevance: `Claru's teleoperation data is collected with the temporal quality standards that action chunking architectures demand. Our operators are trained to produce smooth, committed motions without unnecessary hesitations, and our recording pipelines capture all sensor streams at 30-50 Hz with verified temporal synchronization.

For teams training ACT, Diffusion Policy, or VLA models with action chunking, Claru delivers demonstrations where the temporal structure within every potential chunk is clean — approach, grasp, and manipulation phases flow naturally without the stops and restarts that corrupt chunk-level training targets.`,
};

export default data;
