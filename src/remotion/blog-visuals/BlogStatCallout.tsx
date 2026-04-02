/**
 * BlogStatCallout — Animated stat with spring count-up.
 * 8s at 30fps (240 frames), 1280x720.
 * Schema: { stat, label, context }
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { z } from 'zod';
import { BG, ACCENT, TEXT, MUTED, BORDER } from './shared/colors';

export const blogStatCalloutSchema = z.object({
  stat: z.string().default('78%'),
  label: z.string().default('policy success rate on held-out tasks'),
  context: z.string().default('Source: Open X-Embodiment study, 2024'),
});

type Props = z.infer<typeof blogStatCalloutSchema>;

const BlogStatCallout: React.FC<Props> = ({ stat, label, context }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const numericPart = parseFloat(stat.replace(/[^0-9.]/g, '')) || 0;
  const suffix = stat.replace(/[0-9.,\s]/g, '');

  const counterSpring = spring({ frame: frame - 20, fps, config: { damping: 18, stiffness: 60, mass: 0.8 } });
  const currentNum = numericPart * Math.min(Math.max(0, counterSpring), 1);

  const statOpacity = interpolate(frame, [20, 35], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const labelOpacity = interpolate(frame, [70, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const contextOpacity = interpolate(frame, [90, 110], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const lineScale = interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const headerOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const displayStat = frame >= 20
    ? (Number.isInteger(numericPart) ? Math.floor(currentNum).toString() : currentNum.toFixed(1)) + suffix
    : '';

  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: 'JetBrains Mono, monospace', overflow: 'hidden' }}>
      {/* Header bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 44,
        borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center',
        padding: '0 32px', opacity: headerOpacity,
      }}>
        <span style={{ color: ACCENT, fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          claru / data-insight
        </span>
        <div style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', backgroundColor: ACCENT }} />
      </div>

      {/* Main content */}
      <div style={{
        position: 'absolute', top: 44, left: 0, right: 0, bottom: 44,
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        padding: '0 80px',
      }}>
        {/* Accent line */}
        <div style={{
          width: `${lineScale * 60}px`, height: 2, backgroundColor: ACCENT,
          marginBottom: 40, transformOrigin: 'left center',
        }} />

        {/* Stat */}
        <div style={{ fontSize: 112, fontWeight: 700, color: ACCENT, opacity: statOpacity, lineHeight: 1, letterSpacing: -2, textShadow: `0 0 80px ${ACCENT}40` }}>
          {displayStat}
        </div>

        {/* Label */}
        <div style={{ marginTop: 28, fontSize: 20, color: TEXT, opacity: labelOpacity, letterSpacing: '0.08em', textAlign: 'center', maxWidth: 700, lineHeight: 1.5 }}>
          {label}
        </div>

        {/* Context / source */}
        <div style={{ marginTop: 24, fontSize: 13, color: MUTED, opacity: contextOpacity, letterSpacing: '0.06em' }}>
          {context}
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

export default BlogStatCallout;
