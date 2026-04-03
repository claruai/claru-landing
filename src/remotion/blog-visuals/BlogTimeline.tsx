/**
 * BlogTimeline — Horizontal timeline events with animated spine line.
 * 12s at 30fps (360 frames), 1280x720.
 * Schema: { events: [{date, label}].max(5) }
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Easing } from 'remotion';
import { z } from 'zod';
import { BG, ACCENT, TEXT, MUTED, BORDER } from './shared/colors';

export const blogTimelineSchema = z.object({
  events: z.array(z.object({
    date: z.string(),
    label: z.string(),
  })).max(5).default([
    { date: '2022', label: 'ACT paper — action chunking with transformers' },
    { date: '2023', label: 'Open X-Embodiment: 22 datasets, 1M+ demos' },
    { date: 'Jan 2024', label: 'Diffusion Policy scales to dexterous tasks' },
    { date: 'Mar 2024', label: 'Physical Intelligence π0 demo' },
    { date: '2025', label: 'Humanoid labs hit 10k+ daily demonstrations' },
  ]),
});

type Props = z.infer<typeof blogTimelineSchema>;

const BlogTimeline: React.FC<Props> = ({ events }) => {
  const frame = useCurrentFrame();

  const visibleEvents = events.slice(0, 5);
  const n = visibleEvents.length;

  const headerOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Horizontal spine draws left to right (frames 20–180)
  const spineProgress = interpolate(frame, [20, 180], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // Layout constants
  const PADDING_H = 80;
  const SPINE_Y = 380; // vertical center of spine from top of full frame
  const USABLE_W = 1280 - PADDING_H * 2;
  const DOT_R = 6; // radius

  // Last event index for pulsing ring
  const lastIdx = n - 1;

  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: 'JetBrains Mono, monospace', overflow: 'hidden' }}>

      {/* Dot-grid background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `radial-gradient(circle, rgba(146,176,144,0.09) 1px, transparent 1px)`,
        backgroundSize: '32px 32px',
        pointerEvents: 'none',
      }} />

      {/* Ambient glow near spine */}
      <div style={{
        position: 'absolute',
        left: PADDING_H, right: PADDING_H,
        top: SPINE_Y - 120, height: 240,
        background: 'radial-gradient(ellipse at 50% 50%, rgba(146,176,144,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Category label top-left */}
      <div style={{
        position: 'absolute', top: 14, left: 32,
        fontSize: 11, color: ACCENT, letterSpacing: '0.18em',
        textTransform: 'uppercase', opacity: headerOpacity,
      }}>
        timeline
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

      {/* Horizontal spine line */}
      <div style={{
        position: 'absolute',
        left: PADDING_H,
        top: SPINE_Y,
        width: USABLE_W * spineProgress,
        height: 2,
        backgroundColor: ACCENT,
        opacity: 0.35,
      }} />

      {/* Events */}
      {visibleEvents.map((event, i) => {
        // Evenly spaced positions along the spine
        const xFrac = n > 1 ? i / (n - 1) : 0.5;
        const xPos = PADDING_H + xFrac * USABLE_W;

        // Each event appears when the spine reaches it
        const eventSpineArrival = 20 + (180 - 20) * xFrac;
        const eventFrame = Math.max(eventSpineArrival, 20);

        const dotSpring = spring({
          frame: frame - eventFrame,
          fps: 30,
          config: { damping: 12, stiffness: 80, mass: 0.8 },
        });
        const dotScale = Math.max(0, Math.min(dotSpring, 1.15));

        const textOpacity = interpolate(frame, [eventFrame + 5, eventFrame + 25], [0, 1], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        });
        const dateY = interpolate(frame, [eventFrame + 5, eventFrame + 25], [-10, 0], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        });
        const labelY = interpolate(frame, [eventFrame + 5, eventFrame + 25], [10, 0], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        });

        // Pulsing ring for the latest event
        const isPulsing = i === lastIdx && frame > eventFrame + 20;
        const pulsePhase = ((frame - eventFrame - 20) % 60) / 60;
        const pulseScale = isPulsing ? 1 + 0.3 * Math.sin(pulsePhase * Math.PI) : 1;
        const pulseOpacity = isPulsing ? 0.4 * (1 - pulsePhase) : 0;

        return (
          <React.Fragment key={i}>
            {/* Pulsing ring */}
            {isPulsing && (
              <div style={{
                position: 'absolute',
                left: xPos - DOT_R * 3,
                top: SPINE_Y - DOT_R * 3 + 1,
                width: DOT_R * 6,
                height: DOT_R * 6,
                borderRadius: '50%',
                border: `1.5px solid ${ACCENT}`,
                opacity: pulseOpacity,
                transform: `scale(${pulseScale})`,
              }} />
            )}

            {/* Dot on spine */}
            <div style={{
              position: 'absolute',
              left: xPos - DOT_R,
              top: SPINE_Y - DOT_R + 1,
              width: DOT_R * 2,
              height: DOT_R * 2,
              borderRadius: '50%',
              backgroundColor: ACCENT,
              boxShadow: `0 0 18px rgba(146,176,144,0.7)`,
              transform: `scale(${dotScale})`,
            }} />

            {/* Date — above the spine */}
            <div style={{
              position: 'absolute',
              left: xPos,
              top: SPINE_Y - 54,
              transform: `translateX(-50%) translateY(${dateY}px)`,
              opacity: textOpacity,
              fontSize: 11, color: ACCENT,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              textAlign: 'center', whiteSpace: 'nowrap',
            }}>
              {event.date}
            </div>

            {/* Label — below the spine */}
            <div style={{
              position: 'absolute',
              left: xPos - (USABLE_W / n / 2) * 0.85,
              top: SPINE_Y + 24,
              width: USABLE_W / n * 0.85,
              transform: `translateY(${labelY}px)`,
              opacity: textOpacity,
              fontSize: 13, color: TEXT,
              lineHeight: 1.5, textAlign: 'center',
            }}>
              {event.label}
            </div>
          </React.Fragment>
        );
      })}

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

export default BlogTimeline;
