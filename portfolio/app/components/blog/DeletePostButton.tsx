"use client";

import { deletePostAction } from "@/app/blog/editor/actions";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface DeletePostButtonProps {
  slug: string;
}

export default function DeletePostButton({ slug }: DeletePostButtonProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(
      "Delete this post permanently? This cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      setError(null);

      const result = await deletePostAction(slug);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleDelete}
        className="text-body-sm text-ink-tertiary transition-colors duration-250 hover:text-red-300"
        disabled={isPending}
      >
        {isPending ? "Deleting…" : "Delete"}
      </button>
      {error ? <span className="text-xs text-red-300">{error}</span> : null}
    </div>
  );
}
