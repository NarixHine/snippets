# Snippets

Very short pieces of writing, each at its own address. No index, no feed, no
sitemap: `/` is a 404 on purpose, and a snippet is meant to be linked one at a
time from wherever the long-form version lives.

## Add a snippet

Create `content/snippets/<slug>.md`. The filename is the slug, so
`content/snippets/2026-03-02-snow.md` becomes `/s/2026-03-02-snow`.

```markdown
---
date: 2026-03-02          # required, YYYY-MM-DD
title: On walking home    # optional
lang: en                  # optional, defaults to en — set zh for Chinese
---

Body in Markdown. Blank line between paragraphs. Outbound links are ordinary
inline Markdown: `[also on X](https://x.com/…)`.
```

Frontmatter is validated at build time; a missing date fails the build with the
offending filename.

Dates render as `2026/3/2` in every language. `lang` only sets the page's
`lang` attribute and Open Graph locale — it is not a translation switch.

## Fonts

Self-hosted by `next/font/google` (see `app/fonts.ts`): **Source Serif 4** for
Latin, **Noto Serif SC** for Chinese. Both are downloaded and inlined at build
time, so nothing is requested from Google at runtime. `app/globals.css`
consumes the two CSS variables and keeps system serifs as fallbacks. Latin
glyphs resolve in Source Serif 4, CJK falls through the stack to Noto Serif SC.

## Run

```sh
bun install
bun run dev     # https://snippets.localhost
bun run build
```

`bun run dev` runs Next through [portless](https://github.com/vercel-labs/portless)
(Vercel Labs, installed globally — not a project dependency), so the dev server
has a stable HTTPS name instead of a port: `https://snippets.localhost`. The
name comes from the package name; worktrees get a branch-name subdomain
automatically. Bypass it with `PORTLESS=0 bun run dev` for plain
`http://localhost:3000`.

portless wants Node 24+ (`portless doctor` reports Node 22.14 as unsupported
here); it works regardless, but upgrade Node if you hit proxy oddities.

## Deploy

Vercel. Set `NEXT_PUBLIC_SITE_URL` to the production origin so Open Graph
metadata resolves absolutely.

## Deliberate omissions

No listing page, no RSS/Atom, no sitemap, no analytics, no comments or likes,
no search, no tags, no icons, no client-side JavaScript. Dark mode follows the
system (`prefers-color-scheme`); there is no toggle.
