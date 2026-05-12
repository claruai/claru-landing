"use client";

declare global {
  interface Window {
    oaiq?: (
      command: "init" | "measure",
      ...args: unknown[]
    ) => void;
  }
}

export function trackLeadCreated(): void {
  if (typeof window === "undefined" || typeof window.oaiq !== "function") return;
  try {
    window.oaiq("measure", "lead_created", { type: "customer_action" });
  } catch {
    // Pixel not available — non-fatal.
  }
}
