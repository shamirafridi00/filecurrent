'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { List, X } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { LogoFull } from '@/components/logo/LogoMark'

// Each link is either a section anchor (hash, on the home page) or a route.
type NavLink = { label: string; hash?: string; href?: string }
const LINKS: NavLink[] = [
  { label: 'Features', hash: 'features' },
  { label: 'How it works', hash: 'how' },
  { label: 'Pricing', hash: 'pricing' },
  { label: 'FAQ', hash: 'faq' },
  { label: 'Blog', href: '/blog' },
]

export function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8)
    handler()
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Scroll to a section reliably. On the home page, scroll directly (works even
  // while the mobile menu is closing). Elsewhere, navigate to /#hash.
  const goToSection = (hash?: string) => {
    if (!hash) return
    setMobileOpen(false)
    if (pathname === '/') {
      // Wait a frame so the closing menu doesn't fight the scroll on mobile.
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    } else {
      router.push(`/#${hash}`)
    }
  }

  return (
    <motion.nav
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-border bg-white/80 backdrop-blur-md shadow-[0_1px_0_rgba(10,37,64,0.04)]'
          : 'border-b border-transparent bg-transparent'
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <LogoFull size={30} />
        </Link>

        <div className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
          {LINKS.map((l) =>
            l.hash ? (
              <button
                key={l.label}
                onClick={() => goToSection(l.hash)}
                className="relative transition-colors hover:text-foreground"
              >
                {l.label}
              </button>
            ) : (
              <Link key={l.label} href={l.href ?? '#'} className="transition-colors hover:text-foreground">
                {l.label}
              </Link>
            )
          )}
          <Link href="/login" className="transition-colors hover:text-foreground">
            Login
          </Link>
          <Button asChild size="sm" className="bg-primary text-white shadow-sm hover:bg-[#5145E5]">
            <Link href="/signup">Start free →</Link>
          </Button>
        </div>

        <button
          className="rounded-md p-1.5 text-foreground transition-colors hover:bg-muted md:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <List size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-border bg-white md:hidden"
          >
            <div className="space-y-1 px-4 py-4">
              {LINKS.map((l) =>
                l.hash ? (
                  <button
                    key={l.label}
                    onClick={() => goToSection(l.hash)}
                    className="block w-full rounded-md px-3 py-2 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {l.label}
                  </button>
                ) : (
                  <Link
                    key={l.label}
                    href={l.href ?? '#'}
                    className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    onClick={() => setMobileOpen(false)}
                  >
                    {l.label}
                  </Link>
                )
              )}
              <Link
                href="/login"
                className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Link>
              <Button asChild size="sm" className="mt-2 w-full bg-primary text-white hover:bg-[#5145E5]">
                <Link href="/signup">Start free →</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
