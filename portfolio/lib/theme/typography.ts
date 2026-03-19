import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import {
  Archivo,
  Lexend,
  Manrope,
  Newsreader,
  Playfair_Display,
  Source_Sans_3,
  Space_Grotesk,
} from "next/font/google";

import { DEFAULT_THEME_PALETTE, type ThemePaletteName } from "@/lib/theme/palette";

type ThemeTypographyPreset = {
  sansFamily: string;
  displayFamily: string;
  monoFamily: string;
};

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  weight: ["600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"],
});

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  weight: ["500", "600", "700"],
});

const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans-3",
  weight: ["400", "500", "600", "700"],
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  weight: ["600", "700", "800"],
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  weight: ["500", "600", "700"],
});

export const themeFontVariables = [
  GeistSans.variable,
  GeistMono.variable,
  archivo.variable,
  spaceGrotesk.variable,
  manrope.variable,
  lexend.variable,
  sourceSans3.variable,
  playfairDisplay.variable,
  newsreader.variable,
].join(" ");

export const themeTypographyPresets: Record<ThemePaletteName, ThemeTypographyPreset> = {
  portfolio: {
    sansFamily:
      'var(--font-geist-sans), "Segoe UI Variable Text", "Segoe UI", system-ui, sans-serif',
    displayFamily:
      'var(--font-archivo), var(--font-geist-sans), "Arial Narrow", system-ui, sans-serif',
    monoFamily:
      'var(--font-geist-mono), "SFMono-Regular", ui-monospace, "Cascadia Code", monospace',
  },
  electric: {
    sansFamily:
      'var(--font-manrope), "Segoe UI Variable Text", "Segoe UI", system-ui, sans-serif',
    displayFamily:
      'var(--font-space-grotesk), var(--font-manrope), "Segoe UI Variable Text", system-ui, sans-serif',
    monoFamily:
      'var(--font-geist-mono), "SFMono-Regular", ui-monospace, "Cascadia Code", monospace',
  },
  classic: {
    sansFamily:
      'var(--font-geist-sans), "Segoe UI Variable Text", "Segoe UI", system-ui, sans-serif',
    displayFamily:
      'var(--font-playfair-display), "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif',
    monoFamily:
      'var(--font-geist-mono), "SFMono-Regular", ui-monospace, "Cascadia Code", monospace',
  },
  harbor: {
    sansFamily:
      'var(--font-source-sans-3), "Segoe UI Variable Text", "Segoe UI", system-ui, sans-serif',
    displayFamily:
      'var(--font-lexend), var(--font-source-sans-3), "Segoe UI Variable Text", system-ui, sans-serif',
    monoFamily:
      'var(--font-geist-mono), "SFMono-Regular", ui-monospace, "Cascadia Code", monospace',
  },
  journal: {
    sansFamily:
      'var(--font-source-sans-3), "Segoe UI Variable Text", "Segoe UI", system-ui, sans-serif',
    displayFamily:
      'var(--font-newsreader), "Iowan Old Style", "Palatino Linotype", Georgia, serif',
    monoFamily:
      'var(--font-geist-mono), "SFMono-Regular", ui-monospace, "Cascadia Code", monospace',
  },
};

const themeTypography = themeTypographyPresets[DEFAULT_THEME_PALETTE];

function serializeTypography(preset: ThemeTypographyPreset) {
  return [
    `--font-sans-theme: ${preset.sansFamily};`,
    `--font-display: ${preset.displayFamily};`,
    `--font-mono-theme: ${preset.monoFamily};`,
  ].join("");
}

export function getTypographyStyleSheet() {
  return `
    :root {
      ${serializeTypography(themeTypography)}
    }
  `;
}
