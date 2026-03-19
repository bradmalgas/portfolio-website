import Image from "next/image";
import Link from "next/link";

import type { PostListItem } from "@/types/blog";

interface PostCardProps {
  post: PostListItem;
}

function formatMetaDate(date: string | null) {
  if (!date) {
    return "Unscheduled";
  }

  return new Intl.DateTimeFormat("en-ZA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="card group flex h-full flex-col overflow-hidden shadow-inner-highlight transition-all duration-250 hover:-translate-y-1 hover:border-accent/40 hover:shadow-glow">
      <Link href={`/blog/${post.slug}`} className="block">
        {post.cover_image ? (
          <div className="relative aspect-[16/9] overflow-hidden border-b border-border">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-350 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        ) : (
          <div className="relative aspect-[16/9] overflow-hidden border-b border-border bg-gradient-to-br from-accent/25 via-surface-raised to-background">
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-accent/20 to-transparent" />
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-center justify-between gap-4">
          <Link href={`/blog/category/${encodeURIComponent(post.category)}`} className="tag min-h-11">
            {post.category}
          </Link>
          <span className="text-body-sm text-ink-tertiary">{post.view_count} views</span>
        </div>

        <div className="space-y-3">
          <Link href={`/blog/${post.slug}`} className="group/title block">
            <h3 className="text-h3 font-semibold text-ink transition-colors duration-250 group-hover/title:text-accent-hover">
              {post.title}
            </h3>
          </Link>
          {post.description ? (
            <p className="line-clamp-2 text-body text-ink-secondary">{post.description}</p>
          ) : null}
        </div>

        {post.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link key={tag} href={`/blog/tag/${encodeURIComponent(tag)}`} className="tag min-h-11">
                {tag}
              </Link>
            ))}
          </div>
        ) : null}

        <div className="mt-auto flex flex-wrap gap-x-4 gap-y-2 text-body-sm text-ink-tertiary">
          <span>{formatMetaDate(post.published_at)}</span>
          <span>{post.reading_time_minutes ?? 1} min read</span>
        </div>
      </div>
    </article>
  );
}
