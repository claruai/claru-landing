"use client";

import { ExternalLink } from "lucide-react";

interface CitationProps {
  href: string;
  children: React.ReactNode;
}

export default function Citation({ href, children }: CitationProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[var(--accent-primary)] hover:underline inline-flex items-center gap-0.5"
    >
      {children}
      <ExternalLink className="w-3 h-3 opacity-60" />
    </a>
  );
}
