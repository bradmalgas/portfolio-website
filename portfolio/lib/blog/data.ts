import {
  BLOG_PAGE_SIZE,
  BLOG_POST_LIST_SELECT,
  BLOG_POST_SELECT,
} from "@/lib/blog/constants";
import {
  getPublishedPostsCacheKey,
  getPublishedPostsCacheTags,
  withBlogCache,
} from "@/lib/blog/cache";
import { getSupabaseAdminClient, supabase } from "@/lib/supabase";
import type {
  CategoryCount,
  Post,
  PostFilters,
  PostListItem,
  TagCount,
} from "@/types/blog";

function applyPostFilters<TQuery extends {
  eq: (column: string, value: string) => TQuery;
  contains: (column: string, value: string[]) => TQuery;
  textSearch: (
    column: string,
    query: string,
    options?: { config?: string; type?: "plain" | "phrase" | "websearch" }
  ) => TQuery;
}>(query: TQuery, filters: PostFilters) {
  let nextQuery = query;

  if (filters.status) {
    nextQuery = nextQuery.eq("status", filters.status);
  }

  if (filters.category) {
    nextQuery = nextQuery.eq("category", filters.category);
  }

  if (filters.tag) {
    nextQuery = nextQuery.contains("tags", [filters.tag]);
  }

  if (filters.search) {
    nextQuery = nextQuery.textSearch("fts", filters.search, {
      config: "english",
      type: "websearch",
    });
  }

  return nextQuery;
}

export async function getPublishedPosts(filters: PostFilters = {}) {
  const normalizedFilters = {
    ...filters,
    page: filters.page ?? 1,
    pageSize: filters.pageSize ?? BLOG_PAGE_SIZE,
    status: filters.status ?? "published",
  };

  return withBlogCache(
    ["blog-published-posts", getPublishedPostsCacheKey(normalizedFilters)],
    async () => {
      const from = (normalizedFilters.page - 1) * normalizedFilters.pageSize;
      const to = from + normalizedFilters.pageSize - 1;

      let query = supabase
        .from("posts")
        .select(BLOG_POST_LIST_SELECT, { count: "exact" })
        .order("published_at", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false });

      query = applyPostFilters(query, normalizedFilters);

      const { data, count, error } = await query.range(from, to);

      if (error) {
        throw error;
      }

      return {
        posts: (data ?? []) as PostListItem[],
        total: count ?? 0,
        page: normalizedFilters.page,
        pageSize: normalizedFilters.pageSize,
      };
    },
    getPublishedPostsCacheTags(normalizedFilters),
  );
}

export async function getPublishedPostBySlug(slug: string) {
  return withBlogCache(
    ["blog-post", slug],
    async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(BLOG_POST_SELECT)
        .eq("slug", slug)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return null;
        }

        throw error;
      }

      return data as Post;
    },
    ["blog:posts", `blog:post:${slug}`],
  );
}

export async function incrementViewCount(slug: string) {
  const { error } = await supabase.rpc("increment_view_count", {
    post_slug: slug,
  });

  if (error) {
    throw error;
  }
}

export async function getPublishedCategories() {
  return withBlogCache(
    ["blog-categories"],
    async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("category")
        .eq("status", "published");

      if (error) {
        throw error;
      }

      const counts = new Map<string, number>();

      for (const row of data ?? []) {
        counts.set(row.category, (counts.get(row.category) ?? 0) + 1);
      }

      return Array.from(counts.entries())
        .map(([category, count]) => ({ category, count }))
        .sort(
          (left, right) =>
            right.count - left.count || left.category.localeCompare(right.category),
        ) as CategoryCount[];
    },
    ["blog:posts", "blog:categories"],
  );
}

export async function getPublishedTags() {
  return withBlogCache(
    ["blog-tags"],
    async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("tags")
        .eq("status", "published");

      if (error) {
        throw error;
      }

      const counts = new Map<string, number>();

      for (const row of data ?? []) {
        for (const tag of row.tags ?? []) {
          counts.set(tag, (counts.get(tag) ?? 0) + 1);
        }
      }

      return Array.from(counts.entries())
        .map(([tag, count]) => ({ tag, count }))
        .sort((left, right) => right.count - left.count || left.tag.localeCompare(right.tag)) as TagCount[];
    },
    ["blog:posts", "blog:tags"],
  );
}

export async function getAdjacentPublishedPosts(post: Post) {
  if (!post.published_at) {
    return {
      previous: null,
      next: null,
    };
  }

  const [previousResult, nextResult] = await Promise.all([
    supabase
      .from("posts")
      .select("slug,title,published_at,category")
      .eq("status", "published")
      .eq("category", post.category)
      .lt("published_at", post.published_at)
      .order("published_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("posts")
      .select("slug,title,published_at,category")
      .eq("status", "published")
      .eq("category", post.category)
      .gt("published_at", post.published_at)
      .order("published_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);

  if (previousResult.error) {
    throw previousResult.error;
  }

  if (nextResult.error) {
    throw nextResult.error;
  }

  return {
    previous: previousResult.data ?? null,
    next: nextResult.data ?? null,
  };
}

export async function getPublishedPostsForFeed() {
  return withBlogCache(
    ["blog-feed-posts"],
    async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(BLOG_POST_SELECT)
        .eq("status", "published")
        .order("published_at", { ascending: false, nullsFirst: false });

      if (error) {
        throw error;
      }

      return (data ?? []) as Post[];
    },
    ["blog:posts", "blog:feed"],
  );
}

export async function getAdminPosts() {
  const { data, error } = await getSupabaseAdminClient()
    .from("posts")
    .select(BLOG_POST_LIST_SELECT)
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as PostListItem[];
}

export async function getAdminPostBySlug(slug: string) {
  const { data, error } = await getSupabaseAdminClient()
    .from("posts")
    .select(BLOG_POST_SELECT)
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }

    throw error;
  }

  return data as Post;
}

export async function getAllCategoriesForEditor() {
  const { data, error } = await getSupabaseAdminClient()
    .from("posts")
    .select("category")
    .order("category", { ascending: true });

  if (error) {
    throw error;
  }

  return Array.from(new Set((data ?? []).map((item) => item.category))).filter(Boolean);
}
