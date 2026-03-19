import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import GiscusComments from "@/app/components/blog/GiscusComments";
import MarkdownRenderer from "@/app/components/blog/MarkdownRenderer";
import ReactionBar from "@/app/components/blog/ReactionBar";
import ShareButtons from "@/app/components/blog/ShareButtons";
import TableOfContents from "@/app/components/blog/TableOfContents";
import FadeIn from "@/app/components/ui/FadeIn";
import {
  getAdjacentPublishedPosts,
  getPublishedPostBySlug,
  incrementViewCount,
} from "@/lib/blog/data";
import { formatDate, getPostUrl, getTableOfContents } from "@/lib/blog/utils";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.description ?? undefined,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description ?? undefined,
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.published_at ?? undefined,
      images: [`/blog/${post.slug}/opengraph-image`],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description ?? undefined,
      images: [`/blog/${post.slug}/opengraph-image`],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const adjacentPosts = await getAdjacentPublishedPosts(post);
  void incrementViewCount(slug).catch((error) => {
    console.error(`Failed to increment view count for ${slug}`, error);
  });

  const tableOfContents = getTableOfContents(post.content);
  const postUrl = getPostUrl(post.slug);

  return (
    <article className="section-padding">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <div className="mx-auto max-w-4xl">
            <Link href={`/blog/category/${encodeURIComponent(post.category)}`} className="tag">
              {post.category}
            </Link>
            <h1 className="mt-6 text-h1 font-bold text-ink">{post.title}</h1>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-body text-ink-secondary">
              <span>{formatDate(post.published_at)}</span>
              <span>{post.reading_time_minutes ?? 1} min read</span>
              <span>{post.view_count} views</span>
            </div>
            {post.description ? (
              <p className="mt-6 text-body-lg text-ink-secondary">{post.description}</p>
            ) : null}
          </div>
        </FadeIn>

        {post.cover_image ? (
          <FadeIn delay={80} className="mx-auto mt-10 max-w-5xl">
            <div className="relative aspect-[16/8] overflow-hidden rounded-lg border border-border shadow-lg">
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            </div>
          </FadeIn>
        ) : null}

        <div className="mt-12 grid gap-8 xl:grid-cols-[minmax(0,1fr)_18rem]">
          <FadeIn delay={120}>
            <div className="space-y-8">
              <MarkdownRenderer content={post.content} />

              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link key={tag} href={`/blog/tag/${encodeURIComponent(tag)}`} className="tag">
                    {tag}
                  </Link>
                ))}
              </div>

              <ReactionBar slug={post.slug} />
              <ShareButtons title={post.title} url={postUrl} />
              <GiscusComments />

              <nav className="grid gap-4 md:grid-cols-2">
                <div className="card p-5 shadow-inner-highlight">
                  <p className="text-body-sm uppercase tracking-widest text-ink-tertiary">
                    Previous
                  </p>
                  {adjacentPosts.previous ? (
                    <Link
                      href={`/blog/${adjacentPosts.previous.slug}`}
                      className="mt-3 block text-body font-medium text-ink transition-colors duration-250 hover:text-accent-hover"
                    >
                      {adjacentPosts.previous.title}
                    </Link>
                  ) : (
                    <p className="mt-3 text-body text-ink-secondary">
                      No previous post in this category.
                    </p>
                  )}
                </div>

                <div className="card p-5 shadow-inner-highlight">
                  <p className="text-body-sm uppercase tracking-widest text-ink-tertiary">
                    Next
                  </p>
                  {adjacentPosts.next ? (
                    <Link
                      href={`/blog/${adjacentPosts.next.slug}`}
                      className="mt-3 block text-body font-medium text-ink transition-colors duration-250 hover:text-accent-hover"
                    >
                      {adjacentPosts.next.title}
                    </Link>
                  ) : (
                    <p className="mt-3 text-body text-ink-secondary">
                      No next post in this category.
                    </p>
                  )}
                </div>
              </nav>
            </div>
          </FadeIn>

          <FadeIn delay={150} className="hidden xl:block">
            <TableOfContents items={tableOfContents} />
          </FadeIn>
        </div>

        <div className="mt-8 xl:hidden">
          <TableOfContents items={tableOfContents} />
        </div>
      </div>
    </article>
  );
}
