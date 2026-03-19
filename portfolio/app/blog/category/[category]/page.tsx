import type { Metadata } from "next";
import Link from "next/link";

import BlogPagination from "@/app/components/blog/BlogPagination";
import PostCard from "@/app/components/blog/PostCard";
import FadeIn from "@/app/components/ui/FadeIn";
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

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);

  return {
    title: `${decodedCategory} Posts`,
    description: `Articles in the ${decodedCategory} category on Brad Malgas' blog.`,
    alternates: {
      canonical: `/blog/category/${encodeURIComponent(decodedCategory)}`,
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
    <section className="section-padding">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <span className="eyebrow">Category</span>
          <h1 className="mt-2 text-h1 font-bold text-ink">{decodedCategory}</h1>
          <div className="section-rule" />
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-body-lg text-ink-secondary">
              {result.total} published {result.total === 1 ? "post" : "posts"} in this category.
            </p>
            <Link href="/blog" className="btn-ghost text-sm">
              View all posts
            </Link>
          </div>
        </FadeIn>

        {result.posts.length > 0 ? (
          <FadeIn delay={80} className="mt-12 grid gap-6 md:grid-cols-2">
            {result.posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </FadeIn>
        ) : (
          <FadeIn delay={80} className="mt-12">
            <div className="card p-8 shadow-inner-highlight">
              <p className="text-body text-ink-secondary">
                There are no published posts in this category yet.
              </p>
            </div>
          </FadeIn>
        )}

        <BlogPagination
          basePath={`/blog/category/${encodeURIComponent(decodedCategory)}`}
          currentPage={result.page}
          pageSize={result.pageSize}
          total={result.total}
          searchParams={{
            search: query.search,
          }}
        />
      </div>
    </section>
  );
}
