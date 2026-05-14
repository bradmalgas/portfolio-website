import Image from "next/image";
import Link from "next/link";
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

const YouTubeIcon = () => (
    <svg viewBox="0 0 28.57  20" fill="currentColor" className="h-4 w-4">
        <svg
            viewBox="0 0 28.57 20"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g>
                <path
                    d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z"
                    fill="#FF0000"
                ></path>
                <path
                    d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z"
                    fill="white"
                ></path>
            </g>
        </svg>
    </svg>
);

export default function ProjectCard({
    id,
    title,
    image,
    description,
    tags,
    githubLink,
    blogLink,
    blogLinkLabel = "Build Write-up",
    youtubeLink,
}: Project) {
    return (
        <article className="project-card relative flex flex-col overflow-hidden rounded-[1.75rem] border border-border transition-[border-color,box-shadow] duration-250 hover:border-accent/30">
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.015)_0%,transparent_28%)] pointer-events-none" />

            <div className="project-card-media relative aspect-video overflow-hidden">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="scale-[1.015] object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 32vw"
                />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface-raised via-surface-raised/70 to-transparent" />

                <span className="absolute top-3 left-3 rounded-full border border-accent/20 bg-background/80 px-3 py-1 text-label font-semibold tracking-wide text-accent backdrop-blur-sm">
                    {id}
                </span>
            </div>

            <div className="flex flex-col flex-1 p-5 gap-3">
                <h3 className="font-display text-[1.45rem] font-semibold leading-tight tracking-[-0.03em] text-ink">
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

                <div className="flex items-center gap-3 pt-2 border-t border-border">
                    {githubLink ? (
                        <>
                            <span className="text-border">·</span>
                            <Link href={githubLink} className="metal-link">
                                <GithubIcon />
                                View Code
                            </Link>
                        </>
                    ) : null}
                    {blogLink ? (
                        <>
                            <span className="text-border">·</span>
                            <Link href={blogLink} className="metal-link">
                                <ExternalLinkIcon />
                                {blogLinkLabel}
                            </Link>
                        </>
                    ) : null}
                    {youtubeLink ? (
                        <>
                            <span className="text-border">·</span>
                            <Link href={youtubeLink} className="metal-link">
                                <YouTubeIcon />
                                Watch Demo
                            </Link>
                        </>
                    ) : null}
                    {!githubLink && !blogLink && !youtubeLink ? (
                        <>
                            <p className="metal-link">
                                Demo available upon request
                            </p>
                        </>
                    ) : null}
                </div>
            </div>
        </article>
    );
}
