import type { GuidePageData } from "../types";

const data: GuidePageData = {
  slug: "how-to-measure-inter-annotator-agreement",
  metaTitle: "How to Measure Inter-Annotator Agreement for Robot Data (2026 Guide) | Claru",
  metaDescription: "Step-by-step guide to measuring inter-annotator agreement for robotics datasets: Cohen's kappa, Fleiss' kappa, ICC, temporal agreement, and continuous label metrics.",
  primaryKeyword: "how to measure inter-annotator agreement for robot data",
  secondaryKeywords: ["inter-annotator agreement robotics", "annotation quality metrics", "kappa score robot data", "labeling consistency measurement"],
  canonicalPath: "/guides/how-to-measure-inter-annotator-agreement",
  h1: "How to Measure Inter-Annotator Agreement for Robot Data",
  heroSubtitle: "A practitioner's guide to quantifying annotation consistency in robotics datasets — choosing the right agreement metric for each label type, setting up overlap protocols, interpreting scores, and diagnosing annotation pipeline failures.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Guides", href: "/guides" },
    { label: "Measure Inter-Annotator Agreement for Robot Data", href: "/guides/how-to-measure-inter-annotator-agreement" },
  ],
  sections: [
    {
      type: "prose",
      heading: "Why Inter-Annotator Agreement Matters for Robot Learning",
      paragraphs: [
        "Inter-annotator agreement (IAA) measures how consistently multiple human annotators label the same data. For robot datasets, low IAA directly degrades model performance: if annotators disagree on whether a grasp succeeded, the policy receives contradictory training signal. If annotators segment manipulation phases at different timestamps, the phase-conditioned policy learns blurred phase boundaries. If language instructions vary wildly between annotators for the same demonstration, the VLA cannot learn reliable language grounding. IAA is not just a quality metric — it is a direct predictor of the ceiling performance achievable with the annotated data.",
        "Robotics data presents unique IAA challenges compared to NLP or computer vision benchmarks. Many robot annotations involve continuous values (timestamps, spatial coordinates, force thresholds) rather than discrete categories, requiring continuous agreement metrics rather than simple percentage agreement. Some annotations are inherently ambiguous — a grasp that barely succeeds could reasonably be labeled success or failure, and a manipulation phase transition occurs gradually over 3-5 frames, not at a single definitive frame. The goal is not perfect agreement (which would require over-simplifying the labels) but calibrated agreement with understood disagreement patterns.",
      ],
    },
    {
      type: "prose",
      heading: "Common IAA Pitfalls in Robotics Annotation Projects",
      paragraphs: [
        "The most common mistake in robotics IAA measurement is computing agreement on a biased overlap sample. If the overlap episodes are cherry-picked (easiest examples) or all come from one task variant, the IAA scores will overestimate annotation quality on the full dataset. Always stratify the overlap sample across the full diversity of the dataset — all task types, all difficulty levels, all environments, and all object categories. A second common mistake is measuring IAA only at the end of the annotation campaign. If annotators gradually drift from the taxonomy definition over 2,000 episodes, the final batch may have significantly lower agreement than the first batch. Running IAA checks every 500 episodes catches drift early, when re-calibration costs one session rather than re-annotation of thousands of episodes.",
        "Another subtle pitfall is conflating low agreement with low annotator quality. Some disagreement is signal, not noise. If two expert annotators consistently disagree on whether a borderline grasp succeeded, the taxonomy's success criterion needs refinement — adding an 'ambiguous' flag or tightening the definition ('object must be lifted above 5 cm for at least 2 seconds'). Forcing these borderline cases into binary labels and then blaming annotators for disagreeing wastes time and produces labels that are confident but wrong. Instead, treat disagreement as diagnostic information about your annotation schema. The episodes where annotators disagree most are often the most informative for improving the taxonomy and, ultimately, the model.",
      ],
    },
    {
      type: "prose",
      heading: "Building an Organizational IAA Benchmarking System",
      paragraphs: [
        "Rather than measuring IAA as a one-off check per project, build an organizational system that tracks agreement scores across all annotation projects over time. Store IAA metrics in a database with fields: project_id, batch_id, label_type, metric_name (kappa, ICC, MAD, BERTScore), metric_value, confidence_interval_lower, confidence_interval_upper, annotator_pair, and measurement_date. This historical data serves three purposes: (1) it establishes organizational benchmarks \u2014 if your team typically achieves kappa 0.88 on success labels, a new project dropping to 0.78 triggers immediate investigation, (2) it enables annotator performance tracking \u2014 you can identify which annotators consistently produce high-agreement labels and assign them to the most critical annotation tasks, and (3) it provides evidence of annotation quality for dataset consumers and auditors.",
        "Automate IAA computation by integrating it into your annotation pipeline. When a new batch of annotations is submitted, a CI job automatically identifies overlap episodes, computes all relevant agreement metrics, compares against project-specific thresholds, and posts a pass/fail summary. If any metric fails, the pipeline blocks delivery and creates an investigation ticket. If all metrics pass, the batch is approved for inclusion in the training dataset. This automation catches quality regressions within hours rather than weeks, preventing thousands of low-quality annotations from accumulating before anyone notices.",
      ],
    },
  ],
  faqs: [
    {
      question: "What is a good inter-annotator agreement score for robot data?",
      answer: "Target scores depend on the label type. For binary success/failure labels: Cohen's kappa > 0.85 (almost perfect agreement). For categorical failure taxonomy (5-10 categories): Fleiss' kappa > 0.75 (substantial agreement). For temporal phase segmentation: mean absolute timestamp difference < 5 frames (167 ms at 30 Hz). For continuous quality scores (1-5): ICC > 0.70 (good reliability). For language instructions: BERTScore > 0.80. If any metric falls below these thresholds, investigate the taxonomy definition, annotator training, or annotation interface before proceeding with model training.",
    },
    {
      question: "How many episodes should be double-annotated for IAA measurement?",
      answer: "Double-annotate 15-20% of total episodes as a minimum. For a 10,000-episode dataset, that means 1,500-2,000 episodes labeled by two independent annotators. The overlap sample should be stratified by task type, environment, and difficulty level to ensure IAA is measured across the full diversity of the dataset. Run IAA checks after the first 500 episodes (before scaling up) and again after every 2,000 episodes to catch drift. If using 3+ annotators, use a round-robin overlap schedule where each pair shares 10% overlap.",
    },
    {
      question: "Why is raw percentage agreement insufficient for robot data?",
      answer: "Raw percentage agreement (fraction of items where annotators match) does not account for agreement that would occur by chance. If 90% of demonstrations are successful, two annotators who always label 'success' would achieve 81% raw agreement while providing zero useful signal. Cohen's kappa corrects for chance agreement, providing a much more meaningful measure. For highly imbalanced labels (which are common in robotics — most demonstrations succeed), raw agreement dramatically overestimates annotation quality. Always use chance-corrected metrics.",
    },
    {
      question: "How do you measure agreement on language instruction annotations?",
      answer: "Language instructions cannot be compared with kappa because two annotators can write semantically identical instructions with different words ('pick up the red cup' vs. 'grab the red mug from the table'). Use BERTScore (computed with the roberta-large model) or sentence-BERT cosine similarity between paired annotations. BERTScore above 0.80 indicates the instructions convey the same meaning despite lexical variation. For stricter evaluation, also compute entity-level exact match: extract object names and spatial references from both instructions and check that they refer to the same objects and locations. A dataset with BERTScore above 0.80 but entity match below 0.90 has good paraphrasing diversity but inconsistent object grounding, which needs correction.",
    },
    {
      question: "Can I use Krippendorff's alpha instead of Cohen's kappa?",
      answer: "Krippendorff's alpha is preferred when you have 3 or more annotators, missing data (not all annotators label all episodes), or mixed data types (nominal, ordinal, interval, and ratio all handled by alpha with appropriate distance functions). Alpha ranges from -1 to 1, with the same interpretation as kappa. The krippendorff Python package (pip install krippendorff) computes it efficiently. Use nominal alpha for categorical labels, ordinal alpha for ranked labels (quality scores), and interval alpha for continuous measurements (timestamps). For 2 annotators with complete data and categorical labels, kappa and alpha give nearly identical values — use whichever is more familiar to your team.",
    },
  ],
  ctaHeading: "Need Help with Annotation Quality?",
  ctaDescription: "Claru maintains inter-annotator agreement above 0.85 kappa across all robot data annotation projects. Talk to us about our quality pipeline.",
  relatedGlossaryTerms: ["inter-annotator-agreement", "data-quality-scoring", "preference-annotation"],
  relatedGuidePages: ["how-to-evaluate-training-data-quality", "how-to-label-robot-demonstrations"],
  relatedSolutionSlugs: ["expert-rlhf-annotation"],
  difficulty: "intermediate",
  estimatedTime: "3-5 days",
  prerequisites: ["Annotated robot dataset with overlap samples", "Python 3.9+ with scikit-learn, statsmodels", "Defined annotation taxonomy", "At least 2 annotators with completed overlap episodes"],
  tools: ["Python", "scikit-learn", "statsmodels", "krippendorff (Python package)", "BERTScore", "pandas", "matplotlib"],
  steps: [
    {
      stepNumber: 1,
      title: "Design the Overlap Protocol",
      description: "Before measuring agreement, design how overlap annotations are collected. The overlap protocol specifies which episodes are double-annotated, by whom, and under what conditions. The key design decisions are: (1) Overlap percentage — 15-20% of total episodes provides statistically robust agreement estimates. For datasets under 1,000 episodes, increase to 25-30%. (2) Annotator assignment — use round-robin pairing so that every annotator pair is represented in the overlap. If you have 4 annotators (A, B, C, D), the overlap set should include AB, AC, AD, BC, BD, and CD pairs in roughly equal proportion. This enables pairwise agreement analysis to identify weak annotators. (3) Stratification — the overlap sample must represent the full diversity of the dataset: all task types, all difficulty levels, all environments. Random sampling from the full dataset usually achieves this, but verify the distribution.\n\nCritically, overlap annotations must be independent — annotators must not see each other's labels during the overlap annotation. Use the annotation tool's assignment system to route overlap episodes to each annotator separately. If annotators work in the same room and can see each other's screens, independence is compromised. Claru's protocol assigns overlap episodes under different project names so annotators are unaware they are labeling the same data.",
      tools: ["Annotation tool (Label Studio) with assignment management", "Python for overlap sampling"],
      tips: [
        "Run a calibration round (50 episodes labeled by all annotators together, with discussion) before the overlap measurement begins — this resolves obvious taxonomy ambiguities and prevents the first overlap batch from being artificially low",
        "Use Label Studio's assignment system to route overlap episodes to each annotator under different project names, preventing annotators from discovering they are labeling the same data as another annotator",
        "For small teams (2-3 annotators), 100% overlap on the first 100 episodes is more useful than 15% overlap on 1,000 episodes — dense overlap on a small sample reveals systematic disagreements faster",
      ],
    },
    {
      stepNumber: 2,
      title: "Select the Right Agreement Metric for Each Label Type",
      description: "Different label types require different agreement metrics. Using the wrong metric produces misleading scores. Here is the mapping for common robot data annotations:\n\n(1) Binary labels (success/failure, object present/absent): Use Cohen's kappa for 2 annotators, Fleiss' kappa for 3+ annotators. Kappa ranges from -1 (perfect disagreement) to 1 (perfect agreement), with 0 indicating chance-level agreement. Interpretation: 0.81-1.00 almost perfect, 0.61-0.80 substantial, 0.41-0.60 moderate, below 0.41 unacceptable for production data.\n\n(2) Categorical labels with 3+ categories (failure taxonomy, grasp type, phase label): Use Fleiss' kappa (for 3+ annotators) or Cohen's kappa with weighting (for 2 annotators). If categories have an ordinal structure (quality scores 1-5), use weighted kappa with quadratic weights to penalize large disagreements more than small ones.\n\n(3) Temporal annotations (phase transition timestamps): Use mean absolute difference (MAD) in frames between annotators' timestamps for each transition point. A MAD of 3 frames at 30 Hz (100 ms) is excellent; 5 frames (167 ms) is acceptable; above 10 frames (333 ms) indicates the transition is ambiguous or the annotation interface needs improvement.\n\n(4) Continuous ratings (quality scores, confidence scores): Use intra-class correlation coefficient (ICC), specifically ICC(2,1) for consistency and ICC(2,k) for absolute agreement. ICC > 0.75 is good, > 0.90 is excellent.\n\n(5) Free-text labels (language instructions): Use BERTScore or sentence-BERT cosine similarity. BERTScore > 0.80 indicates the instructions convey the same meaning even if worded differently. For strict matching, also compute exact-match rate on key entities (object name, target location).",
      tools: ["scikit-learn (cohen_kappa_score)", "statsmodels (ICC)", "krippendorff (Python package for Krippendorff's alpha)", "BERTScore"],
      tips: [
        "For ordinal labels like quality scores, always use weighted kappa rather than unweighted — unweighted kappa treats a 1-point disagreement (score 3 vs 4) the same as a 4-point disagreement (score 1 vs 5), which is inappropriate for ordinal data",
        "Compute metrics in Python with: from sklearn.metrics import cohen_kappa_score; kappa = cohen_kappa_score(annotator_a, annotator_b, weights='quadratic') for ordinal data. For ICC, use pingouin.intraclass_corr() which handles all six ICC variants.",
      ],
    },
    {
      stepNumber: 3,
      title: "Compute Agreement Scores and Generate Diagnostic Reports",
      description: "With the overlap data collected and metrics selected, compute agreement scores and generate a diagnostic report that identifies exactly where annotators agree and disagree. Run the computation in Python:\n\nFor each label type, compute the aggregate agreement metric across all overlap episodes. Then stratify by: task type (does agreement differ between pick-and-place and tool-use tasks?), difficulty level (does agreement drop on edge cases?), and annotator pair (is one annotator consistently an outlier?). Generate a confusion matrix for categorical labels — this reveals specific category pairs that annotators confuse. For temporal segmentation, generate a histogram of timestamp differences per phase transition — some transitions (approach-to-grasp) may have tight agreement while others (pre-grasp to grasp) have wide disagreement.\n\nThe diagnostic report should include: (1) Overall agreement scores per label type with confidence intervals (bootstrap the overlap sample to get 95% CI). (2) Per-category agreement for categorical labels. (3) Per-annotator scores to identify outliers. (4) Most-disagreed episodes (the 20 episodes with the highest disagreement) for manual review. (5) Trend analysis — plot agreement over time (by annotation date) to detect fatigue or drift.\n\nShare the diagnostic report with the annotation team. Disagreement is not a failure — it is diagnostic information. If annotators disagree on phase transition timestamps for smooth, gradual motions, the taxonomy may need a 'transition' category rather than requiring a sharp boundary. If annotators disagree on quality scores for episodes in the 2-3 range, the quality scale may need an anchor example for each level.",
      tools: ["Python (pandas, matplotlib, seaborn)", "Jupyter notebook for interactive analysis"],
      tips: [
        "Generate the 'most disagreed' episode list first — manually reviewing 20 episodes where annotators disagree often reveals a single taxonomy ambiguity that, once resolved, eliminates half of all disagreements",
        "Use Jupyter notebooks with interactive widgets for the diagnostic report — annotators and leads can click on specific disagreed episodes to view the video and both annotations side-by-side",
        "Bootstrap 95% confidence intervals for each agreement metric using 1,000 resamples. If the CI is wide (e.g., kappa 0.65-0.85), you need more overlap episodes for a reliable estimate",
      ],
    },
    {
      stepNumber: 4,
      title: "Diagnose and Resolve Disagreement Sources",
      description: "Low agreement scores have specific, diagnosable causes. Work through this checklist:\n\n(1) Taxonomy ambiguity: If annotators disagree on which category an episode belongs to, the category definitions are unclear. Solution: add boundary examples to the taxonomy document — 'if the object wobbles but does not fall, label success' — and re-calibrate annotators.\n\n(2) Annotation interface issues: If temporal segmentation agreement is low but categorical agreement is high, the timeline interface may lack sufficient resolution or visual aids. Solution: add velocity/force waveform overlays, zoom controls, and frame-by-frame stepping to the timeline.\n\n(3) Annotator skill mismatch: If one annotator has consistently lower agreement with all others, they may need additional training. Solution: pair the weak annotator with a strong one for 50 calibration episodes with real-time feedback, then re-measure.\n\n(4) Genuine data ambiguity: Some episodes are truly ambiguous — a grasp that barely holds for 3 seconds before the object slips could be labeled either success or failure. Solution: add an 'ambiguous' or 'borderline' flag that annotators can apply, and handle these episodes separately in training (exclude from hard binary labels, include as soft labels with probability 0.5).\n\n(5) Annotator fatigue: If agreement declines over the course of a session (later episodes have lower agreement than earlier ones), annotation sessions are too long. Solution: limit sessions to 2 hours with a 15-minute break every 45 minutes, and randomize the order of episodes so the hard ones are not clustered.\n\nAfter resolving each diagnosed issue, re-annotate the overlap set (or a fresh overlap sample) and recompute agreement to verify improvement.",
      tools: ["Calibration episodes", "Updated taxonomy document", "Session time tracking"],
      tips: [
        "Do not skip the re-measurement step — a taxonomy update that you believe fixes the problem may introduce new ambiguities. Always verify with data.",
        "Keep a running log of taxonomy updates with dates and the episodes affected. When you deliver the dataset, downstream users need to know which taxonomy version each episode was annotated under.",
        "For annotator fatigue, analyze the agreement score as a function of annotation order within the session. Plot a moving-average agreement over the last 20 episodes. If it drops below threshold after episode 80, limit sessions to 70 episodes.",
      ],
    },
    {
      stepNumber: 5,
      title: "Set Acceptance Criteria and Integrate into the Pipeline",
      description: "Define hard acceptance criteria that gate the annotation pipeline — no dataset is released for model training until IAA meets the thresholds. Embed these checks as automated gates in the annotation pipeline.\n\nRecommended thresholds for robotics data: Cohen's kappa > 0.85 for binary success/failure, Fleiss' kappa > 0.75 for categorical labels (failure taxonomy, phase labels), temporal MAD < 5 frames for phase segmentation, ICC > 0.70 for continuous ratings, and BERTScore > 0.80 for language instructions. These thresholds are based on established guidelines (Landis & Koch 1977 for kappa interpretation, Koo & Li 2016 for ICC interpretation) and calibrated for robotics applications where label noise has direct impact on policy performance.\n\nAutomate the IAA computation: after each batch of annotations (e.g., every 500 episodes), automatically compute IAA on the overlap subset and generate a pass/fail report. If any metric fails, the pipeline halts and the diagnostic report is routed to the annotation lead for investigation. This prevents low-quality annotations from accumulating — catching a problem after 500 episodes costs one re-annotation batch, while catching it after 10,000 episodes costs twenty.\n\nStore IAA scores as dataset metadata. When publishing or delivering the dataset, include the IAA report so downstream users know exactly how consistent the annotations are and can make informed decisions about which label types to trust for training.",
      tools: ["Python automation scripts", "CI/CD pipeline (GitHub Actions, Airflow)", "Dataset metadata schema"],
      tips: [
        "Track IAA over time across projects to build organizational benchmarks — knowing that your team typically achieves kappa 0.88 on success labels lets you detect when a new project falls to 0.78, triggering investigation before the full dataset is completed",
        "Integrate IAA computation into your CI/CD pipeline using GitHub Actions. When new annotation batches are committed, automatically compute agreement and post results as a pull request comment. This makes IAA a first-class part of the development workflow rather than an afterthought.",
        "Publish IAA scores in the dataset card alongside the data. Downstream users can make informed decisions about which label types to trust for training. A label type with kappa 0.60 should be used with caution or as soft labels, while kappa 0.90 labels can be treated as ground truth.",
      ],
    },
  ],
  keyPapers: [
    { id: "landis-kappa-1977", title: "The Measurement of Observer Agreement for Categorical Data", authors: "Landis & Koch", venue: "Biometrics 1977", year: 1977, url: "https://doi.org/10.2307/2529310" },
    { id: "koo-icc-2016", title: "A Guideline of Selecting and Reporting Intraclass Correlation Coefficients for Reliability Research", authors: "Koo & Li", venue: "Journal of Chiropractic Medicine 2016", year: 2016, url: "https://doi.org/10.1016/j.jcm.2016.02.012" },
    { id: "krippendorff-alpha-2011", title: "Computing Krippendorff's Alpha-Reliability", authors: "Krippendorff", venue: "University of Pennsylvania 2011", year: 2011, url: "https://repository.upenn.edu/asc_papers/43/" },
  ],
  claruRelevance: "Claru maintains a rigorous IAA pipeline across all annotation projects. We compute agreement metrics on every batch (not just at the end), with automated gates that halt annotation when any metric falls below threshold. Our annotation leads review disagreement reports within 24 hours and issue taxonomy updates or re-calibration sessions as needed. Every delivered dataset includes a full IAA report with per-label-type scores, per-annotator breakdowns, and confidence intervals. Our historical benchmarks: kappa > 0.88 on success labels, > 0.78 on failure taxonomy, temporal MAD < 4 frames, and ICC > 0.75 on quality scores.",
};

export default data;
