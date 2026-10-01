import { Noto_Serif_SC, Source_Serif_4 } from 'next/font/google'

// Both are self-hosted at build time by next/font — nothing is fetched from
// Google at runtime. Latin resolves in Source Serif 4 and Chinese falls
// through to Noto Serif SC; see --font-serif in app/globals.css.

export const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-source-serif',
})

// No `subsets` on purpose: Noto Serif SC arrives as ~100 unicode-range chunks,
// and naming a subset makes next/font emit preload links for it. preload stays
// off — a page with two lines of Chinese should not ask for 100 font files up
// front; the browser fetches only the chunks whose ranges it actually renders.
export const notoSerifSC = Noto_Serif_SC({
  display: 'swap',
  preload: false,
  variable: '--font-noto-serif',
})
