"use client";

import { useEffect, useRef, useState } from "react";
import type { Editor as ToastEditorInstance } from "@toast-ui/editor";

interface ToastMarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  onUploadImage: (file: File) => Promise<string>;
  placeholder?: string;
  height?: string;
  splitView?: boolean;
}

const TOOLBAR_ITEMS = [
  ["heading", "bold", "italic", "strike"],
  ["hr", "quote"],
  ["ul", "ol", "task"],
  ["table", "image", "link"],
  ["code", "codeblock"],
] as const;

export default function ToastMarkdownEditor({
  value,
  onChange,
  onUploadImage,
  placeholder = "Write your markdown here...",
  height = "720px",
  splitView = true,
}: ToastMarkdownEditorProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<ToastEditorInstance | null>(null);
  const initialValueRef = useRef(value);
  const onChangeRef = useRef(onChange);
  const onUploadImageRef = useRef(onUploadImage);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onUploadImageRef.current = onUploadImage;
  }, [onUploadImage]);

  useEffect(() => {
    let isActive = true;

    async function createEditor() {
      if (!rootRef.current) {
        return;
      }

      const { Editor } = await import("@toast-ui/editor");

      if (!isActive || !rootRef.current) {
        return;
      }

      const instance = new Editor({
        el: rootRef.current,
        height,
        minHeight: "640px",
        initialValue: initialValueRef.current,
        initialEditType: "markdown",
        previewStyle: splitView ? "vertical" : "tab",
        hideModeSwitch: !splitView,
        placeholder,
        usageStatistics: false,
        autofocus: false,
        theme: "dark",
        toolbarItems: TOOLBAR_ITEMS.map((group) => [...group]),
        hooks: {
          addImageBlobHook: async (blob, callback) => {
            const file = blob instanceof File ? blob : new File([blob], "image");
            const url = await onUploadImageRef.current(file);
            callback(url, file.name);
          },
        },
        events: {
          change: () => {
            const nextValue = instance.getMarkdown();
            onChangeRef.current(nextValue);
          },
        },
      });

      editorRef.current = instance;
      setIsReady(true);
    }

    createEditor();

    return () => {
      isActive = false;
      editorRef.current?.destroy();
      editorRef.current = null;
    };
  }, [height, placeholder, splitView]);

  useEffect(() => {
    const instance = editorRef.current;

    if (!instance) {
      return;
    }

    const currentMarkdown = instance.getMarkdown();

    if (currentMarkdown !== value) {
      instance.setMarkdown(value, false);
    }
  }, [value]);

  return (
    <div className="rounded-md border border-border bg-surface-raised">
      {!isReady ? (
        <div className="flex min-h-[32rem] items-center justify-center text-body text-ink-secondary">
          Loading editor…
        </div>
      ) : null}
      <div ref={rootRef} className={isReady ? "" : "hidden"} />
    </div>
  );
}
