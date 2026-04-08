"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body
        style={{
          backgroundColor: "#0a0908",
          color: "#e8e8e8",
          fontFamily: "monospace",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          margin: 0,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h2 style={{ color: "#92B090", marginBottom: 16 }}>Something went wrong</h2>
          <button
            onClick={reset}
            style={{
              background: "#92B090",
              color: "#0a0908",
              border: "none",
              padding: "8px 24px",
              fontFamily: "monospace",
              cursor: "pointer",
              borderRadius: 4,
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
