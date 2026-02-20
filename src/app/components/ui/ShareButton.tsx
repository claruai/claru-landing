"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Link2, Linkedin, Twitter, Mail } from "lucide-react";

interface ShareButtonProps {
  title: string;
  url: string;
  className?: string;
}

interface ShareOption {
  label: string;
  icon: typeof Share2;
  action: () => void;
}

export default function ShareButton({
  title,
  url,
  className = "",
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on Escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  // Clean up toast timeout on unmount
  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setShowToast(true);
      setIsOpen(false);

      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }

      toastTimeoutRef.current = setTimeout(() => {
        setShowToast(false);
      }, 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = url;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);

      setShowToast(true);
      setIsOpen(false);

      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }

      toastTimeoutRef.current = setTimeout(() => {
        setShowToast(false);
      }, 2000);
    }
  }, [url]);

  const handleLinkedIn = useCallback(() => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  }, [url]);

  const handleTwitter = useCallback(() => {
    const tweetText = `Check out this role at Claru: ${title}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  }, [title, url]);

  const handleEmail = useCallback(() => {
    const subject = `${title} at Claru`;
    const body = `Check out this role: ${url}`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
    setIsOpen(false);
  }, [title, url]);

  const shareOptions: ShareOption[] = [
    { label: "Copy link", icon: Link2, action: handleCopyLink },
    { label: "LinkedIn", icon: Linkedin, action: handleLinkedIn },
    { label: "Twitter / X", icon: Twitter, action: handleTwitter },
    { label: "Email", icon: Mail, action: handleEmail },
  ];

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="group flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4 py-2.5 font-mono text-sm text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-primary)]/40 hover:text-[var(--accent-primary)]"
      >
        <Share2 className="h-4 w-4" />
        <span>Share this job</span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            role="menu"
            aria-label="Share options"
            className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] py-1 shadow-lg shadow-black/30"
          >
            {shareOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.label}
                  type="button"
                  role="menuitem"
                  onClick={option.action}
                  className="flex w-full items-center gap-3 px-4 py-2.5 font-mono text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--accent-primary)]"
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span>{option.label}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            role="status"
            aria-live="polite"
            className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-lg border border-[var(--accent-primary)]/30 bg-[var(--bg-secondary)] px-4 py-2.5 font-mono text-sm text-[var(--accent-primary)] shadow-lg shadow-black/30"
          >
            <span className="flex items-center gap-2">
              <Link2 className="h-3.5 w-3.5" />
              Link copied!
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
