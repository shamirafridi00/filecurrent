'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { fadeUp, REVEAL_VIEWPORT } from '@/components/landing/_motion'

export function FinalCTA() {
  const reduce = useReducedMotion()

  return (
    <section className="bg-white px-4 py-20">
      <motion.div
        className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-[#635BFF]/20 bg-gradient-to-br from-[#F0EFFF] to-white px-8 py-16 text-center md:px-16"
        variants={fadeUp}
        initial={reduce ? 'show' : 'hidden'}
        whileInView="show"
        viewport={REVEAL_VIEWPORT}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#635BFF]/10 blur-3xl"
        />
        <h2 className="mx-auto max-w-xl text-3xl font-bold tracking-[-0.02em] text-[#0A2540] md:text-4xl">
          Send your next invoice from a tool that&apos;s on your side.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base text-[#425466]">
          Five days, full access, no card. Set up your first contract in ten minutes.
        </p>
        <Button
          asChild
          className="mt-8 h-auto rounded-lg bg-[#635BFF] px-8 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#5145E5]"
        >
          <Link href="/signup">Start free</Link>
        </Button>
      </motion.div>
    </section>
  )
}
