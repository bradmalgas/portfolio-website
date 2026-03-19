# Design System

Portfolio redesign — Brad Malgas. Updated: March 2026.

**Direction:** Editorial and professional. Neutral graphite surfaces, crisp blue accents, and generous whitespace so the work and writing stay front-and-centre.

---

## Colour Palette

Theme tokens live in `lib/theme/palette.ts`, are exposed through CSS custom properties in `globals.css`, and are consumed by Tailwind in `tailwind.config.ts`.

### Presets

- `portfolio` is the new default preset.
- `electric` restores the earlier indigo-led design system with the `#7C6EFF` accent.
- `classic` preserves the original warm copper palette.
- `harbor` adds a calm teal professional direction with cleaner corporate readability.
- `journal` adds a darker editorial direction with a rose accent and more publication-like typography.
- Change `DEFAULT_THEME_PALETTE` in `lib/theme/palette.ts` to switch presets in code.

### Backgrounds (layered, dark to lighter)

| Token | Hex | Usage |
|---|---|---|
| `background` | `#0A0C10` | Page root, outermost layer |
| `surface` | `#12151C` | Section backgrounds |
| `surface-raised` | `#181C24` | Cards, panels, elevated elements |
| `surface-overlay` | `#212731` | Hover states, popovers, tooltips |

### Borders

| Token | Hex | Usage |
|---|---|---|
| `border` | `#3A424E` | Standard borders, card outlines |
| `border-subtle` | `#232933` | Very faint separators, dividers |

### Text

| Token | Hex | Usage |
|---|---|---|
| `ink` | `#F4F7FB` | Primary text — cool near-white |
| `ink-secondary` | `#AAB3C3` | Secondary text, descriptions |
| `ink-tertiary` | `#6B7584` | Metadata, placeholders, disabled |

### Accent — Professional Blue

| Token | Value | Usage |
|---|---|---|
| `accent` | `#2563EB` | Primary CTA, highlights, active states |
| `accent-hover` | `#60A5FA` | Hover state of accent elements |
| `accent-dim` | `rgba(37,99,235,0.12)` | Tinted card backgrounds, tag fills |
| `accent-glow` | `rgba(37,99,235,0.25)` | Shadow/glow on interactive elements |

---

## Typography

Typography presets live in `lib/theme/typography.ts` and are selected automatically from the active theme preset.

- `portfolio`: **Archivo** display + **Geist Sans** body for a crisp but still professional default.
- `electric`: **Space Grotesk** display + **Manrope** body for a more expressive futuristic tone without pushing too far.
- `classic`: **Playfair Display** display + **Geist Sans** body for a warmer editorial balance.
- `harbor`: **Lexend** display + **Source Sans 3** body for a calm, polished product feel.
- `journal`: **Newsreader** display + **Source Sans 3** body for a more editorial, essay-like mood.
- Code and UI monospace remain on **Geist Mono** across presets.

### Scale (defined in Tailwind `fontSize`)

| Token | Size | Line Height | Tracking | Usage |
|---|---|---|---|---|
| `display` | 72px / 4.5rem | 1.0 | −0.04em | Hero name, large feature text |
| `h1` | 48px / 3rem | 1.05 | −0.03em | Page titles |
| `h2` | 36px / 2.25rem | 1.1 | −0.025em | Section headings |
| `h3` | 24px / 1.5rem | 1.2 | −0.015em | Subsection titles, card titles |
| `h4` | 18px / 1.125rem | 1.3 | −0.01em | Labels, minor headings |
| `body-lg` | 18px / 1.125rem | 1.8 | — | Lead paragraphs, hero sub-text |
| `body` | 16px / 1rem | 1.75 | — | Standard body copy |
| `body-sm` | 14px / 0.875rem | 1.65 | — | Secondary copy, card descriptions |
| `label` | 12px / 0.75rem | 1.5 | +0.08em | Tags, badges, metadata |

### Heading style convention

- Weight: `font-semibold` (600) for h2–h4, `font-bold` (700) for h1 and display
- Colour: `text-ink` for headings, `text-ink-secondary` for body
- Never use `uppercase tracking-widest` on headings — reserved for **eyebrow labels** only

### Eyebrow labels

Short uppercase text above section headings. Use the `.eyebrow` utility class:
```
text-accent text-label font-semibold tracking-widest uppercase
```
Example: `EXPERIENCE`, `PROJECTS`, `ABOUT`

---

## Spacing

Tailwind's default spacing scale (4px base) is used throughout. Semantic values:

| Purpose | Value | Tailwind |
|---|---|---|
| Section vertical padding | 96px | `py-24` |
| Section horizontal padding | clamp(24px → 160px) | `.section-padding` utility |
| Card padding | 24–32px | `p-6` / `p-8` |
| Element gap (tight) | 8–12px | `gap-2` / `gap-3` |
| Element gap (standard) | 16–20px | `gap-4` / `gap-5` |
| Section gap | 40–64px | `gap-10` / `gap-16` |

The `.section-padding` utility class applies consistent responsive horizontal + vertical padding.

---

## Border Radius

| Token | Value | Usage |
|---|---|---|
| `rounded-sm` | 6px | Tags, badges, small chips |
| `rounded` | 10px | Buttons, inputs |
| `rounded-md` | 14px | Standard cards |
| `rounded-lg` | 20px | Large cards, feature panels |
| `rounded-xl` | 28px | Modals, sheets |
| `rounded-2xl` | 40px | Hero elements, large display items |
| `rounded-full` | 9999px | Avatars, icon buttons, progress pills |

---

## Shadows

| Token | Usage |
|---|---|
| `shadow-sm` | Subtle lift on small elements |
| `shadow` | Standard card depth |
| `shadow-lg` | Floating UI, dropdowns |
| `shadow-xl` | Modals, overlays |
| `shadow-glow` | Accent glow on hover (CTAs, active links) |
| `shadow-glow-lg` | Hero/feature element glow |
| `shadow-inner-highlight` | Inset top highlight (`inset 0 1px 0 rgba(255,255,255,0.06)`) |

---

## Component Guidelines

### Section structure
Every section follows the same pattern:
```tsx
<section className="section-padding bg-surface">   {/* or bg-background */}
  <div className="max-w-5xl mx-auto">
    <span className="eyebrow">Section Name</span>
    <h2 className="text-h2 font-semibold text-ink mt-2">Heading</h2>
    <div className="section-rule" />
    {/* content */}
  </div>
</section>
```

### Cards
```tsx
<div className="card p-6 shadow-inner-highlight hover:border-accent/40 transition-colors duration-250">
```

### Buttons
- Primary CTA: `.btn-accent`
- Secondary/ghost: `.btn-ghost`
- Icon-only: `rounded-full p-2 hover:bg-surface-overlay`

### Tags / skill pills
```tsx
<span className="tag">C#</span>
```

### Section rule (replaces the old `border-t-8` divider)
```tsx
<span className="section-rule" />
```

### Navigation links
```tsx
className="text-ink-secondary hover:text-ink transition-colors duration-250"
```
Active state: `text-ink` with optional `text-accent` accent.

### Accent glow on interactive elements
Add `hover:shadow-glow` to buttons and key CTAs. Use sparingly — max one or two per section.

---

## Do / Don't

| Do | Don't |
|---|---|
| Use `ink-secondary` for body text | Use pure white (`#fff`) for body text |
| Use `eyebrow` class for section labels | Use `uppercase tracking-widest` on headings |
| Use `section-rule` as dividers | Use thick `border-t-8` rules |
| Use `accent-dim` for tinted backgrounds | Use `accent` as a background at full opacity |
| Let whitespace breathe | Stack elements with minimal margin |
| Use `shadow-glow` sparingly | Apply glow to every element |
