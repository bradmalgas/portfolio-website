"use server";

import { randomUUID } from "node:crypto";

import matter from "gray-matter";

import { getAdminAccess } from "@/lib/blog/auth";
import { revalidateBlogContent } from "@/lib/blog/cache";
import { getSupabaseAdminClient } from "@/lib/supabase";
import type { PostInsert, PostStatus, PostUpdate } from "@/types/blog";
import {
  calculateReadingTimeMinutes,
  ensurePublishedAt,
  isPostStatus,
  normaliseCategory,
  normaliseTags,
  slugify,
} from "@/lib/blog/utils";

interface ActionFailure {
  ok: false;
  error: string;
}

interface ActionSuccess<T> {
  ok: true;
  data: T;
}

type ActionResult<T> = ActionFailure | ActionSuccess<T>;

export interface EditorPostInput {
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string;
  tags: string;
  cover_image: string | null;
  status: PostStatus;
  published_at: string | null;
}

interface SavedPostSummary {
  slug: string;
  status: PostStatus;
}

function sanitiseFilename(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
}

async function ensureAdminAccess(): Promise<ActionResult<null>> {
  const { userId, isAdmin } = await getAdminAccess();

  if (!userId) {
    return {
      ok: false,
      error: "Authentication required.",
    };
  }

  if (!isAdmin) {
    return {
      ok: false,
      error: "You are not authorised to access this resource.",
    };
  }

  return {
    ok: true,
    data: null,
  };
}

function normaliseEditorInput(input: EditorPostInput): ActionResult<PostInsert> {
  const title = input.title.trim();
  const content = input.content.trim();
  const category = normaliseCategory(input.category);
  const tags = normaliseTags(input.tags);
  const status = isPostStatus(input.status) ? input.status : "draft";
  const slug = (input.slug.trim() || slugify(title)).trim();

  if (!title || !content || !category) {
    return {
      ok: false,
      error: "Title, content, and category are required.",
    };
  }

  if (!slug) {
    return {
      ok: false,
      error: "A valid slug is required.",
    };
  }

  return {
    ok: true,
    data: {
      slug,
      title,
      description: input.description.trim() || null,
      content,
      category,
      tags,
      cover_image: input.cover_image?.trim() || null,
      status,
      published_at: ensurePublishedAt(status, input.published_at),
      reading_time_minutes: calculateReadingTimeMinutes(content),
    },
  };
}

export async function createPostAction(
  input: EditorPostInput,
): Promise<ActionResult<SavedPostSummary>> {
  const access = await ensureAdminAccess();

  if (!access.ok) {
    return access;
  }

  const normalized = normaliseEditorInput(input);

  if (!normalized.ok) {
    return normalized;
  }

  const { data, error } = await getSupabaseAdminClient()
    .from("posts")
    .insert(normalized.data)
    .select("slug,status,category,tags")
    .single();

  if (error) {
    console.error("Failed to create post", error);
    return {
      ok: false,
      error:
        error.code === "23505"
          ? "A post with that slug already exists."
          : "Failed to create post.",
    };
  }

  revalidateBlogContent(data.slug, data.category, data.tags ?? []);

  return {
    ok: true,
    data: {
      slug: data.slug,
      status: data.status,
    },
  };
}

export async function updatePostAction(
  slug: string,
  input: EditorPostInput,
): Promise<ActionResult<SavedPostSummary>> {
  const access = await ensureAdminAccess();

  if (!access.ok) {
    return access;
  }

  const normalized = normaliseEditorInput(input);

  if (!normalized.ok) {
    return normalized;
  }

  const updates: PostUpdate = {
    ...normalized.data,
  };

  const { data, error } = await getSupabaseAdminClient()
    .from("posts")
    .update(updates)
    .eq("slug", slug)
    .select("slug,status,category,tags")
    .single();

  if (error) {
    console.error(`Failed to update post ${slug}`, error);
    return {
      ok: false,
      error:
        error.code === "PGRST116"
          ? "Post not found."
          : error.code === "23505"
            ? "A post with that slug already exists."
            : "Failed to update post.",
    };
  }

  revalidateBlogContent(data.slug, data.category, data.tags ?? []);

  if (data.slug !== slug) {
    revalidateBlogContent(slug);
  }

  return {
    ok: true,
    data: {
      slug: data.slug,
      status: data.status,
    },
  };
}

export async function deletePostAction(slug: string): Promise<ActionResult<null>> {
  const access = await ensureAdminAccess();

  if (!access.ok) {
    return access;
  }

  const { data, error } = await getSupabaseAdminClient()
    .from("posts")
    .delete()
    .eq("slug", slug)
    .select("slug,category,tags")
    .single();

  if (error) {
    console.error(`Failed to delete post ${slug}`, error);
    return {
      ok: false,
      error: error.code === "PGRST116" ? "Post not found." : "Failed to delete post.",
    };
  }

  revalidateBlogContent(data.slug, data.category, data.tags ?? []);

  return {
    ok: true,
    data: null,
  };
}

export interface ParsedMarkdownImport {
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string;
  tags: string;
  coverImage: string;
  status: PostStatus;
  publishedAt: string;
}

export async function parseMarkdownForImportAction(
  formData: FormData,
): Promise<ActionResult<ParsedMarkdownImport>> {
  const access = await ensureAdminAccess();

  if (!access.ok) {
    return access;
  }

  const file = formData.get("file");

  if (!(file instanceof File) || !file.name.endsWith(".md")) {
    return { ok: false, error: "A .md file is required." };
  }

  const raw = await file.text();
  const { data: fm, content } = matter(raw);

  // Derive title from filename (strip .md extension)
  const title = file.name.replace(/\.md$/, "").trim();

  // Case-insensitive key lookup for Obsidian-style frontmatter
  const get = (key: string) => {
    const match = Object.keys(fm).find((k) => k.toLowerCase() === key.toLowerCase());
    return match ? fm[match] : undefined;
  };

  const description = String(get("description") ?? "").trim();
  const category = String(get("category") ?? "").trim();
  const statusRaw = String(get("status") ?? "draft").toLowerCase();
  const status: PostStatus = isPostStatus(statusRaw) ? statusRaw : "draft";

  // Tags may be a YAML array or a comma-separated string
  const tagsRaw = get("tags");
  const tags = Array.isArray(tagsRaw)
    ? (tagsRaw as string[]).join(", ")
    : String(tagsRaw ?? "");

  // Cover image — decode from a Vercel proxy URL if needed
  const rawCoverImage = String(get("cover image url") ?? get("cover_image") ?? "").trim();
  let coverImage = rawCoverImage;
  if (coverImage) {
    try {
      const proxied = new URL(coverImage).searchParams.get("url");
      if (proxied) coverImage = decodeURIComponent(proxied);
    } catch {
      // Not a URL, keep as-is
    }
  }

  // Parse published_at → datetime-local string (yyyy-MM-ddTHH:mm) expected by EditorForm
  const publishedAtRaw = get("published at") ?? get("published_at");
  let publishedAt = "";
  if (publishedAtRaw) {
    const d = new Date(String(publishedAtRaw));
    if (!Number.isNaN(d.getTime())) {
      const offsetMs = d.getTimezoneOffset() * 60_000;
      publishedAt = new Date(d.getTime() - offsetMs).toISOString().slice(0, 16);
    }
  }

  return {
    ok: true,
    data: {
      title,
      slug: slugify(title),
      description,
      content: content.trim(),
      category,
      tags,
      coverImage,
      status,
      publishedAt,
    },
  };
}

export async function uploadPostImageAction(
  formData: FormData,
  folder: "covers" | "content" = "covers",
): Promise<ActionResult<{ url: string }>> {
  const access = await ensureAdminAccess();

  if (!access.ok) {
    return access;
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return {
      ok: false,
      error: "A file is required.",
    };
  }

  const arrayBuffer = await file.arrayBuffer();
  const extension = file.name.includes(".") ? file.name.split(".").pop() : "png";
  const filePath = `${folder}/${Date.now()}-${randomUUID()}-${sanitiseFilename(file.name || `image.${extension}`)}`;

  const { error } = await getSupabaseAdminClient().storage
    .from("blog-images")
    .upload(filePath, arrayBuffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (error) {
    console.error("Failed to upload blog asset", error);
    return {
      ok: false,
      error: "Failed to upload file.",
    };
  }

  const {
    data: { publicUrl },
  } = getSupabaseAdminClient().storage.from("blog-images").getPublicUrl(filePath);

  return {
    ok: true,
    data: {
      url: publicUrl,
    },
  };
}
