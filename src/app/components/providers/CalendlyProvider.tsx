"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { DEFAULT_BOOKING_URL } from "../../lib/constants";
import posthog from "posthog-js";

export interface LeadData {
  name: string;
  email: string;
  company: string;
  projectDescription?: string;
}

interface CalendlyContextValue {
  isOpen: boolean;
  step: 1 | 2;
  leadData: LeadData | null;
  /** Base booking URL from the database (or fallback). */
  bookingUrl: string;
  openCalendly: () => void;
  advanceToCalendly: (data: LeadData) => void;
  closeCalendly: () => void;
}

export const CalendlyContext = createContext<CalendlyContextValue | null>(null);

export function useCalendly(): CalendlyContextValue {
  const ctx = useContext(CalendlyContext);
  if (!ctx) {
    throw new Error("useCalendly must be used within a CalendlyProvider");
  }
  return ctx;
}

export default function CalendlyProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [leadData, setLeadData] = useState<LeadData | null>(null);
  const [bookingUrl, setBookingUrl] = useState(DEFAULT_BOOKING_URL);

  // Fetch the configured booking URL from the database on mount
  useEffect(() => {
    fetch("/api/booking-url")
      .then((res) => res.json())
      .then((data: { url: string | null }) => {
        if (data.url) setBookingUrl(data.url);
      })
      .catch(() => {
        // Keep the fallback — no-op
      });
  }, []);

  const openCalendly = useCallback(() => {
    setStep(1);
    setLeadData(null);
    setIsOpen(true);
    posthog?.capture("calendly_modal_opened");
  }, []);

  const advanceToCalendly = useCallback((data: LeadData) => {
    setLeadData(data);
    setStep(2);
    posthog?.capture("calendly_booking_started", {
      company: data.company,
    });
  }, []);

  const closeCalendly = useCallback(() => {
    setIsOpen(false);
    // Reset state after animation completes
    setTimeout(() => {
      setStep(1);
      setLeadData(null);
    }, 300);
  }, []);

  return (
    <CalendlyContext.Provider
      value={{ isOpen, step, leadData, bookingUrl, openCalendly, advanceToCalendly, closeCalendly }}
    >
      {children}
    </CalendlyContext.Provider>
  );
}
