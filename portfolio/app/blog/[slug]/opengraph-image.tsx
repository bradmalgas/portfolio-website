import { getPublishedPostBySlug } from "@/lib/blog/data";
import { createBlogOpenGraphImage } from "@/lib/blog/opengraph";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
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

  const title = post?.title ?? "Brad Malgas Blog";
  const category = post?.category ?? "Blog";

  return createBlogOpenGraphImage({
    badge: category,
    title,
    description: post?.description ?? undefined,
    footer: "bradmalgas.com",
  });
}
