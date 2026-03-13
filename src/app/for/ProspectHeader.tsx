import Link from "next/link";

export default function ProspectHeader() {
  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-md"
      style={{
        borderColor: "var(--border-subtle)",
        background: "rgba(10, 9, 8, 0.85)",
      }}
    >
      <div className="container mx-auto flex h-16 items-center px-6">
        <Link
          href="https://claru.ai"
          className="font-mono text-xl font-bold tracking-wider"
          style={{
            color: "var(--text-primary)",
            textShadow: "0 0 20px rgba(146, 176, 144, 0.2)",
          }}
        >
          CLARU
        </Link>
      </div>
    </header>
  );
}
