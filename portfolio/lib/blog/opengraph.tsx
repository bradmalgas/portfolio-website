import path from "node:path";
import { readFile } from "node:fs/promises";
import { ImageResponse } from "next/og";

import { DEFAULT_THEME, rgb, rgba, themePalettes } from "@/lib/theme/palette";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bradmalgas.com";

// Fonts live in public/fonts/ — Vercel guarantees this directory is on disk
// during serverless function execution (unlike lib/ or node_modules/).
const fontsDir = path.join(process.cwd(), "public/fonts");
const geistRegular = readFile(path.join(fontsDir, "Geist-Regular.ttf"));
const geistBold = readFile(path.join(fontsDir, "Geist-Bold.ttf"));
// Non-fatal — falls back to Bold (700) for weight-900 text if missing.
const geistBlack = readFile(path.join(fontsDir, "Geist-Black.ttf")).catch(() => null);

interface BlogOpenGraphCardOptions {
  badge: string;
  title: string;
  description?: string;
  footer?: string;
}

function getTitleFontSize(title: string) {
  if (title.length > 120) return 64;
  if (title.length > 88) return 76;
  if (title.length > 60) return 86;
  return 96;
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

  type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  const fonts: { name: string; data: Buffer; style: "normal"; weight: FontWeight }[] = [
    { name: "Geist Sans", data: regularFont, style: "normal", weight: 400 },
    { name: "Geist Sans", data: boldFont, style: "normal", weight: 700 },
    ...(blackFont
      ? [{ name: "Geist Sans", data: blackFont, style: "normal" as const, weight: 900 as const }]
      : [{ name: "Geist Sans", data: boldFont, style: "normal" as const, weight: 900 as const }]),
  ];

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


        {/* card frame */}
        <div
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            bottom: 16,
            left: 16,
            borderRadius: 24,
            border: `1px solid ${rgba(palette.accentRgb, 0.22)}`,
            background: rgba(palette.surfaceRgb, 0.70),
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 44,
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
                  paddingTop: 13,
                  paddingBottom: 13,
                  paddingLeft: 28,
                  paddingRight: 28,
                  borderRadius: 9999,
                  background: rgba(palette.accentRgb, 0.18),
                  border: `1px solid ${rgba(palette.accentRgb, 0.40)}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    color: rgb(palette.accentHoverRgb),
                    fontSize: 28,
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
              }}
            >
              {title}
            </div>

          </div>

          {/* bottom strip */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 611 611"
              width={96}
              height={96}
              fill={rgb(palette.accentHoverRgb)}
            >
              <g transform="translate(0,611) scale(0.1,-0.1)" stroke="none">
                <path d="M1222 6049 c-131 -17 -252 -84 -304 -169 -57 -93 -58 -111 -58 -741 0 -502 -2 -578 -15 -589 -11 -10 -113 -13 -418 -15 l-402 -2 -5 -309 c-4 -170 -5 -651 -4 -1069 2 -418 3 -883 3 -1032 l1 -273 211 0 211 0 58 -57 c59 -59 158 -124 240 -157 25 -10 61 -26 80 -35 l35 -17 6 -609 c4 -446 9 -620 18 -648 11 -33 43 -78 91 -127 24 -23 93 -67 135 -84 62 -26 207 -37 440 -34 l220 3 3 106 3 106 -191 7 c-198 7 -230 13 -267 48 l-22 21 -1 572 c-1 629 0 627 -62 719 -53 81 -133 131 -280 173 -121 34 -131 44 -134 133 -1 38 1 70 6 70 5 0 21 -10 37 -23 203 -168 475 -244 777 -217 160 14 283 51 436 131 103 54 190 121 290 225 169 176 282 392 337 646 25 115 25 389 0 508 -59 282 -173 499 -361 686 -152 151 -261 224 -425 284 -150 55 -210 65 -401 65 -116 0 -192 -5 -225 -14 -212 -57 -307 -106 -424 -221 l-76 -75 0 103 c0 102 0 103 25 108 162 37 315 110 387 187 88 93 86 74 92 742 6 537 7 583 24 608 10 16 29 32 43 37 14 6 94 10 178 10 170 0 204 7 229 49 30 52 13 146 -31 170 -24 13 -413 13 -510 0z m280 -2429 c71 -22 123 -54 189 -116 115 -107 170 -248 171 -434 1 -206 -77 -383 -214 -488 -71 -54 -108 -71 -186 -88 -172 -36 -329 9 -451 128 -226 221 -228 639 -5 871 126 131 322 181 496 127z" />
                <path d="M4354 6046 c-3 -8 -2 -56 3 -108 l8 -93 180 -5 c104 -3 191 -10 206 -17 15 -6 37 -27 50 -45 l24 -33 3 -425 c1 -234 4 -431 7 -437 3 -9 34 -13 107 -13 75 0 131 -7 203 -24 55 -14 101 -23 103 -22 1 2 2 212 3 468 0 408 -2 471 -17 514 -49 144 -166 226 -347 243 -51 5 -190 9 -310 10 -181 1 -218 -1 -223 -13z" />
                <path d="M2975 4614 c-161 -24 -294 -63 -410 -122 -69 -34 -209 -124 -219 -140 -3 -4 20 -28 51 -53 77 -61 216 -211 268 -289 23 -36 62 -102 84 -147 23 -46 45 -83 48 -83 4 0 45 19 92 43 85 42 87 42 196 42 102 0 114 -2 170 -30 74 -37 174 -134 203 -198 58 -125 56 -92 60 -969 l3 -808 429 0 430 0 0 775 c0 854 1 865 62 993 17 37 52 86 83 116 200 201 530 151 657 -99 61 -119 59 -91 64 -933 3 -669 6 -776 19 -802 l15 -30 -37 -16 c-21 -8 -73 -29 -117 -45 -141 -52 -215 -113 -265 -219 l-26 -55 -5 -580 c-5 -631 -3 -602 -62 -643 -20 -15 -48 -17 -194 -14 -94 1 -181 -1 -194 -6 -20 -8 -22 -14 -22 -105 0 -53 3 -101 7 -107 4 -6 90 -10 245 -10 317 0 402 16 510 95 27 19 62 57 79 83 60 94 61 109 61 733 0 654 -9 597 107 644 110 43 188 91 252 155 l61 60 210 0 210 0 0 824 c0 532 -4 852 -11 902 -33 242 -160 495 -333 667 -259 257 -655 403 -994 368 -134 -14 -215 -31 -302 -67 -152 -61 -260 -127 -363 -223 -55 -51 -95 -81 -111 -81 -2 0 -11 6 -19 14 -168 169 -390 289 -617 336 -92 19 -314 33 -375 24z" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts },
  );
}
