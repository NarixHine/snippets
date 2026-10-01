import type { Metadata } from 'next'
import { notoSerifSC, sourceSerif } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: 'Snippets',
  description: 'Short pieces of writing.',
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className={`${sourceSerif.variable} ${notoSerifSC.variable}`}>
      <body className='bg-paper font-serif text-ink antialiased'>{children}</body>
    </html>
  )
}
