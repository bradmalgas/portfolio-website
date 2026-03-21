export type PostStatus = "draft" | "published" | "scheduled";

export interface Post {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  content: string;
  category: string;
  tags: string[];
  cover_image: string | null;
  status: PostStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  reading_time_minutes: number | null;
  view_count: number;
  fts: string | null;
}

export type PostListItem = Omit<Post, "content">;

export interface PostFilters {
  category?: string;
  tag?: string;
  search?: string;
  status?: PostStatus;
  page?: number;
  pageSize?: number;
}

export interface CategoryCount {
  category: string;
  count: number;
}

export interface TagCount {
  tag: string;
  count: number;
}

export type PostInsert = Omit<
  Post,
  "id" | "created_at" | "updated_at" | "view_count" | "fts"
> & {
  created_at?: string;
  updated_at?: string;
  view_count?: number;
  fts?: string | null;
};

export type PostUpdate = Partial<PostInsert>;

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: Post;
        Insert: PostInsert;
        Update: PostUpdate;
      };
    };
    Functions: {
      increment_view_count: {
        Args: {
          post_slug: string;
        };
        Returns: undefined;
      };
    };
  };
}
