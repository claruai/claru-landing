/**
 * BlogStatCallout — Animated stat with spring entry and cinematic depth.
 * 8s at 30fps (240 frames), 1280x720.
 * Schema: { stat, label, context }
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion';
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

  // Spring entry for the stat number — slight overshoot
  const statSpring = spring({
    frame: frame - 20,
    fps,
    config: { damping: 12, stiffness: 80, mass: 1 },
  });
  const statScale = interpolate(Math.min(Math.max(0, statSpring), 1.1), [0, 1], [0.6, 1]);
  const statOpacity = interpolate(frame, [20, 38], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Count-up animation
  const counterProgress = spring({ frame: frame - 20, fps, config: { damping: 18, stiffness: 60, mass: 0.8 } });
  const currentNum = numericPart * Math.min(Math.max(0, counterProgress), 1);
  const displayStat = frame >= 20
    ? (Number.isInteger(numericPart) ? Math.floor(currentNum).toString() : currentNum.toFixed(1)) + suffix
    : '';

  // Accent bar slides in from left
  const accentBarWidth = interpolate(frame, [10, 25], [0, 1280], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // Scan line sweeps top-to-bottom once (frames 0–180)
  const scanY = interpolate(frame, [0, 180], [-4, 724], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.linear,
  });

  // Label slides up from below
  const labelY = interpolate(frame, [60, 90], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const labelOpacity = interpolate(frame, [60, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Context fades in
  const contextOpacity = interpolate(frame, [90, 115], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Header / footer fade
  const headerOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: 'JetBrains Mono, monospace', overflow: 'hidden' }}>

      {/* Dot-grid background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `radial-gradient(circle, rgba(146,176,144,0.12) 1px, transparent 1px)`,
        backgroundSize: '32px 32px',
        pointerEvents: 'none',
      }} />

      {/* Radial glow behind the stat */}
      <div style={{
        position: 'absolute',
        left: '50%', top: '50%',
        transform: 'translate(-50%, -60%)',
        width: 600, height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse at center, rgba(146,176,144,0.10) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Animated scan line */}
      <div style={{
        position: 'absolute', left: 0, right: 0,
        top: scanY, height: 4,
        background: 'linear-gradient(to bottom, transparent, rgba(146,176,144,0.04), transparent)',
        pointerEvents: 'none',
      }} />

      {/* Thin horizontal accent bar sliding in from left */}
      <div style={{
        position: 'absolute', top: 44, left: 0,
        width: accentBarWidth, height: 2,
        backgroundColor: ACCENT, opacity: 0.6,
      }} />

      {/* Category label top-left */}
      <div style={{
        position: 'absolute', top: 14, left: 32,
        fontSize: 11, color: ACCENT, letterSpacing: '0.18em',
        textTransform: 'uppercase', opacity: headerOpacity,
      }}>
        data-insight
      </div>

      {/* Top-right dot */}
      <div style={{
        position: 'absolute', top: 18, right: 32,
        width: 8, height: 8, borderRadius: '50%',
        backgroundColor: ACCENT, opacity: headerOpacity,
      }} />

      {/* Stat */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
      }}>
        <div style={{
          fontSize: 140, fontWeight: 700, color: ACCENT,
          lineHeight: 1, letterSpacing: '-4px',
          opacity: statOpacity,
          transform: `scale(${statScale})`,
          textShadow: '0 0 120px rgba(146,176,144,0.5)',
        }}>
          {displayStat}
        </div>

        {/* Label */}
        <div style={{
          marginTop: 36, fontSize: 22, color: MUTED,
          opacity: labelOpacity,
          transform: `translateY(${labelY}px)`,
          letterSpacing: '0.06em', textAlign: 'center',
          maxWidth: 680, lineHeight: 1.5,
        }}>
          {label}
        </div>

        {/* Context */}
        <div style={{
          marginTop: 20, fontSize: 13, color: MUTED,
          opacity: contextOpacity,
          letterSpacing: '0.08em',
        }}>
          {context}
        </div>
      </div>

      {/* Bottom rule */}
      <div style={{
        position: 'absolute', bottom: 44, left: 32, right: 32,
        height: 1, backgroundColor: BORDER, opacity: headerOpacity,
      }} />

      {/* Bottom branding bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 44,
        display: 'flex', alignItems: 'center',
        padding: '0 32px', opacity: headerOpacity,
      }}>
        <span style={{ color: MUTED, fontSize: 11, letterSpacing: '0.12em' }}>claru.ai</span>
        <span style={{ marginLeft: 'auto', color: MUTED, fontSize: 11, letterSpacing: '0.08em' }}>physical AI training data</span>
      </div>

      {/* CLARU.AI branding bottom-right (inside bar) */}
      <div style={{
        position: 'absolute', bottom: 15, right: 32,
        fontSize: 11, color: MUTED, letterSpacing: '0.14em',
        opacity: headerOpacity, textTransform: 'uppercase',
        display: 'none', // hidden in favour of the bottom bar span above
      }}>
        CLARU.AI
      </div>
    </AbsoluteFill>
  );
};

export default BlogStatCallout;
