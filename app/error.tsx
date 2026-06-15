"use client";

import { useEffect } from "react";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="text-body bg-cream min-h-dvh flex items-center justify-center px-[16px]">
      <div className="flex flex-col items-center gap-[16px] text-center">
        <p className="text-header text-ink font-medium">Something went wrong</p>
        <p className="text-muted">An unexpected error occurred.</p>
        <button
          onClick={() => unstable_retry()}
          className="text-muted hover:underline hover:[text-decoration-color:var(--color-underline)] hover:[text-decoration-thickness:10%] hover:[text-underline-offset:0.2em]"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
