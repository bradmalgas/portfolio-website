"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { formatShortDate } from "@/lib/blog/utils";
import type { PostListItem } from "@/types/blog";

interface PostCardProps {
  post: PostListItem;
  prioritizeImage?: boolean;
}

function isInteractiveTarget(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest("a, button, input, textarea, select"));
}

export default function PostCard({ post, prioritizeImage = false }: PostCardProps) {
  const router = useRouter();
  const postHref = `/blog/${post.slug}`;

  function handleOpenPost() {
    router.push(postHref);
  }

  return (
    <article
      role="link"
      tabIndex={0}
      aria-label={`Read ${post.title}`}
      onClick={(event) => {
        if (isInteractiveTarget(event.target)) {
          return;
        }

        handleOpenPost();
      }}
      onKeyDown={(event) => {
        if (isInteractiveTarget(event.target)) {
          return;
        }

        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleOpenPost();
        }
      }}
      className="card group relative flex h-full cursor-pointer flex-col overflow-hidden shadow-inner-highlight transition-colors duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background md:hover:border-accent/30"
    >
      {post.cover_image ? (
        <div className="relative aspect-[16/10] overflow-hidden border-b border-border bg-surface-raised sm:aspect-[16/9]">
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={prioritizeImage}
          />
        </div>
      ) : (
        <div className="relative aspect-[16/9] overflow-hidden border-b border-border bg-gradient-to-br from-accent/25 via-surface-raised to-background">
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-accent/20 to-transparent" />
        </div>
      )}

      <div className="relative flex flex-1 flex-col gap-3 p-5 sm:gap-4 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <Link
            href={`/blog/category/${encodeURIComponent(post.category)}#blog-top`}
            className="tag relative z-20"
          >
            {post.category}
          </Link>
          <span className="text-xs text-ink-tertiary sm:text-body-sm">{post.view_count} views</span>
        </div>

        <div className="space-y-2.5 sm:space-y-3">
          <Link href={postHref} className="block">
            <h3 className="text-[1.28rem] font-semibold leading-[1.16] tracking-[-0.025em] text-ink transition-colors duration-200 md:group-hover:text-accent-hover sm:text-h3">
              {post.title}
            </h3>
          </Link>
          {post.description ? (
            <p className="line-clamp-3 text-body-sm text-ink-secondary sm:line-clamp-2 sm:text-body">{post.description}</p>
          ) : null}
        </div>

        {post.tags.length > 0 ? (
          <div className="hidden flex-wrap gap-2 sm:flex">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tag/${encodeURIComponent(tag)}#blog-top`}
                className="tag"
              >
                {tag}
              </Link>
            ))}
          </div>
        ) : null}

        <div className="mt-auto flex flex-wrap gap-x-4 gap-y-2 text-xs text-ink-tertiary sm:text-body-sm">
          <span>{formatShortDate(post.published_at) ?? "Unscheduled"}</span>
          <span>{post.reading_time_minutes ?? 1} min read</span>
        </div>
      </div>
    </article>
  );
}
