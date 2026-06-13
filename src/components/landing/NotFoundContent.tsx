'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  House,
  MagnifyingGlass,
  ArrowRight,
  FileText,
  Receipt,
  Users,
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { NavBar } from '@/components/landing/NavBar'
import { Footer } from '@/components/landing/LandingContent'

const EASE = [0.22, 1, 0.36, 1] as const

const SUGGESTIONS = [
  { icon: House, label: 'Home', href: '/' },
  { icon: Receipt, label: 'Pricing', href: '/#pricing' },
  { icon: FileText, label: 'Blog', href: '/blog' },
  { icon: Users, label: 'Contact', href: '/contact' },
]

export function NotFoundContent() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-foreground">
      <NavBar />

      <main className="hero-grid-bg flex flex-1 flex-col items-center justify-center px-4 pt-32 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative mb-8"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className="card-elevated flex h-24 w-24 items-center justify-center rounded-3xl border border-border bg-card"
          >
            <MagnifyingGlass size={42} className="text-primary" weight="duotone" />
          </motion.div>
          <span className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-sm">
            ?
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="mb-3 text-7xl font-bold tracking-[-0.04em] text-foreground md:text-8xl"
        >
          4<span className="gradient-text">0</span>4
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18, ease: EASE }}
          className="mb-2 text-2xl font-semibold tracking-tight text-foreground"
        >
          This page wandered off.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24, ease: EASE }}
          className="mb-8 max-w-md text-base text-muted-foreground"
        >
          The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get you back to
          something useful.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <Button asChild className="h-auto rounded-lg bg-primary px-6 py-2.5 text-base font-semibold text-white hover:bg-[#5145E5]">
            <Link href="/">
              <House className="mr-1.5 h-4 w-4" /> Back home
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto rounded-lg border-border bg-white px-6 py-2.5 text-base font-medium text-foreground hover:bg-muted">
            <Link href="/dashboard">
              Go to dashboard <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.42 }}
          className="mt-12 w-full max-w-md"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Popular destinations
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {SUGGESTIONS.map((s, i) => {
              const Icon = s.icon
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.07, ease: EASE }}
                >
                  <Link
                    href={s.href}
                    className="card-elevated-hover flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-sm font-medium text-foreground"
                  >
                    <Icon size={20} className="text-primary" weight="duotone" />
                    {s.label}
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
