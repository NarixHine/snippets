import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import MusicPlayer from '@/components/music-player'
import { formatDate, getSnippet, snippetSlugs } from '@/lib/snippets'

export const dynamicParams = false

type PageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return snippetSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const snippet = getSnippet(slug)

  if (!snippet) return { title: 'Not found' }

  const title = snippet.title ?? snippet.plain.slice(0, 64)
  const description = snippet.plain.slice(0, 200)

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: snippet.date,
      locale: snippet.lang,
    },
    twitter: { card: 'summary' },
  }
}

export default async function SnippetPage({ params }: PageProps) {
  const { slug } = await params
  const snippet = getSnippet(slug)

  if (!snippet) notFound()

  const { title, date, lang, music, html } = snippet

  return (
    <main className='mx-auto w-full max-w-136 px-6 py-10 sm:py-16'>
      <article lang={lang}>
        {music ? <MusicPlayer src={music.src} name={music.name} /> : null}

        {title ? (
          <h1 className='mb-3 text-[1.5rem] leading-[1.35] font-normal text-balance'>{title}</h1>
        ) : null}

        <div
          className='mt-10 space-y-[1.35em] text-[1.125rem] leading-[1.8] text-pretty [&_a]:text-accent [&_a]:underline [&_a]:decoration-[0.5px] [&_a]:underline-offset-[3px] [&_blockquote]:border-l [&_blockquote]:border-rule [&_blockquote]:pl-4 [&_blockquote]:text-muted [&_code]:font-sans [&_code]:text-[0.85em] [&_h2]:text-[1.05rem] [&_h2]:font-normal [&_hr]:border-rule [&_img]:max-w-full [&_li+li]:mt-[0.3em] [&_li::marker]:text-muted [&_li]:ps-1 [&_ol]:list-decimal [&_ol]:ps-6 [&_ol_ol]:list-[lower-alpha] [&_ol_ol]:mt-[0.3em] [&_ol_ol_ol]:list-[lower-roman] [&_ol_ul]:mt-[0.3em] [&_strong]:font-medium [&_ul]:list-disc [&_ul]:ps-6 [&_ul_ol]:mt-[0.3em] [&_ul_ul]:list-[circle] [&_ul_ul]:mt-[0.3em] [&_ul_ul_ul]:list-[square]'
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
    </main>
  )
}
