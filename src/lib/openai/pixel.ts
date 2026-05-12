"use client";

declare global {
  interface Window {
    oaiq?: (
      command: "init" | "measure",
      ...args: unknown[]
    ) => void;
  }
}

type CustomerAction = "lead_created" | "appointment_scheduled";

function measure(event: CustomerAction): void {
  if (typeof window === "undefined" || typeof window.oaiq !== "function") return;
  try {
    window.oaiq("measure", event, { type: "customer_action" });
  } catch {
    // Pixel not available — non-fatal.
  }
}

export function trackLeadCreated(): void {
  measure("lead_created");
}

export function trackAppointmentScheduled(): void {
  measure("appointment_scheduled");
}
