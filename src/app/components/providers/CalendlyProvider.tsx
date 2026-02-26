"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export const CALENDLY_URL =
  "https://calendly.com/claru?background_color=0a0908&text_color=e8e8e8&primary_color=92B090&hide_gdpr_banner=1";

interface CalendlyContextValue {
  isOpen: boolean;
  openCalendly: () => void;
  closeCalendly: () => void;
}

const CalendlyContext = createContext<CalendlyContextValue | null>(null);

export function useCalendly(): CalendlyContextValue {
  const ctx = useContext(CalendlyContext);
  if (!ctx) {
    throw new Error("useCalendly must be used within a CalendlyProvider");
  }
  return ctx;
}

export default function CalendlyProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openCalendly = useCallback(() => setIsOpen(true), []);
  const closeCalendly = useCallback(() => setIsOpen(false), []);

  return (
    <CalendlyContext.Provider value={{ isOpen, openCalendly, closeCalendly }}>
      {children}
    </CalendlyContext.Provider>
  );
}
