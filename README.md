# Portfolio

Brad Malgas' portfolio website and blog, built with Next.js App Router, TypeScript, Tailwind CSS, Clerk, and Supabase.

The site has two main surfaces:

- A single-page portfolio homepage composed of stacked sections with in-page navigation
- A blog with public reading routes plus an authenticated admin editor

## Scripts

```bash
npm run dev             # Start the local dev server
npm run build           # Production build (webpack-backed, currently the stable path)
npm run build:turbopack # Production build using Turbopack
npm run start           # Start the production server
npm run lint            # Run ESLint
```

There are currently no automated tests in the project.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- Clerk for blog admin auth
- Supabase for blog data, reactions, and storage
- Giscus for blog comments

## Architecture

### App structure

`app/page.tsx` renders the homepage sections in this order:

```text
Hero -> AboutSection -> ProjectsSection -> CareerSection -> ContactFooter
```

`app/layout.tsx` provides:

- Site metadata, Open Graph, Twitter metadata, and JSON-LD
- Theme bootstrapping and theme palette injection
- The fixed navbar
- The main content wrapper and skip link
- Global theme and auth providers
- Scroll-to-top behaviour

### Blog structure

The blog uses App Router routes under `app/blog`:

- `app/blog/page.tsx` for the blog index
- `app/blog/[slug]/page.tsx` for public post pages
- `app/blog/category/[category]/page.tsx` and `app/blog/tag/[tag]/page.tsx` for filtered views
- `app/blog/editor/*` for the authenticated admin editor
- `app/blog/feed.xml/route.ts` for RSS

Public blog content is read from Supabase. Admin create, update, delete, and image upload flows are handled with Server Actions.

## Key content sources

### Projects

Project cards are driven by:

- `app/components/projects/data.ts`

Add or update entries there when changing the portfolio projects grid.

### Career, education, certifications

These live directly in:

- `app/components/career/CareerSection.tsx`

### Contact details

Contact and social links live in:

- `app/components/contact/ContactFooter.tsx`

### Blog data

Blog content is stored in Supabase rather than local markdown files. Public blog reads use the helpers in:

- `lib/blog/data.ts`

## Styling and theming

The project uses a token-based styling system built from CSS variables and Tailwind utilities.

Primary styling files:

- `app/globals.css`
- `tailwind.config.ts`
- `lib/theme/palette.ts`

Theme palettes are defined in `lib/theme/palette.ts`, and the root layout injects the generated CSS so the site can switch cleanly between dark and light themes.

Reusable UI patterns include:

- `card`
- `btn-accent`
- `btn-ghost`
- `tag`
- `section-padding`
- `eyebrow`
- `section-rule`

## Useful files

- `app/components/navbar/Navbar.tsx` - responsive top navigation
- `app/components/hero/Hero.tsx` - hero section with parallax background
- `app/components/ui/FadeIn.tsx` - scroll-triggered reveal wrapper
- `app/components/blog/MarkdownArticle.tsx` - server-rendered blog markdown
- `app/blog/editor/actions.ts` - blog admin Server Actions

## Environment variables

The app expects environment variables for site metadata, auth, and blog infrastructure. The main ones used directly in the codebase are:

```bash
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ADMIN_USER_ID
NEXT_PUBLIC_GISCUS_REPO
NEXT_PUBLIC_GISCUS_REPO_ID
NEXT_PUBLIC_GISCUS_CATEGORY
NEXT_PUBLIC_GISCUS_CATEGORY_ID
```

Clerk also requires its standard Next.js environment variables.

## Notes

- The stable production build path is currently `npm run build`, which uses webpack.
- `npm run build:turbopack` is available for Turbopack validation and experimentation.
