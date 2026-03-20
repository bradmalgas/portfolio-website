import type { Metadata } from "next";
import {
  CalendarDays,
  Clock3,
  Eye,
  FilePenLine,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";

import GiscusComments from "@/app/components/blog/GiscusComments";
import MarkdownArticle from "@/app/components/blog/MarkdownArticle";
import PrefetchRoutes from "@/app/components/blog/PrefetchRoutes";
import PostViewTracker from "@/app/components/blog/PostViewTracker";
import ReactionBar from "@/app/components/blog/ReactionBar";
import ShareButtons from "@/app/components/blog/ShareButtons";
import TableOfContents from "@/app/components/blog/TableOfContents";
import { getAdminAccess } from "@/lib/blog/auth";
import {
  getAdjacentPublishedPosts,
  getPublishedPostBySlug,
} from "@/lib/blog/data";
import { formatDate, getPostUrl, getTableOfContents } from "@/lib/blog/utils";

const BLOG_AUTHOR_NAME = "Brad Malgas";

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
      siteName: "Brad Malgas",
      type: "article",
      publishedTime: post.published_at ?? undefined,
      // Priority: 1) dynamic per-post OG, 2) post cover image, 3) static logo PNG
      images: [
        `/blog/${post.slug}/opengraph-image`,
        ...(post.cover_image ? [post.cover_image] : []),
        `/blog/opengraph-image`,
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description ?? undefined,
      images: [`/blog/${post.slug}/opengraph-image`, `/blog/opengraph-image`],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const adminAccess = await getAdminAccess();

  const adjacentPosts = await getAdjacentPublishedPosts(post);

  const tableOfContents = getTableOfContents(post.content);
  const hasTableOfContents = tableOfContents.length > 0;
  const hasAdjacentPosts = Boolean(adjacentPosts.previous || adjacentPosts.next);
  const postUrl = getPostUrl(post.slug);
  const postEditorUrl = `/blog/editor/${post.slug}`;
  const postOpenGraphImageUrl = `/blog/${post.slug}/opengraph-image`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description ?? undefined,
    datePublished: post.published_at ?? undefined,
    dateModified: post.updated_at,
    author: {
      "@type": "Person",
      name: BLOG_AUTHOR_NAME,
    },
    publisher: {
      "@type": "Person",
      name: BLOG_AUTHOR_NAME,
    },
    mainEntityOfPage: postUrl,
    image: post.cover_image ? [post.cover_image] : [`${postUrl}/opengraph-image`],
    articleSection: post.category,
    keywords: post.tags,
  };

  return (
      <article className="section-padding">
          <div className="mx-auto max-w-6xl">
              <PostViewTracker slug={post.slug} />
              <PrefetchRoutes
                  hrefs={[
                      "/blog",
                      ...(adjacentPosts.previous
                          ? [`/blog/${adjacentPosts.previous.slug}`]
                          : []),
                      ...(adjacentPosts.next
                          ? [`/blog/${adjacentPosts.next.slug}`]
                          : []),
                  ]}
              />
              <Script
                  id={`article-jsonld-${post.slug}`}
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{
                      __html: JSON.stringify(articleJsonLd),
                  }}
              />

              <div className="mx-auto max-w-4xl">
                  <Link
                      href={`/blog/category/${encodeURIComponent(post.category)}`}
                      className="tag"
                  >
                      {post.category}
                  </Link>
                  <h1 className="mt-5 max-w-4xl text-h1 font-bold text-ink text-balance sm:mt-6">
                      {post.title}
                  </h1>
                  <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-border/70 bg-surface/65 px-3 py-2 shadow-inner-highlight sm:mt-6">
                      <Image
                          src="/images/profile-image.png"
                          alt="Brad Malgas"
                          width={72}
                          height={72}
                          className="h-9 w-9 rounded-full border border-border/70 bg-[linear-gradient(180deg,rgb(var(--color-surface-overlay-rgb)_/_0.72),rgb(var(--color-surface-rgb)_/_0.92))]"
                      />
                      <div className="min-w-0">
                          <p className="text-sm font-medium leading-tight text-ink">
                              {BLOG_AUTHOR_NAME}
                          </p>
                          <p className="text-xs leading-tight text-ink-tertiary">
                              Author
                          </p>
                      </div>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-body-sm text-ink-secondary sm:text-body">
                      <span className="inline-flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-accent" />
                          {formatDate(post.published_at)}
                      </span>
                      <span className="inline-flex items-center gap-2">
                          <Clock3 className="h-4 w-4 text-accent" />
                          {post.reading_time_minutes ?? 1} min read
                      </span>
                      {adminAccess.isAdmin ? (
                          <span className="inline-flex items-center gap-2">
                              <Eye className="h-4 w-4 text-accent" />
                              {post.view_count} views
                          </span>
                      ) : null}
                  </div>
                  {post.description ? (
                      <p className="mt-5 max-w-3xl text-body leading-relaxed text-ink-secondary sm:mt-6 sm:text-body-lg">
                          {post.description}
                      </p>
                  ) : null}
                  {adminAccess.isAdmin ? (
                      <div className="mt-6 flex flex-wrap gap-3 rounded-[1rem] bg-surface/45 p-2">
                          <Link
                              href={postEditorUrl}
                              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/45 px-4 py-2 text-body-sm font-medium text-ink-secondary transition-colors duration-250 hover:border-accent/40 hover:text-ink"
                          >
                              <FilePenLine className="h-4 w-4 text-accent" />
                              Edit post
                          </Link>
                          <Link
                              href={postOpenGraphImageUrl}
                              target="_blank"
                              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/45 px-4 py-2 text-body-sm font-medium text-ink-secondary transition-colors duration-250 hover:border-accent/40 hover:text-ink"
                          >
                              <ImageIcon className="h-4 w-4 text-accent" />
                              Open OG image
                          </Link>
                      </div>
                  ) : null}
              </div>

              {post.cover_image ? (
                  <div className="mx-auto mt-10 max-w-5xl">
                      <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-border shadow-lg sm:aspect-[16/8]">
                          <Image
                              src={post.cover_image}
                              alt={`${post.title} cover image`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 1024px) 100vw, 64rem"
                              priority
                          />
                      </div>
                  </div>
              ) : null}

              {hasTableOfContents ? (
                  <div className="mt-8 xl:hidden">
                      <TableOfContents items={tableOfContents} collapsible />
                  </div>
              ) : null}

              <div
                  className={`mt-12 ${
                      hasTableOfContents
                          ? "grid gap-8 xl:grid-cols-[minmax(0,1fr)_18rem]"
                          : "mx-auto max-w-4xl"
                  }`}
              >
                  <div className="min-w-0 space-y-8">
                      <MarkdownArticle content={post.content} />

                      <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                              <Link
                                  key={tag}
                                  href={`/blog/tag/${encodeURIComponent(tag)}`}
                                  className="tag"
                              >
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
                                  adjacentPosts.previous && adjacentPosts.next
                                      ? "md:grid-cols-2"
                                      : ""
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
                                          <span>
                                              {adjacentPosts.next.title}
                                          </span>
                                          <ChevronRight className="mt-0.5 h-4 w-4 shrink-0" />
                                      </Link>
                                  </div>
                              ) : null}
                          </nav>
                      ) : null}
                  </div>

                  {hasTableOfContents ? (
                      <div className="hidden xl:block">
                          <TableOfContents
                              items={tableOfContents}
                              className="sticky top-24"
                          />
                      </div>
                  ) : null}
              </div>
          </div>
      </article>
  );
}
