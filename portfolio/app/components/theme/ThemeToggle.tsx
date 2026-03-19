"use client";

import { MoonStar, SunMedium } from "lucide-react";

import { useTheme } from "@/app/components/theme/ThemeProvider";

interface ThemeToggleProps {
  mobile?: boolean;
}

export default function ThemeToggle({ mobile = false }: ThemeToggleProps) {
  const { isReady, theme, toggleTheme } = useTheme();
  const nextThemeLabel = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center justify-center rounded-full border border-border text-sm font-medium transition-all duration-250 hover:border-accent hover:bg-accent-dim hover:text-ink ${
        mobile ? "min-h-11 min-w-11 px-3 py-2.5" : "h-10 w-10"
      }`}
      aria-label={nextThemeLabel}
      title={nextThemeLabel}
    >
      {isReady && theme === "light" ? (
        <MoonStar className="h-4 w-4 text-accent" />
      ) : (
        <SunMedium className="h-4 w-4 text-accent" />
      )}
    </button>
  );
}
