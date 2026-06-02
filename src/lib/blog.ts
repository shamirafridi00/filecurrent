import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog')

export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  category: string
  keywords: string[]
  readingTime: string
  content: string
}

export function getAllPosts(): Omit<BlogPost, 'content'>[] {
  if (!fs.existsSync(BLOG_DIR)) return []
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx'))
  return files
    .map(filename => {
      const slug = filename.replace('.mdx', '')
      const raw = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf-8')
      const { data, content } = matter(raw)
      const words = content.split(/\s+/).length
      return {
        slug,
        title: data.title as string,
        description: data.description as string,
        date: data.date as string,
        category: (data.category as string) ?? 'guides',
        keywords: (data.keywords as string[]) ?? [],
        readingTime: `${Math.ceil(words / 200)} min read`,
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPost(slug: string): BlogPost | null {
  const filepath = path.join(BLOG_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filepath)) return null
  const raw = fs.readFileSync(filepath, 'utf-8')
  const { data, content } = matter(raw)
  const words = content.split(/\s+/).length
  return {
    slug,
    title: data.title as string,
    description: data.description as string,
    date: data.date as string,
    category: (data.category as string) ?? 'guides',
    keywords: (data.keywords as string[]) ?? [],
    readingTime: `${Math.ceil(words / 200)} min read`,
    content,
  }
}
