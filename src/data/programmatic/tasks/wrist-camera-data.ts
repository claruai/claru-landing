import type { TaskPageData } from "../types";

const data: TaskPageData = {
  slug: "wrist-camera-data",
  metaTitle: "Wrist Camera Data for Robot Learning | Claru",
  metaDescription: "Wrist-mounted camera data for robot manipulation: close-up hand-object views, in-hand sensing, and eye-in-hand visual servoing datasets for visuomotor policies.",
  primaryKeyword: "wrist camera robot data",
  secondaryKeywords: ["eye-in-hand dataset", "wrist cam manipulation data", "hand-mounted camera robotics", "wrist view robot dataset", "egocentric manipulation data", "eye-in-hand visual servoing"],
  canonicalPath: "/training-data/wrist-camera-data",
  h1: "Wrist Camera Training Data",
  heroSubtitle: "Eye-in-hand visual data for visuomotor policies — wrist-mounted camera recordings providing close-up hand-object interaction views essential for fine manipulation and visual servoing.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Training Data", href: "/training-data" },
    { label: "Wrist Camera", href: "/training-data/wrist-camera-data" },
  ],
  sections: [
    {
      type: "prose",
      heading: "Why Wrist Camera Data Is the Missing Modality in Most Robot Datasets",
      paragraphs: [
        "Wrist-mounted cameras provide an egocentric, eye-in-hand view of the manipulation workspace that third-person cameras cannot replicate. When a robot reaches into a cluttered shelf, behind an obstacle, or inside a container, fixed external cameras lose line of sight — but the wrist camera maintains a close-up view of the end-effector-object interaction throughout. This makes wrist camera data essential for contact-rich tasks: insertion, connector mating, fine-grained grasping, and any manipulation where millimeter-level visual feedback determines success.",
        "The impact of wrist camera data on policy performance is well-documented. Brohan et al. (2023) showed that adding a wrist camera view to RT-2 improved success rates by 15-25% on tasks involving small objects and tight clearances compared to third-person cameras alone. The ALOHA system (Zhao et al., 2023) uses dual wrist cameras as a primary observation modality, and ablation studies confirm that removing wrist views degrades bimanual manipulation success by 20-30%. The Open X-Embodiment dataset (Padalkar et al., 2024) found that policies trained on datasets with wrist views transfer more effectively than those without, likely because wrist views provide a more robot-invariant observation of the task-relevant workspace.",
        "Despite its importance, wrist camera data is scarce in public datasets. Most academic datasets use only overhead or third-person views because wrist cameras add complexity: they move with the arm (requiring ego-motion compensation), have narrow fields of view, and suffer from motion blur during fast movements. Collecting high-quality wrist camera data requires careful camera selection (wide-angle, low-latency, vibration-resistant), mounting design (rigid attachment without obstructing gripper), and synchronization with other modalities. This infrastructure cost is why wrist camera data remains the highest-value gap in the manipulation data landscape.",
        "The proliferation of foundation models for robotics has made wrist camera data even more critical. Models like OpenVLA, Octo, and Pi-zero are designed to consume multi-view inputs where each view provides complementary information. The third-person view gives spatial context and scene layout, while the wrist view gives precise hand-object geometric relationships needed for fine manipulation. Training or fine-tuning these models without wrist camera data produces policies that succeed on coarse tasks (pick up a large object) but fail on fine tasks (insert a USB plug) — precisely the tasks with the highest commercial value. The DROID dataset (Khazatsky et al., 2024) established wrist camera inclusion as a standard by collecting 76,000 demonstrations across 564 tasks with wrist views from 90 institutions, creating a de facto expectation that serious manipulation datasets include this modality.",
      ],
    },
    {
      type: "stats",
      heading: "Wrist Camera Data at a Glance",
      stats: [
        { value: "10K-100K", label: "Clips needed for foundation models" },
        { value: "30-60 Hz", label: "Wrist video capture rate" },
        { value: "15-25%", label: "Success gain from wrist views (RT-2)" },
        { value: "< 5 ms", label: "Required multi-camera sync" },
        { value: "76K", label: "DROID demos with wrist camera" },
        { value: "120+deg", label: "Recommended FOV for wrist cam" },
      ],
    },
    {
      type: "comparison-table",
      heading: "Wrist Camera Data Requirements by Use Case",
      description: "Different policy architectures place different demands on wrist camera data characteristics.",
      columns: ["Use Case", "Resolution", "Frame Rate", "Paired Modalities", "Data Volume"],
      rows: [
        { "Use Case": "Visual servoing", "Resolution": "640x480+", "Frame Rate": "30-60 Hz", "Paired Modalities": "Proprioception", "Data Volume": "5K-20K episodes" },
        { "Use Case": "VLA fine-tuning (OpenVLA, Octo)", "Resolution": "256x256", "Frame Rate": "10-15 Hz", "Paired Modalities": "Language + 3rd person", "Data Volume": "10K-100K clips" },
        { "Use Case": "Diffusion Policy", "Resolution": "320x240+", "Frame Rate": "30 Hz", "Paired Modalities": "Proprioception + 3rd person", "Data Volume": "200-2K per task" },
        { "Use Case": "Grasp detection", "Resolution": "640x480+", "Frame Rate": "30 Hz", "Paired Modalities": "Depth + force/torque", "Data Volume": "10K-50K grasps" },
        { "Use Case": "In-hand manipulation", "Resolution": "640x480+", "Frame Rate": "60 Hz", "Paired Modalities": "Tactile + proprioception", "Data Volume": "5K-30K episodes" },
        { "Use Case": "Cross-embodiment pretraining", "Resolution": "256x256 (standardized)", "Frame Rate": "10-30 Hz", "Paired Modalities": "3rd person + proprioception", "Data Volume": "50K-500K clips" },
      ],
    },
    {
      type: "prose",
      heading: "State of the Art in Wrist Camera-Based Policies",
      paragraphs: [
        "Modern visuomotor policies have converged on using wrist cameras as a primary or co-primary observation modality. The RT-2 system processes wrist and third-person views through a shared vision encoder, learning to attend to whichever view is most informative at each timestep — third-person for approach, wrist for fine manipulation. Octo (Team, 2024) explicitly supports multi-view inputs including wrist cameras, and their ablations show that wrist views are most valuable in the final 30% of manipulation episodes when the end-effector is close to the target object. Pi-zero (Physical Intelligence, 2024) processes wrist camera inputs through a flow-matching architecture, demonstrating that the wrist view is critical for the high-precision phase of manipulation where the policy must servo to sub-centimeter accuracy.",
        "Diffusion Policy with wrist camera observations has become the default setup for fine manipulation tasks. Chi et al. (2023) demonstrate that wrist-view Diffusion Policy achieves 90%+ success on USB insertion (a task requiring sub-millimeter alignment) where third-person-only policies achieve only 50-60%. The key advantage is that the wrist camera provides a consistent, high-resolution view of the insertion point regardless of the global robot configuration. This invariance to arm pose is why wrist camera data improves cross-embodiment transfer — a policy trained with wrist views on a Franka can transfer to a UR5 more easily than one trained with fixed third-person cameras, because the wrist view looks similar across embodiments while third-person views change completely with robot morphology.",
        "The emerging direction is wrist camera-based foundation models. By training on large corpora of wrist camera video from diverse tasks and robots, these models learn general-purpose representations of hand-object interactions that transfer across manipulation tasks. The DROID dataset (Khazatsky et al., 2024) collected 76,000 demonstrations across 564 tasks from 90 institutions, with wrist camera views as a standard modality. This scale of data enables zero-shot policy deployment on new tasks when paired with language conditioning. HPT (Hierarchical Policy Transformer, Wang et al., 2024) demonstrated that training on 200K+ episodes with wrist views from heterogeneous robot platforms produces a policy backbone that requires only 50-100 demonstrations for fine-tuning on new tasks — a 10x reduction compared to training from scratch.",
        "Cross-embodiment transfer is the most commercially valuable property of wrist camera data. Companies building manipulation products need to deploy across different robot arms (Franka, UR, Kinova, custom hardware) without recollecting entire datasets for each platform. Wrist camera views are the most transferable modality because the view depends primarily on the gripper-to-object relationship, not on the arm kinematics or workspace geometry. Open X-Embodiment results show that wrist view data from one robot type improves performance on a different robot type by 10-15%, while third-person data provides near-zero cross-embodiment benefit due to the completely different camera viewpoints.",
      ],
    },
    {
      type: "prose",
      heading: "Collection Methodology for Wrist Camera Data",
      paragraphs: [
        "Wrist camera selection is critical. The camera must be wide-angle (120+ degree FOV) to capture the workspace despite being mounted close to the gripper, low-latency (< 50 ms end-to-end), and vibration-resistant (fixed-focus or hardware-stabilized). Popular choices include the Intel RealSense D405 (RGB-D, compact form factor, 87-degree depth FOV), the Arducam UC-698 (170-degree fisheye, ultra-compact), and custom GoPro-class cameras (high resolution, long latency). For RGB-D wrist cameras, the D405 is currently the gold standard due to its 42 mm minimum depth range (close enough to capture the grasp zone) and 640x480 resolution at 30 Hz. Mounting must be rigid — any relative motion between camera and end-effector invalidates the hand-eye calibration. We use precision-machined aluminum brackets with dowel pin alignment to ensure < 0.1 mm mounting repeatability.",
        "Temporal synchronization is the biggest technical challenge. Wrist camera frames must be synchronized with third-person cameras, proprioception, and force/torque data within 5 ms. At 60 Hz, a 5 ms offset means the wrist camera frame corresponds to a position error of up to 3 mm during fast arm movements — enough to confuse a policy learning fine manipulation. Hardware triggering (using a shared pulse signal to trigger all sensors simultaneously) is strongly preferred over software synchronization. Claru's collection rigs use PTP (Precision Time Protocol) synchronized camera triggers for sub-1 ms alignment across all modalities. We verify synchronization quality at the start of each collection session using a checkerboard visibility test where a checkerboard is simultaneously visible in wrist and third-person cameras, confirming temporal alignment through synchronized motion.",
        "Wrist camera data has unique quality challenges: motion blur during fast movements, lens flare from overhead lighting, and gripper finger occlusion in the field of view. Our quality pipeline automatically flags frames with blur scores above threshold (Laplacian variance < 100), over-exposure from specular reflections (histogram saturation > 15% of pixels), and occlusion events where the gripper blocks more than 40% of the field of view. Flagged episodes are reviewed and either repaired (by adjusting crop) or replaced in the next collection batch. For wide-angle and fisheye lenses, we provide both the raw distorted images (for compatibility with architectures that learn their own spatial representations) and rectified images (with calibrated distortion correction applied) as parallel data channels.",
        "Hand-eye calibration is performed per collection session using the eye-in-hand method: the robot moves through 20+ poses while observing a fixed calibration target, and the resulting pose data is used to compute the rigid transformation between the camera frame and the end-effector frame. This calibration is critical for any downstream processing that requires mapping wrist camera pixels to 3D workspace coordinates. The calibration residual (reprojection error) is recorded and included in the dataset metadata — typical values are 0.5-1.5 pixels for well-calibrated setups. Sessions with reprojection error above 2 pixels are re-calibrated before collection proceeds.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Key Datasets with Wrist Camera Views",
      columns: ["Dataset", "Year", "Scale", "Wrist Camera", "Other Modalities", "Tasks"],
      rows: [
        { "Dataset": "RT-1/RT-2 (Google)", "Year": "2022-23", "Scale": "130K episodes", "Wrist Camera": "RGB (256x256)", "Other Modalities": "3rd person + language", "Tasks": "17 kitchen tasks" },
        { "Dataset": "ALOHA", "Year": "2023", "Scale": "~800 demos", "Wrist Camera": "RGB (480x640)", "Other Modalities": "Proprioception", "Tasks": "Bimanual tasks" },
        { "Dataset": "DROID", "Year": "2024", "Scale": "76K demos", "Wrist Camera": "RGB-D", "Other Modalities": "3rd person + proprioception", "Tasks": "564 tasks" },
        { "Dataset": "Open X-Embodiment", "Year": "2024", "Scale": "1M+ episodes", "Wrist Camera": "Varies (subset)", "Other Modalities": "Mixed", "Tasks": "500+ task types" },
        { "Dataset": "Bridge V2", "Year": "2024", "Scale": "60K demos", "Wrist Camera": "RGB", "Other Modalities": "3rd person + language", "Tasks": "13 task families" },
        { "Dataset": "HPT Pretraining Data", "Year": "2024", "Scale": "200K+ episodes", "Wrist Camera": "RGB (heterogeneous)", "Other Modalities": "Mixed + proprioception", "Tasks": "Multiple platforms" },
        { "Dataset": "Claru Custom", "Year": "2026", "Scale": "10K-100K+", "Wrist Camera": "RGB-D (640x480)", "Other Modalities": "Full multi-modal", "Tasks": "Configurable" },
      ],
    },
    {
      type: "prose",
      heading: "How Claru Supports Wrist Camera Data",
      paragraphs: [
        "Claru's collection rigs are equipped with wrist-mounted Intel RealSense D405 cameras (RGB-D, 640x480, 60 Hz capable) on all teleoperation arms, with precision-machined aluminum mounting brackets ensuring < 0.1 mm positioning repeatability. All wrist cameras are synchronized via PTP hardware triggers to achieve sub-1 ms temporal alignment with third-person cameras and proprioception streams. Hand-eye calibration is performed and verified at the start of each collection session, with calibration residuals logged as dataset metadata.",
        "Our quality pipeline automatically flags motion blur, lens flare, and gripper occlusion issues, replacing affected episodes in subsequent collection batches. We provide both raw fisheye/wide-angle images and rectified images as parallel channels, along with camera intrinsics and distortion coefficients for custom processing. For cross-embodiment datasets, wrist camera data is collected on multiple robot platforms (Franka, UR5e, Kinova Gen3) with standardized camera mounting and calibration procedures to maximize transfer learning utility.",
        "We support wrist camera data collection across all manipulation tasks in our catalog — from fine insertion and connector mating to kitchen tasks, assembly, and warehouse bin picking. Datasets include synchronized wrist RGB-D, third-person RGB-D, 100 Hz proprioception, optional force/torque, and per-frame quality metadata (blur score, exposure quality, occlusion percentage). Delivered in RLDS (OpenVLA/Octo compatible), HDF5 (Diffusion Policy compatible), or custom formats with full hand-eye calibration matrices, camera intrinsics, distortion coefficients, and synchronization verification logs.",
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        { id: "brohan-rt2-2023", title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control", authors: "Brohan et al.", venue: "arXiv 2307.15818", year: 2023, url: "https://arxiv.org/abs/2307.15818" },
        { id: "zhao-aloha-2023", title: "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware", authors: "Zhao et al.", venue: "RSS 2023", year: 2023, url: "https://arxiv.org/abs/2304.13705" },
        { id: "chi-diffusion-2023", title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion", authors: "Chi et al.", venue: "RSS 2023", year: 2023, url: "https://arxiv.org/abs/2303.04137" },
        { id: "team-octo-2024", title: "Octo: An Open-Source Generalist Robot Policy", authors: "Octo Model Team", venue: "arXiv 2405.12213", year: 2024, url: "https://arxiv.org/abs/2405.12213" },
        { id: "khazatsky-droid-2024", title: "DROID: A Large-Scale In-The-Wild Robot Manipulation Dataset", authors: "Khazatsky et al.", venue: "RSS 2024", year: 2024, url: "https://arxiv.org/abs/2403.12945" },
        { id: "wang-hpt-2024", title: "Scaling Proprioceptive-Visual Learning with Heterogeneous Pre-trained Transformers", authors: "Wang et al.", venue: "NeurIPS 2024", year: 2024, url: "https://arxiv.org/abs/2409.20537" },
      ],
    },
  ],
  faqs: [
    {
      question: "How much wrist camera data is needed for foundation model fine-tuning?",
      answer: "For fine-tuning OpenVLA or Octo on a new task, 500-2,000 wrist camera episodes typically suffice when paired with third-person views and language annotations. For fine-tuning Diffusion Policy on a task-specific setup, 200-500 episodes per task achieve 80%+ success rates. For pretraining a new foundation model from scratch, 50,000-100,000+ wrist camera clips spanning diverse tasks are needed — the DROID dataset collected 76,000 demonstrations with wrist views as the baseline for general-purpose policy training, and HPT demonstrated benefits from scaling to 200K+ episodes. Start with task-specific fine-tuning data and scale to pretraining volumes only if building a proprietary foundation model or if your task distribution is highly novel.",
    },
    {
      question: "What wrist camera resolution and frame rate should I target?",
      answer: "For VLA fine-tuning, images are typically downsampled to 256x256, so native 640x480 is sufficient and avoids storage overhead. For visual servoing and insertion tasks requiring sub-millimeter accuracy, 640x480 or higher at 60 Hz is recommended to capture the fine spatial details and fast dynamics at the contact point. For Diffusion Policy, 320x240 at 30 Hz is the standard in published work. Collect at the highest resolution your storage budget allows — downsampling is always possible, but upsampling introduces artifacts. Budget approximately 2 GB per hour of wrist camera video at 640x480 30 Hz with lossless PNG encoding, or 500 MB per hour with H.264 compression at quality factor 18. We recommend lossless or near-lossless encoding for datasets under 10,000 episodes and compressed encoding for larger corpora.",
    },
    {
      question: "Should wrist camera data include depth or just RGB?",
      answer: "RGB-only is sufficient for most VLA and Diffusion Policy architectures, which process images through 2D convolutional or vision transformer encoders. Depth from wrist cameras adds measurable value for three specific use cases: insertion tasks (where the 3D geometry of the approaching object determines alignment strategy), in-hand manipulation (where depth reveals object pose within the gripper), and grasp detection (where point cloud-based grasp planners like GraspNet require 3D input). The Intel RealSense D405 is the most popular wrist-mount RGB-D camera with a minimum depth range of 42 mm suitable for close-range manipulation. If depth is not captured, monocular depth estimation networks (Depth Anything V2) can be applied post-hoc, but native stereo or structured-light depth is preferred for sub-centimeter accuracy in the near-field grasp zone.",
    },
    {
      question: "How critical is wrist-to-third-person camera synchronization?",
      answer: "Synchronization is a hard requirement, not a nice-to-have. Policies that process both views jointly require temporal alignment within 5 ms to avoid learning incorrect visual-action correspondences. At typical arm velocities during manipulation (0.3-1.0 m/s), a 10 ms offset means the wrist and third-person views show the end-effector at positions 3-10 mm apart — enough to confuse a policy learning fine manipulation with sub-centimeter precision targets. Use hardware-triggered synchronization (PTP or shared trigger pulse), not software timestamps that rely on OS scheduling. Verify sync quality at the start of each session by checking that the end-effector position computed from both views agrees within 2 mm. For datasets where hardware sync was not available, software timestamp-based alignment is acceptable only for coarse manipulation tasks with > 5 cm precision requirements.",
    },
    {
      question: "How do you handle motion blur in wrist camera data?",
      answer: "Three strategies address motion blur systematically. First, hardware: use a camera with a global shutter and short exposure time (< 2 ms) to minimize per-frame blur. Rolling shutter cameras (most consumer webcams) produce characteristic skew artifacts during fast wrist motion that confuse learned policies. The Intel RealSense D405 uses a global shutter for both RGB and depth. Second, collection protocol: limit arm velocity during the fine manipulation phase (where wrist camera data is most valuable) or increase frame rate to 60 Hz to reduce inter-frame motion. Fast transit motions between tasks can tolerate more blur since the wrist camera view is less informative during transit. Third, quality pipeline: automatically detect blurred frames using Laplacian variance below threshold (we use 100 as the default cutoff) and flag entire episodes where more than 10% of frames are blurred. Our pipeline replaces heavily blurred episodes rather than filtering individual frames, as temporal continuity is important for policy training.",
    },
    {
      question: "Why is wrist camera data important for cross-embodiment transfer?",
      answer: "Wrist camera data is the most transferable visual modality across robot embodiments because it depends primarily on the gripper-object geometric relationship rather than on the arm kinematics, workspace layout, or camera placement. A wrist camera view of a gripper approaching a mug handle looks nearly identical whether the camera is mounted on a Franka, UR5, or Kinova arm — the view shows the gripper fingers, the target grasp region, and the local object geometry. In contrast, third-person camera views change completely between robot setups due to different camera positions, workspace geometries, and arm morphologies. Open X-Embodiment experiments show that wrist view data from one robot platform provides 10-15% transfer benefit to a different platform, while third-person data provides near-zero cross-embodiment benefit. This makes wrist camera data the highest-leverage investment for teams that need to deploy across multiple robot hardware configurations.",
    },
  ],
  ctaHeading: "Get a Custom Quote for Wrist Camera Data",
  ctaDescription: "Tell us your target tasks, camera specifications, and volume requirements. We will configure our collection rigs with the right wrist camera setup for your policy architecture.",
  relatedGlossaryTerms: ["manipulation-trajectory", "behavioral-cloning", "imitation-learning", "visual-servoing", "cross-embodiment-transfer"],
  relatedGuidePages: ["how-to-build-a-manipulation-dataset"],
  relatedSolutionSlugs: [],
  dataRequirements: {
    modality: "Wrist RGB-D (640x480) + third-person RGB-D + proprioception (100 Hz)",
    volumeRange: "10K-100K clips synchronized with actions",
    temporalResolution: "30-60 Hz wrist video, 30 Hz third-person, 100 Hz proprioception",
    keyAnnotations: ["Object proximity and contact state", "Grasp state detection (pre-grasp, grasp, post-grasp)", "Hand-object occlusion mask", "Motion blur quality flag", "Action-image temporal alignment verification", "Hand-eye calibration residual"],
  },
  relevantModels: ["OpenVLA", "Octo", "RT-2", "Diffusion Policy", "ACT/ALOHA", "HPT", "Pi-zero"],
  environmentTypes: ["Tabletop manipulation", "Kitchen", "Assembly workstation", "Shelf picking", "Any manipulation workspace"],
  keyPapers: [
    { id: "brohan-rt2-2023", title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control", authors: "Brohan et al.", venue: "arXiv 2307.15818", year: 2023, url: "https://arxiv.org/abs/2307.15818" },
    { id: "zhao-aloha-2023", title: "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware", authors: "Zhao et al.", venue: "RSS 2023", year: 2023, url: "https://arxiv.org/abs/2304.13705" },
    { id: "chi-diffusion-2023", title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion", authors: "Chi et al.", venue: "RSS 2023", year: 2023, url: "https://arxiv.org/abs/2303.04137" },
    { id: "khazatsky-droid-2024", title: "DROID: A Large-Scale In-The-Wild Robot Manipulation Dataset", authors: "Khazatsky et al.", venue: "RSS 2024", year: 2024, url: "https://arxiv.org/abs/2403.12945" },
    { id: "wang-hpt-2024", title: "Scaling Proprioceptive-Visual Learning with Heterogeneous Pre-trained Transformers", authors: "Wang et al.", venue: "NeurIPS 2024", year: 2024, url: "https://arxiv.org/abs/2409.20537" },
  ],
  claruRelevance: "Claru's collection rigs are equipped with wrist-mounted Intel RealSense D405 cameras (RGB-D, 640x480, 60 Hz capable) on all teleoperation arms, synchronized via PTP hardware triggers to achieve sub-1 ms temporal alignment with third-person cameras and proprioception streams. Precision-machined aluminum mounting brackets ensure < 0.1 mm positioning repeatability, and hand-eye calibration is performed and verified at the start of each collection session with residuals logged as metadata. Our quality pipeline automatically flags motion blur, lens flare, and gripper occlusion issues, replacing affected episodes in subsequent collection batches. We support wrist camera data collection across all manipulation tasks in our catalog and provide both raw and rectified images with full calibration data. For cross-embodiment datasets, we collect on multiple robot platforms with standardized wrist camera configurations. Delivered in RLDS (OpenVLA/Octo compatible), HDF5 (Diffusion Policy compatible), or custom formats with hand-eye calibration matrices, camera intrinsics, distortion coefficients, and synchronization verification logs.",
};

export default data;
