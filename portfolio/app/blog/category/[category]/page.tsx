import type { Metadata } from "next";
import Link from "next/link";

import BlogPagination from "@/app/components/blog/BlogPagination";
import PrefetchRoutes from "@/app/components/blog/PrefetchRoutes";
import PostCard from "@/app/components/blog/PostCard";
import { BLOG_PAGE_SIZE } from "@/lib/blog/constants";
import { getPublishedPosts } from "@/lib/blog/data";
import { parsePositiveInt } from "@/lib/blog/utils";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: CategoryPageProps): Promise<Metadata> {
  const [{ category }, query] = await Promise.all([params, searchParams]);
  const decodedCategory = decodeURIComponent(category);
  const page = parsePositiveInt(query.page, 1);
  const shouldIndex = !query.search;
  const canonicalBase = `/blog/category/${encodeURIComponent(decodedCategory)}`;

  return {
    title: `${decodedCategory} Posts`,
    description: `Articles in the ${decodedCategory} category on Brad Malgas' blog.`,
    openGraph: {
      title: `${decodedCategory} Posts | Brad Malgas`,
      description: `Articles in the ${decodedCategory} category on Brad Malgas' blog.`,
      url: canonicalBase,
      siteName: "Brad Malgas",
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${decodedCategory} Posts | Brad Malgas`,
      description: `Articles in the ${decodedCategory} category on Brad Malgas' blog.`,
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: page > 1 && shouldIndex ? `${canonicalBase}?page=${page}` : canonicalBase,
    },
    robots: {
      index: shouldIndex,
      follow: shouldIndex,
    },
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const [{ category }, query] = await Promise.all([params, searchParams]);
  const decodedCategory = decodeURIComponent(category);
  const page = parsePositiveInt(query.page, 1);
  const result = await getPublishedPosts({
    page,
    pageSize: BLOG_PAGE_SIZE,
    category: decodedCategory,
    search: query.search,
  });

  return (
    <section id="blog-top" className="section-padding scroll-mt-32 md:scroll-mt-28">
      <div className="mx-auto max-w-6xl">
        <PrefetchRoutes hrefs={result.posts.map((post) => `/blog/${post.slug}`)} />
        <span className="eyebrow">Category</span>
        <h1 className="mt-2 text-h1 font-bold text-ink">{decodedCategory}</h1>
        <div className="section-rule" />
        <div className="flex flex-wrap items-center gap-4">
          <p className="text-body-lg text-ink-secondary">
            {result.total} published {result.total === 1 ? "post" : "posts"} in this category.
          </p>
          <Link href="/blog#post-browser" className="btn-ghost text-sm">
            View all posts
          </Link>
        </div>

        {result.posts.length > 0 ? (
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {result.posts.map((post, index) => (
              <PostCard key={post.id} post={post} prioritizeImage={index < 4} />
            ))}
          </div>
        ) : (
          <div className="mt-12">
            <div className="card p-8 shadow-inner-highlight">
              <p className="text-body text-ink-secondary">
                There are no published posts in this category yet.
              </p>
            </div>
          </div>
        )}

        <BlogPagination
          basePath={`/blog/category/${encodeURIComponent(decodedCategory)}`}
          currentPage={result.page}
          pageSize={result.pageSize}
          total={result.total}
          searchParams={{
            search: query.search,
          }}
          hash="blog-top"
        />
      </div>
    </section>
  );
}
