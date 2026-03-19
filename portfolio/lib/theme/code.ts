import path from "node:path";
import { readFileSync } from "node:fs";

import {
    DEFAULT_THEME,
    DEFAULT_THEME_PALETTE,
    type ThemeName,
    type ThemePaletteName,
    themePalettePresets,
} from "@/lib/theme/palette";

export const USE_CUSTOM_CODE_HIGHLIGHT_THEME = false;

type HighlightThemePair = Record<ThemeName, string>;

const highlightThemePresets: Record<ThemePaletteName, HighlightThemePair> = {
    portfolio: {
        light: "github",
        dark: "github-dark",
    },
    electric: {
        light: "atom-one-light",
        dark: "atom-one-dark",
    },
    classic: {
        light: "stackoverflow-light",
        dark: "stackoverflow-dark",
    },
    harbor: {
        light: "base16/atelier-heath-light",
        dark: "base16/atelier-heath",
    },
    journal: {
        light: "panda-syntax-light",
        dark: "panda-syntax-dark",
    },
};

function readHighlightThemeCss(themeName: string) {
    const filePath = path.join(
        process.cwd(),
        "node_modules",
        "highlight.js",
        "styles",
        `${themeName}.css`,
    );

    return readFileSync(filePath, "utf8");
}

function scopeHighlightThemeCss(css: string, selector: string) {
    const strippedCss = css.replace(/\/\*[\s\S]*?\*\//g, "");

    return strippedCss
        .split("}")
        .map((block) => block.trim())
        .filter(Boolean)
        .map((block) => {
            const separatorIndex = block.indexOf("{");

            if (separatorIndex === -1) {
                return "";
            }

            const rawSelectors = block.slice(0, separatorIndex).trim();
            const declarations = block.slice(separatorIndex + 1).trim();

            if (!rawSelectors || !declarations) {
                return "";
            }

            const scopedSelectors = rawSelectors
                .split(",")
                .map((entry) => entry.trim())
                .filter(Boolean)
                .map((entry) => `${selector} ${entry}`)
                .join(",\n");

            return `${scopedSelectors} {\n${declarations}\n}`;
        })
        .filter(Boolean)
        .join("\n\n");
}

function getMappedHighlightThemeCss() {
    const selectedPreset = highlightThemePresets[DEFAULT_THEME_PALETTE];
    const defaultThemeSelector = `html[data-code-theme-mode="mapped"]:not([data-theme])`;
    const lightThemeSelector = `html[data-code-theme-mode="mapped"][data-theme="light"]`;
    const darkThemeSelector = `html[data-code-theme-mode="mapped"][data-theme="dark"]`;
    const defaultCss = scopeHighlightThemeCss(
        readHighlightThemeCss(selectedPreset[DEFAULT_THEME]),
        defaultThemeSelector,
    );
    const lightCss = scopeHighlightThemeCss(
        readHighlightThemeCss(selectedPreset.light),
        lightThemeSelector,
    );
    const darkCss = scopeHighlightThemeCss(
        readHighlightThemeCss(selectedPreset.dark),
        darkThemeSelector,
    );

    return [defaultCss, lightCss, darkCss].join("\n\n");
}

export function getCodeThemeMode() {
    return USE_CUSTOM_CODE_HIGHLIGHT_THEME ? "custom" : "mapped";
}

export function getCodeThemeStyleSheet() {
    const selectedPalette = themePalettePresets[DEFAULT_THEME_PALETTE];
    const defaultPalette = selectedPalette[DEFAULT_THEME];
    const lightPalette = selectedPalette.light;
    const darkPalette = selectedPalette.dark;

    const serializeCodeShellVariables = (
        selector: string,
        palette: (typeof selectedPalette)[ThemeName],
        mode: ThemeName,
    ) => `
    ${selector} {
      --code-surface-rgb: ${mode === "dark" ? palette.surfaceRaisedRgb : palette.surfaceRgb};
      --code-surface-top-rgb: ${mode === "dark" ? palette.backgroundRgb : palette.surfaceOverlayRgb};
      --code-border-rgb: ${palette.borderRgb};
      --code-ink-rgb: ${palette.inkRgb};
      --code-muted-rgb: ${palette.inkSecondaryRgb};
      --code-button-rgb: ${mode === "dark" ? palette.surfaceOverlayRgb : palette.surfaceRaisedRgb};
      --code-button-hover-rgb: ${mode === "dark" ? palette.borderSubtleRgb : palette.surfaceOverlayRgb};
      --code-accent-rgb: ${palette.accentRgb};
      --code-shadow: ${palette.shadowLg};
      --code-syntax-comment-rgb: 100 116 139;
      --code-syntax-keyword-rgb: 147 197 253;
      --code-syntax-string-rgb: 134 239 172;
      --code-syntax-number-rgb: 253 224 71;
      --code-syntax-variable-rgb: 196 181 253;
      --code-syntax-deletion-rgb: 248 113 113;
    }
  `;

    const baseCodeShellCss = [
        serializeCodeShellVariables(":root", defaultPalette, DEFAULT_THEME),
        serializeCodeShellVariables(
            'html[data-theme="light"]',
            lightPalette,
            "light",
        ),
        serializeCodeShellVariables(
            'html[data-theme="dark"]',
            darkPalette,
            "dark",
        ),
    ].join("\n");

    if (USE_CUSTOM_CODE_HIGHLIGHT_THEME) {
        return baseCodeShellCss;
    }

    return `${baseCodeShellCss}\n${getMappedHighlightThemeCss()}`;
}
