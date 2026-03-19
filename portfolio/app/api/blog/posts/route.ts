import { NextRequest, NextResponse } from "next/server";

import { BLOG_PAGE_SIZE } from "@/lib/blog/constants";
import { requireAdminApiUser } from "@/lib/blog/auth";
import { revalidateBlogContent } from "@/lib/blog/cache";
import { getPublishedPosts } from "@/lib/blog/data";
import {
  calculateReadingTimeMinutes,
  ensurePublishedAt,
  isPostStatus,
  normaliseCategory,
  normaliseTags,
  parsePositiveInt,
  slugify,
} from "@/lib/blog/utils";
import { getSupabaseAdminClient } from "@/lib/supabase";
import type { PostInsert } from "@/types/blog";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const statusParam = searchParams.get("status");
  const requestedStatus = isPostStatus(statusParam) ? statusParam : "published";

  if (requestedStatus !== "published") {
    const authResult = await requireAdminApiUser();

    if ("error" in authResult) {
      return authResult.error;
    }
  }

  try {
    const result = await getPublishedPosts({
      page: parsePositiveInt(searchParams.get("page"), 1),
      pageSize: parsePositiveInt(searchParams.get("pageSize"), BLOG_PAGE_SIZE, 50),
      category: searchParams.get("category") || undefined,
      tag: searchParams.get("tag") || undefined,
      search: searchParams.get("search") || undefined,
      status: requestedStatus,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch posts", error);
    return NextResponse.json({ error: "Failed to fetch posts." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdminApiUser();

  if ("error" in authResult) {
    return authResult.error;
  }

  let body: Partial<PostInsert> & { slug?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const title = body.title?.trim();
  const content = body.content?.trim();
  const category = normaliseCategory(body.category);
  const tags = normaliseTags(body.tags);
  const status = isPostStatus(body.status) ? body.status : "draft";
  const slug = (body.slug?.trim() || slugify(title ?? "")).trim();

  if (!title || !content || !category) {
    return NextResponse.json(
      { error: "Title, content, and category are required." },
      { status: 400 },
    );
  }

  if (!slug) {
    return NextResponse.json({ error: "A valid slug is required." }, { status: 400 });
  }

  const payload: PostInsert = {
    slug,
    title,
    description: body.description?.trim() || null,
    content,
    category,
    tags,
    cover_image: body.cover_image?.trim() || null,
    status,
    published_at: ensurePublishedAt(status, body.published_at),
    reading_time_minutes: calculateReadingTimeMinutes(content),
  };

  const { data, error } = await getSupabaseAdminClient()
    .from("posts")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error("Failed to create post", error);
    return NextResponse.json(
      { error: error.code === "23505" ? "A post with that slug already exists." : "Failed to create post." },
      { status: error.code === "23505" ? 409 : 500 },
    );
  }

  revalidateBlogContent(data.slug, data.category, data.tags ?? []);

  return NextResponse.json(data, { status: 201 });
}
