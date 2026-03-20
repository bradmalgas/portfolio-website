import { createLogoOpenGraphImage } from "@/lib/blog/opengraph-fallback";

export const dynamic = "force-static";
export const runtime = "nodejs";
export const alt = "Brad Malgas Blog";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function BlogOpenGraphImage() {
  return createLogoOpenGraphImage();
}
