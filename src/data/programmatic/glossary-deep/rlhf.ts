import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "rlhf",
  termSlug: "rlhf",
  category: "data-quality-pipelines",
  metaTitle: "RLHF (Reinforcement Learning from Human Feedback) | Claru",
  metaDescription: "RLHF uses human preference annotations to train reward models that align AI systems with human intent. Learn the three-phase pipeline and data requirements.",
  primaryKeyword: "RLHF",
  secondaryKeywords: ["reinforcement learning human feedback", "RLHF training data", "human preference annotation", "reward model training", "RLHF robotics"],
  canonicalPath: "/glossary/rlhf",
  h1: "RLHF: Aligning AI With Human Preferences Through Feedback",
  heroSubtitle: "Reinforcement Learning from Human Feedback (RLHF) is a training paradigm where human annotators evaluate AI outputs, their preferences are used to train a reward model, and this reward model guides reinforcement learning to produce outputs that humans prefer. RLHF was central to the development of ChatGPT and Claude, and is now being applied to robotics to train policies that produce human-preferred behavior.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "RLHF", href: "/glossary/rlhf" },
  ],
  sections: [],
  faqs: [
    {
      question: "How many preference annotations does RLHF require?",
      answer: "For language model alignment, InstructGPT used approximately 50,000 preference comparisons. Claude's training reportedly uses hundreds of thousands. For robotics applications, the annotation volume is typically smaller because the output space is more constrained: 5,000-20,000 trajectory comparisons can train an effective reward model for a specific manipulation task family. The critical factor is annotator quality — preferences from domain experts who understand robot behavior produce better reward models than preferences from crowdworkers unfamiliar with robotics.",
    },
    {
      question: "What is the difference between RLHF and DPO?",
      answer: "RLHF trains a separate reward model from human preferences, then uses PPO (Proximal Policy Optimization) to fine-tune the policy against that reward model. DPO (Direct Preference Optimization) skips the reward model and directly optimizes the policy from preference data by reformulating the RLHF objective as a supervised learning problem. DPO is simpler to implement and more stable to train but may produce less capable models for complex tasks. In robotics, RLHF with an explicit reward model is more common because the reward model can be reused across policies and embodiments.",
    },
    {
      question: "How is RLHF applied in robotics specifically?",
      answer: "In robotics, RLHF trains reward models that evaluate trajectory quality. Human annotators watch video of robot behavior and compare pairs of trajectories, indicating which execution is better (smoother, more efficient, more careful with objects). The learned reward model then guides policy optimization. This is particularly valuable for tasks where success criteria are subjective or hard to formalize — like 'handle fragile objects carefully' or 'move naturally' — where handcrafted reward functions fail to capture human intent.",
    },
    {
      question: "What are the main failure modes of RLHF?",
      answer: "Common failure modes include: reward hacking (the policy finds behaviors that score highly on the reward model but are not genuinely preferred by humans), distributional shift (the reward model is inaccurate on policy behaviors far from the training distribution), annotator disagreement (different humans prefer different behaviors, making the reward model a noisy average), and overoptimization (training too aggressively against the reward model produces degenerate behavior). Mitigation strategies include KL-divergence penalties, reward model ensembles, and iterative RLHF where the reward model is updated as the policy improves.",
    },
  ],
  ctaHeading: "Need Human Preference Data?",
  ctaDescription: "Claru provides expert human evaluation and preference annotation for training reward models that align robot behavior with human intent.",
  relatedGlossaryTerms: ["reward-model", "preference-annotation", "behavioral-cloning", "data-quality-scoring", "imitation-learning"],
  relatedGuidePages: ["how-to-build-a-preference-dataset-for-rlhf", "how-to-design-a-reward-function-for-robot-learning"],
  relatedSolutionSlugs: ["preference-annotation-data"],
  longDefinition: `Reinforcement Learning from Human Feedback (RLHF) is a three-phase training procedure that aligns AI models with human preferences. In the first phase, a base model is trained through supervised learning on demonstration data (for language models, this is instruction following; for robots, this is behavioral cloning from demonstrations). In the second phase, a reward model is trained on human preference annotations — pairs of outputs where a human indicates which is better. In the third phase, the base model is fine-tuned using reinforcement learning (typically PPO) to maximize the reward model's score while staying close to the base model through a KL-divergence penalty.

The preference annotation format is critical: annotators are shown two candidate outputs (two text responses, two robot trajectory videos, two image generations) and asked which they prefer. This pairwise comparison format is psychologically easier and more reliable than absolute quality ratings because humans are better at relative judgments than calibrated absolute scores. The resulting preference dataset consists of triples (input, preferred_output, rejected_output).

The reward model is a neural network that takes an (input, output) pair and predicts a scalar reward. It is trained on the preference dataset using the Bradley-Terry model: the probability of preferring output A over output B is modeled as a sigmoid of the reward difference. This training objective ensures the reward model assigns higher scores to human-preferred outputs and can generalize to score novel outputs not seen during annotation.

For robotics, RLHF addresses a fundamental limitation of imitation learning: demonstration data shows what behavior is acceptable, but not which behavior is optimal. A robot that has learned to grasp objects through behavioral cloning may succeed at grasping but do so clumsily, slowly, or in ways that feel unnatural to human observers. RLHF provides the mechanism to refine behavior beyond mere task completion toward human-preferred execution quality, efficiency, and safety.

The application of RLHF to robotics differs from its application to language models in several ways. Robot trajectories are continuous, temporal, and embodied — annotators must watch video of physical behavior rather than reading text. The evaluation criteria are often multimodal (was the grasp stable? was the motion smooth? was the object handled carefully?). And the RL optimization must produce physically feasible actions, adding constraints that language model RLHF does not face.`,

  historicalContext: `The intellectual foundations of RLHF trace to the preference-based reinforcement learning literature of the 2000s. Akrour et al. (2012) and Wirth et al. (2016) developed RL algorithms that learn from preference feedback rather than numeric rewards. However, these methods were limited to simple, low-dimensional control tasks.

The practical breakthrough came from Christiano et al. (2017) at OpenAI, who demonstrated "Deep Reinforcement Learning from Human Preferences" on Atari games and MuJoCo locomotion tasks. Their key insight was that a neural network reward model could learn complex preference functions from a moderate number of human comparisons, and that this learned reward was sufficient to guide RL training to human-preferred behavior. This paper established the three-phase RLHF pipeline used today.

OpenAI's InstructGPT (Ouyang et al., 2022) applied RLHF to align GPT-3 with human instructions, demonstrating that RLHF dramatically improves language model helpfulness and safety. This paper made RLHF famous in the broader AI community and established it as the standard alignment technique for foundation models. Anthropic's Constitutional AI (Bai et al., 2022) extended RLHF with AI-generated feedback, reducing the annotation burden.

The application of RLHF to robotics accelerated in 2023-2024. Shin et al. (2023) applied RLHF to robot manipulation, showing that human preferences over trajectory videos could train reward models that improve grasp quality beyond what behavioral cloning achieves. Google's RLHF work on RT models demonstrated that preference feedback improves manipulation efficiency and naturalness. The field is now converging on a paradigm where imitation learning provides the behavioral foundation and RLHF refines it toward human-preferred execution quality.`,

  practicalImplications: `Implementing RLHF for a robotics project requires designing the annotation interface, training the reward model, and running the RL optimization loop.

The annotation interface must present trajectory pairs clearly. For robot manipulation, this means side-by-side video playback at synchronized speed, with the option to replay, slow down, and annotate specific moments. Annotators need clear criteria: prefer the trajectory that is smoother, more efficient, safer, or more natural. Ambiguous criteria produce noisy preferences that degrade reward model quality. Providing 3-5 specific evaluation axes (speed, smoothness, success, safety, naturalness) and aggregating them into a single preference is more reliable than asking for a holistic judgment.

Annotator selection is critical for robotics RLHF. Unlike text evaluation where anyone literate can provide preferences, robot behavior evaluation requires understanding what constitutes good robot motion. Annotators should understand that jerky motions are bad (they stress actuators), that approaching objects too fast is dangerous, and that excessive hesitation wastes cycle time. Training annotators on 50-100 calibration examples before the main annotation campaign significantly improves inter-annotator agreement.

The reward model architecture for robotics typically uses a vision encoder (pretrained on robot data or egocentric video) to process trajectory frames, a temporal aggregation module (Transformer or LSTM) to capture the trajectory-level structure, and an MLP head to output a scalar reward. Training on 5,000-20,000 preference pairs typically produces a reward model with 70-80% agreement with held-out human preferences, which is sufficient for effective RL optimization.

The RL optimization phase is the most computationally expensive. PPO requires generating trajectories from the current policy, scoring them with the reward model, and updating the policy. For real robots, this must be done in simulation (with sim-to-real adaptation) because PPO requires thousands of trajectories per update. For VLA models, the RL fine-tuning can operate on the action head while keeping the vision-language backbone frozen, reducing computational cost.`,

  commonMisconceptions: [
    {
      misconception: "RLHF is only useful for language models, not for robotics.",
      correction: "RLHF is directly applicable to robotics for any behavior where human preferences are meaningful. Grasp quality, motion smoothness, execution efficiency, and careful object handling are all qualities that humans can evaluate but that are difficult to capture in hand-coded reward functions. Multiple research groups (Google, Stanford, UC Berkeley) have demonstrated that RLHF improves robot manipulation quality beyond what behavioral cloning alone achieves.",
    },
    {
      misconception: "More preference annotations always improve the reward model.",
      correction: "Reward model accuracy plateaus after a certain amount of data, typically 10,000-30,000 preference pairs for a specific task domain. Beyond this point, the bottleneck shifts to annotator quality and consistency rather than data quantity. A reward model trained on 10,000 high-quality preferences from expert annotators outperforms one trained on 50,000 noisy preferences from untrained crowdworkers. Investing in annotator training and calibration produces better returns than scaling annotation volume.",
    },
    {
      misconception: "RLHF replaces the need for demonstration data.",
      correction: "RLHF refines behavior but does not teach basic skills. A robot must first learn to grasp objects through imitation learning before RLHF can improve how it grasps. The base policy from demonstrations provides the behavioral repertoire; RLHF shifts the distribution toward human-preferred behaviors within that repertoire. Attempting RLHF without a solid behavioral cloning foundation produces random exploration rather than refined skill execution.",
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
      id: "rafailov-dpo-2023",
      title: "Direct Preference Optimization: Your Language Model is Secretly a Reward Model",
      authors: "Rafailov et al.",
      venue: "NeurIPS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2305.18290",
    },
    {
      id: "shin-rlhf-robotics-2023",
      title: "Benchmarks and Algorithms for Offline Preference-Based Reward Learning",
      authors: "Shin et al.",
      venue: "arXiv 2301.01392",
      year: 2023,
      url: "https://arxiv.org/abs/2301.01392",
    },
  ],
  claruRelevance: `Claru provides human preference annotation services specifically designed for RLHF in robotics. Our annotators are trained to evaluate robot behavior across multiple quality dimensions — motion smoothness, execution efficiency, object handling care, and task completion quality — producing the calibrated preference data that trains effective reward models.

For teams building RLHF pipelines, Claru handles the full annotation workflow: interface design, annotator training and calibration, preference collection with quality controls, and inter-annotator agreement monitoring. Our experience with 3M+ completed annotations means we understand the annotation design choices that produce reliable preference signals versus noisy ones.`,
};

export default data;
