import Link from "next/link";
import { isValidElement, type ReactNode } from "react";
import type { Components } from "react-markdown";

import CodeBlock from "@/app/components/blog/CodeBlock";
import ZoomableInlineImage from "@/app/components/blog/ZoomableInlineImage";

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

export function createMarkdownComponents(): Components {
  return {
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
    blockquote: ({ children }) => {
      return (
        <blockquote className="blog-quote">
          <span className="blog-quote__mark" aria-hidden="true">
            &ldquo;
          </span>
          <div className="blog-quote__content">{children}</div>
          <span className="blog-quote__mark blog-quote__mark--closing" aria-hidden="true">
            &rdquo;
          </span>
        </blockquote>
      );
    },
    pre: ({ children }) => (
      <CodeBlock
        code={extractText(children)}
        language={extractCodeLanguage(children)}
      >
        {children}
      </CodeBlock>
    ),
  };
}
