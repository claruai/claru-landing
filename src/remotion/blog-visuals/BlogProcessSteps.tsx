/**
 * BlogProcessSteps — Numbered step cards sliding in with a top progress line.
 * 10s at 30fps (300 frames), 1280x720.
 * Schema: { steps: string[].max(5) }
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion';
import { z } from 'zod';
import { BG, ACCENT, TEXT, MUTED, BORDER } from './shared/colors';

export const blogProcessStepsSchema = z.object({
  steps: z.array(z.string()).max(5).default([
    'Define task specification with success criteria',
    'Deploy structured data collection with protocol training',
    'Run real-time QA with rejection thresholds',
    'Enrich with semantic annotations and embeddings',
    'Deliver with documentation for policy training',
  ]),
});

type Props = z.infer<typeof blogProcessStepsSchema>;

const BlogProcessSteps: React.FC<Props> = ({ steps }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const visibleSteps = steps.slice(0, 5);
  const STEP_DELAY = 45; // frames between step reveals

  // Progress line fills left to right as steps appear
  // First step at frame 25, last step at frame 25 + (n-1)*45
  const lastStepFrame = 25 + (visibleSteps.length - 1) * STEP_DELAY;
  const progressWidth = interpolate(frame, [25, lastStepFrame + 30], [0, 100], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // Currently animating step index
  const activeStepIdx = visibleSteps.findLastIndex((_, i) => {
    const sf = 25 + i * STEP_DELAY;
    return frame >= sf && frame < sf + STEP_DELAY;
  });

  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: 'JetBrains Mono, monospace', overflow: 'hidden' }}>

      {/* Dot-grid background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `radial-gradient(circle, rgba(146,176,144,0.08) 1px, transparent 1px)`,
        backgroundSize: '32px 32px',
        pointerEvents: 'none',
      }} />

      {/* Subtle left-edge glow */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 200,
        background: 'linear-gradient(to right, rgba(146,176,144,0.04), transparent)',
        pointerEvents: 'none',
      }} />

      {/* Top progress line track */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 3, backgroundColor: BORDER,
      }} />

      {/* Top progress line fill */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        height: 3, width: `${progressWidth}%`,
        backgroundColor: ACCENT,
        boxShadow: `0 0 10px rgba(146,176,144,0.6)`,
      }} />

      {/* Category label top-left */}
      <div style={{
        position: 'absolute', top: 14, left: 32,
        fontSize: 11, color: ACCENT, letterSpacing: '0.18em',
        textTransform: 'uppercase', opacity: headerOpacity,
      }}>
        process
      </div>

      {/* Top-right dot */}
      <div style={{
        position: 'absolute', top: 18, right: 32,
        width: 8, height: 8, borderRadius: '50%',
        backgroundColor: ACCENT, opacity: headerOpacity,
      }} />

      {/* Top border */}
      <div style={{
        position: 'absolute', top: 44, left: 0, right: 0,
        height: 1, backgroundColor: BORDER, opacity: headerOpacity,
      }} />

      {/* Steps */}
      <div style={{
        position: 'absolute', top: 60, left: 60, right: 60, bottom: 60,
        display: 'flex', flexDirection: 'column', gap: 16,
        justifyContent: 'center',
      }}>
        {visibleSteps.map((step, i) => {
          const stepFrame = 25 + i * STEP_DELAY;
          const isActive = i === activeStepIdx;
          const isRevealed = frame >= stepFrame;

          // Card slides in from right
          const slideSpring = spring({
            frame: frame - stepFrame,
            fps,
            config: { damping: 12, stiffness: 80, mass: 0.9 },
          });
          const cardX = interpolate(Math.max(0, slideSpring), [0, 1], [60, 0]);
          const cardOpacity = interpolate(frame, [stepFrame, stepFrame + 15], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          });

          // Step number spring
          const numSpring = spring({
            frame: frame - stepFrame,
            fps,
            config: { damping: 12, stiffness: 80, mass: 0.9 },
          });
          const numScale = Math.max(0, Math.min(numSpring, 1.1));

          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center',
              opacity: isRevealed ? cardOpacity : 0,
              transform: `translateX(${isRevealed ? cardX : 60}px)`,
              position: 'relative',
            }}>
              {/* Step number — large, overlapping left edge of card */}
              <div style={{
                fontSize: 48, fontWeight: 700, color: ACCENT,
                width: 72, flexShrink: 0,
                textAlign: 'right', paddingRight: 20,
                lineHeight: 1,
                transform: `scale(${numScale})`,
                transformOrigin: 'right center',
                opacity: 0.9,
              }}>
                {String(i + 1).padStart(2, '0')}
              </div>

              {/* Card */}
              <div style={{
                flex: 1,
                padding: '18px 24px',
                borderLeft: `3px solid ${isActive ? ACCENT : `${ACCENT}60`}`,
                backgroundColor: isActive ? 'rgba(146,176,144,0.07)' : 'rgba(146,176,144,0.03)',
                maxWidth: 900,
              }}>
                <div style={{
                  fontSize: 17, color: TEXT,
                  lineHeight: 1.6, maxWidth: 900,
                }}>
                  {step}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 44,
        borderTop: `1px solid ${BORDER}`,
        display: 'flex', alignItems: 'center',
        padding: '0 32px', opacity: headerOpacity,
      }}>
        <span style={{ color: MUTED, fontSize: 11, letterSpacing: '0.12em' }}>claru.ai</span>
        <span style={{ marginLeft: 'auto', color: MUTED, fontSize: 11, letterSpacing: '0.08em' }}>physical AI training data</span>
      </div>
    </AbsoluteFill>
  );
};

export default BlogProcessSteps;
