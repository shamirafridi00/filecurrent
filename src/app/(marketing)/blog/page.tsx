import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'FileCurrent Blog — Freelance Contracts, Invoices & Business Tips',
  description: 'Guides, templates, and tips for independent professionals.',
}

const CATEGORY_COLORS: Record<string, string> = {
  alternatives: 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
  guides: 'bg-accent text-primary border-primary/20',
  templates: 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]',
  tips: 'bg-[#FFF9ED] text-[#E6A817] border-[#FDD87A]',
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-[-0.02em] text-foreground mb-3">The FileCurrent Blog</h1>
          <p className="text-muted-foreground">Guides, templates, and tips for independent professionals.</p>
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-muted-foreground">No posts yet. Check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="card-elevated-hover group rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${CATEGORY_COLORS[post.category] ?? 'bg-muted text-muted-foreground border-border'}`}>
                    {post.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{post.readingTime}</span>
                </div>
                <h2 className="font-semibold text-foreground text-sm leading-snug mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3">{post.description}</p>
                <p className="text-primary text-xs mt-4 font-medium">Read article →</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
