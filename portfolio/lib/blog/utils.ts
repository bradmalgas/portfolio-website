import readingTime from "reading-time";

import { BLOG_REACTIONS, BLOG_STATUSES } from "@/lib/blog/constants";
import type {
  Post,
  PostStatus,
  ReactionEmoji,
  ReactionCount,
} from "@/types/blog";

export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function calculateReadingTimeMinutes(content: string) {
  const stats = readingTime(content ?? "");
  return Math.max(1, Math.ceil(stats.minutes));
}

export function normaliseTags(tags: string[] | string | null | undefined) {
  if (Array.isArray(tags)) {
    return Array.from(
      new Set(
        tags
          .map((tag) => tag.trim())
          .filter(Boolean),
      ),
    );
  }

  if (typeof tags !== "string") {
    return [];
  }

  return Array.from(
    new Set(
      tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  );
}

export function normaliseCategory(category: string | null | undefined) {
  return (category ?? "").trim();
}

export function isPostStatus(value: string | null | undefined): value is PostStatus {
  return BLOG_STATUSES.includes(value as PostStatus);
}

export function isReactionEmoji(
  value: string | null | undefined,
): value is ReactionEmoji {
  return BLOG_REACTIONS.includes(value as ReactionEmoji);
}

export function parsePositiveInt(
  value: string | null | undefined,
  fallback: number,
  max = Number.MAX_SAFE_INTEGER,
) {
  const parsed = Number.parseInt(value ?? "", 10);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return Math.min(parsed, max);
}

export function ensurePublishedAt(
  status: PostStatus,
  publishedAt: string | null | undefined,
) {
  if (status === "published") {
    return publishedAt || new Date().toISOString();
  }

  return publishedAt ?? null;
}

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://bradmalgas.com";
}

export function getPostUrl(slug: string) {
  return `${getSiteUrl()}/blog/${slug}`;
}

const LONG_MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const SHORT_MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

function getUtcDateParts(date: string) {
  const value = new Date(date);

  return {
    day: value.getUTCDate(),
    monthIndex: value.getUTCMonth(),
    year: value.getUTCFullYear(),
  };
}

export function formatDate(date: string | null | undefined) {
  if (!date) {
    return null;
  }

  const { day, monthIndex, year } = getUtcDateParts(date);
  return `${day} ${LONG_MONTH_NAMES[monthIndex]} ${year}`;
}

export function formatShortDate(date: string | null | undefined) {
  if (!date) {
    return null;
  }

  const { day, monthIndex, year } = getUtcDateParts(date);
  return `${String(day).padStart(2, "0")} ${SHORT_MONTH_NAMES[monthIndex]} ${year}`;
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function getTableOfContents(markdown: string) {
  const items: TocItem[] = [];
  const duplicateCount = new Map<string, number>();

  for (const line of markdown.split("\n")) {
    const match = /^(#{2,3})\s+(.+)$/.exec(line.trim());

    if (!match) {
      continue;
    }

    const [, hashes, rawText] = match;
    const text = rawText.replace(/[`*_~]/g, "").trim();
    const baseId = slugify(text);
    const count = duplicateCount.get(baseId) ?? 0;
    duplicateCount.set(baseId, count + 1);
    const id = count === 0 ? baseId : `${baseId}-${count}`;

    items.push({
      id,
      text,
      level: hashes.length,
    });
  }

  return items;
}

export function getWordAndCharacterCount(markdown: string) {
  const trimmed = markdown.trim();

  return {
    characters: markdown.length,
    words: trimmed ? trimmed.split(/\s+/).length : 0,
  };
}

export function groupReactionCounts(
  reactionRows: Array<{ emoji: ReactionEmoji }>,
): ReactionCount[] {
  const counts = BLOG_REACTIONS.map((emoji) => ({
    emoji,
    count: 0,
  }));

  const map = new Map(counts.map((item) => [item.emoji, item]));

  for (const reaction of reactionRows) {
    const entry = map.get(reaction.emoji);

    if (entry) {
      entry.count += 1;
    }
  }

  return counts;
}

export function serialisePostForEditor(post: Post | null) {
  if (!post) {
    return null;
  }

  return {
    ...post,
    tags: post.tags.join(", "),
  };
}
