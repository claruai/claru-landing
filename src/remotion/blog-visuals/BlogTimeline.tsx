/**
 * BlogTimeline — Sequential timeline events with connector line animation.
 * 12s at 30fps (360 frames), 1280x720.
 * Schema: { events: [{date, label}].max(5) }
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring } from 'remotion';
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

  const headerOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const lineProgress = interpolate(frame, [30, 200], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const visibleEvents = events.slice(0, 5);
  const framesPerEvent = 50;

  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: 'JetBrains Mono, monospace', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 44,
        borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center',
        padding: '0 32px', opacity: headerOpacity,
      }}>
        <span style={{ color: ACCENT, fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          claru / timeline
        </span>
        <div style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', backgroundColor: ACCENT }} />
      </div>

      {/* Content */}
      <div style={{ position: 'absolute', top: 64, left: 80, right: 60, bottom: 60 }}>
        {/* Vertical timeline spine */}
        <div style={{
          position: 'absolute', left: 80, top: 10, width: 2,
          height: `${lineProgress * (visibleEvents.length * 90 + 20)}px`,
          backgroundColor: ACCENT, opacity: 0.4,
          transition: 'height 0.1s',
        }} />

        {/* Events */}
        {visibleEvents.map((event, i) => {
          const eventFrame = 35 + i * framesPerEvent;
          const eventOpacity = interpolate(frame, [eventFrame, eventFrame + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const dotScale = spring({ frame: frame - eventFrame, fps: 30, config: { damping: 14, stiffness: 150 } });
          const textX = interpolate(frame, [eventFrame, eventFrame + 20], [-20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: 28, opacity: eventOpacity, position: 'relative' }}>
              {/* Dot */}
              <div style={{
                width: 12, height: 12, borderRadius: '50%', backgroundColor: ACCENT,
                marginRight: 28, flexShrink: 0,
                transform: `scale(${Math.max(0, dotScale)})`,
                boxShadow: `0 0 16px ${ACCENT}60`,
                zIndex: 2,
              }} />

              {/* Text */}
              <div style={{ transform: `translateX(${textX}px)` }}>
                <div style={{ fontSize: 12, color: ACCENT, letterSpacing: '0.12em', marginBottom: 4 }}>{event.date}</div>
                <div style={{ fontSize: 16, color: TEXT, lineHeight: 1.4, maxWidth: 900 }}>{event.label}</div>
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

export default BlogTimeline;
