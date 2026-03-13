"use client";

import { createContext, useContext } from "react";

export interface ProspectPageContextValue {
  companyName: string;
  recipientName: string;
  createdAt: string; // ISO date string
}

const ProspectPageContext = createContext<ProspectPageContextValue | null>(null);

export function ProspectPageProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: ProspectPageContextValue;
}) {
  return (
    <ProspectPageContext.Provider value={value}>
      {children}
    </ProspectPageContext.Provider>
  );
}

export function useProspectPage(): ProspectPageContextValue {
  const ctx = useContext(ProspectPageContext);
  if (!ctx) {
    throw new Error(
      "useProspectPage must be used within a <ProspectPageProvider>"
    );
  }
  return ctx;
}
