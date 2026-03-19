import ReactMarkdown from "react-markdown";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { createMarkdownComponents } from "@/app/components/blog/markdown-shared";

interface MarkdownArticleProps {
  content: string;
  className?: string;
}

export default function MarkdownArticle({
  content,
  className = "",
}: MarkdownArticleProps) {
  return (
    <div className={`blog-prose ${className}`.trim()}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeHighlight,
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "append" }],
        ]}
        components={createMarkdownComponents()}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
