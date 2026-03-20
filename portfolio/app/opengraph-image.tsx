import { createLogoOpenGraphImage } from "@/lib/blog/opengraph-fallback";

export const runtime = "nodejs";
export const alt = "Brad Malgas — Senior Software Developer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function SiteOpenGraphImage() {
  return createLogoOpenGraphImage();
}
