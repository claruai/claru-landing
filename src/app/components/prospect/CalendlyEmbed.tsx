'use client';

import { useEffect, useRef, useState } from 'react';

const BOOKING_URL = 'https://calendly.com/claru';

const CALENDLY_THEME_PARAMS = new URLSearchParams({
  background_color: '0a0908',
  text_color: 'ffffff',
  primary_color: '92B090',
}).toString();

const CALENDLY_SCRIPT_URL =
  'https://assets.calendly.com/assets/external/widget.js';

function isValidCalendlyUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.hostname === 'calendly.com' && parsed.pathname.length > 1;
  } catch {
    return false;
  }
}

export default function CalendlyEmbed() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);

  const urlValid = isValidCalendlyUrl(BOOKING_URL);

  useEffect(() => {
    if (!urlValid) return;

    // Check if script is already loaded
    const existing = document.querySelector(
      `script[src="${CALENDLY_SCRIPT_URL}"]`
    );
    if (existing) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = CALENDLY_SCRIPT_URL;
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => setScriptError(true);
    document.head.appendChild(script);

    return () => {
      // Don't remove the script on unmount — it's idempotent and other
      // instances may rely on it.
    };
  }, [urlValid]);

  const showFallback = !urlValid || scriptError;

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Section header */}
        <h2
          className="mb-8 text-center text-2xl sm:text-3xl font-bold tracking-tight"
          style={{ fontFamily: 'var(--font-jetbrains-mono, monospace)', color: '#FFFFFF' }}
        >
          Book a Call
        </h2>

        {/* Card wrapper */}
        <div
          className="rounded-xl border overflow-hidden"
          style={{
            backgroundColor: '#121210',
            borderColor: '#2a2a28',
          }}
        >
          {showFallback ? (
            /* ---- Fallback CTA ---- */
            <div className="flex flex-col items-center justify-center gap-6 py-20 px-6 text-center">
              <p style={{ color: '#FFFFFF' }} className="text-lg">
                Scheduling is temporarily unavailable.
              </p>
              <a
                href="mailto:team@claru.ai"
                className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-80"
                style={{
                  backgroundColor: '#92B090',
                  color: '#0a0908',
                  fontFamily: 'var(--font-jetbrains-mono, monospace)',
                }}
              >
                Email us at team@claru.ai
              </a>
            </div>
          ) : (
            /* ---- Calendly inline widget ---- */
            <div
              ref={containerRef}
              className="calendly-inline-widget w-full"
              data-url={`${BOOKING_URL}?${CALENDLY_THEME_PARAMS}`}
              style={{ minHeight: 650, height: 650 }}
            >
              {!scriptLoaded && (
                <div
                  className="flex items-center justify-center"
                  style={{ height: 650, color: '#92B090' }}
                >
                  <span
                    className="animate-pulse text-sm"
                    style={{ fontFamily: 'var(--font-jetbrains-mono, monospace)' }}
                  >
                    Loading scheduler...
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
