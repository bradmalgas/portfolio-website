"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import CodeBlock from "@/app/components/blog/CodeBlock";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

function extractText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(extractText).join("");
  }

  if (node && typeof node === "object" && "props" in node) {
    return extractText((node as { props?: { children?: ReactNode } }).props?.children ?? "");
  }

  return "";
}

export default function MarkdownRenderer({
  content,
  className = "",
}: MarkdownRendererProps) {
  return (
    <div className={`blog-prose ${className}`.trim()}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeHighlight,
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "append" }],
        ]}
        components={{
          a: ({ href = "", children, ...props }) => {
            const isExternal = href.startsWith("http");

            if (isExternal) {
              return (
                <a href={href} target="_blank" rel="noreferrer" {...props}>
                  {children}
                </a>
              );
            }

            return (
              <Link href={href} {...props}>
                {children}
              </Link>
            );
          },
          img: ({ src = "", alt = "" }) => (
            <span className="my-8 block overflow-hidden rounded-md border border-border bg-surface-raised">
              <Image
                src={src}
                alt={alt}
                width={1200}
                height={675}
                className="h-auto w-full object-cover"
              />
            </span>
          ),
          pre: ({ children }) => (
            <CodeBlock code={extractText(children)}>{children}</CodeBlock>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
