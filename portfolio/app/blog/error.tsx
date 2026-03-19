"use client";

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="section-padding">
      <div className="card mx-auto max-w-2xl p-8 text-center shadow-inner-highlight">
        <span className="eyebrow">Blog</span>
        <h1 className="mt-2 text-h2 font-semibold text-ink">Something went wrong</h1>
        <div className="section-rule mx-auto" />
        <p className="text-body text-ink-secondary">
          {error.message || "The blog could not be loaded right now."}
        </p>
        <button type="button" onClick={reset} className="btn-accent mt-6 text-sm">
          Try again
        </button>
      </div>
    </section>
  );
}
