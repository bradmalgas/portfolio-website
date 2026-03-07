# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server with Turbopack at localhost:3000
npm run build    # Build for production (also runs next-sitemap postbuild)
npm run lint     # Run ESLint
npm run start    # Start production server
```

There are no tests in this project.

## Architecture

This is a **Next.js 15 App Router** portfolio website using TypeScript and Tailwind CSS.

### Directory structure

- `app/` — All Next.js App Router source code
  - `layout.tsx` — Root layout with global metadata, Geist fonts, Footer, and ScrollToTop
  - `page.tsx` — Home page (single-page sections: About, Experience, Skills, Education, Certifications)
  - `projects/page.tsx` — Projects listing page
  - `globals.css` — Global styles
  - `components/` — Shared components:
    - `card/Project Card.tsx` — Project card with hover overlay showing GitHub/blog links (note: filename has a space)
    - `sidenav/SideNav.tsx` — Mobile slide-in nav (`"use client"`)
    - `footer/Footer.tsx` — Site footer
    - `scroll-to-top/ScrollToTop.tsx` — Floating scroll-to-top button
    - `icons/` — SVG icon components (ArrowUp, BradLogoIcon, CloseIcon, MenuIcon)
- `public/` — Static assets (images, logos, favicon files, sitemap, robots.txt)
- `src/` — Contains only `assets/` and `components/` (currently unused; main code is in `app/`)

### Key design patterns

- **Navigation**: Inline desktop nav (hidden on mobile) + `SideNav` component for mobile. Nav is duplicated in both `app/page.tsx` and `app/projects/page.tsx` — there is no shared nav component.
- **Responsive breakpoints**: Mobile-first with `lg:` prefix for desktop variants. Mobile nav uses `lg:hidden`, desktop nav uses `lg:flex hidden`.
- **Color scheme**: `bg-gray-600` for dark sections (About, Experience, Education, Certifications), `bg-white` for light sections (Skills). Accent borders use `border-gray-100` on dark and `border-black` on light.
- **Client components**: Only interactive components use `"use client"` (SideNav, ProjectCard, ScrollToTop).
- **Sitemap**: Auto-generated via `next-sitemap` on build, configured in `next-sitemap.config.js` for `https://bradmalgas.com`.

### Adding a new project

Add a new `<ProjectCard>` in `app/projects/page.tsx` with `title`, `image` (path in `/public`), `description`, `githubLink`, and `blogLink` props.
