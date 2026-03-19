import path from "node:path";
import { readFile } from "node:fs/promises";
import { ImageResponse } from "next/og";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bradmalgas.com";

const geistRegular = readFile(path.join(process.cwd(), "lib/blog/fonts/Geist-Regular.ttf"));
const geistBold = readFile(path.join(process.cwd(), "lib/blog/fonts/Geist-Bold.ttf"));

interface BlogOpenGraphCardOptions {
  badge: string;
  title: string;
  description?: string;
  footer?: string;
}

function getTitleFontSize(title: string) {
  if (title.length > 110) {
    return 52;
  }

  if (title.length > 80) {
    return 60;
  }

  return 68;
}

export async function createBlogOpenGraphImage({
  badge,
  title,
  description,
  footer = siteUrl.replace(/^https?:\/\//, ""),
}: BlogOpenGraphCardOptions) {
  const [regularFont, boldFont] = await Promise.all([geistRegular, geistBold]);
  const titleFontSize = getTitleFontSize(title);

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
          fontFamily: '"Geist Sans"',
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: -24,
            height: 220,
            background:
              "radial-gradient(circle at 50% 100%, rgba(124,110,255,0.45), rgba(124,110,255,0) 70%)",
          }}
        />

        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "rgb(136,136,168)",
          }}
        >
          Brad Malgas
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            maxWidth: 960,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              alignSelf: "flex-start",
              borderRadius: 999,
              border: "1px solid rgba(124,110,255,0.35)",
              background: "rgba(124,110,255,0.12)",
              color: "rgb(154,143,255)",
              padding: "10px 18px",
              fontSize: 22,
            }}
          >
            {badge}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: titleFontSize,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: "-0.04em",
              textWrap: "balance",
            }}
          >
            {title}
          </div>

          {description ? (
            <div
              style={{
                display: "flex",
                maxWidth: 900,
                fontSize: 28,
                lineHeight: 1.4,
                color: "rgb(136,136,168)",
              }}
            >
              {description}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "rgb(136,136,168)",
          }}
        >
          {footer}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Geist Sans",
          data: regularFont,
          style: "normal",
          weight: 400,
        },
        {
          name: "Geist Sans",
          data: boldFont,
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
}
