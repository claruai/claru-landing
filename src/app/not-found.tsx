import Logo from "./components/ui/Logo";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
      <div className="text-center px-6">
        {/* Logo */}
        <div className="mb-8">
          <Logo size="sm" className="text-[var(--text-primary)] mx-auto" />
        </div>

        {/* ASCII Art */}
        <pre className="font-mono text-[var(--accent-primary)] text-xs md:text-sm mb-8 select-none">
          {`
    ╔═══════════════════════════════════════╗
    ║                                       ║
    ║   ░░░░░ ░░░░░ ░░░░░     ░░░░░ ░░░░░   ║
    ║   ░░  ░ ░░  ░ ░░  ░     ░░  ░ ░░  ░   ║
    ║   ░░░░░ ░░  ░ ░░░░░  ░  ░░░░░ ░░░░░   ║
    ║       ░ ░░  ░     ░         ░     ░   ║
    ║   ░░░░░ ░░░░░ ░░░░░     ░░░░░ ░░░░░   ║
    ║                                       ║
    ║          SIGNAL NOT FOUND             ║
    ║                                       ║
    ╚═══════════════════════════════════════╝
          `}
        </pre>

        {/* Message */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          404: Signal Lost
        </h1>
        <p className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Terminal output */}
        <pre className="font-mono text-sm text-[var(--text-tertiary)] mb-8">
          {`> searching for route...
> route not found
> status: 404`}
        </pre>

        {/* CTA */}
        <Link
          href="/"
          className="btn-primary inline-flex items-center justify-center"
        >
          [ Return Home ]
        </Link>
      </div>
    </div>
  );
}
