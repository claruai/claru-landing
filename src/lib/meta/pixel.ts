"use client";

declare global {
  interface Window {
    fbq?: (
      command: "track" | "trackCustom" | "init" | "set",
      ...args: unknown[]
    ) => void;
  }
}

export function trackContact(eventId: string | undefined): void {
  if (!eventId) return;
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  try {
    window.fbq("track", "Contact", {}, { eventID: eventId });
  } catch {
    // Pixel not available — non-fatal.
  }
}
