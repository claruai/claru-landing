import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  OffthreadVideo,
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
import CrossClipIdentityView from "./CrossClipIdentityView";

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
// Timeline constants for GENERIC path (in frames at 30fps)
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
    const path = `remotion-assets/annotations/${compositionId}.json`;
    void path;
    return null;
  } catch {
    return null;
  }
}

function getAnnotation(compositionId: string): Type4Annotation {
  const loaded = loadAnnotation(compositionId);
  if (loaded) return loaded;

  if (compositionId === "cs-object-id") return FALLBACK_OBJECT_IDENTITY;
  if (compositionId === "cs-fashion") return FALLBACK_PRODUCT_IMAGE;

  return { ...FALLBACK_PRODUCT_IMAGE, compositionId };
}

// ===========================================================================
// FASHION ANNOTATION WORKFLOW — cs-fashion dedicated view
// ===========================================================================

// Timeline phases (300 frames = 10s at 30fps)
const F = {
  // Phase 1: Image appears
  IMG_START: 0,
  IMG_END: 30,
  // Phase 2: Draw bounding box
  BBOX_DRAW_START: 30,
  BBOX_CURSOR_ARRIVE: 45, // cursor reaches start corner
  BBOX_DRAG_START: 48,
  BBOX_DRAG_END: 82,
  BBOX_SETTLE: 90,
  // Phase 3: Type caption
  CAPTION_START: 90,
  CAPTION_TYPE_START: 96,
  CAPTION_TYPE_END: 135,
  CAPTION_END: 140,
  // Phase 4: Category dropdowns
  CAT_START: 140,
  CAT_OPEN: 148,
  CAT_SELECT: 158,
  SUBCAT_OPEN: 168,
  SUBCAT_SELECT: 178,
  CAT_END: 190,
  // Phase 5: Brand identification
  BRAND_START: 190,
  BRAND_TYPE_START: 196,
  BRAND_TYPE_END: 214,
  URL_TYPE_START: 216,
  URL_TYPE_END: 228,
  BRAND_END: 230,
  // Phase 6: JSON output
  JSON_START: 230,
  JSON_REVEAL_END: 280,
  FADE_OUT_START: 288,
  FADE_OUT_END: 300,
} as const;

// Bbox target in normalized image-area coordinates (pullover region)
const BBOX_TARGET = { x1: 0.35, y1: 0.08, x2: 0.72, y2: 0.52 };

// Image area takes 60% left
const IMAGE_AREA_PCT = 60;
const FORM_AREA_PCT = 40;

// ---------------------------------------------------------------------------
// Cursor SVG
// ---------------------------------------------------------------------------
const CursorIcon: React.FC<{ clicking?: boolean }> = ({ clicking }) => (
  <svg
    width="20"
    height="24"
    viewBox="0 0 24 28"
    fill="none"
    style={{ filter: clicking ? "drop-shadow(0 0 6px #fff)" : "none" }}
  >
    <path
      d="M5 2L5 22L10 17L16 26L19 24L13 15L20 15L5 2Z"
      fill={clicking ? "#fff" : "rgba(255,255,255,0.95)"}
      stroke="rgba(0,0,0,0.5)"
      strokeWidth="1.5"
    />
  </svg>
);

// ---------------------------------------------------------------------------
// Typewriter for form fields — reveals text char by char with blinking cursor
// ---------------------------------------------------------------------------
const FieldTypewriter: React.FC<{
  text: string;
  startFrame: number;
  endFrame: number;
  fontSize?: number;
  color?: string;
}> = ({ text, startFrame, endFrame, fontSize = 11, color = TOKENS.colors.text }) => {
  const frame = useCurrentFrame();
  const charCount = Math.floor(
    interpolate(frame, [startFrame, endFrame], [0, text.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  if (frame < startFrame) return null;
  return (
    <span style={{ fontFamily: TOKENS.fonts.mono, fontSize, color }}>
      {text.slice(0, charCount)}
      {charCount < text.length && (
        <span
          style={{
            opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0,
            color: TOKENS.colors.accent,
          }}
        >
          |
        </span>
      )}
    </span>
  );
};

// ---------------------------------------------------------------------------
// Form field wrapper — terminal-style input look
// ---------------------------------------------------------------------------
const FormField: React.FC<{
  label: string;
  children: React.ReactNode;
  opacity?: number;
  style?: React.CSSProperties;
}> = ({ label, children, opacity = 1, style }) => (
  <div style={{ marginBottom: 6, opacity, ...style }}>
    <div
      style={{
        fontFamily: TOKENS.fonts.mono,
        fontSize: 8,
        color: TOKENS.colors.muted,
        letterSpacing: 1,
        textTransform: "uppercase",
        marginBottom: 2,
      }}
    >
      {label}
    </div>
    <div
      style={{
        backgroundColor: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 3,
        padding: "5px 8px",
        minHeight: 22,
        fontFamily: TOKENS.fonts.mono,
        fontSize: 11,
        color: TOKENS.colors.text,
      }}
    >
      {children}
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Dropdown component — shows options, highlights one, selects it
// ---------------------------------------------------------------------------
const DropdownSelect: React.FC<{
  label: string;
  options: string[];
  selectedIndex: number;
  openFrame: number;
  selectFrame: number;
  opacity?: number;
}> = ({ label, options, selectedIndex, openFrame, selectFrame, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const isOpen = frame >= openFrame && frame < selectFrame + 6;
  const isSelected = frame >= selectFrame;

  const dropdownOpacity = interpolate(
    frame,
    [openFrame - 4, openFrame],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Hover highlights: cycle through options before selecting
  const hoverIdx = isOpen && !isSelected
    ? Math.floor(interpolate(
        frame,
        [openFrame, selectFrame - 2],
        [0, selectedIndex + 0.99],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      ))
    : selectedIndex;

  return (
    <div style={{ marginBottom: 6, opacity: opacity * dropdownOpacity }}>
      <div
        style={{
          fontFamily: TOKENS.fonts.mono,
          fontSize: 8,
          color: TOKENS.colors.muted,
          letterSpacing: 1,
          textTransform: "uppercase",
          marginBottom: 2,
        }}
      >
        {label}
      </div>
      {isOpen && !isSelected ? (
        // Open dropdown with options
        <div
          style={{
            backgroundColor: "rgba(20,19,18,0.95)",
            border: `1px solid ${TOKENS.colors.accent}40`,
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          {options.map((opt, i) => (
            <div
              key={opt}
              style={{
                padding: "4px 8px",
                fontFamily: TOKENS.fonts.mono,
                fontSize: 10,
                color: i === hoverIdx ? "#000" : TOKENS.colors.text,
                backgroundColor:
                  i === hoverIdx ? TOKENS.colors.accent : "transparent",
                transition: "background-color 0.05s",
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      ) : isSelected ? (
        // Collapsed with selected value
        <div
          style={{
            backgroundColor: "rgba(255,255,255,0.04)",
            border: `1px solid ${TOKENS.colors.accent}30`,
            borderRadius: 3,
            padding: "5px 8px",
            fontFamily: TOKENS.fonts.mono,
            fontSize: 11,
            color: TOKENS.colors.accent,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{options[selectedIndex]}</span>
          <span style={{ fontSize: 8, color: TOKENS.colors.muted }}>
            &#9662;
          </span>
        </div>
      ) : (
        // Closed placeholder
        <div
          style={{
            backgroundColor: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 3,
            padding: "5px 8px",
            fontFamily: TOKENS.fonts.mono,
            fontSize: 10,
            color: TOKENS.colors.muted,
          }}
        >
          Select...
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// JSON Output Panel
// ---------------------------------------------------------------------------
const FashionJsonPanel: React.FC<{
  progress: number; // 0..1
}> = ({ progress }) => {
  const lines = [
    `{`,
    `  "project": "SKU_IMAGE_ANNOTATION",`,
    `  "brandName": "Craghoppers",`,
    `  "category": "Fashion (Men's)",`,
    `  "subcategory": "Tops",`,
    `  "caption": "A bright blue pullover...",`,
    `  "bbox": { "x1": 175, "y1": 65,`,
    `            "x2": 366, "y2": 317 },`,
    `  "status": "completed"`,
    `}`,
  ];

  const visibleLines = Math.floor(progress * lines.length);

  return (
    <div
      style={{
        backgroundColor: "rgba(10, 9, 8, 0.95)",
        border: `1px solid ${TOKENS.colors.accent}30`,
        borderRadius: 4,
        padding: "8px 10px",
        fontFamily: TOKENS.fonts.mono,
        fontSize: 9,
        lineHeight: 1.6,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          fontSize: 8,
          color: TOKENS.colors.muted,
          letterSpacing: 1,
          textTransform: "uppercase",
          marginBottom: 6,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>Annotation Output</span>
        <span style={{ color: TOKENS.colors.success }}>
          {progress >= 1 ? "SAVED" : "BUILDING..."}
        </span>
      </div>
      {lines.slice(0, visibleLines).map((line, i) => {
        // Color keys vs values
        const isKey = line.includes('":');
        return (
          <div key={i} style={{ whiteSpace: "pre" }}>
            <span style={{ color: isKey ? TOKENS.bbox.product : TOKENS.colors.accent }}>
              {line}
            </span>
          </div>
        );
      })}
      {progress < 1 && (
        <span style={{ color: TOKENS.colors.accent, opacity: 0.6 }}>_</span>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// FashionAnnotationWorkflow — the full cs-fashion composition
// ---------------------------------------------------------------------------
const FashionAnnotationWorkflow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const timeS = frame / fps;
  const imageSrc = staticFile("remotion-assets/samples/cs-fashion.jpg");

  // Global fade in/out
  const fadeIn = interpolate(frame, [F.IMG_START, F.IMG_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [F.FADE_OUT_START, F.FADE_OUT_END],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const globalOpacity = fadeIn * fadeOut;

  // Phase label
  let phaseLabel = "loading";
  if (frame >= F.FADE_OUT_START) phaseLabel = "complete";
  else if (frame >= F.JSON_START) phaseLabel = "output";
  else if (frame >= F.BRAND_START) phaseLabel = "brand_id";
  else if (frame >= F.CAT_START) phaseLabel = "classification";
  else if (frame >= F.CAPTION_START) phaseLabel = "captioning";
  else if (frame >= F.BBOX_DRAW_START) phaseLabel = "detection";

  // --- Bbox drawing animation ---
  // The bbox grows from top-left corner to full size as annotator drags
  const bboxDrawProgress = interpolate(
    frame,
    [F.BBOX_DRAG_START, F.BBOX_DRAG_END],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const bboxVisible = frame >= F.BBOX_DRAG_START;

  // Current bbox coords (growing from origin)
  const bboxCurrentX2 =
    BBOX_TARGET.x1 + (BBOX_TARGET.x2 - BBOX_TARGET.x1) * bboxDrawProgress;
  const bboxCurrentY2 =
    BBOX_TARGET.y1 + (BBOX_TARGET.y2 - BBOX_TARGET.y1) * bboxDrawProgress;

  // After drag completes, show label
  const bboxLabelOpacity = interpolate(
    frame,
    [F.BBOX_DRAG_END, F.BBOX_SETTLE],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // --- Cursor position ---
  // The cursor moves through different regions across phases:
  // Phase 2: image area (left 60%) — drawing bbox
  // Phase 3: form area — caption input
  // Phase 4: form area — dropdowns
  // Phase 5: form area — brand fields
  // We express cursor as % of the full composition area

  const cursorX = (() => {
    // Image area is 0-60%, form area is 60-100%
    const imgAreaOffset = 0; // left edge of image area
    const formAreaOffset = IMAGE_AREA_PCT;

    if (frame < F.BBOX_DRAW_START) return -10; // offscreen
    if (frame < F.BBOX_CURSOR_ARRIVE) {
      // Cursor enters from left, moves to bbox start position
      return interpolate(
        frame,
        [F.BBOX_DRAW_START, F.BBOX_CURSOR_ARRIVE],
        [-5, imgAreaOffset + BBOX_TARGET.x1 * IMAGE_AREA_PCT],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      );
    }
    if (frame < F.BBOX_DRAG_START) {
      // Hover at start corner
      return imgAreaOffset + BBOX_TARGET.x1 * IMAGE_AREA_PCT;
    }
    if (frame < F.BBOX_DRAG_END) {
      // Drag to bottom-right of bbox
      return interpolate(
        frame,
        [F.BBOX_DRAG_START, F.BBOX_DRAG_END],
        [
          imgAreaOffset + BBOX_TARGET.x1 * IMAGE_AREA_PCT,
          imgAreaOffset + BBOX_TARGET.x2 * IMAGE_AREA_PCT,
        ],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      );
    }
    if (frame < F.CAPTION_START) {
      // Hold at bbox end
      return imgAreaOffset + BBOX_TARGET.x2 * IMAGE_AREA_PCT;
    }
    if (frame < F.CAPTION_TYPE_START) {
      // Move to form area — caption input
      return interpolate(
        frame,
        [F.CAPTION_START, F.CAPTION_TYPE_START],
        [imgAreaOffset + BBOX_TARGET.x2 * IMAGE_AREA_PCT, formAreaOffset + 15],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      );
    }
    if (frame < F.CAT_START) {
      // In caption area
      return formAreaOffset + 15;
    }
    if (frame < F.BRAND_START) {
      // Category area
      return formAreaOffset + 12;
    }
    if (frame < F.JSON_START) {
      // Brand area
      return formAreaOffset + 15;
    }
    // JSON phase — cursor fades out
    return formAreaOffset + 15;
  })();

  const cursorY = (() => {
    if (frame < F.BBOX_DRAW_START) return 50;
    if (frame < F.BBOX_CURSOR_ARRIVE) {
      return interpolate(
        frame,
        [F.BBOX_DRAW_START, F.BBOX_CURSOR_ARRIVE],
        [50, 10 + BBOX_TARGET.y1 * 80],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      );
    }
    if (frame < F.BBOX_DRAG_START) {
      return 10 + BBOX_TARGET.y1 * 80;
    }
    if (frame < F.BBOX_DRAG_END) {
      return interpolate(
        frame,
        [F.BBOX_DRAG_START, F.BBOX_DRAG_END],
        [10 + BBOX_TARGET.y1 * 80, 10 + BBOX_TARGET.y2 * 80],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      );
    }
    if (frame < F.CAPTION_START) {
      return 10 + BBOX_TARGET.y2 * 80;
    }
    if (frame < F.CAPTION_TYPE_START) {
      // Move to caption field (roughly 15% from top of form area)
      return interpolate(
        frame,
        [F.CAPTION_START, F.CAPTION_TYPE_START],
        [10 + BBOX_TARGET.y2 * 80, 18],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      );
    }
    if (frame < F.CAT_START) {
      return 18;
    }
    if (frame < F.CAT_OPEN) {
      // Move to category dropdown
      return interpolate(
        frame,
        [F.CAT_START, F.CAT_OPEN],
        [18, 36],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      );
    }
    if (frame < F.SUBCAT_OPEN) {
      return 36;
    }
    if (frame < F.CAT_END) {
      return interpolate(
        frame,
        [F.SUBCAT_OPEN, F.SUBCAT_OPEN + 4],
        [36, 55],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      );
    }
    if (frame < F.BRAND_TYPE_START) {
      // Move to brand field
      return interpolate(
        frame,
        [F.CAT_END, F.BRAND_TYPE_START],
        [55, 68],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      );
    }
    if (frame < F.URL_TYPE_START) {
      return 68;
    }
    if (frame < F.JSON_START) {
      return interpolate(
        frame,
        [F.URL_TYPE_START, F.URL_TYPE_START + 2],
        [68, 78],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      );
    }
    return 78;
  })();

  // Natural cursor wobble
  const cursorWobbleX = Math.sin(frame * 0.08) * 0.5;
  const cursorWobbleY = Math.cos(frame * 0.06) * 0.4;

  // Cursor visibility
  const cursorOpacity = interpolate(
    frame,
    [F.BBOX_DRAW_START, F.BBOX_DRAW_START + 8, F.JSON_START - 4, F.JSON_START],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Is the cursor clicking? (at drag start, caption click, dropdown clicks)
  const isClicking =
    (frame >= F.BBOX_DRAG_START - 1 && frame <= F.BBOX_DRAG_START + 1) ||
    (frame >= F.CAPTION_TYPE_START - 1 && frame <= F.CAPTION_TYPE_START + 1) ||
    (frame >= F.CAT_SELECT - 1 && frame <= F.CAT_SELECT + 1) ||
    (frame >= F.SUBCAT_SELECT - 1 && frame <= F.SUBCAT_SELECT + 1);

  // --- Form panel visibility ---
  const formPanelOpacity = interpolate(
    frame,
    [F.CAPTION_START - 4, F.CAPTION_START, F.JSON_START - 2, F.JSON_START],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // JSON panel
  const jsonPanelOpacity = interpolate(
    frame,
    [F.JSON_START, F.JSON_START + 10],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const jsonProgress = interpolate(
    frame,
    [F.JSON_START + 8, F.JSON_REVEAL_END],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Phase field opacities (staggered reveal)
  const captionFieldOpacity = interpolate(
    frame,
    [F.CAPTION_START, F.CAPTION_START + 4],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const catFieldOpacity = interpolate(
    frame,
    [F.CAT_START - 2, F.CAT_START + 2],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const brandFieldOpacity = interpolate(
    frame,
    [F.BRAND_START - 2, F.BRAND_START + 2],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Click ripple
  const clickRipple = (() => {
    const clickFrames = [
      F.BBOX_DRAG_START,
      F.CAPTION_TYPE_START,
      F.CAT_SELECT,
      F.SUBCAT_SELECT,
    ];
    for (const cf of clickFrames) {
      if (frame >= cf && frame < cf + 10) {
        return interpolate(frame, [cf, cf + 10], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
      }
    }
    return -1;
  })();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0908",
        fontFamily: TOKENS.fonts.mono,
      }}
    >
      <div style={{ opacity: globalOpacity, width: "100%", height: "100%" }}>
        {/* ================================================================= */}
        {/* LEFT SIDE: Image area (60%) */}
        {/* ================================================================= */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${IMAGE_AREA_PCT}%`,
            height: "100%",
            overflow: "hidden",
          }}
        >
          {/* Product image */}
          <Img
            src={imageSrc}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              transform: `scale(${interpolate(
                frame,
                [F.IMG_START, F.IMG_END + 10],
                [1.05, 1.0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              )})`,
            }}
          />

          {/* Subtle vignette */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at center, transparent 40%, rgba(10,9,8,0.5) 100%)",
            }}
          />

          {/* Project badge — top-left */}
          <div
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              opacity: interpolate(
                frame,
                [F.IMG_END - 10, F.IMG_END],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              ),
            }}
          >
            <div
              style={{
                backgroundColor: TOKENS.colors.panelBg,
                borderRadius: 2,
                padding: "3px 8px",
                fontSize: 8,
                color: TOKENS.colors.muted,
                letterSpacing: 1,
                textTransform: "uppercase",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              SKU_IMAGE_ANNOTATION
            </div>
          </div>

          {/* Bounding box — drawn by cursor */}
          {bboxVisible && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
              }}
            >
              {/* The growing bbox */}
              <div
                style={{
                  position: "absolute",
                  left: `${BBOX_TARGET.x1 * 100}%`,
                  top: `${BBOX_TARGET.y1 * 100}%`,
                  width: `${(bboxCurrentX2 - BBOX_TARGET.x1) * 100}%`,
                  height: `${(bboxCurrentY2 - BBOX_TARGET.y1) * 100}%`,
                  border: `2px solid ${TOKENS.bbox.product}`,
                  borderRadius: 3,
                  boxShadow: `0 0 8px ${TOKENS.bbox.product}40`,
                  opacity: bboxDrawProgress > 0 ? 0.9 : 0,
                }}
              >
                {/* Corner markers — appear once bbox is fully drawn */}
                {bboxDrawProgress >= 1 &&
                  [
                    { left: -2, top: -2 },
                    { right: -2, top: -2 },
                    { left: -2, bottom: -2 },
                    { right: -2, bottom: -2 },
                  ].map((pos, i) => (
                    <div
                      key={i}
                      style={{
                        position: "absolute",
                        ...pos,
                        width: 6,
                        height: 6,
                        backgroundColor: TOKENS.bbox.product,
                        borderRadius: 1,
                        opacity: bboxLabelOpacity,
                      }}
                    />
                  ))}

                {/* Label above bbox */}
                {bboxLabelOpacity > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: -18,
                      left: -1,
                      backgroundColor: TOKENS.bbox.product,
                      color: "#000",
                      fontSize: 9,
                      fontWeight: 700,
                      padding: "1px 5px",
                      borderRadius: "2px 2px 0 0",
                      whiteSpace: "nowrap",
                      letterSpacing: 0.5,
                      opacity: bboxLabelOpacity,
                      display: "flex",
                      gap: 4,
                    }}
                  >
                    <span>product</span>
                    <span style={{ fontWeight: 400, opacity: 0.7 }}>97%</span>
                  </div>
                )}
              </div>

              {/* Crosshair at drag point during drawing */}
              {bboxDrawProgress > 0 && bboxDrawProgress < 1 && (
                <>
                  <div
                    style={{
                      position: "absolute",
                      left: `${bboxCurrentX2 * 100}%`,
                      top: 0,
                      width: 1,
                      height: "100%",
                      backgroundColor: `${TOKENS.bbox.product}30`,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: `${bboxCurrentY2 * 100}%`,
                      left: 0,
                      width: "100%",
                      height: 1,
                      backgroundColor: `${TOKENS.bbox.product}30`,
                    }}
                  />
                </>
              )}
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* Divider line */}
        {/* ================================================================= */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: `${IMAGE_AREA_PCT}%`,
            width: 1,
            height: "100%",
            backgroundColor: "rgba(255,255,255,0.06)",
          }}
        />

        {/* ================================================================= */}
        {/* RIGHT SIDE: Form panel (40%) */}
        {/* ================================================================= */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: `${IMAGE_AREA_PCT}%`,
            width: `${FORM_AREA_PCT}%`,
            height: "100%",
            padding: "10px 12px 40px 12px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Form header */}
          <div
            style={{
              fontSize: 9,
              color: TOKENS.colors.accent,
              letterSpacing: 1,
              textTransform: "uppercase",
              marginBottom: 8,
              paddingBottom: 6,
              borderBottom: `1px solid rgba(255,255,255,0.06)`,
              opacity: interpolate(
                frame,
                [F.CAPTION_START - 6, F.CAPTION_START],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              ),
            }}
          >
            Annotation Panel
          </div>

          {/* Form fields — staggered appearance */}
          <div style={{ opacity: formPanelOpacity, flex: 1 }}>
            {/* Caption field */}
            <FormField label="Caption" opacity={captionFieldOpacity}>
              <FieldTypewriter
                text="A bright blue pullover with a half-zip front and long sleeves"
                startFrame={F.CAPTION_TYPE_START}
                endFrame={F.CAPTION_TYPE_END}
                fontSize={10}
              />
            </FormField>

            {/* Category dropdown */}
            {frame >= F.CAT_START - 2 && (
              <div style={{ opacity: catFieldOpacity }}>
                <DropdownSelect
                  label="Category"
                  options={[
                    "Fashion (Women's)",
                    "Fashion (Men's)",
                    "Accessories",
                    "Footwear",
                  ]}
                  selectedIndex={1}
                  openFrame={F.CAT_OPEN}
                  selectFrame={F.CAT_SELECT}
                />
              </div>
            )}

            {/* Subcategory dropdown */}
            {frame >= F.CAT_SELECT + 4 && (
              <div
                style={{
                  opacity: interpolate(
                    frame,
                    [F.CAT_SELECT + 4, F.CAT_SELECT + 8],
                    [0, 1],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                  ),
                }}
              >
                <DropdownSelect
                  label="Subcategory"
                  options={["Outerwear", "Tops", "Bottoms", "Activewear"]}
                  selectedIndex={1}
                  openFrame={F.SUBCAT_OPEN}
                  selectFrame={F.SUBCAT_SELECT}
                />
              </div>
            )}

            {/* Brand name field */}
            {frame >= F.BRAND_START - 2 && (
              <div style={{ opacity: brandFieldOpacity }}>
                <FormField label="Brand Name">
                  <FieldTypewriter
                    text="Craghoppers"
                    startFrame={F.BRAND_TYPE_START}
                    endFrame={F.BRAND_TYPE_END}
                    fontSize={10}
                  />
                </FormField>
              </div>
            )}

            {/* Brand URL field */}
            {frame >= F.URL_TYPE_START - 2 && (
              <div
                style={{
                  opacity: interpolate(
                    frame,
                    [F.URL_TYPE_START - 2, F.URL_TYPE_START],
                    [0, 1],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                  ),
                }}
              >
                <FormField label="Product URL">
                  <FieldTypewriter
                    text="craghoppers.com/mens/tops/fleece-pullover"
                    startFrame={F.URL_TYPE_START}
                    endFrame={F.URL_TYPE_END}
                    fontSize={9}
                    color={TOKENS.bbox.product}
                  />
                </FormField>
              </div>
            )}
          </div>

          {/* JSON output panel — replaces form */}
          {frame >= F.JSON_START && (
            <div
              style={{
                position: "absolute",
                top: 10,
                left: 12,
                right: 12,
                bottom: 40,
                opacity: jsonPanelOpacity,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <FashionJsonPanel progress={jsonProgress} />

              {/* Completion badge */}
              {jsonProgress >= 1 && (
                <div
                  style={{
                    marginTop: 8,
                    display: "flex",
                    justifyContent: "center",
                    opacity: interpolate(
                      frame,
                      [F.JSON_REVEAL_END, F.JSON_REVEAL_END + 6],
                      [0, 1],
                      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                    ),
                  }}
                >
                  <div
                    style={{
                      backgroundColor: `${TOKENS.colors.success}18`,
                      border: `1px solid ${TOKENS.colors.success}40`,
                      borderRadius: 3,
                      padding: "4px 12px",
                      fontSize: 9,
                      color: TOKENS.colors.success,
                      fontWeight: 600,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    Annotation Complete
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* Animated Cursor — spans full composition */}
        {/* ================================================================= */}
        {cursorOpacity > 0 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              zIndex: 30,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: `${cursorX + cursorWobbleX}%`,
                top: `${cursorY + cursorWobbleY}%`,
                transform: "translate(-2px, -2px)",
                opacity: cursorOpacity,
              }}
            >
              <CursorIcon clicking={isClicking} />
            </div>
            {/* Click ripple */}
            {clickRipple >= 0 && (
              <div
                style={{
                  position: "absolute",
                  left: `${cursorX + cursorWobbleX}%`,
                  top: `${cursorY + cursorWobbleY}%`,
                  width: 24 + clickRipple * 16,
                  height: 24 + clickRipple * 16,
                  borderRadius: "50%",
                  border: `2px solid rgba(255, 255, 255, ${(1 - clickRipple) * 0.5})`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* Overlays */}
        {/* ================================================================= */}
        <TechMetadataOverlay
          codec="h264"
          resolution="500x700"
          fps={30}
          duration={`${(durationInFrames / fps).toFixed(1)}s`}
        />
        <BottomBar timeS={timeS} phaseLabel={phaseLabel} />
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Sub-components for GENERIC (non-fashion) path
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

  // Route cs-object-id to the cross-clip identity view
  if (compositionId === "cs-object-id") {
    return <CrossClipIdentityView />;
  }

  // Route cs-fashion to the dedicated workflow view
  if (compositionId === "cs-fashion") {
    return <FashionAnnotationWorkflow />;
  }

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

  // Video freeze-frame
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
            <AbsoluteFill
              style={{
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              <OffthreadVideo
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
