"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  type ThemeName,
} from "@/lib/theme/palette";

interface ThemeContextValue {
  theme: ThemeName;
  isReady: boolean;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: ThemeName) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(DEFAULT_THEME);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const nextTheme = document.documentElement.dataset.theme;
    const resolvedTheme = nextTheme === "light" || nextTheme === "dark"
      ? nextTheme
      : DEFAULT_THEME;

    applyTheme(resolvedTheme);
    setThemeState(resolvedTheme);
    setIsReady(true);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      isReady,
      setTheme: (nextTheme) => {
        setThemeState(nextTheme);
        applyTheme(nextTheme);
        window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      },
      toggleTheme: () => {
        const nextTheme = theme === "dark" ? "light" : "dark";
        setThemeState(nextTheme);
        applyTheme(nextTheme);
        window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      },
    }),
    [isReady, theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
