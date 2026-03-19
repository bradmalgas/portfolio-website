import path from "node:path";
import { readFile } from "node:fs/promises";
import { ImageResponse } from "next/og";

import { DEFAULT_THEME, rgb, rgba, themePalettes } from "@/lib/theme/palette";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bradmalgas.com";

const geistRegular = readFile(path.join(process.cwd(), "lib/blog/fonts/Geist-Regular.ttf"));
const geistBold = readFile(path.join(process.cwd(), "lib/blog/fonts/Geist-Bold.ttf"));
const geistBlack = readFile(
  path.join(process.cwd(), "node_modules/geist/dist/fonts/geist-sans/Geist-Black.ttf"),
);

interface BlogOpenGraphCardOptions {
  badge: string;
  title: string;
  description?: string;
  footer?: string;
}

function getTitleFontSize(title: string) {
  if (title.length > 120) return 48;
  if (title.length > 88) return 56;
  if (title.length > 60) return 62;
  return 68;
}

export async function createBlogOpenGraphImage({
  badge,
  title,
  description,
  footer = siteUrl.replace(/^https?:\/\//, ""),
}: BlogOpenGraphCardOptions) {
  const [regularFont, boldFont, blackFont] = await Promise.all([
    geistRegular,
    geistBold,
    geistBlack,
  ]);
  const titleFontSize = getTitleFontSize(title);
  const footerLabel = footer.replace(/^https?:\/\//, "");
  const palette = themePalettes[DEFAULT_THEME];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          // bg-gradient-to-br from-[#09090e] to-[#111119]
          background: `linear-gradient(135deg, ${rgb(palette.backgroundRgb)} 0%, ${rgb(palette.surfaceRgb)} 100%)`,
          fontFamily: '"Geist Sans"',
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* dot-grid: radial-gradient 1px dots, 24px grid, opacity-[0.08] */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `radial-gradient(${rgba(palette.accentRgb, 0.15)} 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
            opacity: 0.08,
          }}
        />

        {/* glow-top-right: -top-[100px] -right-[100px], 500×500, blur 40px */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 500,
            height: 500,
            display: "flex",
            borderRadius: 9999,
            background: `radial-gradient(circle, ${rgba(palette.accentRgb, 0.3)} 0%, transparent 70%)`,
            filter: "blur(40px)",
          }}
        />

        {/* glow-bottom-left: -bottom-[50px] -left-[50px], 300×300, blur 40px */}
        <div
          style={{
            position: "absolute",
            bottom: -50,
            left: -50,
            width: 300,
            height: 300,
            display: "flex",
            borderRadius: 9999,
            background: `radial-gradient(circle, ${rgba(palette.accentRgb, 0.18)} 0%, transparent 70%)`,
            filter: "blur(40px)",
          }}
        />

        {/* vertical rule: left-[940px], w-[1px], bg-primary/15 */}
        <div
          style={{
            position: "absolute",
            left: 940,
            top: 0,
            bottom: 0,
            width: 1,
            display: "flex",
            background: rgba(palette.accentRgb, 0.15),
          }}
        />

        {/* card frame: inset-[28px], rounded-card (28px), border-primary/22, bg-[#111119]/70, p-[56px] */}
        <div
          style={{
            position: "absolute",
            top: 28,
            right: 28,
            bottom: 28,
            left: 28,
            borderRadius: 28,
            border: `1px solid ${rgba(palette.accentRgb, 0.22)}`,
            background: rgba(palette.surfaceRgb, 0.70),
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 56,
          }}
        >
          {/* top content area: flex flex-col gap-8 (32px) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

            {/* category badge: px-4 py-1.5 rounded-full bg-primary/18 border border-primary/40 */}
            <div style={{ display: "flex" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingTop: 6,
                  paddingBottom: 6,
                  paddingLeft: 16,
                  paddingRight: 16,
                  borderRadius: 9999,
                  background: rgba(palette.accentRgb, 0.18),
                  border: `1px solid ${rgba(palette.accentRgb, 0.40)}`,
                }}
              >
                {/* text-[#9A8FFF] text-[13px] font-bold tracking-[0.14em] leading-none uppercase */}
                <div
                  style={{
                    display: "flex",
                    color: rgb(palette.accentHoverRgb),
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    lineHeight: 1,
                  }}
                >
                  {badge}
                </div>
              </div>
            </div>

            {/* title: text-[#EDEEF5] text-[68px] font-[800] leading-[1.0] tracking-[-0.04em] max-w-[840px] */}
            <div
              style={{
                display: "flex",
                color: rgb(palette.inkRgb),
                fontSize: titleFontSize,
                fontWeight: 900,
                lineHeight: 1.0,
                letterSpacing: "-0.04em",
                maxWidth: 840,
              }}
            >
              {title}
            </div>

            {/* description: text-[#888888] text-[22px] font-normal leading-relaxed max-w-[700px] */}
            {description && (
              <div
                style={{
                  display: "flex",
                  color: rgb(palette.inkSecondaryRgb),
                  fontSize: 22,
                  fontWeight: 400,
                  lineHeight: 1.625,
                  maxWidth: 700,
                }}
              >
                {description}
              </div>
            )}
          </div>

          {/* bottom strip: flex items-end justify-between w-full */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {/* author info: flex flex-col gap-3 (12px) */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* w-[40px] h-[3px] bg-primary (#7e70ff) rounded-full */}
              <div
                style={{
                  display: "flex",
                  width: 40,
                  height: 3,
                  borderRadius: 9999,
                  background: rgb(palette.accentRgb),
                }}
              />
              <div style={{ display: "flex", flexDirection: "column" }}>
                {/* text-[#888888] text-[14px] uppercase tracking-wider (0.05em) mb-0.5 (2px) */}
                <div
                  style={{
                    display: "flex",
                    color: rgb(palette.inkSecondaryRgb),
                    fontSize: 14,
                    fontWeight: 400,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: 2,
                  }}
                >
                  By
                </div>
                {/* text-white text-[22px] font-bold */}
                <div
                  style={{
                    display: "flex",
                    color: rgb(palette.inkRgb),
                    fontSize: 22,
                    fontWeight: 700,
                  }}
                >
                  Brad Malgas
                </div>
              </div>
            </div>

            {/* site url: pb-1 (4px), text-[#666666] text-[17px] font-medium tracking-[0.05em] uppercase */}
            <div style={{ display: "flex", paddingBottom: 4 }}>
              <div
                style={{
                  display: "flex",
                  color: rgb(palette.inkTertiaryRgb),
                  fontSize: 17,
                  fontWeight: 500,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                {footerLabel}
              </div>
            </div>
          </div>
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
        {
          name: "Geist Sans",
          data: blackFont,
          style: "normal",
          weight: 900,
        },
      ],
    },
  );
}
