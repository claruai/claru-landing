"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function DigestSubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/digest/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <div
      className="rounded-lg border border-white/10 bg-white/[0.03] px-6 py-5 md:px-8 md:py-6"
    >
      {status === "success" ? (
        <p
          className="text-sm font-medium"
          style={{
            color: "#92B090",
            fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)",
          }}
        >
          You&apos;re in. First digest arrives Monday.
        </p>
      ) : (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Copy */}
          <div className="shrink-0">
            <h3
              className="text-sm font-semibold tracking-wide text-white"
              style={{
                fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)",
              }}
            >
              Physical AI Dataset Radar
            </h3>
            <p className="mt-0.5 text-sm text-white/50">
              The 5 most notable new robotics datasets every Monday.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex w-full gap-2 md:w-auto md:min-w-[380px]"
          >
            <input
              type="email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading"}
              className="flex-1 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-[#92B090]/50 disabled:opacity-50"
              style={{
                fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)",
              }}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="shrink-0 rounded-md px-5 py-2 text-sm font-medium transition-opacity disabled:opacity-50"
              style={{ backgroundColor: "#92B090", color: "#0a0908" }}
            >
              {status === "loading" ? "..." : "Subscribe"}
            </button>
          </form>
        </div>
      )}

      {status === "error" && errorMsg && (
        <p className="mt-2 text-xs text-red-400">{errorMsg}</p>
      )}
    </div>
  );
}
