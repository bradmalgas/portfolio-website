import { Feed } from "feed";

import { getPublishedPostsForFeed } from "@/lib/blog/data";
import { getPostUrl, getSiteUrl } from "@/lib/blog/utils";

export async function GET() {
  const siteUrl = getSiteUrl();
  const posts = await getPublishedPostsForFeed();

  const feed = new Feed({
    title: "Brad Malgas Blog",
    description:
      "Writing about software engineering, Azure, side projects, and practical lessons from shipping real work.",
    id: `${siteUrl}/blog`,
    link: `${siteUrl}/blog`,
    language: "en",
    image: `${siteUrl}/blog/opengraph-image`,
    favicon: `${siteUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, Brad Malgas`,
    updated: posts[0]?.updated_at ? new Date(posts[0].updated_at) : new Date(),
    author: {
      name: "Brad Malgas",
      email: "brad@bradmalgas.com",
      link: siteUrl,
    },
  });

  for (const post of posts) {
    feed.addItem({
      id: getPostUrl(post.slug),
      title: post.title,
      link: getPostUrl(post.slug),
      description: post.description ?? undefined,
      content: post.content.slice(0, 500),
      date: new Date(post.published_at ?? post.created_at),
      category: [{ name: post.category }, ...post.tags.map((tag) => ({ name: tag }))],
    });
  }

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
