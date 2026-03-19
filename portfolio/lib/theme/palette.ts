export type ThemeName = "dark" | "light";

type ThemePalette = {
  backgroundRgb: string;
  surfaceRgb: string;
  surfaceRaisedRgb: string;
  surfaceOverlayRgb: string;
  borderRgb: string;
  borderSubtleRgb: string;
  inkRgb: string;
  inkSecondaryRgb: string;
  inkTertiaryRgb: string;
  accentRgb: string;
  accentHoverRgb: string;
  syntaxAccentRgb: string;
  syntaxStringRgb: string;
  syntaxNumberRgb: string;
  syntaxVariableRgb: string;
  syntaxDeletionRgb: string;
  shadowSm: string;
  shadowDefault: string;
  shadowLg: string;
  shadowXl: string;
  innerHighlight: string;
};

export const DEFAULT_THEME: ThemeName = "dark";
export const THEME_STORAGE_KEY = "bradmalgas-theme";

export const themePalettes: Record<ThemeName, ThemePalette> = {
  dark: {
    backgroundRgb: "13 11 9",
    surfaceRgb: "22 18 15",
    surfaceRaisedRgb: "29 24 20",
    surfaceOverlayRgb: "38 31 26",
    borderRgb: "63 51 42",
    borderSubtleRgb: "40 32 26",
    inkRgb: "244 239 232",
    inkSecondaryRgb: "182 167 150",
    inkTertiaryRgb: "117 103 90",
    accentRgb: "193 128 78",
    accentHoverRgb: "224 163 116",
    syntaxAccentRgb: "224 163 116",
    syntaxStringRgb: "145 196 168",
    syntaxNumberRgb: "230 183 108",
    syntaxVariableRgb: "126 176 208",
    syntaxDeletionRgb: "226 126 126",
    shadowSm: "0 1px 4px rgba(0,0,0,0.5)",
    shadowDefault: "0 4px 20px rgba(0,0,0,0.55)",
    shadowLg: "0 12px 40px rgba(0,0,0,0.65)",
    shadowXl: "0 24px 64px rgba(0,0,0,0.75)",
    innerHighlight: "inset 0 1px 0 rgba(255,255,255,0.06)",
  },
  light: {
    backgroundRgb: "247 242 234",
    surfaceRgb: "255 252 247",
    surfaceRaisedRgb: "252 247 240",
    surfaceOverlayRgb: "243 235 225",
    borderRgb: "217 204 187",
    borderSubtleRgb: "231 222 212",
    inkRgb: "34 27 21",
    inkSecondaryRgb: "98 82 68",
    inkTertiaryRgb: "146 126 108",
    accentRgb: "163 96 48",
    accentHoverRgb: "193 123 73",
    syntaxAccentRgb: "163 96 48",
    syntaxStringRgb: "42 134 96",
    syntaxNumberRgb: "176 114 37",
    syntaxVariableRgb: "43 111 165",
    syntaxDeletionRgb: "200 74 74",
    shadowSm: "0 1px 3px rgba(15,23,42,0.08)",
    shadowDefault: "0 12px 30px rgba(15,23,42,0.08)",
    shadowLg: "0 18px 44px rgba(15,23,42,0.12)",
    shadowXl: "0 28px 70px rgba(15,23,42,0.16)",
    innerHighlight: "inset 0 1px 0 rgba(255,255,255,0.75)",
  },
};

function serializePalette(palette: ThemePalette) {
  return [
    `--color-background-rgb: ${palette.backgroundRgb};`,
    `--color-surface-rgb: ${palette.surfaceRgb};`,
    `--color-surface-raised-rgb: ${palette.surfaceRaisedRgb};`,
    `--color-surface-overlay-rgb: ${palette.surfaceOverlayRgb};`,
    `--color-border-rgb: ${palette.borderRgb};`,
    `--color-border-subtle-rgb: ${palette.borderSubtleRgb};`,
    `--color-ink-rgb: ${palette.inkRgb};`,
    `--color-ink-secondary-rgb: ${palette.inkSecondaryRgb};`,
    `--color-ink-tertiary-rgb: ${palette.inkTertiaryRgb};`,
    `--color-accent-rgb: ${palette.accentRgb};`,
    `--color-accent-hover-rgb: ${palette.accentHoverRgb};`,
    `--color-syntax-accent-rgb: ${palette.syntaxAccentRgb};`,
    `--color-syntax-string-rgb: ${palette.syntaxStringRgb};`,
    `--color-syntax-number-rgb: ${palette.syntaxNumberRgb};`,
    `--color-syntax-variable-rgb: ${palette.syntaxVariableRgb};`,
    `--color-syntax-deletion-rgb: ${palette.syntaxDeletionRgb};`,
    `--shadow-sm: ${palette.shadowSm};`,
    `--shadow-card: ${palette.shadowDefault};`,
    `--shadow-card-lg: ${palette.shadowLg};`,
    `--shadow-card-xl: ${palette.shadowXl};`,
    `--shadow-inner-highlight: ${palette.innerHighlight};`,
  ].join("");
}

export function getThemeStyleSheet() {
  return `
    :root {
      color-scheme: ${DEFAULT_THEME};
      ${serializePalette(themePalettes[DEFAULT_THEME])}
    }

    :root[data-theme="dark"] {
      color-scheme: dark;
      ${serializePalette(themePalettes.dark)}
    }

    :root[data-theme="light"] {
      color-scheme: light;
      ${serializePalette(themePalettes.light)}
    }
  `;
}

function rgbWithCommas(value: string) {
  return value.trim().split(/\s+/).join(", ");
}

export function rgb(value: string) {
  return `rgb(${rgbWithCommas(value)})`;
}

export function rgba(value: string, alpha: number) {
  return `rgba(${rgbWithCommas(value)}, ${alpha})`;
}
