"use client";

import { useEffect, useRef, useState } from "react";

function getGiscusTheme(theme: string | null | undefined) {
  const mode = theme === "light" ? "light" : "dark";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  // In local dev, giscus.app can't reach localhost so we use Supabase-hosted CSS.
  // In production, NEXT_PUBLIC_SITE_URL points to the live domain and the bundled
  // /public/giscus-*.css files are served directly from the app.
  if (!siteUrl || siteUrl.startsWith("http://localhost")) {
    const devUrl =
      mode === "light"
        ? process.env.NEXT_PUBLIC_GISCUS_THEME_LIGHT
        : process.env.NEXT_PUBLIC_GISCUS_THEME_DARK;
    return devUrl ?? (mode === "light" ? "light" : "dark_dimmed");
  }
  return `${siteUrl}/giscus-${mode}.css`;
}

function sendGiscusTheme(themeUrl: string) {
  const iframe = document.querySelector<HTMLIFrameElement>(".giscus-frame");
  iframe?.contentWindow?.postMessage(
    { giscus: { setConfig: { theme: themeUrl } } },
    "https://giscus.app",
  );
}

export default function GiscusComments() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Lazy-load: only inject the script once the widget scrolls into view.
  useEffect(() => {
    const element = containerRef.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  // Inject giscus script once visible, using the current site theme.
  useEffect(() => {
    const container = containerRef.current;

    if (!container || !isVisible || container.childElementCount > 0) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-repo", process.env.NEXT_PUBLIC_GISCUS_REPO ?? "");
    script.setAttribute("data-repo-id", process.env.NEXT_PUBLIC_GISCUS_REPO_ID ?? "");
    script.setAttribute("data-category", process.env.NEXT_PUBLIC_GISCUS_CATEGORY ?? "");
    script.setAttribute(
      "data-category-id",
      process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ?? "",
    );
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", getGiscusTheme(document.documentElement.dataset.theme));
    script.setAttribute("data-lang", "en");

    container.appendChild(script);
  }, [isVisible]);

  // Watch for theme toggling and push the new theme into the giscus iframe.
  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const observer = new MutationObserver(() => {
      sendGiscusTheme(getGiscusTheme(document.documentElement.dataset.theme));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, [isVisible]);

  return (
    <section className="card p-5 shadow-inner-highlight">
      <div ref={containerRef}>
        {!isVisible ? <p className="text-body text-ink-secondary">Loading comments…</p> : null}
      </div>
    </section>
  );
}
