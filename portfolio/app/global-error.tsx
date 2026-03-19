"use client";

import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-ink">
        <main className="section-padding flex min-h-screen items-center justify-center">
          <div className="card mx-auto max-w-2xl p-8 text-center shadow-inner-highlight">
            <span className="eyebrow">Application Error</span>
            <h1 className="mt-2 text-h2 font-semibold text-ink">Something went wrong</h1>
            <div className="section-rule mx-auto" />
            <p className="text-body text-ink-secondary">
              {error.message || "The page could not be rendered right now."}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={reset} className="btn-accent text-sm">
                Try again
              </button>
              <Link href="/" className="btn-ghost text-sm">
                Go home
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
