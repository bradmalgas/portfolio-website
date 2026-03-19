import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section-padding">
      <div className="card mx-auto max-w-2xl p-8 text-center shadow-inner-highlight">
        <span className="eyebrow">404</span>
        <h1 className="mt-2 text-h2 font-semibold text-ink">Page not found</h1>
        <div className="section-rule mx-auto" />
        <p className="text-body text-ink-secondary">
          The page you were looking for does not exist, or it may have moved.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-accent text-sm">
            Back home
          </Link>
          <Link href="/blog" className="btn-ghost text-sm">
            Browse the blog
          </Link>
        </div>
      </div>
    </section>
  );
}
