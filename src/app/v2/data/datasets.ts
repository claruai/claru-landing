export interface Dataset {
  id: string;
  name: string;
  count: string;
  countRaw: number;
  description: string;
  modalities: string[];
  environments: string[];
  status: "available" | "coming_soon";
  poster: string;
  video?: string;
}

export const datasets: Dataset[] = [
  {
    id: "egocentric-activity",
    name: "Egocentric Activity",
    count: "~386K clips",
    countRaw: 386000,
    description:
      "First-person video of daily activities in kitchens, offices, and workshops. Depth, pose, and segmentation on every clip.",
    modalities: ["depth", "pose", "segmentation"],
    environments: ["kitchens", "offices", "workshops"],
    status: "available",
    poster: "/images/datasets/egocentric-activity.webp",
  },
  {
    id: "game-environment",
    name: "Game Environment",
    count: "~66K clips",
    countRaw: 66000,
    description:
      "Pixel-perfect ground truth from game engines. RGB, depth, object IDs, and physics state with zero manual annotation cost.",
    modalities: ["depth", "object-ids", "physics-state"],
    environments: ["game-studios"],
    status: "available",
    poster: "/images/datasets/game-environment.webp",
  },
  {
    id: "video-quality",
    name: "Video Quality",
    count: "~976K annotations",
    countRaw: 976000,
    description:
      "Human quality assessments across resolution, motion, artifacts, and aesthetic appeal. Built for video generation model reward signals.",
    modalities: ["quality-scores"],
    environments: ["varied"],
    status: "available",
    poster: "/images/datasets/video-quality.webp",
  },
  {
    id: "object-identity",
    name: "Object Identity",
    count: "~1.07M annotations",
    countRaw: 1070000,
    description:
      "Dense object identification and tracking across frames. Consistent identity labels for re-identification and manipulation tasks.",
    modalities: ["segmentation", "tracking"],
    environments: ["kitchens", "warehouses", "retail"],
    status: "available",
    poster: "/images/datasets/object-identity.webp",
  },
  {
    id: "traffic",
    name: "Traffic",
    count: "Coming soon",
    countRaw: 0,
    description:
      "Multi-camera traffic scenes with vehicle detection, lane segmentation, and pedestrian tracking for autonomous driving pipelines.",
    modalities: ["depth", "segmentation", "tracking"],
    environments: ["roads", "intersections"],
    status: "coming_soon",
    poster: "/images/datasets/traffic.webp",
  },
  {
    id: "robotic-arm",
    name: "Robotic Arm",
    count: "Coming soon",
    countRaw: 0,
    description:
      "Manipulation trajectory data from industrial robotic arms. Joint angles, gripper state, and workspace depth maps for imitation learning.",
    modalities: ["depth", "pose", "trajectories"],
    environments: ["factories", "warehouses"],
    status: "coming_soon",
    poster: "/images/datasets/robotic-arm.webp",
  },
];
