"use client";

import Link from "next/link";
import { isValidElement, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import CodeBlock from "@/app/components/blog/CodeBlock";
import ZoomableInlineImage from "@/app/components/blog/ZoomableInlineImage";

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

function extractCodeLanguage(node: ReactNode): string | undefined {
  if (!isValidElement(node)) {
    return undefined;
  }

  const props = node.props as { className?: string };
  const className = typeof props.className === "string" ? props.className : "";
  return className
    .split(" ")
    .find((value) => value.startsWith("language-"));
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
          a: ({ node, href = "", children, ...props }) => {
            const isExternal = href.startsWith("http");
            const elementNode =
              node && typeof node === "object" && "children" in node ? node : null;
            const containsImage =
              !!elementNode &&
              Array.isArray(elementNode.children) &&
              elementNode.children.some(
                (child) =>
                  child.type === "element" &&
                  "tagName" in child &&
                  child.tagName === "img",
              );

            if (containsImage) {
              return <span {...props}>{children}</span>;
            }

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
            <ZoomableInlineImage
              src={src}
              alt={alt.trim() || "Illustration from the article"}
            />
          ),
          pre: ({ children }) => (
            <CodeBlock
              code={extractText(children)}
              language={extractCodeLanguage(children)}
            >
              {children}
            </CodeBlock>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
