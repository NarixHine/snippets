import localFont from 'next/font/local'
import { Newsreader, Source_Serif_4 } from 'next/font/google'

export const english = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-en-serif',
})

export const chinese = localFont({
  src: '../lib/chinese.ttf',
  weight: '400',
  display: 'swap',
  preload: false,
  variable: '--font-zh-serif',
})
