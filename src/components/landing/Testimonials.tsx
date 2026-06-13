'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Star } from '@phosphor-icons/react'
import { fadeUp, REVEAL_VIEWPORT } from '@/components/landing/_motion'

// PLACEHOLDER — invented personas, NOT real customers.
// Replace with genuine quotes before any public launch.
const QUOTES = [
  {
    quote:
      'I left HoneyBook the month they bumped my plan to $36. FileCurrent does everything I actually used, contracts, invoices, the chasing, for less, and it doesn’t skim my payments. I keep every dollar now.',
    name: 'Maya Ellison',
    role: 'Wedding Photographer',
    city: 'Austin, TX',
  },
  {
    quote:
      'Milestone billing changed how I quote. I take 50% up front, the invoice splits itself, and the reminders go out without me lifting a finger. Got paid for a $6k build two weeks faster than usual.',
    name: 'Devin Park',
    role: 'Freelance Web Developer',
    city: 'Portland, OR',
  },
  {
    quote:
      'I had about $4,000 in invoices I was too awkward to chase. FileCurrent just did it for me, politely, on a schedule. Three paid within a week. It’s paid for itself many times over.',
    name: 'Renata Cruz',
    role: 'Brand Consultant',
    city: 'Miami, FL',
  },
]

export function Testimonials() {
  const reduce = useReducedMotion()

  return (
    <section className="bg-white px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-3 text-center text-3xl font-bold tracking-[-0.02em] text-[#0A2540] md:text-4xl">
          Freelancers who stopped chasing.
        </h2>
        <p className="mb-12 text-center text-sm text-[#8898AA]">
          Trusted by thousands of freelancers across the US.
        </p>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {QUOTES.map((t, i) => (
            <motion.div
              key={t.name}
              className="flex flex-col rounded-xl border border-[#E6EBF1] bg-white p-6 shadow-sm"
              custom={i}
              variants={fadeUp}
              initial={reduce ? 'show' : 'hidden'}
              whileInView="show"
              viewport={REVEAL_VIEWPORT}
            >
              <div className="mb-3 flex gap-0.5" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} size={15} weight="fill" className="text-[#E6A817]" />
                ))}
              </div>
              <p className="flex-1 text-sm leading-relaxed text-[#425466]">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-5 border-t border-[#E6EBF1] pt-4">
                <p className="text-sm font-semibold text-[#0A2540]">{t.name}</p>
                <p className="text-xs text-[#8898AA]">
                  {t.role} · {t.city}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
