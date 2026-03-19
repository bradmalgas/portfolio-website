import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";

import type { PostFilters } from "@/types/blog";

const BLOG_REVALIDATE_SECONDS = 60;
const BLOG_REVALIDATE_PROFILE = "max";

export function withBlogCache<T>(
  keyParts: string[],
  callback: () => Promise<T>,
  tags: string[],
  revalidate = BLOG_REVALIDATE_SECONDS,
) {
  return unstable_cache(callback, keyParts, {
    tags,
    revalidate,
  })();
}

export function getPublishedPostsCacheKey(filters: PostFilters) {
  return JSON.stringify({
    page: filters.page ?? 1,
    pageSize: filters.pageSize ?? 10,
    category: filters.category ?? "",
    tag: filters.tag ?? "",
    search: filters.search ?? "",
    status: filters.status ?? "published",
  });
}

export function getPublishedPostsCacheTags(filters: PostFilters) {
  return [
    "blog:posts",
    "blog:categories",
    "blog:tags",
    `blog:status:${filters.status ?? "published"}`,
    `blog:category:${filters.category ?? "*"}`,
    `blog:tag:${filters.tag ?? "*"}`,
    `blog:search:${filters.search ?? "*"}`,
  ];
}

export function revalidateBlogContent(slug?: string, category?: string, tags: string[] = []) {
  revalidateTag("blog:posts", BLOG_REVALIDATE_PROFILE);
  revalidateTag("blog:categories", BLOG_REVALIDATE_PROFILE);
  revalidateTag("blog:tags", BLOG_REVALIDATE_PROFILE);
  revalidateTag("blog:feed", BLOG_REVALIDATE_PROFILE);
  revalidateTag("blog:status:published", BLOG_REVALIDATE_PROFILE);
  revalidateTag("blog:status:draft", BLOG_REVALIDATE_PROFILE);
  revalidateTag("blog:status:scheduled", BLOG_REVALIDATE_PROFILE);
  revalidateTag("blog:category:*", BLOG_REVALIDATE_PROFILE);
  revalidateTag("blog:tag:*", BLOG_REVALIDATE_PROFILE);
  revalidateTag("blog:search:*", BLOG_REVALIDATE_PROFILE);

  if (slug) {
    revalidateTag(`blog:post:${slug}`, BLOG_REVALIDATE_PROFILE);
    revalidatePath(`/blog/${slug}`);
    revalidatePath(`/blog/editor/${slug}`);
  }

  if (category) {
    revalidateTag(`blog:category:${category}`, BLOG_REVALIDATE_PROFILE);
    revalidatePath(`/blog/category/${encodeURIComponent(category)}`);
  }

  for (const tag of tags) {
    revalidateTag(`blog:tag:${tag}`, BLOG_REVALIDATE_PROFILE);
    revalidatePath(`/blog/tag/${encodeURIComponent(tag)}`);
  }

  revalidatePath("/blog");
  revalidatePath("/blog/editor");
  revalidatePath("/blog/feed.xml");
}
