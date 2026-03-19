"use client";

import { useRef, useState } from "react";
import { Search, X } from "lucide-react";

interface BlogSearchInputProps {
  defaultValue?: string;
  category?: string;
  tag?: string;
}

export default function BlogSearchInput({
  defaultValue = "",
  category,
  tag,
}: BlogSearchInputProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [searchValue, setSearchValue] = useState(defaultValue);

  function handleClearSearch() {
    setSearchValue("");
  }

  function handleActionClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    if (hasSearchValue) {
      handleClearSearch();
      return;
    }

    formRef.current?.requestSubmit();
  }

  const hasSearchValue = searchValue.trim().length > 0;

  return (
    <form
      ref={formRef}
      action="/blog#post-browser"
      method="get"
      className="card flex min-h-11 items-center gap-3 rounded-full px-4 py-1.5 shadow-inner-highlight"
    >
      {category ? <input type="hidden" name="category" value={category} /> : null}
      {tag ? <input type="hidden" name="tag" value={tag} /> : null}
      <Search aria-hidden="true" className="h-4 w-4 text-accent" />
      <input
        type="search"
        name="search"
        value={searchValue}
        onChange={(event) => setSearchValue(event.target.value)}
        placeholder="Search posts..."
        className="w-full bg-transparent text-body text-ink placeholder:text-ink-tertiary focus:outline-none"
        aria-label="Search blog posts"
      />
      <button
        type="button"
        onClick={handleActionClick}
        className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-full text-ink-secondary transition-colors duration-200 hover:bg-surface-overlay hover:text-ink"
        aria-label={hasSearchValue ? "Clear search" : "Submit search"}
      >
        <span className="relative h-4 w-4">
          <Search
            aria-hidden="true"
            className={`absolute inset-0 h-4 w-4 transition-all duration-200 ${
              hasSearchValue ? "scale-75 opacity-0" : "scale-100 opacity-100"
            }`}
          />
          <X
            aria-hidden="true"
            className={`absolute inset-0 h-4 w-4 transition-all duration-200 ${
              hasSearchValue ? "scale-100 opacity-100" : "scale-75 opacity-0"
            }`}
          />
        </span>
      </button>
    </form>
  );
}
