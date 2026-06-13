import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/blog'
import { BlogList, type BlogCard } from '@/components/landing/BlogList'

export const metadata: Metadata = {
  title: 'FileCurrent Blog | Freelance Contracts, Invoices & Business Tips',
  description: 'Guides, templates, and tips for independent professionals.',
}

export default function BlogPage() {
  const posts: BlogCard[] = getAllPosts().map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    category: p.category,
    readingTime: p.readingTime,
    date: p.date,
  }))

  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-primary">Blog</p>
          <h1 className="mb-3 text-4xl font-bold tracking-[-0.02em] text-foreground">The FileCurrent Blog</h1>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Practical guides, ready-to-use templates, and money tips for US freelancers who want to spend
            less time on paperwork and more time getting paid.
          </p>
        </div>

        <BlogList posts={posts} />
      </div>
    </div>
  )
}
