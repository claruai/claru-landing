import type { GuidePageData } from "../types";

const data: GuidePageData = {
  slug: "how-to-build-a-contact-rich-manipulation-dataset",
  metaTitle: "How to Build a Contact-Rich Manipulation Dataset (2026 Guide) | Claru",
  metaDescription: "Guide to collecting and annotating contact-rich manipulation data with force/torque sensing, tactile feedback, and multi-modal annotations for dexterous robot learning.",
  primaryKeyword: "how to build a contact-rich manipulation dataset",
  secondaryKeywords: ["contact-rich manipulation data","force torque dataset","tactile manipulation dataset","dexterous manipulation data","contact sensing robot data"],
  canonicalPath: "/guides/how-to-build-a-contact-rich-manipulation-dataset",
  h1: "How to Build a Contact-Rich Manipulation Dataset",
  heroSubtitle: "Guide to collecting and annotating contact-rich manipulation data with force/torque sensing, tactile feedback, and multi-modal annotations for dexterous robot learning.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Guides", href: "/guides" },
    { label: "Build a Contact-Rich Manipulation Dataset", href: "/guides/how-to-build-a-contact-rich-manipulation-dataset" },
  ],
  sections: [],
  faqs: [
    {
      question: "What sensors are essential for contact-rich manipulation data?",
      answer: "At minimum: a 6-axis force/torque sensor at the wrist (ATI Mini45 or OnRobot HEX-E, sampling at 500+ Hz), RGB-D cameras (wrist-mounted + external), and joint encoders. For fine-grained contact, add tactile sensors on the fingertips -- GelSight Mini or DIGIT sensors provide high-resolution contact geometry at 30+ fps. For whole-hand contact, the ReSkin magnetic skin provides distributed force sensing across large areas. Total sensor cost ranges from $3K (F/T sensor + cameras) to $15K+ (F/T + tactile + proprioceptive)."
    },
    {
      question: "How do you synchronize force/torque data with vision data?",
      answer: "Use hardware timestamps, not software timestamps. The force/torque sensor runs at 500-1000 Hz while cameras run at 30 Hz -- these must be aligned precisely. With ROS2, publish all sensor data with hardware timestamps and use message_filters ApproximateTimeSynchronizer with a 10ms tolerance. Alternatively, trigger camera capture from the F/T sensor's clock using an external trigger signal. Post-collection, verify alignment by checking that force spikes coincide with visible contact events in the video. A 50ms misalignment between force and vision data will confuse contact-aware policies."
    },
    {
      question: "What force/torque ranges are typical for manipulation tasks?",
      answer: "For tabletop pick-and-place with a parallel-jaw gripper: 0.5-15N grip force, 0-5N lifting force, < 0.5 Nm wrist torque. For contact-rich tasks like peg insertion or assembly: 1-30N contact forces with 0.1-2.0 Nm torques. For deformable object manipulation (cloth folding, food preparation): 0.1-5N with high-frequency force oscillations. Configure your F/T sensor range to cover 2x the expected maximum. The ATI Mini45 has a 145N/5Nm range suitable for most tabletop tasks. The Nano17 (17N/0.12Nm) is better for delicate assembly."
    },
    {
      question: "How many contact-rich demonstrations are needed for policy learning?",
      answer: "Contact-rich tasks require more demonstrations than simple pick-and-place because the contact dynamics are more complex. For single-task contact policies (peg insertion, lid screwing), 200-500 demonstrations with force/torque data yield strong Diffusion Policy performance. For multi-task contact learning, 50-100 demonstrations per task. For sim-to-real transfer of contact policies, 50-100 real demonstrations are needed for fine-tuning on top of 10K+ sim demonstrations. Quality matters enormously: 200 demonstrations with clean F/T data outperform 1,000 with noisy or misaligned sensor data."
    },
    {
      question: "Should I include tactile images in my contact dataset?",
      answer: "Yes, if your target policy architecture supports tactile input. GelSight and DIGIT sensors produce high-resolution images of the contact surface (deformation pattern, contact geometry, and shear). These are processed as standard images by CNN encoders and provide information that force/torque alone cannot: object surface texture, edge location relative to the finger, and slip direction. However, tactile sensors add significant complexity to the data pipeline (additional image streams, calibration, and failure modes). Start with force/torque only, validate your pipeline works, then add tactile as a second modality."
    }
  ],
  ctaHeading: "Need Help With This?",
  ctaDescription: "Talk to a Claru data collection specialist about your specific requirements.",
  relatedGlossaryTerms: ["contact-rich-manipulation","manipulation-trajectory","proprioceptive-data"],
  relatedGuidePages: ["how-to-collect-teleoperation-data","how-to-build-a-grasping-dataset"],
  relatedSolutionSlugs: ["manipulation-trajectory-data"],
  difficulty: "advanced",
  estimatedTime: "4-8 weeks",
  prerequisites: [
    "Robot arm with wrist-mounted 6-axis force/torque sensor (ATI Mini45, OnRobot HEX-E, or equivalent)",
    "Teleoperation interface capable of force-sensitive control (GELLO, bilateral teleoperation, or VR controller with haptic feedback)",
    "ROS2 environment with synchronized multi-sensor recording pipeline",
    "Contact-rich task set with measurable success criteria (peg insertion, lid rotation, assembly, etc.)",
    "Object set including rigid, articulated, and optionally deformable objects",
    "Storage infrastructure for high-frequency multi-modal data (roughly 50MB per 30-second episode)"
  ],
  tools: ["ROS2","ATI F/T sensor","GelSight Mini","Intel RealSense D435","GELLO","rosbag2","h5py","Python","NumPy","robotics-toolbox-python"],
  steps: [
    {
      stepNumber: 1,
      title: "Design the Contact Task Suite and Sensor Configuration",
      description: "Contact-rich manipulation spans a wide range of task complexities. Before collecting data, define which contact regimes your dataset needs to cover and configure sensors accordingly.\n\nCategorize your target tasks by contact complexity. Level 1 -- quasi-static contact: tasks where contact forces change slowly and predictably (placing an object on a surface, sliding a tray). These require force/torque sensing at 100 Hz minimum. Level 2 -- dynamic contact: tasks with rapid force transitions (inserting a peg, closing a latch, screwing a lid). These require 500+ Hz force sensing and precise temporal alignment with vision. Level 3 -- compliant contact: tasks involving deformable objects or environments (wiping a surface, folding cloth, kneading dough). These require distributed force sensing or tactile sensors to capture the spatial contact pattern, not just the resultant wrench.\n\nFor the force/torque sensor, mount it between the robot's wrist flange and the gripper. Use a rigid coupling (not a compliant mount) to preserve high-frequency force signals. Calibrate the sensor to compensate for the gripper's weight: with the gripper attached but no object, record the wrench at 10 different orientations spanning SO(3), then compute the gravity compensation parameters. In ROS2, use the `force_torque_sensor_broadcaster` and publish compensated wrench on `/ft_sensor/wrench_compensated` at the sensor's native rate.\n\nFor tactile sensors (GelSight Mini or DIGIT), mount them on the gripper fingertips. GelSight Mini connects via USB and produces 320x240 RGB images of the elastomer deformation at 30 fps. Calibrate by pressing against a flat surface with known force (using the F/T sensor as reference) and recording the resulting tactile image. This creates a force-to-tactile-image mapping useful for downstream supervision.\n\nSet up the camera configuration: one wrist-mounted RealSense D435 for close-range manipulation view (640x480 at 30fps) and one or two external cameras for workspace overview. Ensure the wrist camera does not occlude the tactile sensors and that the external cameras have a clear view of the contact zone. Verify all sensor streams are accessible in ROS2 with `ros2 topic list` and check publication rates with `ros2 topic hz`.",
      tools: ["ROS2", "ATI F/T sensor", "GelSight Mini", "Intel RealSense D435"],
      tips: [
        "Mount the F/T sensor as close to the gripper as possible (ideally between the wrist flange and the gripper adapter plate). Every millimeter of additional moment arm amplifies noise in the torque channels.",
        "Record the raw, uncompensated F/T data alongside the gravity-compensated version. If your compensation calibration is wrong, you can always recompute, but raw data cannot be recovered from compensated.",
        "Test sensor saturation before collecting data. Execute a deliberate hard contact (press the gripper firmly against the table) and verify the F/T sensor does not clip. If it clips at expected task forces, you need a sensor with a higher range."
      ]
    },
    {
      stepNumber: 2,
      title: "Build the Synchronized Multi-Modal Recording Pipeline",
      description: "Contact-rich data has the tightest synchronization requirements of any manipulation dataset. A 30ms misalignment between force and vision -- invisible in most tasks -- can cause a contact-aware policy to associate the wrong force with the wrong visual state, learning incorrect contact dynamics.\n\nImplement hardware-triggered synchronization. The gold standard is to use the F/T sensor's data-ready signal as the master clock. The ATI NetFT outputs a data-ready pulse on each new sample. Connect this to a hardware trigger that simultaneously triggers the camera capture. With the RealSense SDK, use `rs2::context::set_devices_changed_callback` and external trigger mode (via GPIO on a companion microcontroller). This guarantees force and vision timestamps align to within 1ms.\n\nIf hardware triggering is not feasible, use ROS2's software synchronization. Record all topics to a rosbag2 file with `ros2 bag record -a`. After recording, align data in post-processing: resample force/torque data (500+ Hz) to match camera timestamps (30 Hz) using linear interpolation. Compute the cross-correlation between force magnitude and visual features (like gripper aperture change) to estimate and correct any systematic clock offset between sensors.\n\nStructure the recording pipeline as a ROS2 launch file that starts all sensor drivers, the recording node, and a real-time monitoring dashboard. The dashboard should display: camera feeds, force/torque magnitude bar graphs, gripper state, and a recording status indicator. Include automatic episode segmentation: the pipeline detects episode start (gripper opens from home position) and episode end (gripper returns to home position) and writes separate files per episode.\n\nFor each episode, record: RGB images (wrist + external cameras), depth images (wrist camera), 6-DoF force/torque at native sensor rate, joint positions and velocities at 100+ Hz, end-effector pose (position + quaternion) at 100+ Hz, gripper width, gripper force (if available), tactile images (if using GelSight/DIGIT), and operator's control inputs (for teleoperation data). Validate the recording by replaying the first episode and verifying all streams are present, at the expected rates, and temporally aligned.",
      tools: ["ROS2", "rosbag2", "Intel RealSense SDK", "Python"],
      tips: [
        "Write a quick sanity-check script that loads a recorded episode, finds the first force spike, and checks whether the corresponding video frame shows a visible contact event. Run this after every recording session.",
        "Log the sensor serial numbers and firmware versions in each episode's metadata. Sensor behavior can change with firmware updates, and this metadata is needed to diagnose anomalies discovered months later.",
        "Reserve 2x the disk space you estimate. Contact data at 500 Hz F/T + 30 Hz RGB-D + 30 Hz tactile generates roughly 50-100 MB per 30-second episode. A 1,000-episode dataset needs 50-100 GB."
      ]
    },
    {
      stepNumber: 3,
      title: "Collect Demonstrations with Force-Aware Teleoperation",
      description: "Contact-rich tasks require teleoperators who can feel the contact forces, not just see them. Standard VR teleoperation (Oculus controllers) provides no haptic feedback, which leads to excessive forces and unrealistic contact behaviors. Use a teleoperation system with force feedback or at minimum, a real-time force display.\n\nThe best system for contact-rich collection is bilateral teleoperation: the operator controls a leader robot that mirrors the follower robot's motion and reflects its contact forces back to the operator's hand. The GELLO system (Stanford, 2024) provides a low-cost bilateral interface using a 3D-printed replica of the follower arm with torque-controlled joints. The operator physically moves the GELLO arm, and force feedback from the follower's F/T sensor is rendered as resistance in the GELLO joints. This gives the operator direct force sensation.\n\nIf bilateral teleoperation is not available, use VR teleoperation with a real-time force overlay. Display the F/T sensor readings as a 3D force vector rendered in the VR scene at the gripper location. Color-code by magnitude: green (< 5N), yellow (5-15N), red (> 15N). Train operators to keep forces in the green/yellow range and to recognize when they are applying excessive force. This is less natural than haptic feedback but still produces better contact data than blind teleoperation.\n\nDesign the collection protocol for contact-rich tasks with specific attention to force profiles. For each task, define the expected force profile: peg insertion should show a low approach force (< 2N), a contact spike at the chamfer entry (5-10N), a sustained insertion force (3-8N), and a release to zero. During pilot collection, plot the actual force profiles and compare to expectations. If operators consistently produce forces 3x higher than expected, the teleoperation gain needs adjustment or the operators need more training.\n\nCollect at least 20% negative examples per task: episodes where excessive force was applied, where the insertion failed, or where the object was damaged. These are critical for training force-aware policies that learn contact limits. Label negative examples during collection by having the operator press a button to flag the current episode.\n\nRun collection in 30-minute sessions with 10-minute breaks. Contact-rich teleoperation causes operator fatigue faster than non-contact tasks because the operator must maintain precise force control throughout. Track per-operator metrics: task completion time, average contact force, maximum force, and success rate. Retire operators whose maximum forces consistently exceed the safety threshold.",
      tools: ["GELLO", "ROS2", "VR teleoperation", "ATI F/T sensor"],
      tips: [
        "Calibrate teleop control gains specifically for contact tasks. The position gain that works well for free-space motion is usually too high for fine contact control. Reduce position gain by 30-50% and increase force feedback gain for contact phases.",
        "Record the operator ID with every episode. Operator-specific biases in contact behavior (one operator always applies 2x the force of another) should be analyzed and potentially corrected during training through per-operator normalization.",
        "Collect 5 expert demonstrations per task first, then use these as reference videos for training new operators. Operators who have seen what 'correct' contact looks like produce better data 50% faster."
      ]
    },
    {
      stepNumber: 4,
      title: "Annotate Contact Events and Force Phases",
      description: "Contact-rich data requires annotation layers beyond standard trajectory annotation. The key annotations are: contact event detection, contact phase segmentation, force quality scoring, and contact geometry labeling.\n\nContact event annotation marks the exact timestep of each contact transition: free-space-to-contact (approach), contact-to-free-space (release), and contact-type transitions (sliding-to-sticking, grasping-to-insertion). Implement semi-automatic detection: compute the derivative of force magnitude (`df = np.abs(np.diff(force_magnitude))`), threshold at 0.5 N/timestep to detect contact onsets, and present detected events to human annotators for verification and classification. The annotator confirms each detected event and assigns a contact type: {initial_contact, stable_grasp, sliding, insertion, pressing, release}.\n\nForce phase segmentation divides each episode into phases based on the dominant contact regime. For a peg insertion task: free_approach (no contact, F < 0.5N), alignment (light contact, F = 0.5-3N with lateral correction forces), insertion (sustained forward force, Fz = 3-10N with Fx/Fy near zero), seating (force spike as peg bottoms out, Fz > 10N briefly), and release (force returns to zero). Annotate phase boundaries on the force-time plot, which is faster and more precise than using video alone. The force signal makes boundaries unambiguous -- a human annotator can segment a 30-second insertion episode in under 60 seconds using the force plot.\n\nForce quality scoring rates each episode's contact behavior on a 1-5 scale: (1) excessive force, likely to damage real objects; (2) high force but successful; (3) acceptable force, some unnecessary contact; (4) clean contact, minimal unnecessary force; (5) expert-level contact, smooth force profiles with no spikes. This quality score enables weighted training where high-quality episodes receive higher loss weight.\n\nFor tasks involving contact geometry (insertion, fitting, assembly), annotate the contact configuration: which surface of the gripper/finger contacts which surface of the object. For GelSight tactile data, annotate the tactile image with a contact region mask and estimate the contact normal direction. This geometric annotation is expensive (5-10 minutes per episode) and should be reserved for a subset of episodes used for contact-model training.",
      tools: ["Label Studio", "Python", "NumPy", "Matplotlib", "SciPy"],
      tips: [
        "Always annotate force data using the force-time plot, not the video. Contact events that take 50ms to occur are invisible in 30fps video but clearly visible as force transitions.",
        "Normalize force annotations to the task, not to the sensor. A 10N force is 'high' for picking up an egg but 'low' for tightening a bolt. The quality scale must be task-relative.",
        "For multi-step contact tasks, annotate each contact event independently. An episode might have 5-10 distinct contact events (approach, grasp, slide, insert, release) that each need their own type label."
      ]
    },
    {
      stepNumber: 5,
      title: "Validate Contact Data Quality",
      description: "Contact data has unique quality failure modes that are not present in vision-only datasets. Implement automated checks specifically for force/torque and tactile data.\n\nF/T sensor validation: check for sensor drift by comparing the zero-force baseline at episode start vs. episode end (with the gripper in free space). Drift exceeding 0.5N or 0.05Nm indicates thermal drift or a calibration issue. Re-zero the sensor between episodes by recording a 1-second free-space baseline and subtracting it. Check for sensor saturation: any timestep where the force or torque equals the sensor's maximum range exactly (e.g., 145.0N for the ATI Mini45) indicates clipping and the true force is unknown. Flag saturated episodes.\n\nSynchronization validation: compute the cross-correlation between force magnitude and gripper aperture change. The correlation should peak at lag=0 (within one camera frame). If the peak is at lag=2 frames (66ms at 30fps), the force data is systematically delayed and needs time-shifting. Run this check on every recording session. Compute `lag = np.argmax(np.correlate(force_mag, np.abs(np.diff(gripper_width)), mode='full')) - len(force_mag)` and verify `abs(lag) <= 1`.\n\nContact physics validation: verify that forces obey basic physical laws. During free-space motion (no contact), the measured wrench should equal the gravitational load of the gripper plus payload (within noise). Forces exceeding 2N during annotated free-space phases indicate a synchronization error (the contact event was annotated too late) or a sensor calibration error. During stable grasps, the grip force should be constant within 10%. High-frequency force oscillations during a supposedly stable grasp indicate a loose grip, sensor noise, or vibration.\n\nTactile data validation: check that tactile images change when the F/T sensor reports contact and remain at baseline when no contact is detected. Compute the pixel-wise difference between each tactile image and the no-contact reference image. The summed difference should correlate with the F/T force magnitude (Pearson r > 0.6 for GelSight data). If tactile and force data are uncorrelated, the tactile sensor may be occluded, miscalibrated, or not in contact.\n\nGenerate a per-episode quality report with pass/fail on each check. Episodes that fail drift, saturation, or synchronization checks should be excluded from training data. Episodes that fail physics checks should be reviewed manually -- they may contain interesting edge cases (object slipping, unexpected collisions) that are valuable if correctly annotated.",
      tools: ["NumPy", "SciPy", "pandas", "Matplotlib"],
      tips: [
        "The synchronization check is the single most important validation. Run it first on every batch. Misaligned force-vision data trains policies that apply the wrong force at the wrong time.",
        "Keep a running log of sensor drift per session. Increasing drift over days indicates the F/T sensor needs recalibration or the thermal environment has changed.",
        "For tactile sensors, check for delamination of the GelSight elastomer by comparing the baseline image at the start of each session to the reference. A degraded elastomer produces blurry, low-contrast tactile images that are unusable."
      ]
    },
    {
      stepNumber: 6,
      title: "Package the Multi-Modal Contact Dataset",
      description: "Contact-rich datasets are among the most complex to package because they contain high-frequency multi-modal data that must remain synchronized after export. Design the storage format to preserve temporal alignment and enable efficient access to individual modalities.\n\nUse HDF5 with per-episode groups and per-modality datasets. Structure: `/episode_N/obs/rgb_wrist` (uint8, T_cam x H x W x 3 at 30Hz), `/episode_N/obs/depth_wrist` (uint16, T_cam x H x W at 30Hz), `/episode_N/obs/force_torque` (float32, T_ft x 6 at 500Hz), `/episode_N/obs/tactile_left` (uint8, T_tac x 240 x 320 x 3 at 30Hz), `/episode_N/obs/joint_pos` (float64, T_proprio x 7 at 100Hz), `/episode_N/obs/ee_pose` (float64, T_proprio x 7 at 100Hz), `/episode_N/obs/gripper_width` (float64, T_proprio x 1 at 100Hz), `/episode_N/actions` (float64, T_action x A at the control frequency). Note the different T values per modality -- force/torque has 16x more timesteps than camera data.\n\nInclude a timestamps dataset for each modality: `/episode_N/timestamps/force_torque` (float64, T_ft), `/episode_N/timestamps/rgb_wrist` (float64, T_cam), etc. All timestamps are in the same clock domain (seconds since episode start). The dataloader uses these timestamps to align modalities on-the-fly: for a given camera frame at time t, the corresponding force/torque reading is `ft_data[np.argmin(np.abs(ft_timestamps - t))]`.\n\nStore annotations in a separate group: `/episode_N/annotations/contact_events` (structured array: frame_index, contact_type, force_magnitude), `/episode_N/annotations/force_phases` (structured array: start_frame, end_frame, phase_label), `/episode_N/annotations/quality_score` (int, 1-5), `/episode_N/annotations/language_instruction` (string). Add episode-level metadata as attributes: `episode.attrs['task'] = 'peg_insertion'`, `episode.attrs['object'] = 'round_peg_8mm'`, `episode.attrs['operator_id'] = 'op_03'`, `episode.attrs['success'] = True`.\n\nProvide a multi-modal dataloader that handles the different sampling rates. The key method: `get_observation(episode_idx, time_step, modalities=['rgb', 'force_torque', 'joint_pos'])` returns a dictionary with each modality interpolated or nearest-neighbor sampled to the requested timestep. For force/torque, provide both the instantaneous reading and a 100ms window around the timestep (as a 50-sample vector at 500Hz) to capture force dynamics that a single sample misses.\n\nInclude a force profile visualization script that plots all six F/T channels over time with contact event markers and phase color-coding. This is the primary debugging tool for anyone training on the data. Ship a Jupyter notebook that loads one episode, plots the force profile, overlays the contact annotations, and displays synchronized video frames at key contact events.",
      tools: ["h5py", "NumPy", "Matplotlib", "Jupyter", "zarr"],
      tips: [
        "Store force/torque data at its native sampling rate, not downsampled to the camera rate. High-frequency force dynamics (contact transients, vibration) are lost at 30Hz and they are exactly the signal that contact-aware policies need.",
        "Include the F/T sensor calibration data (gravity compensation parameters, cross-talk matrix, zero offset) in the dataset metadata. Users who want to reprocess the raw force data need these values.",
        "Provide both an HDF5 and a zarr export. Zarr handles the multi-rate data more naturally with separate chunk sizes per array and supports lazy loading of individual modalities without reading the full episode."
      ]
    }
  ],
  keyPapers: [
    {
      id: "chi-diffusion-policy-2023",
      title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
      authors: "Chi et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2303.04137"
    },
    {
      id: "wu-gello-2024",
      title: "GELLO: A General, Low-Cost, and Intuitive Teleoperation Framework",
      authors: "Wu et al.",
      venue: "RSS 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2309.13037"
    },
    {
      id: "wang-gelsight-2021",
      title: "GelSight Wedge: Measuring High-Resolution 3D Contact Geometry with a Compact Robot Finger",
      authors: "Wang et al.",
      venue: "ICRA 2021",
      year: 2021,
      url: "https://arxiv.org/abs/2106.08851"
    },
    {
      id: "lambeta-digit-2020",
      title: "DIGIT: A Novel Design for a Low-Cost Compact High-Resolution Tactile Sensor with Application to In-Hand Manipulation",
      authors: "Lambeta et al.",
      venue: "IEEE RA-L 2020",
      year: 2020,
      url: "https://arxiv.org/abs/2005.14679"
    },
    {
      id: "zhao-aloha-2023",
      title: "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware",
      authors: "Zhao et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2304.13705"
    }
  ],
  claruRelevance: "Contact-rich manipulation datasets are the hardest to collect well because they require precise force/torque sensing, sub-millisecond synchronization across modalities, and teleoperators who understand contact dynamics. Claru operates calibrated multi-sensor rigs (ATI F/T sensors, GelSight tactile, synchronized RealSense cameras) and trains teleoperators specifically for force-sensitive tasks like insertion, assembly, and deformable object manipulation. Our recording pipeline produces synchronized force, vision, tactile, and proprioceptive data with verified temporal alignment (cross-correlation lag < 1 frame). We annotate contact events, force phases, and quality scores using force-signal-based tools that are faster and more precise than video-only annotation. For teams building contact-aware policies with Diffusion Policy or tactile-conditioned transformers, Claru delivers packaged HDF5 datasets with multi-rate dataloaders, force profile visualizations, and per-episode quality scores ready for weighted training.",
};

export default data;
