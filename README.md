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

Unset. Put `english.woff2`, `english-italic.woff2` and `chinese.woff2` in
`public/fonts/` — see `public/fonts/README.md`. System serif stack until then.

## Run

```sh
pnpm install
pnpm dev        # http://localhost:3000
pnpm build
```

## Deploy

Vercel. Set `NEXT_PUBLIC_SITE_URL` to the production origin so Open Graph
metadata resolves absolutely.

## Deliberate omissions

No listing page, no RSS/Atom, no sitemap, no analytics, no comments or likes,
no search, no tags, no icons, no client-side JavaScript. Dark mode follows the
system (`prefers-color-scheme`); there is no toggle.
