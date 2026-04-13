import type { GuidePageData } from "../types";

const data: GuidePageData = {
  slug: "how-to-build-an-egocentric-data-pipeline",
  metaTitle: "How to Build an Egocentric Video Data Pipeline (2026 Guide) | Claru",
  metaDescription: "Step-by-step guide to building an egocentric video data pipeline for physical AI, covering camera hardware, ingestion, enrichment, and delivery at scale.",
  primaryKeyword: "how to build an egocentric video data pipeline",
  secondaryKeywords: ["egocentric video pipeline", "first-person video data collection", "egocentric data processing", "wearable camera data pipeline"],
  canonicalPath: "/guides/how-to-build-an-egocentric-data-pipeline",
  h1: "How to Build an Egocentric Video Data Pipeline",
  heroSubtitle: "Step-by-step guide to building a production-grade pipeline that ingests, processes, enriches, and delivers first-person video data for training embodied AI and world models.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Guides", href: "/guides" },
    { label: "Build an Egocentric Video Data Pipeline", href: "/guides/how-to-build-an-egocentric-data-pipeline" },
  ],
  sections: [
    {
      type: "prose",
      heading: "Pipeline Architecture: Batch Processing vs. Streaming",
      paragraphs: [
        "Egocentric video pipelines must handle two fundamentally different workloads. During active collection campaigns, raw video files arrive daily and need to be processed through the privacy, quality, and enrichment stages within 24-48 hours to enable feedback to collectors (flagging quality issues) and progress tracking (monitoring diversity coverage). Between campaigns, the pipeline processes the backlog at maximum throughput to complete enrichment before the data delivery deadline. This dual-mode requirement influences every architecture decision.",
        "For pipelines processing under 500 clips per week, a sequential Python script with checkpointing (saving progress after each stage so crashed jobs can resume) is sufficient. The script iterates over clips, running each through ingestion, privacy filtering, and enrichment stages in sequence. Use SQLite or a JSON manifest to track the processing state of each clip. For pipelines processing 500+ clips per week, use Apache Airflow with a DAG that defines dependencies between stages. Airflow's task parallelism distributes GPU-intensive enrichment jobs across multiple workers, and its built-in retry logic handles transient failures (GPU OOM, network timeouts) without manual intervention. Configure a Celery executor backed by Redis for task queuing. The critical architectural constraint is that privacy filtering must complete before any enrichment runs \u2014 annotators and enrichment models should never process unblurred PII content.",
      ],
    },
    {
      type: "prose",
      heading: "Enrichment Model Stack: Depth, Segmentation, and Captioning",
      paragraphs: [
        "A standard egocentric video enrichment pipeline runs five model passes that extract the training signals downstream embodied AI models need. First, monocular depth estimation using Depth Anything V2 (ViT-Large checkpoint) processes frames at 518x518 resolution, producing per-frame relative depth maps saved as 16-bit PNG. On an A100 GPU with batch size 16, throughput is 15-20 FPS, meaning a 5-minute clip (9,000 frames at 30fps) takes 8-10 minutes. Second, semantic segmentation using SAM2 in video mode generates instance-level masks with temporal consistency across frames \u2014 initialize on the first frame and propagate through the video using SAM2's memory-based tracking.",
        "Third, hand-object interaction detection using a model trained on the Ego4D benchmark (such as 100DOH) extracts per-frame annotations of hand state (free, pre-grasp, grasp, post-release) and contacted object bounding boxes. Fourth, dense captioning using Gemini 2.5 Flash or GPT-4o generates natural language descriptions at 2-second intervals. Fifth, per-clip CLIP embeddings (averaging 5 uniformly sampled frame embeddings into a 768-dimensional vector) enable similarity search and dataset curation. Each enrichment layer adds a separate annotation channel that downstream consumers can selectively load. Store enrichment outputs as separate files alongside the source frames \u2014 this separation allows re-running individual enrichment stages without re-processing the entire pipeline.",
      ],
    },
  ],
  faqs: [
    {
      question: "What cameras work best for egocentric video data collection?",
      answer: "The three leading options are GoPro Hero 12/13, Meta Aria glasses, and the RealSense D455 in a head-mounted configuration. GoPro cameras offer the best image quality (5.3K at 30 FPS or 4K at 120 FPS), excellent stabilization (HyperSmooth 6.0), wide field of view (SuperView at 170 degrees), and robust build quality for all-day wear when mounted on a head strap. Record at 4K 30 FPS with a linear lens profile to minimize fisheye distortion that complicates downstream object detection. Meta Aria glasses provide a more naturalistic form factor with synchronized RGB, depth, eye tracking, and IMU streams, but the resolution is lower (1408x1408 for the SLAM cameras) and availability is limited to approved research programs. For depth-enabled egocentric capture, the RealSense D455 mounted on a helmet provides synchronized RGB-D at 640x480 at 30 FPS with stereo depth up to 6 meters, which enables 3D scene reconstruction from first-person views. Budget 200-500 USD per recording unit and plan for 2-4 spare units to handle battery swaps and equipment failures during multi-day collection campaigns."
    },
    {
      question: "How much storage and compute do I need for an egocentric video pipeline?",
      answer: "A single GoPro recording at 4K 30 FPS with H.265 encoding produces approximately 45 GB per hour. For a production campaign collecting 100 hours of raw footage, budget 4.5 TB of raw storage. The processing pipeline adds 3-5x on top of raw storage: decoded frames (uncompressed PNG at 4K is roughly 25 MB per frame, so 30 FPS for one hour is 2.7 TB), intermediate outputs from vision models (depth maps, segmentation masks, object detections), and enriched metadata databases. In total, plan for 15-25 TB per 100 hours of raw footage. Use AWS S3 Glacier Instant Retrieval for raw video archives at roughly 4 USD per TB per month, S3 Standard for active processing data, and local NVMe SSDs for GPU processing nodes. For compute, a single A100 GPU processes video through Depth Anything V2 at approximately 15 FPS for 518x518 resolution, meaning 100 hours of 30 FPS video requires roughly 200 GPU-hours just for depth estimation. Add similar compute for SAM2 segmentation, object detection, and captioning. A realistic budget for processing 100 hours through a full enrichment pipeline is 500-800 A100 GPU-hours."
    },
    {
      question: "How do I handle privacy and PII in egocentric video data?",
      answer: "Egocentric video captures faces, license plates, screens, documents, and other personally identifiable information continuously. Implement a three-layer privacy pipeline. First, run a face detection model (RetinaFace or YOLO-Face) and a license plate detector on every frame, then apply Gaussian blur with a kernel size of 99x99 pixels to all detected regions. Process at 1 FPS for efficiency since faces rarely appear for less than one second. Second, apply OCR detection (PaddleOCR or EasyOCR) to find and blur readable text on screens, documents, and signs that might contain private information. Third, run a human review pass on a 5% sample of blurred frames to verify the automated pipeline's recall, targeting above 98% face detection recall. Store the original unblurred video in an access-restricted encrypted bucket separate from the blurred version, with audit logs for any access. Include a PII incident response procedure: if a downstream user reports an unblurred face in the processed data, you need to reprocess that clip within 24 hours and issue a corrected version."
    },
    {
      question: "What enrichment models should I run on egocentric video data?",
      answer: "A standard enrichment stack for egocentric video used in embodied AI training includes five model passes. First, monocular depth estimation using Depth Anything V2 (ViT-Large checkpoint) at the video's native resolution, producing per-frame relative depth maps saved as 16-bit PNG. Second, semantic segmentation using SAM2 or OneFormer to generate per-frame panoptic segmentation masks with category labels for hands, objects, surfaces, and background. Third, hand-object interaction detection using a specialized model like 100DOH (100 Days of Hands) or EgoHOS that identifies which hand is touching which object at each frame, producing contact state annotations (no contact, pre-grasp, in-grasp, post-release). Fourth, temporal activity recognition using an Ego4D-trained SlowFast or VideoMAE model to classify activity segments at 1 Hz (cooking, cleaning, assembling, walking). Fifth, dense captioning using a vision-language model (Gemini 2.5 Flash or LLaVA-OneVision) to generate natural language descriptions of the scene every 2-5 seconds. Each enrichment layer adds training signal that downstream models can leverage, and storing them as separate annotation channels lets users compose the subset they need."
    },
    {
      question: "How do I validate pipeline output quality at scale?",
      answer: "Implement automated quality gates at each pipeline stage, supplemented by periodic human spot-checks. For ingestion, verify frame extraction completeness by comparing the expected frame count (duration times frame rate from the video metadata) against the actual extracted frame count, rejecting clips where more than 0.5% of frames are missing. For depth estimation, compute the depth map validity ratio (fraction of pixels with non-zero depth) and reject frames below 85% validity, which typically indicates the model failed on overexposed or heavily blurred frames. For segmentation, check that the hand mask area falls within a plausible range (0.5-15% of frame area when hands are visible) and that the total segmented area exceeds 20% of the frame (catching cases where the model outputs near-empty masks). For captioning, compute the average caption length (target 15-40 words) and run a CLIP similarity check between the caption embedding and the frame embedding, flagging captions with similarity below 0.25 as likely hallucinations. Aggregate these per-frame metrics into per-clip quality scores and generate a daily quality dashboard that tracks the distribution of scores across the processing queue. Human reviewers should audit 2-3% of clips by watching the enriched output at 2x speed and rating accuracy on a 1-5 scale, targeting a mean above 4.0."
    },
    {
      question: "How do I handle clips where enrichment models fail or produce low-quality output?",
      answer: "Implement a fallback strategy for each enrichment stage. For depth estimation failures (all-zero depth maps, depth range implausible), retry with a lower resolution or a different model checkpoint. For segmentation failures (empty masks, single-class masks covering the entire frame), fall back to SAM2's automatic mode with higher IoU threshold. For caption failures (CLIP similarity below 0.25), retry with a different prompt template or a different VLM. After two retries, flag the clip for manual review rather than blocking the pipeline. Store a bitfield per clip indicating which enrichment layers completed successfully (for example, depth_ok, seg_ok, caption_ok) so downstream consumers can filter by enrichment completeness. A typical pipeline achieves 95% success rate per enrichment stage, so roughly 85% of clips will have all five enrichment layers complete.",
    },
  ],
  ctaHeading: "Need Help With This?",
  ctaDescription: "Talk to a Claru specialist about building an egocentric data pipeline for your physical AI training needs.",
  relatedGlossaryTerms: ["egocentric-video", "data-enrichment", "data-quality-scoring"],
  relatedGuidePages: ["how-to-collect-egocentric-video-data"],
  relatedSolutionSlugs: ["egocentric-video-data"],
  difficulty: "intermediate",
  estimatedTime: "2-4 weeks",
  prerequisites: ["Cloud storage account (AWS S3 or GCS)", "GPU compute access (A100 or H100 instances)", "Python 3.10+ with PyTorch 2.x and FFmpeg installed", "Collection team with wearable cameras"],
  tools: ["FFmpeg", "Depth Anything V2", "SAM2", "Label Studio", "AWS S3", "PyTorch", "Apache Airflow"],
  steps: [
    {
      stepNumber: 1,
      title: "Design the Pipeline Architecture and Data Schema",
      description: "Map out the end-to-end pipeline from raw video ingestion to enriched dataset delivery. An egocentric video pipeline has four stages: ingest (receive raw video files, validate, and archive), process (extract frames, run quality checks, apply privacy filters), enrich (run vision models for depth, segmentation, activity recognition, and captioning), and deliver (package enriched data in the target format and push to the consumer).\n\nDefine a data schema that tracks every artifact. Each raw video clip gets a unique clip_id. The schema should include: clip_id (UUID), source_camera (gopro_hero12, aria, realsense), collector_id, recording_date, duration_seconds, resolution, fps, location_type (kitchen, office, workshop, outdoor), activity_category, raw_s3_key, privacy_status (pending, blurred, reviewed), and processing_status (ingested, frames_extracted, depth_complete, segmentation_complete, captions_complete, delivered). Store this metadata in a PostgreSQL database (or Supabase) that serves as the pipeline's single source of truth.\n\nChoose an orchestration framework. For pipelines processing under 500 clips per week, a simple Python script with sequential processing and checkpointing is sufficient. For larger volumes, use Apache Airflow with a DAG that defines dependencies between stages: ingestion triggers frame extraction, which triggers parallel depth and segmentation jobs, which trigger captioning once both complete. Configure Airflow with a Celery executor backed by Redis for task queuing and an SQS or Pub/Sub trigger for new uploads. Define retry logic: depth estimation retries up to 3 times with exponential backoff, captioning retries twice, and any clip that fails after retries is flagged for manual review rather than blocking the pipeline."
    },
    {
      stepNumber: 2,
      title: "Build the Ingestion and Frame Extraction Layer",
      description: "The ingestion layer receives raw video files from collectors, validates them, and prepares them for processing. Set up an S3 bucket (or GCS bucket) with a standardized upload path: s3://your-bucket/raw/{collector_id}/{date}/{clip_id}.mp4. Configure an S3 event notification or Lambda trigger that fires when a new .mp4 file lands, registers the clip in the metadata database, and enqueues it for processing.\n\nFrame extraction is the most storage-intensive stage. Use FFmpeg to decode video to individual frames: ffmpeg -i input.mp4 -vf 'fps=30' -q:v 2 output/frame_%06d.jpg. The -q:v 2 flag produces high-quality JPEG at roughly 200-400 KB per frame for 4K, which is 10x more storage-efficient than PNG while maintaining sufficient quality for vision model inference. For depth estimation and segmentation that require lossless input, extract a subsample at lower rate (e.g., 5 FPS) as 16-bit PNG. Store extracted frames in a separate S3 prefix: s3://your-bucket/frames/{clip_id}/rgb/frame_{NNNNNN}.jpg.\n\nRun immediate quality checks during ingestion. Verify the video file is not corrupted using ffprobe (check that duration, codec, and frame count are parseable). Compute per-frame blur scores using the Laplacian variance method (cv2.Laplacian(gray, cv2.CV_64F).var()) on every 30th frame, flagging clips where more than 30% of sampled frames have blur scores below 100. Compute exposure histograms and flag clips with more than 20% over-exposed or under-exposed frames. These automated checks catch the most common collection quality issues (lens smudges, camera tilted to ceiling, recording started before camera was properly worn) before any expensive GPU processing runs."
    },
    {
      stepNumber: 3,
      title: "Implement the Privacy and PII Filtering Stage",
      description: "Egocentric video inherently captures bystander faces, readable text, and other sensitive content. Build a robust de-identification pipeline that runs before any enrichment. Use RetinaFace (the mobilenet0.25 backbone for speed, or ResNet-50 for higher recall) to detect faces at 1 FPS. For each detected face bounding box, expand the box by 20% in each direction to ensure hair and ears are covered, then apply a strong Gaussian blur (kernel size 99, sigma 30) to the expanded region. Track face detections across frames using a simple IOU tracker to ensure consistent blurring even if the detector misses occasional frames.\n\nAdd a text/screen detection layer. Run PaddleOCR's detection model (not recognition, just detection) on every 5th frame to find regions containing readable text. Blur detected text regions with the same Gaussian kernel. This catches computer screens, phone screens, document text, and name badges that appear in egocentric footage.\n\nFor license plates, use a specialized detector (WPOD-NET or a YOLO model fine-tuned on plate detection) if your collection includes any outdoor or parking lot scenarios. Render the blurred video using FFmpeg's drawbox filter applied programmatically, producing a new video file at the same resolution and framerate as the original. Store both the original (in an access-restricted bucket with encryption at rest) and the blurred version. Generate a PII detection report for each clip that lists: number of faces detected, number of text regions detected, number of plates detected, and frames where detection confidence was low (these are the highest-risk frames for missed PII). Human reviewers should audit clips with high PII density (more than 50 face detections per minute) or low-confidence detections, watching at 2x speed and flagging any unblurred PII."
    },
    {
      stepNumber: 4,
      title: "Run the Multi-Model Enrichment Pipeline",
      description: "Process each privacy-filtered clip through a stack of vision models that extract the training signals downstream models need. Run these in a defined order with GPU batching for efficiency.\n\nFirst, monocular depth estimation. Load the Depth Anything V2 ViT-Large checkpoint and process frames at the model's native resolution (518x518). Batch 8-16 frames per GPU forward pass depending on available VRAM (40 GB A100 fits batch size 16). Save depth maps as 16-bit PNG (values in millimeters) alongside the original frames. On an A100, expect 15-20 FPS throughput, meaning a 5-minute clip at 30 FPS (9,000 frames) takes approximately 8-10 minutes.\n\nSecond, semantic segmentation using SAM2 (Segment Anything Model 2) in video mode. Initialize SAM2 with automatic mask generation on the first frame, then propagate masks through the video using SAM2's memory-based tracking. This produces instance-level masks with temporal consistency across frames. Post-process masks to assign semantic categories by running CLIP on cropped mask regions and matching against a category vocabulary (hand, tool, food, container, appliance, furniture, person, background). Save masks as per-frame indexed PNG where each pixel value maps to an instance ID, with a sidecar JSON mapping instance IDs to semantic categories.\n\nThird, hand-object interaction detection. Use a model trained on the Ego4D hand-object interaction benchmark (such as the 100DOH detector) to extract per-frame annotations of hand state (free, pre-grasp, grasp, post-release) and contacted object bounding boxes. Save as JSON per frame with fields: left_hand_state, right_hand_state, left_contact_object_bbox, right_contact_object_bbox.\n\nFourth, dense captioning. Sample frames at 2-second intervals and send to Gemini 2.5 Flash or GPT-4o with a prompt: 'Describe what the person wearing the camera is doing in this frame. Include objects being manipulated, the action being performed, and the environment. Be specific and concise (15-30 words).' Save captions with their timestamps. Compute CLIP similarity between each caption and its source frame as an automated quality check.\n\nFifth, generate per-clip vector embeddings by encoding 5 uniformly sampled frames through CLIP ViT-L/14 and averaging the embeddings into a single 768-dimensional vector. Store these in the metadata database for similarity search and dataset curation."
    },
    {
      stepNumber: 5,
      title: "Validate, Curate, and Build Quality Dashboards",
      description: "After enrichment, run a comprehensive validation pass that catches processing errors and assesses data quality across the entire collection. Implement automated validators for each enrichment output. For depth maps: verify that no depth map is all-zero (processing failure), compute the depth range per frame and flag maps where the maximum depth is below 0.5 meters or above 20 meters (likely sensor or model error), and check temporal consistency by computing the mean absolute depth change between consecutive frames (should be below 0.3 meters for stationary scenes). For segmentation masks: verify that hand masks appear in at least 40% of frames for manipulation-focused data (catching clips where the camera was angled away from hands), check that no single instance ID covers more than 80% of pixels (catching degenerate all-background masks), and verify mask temporal consistency using IOU between consecutive frames.\n\nBuild a quality dashboard that displays aggregate statistics across the pipeline. Track: total clips processed and in-progress, processing time per stage (ingestion, depth, segmentation, captioning), failure rate per stage with error categorization, per-clip quality scores (composite of blur, exposure, depth validity, mask coverage, and caption relevance), and collection coverage metrics (hours per activity category, hours per environment type, hours per collector). Use this dashboard for active curation: sort clips by quality score and review the bottom 10% to decide whether to re-process, re-collect, or discard.\n\nFor datasets where diversity matters, build a coverage matrix that cross-tabulates activity categories against environment types and identifies under-represented cells. Feed this back to the collection team as targeted collection assignments: 'We need 10 more hours of cooking activities in non-kitchen environments' or '5 more hours of workshop activities with power tools.' This feedback loop between pipeline quality metrics and collection planning is what distinguishes a production pipeline from a one-shot processing job."
    },
    {
      stepNumber: 6,
      title: "Package and Deliver Enriched Data in Target Formats",
      description: "Convert the pipeline outputs into the format your downstream consumers expect. For embodied AI research teams training on egocentric data, the standard delivery format is a directory structure per clip: /{clip_id}/rgb/ (JPEG frames), /{clip_id}/depth/ (16-bit PNG depth maps), /{clip_id}/segmentation/ (indexed PNG masks plus category JSON), /{clip_id}/hand_object/ (per-frame interaction JSON), /{clip_id}/captions.json (timestamped captions), and /{clip_id}/metadata.json (clip-level metadata including quality scores, camera parameters, and collection context). Compress each clip directory into a .tar.gz archive for efficient transfer.\n\nFor teams using WebDataset (the standard for large-scale PyTorch training), convert each clip into a sequence of .tar shards where each sample is a single timestep containing rgb.jpg, depth.png, mask.png, caption.txt, and metadata.json. This format enables streaming DataLoader access without downloading the full dataset. For HuggingFace Datasets integration, generate a dataset loading script that uses datasets.GeneratorBasedBuilder to yield samples from the tar archives.\n\nCreate a dataset manifest that serves as the entry point for the delivery. The manifest should be a Parquet file with one row per clip containing: clip_id, duration, activity_category, environment_type, quality_score, frame_count, enrichment_completeness (bitfield indicating which enrichment layers are present), and S3 paths to all artifacts. Include a Python SDK (a single .py file with 200-300 lines) that wraps the manifest and provides methods like dataset.clips(activity='cooking', min_quality=0.8) for filtering, dataset.load_clip(clip_id) for loading all modalities, and dataset.stream() for WebDataset-style streaming. This SDK eliminates the 1-2 weeks that teams typically spend writing custom data loading code for new datasets."
    }
  ],
  keyPapers: [
    {
      id: "grauman-ego4d-2022",
      title: "Ego4D: Around the World in 3,000 Hours of Egocentric Video",
      authors: "Grauman et al.",
      venue: "CVPR 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2110.07058"
    },
    {
      id: "yang-depth-anything-v2-2024",
      title: "Depth Anything V2",
      authors: "Yang et al.",
      venue: "NeurIPS 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2406.09414"
    },
    {
      id: "ravi-sam2-2024",
      title: "SAM 2: Segment Anything in Images and Videos",
      authors: "Ravi et al.",
      venue: "arXiv 2408.00714",
      year: 2024,
      url: "https://arxiv.org/abs/2408.00714"
    },
    {
      id: "damen-epic-kitchens-2022",
      title: "Rescaling Egocentric Vision: Collection, Pipeline and Challenges for EPIC-KITCHENS-100",
      authors: "Damen et al.",
      venue: "IJCV 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2006.13256"
    }
  ],
  claruRelevance: "Claru operates a production-grade egocentric data pipeline that processes thousands of hours of first-person video monthly. We handle collection across 100+ cities with standardized GoPro and RealSense setups, automated PII filtering with human verification, multi-model enrichment (depth, segmentation, hand-object interaction, captioning), and delivery in WebDataset, HDF5, or custom formats. Our pipeline includes quality dashboards and coverage tracking that feed back into targeted collection for maximum dataset diversity.",
};

export default data;
