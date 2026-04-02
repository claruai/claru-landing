"use client";

import { useState, useCallback } from "react";

interface BlogQueueActionsProps {
  postId: string;
  slug: string;
}

type ActionState = "idle" | "loading" | "approved" | "rejected" | "error";

/**
 * Client component for Approve / Reject / Preview actions on a queued blog post.
 * Calls /api/blog/publish (approve) and /api/blog/reject (reject).
 * On success, shows a confirmation inline — no full page reload needed.
 */
export default function BlogQueueActions({
  postId,
  slug,
}: BlogQueueActionsProps) {
  const [state, setState] = useState<ActionState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleApprove = useCallback(async () => {
    setState("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/blog/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: postId }),
      });

      if (res.ok) {
        setState("approved");
      } else {
        const data = (await res.json()) as { error?: string };
        setErrorMessage(data.error ?? "Failed to publish.");
        setState("error");
      }
    } catch {
      setErrorMessage("Network error. Please try again.");
      setState("error");
    }
  }, [postId]);

  const handleReject = useCallback(async () => {
    setState("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/blog/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: postId }),
      });

      if (res.ok) {
        setState("rejected");
      } else {
        const data = (await res.json()) as { error?: string };
        setErrorMessage(data.error ?? "Failed to reject.");
        setState("error");
      }
    } catch {
      setErrorMessage("Network error. Please try again.");
      setState("error");
    }
  }, [postId]);

  if (state === "approved") {
    return (
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono text-[var(--accent-primary)]">
          published ✓
        </span>
        <a
          href={`/blog/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
        >
          view post ↗
        </a>
      </div>
    );
  }

  if (state === "rejected") {
    return (
      <span className="text-xs font-mono text-[var(--text-muted)]">
        rejected
      </span>
    );
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <button
        onClick={handleApprove}
        disabled={state === "loading"}
        className="px-4 py-1.5 text-xs font-mono bg-[var(--accent-primary)] text-[var(--bg-primary)] rounded hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {state === "loading" ? "working..." : "approve"}
      </button>

      <button
        onClick={handleReject}
        disabled={state === "loading"}
        className="px-4 py-1.5 text-xs font-mono border border-[var(--error)]/40 text-[var(--error)] rounded hover:bg-[var(--error)]/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        reject
      </button>

      <span
        title="Preview available after publishing"
        className="px-4 py-1.5 text-xs font-mono border border-[var(--border-subtle)] text-[var(--text-muted)] rounded opacity-40 cursor-not-allowed"
      >
        preview ↗
      </span>

      {state === "error" && errorMessage && (
        <span className="text-xs font-mono text-[var(--error)]">
          error: {errorMessage}
        </span>
      )}
    </div>
  );
}
