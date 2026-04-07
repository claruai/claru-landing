import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "benchmark-curation",
  termSlug: "benchmark-curation",
  category: "data-quality-pipelines",
  metaTitle: "Benchmark Curation — Definition & Training Data | Claru",
  metaDescription: "Benchmark curation is the deliberate process of assembling evaluation datasets that measure real-world model capabilities. Learn methods, pitfalls, and key papers.",
  primaryKeyword: "benchmark curation",
  secondaryKeywords: ["dataset curation", "benchmark dataset creation", "evaluation dataset", "robotics benchmark", "test set design", "benchmark contamination"],
  canonicalPath: "/glossary/benchmark-curation",
  h1: "Benchmark Curation: Definition, Applications, and Training Data Requirements",
  heroSubtitle: "Benchmark curation is the principled process of selecting, cleaning, annotating, and validating the evaluation datasets that determine whether an AI system actually works. This page covers why benchmark design matters more than leaderboard scores, how to avoid common pitfalls, and what makes a benchmark trustworthy for physical AI.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Benchmark Curation", href: "/glossary/benchmark-curation" },
  ],
  sections: [],
  faqs: [
    {
      question: "What makes a good benchmark for robotics and physical AI?",
      answer: "A good robotics benchmark has five properties. First, ecological validity: the tasks and environments must reflect real deployment conditions, not simplified lab setups. Second, diversity: the benchmark must span enough object categories, lighting conditions, and scene configurations to expose generalization failures. Third, unambiguous metrics: success criteria must be binary and reproducible — the robot either completes the task or does not. Fourth, held-out integrity: the test data must never leak into training sets, which requires careful versioning and access controls. Fifth, scalability: the benchmark must be runnable in both simulation and the real world so that teams can iterate quickly before expensive physical evaluation.",
    },
    {
      question: "How is benchmark curation different from training data curation?",
      answer: "Training data curation optimizes for coverage, diversity, and volume — you want as many high-quality examples as possible across the distribution the model will encounter. Benchmark curation optimizes for measurement precision: the goal is a compact, carefully controlled set of examples that reliably discriminates between model capabilities. A training dataset of 100,000 demonstrations might have a benchmark subset of 500 carefully selected test cases. The benchmark must include adversarial examples, edge cases, and distribution-shift scenarios that specifically test failure modes — categories that would be harmful to over-represent in training data.",
    },
    {
      question: "What is benchmark contamination and how do you prevent it?",
      answer: "Benchmark contamination occurs when test data or close paraphrases of test data appear in a model's training set, inflating evaluation scores beyond true capability. In language models, this happens when web-scraped training corpora contain benchmark questions. In robotics, contamination occurs when the same physical scenes, objects, or trajectories appear in both training and test splits. Prevention requires strict data provenance tracking: every sample in the benchmark must be verified as absent from all training sources. Best practices include collecting benchmark data in environments never used for training, using temporal splits (training data collected before a cutoff date, benchmark data after), and cryptographic hashing of samples to detect duplicates.",
    },
    {
      question: "How many test samples does a robotics benchmark need?",
      answer: "The minimum depends on the desired statistical power. To detect a 5-percentage-point difference in success rate between two methods at 95% confidence, you need approximately 400 test trials per method (based on a two-proportion z-test). Most published robotics benchmarks use 50-200 physical trials per task, which can only detect differences of 10-15 percentage points — meaning many reported improvements are not statistically significant. For simulation benchmarks, 1,000+ trials per task are feasible and recommended. The LIBERO benchmark uses 500 trials per task; the RLBench benchmark evaluates across 100 episodes per task across 18 tasks.",
    },
    {
      question: "How often should robotics benchmarks be updated?",
      answer: "Benchmarks should be refreshed when the best methods saturate them — when top-performing systems achieve 95%+ success rates, the benchmark can no longer discriminate between methods. For robotics, this saturation cycle is approximately 2-3 years. The original RLBench (2020) tasks are now solved by multiple methods, motivating extensions like RLBench-Next. CALVIN (2022) remains challenging at around 30% success on the longest task chains. Beyond saturation, benchmarks need updating when deployment conditions change: new robot hardware, new object categories in target environments, or new task requirements from end users.",
    },
  ],
  ctaHeading: "Need a Custom Evaluation Benchmark?",
  ctaDescription: "Claru builds purpose-built evaluation datasets for robotics teams — held-out test sets with controlled diversity, verified data provenance, and the statistical rigor to measure real progress.",
  relatedGlossaryTerms: ["data-enrichment", "data-quality-scoring", "dataset-diversity", "inter-annotator-agreement"],
  relatedGuidePages: ["how-to-build-a-benchmark-dataset"],
  relatedSolutionSlugs: ["egocentric-video-data"],

  longDefinition: `Benchmark curation is the systematic process of designing, assembling, annotating, and validating evaluation datasets that measure whether AI models possess specific capabilities. Unlike training data curation, which aims to maximize useful signal for model learning, benchmark curation prioritizes measurement integrity: the benchmark must produce scores that reliably reflect real-world performance and discriminate between genuinely different capability levels.

A well-curated benchmark consists of several carefully controlled components. The task specification defines exactly what the model must do and what constitutes success or failure — for a robotic manipulation benchmark, this means specifying the initial object configurations, the goal state, and the binary success criteria (e.g., "object is inside the container and gripper is open"). The data split policy determines how test samples are isolated from training data, with best practices including environment-level splits (entire rooms or object sets held out), temporal splits (all data after a date is test-only), and embodiment splits (test on a robot not seen during training). The annotation protocol defines how ground truth labels are produced and validated, typically requiring multiple independent annotators with measured inter-annotator agreement.

The critical failure mode in benchmark curation is validity collapse: when improvements on the benchmark stop correlating with improvements in real-world deployment. This happens through several mechanisms. Data leakage causes inflated scores that do not transfer. Metric gaming occurs when methods are engineered to exploit benchmark-specific shortcuts rather than learning general capabilities. Distribution mismatch happens when benchmark environments are too clean, too uniform, or too well-lit compared to deployment conditions. Preventing validity collapse requires continuous validation: periodically testing top-performing benchmark methods in genuinely novel real-world conditions and updating the benchmark when correlation breaks down.

In physical AI and robotics, benchmark curation carries unique challenges. Physical evaluation is expensive — each test trial requires robot time, scene reset time, and often human supervision. This creates pressure to keep benchmarks small, which reduces statistical power. Reproducibility is harder because physical conditions (lighting, object placement, surface friction) vary between trials. And the gap between simulation benchmarks and physical performance is wide enough that simulation-only evaluation is insufficient for deployment decisions.`,

  historicalContext: `The concept of standardized evaluation datasets in AI traces to the UCI Machine Learning Repository (1987), which provided shared datasets for comparing classification algorithms. In computer vision, the PASCAL VOC challenge (2005-2012) established the template for benchmark curation that the field still follows: a fixed dataset with standardized splits, defined evaluation metrics, and an annual competition leaderboard. ImageNet (Deng et al., 2009) scaled this approach to 1.2 million images across 1,000 categories, creating the benchmark that drove the deep learning revolution when AlexNet (2012) demonstrated that CNNs could dramatically outperform hand-crafted features.

In robotics, benchmark curation lagged behind computer vision because physical evaluation does not scale as easily as running inference on images. The Yale-CMU-Berkeley (YCB) Object Set (Calli et al., 2015) standardized the physical objects used for grasping and manipulation benchmarks — 77 everyday objects with 3D scans and physical property measurements. This was a hardware benchmark: a shared set of physical artifacts that any lab could purchase to ensure apples-to-apples evaluation.

Simulation-based robotics benchmarks emerged to bypass the physical bottleneck. RLBench (James et al., 2020) defined 100 manipulation tasks in a simulated environment with standardized observation spaces and success criteria. ManiSkill (Mu et al., 2021) and CALVIN (Mees et al., 2022) followed with increasingly complex task specifications and language-conditioned evaluation. The Open X-Embodiment project (2023) created the first cross-embodiment benchmark: evaluating whether policies trained on data from multiple robots transfer to held-out robot platforms.

The current frontier in robotics benchmark curation focuses on ecological validity. LIBERO (Liu et al., 2024) introduced procedurally generated benchmarks where scene configurations are systematically varied to test generalization. The BEHAVIOR project (2021-present) curates benchmarks based on surveys of real household activities, grounding task selection in actual human needs rather than researcher convenience. The trend is clear: benchmarks are moving from researcher-designed toy tasks toward curated samples of real deployment conditions.`,

  practicalImplications: `For teams building production robotics systems, benchmark curation is not an academic exercise — it is the measurement infrastructure that determines whether your system is ready to deploy. A poorly curated benchmark will either give false confidence (the system appears to work but fails in the field) or false pessimism (the system works but the benchmark tests irrelevant edge cases).

The benchmark design process should begin with deployment requirements, not academic conventions. Start by enumerating the specific tasks, objects, and environments your robot will encounter in production. Sample representative scenarios from this deployment distribution, including the hardest 10% — the edge cases that cause real failures. Hold out this sample as your evaluation set before collecting any training data. If you build the benchmark after training data collection, you risk unconscious selection bias toward scenarios your model already handles well.

Stratification is essential for actionable benchmarks. Rather than a single aggregate success rate, structure the benchmark into difficulty tiers and capability dimensions. A manipulation benchmark might stratify by object size (small / medium / large), material (rigid / soft / articulated), clutter density (isolated / moderate / dense), and instruction complexity (single-step / multi-step / conditional). This stratification turns a single number ("78% success") into a capability profile that reveals specific weaknesses for targeted data collection.

Statistical rigor in benchmark evaluation is widely neglected in robotics. Many papers report success rates from 20-50 trials without confidence intervals. At 50 trials, a measured success rate of 80% has a 95% confidence interval of 67-90% — wide enough to be meaningless for deployment decisions. Production benchmarks should include at least 100 trials per stratification cell and report confidence intervals. When comparing two methods, use McNemar's test or bootstrap resampling rather than simply comparing point estimates.

Claru helps robotics teams build deployment-grade evaluation benchmarks. We curate held-out test sets from environments and object categories matched to your deployment conditions, with verified isolation from your training data. Each benchmark includes stratification metadata, inter-annotator agreement scores on ground-truth labels, and statistical power analysis to ensure that measured improvements reflect genuine capability gains.`,

  commonMisconceptions: [
    {
      misconception: "If a model scores well on established benchmarks like RLBench or CALVIN, it will work well in real-world deployment.",
      correction: "Simulation benchmark scores have limited predictive validity for physical deployment. RLBench uses perfect state information and idealized physics that do not exist in real environments. CALVIN operates in a single simulated kitchen with fixed objects. A model that achieves 90% on CALVIN may achieve 40% on a physical robot in a real kitchen due to visual domain gap, imprecise control, and object variety. Physical benchmarks, even small ones, are far more predictive of deployment performance than large simulation benchmarks.",
    },
    {
      misconception: "Larger benchmarks are always better — more test samples means more reliable evaluation.",
      correction: "Benchmark size matters less than benchmark design. A small, carefully stratified benchmark with 500 samples across well-defined capability dimensions produces more actionable insights than a large, undifferentiated benchmark with 10,000 samples that all test similar conditions. The ImageNet benchmark is enormous but over-represents certain object categories and photographic styles, causing models optimized for ImageNet to fail on medical images, satellite imagery, and robotics perception. Quality of coverage matters more than quantity.",
    },
    {
      misconception: "Once a benchmark is established, it should remain fixed forever to enable fair historical comparisons.",
      correction: "Benchmarks must evolve as the field advances. Fixed benchmarks get saturated, their specific failure modes get memorized by the community, and their assumptions about deployment conditions become outdated. Best practice is to version benchmarks: EPIC-KITCHENS-55 was succeeded by EPIC-KITCHENS-100 with harder tasks and more diverse scenarios. Maintaining backward compatibility (new versions include a subset equivalent to the old version) enables historical comparison while keeping the benchmark challenging and relevant.",
    },
  ],

  keyPapers: [
    {
      id: "james-rlbench-2020",
      title: "RLBench: The Robot Learning Benchmark",
      authors: "James et al.",
      venue: "IEEE RA-L 2020",
      year: 2020,
      url: "https://arxiv.org/abs/1909.12271",
    },
    {
      id: "mees-calvin-2022",
      title: "CALVIN: A Benchmark for Language-Conditioned Policy Learning for Long-Horizon Robot Manipulation",
      authors: "Mees et al.",
      venue: "IEEE RA-L 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2112.03227",
    },
    {
      id: "liu-libero-2024",
      title: "LIBERO: Benchmarking Knowledge Transfer for Lifelong Robot Learning",
      authors: "Liu et al.",
      venue: "NeurIPS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2306.03310",
    },
    {
      id: "open-x-embodiment-2023",
      title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
      authors: "Open X-Embodiment Collaboration",
      venue: "ICRA 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2310.08864",
    },
    {
      id: "mu-maniskill-2021",
      title: "ManiSkill: Generalizable Manipulation Skill Benchmark with Large-Scale Demonstrations",
      authors: "Mu et al.",
      venue: "NeurIPS 2021",
      year: 2021,
      url: "https://arxiv.org/abs/2107.14483",
    },
  ],

  claruRelevance: `Claru provides benchmark curation as a core service for robotics teams that need evaluation datasets they can trust. Our benchmark design process starts with your deployment requirements — the specific tasks, objects, environments, and failure modes that matter for your product — and produces a held-out evaluation set with verified data provenance, stratified difficulty tiers, and statistical power guarantees.

Every Claru benchmark is built with strict isolation from training data. We maintain separate data collection campaigns for training and evaluation, using different physical environments, different object instances, and different data collectors to prevent any form of contamination. Ground-truth annotations go through multi-annotator verification with measured inter-annotator agreement, and each benchmark ships with confidence interval calculations so that teams know exactly how many trials they need to detect meaningful performance differences. For teams using our training data, the benchmark is designed as a complement: it tests the same capability dimensions covered by training data but in genuinely novel conditions that expose generalization gaps.`,
};

export default data;
