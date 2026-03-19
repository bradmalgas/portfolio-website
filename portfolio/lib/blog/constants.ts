import type { PostStatus, ReactionEmoji } from "@/types/blog";

export const BLOG_POST_SELECT =
  "id,slug,title,description,content,category,tags,cover_image,status,published_at,created_at,updated_at,reading_time_minutes,view_count,fts";

export const BLOG_POST_LIST_SELECT =
  "id,slug,title,description,category,tags,cover_image,status,published_at,created_at,updated_at,reading_time_minutes,view_count,fts";

export const BLOG_PAGE_SIZE = 10;

export const BLOG_REACTIONS: ReactionEmoji[] = ["👍", "❤️", "🔥", "🎉", "💡"];

export const BLOG_STATUSES: PostStatus[] = ["draft", "published", "scheduled"];
