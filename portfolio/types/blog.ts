export type PostStatus = "draft" | "published" | "scheduled";

export type ReactionEmoji = "👍" | "❤️" | "🔥" | "🎉" | "💡";

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

export interface Reaction {
  id: string;
  post_id: string;
  emoji: ReactionEmoji;
  session_id: string;
  created_at: string;
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

export interface ReactionCount {
  emoji: ReactionEmoji;
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

export type ReactionInsert = Omit<Reaction, "id" | "created_at"> & {
  created_at?: string;
};

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: Post;
        Insert: PostInsert;
        Update: PostUpdate;
      };
      reactions: {
        Row: Reaction;
        Insert: ReactionInsert;
        Update: Partial<ReactionInsert>;
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
