import { NextResponse } from "next/server";

import { getPublishedCategories } from "@/lib/blog/data";

export async function GET() {
  try {
    const categories = await getPublishedCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Failed to fetch categories", error);
    return NextResponse.json({ error: "Failed to fetch categories." }, { status: 500 });
  }
}
