import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllPosts, getPost } from '@/lib/blog'
import { Button } from '@/components/ui/button'

export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPost(params.slug)
  if (!post) return {}
  return {
    title: `${post.title} — FileCurrent Blog`,
    description: post.description,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      images: post.heroImage ? [{ url: post.heroImage }] : [],
    },
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug)
  if (!post) notFound()

  const lines = post.content.split('\n')

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-2xl mx-auto px-6">
        <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 inline-block">
          ← Blog
        </Link>

        <div className="mb-2 flex items-center gap-3">
          <span className="text-xs text-primary font-semibold uppercase tracking-wide">{post.category}</span>
          <span className="text-xs text-muted-foreground">{post.readingTime}</span>
        </div>

        <h1 className="text-3xl font-bold tracking-[-0.02em] text-foreground mb-3 leading-tight">{post.title}</h1>
        <p className="text-muted-foreground text-sm mb-10">
          {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        {post.heroImage && (
          <img
            src={post.heroImage}
            alt={post.title}
            className="w-full rounded-xl mb-8 aspect-[1200/630] object-cover border border-border"
          />
        )}

        <div className="space-y-3">
          {lines.map((line, i) => {
            if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold text-foreground mt-8 mb-3">{line.slice(2)}</h1>
            if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-foreground mt-8 mb-3">{line.slice(3)}</h2>
            if (line.startsWith('### ')) return <h3 key={i} className="text-base font-semibold text-foreground mt-6 mb-2">{line.slice(4)}</h3>
            if (line.startsWith('> ')) return <blockquote key={i} className="border-l-4 border-primary pl-4 text-muted-foreground text-sm italic my-2">{line.slice(2)}</blockquote>
            if (line.startsWith('- **')) {
              const match = line.match(/^- \*\*(.+?)\*\*:? ?(.*)$/)
              if (match) return <p key={i} className="text-foreground text-sm pl-4">• <strong className="text-foreground">{match[1]}:</strong> {match[2]}</p>
            }
            if (line.startsWith('- ')) return <p key={i} className="text-muted-foreground text-sm pl-4">• {line.slice(2)}</p>
            if (line.startsWith('**Subject:**')) return <p key={i} className="text-foreground text-sm font-medium">{line}</p>
            if (line.startsWith('**Tone:**') || line.startsWith('**Best for:**') || line.startsWith('**Free tier:**')) {
              return <p key={i} className="text-primary text-sm">{line}</p>
            }
            if (line.trim() === '' || line === '---') return <div key={i} className="h-2" />
            return <p key={i} className="text-muted-foreground text-sm leading-relaxed">{line}</p>
          })}
        </div>

        <div className="mt-16 rounded-2xl border border-primary/20 bg-accent p-8 text-center">
          <h3 className="text-foreground font-bold text-lg mb-1">Start using FileCurrent free</h3>
          <p className="text-muted-foreground text-sm mb-5">Create your first contract in minutes. No credit card required.</p>
          <Button asChild className="bg-primary hover:bg-[#5145E5] text-white">
            <Link href="/signup">Start free →</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
