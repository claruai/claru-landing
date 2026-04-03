/**
 * BlogMetricReveal — Before → After metric with dramatic wipe transition.
 * 8s at 30fps (240 frames), 1280x720.
 * Schema: { before, after, metric }
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion';
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
  const { fps } = useVideoConfig();

  const headerOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Phase 1: BEFORE — frames 0–90
  const beforeOpacity = interpolate(frame, [10, 35], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const beforeFadeOut = interpolate(frame, [85, 110], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const beforeLabel = interpolate(frame, [5, 25], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Wipe bar sweeps left→right (frames 90–120)
  const wipeProgress = interpolate(frame, [90, 120], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const wipeOpacity = interpolate(frame, [90, 100, 115, 125], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Phase 2: AFTER — frames 120–240
  const afterSpring = spring({
    frame: frame - 120,
    fps,
    config: { damping: 12, stiffness: 80, mass: 1 },
  });
  const afterScale = interpolate(Math.max(0, afterSpring), [0, 1], [0.7, 1]);
  const afterOpacity = interpolate(frame, [120, 145], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const afterLabel = interpolate(frame, [122, 140], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Progress bar at bottom: 0% (MUTED) → 100% (ACCENT) over frames 90–150
  const progressWidth = interpolate(frame, [90, 150], [0, 100], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const progressOpacity = interpolate(frame, [85, 95], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Metric label appears frame 150
  const metricOpacity = interpolate(frame, [150, 175], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const metricY = interpolate(frame, [150, 175], [12, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const showAfter = frame >= 115;

  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: 'JetBrains Mono, monospace', overflow: 'hidden' }}>

      {/* Dot-grid background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `radial-gradient(circle, rgba(146,176,144,0.09) 1px, transparent 1px)`,
        backgroundSize: '32px 32px',
        pointerEvents: 'none',
      }} />

      {/* Ambient glow — shifts from muted center (before) to accent center (after) */}
      <div style={{
        position: 'absolute', inset: 0,
        background: showAfter
          ? 'radial-gradient(ellipse at 50% 48%, rgba(146,176,144,0.10) 0%, transparent 60%)'
          : 'radial-gradient(ellipse at 50% 48%, rgba(136,136,132,0.07) 0%, transparent 60%)',
        pointerEvents: 'none',
        transition: 'background 0.5s',
      }} />

      {/* Category label top-left */}
      <div style={{
        position: 'absolute', top: 14, left: 32,
        fontSize: 11, color: ACCENT, letterSpacing: '0.18em',
        textTransform: 'uppercase', opacity: headerOpacity,
      }}>
        metric-reveal
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

      {/* BEFORE / AFTER label */}
      <div style={{
        position: 'absolute', top: 68, left: 0, right: 0, textAlign: 'center',
        fontSize: 12, color: showAfter ? ACCENT : MUTED,
        letterSpacing: '0.20em', textTransform: 'uppercase',
        opacity: showAfter ? afterLabel : beforeLabel,
      }}>
        {showAfter ? 'AFTER' : 'BEFORE'}
      </div>

      {/* Main value area */}
      <div style={{
        position: 'absolute', top: 44, left: 0, right: 0, bottom: 120,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
      }}>
        {/* BEFORE value */}
        {!showAfter && (
          <div style={{
            fontSize: 72, fontWeight: 700, color: MUTED,
            opacity: beforeOpacity * beforeFadeOut,
            textAlign: 'center', padding: '0 80px', lineHeight: 1.2,
            filter: 'blur(1px)',
          }}>
            {before}
          </div>
        )}

        {/* AFTER value */}
        {showAfter && (
          <div style={{
            fontSize: 72, fontWeight: 700, color: ACCENT,
            opacity: afterOpacity,
            transform: `scale(${afterScale})`,
            textAlign: 'center', padding: '0 80px', lineHeight: 1.2,
            textShadow: '0 0 80px rgba(146,176,144,0.6)',
          }}>
            {after}
          </div>
        )}
      </div>

      {/* Wipe bar — horizontal sweep */}
      <div style={{
        position: 'absolute',
        left: 0, top: '35%', bottom: '35%',
        width: `${wipeProgress * 100}%`,
        background: `linear-gradient(to right, transparent, rgba(146,176,144,0.15), transparent)`,
        opacity: wipeOpacity,
        pointerEvents: 'none',
      }} />

      {/* Metric label bottom center */}
      <div style={{
        position: 'absolute', bottom: 110, left: 0, right: 0, textAlign: 'center',
        fontSize: 16, color: TEXT,
        opacity: metricOpacity,
        transform: `translateY(${metricY}px)`,
        letterSpacing: '0.04em',
      }}>
        {metric}
      </div>

      {/* Progress bar track */}
      <div style={{
        position: 'absolute', bottom: 72, left: 60, right: 60,
        height: 3, backgroundColor: BORDER,
        borderRadius: 2, opacity: progressOpacity,
      }} />

      {/* Progress bar fill */}
      <div style={{
        position: 'absolute', bottom: 72, left: 60,
        height: 3,
        width: `${(progressWidth / 100) * (1280 - 120)}px`,
        backgroundColor: ACCENT,
        borderRadius: 2, opacity: progressOpacity,
        boxShadow: `0 0 12px rgba(146,176,144,0.5)`,
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

export default BlogMetricReveal;
