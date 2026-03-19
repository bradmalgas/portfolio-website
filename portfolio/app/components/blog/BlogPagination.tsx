import Link from "next/link";

interface BlogPaginationProps {
  basePath: string;
  currentPage: number;
  pageSize: number;
  total: number;
  searchParams: Record<string, string | undefined>;
  hash?: string;
}

function createHref(
  basePath: string,
  searchParams: Record<string, string | undefined>,
  page: number,
  hash?: string,
) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (value) {
      params.set(key, value);
    }
  }

  if (page > 1) {
    params.set("page", String(page));
  } else {
    params.delete("page");
  }

  const query = params.toString();
  const href = query ? `${basePath}?${query}` : basePath;
  return hash ? `${href}#${hash}` : href;
}

export default function BlogPagination({
  basePath,
  currentPage,
  pageSize,
  total,
  searchParams,
  hash,
}: BlogPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-12 flex items-center justify-between gap-4">
      <Link
        href={createHref(basePath, searchParams, currentPage - 1, hash)}
        className={`btn-ghost text-sm ${currentPage <= 1 ? "pointer-events-none opacity-50" : ""}`}
      >
        Previous
      </Link>
      <p className="text-body-sm text-ink-secondary">
        Page {currentPage} of {totalPages}
      </p>
      <Link
        href={createHref(basePath, searchParams, currentPage + 1, hash)}
        className={`btn-ghost text-sm ${currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}`}
      >
        Next
      </Link>
    </div>
  );
}
