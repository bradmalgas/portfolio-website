import { NextRequest, NextResponse } from "next/server";

import { groupReactionCounts, isReactionEmoji } from "@/lib/blog/utils";
import { supabase } from "@/lib/supabase";

interface RouteContext {
  params: Promise<{
    slug: string;
  }>;
}

async function getPublishedPostId(slug: string) {
  const { data, error } = await supabase
    .from("posts")
    .select("id")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }

    throw error;
  }

  return data.id;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;

  try {
    const postId = await getPublishedPostId(slug);

    if (!postId) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    const { data, error } = await supabase
      .from("reactions")
      .select("emoji")
      .eq("post_id", postId);

    if (error) {
      throw error;
    }

    return NextResponse.json(groupReactionCounts(data ?? []));
  } catch (error) {
    console.error(`Failed to fetch reactions for ${slug}`, error);
    return NextResponse.json({ error: "Failed to fetch reactions." }, { status: 500 });
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;

  let body: { emoji?: string; sessionId?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!isReactionEmoji(body.emoji)) {
    return NextResponse.json({ error: "Invalid reaction emoji." }, { status: 400 });
  }

  if (!body.sessionId?.trim()) {
    return NextResponse.json({ error: "sessionId is required." }, { status: 400 });
  }

  try {
    const postId = await getPublishedPostId(slug);

    if (!postId) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    const { data, error } = await supabase
      .from("reactions")
      .insert({
        post_id: postId,
        emoji: body.emoji,
        session_id: body.sessionId.trim(),
      })
      .select()
      .single();

    if (error) {
      console.error(`Failed to create reaction for ${slug}`, error);
      return NextResponse.json(
        { error: error.code === "23505" ? "You have already used that reaction." : "Failed to save reaction." },
        { status: error.code === "23505" ? 409 : 500 },
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error(`Failed to create reaction for ${slug}`, error);
    return NextResponse.json({ error: "Failed to save reaction." }, { status: 500 });
  }
}
