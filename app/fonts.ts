import localFont from 'next/font/local'
import { Source_Serif_4 } from 'next/font/google'

// Latin is self-hosted at build time by next/font — nothing is fetched from
// Google at runtime. Chinese is the local 方正刻本仿宋简体, lib/FZKBFSJW.woff2.
// Latin resolves in Source Serif 4 and CJK falls through to it; see --font-serif
// in app/globals.css.

export const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-source-serif',
})

export const notoSerifSC = localFont({
  src: '../lib/FZKBFSJW.woff2',
  weight: '400',
  display: 'swap',
  preload: false,
  variable: '--font-noto-serif',
})
