import { CalendarDays, Clock3, FilePenLine, ImageIcon, TriangleAlert } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { forbidden, notFound, redirect } from "next/navigation";

import MarkdownArticle from "@/app/components/blog/MarkdownArticle";
import ShareButtons from "@/app/components/blog/ShareButtons";
import TableOfContents from "@/app/components/blog/TableOfContents";
import { getAdminAccess } from "@/lib/blog/auth";
import { getAdminPostBySlug } from "@/lib/blog/data";
import { formatDate, getPostUrl, getTableOfContents } from "@/lib/blog/utils";

const BLOG_AUTHOR_NAME = "Brad Malgas";

interface BlogPreviewPageProps {
  params: Promise<{ slug: string }>;
}

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function BlogPreviewPage({ params }: BlogPreviewPageProps) {
  const { slug } = await params;

  const { userId, isAdmin } = await getAdminAccess();

  if (!userId) {
    redirect("/blog/sign-in");
  }

  if (!isAdmin) {
    forbidden();
  }

  const post = await getAdminPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const tableOfContents = getTableOfContents(post.content);
  const hasTableOfContents = tableOfContents.length > 0;
  const postUrl = getPostUrl(post.slug);
  const postEditorUrl = `/blog/editor/${post.slug}`;
  const postOpenGraphImageUrl = `/blog/${post.slug}/opengraph-image`;

  return (
    <article className="section-padding">
      <div className="mx-auto max-w-6xl">

        {/* Preview banner */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-3">
          <div className="flex items-center gap-3">
            <TriangleAlert className="h-4 w-4 shrink-0 text-amber-400" />
            <span className="text-body-sm font-medium text-amber-300">
              Draft preview — this post is not published
            </span>
            <span className="tag capitalize">{post.status}</span>
          </div>
          <Link
            href={postEditorUrl}
            className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/45 px-4 py-2 text-body-sm font-medium text-ink-secondary transition-colors duration-250 hover:border-accent/40 hover:text-ink"
          >
            <FilePenLine className="h-4 w-4 text-accent" />
            Back to editor
          </Link>
        </div>

        <div className="mx-auto max-w-4xl">
          <span className="tag">{post.category}</span>
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
              <p className="text-xs leading-tight text-ink-tertiary">Author</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-body-sm text-ink-secondary sm:text-body">
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-accent" />
              {formatDate(post.published_at) ?? "Unpublished"}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-accent" />
              {post.reading_time_minutes ?? 1} min read
            </span>
          </div>
          {post.description ? (
            <p className="mt-5 max-w-3xl text-body leading-relaxed text-ink-secondary sm:mt-6 sm:text-body-lg">
              {post.description}
            </p>
          ) : null}
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
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>

            <ShareButtons title={post.title} url={postUrl} />
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
