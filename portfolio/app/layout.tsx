import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";
import "./globals.css";
import Navbar from "./components/navbar/Navbar";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import ScrollToTop from "./components/scroll-to-top/ScrollToTop";
import {
  getCodeThemeMode,
  getCodeThemeStyleSheet,
} from "@/lib/theme/code";
import {
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  getThemeStyleSheet,
} from "@/lib/theme/palette";
import {
  getTypographyStyleSheet,
  themeFontVariables,
} from "@/lib/theme/typography";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bradmalgas.com";
const siteTitle = "Brad Malgas | Independent Software Developer";
const siteDescription =
  "Independent software developer building backend, cloud and AI-enabled product systems with C#, .NET, Azure, TypeScript and Next.js.";
const blogSignInUrl = "/blog/sign-in";
const blogEditorUrl = "/blog/editor";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s | Brad Malgas",
  },
  description: siteDescription,
  icons: {
    icon: [
      { rel: "icon", type: "image/svg+xml", url: "/favicon.svg" },
      { rel: "icon", type: "image/png", sizes: "32x32", url: "/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", url: "/favicon-16x16.png" },
      { rel: "icon", type: "image/x-icon", url: "/favicon.ico" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: "Brad Malgas",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: siteTitle,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  keywords: [
    "Brad Malgas",
    "Independent Software Developer",
    "Backend Developer",
    "C# Developer",
    ".NET Developer",
    "Azure Developer",
    "TypeScript Developer",
    "Next.js Developer",
    "AI Workflows",
    "Cloud Infrastructure",
    "API Integrations",
    "Portfolio",
  ],
  alternates: {
    canonical: siteUrl,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Brad Malgas",
  url: siteUrl,
  jobTitle: "Independent Software Developer",
  description: siteDescription,
  sameAs: [
    "https://www.linkedin.com/in/brad-malgas",
    "https://github.com/bradmalgas",
    "https://bradmalgas.com/blog",
  ],
  knowsAbout: [
    "C#",
    ".NET",
    "ASP.NET Core",
    "TypeScript",
    "Next.js",
    "Microsoft Azure",
    "Azure DevOps",
    "Cloud Infrastructure",
    "API Integrations",
    "AI Product Workflows",
    "LangGraph",
    "LangChain",
    "PostgreSQL",
  ],
};
const jsonLdScript = JSON.stringify(jsonLd).replace(/</g, "\\u003c");

const themeBootScript = `
(() => {
  const storageKey = ${JSON.stringify(THEME_STORAGE_KEY)};
  const defaultTheme = ${JSON.stringify(DEFAULT_THEME)};
  const root = document.documentElement;
  const storedTheme = window.localStorage.getItem(storageKey);
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  const resolvedTheme =
    storedTheme === "light" || storedTheme === "dark"
      ? storedTheme
      : systemTheme || defaultTheme;

  root.dataset.theme = resolvedTheme;
  root.style.colorScheme = resolvedTheme;
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={themeFontVariables}
      data-code-theme-mode={getCodeThemeMode()}
    >
      <head>
        <style id="theme-palettes" dangerouslySetInnerHTML={{ __html: getThemeStyleSheet() }} />
        <style id="code-theme" dangerouslySetInnerHTML={{ __html: getCodeThemeStyleSheet() }} />
        <style
          id="theme-typography"
          dangerouslySetInnerHTML={{ __html: getTypographyStyleSheet() }}
        />
      </head>
      <body className="antialiased">
        <Script id="theme-boot" strategy="beforeInteractive">
          {themeBootScript}
        </Script>
        <Script
          id="person-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript }}
        />
        <ThemeProvider>
          <ClerkProvider
            signInUrl={blogSignInUrl}
            signInFallbackRedirectUrl={blogEditorUrl}
            signUpFallbackRedirectUrl={blogEditorUrl}
            afterSignOutUrl="/"
          >
            {/* Skip to main content — first focusable element for keyboard users */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
                     focus:z-[200] focus:px-4 focus:py-2 focus:bg-accent focus:text-white
                     focus:rounded focus:text-sm focus:font-medium focus:shadow-glow"
            >
              Skip to main content
            </a>

            <Navbar />
            <div className="flex min-h-screen w-full flex-col pt-16">
              <main id="main-content" className="flex-grow">
                {children}
                <ScrollToTop />
              </main>
            </div>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
