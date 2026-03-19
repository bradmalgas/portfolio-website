import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <section className="section-padding">
      <div className="card mx-auto max-w-2xl p-8 text-center shadow-inner-highlight">
        <span className="eyebrow">Access denied</span>
        <h1 className="mt-2 text-h2 font-semibold text-ink">You do not have access</h1>
        <div className="section-rule mx-auto" />
        <p className="text-body text-ink-secondary">
          This area is restricted to the configured blog admin account.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/blog" className="btn-accent text-sm">
            Back to blog
          </Link>
          <Link href="/" className="btn-ghost text-sm">
            Home
          </Link>
        </div>
      </div>
    </section>
  );
}
