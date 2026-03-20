import type { Metadata } from "next";
import Link from "next/link";

import BlogPagination from "@/app/components/blog/BlogPagination";
import PrefetchRoutes from "@/app/components/blog/PrefetchRoutes";
import PostCard from "@/app/components/blog/PostCard";
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
    openGraph: {
      title: `${decodedTag} Posts | Brad Malgas`,
      description: `Articles tagged ${decodedTag} on Brad Malgas' blog.`,
      url: `/blog/tag/${encodeURIComponent(decodedTag)}`,
      siteName: "Brad Malgas",
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${decodedTag} Posts | Brad Malgas`,
      description: `Articles tagged ${decodedTag} on Brad Malgas' blog.`,
      images: ["/og-image.png"],
    },
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
    <section id="blog-top" className="section-padding scroll-mt-32 md:scroll-mt-28">
      <div className="mx-auto max-w-6xl">
        <PrefetchRoutes hrefs={result.posts.map((post) => `/blog/${post.slug}`)} />
        <span className="eyebrow">Tag</span>
        <h1 className="mt-2 text-h1 font-bold text-ink">#{decodedTag}</h1>
        <div className="section-rule" />
        <div className="flex flex-wrap items-center gap-4">
          <p className="text-body-lg text-ink-secondary">
            {result.total} published {result.total === 1 ? "post" : "posts"} with this tag.
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
                There are no published posts with this tag yet.
              </p>
            </div>
          </div>
        )}

        <BlogPagination
          basePath={`/blog/tag/${encodeURIComponent(decodedTag)}`}
          currentPage={result.page}
          pageSize={result.pageSize}
          total={result.total}
          searchParams={{}}
          hash="blog-top"
        />
      </div>
    </section>
  );
}
