import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "reward-model",
  termSlug: "reward-model",
  category: "data-quality-pipelines",
  metaTitle: "Reward Models for Robot Learning — Definition | Claru",
  metaDescription: "Reward models are neural networks trained on human preferences to score robot behavior. Learn how they enable RLHF, their training data needs, and failure modes.",
  primaryKeyword: "reward model",
  secondaryKeywords: ["reward model robotics", "learned reward function", "preference-based reward", "reward model training", "RLHF reward model"],
  canonicalPath: "/glossary/reward-model",
  h1: "Reward Models: Learning What Good Robot Behavior Looks Like",
  heroSubtitle: "A reward model is a neural network trained on human preference annotations to predict a scalar quality score for AI-generated outputs. In robotics, reward models evaluate robot trajectories — scoring how well the robot performed a task based on criteria like motion smoothness, efficiency, safety, and task completion quality. Reward models are the critical component in RLHF that translates subjective human judgments into an optimizable training signal.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Reward Model", href: "/glossary/reward-model" },
  ],
  sections: [],
  faqs: [
    {
      question: "How is a reward model trained?",
      answer: "Reward models are trained on pairwise human preferences. Annotators view two robot trajectories (or text responses, or image outputs) and indicate which they prefer. The reward model learns to assign higher scalar scores to preferred outputs using the Bradley-Terry model: P(A preferred over B) = sigmoid(reward(A) - reward(B)). Training typically requires 5,000-20,000 preference pairs for a specific task domain. The model architecture is usually a vision encoder (for processing trajectory frames) followed by a temporal aggregation module and a scalar output head.",
    },
    {
      question: "What is reward hacking and how do you prevent it?",
      answer: "Reward hacking occurs when a policy finds behaviors that score highly on the reward model but are not genuinely preferred by humans. For example, a robot might learn to move its arm in a very specific pattern that exploits a reward model artifact rather than actually performing the task well. Prevention strategies include: KL-divergence penalties that keep the policy close to the base model, reward model ensembles that penalize behaviors where reward models disagree, and iterative RLHF where the reward model is retrained on the policy's actual behaviors.",
    },
    {
      question: "Can reward models generalize across tasks or robots?",
      answer: "Reward models have limited cross-task generalization because what constitutes good behavior depends on the task. A reward model for pick-and-place tasks cannot evaluate assembly quality. However, some reward dimensions transfer: motion smoothness, safety (collision avoidance), and efficiency (completing tasks quickly) are universal. Multi-task reward models trained on diverse task annotations can learn these transferable quality dimensions. Cross-robot transfer is possible when the visual perspective is similar.",
    },
  ],
  ctaHeading: "Need Human Evaluation Data for Reward Models?",
  ctaDescription: "Claru provides calibrated human preference annotations for training reward models that evaluate robot behavior quality.",
  relatedGlossaryTerms: ["rlhf", "preference-annotation", "data-quality-scoring", "behavioral-cloning", "imitation-learning"],
  relatedGuidePages: ["how-to-design-a-reward-function-for-robot-learning", "how-to-build-a-preference-dataset-for-rlhf"],
  relatedSolutionSlugs: ["preference-annotation-data"],
  longDefinition: `A reward model is a neural network that takes an input (a prompt, a state, or a task description) paired with an output (a text response, a robot trajectory, or an image) and produces a scalar reward score indicating how good the output is. In the RLHF pipeline, the reward model serves as a proxy for human judgment — an automated scoring function that can evaluate millions of outputs without requiring a human to review each one.

The fundamental insight behind reward models is that human preferences are easier to collect than absolute quality scores. Asking "which of these two robot trajectories is better?" produces more reliable annotations than asking "rate this trajectory from 1-10" because pairwise comparison eliminates the need for calibrated absolute scales. The reward model converts these relative judgments into absolute scores through the Bradley-Terry model, where the probability of preferring output A over B is modeled as sigmoid(r(A) - r(B)), with r being the learned reward function.

In robotics, reward models evaluate trajectory quality along dimensions that are difficult to formalize as mathematical reward functions. "Handle the object carefully" is a meaningful instruction to a human annotator but extremely difficult to express as an equation over joint positions and forces. A reward model trained on human preferences for careful handling learns to penalize high-velocity approaches, excessive grip force, and abrupt direction changes — all without anyone specifying these criteria explicitly.

The architecture of a robotics reward model typically processes a sequence of observation frames from the trajectory (sub-sampled to 10-30 frames), encodes each frame through a vision encoder, aggregates the frame features through a Transformer or LSTM to capture temporal dynamics, and outputs a single scalar reward through an MLP head. The vision encoder is usually pretrained (on ImageNet, CLIP, or robot-specific data) and may be frozen or fine-tuned depending on the size of the preference dataset.

Reward model accuracy is measured by agreement with held-out human preferences: what percentage of test preference pairs does the reward model predict correctly? For language models, state-of-the-art reward models achieve 70-80% agreement. For robotics, 65-75% is typical due to the higher complexity of evaluating physical behavior from video. An agreement rate above 60% (significantly better than random) is usually sufficient for effective RL optimization.`,

  historicalContext: `Learned reward functions have roots in inverse reinforcement learning (IRL), introduced by Russell (1998) and developed by Ng and Russell (2000). IRL infers a reward function from expert demonstrations — if the expert is optimal, the demonstrations reveal what the expert was trying to maximize. However, IRL requires a complete MDP model and is computationally expensive.

Christiano et al. (2017) introduced the modern reward model paradigm by training a reward function from human preference comparisons (rather than demonstrations) and using it to guide deep RL. Their approach was simpler than IRL, more scalable, and applicable to settings where demonstrations are unavailable but preferences are easy to collect. They demonstrated the approach on Atari games and MuJoCo locomotion.

The explosion of reward models came with InstructGPT (Ouyang et al., 2022), which trained a 6B-parameter reward model on 33,000 preference comparisons to align GPT-3 with human intent. This demonstrated that reward models could capture complex, multidimensional quality judgments (helpfulness, harmlessness, honesty) from relatively modest annotation budgets. Every major language model since (Claude, Gemini, Llama) uses reward models as part of its alignment pipeline.

Robotics reward models are a more recent development. Lee et al. (2021) used reward models for locomotion style transfer, training a reward model on human preferences for walking gaits. Shin et al. (2023) benchmarked preference-based reward learning for manipulation. The field is actively developing robotics-specific reward model architectures that process video trajectories rather than text, with attention to the temporal and spatial structure of physical behavior.`,

  practicalImplications: `Building an effective reward model for robotics requires careful design of the annotation interface, annotator training, and model architecture.

The annotation interface must present trajectory videos clearly and efficiently. Side-by-side synchronized playback at 1x speed, with controls for replay and slow-motion, is the standard format. Each comparison should take 15-30 seconds for the annotator to complete. The interface should also collect "tie" annotations (both trajectories are equally good/bad) and confidence ratings, which improve reward model training.

Annotator calibration is essential. Before the main annotation campaign, annotators should complete 50-100 calibration examples with known "correct" preferences. This ensures all annotators share the same understanding of what constitutes better behavior. For robotics, this means training annotators to recognize smooth versus jerky motions, efficient versus wasteful paths, safe versus risky grasp approaches, and successful versus nearly-successful task completions. Inter-annotator agreement (measured by Cohen's kappa or pairwise agreement rate) should be monitored continuously and should exceed 0.6 for usable preference data.

The size of the preference dataset depends on the complexity of the behavior being evaluated. For a single quality dimension (motion smoothness), 2,000-5,000 preference pairs suffice. For multidimensional evaluation (smoothness + efficiency + safety + task quality), 10,000-20,000 pairs are typical. Beyond 20,000 pairs, returns diminish for a specific task domain — the bottleneck shifts from data quantity to annotator consistency and the expressive capacity of the reward model architecture.

Reward model validation should use both automated metrics (preference prediction accuracy on held-out pairs) and qualitative evaluation (do the highest-scoring trajectories actually look good to humans?). A reward model can achieve high prediction accuracy while systematically misranking certain trajectory types. Qualitative review of the top-10 and bottom-10 scored trajectories catches these systematic errors.`,

  commonMisconceptions: [
    {
      misconception: "A reward model perfectly captures human preferences.",
      correction: "Reward models are noisy approximations of human preferences. They agree with held-out human judgments 65-80% of the time, meaning 20-35% of their predictions contradict what a human would prefer. This imprecision is why RL optimization against reward models must include regularization (KL penalty) — without it, the policy will find and exploit the 20-35% of cases where the reward model is wrong.",
    },
    {
      misconception: "More preference data always improves the reward model.",
      correction: "Reward model performance plateaus after sufficient data. Beyond the saturation point (typically 10,000-30,000 preference pairs for a specific domain), additional data from the same annotator pool provides diminishing returns. Improvements come from better annotator calibration, more diverse trajectory pairs for comparison, or architectural changes to the reward model — not from more annotations of similar quality.",
    },
    {
      misconception: "Reward models can replace task success labels.",
      correction: "Reward models evaluate behavior quality, not task success. A robot that smoothly and safely fails to pick up an object may score higher than a robot that clumsily succeeds. Reward models should be used in conjunction with binary task success labels, not as a replacement. The typical setup is: filter for task success first, then use the reward model to rank successful trajectories by quality.",
    },
  ],
  keyPapers: [
    {
      id: "christiano-rlhf-2017",
      title: "Deep Reinforcement Learning from Human Preferences",
      authors: "Christiano et al.",
      venue: "NeurIPS 2017",
      year: 2017,
      url: "https://arxiv.org/abs/1706.03741",
    },
    {
      id: "ouyang-instructgpt-2022",
      title: "Training Language Models to Follow Instructions with Human Feedback",
      authors: "Ouyang et al.",
      venue: "NeurIPS 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2203.02155",
    },
    {
      id: "lee-pebble-2021",
      title: "PEBBLE: Feedback-Efficient Interactive Reinforcement Learning via Relabeling Experience and Unsupervised Pre-training",
      authors: "Lee et al.",
      venue: "ICML 2021",
      year: 2021,
      url: "https://arxiv.org/abs/2106.05091",
    },
  ],
  claruRelevance: `Claru provides the human preference annotations that train robotics reward models. Our annotators are calibrated on robot behavior evaluation, trained to assess trajectory quality across multiple dimensions including motion smoothness, task efficiency, object handling care, and safety. With standardized annotation interfaces and continuous inter-annotator agreement monitoring, Claru delivers the preference data quality that determines whether a reward model captures genuine human preferences or noise.`,
};

export default data;
