# Snippets

Very short pieces of writing, each at its own address. No index, no feed, no
sitemap: `/` is a 404 on purpose, and a snippet is meant to be linked one at a
time from wherever the long-form version lives.

## Add a snippet

Create `content/snippets/<slug>.md`. The filename is the slug, so
`content/snippets/2026-03-02-snow.md` becomes `/2026-03-02-snow`.

```markdown
---
date: 2026-03-02          # required, YYYY-MM-DD
title: On walking home    # optional
lang: en                  # optional, defaults to en — set zh for Chinese
music: /music/rain.m4a    # optional
---

Body in Markdown. Blank line between paragraphs. Outbound links are ordinary
inline Markdown: `[also on X](https://x.com/…)`.
```

Frontmatter is validated at build time; a missing date, or a `music` value that
is not a path or a `{ src, title }` pair, fails the build with the offending
filename.

Dates render as `2026/3/2` in every language. `lang` only sets the page's
`lang` attribute and Open Graph locale — it is not a translation switch.

## Music

A snippet with a `music` property gets a player above its title. Either form:

```yaml
music: /music/rain.m4a          # label falls back to "Music"

music:                          # or give it a label
  src: /music/rain.m4a
  title: 雨
```

Audio lives in `public/music/`. The player streams nothing until you press play
(`preload="metadata"`): it shows one line — play/pause, the label, `elapsed /
total` — with a hairline scrubber under it. The hairline's played portion is
solid accent, the thumb is a paper-ringed dot, and the line thickens and the dot
appears on hover, on keyboard focus and while dragging. Click anywhere on it to
seek; drag to scrub; it is a real `<input type="range">` underneath, so arrow
keys work when it is focused. `prefers-reduced-motion` keeps the colour and
opacity changes and drops the movement.

It is the site's one client component. Pages without `music` render no player,
no audio element and no script for it.

## Fonts

Self-hosted through `next/font` (see `app/fonts.ts`), so nothing is requested
from Google at runtime. `app/globals.css` consumes the two variables and keeps
system serifs as fallbacks; Latin glyphs resolve in the Latin face, CJK falls
through the stack to the Chinese one.

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
no search, no tags, no icons. Client-side JavaScript exists only for the music
player. Dark mode follows the system (`prefers-color-scheme`); there is no
toggle.
