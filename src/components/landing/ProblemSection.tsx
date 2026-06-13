'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { fadeUp, REVEAL_VIEWPORT } from '@/components/landing/_motion'

export function ProblemSection() {
  const reduce = useReducedMotion()

  return (
    <section className="bg-[#F6F9FC] px-4 py-20">
      <motion.div
        className="mx-auto max-w-3xl text-center"
        variants={fadeUp}
        initial={reduce ? 'show' : 'hidden'}
        whileInView="show"
        viewport={REVEAL_VIEWPORT}
      >
        <h2 className="text-3xl font-bold tracking-[-0.02em] text-[#0A2540] md:text-4xl">
          You didn&apos;t go freelance to become an unpaid accounts department.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-[#425466]">
          Your contracts live in Google Docs. Your signatures need a separate $25 tool. Your
          invoices sit in Wave, and the follow-ups? You keep forgetting to send them. The
          &ldquo;all-in-one&rdquo; platforms that promise to fix it want $36 a month, and then
          take a slice of every payment your clients make. There&apos;s a better trade.
        </p>
      </motion.div>
    </section>
  )
}
