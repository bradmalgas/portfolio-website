import { createBlogOpenGraphImage } from "@/lib/blog/opengraph";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const alt = "Brad Malgas — Senior Software Developer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function SiteOpenGraphImage() {
  return createBlogOpenGraphImage({
    badge: "Portfolio",
    title: "Brad Malgas",
    description:
      "Senior Software Developer building cloud-native systems, portfolio projects, and practical writing on engineering.",
    footer: "bradmalgas.com",
  });
}
