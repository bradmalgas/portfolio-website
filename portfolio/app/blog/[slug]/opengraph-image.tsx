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
    // Last resort: if image generation itself fails (e.g. font load error),
    // return a minimal plain-text ImageResponse rather than a 500.
    const { ImageResponse } = await import("next/og");
    return new ImageResponse(
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#09090e",
          color: "#edeef5",
          fontSize: 48,
          fontFamily: "sans-serif",
        }}
      >
        {post?.title ?? "Brad Malgas Blog"}
      </div>,
      { width: 1200, height: 630 },
    );
  }
}
