'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CaretLeft, CaretRight, Clock } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface BlogCard {
  slug: string
  title: string
  description: string
  category: string
  readingTime: string
  date: string
}

const PER_PAGE = 6

const CATEGORY_COLORS: Record<string, string> = {
  alternatives: 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
  guides: 'bg-accent text-primary border-primary/20',
  templates: 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]',
  tips: 'bg-[#FFF9ED] text-[#E6A817] border-[#FDD87A]',
}

const EASE = [0.22, 1, 0.36, 1] as const

function formatDate(d: string) {
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function BlogList({ posts }: { posts: BlogCard[] }) {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(posts.length / PER_PAGE))
  const current = Math.min(page, totalPages)
  const start = (current - 1) * PER_PAGE
  const visible = posts.slice(start, start + PER_PAGE)

  if (posts.length === 0) {
    return <p className="text-center text-muted-foreground">No posts yet. Check back soon.</p>
  }

  return (
    <div>
      <motion.div
        key={current}
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        className="grid grid-cols-1 gap-6 md:grid-cols-3"
      >
        {visible.map((post) => (
          <motion.div
            key={post.slug}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
            }}
          >
            <Link
              href={`/blog/${post.slug}`}
              className="card-elevated-hover group flex h-full flex-col rounded-2xl border border-border bg-card p-6"
            >
              <div className="mb-4 flex items-center justify-between gap-2">
                <span
                  className={cn(
                    'rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize',
                    CATEGORY_COLORS[post.category] ?? 'bg-muted text-muted-foreground border-border'
                  )}
                >
                  {post.category}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock size={12} weight="bold" />
                  {post.readingTime}
                </span>
              </div>

              <h2 className="mb-2 text-base font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
                {post.title}
              </h2>
              <p className="mb-5 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                {post.description}
              </p>

              <div className="flex items-center justify-between border-t border-border pt-4">
                <span className="text-xs text-muted-foreground">{formatDate(post.date)}</span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  Read
                  <ArrowRight size={13} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={current === 1}
            aria-label="Previous page"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CaretLeft size={16} weight="bold" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              aria-label={`Page ${n}`}
              aria-current={n === current ? 'page' : undefined}
              className={cn(
                'inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors',
                n === current
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-card text-foreground hover:bg-muted'
              )}
            >
              {n}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={current === totalPages}
            aria-label="Next page"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CaretRight size={16} weight="bold" />
          </button>
        </div>
      )}
    </div>
  )
}
