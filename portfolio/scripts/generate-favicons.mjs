import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import toIco from "to-ico";

const root = path.resolve(import.meta.dirname, "..");
const publicDir = path.join(root, "public");

const svgRaw = readFileSync(path.join(root, ".stitch/logo.svg"), "utf8");

// favicon.svg — keep the original light/dark CSS intact for browsers that support SVG favicons
writeFileSync(path.join(publicDir, "favicon.svg"), svgRaw);
console.log("✓ favicon.svg");

// For rasterising: strip the media query and hardcode the brand color so
// the .ico fallback always shows one strong fixed color regardless of OS theme
const svgRaster = svgRaw.replace(/<style>[\s\S]*?<\/style>/g, '<style>path { fill: #2563EB; }</style>');
const svgBuffer = Buffer.from(svgRaster);

async function toPng(size) {
  return sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toBuffer();
}

// Generate all sizes
const [png16, png32, png180] = await Promise.all([
  toPng(16),
  toPng(32),
  toPng(180),
]);

writeFileSync(path.join(publicDir, "favicon-16x16.png"), png16);
console.log("✓ favicon-16x16.png");

writeFileSync(path.join(publicDir, "favicon-32x32.png"), png32);
console.log("✓ favicon-32x32.png");

writeFileSync(path.join(publicDir, "apple-touch-icon.png"), png180);
console.log("✓ apple-touch-icon.png");

// .ico bundles 16 and 32
const ico = await toIco([png16, png32]);
writeFileSync(path.join(publicDir, "favicon.ico"), ico);
console.log("✓ favicon.ico");
