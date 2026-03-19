import { NextRequest, NextResponse } from "next/server";

import { requireAdminApiUser } from "@/lib/blog/auth";
import { revalidateBlogContent } from "@/lib/blog/cache";
import { getPublishedPostBySlug, incrementViewCount } from "@/lib/blog/data";
import {
  calculateReadingTimeMinutes,
  ensurePublishedAt,
  isPostStatus,
  normaliseCategory,
  normaliseTags,
  slugify,
} from "@/lib/blog/utils";
import { getSupabaseAdminClient } from "@/lib/supabase";
import type { PostUpdate } from "@/types/blog";

interface RouteContext {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;

  try {
    const post = await getPublishedPostBySlug(slug);

    if (!post) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    incrementViewCount(slug).catch((error) => {
      console.error(`Failed to increment view count for ${slug}`, error);
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error(`Failed to fetch post ${slug}`, error);
    return NextResponse.json({ error: "Failed to fetch post." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const authResult = await requireAdminApiUser();

  if ("error" in authResult) {
    return authResult.error;
  }

  const { slug } = await context.params;

  let body: Partial<PostUpdate> & { slug?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const updates: PostUpdate = {};

  if (body.title !== undefined) {
    const title = body.title.trim();

    if (!title) {
      return NextResponse.json({ error: "Title cannot be empty." }, { status: 400 });
    }

    updates.title = title;
  }

  if (body.slug !== undefined) {
    const nextSlug = body.slug.trim() || slugify(body.title?.trim() || "");

    if (!nextSlug) {
      return NextResponse.json({ error: "Slug cannot be empty." }, { status: 400 });
    }

    updates.slug = nextSlug;
  }

  if (body.description !== undefined) {
    updates.description = body.description?.trim() || null;
  }

  if (body.content !== undefined) {
    const content = body.content.trim();

    if (!content) {
      return NextResponse.json({ error: "Content cannot be empty." }, { status: 400 });
    }

    updates.content = content;
    updates.reading_time_minutes = calculateReadingTimeMinutes(content);
  }

  if (body.category !== undefined) {
    const category = normaliseCategory(body.category);

    if (!category) {
      return NextResponse.json({ error: "Category cannot be empty." }, { status: 400 });
    }

    updates.category = category;
  }

  if (body.tags !== undefined) {
    updates.tags = normaliseTags(body.tags);
  }

  if (body.cover_image !== undefined) {
    updates.cover_image = body.cover_image?.trim() || null;
  }

  if (body.status !== undefined) {
    if (!isPostStatus(body.status)) {
      return NextResponse.json({ error: "Invalid post status." }, { status: 400 });
    }

    updates.status = body.status;
    updates.published_at = ensurePublishedAt(body.status, body.published_at);
  } else if (body.published_at !== undefined) {
    updates.published_at = body.published_at;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No updates supplied." }, { status: 400 });
  }

  const { data, error } = await getSupabaseAdminClient()
    .from("posts")
    .update(updates)
    .eq("slug", slug)
    .select()
    .single();

  if (error) {
    console.error(`Failed to update post ${slug}`, error);
    return NextResponse.json(
      { error: error.code === "PGRST116" ? "Post not found." : error.code === "23505" ? "A post with that slug already exists." : "Failed to update post." },
      { status: error.code === "PGRST116" ? 404 : error.code === "23505" ? 409 : 500 },
    );
  }

  revalidateBlogContent(data.slug, data.category, data.tags ?? []);

  if (data.slug !== slug) {
    revalidateBlogContent(slug);
  }

  return NextResponse.json(data);
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const authResult = await requireAdminApiUser();

  if ("error" in authResult) {
    return authResult.error;
  }

  const { slug } = await context.params;

  const { error } = await getSupabaseAdminClient().from("posts").delete().eq("slug", slug);

  if (error) {
    console.error(`Failed to delete post ${slug}`, error);
    return NextResponse.json(
      { error: error.code === "PGRST116" ? "Post not found." : "Failed to delete post." },
      { status: error.code === "PGRST116" ? 404 : 500 },
    );
  }

  revalidateBlogContent(slug);

  return new NextResponse(null, { status: 204 });
}
