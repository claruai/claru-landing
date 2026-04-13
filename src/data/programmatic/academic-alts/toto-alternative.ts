import type { AcademicAltPageData } from "../types";

const data: AcademicAltPageData = {
  slug: "toto-alternative",
  metaTitle: "TOTO Benchmark Alternative for Production Robotics | Claru",
  metaDescription:
    "Compare TOTO's multi-task benchmark with Claru's commercial training data. Task diversity, out-of-distribution generalization, and production readiness compared.",
  primaryKeyword: "toto benchmark alternative",
  secondaryKeywords: [
    "toto benchmark vs claru",
    "toto dataset limitations",
    "toto commercial alternative",
    "robot benchmark alternative",
    "out-of-distribution robot data",
  ],
  canonicalPath: "/compare/toto-alternative",
  h1: "TOTO Benchmark Alternative: Production Data for Real-World Robot Deployment",
  heroSubtitle:
    "TOTO (Test on Trajectory Optimization) provides a benchmark for evaluating robot learning methods on out-of-distribution generalization across manipulation tasks. But a benchmark for measuring generalization is not a data source for achieving it. Compare TOTO with Claru's production-grade data collection.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Compare", href: "/compare" },
    { label: "TOTO Alternative", href: "/compare/toto-alternative" },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Is TOTO?",
      paragraphs: [
        "TOTO (Test on Trajectory Optimization) is a benchmark dataset for evaluating robot learning algorithms, developed by researchers at Carnegie Mellon University (CMU) and Meta AI. Published in 2023, TOTO focuses specifically on measuring how well pretrained representations enable out-of-distribution generalization -- testing whether a model trained on one set of conditions can perform under different conditions (new object positions, new objects, new lighting, etc.).",
        "The benchmark consists of demonstrations collected on a Franka Emika Panda arm across multiple manipulation tasks including pushing, picking, stacking, and placing objects. What distinguishes TOTO from generic manipulation datasets is its systematic variation of conditions between training and test splits. For each task, the training set uses one distribution of object positions, lighting conditions, and object instances, while the evaluation set deliberately shifts these conditions. This structured train/test split enables rigorous measurement of generalization capability.",
        "TOTO provides approximately 1,000 demonstrations per task, collected via teleoperation. Each demonstration includes multi-view RGB images from two cameras, proprioceptive state (joint positions, velocities, end-effector pose), and action labels. The benchmark includes pre-computed visual representations from multiple pretrained encoders (R3M, MVP, CLIP, ResNet, MAE) so researchers can directly compare which visual backbone produces the best downstream policy performance under distribution shift.",
        "The dataset is released under the MIT License and was designed as a standardized evaluation protocol rather than a large-scale pretraining resource. TOTO's primary contribution is its experimental framework for comparing representation learning methods, not its raw data volume. It has been cited in research on visual representation learning for robotics and out-of-distribution robustness.",
      ],
    },
    {
      type: "stats",
      heading: "TOTO at a Glance",
      stats: [
        { value: "~1,000", label: "Demos per Task" },
        { value: "6+", label: "Manipulation Tasks" },
        { value: "2", label: "Camera Views" },
        { value: "5+", label: "Pre-Computed Representations" },
        { value: "MIT", label: "License" },
        { value: "1", label: "Robot (Franka Panda)" },
      ],
    },
    {
      type: "comparison-table",
      heading: "TOTO vs. Claru: Side-by-Side Comparison",
      description:
        "A comparison for teams that need data addressing the out-of-distribution challenges TOTO measures.",
      columns: ["Dimension", "TOTO", "Claru"],
      rows: [
        {
          Dimension: "Primary Purpose",
          TOTO: "Benchmark for evaluating OOD generalization",
          Claru: "Training data for production deployment",
        },
        {
          Dimension: "Scale",
          TOTO: "~1,000 demos per task (a few thousand total)",
          Claru: "1K to 1M+ demos, scoped to your needs",
        },
        {
          Dimension: "Robot Platform",
          TOTO: "Franka Panda in CMU lab",
          Claru: "Any physical robot you deploy",
        },
        {
          Dimension: "Environmental Variation",
          TOTO: "Controlled train/test splits with systematic OOD shifts",
          Claru: "Organic variation from real deployment environments",
        },
        {
          Dimension: "Task Coverage",
          TOTO: "6+ basic manipulation tasks (push, pick, stack, place)",
          Claru: "Custom tasks matching your production requirements",
        },
        {
          Dimension: "Sensor Modalities",
          TOTO: "RGB (2 views) + proprioception",
          Claru: "RGB + depth + force/torque + proprioception + tactile",
        },
        {
          Dimension: "Pre-Computed Features",
          TOTO: "R3M, MVP, CLIP, ResNet, MAE embeddings included",
          Claru: "Raw data -- use your own feature extraction pipeline",
        },
        {
          Dimension: "OOD Coverage",
          TOTO: "Structured: position, lighting, object instance shifts",
          Claru: "Comprehensive: natural environmental variability across all dimensions",
        },
        {
          Dimension: "License",
          TOTO: "MIT License",
          Claru: "Commercial license with IP assignment",
        },
        {
          Dimension: "Ongoing Collection",
          TOTO: "Static benchmark release",
          Claru: "Continuous collection and expansion",
        },
      ],
    },
    {
      type: "prose",
      heading: "Key Limitations of TOTO for Production Use",
      paragraphs: [
        "TOTO is a benchmark, not a training dataset. Its approximately 1,000 demonstrations per task are designed to evaluate whether a representation enables generalization, not to provide sufficient data for training a production-capable policy. The data volume is intentionally kept small so that the contribution of the representation (not the data scale) can be isolated. Production policies typically require 5-50x more demonstrations per task to achieve deployment-level reliability.",
        "The out-of-distribution shifts in TOTO are controlled and limited. TOTO varies object positions, lighting, and object instances between train and test splits, but real-world deployment involves many more dimensions of variation simultaneously: different times of day, different seasons, different users, different background clutter, sensor degradation over time, and environmental changes that accumulate continuously. TOTO's structured OOD shifts test one dimension at a time; real deployment tests all dimensions simultaneously.",
        "TOTO uses a single Franka Panda arm in a single laboratory at CMU. The camera positions, lighting rig, table surface, and workspace geometry are specific to that installation. Teams deploying different robots in different environments cannot directly benefit from TOTO's demonstrations -- the data is too specific to its collection environment to serve as general-purpose training data.",
        "The benchmark lacks depth, force/torque, and tactile sensor data. TOTO provides RGB images and proprioception, which is sufficient for the representation evaluation it was designed for, but insufficient for training policies that must handle contact-rich manipulation. Many production tasks (insertion, packing, assembly, tool use) require haptic feedback that TOTO does not capture.",
        "TOTO's task set is limited to basic manipulation primitives (pushing, picking, stacking, placing). Production deployments require complex, multi-step tasks with sequencing, conditional logic, and error recovery that these basic benchmarks do not evaluate.",
      ],
    },
    {
      type: "prose",
      heading: "When to Use TOTO vs. Commercial Data",
      paragraphs: [
        "TOTO is the right tool for a specific research question: which visual representation enables the best out-of-distribution generalization for robot manipulation? If you are developing or comparing visual encoders, self-supervised learning methods, or representation learning approaches for robotics, TOTO provides the controlled experimental framework to measure OOD performance rigorously. Its pre-computed embeddings from multiple encoders make this comparison especially efficient.",
        "TOTO is also useful as a sanity check during development. Before investing in large-scale data collection, you can use TOTO to verify that your visual backbone generalizes across at least basic distribution shifts. If your method fails on TOTO's controlled variations, it will certainly fail on the uncontrolled variations of real deployment.",
        "Move to Claru when your goal shifts from measuring generalization to achieving it. Real-world robustness comes not from a clever representation but from data that covers the variability your policy will encounter in production. Claru collects demonstrations across the natural variations in your deployment environment -- different times of day, different object configurations, different operators, different environmental states -- providing the data diversity that teaches policies genuine real-world robustness.",
      ],
    },
    {
      type: "prose",
      heading: "How Claru Complements TOTO",
      paragraphs: [
        "TOTO identifies which representations enable generalization; Claru provides the data that exercises those representations in production conditions. After using TOTO to select your visual backbone, Claru supplies the large-scale, diverse, real-world demonstrations needed to train a robust policy on top of that backbone.",
        "Where TOTO creates OOD conditions through controlled lab-setting variations, Claru captures organic OOD conditions by collecting demonstrations across the natural variability of your deployment environment. Different lighting throughout the day, different object placements by different workers, different background states -- these real-world variations are more complex and comprehensive than any controlled benchmark can simulate.",
        "Claru also extends beyond TOTO's sensor coverage. We collect synchronized RGB-D, force/torque, proprioception, and optional tactile data, enabling policies that combine the visual representations TOTO evaluates with the multi-modal inputs that production manipulation requires.",
        "Data is delivered in RLDS, HDF5, zarr, or LeRobot format with standardized schemas. For teams that have used TOTO to validate their representation learning approach, Claru provides the production data layer that turns a research finding into a deployed capability.",
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        {
          id: "russ-toto-2023",
          title: "TOTO: A Benchmark for Evaluating Representations for Robot Manipulation",
          authors: "Zhou et al.",
          venue: "arXiv 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2306.00942",
        },
        {
          id: "nair-r3m-2022",
          title: "R3M: A Universal Visual Representation for Robot Manipulation",
          authors: "Nair et al.",
          venue: "CoRL 2022",
          year: 2022,
          url: "https://arxiv.org/abs/2203.12601",
        },
        {
          id: "radosavovic-mvp-2023",
          title: "Real-World Robot Learning with Masked Visual Pre-training",
          authors: "Radosavovic et al.",
          venue: "CoRL 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2210.03109",
        },
        {
          id: "chi-diffusion-2023",
          title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
          authors: "Chi et al.",
          venue: "RSS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2303.04137",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "Is TOTO a training dataset or a benchmark?",
      answer:
        "TOTO is primarily a benchmark -- an evaluation framework for comparing how well different visual representations enable out-of-distribution generalization in robot manipulation. While it includes demonstration data, the scale (~1,000 demos per task) is designed for evaluation, not for training production policies. Large-scale training data requires a service like Claru.",
    },
    {
      question: "Can I use TOTO data commercially?",
      answer:
        "Yes, TOTO is released under the MIT License. However, its small scale and single-lab data make it impractical as a training resource for production systems. It serves best as a research evaluation tool.",
    },
    {
      question: "What visual representations does TOTO evaluate?",
      answer:
        "TOTO includes pre-computed embeddings from R3M, MVP, CLIP, ResNet, and MAE. This allows researchers to directly compare how each visual backbone performs under distribution shift without re-running feature extraction. The results help guide representation selection for downstream policy training.",
    },
    {
      question: "How does TOTO's OOD evaluation differ from real-world robustness?",
      answer:
        "TOTO creates controlled out-of-distribution conditions by systematically varying one factor (object position, lighting, or object instance) between train and test splits. Real deployment involves simultaneous, continuous variation across many factors. TOTO measures whether a representation can handle isolated shifts; real robustness requires handling all shifts at once, which demands diverse training data from actual deployment conditions.",
    },
    {
      question: "Does Claru data help with out-of-distribution generalization?",
      answer:
        "Yes, but through a different mechanism than TOTO evaluates. Claru achieves robustness by collecting demonstrations across the natural variability of your deployment environment -- different lighting conditions, object configurations, and environmental states -- so that these variations become part of your training distribution rather than out-of-distribution conditions.",
    },
  ],
  ctaHeading: "Build Real Robustness, Not Just Benchmark Scores",
  ctaDescription:
    "Get diverse real-world demonstrations that cover the variability your robot will face in production. Turn TOTO-validated representations into deployed policies.",
  relatedGlossaryTerms: [
    "out-of-distribution-generalization",
    "visual-pretraining",
    "imitation-learning",
    "representation-learning",
  ],
  relatedGuidePages: [
    "how-to-evaluate-training-data-quality",
    "how-to-build-a-cross-embodiment-dataset",
  ],
  relatedSolutionSlugs: ["vla-training-data"],
  datasetName: "TOTO",
  academicProfile: {
    institution: "Carnegie Mellon University / Meta AI",
    year: 2023,
    scale:
      "~1,000 demonstrations per task across 6+ manipulation tasks, with pre-computed representations from 5+ visual encoders",
    license: "MIT License",
    modalities: [
      "RGB images (2 camera viewpoints)",
      "Proprioception (joint positions, velocities, end-effector pose)",
      "Action labels",
      "Pre-computed visual embeddings (R3M, MVP, CLIP, ResNet, MAE)",
    ],
  },
  limitations: [
    "Benchmark-scale data (~1,000 demos per task) insufficient for production policy training",
    "Single robot (Franka Panda) in a single CMU laboratory environment",
    "Controlled OOD shifts test one dimension at a time, not the multi-dimensional shifts of real deployment",
    "No depth, force/torque, or tactile sensor data for contact-rich manipulation",
    "Basic manipulation primitives only (push, pick, stack, place) -- no complex or multi-step tasks",
    "Pre-computed representations fix the visual backbone -- cannot evaluate end-to-end learning",
    "Static benchmark with no mechanism for custom task or environment expansion",
    "Lab-specific camera positions, lighting, and workspace not transferable to other settings",
  ],
  claruAdvantages: [
    "Production-scale demonstrations (thousands to hundreds of thousands per task)",
    "Data on your specific robot platform in your actual deployment environment",
    "Natural environmental diversity across lighting, layouts, and object configurations",
    "Multi-modal sensors: RGB + depth + force/torque + proprioception + tactile",
    "Custom task design for complex, multi-step production workflows",
    "Raw data for end-to-end training -- no locked-in visual backbone",
    "Commercial license with IP assignment for deployment",
    "Continuous collection as deployment requirements evolve",
  ],
  keyPapers: [
    {
      id: "russ-toto-2023",
      title: "TOTO: A Benchmark for Evaluating Representations for Robot Manipulation",
      authors: "Zhou et al.",
      venue: "arXiv 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2306.00942",
    },
    {
      id: "nair-r3m-2022",
      title: "R3M: A Universal Visual Representation for Robot Manipulation",
      authors: "Nair et al.",
      venue: "CoRL 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2203.12601",
    },
    {
      id: "radosavovic-mvp-2023",
      title: "Real-World Robot Learning with Masked Visual Pre-training",
      authors: "Radosavovic et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2210.03109",
    },
  ],
  claruRelevance:
    "TOTO addresses a critical question in robot learning: which visual representations generalize best under distribution shift? Its controlled evaluation framework, with pre-computed embeddings from R3M, MVP, CLIP, and other backbones, provides a rigorous method for answering this question. But the question itself is only the first step. Once you know which representation to use, you need the data that turns that representation into a deployed policy that handles real-world variability. This is where Claru comes in. TOTO measures OOD robustness on controlled, one-dimensional shifts in a single lab. Real deployment demands robustness across simultaneous, uncontrolled, multi-dimensional variation in environments that look nothing like a CMU research lab. Claru provides that robustness by collecting demonstrations across the full range of conditions your robot will encounter: different times of day, different environmental configurations, different object instances, different operator interactions. Our data transforms out-of-distribution conditions into in-distribution training data, which is fundamentally more effective than hoping a representation will generalize to conditions it has never seen. We deliver in standard formats with the multi-modal sensor coverage that production manipulation requires, giving you the data foundation to move from benchmark evaluation to real-world deployment.",
};

export default data;
