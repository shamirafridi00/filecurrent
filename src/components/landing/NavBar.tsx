'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { APP_NAME } from '@/lib/constants'
import { cn } from '@/lib/utils'

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
      scrolled ? 'bg-white/95 backdrop-blur-sm border-b shadow-sm' : 'bg-transparent'
    )}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white text-xs font-bold">FC</span>
          </div>
          <span className="font-bold text-gray-900">{APP_NAME}</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <a href="/#pricing" className="hover:text-primary transition-colors">Pricing</a>
          <a href="/#faq" className="hover:text-primary transition-colors">FAQ</a>
          <Link href="/dashboard" className="hover:text-primary transition-colors">Login</Link>
          <Button asChild size="sm">
            <Link href="/dashboard">Start Free →</Link>
          </Button>
        </div>

        <button
          className="md:hidden p-1 text-gray-600"
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-3">
          <a href="/#pricing" className="block text-sm text-gray-600" onClick={() => setMobileOpen(false)}>Pricing</a>
          <a href="/#faq" className="block text-sm text-gray-600" onClick={() => setMobileOpen(false)}>FAQ</a>
          <Link href="/dashboard" className="block text-sm text-gray-600" onClick={() => setMobileOpen(false)}>Login</Link>
          <Button asChild size="sm" className="w-full">
            <Link href="/dashboard">Start Free →</Link>
          </Button>
        </div>
      )}
    </nav>
  )
}
