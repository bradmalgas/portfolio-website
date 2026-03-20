# Portfolio Website — Full Technical Documentation

> A Next.js 15 portfolio and blog platform with a multi-theme design system, dynamic OG image generation, Supabase-backed CMS, and Clerk authentication. This document serves as both a development reference and a reuse guide for extracting systems (theming, OG images, blog CMS) into other projects.

---

## Table of Contents

1. [Quick Start](#1-quick-start)
2. [Architecture Overview](#2-architecture-overview)
3. [Environment Variables](#3-environment-variables)
4. [Design Token & Theme System](#4-design-token--theme-system)
5. [Typography System](#5-typography-system)
6. [Component Utilities (CSS)](#6-component-utilities-css)
7. [Dynamic OG Image Generation](#7-dynamic-og-image-generation)
8. [Blog System](#8-blog-system)
9. [Blog API Reference](#9-blog-api-reference)
10. [Editor: Save vs Publish](#10-editor-save-vs-publish)
11. [Server Actions](#11-server-actions)
12. [Caching & Revalidation](#12-caching--revalidation)
13. [Authentication & Authorization](#13-authentication--authorization)
14. [Code Syntax Highlighting](#14-code-syntax-highlighting)
15. [SEO & Metadata](#15-seo--metadata)
16. [Homepage Sections](#16-homepage-sections)
17. [Reusable Patterns](#17-reusable-patterns)
18. [File Map](#18-file-map)

---

## 1. Quick Start

```bash
npm install
npm run dev      # Dev server with Turbopack at localhost:3000
npm run build    # Production build (runs prebuild script first)
npm run lint     # ESLint
npm run start    # Serve production build
```

**Build pipeline:** `prebuild` runs `scripts/generate-highlight-themes.mjs` to codegen highlight.js theme CSS into `lib/theme/highlight-themes.generated.ts`, then `next build --webpack` compiles the app.

**Key dependencies:**

| Package | Purpose |
|---|---|
| `next@16` | App Router framework |
| `react@19` | UI library |
| `@clerk/nextjs@7` | Authentication |
| `@supabase/supabase-js@2` | Database & file storage |
| `react-markdown` | Markdown rendering |
| `rehype-highlight` / `highlight.js` | Code syntax highlighting |
| `remark-gfm` | GFM tables, strikethrough, task lists |
| `rehype-slug` + `rehype-autolink-headings` | Heading anchors |
| `@toast-ui/editor` | Admin markdown editor |
| `feed` | RSS generation |
| `reading-time` | Reading time calculation |
| `geist` | Geist Sans + Mono fonts |

---

## 2. Architecture Overview

```
┌──────────────────────────────────────────────────────┐
│  app/layout.tsx                                       │
│  ┌─ ThemeProvider (client context)                    │
│  ├─ ClerkProvider (auth context)                      │
│  ├─ Navbar (fixed, responsive)                        │
│  └─ <main>                                            │
│      ├─ / → page.tsx (Hero → About → Projects → …)   │
│      ├─ /blog → blog listing, pagination, filters     │
│      ├─ /blog/[slug] → post + OG image route          │
│      ├─ /blog/editor → admin CMS (protected)          │
│      └─ /api/blog/* → REST API routes                 │
└──────────────────────────────────────────────────────┘

Data:  Supabase (Postgres) ← posts, reactions tables
Auth:  Clerk ← single admin user
Files: Supabase Storage ← blog-images bucket
```

**next.config.ts** enables `experimental.authInterrupts` (for `forbidden()`) and configures remote image patterns for Supabase, Azure Blob Storage, and Unsplash.

---

## 3. Environment Variables

| Variable | Scope | Required | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public | No (defaults to `https://bradmalgas.com`) | Canonical URL for metadata, OG images, sitemaps |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Public | Yes | Clerk frontend auth |
| `CLERK_SECRET_KEY` | Server | Yes | Clerk backend auth |
| `ADMIN_USER_ID` | Server | Yes | Clerk user ID of the single admin |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Yes | Supabase anon key (read-only) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server | Yes | Supabase service role (admin writes) |

---

## 4. Design Token & Theme System

### How to reuse this in another project

The theme system is self-contained in three files. Copy them and adapt:

1. `lib/theme/palette.ts` — palette definitions + CSS serialiser
2. `lib/theme/typography.ts` — font stack presets + CSS serialiser
3. `app/components/theme/ThemeProvider.tsx` — React context + localStorage persistence

### Architecture

All colours are stored as **raw RGB triplets** (e.g. `"37 99 235"`) so they can be used with Tailwind's `/opacity` syntax: `rgb(var(--color-accent-rgb) / 0.12)`.

**Layer 1 — Palette presets** (`lib/theme/palette.ts`):

Five named presets, each with `dark` and `light` variants:

| Preset | Accent | Character |
|---|---|---|
| `portfolio` (default) | Blue `#2563EB` | Clean, professional |
| `electric` | Indigo `#7C6EFF` | Vibrant, modern |
| `classic` | Amber `#C1804E` | Warm, editorial |
| `harbor` | Teal `#0D9488` | Calm, nature |
| `journal` | Pink `#EC4899` | Expressive, bold |

Each palette defines 21 tokens:

```
backgroundRgb        surfaceRgb           surfaceRaisedRgb
surfaceOverlayRgb    borderRgb            borderSubtleRgb
inkRgb               inkSecondaryRgb      inkTertiaryRgb
accentRgb            accentHoverRgb
syntaxAccentRgb      syntaxStringRgb      syntaxNumberRgb
syntaxVariableRgb    syntaxDeletionRgb
shadowSm             shadowDefault        shadowLg
shadowXl             innerHighlight
```

**Layer 2 — CSS custom properties** (`globals.css`):

`:root` maps the raw RGB tokens into usable CSS values:

```css
--color-accent:     rgb(var(--color-accent-rgb));
--color-accent-dim: rgb(var(--color-accent-rgb) / 0.12);
--color-accent-glow: rgb(var(--color-accent-rgb) / 0.25);
--shadow-glow:      0 0 24px rgb(var(--color-accent-rgb) / 0.30);
```

Plus ambient backgrounds and grid overlays:
- `--page-ambient` — radial gradient glow behind page content
- `--page-grid` — subtle grid lines (88px spacing)
- `--section-frame-border` / `--section-frame-highlight` — section container styling

**Layer 3 — Injection into `<head>`** (`app/layout.tsx`):

Three `<style>` blocks are injected as `dangerouslySetInnerHTML`:
1. `getThemeStyleSheet()` — serialises palette into `:root`, `[data-theme="dark"]`, `[data-theme="light"]` selectors
2. `getCodeThemeStyleSheet()` — code block shell variables + highlight.js theme CSS
3. `getTypographyStyleSheet()` — font family CSS variables

**Layer 4 — FOUC prevention** (boot script):

A `<Script strategy="beforeInteractive">` runs before hydration. It reads `localStorage` (key: `bradmalgas-theme`), falls back to `prefers-color-scheme`, and sets `data-theme` + `color-scheme` on `<html>`. This prevents flash-of-wrong-theme.

**Layer 5 — React context** (`ThemeProvider.tsx`):

Uses `useSyncExternalStore` (not `useState`) to read theme from `document.documentElement.dataset.theme`. Provides:

```typescript
interface ThemeContextValue {
  theme: "dark" | "light";
  isReady: boolean;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
}
```

`setTheme` / `toggleTheme` update three things simultaneously: `data-theme` attribute, `color-scheme` style, and `localStorage`.

Cross-tab sync is handled via the `storage` event. System preference changes are tracked via `matchMedia("(prefers-color-scheme: dark)")`.

### Retheming

To change the site's accent colour for the default preset, edit only `accentRgb` and `accentHoverRgb` in the `portfolio` palette object in `lib/theme/palette.ts`. Every component, shadow, glow, and gradient derives from these tokens.

To switch to a different preset entirely, change `DEFAULT_THEME_PALETTE` in `lib/theme/palette.ts`.

---

## 5. Typography System

**File:** `lib/theme/typography.ts`

Each palette preset maps to a typography preset with three font families:

| Preset | Display Font | Body Font | Mono |
|---|---|---|---|
| `portfolio` | Archivo | Geist Sans | Geist Mono |
| `electric` | Space Grotesk | Manrope | Geist Mono |
| `classic` | Playfair Display | Geist Sans | Geist Mono |
| `harbor` | Lexend | Source Sans 3 | Geist Mono |
| `journal` | Newsreader | Source Sans 3 | Geist Mono |

These are injected as CSS variables:
- `--font-sans-theme` — body text
- `--font-display` — headings (h1–h4 use this via `globals.css` base layer)
- `--font-mono-theme` — code

All Google Fonts are loaded via `next/font/google` with tree-shaking. Font CSS variables (e.g. `--font-archivo`) are applied to `<html>` via the `className` attribute.

---

## 6. Component Utilities (CSS)

Defined in `globals.css` under `@layer components`. Use these classes directly in JSX:

| Class | Purpose |
|---|---|
| `.section-padding` | Consistent section padding across breakpoints: `px-5 py-14 md:px-12 md:py-24 lg:px-24 xl:px-40` |
| `.section-rule` | Short accent-coloured horizontal bar beneath section headings (3px × 40px) |
| `.eyebrow` | Small uppercase label above headings (accent colour, 0.18em letter-spacing) |
| `.card` | Card surface with border, shadow, and gradient background |
| `.btn-accent` | Filled accent button with glow on hover and scale on active |
| `.btn-ghost` | Ghost/outline button that fills with accent-dim on hover |
| `.tag` | Accent-tinted pill for technology tags |
| `.blog-input` / `.blog-textarea` | Form inputs themed with design tokens |
| `.display-heading` | Hero-scale heading (tight leading, negative tracking) |
| `.section-heading` | h2-scale heading |
| `.section-lead` | Lead paragraph (larger text, secondary ink) |
| `.section-shell` | Rounded container with gradient background and accent glow |
| `.theme-section` | Page section with framed background, glow pseudo-elements |
| `.theme-section--about/projects/career/contact` | Section-specific gradient variants |
| `.project-card` | Project card with gradient background and hover shadow |
| `.navbar-shell` | Navbar container with blur, gradient, and scroll-state variants |
| `.blog-prose` | Wrapper for rendered markdown — spacing, link styles, blockquotes, tables, code |
| `.blog-quote` | Styled blockquote card with decorative quotation marks |

---

## 7. Dynamic OG Image Generation

### How to reuse this in another project

Copy two files:
1. `lib/blog/opengraph.tsx` — the image builder (framework-agnostic `ImageResponse`)
2. `app/blog/[slug]/opengraph-image.tsx` — the Next.js route that calls it

### Architecture

**Route:** `app/blog/[slug]/opengraph-image.tsx`

This is a Next.js [special file](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image) — placing `opengraph-image.tsx` inside a route automatically generates OG images at that URL and injects the correct `<meta>` tags.

```
Exports:
  runtime = "nodejs"       // required for font loading
  alt = "Brad Malgas blog post"
  size = { width: 1200, height: 630 }
  contentType = "image/png"
```

**Builder:** `lib/blog/opengraph.tsx`

`createBlogOpenGraphImage({ badge, title, description?, footer? })` returns an `ImageResponse`.

**Font loading:** Fetches Geist font (400, 700, 900 weights) from Google Fonts API at runtime. Parses the CSS response to extract the binary font URL, then fetches the `ArrayBuffer`. The 900 weight falls back to 700 if unavailable.

```typescript
async function loadGoogleFont(font: string, weight: number): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${font}:wght@${weight}&display=swap`;
  const css = await (await fetch(url)).text();
  const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/);
  const response = await fetch(resource[1]);
  return response.arrayBuffer();
}
```

**Layout structure** (1200×630px):

```
┌────────────────────────────────────────────────┐
│  gradient background (background → surface)     │
│  ┌─ dot grid (accent, 24px spacing, 8% opacity) │
│  ├─ glow circle top-right (accent, 30%, blur)   │
│  ├─ glow circle bottom-left (accent, 18%, blur) │
│  │                                               │
│  │  ┌─ card frame (16px inset, rounded-24)      │
│  │  │  ┌─ CATEGORY badge (pill, accent bg)      │
│  │  │  │                                         │
│  │  │  │  Title Text                             │
│  │  │  │  (font size scales with length)         │
│  │  │  │                                         │
│  │  │  │                        [Brad Logo SVG]  │
│  │  │  └─────────────────────────────────────   │
│  │  └─────────────────────────────────────────  │
│  └───────────────────────────────────────────── │
└────────────────────────────────────────────────┘
```

**Dynamic font sizing:**

| Title length | Font size |
|---|---|
| > 120 chars | 64px |
| > 88 chars | 76px |
| > 60 chars | 86px |
| ≤ 60 chars | 96px |

**Palette integration:** The image reads colours from the active palette preset (`themePalettes[DEFAULT_THEME]`), so OG images automatically match the site's active theme.

**Caching:** Vercel OG sets `cache-control: public, immutable, max-age=31536000` by default. Do not set `revalidate` — it conflicts with these headers.

---

## 8. Blog System

### Database Schema

**`posts` table:**

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Auto-generated PK |
| `slug` | text | Unique, URL-safe |
| `title` | text | Required |
| `description` | text | Optional excerpt |
| `content` | text | Markdown body |
| `category` | text | Single category |
| `tags` | text[] | Array of tag strings |
| `cover_image` | text | URL to cover image |
| `status` | text | `draft` / `published` / `scheduled` |
| `published_at` | timestamptz | Set when published |
| `created_at` | timestamptz | Auto |
| `updated_at` | timestamptz | Auto |
| `reading_time_minutes` | integer | Computed on save |
| `view_count` | integer | Incremented via RPC |
| `fts` | tsvector | Full-text search column |

**`reactions` table:**

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Auto-generated PK |
| `post_id` | uuid | FK to posts |
| `emoji` | text | One of: 👍 ❤️ 🔥 🎉 💡 |
| `session_id` | text | Client-generated, prevents duplicate reactions |
| `created_at` | timestamptz | Auto |

**RPC:** `increment_view_count(post_slug text)` — atomically increments `view_count`.

### Supabase Client Setup

**File:** `lib/supabase.ts`

Two clients:

1. **Public client** (`supabase`) — uses anon key, no session persistence. Safe for client-side and server reads. Initialised lazily via a `Proxy` — the actual client is only created when first accessed.

2. **Admin client** (`getSupabaseAdminClient()`) — uses service role key, server-only (throws if `window` exists). Used for all writes (create/update/delete posts, upload images).

### Blog Pages

| Route | Access | Description |
|---|---|---|
| `/blog` | Public | Listing with pagination (10/page), category sidebar, tag filter, full-text search |
| `/blog/[slug]` | Public | Single post: markdown rendering, TOC, reactions, adjacent post nav, view tracking |
| `/blog/category/[category]` | Public | Posts filtered by category |
| `/blog/tag/[tag]` | Public | Posts filtered by tag |
| `/blog/feed.xml` | Public | RSS feed (all published posts) |
| `/blog/editor` | Admin | Dashboard listing all posts (any status) with edit/delete |
| `/blog/editor/new` | Admin | Create new post form |
| `/blog/editor/[slug]` | Admin | Edit existing post form |
| `/blog/sign-in` | Public | Clerk sign-in page |

### Markdown Rendering Stack

Posts are written in Markdown and rendered with:

```
react-markdown
  ├─ remark-gfm          (tables, strikethrough, task lists)
  ├─ rehype-highlight     (syntax highlighting via highlight.js)
  ├─ rehype-slug          (auto-generate heading IDs)
  └─ rehype-autolink-headings (clickable heading links)
```

Custom component overrides in `app/components/blog/markdown-shared.tsx` handle links, images, code blocks, and tables with theme-aware styling.

The `CodeBlock` component (`app/components/blog/CodeBlock.tsx`) adds a language label and a copy-to-clipboard button on top of highlighted code.

### Table of Contents

`getTableOfContents(markdown)` in `lib/blog/utils.ts` parses `##` and `###` headings from raw markdown, slugifies them for anchor IDs, and handles duplicates by appending `-1`, `-2`, etc.

### Reactions

Five emoji reactions per post: 👍 ❤️ 🔥 🎉 💡

Reactions use a `session_id` (client-generated) to prevent the same session from adding duplicate reactions for the same emoji. Duplicate attempts return `409`.

### RSS Feed

`/blog/feed.xml` generates an RSS 2.0 feed using the `feed` package. Includes all published posts with title, description, first 500 chars of content, category, and tags.

---

## 9. Blog API Reference

### `GET /api/blog/posts`

Fetch published posts with optional filters.

**Query parameters:**

| Param | Type | Default | Description |
|---|---|---|---|
| `page` | int | 1 | Page number |
| `pageSize` | int | 10 (max 50) | Items per page |
| `category` | string | — | Filter by category |
| `tag` | string | — | Filter by tag (array contains) |
| `search` | string | — | Full-text search (websearch syntax) |
| `status` | string | `published` | Post status (non-published requires admin auth) |

**Response:** `{ posts: PostListItem[], total: number, page: number, pageSize: number }`

### `POST /api/blog/posts`

Create a new post. **Admin only.**

**Body (JSON):**

```json
{
  "title": "My Post",
  "slug": "my-post",          // optional, auto-generated from title
  "description": "Excerpt",   // optional
  "content": "# Markdown body",
  "category": "Engineering",
  "tags": ["next.js", "react"],
  "cover_image": "https://...", // optional
  "status": "draft",           // draft | published | scheduled
  "published_at": "2025-01-01T00:00:00Z" // optional
}
```

**Response:** `201` with created post object. `409` if slug already exists.

### `GET /api/blog/posts/[slug]`

Fetch a single published post by slug.

**Response:** Full `Post` object or `404`.

### `PUT /api/blog/posts/[slug]`

Update a post. **Admin only.** Partial updates — only include fields you want to change.

**Response:** Updated `Post` object. `404` if not found, `409` if new slug conflicts.

### `DELETE /api/blog/posts/[slug]`

Delete a post. **Admin only.**

**Response:** `204` on success. `404` if not found.

### `POST /api/blog/posts/[slug]/views`

Increment view count (fire-and-forget from client).

**Response:** `204`.

### `GET /api/blog/posts/[slug]/reactions`

Get reaction counts for a post.

**Response:** `[{ emoji: "👍", count: 5 }, { emoji: "❤️", count: 3 }, ...]`

### `POST /api/blog/posts/[slug]/reactions`

Add a reaction. **Public** (no auth required).

**Body:** `{ "emoji": "🔥", "sessionId": "client-uuid" }`

**Response:** `201` with created reaction. `409` if duplicate (same session + emoji).

### `GET /api/blog/categories`

List all categories from published posts with counts.

**Response:** `[{ category: "Engineering", count: 5 }, ...]` (sorted by count descending)

---

## 10. Editor: Save vs Publish

The editor (`app/blog/editor/[slug]/page.tsx`) has a **status selector** with three states that control visibility:

| Status | Visible on `/blog`? | Behaviour |
|---|---|---|
| `draft` | No | Saved to DB but not publicly accessible. No `published_at` date required. |
| `published` | Yes | Visible on the blog. If `published_at` is not set, it auto-fills with the current timestamp on save. |
| `scheduled` | No | Saved with a future `published_at` date. (Note: no cron job currently auto-publishes — scheduling is metadata-only.) |

**Workflow:**

1. **Create draft:** Go to `/blog/editor/new`, fill in fields, leave status as `draft`, click Save. Post is created in DB but invisible to readers.

2. **Edit draft:** Go to `/blog/editor`, click on the draft. Make changes, save. Still invisible.

3. **Publish:** Change status to `published`, click Save. The `ensurePublishedAt()` utility auto-sets `published_at` to now if blank. Post appears on `/blog` and in the RSS feed.

4. **Unpublish:** Change status back to `draft`. Post disappears from public listings. `published_at` is preserved so it can be re-published at the same date.

5. **Slug changes:** If you change the slug while editing, the old URL is revalidated (cache purged) and the new URL becomes active.

**Auto-computed fields on save:**
- `reading_time_minutes` — calculated via the `reading-time` library
- `published_at` — auto-set to `now()` when status changes to `published` and no date is provided

**Image upload:** The editor supports uploading cover images via `uploadPostImageAction()`. Files are stored in the Supabase `blog-images` bucket under `covers/{timestamp}-{uuid}-{filename}`. The returned public URL is saved to the post's `cover_image` field.

---

## 11. Server Actions

**File:** `app/blog/editor/actions.ts`

All mutations go through server actions (not API routes) when triggered from the editor UI. The API routes exist for programmatic access.

| Action | Signature | Returns |
|---|---|---|
| `createPostAction` | `(input: EditorPostInput) → ActionResult<{ slug, status }>` | New post's slug |
| `updatePostAction` | `(slug: string, input: EditorPostInput) → ActionResult<{ slug, status }>` | Updated slug (may differ if slug was changed) |
| `deletePostAction` | `(slug: string) → ActionResult<null>` | Success/failure |
| `uploadPostImageAction` | `(formData: FormData) → ActionResult<{ url: string }>` | Public URL of uploaded file |

**Result type:**

```typescript
type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };
```

All actions:
1. Check admin access via `ensureAdminAccess()` (Clerk auth + `ADMIN_USER_ID` match)
2. Validate and normalise input (trim, slugify, normalise tags/category)
3. Perform the DB operation via Supabase admin client
4. Call `revalidateBlogContent()` to purge relevant caches
5. Return structured result

---

## 12. Caching & Revalidation

**File:** `lib/blog/cache.ts`

Blog data is cached using Next.js `unstable_cache()` with tag-based invalidation.

### Cache Tags

| Tag | Scope |
|---|---|
| `blog:posts` | All post queries |
| `blog:post:{slug}` | Single post by slug |
| `blog:status:{status}` | Posts filtered by status |
| `blog:category:*` | All category-based queries |
| `blog:category:{name}` | Specific category |
| `blog:tag:*` | All tag-based queries |
| `blog:tag:{name}` | Specific tag |
| `blog:search:*` | All search queries |
| `blog:categories` | Category list endpoint |
| `blog:tags` | Tag list |
| `blog:feed` | RSS feed |

### Revalidation Trigger

`revalidateBlogContent(slug?, category?, tags[])` is called after every create, update, or delete. It:

1. Revalidates all wildcard tags (`blog:posts`, `blog:categories`, `blog:tags`, `blog:feed`, all status tags, all wildcard category/tag/search tags)
2. If `slug` provided: revalidates `blog:post:{slug}` tag + `/blog/{slug}` and `/blog/editor/{slug}` paths
3. If `category` provided: revalidates `blog:category:{name}` tag + `/blog/category/{name}` path
4. For each tag: revalidates `blog:tag:{name}` tag + `/blog/tag/{name}` path
5. Always revalidates paths: `/blog`, `/blog/editor`, `/blog/feed.xml`

### Sitemap Cache

`app/sitemap.ts` uses `revalidate = 3600` (hourly ISR). Falls back to core routes only if Supabase env vars are missing.

---

## 13. Authentication & Authorization

### Clerk Setup

Clerk wraps the app in `layout.tsx`:

```typescript
<ClerkProvider
  signInUrl="/blog/sign-in"
  signInFallbackRedirectUrl="/blog/editor"
  signUpFallbackRedirectUrl="/blog/editor"
  afterSignOutUrl="/"
>
```

### Admin Model

Single-admin model. The `ADMIN_USER_ID` env var holds the Clerk user ID of the admin. All auth checks compare the authenticated user's ID against this value.

**File:** `lib/blog/auth.ts`

```typescript
// For pages — returns { userId, isAdmin } without throwing
async function getAdminAccess(): Promise<AdminAccess>

// For API routes — returns { error: NextResponse } if unauthorized
async function requireAdminApiUser(): Promise<{ userId: string } | { error: NextResponse }>
```

### Protected Routes

**Pages:** Editor pages call `getAdminAccess()`. If no `userId`, redirect to `/blog/sign-in`. If `userId` but not admin, call `forbidden()` (renders `app/forbidden.tsx` — requires `experimental.authInterrupts: true` in `next.config.ts`).

**API routes:** Mutating endpoints call `requireAdminApiUser()`. Returns 401 (not authenticated) or 403 (not admin).

**Public endpoints:** `GET /api/blog/posts` (published only), `GET /api/blog/posts/[slug]`, reactions endpoints, categories, views.

---

## 14. Code Syntax Highlighting

### How to reuse this in another project

Copy:
1. `lib/theme/code.ts` — theme selection + CSS generation
2. `lib/theme/palette.ts` — needed for palette tokens
3. `scripts/generate-highlight-themes.mjs` — prebuild codegen
4. Add `"prebuild": "node scripts/generate-highlight-themes.mjs"` to package.json

### Architecture

**Build-time codegen:** `scripts/generate-highlight-themes.mjs` reads CSS files from `node_modules/highlight.js/styles/` for each palette's selected themes, and writes them as exported string constants into `lib/theme/highlight-themes.generated.ts`.

**Theme mapping** (`lib/theme/code.ts`):

Each palette preset maps to a highlight.js light/dark theme pair:

| Palette | Light Theme | Dark Theme |
|---|---|---|
| portfolio | `github` | `github-dark` |
| electric | `atom-one-light` | `atom-one-dark` |
| classic | `stackoverflow-light` | `stackoverflow-dark` |
| harbor | `base16/atelier-heath-light` | `base16/atelier-heath` |
| journal | `panda-syntax-light` | `panda-syntax-dark` |

**CSS scoping:** The highlight.js CSS is scoped to `html[data-code-theme-mode="mapped"][data-theme="light/dark"]` selectors, so theme switching swaps highlight themes automatically.

**Code block shell variables:** Additional CSS variables (`--code-surface-rgb`, `--code-border-rgb`, etc.) are generated from the palette for the code block container styling (background, borders, copy button).

---

## 15. SEO & Metadata

### Root Metadata (`app/layout.tsx`)

- **Title template:** `%s | Brad Malgas` (pages set their own title, template appends the brand)
- **OG image:** `/og-image.png` (static, 1200×630)
- **Twitter card:** `summary_large_image`
- **JSON-LD:** `Person` schema with `jobTitle`, `sameAs` (LinkedIn, GitHub, blog), `knowsAbout`
- **Canonical:** `https://bradmalgas.com`
- **Keywords:** Brad Malgas, Senior Software Developer, Azure, C#, .NET, Cloud Native, etc.

### Blog Post Metadata (`app/blog/[slug]/page.tsx`)

- Dynamic title from post
- Dynamic OG image from `opengraph-image.tsx` (auto-injected by Next.js)
- `published_time` and `modified_time` in OG metadata
- Category and tags as article tags

### Blog Listing Metadata (`app/blog/page.tsx`)

- Filtered views (category, tag, search) set `robots.index: false`
- Pagination canonicals: `/blog?page=N` for page > 1
- RSS feed link in `alternates`

### Sitemap (`app/sitemap.ts`)

Dynamic XML sitemap:
- Homepage: priority 1, weekly
- `/blog`: priority 0.8, weekly
- `/blog/{slug}`: priority 0.7, monthly (lastModified from `updated_at`)
- `/blog/category/{name}`: priority 0.6, weekly
- Gracefully degrades if Supabase env vars are missing

### RSS Feed (`/blog/feed.xml`)

Generated on request. Includes all published posts with metadata, first 500 chars of content, category and tags as categories.

---

## 16. Homepage Sections

The homepage (`app/page.tsx`) renders five sections in order. All data is hardcoded in the component files — no CMS or database.

### Hero (`app/components/hero/Hero.tsx`)

- Full viewport height (`min-h-[calc(100vh-4rem)]`)
- Parallax background: `translateY` at 0.25× scroll speed via `requestAnimationFrame`
- Respects `prefers-reduced-motion` (disables parallax)
- Entrance animations: CSS keyframes `hero-content-1`, `hero-content-2`, `hero-content-3` with staggered delays

### About (`app/components/about/AboutSection.tsx`)

- Server component
- Two-column at `lg:` breakpoint: photo (left) + bio + skills grid (right)
- Years of experience computed from `CAREER_START = new Date(2021, 0)` at render time
- Skills array: `{ category, items[] }` — edit directly in file

### Projects (`app/components/projects/ProjectsSection.tsx`)

- Server component
- Data source: `app/components/projects/data.ts`
- `Project` interface: `{ id, title, image, description, tags[], githubLink, blogLink }`
- To add a project: add to the `projects` array, put screenshot in `/public/images/`

### Career (`app/components/career/CareerSection.tsx`)

- Client component (accordion state)
- Three sub-sections: Experience (timeline with accordion), Education, Certifications
- All data in local arrays at top of file
- `TimelineEntry` sub-component with `open` state for expanding responsibilities

### Contact & Footer (`app/components/contact/ContactFooter.tsx`)

- Server component
- Social links in a `LINKS` object and `contactLinks` array
- Footer repeats social icons as small links

---

## 17. Reusable Patterns

### FadeIn Wrapper (`app/components/ui/FadeIn.tsx`)

Scroll-triggered animation. Wraps any `ReactNode`:

```tsx
<FadeIn delay={100} threshold={0.12}>
  <div>Animates in when scrolled into view</div>
</FadeIn>
```

- Starts: `opacity: 0`, `translateY(40px)`
- Enters: `opacity: 1`, `translateY(0)` with CSS transition
- Fires once (observer disconnects after first intersection)
- Immediately visible if `prefers-reduced-motion: reduce`

### useInView Hook (`app/hooks/useInView.ts`)

```typescript
const { ref, inView } = useInView({ threshold: 0.12 });
```

Thin `IntersectionObserver` wrapper. Returns `{ ref, inView }`. Fires once. Respects reduced motion.

### Supabase Lazy Proxy (`lib/supabase.ts`)

The public Supabase client uses a `Proxy` for lazy initialisation — the actual client is only created on first property access. This avoids errors when env vars are missing during build.

### Action Result Pattern (`app/blog/editor/actions.ts`)

All server actions return a discriminated union:

```typescript
type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };
```

Consumer code uses `if (!result.ok) { showError(result.error); return; }`.

### Utility Functions (`lib/blog/utils.ts`)

| Function | Purpose |
|---|---|
| `slugify(value)` | Unicode-safe slug generation (NFKD normalise, strip diacritics, lowercase, hyphenate) |
| `calculateReadingTimeMinutes(content)` | Reading time (minimum 1 minute) |
| `normaliseTags(tags)` | Accepts `string[]`, comma-separated string, or null → deduplicated array |
| `normaliseCategory(category)` | Trims whitespace |
| `ensurePublishedAt(status, publishedAt)` | Auto-sets to now for `published` status |
| `formatDate(date)` / `formatShortDate(date)` | UTC date formatting (e.g. "15 January 2025" / "15 Jan 2025") |
| `getTableOfContents(markdown)` | Parses h2/h3 headings → `{ id, text, level }[]` |
| `getWordAndCharacterCount(markdown)` | Word and character counts |
| `groupReactionCounts(reactions)` | Tallies emoji reactions into `{ emoji, count }[]` |
| `serialisePostForEditor(post)` | Converts `Post` (tags as array) → editor format (tags as comma string) |

---

## 18. File Map

```
portfolio/
├── app/
│   ├── layout.tsx              # Root layout: theme, auth, fonts, metadata, JSON-LD
│   ├── page.tsx                # Homepage (5 sections)
│   ├── globals.css             # Design tokens, component utilities, blog prose
│   ├── sitemap.ts              # Dynamic XML sitemap
│   ├── robots.ts               # robots.txt
│   ├── forbidden.tsx           # 403 page for non-admin users
│   │
│   ├── api/blog/
│   │   ├── posts/route.ts            # GET (list) + POST (create)
│   │   ├── posts/[slug]/route.ts     # GET + PUT + DELETE
│   │   ├── posts/[slug]/views/route.ts    # POST (increment view)
│   │   ├── posts/[slug]/reactions/route.ts # GET + POST reactions
│   │   └── categories/route.ts       # GET category list
│   │
│   ├── blog/
│   │   ├── page.tsx                  # Blog listing with pagination/filters
│   │   ├── [slug]/page.tsx           # Single post view
│   │   ├── [slug]/opengraph-image.tsx # Dynamic OG image per post
│   │   ├── [slug]/not-found.tsx      # Post 404
│   │   ├── category/[category]/page.tsx
│   │   ├── tag/[tag]/page.tsx
│   │   ├── feed.xml/route.ts        # RSS feed
│   │   ├── editor/page.tsx           # Admin dashboard
│   │   ├── editor/[slug]/page.tsx    # Edit post form
│   │   ├── editor/layout.tsx         # Editor layout wrapper
│   │   ├── editor/actions.ts         # Server actions (CRUD + upload)
│   │   └── sign-in/[[...sign-in]]/page.tsx
│   │
│   ├── components/
│   │   ├── navbar/Navbar.tsx
│   │   ├── hero/Hero.tsx
│   │   ├── about/AboutSection.tsx
│   │   ├── projects/ProjectsSection.tsx
│   │   ├── projects/ProjectCard.tsx
│   │   ├── projects/data.ts          # Project data (single source of truth)
│   │   ├── career/CareerSection.tsx   # Experience/education/certs data
│   │   ├── contact/ContactFooter.tsx
│   │   ├── blog/
│   │   │   ├── EditorForm.tsx         # Blog editor form component
│   │   │   ├── MarkdownRenderer.tsx   # react-markdown with plugins
│   │   │   ├── markdown-shared.tsx    # Custom markdown component overrides
│   │   │   ├── CodeBlock.tsx          # Code block with copy + language label
│   │   │   ├── PostCard.tsx           # Blog listing card
│   │   │   ├── MarkdownArticle.tsx    # Full article layout
│   │   │   ├── ToastMarkdownEditor.tsx # Toast UI editor wrapper
│   │   │   ├── BlogPagination.tsx
│   │   │   ├── BlogSearchInput.tsx
│   │   │   ├── TableOfContents.tsx
│   │   │   ├── ReactionBar.tsx
│   │   │   ├── GiscusComments.tsx
│   │   │   ├── PostViewTracker.tsx
│   │   │   ├── DeletePostButton.tsx
│   │   │   ├── ShareButtons.tsx
│   │   │   └── ZoomableInlineImage.tsx
│   │   ├── theme/
│   │   │   ├── ThemeProvider.tsx       # Dark/light context + useSyncExternalStore
│   │   │   └── ThemeToggle.tsx         # Toggle button component
│   │   ├── ui/
│   │   │   ├── FadeIn.tsx             # Scroll-triggered animation wrapper
│   │   │   └── Select.tsx             # Themed select component
│   │   ├── scroll-to-top/ScrollToTop.tsx
│   │   └── icons/
│   │       ├── BradLogoIcon.tsx
│   │       ├── MenuIcon.tsx
│   │       └── CloseIcon.tsx
│   └── hooks/
│       └── useInView.ts              # IntersectionObserver hook
│
├── lib/
│   ├── supabase.ts                   # Lazy proxy + admin client
│   ├── blog/
│   │   ├── data.ts                   # All Supabase queries (cached)
│   │   ├── auth.ts                   # Admin access checks
│   │   ├── cache.ts                  # Cache tags + revalidation
│   │   ├── utils.ts                  # Slug, dates, TOC, reactions, etc.
│   │   ├── constants.ts              # Select columns, page size, emoji list
│   │   ├── opengraph.tsx             # OG image builder
│   │   └── opengraph-fallback.tsx    # Fallback OG layout
│   └── theme/
│       ├── palette.ts                # 5 palette presets + CSS serialiser
│       ├── typography.ts             # Font presets + CSS serialiser
│       ├── code.ts                   # Highlight.js theme mapping + CSS
│       └── highlight-themes.generated.ts  # Auto-generated (prebuild)
│
├── types/
│   └── blog.ts                       # Post, Reaction, filter types, DB types
│
├── scripts/
│   ├── generate-highlight-themes.mjs # Prebuild: codegen highlight CSS
│   └── generate-favicons.mjs         # Favicon generation utility
│
├── public/
│   ├── images/                       # Project screenshots, profile photo
│   ├── fonts/                        # Geist TTF files (for OG fallback)
│   └── og-image.png                  # Static OG image for homepage
│
├── next.config.ts                    # Auth interrupts, remote images
├── tailwind.config.ts                # Design token integration
├── tsconfig.json                     # Strict mode, @/* alias
└── package.json                      # Scripts, dependencies
```
