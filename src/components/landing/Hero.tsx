'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { CheckCircle, Lightning } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { heroRise } from '@/components/landing/_motion'

// Status pill cycles to show the invoice lifecycle, the core FileCurrent loop.
const STATUSES = [
  { label: 'Sent', cls: 'bg-[#F0EFFF] text-[#635BFF] border-[#635BFF]/30' },
  { label: 'Opened', cls: 'bg-[#FFF9ED] text-[#E6A817] border-[#E6A817]/30' },
  { label: 'Paid', cls: 'bg-[#F0FBF4] text-[#1DB954] border-[#1DB954]/30' },
] as const

const LINE_ITEMS = [
  { label: 'Brand identity system', amount: '$2,400' },
  { label: 'Landing page design', amount: '$1,800' },
  { label: 'Revisions (2 rounds)', amount: '$800' },
]

export function Hero() {
  const reduce = useReducedMotion()
  const [statusIdx, setStatusIdx] = useState(0)

  useEffect(() => {
    if (reduce) {
      setStatusIdx(2) // show the satisfying end state, no motion
      return
    }
    const id = setInterval(() => setStatusIdx((i) => (i + 1) % STATUSES.length), 1800)
    return () => clearInterval(id)
  }, [reduce])

  const status = STATUSES[statusIdx]

  return (
    <section className="relative overflow-hidden bg-[#F6F9FC] px-4 pt-32 pb-20">
      {/* Soft violet glow blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#635BFF]/15 blur-3xl" />
        <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-[#635BFF]/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(#0A2540 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        {/* Text column */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.12 } } }}
        >
          <motion.div variants={heroRise}>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#635BFF]/20 bg-[#F0EFFF] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#635BFF]">
              <Lightning size={13} weight="fill" />
              For freelancers done chasing payments
            </span>
          </motion.div>

          <motion.h1
            variants={heroRise}
            className="mt-6 text-5xl font-bold leading-[1.05] tracking-[-0.03em] text-[#0A2540] md:text-6xl"
          >
            Get paid for the work you already did.
          </motion.h1>

          <motion.p variants={heroRise} className="mt-6 max-w-xl text-lg leading-relaxed text-[#425466]">
            FileCurrent runs your whole client trail, from proposals and signed contracts to
            invoices and automatic reminders, then gets out of the way of the money. No payment
            cut. No per-seat fees. Just $15 a month.
          </motion.p>

          <motion.div variants={heroRise} className="mt-8 flex flex-col items-start gap-3">
            <Button
              asChild
              className="h-auto rounded-lg bg-[#635BFF] px-7 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#5145E5]"
            >
              <Link href="/signup">Start free for 5 days</Link>
            </Button>
            <p className="text-sm text-[#8898AA]">No card required · Full access · Cancel anytime</p>
            <a
              href="#compare"
              className="text-sm font-medium text-[#635BFF] transition-colors hover:text-[#5145E5]"
            >
              See how it compares ↓
            </a>
          </motion.div>
        </motion.div>

        {/* Coded product graphic */}
        <motion.div
          initial={reduce ? 'show' : 'hidden'}
          animate="show"
          variants={heroRise}
          className="relative mx-auto w-full max-w-md"
        >
          {/* Floating "reminder sent" chip */}
          <div className="absolute -left-3 top-8 z-10 hidden items-center gap-1.5 rounded-xl border border-[#E6EBF1] bg-white px-3 py-2 shadow-lg sm:flex">
            <CheckCircle size={16} weight="fill" className="text-[#1DB954]" />
            <span className="text-xs font-medium text-[#0A2540]">Reminder sent</span>
          </div>

          {/* Invoice card */}
          <div className="rotate-[-3deg] rounded-2xl border border-[#E6EBF1] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#8898AA]">Invoice</p>
                <p className="text-sm font-bold text-[#0A2540]">Studio Vela · INV-2026-0042</p>
              </div>
              <motion.span
                key={status.label}
                initial={reduce ? false : { opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${status.cls}`}
              >
                {status.label}
              </motion.span>
            </div>

            <div className="mt-5 space-y-2.5">
              {LINE_ITEMS.map((it) => (
                <div key={it.label} className="flex items-center justify-between text-sm">
                  <span className="text-[#425466]">{it.label}</span>
                  <span className="font-medium text-[#0A2540]">{it.amount}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-[#E6EBF1] pt-4">
              <span className="text-sm font-semibold text-[#0A2540]">Total</span>
              <span className="text-xl font-bold text-[#0A2540]">$5,000</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
