"use client";

import { useEffect } from "react";

interface PostViewTrackerProps {
  slug: string;
}

function sendView(slug: string) {
  const url = `/api/blog/posts/${encodeURIComponent(slug)}/views`;
  const payload = JSON.stringify({ viewedAt: Date.now() });

  if (navigator.sendBeacon) {
    const blob = new Blob([payload], { type: "application/json" });

    if (navigator.sendBeacon(url, blob)) {
      return;
    }
  }

  void fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: payload,
    keepalive: true,
  });
}

export default function PostViewTracker({ slug }: PostViewTrackerProps) {
  useEffect(() => {
    const storageKey = `blog:viewed:${slug}`;

    try {
      if (window.sessionStorage.getItem(storageKey) === "1") {
        return;
      }
    } catch {
      // Continue without session storage if the browser blocks it.
    }

    let timeoutId: number | null = null;

    const recordView = () => {
      try {
        window.sessionStorage.setItem(storageKey, "1");
      } catch {
        // Best-effort de-duplication only.
      }

      sendView(slug);
    };

    const scheduleView = () => {
      if (timeoutId !== null) {
        return;
      }

      timeoutId = window.setTimeout(recordView, 1200);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        scheduleView();
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      }
    };

    if (document.visibilityState === "visible") {
      scheduleView();
    } else {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    return () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }

      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [slug]);

  return null;
}
