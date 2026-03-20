import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const stylesDir = path.join(root, "node_modules", "highlight.js", "styles");

const themes = [
  "github",
  "github-dark",
  "atom-one-light",
  "atom-one-dark",
  "stackoverflow-light",
  "stackoverflow-dark",
  "base16/atelier-heath-light",
  "base16/atelier-heath",
  "panda-syntax-light",
  "panda-syntax-dark",
];

function toExportName(themeName) {
  return themeName
    .replace(/\//g, "_")
    .replace(/-([a-z])/g, (_, c) => c.toUpperCase())
    .replace(/^([a-z])/, (_, c) => c.toUpperCase());
}

const lines = [
  "// AUTO-GENERATED — do not edit. Run scripts/generate-highlight-themes.mjs to regenerate.",
  "",
];

for (const theme of themes) {
  const css = readFileSync(path.join(stylesDir, `${theme}.css`), "utf8");
  const exportName = toExportName(theme);
  lines.push(`export const ${exportName} = ${JSON.stringify(css)};`);
  lines.push("");
  console.log(`✓ ${theme}`);
}

lines.push(`export const highlightThemeCss: Record<string, string> = {`);
for (const theme of themes) {
  lines.push(`  ${JSON.stringify(theme)}: ${toExportName(theme)},`);
}
lines.push("};");
lines.push("");

const outPath = path.join(root, "lib", "theme", "highlight-themes.generated.ts");
writeFileSync(outPath, lines.join("\n"));
console.log(`\n✓ Written to lib/theme/highlight-themes.generated.ts`);
