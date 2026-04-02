/**
 * BlogProcessSteps — Numbered step-by-step reveal with build-up animation.
 * 10s at 30fps (300 frames), 1280x720.
 * Schema: { steps: string[].max(5) }
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring } from 'remotion';
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

  const headerOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const visibleSteps = steps.slice(0, 5);
  const framesPerStep = 40;

  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: 'JetBrains Mono, monospace', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 44,
        borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center',
        padding: '0 32px', opacity: headerOpacity,
      }}>
        <span style={{ color: ACCENT, fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          claru / process
        </span>
        <div style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', backgroundColor: ACCENT }} />
      </div>

      {/* Steps */}
      <div style={{ position: 'absolute', top: 70, left: 60, right: 60, bottom: 60 }}>
        {visibleSteps.map((step, i) => {
          const stepFrame = 25 + i * framesPerStep;
          const stepOpacity = interpolate(frame, [stepFrame, stepFrame + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const stepX = interpolate(frame, [stepFrame, stepFrame + 20], [-30, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const numScale = spring({ frame: frame - stepFrame, fps: 30, config: { damping: 14, stiffness: 120 } });
          const isActive = frame >= stepFrame + 10 && frame < stepFrame + framesPerStep + 10;

          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start',
              marginBottom: 28, opacity: stepOpacity,
              transform: `translateX(${stepX}px)`,
            }}>
              {/* Step number */}
              <div style={{
                width: 44, height: 44, borderRadius: 4,
                border: `1.5px solid ${isActive ? ACCENT : BORDER}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginRight: 24, flexShrink: 0,
                transform: `scale(${Math.max(0, numScale)})`,
                backgroundColor: isActive ? `${ACCENT}15` : 'transparent',
                transition: 'border-color 0.3s, background-color 0.3s',
              }}>
                <span style={{ color: ACCENT, fontSize: 16, fontWeight: 700 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Step text */}
              <div style={{
                fontSize: 17, color: TEXT, lineHeight: 1.6,
                paddingTop: 10, maxWidth: 1000,
              }}>
                {step}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 44,
        borderTop: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center',
        padding: '0 32px', opacity: headerOpacity,
      }}>
        <span style={{ color: MUTED, fontSize: 11, letterSpacing: '0.12em' }}>claru.ai</span>
        <span style={{ marginLeft: 'auto', color: MUTED, fontSize: 11 }}>physical AI training data</span>
      </div>
    </AbsoluteFill>
  );
};

export default BlogProcessSteps;
