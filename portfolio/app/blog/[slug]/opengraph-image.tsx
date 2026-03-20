import { getPublishedPostBySlug } from "@/lib/blog/data";
import { createBlogOpenGraphImage } from "@/lib/blog/opengraph";

export const runtime = "nodejs";
// @vercel/og sets cache-control: public, immutable, max-age=31536000 by default.
// Do not set revalidate — it conflicts with those headers and can lock in a bad cached response.
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
  const post = await getPublishedPostBySlug(slug);

  return await createBlogOpenGraphImage({
    badge: post?.category ?? "Blog",
    title: post?.title ?? "Brad Malgas Blog",
    description: post?.description ?? undefined,
    footer: "bradmalgas.com",
  });
}
