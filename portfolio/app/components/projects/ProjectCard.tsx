"use client";

import Image from "next/image";
import type { Project } from "./data";

// Inline SVGs — no external icon lib required
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

export default function ProjectCard({ id, title, image, description, tags, githubLink, blogLink }: Project) {
  return (
    <article className="group relative flex flex-col bg-surface-raised border border-border rounded-lg overflow-hidden
                        shadow transition-all duration-350
                        hover:-translate-y-1 hover:border-accent/40 hover:shadow-glow">

      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-surface">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-[600ms] ease-in-out group-hover:scale-105"
        />
        {/* Gradient fade at bottom of image into card */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-surface-raised to-transparent" />

        {/* Project number badge */}
        <span className="absolute top-3 left-3 px-2 py-0.5 rounded-sm bg-background/80 backdrop-blur-sm
                         text-label font-semibold text-accent border border-accent/20 tracking-wide">
          {id}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <h3 className="text-h4 font-semibold text-ink group-hover:text-accent transition-colors duration-250">
          {title}
        </h3>

        <p className="text-body-sm text-ink-secondary leading-relaxed flex-1">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-1">
          {tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center gap-3 pt-2 border-t border-border">
          <a
            href={githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-body-sm text-ink-secondary
                       hover:text-ink transition-colors duration-250"
          >
            <GithubIcon />
            View Code
          </a>
          <span className="text-border">·</span>
          <a
            href={blogLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-body-sm text-ink-secondary
                       hover:text-ink transition-colors duration-250"
          >
            <ExternalLinkIcon />
            Read More
          </a>
        </div>
      </div>
    </article>
  );
}
