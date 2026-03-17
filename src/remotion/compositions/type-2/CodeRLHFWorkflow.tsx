import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TOKENS } from "../../shared/DesignTokens";
import { BottomBar } from "../../shared/BottomBar";
import { TechMetadataOverlay } from "../../shared/TechMetadataOverlay";

// ---------------------------------------------------------------------------
// CodeRLHFWorkflow — Expert RLHF annotation for code/reasoning tasks
//
// Timeline (360 frames @ 30fps = 12s):
//   Phase 1 (0-40):     Prompt question types out
//   Phase 2 (40-120):   Response A code block types in (verbose solution)
//   Phase 3 (80-160):   Response B code block types in (elegant solution)
//   Phase 4 (160-210):  Cursor evaluates, sweeps between panels
//   Phase 5 (210-240):  Selection — Response B chosen, A dims
//   Phase 6 (240-290):  Rating dimensions animate in
//   Phase 7 (290-360):  JSON annotation output slides in
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Code content
// ---------------------------------------------------------------------------

const PROMPT_TEXT =
  "Write a function to find the longest palindromic substring";

const CODE_A_LINES = [
  "def longest_palindrome(s: str) -> str:",
  "    if len(s) < 2:",
  "        return s",
  "    result = s[0]",
  "    for i in range(len(s)):",
  "        for j in range(i + 1, len(s) + 1):",
  "            sub = s[i:j]",
  "            if sub == sub[::-1]:",
  "                if len(sub) > len(result):",
  "                    result = sub",
  "    return result",
  "",
  "# O(n^3) time, O(n) space",
];

const CODE_B_LINES = [
  "def longest_palindrome(s: str) -> str:",
  "    def expand(l: int, r: int) -> str:",
  "        while l >= 0 and r < len(s) \\",
  "              and s[l] == s[r]:",
  "            l -= 1; r += 1",
  "        return s[l+1:r]",
  "",
  "    result = ''",
  "    for i in range(len(s)):",
  "        odd = expand(i, i)",
  "        even = expand(i, i + 1)",
  "        result = max(result, odd,",
  "                     even, key=len)",
  "    return result",
  "",
  "# O(n^2) time, O(1) space",
];

const RATINGS = [
  { label: "Code Correctness", value: 9 },
  { label: "Efficiency", value: 8 },
  { label: "Readability", value: 9 },
  { label: "Following Instructions", value: 10 },
];

const JSON_LINES = [
  `{`,
  `  "task": "EXPERT_RLHF_CODE_ANNOTATION",`,
  `  "domain": "algorithms",`,
  `  "prompt": "longest palindromic substring",`,
  `  "preferred": "Response B",`,
  `  "correctness": 9,`,
  `  "efficiency": 8,`,
  `  "readability": 9,`,
  `  "instruction_following": 10,`,
  `  "annotator": "expert_swe_l5",`,
  `  "status": "completed"`,
  `}`,
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Terminal-style code block with line-by-line typewriter */
const CodeBlock: React.FC<{
  lines: string[];
  label: string;
  startFrame: number;
  isWinner: boolean;
  isDimmed: boolean;
  isSelected: boolean;
  selectionOpacity: number;
  style?: React.CSSProperties;
}> = ({
  lines,
  label,
  startFrame,
  isWinner,
  isDimmed,
  isSelected,
  selectionOpacity,
  style,
}) => {
  const frame = useCurrentFrame();

  // Each line appears ~5 frames apart
  const elapsed = Math.max(0, frame - startFrame);
  const visibleLines = Math.min(lines.length, Math.floor(elapsed / 5));

  const borderColor = isWinner && isSelected
    ? `rgba(146, 176, 144, ${selectionOpacity * 0.8})`
    : "rgba(255, 255, 255, 0.08)";

  const dimOverlay = isDimmed
    ? interpolate(selectionOpacity, [0, 1], [0, 0.4])
    : 0;

  return (
    <div
      style={{
        position: "relative",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "rgba(15, 14, 13, 0.95)",
        border: `1px solid ${borderColor}`,
        borderRadius: 4,
        overflow: "hidden",
        transition: "border-color 0.3s",
        ...style,
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 12px",
          backgroundColor: "rgba(255, 255, 255, 0.03)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
        }}
      >
        <span
          style={{
            fontFamily: TOKENS.fonts.mono,
            fontSize: 10,
            color: isWinner && isSelected ? TOKENS.colors.accent : TOKENS.colors.muted,
            fontWeight: 600,
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: TOKENS.fonts.mono,
            fontSize: 9,
            color: "#444",
          }}
        >
          python
        </span>
      </div>

      {/* Code content */}
      <div
        style={{
          flex: 1,
          padding: "10px 12px",
          fontFamily: TOKENS.fonts.mono,
          fontSize: 11,
          lineHeight: 1.65,
          color: TOKENS.colors.text,
          overflowY: "hidden",
        }}
      >
        {lines.slice(0, visibleLines).map((line, i) => (
          <div key={i} style={{ display: "flex", gap: 12 }}>
            <span
              style={{
                color: "#333",
                fontSize: 9,
                width: 18,
                textAlign: "right",
                flexShrink: 0,
                userSelect: "none",
              }}
            >
              {i + 1}
            </span>
            <span>
              {colorizeCode(line)}
            </span>
          </div>
        ))}
        {/* Blinking cursor at end of typing */}
        {visibleLines > 0 && visibleLines < lines.length && (
          <span
            style={{
              color: TOKENS.colors.accent,
              opacity: Math.sin(frame * 0.4) > 0 ? 1 : 0,
              marginLeft: 30,
            }}
          >
            _
          </span>
        )}
      </div>

      {/* Dim overlay */}
      {dimOverlay > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: `rgba(0, 0, 0, ${dimOverlay})`,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Selected badge */}
      {isSelected && isWinner && (
        <div
          style={{
            position: "absolute",
            bottom: 8,
            right: 8,
            padding: "3px 10px",
            backgroundColor: `${TOKENS.colors.accent}20`,
            border: `1px solid ${TOKENS.colors.accent}60`,
            borderRadius: 3,
            fontSize: 10,
            fontWeight: 600,
            fontFamily: TOKENS.fonts.mono,
            color: TOKENS.colors.accent,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            opacity: selectionOpacity,
          }}
        >
          Preferred
        </div>
      )}

      {/* Winner glow */}
      {isWinner && isSelected && selectionOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            boxShadow: `inset 0 0 ${16 * selectionOpacity}px ${TOKENS.colors.accent}30`,
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
};

/** Simple Python syntax colorizer */
function colorizeCode(line: string): React.ReactNode {
  // Keywords
  const keywords = /\b(def|return|if|for|in|range|len|while|and|max)\b/g;
  // Strings
  const strings = /(["'])(?:(?=(\\?))\2.)*?\1/g;
  // Comments
  if (line.trimStart().startsWith("#")) {
    return <span style={{ color: "#555", fontStyle: "italic" }}>{line}</span>;
  }

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  const combined = new RegExp(`(${keywords.source})|(${strings.source})`, "g");
  let match: RegExpExecArray | null;

  const lineStr = line;
  // eslint-disable-next-line no-cond-assign
  while ((match = combined.exec(lineStr)) !== null) {
    if (match.index > lastIndex) {
      parts.push(lineStr.slice(lastIndex, match.index));
    }
    const text = match[0];
    if (/^(def|return|if|for|in|range|len|while|and|max)$/.test(text)) {
      parts.push(
        <span key={match.index} style={{ color: "#c084fc" }}>
          {text}
        </span>
      );
    } else {
      parts.push(
        <span key={match.index} style={{ color: "#92B090" }}>
          {text}
        </span>
      );
    }
    lastIndex = match.index + text.length;
  }
  if (lastIndex < lineStr.length) {
    parts.push(lineStr.slice(lastIndex));
  }

  return <>{parts}</>;
}

/** Rating dimension row with animated bar */
const RatingRow: React.FC<{
  label: string;
  value: number;
  startFrame: number;
  index: number;
}> = ({ label, value, startFrame, index }) => {
  const frame = useCurrentFrame();
  const myStart = startFrame + index * 8;

  const opacity = interpolate(frame, [myStart, myStart + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const barWidth = interpolate(frame, [myStart, myStart + 20], [0, value * 10], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const counterValue = interpolate(frame, [myStart, myStart + 15], [0, value], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        opacity,
        fontFamily: TOKENS.fonts.mono,
      }}
    >
      <span
        style={{
          fontSize: 10,
          color: TOKENS.colors.muted,
          width: 140,
          textAlign: "right",
        }}
      >
        {label}
      </span>
      <div
        style={{
          flex: 1,
          height: 6,
          backgroundColor: "rgba(255, 255, 255, 0.06)",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${barWidth}%`,
            backgroundColor: TOKENS.colors.accent,
            borderRadius: 3,
            opacity: 0.8,
          }}
        />
      </div>
      <span
        style={{
          fontSize: 11,
          color: TOKENS.colors.accent,
          fontWeight: 600,
          width: 36,
        }}
      >
        {Math.round(counterValue)}/10
      </span>
    </div>
  );
};

/** JSON output panel */
const JsonPanel: React.FC<{
  slideIn: number;
  progress: number;
}> = ({ slideIn, progress }) => {
  const frame = useCurrentFrame();
  const visibleLines = Math.floor(progress * JSON_LINES.length);

  return (
    <div
      style={{
        position: "absolute",
        top: 60,
        right: 0,
        bottom: 32,
        width: "34%",
        backgroundColor: "rgba(10, 9, 8, 0.95)",
        borderLeft: `1px solid ${TOKENS.colors.accent}30`,
        padding: "14px 12px",
        transform: `translateX(${(1 - slideIn) * 100}%)`,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        zIndex: 25,
      }}
    >
      <div
        style={{
          fontFamily: TOKENS.fonts.mono,
          fontSize: 9,
          color: TOKENS.colors.muted,
          letterSpacing: 1,
          marginBottom: 6,
          textTransform: "uppercase",
        }}
      >
        annotation output
      </div>
      <div
        style={{
          fontFamily: TOKENS.fonts.mono,
          fontSize: 10.5,
          lineHeight: 1.7,
          color: TOKENS.colors.text,
        }}
      >
        {JSON_LINES.slice(0, visibleLines).map((line, i) => (
          <div key={i}>
            {line.includes(":") ? (
              <>
                <span style={{ color: TOKENS.colors.muted }}>
                  {line.split(":")[0]}:
                </span>
                <span style={{ color: TOKENS.colors.accent }}>
                  {line.split(":").slice(1).join(":")}
                </span>
              </>
            ) : (
              <span style={{ color: TOKENS.colors.muted }}>{line}</span>
            )}
          </div>
        ))}
        {visibleLines < JSON_LINES.length && visibleLines > 0 && (
          <span
            style={{
              color: TOKENS.colors.accent,
              opacity: Math.sin(frame * 0.4) > 0 ? 1 : 0,
            }}
          >
            _
          </span>
        )}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Cursor SVG
// ---------------------------------------------------------------------------
const CursorIcon: React.FC<{ clicking?: boolean }> = ({ clicking }) => (
  <svg
    width="24"
    height="28"
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
// Main Component
// ---------------------------------------------------------------------------

const CodeRLHFWorkflow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const timeS = frame / fps;

  // --- Phase timings ---
  const setupFade = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Prompt typewriter (0-40)
  const promptProgress = interpolate(frame, [5, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const promptChars = Math.floor(promptProgress * PROMPT_TEXT.length);

  // Selection phase (210-240)
  const selectionProgress = interpolate(frame, [210, 240], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Cursor animation
  const cursorVisible = frame >= 160 && frame < 240;
  const cursorX: number = (() => {
    if (frame < 160) return 50;
    if (frame < 190) {
      // Sweep between panels
      const t = (frame - 160) / 30;
      const sineVal = Math.sin(t * Math.PI * 2);
      return interpolate(sineVal, [-1, 1], [25, 75]);
    }
    // Move to B (right side) — settle from midpoint
    return interpolate(frame, [190, 210], [50, 75], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
  })();
  const finalCursorX = cursorX;

  const cursorY = 50 + Math.sin(frame * 0.08) * 3;
  const isClicking = frame >= 208 && frame <= 215;

  // JSON panel (290-360)
  const jsonSlideIn = interpolate(frame, [290, 315], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const jsonProgress = interpolate(frame, [315, 355], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Content area shrinks when JSON panel slides in
  const contentRightPct = interpolate(jsonSlideIn, [0, 1], [0, 34]);

  // Phase label
  let phaseLabel = "Reading Prompt";
  if (frame < 40) phaseLabel = "Reading Prompt";
  else if (frame < 160) phaseLabel = "Reviewing Responses";
  else if (frame < 210) phaseLabel = "Evaluating";
  else if (frame < 240) phaseLabel = "Selecting Preferred";
  else if (frame < 290) phaseLabel = "Rating Dimensions";
  else phaseLabel = "Annotation Output";

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0908",
        fontFamily: TOKENS.fonts.mono,
      }}
    >
      {/* --- Header: prompt question --- */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: `${contentRightPct}%`,
          height: 60,
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          backgroundColor: "rgba(10, 9, 8, 0.9)",
          borderBottom: `1px solid ${TOKENS.colors.accent}15`,
          opacity: setupFade,
          zIndex: 20,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span
            style={{
              fontSize: 9,
              color: TOKENS.colors.muted,
              letterSpacing: 1.5,
              textTransform: "uppercase",
            }}
          >
            Expert RLHF Annotation &mdash; Code Domain
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                color: TOKENS.colors.accent,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              $
            </span>
            <span style={{ fontSize: 12, color: TOKENS.colors.text }}>
              {PROMPT_TEXT.slice(0, promptChars)}
              {promptChars < PROMPT_TEXT.length && (
                <span
                  style={{
                    color: TOKENS.colors.accent,
                    opacity: Math.sin(frame * 0.4) > 0 ? 1 : 0,
                  }}
                >
                  |
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* --- Code panels area --- */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 0,
          right: `${contentRightPct}%`,
          bottom: frame >= 240 && frame < 290 ? 120 : 32,
          display: "flex",
          gap: 8,
          padding: "8px 12px",
          opacity: setupFade,
        }}
      >
        <CodeBlock
          lines={CODE_A_LINES}
          label="Response A"
          startFrame={40}
          isWinner={false}
          isDimmed={selectionProgress > 0}
          isSelected={false}
          selectionOpacity={selectionProgress}
        />
        <CodeBlock
          lines={CODE_B_LINES}
          label="Response B"
          startFrame={80}
          isWinner={true}
          isDimmed={false}
          isSelected={selectionProgress > 0}
          selectionOpacity={selectionProgress}
        />
      </div>

      {/* --- VS divider --- */}
      <div
        style={{
          position: "absolute",
          top: 60,
          bottom: 32,
          left: `${(100 - contentRightPct) / 2}%`,
          width: 1,
          backgroundColor: `rgba(255, 255, 255, ${0.08 * setupFade})`,
          zIndex: 10,
          transform: "translateX(-50%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "2px 8px",
            backgroundColor: "rgba(10, 9, 8, 0.85)",
            borderRadius: 3,
            border: "1px solid rgba(255,255,255,0.06)",
            fontSize: 9,
            color: TOKENS.colors.muted,
            whiteSpace: "nowrap",
          }}
        >
          VS
        </div>
      </div>

      {/* --- Animated cursor --- */}
      {cursorVisible && (
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 0,
            right: `${contentRightPct}%`,
            bottom: 32,
            pointerEvents: "none",
            zIndex: 30,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: `${finalCursorX}%`,
              top: `${cursorY}%`,
              transform: "translate(-2px, -2px)",
              opacity: interpolate(
                frame,
                [160, 168, 230, 240],
                [0, 1, 1, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              ),
            }}
          >
            <CursorIcon clicking={isClicking} />
          </div>
        </div>
      )}

      {/* --- Rating dimensions (240-290) --- */}
      {frame >= 238 && frame < 310 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: `${contentRightPct}%`,
            bottom: 36,
            padding: "10px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 6,
            backgroundColor: "rgba(10, 9, 8, 0.92)",
            borderTop: `1px solid ${TOKENS.colors.accent}15`,
            zIndex: 15,
          }}
        >
          <span
            style={{
              fontSize: 9,
              color: TOKENS.colors.muted,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              marginBottom: 2,
            }}
          >
            Rating Dimensions &mdash; Response B
          </span>
          {RATINGS.map((r, i) => (
            <RatingRow
              key={r.label}
              label={r.label}
              value={r.value}
              startFrame={242}
              index={i}
            />
          ))}
        </div>
      )}

      {/* --- JSON Output panel (290-360) --- */}
      {frame >= 285 && (
        <JsonPanel slideIn={jsonSlideIn} progress={jsonProgress} />
      )}

      {/* Tech metadata overlay */}
      <TechMetadataOverlay
        codec="h264"
        resolution="1280x720"
        fps={fps}
        duration={`${(durationInFrames / fps).toFixed(0)}s`}
      />

      {/* Bottom bar */}
      <BottomBar
        timeS={timeS}
        phaseLabel={phaseLabel}
        opacity={setupFade}
        rightInset={frame >= 290 ? jsonSlideIn * 34 * 12.8 : 0}
      />
    </AbsoluteFill>
  );
};

export default CodeRLHFWorkflow;
