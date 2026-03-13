"use client";

import Link from "next/link";
import { useProspectPage } from "./ProspectPageContext";

export default function ProspectFooter() {
  const { companyName, recipientName } = useProspectPage();

  return (
    <footer
      className="border-t py-8"
      style={{
        borderColor: "var(--border-subtle)",
        background: "var(--bg-primary)",
      }}
    >
      <div className="container mx-auto px-6">
        {/* Prepared for line */}
        <p
          className="text-center text-sm mb-6"
          style={{ color: "var(--text-tertiary)" }}
        >
          Prepared for{" "}
          <span style={{ color: "var(--accent-primary)" }}>{companyName}</span>
        </p>

        {/* Legal links */}
        <div className="flex items-center justify-center gap-6 mb-6">
          <Link
            href="/privacy"
            className="text-xs transition-colors hover:underline"
            style={{ color: "var(--text-muted)" }}
          >
            Privacy
          </Link>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            ·
          </span>
          <Link
            href="/terms"
            className="text-xs transition-colors hover:underline"
            style={{ color: "var(--text-muted)" }}
          >
            Terms
          </Link>
        </div>

      </div>
    </footer>
  );
}
