/**
 * BlogDataComparison — Side-by-side data comparison with split-panel layout.
 * 10s at 30fps (300 frames), 1280x720.
 * Schema: { title, rows: [{label, a, b}] }
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion';
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
  const titleY = interpolate(frame, [10, 35], [12, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // Vertical divider draws from top to bottom
  const dividerHeight = interpolate(frame, [0, 40], [0, 100], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const colHeaderOpacity = interpolate(frame, [30, 50], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Subtle horizontal rule lines every 80px — rendered as repeating background
  const rulesOpacity = interpolate(frame, [20, 45], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const CONTENT_TOP = 64;
  const CONTENT_LEFT = 60;
  const CONTENT_RIGHT = 60;
  // Divider at 55% from left inside content area
  const dividerX = CONTENT_LEFT + (1280 - CONTENT_LEFT - CONTENT_RIGHT) * 0.55;

  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: 'JetBrains Mono, monospace', overflow: 'hidden' }}>

      {/* Dot-grid background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `radial-gradient(circle, rgba(146,176,144,0.08) 1px, transparent 1px)`,
        backgroundSize: '32px 32px',
        pointerEvents: 'none',
      }} />

      {/* Subtle horizontal rule lines */}
      <div style={{
        position: 'absolute', inset: 0, opacity: rulesOpacity * 0.04,
        backgroundImage: `repeating-linear-gradient(to bottom, ${ACCENT} 0px, ${ACCENT} 1px, transparent 1px, transparent 80px)`,
        pointerEvents: 'none',
      }} />

      {/* Radial glow on right panel (winner side) */}
      <div style={{
        position: 'absolute',
        left: dividerX, top: 0, right: 0, bottom: 0,
        background: `radial-gradient(ellipse at 60% 50%, rgba(146,176,144,0.06) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Category label top-left */}
      <div style={{
        position: 'absolute', top: 14, left: 32,
        fontSize: 11, color: ACCENT, letterSpacing: '0.18em',
        textTransform: 'uppercase', opacity: headerOpacity,
      }}>
        data-comparison
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

      {/* Content area */}
      <div style={{
        position: 'absolute',
        top: CONTENT_TOP, left: CONTENT_LEFT,
        right: CONTENT_RIGHT, bottom: 60,
      }}>
        {/* Title */}
        <div style={{
          fontSize: 22, color: TEXT, fontWeight: 600,
          letterSpacing: '0.04em', marginBottom: 32,
          opacity: titleOpacity, transform: `translateY(${titleY}px)`,
        }}>
          {title}
        </div>

        {/* Column headers */}
        <div style={{
          display: 'flex', alignItems: 'center',
          opacity: colHeaderOpacity, marginBottom: 10,
          position: 'relative',
        }}>
          {/* Label col */}
          <div style={{ flex: 2.4, fontSize: 11, color: MUTED, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            Metric
          </div>
          {/* A col */}
          <div style={{ flex: 1.3, fontSize: 11, color: MUTED, letterSpacing: '0.14em', textTransform: 'uppercase', textAlign: 'center' }}>
            GIG MODEL
          </div>
          {/* Spacer for divider */}
          <div style={{ width: 2 }} />
          {/* B col */}
          <div style={{ flex: 1.3, fontSize: 11, color: ACCENT, letterSpacing: '0.14em', textTransform: 'uppercase', textAlign: 'center' }}>
            STRUCTURED
          </div>
        </div>

        {/* Header rule */}
        <div style={{ height: 1, backgroundColor: BORDER, marginBottom: 6, opacity: colHeaderOpacity }} />

        {/* Rows */}
        {rows.map((row, i) => {
          const rowStart = 50 + i * 25;

          // Label slides from left
          const labelX = interpolate(frame, [rowStart, rowStart + 20], [-24, 0], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            easing: Easing.out(Easing.cubic),
          });
          const labelOpacity = interpolate(frame, [rowStart, rowStart + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

          // A value fades in shortly after
          const aOpacity = interpolate(frame, [rowStart + 8, rowStart + 25], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

          // B value springs in with overshoot
          const bSpring = spring({
            frame: frame - (rowStart + 12),
            fps,
            config: { damping: 12, stiffness: 80, mass: 0.9 },
          });
          const bScale = interpolate(Math.max(0, bSpring), [0, 1], [0.5, 1]);
          const bOpacity = interpolate(frame, [rowStart + 12, rowStart + 28], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center',
              padding: '12px 0',
              borderBottom: `1px solid ${BORDER}28`,
            }}>
              {/* Label */}
              <div style={{
                flex: 2.4, fontSize: 15, color: TEXT,
                opacity: labelOpacity,
                transform: `translateX(${labelX}px)`,
              }}>
                {row.label}
              </div>

              {/* A value */}
              <div style={{
                flex: 1.3, fontSize: 15, color: MUTED,
                textAlign: 'center', opacity: aOpacity,
              }}>
                {row.a}
              </div>

              {/* Thin vertical divider */}
              <div style={{ width: 2, alignSelf: 'stretch', backgroundColor: BORDER, opacity: 0.5, marginRight: 0 }} />

              {/* B value — winner */}
              <div style={{ flex: 1.3, textAlign: 'center' }}>
                <span style={{
                  fontSize: 15, color: ACCENT, fontWeight: 700,
                  display: 'inline-block',
                  opacity: bOpacity,
                  transform: `scale(${bScale})`,
                  textShadow: `0 0 20px rgba(146,176,144,0.5)`,
                }}>
                  {row.b}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Vertical divider line — draws from top to bottom */}
      <div style={{
        position: 'absolute',
        left: dividerX,
        top: CONTENT_TOP + 20,
        width: 1,
        height: `${dividerHeight}%`,
        maxHeight: 720 - CONTENT_TOP - 60 - 20,
        backgroundColor: BORDER,
        opacity: 0.6,
      }} />

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

export default BlogDataComparison;
