import { createBlogOpenGraphImage } from "@/lib/blog/opengraph";

export const runtime = "nodejs";
export const alt = "Brad Malgas Blog";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function BlogOpenGraphImage() {
  return createBlogOpenGraphImage({
    badge: "Blog",
    title: "Brad Malgas Blog",
    description:
      "Writing about software engineering, Azure, side projects, and practical lessons from shipping real work.",
    footer: "bradmalgas.com/blog",
  });
}
