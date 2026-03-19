"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import type { TocItem } from "@/lib/blog/utils";

interface TableOfContentsProps {
  items: TocItem[];
  className?: string;
  collapsible?: boolean;
}

export default function TableOfContents({
  items,
  className = "",
  collapsible = false,
}: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(!collapsible);

  if (items.length === 0) {
    return null;
  }

  return (
    <aside className={`card h-fit overflow-hidden p-4 shadow-inner-highlight ${className}`.trim()}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-sans text-sm font-semibold uppercase tracking-widest text-accent">
          On This Page
        </h2>
        {collapsible ? (
          <button
            type="button"
            className="btn-ghost inline-flex min-h-11 items-center gap-2 px-3 py-2 text-xs"
            onClick={() => setIsOpen((value) => !value)}
            aria-expanded={isOpen}
            aria-controls="blog-toc-nav"
          >
            {isOpen ? "Hide" : "Show"}
            <ChevronDown className={`h-4 w-4 transition-transform duration-250 ${isOpen ? "rotate-180" : ""}`} />
          </button>
        ) : null}
      </div>

      <nav
        id="blog-toc-nav"
        className={`${isOpen ? "mt-4 block" : "mt-4 hidden"} ${collapsible ? "" : "block"}`.trim()}
      >
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`block text-body-sm text-ink-secondary transition-colors duration-250 hover:text-ink ${
                  item.level === 3 ? "pl-4" : ""
                }`}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
