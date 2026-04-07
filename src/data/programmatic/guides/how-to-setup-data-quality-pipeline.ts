import type { GuidePageData } from "../types";

const data: GuidePageData = {
  slug: "how-to-setup-data-quality-pipeline",
  metaTitle: "How to Set Up a Data Quality Pipeline for Robot Datasets (2026 Guide) | Claru",
  metaDescription: "Step-by-step guide to building a data quality pipeline for robot datasets: automated checks, human review, statistical validation, and continuous monitoring for manipulation data.",
  primaryKeyword: "how to set up a data quality pipeline for robot datasets",
  secondaryKeywords: ["robot data quality pipeline", "data validation robotics", "quality control robot dataset", "automated data quality checks"],
  canonicalPath: "/guides/how-to-setup-data-quality-pipeline",
  h1: "How to Set Up a Data Quality Pipeline for Robot Datasets",
  heroSubtitle: "A practitioner's guide to building automated data quality pipelines for robot datasets — from real-time collection checks and post-session validation through statistical analysis, human review protocols, and continuous monitoring dashboards for manipulation and navigation data.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Guides", href: "/guides" },
    { label: "Set Up a Data Quality Pipeline for Robot Datasets", href: "/guides/how-to-setup-data-quality-pipeline" },
  ],
  sections: [
    {
      type: "prose",
      heading: "Why Data Quality Pipelines Are Non-Negotiable for Robot Learning",
      paragraphs: [
        "A robot dataset with 10% corrupted episodes degrades policy performance as much as removing 30% of clean data. Unlike natural language or image datasets where a few bad examples are diluted by millions of good ones, robot datasets are small enough (typically 1,000-100,000 episodes) that every corrupted, mislabeled, or low-quality episode has measurable impact. A single episode with desynchronized camera and action data teaches the policy to associate the wrong visual observation with each action, creating negative training signal that is worse than having no data at all.",
        "Data quality issues in robotics fall into four categories: (1) Sensor corruption — dropped frames, depth holes, force sensor spikes, camera blur from vibration. (2) Synchronization errors — camera frames and action timestamps drifting out of alignment, typically caused by software timestamping or clock skew between devices. (3) Annotation errors — incorrect success labels, wrong language instructions, inaccurate temporal segmentation. (4) Demonstration quality — jerky operator motions, excessive pauses, inefficient trajectories that teach bad behavior. A quality pipeline must detect and flag all four categories, preferably in real time during collection so problems can be corrected before accumulating thousands of affected episodes.",
      ],
    },
    {
      type: "prose",
      heading: "Choosing Between Real-Time and Batch Quality Checks",
      paragraphs: [
        "Quality checks fall into two categories: real-time checks that run after every episode during collection, and batch checks that analyze accumulated data. Real-time checks must complete in under 2 seconds to avoid blocking the operator: frame count verification, NaN checks, timestamp drift detection, and episode duration bounds. These catch sensor failures and recording bugs immediately. Batch checks run after each collection session (50-200 episodes) or at the end of a campaign: action distribution analysis, diversity coverage computation, per-operator performance tracking, and near-duplicate detection. These catch systematic issues that are invisible in individual episodes.",
        "The pipeline architecture should separate these two modes. Real-time checks run as a Python script triggered by a filesystem watcher (the watchdog library) monitoring the recording directory for new episode files. Batch checks run as scheduled jobs in Apache Airflow or Prefect, triggered by a session-end signal or on a time-based schedule. Both modes write results to the same quality database (PostgreSQL or SQLite), enabling unified dashboarding and reporting. This separation ensures that real-time checks never slow down the recording pipeline while batch checks can run compute-intensive analyses without time pressure.",
      ],
    },
  ],
  faqs: [
    {
      question: "What percentage of robot data episodes typically fail quality checks?",
      answer: "In well-run collection campaigns, 5-15% of episodes fail at least one quality check. The breakdown is typically: 2-5% sensor corruption (dropped frames, depth holes), 1-3% synchronization drift, 3-8% low demonstration quality (excessive pauses, re-grasps, jerky motion), and 1-2% annotation errors. With automated real-time checks, sensor and sync issues can be caught and re-recorded immediately, reducing the final discard rate to 3-8%. Without real-time checks, the discard rate can reach 15-25%, representing a substantial waste of collection resources.",
    },
    {
      question: "Should I fix bad episodes or discard them?",
      answer: "It depends on the failure mode. Sensor corruption (dropped frames, NaN values): discard and re-collect. Sync drift < 20 ms: fix by re-interpolating action timestamps. Sync drift > 20 ms: discard. Low demonstration quality: keep as negative examples if labeled with quality score, discard if extremely poor (success rate of quality-filtered datasets is consistently higher). Annotation errors: fix if caught during review, discard if the correction is ambiguous. As a rule: fix cheap errors, discard expensive-to-fix errors, and always re-collect rather than attempting to salvage heavily corrupted episodes.",
    },
    {
      question: "How often should quality checks run during collection?",
      answer: "Three tiers: (1) Real-time checks (every episode): frame count validation, sensor value range checks, episode duration bounds, synchronization drift detection. These run automatically after each episode and take < 2 seconds. (2) Session-level checks (every 50-100 episodes): distribution statistics, operator performance metrics, diversity coverage analysis. Run at each break or session end, taking 1-5 minutes. (3) Dataset-level checks (after all collection completes): full statistical validation, inter-annotator agreement, outlier detection, train/test leakage verification. Run once, taking 30-60 minutes.",
    },
    {
      question: "What tools should I use to build a data quality pipeline?",
      answer: "Use Python as the scripting language with h5py or rosbags for data loading, NumPy and pandas for metric computation, and matplotlib for visualization. For orchestration, Apache Airflow or Prefect handles job scheduling and retry logic for pipelines processing more than 100 episodes per day. For dashboarding, Grafana connected to InfluxDB or Prometheus provides real-time quality metric visualization. For human review workflows, Label Studio provides video playback with annotation capabilities. Store quality metrics in PostgreSQL for queryability across the full dataset. The Great Expectations library is useful for declarative data validation rules on tabular metadata.",
    },
    {
      question: "How do I handle quality issues discovered after training has started?",
      answer: "If the quality issue affects less than 5% of the training data and training is more than 50% complete, continue training and remove the affected episodes from the next training run. If the issue affects more than 5% or the training has not progressed far, stop training, fix the data, and restart. For issues discovered in a deployed model, run an impact analysis: evaluate the model on a test set with and without the affected episodes to quantify the performance delta. Document the issue, the remediation, and the impact assessment in the dataset quality log. This log is essential for audit trails and for preventing the same issue from recurring in future collection campaigns.",
    },
  ],
  ctaHeading: "Need a Production Quality Pipeline?",
  ctaDescription: "Claru provides end-to-end data quality infrastructure for robot data collection campaigns, including real-time validation, human review workflows, and quality dashboards.",
  relatedGlossaryTerms: ["data-quality-scoring", "data-deduplication", "inter-annotator-agreement"],
  relatedGuidePages: ["how-to-evaluate-training-data-quality", "how-to-measure-inter-annotator-agreement"],
  relatedSolutionSlugs: ["egocentric-video-data"],
  difficulty: "intermediate",
  estimatedTime: "1-2 weeks",
  prerequisites: ["Defined data collection protocol", "Recording pipeline (ROS2 bags or HDF5)", "Python 3.9+ with NumPy, pandas, matplotlib", "Access to collected or incoming robot data"],
  tools: ["Python", "NumPy", "pandas", "matplotlib", "h5py", "Grafana (for dashboards)", "Apache Airflow or Prefect (for pipeline orchestration)"],
  steps: [
    {
      stepNumber: 1,
      title: "Define Quality Metrics and Thresholds",
      description: "Before building the pipeline, define exactly what 'quality' means for your dataset with measurable metrics and hard pass/fail thresholds. Document these in a quality specification that the entire team references.\n\nCore metrics for robot manipulation data:\n\n(1) Frame completeness: Number of captured frames vs. expected frames (episode_duration * frame_rate). Threshold: > 98% (missing more than 2% of frames indicates sensor issues). (2) Temporal synchronization: Maximum timestamp difference between camera frame and nearest action timestamp. Threshold: < 10 ms for 30 Hz video (one frame period is 33 ms, so 10 ms desync is acceptable; 20+ ms is problematic). (3) Sensor value ranges: Joint positions within valid limits, force readings within sensor range (not saturated), depth values within workspace bounds. Flag any value outside the valid range. (4) Episode duration: Within [0.5x, 3x] of the expected duration for the task. Too short means the task was not completed; too long means the operator struggled. (5) Action smoothness: Maximum jerk (third derivative of position) in the end-effector trajectory. High jerk indicates jerky teleop or joint limit proximity. Threshold: < 10 m/s^3 for typical manipulation tasks. (6) Task success: Binary, defined unambiguously per task (e.g., 'object stable at target location for > 1 second'). Target: > 85% success rate across the dataset (some failures are intentionally collected as negative examples).\n\nFor each metric, define three zones: green (pass, no action needed), yellow (warning, flag for human review), and red (fail, discard and re-collect). Document the thresholds and rationale in the quality specification.",
      tools: ["Quality specification document", "Python (for metric computation)"],
      tips: ["Set thresholds conservatively at first (tight bounds) and relax them only after analyzing the distribution of flagged episodes — it is much easier to loosen thresholds than to go back and re-check episodes that passed an initially loose threshold",
        'Do not rely on a single metric to define quality. A composite score combining multiple signals (synchronization, smoothness, success) is more robust than any individual metric.',
        'Test thresholds on a pilot batch of 50 episodes before deploying to production. Thresholds set in theory often need adjustment based on the actual distribution of collected data.'],
    },
    {
      stepNumber: 2,
      title: "Build Real-Time Collection Checks",
      description: "Implement automated checks that run immediately after each episode is recorded, before the operator begins the next one. These real-time checks catch sensor and recording failures while the rig is still configured, enabling immediate re-collection.\n\nThe real-time check script (running on the recording workstation) should: (1) Open the just-recorded episode file. (2) Count frames per camera stream and compare to expected count. (3) Check for NaN/Inf values in all sensor channels. (4) Compute max timestamp delta between camera and action streams. (5) Verify episode duration is within bounds. (6) Check that the gripper actuated at least once (for manipulation tasks) — an episode where the gripper never opens or closes is likely a failed recording, not a valid demonstration.\n\nThe check should complete in under 2 seconds and display a clear pass/fail indicator visible to the operator — a green/red light on the recording dashboard, or an audible beep for pass vs. buzzer for fail. If the episode fails, display the specific failure reason so the operator can diagnose: 'Camera 2 dropped 15% of frames — check USB connection' or 'Action timestamps 45 ms behind camera — restart recording node.'\n\nImplement the checks as a Python script triggered by a filesystem watcher (watchdog library) that monitors the recording directory for new episode files. This decouples the quality check from the recording pipeline, preventing quality computation from blocking the next episode's recording.",
      tools: ["Python", "watchdog (filesystem monitoring)", "h5py or rosbag2 reader"],
      tips: ["Add a 'quick visual check' that renders the first, middle, and last frames of each camera into a tiled thumbnail image saved alongside the episode — operators can glance at this to catch obvious issues (lens cap on, camera aimed at ceiling) that automated checks might miss",
        'Log the check results to a database, not just to stdout. Historical check results are essential for trend analysis and root-cause investigation when a batch of episodes fails.',
        'Include a visual thumbnail check: render the first, middle, and last frames of each camera as a tiled image. Operators can glance at this to catch obvious issues like lens caps or camera misalignment.'],
    },
    {
      stepNumber: 3,
      title: "Implement Session-Level Statistical Validation",
      description: "After each collection session (50-200 episodes), run deeper statistical analysis that detects systematic issues invisible in individual episode checks. These analyses take 1-5 minutes and should run automatically at each break or session end.\n\nKey session-level analyses: (1) Action distribution check: Compute the mean and standard deviation of end-effector positions, velocities, and gripper widths across the session. Compare to the cumulative dataset distribution. Flag if the session distribution deviates significantly (KL divergence > 0.5 from the cumulative) — this may indicate the operator is using a consistently different strategy or the workspace shifted. (2) Diversity coverage: For each axis in the diversity matrix (object type, position, orientation), count how many episodes cover each combination. Flag under-represented combinations for priority collection in the next session. (3) Operator performance tracking: Plot success rate, average episode duration, and average path efficiency per operator per session. Identify operators whose metrics are declining (fatigue signal) or consistently below the team average (additional training needed). (4) Camera calibration drift: Compute the reprojection error of a fixed calibration target visible in the workspace. If reprojection error increases by more than 50% from the initial calibration, recalibrate before the next session.\n\nGenerate a session report (automated email or Slack message) with: total episodes recorded, pass/fail/warning counts, diversity coverage matrix, operator performance summary, and any issues requiring attention before the next session.",
      tools: ["Python (pandas, matplotlib, scipy)", "Automated report generation", "Slack or email integration"],
      tips: ["Plot action distributions as 2D heatmaps of (x, y) end-effector positions overlaid on the workspace image — this instantly reveals if the operator is avoiding certain workspace regions, which indicates a rig issue or operator discomfort",
        'Plot the action distribution as a 2D heatmap of end-effector (x, y) positions overlaid on a workspace image. This reveals spatial biases instantly.',
        'Compare session distributions against the cumulative dataset distribution using KL divergence. A divergence above 0.5 warrants investigation.'],
    },
    {
      stepNumber: 4,
      title: "Build the Human Review Workflow",
      description: "Automated checks catch sensor and statistical issues but cannot evaluate demonstration quality, annotation correctness, or task completion ambiguity. Human review complements automated checks for these subjective assessments.\n\nDesign a two-tier review workflow: (1) Spot-check review: A quality reviewer watches 20% of episodes (randomly sampled, stratified by operator and task) and scores each on a 1-5 quality scale. The reviewer also verifies success labels, language instructions, and any annotations. This review takes 2-3 minutes per episode. For a 1,000-episode batch, that is 200 episodes x 3 minutes = 10 hours of review. (2) Escalation review: Episodes flagged by automated checks (yellow zone) are routed to the reviewer with the specific issue highlighted. The reviewer decides: accept (the automated flag was a false positive), fix (correct the annotation), or reject (discard and re-collect).\n\nBuild the review interface as a web app (Label Studio works well) that displays: multi-view video playback, action trajectory visualization, automated check results, and annotation fields for the reviewer's quality score and comments. Include keyboard shortcuts for common actions (approve, reject, flag for re-annotation) to minimize review time.\n\nTrack reviewer agreement: assign 5% of episodes to two reviewers and compute agreement on quality scores and accept/reject decisions. If reviewer agreement falls below 80%, the quality criteria are ambiguous and need clarification. Run weekly calibration sessions where reviewers discuss disagreed episodes to maintain alignment.",
      tools: ["Label Studio (review interface)", "Python (sampling and routing scripts)", "Video playback with trajectory overlay"],
      tips: ["Do not assign review of an operator's episodes to that same operator — self-review produces systematically higher quality scores and misses issues that a fresh pair of eyes catches",
        'Assign a human reviewer who is NOT the operator who collected the data. Self-review produces systematically higher quality scores.',
        'Track per-reviewer agreement on 5% of episodes assigned to two reviewers. If agreement drops below 80%, the quality criteria need clarification.'],
    },
    {
      stepNumber: 5,
      title: "Implement Dataset-Level Validation Before Release",
      description: "Before releasing the dataset for model training, run a comprehensive final validation that checks the complete dataset as a whole. This catches issues that are invisible at the episode or session level — distribution imbalances, systematic biases, and train/test leakage.\n\nFinal validation checklist: (1) Total episode count and pass rate: verify the delivered dataset has the contracted number of episodes after quality filtering. (2) Distribution analysis: histograms of episode duration, action ranges, object types, environment configurations. Flag any category with fewer than the minimum specified episodes. (3) Train/test split integrity: verify that no scene configuration, object, or episode appears in both train and test sets. For object-level generalization testing, verify that held-out objects are completely absent from the training set. (4) Annotation completeness: verify that every episode has all required labels (success flag, language instruction, quality score, etc.) with no null or placeholder values. (5) File integrity: verify that every episode file can be opened and read without errors — corrupted files in a 50,000-episode dataset are surprisingly common (0.1-0.5% file corruption rate from disk I/O errors during large writes). (6) Deduplication: compute pairwise action trajectory similarity between episodes and flag near-duplicates (cosine similarity > 0.99) that may indicate accidental double-recording.\n\nGenerate a dataset quality report with all metrics, distributions, and any resolved issues. Attach this report to the dataset delivery so downstream users understand the quality characteristics of the data they are training on.",
      tools: ["Python (NumPy, pandas, matplotlib)", "Dataset integrity scripts", "Quality report template"],
      tips: ["Run a 'training smoke test' as part of final validation — train a basic model for 100 steps and verify that the loss decreases. A flat loss curve often indicates a subtle data format error (wrong coordinate frame, flipped axes, incorrect normalization) that passes all other checks",
        'Run a training smoke test as the final validation step: train a basic model for 100 steps and verify the loss decreases. A flat loss curve often indicates a subtle data format error.',
        'Check for train/test data leakage by verifying no scene configuration appears in both splits.'],
    },
    {
      stepNumber: 6,
      title: "Deploy Continuous Monitoring and Alerting",
      description: "For ongoing data collection campaigns (weeks to months), deploy a continuous monitoring system that tracks quality metrics over time and alerts the team when metrics degrade.\n\nBuild a Grafana dashboard (or equivalent) with real-time panels showing: episodes collected per day, cumulative pass rate, current operator performance rankings, diversity coverage progress (percentage of the diversity matrix filled), and any open quality issues requiring attention. Connect the dashboard to the recording and quality check systems via a time-series database (InfluxDB, Prometheus, or even a simple SQLite database updated by the quality check scripts).\n\nConfigure alerts for: (1) Pass rate drops below 80% in a 50-episode rolling window — indicates a systematic rig issue. (2) Any single operator's success rate drops below 70% — indicates fatigue or a need for coaching. (3) Camera calibration reprojection error increases above 1.0 px — indicates a camera has shifted. (4) Diversity coverage stalls (no new combinations filled in 100+ episodes) — indicates the collection plan needs updating. (5) Disk space below 10% on the recording workstation — prevents lost data from full disk.\n\nReview the dashboard at the start and end of each collection day. Weekly, generate a trend report showing quality metrics over the past week compared to previous weeks. This longitudinal view reveals slow degradations (gradually loosening camera mounts, increasing operator fatigue across the campaign) that day-level monitoring misses.",
      tools: ["Grafana", "InfluxDB or Prometheus", "Alerting (PagerDuty, Slack webhooks, email)"],
      tips: ["Automate the daily quality report email — even if the team does not read it every day, having a timestamped record of quality metrics is invaluable when debugging model performance issues weeks after collection ended",
        'The quality dashboard should show the single most impactful action item at the top. Do not bury critical alerts in a wall of metrics.',
        'Version the pipeline code alongside the dataset. Tag each dataset release with the pipeline version that validated it.'],
    },
  ],
  keyPapers: [
    { id: "belkhale-data-quality-2024", title: "Data Quality in Imitation Learning", authors: "Belkhale et al.", venue: "CoRL 2024", year: 2024, url: "https://arxiv.org/abs/2306.02437" },
    { id: "khazatsky-droid-2024", title: "DROID: A Large-Scale In-The-Wild Robot Manipulation Dataset", authors: "Khazatsky et al.", venue: "RSS 2024", year: 2024, url: "https://arxiv.org/abs/2403.12945" },
    { id: "chi-diffusion-2023", title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion", authors: "Chi et al.", venue: "RSS 2023", year: 2023, url: "https://arxiv.org/abs/2303.04137" },
  ],
  claruRelevance: "Claru operates a production data quality pipeline across all collection campaigns. Every episode passes real-time automated checks (frame completeness, sync validation, sensor range), session-level statistical analysis (distribution monitoring, operator tracking, diversity coverage), human spot-check review (20% of episodes by trained reviewers), and dataset-level final validation before delivery. Our quality dashboards track metrics in real time, with automated alerts for any degradation. Every delivered dataset includes a comprehensive quality report documenting pass rates, metric distributions, reviewer agreement scores, and resolved issues.",
};

export default data;
