import type { MetadataRoute } from "next";

import { getPublishedPostsForFeed } from "@/lib/blog/data";
import { getSiteUrl } from "@/lib/blog/utils";
import type { Post } from "@/types/blog";

export const revalidate = 3600;

function hasBlogConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

function parseDate(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

function getPostLastModified(post: Pick<Post, "created_at" | "published_at" | "updated_at">) {
  return (
    parseDate(post.updated_at) ??
    parseDate(post.published_at) ??
    parseDate(post.created_at)
  );
}

function getLatestPostDate(posts: Post[]) {
  return posts.reduce<Date | null>((latest, post) => {
    const nextDate = getPostLastModified(post);

    if (!nextDate) {
      return latest;
    }

    if (!latest || nextDate.getTime() > latest.getTime()) {
      return nextDate;
    }

    return latest;
  }, null);
}

function getCoreRoutes(siteUrl: string, lastModified?: Date | null): MetadataRoute.Sitemap {
  const lastModifiedEntry = lastModified ? { lastModified } : {};

  return [
    {
      url: siteUrl,
      ...lastModifiedEntry,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/blog`,
      ...lastModifiedEntry,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const coreRoutes = getCoreRoutes(siteUrl);

  if (!hasBlogConfig()) {
    return coreRoutes;
  }

  try {
    const posts = await getPublishedPostsForFeed();
    const contentLastModified = getLatestPostDate(posts);

    const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: getPostLastModified(post) ?? undefined,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    return [...getCoreRoutes(siteUrl, contentLastModified), ...postEntries];
  } catch {
    return coreRoutes;
  }
}
