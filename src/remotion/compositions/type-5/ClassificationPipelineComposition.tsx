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
import { TaxonomyTree, TaxonomyLevel } from "../../shared/TaxonomyTree";
import { TechMetadataOverlay } from "../../shared/TechMetadataOverlay";
import { BottomBar } from "../../shared/BottomBar";
import { VerdictBadge } from "../../shared/VerdictBadge";
import { TerminalHeader } from "../../shared/TerminalHeader";
import { getType5Annotation, TaxonomyPath } from "./types";

// ---------------------------------------------------------------------------
// ClassificationPipelineComposition — Type 5
// Video left (60%), taxonomy tree right (40%)
// Dual taxonomy for video classification, game catalog for game capture
// ---------------------------------------------------------------------------

export interface ClassificationPipelineCompositionProps {
  compositionId: string;
}

// ---------------------------------------------------------------------------
// Timeline constants (frames at 30fps)
// ---------------------------------------------------------------------------
const T = {
  FADE_IN_START: 0,
  FADE_IN_END: 30,
  TREE1_START: 30,
  TREE1_END: 90,
  TREE2_START: 90,
  TREE2_END: 180,
  CAPTION_START: 180,
  PIPELINE_START: 200,
  CAPTION_END: 270,
  HOLD_START: 270,
} as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Convert a TaxonomyPath into TaxonomyLevel[] for the shared TaxonomyTree. */
function taxonomyPathToLevels(path: TaxonomyPath): TaxonomyLevel[] {
  // Build a nested hierarchy: root -> level[0] -> level[1] -> ...
  const buildNested = (levels: string[], idx: number): TaxonomyLevel[] => {
    if (idx >= levels.length) return [];
    return [
      {
        label: levels[idx],
        children: idx < levels.length - 1 ? buildNested(levels, idx + 1) : undefined,
      },
    ];
  };

  return [
    {
      label: path.root,
      children: buildNested(path.levels, 0),
    },
  ];
}

/**
 * Build a game catalog TaxonomyLevel[] that fans out at the second level
 * (showing all 25 games) before narrowing to the selected game.
 */
function buildGameCatalogLevels(
  path: TaxonomyPath,
  catalog: string[],
  selectedGame: string,
): TaxonomyLevel[] {
  // Root -> Genre (level[0]) -> all 25 games fan out, selected one is last child with leaf highlight
  const genre = path.levels[0] ?? "Unknown Genre";

  const gameChildren: TaxonomyLevel[] = catalog.map((game) => ({
    label: game,
    children: game === selectedGame ? [{ label: "\u2713 Selected" }] : undefined,
  }));

  return [
    {
      label: path.root,
      children: [
        {
          label: genre,
          children: gameChildren,
        },
      ],
    },
  ];
}

/** Check if video file exists by composition ID, with fallback to image. */
function getMediaPath(compositionId: string): {
  type: "video" | "image" | "none";
  src: string;
} {
  // Try video first, then image
  const videoExts = ["mp4", "webm"];
  const imageExts = ["jpg", "png", "webp"];

  for (const ext of videoExts) {
    try {
      const src = staticFile(`remotion-assets/samples/${compositionId}.${ext}`);
      return { type: "video", src };
    } catch {
      // continue
    }
  }
  for (const ext of imageExts) {
    try {
      const src = staticFile(`remotion-assets/samples/${compositionId}.${ext}`);
      return { type: "image", src };
    } catch {
      // continue
    }
  }
  return { type: "none", src: "" };
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Typewriter caption text */
const CaptionTypewriter: React.FC<{
  text: string;
  startFrame: number;
  endFrame: number;
}> = ({ text, startFrame, endFrame }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [startFrame, endFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const visibleChars = Math.floor(progress * text.length);
  const displayText = text.slice(0, visibleChars);
  const showCursor = frame >= startFrame && frame <= endFrame + 15;

  return (
    <div
      style={{
        fontFamily: TOKENS.fonts.mono,
        fontSize: 10,
        color: TOKENS.colors.text,
        lineHeight: 1.5,
        padding: "8px 12px",
        opacity: interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      <span style={{ color: TOKENS.colors.muted, fontSize: 9 }}>
        caption:{" "}
      </span>
      <span>{displayText}</span>
      {showCursor && (
        <span
          style={{
            color: TOKENS.colors.accent,
            opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0,
          }}
        >
          |
        </span>
      )}
    </div>
  );
};

/** Animated pipeline stages bar */
const PipelineStages: React.FC<{
  stages: Array<{ label: string; status: string }>;
  startFrame: number;
}> = ({ stages, startFrame }) => {
  const frame = useCurrentFrame();
  const containerOpacity = interpolate(
    frame,
    [startFrame, startFrame + 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        padding: "6px 12px",
        opacity: containerOpacity,
      }}
    >
      <span
        style={{
          fontFamily: TOKENS.fonts.mono,
          fontSize: 8,
          color: TOKENS.colors.muted,
          textTransform: "uppercase",
          letterSpacing: 1,
          marginRight: 4,
        }}
      >
        Pipeline
      </span>
      {stages.map((stage, i) => {
        const stageStart = startFrame + i * 18;
        const stageProgress = interpolate(
          frame,
          [stageStart, stageStart + 15],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        const isLast = i === stages.length - 1;
        const isActive = stageProgress > 0 && stageProgress < 1;
        const isComplete = stageProgress >= 1;

        const stageColor = isComplete
          ? TOKENS.colors.success
          : isActive
            ? TOKENS.colors.accent
            : TOKENS.colors.muted;

        return (
          <React.Fragment key={stage.label}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                opacity: stageProgress,
                transform: `translateX(${(1 - stageProgress) * 8}px)`,
              }}
            >
              {/* Stage dot */}
              <div
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  backgroundColor: stageColor,
                  boxShadow: isComplete ? `0 0 4px ${stageColor}60` : undefined,
                }}
              />
              <span
                style={{
                  fontFamily: TOKENS.fonts.mono,
                  fontSize: 8,
                  color: stageColor,
                  whiteSpace: "nowrap",
                }}
              >
                {stage.label}
              </span>
              {isComplete && (
                <span style={{ fontSize: 8, color: TOKENS.colors.success }}>
                  {"\u2713"}
                </span>
              )}
            </div>
            {/* Arrow connector */}
            {!isLast && (
              <span
                style={{
                  fontFamily: TOKENS.fonts.mono,
                  fontSize: 8,
                  color: TOKENS.colors.muted,
                  opacity: stageProgress * 0.5,
                }}
              >
                {"\u2192"}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

/** Placeholder video area when no media sample exists */
const VideoPlaceholder: React.FC<{ compositionId: string }> = ({
  compositionId,
}) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#0d0c0a",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div
        style={{
          fontFamily: TOKENS.fonts.mono,
          fontSize: 11,
          color: TOKENS.colors.muted,
          textTransform: "uppercase",
          letterSpacing: 2,
        }}
      >
        Classification Pipeline
      </div>
      <div
        style={{
          fontFamily: TOKENS.fonts.mono,
          fontSize: 18,
          color: TOKENS.colors.accent,
          fontWeight: 600,
        }}
      >
        {compositionId}
      </div>
      <div
        style={{
          width: 40,
          height: 1,
          backgroundColor: TOKENS.colors.accent,
          opacity: 0.3,
          marginTop: 4,
        }}
      />
      <div
        style={{
          fontFamily: TOKENS.fonts.mono,
          fontSize: 9,
          color: TOKENS.colors.muted,
        }}
      >
        Video sample pending extraction
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main Composition
// ---------------------------------------------------------------------------

const ClassificationPipelineComposition: React.FC<
  ClassificationPipelineCompositionProps
> = ({ compositionId }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const timeS = frame / fps;

  const annotation = getType5Annotation(compositionId);
  const isDual = annotation.taxonomies.length > 1;
  const isGameComposition = !!annotation.gameCatalog && !!annotation.gameTitle;

  // --- Media ---
  const media = getMediaPath(compositionId);

  // --- Fade in ---
  const fadeIn = interpolate(
    frame,
    [T.FADE_IN_START, T.FADE_IN_END],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // --- Tree 1 active depth ---
  const tree1Path = annotation.taxonomies[0];
  const tree1MaxDepth = tree1Path ? tree1Path.levels.length : 0;

  // For game compositions with catalog, we need extra depth for fan-out
  const tree1EffectiveMaxDepth = isGameComposition
    ? tree1MaxDepth + 1 // extra depth for "Selected" leaf
    : tree1MaxDepth;

  const tree1ActiveDepth = Math.floor(
    interpolate(frame, [T.TREE1_START, T.TREE1_END], [0, tree1EffectiveMaxDepth], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

  // --- Tree 2 active depth (only for dual taxonomy) ---
  const tree2Path = isDual ? annotation.taxonomies[1] : undefined;
  const tree2MaxDepth = tree2Path ? tree2Path.levels.length : 0;
  const tree2ActiveDepth = isDual
    ? Math.floor(
        interpolate(frame, [T.TREE2_START, T.TREE2_END], [0, tree2MaxDepth], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      )
    : 0;

  // --- Build taxonomy levels ---
  const tree1Levels: TaxonomyLevel[] = tree1Path
    ? isGameComposition && annotation.gameCatalog && annotation.gameTitle
      ? buildGameCatalogLevels(tree1Path, annotation.gameCatalog, annotation.gameTitle)
      : taxonomyPathToLevels(tree1Path)
    : [];

  const tree2Levels: TaxonomyLevel[] = tree2Path
    ? taxonomyPathToLevels(tree2Path)
    : [];

  // --- Pipeline phase label ---
  const stageIdx = Math.floor(
    interpolate(
      frame,
      [T.PIPELINE_START, T.CAPTION_END],
      [0, annotation.pipelineStages.length - 0.01],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    ),
  );
  const currentPhase =
    frame >= T.PIPELINE_START
      ? annotation.pipelineStages[Math.min(stageIdx, annotation.pipelineStages.length - 1)]?.label ?? "Classification"
      : "Classification";

  // --- Final hold fade ---
  const holdEnd = durationInFrames;
  const holdFade = interpolate(
    frame,
    [holdEnd - 20, holdEnd],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Tree 2 panel entrance
  const tree2Opacity = isDual
    ? interpolate(frame, [T.TREE2_START, T.TREE2_START + 15], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0908",
        fontFamily: TOKENS.fonts.mono,
        opacity: fadeIn * holdFade,
      }}
    >
      {/* Main layout: Video (60%) | Taxonomy (40%) */}
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
        }}
      >
        {/* --- Left: Video area (60%) --- */}
        <div
          style={{
            width: "60%",
            height: "100%",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Video / Image / Placeholder */}
          {media.type === "video" ? (
            <Video
              src={media.src}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : media.type === "image" ? (
            <Img
              src={media.src}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <VideoPlaceholder compositionId={compositionId} />
          )}

          {/* Vignette overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, transparent 70%, rgba(10,9,8,0.6) 95%)",
              pointerEvents: "none",
            }}
          />

          {/* Caption typewriter below video */}
          <div
            style={{
              position: "absolute",
              bottom: 36,
              left: 0,
              right: 0,
              backgroundColor: "rgba(10, 9, 8, 0.75)",
              maxHeight: 60,
              overflow: "hidden",
            }}
          >
            <CaptionTypewriter
              text={annotation.caption}
              startFrame={T.CAPTION_START}
              endFrame={T.CAPTION_END}
            />
          </div>

          {/* Tech metadata overlay */}
          <TechMetadataOverlay
            codec="h264"
            resolution="1280x720"
            fps={fps}
            duration={`${(durationInFrames / fps).toFixed(0)}s`}
          />
        </div>

        {/* --- Right: Taxonomy panel (40%) --- */}
        <div
          style={{
            width: "40%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: TOKENS.colors.panelBg,
            borderLeft: `1px solid ${TOKENS.colors.accent}20`,
            overflow: "hidden",
          }}
        >
          {/* Terminal header */}
          <TerminalHeader
            title="classification-pipeline"
            statusLabel={currentPhase}
            statusColor={
              frame >= T.PIPELINE_START + 60
                ? TOKENS.colors.success
                : TOKENS.colors.accent
            }
          />

          {/* Taxonomy trees */}
          <div
            style={{
              flex: 1,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Tree 1 label */}
            {tree1Path && (
              <div style={{ padding: "8px 16px 0" }}>
                <span
                  style={{
                    fontFamily: TOKENS.fonts.mono,
                    fontSize: 9,
                    color: TOKENS.colors.muted,
                    textTransform: "uppercase",
                    letterSpacing: 1.5,
                  }}
                >
                  {isDual ? "Taxonomy 1 -- Content" : isGameComposition ? "Game Taxonomy" : "Taxonomy"}
                </span>
              </div>
            )}

            {/* Tree 1 */}
            {tree1Levels.length > 0 && (
              <TaxonomyTree
                levels={tree1Levels}
                activeDepth={tree1ActiveDepth}
                animateFrom={T.TREE1_START}
                framesPerLevel={12}
              />
            )}

            {/* Divider between trees */}
            {isDual && (
              <div
                style={{
                  height: 1,
                  backgroundColor: `${TOKENS.colors.accent}20`,
                  margin: "4px 16px",
                  opacity: tree2Opacity,
                }}
              />
            )}

            {/* Tree 2 label */}
            {isDual && tree2Path && (
              <div
                style={{
                  padding: "4px 16px 0",
                  opacity: tree2Opacity,
                }}
              >
                <span
                  style={{
                    fontFamily: TOKENS.fonts.mono,
                    fontSize: 9,
                    color: TOKENS.colors.muted,
                    textTransform: "uppercase",
                    letterSpacing: 1.5,
                  }}
                >
                  Taxonomy 2 -- Visual Style
                </span>
              </div>
            )}

            {/* Tree 2 */}
            {isDual && tree2Levels.length > 0 && (
              <div style={{ opacity: tree2Opacity }}>
                <TaxonomyTree
                  levels={tree2Levels}
                  activeDepth={tree2ActiveDepth}
                  animateFrom={T.TREE2_START}
                  framesPerLevel={15}
                />
              </div>
            )}
          </div>

          {/* Pipeline stages at bottom of right panel */}
          <div
            style={{
              borderTop: `1px solid ${TOKENS.colors.accent}20`,
            }}
          >
            <PipelineStages
              stages={annotation.pipelineStages}
              startFrame={T.PIPELINE_START}
            />
          </div>

          {/* Verdict badge */}
          <div
            style={{
              padding: "4px 12px 8px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <VerdictBadge
              verdict="APPROVED"
              color={TOKENS.colors.success}
              variant="badge"
              animationStyle="glow"
              animateFrom={T.CAPTION_END - 10}
              animationDuration={20}
            />
          </div>
        </div>
      </div>

      {/* Bottom bar spans full width */}
      <BottomBar
        timeS={timeS}
        phaseLabel={currentPhase}
        opacity={interpolate(frame, [T.FADE_IN_END, T.FADE_IN_END + 10], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
      />
    </AbsoluteFill>
  );
};

export default ClassificationPipelineComposition;
