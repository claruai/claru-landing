import type { GuidePageData } from "../types";

const data: GuidePageData = {
  slug: "how-to-calibrate-multi-camera-rigs",
  metaTitle: "How to Calibrate Multi-Camera Rigs for Robot Data (2026 Guide) | Claru",
  metaDescription: "Step-by-step guide to calibrating multi-camera rigs for robot data collection: intrinsic/extrinsic calibration, hand-eye calibration, temporal synchronization, and validation procedures.",
  primaryKeyword: "how to calibrate multi-camera rigs for robotics",
  secondaryKeywords: ["multi-camera calibration robotics", "hand-eye calibration", "camera rig robot data", "extrinsic calibration robot"],
  canonicalPath: "/guides/how-to-calibrate-multi-camera-rigs",
  h1: "How to Calibrate Multi-Camera Rigs for Robot Data Collection",
  heroSubtitle: "A practitioner's guide to calibrating multi-camera setups for robot data collection — intrinsic calibration with ChArUco boards, extrinsic hand-eye calibration, temporal synchronization across cameras and sensors, and automated validation to catch calibration drift before it corrupts your dataset.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Guides", href: "/guides" },
    { label: "Calibrate Multi-Camera Rigs", href: "/guides/how-to-calibrate-multi-camera-rigs" },
  ],
  sections: [
    {
      type: "prose",
      heading: "Why Camera Calibration Is the Foundation of Visual Robot Data",
      paragraphs: [
        "Every pixel in your robot dataset carries an implicit geometric claim: this pixel corresponds to a specific 3D point in the robot's workspace. If your camera calibration is wrong, that claim is wrong, and any policy trained on the data learns a distorted mapping between vision and action. A 5mm extrinsic calibration error on a wrist camera translates to a 5mm systematic bias in every grasp pose the policy predicts — enough to cause consistent grasp failures on small objects. The RT-2 team at Google DeepMind reported that recalibrating cameras across their fleet of 13 robots improved policy success rates by 8-12% without any changes to the model or training procedure.",
        "Multi-camera rigs for robot data collection typically include 3-6 cameras: one or two wrist-mounted cameras (close-up view of gripper-object interaction), one overhead camera (workspace overview), and one or two side cameras (resolving occlusions). Each camera has its own intrinsic parameters (focal length, principal point, distortion coefficients) and extrinsic parameters (6-DoF pose relative to the robot base frame). Both must be calibrated independently and validated jointly. Additionally, all cameras must be temporally synchronized — a 30ms timing offset between a wrist camera and the robot's joint encoder means the visual observation shows the gripper at a different position than the proprioceptive observation reports, creating inconsistent training pairs.",
      ],
    },
    {
      type: "stats",
      heading: "Calibration Quality Benchmarks",
      stats: [
        { value: "<0.3 px", label: "Target intrinsic reprojection error" },
        { value: "<3 mm", label: "Target extrinsic position accuracy" },
        { value: "<5 ms", label: "Maximum temporal sync offset" },
        { value: "Weekly", label: "Recommended recalibration frequency" },
      ],
    },
    {
      type: "prose",
      heading: "Common Calibration Failures and Their Impact on Training",
      paragraphs: [
        "The most insidious calibration failure is not a large, obvious error but a small systematic bias that silently degrades policy performance. A 2mm consistent offset in the wrist camera extrinsics shifts every grasp target by 2mm in the same direction — the policy learns to reach 2mm to the left of every object. During evaluation, this manifests as inconsistent grasp success that is difficult to diagnose because the error is small and systematic, not random. Another common failure is calibration drift: wrist cameras mounted with adhesive or friction-fit brackets gradually shift position due to robot vibration and thermal cycling. Over a multi-week collection campaign, the extrinsics can drift by 5-10mm, creating a dataset where early and late episodes have inconsistent camera-to-robot transforms.",
        "Temporal synchronization failures are equally damaging. If the overhead camera runs on software timestamps while the robot joint encoders use hardware timestamps, a variable 10-30ms offset creates training pairs where the visual observation and the proprioceptive observation disagree about the current robot state. During fast motions (reaching, placing), this offset can represent 5-15mm of end-effector displacement — enough to confuse the policy about the relationship between what it sees and where the arm actually is. Always use hardware timestamps or a shared trigger signal to synchronize all data streams.",
      ],
    },
  ],
  faqs: [
    {
      question: "How often should I recalibrate cameras during a data collection campaign?",
      answer: "Recalibrate intrinsics once (they only change if the lens or focus changes) and extrinsics weekly or whenever a camera is physically disturbed. For wrist cameras on robot arms subject to vibration, check extrinsic calibration daily by running a quick validation: move the robot to 5 known poses and verify that projected calibration board corners match detected corners within 3mm. If any camera exceeds this threshold, recalibrate before collecting more data. Keep a calibration log with timestamps so you can identify which episodes in the dataset were collected with which calibration parameters.",
    },
    {
      question: "Can I use AprilTags instead of ChArUco boards for calibration?",
      answer: "AprilTags work for extrinsic calibration (estimating camera-to-robot transforms) but are suboptimal for intrinsic calibration because they provide fewer corner detections per image than a ChArUco board. A 6x8 ChArUco board gives up to 35 corners per image, while a single AprilTag gives only 4 corners. More corners per image means more constraints for the intrinsic solver, resulting in lower reprojection error. Use ChArUco for intrinsics, and either ChArUco or AprilTags for extrinsics — AprilTags are easier to detect at longer ranges and oblique angles, which can be useful for overhead cameras.",
    },
    {
      question: "What resolution should I use for calibration images versus training images?",
      answer: "Calibrate at the same resolution you will use for training data. If you plan to train policies at 256x256, calibrate at the native camera resolution (e.g., 1920x1080) and then compute the scaled intrinsic parameters for 256x256. Calibrating directly at low resolution produces poor results because the corner detector has fewer pixels to localize corners precisely. The scaling is straightforward: focal length and principal point scale linearly with the resolution ratio, distortion coefficients remain unchanged.",
    },
  ],
  ctaHeading: "Need Calibrated Multi-Camera Rigs?",
  ctaDescription: "Claru provides pre-calibrated multi-camera rigs with automated validation for robot data collection. We handle intrinsics, extrinsics, and temporal sync so you can focus on demonstrations.",
  relatedGlossaryTerms: ["camera-calibration", "extrinsic-parameters", "hand-eye-calibration"],
  relatedGuidePages: ["how-to-setup-a-teleoperation-rig", "how-to-collect-multimodal-robot-data"],
  relatedSolutionSlugs: ["multi-camera-data"],
  difficulty: "intermediate",
  estimatedTime: "2-3 days",
  prerequisites: [
    "Multi-camera setup (3-6 cameras, e.g., Intel RealSense D405/D435i)",
    "ChArUco calibration board (printed on rigid material, not paper)",
    "Robot arm with position control API for hand-eye calibration",
    "Linux workstation with OpenCV 4.5+ and Python 3.9+",
    "Hardware trigger board or PTP-capable network switch for synchronization",
  ],
  tools: [
    "OpenCV 4.5+ (cv2.aruco, cv2.calibrateCamera, cv2.calibrateHandEye)",
    "Intel RealSense SDK (librealsense2)",
    "ROS2 camera_calibration package",
    "Open3D (for 3D verification visualization)",
    "PTP (Precision Time Protocol) for network cameras",
    "NumPy, SciPy (calibration math)",
  ],
  steps: [
    {
      stepNumber: 1,
      title: "Prepare the Calibration Board and Environment",
      description: "Print a ChArUco board on rigid, flat material — not paper, which warps and bows. Use a professional print shop to produce a ChArUco board on aluminum composite (Dibond) or rigid foam board with matte lamination to prevent glare. The board should be at least 300x400mm for tabletop manipulation setups, with a square size of 30-40mm and marker size of 22-30mm (approximately 75% of square size). The 6x8 ChArUco dictionary (DICT_6X6_250) provides a good balance between detection reliability and corner density.\n\nMeasure the actual printed square size with digital calipers — printing processes introduce systematic scaling errors of 0.5-2%. A board specified as 35mm squares that actually prints at 34.5mm squares introduces a 1.4% systematic scale error in all calibrated parameters. Record the measured square size and use it in all calibration scripts.\n\nControl the calibration environment: use diffuse, even lighting (avoid harsh shadows or specular highlights on the board), ensure the board is visible to all cameras simultaneously for multi-camera extrinsic calibration, and verify that the board is flat by placing it on a known-flat reference surface and checking for gaps with a straightedge. Environmental preparation takes 30 minutes but prevents hours of debugging poor calibration results.",
      tools: ["ChArUco board on rigid substrate", "Digital calipers", "Diffuse lighting"],
      tips: ["Order two identical calibration boards — keep one as a reference and use the other for daily calibration. If the working board gets damaged or warped, you have an immediate replacement without waiting for a reprint"],
    },
    {
      stepNumber: 2,
      title: "Calibrate Camera Intrinsics",
      description: "Intrinsic calibration estimates the focal length, principal point, and distortion coefficients for each camera independently. Capture 20-40 images of the ChArUco board per camera, varying the board's position, orientation, and distance systematically. The board should cover the full field of view: include images with the board in all four corners, the center, and at multiple distances (30cm, 60cm, 100cm for wrist cameras; 50cm, 100cm, 200cm for overhead cameras). Tilt the board at angles of 15-45 degrees in each capture to provide strong constraints on the distortion model.\n\nUse OpenCV's cv2.aruco.detectMarkers() followed by cv2.aruco.interpolateCornersCharuco() to extract corner positions from each image. Discard images where fewer than 50% of corners are detected. Feed the remaining corners into cv2.calibrateCamera() with the CALIB_RATIONAL_MODEL flag for cameras with significant barrel or pincushion distortion (common in wide-angle lenses used for overhead views). For narrow-angle wrist cameras, the simpler 5-parameter model (k1, k2, p1, p2, k3) is usually sufficient.\n\nTarget a reprojection error below 0.3 pixels. If the error exceeds 0.5 pixels, the calibration is suspect — check for warped calibration board, inconsistent lighting, motion blur in calibration images, or insufficient angular coverage. Repeat the capture with corrected conditions. Save the intrinsic matrix and distortion coefficients to a YAML file per camera, including the camera serial number, calibration date, image resolution, and reprojection error. This file is the source of truth for all downstream processing.",
      tools: ["OpenCV cv2.aruco module", "cv2.calibrateCamera()", "YAML for parameter storage"],
      tips: ["Capture calibration images with the camera in its final mounted position and the same exposure/gain settings used during data collection — different exposure settings can shift the effective principal point by 1-2 pixels on some camera models"],
    },
    {
      stepNumber: 3,
      title: "Calibrate Camera-to-Robot Extrinsics (Hand-Eye Calibration)",
      description: "Extrinsic calibration estimates the 6-DoF transform from each camera frame to the robot base frame. For wrist-mounted cameras, this is a hand-eye calibration problem: find the transform from the camera to the robot's end-effector link, then compose it with the known forward kinematics to get camera-to-base.\n\nProcedure: mount the ChArUco board in a fixed position visible to the wrist camera. Move the robot end-effector to 15-20 diverse poses (varying position and orientation), recording the robot's end-effector pose from forward kinematics and the ChArUco board pose in the camera frame at each position. Use OpenCV's cv2.calibrateHandEye() with the TSAI method (cv2.CALIB_HAND_EYE_TSAI) or the PARK method for improved robustness. The solver estimates the camera-to-end-effector transform.\n\nFor fixed (non-wrist) cameras, the approach is simpler: attach the ChArUco board to the robot's end-effector and move the robot to 15-20 poses while the fixed camera observes the board. At each pose, record the robot's end-effector pose and the board pose in the camera frame. The camera-to-base transform is then: T_camera_to_base = T_camera_to_board * T_board_to_ee * T_ee_to_base, where T_board_to_ee is a fixed known transform (how you mounted the board to the end-effector) and T_ee_to_base is from forward kinematics.\n\nVerification: after calibration, move the robot to 10 new poses (not used in calibration) and project the end-effector position into each camera using the calibrated extrinsics. The projected position should match the actual end-effector position in the image within 3mm (approximately 5-10 pixels at typical working distances). If any camera exceeds 5mm error, recollect calibration data with more diverse poses.",
      tools: ["cv2.calibrateHandEye()", "Robot forward kinematics", "ChArUco board mounted to end-effector"],
      tips: ["Include poses where the robot's end-effector is rotated by 90+ degrees — many calibration failures come from insufficient rotational diversity in the calibration poses, which leaves the rotation component of the hand-eye transform poorly constrained"],
    },
    {
      stepNumber: 4,
      title: "Synchronize Cameras Temporally",
      description: "Temporal synchronization ensures all cameras capture frames at the same physical instant. Without synchronization, cameras running at 30 FPS independently can have up to 33ms relative offset — during a 0.5 m/s end-effector motion, that is 16mm of displacement, far exceeding the acceptable error for manipulation data.\n\nHardware triggering is the gold standard: connect all cameras to a shared GPIO trigger signal from the recording computer or a dedicated trigger board. The computer sends a trigger pulse at the desired frame rate (e.g., 30 Hz), and all cameras capture a frame simultaneously. Intel RealSense cameras support hardware triggering through the inter-cam sync cable (RealSense D400 series) — connect one camera as the master (generating the sync signal) and all others as slaves. Verify synchronization by waving an LED rapidly in view of all cameras and checking that the LED state matches across all camera frames.\n\nFor network cameras (GigE Vision, FLIR Blackfly), use PTP (Precision Time Protocol, IEEE 1588) over a dedicated Ethernet network to synchronize camera clocks to sub-microsecond accuracy. Each camera timestamps frames using its PTP-synchronized clock, and the recording software aligns frames by timestamp. This requires a PTP-capable network switch (approximately $200-500) and PTP client configuration on each camera.\n\nSoftware synchronization (matching frames by arrival time on the host computer) is the least accurate method: network and USB latency introduce 5-30ms jitter. Use software sync only as a fallback and verify the worst-case offset by the LED test described above. If the maximum offset exceeds 10ms, invest in hardware triggering.\n\nFor synchronizing cameras with non-camera sensors (robot joint encoders, force/torque sensors), use a shared clock reference: either hardware timestamps from a common clock source, or NTP/PTP synchronization across all devices. The robot's internal clock should be the reference — convert all camera timestamps to the robot's time base during recording.",
      tools: ["Intel RealSense inter-cam sync cable", "PTP-capable network switch", "GPIO trigger board", "LED for sync verification"],
      tips: ["Test temporal synchronization before every collection session — a loose sync cable or PTP misconfiguration can silently desynchronize cameras, and the resulting data is nearly impossible to fix in post-processing"],
    },
    {
      stepNumber: 5,
      title: "Validate the Full Calibration Pipeline",
      description: "Run three validation procedures to confirm the complete calibration is correct before collecting any training data.\n\nValidation 1 — Cross-camera consistency: place the ChArUco board in 10 positions visible to multiple cameras simultaneously. For each position, estimate the board's 3D pose from each camera independently using the calibrated intrinsics and extrinsics. The estimated board poses from all cameras should agree within 3mm position and 1 degree orientation. If they do not, one or more cameras have incorrect extrinsics.\n\nValidation 2 — Robot projection test: move the robot end-effector to 20 positions spanning the full workspace. At each position, project the end-effector's known 3D position (from forward kinematics) into each camera using the calibrated intrinsics and extrinsics. Overlay the projected point on the camera image. The projected point should align with the actual end-effector in the image within 5 pixels (approximately 2-3mm at 50cm distance). Compute the mean and maximum projection error across all cameras and positions. Target: mean < 3 pixels, max < 8 pixels.\n\nValidation 3 — Temporal alignment check: command the robot to execute a fast, distinctive motion (e.g., 0.5m vertical move in 0.5 seconds). Record all cameras and the robot joint encoder simultaneously. Plot the end-effector position over time from the joint encoder and from each camera (using the calibrated extrinsics to back-project the end-effector's image position to 3D). All traces should align temporally within 5ms — if the camera traces lag the encoder trace, your temporal synchronization has an offset that needs correction.\n\nDocument all validation results in a calibration report with the date, camera serial numbers, reprojection errors, cross-camera consistency metrics, and temporal offset measurements. Store this report alongside the calibration parameters so that any future dataset quality issue can be traced back to the calibration state at collection time.",
      tools: ["Validation scripts (Python + OpenCV)", "Matplotlib (for plotting temporal alignment)", "Calibration report template"],
      tips: ["Automate all three validation procedures into a single script that runs in under 5 minutes — if validation requires manual effort, it will be skipped when the team is under time pressure, and calibration drift will go undetected"],
    },
    {
      stepNumber: 6,
      title: "Automate Recalibration and Drift Detection",
      description: "Build an automated calibration monitoring system that runs in the background during data collection and alerts the team when calibration drift exceeds acceptable thresholds.\n\nThe simplest drift detector uses fiducial markers: mount 3-5 AprilTags in permanent positions in the workspace (on the table surface, wall, or robot base). During each recording episode, detect these markers in every camera frame and compute their estimated 3D positions using the current calibration. If the estimated positions drift by more than 2mm from their reference positions (established during the last calibration), flag the episode for review and trigger a recalibration alert.\n\nFor wrist cameras where fiducial markers may not be consistently visible, use a kinematics-based drift detector: compare the robot's end-effector position from forward kinematics with the end-effector position estimated from the wrist camera image (using a simple end-effector detector or the known gripper geometry). Compute a running average of the discrepancy — if it exceeds 3mm over 10 consecutive episodes, the wrist camera extrinsics have likely drifted.\n\nBuild a recalibration pipeline that can be triggered with a single command and completes in under 15 minutes: the robot automatically moves to a predefined set of calibration poses, captures images of the permanently mounted ChArUco board, runs the hand-eye calibration solver, validates the results, and updates the calibration files. Automated recalibration reduces the barrier to frequent recalibration from 'a 2-hour procedure requiring a calibration expert' to 'press a button and wait 15 minutes.' Teams that implement automated recalibration typically recalibrate daily, while teams with manual recalibration procedures do it monthly at best — and the dataset quality difference is measurable.",
      tools: ["AprilTag library", "Automated recalibration scripts", "Monitoring dashboard (Grafana or simple web UI)"],
      tips: ["Store every calibration run's parameters in a version-controlled repository with timestamps — when you discover a data quality issue months later, you can trace which calibration was active during the affected collection period and determine if calibration drift was the root cause"],
    },
  ],
  keyPapers: [
    { id: "tsai-hand-eye-1989", title: "A New Technique for Fully Autonomous and Efficient 3D Robotics Hand/Eye Calibration", authors: "Tsai & Lenz", venue: "IEEE Transactions on Robotics and Automation", year: 1989, url: "https://ieeexplore.ieee.org/document/34770" },
    { id: "park-hand-eye-1994", title: "Robot Sensor Calibration: Solving AX=XB on the Euclidean Group", authors: "Park & Martin", venue: "IEEE Transactions on Robotics and Automation", year: 1994, url: "https://ieeexplore.ieee.org/document/326576" },
    { id: "garrido-charuco-2014", title: "Automatic Generation and Detection of Highly Reliable Fiducial Markers under Occlusion", authors: "Garrido-Jurado et al.", venue: "Pattern Recognition", year: 2014, url: "https://www.sciencedirect.com/science/article/pii/S0031320314000235" },
  ],
  claruRelevance: "Claru's data collection rigs ship pre-calibrated with automated drift detection and daily recalibration procedures built in. Our multi-camera setups use hardware-triggered Intel RealSense arrays with sub-5ms temporal synchronization, validated extrinsics achieving <3mm accuracy, and permanent fiducial markers for continuous calibration monitoring. When we deliver datasets, every episode includes the calibration parameters that were active at recording time, enabling downstream users to verify geometric consistency.",
};

export default data;
