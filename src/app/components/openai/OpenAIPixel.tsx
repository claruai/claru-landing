"use client";

import Script from "next/script";
import { useEffect } from "react";
import { trackAppointmentScheduled } from "@/lib/openai/pixel";

// ChatGPT Ads pixel. The ID is stable per-account; no env-gating because
// there is no separate test/prod pixel.
const PIXEL_ID = "1y9m1e9VjztfV19vbRP5y4";
const DEBUG = process.env.NODE_ENV !== "production";

export default function OpenAIPixel() {
  useEffect(() => {
    // Calendly fires `calendly.event_scheduled` via postMessage when a
    // booking is confirmed in any embedded or popup widget. Map that to
    // the OpenAI Ads `appointment_scheduled` customer action.
    function onMessage(e: MessageEvent) {
      const data = e.data;
      if (!data || typeof data !== "object") return;
      if ((data as { event?: string }).event === "calendly.event_scheduled") {
        trackAppointmentScheduled();
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <Script id="openai-pixel" strategy="afterInteractive">
      {`
        !function(w, d, s, u) {
          if (w.oaiq) return;
          var q = function() { q.q.push(arguments); };
          q.q = [];
          w.oaiq = q;
          var j = d.createElement(s);
          j.async = 1;
          j.src = u;
          var f = d.getElementsByTagName(s)[0];
          f.parentNode.insertBefore(j, f);
        }(window, document, "script", "https://bzrcdn.openai.com/sdk/oaiq.min.js");
        oaiq("init", { pixelId: "${PIXEL_ID}", debug: ${DEBUG} });
      `}
    </Script>
  );
}
