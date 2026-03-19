export type ThemeName = "dark" | "light";
export type ThemePaletteName =
    | "portfolio"
    | "electric"
    | "classic"
    | "harbor"
    | "journal";

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

type ThemePaletteSet = Record<ThemeName, ThemePalette>;

export const DEFAULT_THEME: ThemeName = "dark";
// Change this to another preset if you want a different palette + typography pairing.
export const DEFAULT_THEME_PALETTE: ThemePaletteName = "portfolio";
export const THEME_STORAGE_KEY = "bradmalgas-theme";

export const themePalettePresets: Record<ThemePaletteName, ThemePaletteSet> = {
    portfolio: {
        dark: {
            backgroundRgb: "10 12 16",
            surfaceRgb: "18 21 28",
            surfaceRaisedRgb: "24 28 36",
            surfaceOverlayRgb: "33 39 49",
            borderRgb: "58 66 78",
            borderSubtleRgb: "35 41 51",
            inkRgb: "244 247 251",
            inkSecondaryRgb: "170 179 195",
            inkTertiaryRgb: "107 117 132",
            accentRgb: "37 99 235",
            accentHoverRgb: "96 165 250",
            syntaxAccentRgb: "147 197 253",
            syntaxStringRgb: "110 231 183",
            syntaxNumberRgb: "251 191 36",
            syntaxVariableRgb: "125 211 252",
            syntaxDeletionRgb: "248 113 113",
            shadowSm: "0 1px 4px rgba(0,0,0,0.45)",
            shadowDefault: "0 12px 30px rgba(3,7,18,0.42)",
            shadowLg: "0 18px 46px rgba(3,7,18,0.52)",
            shadowXl: "0 28px 72px rgba(3,7,18,0.62)",
            innerHighlight: "inset 0 1px 0 rgba(255,255,255,0.05)",
        },
        light: {
            backgroundRgb: "249 250 251",
            surfaceRgb: "255 255 255",
            surfaceRaisedRgb: "248 250 252",
            surfaceOverlayRgb: "241 245 249",
            borderRgb: "203 213 225",
            borderSubtleRgb: "226 232 240",
            inkRgb: "15 23 42",
            inkSecondaryRgb: "71 85 105",
            inkTertiaryRgb: "100 116 139",
            accentRgb: "37 99 235",
            accentHoverRgb: "29 78 216",
            syntaxAccentRgb: "29 78 216",
            syntaxStringRgb: "5 150 105",
            syntaxNumberRgb: "202 138 4",
            syntaxVariableRgb: "2 132 199",
            syntaxDeletionRgb: "220 38 38",
            shadowSm: "0 1px 3px rgba(15,23,42,0.06)",
            shadowDefault: "0 14px 32px rgba(15,23,42,0.08)",
            shadowLg: "0 20px 48px rgba(15,23,42,0.12)",
            shadowXl: "0 30px 74px rgba(15,23,42,0.16)",
            innerHighlight: "inset 0 1px 0 rgba(255,255,255,0.85)",
        },
    },
    electric: {
        dark: {
            backgroundRgb: "9 9 14",
            surfaceRgb: "17 17 25",
            surfaceRaisedRgb: "22 22 31",
            surfaceOverlayRgb: "28 28 40",
            borderRgb: "34 34 46",
            borderSubtleRgb: "23 23 31",
            inkRgb: "237 238 245",
            inkSecondaryRgb: "136 136 168",
            inkTertiaryRgb: "80 80 106",
            accentRgb: "124 110 255",
            accentHoverRgb: "154 143 255",
            syntaxAccentRgb: "154 143 255",
            syntaxStringRgb: "94 234 212",
            syntaxNumberRgb: "251 191 36",
            syntaxVariableRgb: "147 197 253",
            syntaxDeletionRgb: "248 113 113",
            shadowSm: "0 1px 4px rgba(0,0,0,0.5)",
            shadowDefault: "0 12px 32px rgba(5,6,18,0.5)",
            shadowLg: "0 18px 48px rgba(5,6,18,0.6)",
            shadowXl: "0 28px 74px rgba(5,6,18,0.68)",
            innerHighlight: "inset 0 1px 0 rgba(255,255,255,0.06)",
        },
        light: {
            backgroundRgb: "247 247 255",
            surfaceRgb: "255 255 255",
            surfaceRaisedRgb: "250 250 255",
            surfaceOverlayRgb: "241 241 255",
            borderRgb: "221 223 241",
            borderSubtleRgb: "233 235 247",
            inkRgb: "25 24 47",
            inkSecondaryRgb: "90 92 128",
            inkTertiaryRgb: "125 128 161",
            accentRgb: "124 110 255",
            accentHoverRgb: "154 143 255",
            syntaxAccentRgb: "99 82 255",
            syntaxStringRgb: "13 148 136",
            syntaxNumberRgb: "202 138 4",
            syntaxVariableRgb: "37 99 235",
            syntaxDeletionRgb: "220 38 38",
            shadowSm: "0 1px 3px rgba(17,24,39,0.08)",
            shadowDefault: "0 14px 32px rgba(67,56,202,0.1)",
            shadowLg: "0 20px 48px rgba(67,56,202,0.14)",
            shadowXl: "0 30px 74px rgba(67,56,202,0.18)",
            innerHighlight: "inset 0 1px 0 rgba(255,255,255,0.85)",
        },
    },
    classic: {
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
    },
    harbor: {
        dark: {
            backgroundRgb: "8 17 20",
            surfaceRgb: "13 27 31",
            surfaceRaisedRgb: "18 36 41",
            surfaceOverlayRgb: "24 48 55",
            borderRgb: "46 78 82",
            borderSubtleRgb: "28 48 52",
            inkRgb: "236 248 247",
            inkSecondaryRgb: "161 191 188",
            inkTertiaryRgb: "96 129 126",
            accentRgb: "13 148 136",
            accentHoverRgb: "45 212 191",
            syntaxAccentRgb: "94 234 212",
            syntaxStringRgb: "134 239 172",
            syntaxNumberRgb: "251 191 36",
            syntaxVariableRgb: "125 211 252",
            syntaxDeletionRgb: "248 113 113",
            shadowSm: "0 1px 4px rgba(0,0,0,0.45)",
            shadowDefault: "0 12px 30px rgba(4,20,24,0.42)",
            shadowLg: "0 18px 46px rgba(4,20,24,0.5)",
            shadowXl: "0 28px 72px rgba(4,20,24,0.58)",
            innerHighlight: "inset 0 1px 0 rgba(255,255,255,0.05)",
        },
        light: {
            backgroundRgb: "240 253 250",
            surfaceRgb: "255 255 255",
            surfaceRaisedRgb: "248 255 253",
            surfaceOverlayRgb: "229 250 247",
            borderRgb: "167 243 208",
            borderSubtleRgb: "204 251 241",
            inkRgb: "19 78 74",
            inkSecondaryRgb: "17 94 89",
            inkTertiaryRgb: "15 118 110",
            accentRgb: "13 148 136",
            accentHoverRgb: "15 118 110",
            syntaxAccentRgb: "13 148 136",
            syntaxStringRgb: "21 128 61",
            syntaxNumberRgb: "202 138 4",
            syntaxVariableRgb: "8 145 178",
            syntaxDeletionRgb: "220 38 38",
            shadowSm: "0 1px 3px rgba(15,23,42,0.06)",
            shadowDefault: "0 14px 32px rgba(13,148,136,0.10)",
            shadowLg: "0 20px 48px rgba(13,148,136,0.14)",
            shadowXl: "0 30px 74px rgba(13,148,136,0.18)",
            innerHighlight: "inset 0 1px 0 rgba(255,255,255,0.85)",
        },
    },
    journal: {
        dark: {
            backgroundRgb: "16 15 19",
            surfaceRgb: "25 24 29",
            surfaceRaisedRgb: "33 31 38",
            surfaceOverlayRgb: "45 42 52",
            borderRgb: "68 63 80",
            borderSubtleRgb: "42 39 49",
            inkRgb: "248 245 247",
            inkSecondaryRgb: "196 186 194",
            inkTertiaryRgb: "133 121 132",
            accentRgb: "236 72 153",
            accentHoverRgb: "244 114 182",
            syntaxAccentRgb: "244 114 182",
            syntaxStringRgb: "134 239 172",
            syntaxNumberRgb: "251 191 36",
            syntaxVariableRgb: "147 197 253",
            syntaxDeletionRgb: "248 113 113",
            shadowSm: "0 1px 4px rgba(0,0,0,0.48)",
            shadowDefault: "0 12px 30px rgba(17,10,21,0.44)",
            shadowLg: "0 18px 46px rgba(17,10,21,0.54)",
            shadowXl: "0 28px 72px rgba(17,10,21,0.64)",
            innerHighlight: "inset 0 1px 0 rgba(255,255,255,0.05)",
        },
        light: {
            backgroundRgb: "250 250 250",
            surfaceRgb: "255 255 255",
            surfaceRaisedRgb: "252 249 251",
            surfaceOverlayRgb: "247 242 246",
            borderRgb: "228 213 224",
            borderSubtleRgb: "240 229 237",
            inkRgb: "24 24 27",
            inkSecondaryRgb: "82 82 91",
            inkTertiaryRgb: "113 113 122",
            accentRgb: "236 72 153",
            accentHoverRgb: "219 39 119",
            syntaxAccentRgb: "219 39 119",
            syntaxStringRgb: "5 150 105",
            syntaxNumberRgb: "202 138 4",
            syntaxVariableRgb: "37 99 235",
            syntaxDeletionRgb: "220 38 38",
            shadowSm: "0 1px 3px rgba(15,23,42,0.06)",
            shadowDefault: "0 14px 32px rgba(236,72,153,0.08)",
            shadowLg: "0 20px 48px rgba(236,72,153,0.12)",
            shadowXl: "0 30px 74px rgba(236,72,153,0.16)",
            innerHighlight: "inset 0 1px 0 rgba(255,255,255,0.88)",
        },
    },
};

export const themePalettes = themePalettePresets[DEFAULT_THEME_PALETTE];

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
