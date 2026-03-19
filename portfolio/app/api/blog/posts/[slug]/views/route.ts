import { NextResponse } from "next/server";

import { incrementViewCount } from "@/lib/blog/data";

interface RouteContext {
  params: Promise<{
    slug: string;
  }>;
}

export async function POST(_request: Request, context: RouteContext) {
  const { slug } = await context.params;

  try {
    await incrementViewCount(slug);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Failed to increment view count for ${slug}`, error);
    return NextResponse.json({ error: "Failed to record view." }, { status: 500 });
  }
}
