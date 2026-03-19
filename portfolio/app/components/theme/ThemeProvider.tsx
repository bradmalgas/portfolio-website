"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
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
const themeListeners = new Set<() => void>();
const systemThemeQuery = "(prefers-color-scheme: dark)";

function getStoredThemePreference() {
  if (typeof window === "undefined") {
    return null;
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return storedTheme === "light" || storedTheme === "dark" ? storedTheme : null;
}

function getSystemTheme(): ThemeName {
  if (typeof window === "undefined") {
    return DEFAULT_THEME;
  }

  return window.matchMedia(systemThemeQuery).matches ? "dark" : "light";
}

function resolveThemePreference(): ThemeName {
  return getStoredThemePreference() ?? getSystemTheme();
}

function applyTheme(theme: ThemeName) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

function subscribeToTheme(listener: () => void) {
  themeListeners.add(listener);

  if (themeListeners.size === 1 && typeof window !== "undefined") {
    const mediaQuery = window.matchMedia(systemThemeQuery);

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY) {
        return;
      }

      applyTheme(resolveThemePreference());
      emitThemeChange();
    };

    const handleSystemThemeChange = () => {
      if (getStoredThemePreference()) {
        return;
      }

      applyTheme(getSystemTheme());
      emitThemeChange();
    };

    window.addEventListener("storage", handleStorage);
    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      themeListeners.delete(listener);

      if (themeListeners.size === 0) {
        window.removeEventListener("storage", handleStorage);
        mediaQuery.removeEventListener("change", handleSystemThemeChange);
      }
    };
  }

  return () => {
    themeListeners.delete(listener);
  };
}

function emitThemeChange() {
  for (const listener of themeListeners) {
    listener();
  }
}

function getThemeSnapshot(): ThemeName {
  if (typeof document === "undefined") {
    return DEFAULT_THEME;
  }

  const nextTheme = document.documentElement.dataset.theme;
  return nextTheme === "light" || nextTheme === "dark"
    ? nextTheme
    : resolveThemePreference();
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    () => DEFAULT_THEME,
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      isReady: true,
      setTheme: (nextTheme) => {
        applyTheme(nextTheme);
        window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
        emitThemeChange();
      },
      toggleTheme: () => {
        const nextTheme = theme === "dark" ? "light" : "dark";
        applyTheme(nextTheme);
        window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
        emitThemeChange();
      },
    }),
    [theme],
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
