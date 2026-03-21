"use client";

import { useState } from "react";
import { Check, ChevronDown, ChevronUp, Copy } from "lucide-react";

import styles from "@/app/components/blog/CodeBlock.module.css";

const COLLAPSE_LINE_THRESHOLD = 25;
const COLLAPSED_HEIGHT = 320;

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
  const lineCount = code.split("\n").length;
  const isCollapsible = lineCount > COLLAPSE_LINE_THRESHOLD;
  const [collapsed, setCollapsed] = useState(isCollapsible);
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
    <div className={`group relative my-6 rounded-md border shadow ${styles.container}`}>
      <div className={`${styles.toolbar} flex min-h-11 items-center justify-between gap-4 px-4 py-2`}>
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--code-muted-rgb))]">
          {label}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className={`${styles.copyButton} inline-flex min-h-9 items-center gap-2 rounded-sm px-3 py-1.5 text-[11px] font-medium transition-colors duration-250`}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <div className="relative">
        <div
          className={`${styles.codeScroll} ${styles.codeSurface} p-4 font-mono text-sm leading-7 transition-[max-height] duration-300 ease-in-out`}
          style={collapsed ? { maxHeight: COLLAPSED_HEIGHT, overflow: "hidden" } : undefined}
        >
          {children}
        </div>
        {isCollapsible && collapsed && (
          <div className={styles.collapseFade} />
        )}
      </div>
      {isCollapsible && (
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className={`${styles.collapseButton} flex w-full items-center justify-center gap-1.5 py-2 text-[11px] font-medium transition-colors duration-200`}
        >
          {collapsed ? (
            <>
              <ChevronDown className="h-3.5 w-3.5" />
              Show more
            </>
          ) : (
            <>
              <ChevronUp className="h-3.5 w-3.5" />
              Show less
            </>
          )}
        </button>
      )}
    </div>
  );
}
