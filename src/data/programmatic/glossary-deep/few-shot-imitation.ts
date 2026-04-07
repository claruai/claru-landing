import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "few-shot-imitation",
  termSlug: "few-shot-imitation",
  category: "robotics-fundamentals",
  metaTitle: "Few-Shot Imitation Learning — Definition & Data | Claru",
  metaDescription: "Few-shot imitation learning enables robots to acquire new skills from just a handful of demonstrations. Learn data strategies and architectures.",
  primaryKeyword: "few-shot imitation learning",
  secondaryKeywords: ["few-shot robot learning", "low-data imitation", "meta-learning robotics", "one-shot task learning robot"],
  canonicalPath: "/glossary/few-shot-imitation",
  h1: "Few-Shot Imitation: Learning New Tasks from Minimal Demonstrations",
  heroSubtitle: "Few-shot imitation learning enables a robot to acquire a new manipulation skill from as few as 1-10 demonstrations, compared to the hundreds or thousands typically required by standard behavioral cloning. This capability is essential for deploying robots in dynamic environments where new tasks emerge frequently.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Few-Shot Imitation", href: "/glossary/few-shot-imitation" },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Is Few-Shot Imitation Learning?",
      paragraphs: [
        "Few-shot imitation learning is a paradigm where a robot policy learns to perform a new task from a very small number of demonstrations — typically 1 to 10. This contrasts with standard behavioral cloning, which requires hundreds or thousands of demonstrations per task. The 'few-shot' qualifier comes from the broader machine learning concept of few-shot learning, where models generalize from limited examples by leveraging prior knowledge acquired during pretraining.",
        "The technical approach typically involves two phases: a pretraining phase on a large, diverse dataset of many tasks, and an adaptation phase where the pretrained model is conditioned on a few demonstrations of a new target task. During pretraining, the model learns general manipulation primitives, visual representations, and motor skills shared across tasks. During adaptation, the model uses the provided demonstrations as context to specialize its behavior for the specific task without full retraining.",
        "Two main architectural approaches dominate few-shot imitation. Meta-learning methods like MAML (Model-Agnostic Meta-Learning) explicitly optimize the pretraining phase so that a few gradient steps on new task demonstrations produce a high-quality policy. In-context learning methods, used by modern Transformer-based policies, treat the few demonstrations as additional context tokens that condition the policy's predictions without any gradient updates at all. The latter approach is becoming dominant because it requires no optimization at test time — the demonstrations are simply prepended to the observation history.",
      ],
    },
    {
      type: "stats",
      heading: "Few-Shot Imitation at a Glance",
      stats: [
        { value: "1-10", label: "Demonstrations for new task" },
        { value: "MAML", label: "Classic meta-learning method" },
        { value: "100x", label: "Data reduction vs standard BC" },
        { value: "In-context", label: "Dominant modern approach" },
        { value: "2017", label: "MAML introduced (Finn et al.)" },
        { value: "VLA", label: "Architecture enabling few-shot" },
      ],
    },
    {
      type: "prose",
      heading: "Pretraining Data for Few-Shot Generalization",
      paragraphs: [
        "The quality and diversity of pretraining data is the primary determinant of few-shot imitation performance. A model pretrained on 50 manipulation tasks generalizes better to new tasks in few-shot settings than a model pretrained on 5 tasks, even if the total number of demonstrations is the same. Task diversity during pretraining teaches the model what constitutes a 'task' and how to extract task-relevant features from a small number of demonstrations.",
        "Effective pretraining datasets for few-shot imitation should cover diverse objects (varying geometry, material, weight), diverse actions (reaching, grasping, placing, pushing, pulling, rotating), diverse environments (table heights, background clutter, lighting conditions), and diverse task goals (sorting, stacking, inserting, pouring). Each task should have multiple demonstrations showing natural variation in execution strategy, so the model learns to identify the invariant task structure from variable execution details.",
        "The RLDS format used by Open X-Embodiment provides a natural structure for few-shot pretraining data: each episode is tagged with a task description, enabling the model to group demonstrations by task during training. For few-shot evaluation, held-out tasks with their demonstrations serve as the test set. Claru's multi-task demonstration datasets are collected with explicit task labeling and sufficient per-task variation to support both standard and few-shot training paradigms.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Few-Shot Methods Compared",
      description: "How different few-shot imitation learning approaches handle the adaptation to new tasks.",
      columns: ["Method", "Adaptation Mechanism", "Pretrain Data", "Adaptation Cost", "Notable Work"],
      rows: [
        { Method: "MAML", "Adaptation Mechanism": "Few gradient steps", "Pretrain Data": "Multi-task episodes", "Adaptation Cost": "Minutes (fine-tune)", "Notable Work": "Finn et al. 2017" },
        { Method: "In-context learning", "Adaptation Mechanism": "Demonstration conditioning", "Pretrain Data": "Large multi-task", "Adaptation Cost": "Zero (no gradient)", "Notable Work": "Mandi et al. 2024" },
        { Method: "Task embeddings", "Adaptation Mechanism": "Learned task vectors", "Pretrain Data": "Multi-task with labels", "Adaptation Cost": "Seconds (encode demos)", "Notable Work": "James et al. 2018" },
        { Method: "Retrieval-augmented", "Adaptation Mechanism": "Similar demo retrieval", "Pretrain Data": "Large diverse dataset", "Adaptation Cost": "Zero (nearest neighbor)", "Notable Work": "Du et al. 2023" },
      ],
    },
    {
      type: "prose",
      heading: "Practical Deployment Considerations",
      paragraphs: [
        "Few-shot imitation is most valuable in settings where tasks change frequently and collecting hundreds of demonstrations per task is impractical. Manufacturing lines that switch between product variants, warehouse operations handling diverse inventory, and assistive robots adapting to individual user preferences all benefit from few-shot capability. The economic argument is straightforward: if a new task requires 5 demonstrations instead of 500, the deployment cost for each new task drops by two orders of magnitude.",
        "The primary limitation of few-shot imitation is that performance on the new task is typically lower than what could be achieved with full-scale data collection. A policy adapted from 5 demonstrations might achieve 70% success rate where 500 demonstrations would yield 95%. For safety-critical tasks (surgical assistance, heavy payload manipulation), this gap may be unacceptable. For lower-stakes tasks (sorting, organizing, simple pick-and-place), the trade-off between data cost and performance is often favorable.",
        "Demonstration quality matters even more in the few-shot setting than in standard behavioral cloning. When the model has only 5 examples to learn from, each one carries significant weight. A single poor demonstration can disproportionately degrade performance. Few-shot demonstrations should be collected by skilled operators under controlled conditions, with careful verification that each demonstration successfully completes the task and represents a clean, efficient execution strategy.",
      ],
    },
    {
      type: "citation-list",
      heading: "Key References",
      citations: [
        {
          id: "finn-maml-2017",
          title: "Model-Agnostic Meta-Learning for Fast Adaptation of Deep Networks",
          authors: "Finn et al.",
          venue: "ICML 2017",
          year: 2017,
          url: "https://arxiv.org/abs/1703.03400",
        },
        {
          id: "duan-oneshot-2017",
          title: "One-Shot Imitation Learning",
          authors: "Duan et al.",
          venue: "NeurIPS 2017",
          year: 2017,
          url: "https://arxiv.org/abs/1703.07326",
        },
        {
          id: "mandi-robobuf-2024",
          title: "RoboAgent: Generalization and Efficiency in Robot Manipulation via Semantic Augmentations and Action Chunking",
          authors: "Mandi et al.",
          venue: "ICRA 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2309.01918",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "How many demonstrations do I need for few-shot imitation to work?",
      answer: "Most few-shot imitation systems work with 1-10 demonstrations of the new task. The exact number depends on task complexity: simple pick-and-place may work with 1-3 demonstrations, while tasks with precise orientation requirements or multi-step sequences typically need 5-10. The quality of demonstrations matters more than quantity in this regime.",
    },
    {
      question: "Does few-shot imitation require a large pretraining dataset?",
      answer: "Yes. Few-shot imitation trades upfront data collection cost for per-task efficiency. The pretraining phase requires a diverse multi-task dataset — typically thousands of demonstrations across dozens of tasks. The payoff comes when deploying to many new tasks, each requiring only a few demonstrations. If you only need one or two tasks total, standard behavioral cloning with moderate data is more practical.",
    },
    {
      question: "Can few-shot imitation work across different robot platforms?",
      answer: "When combined with cross-embodiment transfer techniques, yes. A model pretrained on diverse tasks across multiple robot platforms can adapt to a new task on a new robot from just a few demonstrations. This requires the pretraining data to include cross-embodiment diversity and the action space to be normalized (typically end-effector space).",
    },
    {
      question: "What is the difference between few-shot and zero-shot imitation?",
      answer: "Few-shot imitation provides the model with 1-10 demonstrations of the target task during deployment. Zero-shot imitation provides no task demonstrations — the task is specified entirely through language instructions or goal images. Few-shot typically achieves higher success rates because the demonstrations provide concrete examples of the desired behavior, while zero-shot relies entirely on the model's ability to interpret abstract task specifications.",
    },
  ],
  ctaHeading: "Need Multi-Task Pretraining Data?",
  ctaDescription: "Claru provides diverse multi-task demonstration datasets with explicit task labeling, enabling few-shot imitation learning from minimal new demonstrations.",
  relatedGlossaryTerms: ["behavioral-cloning", "imitation-learning", "zero-shot-generalization", "foundation-model-robotics", "action-chunking"],
  relatedGuidePages: ["how-to-collect-teleoperation-data"],
  relatedSolutionSlugs: ["manipulation-trajectory-data"],
  longDefinition: "Few-shot imitation learning is a paradigm in robot learning where a policy acquires new manipulation skills from as few as 1-10 demonstrations. This capability requires extensive pretraining on a diverse multi-task dataset, during which the model learns general manipulation primitives and the ability to extract task-relevant information from a small number of examples.\n\nThe mathematical formulation varies by approach. In meta-learning (MAML), the pretraining objective explicitly optimizes for fast adaptation: the loss function measures performance after a small number of gradient updates on new task data, encouraging the model to learn initializations that are maximally sensitive to new task information. In in-context learning, the demonstrations are simply included as conditioning context in the Transformer's input sequence, and the model learns during pretraining to attend to these demonstrations for task-relevant information.\n\nFew-shot imitation represents a practical sweet spot between zero-shot generalization (which requires no new task demonstrations but achieves lower performance) and full behavioral cloning (which achieves high performance but requires extensive data collection for each new task). For organizations deploying robots across many tasks, few-shot imitation reduces the per-task deployment cost by 10-100x while maintaining reasonable performance levels.",
  historicalContext: "The concept of few-shot imitation emerged from the convergence of two research threads: meta-learning and imitation learning. Finn et al. (2017) introduced MAML, demonstrating that neural networks could be meta-trained to adapt rapidly to new tasks from minimal data. Duan et al. (2017) directly addressed one-shot imitation learning for block stacking, showing that a model trained on diverse demonstrations could replicate new configurations from a single example.\n\nThe field matured significantly with the advent of large-scale pretrained models. As vision-language models demonstrated few-shot learning capabilities in NLP and computer vision, researchers applied similar principles to robotics. James et al. (2018) showed that task-conditioned policies pretrained on RLBench could adapt to new tasks with few demonstrations. Yu et al. (2018) with Meta-World provided a standardized benchmark for evaluating few-shot and multi-task learning in manipulation.\n\nThe most recent advance is in-context few-shot learning, where Transformer-based robot policies process demonstrations as context tokens without any gradient-based adaptation. This mirrors the in-context learning capability of large language models and eliminates the computational cost of test-time fine-tuning.",
  practicalImplications: "For practitioners, few-shot imitation learning shifts the data collection bottleneck from per-task demonstrations to pretraining dataset diversity. The upfront investment in a diverse multi-task pretraining dataset pays dividends across every subsequent new task. Organizations should focus their data collection budget on maximizing the number of distinct tasks in the pretraining set rather than maximizing demonstrations per task.\n\nThe quality of few-shot demonstrations is critical. Each of the 1-10 demonstrations carries outsized influence on the adapted policy's behavior. Demonstrations should be collected by skilled operators, verified for task completion, and reviewed for execution quality. Providing demonstrations with natural variation (slightly different starting positions, different grasp orientations) is better than providing near-identical demonstrations, as variation helps the model identify the task-invariant components.\n\nClaru supports few-shot imitation workflows by providing pre-collected multi-task datasets in standardized formats. These datasets cover diverse manipulation tasks with task-level labeling, enabling direct use as pretraining data. For the few-shot adaptation phase, Claru can also provide small batches of high-quality demonstrations for specific target tasks, collected by trained operators under controlled conditions.",
  commonMisconceptions: [
    {
      misconception: "Few-shot imitation means you need very little data overall.",
      correction: "Few-shot refers only to the number of demonstrations needed for each new task. The pretraining phase requires a large, diverse dataset — often thousands of demonstrations across dozens of tasks. The total data requirement may be similar to or larger than standard approaches, but the per-task cost for new tasks is dramatically lower.",
    },
    {
      misconception: "Any pretrained model can do few-shot imitation with fine-tuning.",
      correction: "Effective few-shot imitation requires the pretraining to be structured for rapid adaptation. Models pretrained on a single task, even with abundant data, may not adapt well to new tasks from few examples. The pretraining must expose the model to diverse tasks so it learns general manipulation primitives and the ability to extract task structure from demonstrations.",
    },
    {
      misconception: "Few-shot imitation achieves the same performance as full behavioral cloning.",
      correction: "Few-shot adapted policies typically achieve 60-80% of the performance of policies trained on hundreds of demonstrations. This gap is acceptable for many applications but may be insufficient for safety-critical or precision tasks. The trade-off is between deployment speed and peak performance.",
    },
  ],
  keyPapers: [
    {
      id: "finn-maml-2017",
      title: "Model-Agnostic Meta-Learning for Fast Adaptation of Deep Networks",
      authors: "Finn et al.",
      venue: "ICML 2017",
      year: 2017,
      url: "https://arxiv.org/abs/1703.03400",
    },
    {
      id: "duan-oneshot-2017",
      title: "One-Shot Imitation Learning",
      authors: "Duan et al.",
      venue: "NeurIPS 2017",
      year: 2017,
      url: "https://arxiv.org/abs/1703.07326",
    },
    {
      id: "mandi-robobuf-2024",
      title: "RoboAgent: Generalization and Efficiency in Robot Manipulation via Semantic Augmentations and Action Chunking",
      authors: "Mandi et al.",
      venue: "ICRA 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2309.01918",
    },
  ],
  claruRelevance: "Claru provides the diverse multi-task pretraining datasets that few-shot imitation learning requires, with explicit task labeling across hundreds of manipulation tasks. For the adaptation phase, Claru delivers small batches of high-quality demonstrations collected by skilled operators under controlled conditions.",
};

export default data;
