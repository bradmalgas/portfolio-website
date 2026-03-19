"use client";

import { useState } from "react";

interface CodeBlockProps {
  code: string;
  children: React.ReactNode;
}

export default function CodeBlock({ code, children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy code block", error);
    }
  }

  return (
    <div className="group relative my-6 overflow-hidden rounded-md border border-border bg-surface-raised shadow">
      <button
        type="button"
        onClick={handleCopy}
        className="absolute right-3 top-3 z-10 rounded-sm border border-border bg-background/90 px-2 py-1 text-[11px] font-medium text-ink-secondary transition-colors duration-250 hover:border-accent hover:text-ink"
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <pre className="overflow-x-auto p-4 font-mono text-sm leading-7 text-ink">{children}</pre>
    </div>
  );
}
