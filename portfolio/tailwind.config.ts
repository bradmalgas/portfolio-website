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
        // Backgrounds — layered dark surfaces with a subtle blue-violet undertone
        background: "#09090E",       // page root
        surface: {
          DEFAULT: "#111119",        // section backgrounds
          raised: "#16161F",         // cards, panels
          overlay: "#1C1C28",        // hover states, popovers
        },

        // Borders — implied, never heavy
        border: {
          DEFAULT: "#22222E",        // standard border
          subtle: "#17171F",         // very faint separator
        },

        // Text
        ink: {
          DEFAULT: "#EDEEF5",        // primary — warm near-white
          secondary: "#8888A8",      // muted purple-grey
          tertiary: "#50506A",       // metadata, placeholders
        },

        // Accent — electric indigo
        accent: {
          DEFAULT: "#7C6EFF",
          hover: "#9A8FFF",
          dim: "rgba(124, 110, 255, 0.12)",  // tinted background
          glow: "rgba(124, 110, 255, 0.25)", // shadow/glow value
        },
      },

      // ── Typography ───────────────────────────────────────────────────────
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        // Display & headings — tight tracking
        "display":  ["4.5rem",  { lineHeight: "1.0", letterSpacing: "-0.04em" }],
        "h1":       ["3rem",    { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "h2":       ["2.25rem", { lineHeight: "1.1",  letterSpacing: "-0.025em" }],
        "h3":       ["1.5rem",  { lineHeight: "1.2",  letterSpacing: "-0.015em" }],
        "h4":       ["1.125rem",{ lineHeight: "1.3",  letterSpacing: "-0.01em" }],
        // Body — relaxed for readability
        "body-lg":  ["1.125rem",{ lineHeight: "1.8" }],
        "body":     ["1rem",    { lineHeight: "1.75" }],
        "body-sm":  ["0.875rem",{ lineHeight: "1.65" }],
        "label":    ["0.75rem", { lineHeight: "1.5",  letterSpacing: "0.08em" }],
      },
      letterSpacing: {
        display: "-0.04em",
        heading: "-0.025em",
        tight: "-0.01em",
        wide: "0.06em",
        widest: "0.12em",
      },

      // ── Spacing ──────────────────────────────────────────────────────────
      // Tailwind's default scale is used; semantic aliases live here
      spacing: {
        "section-y": "7rem",      // vertical section padding (desktop)
        "section-x": "clamp(1.5rem, 6vw, 8rem)", // horizontal section padding
      },

      // ── Border radius ────────────────────────────────────────────────────
      borderRadius: {
        sm:     "6px",    // tags, badges, small pills
        DEFAULT:"10px",   // buttons, inputs, small cards
        md:     "14px",   // standard cards
        lg:     "20px",   // large cards, feature panels
        xl:     "28px",   // modals, sheets
        "2xl":  "40px",   // hero elements
      },

      // ── Shadows ──────────────────────────────────────────────────────────
      boxShadow: {
        sm:      "0 1px 4px rgba(0,0,0,0.5)",
        DEFAULT: "0 4px 20px rgba(0,0,0,0.55)",
        lg:      "0 12px 40px rgba(0,0,0,0.65)",
        xl:      "0 24px 64px rgba(0,0,0,0.75)",
        "glow":     "0 0 24px rgba(124,110,255,0.3)",
        "glow-lg":  "0 0 48px rgba(124,110,255,0.35)",
        "inner-highlight": "inset 0 1px 0 rgba(255,255,255,0.06)",
      },

      // ── Transitions ──────────────────────────────────────────────────────
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
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
