import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'FileCurrent Blog — Freelance Contracts, Invoices & Business Tips',
  description: 'Guides, templates, and tips for independent professionals.',
}

const CATEGORY_COLORS: Record<string, string> = {
  alternatives: 'bg-blue-900/50 text-blue-300 border-blue-700',
  guides: 'bg-teal-900/50 text-teal-300 border-teal-700',
  templates: 'bg-purple-900/50 text-purple-300 border-purple-700',
  tips: 'bg-amber-900/50 text-amber-300 border-amber-700',
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">The FileCurrent Blog</h1>
          <p className="text-gray-400">Guides, templates, and tips for independent professionals.</p>
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts yet. Check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-xl border border-[#1a2a28] bg-[#0d1614] p-6 hover:border-teal-700 transition-colors"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${CATEGORY_COLORS[post.category] ?? 'bg-gray-800 text-gray-300 border-gray-700'}`}>
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-600">{post.readingTime}</span>
                </div>
                <h2 className="font-semibold text-white text-sm leading-snug mb-2 group-hover:text-teal-300 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">{post.description}</p>
                <p className="text-teal-500 text-xs mt-4 font-medium">Read article →</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
