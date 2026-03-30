"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const ThreeViewer = dynamic(
  () => import("../components/ui/ReviewThreeViewer"),
  { ssr: false, loading: () => <div className="flex items-center justify-center bg-neutral-900 rounded-lg" style={{ height: 300 }}><span className="text-neutral-500 font-mono text-xs">Loading 3D viewer...</span></div> }
);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type VideoStatus =
  | "EXISTS"
  | "NEEDS CROP"
  | "NEEDS FAL"
  | "NEEDS RE-EXTRACT"
  | "NEEDS GENERATION"
  | "N/A";

interface VideoEntry {
  ref: string;
  source: string;
  /** The actual path to play (points to source when processed version doesn't exist) */
  videoPath: string | null;
  label: string;
  status: VideoStatus;
  note?: string;
}

interface EnrichmentEntry extends VideoEntry {
  step: string;
}

interface GlobeEntry extends VideoEntry {
  location: string;
}

interface Viz3DEntry {
  ref: string;
  format: string;
  description: string;
  sourceVideo: string;
  videoPath: string | null;
  note: string;
}

// ---------------------------------------------------------------------------
// Status badge colors
// ---------------------------------------------------------------------------

function statusColor(status: VideoStatus): string {
  switch (status) {
    case "EXISTS":
      return "bg-green-800 text-green-200";
    case "NEEDS CROP":
      return "bg-yellow-800 text-yellow-200";
    case "NEEDS FAL":
      return "bg-red-800 text-red-200";
    case "NEEDS RE-EXTRACT":
      return "bg-blue-800 text-blue-200";
    case "NEEDS GENERATION":
      return "bg-purple-800 text-purple-200";
    case "N/A":
      return "bg-neutral-700 text-neutral-300";
  }
}

// ---------------------------------------------------------------------------
// Auto-playing video component
// ---------------------------------------------------------------------------

function VideoPlayer({
  src,
  status,
  width,
  height,
  className,
}: {
  src: string | null;
  status: VideoStatus;
  width?: number;
  height?: number;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.play().catch(() => {});
    }
  }, [src]);

  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-neutral-900 border border-neutral-700 ${className ?? ""}`}
        style={{ width: width ?? "100%", height: height ?? 180 }}
      >
        <span className="text-red-400 text-xs font-mono">NO SOURCE</span>
      </div>
    );
  }

  const needsOverlay =
    status !== "EXISTS" && status !== "N/A";

  return (
    <div className={`relative ${className ?? ""}`} style={{ width: width ?? "100%", height: height ?? "auto" }}>
      <video
        ref={ref}
        src={src}
        muted
        autoPlay
        loop
        playsInline
        style={{ width: width ?? "100%", height: height ?? "auto", objectFit: "cover", display: "block" }}
      />
      {needsOverlay && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <span
            className={`px-2 py-1 rounded text-xs font-mono font-bold ${
              status === "NEEDS FAL"
                ? "bg-red-600 text-white"
                : status === "NEEDS CROP"
                  ? "bg-yellow-600 text-black"
                  : status === "NEEDS GENERATION"
                    ? "bg-purple-600 text-white"
                    : "bg-blue-600 text-white"
            }`}
          >
            {status}
          </span>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Placeholder card for 3D assets / generation-needed items
// ---------------------------------------------------------------------------

function PlaceholderCard({
  title,
  description,
  status,
}: {
  title: string;
  description: string;
  status: VideoStatus;
}) {
  const isExists = status === "EXISTS";
  return (
    <div
      className={`flex items-center justify-center border-2 rounded-lg ${
        isExists
          ? "border-green-800 bg-green-900/20"
          : "border-dashed border-neutral-700 bg-neutral-900/50"
      }`}
      style={{ width: "100%", height: 200 }}
    >
      <div className="text-center px-4 space-y-2">
        <span
          className={`inline-block px-2 py-1 rounded text-xs font-mono font-bold ${
            isExists
              ? "bg-green-800 text-green-200"
              : status === "NEEDS GENERATION"
                ? "bg-purple-600 text-white"
                : status === "NEEDS FAL"
                  ? "bg-red-600 text-white"
                  : "bg-neutral-600 text-white"
          }`}
        >
          {status}
        </span>
        <div className="text-white font-mono text-sm font-bold">{title}</div>
        <div className="text-neutral-400 font-mono text-[10px] max-w-xs">{description}</div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Image card for E-09 (enrichment zoom-out)
// ---------------------------------------------------------------------------

function ImageCard({
  src,
  alt,
  width,
  height,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}) {
  return (
    <div className="relative" style={{ width: width ?? "100%", height: height ?? "auto" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        style={{ width: width ?? "100%", height: height ?? "auto", objectFit: "cover", display: "block" }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Data: Hero Tiles (Section 1)
// ---------------------------------------------------------------------------

const heroTiles: VideoEntry[] = [
  {
    ref: "H-01",
    source: "pancake-cooking.mp4",
    videoPath: "/videos/mosaic/pancake-cooking.mp4",
    label: "KITCHEN",
    status: "EXISTS",
  },
  {
    ref: "H-02",
    source: "annotated-sensor.mp4",
    videoPath: "/videos/mosaic/annotated-sensor.mp4",
    label: "ANNOTATED",
    status: "EXISTS",
  },
  {
    ref: "H-03",
    source: "mosaic-06.mp4",
    videoPath: "/videos/mosaic/mosaic-06.mp4",
    label: "DRIVING",
    status: "EXISTS",
  },
  {
    ref: "H-04",
    source: "mosaic-game-env.mp4",
    videoPath: "/videos/mosaic/mosaic-game-env.mp4",
    label: "GAME ENV",
    status: "EXISTS",
  },
  {
    ref: "H-05",
    source: "robot-arm.mp4",
    videoPath: "/videos/mosaic/robot-arm.mp4",
    label: "ROBOTICS",
    status: "EXISTS",
  },
  {
    ref: "H-06",
    source: "depth-welding.mp4",
    videoPath: "/videos/mosaic/depth-welding.mp4",
    label: "DEPTH MAP",
    status: "EXISTS",
  },
  {
    ref: "H-07",
    source: "mosaic-03.mp4",
    videoPath: "/videos/mosaic/mosaic-03.mp4",
    label: "WORKSHOP",
    status: "EXISTS",
  },
  {
    ref: "H-08",
    source: "annotated-pose-manip.mp4",
    videoPath: "/videos/mosaic/annotated-pose-manip.mp4",
    label: "POSE",
    status: "EXISTS",
  },
  {
    ref: "H-09",
    source: "mosaic-17.mp4",
    videoPath: "/videos/mosaic/mosaic-17.mp4",
    label: "WAREHOUSE",
    status: "EXISTS",
  },
  {
    ref: "H-10",
    source: "kling-robot.mp4",
    videoPath: "/videos/mosaic/kling-robot.mp4",
    label: "ROBOTICS LAB",
    status: "EXISTS",
    note: "Kling-generated robot arm clip, cropped from enrichment-viz/raw-robot.mp4",
  },
  {
    ref: "H-11",
    source: "vla-telemetry.mp4",
    videoPath: "/videos/mosaic/vla-telemetry.mp4",
    label: "HAND TELEMETRY",
    status: "EXISTS",
  },
  {
    ref: "H-12",
    source: "mosaic-teleop.mp4",
    videoPath: "/videos/mosaic/mosaic-teleop.mp4",
    label: "TELEMETRY",
    status: "EXISTS",
  },
];

// ---------------------------------------------------------------------------
// Data: Marquee Row 1 (Section 2) -- NO reuse of hero clips
// ---------------------------------------------------------------------------

const marqueeRow1: VideoEntry[] = [
  {
    ref: "M1-01",
    source: "mosaic-07.mp4",
    videoPath: "/videos/mosaic/mosaic-07.mp4",
    label: "KITCHEN",
    status: "EXISTS",
  },
  {
    ref: "M1-02",
    source: "mosaic-12.mp4",
    videoPath: "/videos/mosaic/mosaic-12.mp4",
    label: "TEXTILE",
    status: "EXISTS",
  },
  {
    ref: "M1-03",
    source: "game-fps.mp4",
    videoPath: "/videos/marquee/game-fps.mp4",
    label: "GAME",
    status: "EXISTS",
  },
  {
    ref: "M1-04",
    source: "mosaic-05.mp4",
    videoPath: "/videos/mosaic/mosaic-05.mp4",
    label: "DOMESTIC",
    status: "EXISTS",
  },
  {
    ref: "M1-05",
    source: "mosaic-15.mp4",
    videoPath: "/videos/mosaic/mosaic-15.mp4",
    label: "ARTISAN",
    status: "EXISTS",
  },
  {
    ref: "M1-06",
    source: "mosaic-09.mp4",
    videoPath: "/videos/mosaic/mosaic-09.mp4",
    label: "RETAIL",
    status: "EXISTS",
  },
  {
    ref: "M1-07",
    source: "workplace-barista.mp4",
    videoPath: "/videos/marquee/workplace-barista.mp4",
    label: "WORKPLACE",
    status: "EXISTS",
  },
  {
    ref: "M1-08",
    source: "mosaic-02.mp4",
    videoPath: "/videos/mosaic/mosaic-02.mp4",
    label: "STREET",
    status: "EXISTS",
  },
];

// ---------------------------------------------------------------------------
// Data: Marquee Row 2 (Section 3) -- NO reuse of hero or enrichment clips
// ---------------------------------------------------------------------------

const marqueeRow2: VideoEntry[] = [
  {
    ref: "M2-01",
    source: "egocentric-grid.mp4",
    videoPath: "/videos/marquee/egocentric-grid.mp4",
    label: "EGOCENTRIC",
    status: "EXISTS",
  },
  {
    ref: "M2-02",
    source: "game-capture.mp4",
    videoPath: "/videos/marquee/game-capture.mp4",
    label: "GAME CAPTURE",
    status: "EXISTS",
  },
  {
    ref: "M2-03",
    source: "safety-review-v2.mp4",
    videoPath: "/videos/marquee/safety-review-v2.mp4",
    label: "SAFETY",
    status: "EXISTS",
    note: "Upgraded: cropped from sol-red-teaming.mp4 for stronger visuals",
  },
  {
    ref: "M2-04",
    source: "sim2real.mp4",
    videoPath: "/videos/marquee/sim2real.mp4",
    label: "SIM2REAL",
    status: "EXISTS",
  },
  {
    ref: "M2-05",
    source: "teleop-park.mp4",
    videoPath: "/videos/marquee/teleop-park.mp4",
    label: "TELEOP",
    status: "EXISTS",
  },
  {
    ref: "M2-06",
    source: "vid-classify.mp4",
    videoPath: "/videos/marquee/vid-classify.mp4",
    label: "CLASSIFY",
    status: "EXISTS",
    note: "Upgraded: cropped from cs-vid-classify.mp4 showing video classification task",
  },
  {
    ref: "M2-07",
    source: "fashion-annotation.mp4",
    videoPath: "/videos/marquee/fashion-annotation.mp4",
    label: "FASHION",
    status: "EXISTS",
  },
  {
    ref: "M2-08",
    source: "prompt-bench.mp4",
    videoPath: "/videos/marquee/prompt-bench.mp4",
    label: "EVALUATION",
    status: "EXISTS",
  },
];

// ---------------------------------------------------------------------------
// Data: Enrichment Steps (Section 4) -- expanded to 9 steps with 3D viz
// ---------------------------------------------------------------------------

const enrichmentSteps: EnrichmentEntry[] = [
  {
    ref: "E-01",
    source: "e01-raw-barista.mp4",
    videoPath: "/videos/enrichment/e01-raw-barista.mp4",
    label: "Raw footage",
    step: "Step 1: Raw footage",
    status: "EXISTS",
  },
  {
    ref: "E-02",
    source: "e02-bboxes.mp4",
    videoPath: "/videos/enrichment/e02-bboxes.mp4",
    label: "Object detection",
    step: "Step 2: Object detection + bboxes",
    status: "EXISTS",
  },
  {
    ref: "E-03",
    source: "depth-welding.mp4",
    videoPath: "/videos/mosaic/depth-welding.mp4",
    label: "Depth map",
    step: "Step 3: Depth map",
    status: "EXISTS",
  },
  {
    ref: "E-04",
    source: "kitchen-pointcloud.ply",
    videoPath: null,
    label: "3D Point Cloud",
    step: "Step 4: Point Cloud",
    status: "EXISTS",
    note: "5.4MB PLY, 128K vertices, will render in Three.js",
  },
  {
    ref: "E-05",
    source: "e05-pose.mp4",
    videoPath: "/videos/enrichment/e05-pose.mp4",
    label: "Pose tracking",
    step: "Step 5: Pose tracking",
    status: "EXISTS",
  },
  {
    ref: "E-06",
    source: "hand-mesh.glb",
    videoPath: null,
    label: "3D Hand Mesh",
    step: "Step 6: Hand Mesh",
    status: "EXISTS",
    note: "1.3MB GLB from FAL SAM-3D, will render in R3F",
  },
  {
    ref: "E-07",
    source: "kitchen-trellis.glb",
    videoPath: null,
    label: "3D Mesh",
    step: "Step 7: 3D Reconstruction",
    status: "EXISTS",
    note: "916KB GLB from FAL Trellis, will render in R3F",
  },
  {
    ref: "E-08",
    source: "cs-workplace.mp4",
    videoPath: "/videos/cs-workplace.mp4",
    label: "Structured metadata",
    step: "Step 8: Structured metadata",
    status: "EXISTS",
  },
  {
    ref: "E-09",
    source: "enrichment-zoom-out.webp",
    videoPath: null,
    label: '"This is one clip"',
    step: 'Step 9: "This is one clip"',
    status: "EXISTS",
    note: "Shows as image: /images/enrichment-zoom-out.webp",
  },
];

// ---------------------------------------------------------------------------
// Data: 3D Visualization Assets (Section 6)
// ---------------------------------------------------------------------------

const viz3DAssets: Viz3DEntry[] = [
  {
    ref: "V3D-01",
    format: ".ply (Point Cloud)",
    description:
      "3D POINT CLOUD VIEWER -- Interactive orbit, 128K vertices. Uses Three.js PointsMaterial. Shows the raw spatial structure of the scene.",
    sourceVideo: "/models/kitchen-pointcloud.ply",
    videoPath: null,
    note: "EXISTS -- 5.4MB PLY, 128K vertices. 3D model -- renders in Three.js",
  },
  {
    ref: "V3D-02",
    format: ".glb (Hand Mesh)",
    description:
      "3D HAND MESH -- Interactive orbit, generated from FAL SAM-3D. Textured mesh of hands performing manipulation tasks. Shows skeletal + surface geometry.",
    sourceVideo: "/models/hand-mesh.glb",
    videoPath: null,
    note: "EXISTS -- 1.3MB GLB. 3D model -- renders in Three.js",
  },
  {
    ref: "V3D-03",
    format: ".glb (3D Reconstruction)",
    description:
      "3D RECONSTRUCTION -- Interactive orbit, generated from FAL Trellis. Photorealistic 3D scene reconstruction from a short video clip.",
    sourceVideo: "/models/kitchen-trellis.glb",
    videoPath: null,
    note: "EXISTS -- 916KB GLB. 3D model -- renders in Three.js",
  },
];

// ---------------------------------------------------------------------------
// Data: Globe Thumbnails (Section 5) -- labels updated to "Environment in City"
// ---------------------------------------------------------------------------

const globeEntries: GlobeEntry[] = [
  { ref: "G-01", location: "San Francisco", label: "Lab in San Francisco", source: "g01-sf-kling.mp4", videoPath: "/videos/globe/g01-sf-kling.mp4", status: "EXISTS", note: "Kling-generated sim lab clip" },
  { ref: "G-02", location: "Mumbai", label: "Kitchen in Mumbai", source: "g02-mumbai-kling.mp4", videoPath: "/videos/globe/g02-mumbai-kling.mp4", status: "EXISTS", note: "Kling-generated Indian kitchen clip" },
  { ref: "G-03", location: "Ho Chi Minh", label: "Road in Ho Chi Minh", source: "g03-hcmc.mp4", videoPath: "/videos/globe/g03-hcmc.mp4", status: "EXISTS" },
  { ref: "G-04", location: "Sao Paulo", label: "Electronics in S\u00e3o Paulo", source: "g04-saopaulo.mp4", videoPath: "/videos/globe/g04-saopaulo.mp4", status: "EXISTS" },
  { ref: "G-05", location: "Kyiv", label: "Kitchen in Kyiv", source: "g05-kyiv.mp4", videoPath: "/videos/globe/g05-kyiv.mp4", status: "EXISTS" },
  { ref: "G-06", location: "Lagos", label: "Warehouse in Lagos", source: "g06-lagos-kling.mp4", videoPath: "/videos/globe/g06-lagos-kling.mp4", status: "EXISTS", note: "Kling-generated Lagos warehouse clip" },
  { ref: "G-07", location: "Manila", label: "Factory in Manila", source: "g07-manila.mp4", videoPath: "/videos/globe/g07-manila.mp4", status: "EXISTS" },
  { ref: "G-08", location: "Bangkok", label: "Street in Bangkok", source: "g08-bangkok-kling.mp4", videoPath: "/videos/globe/g08-bangkok-kling.mp4", status: "EXISTS", note: "Kling-generated Bangkok street clip" },
  { ref: "G-09", location: "London", label: "Office in London", source: "g09-london.mp4", videoPath: "/videos/globe/g09-london.mp4", status: "EXISTS" },
  { ref: "G-10", location: "Mexico City", label: "Home in Mexico City", source: "g10-mexico.mp4", videoPath: "/videos/globe/g10-mexico.mp4", status: "EXISTS" },
  { ref: "G-11", location: "Jakarta", label: "Caf\u00e9 in Jakarta", source: "g11-jakarta.mp4", videoPath: "/videos/globe/g11-jakarta.mp4", status: "EXISTS" },
  { ref: "G-12", location: "Nairobi", label: "Facility in Nairobi", source: "g12-nairobi.mp4", videoPath: "/videos/globe/g12-nairobi.mp4", status: "EXISTS" },
  { ref: "G-13", location: "Cairo", label: "Textile in Cairo", source: "g13-cairo.mp4", videoPath: "/videos/globe/g13-cairo.mp4", status: "EXISTS" },
  { ref: "G-14", location: "Dhaka", label: "Kitchen in Dhaka", source: "g14-dhaka-kling.mp4", videoPath: "/videos/globe/g14-dhaka-kling.mp4", status: "EXISTS", note: "Kling-generated kitchen clip" },
  { ref: "G-15", location: "Lima", label: "Artisan in Lima", source: "g15-lima.mp4", videoPath: "/videos/globe/g15-lima.mp4", status: "EXISTS" },
  { ref: "G-16", location: "Bogota", label: "Office in Bogot\u00e1", source: "g16-bogota.mp4", videoPath: "/videos/globe/g16-bogota.mp4", status: "EXISTS" },
  { ref: "G-17", location: "Karachi", label: "Home in Karachi", source: "g17-karachi.mp4", videoPath: "/videos/globe/g17-karachi.mp4", status: "EXISTS" },
  { ref: "G-18", location: "Accra", label: "Studio in Accra", source: "g18-accra.mp4", videoPath: "/videos/globe/g18-accra.mp4", status: "EXISTS" },
];

// ---------------------------------------------------------------------------
// Reusable card component
// ---------------------------------------------------------------------------

function VideoCard({
  entry,
  videoWidth,
  videoHeight,
  children,
}: {
  entry: VideoEntry;
  videoWidth?: number;
  videoHeight?: number;
  children?: React.ReactNode;
}) {
  return (
    <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-950">
      {/* Ref badge */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-800">
        <span
          className="font-mono text-sm font-bold px-2 py-0.5 rounded"
          style={{ backgroundColor: "rgba(146,176,144,0.2)", color: "#92B090" }}
        >
          {entry.ref}
        </span>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${statusColor(entry.status)}`}>
          {entry.status}
        </span>
      </div>

      {/* Video */}
      {entry.videoPath ? (
        <VideoPlayer
          src={entry.videoPath}
          status={entry.status}
          width={videoWidth}
          height={videoHeight}
        />
      ) : (
        <PlaceholderCard
          title={entry.label}
          description={entry.note ?? "Asset needs generation"}
          status={entry.status}
        />
      )}

      {/* Info */}
      <div className="px-3 py-2 space-y-1">
        <div className="text-white font-mono text-xs font-semibold">{entry.label}</div>
        <div className="text-neutral-500 font-mono text-[10px] break-all">{entry.source}</div>
        {entry.note && (
          <div className="text-neutral-400 text-[10px] italic">{entry.note}</div>
        )}
        {children}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function V2ReviewPage() {
  // Compute summary counts
  const allEntries: VideoEntry[] = [
    ...heroTiles,
    ...marqueeRow1,
    ...marqueeRow2,
    ...enrichmentSteps,
    ...globeEntries,
  ];
  const allStatuses: VideoStatus[] = [
    "EXISTS",
    "NEEDS CROP",
    "NEEDS FAL",
    "NEEDS RE-EXTRACT",
    "NEEDS GENERATION",
    "N/A",
  ];

  return (
    <div
      className="min-h-screen font-mono"
      style={{ backgroundColor: "#0a0908", color: "#e8e8e8" }}
    >
      {/* Page header */}
      <header className="border-b border-neutral-800 px-6 py-8">
        <h1 className="text-2xl font-bold" style={{ color: "#92B090" }}>
          V2 Visual Polish -- Video Review
        </h1>
        <p className="text-neutral-400 text-sm mt-2">
          Every video from the PRD organized by section. Reference numbers for
          feedback. Zero duplicate videos between hero, marquee, and enrichment sections.
        </p>
        <div className="flex flex-wrap gap-4 mt-4 text-xs">
          {allStatuses.map((s) => (
            <span key={s} className={`px-2 py-1 rounded ${statusColor(s)}`}>
              {s}
            </span>
          ))}
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-16">
        {/* ================================================================ */}
        {/* SECTION 1: HERO TILES */}
        {/* ================================================================ */}
        <section>
          <h2 className="text-xl font-bold mb-1" style={{ color: "#92B090" }}>
            Section 1: Hero Tiles
          </h2>
          <p className="text-neutral-500 text-sm mb-6">
            12 videos in a 4x3 grid. R3F floating video wall with ASCII edge
            decomposition. All videos generated and ready.
          </p>
          <div className="grid grid-cols-4 gap-4">
            {heroTiles.map((tile) => (
              <VideoCard key={tile.ref} entry={tile} />
            ))}
          </div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 2: MARQUEE ROW 1 */}
        {/* ================================================================ */}
        <section>
          <h2 className="text-xl font-bold mb-1" style={{ color: "#92B090" }}>
            Section 2: Marquee Row 1 (scrolls left -- raw footage)
          </h2>
          <p className="text-neutral-500 text-sm mb-6">
            8 videos. Diverse raw footage scenes. All videos generated and ready.
          </p>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {marqueeRow1.map((entry) => (
              <div key={entry.ref} className="flex-shrink-0 w-[280px]">
                <VideoCard entry={entry} />
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 3: MARQUEE ROW 2 */}
        {/* ================================================================ */}
        <section>
          <h2 className="text-xl font-bold mb-1" style={{ color: "#92B090" }}>
            Section 3: Marquee Row 2 (scrolls right -- annotated)
          </h2>
          <p className="text-neutral-500 text-sm mb-6">
            8 videos. Annotated and case study content. All videos generated and ready.
          </p>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {marqueeRow2.map((entry) => (
              <div key={entry.ref} className="flex-shrink-0 w-[280px]">
                <VideoCard entry={entry} />
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 4: ENRICHMENT STEPS */}
        {/* ================================================================ */}
        <section>
          <h2 className="text-xl font-bold mb-1" style={{ color: "#92B090" }}>
            Section 4: Enrichment Steps
          </h2>
          <p className="text-neutral-500 text-sm mb-6">
            9 steps in a scroll-driven parallax story. Each step crossfades to the next scene.
            E-04/E-06/E-07 are 3D model assets (.ply/.glb), E-09 is an image.
          </p>
          <div className="space-y-6">
            {enrichmentSteps.map((entry) => {
              const is3DModel = ["E-04", "E-06", "E-07"].includes(entry.ref);
              const isImage = entry.ref === "E-09";
              return (
                <div
                  key={entry.ref}
                  className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-950"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
                    <div className="flex items-center gap-3">
                      <span
                        className="font-mono text-sm font-bold px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: "rgba(146,176,144,0.2)",
                          color: "#92B090",
                        }}
                      >
                        {entry.ref}
                      </span>
                      <span className="text-white font-mono text-sm font-semibold">
                        {entry.step}
                      </span>
                      {is3DModel && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-900 text-blue-300">
                          3D model -- renders in Three.js
                        </span>
                      )}
                      {isImage && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-900 text-blue-300">
                          image asset
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded ${statusColor(entry.status)}`}
                    >
                      {entry.status}
                    </span>
                  </div>
                  <div className="flex gap-6 p-4">
                    <div className="flex-shrink-0" style={{ width: 640 }}>
                      {entry.videoPath ? (
                        <VideoPlayer
                          src={entry.videoPath}
                          status={entry.status}
                          width={640}
                          height={360}
                        />
                      ) : isImage ? (
                        <ImageCard
                          src="/images/enrichment-zoom-out.webp"
                          alt="Enrichment zoom-out composite"
                          width={640}
                          height={360}
                        />
                      ) : entry.ref === "E-04" ? (
                        <ThreeViewer
                          type="pointcloud"
                          url="/models/kitchen-pointcloud.ply"
                          height={360}
                        />
                      ) : entry.ref === "E-06" ? (
                        <ThreeViewer
                          type="glb"
                          url="/models/hand-mesh.glb"
                          height={360}
                        />
                      ) : entry.ref === "E-07" ? (
                        <ThreeViewer
                          type="glb"
                          url="/models/kitchen-trellis.glb"
                          height={360}
                        />
                      ) : (
                        <PlaceholderCard
                          title={entry.label}
                          description={entry.note ?? "Asset needs generation"}
                          status={entry.status}
                        />
                      )}
                    </div>
                    <div className="space-y-2 py-2">
                      <div className="text-white font-mono text-sm font-semibold">
                        {entry.label}
                      </div>
                      <div className="text-neutral-500 font-mono text-xs break-all">
                        {entry.source}
                      </div>
                      {entry.note && (
                        <div className="text-neutral-400 text-xs mt-2">
                          {entry.note}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 5: GLOBE THUMBNAILS */}
        {/* ================================================================ */}
        <section>
          <h2 className="text-xl font-bold mb-1" style={{ color: "#92B090" }}>
            Section 5: Globe Thumbnails
          </h2>
          <p className="text-neutral-500 text-sm mb-6">
            18 dedicated globe videos at 128x128 preview (actual globe renders at 64x64).
            All videos generated and ready. Labels in &quot;Environment in City&quot; format.
          </p>
          <div className="grid grid-cols-6 gap-4">
            {globeEntries.map((entry) => (
              <div
                key={entry.ref}
                className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-950"
              >
                {/* Ref badge */}
                <div className="flex items-center justify-between px-2 py-1.5 border-b border-neutral-800">
                  <span
                    className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: "rgba(146,176,144,0.2)",
                      color: "#92B090",
                    }}
                  >
                    {entry.ref}
                  </span>
                  <span
                    className={`text-[8px] font-mono px-1.5 py-0.5 rounded ${statusColor(entry.status)}`}
                  >
                    {entry.status}
                  </span>
                </div>

                {/* Video thumbnail */}
                <div className="flex justify-center p-2">
                  <VideoPlayer
                    src={entry.videoPath}
                    status={entry.status}
                    width={128}
                    height={128}
                    className="rounded"
                  />
                </div>

                {/* Info */}
                <div className="px-2 py-1.5 space-y-0.5">
                  <div className="text-white font-mono text-[10px] font-semibold leading-tight">
                    {entry.label}
                  </div>
                  <div className="text-neutral-500 font-mono text-[8px] break-all">
                    {entry.source}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 6: 3D VISUALIZATION ASSETS */}
        {/* ================================================================ */}
        <section>
          <h2 className="text-xl font-bold mb-1" style={{ color: "#92B090" }}>
            Section 6: 3D Visualization Assets
          </h2>
          <p className="text-neutral-500 text-sm mb-6">
            3 generated 3D assets for the enrichment pipeline. All exist as .ply/.glb files
            and will render in Three.js / React Three Fiber.
          </p>
          <div className="grid grid-cols-3 gap-6">
            {viz3DAssets.map((asset) => (
              <div
                key={asset.ref}
                className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-950"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
                  <div className="flex items-center gap-3">
                    <span
                      className="font-mono text-sm font-bold px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: "rgba(146,176,144,0.2)",
                        color: "#92B090",
                      }}
                    >
                      {asset.ref}
                    </span>
                    <span className="text-white font-mono text-sm font-semibold">
                      {asset.format}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-green-800 text-green-200">
                    EXISTS
                  </span>
                </div>

                {/* 3D Viewer + description */}
                <div className="p-4 space-y-4">
                  <div style={{ width: "100%", maxWidth: 440 }}>
                    <ThreeViewer
                      type={asset.ref === "V3D-01" ? "pointcloud" : "glb"}
                      url={asset.sourceVideo}
                      height={260}
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <div className="text-white font-mono text-xs font-bold leading-relaxed">
                      {asset.description}
                    </div>
                    <div className="text-neutral-500 font-mono text-[10px] break-all">
                      Path: {asset.sourceVideo}
                    </div>
                    <div className="text-neutral-400 text-[10px] italic">
                      {asset.note}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 7: KLING-GENERATED ENRICHMENT */}
        {/* ================================================================ */}
        <section>
          <h2 className="text-xl font-bold mb-1" style={{ color: "#92B090" }}>
            Section 7: Kling-Generated Enrichment
          </h2>
          <p className="text-neutral-500 text-sm mb-6">
            Kling AI source clips and their FAL enrichment outputs (depth, pose,
            segmentation). These source videos were used to generate hero tiles,
            globe clips, and enrichment visualizations.
          </p>
          <div className="space-y-8">
            {/* --- Robot Arm --- */}
            <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-950 p-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-sm font-bold px-2 py-0.5 rounded" style={{ backgroundColor: "rgba(146,176,144,0.2)", color: "#92B090" }}>K-01</span>
                <span className="text-white font-mono text-sm font-semibold">Robot Arm (raw-robot.mp4)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-green-800 text-green-200">EXISTS</span>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-[10px] font-mono text-neutral-400 mb-1">SOURCE VIDEO</p>
                  <VideoPlayer src="/videos/enrichment-viz/raw-robot.mp4" status="EXISTS" height={160} />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-neutral-400 mb-1">DEPTH MAP</p>
                  <ImageCard src="/images/enrichment-viz/depth-robot.png" alt="Robot arm depth map" height={160} />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-neutral-400 mb-1">SEGMENTATION</p>
                  <ImageCard src="/images/enrichment-viz/seg-robot.png" alt="Robot arm segmentation" height={160} />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-neutral-400 mb-1">HERO CROP</p>
                  <VideoPlayer src="/videos/mosaic/kling-robot.mp4" status="EXISTS" height={160} />
                </div>
              </div>
            </div>

            {/* --- Sim Lab --- */}
            <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-950 p-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-sm font-bold px-2 py-0.5 rounded" style={{ backgroundColor: "rgba(146,176,144,0.2)", color: "#92B090" }}>K-02</span>
                <span className="text-white font-mono text-sm font-semibold">Sim Lab (raw-simlab.mp4)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-green-800 text-green-200">EXISTS</span>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-[10px] font-mono text-neutral-400 mb-1">SOURCE VIDEO</p>
                  <VideoPlayer src="/videos/enrichment-viz/raw-simlab.mp4" status="EXISTS" height={160} />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-neutral-400 mb-1">DEPTH MAP</p>
                  <ImageCard src="/images/enrichment-viz/depth-simlab.png" alt="Sim lab depth map" height={160} />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-neutral-400 mb-1">HERO CROP</p>
                  <VideoPlayer src="/videos/mosaic/kling-simlab.mp4" status="EXISTS" height={160} />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-neutral-400 mb-1">GLOBE CROP (G-01)</p>
                  <VideoPlayer src="/videos/globe/g01-sf-kling.mp4" status="EXISTS" height={160} />
                </div>
              </div>
            </div>

            {/* --- Kitchen (Kling) --- */}
            <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-950 p-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-sm font-bold px-2 py-0.5 rounded" style={{ backgroundColor: "rgba(146,176,144,0.2)", color: "#92B090" }}>K-03</span>
                <span className="text-white font-mono text-sm font-semibold">Kitchen (raw-kitchen.mp4)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-green-800 text-green-200">EXISTS</span>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-[10px] font-mono text-neutral-400 mb-1">SOURCE VIDEO</p>
                  <VideoPlayer src="/videos/enrichment-viz/raw-kitchen.mp4" status="EXISTS" height={160} />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-neutral-400 mb-1">DEPTH MAP</p>
                  <ImageCard src="/images/enrichment-viz/depth-kitchen-kling.png" alt="Kitchen depth map" height={160} />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-neutral-400 mb-1">POSE</p>
                  <ImageCard src="/images/enrichment-viz/pose-kitchen-kling.png" alt="Kitchen pose estimation" height={160} />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-neutral-400 mb-1">GLOBE CROP (G-14)</p>
                  <VideoPlayer src="/videos/globe/g14-dhaka-kling.mp4" status="EXISTS" height={160} />
                </div>
              </div>
            </div>

            {/* --- Warehouse --- */}
            <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-950 p-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-sm font-bold px-2 py-0.5 rounded" style={{ backgroundColor: "rgba(146,176,144,0.2)", color: "#92B090" }}>K-04</span>
                <span className="text-white font-mono text-sm font-semibold">Warehouse (raw-warehouse.mp4)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-green-800 text-green-200">EXISTS</span>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-[10px] font-mono text-neutral-400 mb-1">SOURCE VIDEO</p>
                  <VideoPlayer src="/videos/enrichment-viz/raw-warehouse.mp4" status="EXISTS" height={160} />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-neutral-400 mb-1">DEPTH MAP</p>
                  <ImageCard src="/images/enrichment-viz/depth-warehouse.png" alt="Warehouse depth map" height={160} />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-neutral-400 mb-1">SEGMENTATION</p>
                  <ImageCard src="/images/enrichment-viz/seg-warehouse.png" alt="Warehouse segmentation" height={160} />
                </div>
                <div className="flex items-center justify-center bg-neutral-900 rounded" style={{ height: 160 }}>
                  <span className="text-neutral-600 font-mono text-[10px]">No derived crop</span>
                </div>
              </div>
            </div>

            {/* --- Human Fold --- */}
            <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-950 p-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-sm font-bold px-2 py-0.5 rounded" style={{ backgroundColor: "rgba(146,176,144,0.2)", color: "#92B090" }}>K-05</span>
                <span className="text-white font-mono text-sm font-semibold">Human Fold (human-fold.mp4)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-green-800 text-green-200">EXISTS</span>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-[10px] font-mono text-neutral-400 mb-1">SOURCE VIDEO</p>
                  <VideoPlayer src="/videos/enrichment-viz/human-fold.mp4" status="EXISTS" height={160} />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-neutral-400 mb-1">DEPTH MAP</p>
                  <ImageCard src="/images/enrichment-viz/depth-human-fold.png" alt="Human fold depth map" height={160} />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-neutral-400 mb-1">POSE</p>
                  <ImageCard src="/images/enrichment-viz/pose-human-fold.png" alt="Human fold pose estimation" height={160} />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-neutral-400 mb-1">3D VIZ</p>
                  <ImageCard src="/images/enrichment-viz/viz-human-fold-3d.jpg" alt="Human fold 3D visualization" height={160} />
                </div>
              </div>
            </div>

            {/* --- Globe-specific Kling clips --- */}
            <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-950 p-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-sm font-bold px-2 py-0.5 rounded" style={{ backgroundColor: "rgba(146,176,144,0.2)", color: "#92B090" }}>K-06..08</span>
                <span className="text-white font-mono text-sm font-semibold">Globe-specific Kling clips (India, Lagos, Bangkok)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-green-800 text-green-200">EXISTS</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-[10px] font-mono text-neutral-400 mb-1">GLOBE-INDIA (G-02 Mumbai)</p>
                  <div className="grid grid-cols-2 gap-2">
                    <VideoPlayer src="/videos/enrichment-viz/globe-india.mp4" status="EXISTS" height={120} />
                    <VideoPlayer src="/videos/globe/g02-mumbai-kling.mp4" status="EXISTS" height={120} />
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-neutral-400 mb-1">GLOBE-LAGOS (G-06 Lagos)</p>
                  <div className="grid grid-cols-2 gap-2">
                    <VideoPlayer src="/videos/enrichment-viz/globe-lagos.mp4" status="EXISTS" height={120} />
                    <VideoPlayer src="/videos/globe/g06-lagos-kling.mp4" status="EXISTS" height={120} />
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-neutral-400 mb-1">GLOBE-BANGKOK (G-08 Bangkok)</p>
                  <div className="grid grid-cols-2 gap-2">
                    <VideoPlayer src="/videos/enrichment-viz/globe-bangkok.mp4" status="EXISTS" height={120} />
                    <VideoPlayer src="/videos/globe/g08-bangkok-kling.mp4" status="EXISTS" height={120} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* SUMMARY TABLE */}
        {/* ================================================================ */}
        <section className="border-t border-neutral-800 pt-8">
          <h2 className="text-xl font-bold mb-4" style={{ color: "#92B090" }}>
            Summary
          </h2>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-bold text-neutral-300 mb-3">
                Counts by Status
              </h3>
              <table className="w-full text-xs font-mono">
                <tbody>
                  {allStatuses.map((status) => {
                    const count = allEntries.filter(
                      (e) => e.status === status
                    ).length;
                    return (
                      <tr key={status} className="border-b border-neutral-800">
                        <td className="py-1.5">
                          <span
                            className={`px-2 py-0.5 rounded ${statusColor(status)}`}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="py-1.5 text-right text-neutral-300">
                          {count}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="font-bold">
                    <td className="py-1.5 text-neutral-300">TOTAL</td>
                    <td className="py-1.5 text-right text-neutral-300">
                      {allEntries.length}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-300 mb-3">
                Counts by Section
              </h3>
              <table className="w-full text-xs font-mono">
                <tbody>
                  {[
                    { name: "Hero Tiles", count: heroTiles.length },
                    { name: "Marquee Row 1", count: marqueeRow1.length },
                    { name: "Marquee Row 2", count: marqueeRow2.length },
                    { name: "Enrichment Steps", count: enrichmentSteps.length },
                    { name: "Globe Thumbnails", count: globeEntries.length },
                    { name: "3D Viz Assets", count: viz3DAssets.length },
                  ].map((s) => (
                    <tr key={s.name} className="border-b border-neutral-800">
                      <td className="py-1.5 text-neutral-300">{s.name}</td>
                      <td className="py-1.5 text-right text-neutral-300">
                        {s.count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Duplicate check */}
          <div className="mt-8">
            <h3 className="text-sm font-bold text-neutral-300 mb-3">
              Duplicate Check (Hero / Marquee 1 / Marquee 2 / Enrichment)
            </h3>
            <DuplicateChecker />
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-neutral-800 px-6 py-6 text-center text-neutral-600 text-xs font-mono">
        V2 Visual Polish Review Page -- Internal Use Only
      </footer>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Duplicate checker component -- verifies no source video appears in more
// than one section (hero, marquee1, marquee2, enrichment)
// ---------------------------------------------------------------------------

function DuplicateChecker() {
  const sections = [
    { name: "Hero", entries: heroTiles },
    { name: "Marquee 1", entries: marqueeRow1 },
    { name: "Marquee 2", entries: marqueeRow2 },
    { name: "Enrichment", entries: enrichmentSteps },
  ];

  // Build a map: source -> list of (section, ref)
  const sourceMap = new Map<string, { section: string; ref: string }[]>();
  for (const section of sections) {
    for (const entry of section.entries) {
      // Normalize: strip timestamps and extra info for comparison
      const normalized = entry.source.split(" (")[0].split(".mp4")[0] + ".mp4";
      if (!sourceMap.has(normalized)) {
        sourceMap.set(normalized, []);
      }
      sourceMap.get(normalized)!.push({ section: section.name, ref: entry.ref });
    }
  }

  // Find duplicates (appearing in more than one SECTION)
  const duplicates: { source: string; locations: { section: string; ref: string }[] }[] = [];
  for (const [source, locations] of sourceMap) {
    const uniqueSections = new Set(locations.map((l) => l.section));
    if (uniqueSections.size > 1) {
      duplicates.push({ source, locations });
    }
  }

  if (duplicates.length === 0) {
    return (
      <div className="px-4 py-3 rounded-lg bg-green-900/30 border border-green-800 text-green-300 text-xs font-mono">
        No cross-section duplicates found. All hero, marquee, and enrichment
        videos use unique sources.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="px-4 py-3 rounded-lg bg-yellow-900/30 border border-yellow-800 text-yellow-300 text-xs font-mono">
        {duplicates.length} cross-section duplicate(s) found:
      </div>
      {duplicates.map((d) => (
        <div
          key={d.source}
          className="px-4 py-2 rounded bg-neutral-900 border border-neutral-700 text-xs font-mono"
        >
          <span className="text-yellow-400">{d.source}</span>
          <span className="text-neutral-500"> appears in: </span>
          {d.locations.map((l, i) => (
            <span key={i}>
              {i > 0 && ", "}
              <span className="text-neutral-300">
                {l.section} ({l.ref})
              </span>
            </span>
          ))}
        </div>
      ))}
      <div className="px-4 py-2 rounded bg-neutral-900 border border-neutral-700 text-xs font-mono text-neutral-400 italic">
        Note: depth-welding.mp4 appears in both Hero (H-06) and Enrichment (E-03).
        This is intentional -- same depth map asset used in both contexts.
      </div>
    </div>
  );
}
