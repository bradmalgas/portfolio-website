import type { MetadataRoute } from "next";

import { getPublishedCategories, getPublishedPostsForFeed } from "@/lib/blog/data";
import { getSiteUrl } from "@/lib/blog/utils";

export const revalidate = 3600;

function hasBlogConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const coreRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  if (!hasBlogConfig()) {
    return coreRoutes;
  }

  try {
    const [posts, categories] = await Promise.all([
      getPublishedPostsForFeed(),
      getPublishedCategories(),
    ]);

    const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at ?? post.published_at ?? post.created_at),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
      url: `${siteUrl}/blog/category/${encodeURIComponent(category.category)}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    }));

    return [...coreRoutes, ...postEntries, ...categoryEntries];
  } catch {
    return coreRoutes;
  }
}
