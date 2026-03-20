import type { Metadata } from "next";
import Link from "next/link";

import BlogPagination from "@/app/components/blog/BlogPagination";
import PrefetchRoutes from "@/app/components/blog/PrefetchRoutes";
import BlogSearchInput from "@/app/components/blog/BlogSearchInput";
import PostCard from "@/app/components/blog/PostCard";
import { BLOG_PAGE_SIZE } from "@/lib/blog/constants";
import { getPublishedCategories, getPublishedPosts } from "@/lib/blog/data";
import { parsePositiveInt } from "@/lib/blog/utils";

interface BlogPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    search?: string;
    tag?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: BlogPageProps): Promise<Metadata> {
  const params = await searchParams;
  const page = parsePositiveInt(params.page, 1);
  const isFilteredView = Boolean(params.category || params.tag || params.search);
  const shouldIndex = !isFilteredView;
  const canonical =
    page > 1 && shouldIndex ? `/blog?page=${page}` : "/blog";

  return {
    title: "Blog",
    description:
      "Writing about side projects, Azure, software architecture, and the things I learn while building.",
    openGraph: {
      title: "Blog | Brad Malgas",
      description:
        "Writing about side projects, Azure, software architecture, and the things I learn while building.",
      url: "/blog",
      siteName: "Brad Malgas",
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Blog | Brad Malgas",
      description:
        "Writing about side projects, Azure, software architecture, and the things I learn while building.",
      images: ["/og-image.png"],
    },
    alternates: {
      canonical,
      types: {
        "application/rss+xml": [{ url: "/blog/feed.xml", title: "Brad Malgas Blog RSS" }],
      },
    },
    robots: {
      index: shouldIndex,
      follow: shouldIndex,
    },
  };
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
      <section
          id="blog-top"
          className="section-padding scroll-mt-24 md:scroll-mt-28"
      >
          <div className="mx-auto max-w-6xl">
              <PrefetchRoutes
                  hrefs={result.posts.map((post) => `/blog/${post.slug}`)}
              />
              <div className="flex flex-col gap-6">
                  <div className="max-w-3xl">
                      <span className="eyebrow">Blog</span>
                      <h1 className="mt-2 text-h1 font-bold text-ink">
                          Writing about side projects, Azure, and things I
                          learn.
                      </h1>
                      <div className="section-rule" />
                      <p className="text-body-lg text-ink-secondary">
                          Notes from building software, exploring architecture,
                          and polishing ideas until they become useful.
                      </p>
                  </div>
              </div>

              <div
                  id="post-browser"
                  className="mt-10 grid scroll-mt-24 items-center gap-4 md:scroll-mt-36 lg:scroll-mt-48 lg:grid-cols-[minmax(0,1fr)_auto]"
              >
                  <BlogSearchInput
                      defaultValue={params.search ?? ""}
                      category={params.category}
                      tag={params.tag}
                  />
                  <div className="-mx-1 overflow-x-auto px-1 py-1 no-scrollbar touch-pan-x [webkit-overflow-scrolling:touch]">
                      <div className="flex w-max items-center gap-3">
                          <Link
                              href="/blog#post-browser"
                              className={`inline-flex min-h-11 min-w-16 shrink-0 select-none items-center justify-center rounded-full border px-3.5 py-1 text-body-sm transition-colors duration-200 ${
                                  !activeCategory
                                      ? "border-accent bg-accent-dim text-ink"
                                      : "border-border text-ink-secondary md:hover:border-accent md:hover:bg-accent-dim md:hover:text-ink"
                              }`}
                          >
                              All
                          </Link>
                          {categories.map((category) => (
                              <Link
                                  key={category.category}
                                  href={`/blog/category/${encodeURIComponent(category.category)}#blog-top`}
                                  className={`inline-flex min-h-11 min-w-16 shrink-0 select-none items-center justify-center rounded-full border px-3.5 py-1 text-body-sm transition-colors duration-200 ${
                                      activeCategory === category.category
                                          ? "border-accent bg-accent-dim text-ink"
                                          : "border-border text-ink-secondary md:hover:border-accent md:hover:bg-accent-dim md:hover:text-ink"
                                  }`}
                              >
                                  {category.category}{" "}
                                  <span className="text-ink-tertiary">
                                      ({category.count})
                                  </span>
                              </Link>
                          ))}
                      </div>
                  </div>
              </div>

              {params.search ? (
                  <div className="mt-6">
                      <p className="text-body text-ink-secondary">
                          Search results for{" "}
                          <span className="text-ink">“{params.search}”</span>
                      </p>
                  </div>
              ) : null}

              {result.posts.length > 0 ? (
                  <div className="mt-12 grid gap-6 md:grid-cols-2">
                      {result.posts.map((post, index) => (
                          <PostCard
                              key={post.id}
                              post={post}
                              prioritizeImage={index < 4}
                          />
                      ))}
                  </div>
              ) : (
                  <div className="mt-12">
                      <div className="card p-8 shadow-inner-highlight">
                          <h2 className="text-h3 font-semibold text-ink">
                              No posts found
                          </h2>
                          <p className="mt-3 text-body text-ink-secondary">
                              Try a different search term, clear the filters, or
                              check back again soon.
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
                  hash="post-browser"
              />
          </div>
      </section>
  );
}
