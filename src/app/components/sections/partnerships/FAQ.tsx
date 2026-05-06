"use client";

import { motion } from "framer-motion";
import FAQItem from "../../ui/FAQItem";

export const PARTNERSHIPS_FAQS = [
  {
    question: "I run a cafe / warehouse / farm / shop. Is this for me?",
    answer:
      "Yes. The strongest partners aren't AI companies — they're operators with workforces doing real work. If you record any of it (security cams, QA cams, training footage, smart-glasses) we'll license the archive. If you don't yet, we ship the cameras and pay you per hour to capture.",
  },
  {
    question: "What if my business doesn't already have cameras?",
    answer:
      "Common — and not a blocker. We ship the rigs (chest-cam, smart-glasses, fixed mounts depending on the spec), set them up, and pay you per hour or revenue-share. Capture starts within ~2 weeks of a signed agreement.",
  },
  {
    question: "What rights do I keep on archive licenses?",
    answer:
      "Your reels, channels, and recordings stay yours. We take non-exclusive training rights to the underlying footage. We don't republish, distribute, or claim authorship.",
  },
  {
    question: "Do I need consent from employees?",
    answer:
      "Yes, and we help. We supply consent templates, opt-out workflows, and face-blurring infrastructure at no cost. You handle local compliance; we handle the data plumbing.",
  },
  {
    question: "What does a first deal usually look like?",
    answer:
      "$5K–$50K for an archive license on existing footage. $40–$120/hr for new capture, paid weekly. First call is 30 minutes and scopes both.",
  },
  {
    question: "How fast do you pay?",
    answer:
      "Archive licenses pay on signed agreement, net-15. Paid commission pays weekly via wire, PayPal, or local rail (GCash, DANA, UPI for SEA partners).",
  },
  {
    question: "What kinds of footage does Claru buy?",
    answer:
      "Hands-on work in real environments (kitchens, workshops, packaging, retail, farms, trades), POV smart-glasses and chest-cam capture, security and QA archives, drone, dash, and body-cam footage. Plus robotics manipulation and synthetic/game-engine data for partners with engineering teams.",
  },
  {
    question: "How do I become a Claru data partner?",
    answer:
      "Submit the partner intake form on this page. We review every submission within 5 business days. If your business fits an active priority, we set up a 30-minute call to scope a deal.",
  },
];

export default function FAQ() {
  return (
    <section className="py-20 md:py-32 border-t border-[var(--border-subtle)]">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <div className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--accent-primary)] mb-4">
              {"// 05"}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
              FAQ
            </h2>
            <p className="text-base md:text-lg text-[var(--text-secondary)]">
              The questions partners ask before they apply.
            </p>
          </motion.div>

          <div>
            {PARTNERSHIPS_FAQS.map((faq, i) => (
              <FAQItem
                key={faq.question}
                index={i}
                question={faq.question}
                answer={<p className="font-mono text-sm">{faq.answer}</p>}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
