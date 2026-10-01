import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { marked } from 'marked'

const DIR = path.join(process.cwd(), 'content', 'snippets')

export type SnippetLink = { label: string; url: string }

export type Snippet = {
  slug: string
  date: string
  title?: string
  lang: string
  links: SnippetLink[]
  html: string
  plain: string
}

function bad(file: string, message: string): never {
  throw new Error(`content/snippets/${file} — ${message}`)
}

/** YAML turns an unquoted 2026-03-02 into a Date; both shapes are accepted. */
function toDateString(value: unknown): string | undefined {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10)
  }
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  return undefined
}

function readOne(file: string): Snippet {
  const { data, content } = matter(fs.readFileSync(path.join(DIR, file), 'utf8'))
  const slug = file.replace(/\.md$/, '')

  const date = toDateString(data.date)
  if (!date) bad(file, 'frontmatter needs `date: YYYY-MM-DD`')

  if (data.title !== undefined && typeof data.title !== 'string') bad(file, '`title` must be a string')

  const links: SnippetLink[] = []
  if (data.links !== undefined) {
    if (!Array.isArray(data.links)) bad(file, '`links` must be a list of { label, url }')
    for (const entry of data.links as Array<Record<string, unknown>>) {
      const { label, url } = entry ?? {}
      if (typeof label !== 'string' || typeof url !== 'string') {
        bad(file, 'every link needs a `label` and a `url`')
      }
      links.push({ label, url })
    }
  }

  const body = content.trim()
  if (body === '') bad(file, 'the body is empty')

  const html = marked.parse(body) as string

  return {
    slug,
    date,
    title: typeof data.title === 'string' && data.title.trim() !== '' ? data.title.trim() : undefined,
    lang: typeof data.lang === 'string' && data.lang.trim() !== '' ? data.lang.trim() : 'en',
    links,
    html,
    plain: html
      .replace(/<\/(p|div|blockquote|li|h[1-6])>/g, ' ')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/\s+/g, ' ')
      .trim(),
  }
}

let cache: Snippet[] | undefined

export function allSnippets(): Snippet[] {
  if (!cache) {
    const files = fs.existsSync(DIR)
      ? fs
          .readdirSync(DIR)
          .filter((file) => file.endsWith('.md'))
          .sort()
      : []
    cache = files
      .map(readOne)
      .sort((a, b) => (a.date === b.date ? a.slug.localeCompare(b.slug) : a.date < b.date ? 1 : -1))
  }
  return cache
}

export function snippetSlugs(): string[] {
  return allSnippets().map((snippet) => snippet.slug)
}

export function getSnippet(slug: string): Snippet | undefined {
  return allSnippets().find((snippet) => snippet.slug === slug)
}

export function formatDate(date: string, lang = 'en'): string {
  return new Intl.DateTimeFormat(lang.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`))
}
