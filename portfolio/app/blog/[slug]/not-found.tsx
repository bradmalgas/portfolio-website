import Link from "next/link";

export default function BlogPostNotFound() {
  return (
    <section className="section-padding">
      <div className="card mx-auto max-w-2xl p-8 text-center shadow-inner-highlight">
        <span className="eyebrow">Blog</span>
        <h1 className="mt-2 text-h2 font-semibold text-ink">Post not found</h1>
        <div className="section-rule mx-auto" />
        <p className="text-body text-ink-secondary">
          This article is unavailable or has not been published yet.
        </p>
        <Link href="/blog" className="btn-accent mt-6 inline-flex text-sm">
          Back to blog
        </Link>
      </div>
    </section>
  );
}
