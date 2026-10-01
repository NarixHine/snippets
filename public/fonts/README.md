# Fonts

Drop your own files here and they are used from the next build onward — no code
change needed. Until then the browser falls through to the system stack in
`app/globals.css`.

| file | used for |
| --- | --- |
| `english.woff2` | Latin text (regular) |
| `english-italic.woff2` | Latin italics — optional |
| `chinese.woff2` | CJK text |

`woff2` only. Subset them first if they are large; nothing here is fetched at
build time, so a missing file is silent rather than fatal.
