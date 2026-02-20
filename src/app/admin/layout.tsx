import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Claru",
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Admin layout -- minimal chrome, no public Header/Footer.
 * Dark background consistent with the Claru design system.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {children}
    </div>
  );
}
