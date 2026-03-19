import type { Metadata } from "next";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const hasTableOfContents = tableOfContents.length > 0;
  const hasAdjacentPosts = Boolean(adjacentPosts.previous || adjacentPosts.next);
  const postUrl = getPostUrl(post.slug);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description ?? undefined,
    datePublished: post.published_at ?? undefined,
    dateModified: post.updated_at,
    author: {
      "@type": "Person",
      name: "Brad Malgas",
    },
    publisher: {
      "@type": "Person",
      name: "Brad Malgas",
    },
    mainEntityOfPage: postUrl,
    image: post.cover_image ? [post.cover_image] : [`${postUrl}/opengraph-image`],
    articleSection: post.category,
    keywords: post.tags,
  };

  return (
    <article className="section-padding">
      <div className="mx-auto max-w-6xl">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />

        <FadeIn eager>
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
          <FadeIn eager delay={80} className="mx-auto mt-10 max-w-5xl">
            <div className="relative aspect-[16/8] overflow-hidden rounded-lg border border-border shadow-lg">
              <Image
                src={post.cover_image}
                alt={`${post.title} cover image`}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            </div>
          </FadeIn>
        ) : null}

        {hasTableOfContents ? (
          <div className="mt-8 xl:hidden">
            <TableOfContents items={tableOfContents} collapsible />
          </div>
        ) : null}

        <div
          className={`mt-12 ${
            hasTableOfContents ? "grid gap-8 xl:grid-cols-[minmax(0,1fr)_18rem]" : "mx-auto max-w-4xl"
          }`}
        >
          <FadeIn eager delay={120} className="min-w-0 space-y-8">
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

            {hasAdjacentPosts ? (
              <nav
                className={`grid gap-4 ${
                  adjacentPosts.previous && adjacentPosts.next ? "md:grid-cols-2" : ""
                }`}
              >
                {adjacentPosts.previous ? (
                  <div className="card p-5 shadow-inner-highlight">
                    <p className="text-body-sm uppercase tracking-widest text-ink-tertiary">
                      Previous
                    </p>
                    <Link
                      href={`/blog/${adjacentPosts.previous.slug}`}
                      className="mt-3 flex items-start gap-3 text-body font-medium text-ink transition-colors duration-250 hover:text-accent-hover"
                    >
                      <ChevronLeft className="mt-0.5 h-4 w-4 shrink-0" />
                      {adjacentPosts.previous.title}
                    </Link>
                  </div>
                ) : null}

                {adjacentPosts.next ? (
                  <div className="card p-5 shadow-inner-highlight">
                    <p className="text-body-sm uppercase tracking-widest text-ink-tertiary">
                      Next
                    </p>
                    <Link
                      href={`/blog/${adjacentPosts.next.slug}`}
                      className="mt-3 flex items-start justify-between gap-3 text-body font-medium text-ink transition-colors duration-250 hover:text-accent-hover"
                    >
                      <span>{adjacentPosts.next.title}</span>
                      <ChevronRight className="mt-0.5 h-4 w-4 shrink-0" />
                    </Link>
                  </div>
                ) : null}
              </nav>
            ) : null}
          </FadeIn>

          {hasTableOfContents ? (
            <div className="hidden xl:block">
              <TableOfContents items={tableOfContents} className="sticky top-24" />
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
