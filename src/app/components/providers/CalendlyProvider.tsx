"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

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

  const openCalendly = useCallback(() => {
    setStep(1);
    setLeadData(null);
    setIsOpen(true);
  }, []);

  const advanceToCalendly = useCallback((data: LeadData) => {
    setLeadData(data);
    setStep(2);
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
      value={{ isOpen, step, leadData, openCalendly, advanceToCalendly, closeCalendly }}
    >
      {children}
    </CalendlyContext.Provider>
  );
}
