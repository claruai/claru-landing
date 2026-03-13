"use client";

import { useMemo } from "react";
import Logo from "../ui/Logo";

interface ExpiryGateProps {
  createdAt: string;
  children: React.ReactNode;
}

const EXPIRY_DAYS = 30;
const WARNING_THRESHOLD_DAYS = 7;

function getDaysRemaining(createdAt: string): number {
  const created = new Date(createdAt);
  const expiryDate = new Date(created);
  expiryDate.setDate(expiryDate.getDate() + EXPIRY_DAYS);
  const now = new Date();
  const diffMs = expiryDate.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

function ExpiredState() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-6"
      style={{ backgroundColor: "#0a0908" }}
    >
      <div className="flex max-w-md flex-col items-center text-center">
        <div style={{ color: "#92B090" }}>
          <Logo size="lg" className="mb-8" />
        </div>
        <h1
          className="mb-4 font-mono text-xl font-semibold"
          style={{ color: "#FFFFFF" }}
        >
          Page Expired
        </h1>
        <p className="mb-8 text-base leading-relaxed" style={{ color: "#a0a0a0" }}>
          This page is no longer available. Please contact us at{" "}
          <a
            href="mailto:team@claru.ai"
            className="underline underline-offset-4 transition-colors hover:opacity-80"
            style={{ color: "#92B090" }}
          >
            team@claru.ai
          </a>{" "}
          for updated information.
        </p>
      </div>
    </div>
  );
}

function ExpiryWarning({ daysRemaining }: { daysRemaining: number }) {
  return (
    <div
      className="flex items-center justify-center gap-2 px-4 py-2 text-center font-mono text-xs"
      style={{
        backgroundColor: "rgba(146, 176, 144, 0.08)",
        borderBottom: "1px solid rgba(146, 176, 144, 0.15)",
        color: "#92B090",
      }}
    >
      <span>
        This page expires in {daysRemaining} day{daysRemaining !== 1 ? "s" : ""}
      </span>
    </div>
  );
}

export default function ExpiryGate({ createdAt, children }: ExpiryGateProps) {
  const daysRemaining = useMemo(() => getDaysRemaining(createdAt), [createdAt]);

  if (daysRemaining <= 0) {
    return <ExpiredState />;
  }

  return (
    <>
      {daysRemaining <= WARNING_THRESHOLD_DAYS && (
        <ExpiryWarning daysRemaining={daysRemaining} />
      )}
      {children}
    </>
  );
}
