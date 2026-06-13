'use client'

import { motion, useReducedMotion } from 'framer-motion'
import {
  FileText,
  ChartPieSlice,
  BellRinging,
  Link as LinkIcon,
  Receipt,
  Eye,
  Clock,
  ClipboardText,
} from '@phosphor-icons/react'
import { fadeUp, REVEAL_VIEWPORT } from '@/components/landing/_motion'
import { cn } from '@/lib/utils'

// span: extra grid classes for the asymmetric bento. tinted: violet-light fill.
const TILES = [
  {
    icon: FileText,
    title: 'Never write the same contract twice',
    desc: '7 profession-specific, lawyer-style templates: photographer, web dev, designer, consultant, copywriter, marketer, general.',
    span: 'lg:col-span-2',
    tinted: true,
  },
  {
    icon: ChartPieSlice,
    title: 'Split the bill the way you actually work',
    desc: 'Milestone billing with 50/50 and 30/30/40 presets, deposits due up front.',
    span: '',
    tinted: false,
  },
  {
    icon: BellRinging,
    title: 'Reminders that don’t quit (or count)',
    desc: 'Escalating follow-ups on your schedule, no daily cap, auto-stop the second they pay.',
    span: '',
    tinted: false,
  },
  {
    icon: LinkIcon,
    title: 'One link, everything they need',
    desc: 'A branded client portal with every invoice, contract, and proposal, plus their balance.',
    span: 'lg:col-span-2',
    tinted: true,
  },
  {
    icon: Receipt,
    title: 'Get the receipts, literally',
    desc: 'Clients report payment and upload proof, you confirm, both sides update instantly.',
    span: '',
    tinted: false,
  },
  {
    icon: Eye,
    title: 'Know the second it’s opened',
    desc: 'See when a contract or invoice is opened, and get notified.',
    span: '',
    tinted: false,
  },
  {
    icon: Clock,
    title: 'Stop leaving money on the table',
    desc: 'Track billable hours and expenses, then drop them straight into an invoice.',
    span: '',
    tinted: false,
  },
  {
    icon: ClipboardText,
    title: 'Turn a form into a client',
    desc: 'Intake forms that auto-create the client and start the trail.',
    span: '',
    tinted: false,
  },
]

export function FeatureBento() {
  const reduce = useReducedMotion()

  return (
    <section id="features" className="bg-white px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-14 text-center text-3xl font-bold tracking-[-0.02em] text-[#0A2540] md:text-4xl">
          Everything from hello to paid, nothing you&apos;ll never use.
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TILES.map((tile, i) => {
            const Icon = tile.icon
            return (
              <motion.div
                key={tile.title}
                className={cn(
                  'flex flex-col rounded-2xl border p-6',
                  tile.span,
                  tile.tinted
                    ? 'border-[#635BFF]/20 bg-gradient-to-br from-[#F0EFFF] to-white'
                    : 'border-[#E6EBF1] bg-white'
                )}
                custom={i}
                variants={fadeUp}
                initial={reduce ? 'show' : 'hidden'}
                whileInView="show"
                viewport={REVEAL_VIEWPORT}
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#F0EFFF]">
                  <Icon size={22} weight="duotone" className="text-[#635BFF]" />
                </div>
                <h3 className="mb-1.5 text-base font-semibold tracking-tight text-[#0A2540]">
                  {tile.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#425466]">{tile.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
