"use client";

import { useState } from "react";

import type { TocItem } from "@/lib/blog/utils";

interface TableOfContentsProps {
  items: TocItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (items.length === 0) {
    return null;
  }

  return (
    <aside className="card sticky top-24 h-fit overflow-hidden p-4 shadow-inner-highlight">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-accent">
          On This Page
        </h2>
        <button
          type="button"
          className="btn-ghost px-3 py-1 text-xs lg:hidden"
          onClick={() => setIsOpen((value) => !value)}
        >
          {isOpen ? "Hide" : "Show"}
        </button>
      </div>

      <nav className={`${isOpen ? "mt-4 block" : "mt-4 hidden"} lg:block`}>
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
