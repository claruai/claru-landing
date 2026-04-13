"use client";

import { useEffect } from "react";

/**
 * Handles hash-based anchor scrolling on the glossary page.
 * Lenis smooth scroll suppresses native hash navigation, so we manually
 * scroll to the target element after hydration.
 */
export default function HashScrollHandler() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const id = hash.slice(1); // strip the #
    const el = document.getElementById(id);
    if (!el) return;

    // Small delay to let Lenis initialize first
    const timer = setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
