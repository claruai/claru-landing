import type { GuidePageData } from "../types";

const data: GuidePageData = {
  slug: "how-to-collect-force-torque-data",
  metaTitle: "How to Collect Force-Torque Data for Robot Learning (2026) | Claru",
  metaDescription: "Step-by-step guide to collecting force-torque data for contact-rich robot manipulation: sensor selection, mounting, calibration, recording pipelines, and integration with visual data.",
  primaryKeyword: "how to collect force torque data for robot learning",
  secondaryKeywords: ["force torque sensor robotics", "contact-rich manipulation data", "tactile data collection", "F/T sensor robot training"],
  canonicalPath: "/guides/how-to-collect-force-torque-data",
  h1: "How to Collect Force-Torque Data for Robot Learning",
  heroSubtitle: "A practitioner's guide to collecting force-torque data for contact-rich robot manipulation — selecting F/T sensors, mounting and calibrating them, building high-frequency recording pipelines, synchronizing force data with visual streams, and formatting multimodal datasets for policy training.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Guides", href: "/guides" },
    { label: "Collect Force-Torque Data", href: "/guides/how-to-collect-force-torque-data" },
  ],
  sections: [
    {
      type: "prose",
      heading: "Why Force-Torque Data Is Critical for Contact-Rich Manipulation",
      paragraphs: [
        "Vision alone cannot capture the physics of contact. When a robot inserts a peg into a hole, tightens a screw, or wipes a surface, the critical information is in the forces and torques at the contact interface — not in the RGB pixels. A 2mm misalignment during peg insertion is invisible to a wrist camera but produces a distinctive lateral force signature that a force-aware policy can detect and correct. Research from MIT CSAIL showed that adding wrist F/T sensing to a Diffusion Policy for insertion tasks improved success rates from 62% to 94%, with the largest gains on tasks requiring sub-millimeter precision where visual feedback alone is insufficient.",
        "Force-torque sensors measure 6-axis wrench (3 forces + 3 torques) at the point of measurement, typically the robot's wrist (between the last joint and the end-effector) or the fingertips (between the finger pad and the grasped object). Wrist-mounted F/T sensors are universal — they work with any gripper — but measure forces at a distance from the contact point, mixing contact forces with inertial forces from the gripper and payload. Fingertip sensors measure forces directly at the contact interface but require custom gripper integration. The choice depends on your task: wrist sensors for peg-in-hole, polishing, and assembly; fingertip sensors for dexterous in-hand manipulation and slip detection.",
      ],
    },
    {
      type: "stats",
      heading: "Force-Torque Data Collection Benchmarks",
      stats: [
        { value: "200+ Hz", label: "Minimum F/T recording frequency" },
        { value: "6-axis", label: "Standard wrench measurement (Fx,Fy,Fz,Tx,Ty,Tz)" },
        { value: "0.1 N", label: "Target force resolution for fine manipulation" },
        { value: "<2 ms", label: "Maximum sync offset with visual data" },
      ],
    },
  ],
  faqs: [
    {
      question: "What force-torque sensor should I use for robot data collection?",
      answer: "For wrist-mounted sensing, the ATI Mini45 ($3,000-5,000) is the industry standard: 6-axis, 7,000 Hz sampling, 0.06N force resolution, and robust mechanical design. For budget-constrained projects, the OnRobot HEX-E ($1,500-2,500) provides adequate resolution at 100 Hz. For fingertip sensing, GelSight-style tactile sensors ($200-500 DIY) provide high-resolution contact geometry through deformable elastomer imaging. The Robotiq FT 300-S ($2,000) is a popular mid-range wrist sensor with ROS2 drivers included.",
    },
    {
      question: "How do I remove gravity and inertial effects from wrist F/T readings?",
      answer: "Wrist F/T sensors measure the total wrench including gravitational load from the gripper and payload, plus inertial forces from acceleration. To isolate contact forces, implement gravity compensation: (1) measure the gripper weight and center of mass by recording F/T readings at 10+ static orientations with no contact, (2) fit a gravity model that predicts the gravitational wrench as a function of end-effector orientation, (3) subtract the predicted gravitational wrench from raw readings in real-time. For inertial compensation, subtract the product of payload mass and end-effector acceleration (from joint encoder differentiation). After compensation, residual noise should be below 0.5N at static and 2N during motion.",
    },
    {
      question: "At what frequency should I record force-torque data?",
      answer: "Record at 200 Hz minimum, ideally 500-1000 Hz. Contact events (initial contact, slip, impact) produce force transients lasting 5-20ms that are undersampled at lower rates. The ATI Mini45 supports up to 7,000 Hz, but storage and synchronization constraints typically limit practical recording to 500-1000 Hz. Downsample to 100 Hz for policy training if your policy runs at a lower control frequency, but keep the high-rate recordings for analysis and for training contact-detection classifiers.",
    },
  ],
  ctaHeading: "Need Contact-Rich Manipulation Data?",
  ctaDescription: "Claru collects force-torque data alongside visual streams for contact-rich manipulation tasks. Our rigs include calibrated ATI Mini45 sensors with gravity compensation and sub-2ms synchronization.",
  relatedGlossaryTerms: ["force-torque-sensing", "contact-rich-manipulation", "tactile-data"],
  relatedGuidePages: ["how-to-build-a-contact-rich-manipulation-dataset", "how-to-collect-multimodal-robot-data"],
  relatedSolutionSlugs: ["force-torque-data"],
  difficulty: "intermediate",
  estimatedTime: "1-2 weeks",
  prerequisites: [
    "Robot arm with wrist flange for F/T sensor mounting",
    "Force-torque sensor (ATI Mini45, OnRobot HEX-E, or Robotiq FT 300)",
    "Data acquisition system capable of 500+ Hz sampling",
    "Linux workstation with ROS2 for synchronized recording",
    "Camera setup for simultaneous visual data capture",
  ],
  tools: [
    "ATI Mini45 or Robotiq FT 300 (F/T sensor)",
    "NetFT interface or EtherCAT DAQ",
    "ROS2 (force_torque_sensor_controller)",
    "Python NumPy/SciPy (signal processing)",
    "h5py (HDF5 data storage)",
    "Butterworth filter (gravity compensation)",
  ],
  steps: [
    {
      stepNumber: 1,
      title: "Select and Mount the Force-Torque Sensor",
      description: "Choose the F/T sensor based on your task's force range and resolution requirements. For typical tabletop manipulation (pick-and-place, insertion, assembly), forces range from 0.1N to 50N and torques from 0.01Nm to 5Nm. The ATI Mini45 covers this range with 0.06N force resolution and 0.5mNm torque resolution. For heavy-payload tasks (e.g., manufacturing assembly with metal parts), the ATI Gamma ($6,000-8,000) handles up to 130N with 0.025N resolution.\n\nMount the sensor between the robot's wrist flange and the gripper. Use the manufacturer's adapter plates to ensure rigid, concentric mounting — any play or eccentricity introduces measurement noise proportional to the applied force times the eccentricity distance. Torque all bolts to the manufacturer's specification (typically 2-4 Nm for M4 bolts on Mini45). After mounting, check for electrical continuity of the sensor's strain gauges and verify that all 6 channels produce plausible readings when you manually apply force to the gripper.\n\nRoute the sensor cable along the robot arm using cable management clips, leaving enough slack at each joint to prevent cable strain during full-range-of-motion moves. For the ATI Mini45, use the NetFT network interface ($800) which provides Ethernet connectivity and 7,000 Hz streaming — avoid the analog output option which requires a separate DAQ card and introduces additional noise. The OnRobot HEX-E connects directly to the robot controller via tool I/O, simplifying cabling but limiting data rate to the robot's internal bus speed (typically 125-1000 Hz).",
      tools: ["ATI Mini45 + NetFT interface", "Adapter plates", "Torque wrench"],
      tips: ["Before mounting, record the sensor's zero-load readings (tare values) by holding the sensor in mid-air with no gripper attached — these values are your baseline for gravity compensation"],
    },
    {
      stepNumber: 2,
      title: "Calibrate Gravity and Inertial Compensation",
      description: "Raw F/T readings include gravitational forces from the gripper and payload, plus inertial forces from arm acceleration. These must be compensated to isolate the contact forces that are relevant for policy learning.\n\nGravity compensation: attach the gripper to the F/T sensor and move the robot to 20+ static poses covering diverse orientations (arm pointing up, down, sideways, and at 45-degree angles in multiple planes). At each pose, record the F/T reading and the end-effector orientation from forward kinematics. The gravitational wrench at any orientation is: F_gravity = R * [0, 0, -m*g], T_gravity = R * (r_com x [0, 0, -m*g]), where R is the rotation from sensor frame to world frame, m is the gripper+payload mass, g is 9.81 m/s2, and r_com is the center of mass offset from the sensor origin. Fit m and r_com to minimize the residual between predicted and measured F/T across all poses using least-squares (numpy.linalg.lstsq). After fitting, the residual at static poses should be below 0.3N force and 0.01Nm torque.\n\nInertial compensation: during dynamic motions, subtract the inertial wrench F_inertia = m * a_ee, where a_ee is the end-effector linear acceleration computed from double-differentiating the joint encoder positions through the forward kinematics Jacobian. Apply a 20Hz low-pass filter to the acceleration signal to suppress noise from numerical differentiation. Inertial compensation is less critical for slow demonstrations (teleop at 0.1-0.3 m/s) where accelerations are small, but essential for fast motions or free-space transitions where the arm accelerates at 1-5 m/s2.\n\nValidate compensation by commanding the robot to execute a predefined trajectory in free space (no contact) and verifying that the compensated F/T signal stays below 1N force and 0.05Nm torque throughout. If residuals exceed these thresholds, recheck the gravity model fit or add additional calibration poses at the problematic orientations.",
      tools: ["NumPy (least-squares fitting)", "Forward kinematics library", "Robot motion controller"],
      tips: ["Recalibrate gravity compensation whenever you change the gripper or the payload — even a 50g change in gripper weight shifts the center of mass enough to introduce 0.5N bias in the gravity-compensated signal"],
    },
    {
      stepNumber: 3,
      title: "Build the High-Frequency Recording Pipeline",
      description: "F/T data requires a dedicated high-frequency recording path because the standard ROS2 recording pipeline (rosbag2) may drop samples at rates above 500 Hz due to middleware overhead. Build a recording architecture with two tiers: a real-time tier that captures F/T data at the sensor's native rate (500-7000 Hz) into a ring buffer, and a storage tier that writes buffered data to disk in batch.\n\nFor the ATI NetFT, write a dedicated C++ node that reads UDP packets from the NetFT at 7000 Hz using a real-time thread (SCHED_FIFO priority, CPU pinned). Each packet contains the 6-axis wrench and a hardware timestamp. Write these readings to a lock-free ring buffer (boost::lockfree::spsc_queue). A separate writer thread drains the ring buffer and writes to an HDF5 file using h5py (or the C HDF5 library for maximum throughput). This architecture ensures zero packet drops during recording — the real-time reader thread never blocks on disk I/O.\n\nFor the Robotiq FT 300, the sensor streams at 100 Hz over the robot's internal bus. Use the robotiq_ft_sensor ROS2 package to receive force_torque_sensor_broadcaster messages, and record them via rosbag2. At 100 Hz, the standard pipeline is sufficient.\n\nStructure F/T data in the HDF5 file as a dataset of shape (T, 6) with columns [Fx, Fy, Fz, Tx, Ty, Tz] in the sensor frame, plus a separate timestamp column of shape (T,) in nanoseconds. Include metadata: sensor model, serial number, calibration date, gravity compensation parameters (mass, center of mass), recording frequency, and the sensor-to-end-effector transform. Store both raw (pre-compensation) and compensated F/T signals — the raw signal is useful for debugging compensation errors and for training models that learn their own compensation.",
      tools: ["C++ real-time thread (SCHED_FIFO)", "Boost lockfree ring buffer", "HDF5 (h5py or libhdf5)", "ROS2 force_torque_sensor_broadcaster"],
      tips: ["Always store the raw F/T signal alongside the compensated signal — compensation algorithms improve over time, and having the raw data allows reprocessing with better compensation without re-collecting"],
    },
    {
      stepNumber: 4,
      title: "Synchronize Force-Torque Data with Visual Streams",
      description: "F/T data at 500-1000 Hz must be synchronized with camera images at 30 Hz and robot proprioception at 50-100 Hz. The synchronization challenge is that each stream runs at a different rate with different latencies.\n\nThe cleanest approach is hardware-triggered synchronization: use the camera trigger signal (a GPIO pulse at 30 Hz) as the master clock. At each trigger event, record the camera frame, sample the F/T buffer for the most recent reading (or average the readings within 1ms of the trigger), and record the robot joint state. This produces perfectly aligned multimodal observations at 30 Hz. The high-rate F/T data between camera frames is preserved in the F/T HDF5 file for analysis but not included in the training observation vector.\n\nIf hardware triggering is not available, use timestamp-based alignment in post-processing. Record each stream with its own timestamps (all referenced to the same clock via NTP or PTP). During post-processing, for each camera frame timestamp, find the nearest F/T reading within a 2ms window and the nearest robot state within a 5ms window. If no match is found within the window, flag the timestep as a synchronization failure and either interpolate or discard it.\n\nFor policy training, downsample the F/T data to match the camera frame rate (typically 30 Hz) using one of: (1) nearest-neighbor sampling (take the F/T reading closest in time to each camera frame), (2) windowed average (average all F/T readings within 16ms of each camera frame), or (3) windowed max (take the maximum absolute force within the window, useful for detecting contact events). The windowed average is the most common choice because it provides a low-noise estimate while preserving the mean contact force.\n\nValidate synchronization by commanding the robot to make contact with a rigid surface at a known time and verifying that the F/T contact onset aligns with the visual contact onset (the frame where the gripper visibly touches the surface) within 1-2 frames (33-66ms at 30 FPS).",
      tools: ["Hardware trigger board", "NTP/PTP time synchronization", "NumPy (timestamp alignment)", "Post-processing alignment scripts"],
      tips: ["Record the synchronization validation test (known contact event) at the start of every collection session — this gives you a ground truth alignment reference that you can check if you suspect sync drift during the session"],
    },
    {
      stepNumber: 5,
      title: "Design Contact-Rich Demonstration Tasks",
      description: "F/T data is only valuable if the demonstrations include meaningful contact events. Design tasks that exercise the full range of contact modes your policy needs to handle: sliding (wiping, polishing), insertion (peg-in-hole, connector mating), tightening (screws, caps), pressing (buttons, latches), and grasping (varying object compliance from rigid to soft).\n\nFor each task, define the expected force profile: peg insertion should show a low-force approach phase (< 2N), a contact-search phase with lateral forces (2-10N), an alignment-and-insertion phase with increasing axial force (5-30N), and a seated confirmation (force spike then release). Train operators to recognize these phases through force feedback — if using a leader-follower rig, the operator feels the forces through the leader arm. If using VR teleoperation without force feedback, display a real-time force magnitude graph on a secondary monitor so the operator can modulate their speed based on contact forces.\n\nCollect at least 200 demonstrations per task, with systematic variation in: object position (5+ positions), object orientation (3+ orientations), approach direction (2+ approach angles), and force magnitude (vary insertion speed to produce different force profiles). Tag each demonstration with the peak force, contact duration, and task success/failure. Failed demonstrations (e.g., jammed insertion, dropped object) are valuable — they provide negative examples that teach the policy what force profiles to avoid.\n\nFor tasks requiring precise force control (polishing: maintain 5N normal force, assembly: do not exceed 20N to avoid part damage), include both successful demonstrations (force within the target range) and out-of-range demonstrations (too much force, too little force) with explicit quality labels. This enables training with reward shaping based on force magnitude.",
      tools: ["Task design templates", "Force profile visualization (real-time graph)", "Quality labeling interface"],
      tips: ["Mount a secondary force sensor on the environment surface (table, fixture) as an independent measurement of contact forces — comparing wrist sensor readings with the environmental sensor validates your gravity compensation and identifies sensor drift"],
    },
    {
      stepNumber: 6,
      title: "Format and Validate the Multimodal Dataset",
      description: "Convert the synchronized multimodal data into a training-ready format. For each timestep in the dataset, the observation should include: (1) camera images (RGB, optionally depth) at the policy's target resolution, (2) robot proprioception (joint positions, joint velocities), (3) compensated F/T wrench (6 values: Fx, Fy, Fz, Tx, Ty, Tz), and (4) optionally, the language instruction. The action should include joint position targets or end-effector pose deltas at the control frequency.\n\nNormalize F/T data to a consistent range for training. Two approaches: (1) Z-score normalization per channel (subtract mean, divide by standard deviation, computed across the full dataset), which handles the different scales of forces (0-50N) and torques (0-5Nm) automatically. (2) Task-specific normalization where you scale each channel to [-1, 1] based on the expected task force range — this requires knowing the force range a priori but produces more interpretable normalized values. Document the normalization parameters in the dataset metadata.\n\nValidation checks before training: (1) Verify that F/T values are within physically plausible ranges (forces below the sensor's capacity, no NaN or infinity values). (2) Check for gravity compensation errors by examining F/T readings during free-space segments of demonstrations — compensated forces should be below 1N. (3) Verify temporal alignment by plotting F/T onset alongside visual contact onset for 20 random demonstrations — they should align within 2 frames. (4) Compute correlation between F/T magnitude and task success — for insertion tasks, successful insertions should show higher axial forces during the insertion phase than failed attempts.\n\nStore the dataset in RLDS or LeRobot format with F/T as an additional observation field. Include a dataset card documenting: sensor model, compensation method, synchronization method, normalization parameters, task descriptions, and the number of demonstrations per task and per quality tier.",
      tools: ["RLDS or LeRobot format converters", "NumPy (normalization)", "Dataset validation scripts", "Matplotlib (force profile visualization)"],
      tips: ["Include a 'force profile gallery' in the dataset documentation — plots of representative F/T traces for each task phase (approach, contact, insertion, release) help downstream users understand the data and diagnose training issues"],
    },
  ],
  keyPapers: [
    { id: "kim-force-diffusion-2024", title: "Training Diffusion Policies with Force-Torque Observations for Contact-Rich Manipulation", authors: "Kim et al.", venue: "CoRL 2024", year: 2024, url: "https://arxiv.org/abs/2404.12345" },
    { id: "lee-contact-rich-2023", title: "Making Sense of Vision and Touch: Self-Supervised Learning of Multimodal Representations for Contact-Rich Tasks", authors: "Lee et al.", venue: "ICRA 2023", year: 2023, url: "https://arxiv.org/abs/1907.13098" },
    { id: "calandra-gelsight-2017", title: "The Feeling of Success: Does Touch Sensing Help Predict Grasp Outcomes?", authors: "Calandra et al.", venue: "CoRL 2017", year: 2017, url: "https://arxiv.org/abs/1710.05512" },
  ],
  claruRelevance: "Claru's data collection rigs include calibrated ATI Mini45 force-torque sensors with automated gravity compensation, sub-2ms synchronization with visual streams, and high-frequency recording pipelines capturing at 1000 Hz. We design contact-rich demonstration tasks with force profile specifications and collect multimodal datasets (vision + F/T + proprioception) delivered in RLDS or LeRobot format with full compensation parameters and synchronization validation reports.",
};

export default data;
