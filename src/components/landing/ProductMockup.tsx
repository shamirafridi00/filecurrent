'use client'

import { motion, useReducedMotion } from 'framer-motion'
import {
  FileText,
  Receipt,
  CheckCircle,
  PaperPlaneTilt,
  CurrencyDollar,
} from '@phosphor-icons/react'

/* A faux FileCurrent invoice/dashboard window that animates on scroll —
   so visitors literally see the product working. Built to mirror the real
   app's light Stripe-style surface (white cards, #635BFF, navy text). */

const EASE = [0.22, 1, 0.36, 1] as const

const rows = [
  { name: 'Website redesign — Acme Co.', amount: '$4,200', status: 'Paid', tone: 'paid' },
  { name: 'Brand photography — Lumen', amount: '$1,850', status: 'Sent', tone: 'sent' },
  { name: 'Consulting retainer — Vela', amount: '$3,000', status: 'Overdue', tone: 'overdue' },
]

const toneClass: Record<string, string> = {
  paid: 'bg-[#F0FBF4] text-[#1DB954] border-[#A3E6C0]',
  sent: 'bg-[#EEF2FF] text-[#4F6AE6] border-[#C7D2FE]',
  overdue: 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
}

export function ProductMockup() {
  const reduce = useReducedMotion()

  return (
    <div className="relative mx-auto w-full max-w-4xl">
      {/* Glow behind the window */}
      <div
        aria-hidden
        className="absolute -inset-x-12 -top-10 bottom-0 -z-10 rounded-[40px] bg-gradient-to-b from-[#635BFF]/20 via-[#635BFF]/5 to-transparent blur-2xl"
      />

      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40, rotateX: 8 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: EASE }}
        style={{ transformPerspective: 1200 }}
        className="card-elevated overflow-hidden rounded-2xl border border-border bg-white"
      >
        {/* Window chrome */}
        <div className="flex items-center gap-2 border-b border-border bg-[#F6F9FC] px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
          <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
          <span className="h-3 w-3 rounded-full bg-[#28C840]" />
          <div className="ml-3 flex items-center gap-1.5 rounded-md bg-white px-3 py-1 text-xs text-muted-foreground ring-1 ring-border">
            <span className="text-[#1DB954]">●</span> app.filecurrent.com/invoices
          </div>
        </div>

        <div className="grid grid-cols-1 gap-0 sm:grid-cols-[180px_1fr]">
          {/* Mini sidebar */}
          <div className="hidden flex-col gap-1 border-r border-border bg-white p-3 sm:flex">
            {[
              { icon: <Receipt size={15} weight="fill" />, label: 'Invoices', active: true },
              { icon: <FileText size={15} />, label: 'Contracts' },
              { icon: <CurrencyDollar size={15} />, label: 'Payments' },
            ].map((it) => (
              <div
                key={it.label}
                className={`flex items-center gap-2 rounded-md px-2.5 py-2 text-xs font-medium ${
                  it.active ? 'bg-accent text-primary' : 'text-muted-foreground'
                }`}
              >
                {it.icon}
                {it.label}
              </div>
            ))}
            <div className="mt-3 rounded-lg border border-border bg-[#F6F9FC] p-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Outstanding
              </p>
              <p className="mt-0.5 text-base font-bold text-foreground">$4,850</p>
            </div>
          </div>

          {/* Main panel */}
          <div className="p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-foreground">Invoices</p>
                <p className="text-xs text-muted-foreground">3 active this month</p>
              </div>
              <motion.div
                initial={reduce ? {} : { scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.4, ease: EASE }}
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white"
              >
                <PaperPlaneTilt size={13} weight="fill" /> New invoice
              </motion.div>
            </div>

            <div className="space-y-2">
              {rows.map((r, i) => (
                <motion.div
                  key={r.name}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.18, duration: 0.45, ease: EASE }}
                  className="flex items-center justify-between rounded-lg border border-border bg-white px-3 py-2.5"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent text-primary">
                      <Receipt size={14} weight="fill" />
                    </span>
                    <span className="truncate text-xs font-medium text-foreground">{r.name}</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-xs font-semibold text-foreground">{r.amount}</span>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${toneClass[r.tone]}`}
                    >
                      {r.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* "Paid" toast */}
            <motion.div
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.4, duration: 0.5, ease: EASE }}
              className="mt-4 flex items-center gap-2.5 rounded-lg border border-[#A3E6C0] bg-[#F0FBF4] px-3 py-2.5"
            >
              <span className="live-dot text-[#1DB954]">
                <CheckCircle size={18} weight="fill" />
              </span>
              <p className="text-xs font-medium text-[#0A2540]">
                Acme Co. just paid <span className="font-bold">$4,200</span> — reminder auto-stopped.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Floating stat chips */}
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20, x: -10 }}
        whileInView={{ opacity: 1, y: 0, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.9, duration: 0.6, ease: EASE }}
        className="card-elevated absolute -left-4 top-20 hidden items-center gap-2 rounded-xl border border-border bg-white px-3.5 py-2.5 lg:flex"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F0FBF4] text-[#1DB954]">
          <CheckCircle size={18} weight="fill" />
        </span>
        <div>
          <p className="text-[10px] text-muted-foreground">Contract signed</p>
          <p className="text-xs font-bold text-foreground">in 47 seconds</p>
        </div>
      </motion.div>

      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20, x: 10 }}
        whileInView={{ opacity: 1, y: 0, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 1.1, duration: 0.6, ease: EASE }}
        className="card-elevated absolute -right-4 bottom-16 hidden items-center gap-2 rounded-xl border border-border bg-white px-3.5 py-2.5 lg:flex"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-primary">
          <CurrencyDollar size={18} weight="fill" />
        </span>
        <div>
          <p className="text-[10px] text-muted-foreground">Paid faster</p>
          <p className="text-xs font-bold text-foreground">11 days sooner</p>
        </div>
      </motion.div>
    </div>
  )
}
