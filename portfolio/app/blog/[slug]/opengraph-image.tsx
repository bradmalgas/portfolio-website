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
    // If the database is unreachable, fall back to a generic blog OG image
  }

  const title = post?.title ?? "Brad Malgas Blog";
  const category = post?.category ?? "Blog";

  return createBlogOpenGraphImage({
    badge: category,
    title,
    description: post?.description ?? undefined,
    footer: "bradmalgas.com",
  });
}
