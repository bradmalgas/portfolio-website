"use client";

import { useEffect, useMemo, useState } from "react";

import { BLOG_REACTIONS } from "@/lib/blog/constants";
import type { ReactionCount, ReactionEmoji } from "@/types/blog";

interface ReactionBarProps {
  slug: string;
}

function getSessionId() {
  const storageKey = "blog-reaction-session-id";
  const existing = window.localStorage.getItem(storageKey);

  if (existing) {
    return existing;
  }

  const next = crypto.randomUUID();
  window.localStorage.setItem(storageKey, next);
  return next;
}

export default function ReactionBar({ slug }: ReactionBarProps) {
  const [counts, setCounts] = useState<ReactionCount[]>(
    BLOG_REACTIONS.map((emoji) => ({ emoji, count: 0 })),
  );
  const [busyEmoji, setBusyEmoji] = useState<ReactionEmoji | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadCounts() {
      try {
        const response = await fetch(`/api/blog/posts/${slug}/reactions`);

        if (!response.ok) {
          throw new Error("Failed to load reactions");
        }

        const data = (await response.json()) as ReactionCount[];
        setCounts(data);
      } catch (error) {
        console.error(error);
      }
    }

    loadCounts();
  }, [slug]);

  const countMap = useMemo(
    () => new Map(counts.map((entry) => [entry.emoji, entry.count])),
    [counts],
  );

  async function handleReaction(emoji: ReactionEmoji) {
    setBusyEmoji(emoji);
    setMessage(null);

    setCounts((current) =>
      current.map((entry) =>
        entry.emoji === emoji ? { ...entry, count: entry.count + 1 } : entry,
      ),
    );

    try {
      const response = await fetch(`/api/blog/posts/${slug}/reactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emoji,
          sessionId: getSessionId(),
        }),
      });

      if (response.status === 409) {
        setMessage("You already used that reaction.");
        setCounts((current) =>
          current.map((entry) =>
            entry.emoji === emoji ? { ...entry, count: Math.max(0, entry.count - 1) } : entry,
          ),
        );
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to save reaction");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong. Please try again.");
      setCounts((current) =>
        current.map((entry) =>
          entry.emoji === emoji ? { ...entry, count: Math.max(0, entry.count - 1) } : entry,
        ),
      );
    } finally {
      setBusyEmoji(null);
    }
  }

  return (
    <div className="card space-y-4 p-5 shadow-inner-highlight">
      <div className="flex flex-wrap gap-3">
        {BLOG_REACTIONS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-body-sm text-ink-secondary transition-all duration-250 hover:border-accent hover:bg-accent-dim hover:text-ink"
            onClick={() => handleReaction(emoji)}
            disabled={busyEmoji === emoji}
          >
            <span className="text-base">{emoji}</span>
            <span>{countMap.get(emoji) ?? 0}</span>
          </button>
        ))}
      </div>

      {message ? <p className="text-body-sm text-ink-tertiary">{message}</p> : null}
    </div>
  );
}
