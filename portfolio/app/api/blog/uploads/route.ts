import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

import { requireAdminApiUser } from "@/lib/blog/auth";
import { getSupabaseAdminClient } from "@/lib/supabase";

function sanitiseFilename(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdminApiUser();

  if ("error" in authResult) {
    return authResult.error;
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "A file is required." }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const extension = file.name.includes(".") ? file.name.split(".").pop() : "png";
  const filePath = `covers/${Date.now()}-${randomUUID()}-${sanitiseFilename(file.name || `image.${extension}`)}`;

  const { error } = await getSupabaseAdminClient().storage
    .from("blog-images")
    .upload(filePath, arrayBuffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (error) {
    console.error("Failed to upload blog asset", error);
    return NextResponse.json({ error: "Failed to upload file." }, { status: 500 });
  }

  const {
    data: { publicUrl },
  } = getSupabaseAdminClient().storage.from("blog-images").getPublicUrl(filePath);

  return NextResponse.json({
    path: filePath,
    url: publicUrl,
  });
}
