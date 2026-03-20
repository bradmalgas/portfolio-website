import path from "node:path";
import { readFile } from "node:fs/promises";

import { getPublishedPostBySlug } from "@/lib/blog/data";
import { createBlogOpenGraphImage } from "@/lib/blog/opengraph";

export const runtime = "nodejs";
// Cache OG images for 1 hour so crawlers (WhatsApp, Twitter, etc.) get a fast response.
// force-dynamic caused every request to hit the database, leading to timeouts.
export const revalidate = 3600;
export const alt = "Brad Malgas blog post";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

interface OpenGraphImageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function OpenGraphImage({ params }: OpenGraphImageProps) {
  const { slug } = await params;

  let post = null;
  try {
    post = await getPublishedPostBySlug(slug);
  } catch {
    // DB unreachable — continue with null post, fall through to generic card
  }

  try {
    return await createBlogOpenGraphImage({
      badge: post?.category ?? "Blog",
      title: post?.title ?? "Brad Malgas Blog",
      description: post?.description ?? undefined,
      footer: "bradmalgas.com",
    });
  } catch {
    // Last resort: return the pre-generated static PNG — always available, no rendering needed.
    const png = await readFile(path.join(process.cwd(), "public/og-image.png"));
    return new Response(png, { headers: { "Content-Type": "image/png" } });
  }
}
