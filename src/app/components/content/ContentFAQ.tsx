"use client";

// ---------------------------------------------------------------------------
// ContentFAQ — Client Component
// ---------------------------------------------------------------------------
// Expandable FAQ accordion. Keyboard accessible (Enter/Space to toggle,
// aria-expanded). This is the only client component among the content page
// section components because it needs toggle state.
// ---------------------------------------------------------------------------

import { useState, useCallback } from "react";
import type { FAQ } from "@/data/content-pages/types";

interface ContentFAQProps {
  /** FAQ items to render */
  faqs: FAQ[];
  /** Optional custom heading (defaults to "Frequently Asked Questions") */
  heading?: string;
}

export default function ContentFAQ({
  faqs,
  heading = "Frequently Asked Questions",
}: ContentFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = useCallback((idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  }, []);

  if (faqs.length === 0) return null;

  return (
    <section id="faq" className="w-full py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-6">
        <h2
          className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl"
          style={{ color: "#FFFFFF" }}
        >
          {heading}
        </h2>

        <div className="mt-10 space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            const panelId = `faq-panel-${idx}`;
            const headingId = `faq-heading-${idx}`;

            return (
              <div
                key={idx}
                className="rounded-lg overflow-hidden"
                style={{
                  backgroundColor: "#121210",
                  border: "1px solid #2a2a28",
                }}
              >
                {/* Question button */}
                <button
                  id={headingId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(idx)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggle(idx);
                    }
                  }}
                  className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors"
                  style={{ color: "#FFFFFF" }}
                >
                  <span className="text-base font-medium pr-4 md:text-lg">
                    {faq.question}
                  </span>
                  <span
                    className="flex-shrink-0 text-lg transition-transform duration-200"
                    style={{
                      color: "#92B090",
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    }}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>

                {/* Answer panel */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={headingId}
                  style={{
                    maxHeight: isOpen ? "500px" : "0px",
                    opacity: isOpen ? 1 : 0,
                    transition: "max-height 300ms ease, opacity 200ms ease",
                    overflow: "hidden",
                  }}
                >
                  <div
                    className="px-5 pb-5 text-sm leading-relaxed md:text-base"
                    style={{ color: "rgba(255, 255, 255, 0.7)" }}
                  >
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
