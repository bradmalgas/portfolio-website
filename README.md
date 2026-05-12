# Portfolio Website

This is my personal portfolio website and blog. It is built with Next.js, TypeScript, Tailwind CSS, Clerk, and Supabase.

## Why This Exists

The site is meant to be the main public home for my work: projects, writing, career history, contact links, and a small blog system that I can manage myself.

## What It Does Today

- Renders a single-page portfolio homepage.
- Shows project cards from a local data file.
- Includes career, education, certification, and contact sections.
- Provides a public blog index and blog post pages.
- Includes an authenticated blog editor.
- Stores blog content, reactions, and uploads in Supabase.
- Uses Clerk for admin auth.
- Generates RSS and metadata for sharing.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- Clerk
- Supabase
- Giscus comments
- Highlight.js for code themes

## Local Setup

```bash
cd portfolio
npm install
npm run dev
```

Useful checks:

```bash
npm run lint
npm run build
```

`npm run build` uses the webpack-backed production build path. `npm run build:turbopack` is available separately.

## Key Content Files

- Project cards: `portfolio/app/components/projects/data.ts`
- Career section: `portfolio/app/components/career/CareerSection.tsx`
- Contact links: `portfolio/app/components/contact/ContactFooter.tsx`
- Blog data helpers: `portfolio/lib/blog/data.ts`
- Design notes: `portfolio/DESIGN_SYSTEM.md`

## Status

This is the canonical portfolio repo. Older generated portfolio copies have been moved out of the main repos folder so this remains the source of truth.

## Project Notes

- Environment variables are documented in the app config and `.env.local` is intentionally local-only.
- Blog content lives in Supabase, not local Markdown files.
- There are currently no automated tests beyond lint/build checks.
