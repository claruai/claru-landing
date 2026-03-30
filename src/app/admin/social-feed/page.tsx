"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Player, type RenderLoading } from "@remotion/player";
import {
  Copy,
  Check,
  Calendar,
  Twitter,
  Linkedin,
  Filter,
  Play,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Composition imports
// ---------------------------------------------------------------------------
import StatReveal from "../../../remotion/compositions/social/StatReveal";
import TerminalQuery from "../../../remotion/compositions/social/TerminalQuery";
import NetworkStatus from "../../../remotion/compositions/social/NetworkStatus";
import BeforeAfterReveal from "../../../remotion/compositions/social/BeforeAfterReveal";
import SixViewGrid from "../../../remotion/compositions/social/SixViewGrid";
import QuoteReveal from "../../../remotion/compositions/social/QuoteReveal";
import FromTheLabClip from "../../../remotion/compositions/social/FromTheLabClip";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type FormatType =
  | "from-the-lab"
  | "before-after"
  | "stat-card"
  | "terminal-query"
  | "industry-signal"
  | "educational"
  | "proof-of-scale"
  | "video-showcase"
  | "video-clip"
  | "quote";

type Platform = "twitter" | "linkedin";
type Status = "draft" | "ready" | "posted";

interface SocialPost {
  id: number;
  formatType: FormatType;
  platforms: Platform[];
  status: Status;
  twitterCopy: string;
  linkedinCopy?: string;
  compositionId: string;
  compositionProps: Record<string, unknown>;
  visualDescription: string;
  scheduledDate?: string;
  aspectRatio?: "1:1" | "16:9";
}

// ---------------------------------------------------------------------------
// Composition map — resolves compositionId to the React component
// ---------------------------------------------------------------------------
const COMPOSITION_MAP: Record<string, React.FC<any> | undefined> = {
  "social-stat-reveal": StatReveal,
  "social-terminal-query": TerminalQuery,
  "social-network-status": NetworkStatus,
  "social-before-after": BeforeAfterReveal,
  "social-before-after-landscape": BeforeAfterReveal,
  "social-six-view-grid": SixViewGrid,
  "social-six-view-grid-landscape": SixViewGrid,
  "social-quote-reveal": QuoteReveal,
  "social-from-the-lab": FromTheLabClip,
  "social-from-the-lab-landscape": FromTheLabClip,
  "video-clip": undefined, // Raw video — no Remotion composition
};

/** Duration in frames per composition (compositions have varying lengths) */
const DURATION_MAP: Record<string, number> = {
  "social-stat-reveal": 150,
  "social-terminal-query": 180,
  "social-network-status": 210,
  "social-before-after": 180,
  "social-before-after-landscape": 180,
  "social-six-view-grid": 240,
  "social-six-view-grid-landscape": 240,
  "social-quote-reveal": 150,
  "social-from-the-lab": 240,
  "social-from-the-lab-landscape": 240,
};

// ---------------------------------------------------------------------------
// Week headers
// ---------------------------------------------------------------------------
const WEEK_HEADERS: { startDay: number; endDay: number; title: string }[] = [
  { startDay: 1, endDay: 7, title: 'Week 1: "Hello. This is what we do."' },
  { startDay: 8, endDay: 14, title: 'Week 2: "We\'re everywhere."' },
  { startDay: 15, endDay: 21, title: 'Week 3: "Here\'s how deep we go."' },
  { startDay: 22, endDay: 30, title: 'Week 4: "We\'re the ones to call."' },
];

function getWeekForDay(day: number): (typeof WEEK_HEADERS)[0] | undefined {
  return WEEK_HEADERS.find((w) => day >= w.startDay && day <= w.endDay);
}

// ---------------------------------------------------------------------------
// Post data — 30-day campaign
// ---------------------------------------------------------------------------
const POSTS: SocialPost[] = [
  // =========================================================================
  // WEEK 1: "Hello. This is what we do." (Days 1-7)
  // =========================================================================
  {
    id: 1,
    formatType: "video-clip",
    platforms: ["twitter"],
    status: "ready",
    twitterCopy:
      "We collect training data for frontier AI labs.\n\nOver a million clips. 100+ cities. 10,000+ people on the ground.\n\nThis is @claru_ai.",
    compositionId: "video-clip",
    compositionProps: {
      videoSrc: "videos/bento-robot-arm.mp4",
    },
    visualDescription:
      "Raw video clip of robot arm — the inaugural tweet. Definitive, not performative.",
    aspectRatio: "16:9",
  },
  {
    id: 2,
    formatType: "from-the-lab",
    platforms: ["twitter"],
    status: "ready",
    twitterCopy:
      "From the lab.\n\nEgocentric kitchen capture, San Francisco. One of over 500,000 first-person clips in our collection.\n\nThis is what training a manipulation model actually looks like.",
    compositionId: "social-from-the-lab-landscape",
    compositionProps: {
      videoSrc: "enrichment-assets/side-by-side-video/96fa5baf_depth_sidebyside.mp4",
      location: "San Francisco, CA",
      stat: "Clip 38,291 of 500,000+",
      sessionId: "ego-sf-kitchen-38291",
    },
    visualDescription:
      "Egocentric kitchen capture with terminal metadata overlay. Shifts from identity to product.",
    aspectRatio: "16:9",
  },
  {
    id: 3,
    formatType: "stat-card",
    platforms: ["twitter", "linkedin"],
    status: "ready",
    twitterCopy:
      "Over 3.5 million human annotations.\n\nNot synthetic. Not auto-labeled. Human.",
    linkedinCopy:
      "Over 3.5 million human annotations delivered to frontier AI labs.\n\nNot synthetic labels. Not auto-generated pseudo-ground-truth. Every one placed, verified, and refined by trained annotators who understand the downstream task.\n\nThat's the difference between a dataset and a training signal.",
    compositionId: "social-stat-reveal",
    compositionProps: {
      stat: "3.5M+",
      label: "human annotations",
      sublabel: "and counting",
    },
    visualDescription:
      "StatReveal composition — 3.5M+ in large sage green type. The first hard number after two visual posts.",
    aspectRatio: "1:1",
  },
  {
    id: 4,
    formatType: "before-after",
    platforms: ["twitter"],
    status: "ready",
    twitterCopy:
      "Raw footage in. Depth map out.\n\nEvery clip we collect ships with enrichment layers — depth, pose, segmentation — before it reaches your pipeline.",
    compositionId: "social-before-after-landscape",
    compositionProps: {
      title: "DEPTH ESTIMATION",
      beforeSrc: "videos/enrichment-viz/raw-kitchen.mp4",
      afterSrc: "enrichment-assets/generated/depth-kitchen-upscaled.mp4",
    },
    visualDescription:
      "Before/after slider — raw kitchen footage vs depth map. First reveal of enrichment capability.",
    aspectRatio: "16:9",
  },
  {
    id: 5,
    formatType: "from-the-lab",
    platforms: ["twitter"],
    status: "ready",
    twitterCopy:
      "From the lab.\n\nTeleoperation capture. Every trajectory logged, every grasp annotated.\n\nThis is how manipulation models learn to pick things up.",
    compositionId: "social-from-the-lab-landscape",
    compositionProps: {
      videoSrc: "videos/sol-teleop.mp4",
      location: "Simulation Lab",
      stat: "Teleoperation session 4,712",
      sessionId: "teleop-sim-004712",
    },
    visualDescription:
      "Teleoperation capture clip. Introduces the robotics/manipulation vertical.",
    aspectRatio: "16:9",
  },
  {
    id: 6,
    formatType: "terminal-query",
    platforms: ["twitter"],
    status: "ready",
    twitterCopy: "Our database, this morning.",
    compositionId: "social-terminal-query",
    compositionProps: {
      lines: [
        { type: "query", text: "SELECT COUNT(*) FROM clips;" },
        { type: "result", text: "1,045,000+ rows" },
        { type: "query", text: "SELECT DISTINCT city FROM collection_hubs;" },
        { type: "result", text: "100+ cities, 6 continents" },
        {
          type: "query",
          text: "SELECT COUNT(*) FROM annotations WHERE source = 'human';",
        },
        { type: "result", text: "3,500,000+" },
      ],
    },
    visualDescription:
      "Terminal animation showing database queries. Minimal copy, visually dense.",
    aspectRatio: "1:1",
  },
  {
    id: 7,
    formatType: "from-the-lab",
    platforms: ["twitter", "linkedin"],
    status: "ready",
    twitterCopy:
      "From the lab.\n\nTeaching a robot to cook starts with watching a human do it — thousands of times, from the human's perspective.\n\nEgocentric cooking capture, Mumbai.",
    linkedinCopy:
      "If you want a robot to cook a pancake, you need to show it how.\n\nNot a single demonstration — thousands. From the human's own perspective. Across different kitchens, lighting conditions, cookware, and ingredient layouts.\n\nThis is one clip from our egocentric cooking collection. We have hundreds of thousands more.\n\nThat's the data infrastructure behind manipulation models.",
    compositionId: "social-from-the-lab-landscape",
    compositionProps: {
      videoSrc: "enrichment-assets/generated/egocentric-activity-upscaled.mp4",
      location: "Domestic Kitchen, Mumbai",
      stat: "Cooking manipulation sequence",
      sessionId: "ego-mum-cook-09182",
    },
    visualDescription:
      "Egocentric cooking capture. Closes Week 1 on a relatable note — cooking is universally understood.",
    aspectRatio: "16:9",
  },

  // =========================================================================
  // WEEK 2: "We're everywhere." (Days 8-14)
  // =========================================================================
  {
    id: 8,
    formatType: "from-the-lab",
    platforms: ["twitter"],
    status: "draft",
    twitterCopy:
      "From the lab — Lagos.\n\nWarehouse logistics. Forklift paths, shelf layouts, human movement patterns.\n\nYour model's training data shouldn't only look like California.",
    compositionId: "social-from-the-lab-landscape",
    compositionProps: {
      videoSrc: "enrichment-assets/generated/warehouse_pose_yolo.mp4",
      location: "Lagos, Nigeria",
      stat: "Warehouse logistics capture",
      sessionId: "ego-lag-wh-02841",
    },
    visualDescription:
      "Lagos warehouse footage. First city-specific post outside the US.",
    aspectRatio: "16:9",
  },
  {
    id: 9,
    formatType: "from-the-lab",
    platforms: ["twitter"],
    status: "draft",
    twitterCopy:
      "From the lab — Bangkok.\n\nStreet-level navigation data. Motorbikes, vendors, foot traffic. The kind of scene distribution that doesn't exist in any public dataset.",
    compositionId: "social-from-the-lab-landscape",
    compositionProps: {
      videoSrc: "enrichment-assets/generated/urban_detect_yolo.mp4",
      location: "Bangkok, Thailand",
      stat: "Urban navigation capture",
      sessionId: "ego-bkk-street-06153",
    },
    visualDescription:
      "Bangkok street scenes. Chaotic urban navigation data — visually striking diversity.",
    aspectRatio: "16:9",
  },
  {
    id: 10,
    formatType: "proof-of-scale",
    platforms: ["twitter", "linkedin"],
    status: "draft",
    twitterCopy:
      "100+ cities. 6 continents. Over 10,000 collectors on the ground.\n\nSan Francisco. Mumbai. Lagos. Bangkok. S\u00e3o Paulo. Kyiv. Cairo. Dhaka. Manila. Ho Chi Minh City. London. Jakarta. Nairobi. Mexico City. Lima. Bogot\u00e1. Karachi. Accra.\n\nWe don't scrape data. We go get it.",
    linkedinCopy:
      "Training data for physical AI needs to reflect the physical world — all of it.\n\nWe operate collection hubs in 100+ cities across 6 continents, with over 10,000 trained collectors capturing egocentric video, manipulation data, and environmental footage in real kitchens, warehouses, streets, workshops, and homes.\n\nSan Francisco / Mumbai / Lagos / Bangkok / S\u00e3o Paulo / Kyiv / Cairo / Dhaka / Manila / Ho Chi Minh City / London / Jakarta / Nairobi / Mexico City / Lima / Bogota / Karachi / Accra\n\nYour model is only as good as the distribution it trains on.\n\nclaru.ai",
    compositionId: "video-clip",
    compositionProps: {
      videoSrc: "enrichment-assets/generated/rgb-depth-comparison-padded.mp4",
    },
    visualDescription:
      "Globe visualization capture showing all 18 collection hub markers. Tentpole post of the week.",
    aspectRatio: "16:9",
  },
  {
    id: 11,
    formatType: "from-the-lab",
    platforms: ["twitter"],
    status: "draft",
    twitterCopy:
      "From the lab — S\u00e3o Paulo.\n\nWorkshop environments. Hand tools, workbenches, material handling. A manipulation model trained only on lab settings will fail in the real world.",
    compositionId: "social-from-the-lab-landscape",
    compositionProps: {
      videoSrc: "enrichment-assets/side-by-side-video/034c4346_depth_sidebyside.mp4",
      location: "S\u00e3o Paulo, Brazil",
      stat: "Workshop environment capture",
      sessionId: "ego-sp-ws-01387",
    },
    visualDescription:
      "S\u00e3o Paulo workshop environment. Continues city cadence, introduces industrial capture.",
    aspectRatio: "16:9",
  },
  {
    id: 12,
    formatType: "proof-of-scale",
    platforms: ["twitter"],
    status: "draft",
    twitterCopy:
      "Distribution across our top 8 hubs. Over a million clips total, growing every week.\n\nThe long tail is where models break. We build the long tail.",
    compositionId: "social-network-status",
    compositionProps: {
      cities: [
        { name: "San Francisco", clips: 142000 },
        { name: "Mumbai", clips: 98000 },
        { name: "Ho Chi Minh", clips: 87000 },
        { name: "Lagos", clips: 76000 },
        { name: "Bangkok", clips: 71000 },
        { name: "S\u00e3o Paulo", clips: 65000 },
        { name: "Kyiv", clips: 58000 },
        { name: "Manila", clips: 52000 },
      ],
      total: "1,000,000+",
    },
    visualDescription:
      "NetworkStatus bar chart showing clip distribution by city. Quantitative scale after days of qualitative posts.",
    aspectRatio: "1:1",
  },
  {
    id: 13,
    formatType: "from-the-lab",
    platforms: ["twitter"],
    status: "draft",
    twitterCopy:
      "From the lab — Kyiv.\n\nKitchen capture. Different appliances, different layouts, different lighting. Same annotation quality.\n\nThat's the point.",
    compositionId: "social-from-the-lab-landscape",
    compositionProps: {
      videoSrc: "enrichment-assets/side-by-side-video/33c400a3_skeleton_sidebyside.mp4",
      location: "Kyiv, Ukraine",
      stat: "Residential kitchen capture",
      sessionId: "ego-kyiv-kit-04291",
    },
    visualDescription:
      "Kyiv kitchen capture. Pivots from showing diversity to asserting consistency.",
    aspectRatio: "16:9",
  },
  {
    id: 14,
    formatType: "video-clip",
    platforms: ["twitter"],
    status: "draft",
    twitterCopy:
      "Kitchens. Streets. Warehouses. Workshops. Homes. Offices.\n\nSix environment types. 100+ cities. One annotation standard.\n\nWeek 2 recap: we showed you where we are. Next week — how deep we go.",
    compositionId: "video-clip",
    compositionProps: {
      videoSrc: "enrichment-assets/generated/mosaic-driving-upscaled.mp4",
    },
    visualDescription:
      "2x3 mosaic of six environment types from six cities. Closes the global week with a summary and teases Week 3.",
    aspectRatio: "16:9",
  },

  // =========================================================================
  // WEEK 3: "Here's how deep we go." (Days 15-21)
  // =========================================================================
  {
    id: 15,
    formatType: "before-after",
    platforms: ["twitter"],
    status: "draft",
    twitterCopy:
      "Raw warehouse footage on the left. Full skeletal pose estimation on the right.\n\nEvery clip ships enriched. Depth, pose, segmentation, detection — before it reaches your pipeline.",
    compositionId: "social-before-after-landscape",
    compositionProps: {
      title: "POSE TRACKING",
      beforeSrc: "enrichment-assets/generated/warehouse_raw_kling.mp4",
      afterSrc: "enrichment-assets/generated/warehouse_pose_yolo.mp4",
    },
    visualDescription:
      "Before/after — raw warehouse vs pose skeleton. Opens enrichment week with the most dramatic pair.",
    aspectRatio: "16:9",
  },
  {
    id: 16,
    formatType: "before-after",
    platforms: ["twitter"],
    status: "draft",
    twitterCopy:
      "Instance segmentation. Every object isolated, every boundary traced.\n\nNot predefined COCO classes. Your taxonomy. Your labels.",
    compositionId: "social-before-after-landscape",
    compositionProps: {
      title: "INSTANCE SEGMENTATION",
      beforeSrc:
        "enrichment-assets/generated/seg_sidebyside_c5a817be.mp4",
      afterSrc: "enrichment-assets/segmentation/12b46dac_seg_overlay.mp4",
    },
    visualDescription:
      "Before/after segmentation overlay. Differentiates from commodity annotation with 'your taxonomy' line.",
    aspectRatio: "16:9",
  },
  {
    id: 17,
    formatType: "video-showcase",
    platforms: ["twitter", "linkedin"],
    status: "draft",
    twitterCopy:
      "One frame. Six views.\n\nRaw / Depth / Segmentation / Pose / 3D Mesh / All Layers\n\nThis is what a single frame looks like after our enrichment pipeline.",
    linkedinCopy:
      "When we say \"enriched training data,\" this is what we mean.\n\nOne raw video frame passes through our enrichment pipeline and produces six parallel representations:\n\n1. Raw RGB\n2. Metric depth estimation\n3. Instance segmentation\n4. Skeletal pose tracking\n5. 3D mesh reconstruction\n6. All layers composited\n\nEvery clip in our catalog — over a million of them — carries these layers. Your training pipeline gets structured, multi-modal ground truth, not just pixels.\n\nclaru.ai",
    compositionId: "social-six-view-grid-landscape",
    compositionProps: {
      panels: [
        { label: "RAW", src: "images/slider/raw.webp" },
        { label: "DEPTH", src: "images/slider/depth.png" },
        { label: "SEGMENTATION", src: "images/slider/seg.png" },
        { label: "POSE", src: "images/slider/pose.png" },
        {
          label: "3D MESH",
          src: "images/enrichment-viz/viz-human-fold-3d.jpg",
        },
        { label: "ALL LAYERS", src: "images/slider/all.webp" },
      ],
    },
    visualDescription:
      "2x3 six-view grid showing one frame in six enrichment representations. Most information-dense visual of the campaign.",
    aspectRatio: "16:9",
  },
  {
    id: 18,
    formatType: "video-clip",
    platforms: ["twitter"],
    status: "draft",
    twitterCopy:
      "Open-vocabulary object detection on urban footage.\n\nNo predefined class list. We define the taxonomy with you, then label at scale.\n\nThis clip has over 45 tracked objects across 300+ frames.",
    compositionId: "video-clip",
    compositionProps: {
      videoSrc: "enrichment-assets/generated/urban_detect_yolo.mp4",
    },
    visualDescription:
      "Urban scene with bounding box overlays. Rounds out the four enrichment types with detection.",
    aspectRatio: "16:9",
  },
  {
    id: 19,
    formatType: "educational",
    platforms: ["twitter"],
    status: "draft",
    twitterCopy:
      "What training a manipulation model actually requires.\n\nThe demo is 30 seconds. The dataset behind it is 6 months.",
    compositionId: "social-terminal-query",
    compositionProps: {
      lines: [
        {
          type: "comment",
          text: "-- What does a manipulation model actually need?",
        },
        {
          type: "query",
          text: "SELECT * FROM requirements WHERE modality = 'manipulation';",
        },
        {
          type: "result",
          text: "egocentric_video:    500K+ clips, diverse environments",
        },
        {
          type: "result",
          text: "depth_maps:          per-frame metric depth",
        },
        {
          type: "result",
          text: "pose_skeleton:       21-joint hand + full body",
        },
        {
          type: "result",
          text: "object_segments:     instance-level, custom taxonomy",
        },
        {
          type: "result",
          text: "action_labels:       verb-noun pairs, temporal bounds",
        },
        {
          type: "result",
          text: "env_diversity:       100+ cities, 6 environment types",
        },
        { type: "comment", text: "-- That's one order. We've done five." },
      ],
    },
    visualDescription:
      "Terminal query listing manipulation model requirements. Educational framing, quiet closing flex.",
    aspectRatio: "1:1",
  },
  {
    id: 20,
    formatType: "video-clip",
    platforms: ["twitter", "linkedin"],
    status: "draft",
    twitterCopy:
      "Point cloud flythrough from our 3D reconstruction pipeline.\n\nWhen your model needs spatial understanding, flat video isn't enough. We reconstruct the scene.",
    linkedinCopy:
      "Depth maps are a start. But for tasks like navigation, grasping, and scene understanding, models need true 3D structure.\n\nOur enrichment pipeline reconstructs full point clouds and meshes from video — giving your training pipeline spatial ground truth, not just 2D projections.\n\nThis flythrough was generated from a standard egocentric capture session. No LiDAR. No depth sensors. Just our pipeline.",
    compositionId: "video-clip",
    compositionProps: {
      videoSrc: "videos/enrichment-viz/human-fold.mp4",
    },
    visualDescription:
      "3D trellis reconstruction from video. Visually novel — drives engagement from graphics/vision community.",
    aspectRatio: "16:9",
  },
  {
    id: 21,
    formatType: "video-clip",
    platforms: ["twitter"],
    status: "draft",
    twitterCopy:
      "Week 3 recap: every clip ships enriched.\n\nDepth. Pose. Segmentation. Detection. 3D mesh. Structured metadata.\n\nRaw pixels are table stakes. The enrichment is the product.",
    compositionId: "video-clip",
    compositionProps: {
      videoSrc: "enrichment-assets/segmentation/c5a817be_seg_overlay.mp4",
    },
    visualDescription:
      "Compilation of side-by-side enrichment pairs. Closes the enrichment week — 'the enrichment is the product.'",
    aspectRatio: "16:9",
  },

  // =========================================================================
  // WEEK 4: "We're the ones to call." (Days 22-30)
  // =========================================================================
  {
    id: 22,
    formatType: "stat-card",
    platforms: ["twitter", "linkedin"],
    status: "draft",
    twitterCopy:
      "Every robotics demo you've seen this year has an iceberg under it.\n\nThe 30-second clip? That's the tip.\n\nBelow the surface: months of data collection, millions of annotations, and a team you never hear about.\n\nWe're that team.",
    linkedinCopy:
      "Every impressive robotics demo you saw this year — the folding, the cooking, the manipulation — has a data iceberg beneath it.\n\nThe 30-second clip is the visible tip.\n\nBelow the surface:\n- Months of egocentric video capture\n- Millions of frame-level annotations\n- Custom enrichment pipelines (depth, pose, segmentation)\n- Hundreds of collectors in dozens of cities\n\nThe model gets the credit. The data team built the foundation.\n\nWe're that team. claru.ai",
    compositionId: "social-stat-reveal",
    compositionProps: {
      stat: "30s",
      label: "the demo",
      sublabel: "6 months of data behind it",
    },
    visualDescription:
      "StatReveal — iceberg metaphor. Reframes every robotics demo the audience has seen.",
    aspectRatio: "1:1",
  },
  {
    id: 23,
    formatType: "quote",
    platforms: ["twitter"],
    status: "draft",
    twitterCopy:
      '"We needed egocentric video data that didn\'t exist yet and a team who could label it with robotics-grade precision. Claru handled both."\n\n\u2014 Founder & CEO, robotics manipulation startup',
    compositionId: "social-quote-reveal",
    compositionProps: {
      quote:
        "We needed egocentric video data that didn't exist yet and a team who could label it with robotics-grade precision. Claru handled both.",
      attribution: "Founder & CEO, Robotics manipulation startup",
    },
    visualDescription:
      "Quote card from robotics founder. First social proof, placed after 3 weeks of showing the work.",
    aspectRatio: "1:1",
  },
  {
    id: 24,
    formatType: "stat-card",
    platforms: ["twitter"],
    status: "draft",
    twitterCopy:
      "Over 500,000 first-person videos. Captured across residential and commercial settings worldwide. For a single world-modeling lab.\n\nThat was one project.",
    compositionId: "social-stat-reveal",
    compositionProps: {
      stat: "500K+",
      label: "egocentric videos",
      sublabel: "for one client, one campaign",
    },
    visualDescription:
      "StatReveal — 500K+ egocentric videos. Ties abstract scale to a specific engagement.",
    aspectRatio: "1:1",
  },
  {
    id: 25,
    formatType: "industry-signal",
    platforms: ["twitter"],
    status: "draft",
    twitterCopy:
      "Human demonstration to robot execution.\n\nThe transfer isn't magic. It's data — egocentric capture, action labels, spatial enrichment, and thousands of repetitions across diverse environments.\n\nThe model generalizes because the dataset did first.",
    compositionId: "video-clip",
    compositionProps: {
      videoSrc: "videos/sol-vla.mp4",
    },
    visualDescription:
      "Hand mesh reconstruction — 3D understanding from egocentric video. Visually stunning and technically credible.",
    aspectRatio: "16:9",
  },
  {
    id: 26,
    formatType: "quote",
    platforms: ["twitter"],
    status: "draft",
    twitterCopy:
      '"Most annotation vendors give you a portal and a prayer. Claru gave us a dedicated team who actually understood what we were building."\n\n\u2014 Principal Research Engineer, Embodied AI company',
    compositionId: "social-quote-reveal",
    compositionProps: {
      quote:
        "Most annotation vendors give you a portal and a prayer. Claru gave us a dedicated team who actually understood what we were building.",
      attribution: "Principal Research Engineer, Embodied AI company",
    },
    visualDescription:
      "Quote card — 'portal and a prayer' line. Memorable, differentiates without naming competitors.",
    aspectRatio: "1:1",
  },
  {
    id: 27,
    formatType: "terminal-query",
    platforms: ["twitter"],
    status: "draft",
    twitterCopy:
      "Backed by Khosla Ventures, General Catalyst, Bessemer, and Y Combinator.\n\nThey bet on infrastructure. So do we.",
    compositionId: "social-terminal-query",
    compositionProps: {
      lines: [
        {
          type: "query",
          text: "SELECT name FROM investors ORDER BY conviction DESC;",
        },
        { type: "result", text: "Khosla Ventures" },
        { type: "result", text: "General Catalyst" },
        { type: "result", text: "Bessemer Venture Partners" },
        { type: "result", text: "Y Combinator" },
        { type: "comment", text: "-- 4 rows returned" },
      ],
    },
    visualDescription:
      "Terminal investor query. Social proof escalation — customer quotes to investor names.",
    aspectRatio: "1:1",
  },
  {
    id: 28,
    formatType: "from-the-lab",
    platforms: ["twitter"],
    status: "draft",
    twitterCopy:
      "A client needed 3D game world data. No off-the-shelf tool existed.\n\nSo we built the capture platform from scratch and collected over 10,000 hours.\n\nThat's the difference between a vendor and a partner.",
    compositionId: "social-from-the-lab-landscape",
    compositionProps: {
      videoSrc: "enrichment-assets/generated/game_env_gameplay.mp4",
      location: "Custom Capture Platform",
      stat: "Over 10,000 hours of 3D game data",
      sessionId: "game-env-platform-v3",
    },
    visualDescription:
      "Game environment capture platform. Shows engineering capability beyond operational scale.",
    aspectRatio: "16:9",
  },
  {
    id: 29,
    formatType: "terminal-query",
    platforms: ["twitter"],
    status: "draft",
    twitterCopy:
      "Month one, by the numbers.\n\nOver a million clips. Over 3.5 million annotations. 100+ cities. 5 frontier lab partnerships.\n\nWe showed you everything. Now tell us what you're training.\n\nclaru.ai",
    compositionId: "social-terminal-query",
    compositionProps: {
      lines: [
        { type: "comment", text: "-- claru systems status: 2026-Q1" },
        { type: "query", text: "SELECT * FROM platform_stats;" },
        { type: "result", text: "total_clips:          1,000,000+" },
        { type: "result", text: "human_annotations:    3,500,000+" },
        { type: "result", text: "collection_hubs:      100+ cities" },
        { type: "result", text: "active_collectors:    10,000+" },
        {
          type: "result",
          text: "enrichment_layers:    depth, pose, seg, detection, 3D",
        },
        { type: "result", text: "lab_partnerships:     5 frontier programs" },
        { type: "result", text: "uptime:               always" },
        { type: "comment", text: "-- Tell us what you're training." },
      ],
    },
    visualDescription:
      "Full stat wall terminal. Penultimate post aggregating the entire month. First direct CTA.",
    aspectRatio: "1:1",
  },
  {
    id: 30,
    formatType: "quote",
    platforms: ["twitter", "linkedin"],
    status: "draft",
    twitterCopy:
      "The best AI labs in the world need the best human intelligence behind them.\n\nThat's us.\n\n@claru_ai",
    linkedinCopy:
      "We spent the last 30 days showing you what we've built:\n\nOver a million video clips captured across 100+ cities on 6 continents. Over 3.5 million human annotations. Enrichment pipelines that deliver depth, pose, segmentation, detection, and 3D reconstruction on every frame.\n\nWe didn't build this to talk about it. We built it because the best AI labs in the world need the best human intelligence behind them.\n\nIf you're training a frontier model — video generation, robotics, embodied AI, autonomous systems — we'd like to hear what you need.\n\nclaru.ai",
    compositionId: "social-quote-reveal",
    compositionProps: {
      quote:
        "The best AI labs in the world need the best human intelligence behind them. That's us.",
      attribution: "Claru AI",
    },
    visualDescription:
      "Mission statement quote. Closes the month where Day 1 opened — clarity and confidence.",
    aspectRatio: "1:1",
  },
];

// ---------------------------------------------------------------------------
// Format type labels + colors
// ---------------------------------------------------------------------------
const FORMAT_CONFIG: Record<
  FormatType,
  { label: string; color: string; bg: string }
> = {
  "from-the-lab": {
    label: "From the Lab",
    color: "#92B090",
    bg: "rgba(146,176,144,0.12)",
  },
  "before-after": {
    label: "Before / After",
    color: "#4a90d9",
    bg: "rgba(74,144,217,0.12)",
  },
  "stat-card": {
    label: "Stat Card",
    color: "#f5a623",
    bg: "rgba(245,166,35,0.12)",
  },
  "terminal-query": {
    label: "Terminal Query",
    color: "#38bdf8",
    bg: "rgba(56,189,248,0.12)",
  },
  "industry-signal": {
    label: "Industry Signal",
    color: "#c084fc",
    bg: "rgba(192,132,252,0.12)",
  },
  educational: {
    label: "Educational",
    color: "#f472b6",
    bg: "rgba(244,114,182,0.12)",
  },
  "proof-of-scale": {
    label: "Proof of Scale",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.12)",
  },
  "video-showcase": {
    label: "Video Showcase",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.12)",
  },
  "video-clip": {
    label: "Video Clip",
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.12)",
  },
  quote: {
    label: "Quote",
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.12)",
  },
};

const STATUS_CONFIG: Record<
  Status,
  { label: string; color: string; bg: string }
> = {
  draft: { label: "Draft", color: "#888", bg: "rgba(136,136,136,0.12)" },
  ready: { label: "Ready", color: "#92B090", bg: "rgba(146,176,144,0.15)" },
  posted: { label: "Posted", color: "#4a90d9", bg: "rgba(74,144,217,0.15)" },
};

// ---------------------------------------------------------------------------
// VideoClipPlayer — simple video player for "video-clip" posts
// ---------------------------------------------------------------------------
function VideoClipPlayer({ src }: { src: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#0a0908",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <video
        src={`/${src}`}
        autoPlay
        muted
        loop
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          backgroundColor: "#0a0908",
        }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// PostCard component
// ---------------------------------------------------------------------------
function PostCard({ post }: { post: SocialPost }) {
  const [activeTab, setActiveTab] = useState<"twitter" | "linkedin">("twitter");
  const [copied, setCopied] = useState(false);

  const Component = COMPOSITION_MAP[post.compositionId];
  const format = FORMAT_CONFIG[post.formatType];
  const status = STATUS_CONFIG[post.status];

  const activeCopy =
    activeTab === "linkedin" && post.linkedinCopy
      ? post.linkedinCopy
      : post.twitterCopy;

  const isVideoClip = post.compositionId === "video-clip";

  // Determine aspect ratio: landscape for video-based compositions, square for animation-only
  const isLandscape =
    post.aspectRatio === "16:9" ||
    post.compositionId.includes("landscape") ||
    post.compositionId === "video-clip";
  const compWidth = isLandscape ? 1920 : 1080;
  const compHeight = 1080;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(activeCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement("textarea");
      el.value = activeCopy;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [activeCopy]);

  const renderLoading: RenderLoading = useCallback(
    ({ height, width }: { height: number; width: number }) => (
      <div
        style={{
          width,
          height,
          backgroundColor: "#121210",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 13,
          color: "#666",
        }}
      >
        Loading composition...
      </div>
    ),
    []
  );

  return (
    <div
      style={{
        backgroundColor: "#121210",
        border: "1px solid #2a2a28",
        borderRadius: 12,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Day indicator */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          borderBottom: "1px solid #1a1a18",
          backgroundColor: "#0e0e0c",
        }}
      >
        <span
          style={{
            fontSize: 16,
            fontFamily: "JetBrains Mono, monospace",
            fontWeight: 700,
            color: "#92B090",
            letterSpacing: -0.3,
          }}
        >
          Day {post.id}
        </span>
        <span
          style={{
            fontSize: 11,
            fontFamily: "JetBrains Mono, monospace",
            fontWeight: 600,
            color: status.color,
            backgroundColor: status.bg,
            padding: "3px 8px",
            borderRadius: 4,
          }}
        >
          {status.label}
        </span>
      </div>

      {/* Remotion Player, Video Player, or fallback */}
      <div
        style={{
          width: "100%",
          aspectRatio: isLandscape ? "16 / 9" : "1 / 1",
          backgroundColor: "#0a0908",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {isVideoClip && post.compositionProps.videoSrc ? (
          <VideoClipPlayer
            src={post.compositionProps.videoSrc as string}
          />
        ) : Component ? (
          <Player
            component={Component}
            inputProps={post.compositionProps}
            durationInFrames={DURATION_MAP[post.compositionId] ?? 150}
            fps={30}
            compositionWidth={compWidth}
            compositionHeight={compHeight}
            style={{ width: "100%", height: "100%" }}
            controls
            loop
            clickToPlay
            initialFrame={60}
            renderLoading={renderLoading}
            acknowledgeRemotionLicense
            errorFallback={() => {
              return (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#0a0908",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 24,
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  <Play
                    style={{
                      width: 32,
                      height: 32,
                      color: "#2a2a28",
                      marginBottom: 12,
                    }}
                  />
                  <p
                    style={{
                      fontSize: 12,
                      color: "#666",
                      textAlign: "center",
                      lineHeight: 1.6,
                    }}
                  >
                    {post.visualDescription}
                  </p>
                </div>
              );
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            <Play
              style={{
                width: 32,
                height: 32,
                color: "#2a2a28",
                marginBottom: 12,
              }}
            />
            <p
              style={{
                fontSize: 12,
                color: "#666",
                textAlign: "center",
                lineHeight: 1.6,
                maxWidth: 280,
              }}
            >
              {post.visualDescription}
            </p>
          </div>
        )}
      </div>

      {/* Metadata row: format badge + platform tags */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 16px",
          borderTop: "1px solid #2a2a28",
          borderBottom: "1px solid #1a1a18",
          flexWrap: "wrap",
        }}
      >
        {/* Format badge */}
        <span
          style={{
            fontSize: 11,
            fontFamily: "JetBrains Mono, monospace",
            fontWeight: 600,
            color: format.color,
            backgroundColor: format.bg,
            padding: "3px 8px",
            borderRadius: 4,
            letterSpacing: 0.3,
          }}
        >
          {format.label}
        </span>

        {/* Platform tags */}
        {post.platforms.map((p) => (
          <span
            key={p}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              fontFamily: "JetBrains Mono, monospace",
              color: p === "twitter" ? "#1da1f2" : "#0077b5",
              backgroundColor:
                p === "twitter"
                  ? "rgba(29,161,242,0.1)"
                  : "rgba(0,119,181,0.1)",
              padding: "3px 8px",
              borderRadius: 4,
            }}
          >
            {p === "twitter" ? (
              <Twitter style={{ width: 10, height: 10 }} />
            ) : (
              <Linkedin style={{ width: 10, height: 10 }} />
            )}
            {p}
          </span>
        ))}
      </div>

      {/* Copy section */}
      <div style={{ padding: "0 16px 16px" }}>
        {/* Tabs — only show if both platforms */}
        {post.linkedinCopy && (
          <div
            style={{
              display: "flex",
              gap: 0,
              marginTop: 12,
              marginBottom: 8,
              borderBottom: "1px solid #1a1a18",
            }}
          >
            {(["twitter", "linkedin"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "6px 14px",
                  fontSize: 12,
                  fontFamily: "JetBrains Mono, monospace",
                  fontWeight: activeTab === tab ? 600 : 400,
                  color: activeTab === tab ? "#92B090" : "#666",
                  backgroundColor: "transparent",
                  border: "none",
                  borderBottom:
                    activeTab === tab
                      ? "2px solid #92B090"
                      : "2px solid transparent",
                  cursor: "pointer",
                  textTransform: "capitalize",
                  transition: "color 0.15s, border-color 0.15s",
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        {/* Copy text */}
        <pre
          style={{
            fontSize: 12,
            fontFamily: "JetBrains Mono, monospace",
            color: "#ccc",
            lineHeight: 1.65,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            margin: "8px 0",
            padding: 12,
            backgroundColor: "#0a0908",
            borderRadius: 6,
            border: "1px solid #1a1a18",
            maxHeight: 180,
            overflowY: "auto",
          }}
        >
          {activeCopy}
        </pre>

        {/* Actions row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 8,
          }}
        >
          <button
            onClick={handleCopy}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              fontSize: 12,
              fontFamily: "JetBrains Mono, monospace",
              fontWeight: 500,
              color: copied ? "#92B090" : "#aaa",
              backgroundColor: copied
                ? "rgba(146,176,144,0.1)"
                : "rgba(255,255,255,0.04)",
              border: copied
                ? "1px solid rgba(146,176,144,0.3)"
                : "1px solid #2a2a28",
              borderRadius: 6,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {copied ? (
              <Check style={{ width: 12, height: 12 }} />
            ) : (
              <Copy style={{ width: 12, height: 12 }} />
            )}
            {copied ? "Copied" : "Copy text"}
          </button>

          {post.scheduledDate && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontSize: 11,
                fontFamily: "JetBrains Mono, monospace",
                color: "#555",
                marginLeft: "auto",
              }}
            >
              <Calendar style={{ width: 11, height: 11 }} />
              {post.scheduledDate}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Filter pills
// ---------------------------------------------------------------------------
type FilterMode = "all" | "twitter" | "linkedin" | FormatType;

const FILTER_OPTIONS: { key: FilterMode; label: string }[] = [
  { key: "all", label: "All" },
  { key: "twitter", label: "Twitter" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "from-the-lab", label: "From the Lab" },
  { key: "before-after", label: "Before/After" },
  { key: "stat-card", label: "Stat Card" },
  { key: "terminal-query", label: "Terminal Query" },
  { key: "video-clip", label: "Video Clip" },
  { key: "quote", label: "Quote" },
  { key: "industry-signal", label: "Industry Signal" },
  { key: "proof-of-scale", label: "Proof of Scale" },
  { key: "video-showcase", label: "Video Showcase" },
  { key: "educational", label: "Educational" },
];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default function SocialFeedPage() {
  const [filter, setFilter] = useState<FilterMode>("all");

  const filteredPosts = useMemo(() => {
    if (filter === "all") return POSTS;
    if (filter === "twitter")
      return POSTS.filter((p) => p.platforms.includes("twitter"));
    if (filter === "linkedin")
      return POSTS.filter((p) => p.platforms.includes("linkedin"));
    return POSTS.filter((p) => p.formatType === filter);
  }, [filter]);

  const statusCounts = useMemo(() => {
    const counts = { draft: 0, ready: 0, posted: 0 };
    POSTS.forEach((p) => counts[p.status]++);
    return counts;
  }, []);

  // Group filtered posts by week for rendering with headers
  const renderContent = useMemo(() => {
    const elements: React.ReactNode[] = [];
    let currentWeekIdx = -1;

    filteredPosts.forEach((post) => {
      const week = getWeekForDay(post.id);
      if (!week) return;

      const weekIdx = WEEK_HEADERS.indexOf(week);
      if (weekIdx !== currentWeekIdx) {
        currentWeekIdx = weekIdx;
        elements.push(
          <div
            key={`week-header-${weekIdx}`}
            style={{
              gridColumn: "1 / -1",
              padding: "32px 0 16px",
              borderBottom: "1px solid #2a2a28",
              marginBottom: 4,
            }}
          >
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#e8e8e8",
                fontFamily: "JetBrains Mono, monospace",
                margin: 0,
                letterSpacing: -0.3,
              }}
            >
              {week.title}
            </h2>
            <p
              style={{
                fontSize: 12,
                color: "#555",
                fontFamily: "JetBrains Mono, monospace",
                margin: "6px 0 0",
              }}
            >
              Days {week.startDay}-{week.endDay}
            </p>
          </div>
        );
      }

      const postIsLandscape =
        post.aspectRatio === "16:9" ||
        post.compositionId.includes("landscape") ||
        post.compositionId === "video-clip";

      elements.push(
        <div
          key={post.id}
          style={postIsLandscape ? { gridColumn: "1 / -1", maxWidth: 900 } : undefined}
        >
          <PostCard post={post} />
        </div>
      );
    });

    return elements;
  }, [filteredPosts]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0a0908",
        fontFamily: "JetBrains Mono, monospace",
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: "32px 24px 24px",
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 16,
            marginBottom: 8,
          }}
        >
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#e8e8e8",
              margin: 0,
              letterSpacing: -0.5,
            }}
          >
            Social Feed
          </h1>
          <span
            style={{
              fontSize: 14,
              color: "#92B090",
              fontWeight: 500,
            }}
          >
            {POSTS.length} posts &middot; 30-day campaign
          </span>
        </div>

        {/* Status summary */}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginBottom: 20,
            fontSize: 12,
            color: "#666",
          }}
        >
          <span>
            <span style={{ color: "#92B090", fontWeight: 600 }}>
              {statusCounts.ready}
            </span>{" "}
            ready
          </span>
          <span>
            <span style={{ color: "#888", fontWeight: 600 }}>
              {statusCounts.draft}
            </span>{" "}
            draft
          </span>
          <span>
            <span style={{ color: "#4a90d9", fontWeight: 600 }}>
              {statusCounts.posted}
            </span>{" "}
            posted
          </span>
        </div>

        {/* Filter pills */}
        <div
          style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Filter
            style={{ width: 14, height: 14, color: "#555", marginRight: 4 }}
          />
          {FILTER_OPTIONS.map((opt) => {
            const isActive = filter === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => setFilter(opt.key)}
                style={{
                  padding: "5px 12px",
                  fontSize: 11,
                  fontFamily: "JetBrains Mono, monospace",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#0a0908" : "#888",
                  backgroundColor: isActive
                    ? "#92B090"
                    : "rgba(255,255,255,0.04)",
                  border: isActive
                    ? "1px solid #92B090"
                    : "1px solid #2a2a28",
                  borderRadius: 20,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  whiteSpace: "nowrap",
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Grid */}
      <main
        style={{
          padding: "0 24px 48px",
          maxWidth: 1400,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))",
          gap: 20,
        }}
      >
        {renderContent}

        {filteredPosts.length === 0 && (
          <div
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "80px 24px",
              color: "#555",
              fontSize: 14,
            }}
          >
            No posts match this filter.
          </div>
        )}
      </main>
    </div>
  );
}
