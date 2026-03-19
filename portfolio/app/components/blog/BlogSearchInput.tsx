import { Search } from "lucide-react";

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
  return (
    <form action="/blog" method="get" className="card flex items-center gap-3 px-4 py-3 shadow-inner-highlight">
      {category ? <input type="hidden" name="category" value={category} /> : null}
      {tag ? <input type="hidden" name="tag" value={tag} /> : null}
      <Search aria-hidden="true" className="h-4 w-4 text-accent" />
      <input
        type="search"
        name="search"
        defaultValue={defaultValue}
        placeholder="Search posts..."
        className="w-full bg-transparent text-body text-ink placeholder:text-ink-tertiary focus:outline-none"
        aria-label="Search blog posts"
      />
      <button type="submit" className="btn-ghost px-3 py-1.5 text-xs">
        Search
      </button>
    </form>
  );
}
