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

// Google Search logo (120×120)
const pngGoogle = await sharp(svgBuffer)
  .resize(120, 120)
  .png({ compressionLevel: 0 })
  .toBuffer();
writeFileSync(path.join(publicDir, "google-logo.png"), pngGoogle);
console.log("✓ google-logo.png (120×120)");

// Full-quality logo PNG at native SVG resolution (611×611)
const pngFull = await sharp(svgBuffer)
  .resize(611, 611)
  .png({ compressionLevel: 0 })
  .toBuffer();
writeFileSync(path.join(publicDir, "logo.png"), pngFull);
console.log("✓ logo.png (611×611, full quality)");
