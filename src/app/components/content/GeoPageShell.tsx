import type { ReactNode } from "react";

export default function GeoPageShell({ children }: { children: ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--bg-primary)] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(1200px circle at 20% 10%, rgba(146, 176, 144, 0.14), transparent 55%), radial-gradient(900px circle at 80% 0%, rgba(113, 148, 106, 0.12), transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "120px 120px",
          }}
        />
      </div>
      <div className="relative z-10">{children}</div>
    </main>
  );
}
