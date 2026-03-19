"use client";

import { useEffect, useRef, useState } from "react";

export default function GiscusComments() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

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
    script.setAttribute("data-theme", "dark_dimmed");
    script.setAttribute("data-lang", "en");

    container.appendChild(script);
  }, [isVisible]);

  return (
    <section className="card p-5 shadow-inner-highlight">
      <div ref={containerRef}>
        {!isVisible ? <p className="text-body text-ink-secondary">Loading comments…</p> : null}
      </div>
    </section>
  );
}
