/**
 * BlogDataComparison — Side-by-side data comparison table, rows stagger in.
 * 10s at 30fps (300 frames), 1280x720.
 * Schema: { title, rows: [{label, a, b}] }
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { z } from 'zod';
import { BG, ACCENT, TEXT, MUTED, BORDER } from './shared/colors';

export const blogDataComparisonSchema = z.object({
  title: z.string().default('Gig Worker vs. Structured Collection'),
  rows: z.array(z.object({
    label: z.string(),
    a: z.string(),
    b: z.string(),
  })).default([
    { label: 'Rejection rate', a: '40%', b: '< 8%' },
    { label: 'Protocol consistency', a: 'Variable', b: 'Standardized' },
    { label: 'Annotation depth', a: 'Basic labels', b: 'Full semantic tree' },
    { label: 'Scale', a: 'High volume', b: 'Quality-gated' },
  ]),
});

type Props = z.infer<typeof blogDataComparisonSchema>;

const BlogDataComparison: React.FC<Props> = ({ title, rows }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const titleOpacity = interpolate(frame, [10, 35], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const colHeaderOpacity = interpolate(frame, [30, 50], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: 'JetBrains Mono, monospace', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 44,
        borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center',
        padding: '0 32px', opacity: headerOpacity,
      }}>
        <span style={{ color: ACCENT, fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          claru / data-comparison
        </span>
        <div style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', backgroundColor: ACCENT }} />
      </div>

      {/* Content */}
      <div style={{ position: 'absolute', top: 64, left: 60, right: 60, bottom: 60 }}>
        {/* Title */}
        <div style={{ fontSize: 22, color: TEXT, fontWeight: 600, letterSpacing: '0.04em', marginBottom: 32, opacity: titleOpacity }}>
          {title}
        </div>

        {/* Column headers */}
        <div style={{ display: 'flex', opacity: colHeaderOpacity, marginBottom: 12 }}>
          <div style={{ flex: 2, fontSize: 11, color: MUTED, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Metric</div>
          <div style={{ flex: 1, fontSize: 11, color: MUTED, letterSpacing: '0.12em', textTransform: 'uppercase', textAlign: 'center' }}>Gig Model</div>
          <div style={{ flex: 1, fontSize: 11, color: ACCENT, letterSpacing: '0.12em', textTransform: 'uppercase', textAlign: 'center' }}>Structured</div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, backgroundColor: BORDER, marginBottom: 8, opacity: colHeaderOpacity }} />

        {/* Rows */}
        {rows.map((row, i) => {
          const rowStart = 55 + i * 20;
          const rowOpacity = interpolate(frame, [rowStart, rowStart + 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const rowY = interpolate(frame, [rowStart, rowStart + 18], [10, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const accentSpring = spring({ frame: frame - rowStart, fps, config: { damping: 20, stiffness: 100 } });

          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${BORDER}30`, opacity: rowOpacity, transform: `translateY(${rowY}px)` }}>
              <div style={{ flex: 2, fontSize: 15, color: TEXT }}>{row.label}</div>
              <div style={{ flex: 1, fontSize: 15, color: MUTED, textAlign: 'center' }}>{row.a}</div>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <span style={{ fontSize: 15, color: ACCENT, fontWeight: 700, textShadow: `0 0 20px ${ACCENT}${Math.floor(accentSpring * 60).toString(16).padStart(2, '0')}` }}>
                  {row.b}
                </span>
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

export default BlogDataComparison;
