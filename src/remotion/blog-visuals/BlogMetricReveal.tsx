/**
 * BlogMetricReveal — Before → After metric with dramatic cross-fade.
 * 8s at 30fps (240 frames), 1280x720.
 * Schema: { before, after, metric }
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { z } from 'zod';
import { BG, ACCENT, TEXT, MUTED, BORDER } from './shared/colors';

export const blogMetricRevealSchema = z.object({
  before: z.string().default('40% rejection rate'),
  after: z.string().default('< 8% rejection rate'),
  metric: z.string().default('with structured collection protocols'),
});

type Props = z.infer<typeof blogMetricRevealSchema>;

const BlogMetricReveal: React.FC<Props> = ({ before, after, metric }) => {
  const frame = useCurrentFrame();

  const headerOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const beforeOpacity = interpolate(frame, [10, 35], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const arrowOpacity = interpolate(frame, [60, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Before fades out, after fades in
  const beforeFadeOut = interpolate(frame, [90, 130], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const afterOpacity = interpolate(frame, [110, 150], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const afterScale = interpolate(frame, [110, 150], [0.85, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const metricOpacity = interpolate(frame, [155, 175], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const showAfter = frame > 100;

  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: 'JetBrains Mono, monospace', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 44,
        borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center',
        padding: '0 32px', opacity: headerOpacity,
      }}>
        <span style={{ color: ACCENT, fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          claru / metric-reveal
        </span>
        <div style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', backgroundColor: ACCENT }} />
      </div>

      {/* Label */}
      <div style={{
        position: 'absolute', top: 70, left: 0, right: 0, textAlign: 'center',
        fontSize: 13, color: MUTED, letterSpacing: '0.15em', textTransform: 'uppercase',
        opacity: headerOpacity,
      }}>
        {showAfter ? 'After' : 'Before'}
      </div>

      {/* Main metric area */}
      <div style={{
        position: 'absolute', top: 44, left: 0, right: 0, bottom: 44,
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      }}>
        {/* Before value */}
        {!showAfter && (
          <div style={{ fontSize: 64, fontWeight: 700, color: MUTED, opacity: beforeOpacity * beforeFadeOut, textAlign: 'center', padding: '0 60px', lineHeight: 1.2 }}>
            {before}
          </div>
        )}

        {/* Arrow */}
        {frame > 60 && frame < 110 && (
          <div style={{ fontSize: 48, color: ACCENT, opacity: arrowOpacity * (1 - interpolate(frame, [95, 115], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })) }}>
            ↓
          </div>
        )}

        {/* After value */}
        {showAfter && (
          <div style={{ fontSize: 64, fontWeight: 700, color: ACCENT, opacity: afterOpacity, transform: `scale(${afterScale})`, textAlign: 'center', padding: '0 60px', lineHeight: 1.2, textShadow: `0 0 60px ${ACCENT}40` }}>
            {after}
          </div>
        )}

        {/* Metric label */}
        <div style={{ marginTop: 32, fontSize: 18, color: TEXT, opacity: metricOpacity, textAlign: 'center', maxWidth: 700 }}>
          {metric}
        </div>
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

export default BlogMetricReveal;
