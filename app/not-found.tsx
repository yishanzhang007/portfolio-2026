import Link from "next/link";

export default function NotFound() {
  return (
    <main className="text-body bg-cream min-h-dvh flex items-center justify-center px-[16px]">
      <div className="flex flex-col items-center gap-[16px] text-center">
        <p className="text-header text-ink font-medium">404</p>
        <p className="text-muted">This page doesn&apos;t exist.</p>
        <Link
          href="/"
          className="text-muted hover:underline hover:[text-decoration-color:var(--color-underline)] hover:[text-decoration-thickness:10%] hover:[text-underline-offset:0.2em]"
        >
          Back to index
        </Link>
      </div>
    </main>
  );
}
