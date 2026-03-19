import type { Metadata } from "next";
import Link from "next/link";

import BlogPagination from "@/app/components/blog/BlogPagination";
import BlogSearchInput from "@/app/components/blog/BlogSearchInput";
import PostCard from "@/app/components/blog/PostCard";
import { BLOG_PAGE_SIZE } from "@/lib/blog/constants";
import { getPublishedCategories, getPublishedPosts } from "@/lib/blog/data";
import { parsePositiveInt } from "@/lib/blog/utils";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Writing about side projects, Azure, software architecture, and the things I learn while building.",
  openGraph: {
    title: "Blog | Brad Malgas",
    description:
      "Writing about side projects, Azure, software architecture, and the things I learn while building.",
    images: ["/blog/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Brad Malgas",
    description:
      "Writing about side projects, Azure, software architecture, and the things I learn while building.",
    images: ["/blog/opengraph-image"],
  },
  alternates: {
    canonical: "/blog",
    types: {
      "application/rss+xml": [{ url: "/blog/feed.xml", title: "Brad Malgas Blog RSS" }],
    },
  },
};

interface BlogPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    search?: string;
    tag?: string;
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const page = parsePositiveInt(params.page, 1);
  const [categories, result] = await Promise.all([
    getPublishedCategories(),
    getPublishedPosts({
      page,
      pageSize: BLOG_PAGE_SIZE,
      category: params.category,
      tag: params.tag,
      search: params.search,
    }),
  ]);

  const activeCategory = params.category ?? "";

  return (
    <section className="section-padding">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="eyebrow">Blog</span>
            <h1 className="mt-2 text-h1 font-bold text-ink">
              Writing about side projects, Azure, and things I learn.
            </h1>
            <div className="section-rule" />
            <p className="text-body-lg text-ink-secondary">
              Notes from building software, exploring architecture, and polishing ideas until they become useful.
            </p>
          </div>

          <Link href="/blog/feed.xml" className="btn-ghost text-sm">
            RSS Feed
          </Link>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
          <BlogSearchInput
            defaultValue={params.search ?? ""}
            category={params.category}
            tag={params.tag}
          />
          <div className="flex flex-wrap gap-3">
            <Link
              href="/blog"
              scroll={false}
              className={`rounded-full border px-4 py-2 text-body-sm transition-colors duration-250 ${
                !activeCategory
                  ? "border-accent bg-accent-dim text-ink"
                  : "border-border text-ink-secondary hover:border-accent hover:text-ink"
              }`}
            >
              All
            </Link>
            {categories.map((category) => (
              <Link
                key={category.category}
                href={`/blog?category=${encodeURIComponent(category.category)}`}
                scroll={false}
                className={`rounded-full border px-4 py-2 text-body-sm transition-colors duration-250 ${
                  activeCategory === category.category
                    ? "border-accent bg-accent-dim text-ink"
                    : "border-border text-ink-secondary hover:border-accent hover:text-ink"
                }`}
              >
                {category.category} <span className="text-ink-tertiary">({category.count})</span>
              </Link>
            ))}
          </div>
        </div>

        {params.search ? (
          <div className="mt-6">
            <p className="text-body text-ink-secondary">
              Search results for <span className="text-ink">“{params.search}”</span>
            </p>
          </div>
        ) : null}

        {result.posts.length > 0 ? (
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {result.posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="mt-12">
            <div className="card p-8 shadow-inner-highlight">
              <h2 className="text-h3 font-semibold text-ink">No posts found</h2>
              <p className="mt-3 text-body text-ink-secondary">
                Try a different search term, clear the filters, or check back again soon.
              </p>
            </div>
          </div>
        )}

        <BlogPagination
          basePath="/blog"
          currentPage={result.page}
          pageSize={result.pageSize}
          total={result.total}
          searchParams={{
            category: params.category,
            search: params.search,
            tag: params.tag,
          }}
        />
      </div>
    </section>
  );
}
