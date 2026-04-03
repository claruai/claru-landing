import { AbsoluteFill, useCurrentFrame, spring } from 'remotion';

const ACCENT = '#92B090';
const BG = '#0a0908';
const TEXT = '#FFFFFF';
const MUTED = '#888884';
const BORDER = '#2a2a28';

const companies = [
  { name: 'UBTECH', model: 'Walker S', capacity: '~10,000', year: '2025–26' },
  { name: 'Unitree', model: 'G1 / H1', capacity: '$16K/unit', year: '2025' },
  { name: 'Fourier', model: 'GR-2', capacity: '1,000+', year: '2025–26' },
  { name: 'Agibot', model: 'A2', capacity: 'Line active', year: '2025–26' },
  { name: 'GALBOT', model: 'G1', capacity: 'Pilot line', year: '2026' },
  { name: 'Tiangong', model: 'Tiangong', capacity: 'Gov-backed', year: '2025–26' },
];

export default function DynamicVisual() {
  const frame = useCurrentFrame();

  const sp = (delay: number) =>
    spring({ frame, fps: 30, from: 0, to: 1, config: { damping: 12, stiffness: 80 }, delay });

  // Phase 1: Hero stat (frames 0–80)
  const heroProgress = sp(8);
  const heroNumber = Math.round(heroProgress * 10000);

  // Phase 2: Subtitle and context (frames 40–120)
  const subtitleProgress = sp(35);
  const transferStatProgress = sp(55);

  // Phase 3: Company table rows (frames 70–160)
  const rowProgresses = companies.map((_, i) => sp(70 + i * 12));

  // Phase 4: Data moat callout (frames 140–200)
  const moatProgress = sp(140);
  const barWidth = sp(150) * 100;
  const westernBarWidth = sp(160) * 18;

  // Accent line animation
  const accentLineWidth = sp(5) * 100;

  // Bottom accent line
  const bottomLineWidth = sp(20) * 100;

  // Glow pulse (subtle)
  const glowIntensity = 0.6 + 0.4 * Math.sin(frame * 0.08);

  // Scan lines via CSS gradient
  const scanLinesBg = `repeating-linear-gradient(
    0deg,
    transparent,
    transparent 3px,
    rgba(146, 176, 144, 0.015) 3px,
    rgba(146, 176, 144, 0.015) 4px
  )`;

  const radialBg = `radial-gradient(ellipse 60% 50% at 50% 30%, rgba(146, 176, 144, 0.06) 0%, transparent 70%)`;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        backgroundImage: `${scanLinesBg}, ${radialBg}`,
        fontFamily: 'system-ui, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* Top accent line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${accentLineWidth}%`,
          height: 2,
          background: `linear-gradient(90deg, ${ACCENT}, transparent)`,
        }}
      />

      {/* Main content container */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 60,
          right: 60,
          bottom: 40,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header tag */}
        <div
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 11,
            color: ACCENT,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            opacity: sp(0),
            marginBottom: 8,
          }}
        >
          CHINA HUMANOID ROBOT PRODUCTION — 2026 OUTLOOK
        </div>

        {/* Hero number */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 16,
            marginBottom: 4,
          }}
        >
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 140,
              fontWeight: 700,
              color: TEXT,
              lineHeight: 1,
              textShadow: `0 0 ${40 * glowIntensity}px rgba(146, 176, 144, ${0.4 * glowIntensity}), 0 0 ${80 * glowIntensity}px rgba(146, 176, 144, ${0.15 * glowIntensity})`,
              opacity: heroProgress,
              transform: `translateY(${(1 - heroProgress) * 30}px)`,
            }}
          >
            {heroNumber.toLocaleString()}
          </span>
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 18,
              color: ACCENT,
              opacity: subtitleProgress,
              transform: `translateY(${(1 - subtitleProgress) * 10}px)`,
              lineHeight: 1.3,
            }}
          >
            robots / year
            <br />
            <span style={{ color: MUTED, fontSize: 13 }}>target by 2026</span>
          </span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 16,
            color: MUTED,
            maxWidth: 700,
            lineHeight: 1.5,
            opacity: subtitleProgress,
            transform: `translateY(${(1 - subtitleProgress) * 15}px)`,
            marginBottom: 6,
          }}
        >
          Fleet-scale deployment creates an unprecedented data feedback loop.
          Every unit collecting real-world data feeds centralized model training.
        </div>

        {/* Transfer stat */}
        <div
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 13,
            color: ACCENT,
            opacity: transferStatProgress,
            transform: `translateX(${(1 - transferStatProgress) * 20}px)`,
            marginBottom: 24,
            borderLeft: `2px solid ${ACCENT}`,
            paddingLeft: 12,
          }}
        >
          Cross-embodiment data improves policy transfer by{' '}
          <span style={{ color: TEXT, fontWeight: 700, fontSize: 16 }}>50%</span> avg
          <span style={{ color: MUTED }}> — single-morphology fleet data at 10K scale untested</span>
        </div>

        {/* Divider */}
        <div
          style={{
            width: `${bottomLineWidth}%`,
            height: 1,
            backgroundColor: BORDER,
            marginBottom: 16,
          }}
        />

        {/* Company table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 20 }}>
          {/* Header row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '120px 100px 120px 80px',
              gap: 12,
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 10,
              color: MUTED,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              paddingBottom: 6,
              borderBottom: `1px solid ${BORDER}`,
              opacity: rowProgresses[0],
            }}
          >
            <span>Company</span>
            <span>Model</span>
            <span>Capacity</span>
            <span>Target</span>
          </div>

          {companies.map((co, i) => {
            const p = rowProgresses[i];
            return (
              <div
                key={co.name}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '120px 100px 120px 80px',
                  gap: 12,
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 12,
                  padding: '7px 0',
                  borderBottom: `1px solid ${BORDER}`,
                  opacity: p,
                  transform: `translateX(${(1 - p) * 40}px)`,
                }}
              >
                <span style={{ color: TEXT, fontWeight: 600 }}>{co.name}</span>
                <span style={{ color: MUTED }}>{co.model}</span>
                <span style={{ color: ACCENT }}>{co.capacity}</span>
                <span style={{ color: MUTED }}>{co.year}</span>
              </div>
            );
          })}
        </div>

        {/* Data moat visualization */}
        <div
          style={{
            opacity: moatProgress,
            transform: `translateY(${(1 - moatProgress) * 20}px)`,
            marginTop: 4,
          }}
        >
          <div
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 10,
              color: MUTED,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: 10,
            }}
          >
            FLEET DATA VOLUME COMPARISON
          </div>

          {/* China bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 11,
                color: TEXT,
                width: 100,
              }}
            >
              China 2026
            </span>
            <div
              style={{
                height: 22,
                width: `${barWidth * 5.5}px`,
                maxWidth: 550,
                background: `linear-gradient(90deg, ${ACCENT}, rgba(146, 176, 144, 0.3))`,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: 8,
              }}
            >
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 10,
                  color: BG,
                  fontWeight: 700,
                }}
              >
                10,000+ units
              </span>
            </div>
          </div>

          {/* Western bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 11,
                color: MUTED,
                width: 100,
              }}
            >
              Western labs
            </span>
            <div
              style={{
                height: 22,
                width: `${westernBarWidth * 5.5}px`,
                maxWidth: 550,
                background: `linear-gradient(90deg, ${BORDER}, rgba(42, 42, 40, 0.5))`,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: 8,
              }}
            >
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 10,
                  color: MUTED,
                  fontWeight: 700,
                }}
              >
                ~100s
              </span>
            </div>
          </div>

          <div
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 10,
              color: MUTED,
              marginTop: 8,
              opacity: 0.7,
            }}
          >
            The window where Western labs lead on model quality but trail on data volume is closing.
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: `${bottomLineWidth}%`,
          height: 2,
          background: `linear-gradient(270deg, ${ACCENT}, transparent)`,
        }}
      />

      {/* CLARU.AI label */}
      <div
        style={{
          position: 'absolute',
          bottom: 10,
          right: 16,
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 10,
          color: MUTED,
          letterSpacing: '0.15em',
        }}
      >
        CLARU.AI
      </div>
    </AbsoluteFill>
  );
}