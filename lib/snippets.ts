import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { marked } from 'marked'

const DIR = path.join(process.cwd(), 'content', 'snippets')

export type Snippet = {
  slug: string
  date: string
  title?: string
  lang: string
  music?: Music
  html: string
  plain: string
}

export type Music = { src: string; name?: string; author?: string }

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

/** A name or title for the track; must be a non-empty string if present. */
function toName(file: string, value: unknown, key: string): string | undefined {
  if (value === undefined || value === null) return undefined
  if (typeof value !== 'string') bad(file, `${key} must be a string`)
  return value.trim() === '' ? undefined : value.trim()
}

/**
 * `music: /path.mp3`, `music: { src, name }`, or the shorthand `music: <path>`
 * with sibling `music-name:` and `music-author:` fields. `title` is accepted as
 * an alias of `name` inside the object. Sibling values take precedence.
 */
function toMusic(
  file: string,
  value: unknown,
  siblingName: unknown,
  siblingAuthor: unknown,
): Music | undefined {
  if (value === undefined || value === null) return undefined

  const name = toName(file, siblingName, '`music-name`')
  const author = toName(file, siblingAuthor, '`music-author`')

  if (typeof value === 'string') {
    if (value.trim() === '') bad(file, '`music` needs a file path or url')
    return { src: value.trim(), name, author }
  }

  if (typeof value === 'object' && !Array.isArray(value)) {
    const src = 'src' in value ? value.src : undefined
    const objectName = 'name' in value ? value.name : undefined
    const title = 'title' in value ? value.title : undefined
    const objectAuthor = 'author' in value ? value.author : undefined
    if (typeof src !== 'string' || src.trim() === '') {
      bad(file, '`music.src` must be a file path or url')
    }
    return {
      src: src.trim(),
      name: name ?? toName(file, objectName, '`music.name`') ?? toName(file, title, '`music.title`'),
      author: author ?? toName(file, objectAuthor, '`music.author`'),
    }
  }

  bad(file, '`music` must be a path/url or `{ src, name, author }`')
}

function readOne(file: string): Snippet {
  const { data, content } = matter(fs.readFileSync(path.join(DIR, file), 'utf8'))
  const slug = file.replace(/\.md$/, '')

  const date = toDateString(data.date)
  if (!date) bad(file, 'frontmatter needs `date: YYYY-MM-DD`')

  if (data.title !== undefined && typeof data.title !== 'string') bad(file, '`title` must be a string')

  const music = toMusic(file, data.music, data['music-name'], data['music-author'])

  const body = content.trim()
  if (body === '') bad(file, 'the body is empty')

  const html = marked.parse(body) as string

  return {
    slug,
    date,
    title: typeof data.title === 'string' && data.title.trim() !== '' ? data.title.trim() : undefined,
    lang: typeof data.lang === 'string' && data.lang.trim() !== '' ? data.lang.trim() : 'en',
    music,
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

export function formatDate(date: string): string {
  const [year, month, day] = date.split('-')
  return `${year}/${Number(month)}/${Number(day)}`
}
