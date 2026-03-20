"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { parseMarkdownForImportAction } from "@/app/blog/editor/actions";

const DRAFT_STORAGE_KEY = "blog-editor-draft:new";

export default function ImportMarkdownButton() {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const result = await parseMarkdownForImportAction(formData);

    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    const { title, slug, description, content, category, tags, coverImage, status, publishedAt } =
      result.data;

    // Pre-fill the new post editor via the same localStorage key the EditorForm reads on mount
    window.localStorage.setItem(
      DRAFT_STORAGE_KEY,
      JSON.stringify({
        title,
        slug,
        selectedCategory: "",
        customCategory: category,
        tags,
        description,
        coverImage,
        status,
        publishedAt,
        content,
      }),
    );

    router.push("/blog/editor/new");
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        className="btn-ghost text-sm"
        disabled={loading}
        onClick={() => inputRef.current?.click()}
      >
        {loading ? "Importing…" : "Import Markdown"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".md"
        className="hidden"
        onChange={handleChange}
      />
      {error && <p className="text-body-sm text-red-400">{error}</p>}
    </div>
  );
}
