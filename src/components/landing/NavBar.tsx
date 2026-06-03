'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { List, X } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { LogoFull } from '@/components/logo/LogoMark'

export function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav className={cn(
      'fixed inset-x-0 top-0 z-50 transition-all',
      scrolled ? 'bg-[#0A2540]/95 backdrop-blur-sm border-b border-[#1A3A5C]' : 'bg-transparent'
    )}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/">
          <LogoFull className="text-white" />
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
          <a href="/#features" className="hover:text-white transition-colors">Features</a>
          <a href="/#pricing" className="hover:text-white transition-colors">Pricing</a>
          <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
          <Link href="/help" className="hover:text-white transition-colors">Help</Link>
          <Link href="/login" className="hover:text-white transition-colors">Login</Link>
          <Button asChild size="sm" className="bg-[#635BFF] hover:bg-[#635BFF] text-white">
            <Link href="/signup">Start Free →</Link>
          </Button>
        </div>

        <button
          className="md:hidden p-1 text-gray-400"
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X size={20} /> : <List size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-[#1A3A5C] bg-[#0A2540] px-4 py-4 space-y-3">
          <a href="/#features" className="block text-sm text-gray-400" onClick={() => setMobileOpen(false)}>Features</a>
          <a href="/#pricing" className="block text-sm text-gray-400" onClick={() => setMobileOpen(false)}>Pricing</a>
          <Link href="/blog" className="block text-sm text-gray-400" onClick={() => setMobileOpen(false)}>Blog</Link>
          <Link href="/help" className="block text-sm text-gray-400" onClick={() => setMobileOpen(false)}>Help</Link>
          <Link href="/login" className="block text-sm text-gray-400" onClick={() => setMobileOpen(false)}>Login</Link>
          <Button asChild size="sm" className="w-full bg-[#635BFF] hover:bg-[#635BFF] text-white">
            <Link href="/signup">Start Free →</Link>
          </Button>
        </div>
      )}
    </nav>
  )
}
