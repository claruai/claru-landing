import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "active-learning",
  termSlug: "active-learning",
  category: "data-quality-pipelines",
  metaTitle: "Active Learning for Robotics — Definition & Guide | Claru",
  metaDescription: "Active learning selects the most informative data points for annotation, reducing labeling costs by 40-80%. Learn query strategies, robotics applications, and implementation.",
  primaryKeyword: "active learning",
  secondaryKeywords: ["active learning robotics", "query strategy", "uncertainty sampling", "pool-based active learning", "active learning annotation"],
  canonicalPath: "/glossary/active-learning",
  h1: "Active Learning: Smarter Annotation for Robot Training Data",
  heroSubtitle: "Active learning is a machine learning paradigm where the model selects which unlabeled data points should be annotated next, rather than labeling data uniformly at random. By querying an oracle (typically a human annotator) for labels on the most informative examples, active learning reduces annotation costs by 40-80% compared to passive random sampling while achieving equivalent model performance.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Active Learning", href: "/glossary/active-learning" },
  ],
  sections: [],
  faqs: [
    {
      question: "How much annotation budget does active learning save in robotics?",
      answer: "In practice, active learning reduces annotation costs by 40-80% for perception tasks (object detection, segmentation) and 30-60% for trajectory labeling tasks. The savings depend on the data distribution: highly redundant datasets (e.g., warehouse surveillance footage with repetitive scenes) see the largest gains because active learning avoids labeling near-duplicate frames. Diverse datasets with few redundancies see smaller but still meaningful savings of 30-40%.",
    },
    {
      question: "What query strategies work best for robotics data?",
      answer: "For perception tasks (object detection, segmentation), uncertainty sampling and Bayesian disagreement perform well. For trajectory quality assessment, expected model change tends to outperform uncertainty methods because trajectory quality is harder to model probabilistically. For active data collection (deciding where to send a robot to gather new demonstrations), information gain and coverage-based strategies work best because they optimize for environmental diversity rather than model uncertainty.",
    },
    {
      question: "Can active learning be applied during robot data collection, not just annotation?",
      answer: "Yes, and this is an active research area. Active data collection uses model uncertainty to decide which tasks, environments, or configurations need more demonstrations. If the policy is uncertain about a particular object arrangement, the system prioritizes collecting demonstrations in that configuration. Google's MT-Opt (2021) demonstrated this for large-scale robotic grasping. The key challenge is that data collection is much more expensive than annotation, so the query strategy must be highly accurate.",
    },
    {
      question: "What is the difference between active learning and curriculum learning?",
      answer: "Active learning selects which data to label; curriculum learning determines the order in which already-labeled data is presented during training. They address different bottlenecks: active learning reduces annotation cost, curriculum learning improves training efficiency. They can be combined — use active learning to build a cost-efficient labeled dataset, then use curriculum learning to train on it in an optimal order. In robotics, curriculum learning often progresses from simple tasks to complex ones.",
    },
  ],
  ctaHeading: "Optimize Your Annotation Budget?",
  ctaDescription: "Claru builds active learning into our annotation pipelines, prioritizing the data points that matter most for your model's performance.",
  relatedGlossaryTerms: ["data-quality-scoring", "data-enrichment", "inter-annotator-agreement", "reward-model", "dataset-diversity"],
  relatedGuidePages: ["how-to-implement-active-learning-for-robotics"],
  relatedSolutionSlugs: ["egocentric-video-data"],
  longDefinition: `Active learning is a semi-supervised machine learning framework in which the learning algorithm can interactively query an oracle — typically a human annotator — to label selected data points from a pool of unlabeled examples. The core principle is that not all data points are equally informative: some lie near decision boundaries, in underrepresented regions of the feature space, or in areas where the model is uncertain, and labeling these strategically yields more model improvement per annotation dollar than uniform random sampling.

The standard active learning loop operates in four steps. First, the model is trained on the currently labeled dataset. Second, the model evaluates all unlabeled data points according to a query strategy (uncertainty sampling, query-by-committee, expected model change, or information density). Third, the top-k most informative points are sent to human annotators for labeling. Fourth, the newly labeled points are added to the training set and the model is retrained. This cycle repeats until the annotation budget is exhausted or performance targets are met.

In robotics, active learning operates at two levels. At the annotation level, it selects which frames or trajectory segments from an already-collected dataset need human labels. A robot that has collected 100,000 frames of kitchen manipulation does not need every frame labeled — active learning identifies the 10,000-20,000 frames where labels would be most informative (novel objects, unusual configurations, ambiguous contact states). At the data collection level, active learning can guide which environments, tasks, or scenarios need additional demonstrations, directing collection resources toward the gaps in the current dataset.

The effectiveness of active learning depends on the query strategy, the model architecture, and the data distribution. For classification and detection tasks, uncertainty sampling (selecting points where the model is least confident) is the simplest and most widely used approach. For regression tasks common in robotics (predicting continuous action values), expected model change and Bayesian methods that estimate epistemic uncertainty tend to perform better because output confidence is less meaningful for continuous predictions.`,

  historicalContext: `Active learning has roots in optimal experimental design from the 1950s, but its modern formulation as a machine learning technique was established by Cohn et al. (1994) in "Improving Generalization with Active Learning" and formalized in Settles' comprehensive survey (2009). The classical settings — pool-based, stream-based, and query synthesis — were developed primarily for text classification and image recognition.

The application of active learning to computer vision was driven by the high cost of pixel-level annotation. Labeling a single image for semantic segmentation takes 15-90 minutes, making active selection of which images to annotate economically significant. Sener and Savarese (2018) proposed a core-set approach that selects diverse, representative examples rather than just uncertain ones, addressing the failure mode where uncertainty sampling clusters queries in a narrow region of the input space.

In robotics, active learning gained traction around 2019-2021 as teams began collecting large-scale demonstration datasets and confronted the annotation bottleneck. Labeling a single manipulation trajectory for action segmentation or quality scoring takes 5-15 minutes, and datasets of 50,000+ trajectories make exhaustive annotation impractical. Google's MT-Opt (2021) applied active learning at the collection level, using model uncertainty to decide which grasping configurations to attempt next in a fleet of robots. This "active data collection" paradigm extends classical active learning from annotation selection to experience selection.

Recent work has integrated active learning with foundation models. Instead of training a task-specific model from scratch to estimate uncertainty, teams use pretrained vision-language models to identify novel or ambiguous examples based on embedding-space distances. This "foundation model as uncertainty estimator" approach avoids the cold-start problem where the initial model is too weak to provide useful uncertainty estimates.`,

  practicalImplications: `Implementing active learning for a robotics data pipeline requires decisions about the query strategy, batch size, annotation interface, and stopping criteria.

For perception annotation (bounding boxes, segmentation masks, keypoints), pool-based active learning with batched queries is the standard approach. The model scores all unlabeled frames, selects a batch of 100-500 frames for annotation, and retrains after each batch. Batch sizes smaller than 50 create excessive overhead from model retraining; batches larger than 1,000 reduce the benefit of active selection because the model does not update frequently enough. In practice, 200-500 frames per batch balances annotation throughput with selection quality.

For trajectory annotation (labeling robot demonstrations as successful/failed, segmenting actions within a trajectory, or scoring trajectory quality), the unit of selection is a full trajectory or trajectory segment rather than a single frame. Query strategies should account for trajectory-level diversity — selecting 100 trajectories that all involve the same object provides less information than 100 trajectories spanning different objects, grasp types, and failure modes.

The cold-start problem is a practical challenge: active learning requires an initial model to estimate informativeness, but the initial model is trained on a small random seed set. In robotics, teams typically label 5-10% of the dataset uniformly at random as the seed set, train the initial model, then switch to active selection for the remaining budget. Using pretrained feature extractors (CLIP, DINOv2) to compute embedding-space coverage for the seed selection improves the initial model quality.

Stopping criteria matter for budget management. Common approaches include monitoring validation performance curves and stopping when the marginal gain per annotation batch drops below a threshold, or using a held-out test set and stopping when target performance is reached. For production robotics, the performance threshold is typically defined by the minimum success rate needed for deployment.`,

  commonMisconceptions: [
    {
      misconception: "Active learning always outperforms random sampling.",
      correction: "Active learning outperforms random sampling when the data distribution has significant redundancy or the decision boundary is concentrated in a small region of the feature space. For highly diverse, non-redundant datasets where every example is equally informative, random sampling performs comparably. In robotics, most large-scale datasets contain substantial redundancy (many similar frames from the same environment), so active learning typically provides significant savings. But for small, carefully curated datasets, the benefit is minimal.",
    },
    {
      misconception: "Uncertainty sampling is always the best query strategy.",
      correction: "Uncertainty sampling selects points where the model is least confident, but this can lead to pathological behavior: the model may be uncertain about outliers, noisy examples, or ambiguous boundary cases that are not actually informative. Diversity-based methods (core-set selection, clustering) and hybrid approaches that balance uncertainty with representativeness consistently outperform pure uncertainty sampling on real-world robotics datasets.",
    },
    {
      misconception: "Active learning eliminates the need for large annotated datasets.",
      correction: "Active learning reduces the annotation budget needed to reach a given performance level, but it does not change the fundamental data requirements for the task. If a manipulation policy needs 10,000 labeled demonstrations to achieve 90% success, active learning might achieve the same performance with 3,000-5,000 strategically selected demonstrations — a significant saving, but still a substantial annotation effort. Active learning optimizes the labeling budget, it does not eliminate it.",
    },
  ],
  keyPapers: [
    {
      id: "settles-active-learning-2009",
      title: "Active Learning Literature Survey",
      authors: "Settles",
      venue: "University of Wisconsin-Madison CS Technical Report",
      year: 2009,
      url: "https://burrsettles.com/pub/settles.activelearning.pdf",
    },
    {
      id: "sener-coreset-2018",
      title: "Active Learning for Convolutional Neural Networks: A Core-Set Approach",
      authors: "Sener and Savarese",
      venue: "ICLR 2018",
      year: 2018,
      url: "https://arxiv.org/abs/1708.00489",
    },
    {
      id: "kalashnikov-mt-opt-2021",
      title: "MT-Opt: Continuous Multi-Task Robotic Reinforcement Learning at Scale",
      authors: "Kalashnikov et al.",
      venue: "arXiv 2104.08212",
      year: 2021,
      url: "https://arxiv.org/abs/2104.08212",
    },
  ],
  claruRelevance: `Claru integrates active learning into our annotation pipelines to maximize the value of every labeled frame. When clients deliver large pools of unlabeled robot data, our pipeline uses model-guided selection to prioritize the frames and trajectories where annotation will have the highest impact on downstream model performance.

This approach allows Claru to deliver annotation projects 40-60% faster than exhaustive labeling while maintaining or improving model accuracy. For teams on tight budgets or timelines, active learning means getting to a deployable model with less annotation spend — directing human attention where it matters most rather than uniformly across redundant data.`,
};

export default data;
