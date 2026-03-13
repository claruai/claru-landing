import type { Metadata } from "next";
import ProspectHeader from "./ProspectHeader";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
  other: {
    "X-Robots-Tag": "noindex, nofollow",
  },
};

export const revalidate = 86400; // ISR: re-render once per day

export default function ProspectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      <ProspectHeader />
      <main>{children}</main>
    </div>
  );
}
