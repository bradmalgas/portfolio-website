import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ── Colour palette ───────────────────────────────────────────────────
      colors: {
        background: "rgb(var(--color-background-rgb) / <alpha-value>)",
        surface: {
          DEFAULT: "rgb(var(--color-surface-rgb) / <alpha-value>)",
          raised:  "rgb(var(--color-surface-raised-rgb) / <alpha-value>)",
          overlay: "rgb(var(--color-surface-overlay-rgb) / <alpha-value>)",
        },
        border: {
          DEFAULT: "rgb(var(--color-border-rgb) / <alpha-value>)",
          subtle:  "rgb(var(--color-border-subtle-rgb) / <alpha-value>)",
        },
        ink: {
          DEFAULT:   "rgb(var(--color-ink-rgb) / <alpha-value>)",
          secondary: "rgb(var(--color-ink-secondary-rgb) / <alpha-value>)",
          tertiary:  "rgb(var(--color-ink-tertiary-rgb) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--color-accent-rgb) / <alpha-value>)",
          hover:   "rgb(var(--color-accent-hover-rgb) / <alpha-value>)",
          dim:     "var(--color-accent-dim)",   // pre-computed rgba in CSS
          glow:    "var(--color-accent-glow)",  // pre-computed rgba in CSS
        },
      },

      // ── Typography ───────────────────────────────────────────────────────
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display":  ["4.5rem",  { lineHeight: "1.0",  letterSpacing: "-0.04em" }],
        "h1":       ["3rem",    { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "h2":       ["2.25rem", { lineHeight: "1.1",  letterSpacing: "-0.025em" }],
        "h3":       ["1.5rem",  { lineHeight: "1.2",  letterSpacing: "-0.015em" }],
        "h4":       ["1.125rem",{ lineHeight: "1.3",  letterSpacing: "-0.01em" }],
        "body-lg":  ["1.125rem",{ lineHeight: "1.8" }],
        "body":     ["1rem",    { lineHeight: "1.75" }],
        "body-sm":  ["0.875rem",{ lineHeight: "1.65" }],
        "label":    ["0.75rem", { lineHeight: "1.5",  letterSpacing: "0.08em" }],
      },
      letterSpacing: {
        display: "-0.04em",
        heading: "-0.025em",
        tight:   "-0.01em",
        wide:    "0.06em",
        widest:  "0.12em",
      },

      // ── Spacing ──────────────────────────────────────────────────────────
      spacing: {
        "section-y": "7rem",
        "section-x": "clamp(1.5rem, 6vw, 8rem)",
      },

      // ── Border radius ────────────────────────────────────────────────────
      borderRadius: {
        sm:      "6px",
        DEFAULT: "10px",
        md:      "14px",
        lg:      "20px",
        xl:      "28px",
        "2xl":   "40px",
      },

      // ── Shadows ──────────────────────────────────────────────────────────
      boxShadow: {
        sm:      "0 1px 4px rgba(0,0,0,0.5)",
        DEFAULT: "0 4px 20px rgba(0,0,0,0.55)",
        lg:      "0 12px 40px rgba(0,0,0,0.65)",
        xl:      "0 24px 64px rgba(0,0,0,0.75)",
        "glow":             "var(--shadow-glow)",
        "glow-lg":          "var(--shadow-glow-lg)",
        "inner-highlight":  "inset 0 1px 0 rgba(255,255,255,0.06)",
      },

      // ── Transitions ──────────────────────────────────────────────────────
      transitionTimingFunction: {
        "out-expo":     "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out-quart": "cubic-bezier(0.76, 0, 0.24, 1)",
      },
      transitionDuration: {
        "250": "250ms",
        "350": "350ms",
        "450": "450ms",
      },
    },
  },
  plugins: [],
} satisfies Config;
