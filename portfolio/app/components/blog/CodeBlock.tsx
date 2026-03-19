"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import styles from "@/app/components/blog/CodeBlock.module.css";

interface CodeBlockProps {
  code: string;
  children: React.ReactNode;
  language?: string;
}

function formatLanguage(language?: string) {
  return language?.replace(/^language-/, "").trim() || "plaintext";
}

export default function CodeBlock({ code, children, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const label = formatLanguage(language);

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
    <div className={`group relative my-6 rounded-md border border-border bg-surface-raised shadow ${styles.container}`}>
      <div className="flex min-h-11 items-center justify-between gap-4 border-b border-border bg-surface px-4 py-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-tertiary">
          {label}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex min-h-9 items-center gap-2 rounded-sm border border-border bg-background/90 px-3 py-1.5 text-[11px] font-medium text-ink-secondary transition-colors duration-250 hover:border-accent hover:text-ink"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <div className={`${styles.codeScroll} p-4 font-mono text-sm leading-7 text-ink`}>
        {children}
      </div>
    </div>
  );
}
