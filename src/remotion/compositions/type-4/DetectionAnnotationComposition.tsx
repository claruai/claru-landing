import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Video,
} from "remotion";
import { TOKENS } from "../../shared/DesignTokens";
import { BoundingBox } from "../../shared/BoundingBox";
import { BottomBar } from "../../shared/BottomBar";
import { TechMetadataOverlay } from "../../shared/TechMetadataOverlay";
import { VerdictBadge } from "../../shared/VerdictBadge";
import {
  Type4Annotation,
  isObjectIdentity,
  isProductImage,
} from "./types";

// ---------------------------------------------------------------------------
// Hardcoded fallback data from real annotation JSONs (media-asset-audit.md)
// Used when annotation JSON hasn't been extracted yet
// ---------------------------------------------------------------------------

const FALLBACK_OBJECT_IDENTITY: Type4Annotation = {
  type: 4,
  compositionId: "cs-object-id",
  segments: [
    {
      bbox: [965, 222, 1390, 829],
      class: "face",
      score: 0.825,
      frameIndex: -3,
      segmentId: "segment-1",
    },
    {
      bbox: [320, 180, 680, 720],
      class: "face",
      score: 0.791,
      frameIndex: -3,
      segmentId: "segment-2",
    },
  ],
  identityMatches: {
    segment1_image1: "yes",
    segment1_image2: "yes",
    segment2_image1: "yes",
    segment2_image2: "yes",
  },
  projectType: "OBJECT_IDENTITY_V4",
};

const FALLBACK_PRODUCT_IMAGE: Type4Annotation = {
  type: 4,
  compositionId: "cs-fashion",
  brandName: "Craghoppers",
  category: "Fashion (Men's)",
  subcategory: "Tops",
  caption: "A bright blue pullover with a half-zip front and long sleeves",
  longCaption:
    "A man wearing a bright blue Craghoppers half-zip fleece pullover, styled with black pants and hiking shoes. The pullover features a stand-up collar, half-zip front closure, and long sleeves with subtle texture. Professional e-commerce lifestyle shot on a clean gray studio background.",
  bbox: { x1: 175.26, y1: 64.57, x2: 365.51, y2: 317.09 },
  projectType: "SKU_IMAGE_ANNOTATION",
};

// Video resolution for normalizing Object Identity pixel bboxes
const OBJECT_ID_WIDTH = 1920;
const OBJECT_ID_HEIGHT = 1080;

// Product Image resolution for normalizing product bboxes
const PRODUCT_IMG_WIDTH = 500;
const PRODUCT_IMG_HEIGHT = 700;

// ---------------------------------------------------------------------------
// Timeline constants (in frames at 30fps)
// ---------------------------------------------------------------------------
const T = {
  FADE_IN_START: 0,
  FADE_IN_END: 20,
  BBOX_START: 20,
  BBOX_END: 60,
  LABELS_START: 60,
  LABELS_END: 90,
  CAPTION_START: 90,
  CAPTION_END: 150,
  META_START: 150,
  META_END: 210,
  HOLD_START: 210,
  HOLD_END: 270,
  FADE_OUT_START: 270,
  FADE_OUT_END: 300,
} as const;

// ---------------------------------------------------------------------------
// Helper: load annotation JSON at build time
// ---------------------------------------------------------------------------
function loadAnnotation(compositionId: string): Type4Annotation | null {
  try {
    // Remotion staticFile resolves from public/
    const path = `remotion-assets/annotations/${compositionId}.json`;
    // We use a dynamic require pattern; if the file doesn't exist, fallback
    // Since Remotion bundles with webpack, staticFile is for media URLs.
    // Annotation data is embedded via fallback constants.
    void path;
    return null;
  } catch {
    return null;
  }
}

function getAnnotation(compositionId: string): Type4Annotation {
  const loaded = loadAnnotation(compositionId);
  if (loaded) return loaded;

  // Fallback to hardcoded real data
  if (compositionId === "cs-object-id") return FALLBACK_OBJECT_IDENTITY;
  if (compositionId === "cs-fashion") return FALLBACK_PRODUCT_IMAGE;

  // Generic fallback for unknown composition IDs
  return { ...FALLBACK_PRODUCT_IMAGE, compositionId };
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Typewriter text that reveals letter-by-letter */
const TypewriterText: React.FC<{
  text: string;
  startFrame: number;
  endFrame: number;
  style?: React.CSSProperties;
}> = ({ text, startFrame, endFrame, style }) => {
  const frame = useCurrentFrame();
  const charCount = Math.floor(
    interpolate(frame, [startFrame, endFrame], [0, text.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  return (
    <div
      style={{
        fontFamily: TOKENS.fonts.mono,
        fontSize: 11,
        color: TOKENS.colors.text,
        lineHeight: 1.5,
        ...style,
      }}
    >
      {text.slice(0, charCount)}
      {charCount < text.length && (
        <span
          style={{
            opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0,
            color: TOKENS.colors.accent,
          }}
        >
          _
        </span>
      )}
    </div>
  );
};

/** Identity match line between two segments */
const IdentityMatchLine: React.FC<{
  seg1Bbox: [number, number, number, number];
  seg2Bbox: [number, number, number, number];
  verdict: string;
  startFrame: number;
}> = ({ seg1Bbox, seg2Bbox, verdict, startFrame }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(
    frame,
    [startFrame, startFrame + 30],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  if (progress <= 0) return null;

  // Center points of each bbox
  const cx1 = ((seg1Bbox[0] + seg1Bbox[2]) / 2) * 100;
  const cy1 = ((seg1Bbox[1] + seg1Bbox[3]) / 2) * 100;
  const cx2 = ((seg2Bbox[0] + seg2Bbox[2]) / 2) * 100;
  const cy2 = ((seg2Bbox[1] + seg2Bbox[3]) / 2) * 100;

  const isMatch = verdict.toLowerCase() === "yes";
  const lineColor = isMatch ? TOKENS.colors.success : TOKENS.colors.rejected;

  // Midpoint for the verdict label
  const midX = (cx1 + cx2) / 2;
  const midY = (cy1 + cy2) / 2;

  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity: progress,
      }}
    >
      {/* Dashed connecting line */}
      <line
        x1={`${cx1}%`}
        y1={`${cy1}%`}
        x2={`${cx1 + (cx2 - cx1) * progress}%`}
        y2={`${cy1 + (cy2 - cy1) * progress}%`}
        stroke={lineColor}
        strokeWidth={1.5}
        strokeDasharray="4 3"
        opacity={0.7}
      />
      {/* Verdict label at midpoint */}
      {progress >= 0.8 && (
        <foreignObject
          x={`${midX - 8}%`}
          y={`${midY - 3}%`}
          width="16%"
          height="6%"
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <div
              style={{
                fontFamily: TOKENS.fonts.mono,
                fontSize: 9,
                color: lineColor,
                backgroundColor: "rgba(10, 9, 8, 0.85)",
                padding: "2px 6px",
                borderRadius: 2,
                border: `1px solid ${lineColor}40`,
                whiteSpace: "nowrap",
                letterSpacing: 0.5,
                fontWeight: 600,
              }}
            >
              Same person? {isMatch ? "YES" : "NO"}
            </div>
          </div>
        </foreignObject>
      )}
    </svg>
  );
};

/** Brand/category metadata panel for Product Image */
const ProductMetadata: React.FC<{
  brandName: string;
  category: string;
  subcategory: string;
  startFrame: number;
}> = ({ brandName, category, subcategory, startFrame }) => {
  const frame = useCurrentFrame();
  const slideIn = interpolate(
    frame,
    [startFrame, startFrame + 20],
    [-100, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const opacity = interpolate(
    frame,
    [startFrame, startFrame + 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        top: 16,
        right: 16,
        display: "flex",
        flexDirection: "column",
        gap: 6,
        opacity,
        transform: `translateX(${slideIn}%)`,
      }}
    >
      {/* Brand */}
      <div
        style={{
          backgroundColor: TOKENS.colors.panelBg,
          border: `1px solid ${TOKENS.bbox.product}30`,
          borderRadius: 3,
          padding: "4px 10px",
          fontFamily: TOKENS.fonts.mono,
        }}
      >
        <div
          style={{
            fontSize: 8,
            color: TOKENS.colors.muted,
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          Brand
        </div>
        <div
          style={{
            fontSize: 13,
            color: TOKENS.bbox.product,
            fontWeight: 600,
            marginTop: 1,
          }}
        >
          {brandName}
        </div>
      </div>
      {/* Category */}
      <div
        style={{
          backgroundColor: TOKENS.colors.panelBg,
          border: `1px solid ${TOKENS.colors.accent}30`,
          borderRadius: 3,
          padding: "4px 10px",
          fontFamily: TOKENS.fonts.mono,
        }}
      >
        <div
          style={{
            fontSize: 8,
            color: TOKENS.colors.muted,
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          Category
        </div>
        <div
          style={{
            fontSize: 11,
            color: TOKENS.colors.accent,
            fontWeight: 500,
            marginTop: 1,
          }}
        >
          {category}
        </div>
        <div
          style={{
            fontSize: 10,
            color: TOKENS.colors.muted,
            marginTop: 1,
          }}
        >
          {subcategory}
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main Composition
// ---------------------------------------------------------------------------

export interface DetectionAnnotationCompositionProps {
  compositionId: string;
}

const DetectionAnnotationComposition: React.FC<
  DetectionAnnotationCompositionProps
> = ({ compositionId }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const timeS = frame / fps;

  const data = getAnnotation(compositionId);
  const isIdentity = isObjectIdentity(data);
  const isProduct = isProductImage(data);

  // ---------------------------------------------------------------------------
  // Global fade in/out
  // ---------------------------------------------------------------------------
  const fadeIn = interpolate(frame, [T.FADE_IN_START, T.FADE_IN_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [T.FADE_OUT_START, T.FADE_OUT_END],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const globalOpacity = fadeIn * fadeOut;

  // ---------------------------------------------------------------------------
  // Bbox draw progress (0 to 1 over T.BBOX_START..T.BBOX_END)
  // ---------------------------------------------------------------------------
  const bboxProgress = interpolate(
    frame,
    [T.BBOX_START, T.BBOX_END],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ---------------------------------------------------------------------------
  // Label/score opacity (0 to 1 over T.LABELS_START..T.LABELS_END)
  // ---------------------------------------------------------------------------
  const labelOpacity = interpolate(
    frame,
    [T.LABELS_START, T.LABELS_END],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ---------------------------------------------------------------------------
  // Phase label for BottomBar
  // ---------------------------------------------------------------------------
  let phaseLabel = "initializing";
  if (frame >= T.FADE_OUT_START) phaseLabel = "complete";
  else if (frame >= T.META_START) phaseLabel = isIdentity ? "identity_match" : "metadata";
  else if (frame >= T.CAPTION_START) phaseLabel = "captioning";
  else if (frame >= T.LABELS_START) phaseLabel = "labeling";
  else if (frame >= T.BBOX_START) phaseLabel = "detection";
  else if (frame >= T.FADE_IN_START) phaseLabel = "loading";

  // ---------------------------------------------------------------------------
  // Media source paths
  // ---------------------------------------------------------------------------
  const videoSrc = staticFile(`remotion-assets/samples/${compositionId}.mp4`);
  const imageSrc = staticFile(`remotion-assets/samples/${compositionId}.jpg`);

  // ---------------------------------------------------------------------------
  // Normalize bboxes to [0,1] range for BoundingBox component
  // ---------------------------------------------------------------------------
  function normalizeObjectBbox(
    bbox: number[]
  ): [number, number, number, number] {
    return [
      bbox[0] / OBJECT_ID_WIDTH,
      bbox[1] / OBJECT_ID_HEIGHT,
      bbox[2] / OBJECT_ID_WIDTH,
      bbox[3] / OBJECT_ID_HEIGHT,
    ];
  }

  function normalizeProductBbox(
    box: { x1: number; y1: number; x2: number; y2: number }
  ): [number, number, number, number] {
    return [
      box.x1 / PRODUCT_IMG_WIDTH,
      box.y1 / PRODUCT_IMG_HEIGHT,
      box.x2 / PRODUCT_IMG_WIDTH,
      box.y2 / PRODUCT_IMG_HEIGHT,
    ];
  }

  // Product image zoom-in
  const productZoom = isProduct
    ? interpolate(frame, [T.FADE_IN_START, T.BBOX_START + 20], [1.05, 1.0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  // Video freeze-frame: after BBOX_START we let the video play from 0 but
  // Remotion's <Video> handles playback. For freeze-frame effect at detection
  // point, we set a short playback window.
  const videoEndTime = T.BBOX_START / fps;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0908",
        fontFamily: TOKENS.fonts.mono,
      }}
    >
      <div style={{ opacity: globalOpacity, width: "100%", height: "100%" }}>
        {/* ----------------------------------------------------------------- */}
        {/* Media Layer */}
        {/* ----------------------------------------------------------------- */}
        <AbsoluteFill>
          {isIdentity ? (
            // Object Identity: video that plays briefly then freezes
            <AbsoluteFill
              style={{
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              <Video
                src={videoSrc}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                startFrom={0}
                endAt={Math.ceil(videoEndTime * fps) + T.FADE_OUT_END}
                pauseWhenBuffering
              />
              {/* Dark overlay for readability once bboxes appear */}
              {frame >= T.BBOX_START && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.25)",
                    opacity: interpolate(
                      frame,
                      [T.BBOX_START, T.BBOX_START + 10],
                      [0, 1],
                      {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                      }
                    ),
                  }}
                />
              )}
            </AbsoluteFill>
          ) : (
            // Product Image: static image with zoom-in
            <AbsoluteFill
              style={{
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              <Img
                src={imageSrc}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  transform: `scale(${productZoom})`,
                }}
              />
              {/* Subtle vignette */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(ellipse at center, transparent 50%, rgba(10,9,8,0.6) 100%)",
                }}
              />
            </AbsoluteFill>
          )}
        </AbsoluteFill>

        {/* ----------------------------------------------------------------- */}
        {/* Bounding Boxes */}
        {/* ----------------------------------------------------------------- */}
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          {isIdentity &&
            data.segments?.map((seg, i) => {
              // Stagger each bbox
              const segDelay = i * 8;
              const segProgress = interpolate(
                frame,
                [T.BBOX_START + segDelay, T.BBOX_END + segDelay],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );

              const normalized = normalizeObjectBbox(seg.bbox);

              return (
                <BoundingBox
                  key={`seg-${i}`}
                  bbox={normalized}
                  label={seg.class}
                  color={TOKENS.bbox.face}
                  confidence={labelOpacity > 0.3 ? seg.score : undefined}
                  sublabel={
                    labelOpacity > 0.5
                      ? `seg-${i + 1}`
                      : undefined
                  }
                  opacity={segProgress * bboxProgress}
                  showCorners
                />
              );
            })}

          {isProduct && data.bbox && (
            <BoundingBox
              bbox={normalizeProductBbox(data.bbox)}
              label="product"
              color={TOKENS.bbox.product}
              confidence={labelOpacity > 0.3 ? 0.97 : undefined}
              sublabel={
                labelOpacity > 0.5
                  ? data.subcategory ?? undefined
                  : undefined
              }
              opacity={bboxProgress}
              showCorners
            />
          )}
        </AbsoluteFill>

        {/* ----------------------------------------------------------------- */}
        {/* Identity Match Lines (Object Identity only) */}
        {/* ----------------------------------------------------------------- */}
        {isIdentity &&
          data.segments &&
          data.segments.length >= 2 &&
          data.identityMatches && (
            <IdentityMatchLine
              seg1Bbox={normalizeObjectBbox(data.segments[0].bbox)}
              seg2Bbox={normalizeObjectBbox(data.segments[1].bbox)}
              verdict={data.identityMatches.segment1_image1 ?? "yes"}
              startFrame={T.META_START}
            />
          )}

        {/* ----------------------------------------------------------------- */}
        {/* Caption Typewriter */}
        {/* ----------------------------------------------------------------- */}
        <div
          style={{
            position: "absolute",
            bottom: 52,
            left: 16,
            right: isProduct ? 200 : 16,
            maxWidth: 700,
          }}
        >
          {/* Short caption */}
          {data.caption && (
            <div
              style={{
                backgroundColor: TOKENS.colors.panelBg,
                borderRadius: 3,
                padding: "6px 10px",
                marginBottom: 4,
              }}
            >
              <TypewriterText
                text={data.caption}
                startFrame={T.CAPTION_START}
                endFrame={T.CAPTION_END}
                style={{ fontSize: 11, color: TOKENS.colors.text }}
              />
            </div>
          )}
          {/* Long caption (appears after short) */}
          {data.longCaption && frame >= T.CAPTION_END && (
            <div
              style={{
                backgroundColor: TOKENS.colors.panelBg,
                borderRadius: 3,
                padding: "6px 10px",
                opacity: interpolate(
                  frame,
                  [T.CAPTION_END, T.CAPTION_END + 10],
                  [0, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                ),
              }}
            >
              <TypewriterText
                text={data.longCaption}
                startFrame={T.CAPTION_END}
                endFrame={T.META_END}
                style={{ fontSize: 9, color: TOKENS.colors.muted }}
              />
            </div>
          )}
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Object Identity: verdict badge */}
        {/* ----------------------------------------------------------------- */}
        {isIdentity && frame >= T.META_START && (
          <div
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              alignItems: "flex-end",
            }}
          >
            <div
              style={{
                backgroundColor: TOKENS.colors.panelBg,
                borderRadius: 3,
                padding: "6px 12px",
                border: `1px solid ${TOKENS.colors.accent}20`,
              }}
            >
              <div
                style={{
                  fontSize: 8,
                  color: TOKENS.colors.muted,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  marginBottom: 3,
                }}
              >
                Identity Verification v4
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: TOKENS.colors.text,
                  marginBottom: 4,
                }}
              >
                {data.segments?.length ?? 0} segments detected
              </div>
              <VerdictBadge
                verdict="MATCH CONFIRMED"
                color={TOKENS.colors.success}
                variant="badge"
                animationStyle="glow"
                animateFrom={T.META_START + 10}
                animationDuration={20}
              />
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Product Image: brand/category metadata panel */}
        {/* ----------------------------------------------------------------- */}
        {isProduct && (
          <ProductMetadata
            brandName={data.brandName ?? "Unknown"}
            category={data.category ?? "Uncategorized"}
            subcategory={data.subcategory ?? ""}
            startFrame={T.META_START}
          />
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Project type indicator */}
        {/* ----------------------------------------------------------------- */}
        {data.projectType && frame >= T.LABELS_START && (
          <div
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              opacity: labelOpacity,
            }}
          >
            <div
              style={{
                backgroundColor: TOKENS.colors.panelBg,
                borderRadius: 2,
                padding: "3px 8px",
                fontFamily: TOKENS.fonts.mono,
                fontSize: 8,
                color: TOKENS.colors.muted,
                letterSpacing: 1,
                textTransform: "uppercase",
                border: `1px solid rgba(255,255,255,0.06)`,
              }}
            >
              {data.projectType}
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Overlays: TechMetadata + BottomBar */}
        {/* ----------------------------------------------------------------- */}
        <TechMetadataOverlay
          codec="h264"
          resolution={isIdentity ? "1920x1080" : "500x700"}
          fps={30}
          duration={`${(durationInFrames / fps).toFixed(1)}s`}
        />
        <BottomBar timeS={timeS} phaseLabel={phaseLabel} />
      </div>
    </AbsoluteFill>
  );
};

export default DetectionAnnotationComposition;
