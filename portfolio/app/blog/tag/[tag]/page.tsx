import type { Metadata } from "next";
import Link from "next/link";

import BlogPagination from "@/app/components/blog/BlogPagination";
import PostCard from "@/app/components/blog/PostCard";
import FadeIn from "@/app/components/ui/FadeIn";
import { BLOG_PAGE_SIZE } from "@/lib/blog/constants";
import { getPublishedPosts } from "@/lib/blog/data";
import { parsePositiveInt } from "@/lib/blog/utils";

interface TagPageProps {
  params: Promise<{
    tag: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  return {
    title: `${decodedTag} Posts`,
    description: `Articles tagged ${decodedTag} on Brad Malgas' blog.`,
    alternates: {
      canonical: `/blog/tag/${encodeURIComponent(decodedTag)}`,
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const [{ tag }, query] = await Promise.all([params, searchParams]);
  const decodedTag = decodeURIComponent(tag);
  const page = parsePositiveInt(query.page, 1);
  const result = await getPublishedPosts({
    page,
    pageSize: BLOG_PAGE_SIZE,
    tag: decodedTag,
  });

  return (
    <section className="section-padding">
      <div className="mx-auto max-w-6xl">
        <FadeIn eager>
          <span className="eyebrow">Tag</span>
          <h1 className="mt-2 text-h1 font-bold text-ink">#{decodedTag}</h1>
          <div className="section-rule" />
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-body-lg text-ink-secondary">
              {result.total} published {result.total === 1 ? "post" : "posts"} with this tag.
            </p>
            <Link href="/blog" className="btn-ghost text-sm" scroll={false}>
              View all posts
            </Link>
          </div>
        </FadeIn>

        {result.posts.length > 0 ? (
          <FadeIn eager delay={100} className="mt-12 grid gap-6 md:grid-cols-2">
            {result.posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </FadeIn>
        ) : (
          <FadeIn eager delay={100} className="mt-12">
            <div className="card p-8 shadow-inner-highlight">
              <p className="text-body text-ink-secondary">
                There are no published posts with this tag yet.
              </p>
            </div>
          </FadeIn>
        )}

        <BlogPagination
          basePath={`/blog/tag/${encodeURIComponent(decodedTag)}`}
          currentPage={result.page}
          pageSize={result.pageSize}
          total={result.total}
          searchParams={{}}
        />
      </div>
    </section>
  );
}
