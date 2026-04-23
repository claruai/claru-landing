// Minimal types for Google's gtag.js, loaded via next/script in src/app/layout.tsx.
// See: https://developers.google.com/tag-platform/gtagjs/reference
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export {};
