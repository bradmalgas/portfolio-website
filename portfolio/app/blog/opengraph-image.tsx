import { ImageResponse } from "next/og";

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const alt = "Brad Malgas Blog";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function BlogOpenGraphImage() {
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
            left: 0,
            right: 0,
            bottom: 0,
            height: 180,
            background:
              "radial-gradient(circle at 50% 100%, rgba(124,110,255,0.45), rgba(124,110,255,0) 70%)",
          }}
        />
        <div style={{ fontSize: 28, color: "rgb(154,143,255)" }}>Brad Malgas</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 920 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              borderRadius: 999,
              border: "1px solid rgba(124,110,255,0.35)",
              background: "rgba(124,110,255,0.12)",
              padding: "10px 18px",
              fontSize: 22,
              color: "rgb(154,143,255)",
              alignSelf: "flex-start",
            }}
          >
            Blog
          </div>
          <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.05 }}>
            Brad Malgas Blog
          </div>
          <div style={{ fontSize: 28, color: "rgb(136,136,168)", lineHeight: 1.4 }}>
            Writing about software engineering, Azure, side projects, and practical lessons from shipping real work.
          </div>
        </div>
        <div style={{ fontSize: 24, color: "rgb(136,136,168)" }}>bradmalgas.com/blog</div>
      </div>
    ),
    size,
  );
}
