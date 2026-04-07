import type { GuidePageData } from "../types";

const data: GuidePageData = {
  slug: "how-to-build-a-data-enrichment-pipeline",
  metaTitle: "How to Build a Data Enrichment Pipeline for Robot Datasets (2026 Guide) | Claru",
  metaDescription: "Step-by-step guide to building automated data enrichment pipelines for robot datasets — covering vision model inference, caption generation, embedding computation, and quality scoring.",
  primaryKeyword: "how to build a data enrichment pipeline for robot datasets",
  secondaryKeywords: ["robot data enrichment","dataset enrichment pipeline","automated annotation pipeline","vision model data enrichment","robot dataset post-processing"],
  canonicalPath: "/guides/how-to-build-a-data-enrichment-pipeline",
  h1: "How to Build a Data Enrichment Pipeline for Robot Datasets",
  heroSubtitle: "A technical guide to building automated enrichment pipelines that add captions, embeddings, quality scores, and derived annotations to robot datasets using vision-language models and specialized perception tools.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Guides", href: "/guides" },
    { label: "Build a Data Enrichment Pipeline for Robot Datasets", href: "/guides/how-to-build-a-data-enrichment-pipeline" },
  ],
  sections: [
    {
      type: "prose",
      heading: "Why Data Enrichment Is the Highest-Leverage Investment for Robot Datasets",
      paragraphs: [
        "Raw robot data — video frames, joint states, and actions — captures what happened, but enrichment captures what it means. Adding captions, embeddings, object detections, depth estimates, and quality scores to each frame transforms a passive recording archive into a searchable, filterable, training-ready asset. Enriched datasets support use cases that raw data cannot: semantic search for specific scenarios, automated dataset curation based on quality scores, and VLA model training that requires paired vision-language annotations.",
        "The economics of enrichment have shifted dramatically with foundation models. Computing CLIP embeddings costs nothing beyond GPU electricity. Generating captions with Gemini Flash costs $0.002-0.005 per frame. Running object detection with Florence-2 on a local GPU processes 50 frames per second. For a dataset of 100,000 keyframes, full enrichment (embeddings + captions + detections + quality scores) costs under $500 and completes in a day — a fraction of the cost of the original data collection.",
        "The critical design principle is idempotent, incremental processing. Each enrichment step should write to its own column group, check for existing results before reprocessing, and be re-runnable without side effects. This makes the pipeline robust to failures, easy to extend with new enrichment types, and compatible with continuously growing datasets."
      ]
    },
    {
      type: "stats",
      heading: "Enrichment Pipeline Economics",
      stats: [
        { value: "$0.002-0.005", label: "Per-frame caption cost (Gemini Flash)" },
        { value: "500 fps", label: "CLIP embedding throughput on A100" },
        { value: "50 fps", label: "Florence-2 object detection throughput" },
        { value: "15-30x", label: "Cost reduction from keyframe sampling" },
        { value: "90%+", label: "Target caption factual accuracy" },
        { value: "< $500", label: "Full enrichment cost for 100K keyframes" }
      ]
    },
    {
      type: "pipeline",
      heading: "Enrichment Pipeline Architecture",
      steps: [
        { stepNumber: 1, title: "Audit & Schema", description: "Inventory raw fields, define target enrichment columns with prefixed naming (ai_*, tech_*), and freeze the schema before building." },
        { stepNumber: 2, title: "Extract Keyframes", description: "Sample at 1-2 fps or use scene change detection. Group into batches of 100-1,000 for efficient processing." },
        { stepNumber: 3, title: "Parallel Enrichment", description: "Run independent branches concurrently: embeddings (CLIP/DINOv2), captions (VLM API), detections (Florence-2), depth (Depth Anything V2), quality scores." },
        { stepNumber: 4, title: "Merge & Derive", description: "Write results to master dataset. Compute derived features: semantic clusters, deduplication flags, diversity scores, caption-based tags." },
        { stepNumber: 5, title: "Validate & Monitor", description: "Spot-check 200 samples, measure cross-model agreement, verify distribution expectations. Deploy incrementally with checkpoint tracking." }
      ]
    },
    {
      type: "cards",
      heading: "Enrichment Model Selection Guide",
      cards: [
        {
          title: "CLIP ViT-L/14 (Embeddings)",
          description: "768-dim vectors enabling semantic search, deduplication, and clustering. Runs locally at 500+ fps. Use for all datasets regardless of other enrichments."
        },
        {
          title: "Gemini 2.5 Flash (Captions)",
          description: "Best cost-quality ratio for VLM captioning at $0.075/1M tokens. Produces detailed scene descriptions from structured prompts. Use as the primary captioning model."
        },
        {
          title: "Florence-2 (Object Detection)",
          description: "Open-source, runs locally at 50 fps on A100. Supports text-prompted detection for domain-specific object categories. Good for bounding boxes and region descriptions."
        },
        {
          title: "Depth Anything V2 (Depth Estimation)",
          description: "State-of-the-art monocular depth for datasets lacking hardware depth sensors. ViT-L backbone produces high-quality relative depth maps. Requires scale calibration for metric depth."
        }
      ]
    },
    {
      type: "prose",
      heading: "Enrichment Prompt Engineering for Robot Datasets",
      paragraphs: [
        "The quality of VLM-generated captions depends entirely on the prompt. Generic prompts like 'Describe this image' produce generic outputs. For robot datasets, use structured prompts that specify the domain context and required information: 'This image is from a robot manipulation dataset. In 2-3 sentences, describe: (1) what objects are visible and their spatial arrangement, (2) what the robot gripper is currently doing, and (3) the apparent task goal.' This structure ensures captions contain the information VLA models need for language conditioning.",
        "Include few-shot examples in your caption prompt — 2-3 reference (image, caption) pairs from your domain dramatically improve caption quality and consistency. For example, show the model a frame of a gripper approaching a mug with the gold-standard caption 'A robot gripper approaches a white ceramic mug sitting on a wooden table. The gripper is open and positioned 10cm above the mug handle. The task appears to be grasping the mug by its handle for a pick-and-place operation.' This teaches the model your preferred level of detail and vocabulary.",
        "Version your prompts in git alongside your pipeline code. Prompt changes are the most common source of enrichment quality regressions — a seemingly innocent rewording can shift caption style, reduce object mention frequency, or introduce hallucinated objects. Every prompt change should be validated against your golden set of 50 manually-enriched reference frames before deploying to the full dataset.",
        "For multi-provider enrichment (running both Gemini and GPT-4o), standardize the output format across providers by including explicit formatting instructions in the prompt: 'Output exactly 2-3 sentences. Do not use bullet points or numbered lists. Mention specific object names, not generic terms (say \"red ceramic mug\" not \"container\").' This ensures downstream consumers see consistent caption structure regardless of which model generated them."
      ]
    }
  ],
  faqs: [
    {
      question: "What types of enrichment are most valuable for robot datasets?",
      answer: "The highest-impact enrichments for robot learning datasets are: (1) Natural language captions describing the scene state and action at each keyframe, which enable VLA model training and retrieval. Use Gemini 2.5 Flash or GPT-4o with a structured prompt that asks for object names, spatial relationships, and ongoing actions. (2) Dense vector embeddings (768-dim from CLIP ViT-L/14 or DINOv2 ViT-g) computed on sampled frames, enabling semantic search, deduplication, and nearest-neighbor retrieval across large datasets. (3) Object detection and segmentation masks using Grounding-DINO + SAM 2 for per-frame object localization. (4) Depth estimation using Depth Anything V2 for datasets lacking hardware depth sensors. (5) Quality scores aggregating blur detection (Laplacian variance), brightness analysis, and frame completeness checks. Prioritize captions and embeddings first, as they unlock the widest range of downstream uses with the lowest per-frame compute cost (roughly $0.002-0.005 per frame for captions via API)."
    },
    {
      question: "How do you handle the cost of running vision models on large robot datasets?",
      answer: "Robot datasets with millions of frames require careful cost management. Key strategies: (1) Keyframe sampling — instead of enriching every frame, sample at 1-2 fps (every 15-30th frame at 30 fps), which reduces costs by 15-30x while capturing all meaningful scene changes. (2) Tiered model selection — use cheap models (CLIP, DINOv2) for embeddings on all keyframes, mid-tier models (Gemini Flash at $0.075/1M tokens) for captions, and expensive models (GPT-4o) only for difficult or ambiguous samples. (3) Batch processing — accumulate frames into batches of 1,000+ and process through inference APIs in parallel to maximize throughput. (4) Self-hosted models — for datasets over 1M frames, deploy open-source models (LLaVA-1.6, Florence-2) on your own GPU cluster. A single A100 runs Florence-2 at ~50 frames/second for object detection, processing 1M frames in ~5.5 hours at electricity cost only. (5) Caching — store intermediate results (embeddings, detections) so re-running the pipeline with new enrichment steps does not recompute existing ones."
    },
    {
      question: "What is the recommended architecture for an enrichment pipeline?",
      answer: "Use a DAG-based pipeline architecture where each enrichment step is an independent node with declared inputs and outputs. Tools like Apache Airflow, Prefect, or even a simple Python script with dependency tracking work well. The typical DAG structure is: (1) Ingest raw data and extract keyframes. (2) Run parallel enrichment branches: embeddings (CLIP/DINOv2), captions (VLM API), object detection (Grounding-DINO), depth estimation (Depth Anything V2). (3) Merge results into the master dataset, writing enrichment columns alongside the original data. (4) Compute derived features: quality scores from detection counts and caption confidence, semantic clusters from embedding k-means, and deduplication flags from embedding cosine similarity. Store enrichments in separate column groups (e.g., ann_* for annotation, ai_* for AI-generated) alongside the original data rather than overwriting it. This preserves provenance and lets you re-run specific enrichment steps without affecting others. Use idempotent writes so running the pipeline twice produces identical results."
    },
    {
      question: "How do you validate the quality of automated enrichments?",
      answer: "Automated enrichments require systematic validation because vision model errors compound across the pipeline. Implement a three-tier validation approach: (1) Spot-check sampling — randomly sample 100 enriched frames and have a human reviewer score each enrichment on a 1-5 scale. For captions, check factual accuracy (are the mentioned objects actually present?), completeness (are all salient objects mentioned?), and action correctness (does the described action match the video?). Target >90% accuracy on factual claims. (2) Cross-model agreement — run a second model (e.g., GPT-4o if primary is Gemini) on 200 samples and compute semantic similarity between captions using sentence-transformers. Agreement below 0.7 cosine similarity flags samples where models disagree, likely indicating ambiguous or unusual content. (3) Distribution validation — compare the distribution of detected object classes, caption lengths, and quality scores against expectations. If your dataset is 80% kitchen scenes but 'kitchen' appears in only 30% of captions, the captioning prompt may be too generic."
    },
    {
      question: "Can enrichment pipelines run incrementally as new data arrives?",
      answer: "Yes, and incremental processing is essential for production datasets that grow over time. Design the pipeline with a watermark or checkpoint system: each enrichment step tracks which records it has processed (by ID or timestamp). When new data arrives, the pipeline queries for un-enriched records and processes only those. In practice, store a processed_ids set or a last_processed_timestamp per enrichment step. For database-backed datasets (e.g., Supabase with a clips table), use SQL queries like SELECT * FROM clips WHERE ai_caption IS NULL LIMIT 1000 to find un-enriched rows. For file-based datasets, maintain a manifest CSV mapping file paths to enrichment status. Incremental pipelines must handle schema evolution gracefully — if you add a new enrichment column (e.g., ai_depth_map), the pipeline should backfill all existing records while continuing to process new arrivals. Set up a cron job or event-driven trigger that runs the pipeline every N hours or on new data upload."
    }
  ],
  ctaHeading: "Need a Data Enrichment Pipeline?",
  ctaDescription: "Claru builds automated enrichment pipelines that add captions, embeddings, quality scores, and structured annotations to robot datasets at scale.",
  relatedGlossaryTerms: ["data-quality-scoring","data-deduplication","semantic-segmentation","scene-understanding"],
  relatedGuidePages: ["how-to-setup-data-quality-pipeline","how-to-deduplicate-robot-training-data"],
  relatedSolutionSlugs: ["egocentric-video-data"],
  difficulty: "intermediate",
  estimatedTime: "1-2 weeks",
  prerequisites: ["Robot dataset in HDF5, RLDS, or database format","Python 3.10+ with GPU access for local inference","API keys for vision-language models (Gemini, OpenAI)","Familiarity with batch processing patterns"],
  tools: ["Python","Gemini API","OpenAI API","CLIP","DINOv2","Florence-2","Grounding-DINO","SAM 2","Depth Anything V2","h5py","Supabase (optional)"],
  steps: [
    {
      stepNumber: 1,
      title: "Audit the Dataset and Define the Enrichment Schema",
      description: "Before building the pipeline, catalog what the raw dataset contains and what enrichments will add the most value for your downstream use case. Inventory the existing fields: video frames (resolution, fps, count), proprioceptive data (joint states, EE pose), action labels, task descriptions, and any existing annotations. Then define the target enrichment schema with specific column names, data types, and storage locations.\n\nA standard enrichment schema for robot datasets includes: caption_text (string, 50-200 words describing the scene and action), embedding_vector (float32 array of 768 dimensions from CLIP ViT-L/14), detected_objects (JSON array of {label, confidence, bbox} dicts), depth_map (float32 HxW array in meters, if no hardware depth), quality_score (float32 0-1 composite of blur, brightness, and completeness), and semantic_cluster_id (int, assigned by k-means on embeddings). Document each field with its source model, version, prompt (for VLMs), and expected update frequency. Store this schema definition as a JSON or YAML file that the pipeline reads at runtime — this makes it trivial to add new enrichment columns later without modifying pipeline code.",
      tools: ["h5py or database client for auditing", "YAML/JSON for schema definition"],
      tips: ["Name enrichment columns with a prefix indicating their source (ai_ for AI-generated, ann_ for human annotations, tech_ for technical metadata) to distinguish them from raw data fields"]
    },
    {
      stepNumber: 2,
      title: "Build the Keyframe Extraction and Batching Layer",
      description: "Most enrichments operate on individual frames rather than full video sequences, so the first pipeline stage extracts representative keyframes. For continuous video, sample uniformly at 1-2 fps — this captures all meaningful scene transitions while reducing processing volume by 15-30x compared to the native frame rate. For episode-based robot data, sample the first frame (initial state), the last frame (final state), and every Nth frame in between where N = episode_length / target_keyframes (typically 3-5 keyframes per episode).\n\nBuild a batching layer that groups keyframes into processing batches of 100-1,000 frames. For API-based enrichment (Gemini, OpenAI), respect rate limits by implementing exponential backoff with jitter (initial wait 1s, max wait 60s, jitter +/- 20%). For local GPU inference (CLIP, Florence-2), batch by model: CLIP processes 256 images per forward pass on an A100, Florence-2 handles 32 images per batch. Implement a batch processor class with methods: extract_keyframes(episode) -> List[Frame], create_batches(frames, batch_size) -> List[Batch], and process_batch(batch, enrichment_fn) -> List[Result]. This abstraction lets you swap enrichment models without changing the pipeline orchestration. Store extracted keyframes with their source episode ID and frame index so results can be mapped back to the original dataset.",
      tools: ["FFmpeg for video keyframe extraction", "NumPy", "Python asyncio for parallel API calls"],
      tips: ["For video datasets, use FFmpeg scene detection (ffmpeg -i input.mp4 -filter:v 'select=gt(scene,0.3)') to extract frames at actual scene changes rather than uniform sampling — this produces more informative keyframes"]
    },
    {
      stepNumber: 3,
      title: "Implement Parallel Enrichment Branches",
      description: "Build each enrichment as an independent function that takes a batch of frames and returns structured results. Run independent enrichments in parallel to maximize throughput. The typical branches are:\n\n(1) Caption generation: Send each keyframe to Gemini 2.5 Flash with a structured prompt: 'Describe this robot manipulation scene in 2-3 sentences. Include: the objects visible, their spatial arrangement, what the robot gripper is doing, and the apparent task goal.' Parse the response and store as caption_text. Cost: ~$0.002-0.005 per frame. (2) Embedding computation: Run CLIP ViT-L/14 or DINOv2 ViT-g/14 on each frame to produce a 768-dim or 1536-dim float32 vector. Store as a binary blob or float array. Local GPU throughput: ~500 frames/second on A100. (3) Object detection: Run Florence-2 or Grounding-DINO with text prompts listing your target object categories. Store bounding boxes as JSON arrays. Local GPU throughput: ~50 frames/second. (4) Depth estimation: Run Depth Anything V2 (ViT-L) to produce per-pixel depth maps. Store as compressed float16 arrays. Local GPU throughput: ~30 frames/second. (5) Quality scoring: Compute Laplacian variance (blur detection, threshold < 100 = blurry), mean brightness (flag < 30 or > 225), and frame completeness (no all-black or all-white regions). Combine into a 0-1 composite score.\n\nUse Python's concurrent.futures.ThreadPoolExecutor for API calls (I/O-bound) and multiprocessing for local GPU inference (compute-bound). Write results to a staging area (temporary files or database staging table) before merging into the master dataset.",
      tools: ["Gemini API", "OpenAI API", "CLIP (via transformers)", "Florence-2", "Depth Anything V2", "concurrent.futures"],
      tips: ["Process the cheapest enrichment (embeddings) first — you can use embedding similarity to identify near-duplicate frames and skip expensive API calls on them"]
    },
    {
      stepNumber: 4,
      title: "Merge Results and Compute Derived Features",
      description: "After all enrichment branches complete, merge results back into the master dataset. For HDF5 datasets, add new datasets under an /enrichments group: /enrichments/captions as variable-length strings, /enrichments/embeddings as float32 arrays, /enrichments/detections as JSON strings. For database-backed datasets, UPDATE each row with the new column values using batch upserts (1,000 rows per transaction to avoid lock contention).\n\nCompute derived features that combine multiple enrichments: (1) Semantic clusters: run k-means (k=20-50) on the embedding vectors using scikit-learn's MiniBatchKMeans for memory efficiency. Assign each frame a cluster_id and compute cluster centroids. These clusters reveal the natural structure of your dataset (e.g., cluster 3 = grasping scenes, cluster 7 = placing scenes). (2) Deduplication flags: compute pairwise cosine similarity between embeddings within each episode and across episodes. Flag pairs with similarity > 0.95 as near-duplicates. For a 100K-frame dataset, use approximate nearest neighbors (FAISS with IVF index) to avoid the O(n^2) brute-force comparison. (3) Diversity scores: for each episode, compute the average pairwise distance between its frame embeddings — low diversity indicates repetitive content. (4) Caption-based tags: extract structured tags from captions using regex or a lightweight NLP model (e.g., spaCy entity extraction) to populate object_tags and action_tags arrays for filtering and search.",
      tools: ["scikit-learn", "FAISS", "spaCy", "h5py or Supabase client"],
      tips: ["Write enrichment results to separate column groups (ai_*, tech_*) that different pipeline runs own — this prevents one enrichment step from accidentally overwriting another"]
    },
    {
      stepNumber: 5,
      title: "Validate Enrichment Quality and Build a Feedback Loop",
      description: "Run systematic validation on the enriched dataset. Sample 200 frames stratified across semantic clusters and manually score each enrichment: caption accuracy (1-5 scale, target mean > 4.0), object detection recall (are all visible objects detected?), depth map plausibility (do estimated depths match visible scene geometry?), and quality score calibration (do low-scored frames actually look bad?).\n\nBuild a feedback loop that uses validation results to improve the pipeline: (1) If caption accuracy is below 4.0, iterate on the VLM prompt — add few-shot examples of correct captions for your domain, specify the robot name and gripper type, and explicitly list common objects. (2) If object detection recall is low for specific categories, add those categories to the text prompt or fine-tune the detector on 50-100 manually labeled examples. (3) If quality scores do not correlate with human judgment, adjust the component weights in the composite score formula. (4) If semantic clusters are not meaningful (e.g., one cluster contains 60% of all frames), increase k or switch to HDBSCAN for variable-density clustering. Track validation metrics across pipeline versions and reject any version that regresses on previously passing metrics. Store the validation report as a JSON file alongside the dataset.",
      tools: ["Streamlit for review UI", "Label Studio for annotation", "pandas for metrics computation"],
      tips: ["Create a small 'golden set' of 50 manually enriched frames with ground-truth captions and detections — run every pipeline version against this set as an automated regression test"]
    },
    {
      stepNumber: 6,
      title: "Deploy for Incremental Processing and Monitor",
      description: "Convert the pipeline from batch processing to incremental mode for production use. Implement a checkpoint system: after each enrichment step processes a batch, record the maximum processed ID or timestamp. On the next run, query for records with IDs greater than the checkpoint. For database-backed datasets, a simple SQL query handles this: SELECT id, frame_data FROM clips WHERE ai_caption IS NULL ORDER BY id LIMIT 1000.\n\nDeploy the pipeline as a scheduled job (cron, Airflow DAG, or Trigger.dev task) that runs every 1-6 hours depending on data arrival rate. Monitor pipeline health with metrics: frames processed per run, enrichment latency per model, API error rates, cost per frame, and quality score distribution of newly enriched frames. Alert if: error rate exceeds 5%, average quality score drops below the historical mean by more than 1 standard deviation, or a run processes zero frames when new data is expected. For cost tracking, log every API call with its token count and model name, then aggregate weekly to detect cost drift. At scale (1M+ frames), the enrichment pipeline becomes the most expensive component of the data infrastructure — monitor it accordingly.\n\nDocument the full pipeline: architecture diagram, enrichment schema, model versions and prompts, cost model, validation methodology, and runbook for common failure modes (API rate limits, GPU OOM, schema migration). This documentation is essential for handoff and reproducibility.",
      tools: ["Cron or Airflow", "Trigger.dev", "Prometheus/Grafana for monitoring", "Slack webhooks for alerts"],
      tips: ["Version your VLM prompts alongside your code in git — prompt changes are the most common source of enrichment quality regressions and the hardest to debug without version history"]
    }
  ],
  keyPapers: [
    {
      id: "radford-clip-2021",
      title: "Learning Transferable Visual Models From Natural Language Supervision",
      authors: "Radford et al.",
      venue: "ICML 2021",
      year: 2021,
      url: "https://arxiv.org/abs/2103.00020"
    },
    {
      id: "oquab-dinov2-2024",
      title: "DINOv2: Learning Robust Visual Features without Supervision",
      authors: "Oquab et al.",
      venue: "TMLR 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2304.07193"
    },
    {
      id: "xiao-florence2-2024",
      title: "Florence-2: Advancing a Unified Representation for a Variety of Vision Tasks",
      authors: "Xiao et al.",
      venue: "CVPR 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2311.06242"
    },
    {
      id: "yang-depth-anything-v2-2024",
      title: "Depth Anything V2",
      authors: "Yang et al.",
      venue: "NeurIPS 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2406.09414"
    }
  ],
  claruRelevance: "Claru operates production data enrichment pipelines that process millions of robot data frames with vision-language models, embedding computation, object detection, and quality scoring. We handle the full pipeline — keyframe extraction, parallel model inference, quality validation, and incremental updates — delivering enriched datasets with captions, embeddings, and structured annotations ready for VLA training and semantic search.",
};

export default data;
