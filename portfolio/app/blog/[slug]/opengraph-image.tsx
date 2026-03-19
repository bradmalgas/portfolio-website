import { ImageResponse } from "next/og";

import { getPublishedPostBySlug } from "@/lib/blog/data";

export const runtime = "edge";
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

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px",
          background: "linear-gradient(180deg, rgb(9,9,14) 0%, rgb(17,17,25) 100%)",
          color: "rgb(237,238,245)",
          fontFamily: "Geist Sans, Inter, Arial, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 40,
            right: 40,
            bottom: -50,
            height: 220,
            background:
              "radial-gradient(circle at 50% 0%, rgba(124,110,255,0.45), rgba(124,110,255,0) 70%)",
          }}
        />
        <div style={{ fontSize: 28, color: "rgb(136,136,168)" }}>Brad Malgas</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 950 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              borderRadius: 999,
              border: "1px solid rgba(124,110,255,0.35)",
              background: "rgba(124,110,255,0.12)",
              color: "rgb(154,143,255)",
              padding: "10px 18px",
              fontSize: 22,
              alignSelf: "flex-start",
            }}
          >
            {category}
          </div>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.08 }}>{title}</div>
        </div>
        <div style={{ fontSize: 24, color: "rgb(136,136,168)" }}>bradmalgas.com</div>
      </div>
    ),
    size,
  );
}
