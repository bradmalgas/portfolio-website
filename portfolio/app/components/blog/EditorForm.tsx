"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock3, Eye, Loader2, Monitor, Save, Smartphone, Upload } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import MarkdownRenderer from "@/app/components/blog/MarkdownRenderer";
import ToastMarkdownEditor from "@/app/components/blog/ToastMarkdownEditor";
import Select from "@/app/components/ui/Select";
import {
  createPostAction,
  updatePostAction,
  uploadPostImageAction,
} from "@/app/blog/editor/actions";
import {
  calculateReadingTimeMinutes,
  getWordAndCharacterCount,
  slugify,
} from "@/lib/blog/utils";
import type { PostStatus } from "@/types/blog";

interface EditorPost {
  slug: string;
  title: string;
  description: string | null;
  content: string;
  category: string;
  tags: string;
  cover_image: string | null;
  status: PostStatus;
  published_at: string | null;
  reading_time_minutes: number | null;
}

interface EditorFormProps {
  initialPost: EditorPost | null;
  categories: string[];
}

interface SaveMessage {
  type: "error" | "success";
  text: string;
}

interface PersistOptions {
  autosave?: boolean;
  publish?: boolean;
}

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "scheduled", label: "Scheduled" },
] satisfies Array<{ value: PostStatus; label: string }>;

function toDateTimeLocal(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

function fromDateTimeLocal(value: string) {
  if (!value) {
    return null;
  }

  return new Date(value).toISOString();
}

export default function EditorForm({ initialPost, categories }: EditorFormProps) {
  const router = useRouter();
  const saveInFlightRef = useRef(false);

  const [persistedSlug, setPersistedSlug] = useState(initialPost?.slug ?? null);
  const [title, setTitle] = useState(initialPost?.title ?? "");
  const [slug, setSlug] = useState(initialPost?.slug ?? "");
  const [selectedCategory, setSelectedCategory] = useState(
    initialPost?.category && categories.includes(initialPost.category)
      ? initialPost.category
      : "",
  );
  const [customCategory, setCustomCategory] = useState(
    initialPost?.category && !categories.includes(initialPost.category)
      ? initialPost.category
      : "",
  );
  const [tags, setTags] = useState(initialPost?.tags ?? "");
  const [description, setDescription] = useState(initialPost?.description ?? "");
  const [coverImage, setCoverImage] = useState(initialPost?.cover_image ?? "");
  const [status, setStatus] = useState<PostStatus>(initialPost?.status ?? "draft");
  const [publishedAt, setPublishedAt] = useState(
    toDateTimeLocal(initialPost?.published_at ?? null),
  );
  const [content, setContent] = useState(initialPost?.content ?? "");
  const [saveMessage, setSaveMessage] = useState<SaveMessage | null>(null);
  const [lastAutoSavedAt, setLastAutoSavedAt] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  const effectiveCategory = customCategory.trim() || selectedCategory.trim();
  const currentSlug = slug.trim() || slugify(title);
  const counts = useMemo(() => getWordAndCharacterCount(content), [content]);
  const readingTime = useMemo(() => calculateReadingTimeMinutes(content), [content]);
  const draftStorageKey = useMemo(
    () => `blog-editor-draft:${persistedSlug ?? "new"}`,
    [persistedSlug],
  );

  useEffect(() => {
    if (!initialPost) {
      return;
    }

    setPersistedSlug(initialPost.slug);
    setTitle(initialPost.title);
    setSlug(initialPost.slug);
    setTags(initialPost.tags);
    setDescription(initialPost.description ?? "");
    setCoverImage(initialPost.cover_image ?? "");
    setStatus(initialPost.status);
    setPublishedAt(toDateTimeLocal(initialPost.published_at ?? null));
    setContent(initialPost.content);

    if (categories.includes(initialPost.category)) {
      setSelectedCategory(initialPost.category);
      setCustomCategory("");
    } else {
      setSelectedCategory("");
      setCustomCategory(initialPost.category);
    }
  }, [categories, initialPost]);

  useEffect(() => {
    if (!slug.trim()) {
      setSlug(slugify(title));
    }
  }, [title, slug]);

  useEffect(() => {
    const savedDraft = window.localStorage.getItem(draftStorageKey);

    if (!savedDraft) {
      return;
    }

    try {
      const parsed = JSON.parse(savedDraft) as {
        title: string;
        slug: string;
        selectedCategory: string;
        customCategory: string;
        tags: string;
        description: string;
        coverImage: string;
        status: PostStatus;
        publishedAt: string;
        content: string;
      };

      setTitle(parsed.title);
      setSlug(parsed.slug);
      setSelectedCategory(parsed.selectedCategory);
      setCustomCategory(parsed.customCategory);
      setTags(parsed.tags);
      setDescription(parsed.description);
      setCoverImage(parsed.coverImage);
      setStatus(parsed.status);
      setPublishedAt(parsed.publishedAt);
      setContent(parsed.content);
      setSaveMessage({
        type: "success",
        text: "Recovered your local draft.",
      });
      setIsDirty(true);
    } catch (error) {
      console.error("Failed to restore draft", error);
    }
  }, [draftStorageKey]);

  useEffect(() => {
    if (!isDirty) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const markDirty = useCallback(() => {
    setIsDirty(true);
    setSaveMessage(null);
  }, []);

  const persistPost = useCallback(async (options: PersistOptions = {}) => {
    if (saveInFlightRef.current) {
      return null;
    }

    const nextStatus = options.publish ? "published" : status;

    if (!title.trim() || !effectiveCategory || !content.trim()) {
      if (!options.autosave) {
        setSaveMessage({
          type: "error",
          text: "Title, category, and content are required.",
        });
      }

      return null;
    }

    const payload = {
      title: title.trim(),
      slug: currentSlug,
      category: effectiveCategory,
      tags,
      description: description.trim(),
      cover_image: coverImage.trim() || null,
      status: nextStatus,
      published_at: fromDateTimeLocal(publishedAt),
      content,
    };

    saveInFlightRef.current = true;
    setSaveMessage((previous) => (options.autosave ? previous : null));
    setIsSaving(!options.autosave);
    setIsAutoSaving(Boolean(options.autosave));

    try {
      const isNew = !persistedSlug;
      const result = isNew
        ? await createPostAction(payload)
        : await updatePostAction(persistedSlug, payload);

      if (!result.ok) {

        if (!options.autosave) {
          setSaveMessage({
            type: "error",
            text: result.error,
          });
        }

        return null;
      }

      const savedPost = result.data;
      const nextEditorPath = `/blog/editor/${savedPost.slug}`;

      window.localStorage.removeItem(draftStorageKey);
      setPersistedSlug(savedPost.slug);
      setStatus(savedPost.status);
      setIsDirty(false);

      if (options.autosave) {
        setLastAutoSavedAt(
          new Date().toLocaleTimeString("en-ZA", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        );
      } else {
        setSaveMessage({
          type: "success",
          text: options.publish ? "Post published." : "Changes saved.",
        });
      }

      if (isNew || savedPost.slug !== persistedSlug) {
        router.replace(nextEditorPath, { scroll: false });
      } else {
        router.refresh();
      }

      return savedPost;
    } finally {
      saveInFlightRef.current = false;
      setIsSaving(false);
      setIsAutoSaving(false);
    }
  }, [
    content,
    coverImage,
    currentSlug,
    description,
    draftStorageKey,
    effectiveCategory,
    persistedSlug,
    publishedAt,
    router,
    status,
    tags,
    title,
  ]);

  const handleUploadImage = useCallback(async (file: File) => {
    setIsUploading(true);
    setSaveMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadPostImageAction(formData);

      if (!result.ok) {
        throw new Error(result.error);
      }

      setCoverImage(result.data.url);
      setIsDirty(true);
      setSaveMessage({
        type: "success",
        text: "Image uploaded.",
      });
      return result.data.url;
    } finally {
      setIsUploading(false);
    }
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");

    const syncViewport = () => {
      setIsMobileViewport(mediaQuery.matches);
      if (!mediaQuery.matches) {
        setShowMobilePreview(false);
      }
    };

    syncViewport();
    mediaQuery.addEventListener("change", syncViewport);

    return () => mediaQuery.removeEventListener("change", syncViewport);
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      if (!isDirty) {
        return;
      }

      window.localStorage.setItem(
        draftStorageKey,
        JSON.stringify({
          title,
          slug,
          selectedCategory,
          customCategory,
          tags,
          description,
          coverImage,
          status,
          publishedAt,
          content,
        }),
      );
      setLastAutoSavedAt(
        new Date().toLocaleTimeString("en-ZA", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );

      if (title.trim() && effectiveCategory && content.trim()) {
        void persistPost({ autosave: true });
      }
    }, 30_000);

    return () => window.clearInterval(intervalId);
  }, [
    content,
    coverImage,
    customCategory,
    description,
    draftStorageKey,
    effectiveCategory,
    isDirty,
    persistPost,
    publishedAt,
    selectedCategory,
    slug,
    status,
    tags,
    title,
  ]);

  return (
    <div className="space-y-6">
      <div className="card space-y-6 p-6 shadow-inner-highlight">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <span className="eyebrow">Editor</span>
            <h1 className="mt-2 text-h2 font-semibold text-ink">
              {initialPost ? `Editing ${initialPost.title}` : "New Post"}
            </h1>
            <div className="section-rule" />
          </div>

          <div className="flex flex-wrap gap-3">
            {persistedSlug ? (
              <Link
                href={`/blog/${persistedSlug}`}
                target="_blank"
                className="btn-ghost inline-flex items-center gap-2 text-sm"
              >
                <Eye className="h-4 w-4" />
                View post
              </Link>
            ) : null}
            <button
              type="button"
              onClick={() => void persistPost()}
              className="btn-ghost inline-flex items-center gap-2 text-sm"
              disabled={isSaving || isAutoSaving}
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save
            </button>
            <button
              type="button"
              onClick={() => void persistPost({ publish: true })}
              className="btn-accent inline-flex items-center gap-2 text-sm"
              disabled={isSaving || isAutoSaving}
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              Publish
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-body-sm font-medium text-ink">Title</span>
            <input
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                markDirty();
              }}
              className="blog-input"
              placeholder="Post title"
            />
          </label>

          <label className="space-y-2">
            <span className="text-body-sm font-medium text-ink">Slug</span>
            <input
              value={slug}
              onChange={(event) => {
                setSlug(slugify(event.target.value));
                markDirty();
              }}
              className="blog-input"
              placeholder="post-slug"
            />
          </label>

          <div className="space-y-2">
            <span className="text-body-sm font-medium text-ink">Existing Category</span>
            <Select
              value={selectedCategory}
              onValueChange={(value) => {
                setSelectedCategory(value);
                setCustomCategory("");
                markDirty();
              }}
              ariaLabel="Existing category"
              options={categories.map((category) => ({
                value: category,
                label: category,
              }))}
              placeholder="Choose a category"
            />
          </div>

          <label className="space-y-2">
            <span className="text-body-sm font-medium text-ink">New Category Override</span>
            <input
              value={customCategory}
              onChange={(event) => {
                setCustomCategory(event.target.value);
                markDirty();
              }}
              className="blog-input"
              placeholder="Type a new category if needed"
            />
          </label>

          <label className="space-y-2">
            <span className="text-body-sm font-medium text-ink">Tags</span>
            <input
              value={tags}
              onChange={(event) => {
                setTags(event.target.value);
                markDirty();
              }}
              className="blog-input"
              placeholder="azure, nextjs, learning"
            />
          </label>

          <div className="space-y-2">
            <span className="text-body-sm font-medium text-ink">Status</span>
            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value as PostStatus);
                markDirty();
              }}
              ariaLabel="Post status"
              options={STATUS_OPTIONS}
            />
          </div>

          <label className="space-y-2 md:col-span-2">
            <span className="text-body-sm font-medium text-ink">Description</span>
            <textarea
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);
                markDirty();
              }}
              className="blog-textarea min-h-28"
              placeholder="Short summary for cards, SEO, and previews"
            />
          </label>

          <label className="space-y-2">
            <span className="text-body-sm font-medium text-ink">Published At</span>
            <input
              type="datetime-local"
              value={publishedAt}
              onChange={(event) => {
                setPublishedAt(event.target.value);
                markDirty();
              }}
              className="blog-input"
            />
          </label>

          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center justify-between gap-4">
              <span className="text-body-sm font-medium text-ink">Cover Image</span>
              <label className="btn-ghost inline-flex cursor-pointer items-center gap-2 text-sm">
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                Upload
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  aria-label="Upload cover image"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      void handleUploadImage(file);
                    }
                  }}
                />
              </label>
            </div>

            {coverImage ? (
              <div className="relative aspect-[16/9] overflow-hidden rounded-md border border-border bg-surface">
                <Image src={coverImage} alt="Cover preview" fill className="object-cover" />
              </div>
            ) : (
              <div className="rounded-md border border-dashed border-border p-6 text-body-sm text-ink-tertiary">
                Upload a cover image to show it here.
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 text-body-sm text-ink-tertiary">
          <span className="inline-flex items-center gap-2">
            <Clock3 className="h-4 w-4" />
            {readingTime} min read
          </span>
          <span>{counts.words} words</span>
          <span>{counts.characters} characters</span>
          <span>Category: {effectiveCategory || "None yet"}</span>
          {isAutoSaving ? <span>Autosaving…</span> : null}
          {lastAutoSavedAt ? <span>Last autosave: {lastAutoSavedAt}</span> : null}
        </div>

        {saveMessage ? (
          <p
            className={
              saveMessage.type === "error"
                ? "text-body-sm text-red-300"
                : "text-body-sm text-accent-hover"
            }
          >
            {saveMessage.text}
          </p>
        ) : null}
      </div>

      <section className="card overflow-hidden shadow-inner-highlight">
        <div className="border-b border-border px-4 py-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-h4 font-semibold text-ink">Markdown Editor</h2>
              <p className="mt-1 text-body-sm text-ink-tertiary">
                {isMobileViewport
                  ? "On mobile the editor stays on top, with a preview toggle below."
                  : "Split view is handled by the editor engine, with synced scrolling between markdown and preview."}
              </p>
            </div>

            <div className="inline-flex w-full rounded-md border border-border bg-surface p-1 lg:hidden">
              <button
                type="button"
                className={`inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-sm px-3 py-2 text-sm transition-colors duration-250 ${
                  !showMobilePreview ? "bg-accent-dim text-ink" : "text-ink-secondary hover:text-ink"
                }`}
                onClick={() => setShowMobilePreview(false)}
              >
                <Smartphone className="h-4 w-4" />
                Editor
              </button>
              <button
                type="button"
                className={`inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-sm px-3 py-2 text-sm transition-colors duration-250 ${
                  showMobilePreview ? "bg-accent-dim text-ink" : "text-ink-secondary hover:text-ink"
                }`}
                onClick={() => setShowMobilePreview(true)}
              >
                <Monitor className="h-4 w-4" />
                Preview
              </button>
            </div>
          </div>
        </div>
        <div className="p-4">
          <ToastMarkdownEditor
            value={content}
            onChange={(nextValue) => {
              setContent(nextValue);
              setIsDirty(true);
            }}
            onUploadImage={handleUploadImage}
            splitView={!isMobileViewport}
          />
        </div>

        <div className="border-t border-border p-4 lg:hidden">
          <button
            type="button"
            className="btn-ghost mb-4 inline-flex min-h-11 items-center gap-2 px-4 py-2 text-sm"
            onClick={() => setShowMobilePreview((value) => !value)}
            aria-expanded={showMobilePreview}
          >
            <Monitor className="h-4 w-4" />
            {showMobilePreview ? "Hide preview" : "Show preview"}
          </button>

          {showMobilePreview ? (
            <div className="rounded-md border border-border bg-surface-raised p-4">
              <MarkdownRenderer content={content} />
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
