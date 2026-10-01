import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
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

  const { title, date, lang, links, html } = snippet
  const cjk = lang.toLowerCase().startsWith('zh')

  return (
    <main className='mx-auto w-full max-w-[34rem] px-6 pt-24 pb-28 sm:pt-36 sm:pb-32'>
      <article lang={lang}>
        {title ? (
          <h1 className='mb-3 text-[1.4rem] leading-[1.35] font-normal text-balance'>{title}</h1>
        ) : null}

        <time
          dateTime={date}
          className={
            'block font-sans text-[0.72rem] text-muted ' +
            (cjk ? 'tracking-[0.08em]' : 'tracking-[0.16em] uppercase')
          }
        >
          {formatDate(date, lang)}
        </time>

        <div
          className='mt-10 space-y-[1.35em] text-[1.0625rem] leading-[1.8] text-pretty [&_a]:text-accent [&_a]:underline [&_a]:decoration-[0.5px] [&_a]:underline-offset-[3px] [&_blockquote]:border-l [&_blockquote]:border-rule [&_blockquote]:pl-4 [&_blockquote]:text-muted [&_code]:font-sans [&_code]:text-[0.85em] [&_h2]:text-[1.05rem] [&_h2]:font-normal [&_hr]:border-rule [&_img]:max-w-full [&_strong]:font-medium'
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {links.length > 0 ? (
          <footer className='mt-16 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-rule pt-5 font-sans text-[0.78rem] text-muted'>
            <span className={'text-[0.7rem] ' + (cjk ? '' : 'tracking-[0.14em] uppercase')}>
              {cjk ? '另见' : 'Also on'}
            </span>
            {links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target='_blank'
                rel='noreferrer noopener'
                className='text-accent underline decoration-[0.5px] underline-offset-[3px]'
              >
                {link.label}
              </a>
            ))}
          </footer>
        ) : null}
      </article>
    </main>
  )
}
